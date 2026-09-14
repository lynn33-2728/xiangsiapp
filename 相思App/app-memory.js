/* Long-memory, retrieval, knowledge extraction, and chat request pipeline.
   Loaded before app.js; function bodies resolve shared app globals at call time. */

function memoryApiById(id) {
  return apiLinks.find((api) => api.id === id && api.enabled !== false) || null;
}

/* 记忆向量化与重排的平台 → 默认模型映射。平台下拉里只能选这里预设的，
   选"custom"时留空字符串——调用方需要自己保证 endpoint/模型可工作。 */
const MEMORY_PLATFORM_DEFAULT_MODELS = {
  embedding: {
    siliconflow: 'BAAI/bge-m3',
    openai: 'text-embedding-3-small',
    volcengine: 'doubao-embedding-text-240715',
    qwen: 'text-embedding-v3',
    custom: '',
  },
  rerank: {
    siliconflow: 'BAAI/bge-reranker-v2-m3',
    openai: '',
    volcengine: '',
    qwen: 'gte-rerank',
    custom: '',
  },
};
const MEMORY_PLATFORM_ENDPOINT_PRESETS = {
  embedding: {
    siliconflow: 'https://api.siliconflow.cn/v1/embeddings',
    openai: 'https://api.openai.com/v1/embeddings',
    volcengine: 'https://ark.cn-beijing.volces.com/api/v3/embeddings/multimodal',
    qwen: 'https://dashscope.aliyuncs.com/compatible-mode/v1/embeddings',
  },
  rerank: {
    siliconflow: 'https://api.siliconflow.cn/v1/rerank',
    openai: 'https://api.openai.com/v1/rerank',
    volcengine: 'https://ark.cn-beijing.volces.com/api/v3/rerank',
    qwen: 'https://dashscope.aliyuncs.com/api/v1/services/rerank/text-rerank/text-rerank',
  },
};
function memoryPlatformDefaultModel(platform, type) {
  return MEMORY_PLATFORM_DEFAULT_MODELS[type]?.[platform] || '';
}
function memoryPlatformDefaultEndpoint(platform, type) {
  return MEMORY_PLATFORM_ENDPOINT_PRESETS[type]?.[platform] || '';
}
/* 用户在 UI 里手动填写的 model 优先；空时回退到平台 helper。统一这一行为，
   避免"长记忆"页里多处的 `document.embeddingModel === model` 比较跟实际 API 调用对不上。 */
function effectiveMemoryModel(type) {
  const userModel = type === 'embedding'
    ? String(memorySettings.embeddingModel || '').trim()
    : String(memorySettings.rerankModel || '').trim();
  const platform = type === 'embedding' ? memorySettings.embeddingPlatform : memorySettings.rerankPlatform;
  return userModel || memoryPlatformDefaultModel(platform, type);
}

function normalizeMemoryApiBase(url = '') {
  return String(url).trim().replace(/\/+$/, '');
}

function memoryApiEndpoint(url, path) {
  const cleanUrl = normalizeMemoryApiBase(url);
  if (path === 'embeddings' && /\/embeddings(?:\/multimodal)?$/i.test(cleanUrl)) return cleanUrl;
  if (path === 'rerank' && /\/(?:rerank|reranks|text-rerank)(?:\/text-rerank)?$/i.test(cleanUrl)) return cleanUrl;
  return `${cleanUrl}/${path}`;
}

async function requestMemoryApi(path, api, payload) {
  if (!api?.url || !api?.key) throw new Error('请先选择已配置的 API 连接');
  const apiUrl = memoryApiEndpoint(api.url, path);
  let response;
  if (isLocalPreview()) {
    response = await fetch(`/api/memory-${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiUrl, apiKey: api.key, ...payload }),
      });
  } else if (isNativeApp()) {
    response = await nativeHttpFetchResponse(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${api.key}` },
        body: JSON.stringify(payload),
      }, 60000);
  } else {
    response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${api.key}` },
        body: JSON.stringify(payload),
      });
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message || data?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }
  return data;
}

function embeddingVectorFromItem(item) {
  const value = item?.embedding || item?.vector || item?.values;
  return Array.isArray(value) ? value.map(Number).filter(Number.isFinite) : [];
}

async function createMemoryEmbeddings(texts) {
  const endpoint = String(memorySettings.embeddingEndpoint || '').trim();
  const apiKey = String(memorySettings.embeddingApiKey || '').trim();
  const model = String(memorySettings.embeddingModel || '').trim() || memoryPlatformDefaultModel(memorySettings.embeddingPlatform, 'embedding');
  if (!endpoint) throw new Error('请填写向量 API 接口地址');
  if (!apiKey) throw new Error('请填写向量 API 密钥');
  if (!model) throw new Error('当前平台未配置 embedding 模型，请在长记忆设置里选择平台或手动填写模型');
  const data = await requestMemoryApi('embeddings', { url: endpoint, key: apiKey }, { model, input: texts });
  const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data?.embeddings) ? data.embeddings : [];
  const vectors = rows.map(embeddingVectorFromItem);
  if (vectors.length !== texts.length || vectors.some((vector) => !vector.length)) {
    throw new Error('向量 API 返回的数量或格式不正确');
  }
  return vectors;
}

function cosineSimilarity(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length || !left.length) return -1;
  let dot = 0;
  let leftLength = 0;
  let rightLength = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftLength += left[index] * left[index];
    rightLength += right[index] * right[index];
  }
  return leftLength && rightLength ? dot / (Math.sqrt(leftLength) * Math.sqrt(rightLength)) : -1;
}

function vectorSearchMemory(queryVector, documents, limit = 5) {
  const currentModel = effectiveMemoryModel('embedding');
  return (documents || [])
    .filter((document) => Array.isArray(document.embedding) && document.embedding.length && document.embeddingModel === currentModel)
    .map((document) => ({ ...document, vectorScore: cosineSimilarity(queryVector, document.embedding) }))
    .filter((document) => document.vectorScore > -1)
    .sort((left, right) => right.vectorScore - left.vectorScore)
    .slice(0, Math.max(1, Number(limit) || 5));
}

function hybridMemoryResults(bm25Hits, vectorHits, limit) {
  const scores = new Map();
  const documents = new Map();
  const vectorWeight = Math.max(0, Math.min(1, Number(memorySettings.vectorWeight) || 0));
  const bm25Weight = memorySettings.bm25 ? 1 - vectorWeight : 0;
  const rankConstant = 60;
  bm25Hits.forEach((document, index) => {
    documents.set(document.id, document);
    scores.set(document.id, (scores.get(document.id) || 0) + (bm25Weight / (rankConstant + index + 1)));
  });
  vectorHits.forEach((document, index) => {
    documents.set(document.id, { ...(documents.get(document.id) || {}), ...document });
    scores.set(document.id, (scores.get(document.id) || 0) + (vectorWeight / (rankConstant + index + 1)));
  });
  return [...scores.entries()]
    .map(([id, hybridScore]) => ({ ...documents.get(id), hybridScore, score: hybridScore }))
    .sort((left, right) => right.hybridScore - left.hybridScore)
    .slice(0, Math.max(1, Number(limit) || 5));
}

async function rerankMemoryResults(query, documents, limit) {
  if (!memorySettings.rerank || !documents.length) return documents.slice(0, limit);
  const endpoint = String(memorySettings.rerankEndpoint || '').trim();
  const apiKey = String(memorySettings.rerankApiKey || '').trim();
  const model = String(memorySettings.rerankModel || '').trim() || memoryPlatformDefaultModel(memorySettings.rerankPlatform, 'rerank');
  if (!endpoint) throw new Error('请填写重排 API 接口地址');
  if (!apiKey) throw new Error('请填写重排 API 密钥');
  if (!model) throw new Error('当前平台未配置 rerank 模型，请在长记忆设置里选择平台或手动填写模型');
  const data = await requestMemoryApi('rerank', { url: endpoint, key: apiKey }, {
    model,
    query,
    documents: documents.map((document) => document.text),
    top_n: Math.max(1, Number(limit) || 5),
    return_documents: false,
  });
  const rows = Array.isArray(data?.results) ? data.results : Array.isArray(data?.data) ? data.data : [];
  if (!rows.length) throw new Error('重排 API 没有返回排名');
  return rows.map((row) => {
    const index = Number(row.index ?? row.document_index ?? row.documentIndex);
    const document = documents[index];
    return document ? { ...document, rerankScore: Number(row.relevance_score ?? row.score ?? 0), score: Number(row.relevance_score ?? row.score ?? 0) } : null;
  }).filter(Boolean).slice(0, limit);
}

async function buildMemoryVectorIndex({ force = false, onProgress = null } = {}) {
  const model = String(memorySettings.embeddingModel || '').trim() || memoryPlatformDefaultModel(memorySettings.embeddingPlatform, 'embedding');
  if (!memorySettings.embeddingEndpoint || !memorySettings.embeddingApiKey) throw new Error('请先填写向量 API 接口地址和密钥');
  if (!model) throw new Error('当前平台未配置 embedding 模型');
  const targets = memoryDocuments.filter((document) => force || !Array.isArray(document.embedding) || !document.embedding.length || document.embeddingModel !== model);
  if (!targets.length) return { indexed: 0, total: memoryDocuments.length };
  const batchSize = 16;
  for (let offset = 0; offset < targets.length; offset += batchSize) {
    const batch = targets.slice(offset, offset + batchSize);
    const vectors = await createMemoryEmbeddings(batch.map((document) => document.text));
    const now = new Date().toISOString();
    batch.forEach((document, index) => {
      document.embedding = vectors[index];
      document.embeddingModel = model;
      document.embeddedAt = now;
    });
    await storeMemoryDocuments(batch);
    onProgress?.(Math.min(offset + batch.length, targets.length), targets.length);
  }
  return { indexed: targets.length, total: memoryDocuments.length };
}

async function retrieveMemoryDocuments(query, documents, limit = memorySettings.maxRetrieved) {
  const candidateLimit = Math.max(Number(limit) || 5, Number(memorySettings.candidateLimit) || 20);
  const bm25Hits = memorySettings.bm25 ? bm25SearchMemory(query, documents, candidateLimit) : [];
  let vectorHits = [];
  let vectorError = '';
  if (memorySettings.vector) {
    try {
      const [queryVector] = await createMemoryEmbeddings([query]);
      vectorHits = vectorSearchMemory(queryVector, documents, candidateLimit);
    } catch (error) {
      vectorError = error?.message || '向量检索失败';
      logRuntime('warn', 'memory', '向量检索失败，已回退 BM25', { error: vectorError });
    }
  }
  let combined = memorySettings.vector
    ? hybridMemoryResults(bm25Hits, vectorHits, candidateLimit)
    : bm25Hits;
  let rerankError = '';
  if (memorySettings.rerank && combined.length) {
    try {
      combined = await rerankMemoryResults(query, combined, limit);
    } catch (error) {
      rerankError = error?.message || '重排失败';
      logRuntime('warn', 'memory', '重排失败，已使用混合排名', { error: rerankError });
    }
  }
  return { hits: combined.slice(0, limit), vectorError, rerankError, bm25Count: bm25Hits.length, vectorCount: vectorHits.length };
}

// 只读的本地验证入口，不暴露用户的真实记忆资料。
window.XiangsiMemoryDebug = Object.freeze({
  search: (query, documents, limit) => bm25SearchMemory(query, documents, limit),
  chunk: (text, size, overlap) => chunkMemoryText(text, size, overlap),
  relationType: (value) => canonicalKnowledgeRelation(value),
  stableRelation: (value) => isStableKnowledgeRelation(value),
  characterCatalog: (value) => normalizeCharacterCatalog(value),
  normalize: (value) => normalizeChatMemory(value),
  format: (value) => formatChatMemory(normalizeChatMemory(value)),
  summaryContext: (value) => memorySummaryUpdateContext(normalizeChatMemory(value)),
  mergeRelations: (previous, updates) => mergeRelationshipCards(previous, updates),
  knowledgeHtml: (group) => knowledgeGraphEditorHtml(group),
  performanceQuery: (userText, historyMessages, context) => buildPerformanceRetrievalQuery(userText, historyMessages, context),
  applySummary: (memory, result) => {
    const normalized = normalizeChatMemory(memory);
    applyMemorySummaryResult(normalized, normalizeMemorySummaryResult(result));
    return normalized;
  },
});

function formatChatMemory(memory) {
  const anchors = memory.anchors || defaultMemoryAnchors();
  const anchorText = [anchors.currentTime?.sendEnabled && anchors.currentTime.value ? `当前时间：${anchors.currentTime.value}` : '', anchors.currentLocation?.sendEnabled && anchors.currentLocation.value ? `当前地点：${anchors.currentLocation.value}` : ''].filter(Boolean).join('；');
  const openPlotText = memory.sectionControls?.openPlots?.sendEnabled === false ? '' : normalizeOpenPlots(memory.openPlots).slice(-30).map((row) => `- [${row.id}] ${row.title}${row.status ? `（${row.status}）` : ''}${row.people ? `；相关人物：${row.people}` : ''}${row.details ? `；${row.details}` : ''}`).join('\n');
  const customText = normalizeCustomStates(memory.customStates).filter((item) => item.sendEnabled && item.value).map((item) => `- ${item.name}：${formatCustomStateValue(item)}`).join('\n');
  const sections = [
    ['当前时间与地点', anchorText],
    ['未完剧情', openPlotText],
    ['自定义状态', customText],
  ].filter(([, content]) => String(content || '').trim());
  return sections.length ? `【当前聊天状态】\n${sections.map(([label, content]) => `【${label}】\n${content}`).join('\n\n')}` : '';
}

function formatMemorySummaryRecord(result) {
  const plot = String(result?.plotSummary || '').trim();
  return plot ? `【剧情纪要】\n${plot}` : '';
}

function summaryNarrativeOnly(text) {
  const source = String(text || '').trim();
  const match = source.match(/【(?:剧情纪要|剧情摘要|剧情总结)】\s*([\s\S]*?)(?=\n\s*【|$)/);
  return match ? `【剧情纪要】\n${match[1].trim()}` : source;
}

function memoryRetrievalLabel() {
  const parts = [];
  if (memorySettings.bm25) parts.push('BM25');
  if (memorySettings.vector) parts.push('向量');
  if (memorySettings.rerank) parts.push('重排');
  return parts.join(' + ') || '只保存';
}

function buildChatCharacterSections(memory, query, limit = 8) {
  const entries = normalizeCharacterCatalog(memory.chatCharacters).filter((character) => !character.hidden).map((character, index) => ({
    id: `chat-character-${index}`,
    text: [character.name, ...(character.aliases || []), character.identity, character.traits, character.speechStyle].filter(Boolean).join(' '),
    character,
  }));
  const hits = bm25SearchMemory(query, entries, Math.max(1, Number(limit) || 8));
  if (!hits.length) return [];
  const lines = hits.map(({ character }) => `- ${character.name}${character.aliases?.length ? `（别名：${character.aliases.join('、')}）` : ''}；当前身份：${character.identity || '未注明'}；稳定特征：${character.traits || '未注明'}；说话风格：${character.speechStyle || '未注明'}`).join('\n');
  return [`【本聊天相关人物档案 · Top ${hits.length}】\n${lines}`];
}

function buildChatRelationSections(memory, query, limit = 24) {
  if (memory.sectionControls?.relationships?.sendEnabled === false) return [];
  const entries = normalizeRelationshipCards(memory.relationshipCards?.length ? memory.relationshipCards : memory.chatRelationTriples).map((card, index) => ({
    id: `chat-relation-${index}`,
    text: `${card.source} ${card.currentRelation} ${card.target} ${(card.tags || []).join(' ')} ${card.evidence || ''}`,
    card,
  }));
  const hits = bm25SearchMemory(query, entries, Math.max(1, Number(limit) || 24));
  if (!hits.length) return [];
  const lines = hits.map(({ card }) => `- ${card.source} ↔ ${card.target}：${card.currentRelation}${card.tags?.length ? `【${card.tags.join('、')}】` : ''}${card.evidence ? `；证据：${card.evidence}` : ''}`).join('\n');
  return [`【本聊天人物当前关系 · Top ${hits.length}】\n${lines}`];
}

function recordMemoryRetrievalLog(memory, data = {}) {
  const entry = {
    id: `retrieval-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    query: String(data.query || '').slice(-800),
    currentStateIncluded: data.currentStateIncluded === true,
    currentState: String(data.currentState || '').slice(0, 4000),
    chatCharacters: Array.isArray(data.chatCharacters) ? data.chatCharacters : [],
    chatRelations: Array.isArray(data.chatRelations) ? data.chatRelations : [],
    knowledgeCharacters: Array.isArray(data.knowledgeCharacters) ? data.knowledgeCharacters : [],
    knowledgeRelations: Array.isArray(data.knowledgeRelations) ? data.knowledgeRelations : [],
    roleProfiles: Array.isArray(data.roleProfiles) ? data.roleProfiles : [],
    performanceQuery: String(data.performanceQuery || '').slice(-1600),
    performanceCards: Array.isArray(data.performanceCards) ? data.performanceCards : [],
    ragCorpusHits: Array.isArray(data.ragCorpusHits) ? data.ragCorpusHits : [],
    plotSummaries: Array.isArray(data.plotSummaries) ? data.plotSummaries : [],
    canonFacts: Array.isArray(data.canonFacts) ? data.canonFacts : [],
    retrievalProcess: data.retrievalProcess && typeof data.retrievalProcess === 'object' ? data.retrievalProcess : {},
    finalContent: String(data.finalContent || ''),
    documents: Array.isArray(data.documents) ? data.documents : [],
  };
  memory.retrievalLogs = [...(Array.isArray(memory.retrievalLogs) ? memory.retrievalLogs : []), entry].slice(-30);
  saveChatHistoriesToCache();
  return entry;
}

function ragCorpusTargetTerms(targets = []) {
  return [...new Set((Array.isArray(targets) ? targets : []).filter((target) => target?.enabled !== false).flatMap((target) => [target?.primaryName, ...(Array.isArray(target?.aliases) ? target.aliases : [])]).map((name) => String(name || '').trim()).filter(Boolean))];
}

function classifyRagCorpusEntry(document, targets = []) {
  const terms = ragCorpusTargetTerms(targets);
  const people = Array.isArray(document?.corpusMeta?.people)
    ? document.corpusMeta.people.map((name) => String(name || '').trim()).filter(Boolean)
    : String(document?.corpusMeta?.people || '').split(/[、,，;；|/\n]+/).map((name) => name.trim()).filter(Boolean);
  const text = String(document?.text || '');
  const personMatches = terms.some((term) => people.some((person) => person === term || person.includes(term)));
  const textMatches = terms.some((term) => text.includes(term));
  return { performance: personMatches, facts: personMatches || textMatches, matchedTerms: terms.filter((term) => people.some((person) => person === term || person.includes(term)) || text.includes(term)) };
}

function partitionRagCorpusHits(documents, targets = []) {
  const performance = [];
  const facts = [];
  (Array.isArray(documents) ? documents : []).forEach((document) => {
    const classification = classifyRagCorpusEntry(document, targets);
    if (classification.performance) performance.push({ ...document, ragCorpusClassification: classification });
    else if (classification.facts) facts.push({ ...document, ragCorpusClassification: classification });
  });
  return { performance, facts };
}

function ragCorpusSearchContent(document) {
  const meta = document?.corpusMeta || {};
  const header = [
    meta.scene ? `场景：${meta.scene}` : '',
    meta.time ? `时间：${meta.time}` : '',
    meta.location ? `地点：${meta.location}` : '',
    Array.isArray(meta.people) && meta.people.length ? `人物：${meta.people.join('、')}` : '',
  ].filter(Boolean).join('\n');
  const text = String(document?.text || '').trim();
  return [header, text, meta.major ? text : ''].filter(Boolean).join('\n');
}

function ragCorpusInjectionContent(document) {
  const meta = document?.corpusMeta || {};
  const header = [meta.scene ? `场景：${meta.scene}` : '', meta.time ? `时间：${meta.time}` : '', meta.location ? `地点：${meta.location}` : '', Array.isArray(meta.people) && meta.people.length ? `出场人物：${meta.people.join('、')}` : ''].filter(Boolean).join('；');
  return [header, String(document?.rawText || document?.text || '').trim()].filter(Boolean).join('\n');
}

/* 关系库完整保存在本地；聊天时才根据当前角色、地点和话题取 Top-N。
   这里的数量限制只控制单轮注入，不会删除建库结果。 */
function buildKnowledgeGraphSections(chat, query, limit = 24) {
  const memory = ensureChatMemory(chat);
  const roleId = chat?.roleId || currentRole.id;
  const selected = memory.knowledgeLibrarySelectionSet ? new Set(memory.knowledgeLibraryIds) : null;
  const groups = memoryDocumentGroups('role', chat.id, roleId).filter((group) => !selected || selected.has(group.groupId));
  const entries = [];
  groups.forEach((group) => {
    const hiddenCharacters = new Set(normalizeCharacterCatalog(group.characterCatalog).filter((character) => character.hidden).flatMap((character) => [character.name, ...(character.aliases || [])]).map((name) => String(name).trim()).filter(Boolean));
    normalizeRelationTriples(group.relationTriples).forEach((triple, index) => {
      if (hiddenCharacters.has(triple.source) || hiddenCharacters.has(triple.target)) return;
      entries.push({
        id: `relation-${group.groupId}-${index}`,
        text: `${triple.source} ${triple.relation} ${triple.target}`,
        triple,
        libraryName: group.libraryName,
      });
    });
  });
  const hits = bm25SearchMemory(query, entries, Math.max(1, Number(limit) || 24));
  if (!hits.length) return [];
  const lines = hits.map((hit) => `- ${hit.triple.source} —${hit.triple.relation}→ ${hit.triple.target}（${hit.libraryName}）`).join('\n');
  return [`【当前话题相关的长期关系 · Top ${hits.length}】\n${lines}`];
}

function buildCharacterCatalogSections(chat, query, limit = 8) {
  const memory = ensureChatMemory(chat);
  const roleId = chat?.roleId || currentRole.id;
  const selected = memory.knowledgeLibrarySelectionSet ? new Set(memory.knowledgeLibraryIds) : null;
  const groups = memoryDocumentGroups('role', chat.id, roleId).filter((group) => !selected || selected.has(group.groupId));
  const entries = [];
  groups.forEach((group) => {
    normalizeCharacterCatalog(group.characterCatalog).filter((character) => !character.hidden).forEach((character, index) => entries.push({
      id: `character-${group.groupId}-${index}`,
      text: [character.name, ...(character.aliases || []), character.identity, character.traits, character.speechStyle].filter(Boolean).join(' '),
      character,
      libraryName: group.libraryName,
    }));
  });
  const hits = bm25SearchMemory(query, entries, Math.max(1, Number(limit) || 8));
  if (!hits.length) return [];
  const lines = hits.map((hit) => {
    const item = hit.character;
    return `- ${item.name}${item.aliases?.length ? `（别名：${item.aliases.join('、')}）` : ''}；身份：${item.identity || '未注明'}；性格：${item.traits || '未注明'}；说话风格：${item.speechStyle || '以相关原文为准'}`;
  }).join('\n');
  return [`【当前话题相关的重要角色档案 · Top ${hits.length}】\n${lines}`];
}

/* 用查询在勾选资料的三元组里做本地 BM25 召回，返回命中三元组及其 docId 对应原文。
   三元组只走本地 BM25（不向量化，省 token）；只保留 docId 能定位到原文的。 */
function retrieveTriplesForQuery(query, chat, limit = 3) {
  const memory = ensureChatMemory(chat);
  const roleId = chat?.roleId || currentRole.id;
  const selected = memory.knowledgeLibrarySelectionSet ? new Set(memory.knowledgeLibraryIds) : null;
  const groups = memoryDocumentGroups('role', chat.id, roleId).filter((group) => !selected || selected.has(group.groupId));
  const entries = [];
  groups.forEach((group) => {
    normalizeRelationTriples(group.relationTriples).forEach((triple) => {
      if (triple.docId) entries.push({ triple, libraryName: group.libraryName });
    });
  });
  if (!entries.length) return [];
  const tripleDocs = entries.map((entry, index) => ({
    id: `triple-${index}`,
    text: `${entry.triple.source} ${entry.triple.relation} ${entry.triple.target}`,
    entry,
  }));
  const hits = bm25SearchMemory(query, tripleDocs, limit);
  return hits.map((hit) => ({
    triple: hit.entry.triple,
    libraryName: hit.entry.libraryName,
    sourceDoc: memoryDocuments.find((doc) => doc.id === hit.entry.triple.docId) || null,
  })).filter((match) => match.sourceDoc);
}

function applyKnowledgeRecallCaps(hits, groups, limitKey, totalLimit = KNOWLEDGE_RECALL_TOTAL_MAX) {
  const groupLimits = new Map((Array.isArray(groups) ? groups : []).map((group) => {
    const fallback = limitKey === 'factRecallLimit' ? 4 : 3;
    return [String(group.groupId || ''), normalizeKnowledgeRecallLimit(group[limitKey], fallback)];
  }));
  const counts = new Map();
  const selected = [];
  const total = Math.max(0, Math.min(KNOWLEDGE_RECALL_TOTAL_MAX, Math.round(Number(totalLimit) || 0)));
  for (const hit of Array.isArray(hits) ? hits : []) {
    if (selected.length >= total) break;
    const groupId = String(hit?.groupId || '');
    const fallback = limitKey === 'factRecallLimit' ? 4 : 3;
    const groupLimit = groupLimits.has(groupId) ? groupLimits.get(groupId) : fallback;
    const used = counts.get(groupId) || 0;
    if (used >= groupLimit) continue;
    selected.push(hit);
    counts.set(groupId, used + 1);
  }
  return selected;
}

async function collectMemoryPlan(userText, historyMessages = activeChat?.messages || [], chat = activeChat) {
  if (!memorySettings.enabled || !chat) return { implemented: true, included: [], content: '', query: '', ms: 0 };
  const startedAt = performance.now();
  const memory = ensureChatMemory(chat);
  const recentQuery = historyMessages.slice(-4).map((message) => message.text).concat(userText || '').join('\n');
  const baseMemory = formatChatMemory(memory);
  const roleId = chat?.roleId || currentRole.id;
  const selected = memory.knowledgeLibrarySelectionSet ? new Set(memory.knowledgeLibraryIds) : null;
  const knowledgeGroups = memoryDocumentGroups('role', '', roleId).filter((group) => !selected || selected.has(group.groupId));
  const enabledTargetsByGroup = new Map(knowledgeGroups.map((group) => [group.groupId, normalizeKnowledgePerformanceState(group, currentRole?.name || '').targetCharacters.filter((target) => target.enabled !== false)]));
  const roleNames = [...new Set([...enabledTargetsByGroup.values()].flatMap((targets) => targets.flatMap((target) => [target.primaryName, ...target.aliases])))];
  const performanceSendFields = knowledgePerformanceSendFields();
  const performanceQuery = buildPerformanceRetrievalQuery(userText, historyMessages, {
    roleNames,
    currentTime: memory.anchors?.currentTime?.value,
    currentLocation: memory.anchors?.currentLocation?.value,
    relationships: normalizeRelationshipCards(memory.relationshipCards).map((card) => `${card.source}与${card.target}：${card.currentRelation}`).slice(0, 24),
    openPlots: normalizeOpenPlots(memory.openPlots).map((item) => item.title).slice(0, 20),
  });
  const profiles = knowledgeGroups.flatMap((group) => {
    const enabledIds = new Set((enabledTargetsByGroup.get(group.groupId) || []).map((target) => target.id));
    return normalizeRoleProfiles(group.roleProfiles, group.targetCharacters).filter((profile) => enabledIds.has(profile.targetId)).map((profile) => ({ ...profile, sourceName: profile.sourceName || group.libraryName }));
  });
  const selectedTargetIds = [...new Set([...enabledTargetsByGroup.values()].flatMap((targets) => targets.map((target) => target.id)))];
  const residentProfileSections = composeResidentRoleProfiles(profiles, selectedTargetIds, 400);
  const sourceDocs = new Map(memoryDocuments.map((document) => [document.id, document]));
  const selectedRoleDocuments = roleMemoryDocumentsForChat(chat);
  const corpusPartitionsByGroup = new Map(knowledgeGroups.map((group) => {
    const corpusDocuments = selectedRoleDocuments.filter((document) => document.groupId === group.groupId && document.sourceFormat === 'rag-corpus');
    return [group.groupId, partitionRagCorpusHits(corpusDocuments, enabledTargetsByGroup.get(group.groupId) || [])];
  }));
  const performanceDocuments = knowledgeGroups.flatMap((group) => {
    if (group.performanceRecallLimit <= 0) return [];
    const enabledIds = new Set((enabledTargetsByGroup.get(group.groupId) || []).map((target) => target.id));
    const cards = !performanceSendFields.length ? [] : normalizePerformanceCards(group.performanceCards).filter((card) => enabledIds.has(card.targetId)).map((card) => {
      const sourceDoc = sourceDocs.get(card.sourceDocId);
      return {
        id: card.id,
        groupId: group.groupId,
        scope: 'performance',
        sourceName: card.sourceName || group.libraryName,
        text: performanceCardContent(card),
        card,
        embedding: card.embedding?.length ? card.embedding : sourceDoc?.embedding,
        embeddingModel: card.embeddingModel || sourceDoc?.embeddingModel || '',
      };
    });
    const corpus = (corpusPartitionsByGroup.get(group.groupId)?.performance || []).map((document) => ({
      ...document,
      scope: 'corpus-performance',
      sourceName: document.libraryName || document.sourceName || group.libraryName,
      rawText: document.text,
      text: ragCorpusSearchContent(document),
      ragCorpus: true,
    }));
    return [...cards, ...corpus];
  });
  let performanceRetrieval = { hits: [], vectorError: '', rerankError: '', bm25Count: 0, vectorCount: 0 };
  let plotRetrieval = { hits: [], vectorError: '', rerankError: '', bm25Count: 0, vectorCount: 0 };
  let factRetrieval = { hits: [], vectorError: '', rerankError: '', bm25Count: 0, vectorCount: 0 };
  const knowledgeCandidateLimit = Math.max(KNOWLEDGE_RECALL_TOTAL_MAX, Number(memorySettings.candidateLimit) || 20);
  if (memorySettings.retrievePast) {
    if (performanceDocuments.length) {
      performanceRetrieval = await retrieveMemoryDocuments(performanceQuery, performanceDocuments, knowledgeCandidateLimit);
      performanceRetrieval.hits = applyKnowledgeRecallCaps(performanceRetrieval.hits, knowledgeGroups, 'performanceRecallLimit');
    }
    if (memory.sectionControls?.summaries?.sendEnabled !== false) {
      const storedChatDocs = memoryDocuments.filter((doc) => doc.scope === 'chat' && doc.chatId === chat.id).map((doc) => (
        String(doc.sourceName || '').includes('分批总结') ? { ...doc, text: summaryNarrativeOnly(doc.text) } : doc
      ));
      const storedIds = new Set(storedChatDocs.map((doc) => doc.id));
      const ephemeralSummaries = (memory.summaries || []).filter((entry) => !storedIds.has(entry.id) && String(entry.text || '').trim()).map((entry) => ({ id: entry.id, groupId: entry.id, scope: 'chat', chatId: chat.id, sourceName: entry.migrationOnly ? '旧版迁移纪要' : `${chat.title}·分批总结`, text: summaryNarrativeOnly(entry.text), createdAt: entry.createdAt || '' }));
      plotRetrieval = await retrieveMemoryDocuments(recentQuery, [...storedChatDocs, ...ephemeralSummaries], Math.max(1, Math.min(4, Number(memorySettings.maxRetrieved) || 4)));
    }
    const enabledFactGroups = new Set(knowledgeGroups.filter((group) => group.factRecallLimit > 0).map((group) => group.groupId));
    const ordinaryFactDocuments = selectedRoleDocuments.filter((document) => enabledFactGroups.has(document.groupId) && document.sourceFormat !== 'rag-corpus');
    const corpusFactDocuments = knowledgeGroups.filter((group) => enabledFactGroups.has(group.groupId)).flatMap((group) => (corpusPartitionsByGroup.get(group.groupId)?.facts || []).map((document) => ({
      ...document,
      scope: 'corpus-fact',
      sourceName: document.libraryName || document.sourceName || group.libraryName,
      rawText: document.text,
      text: ragCorpusSearchContent(document),
      ragCorpus: true,
    })));
    const factDocuments = [...ordinaryFactDocuments, ...corpusFactDocuments];
    if (factDocuments.length) {
      factRetrieval = await retrieveMemoryDocuments(performanceQuery, factDocuments, knowledgeCandidateLimit);
      factRetrieval.hits = applyKnowledgeRecallCaps(factRetrieval.hits, knowledgeGroups, 'factRecallLimit');
    }
  }
  let factHits = [...factRetrieval.hits];
  retrieveTriplesForQuery(performanceQuery, chat, KNOWLEDGE_RECALL_TOTAL_MAX).forEach((match) => {
    if (match.sourceDoc && !factHits.some((doc) => doc.id === match.sourceDoc.id)) factHits.push({ ...match.sourceDoc, isTripleGuide: true, guideTriple: match.triple });
  });
  factHits = applyKnowledgeRecallCaps(factHits, knowledgeGroups, 'factRecallLimit');
  const included = [...performanceRetrieval.hits, ...plotRetrieval.hits, ...factHits];
  const chatCharacterSections = [];
  const knowledgeQuery = performanceQuery;
  const chatRelationSections = buildChatRelationSections(memory, knowledgeQuery, 24);
  const characterSections = buildCharacterCatalogSections(chat, knowledgeQuery, 8);
  const graphSections = buildKnowledgeGraphSections(chat, knowledgeQuery, 24);
  const performanceSections = performanceRetrieval.hits.map((doc, index) => {
    if (doc.ragCorpus) return `【情境参考语料 ${index + 1} · ${doc.sourceName || 'RAG语料'}】\n${ragCorpusInjectionContent(doc)}`;
    const content = performanceCardInjectionContent(doc.card, performanceSendFields);
    return content ? `【情境演绎命中 ${index + 1} · ${doc.sourceName || '资料'}】\n${content}` : '';
  }).filter(Boolean);
  const plotSections = plotRetrieval.hits.map((doc, index) => `【本聊天剧情纪要 ${index + 1} · ${doc.sourceName || '历史剧情'}】\n${doc.text}`);
  const factSections = factHits.map((doc, index) => {
    const guide = doc.isTripleGuide && doc.guideTriple
      ? ` · 指路:${doc.guideTriple.source}—${doc.guideTriple.relation}→${doc.guideTriple.target}`
      : '';
    const content = doc.ragCorpus ? ragCorpusInjectionContent(doc) : doc.text;
    return `【原作事实 ${index + 1} · ${doc.sourceName || doc.title || '资料'}${guide}】\n${content}`;
  });
  const priorityRule = '【记忆使用规则】当前聊天状态与关系 > 当前启用人设 > 常驻角色本色卡 > 情境演绎 > 本聊天剧情纪要 > 原作事实。冲突时以当前聊天已经发生的剧情和当前启用人设为准；资料库只供参考，不得覆盖当前剧情。学习角色的思考逻辑、语言节奏和动作习惯，但不得照抄台词，不得重演原作剧情。';
  const budget = composeMemorySectionsWithinBudget([
    { id: 'priority', text: priorityRule, priority: 0, required: true },
    { id: 'current-state', text: baseMemory, priority: 1, required: true },
    ...chatRelationSections.map((text, index) => ({ id: `chat-relation-${index}`, text, priority: 2, required: true })),
    ...residentProfileSections.map((text, index) => ({ id: `role-profile-${index}`, text, priority: 3, required: true })),
    ...performanceSections.map((text, index) => ({ id: `performance-${index}`, text, priority: 4 })),
    ...plotSections.map((text, index) => ({ id: `plot-${index}`, text, priority: 5 })),
    ...characterSections.map((text, index) => ({ id: `facts-character-${index}`, text, priority: 6 })),
    ...graphSections.map((text, index) => ({ id: `facts-relation-${index}`, text, priority: 6 })),
    ...factSections.map((text, index) => ({ id: `facts-source-${index}`, text, priority: 7 })),
  ], 12000);
  const rawContent = budget.text;
  const injectionPrompt = resolveMemoryPrompt('injection', memory.promptSelections?.injection).content;
  const prompt = rawContent
    ? replacePromptMacros(injectionPrompt || '{{memories}}').replace(/\{\{memories\}\}/gi, rawContent)
    : '';
  const retrievalLog = recordMemoryRetrievalLog(memory, {
    query: recentQuery,
    currentStateIncluded: Boolean(baseMemory),
    currentState: baseMemory,
    chatCharacters: chatCharacterSections,
    chatRelations: chatRelationSections,
    knowledgeCharacters: characterSections,
    knowledgeRelations: graphSections,
    roleProfiles: residentProfileSections,
    performanceQuery,
    performanceSendFields: {
      ids: performanceSendFields,
      labels: KNOWLEDGE_PERFORMANCE_FIELDS.filter((field) => performanceSendFields.includes(field.id)).map((field) => field.label),
      status: knowledgePerformanceSendFieldsStatus(performanceSendFields),
    },
    performanceCards: performanceRetrieval.hits.filter((doc) => !doc.ragCorpus).map((doc) => {
      const injectedContent = performanceCardInjectionContent(doc.card, performanceSendFields);
      return {
        id: doc.id,
        sourceName: doc.sourceName,
        preview: injectedContent.slice(0, 400),
        fullContent: doc.text,
        injectedContent,
      };
    }),
    ragCorpusHits: [...performanceRetrieval.hits.filter((doc) => doc.ragCorpus).map((doc) => ({
      id: doc.id,
      sourceName: doc.sourceName,
      destination: '情境参考',
      rowNumber: doc.corpusMeta?.rowNumber || 0,
      people: doc.corpusMeta?.people || [],
      preview: ragCorpusInjectionContent(doc).slice(0, 600),
    })), ...factHits.filter((doc) => doc.ragCorpus).map((doc) => ({
      id: doc.id,
      sourceName: doc.sourceName,
      destination: '原作事实',
      rowNumber: doc.corpusMeta?.rowNumber || 0,
      people: doc.corpusMeta?.people || [],
      preview: ragCorpusInjectionContent(doc).slice(0, 600),
    }))],
    plotSummaries: plotRetrieval.hits.map((doc) => ({ id: doc.id, sourceName: doc.sourceName, preview: doc.text.slice(0, 400) })),
    canonFacts: factHits.map((doc) => ({ id: doc.id, sourceName: doc.sourceName, preview: String(doc.text || '').slice(0, 400) })),
    retrievalProcess: {
      bm25: { performanceAndFactsQuery: performanceQuery, plotQuery: recentQuery, performanceHits: performanceRetrieval.bm25Count, plotHits: plotRetrieval.bm25Count, factHits: factRetrieval.bm25Count, candidateLimit: memorySettings.candidateLimit },
      vector: { enabled: memorySettings.vector, input: memorySettings.vector ? { performanceAndFacts: performanceQuery, plot: recentQuery } : null, model: effectiveMemoryModel('embedding'), endpoint: memorySettings.embeddingEndpoint || '', performanceHits: performanceRetrieval.vectorCount, plotHits: plotRetrieval.vectorCount, factHits: factRetrieval.vectorCount, errors: [performanceRetrieval.vectorError, plotRetrieval.vectorError, factRetrieval.vectorError].filter(Boolean) },
      rerank: { enabled: memorySettings.rerank, queries: memorySettings.rerank ? { performanceAndFacts: performanceQuery, plot: recentQuery } : null, model: effectiveMemoryModel('rerank'), endpoint: memorySettings.rerankEndpoint || '', returned: { performance: performanceRetrieval.hits.map((doc) => doc.id), plots: plotRetrieval.hits.map((doc) => doc.id), facts: factRetrieval.hits.map((doc) => doc.id) }, errors: [performanceRetrieval.rerankError, plotRetrieval.rerankError, factRetrieval.rerankError].filter(Boolean) },
      budget: { includedIds: budget.includedIds, omittedIds: budget.omittedIds, characters: rawContent.length },
      knowledgeRecallLimits: {
        performanceTotalMax: KNOWLEDGE_RECALL_TOTAL_MAX,
        factTotalMax: KNOWLEDGE_RECALL_TOTAL_MAX,
        libraries: knowledgeGroups.map((group) => ({
          groupId: group.groupId,
          libraryName: group.libraryName,
          performanceLimit: group.performanceRecallLimit,
          performanceUsed: performanceRetrieval.hits.filter((item) => item.groupId === group.groupId).length,
          factLimit: group.factRecallLimit,
          factUsed: factHits.filter((item) => item.groupId === group.groupId).length,
        })),
      },
      performanceSendFields: {
        selected: performanceSendFields,
        selectedLabels: KNOWLEDGE_PERFORMANCE_FIELDS.filter((field) => performanceSendFields.includes(field.id)).map((field) => field.label),
        skippedAiCardRetrieval: performanceSendFields.length === 0,
        ragCorpusStillEligible: performanceDocuments.some((document) => document.ragCorpus),
      },
    },
    finalContent: prompt,
    documents: included.map((doc) => ({ id: doc.id, scope: doc.scope, sourceName: doc.sourceName || doc.title || '资料', preview: String(doc.text || '').slice(0, 240) })),
  });
  return {
    implemented: true,
    query: recentQuery,
    included,
    retrieval: { performance: performanceRetrieval, plots: plotRetrieval, facts: factRetrieval },
    retrievalLog,
    components: {
      currentChatState: Boolean(baseMemory),
      relationshipRecall: chatRelationSections.length,
      residentRoleProfiles: residentProfileSections.length,
      performanceRecall: performanceRetrieval.hits.length,
      plotSummaryRecall: plotRetrieval.hits.length,
      chatSourceRecall: plotRetrieval.hits.filter((doc) => !/\u5206批总结|\u8fc1移纪要/.test(String(doc.sourceName || ''))).length,
      knowledgeRecall: factHits.length + characterSections.length + graphSections.length,
    },
    content: prompt,
    ms: Math.round(performance.now() - startedAt),
  };
}

function orderedPresetItems(preset, generationType = 'normal') {
  if (!Array.isArray(preset?.promptBlocks) || !Array.isArray(preset?.promptOrder)) return [];
  const blocks = new Map(preset.promptBlocks.map((block) => [block.identifier, block]));
  return preset.promptOrder
    .filter((item) => item?.enabled !== false && blocks.has(item.identifier))
    .map((item) => blocks.get(item.identifier))
    .filter((block) => {
      const triggers = Array.isArray(block.injectionTrigger) ? block.injectionTrigger.filter((item) => typeof item === 'string') : [];
      return !triggers.length || triggers.includes(generationType);
    });
}

const ANTI_REPEAT_DIRECTIONS = Object.freeze([
  '换一种情绪立场来回应',
  '换一种动作反应，不沿用旧候选中的身体动作',
  '换一个话题切入点，从新的细节展开',
  '减少动作描写，增加直接而自然的对话',
  '保持嘴硬，但让行动表现出服软与在意',
]);

let lastAntiRepeatDirection = '';
let antiRepeatSaltCounter = 0;

function pickAntiRepeatDirection(previous = '') {
  const excluded = previous || lastAntiRepeatDirection;
  const pool = ANTI_REPEAT_DIRECTIONS.filter((item) => item !== excluded);
  const picked = pool[Math.floor(Math.random() * pool.length)] || ANTI_REPEAT_DIRECTIONS[0];
  lastAntiRepeatDirection = picked;
  return picked;
}

function createAntiRepeatSalt() {
  antiRepeatSaltCounter += 1;
  const randomPart = Math.floor(Math.random() * 0xFFFFFF).toString(36).padStart(5, '0');
  return `XS-${Date.now().toString(36)}-${antiRepeatSaltCounter.toString(36)}-${randomPart}`;
}

function uniqueRejectedReplies(values, limit = 15) {
  const result = [];
  const seen = new Set();
  (Array.isArray(values) ? values : []).forEach((value) => {
    const text = String(value || '').trim();
    const key = normalizeReplyForComparison(text);
    if (!text || !key || seen.has(key)) return;
    seen.add(key);
    result.push(text);
  });
  return result.slice(-Math.max(1, Number(limit) || 15));
}

function rejectedReplyAttempts(values, limit = 15) {
  return (Array.isArray(values) ? values : [])
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .slice(-Math.max(1, Number(limit) || 15));
}

function buildAntiRepeatPrompt(template, antiRepeat = {}) {
  // 每次被刷走都代表一次明确拒绝；即使正文相同也逐条发送，让模型知道重复答案已经多次失败。
  const candidates = rejectedReplyAttempts(antiRepeat.rejectedCandidates, 15);
  if (!candidates.length) return '';
  const direction = String(antiRepeat.direction || ANTI_REPEAT_DIRECTIONS[0]);
  const salt = String(antiRepeat.salt || createAntiRepeatSalt());
  const rejectedCandidates = candidates
    .map((text, index) => `【已拒绝候选 ${index + 1}｜未发生】\n${text}`)
    .join('\n\n');
  const source = String(template || DEFAULT_ANTI_REPEAT_PROMPT);
  let prompt = source
    .replaceAll('{{rejectedCandidates}}', rejectedCandidates)
    .replaceAll('{{variationDirection}}', direction)
    .replaceAll('{{variationSalt}}', salt);
  // 兼容姐妹手机里已经缓存的旧模板：即使模板没有新占位符，也保证语义盐值真实进入请求。
  if (!source.includes('{{variationDirection}}')) prompt += `\n\n【本轮差异方向】${direction}`;
  if (!source.includes('{{variationSalt}}')) prompt += `\n【本轮变化编号】${salt}（仅用于区分本次请求，不得在回复中提及）`;
  return prompt;
}

function normalizeReplyForComparison(text) {
  return String(text || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, '');
}

function buildOrderedPresetMessages(userText, historyMessages, preset, persona, role, worldPlan, memoryPlan, options = {}) {
  const messages = [];
  const trace = [];
  const promptInjections = [];
  const historyLimit = modelSettings.enabled ? modelSettings.historyLimit : historyMessages.length;
  const recentMsgs = historyMessages.slice(-historyLimit);
  const generationType = options.generationType || 'normal';
  const orderedItems = orderedPresetItems(preset, generationType);
  const antiRepeatBlock = orderedItems.find((block) => block.identifier === 'antiRepeat');
  const inputDraft = String(options.inputDraft || '');
  let historyInserted = false;
  const push = (messageRole, content, source, detail = '') => {
    const normalized = replacePromptMacros(content).trim();
    if (!normalized) return;
    const safeRole = ['system', 'user', 'assistant'].includes(messageRole) ? messageRole : 'system';
    messages.push({ role: safeRole, content: normalized });
    trace.push({ source, detail, role: safeRole, content: normalized });
  };
  const pushWorld = (position) => {
    for (const entry of worldPlan.groups[position] || []) {
      push(entry.role, entry.content, `世界书 · ${entry.name}`, `${position} · order ${entry.order} · 命中 ${entry.matchedKeys.join(', ')}`);
    }
  };
  const pushExamples = () => {
    pushWorld('before_examples');
    push('system', preset.newExampleChatPrompt || '', '预设 · 示例对话标记', 'new_example_chat_prompt');
    for (const turn of parseExampleDialogue(persona?.example || role.example || '')) {
      push(turn.role, turn.content, '角色卡 · 示例对话', 'dialogue_examples');
    }
    pushWorld('after_examples');
  };
  const pushHistory = () => {
    if (historyInserted) return;
    historyInserted = true;
    pushWorld('before_an');
    push('system', preset.newChatPrompt || '', '预设 · 新聊天标记', 'new_chat_prompt');
    pushWorld('after_an');
    if (memoryPlan.content && memorySettings.injectionPosition === 'before_history') push('system', memoryPlan.content, `长记忆 · ${memoryRetrievalLabel()}`, `召回 ${memoryPlan.included.length} 条`);
    for (const message of recentMsgs) {
      push(message.role === 'user' ? 'user' : 'assistant', message.text, '聊天历史', message.sendDate || '');
    }
    if (memoryPlan.content && memorySettings.injectionPosition === 'after_history') push('system', memoryPlan.content, `长记忆 · ${memoryRetrievalLabel()}`, `召回 ${memoryPlan.included.length} 条`);
    if (generationType === 'regenerate' && antiRepeatBlock) {
      const antiRepeatPrompt = buildAntiRepeatPrompt(antiRepeatBlock.content, options.antiRepeat);
      push('system', antiRepeatPrompt, '内置 · 防重复', `已拒绝 ${Number(options.antiRepeat?.rejectedAttemptCount) || rejectedReplyAttempts(options.antiRepeat?.rejectedCandidates, 15).length} 次 / ${Number(options.antiRepeat?.uniqueRejectedCount) || uniqueRejectedReplies(options.antiRepeat?.rejectedCandidates, 15).length} 种回答 · ${options.antiRepeat?.direction || ''}`);
    }
    if (generationType === 'normal' || generationType === 'regenerate') push('user', userText, '本次用户输入', 'current_user');
    for (const entry of worldPlan.groups.at_depth || []) {
      const index = Math.max(0, messages.length - entry.depth);
      const message = { role: entry.role, content: replacePromptMacros(entry.content).trim() };
      const itemTrace = { source: `世界书 · ${entry.name}`, detail: `at_depth ${entry.depth} · order ${entry.order} · 命中 ${entry.matchedKeys.join(', ')}`, ...message };
      messages.splice(index, 0, message);
      trace.splice(index, 0, itemTrace);
    }
  };

  const markerHandlers = {
    worldInfoBefore: () => pushWorld('before_char'),
    personaDescription: () => push('system', joinPromptParts([userProfile?.persona || '', preset.userIdentity || '']), '角色卡 · 用户人设', 'persona_description'),
    charDescription: () => push('system', joinPromptParts([persona?.description || role.description || '', preset.charSetting || '']), '角色卡 · 角色描述', 'char_description'),
    charPersonality: () => push('system', joinPromptParts([persona?.personality || role.personality || '', preset.charPersonality || '']), '角色卡 · 角色性格', 'char_personality'),
    scenario: () => push('system', joinPromptParts([persona?.scenario || role.scenario || '', preset.scenario || '']), '角色卡 · 场景', 'scenario'),
    dialogueExamples: pushExamples,
    worldInfoAfter: () => pushWorld('after_char'),
    chatHistory: pushHistory,
  };

  for (const block of orderedItems) {
    // 《防重复》的正文含本轮动态候选，必须在聊天历史之后、当前用户消息之前由 pushHistory 填入。
    if (block.identifier === 'antiRepeat') continue;
    if (Number(block.injectionPosition) === 1) {
      promptInjections.push(block);
      continue;
    }
    const handler = markerHandlers[block.identifier];
    if (block.marker && handler) {
      handler();
      continue;
    }
    if (handler && !String(block.content || '').trim()) {
      handler();
      continue;
    }
    const content = block.identifier === 'impersonation' && generationType === 'impersonate' && inputDraft.trim()
      ? `${block.content || ''}\n\n输入框现有草稿：\n${inputDraft.trim()}`
      : block.content || '';
    push(block.role || 'system', content, `预设 · ${block.name || block.identifier}`, block.identifier);
  }
  if (!historyInserted) pushHistory();
  if (generationType === 'impersonate' && !preset.promptBlocks.some((block) => block.identifier === 'impersonation')) {
    const fallback = inputDraft.trim() ? `${DEFAULT_IMPERSONATION_PROMPT}\n\n输入框现有草稿：\n${inputDraft.trim()}` : DEFAULT_IMPERSONATION_PROMPT;
    push('system', fallback, '内置 · 帮答', 'impersonation_fallback');
  }
  promptInjections
    .sort((a, b) => Number(a.injectionOrder ?? 100) - Number(b.injectionOrder ?? 100))
    .forEach((block) => {
      const content = replacePromptMacros(block.content || '').trim();
      if (!content) return;
      const message = { role: ['system', 'user', 'assistant'].includes(block.role) ? block.role : 'system', content };
      const index = Math.max(0, messages.length - Math.max(0, Number(block.injectionDepth) || 0));
      messages.splice(index, 0, message);
      trace.splice(index, 0, { source: `预设注入 · ${block.name || block.identifier}`, detail: `@ depth ${Number(block.injectionDepth) || 0}`, ...message });
    });
  if (memoryPlan.content && memorySettings.injectionPosition === 'at_depth') {
    const depth = Math.max(0, Number(memorySettings.injectionDepth) || 0);
    const index = Math.max(0, messages.length - depth);
    const message = { role: 'system', content: memoryPlan.content };
    messages.splice(index, 0, message);
    trace.splice(index, 0, { source: `长记忆 · ${memoryRetrievalLabel()}`, detail: `@ depth ${depth} · 召回 ${memoryPlan.included.length} 条`, ...message });
  }

  lastRequestContextReport = {
    preset: preset.name || '未命名预设',
    historyIncluded: recentMsgs.length,
    historyAvailable: historyMessages.length,
    memory: {
      configuredMode: memorySettings.mode,
      enabled: memorySettings.enabled,
      implemented: true,
      recalled: memoryPlan.included.length,
      components: memoryPlan.components,
      note: memoryPlan.content ? `已注入聊天记忆与 ${memoryRetrievalLabel()} 召回资料。` : '本轮没有可注入的长记忆。',
    },
    worldBook: worldPlan,
    trace,
    promptOrderApplied: true,
  };
  return messages;
}

async function buildChatMessages(userText, historyMessages = activeChat?.messages || [], personaOverride = null, options = {}) {
  const messages = [];
  const trace = [];
  const preset = options.presetOverride || activePreset();
  const persona = personaOverride || activePersona();
  const role = currentRole || {};
  const worldPlan = collectWorldBookPlan(userText, historyMessages);
  const memoryPlan = await collectMemoryPlan(userText, historyMessages, activeChat);
  const generationType = options.generationType || 'normal';
  if (orderedPresetItems(preset, generationType).length) {
    return buildOrderedPresetMessages(userText, historyMessages, preset, persona, role, worldPlan, memoryPlan, options);
  }
  const pushMessage = (messageRole, content, source, detail = '') => {
    const normalized = replacePromptMacros(content).trim();
    if (!normalized) return;
    messages.push({ role: messageRole, content: normalized });
    trace.push({ source, detail, role: messageRole, content: normalized });
  };
  const pushWorldGroup = (position) => {
    for (const entry of worldPlan.groups[position] || []) {
      pushMessage(entry.role, entry.content, `世界书 · ${entry.name}`, `${position} · order ${entry.order} · 命中 ${entry.matchedKeys.join(', ')}`);
    }
  };

  // Prompt Manager 风格的固定层级：主提示 → 角色定义 → 补充规则。
  pushMessage('system', joinPromptParts([preset?.mainPrompt || preset?.prompt || '', preset?.wordInfoBefore || '']), '预设 · 主提示', 'main_prompt');
  pushWorldGroup('before_char');
  pushMessage('system', joinPromptParts([
    preset?.personaDescription || '',
    persona?.description || role.description || '',
    preset?.charDescription || '',
    preset?.charSetting || '',
    persona?.personality || role.personality || '',
    preset?.charPersonality || '',
    preset?.enhanceDefinitions || '',
    persona?.scenario || role.scenario || '',
    preset?.scenario || '',
  ]), '角色定义', 'character_definition');
  pushWorldGroup('after_char');
  pushMessage('system', joinPromptParts([
    userProfile?.persona || '',
    preset?.userIdentity || '',
    preset?.auxiliaryPrompt || '',
    preset?.worldInfoAfter || '',
    preset?.newChat || '',
    preset?.groupAdvance || '',
    preset?.continueStory || '',
    preset?.aiAnswer || '',
    preset?.chatHistory || '',
    preset?.jailbreak || '',
  ]), '预设 · 补充指令', 'supplemental');

  pushWorldGroup('before_examples');
  const exampleSources = [
    { text: persona?.example || role.example || '', source: '角色示例对话' },
    { text: preset?.chatExample || '', source: '预设示例对话' },
  ];
  for (const exampleSource of exampleSources) {
    for (const turn of parseExampleDialogue(exampleSource.text)) {
      pushMessage(turn.role, turn.content, exampleSource.source, 'few_shot');
    }
  }
  pushWorldGroup('after_examples');
  pushWorldGroup('before_an');
  pushWorldGroup('after_an');
  if (memoryPlan.content && memorySettings.injectionPosition === 'before_history') pushMessage('system', memoryPlan.content, `长记忆 · ${memoryRetrievalLabel()}`, `召回 ${memoryPlan.included.length} 条`);

  const historyLimit = modelSettings.enabled ? modelSettings.historyLimit : historyMessages.length;
  const recentMsgs = historyMessages.slice(-historyLimit);
  for (const message of recentMsgs) {
    pushMessage(message.role === 'user' ? 'user' : 'assistant', message.text, '聊天历史', message.sendDate || '');
  }
  if (memoryPlan.content && memorySettings.injectionPosition === 'after_history') pushMessage('system', memoryPlan.content, `长记忆 · ${memoryRetrievalLabel()}`, `召回 ${memoryPlan.included.length} 条`);
  if (generationType === 'normal' || generationType === 'regenerate') pushMessage('user', userText, '本次用户输入', 'current_user');
  if (generationType === 'impersonate') {
    const inputDraft = String(options.inputDraft || '').trim();
    pushMessage('system', inputDraft ? `${DEFAULT_IMPERSONATION_PROMPT}\n\n输入框现有草稿：\n${inputDraft}` : DEFAULT_IMPERSONATION_PROMPT, '内置 · 帮答', 'impersonation_fallback');
  }

  // 指定深度：depth 0 位于上下文最底部，depth N 向历史上方移动 N 条。
  for (const entry of worldPlan.groups.at_depth || []) {
    const index = Math.max(0, messages.length - entry.depth);
    const message = { role: entry.role, content: replacePromptMacros(entry.content).trim() };
    const itemTrace = { source: `世界书 · ${entry.name}`, detail: `at_depth ${entry.depth} · order ${entry.order} · 命中 ${entry.matchedKeys.join(', ')}`, ...message };
    messages.splice(index, 0, message);
    trace.splice(index, 0, itemTrace);
  }
  if (memoryPlan.content && memorySettings.injectionPosition === 'at_depth') {
    const depth = Math.max(0, Number(memorySettings.injectionDepth) || 0);
    const index = Math.max(0, messages.length - depth);
    const message = { role: 'system', content: memoryPlan.content };
    messages.splice(index, 0, message);
    trace.splice(index, 0, { source: `长记忆 · ${memoryRetrievalLabel()}`, detail: `@ depth ${depth} · 召回 ${memoryPlan.included.length} 条`, ...message });
  }

  // 酒馆 Chat Completion 中的 Post-History Instructions 通常位于上下文末尾。
  pushMessage('system', preset?.postHistoryInstructions || '', '预设 · 历史后指令', 'post_history_instructions');

  lastRequestContextReport = {
    preset: preset?.name || '未启用',
    historyIncluded: recentMsgs.length,
    historyAvailable: historyMessages.length,
    memory: {
      configuredMode: memorySettings.mode,
      enabled: memorySettings.enabled,
      implemented: true,
      recalled: memoryPlan.included.length,
      components: memoryPlan.components,
      note: memoryPlan.content ? `已注入聊天记忆与 ${memoryRetrievalLabel()} 召回资料。` : '本轮没有可注入的长记忆。',
    },
    worldBook: worldPlan,
    trace,
  };
  return messages;
}

// 保留旧调用兼容：返回本轮所有已纳入预算的世界书正文。
function collectWorldBookContent(userText, historyMessages = activeChat?.messages || []) {
  return collectWorldBookPlan(userText, historyMessages).included.map((entry) => entry.content).join('\n\n');
}

/**
 * 把示例对话文本解析成 user/assistant 消息轮次。
 * 支持「{{char}}:」「{{user}}:」「角色：」「用户：」等标记，并替换占位符为真实名字。
 */
function parseExampleDialogue(text) {
  const roleName = currentRole?.name || '角色';
  const userName = userProfile?.name || '用户';
  const normalized = text
    .replace(/\{\{char\}\}/g, roleName)
    .replace(/\{\{user\}\}/g, userName);
  const lines = normalized.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const turns = [];
  let pendingRole = null;
  let pendingText = '';
  const flush = () => {
    if (pendingRole && pendingText) turns.push({ role: pendingRole, content: pendingText.trim() });
    pendingRole = null;
    pendingText = '';
  };
  for (const line of lines) {
    const match = line.match(/^(.*?)[：:]\s*(.*)$/);
    const speaker = match ? match[1].trim() : '';
    const body = match ? match[2] : line;
    const lower = speaker.toLowerCase();
    let role = null;
    if (speaker === roleName || lower === 'char' || lower === '角色') role = 'assistant';
    else if (speaker === userName || lower === 'user' || lower === '用户') role = 'user';
    if (role) {
      flush();
      pendingRole = role;
      pendingText = body;
    } else {
      pendingText += (pendingText ? '\n' : '') + line;
    }
  }
  flush();
  return turns;
}

/**
 * 调用 OpenAI 兼容 API 获取角色回复
 * @param {string} userText - 用户消息
 * @returns {Promise<string>} AI 回复文本
 */
function isNativeApp() {
  try {
    if (globalThis.Capacitor?.isNativePlatform?.()) return true;
    return ['android', 'ios'].includes(globalThis.Capacitor?.getPlatform?.());
  } catch (_) {
    return false;
  }
}

function nativeHttpPlugin() {
  return globalThis.CapacitorHttp
    || globalThis.Capacitor?.Plugins?.CapacitorHttp
    || null;
}

function nativeAbortError(message = '请求已取消') {
  const error = new Error(message);
  error.name = 'AbortError';
  return error;
}

async function nativeHttpFetchResponse(url, options = {}, timeout = 120000) {
  const http = nativeHttpPlugin();
  if (!http?.request) throw new Error('当前 App 缺少原生 HTTP 通道，请重新打包安装');
  const signal = options.signal;
  if (signal?.aborted) throw nativeAbortError();

  let abortHandler = null;
  let timeoutId = null;
  const stopPromise = new Promise((_, reject) => {
    abortHandler = () => reject(nativeAbortError());
    signal?.addEventListener('abort', abortHandler, { once: true });
    timeoutId = setTimeout(() => reject(nativeAbortError(`AI 响应超时（${Math.round(timeout / 1000)}秒）`)), timeout);
  });

  let requestData = options.body;
  const contentType = Object.entries(options.headers || {})
    .find(([key]) => key.toLowerCase() === 'content-type')?.[1] || '';
  if (typeof requestData === 'string' && String(contentType).includes('application/json')) {
    try { requestData = JSON.parse(requestData); } catch (_) {}
  }

  try {
    const nativeRequest = http.request({
      url,
      method: options.method || 'GET',
      headers: options.headers || {},
      data: requestData,
      responseType: 'text',
      connectTimeout: timeout,
      readTimeout: timeout,
    });
    const nativeResponse = await Promise.race([nativeRequest, stopPromise]);
    const responseBody = typeof nativeResponse?.data === 'string'
      ? nativeResponse.data
      : JSON.stringify(nativeResponse?.data ?? {});
    return new Response(responseBody, {
      status: Number(nativeResponse?.status) || 500,
      headers: nativeResponse?.headers || {},
    });
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
    if (abortHandler) signal?.removeEventListener('abort', abortHandler);
  }
}

function nativeStreamingBridge() {
  return globalThis.XiangsiStream?.start ? globalThis.XiangsiStream : null;
}

function decodeNativeStreamChunk(value = '') {
  if (!value) return '';
  const binary = atob(value);
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

function nativeSseFetchResponse(url, options = {}, onProgress = null) {
  const bridge = nativeStreamingBridge();
  if (!bridge) throw new Error('当前安装包缺少原生流式通道，请重新打包安装');
  const requestId = `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const signal = options.signal;

  return new Promise((resolve, reject) => {
    const startedAt = performance.now();
    let status = 0;
    let contentType = 'text/event-stream';
    let raw = '';
    let generatedText = '';
    let reasoningText = '';
    let settled = false;
    let firstChunkLogged = false;

    const cleanup = () => {
      window.removeEventListener('xiangsi:native-stream', onNativeEvent);
      signal?.removeEventListener('abort', onAbort);
    };
    const finishReject = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };
    const onAbort = () => {
      try { bridge.cancel?.(requestId); } catch (_) {}
      finishReject(nativeAbortError());
    };
    const reportPayload = (payload) => {
      if (!payload || payload === '[DONE]') return;
      try {
        const chunk = unwrapChatCompletionPayload(JSON.parse(payload));
        const choice = chunk?.choices?.[0] || {};
        const deltaText = contentToText(choice?.delta?.content);
        const fullText = contentToText(choice?.message?.content) || contentToText(chunk?.output_text);
        const deltaReasoning = contentToText(choice?.delta?.reasoning_content) || contentToText(choice?.delta?.reasoning);
        const fullReasoning = contentToText(choice?.message?.reasoning_content)
          || contentToText(choice?.message?.reasoning)
          || contentToText(chunk?.reasoning_content);
        if (deltaText) generatedText += deltaText;
        else if (fullText && !generatedText) generatedText = fullText;
        if (deltaReasoning) reasoningText += deltaReasoning;
        else if (fullReasoning && !reasoningText) reasoningText = fullReasoning;
        if ((deltaText || fullText || deltaReasoning || fullReasoning) && typeof onProgress === 'function') {
          onProgress({ text: generatedText, reasoning: reasoningText });
        }
      } catch (_) {
        // 心跳、注释事件或非 JSON data 行不应中断整个生成。
      }
    };
    const onNativeEvent = (event) => {
      const detail = event?.detail || {};
      if (detail.id !== requestId || settled) return;
      if (detail.type === 'headers') {
        status = Number(detail.status) || 0;
        contentType = detail.contentType || contentType;
        logRuntime('info', 'api', '安卓流式通道收到响应头', {
          status,
          contentType,
          elapsedMs: Math.round(performance.now() - startedAt),
        });
        return;
      }
      if (detail.type === 'chunk') {
        const text = decodeNativeStreamChunk(detail.data);
        raw += text;
        if (!firstChunkLogged) {
          firstChunkLogged = true;
          logRuntime('info', 'api', '安卓流式通道收到首段数据', {
            elapsedMs: Math.round(performance.now() - startedAt),
            startsWithData: text.trim().startsWith('data:'),
          });
        }
        const line = text.trim();
        if (line.startsWith('data:')) reportPayload(line.slice(5).trim());
        return;
      }
      if (detail.type === 'error') {
        logRuntime('error', 'api', '安卓流式通道中断', {
          elapsedMs: Math.round(performance.now() - startedAt),
          error: detail.message || '未知错误',
        });
        finishReject(new Error(detail.message || '安卓流式连接中断'));
        return;
      }
      if (detail.type === 'done') {
        settled = true;
        cleanup();
        resolve(new Response(raw, {
          status: status || 500,
          headers: { 'Content-Type': contentType || 'text/event-stream' },
        }));
      }
    };

    if (signal?.aborted) {
      finishReject(nativeAbortError());
      return;
    }
    window.addEventListener('xiangsi:native-stream', onNativeEvent);
    signal?.addEventListener('abort', onAbort, { once: true });
    try {
      bridge.start(requestId, url, JSON.stringify(options.headers || {}), String(options.body || ''));
    } catch (error) {
      finishReject(error);
    }
  });
}

function trimApiBase(value, fallback = '') {
  return String(value || fallback).trim().replace(/\/+$/, '');
}

function isLocalPreview() {
  if (isNativeApp()) return false;
  const h = window.location.hostname;
  if (h === '127.0.0.1' || h === 'localhost' || h === '[::1]') return true;
  // 局域网私有网段：手机通过电脑局域网 IP 访问时也走本地代理，避免 CORS
  return /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.)/.test(h);
}

function contentToText(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content.map((part) => {
    if (typeof part === 'string') return part;
    return part?.text || part?.content || '';
  }).join('');
}

function textFromCompletionChunk(data) {
  const choice = data?.choices?.[0];
  return contentToText(choice?.delta?.content)
    || contentToText(choice?.message?.content)
    || contentToText(data?.output_text);
}

function unwrapChatCompletionPayload(payload, depth = 0) {
  if (depth > 4) return payload;
  if (typeof payload === 'string') {
    const text = payload.trim();
    if (!text || !/^[\[{]/.test(text)) return payload;
    try {
      return unwrapChatCompletionPayload(JSON.parse(text), depth + 1);
    } catch {
      return payload;
    }
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return payload;

  // 部分中转服务会把 OpenAI 兼容响应再次 JSON.stringify 后塞进 data。
  // 只有外层本身没有 choices 时才解包，避免误碰标准响应中的业务 data 字段。
  if (!Array.isArray(payload.choices) && payload.data != null) {
    const nested = unwrapChatCompletionPayload(payload.data, depth + 1);
    if (nested && typeof nested === 'object') return nested;
  }
  return payload;
}

function emptyChatCompletionMessage(data) {
  const choice = data?.choices?.[0] || {};
  const finishReason = choice.finish_reason || data?.finish_reason || '';
  const reasoning = contentToText(choice?.message?.reasoning_content)
    || contentToText(choice?.message?.reasoning)
    || contentToText(choice?.delta?.reasoning_content)
    || contentToText(choice?.delta?.reasoning)
    || contentToText(data?.reasoning_content);

  if (reasoning && finishReason === 'length') {
    return '模型的思考内容已占满输出上限，还没生成正文。请提高“最大输出 Tokens”，或降低/关闭思考模式后重试';
  }
  if (reasoning) return '模型只返回了思考内容，没有生成正文，请重试或调整模型的思考设置';
  if (finishReason === 'length') return '模型回复已达到输出长度上限，但没有生成可显示的正文';
  if (finishReason === 'content_filter') return '模型回复被内容安全规则拦截，没有生成可显示的正文';
  return 'API 已返回，但没有生成可显示的正文';
}

async function parseChatCompletionResponse(response) {
  const raw = await response.text();
  const trimmed = raw.trim();
  if (!trimmed) throw new Error('API 返回内容为空');

  const contentType = response.headers.get('content-type') || '';
  const looksLikeEventStream = contentType.includes('text/event-stream')
    || /^data\s*:/m.test(trimmed);

  if (looksLikeEventStream) {
    let reply = '';
    let reasoning = '';
    let lastChunk = null;
    const lines = trimmed.split(/\r?\n/);
    for (const line of lines) {
      const normalized = line.trim();
      if (!normalized.startsWith('data:')) continue;
      const payload = normalized.slice(5).trim();
      if (!payload || payload === '[DONE]') continue;
      try {
        const chunk = unwrapChatCompletionPayload(JSON.parse(payload));
        lastChunk = chunk;
        reply += textFromCompletionChunk(chunk);
        const choice = chunk?.choices?.[0] || {};
        reasoning += contentToText(choice?.delta?.reasoning_content)
          || contentToText(choice?.delta?.reasoning)
          || contentToText(choice?.message?.reasoning_content)
          || contentToText(choice?.message?.reasoning);
      } catch {
        // 某些兼容服务会夹带心跳或非 JSON 事件；跳过，不中断整条回复。
      }
    }
    if (reply) return { choices: [{ message: { content: reply, ...(reasoning ? { reasoning_content: reasoning } : {}) } }] };
    if (lastChunk) return lastChunk;
    throw new Error('API 返回了流式数据，但没有找到回复文字');
  }

  try {
    return unwrapChatCompletionPayload(JSON.parse(trimmed));
  } catch {
    throw new Error(`API 返回格式无法识别：${trimmed.slice(0, 100)}`);
  }
}

async function callChatApi(userText, historyMessages = activeChat?.messages || [], options = {}) {
  // 多轮询只决定本次请求使用的组合；随机本身不会增加请求次数。
  const pollingSelection = pickPollingSelection();
  const replyPersona = pollingSelection.persona || activePersona();
  const replyPreset = pollingSelection.preset || activePreset();
  lastReplyPersonaId = replyPersona.id;
  lastReplyReasoningText = '';
  const api = pollingSelection.api || activeApi();
  if (!api || !api.url || !api.key) {
    throw new Error('请先在设置中配置 API 链接（API链接 → 新建 → 填入地址和密钥）');
  }

  const configuredModel = api.model || modelSettings.model;
  if (!configuredModel || configuredModel === '手动选择') {
    throw new Error('请先选择一个 AI 模型（API链接 → 编辑 → 选择模型）');
  }

  const apiUrl = api.url.replace(/\/+$/, '');
  let model = canonicalChatModelId(apiUrl, configuredModel);
  const requestChat = activeChat;
  const buildStart = performance.now();
  const chatMessages = await buildChatMessages(userText, historyMessages, replyPersona, { ...options, presetOverride: replyPreset });
  const buildMs = Math.round(performance.now() - buildStart);
  const parameterResolution = resolveRequestParameters(api, replyPreset);
  const compatibility = providerCompatibleParameters(
    apiUrl,
    model,
    parameterResolution.params,
    configuredModel,
    api.disableThinking === true,
  );
  let requestBody = { model, messages: chatMessages, ...compatibility.params };
  // 新安装包由原生桥接逐行读取 SSE。只有旧安装包尚无桥接时才退回完整 JSON，
  // 避免再次落入 Capacitor fetch 等不到流结束的状态。
  const nativeStreamActive = isNativeApp() && requestBody.stream === true && !!nativeStreamingBridge();
  const androidStreamFallback = isNativeApp() && requestBody.stream === true && !nativeStreamActive;
  if (androidStreamFallback) requestBody.stream = false;
  const { messages: ignoredLoggedMessages, ...loggedRequestParameters } = requestBody;
  lastRequestPreviewMessages = chatMessages;
  if (lastRequestContextReport) {
    lastRequestContextReport.request = {
      endpoint: `${apiUrl}/chat/completions`,
      viaProxy: isLocalPreview(),
      parameterSource: parameterResolution.source,
      provider: compatibility.provider,
      nativeStreamActive,
      androidStreamFallback,
      normalizedModel: model !== configuredModel ? `${configuredModel} → ${model}` : '',
      removedParameters: compatibility.removed,
      ...requestBody,
      messages: undefined,
    };
    lastRequestContextReport.buildMs = buildMs;
    lastRequestContextReport.replyPersonaLabel = replyPersona?.label || activePersona().label;
    lastRequestContextReport.pollingActive = isPollingActive();
    lastRequestContextReport.pollingMode = pollingSelection.mode;
    lastRequestContextReport.generationType = options.generationType || 'normal';
    lastRequestContextReport.antiRepeat = options.generationType === 'regenerate' ? {
      rejectedAttemptCount: Number(options.antiRepeat?.rejectedAttemptCount) || 0,
      uniqueRejectedCount: Number(options.antiRepeat?.uniqueRejectedCount) || 0,
      direction: String(options.antiRepeat?.direction || ''),
      salt: String(options.antiRepeat?.salt || ''),
    } : null;
    lastRequestContextReport.response = { state: 'pending', ok: null, httpStatus: null };
  }
  const contextRequestLog = recordContextRequest(
    requestChat,
    userText,
    api,
    model,
    chatMessages,
    requestBody,
    lastRequestContextReport,
  );
  const updateRequestResult = (patch = {}) => {
    const responseResult = {
      ...(lastRequestContextReport?.response || {}),
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    if (lastRequestContextReport) lastRequestContextReport.response = responseResult;
    if (contextRequestLog) contextRequestLog.response = { ...responseResult };
    saveChatHistoriesToCache();
    renderContextLog();
  };
  renderContextLog();

  logRuntime('info', 'api', '发起聊天请求', {
    apiUrl: `${apiUrl}/chat/completions`,
    model,
    msgCount: chatMessages.length,
    systemTokens: chatMessages[0]?.content?.length || 0,
    buildMs,
    viaProxy: isLocalPreview(),
    nativeStreamActive,
    androidStreamFallback,
    parameterSource: parameterResolution.source,
    modelCustomParamsEnabled: api.useCustomParams === true,
    disableThinking: api.disableThinking === true,
    parameterKeys: Object.keys(compatibility.params),
    parameterValues: loggedRequestParameters,
    normalizedModel: model !== configuredModel ? `${configuredModel} → ${model}` : '',
    removedParameters: compatibility.removed,
    generationType: options.generationType || 'normal',
  });

  const controller = new AbortController();
  // 原生流式会立刻交付已经生成的片段；仍保留总期限，确保断线请求最终停止转圈。
  const requestTimeoutMs = isNativeApp() ? 300000 : 120000;
  const requestTimeoutSeconds = Math.round(requestTimeoutMs / 1000);
  let timeoutId = null;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      reject(nativeAbortError(`AI 响应超时（${requestTimeoutSeconds}秒）`));
    }, requestTimeoutMs);
  });

  try {
    const captureProgress = (progress = {}) => {
      const reasoning = String(progress.reasoning || '');
      if (reasoning) lastReplyReasoningText = reasoning;
      if (typeof options.onProgress === 'function') options.onProgress(progress);
    };
    // 普通聊天、轮询和重刷都从这里走统一的模型失效恢复：
    // 400 模型不存在 → 动态刷新 /models → 明确匹配时自动纠正并只重试一次。
    const requestResult = await Promise.race([
      postChatCompletionWithModelRecovery(api, requestBody, controller.signal, captureProgress),
      timeoutPromise,
    ]);
    const response = requestResult.response;
    if (requestResult.recoveredFrom && requestResult.model !== model) {
      model = requestResult.model;
      requestBody = { ...requestBody, model };
      if (lastRequestContextReport?.request) {
        lastRequestContextReport.request.model = model;
        lastRequestContextReport.request.normalizedModel = `${requestResult.recoveredFrom} → ${model}`;
      }
      if (contextRequestLog) contextRequestLog.model = model;
      showToast(`模型已自动更新：${requestResult.recoveredFrom} → ${model}`);
    }

    logRuntime('info', 'api', '收到 HTTP 响应', { status: response.status, ok: response.ok, viaProxy: isLocalPreview() });
    const upstreamRequestId = response.headers.get('x-request-id')
      || response.headers.get('request-id')
      || response.headers.get('x-trace-id')
      || '';
    updateRequestResult({
      state: response.ok ? 'received' : 'failed',
      ok: response.ok,
      httpStatus: response.status,
      requestId: upstreamRequestId,
    });

    if (!response.ok) {
      const errBody = await Promise.race([response.text().catch(() => ''), timeoutPromise]);
      throw new Error(friendlyChatApiError(response.status, errBody, api, model));
    }

    const parseStart = performance.now();
    const data = await Promise.race([parseChatCompletionResponse(response), timeoutPromise]);
    logRuntime('info', 'api', '解析 API 响应完成', { parseMs: Math.round(performance.now() - parseStart) });
    const responseChoice = data?.choices?.[0] || {};
    const returnedReasoning = contentToText(responseChoice?.message?.reasoning_content)
      || contentToText(responseChoice?.message?.reasoning)
      || contentToText(responseChoice?.delta?.reasoning_content)
      || contentToText(data?.reasoning_content);
    if (returnedReasoning) lastReplyReasoningText = returnedReasoning;
    let reply = contentToText(responseChoice?.message?.content) || textFromCompletionChunk(data);
    logRuntime('info', 'api', '提取回复内容', { hasReply: !!reply, replyLength: reply?.length || 0 });
    if (!reply) {
      const choice = data?.choices?.[0] || {};
      logRuntime('error', 'api', 'API 未生成可显示正文', {
        finishReason: choice.finish_reason || data?.finish_reason || '',
        hasReasoning: !!(choice?.message?.reasoning_content || choice?.delta?.reasoning_content || data?.reasoning_content),
        responseFields: Object.keys(data || {}).slice(0, 12),
      });
      throw new Error(emptyChatCompletionMessage(data));
    }
    // 正则处理：对 AI 回复做文本清洗（去前缀、去思维链等）
    // 模型常会在正文前后附带换行；pre-wrap 会把它们显示成一整行“假内边距”。
    reply = applyRegexRules(reply).trim();

    const rejectedCandidates = rejectedReplyAttempts(options.antiRepeat?.rejectedCandidates, 15);
    const normalizedReply = normalizeReplyForComparison(reply);
    const duplicateCandidateNumbers = options.generationType === 'regenerate'
      ? rejectedCandidates.reduce((numbers, candidate, index) => {
          if (normalizeReplyForComparison(candidate) === normalizedReply) numbers.push(index + 1);
          return numbers;
        }, [])
      : [];
    updateRequestResult({
      state: 'completed',
      ok: true,
      reply,
      duplicate: duplicateCandidateNumbers.length > 0,
      duplicateCandidateNumber: duplicateCandidateNumbers[0] || null,
      duplicateCandidateNumbers,
    });

    logRuntime('info', 'api', '收到 AI 回复', { reply: reply.slice(0, 100), model });
    return reply;
  } catch (err) {
    const receivedHttpStatus = lastRequestContextReport?.response?.httpStatus;
    updateRequestResult({
      state: 'failed',
      ...(receivedHttpStatus ? {} : { ok: false }),
      error: String(err?.message || err),
    });
    if (err.name === 'AbortError') {
      logRuntime('error', 'api', `请求超时（${requestTimeoutSeconds}秒）`, { error: err.message });
      throw new Error(`AI 响应超时（${requestTimeoutSeconds}秒），请求已停止；请检查网络或 API 状态后再次重刷`);
    }
    if (!navigator.onLine) {
      logRuntime('error', 'api', '设备离线', {});
      throw new Error('当前网络不可用，请检查网络连接');
    }
    logRuntime('error', 'api', 'API 请求异常', { error: err.message });
    throw err;
  } finally {
    // 必须覆盖获取响应头、读取正文和解析全过程；提前清除会让流式正文永久等待。
    if (timeoutId) clearTimeout(timeoutId);
  }
}

/**
 * 按启用的正则规则处理文本（查找/替换，全局匹配，支持 $1/$2 捕获组）。
 * 当前作用于 AI 回复（相当于 Tavo 的「接收时 / 角色消息」时机）。
 */
function memorySummaryApi() {
  return apiLinks.find((api) => api.id === memorySettings.summaryApiId && api.enabled !== false)
    || effectiveApi(currentRole, activePersona());
}

function memorySummaryUpdateContext(memory) {
  const anchors = memory.anchors || defaultMemoryAnchors();
  const selections = memory.promptSelections || defaultMemoryPromptSelections();
  const updateAnchors = Object.values(anchors).filter((item) => item.updateEnabled).map((item) => ({ id: item.id, name: item.name, currentValue: item.value, updatePrompt: resolveMemoryPrompt(item.id, selections[item.id]).content }));
  const customStates = normalizeCustomStates(memory.customStates).filter((item) => item.updateEnabled).map((item) => ({ id: item.id, name: item.name, currentValue: item.value, valueType: item.valueType, min: item.min, max: item.max, unit: item.unit, updatePrompt: resolveMemoryPrompt('customState', item.promptId).content }));
  const relationshipsEnabled = memory.sectionControls?.relationships?.updateEnabled !== false;
  const openPlotsEnabled = memory.sectionControls?.openPlots?.updateEnabled !== false;
  const summariesEnabled = memory.sectionControls?.summaries?.updateEnabled !== false;
  return {
    enabledOutput: {
      plotSummary: summariesEnabled,
      anchorUpdates: updateAnchors.map((item) => item.id),
      relationshipUpdates: relationshipsEnabled,
      openPlotOps: openPlotsEnabled,
      customStateUpdates: customStates.map((item) => item.id),
    },
    anchors: updateAnchors,
    modulePrompts: {
      relationships: relationshipsEnabled ? resolveMemoryPrompt('relationships', selections.relationships).content : '',
      openPlots: openPlotsEnabled ? resolveMemoryPrompt('openPlots', selections.openPlots).content : '',
      summaries: summariesEnabled ? resolveMemoryPrompt('summaries', selections.summaries).content : '',
    },
    relationshipCards: relationshipsEnabled ? normalizeRelationshipCards(memory.relationshipCards) : [],
    openPlots: openPlotsEnabled ? normalizeOpenPlots(memory.openPlots) : [],
    customStates,
  };
}

async function callMemorySummaryApi(chat, sourceMessages, { signal, memoryContext } = {}) {
  const api = memorySummaryApi();
  if (!api?.url || !api?.key) throw new Error('请先在“记忆 API”里填写总结 API 链接和密钥');
  const configuredModel = api.model || modelSettings.model;
  if (!configuredModel || configuredModel === '手动选择') throw new Error('总结 API 还没有选择模型');
  const apiUrl = api.url.replace(/\/+$/, '');
  let model = canonicalChatModelId(apiUrl, configuredModel);
  const memory = memoryContext || ensureChatMemory(chat);
  const transcript = sourceMessages.map((message, index) => {
    const speaker = message.role === 'user' ? (chat.userName || userProfile.name || '{{user}}') : (chat.characterName || currentRole.name || '{{char}}');
    return `${index + 1}. ${speaker}：${message.text}`;
  }).join('\n');
  const updateContext = memorySummaryUpdateContext(memory);
  const summaryPrompt = resolveMemoryPrompt('summary', memory.promptSelections?.summary).content;
  const messagesForSummary = [
    { role: 'system', content: `${replacePromptMacros(summaryPrompt)}\n\n${MEMORY_DYNAMIC_PROMPT}` },
    { role: 'user', content: `请依据【启用的更新项目】和【新对话】返回增量 JSON。第一个字符必须是 {，最后一个字符必须是 }；禁止解释、思考过程、Markdown 或代码框。\n\n允许的 JSON 字段：\n{"plotSummary":"本批剧情纪要","anchorUpdates":{"currentTime":"新值","currentLocation":"新值"},"relationshipUpdates":[{"source":"人物甲","target":"人物乙","currentRelation":"准确的自由关系文字","tags":["可选标签"],"evidence":"本批原文","reason":"正式变化原因"}],"openPlotOps":{"upsert":[{"id":"已有id可复用","title":"未完剧情","details":"当前进展","people":"相关人物","status":"进行中","evidence":"本批原文"}],"resolve":[{"id":"已有id","outcome":"如何解决"}]},"customStateUpdates":[{"id":"启用项目id","value":"新值","evidence":"本批原文"}],"keywords":["检索词"]}\n\n关闭更新的字段必须完全省略。relationshipUpdates 只有关系正式确立或质变时才返回；同一人物对使用已有关系卡。openPlotOps 只处理未完事项，普通动作不建条目。\n\n【启用的更新项目与当前值】\n${JSON.stringify(updateContext, null, 2)}\n\n【新对话】\n${transcript}` },
  ];
  let body = { model, messages: messagesForSummary, temperature: 0.2, max_tokens: 2500, stream: false };
  if (/^hy3(?:-preview)?$/i.test(model)) {
    body.response_format = { type: 'json_object' };
    body.thinking = { type: 'disabled' };
    body.max_tokens = 3200;
  }
  const requestResult = await postChatCompletionWithModelRecovery(api, body, signal);
  const response = requestResult.response;
  if (requestResult.recoveredFrom && requestResult.model !== model) {
    model = requestResult.model;
    body = { ...body, model };
    showToast(`总结模型已自动更新：${requestResult.recoveredFrom} → ${model}`);
  }
  if (!response.ok) throw new Error(`总结 API 错误 ${response.status}：${(await response.text()).slice(0, 160)}`);
  const data = await parseChatCompletionResponse(response);
  const choice = data.choices?.[0] || {};
  const raw = contentToText(choice.message?.content)
    || contentToText(choice.message?.reasoning_content)
    || textFromCompletionChunk(data);
  const parsed = parseMemorySummaryJson(raw);
  const normalized = normalizeMemorySummaryResult(parsed);
  if (hasMeaningfulMemoryResult(normalized)) return normalized;
  if (choice.finish_reason === 'length') throw new Error('总结回复因长度限制被截断，请把“每多少条消息总结”调到 10–20 后继续');
  throw new Error(parsed
    ? '总结模型返回了 JSON，但没有可识别的记忆字段；请继续重试，程序不会推进本批进度'
    : '总结模型返回了文字，但没有形成完整 JSON；已自动清理思考内容和代码框仍无法识别');
}

/* 用模型返回的 evidence（原文片段）在资料分块里定位来源段落。
   先整段包含，再逐步缩短前缀匹配；找不到返回空串（关系仍保留，只是没有来源）。 */
function locateEvidenceDocId(evidence, documents) {
  const ev = String(evidence || '').trim();
  if (!ev || !Array.isArray(documents) || !documents.length) return '';
  let hit = documents.find((doc) => doc.text.includes(ev));
  if (hit) return hit.id;
  for (let len = Math.min(40, ev.length); len >= 8; len -= 4) {
    hit = documents.find((doc) => doc.text.includes(ev.slice(0, len)));
    if (hit) return hit.id;
  }
  const mid = ev.slice(0, 24);
  hit = mid ? documents.find((doc) => doc.text.includes(mid)) : null;
  return hit ? hit.id : '';
}

function batchTargetSceneDocuments(documents, maxChars = 5000) {
  const limit = Math.max(500, Number(maxChars) || 5000);
  const batches = [];
  let current = [];
  let length = 0;
  (Array.isArray(documents) ? documents : []).forEach((document) => {
    const text = String(document?.text || '').trim();
    if (!text) return;
    if (current.length && length + text.length > limit) {
      batches.push(current);
      current = [];
      length = 0;
    }
    current.push(document);
    length += text.length;
  });
  if (current.length) batches.push(current);
  return batches;
}

function parsedKnowledgePayloadObjects(raw) {
  const source = String(raw || '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<analysis>[\s\S]*?<\/analysis>/gi, '')
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  const parsed = [];
  [...new Set([source, ...balancedJsonObjects(source)].filter(Boolean))].forEach((candidate) => {
    try {
      const value = JSON.parse(candidate);
      if (value && typeof value === 'object') parsed.push(value);
    } catch (_) {}
  });
  return parsed;
}

function knowledgePayloadScopes(objects) {
  const scopes = [];
  const queue = (Array.isArray(objects) ? objects : []).map((value) => ({ value, depth: 0 }));
  const seen = new Set();
  while (queue.length) {
    const { value, depth } = queue.shift();
    if (!value || typeof value !== 'object' || Array.isArray(value) || seen.has(value)) continue;
    seen.add(value);
    scopes.push(value);
    if (depth >= 3) continue;
    ['data', 'result', 'output'].forEach((key) => {
      if (value[key] && typeof value[key] === 'object') queue.push({ value: value[key], depth: depth + 1 });
    });
  }
  return scopes;
}

function knowledgePayloadRows(scopes, keys) {
  return (Array.isArray(scopes) ? scopes : []).flatMap((scope) => {
    const value = keys.map((key) => scope?.[key]).find((item) => item != null);
    if (Array.isArray(value)) return value;
    return value && typeof value === 'object' ? [value] : [];
  });
}

function shouldAdvanceKnowledgeExtractionBatch(payload) {
  return payload?.schemaRecognized === true;
}

function validateKnowledgeExtractionBatch(payload, raw = '') {
  if (shouldAdvanceKnowledgeExtractionBatch(payload)) return payload;
  const hasJson = parsedKnowledgePayloadObjects(raw).length > 0;
  throw new Error(hasJson
    ? '总结模型返回了 JSON，但没有约定的情境演绎字段；本批不会计入进度，请检查响应日志或更换整理模型后继续'
    : '总结模型没有返回可识别的 JSON；本批不会计入进度，请更换整理模型或提示词后继续');
}

function nextKnowledgeEmptyPerformanceStreak(previous, payload) {
  return Array.isArray(payload?.performanceCards) && payload.performanceCards.length
    ? 0
    : Math.max(0, Number(previous) || 0) + 1;
}

function validateKnowledgeEmptyPerformanceStreak(streak) {
  if (Number(streak) < 5) return;
  throw new Error('连续 5 批都没有生成情境演绎卡，当前批不会计入进度；请检查目标角色名字、整理提示词或更换整理模型后继续');
}

function recoverLegacyEmptyKnowledgeProgress(value) {
  const state = normalizeKnowledgePerformanceState(value, value?.targetCharacters?.[0]?.primaryName || '');
  const progress = state.extractionProgress;
  const discardedProgress = Math.max(0, Number(progress.completed) || 0);
  const hasDerivedCards = state.performanceCards.length > 0 || state.roleProfiles.length > 0;
  const hasProcessedDocuments = Object.values(progress.processedByTarget || {}).some((item) => item.docIds?.length);
  const interrupted = ['running', 'stopped', 'failed'].includes(progress.status);
  if (!interrupted || hasDerivedCards || discardedProgress < 3 || !hasProcessedDocuments) return { state, recovered: false, discardedProgress: 0 };
  const processedByTarget = Object.fromEntries(Object.entries(progress.processedByTarget || {}).map(([targetId, item]) => [targetId, {
    ...item,
    terms: [],
    docIds: [],
    profileDirty: false,
  }]));
  const recoveredState = normalizeKnowledgePerformanceState({
    ...state,
    extractionProgress: {
      ...progress,
      status: '',
      stage: '',
      completed: 0,
      total: 0,
      resumeFrom: 0,
      runCompleted: 0,
      runTotal: 0,
      error: '',
      processedByTarget,
    },
  }, state.targetCharacters[0]?.primaryName || '');
  return { state: recoveredState, recovered: true, discardedProgress };
}

function extractTargetKnowledgePayload(raw, target, batchDocuments, groupId = '', sourceName = '') {
  const objects = parsedKnowledgePayloadObjects(raw);
  const scopes = knowledgePayloadScopes(objects);
  const cardKeys = ['performanceCards', 'performance_cards', 'performanceCard', 'performance_card', 'situationCards', 'situation_cards', 'cards', '情境演绎卡', '情境演绎'];
  const aliasKeys = ['aliasCandidates', 'alias_candidates', 'aliases', '候选别名'];
  const schemaKeys = [...cardKeys, ...aliasKeys, 'characters', 'characterCatalog', 'character_catalog', '角色目录', '人物目录', 'triples', 'relationTriples', 'relation_triples', 'relations', 'relationships', '三元组', '关系'];
  const cardRows = knowledgePayloadRows(scopes, cardKeys);
  const aliasRows = knowledgePayloadRows(scopes, aliasKeys);
  const targetNames = new Set([target?.primaryName, ...(target?.aliases || [])].map((name) => String(name || '').trim().toLocaleLowerCase()).filter(Boolean));
  const performanceCards = normalizePerformanceCards(cardRows.map((item) => {
    const itemTargetName = String(item?.targetName || item?.target_name || item?.character || item?.name || target?.primaryName || '').trim();
    if (itemTargetName && !targetNames.has(itemTargetName.toLocaleLowerCase())) return null;
    const excerpt = String(item?.excerpt || item?.originalExcerpt || item?.original_excerpt || item?.sourceExcerpt || item?.source_excerpt || item?.evidence || item?.quote || item?.['原文片段'] || item?.['原文证据'] || '').trim();
    return {
      targetId: target.id,
      sourceGroupId: groupId,
      sourceDocId: locateEvidenceDocId(excerpt, batchDocuments),
      sourceName,
      situationTags: item?.situationTags || item?.situation_tags || item?.tags || item?.['情境标签'],
      relationshipContext: item?.relationshipContext || item?.relationship_context || item?.relationshipStage || item?.relationship_stage || item?.['关系阶段'],
      trigger: item?.trigger || item?.triggerEvent || item?.trigger_event || item?.['触发事件'],
      innerMotive: item?.innerMotive || item?.inner_motive || item?.motivation || item?.['内在动机'],
      outwardResponse: item?.outwardResponse || item?.outward_response || item?.reaction || item?.['外在反应'],
      speechPattern: item?.speechPattern || item?.speech_pattern || item?.speech || item?.['语言方式'],
      actionPattern: item?.actionPattern || item?.action_pattern || item?.action || item?.['动作方式'],
      avoid: item?.avoid || item?.avoidBehavior || item?.avoid_behavior || item?.['避免行为'],
      excerpt,
    };
  }).filter(Boolean));
  const aliasCandidates = normalizeAliasCandidates(aliasRows.map((item) => {
    const itemTargetName = String(item?.targetName || item?.target_name || item?.character || target?.primaryName || '').trim();
    if (itemTargetName && !targetNames.has(itemTargetName.toLocaleLowerCase())) return null;
    const name = String(item?.alias || item?.name || item?.['别名'] || '').trim();
    const evidence = String(item?.evidence || item?.quote || item?.['原文证据'] || '').trim();
    const evidenceDocId = locateEvidenceDocId(evidence, batchDocuments);
    if (!name || !evidence || !evidenceDocId || targetNames.has(name.toLocaleLowerCase())) return null;
    return { targetId: target.id, name, evidence, evidenceDocIds: [evidenceDocId], status: 'pending' };
  }).filter(Boolean), [target]);
  return {
    schemaRecognized: scopes.some((scope) => schemaKeys.some((key) => Object.prototype.hasOwnProperty.call(scope, key))),
    performanceCards,
    aliasCandidates,
    characters: extractCharacterCatalog(raw),
    triples: extractRelationTriples(raw),
  };
}

function extractRoleProfilePayload(raw, target, groupId = '', sourceName = '', evidenceDocIds = []) {
  const objects = parsedKnowledgePayloadObjects(raw);
  const row = objects.map((value) => value.roleProfile || value.profile || value['角色本色'] || value.data?.roleProfile).find((value) => value && typeof value === 'object');
  if (!row) return null;
  return normalizeRoleProfiles([{
    targetId: target.id,
    name: target.primaryName,
    identity: row.identity || row['身份'],
    coreTraits: row.coreTraits || row.traits || row['稳定性格'],
    values: row.values || row['价值观'],
    speechPatterns: row.speechPatterns || row.speechStyle || row['语言习惯'],
    actionPatterns: row.actionPatterns || row['动作习惯'],
    taboos: row.taboos || row.avoid || row['禁忌'],
    evidenceDocIds,
    sourceGroupId: groupId,
    sourceName,
    updatedAt: new Date().toISOString(),
  }], [target])[0] || null;
}

async function buildKnowledgeGraphForGroup(groupId, chat = activeChat, onProgress, options = {}) {
  const { reset = false, signal = null } = options || {};
  const api = memorySummaryApi();
  if (!api?.url || !api?.key) throw new Error('请先在“记忆 API”中配置总结 API');
  const configuredModel = api.model || modelSettings.model;
  if (!configuredModel || configuredModel === '手动选择') throw new Error('总结 API 还没有选择模型');
  const roleId = chat?.roleId || currentRole.id;
  const groups = memoryDocumentGroups('role', '', roleId);
  const currentIndex = groups.findIndex((group) => group.groupId === groupId);
  const group = groups[currentIndex];
  if (!group) throw new Error('没有找到这份知识库资料');
  let triples = normalizeRelationTriples(group.relationTriples);
  let characterCatalog = normalizeCharacterCatalog(group.characterCatalog);
  let performanceState = normalizeKnowledgePerformanceState(group, currentRole?.name || group.targetCharacters?.[0]?.primaryName || '');
  if (reset) {
    performanceState = normalizeKnowledgePerformanceState({
      ...performanceState,
      roleProfiles: [],
      performanceCards: [],
      extractionProgress: {},
    }, currentRole?.name || performanceState.targetCharacters[0]?.primaryName || '');
  }
  const legacyRecovery = reset ? { state: performanceState, recovered: false, discardedProgress: 0 } : recoverLegacyEmptyKnowledgeProgress(performanceState);
  performanceState = legacyRecovery.state;
  if (legacyRecovery.recovered) {
    logRuntime('warn', 'memory', '检测到旧版无成果假进度，已准备重新处理', {
      libraryName: group.libraryName,
      discardedProgress: legacyRecovery.discardedProgress,
    });
  }
  const enabledTargets = performanceState.targetCharacters.filter((target) => target.enabled !== false);
  if (!enabledTargets.length) throw new Error('请先启用至少一位目标角色');
  const groupDocs = memoryDocuments
    .filter((document) => document.groupId === groupId && String(document.text || '').trim())
    .sort((left, right) => (Number(left.sceneIndex) || 0) - (Number(right.sceneIndex) || 0) || String(left.createdAt || '').localeCompare(String(right.createdAt || '')));
  if (!groupDocs.length) throw new Error('这份资料没有可整理的正文');
  const targetWork = enabledTargets.map((target) => {
    const targetProgress = performanceState.extractionProgress.processedByTarget[target.id] || { terms: [], docIds: [], profileDirty: false };
    const documents = selectTargetSceneDocuments(groupDocs, target, new Set(targetProgress.docIds));
    return { target, documents, batches: batchTargetSceneDocuments(documents, 5000) };
  });
  const sceneBatchTotal = targetWork.reduce((sum, item) => sum + item.batches.length, 0);
  const profileTargetIds = new Set(targetWork.filter((item) => item.batches.length || performanceState.extractionProgress.processedByTarget[item.target.id]?.profileDirty || !performanceState.roleProfiles.some((profile) => profile.targetId === item.target.id)).map((item) => item.target.id));
  if (!sceneBatchTotal && !profileTargetIds.size) {
    return { characters: characterCatalog.length, relations: triples.length, profiles: performanceState.roleProfiles.length, cards: performanceState.performanceCards.length, skipped: true };
  }
  if (!sceneBatchTotal && !performanceState.performanceCards.some((card) => profileTargetIds.has(card.targetId))) {
    const names = enabledTargets.map((target) => [target.primaryName, ...target.aliases].join('／')).join('、');
    throw new Error(`原文中没有找到目标名字：${names}。请检查姓名，或先手动添加别名。`);
  }
  const model = canonicalChatModelId(api.url.replace(/\/+$/, ''), configuredModel);
  const promptSelections = normalizeKnowledgePromptSelections(group.knowledgePromptSelections || group);
  const extractionPrompt = resolveMemoryPrompt('knowledgePerformance', promptSelections.performance).content;
  const factsPrompt = resolveMemoryPrompt('knowledgeFacts', promptSelections.facts).content;
  const profilePrompt = resolveMemoryPrompt('knowledgeProfile', promptSelections.profile).content;
  const runTotal = sceneBatchTotal + profileTargetIds.size;
  const previousProgress = performanceState.extractionProgress;
  let runCompleted = 0;
  const progressMetrics = () => knowledgeExtractionProgressMetrics(previousProgress, runTotal, reset, runCompleted);
  const initialMetrics = progressMetrics();
  performanceState.extractionProgress = normalizeKnowledgeExtractionProgress({
    ...performanceState.extractionProgress,
    status: 'running', stage: 'scenes',
    completed: initialMetrics.overallCompleted, total: initialMetrics.overallTotal,
    resumeFrom: initialMetrics.resumeFrom, runCompleted: 0, runTotal,
    error: '', updatedAt: new Date().toISOString(),
  }, performanceState.targetCharacters);
  const saveProgress = async (extra = {}) => {
    const metrics = progressMetrics();
    performanceState.extractionProgress = normalizeKnowledgeExtractionProgress({
      ...performanceState.extractionProgress,
      ...extra,
      completed: metrics.overallCompleted,
      total: metrics.overallTotal,
      resumeFrom: metrics.resumeFrom,
      runCompleted: metrics.runCompleted,
      runTotal: metrics.runTotal,
      updatedAt: new Date().toISOString(),
    }, performanceState.targetCharacters);
    await updateKnowledgePerformanceMetadata(groupId, { ...performanceState, knowledgePromptSelections: promptSelections });
    await updateMemoryDocumentGroup(groupId, {
      relationTriples: triples,
      characterCatalog,
      relationGraphStatus: performanceState.extractionProgress.status,
      relationGraphError: performanceState.extractionProgress.error,
      relationGraphProgress: `${metrics.overallCompleted}/${metrics.overallTotal}`,
      relationGraphUpdatedAt: performanceState.extractionProgress.status === 'ready' ? new Date().toISOString() : group.relationGraphUpdatedAt || '',
    });
  };
  await saveProgress();
  logRuntime('info', 'memory', '开始按角色整理演绎资料', {
    libraryName: group.libraryName,
    model,
    documents: groupDocs.length,
    matchedDocuments: targetWork.reduce((sum, item) => sum + item.documents.length, 0),
    batches: sceneBatchTotal,
    targets: enabledTargets.map((target) => target.primaryName),
  });
  const requestJson = async (messages, maxTokens = 3000) => {
    const body = { model, messages, temperature: 0.1, max_tokens: maxTokens, stream: false };
    if (/^hy3(?:-preview)?$/i.test(model)) {
      body.response_format = { type: 'json_object' };
      body.thinking = { type: 'disabled' };
      body.max_tokens = Math.max(maxTokens, 3000);
    }
    const requestResult = await postChatCompletionWithModelRecovery(api, body, signal);
    if (!requestResult.response.ok) throw new Error(`API 错误 ${requestResult.response.status}：${(await requestResult.response.text()).slice(0, 120)}`);
    const data = await parseChatCompletionResponse(requestResult.response);
    const choice = data.choices?.[0] || {};
    return { raw: contentToText(choice.message?.content) || contentToText(choice.message?.reasoning_content) || textFromCompletionChunk(data), finishReason: choice.finish_reason || '' };
  };
  try {
    for (const work of targetWork) {
      const targetProgress = performanceState.extractionProgress.processedByTarget[work.target.id];
      let emptyPerformanceStreak = 0;
      for (let batchIndex = 0; batchIndex < work.batches.length; batchIndex += 1) {
        if (signal?.aborted) throw new DOMException('已停止', 'AbortError');
        const batch = work.batches[batchIndex];
        const beforeStep = progressMetrics();
        onProgress?.(beforeStep.overallCompleted + 1, beforeStep.overallTotal, {
          stage: 'scenes', target: work.target.primaryName,
          completed: beforeStep.overallCompleted, remaining: beforeStep.remaining,
          resumeFrom: beforeStep.resumeFrom, runCompleted: beforeStep.runCompleted, runTotal: beforeStep.runTotal,
        });
        const batchText = batch.map((document, index) => `【场景 ${index + 1} · ${document.title || document.sourceName || document.id}】\n${document.text}`).join('\n\n');
        const { raw, finishReason } = await requestJson([
          { role: 'system', content: `${extractionPrompt}\n\n${factsPrompt}\n\n你只整理目标角色“${work.target.primaryName}”。输出合法 JSON；不要总结整段剧情，不要为未命名角色建档。候选别名必须有本次原文的直接身份依据。` },
          { role: 'user', content: `目标角色：${work.target.primaryName}\n已确认别名：${work.target.aliases.length ? work.target.aliases.join('、') : '无'}\n资料来源：${group.libraryName}\n\n只返回：\n{"performanceCards":[{"targetName":"${work.target.primaryName}","situationTags":["情境"],"relationshipContext":"关系阶段","trigger":"触发事件","innerMotive":"内在动机","outwardResponse":"外在反应","speechPattern":"语言方式","actionPattern":"动作方式","avoid":"不应怎样演","excerpt":"直接原文，不超过60字"}],"aliasCandidates":[{"targetName":"${work.target.primaryName}","alias":"候选别名","evidence":"证明是同一人的直接原文"}],"characters":[{"name":"具名重要角色","aliases":[],"identity":"原文明示身份","evidence":"直接原文"}],"triples":[{"source":"人物甲","relation":"长期稳定关系的自由描述","target":"人物乙","tags":[],"basis":"原文明示长期关系","evidence":"直接原文"}]}\n\n规则：\n1. 情境演绎卡回答“这个角色在什么情况下，会基于何种动机，怎样说和怎样行动”；不得把剧情摘要当卡片。\n2. 只从目标角色实际出场的内容提取；没有依据的字段留空。\n3. 普通走路、递物、看着、一次争吵或一次亲近不进入长期关系。\n4. 只记录血缘、婚恋、师徒、主仆、阵营、效忠、敌对、结盟、守护、正式承诺、重大秘密、重要物品归属等长期事实。\n5. triples.basis 必须严格选用以下一项：原文明示长期关系、血缘确认、相认、明确告白、成婚、婚约确立、师徒确立、主仆确立、正式效忠、正式结盟、正式背叛、杀害至亲、重大秘密揭示、重要归属确立；没有符合项就不要输出该关系。\n6. 同批最多 8 张演绎卡、6 位具名角色、8 条长期关系、3 个候选别名。\n\n${batchText}` },
        ]);
        const parsed = extractTargetKnowledgePayload(raw, work.target, batch, groupId, group.libraryName);
        validateKnowledgeExtractionBatch(parsed, raw);
        emptyPerformanceStreak = nextKnowledgeEmptyPerformanceStreak(emptyPerformanceStreak, parsed);
        if (emptyPerformanceStreak >= 5) {
          logRuntime('warn', 'memory', '连续多批没有生成情境演绎卡，已停止空转', {
            libraryName: group.libraryName,
            target: work.target.primaryName,
            batch: batchIndex + 1,
            emptyPerformanceStreak,
            responsePreview: String(raw || '').slice(0, 600),
          });
        }
        validateKnowledgeEmptyPerformanceStreak(emptyPerformanceStreak);
        const locatedCharacters = parsed.characters.map((item) => ({ ...item, docId: locateEvidenceDocId(item.evidence, batch) }));
        const locatedTriples = parsed.triples.filter(isStableKnowledgeRelation).map((item) => ({ ...item, docId: locateEvidenceDocId(item.evidence, batch) }));
        performanceState.performanceCards = normalizePerformanceCards([...performanceState.performanceCards, ...parsed.performanceCards]);
        performanceState.aliasCandidates = normalizeAliasCandidates([...performanceState.aliasCandidates, ...parsed.aliasCandidates], performanceState.targetCharacters);
        characterCatalog = mergeCharacterCatalog(characterCatalog, locatedCharacters);
        triples = dedupeKnowledgeRelations([...triples, ...locatedTriples], characterCatalog);
        targetProgress.docIds = [...new Set([...targetProgress.docIds, ...batch.map((doc) => doc.id)])];
        targetProgress.terms = [...new Set([work.target.primaryName, ...work.target.aliases])];
        targetProgress.profileDirty = true;
        runCompleted += 1;
        await saveProgress({ stage: 'scenes', status: 'running', error: '' });
        logRuntime(parsed.performanceCards.length || parsed.characters.length || parsed.triples.length ? 'info' : 'warn', 'memory', '目标角色场景整理完成', {
          libraryName: group.libraryName, target: work.target.primaryName, batch: batchIndex + 1, batches: work.batches.length,
          requestCharacters: batch.reduce((sum, doc) => sum + String(doc.text || '').length, 0), finishReason,
          cards: parsed.performanceCards.length, aliases: parsed.aliasCandidates.length, characters: parsed.characters.length, relations: locatedTriples.length,
          emptyPerformanceStreak,
          ...(!parsed.performanceCards.length ? { responsePreview: String(raw || '').slice(0, 600) } : {}),
        });
      }
    }
    for (const target of enabledTargets) {
      if (!profileTargetIds.has(target.id)) continue;
      if (signal?.aborted) throw new DOMException('已停止', 'AbortError');
      const targetCards = performanceState.performanceCards.filter((card) => card.targetId === target.id);
      if (!targetCards.length) {
        runCompleted += 1;
        await saveProgress({ stage: 'profile', status: 'running', error: '' });
        continue;
      }
      const beforeStep = progressMetrics();
      onProgress?.(beforeStep.overallCompleted + 1, beforeStep.overallTotal, {
        stage: 'profile', target: target.primaryName,
        completed: beforeStep.overallCompleted, remaining: beforeStep.remaining,
        resumeFrom: beforeStep.resumeFrom, runCompleted: beforeStep.runCompleted, runTotal: beforeStep.runTotal,
      });
      const profileEvidence = targetCards.slice(-36).map((card, index) => `${index + 1}. 情境:${card.situationTags.join('、') || '未标注'}；触发:${card.trigger}；动机:${card.innerMotive}；反应:${card.outwardResponse}；语言:${card.speechPattern}；动作:${card.actionPattern}；避免:${card.avoid}；证据:${card.excerpt}`.slice(0, 320)).join('\n');
      const { raw } = await requestJson([
        { role: 'system', content: `${profilePrompt}\n\n你负责从多张有来源的情境演绎卡归纳短角色本色。单次反应不得上升为稳定性格；稳定倾向必须至少两段独立证据支持，或原文明示。只返回合法 JSON。` },
        { role: 'user', content: `请归纳“${target.primaryName}”的角色本色。资料来源：${group.libraryName}\n只返回：\n{"roleProfile":{"identity":"身份","coreTraits":["稳定性格"],"values":["价值观"],"speechPatterns":["语言习惯"],"actionPatterns":["动作习惯"],"taboos":["不符合本色的行为"]}}\n\n要求：短、可演绎、不照抄台词、不重演剧情；无法由至少两张独立卡或原文明示证明的内容不要写。\n\n【情境演绎卡】\n${profileEvidence}` },
      ], 1800);
      const profile = extractRoleProfilePayload(raw, target, groupId, group.libraryName, [...new Set(targetCards.map((card) => card.sourceDocId).filter(Boolean))]);
      if (!profile) throw new Error(`“${target.primaryName}”的本色卡返回格式无法识别`);
      performanceState.roleProfiles = normalizeRoleProfiles([
        ...performanceState.roleProfiles.filter((item) => !(item.targetId === target.id && item.sourceGroupId === groupId)),
        profile,
      ], performanceState.targetCharacters);
      performanceState.extractionProgress.processedByTarget[target.id].profileDirty = false;
      runCompleted += 1;
      await saveProgress({ stage: 'profile', status: 'running', error: '' });
    }
  } catch (error) {
    const stopped = signal?.aborted || error?.name === 'AbortError';
    const metrics = progressMetrics();
    const message = stopped
      ? `已停止整理（总进度已保存 ${metrics.overallCompleted}/${metrics.overallTotal}；本次还剩 ${metrics.remaining} 步）`
      : `整理在总进度 ${metrics.overallCompleted}/${metrics.overallTotal} 时失败：${error.message || '请稍后重试'}；本次还剩 ${metrics.remaining} 步，已完成成果已保存`;
    await saveProgress({ stage: performanceState.extractionProgress.stage || 'scenes', status: stopped ? 'stopped' : 'failed', error: message });
    logRuntime(stopped ? 'warn' : 'error', 'memory', stopped ? '角色演绎整理已停止' : '角色演绎整理失败', { libraryName: group.libraryName, completed: metrics.overallCompleted, total: metrics.overallTotal, runCompleted, runTotal, error: error.message || String(error) });
    throw new Error(message);
  }
  await saveProgress({ stage: 'complete', status: 'ready', error: '' });
  logRuntime('info', 'memory', '角色演绎资料整理完成', {
    libraryName: group.libraryName,
    characters: characterCatalog.length,
    relations: triples.length,
    profiles: performanceState.roleProfiles.length,
    cards: performanceState.performanceCards.length,
    batches: sceneBatchTotal,
  });
  return { characters: characterCatalog.length, relations: triples.length, profiles: performanceState.roleProfiles.length, cards: performanceState.performanceCards.length };
}

function balancedJsonObjects(text) {
  const objects = [];
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === '{') {
      if (depth === 0) start = index;
      depth += 1;
    } else if (char === '}' && depth > 0) {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        objects.push(text.slice(start, index + 1));
        start = -1;
      }
    }
  }
  return objects;
}

function escapeJsonStringControls(text) {
  let result = '';
  let inString = false;
  let escaped = false;
  for (const char of text) {
    if (inString && !escaped && (char === '\n' || char === '\r' || char === '\t')) {
      result += char === '\n' ? '\\n' : char === '\r' ? '\\r' : '\\t';
      continue;
    }
    result += char;
    if (escaped) escaped = false;
    else if (char === '\\' && inString) escaped = true;
    else if (char === '"') inString = !inString;
  }
  return result;
}

function parseMemorySummaryJson(raw) {
  const source = String(raw || '').replace(/^\uFEFF/, '').trim();
  if (!source) return null;
  const withoutThinking = source
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<analysis>[\s\S]*?<\/analysis>/gi, '')
    .trim();
  const fenced = [...source.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)].map((match) => match[1].trim());
  const candidates = [...new Set([
    withoutThinking,
    ...fenced,
    ...balancedJsonObjects(withoutThinking),
    ...balancedJsonObjects(source),
  ].filter(Boolean))];
  for (const candidate of candidates) {
    const attempts = [
      candidate,
      candidate.replace(/,\s*([}\]])/g, '$1'),
      escapeJsonStringControls(candidate).replace(/,\s*([}\]])/g, '$1'),
    ];
    for (const attempt of attempts) {
      try {
        const parsed = JSON.parse(attempt);
        if (Array.isArray(parsed) && parsed[0] && typeof parsed[0] === 'object') return parsed[0];
        if (parsed && typeof parsed === 'object') return parsed.memory && typeof parsed.memory === 'object' ? parsed.memory : parsed;
      } catch (_) {}
    }
  }
  return null;
}

function mergeUniqueMemoryList(previous, next) {
  return [...new Set([...normalizeStringList(previous), ...normalizeStringList(next)])].slice(-80);
}

function mergeMemoryRecord(previous, next, fields) {
  const before = normalizeMemoryRecord(previous, fields);
  const after = normalizeMemoryRecord(next, fields);
  return Object.fromEntries(fields.map((field) => [field, after[field] || before[field]]));
}

function mergeMemoryRows(previous, next, fields) {
  const rows = normalizeMemoryRows(previous, fields);
  normalizeMemoryRows(next, fields).forEach((incoming) => {
    const key = String(incoming[fields[0]] || '').trim().toLowerCase();
    const index = rows.findIndex((row) => String(row[fields[0]] || '').trim().toLowerCase() === key);
    if (index >= 0) rows[index] = mergeMemoryRecord(rows[index], incoming, fields);
    else rows.push(incoming);
  });
  return rows.slice(-200);
}

function normalizedMemoryResultKey(key) {
  return String(key || '').toLowerCase().replace(/[\s_\-—:：/、与和]/g, '');
}

function normalizeMemorySummaryResult(result) {
  if (!result || typeof result !== 'object') return null;
  const aliases = {
    plotSummary: ['plotSummary', 'plot_summary', 'storySummary', 'summary', '剧情总结', '剧情摘要', '故事总结', '情节总结'],
    globalState: ['globalState', 'global_state', 'worldState', '全局数据表', '全局状态表', '当前状态'],
    protagonist: ['protagonist', 'protagonistInfo', 'protagonist_info', '主角信息表', '用户主角信息'],
    currentScene: ['currentScene', 'current_scene', 'scene', '当前场景', '当前情景', '场景'],
    presentCharacters: ['presentCharacters', 'present_characters', 'charactersPresent', '在场人物', '当前人物', '当前在场人物'],
    visitedPlaces: ['visitedPlaces', 'visited_places', 'pastPlaces', 'past_locations', '曾经去过', '之前去过', '去过的地点', '历史地点', '过去地点'],
    userProfile: ['userProfile', 'user_profile', 'userInfo', 'userPreferences', '用户画像', '用户信息', '用户身份与偏好', '用户身份喜好与边界', '身份喜好与边界'],
    relationship: ['relationship', 'relationships', 'relationshipChanges', 'relationship_changes', '关系变化与约定', '关系与约定', '关系变化', '人物关系'],
    importantFacts: ['importantFacts', 'important_facts', 'facts', 'keyFacts', '重要事实', '关键事实', '事实'],
    importantItems: ['importantItems', 'important_items', '重要物品', '关键物品'],
    openThreads: ['openThreads', 'open_threads', 'unresolved', 'pending', 'unfinished', '未完成剧情', '未解决事项', '待办事项', '伏笔'],
    skills: ['skills', 'skillTable', 'skill_table', '主角技能表', '技能表'],
    inventory: ['inventory', 'inventoryTable', 'inventory_table', '背包物品表', '物品表'],
    tasks: ['tasks', 'taskEvents', 'task_events', '任务与事件表', '任务事件表'],
    chatCharacters: ['characters', 'chatCharacters', 'chat_characters', 'importantCharacters', '重要角色', '重要人物', '人物档案'],
    chatRelationTriples: ['triples', 'chatRelationTriples', 'chat_relation_triples', 'relationTriples', '关系三元组', '长期关系图'],
    keywords: ['keywords', 'key_words', 'tags', '关键词', '关键字'],
    anchorUpdates: ['anchorUpdates', 'anchor_updates', '锚点更新', '时间地点更新'],
    relationshipUpdates: ['relationshipUpdates', 'relationship_updates', '关系更新'],
    openPlotOps: ['openPlotOps', 'open_plot_ops', '未完剧情操作', '伏笔更新'],
    customStateUpdates: ['customStateUpdates', 'custom_state_updates', '自定义状态更新'],
  };
  const candidates = [result];
  Object.values(result).forEach((value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) candidates.push(value);
  });
  const aliasSets = Object.fromEntries(Object.entries(aliases).map(([field, names]) => [field, new Set(names.map(normalizedMemoryResultKey))]));
  const score = (candidate) => Object.keys(candidate).filter((key) => Object.values(aliasSets).some((set) => set.has(normalizedMemoryResultKey(key)))).length;
  const source = candidates.sort((a, b) => score(b) - score(a))[0];
  const entries = Object.entries(source);
  const read = (field) => entries.find(([key]) => aliasSets[field].has(normalizedMemoryResultKey(key)))?.[1];
  const scalar = (value) => {
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
    if (Array.isArray(value)) return value.map((item) => String(item || '').trim()).filter(Boolean).join('；');
    if (typeof value === 'object') return Object.entries(value)
      .filter(([key]) => !aliasSets.visitedPlaces.has(normalizedMemoryResultKey(key)))
      .map(([key, item]) => `${key}：${Array.isArray(item) ? item.join('、') : String(item || '')}`)
      .filter((item) => !item.endsWith('：'))
      .join('；');
    return String(value).trim();
  };
  const rawCurrentScene = read('currentScene');
  const nestedVisited = rawCurrentScene && typeof rawCurrentScene === 'object' && !Array.isArray(rawCurrentScene)
    ? Object.entries(rawCurrentScene).find(([key]) => aliasSets.visitedPlaces.has(normalizedMemoryResultKey(key)))?.[1]
    : null;
  const rawTriples = read('chatRelationTriples');
  const chatCharacters = normalizeCharacterCatalog(read('chatCharacters'));
  const globalState = normalizeMemoryRecord(read('globalState'), ['currentTime', 'previousSceneTime', 'elapsedTime', 'currentLocation', 'sceneDetails']);
  const protagonist = normalizeMemoryRecord(read('protagonist'), ['name', 'identity', 'appearance', 'resources', 'experience', 'traits']);
  const rawAnchors = read('anchorUpdates');
  const anchorUpdates = rawAnchors && typeof rawAnchors === 'object' && !Array.isArray(rawAnchors)
    ? {
        ...(Object.hasOwn(rawAnchors, 'currentTime') ? { currentTime: scalar(rawAnchors.currentTime) } : {}),
        ...(Object.hasOwn(rawAnchors, 'currentLocation') ? { currentLocation: scalar(rawAnchors.currentLocation) } : {}),
      }
    : {};
  const relationshipUpdates = normalizeRelationshipCards(read('relationshipUpdates'));
  const rawPlotOps = read('openPlotOps');
  const openPlotOps = rawPlotOps && typeof rawPlotOps === 'object' && !Array.isArray(rawPlotOps) ? {
    upsert: normalizeOpenPlots(rawPlotOps.upsert),
    resolve: (Array.isArray(rawPlotOps.resolve) ? rawPlotOps.resolve : []).map((item) => typeof item === 'string'
      ? { id: item.trim(), outcome: '' }
      : { id: String(item?.id || '').trim(), title: String(item?.title || '').trim(), outcome: String(item?.outcome || item?.result || '').trim() }).filter((item) => item.id || item.title),
  } : { upsert: [], resolve: [] };
  const customStateUpdates = (Array.isArray(read('customStateUpdates')) ? read('customStateUpdates') : []).map((item) => ({
    id: String(item?.id || '').trim(),
    value: scalar(item?.value),
    evidence: scalar(item?.evidence),
  })).filter((item) => item.id);
  return {
    plotSummary: scalar(read('plotSummary')),
    globalState,
    protagonist,
    currentScene: scalar(rawCurrentScene),
    presentCharacters: normalizeStringList(read('presentCharacters')),
    visitedPlaces: normalizeStringList(read('visitedPlaces') || nestedVisited),
    userProfile: normalizeStringList(read('userProfile')),
    relationship: normalizeStringList(read('relationship')),
    importantFacts: normalizeStringList(read('importantFacts')),
    importantItems: normalizeStringList(read('importantItems')),
    openThreads: normalizeStringList(read('openThreads')),
    skills: normalizeMemoryRows(read('skills'), ['name', 'owner', 'effect', 'status']),
    inventory: normalizeMemoryRows(read('inventory'), ['name', 'owner', 'quantity', 'status'], read('importantItems')),
    tasks: normalizeMemoryRows(read('tasks'), ['name', 'type', 'status', 'participants', 'location', 'time', 'result', 'notes'], read('openThreads')),
    chatCharacters,
    chatRelationTriples: dedupeKnowledgeRelations((Array.isArray(rawTriples) ? rawTriples : []).filter(isStableKnowledgeRelation), chatCharacters),
    keywords: normalizeStringList(read('keywords')),
    anchorUpdates,
    relationshipUpdates,
    openPlotOps,
    customStateUpdates,
  };
}

function hasMeaningfulMemoryResult(result) {
  return Boolean(result && (
    String(result.plotSummary || '').trim()
    || String(result.currentScene || '').trim()
    || ['presentCharacters', 'visitedPlaces', 'userProfile', 'relationship', 'importantFacts', 'importantItems', 'openThreads', 'keywords'].some((field) => normalizeStringList(result[field]).length)
    || Object.values(normalizeMemoryRecord(result.globalState, ['currentTime', 'previousSceneTime', 'elapsedTime', 'currentLocation', 'sceneDetails'])).some(Boolean)
    || Object.values(normalizeMemoryRecord(result.protagonist, ['name', 'identity', 'appearance', 'resources', 'experience', 'traits'])).some(Boolean)
    || normalizeMemoryRows(result.skills, ['name', 'owner', 'effect', 'status']).length
    || normalizeMemoryRows(result.inventory, ['name', 'owner', 'quantity', 'status']).length
    || normalizeMemoryRows(result.tasks, ['name', 'type', 'status', 'participants', 'location', 'time', 'result', 'notes']).length
    || normalizeCharacterCatalog(result.chatCharacters).length
    || normalizeRelationTriples(result.chatRelationTriples).length
    || Object.keys(result.anchorUpdates || {}).length
    || normalizeRelationshipCards(result.relationshipUpdates).length
    || normalizeOpenPlots(result.openPlotOps?.upsert).length
    || (result.openPlotOps?.resolve || []).length
    || (result.customStateUpdates || []).length
  ));
}

function hasMeaningfulChatMemory(memory) {
  return Boolean(
    Object.values(memory?.anchors || {}).some((item) => String(item?.value || '').trim())
    || normalizeRelationshipCards(memory?.relationshipCards).length
    || normalizeOpenPlots(memory?.openPlots).length
    || normalizeCustomStates(memory?.customStates).some((item) => item.value)
    || (memory?.summaries || []).some((item) => String(item?.text || '').trim())
    || hasMeaningfulMemoryResult(memory)
  );
}

const MEMORY_SUMMARY_BASELINE_FIELDS = ['plotSummary', 'anchors', 'sectionControls', 'relationshipCards', 'openPlots', 'customStates', 'globalState', 'protagonist', 'currentScene', 'presentCharacters', 'visitedPlaces', 'userProfile', 'relationship', 'importantFacts', 'importantItems', 'openThreads', 'skills', 'inventory', 'tasks', 'chatCharacters', 'chatRelationTriples', 'keywords', 'lastSummarizedMessageIndex', 'updatedAt'];
let memorySummaryTask = null;

function createMemorySummaryBaseline(memory) {
  return Object.fromEntries(MEMORY_SUMMARY_BASELINE_FIELDS.map((field) => [field, cloneData(memory[field])]));
}

function restoreMemorySummaryBaseline(memory, baseline = {}) {
  MEMORY_SUMMARY_BASELINE_FIELDS.forEach((field) => {
    if (Object.hasOwn(baseline, field)) memory[field] = cloneData(baseline[field]);
  });
}

function activeMemorySummaryTask(chat) {
  return memorySummaryTask?.chat?.id === chat?.id ? memorySummaryTask : null;
}

async function rollbackMemorySummaryJob(chat) {
  const memory = ensureChatMemory(chat);
  const job = memory.summaryJob;
  if (!job) return;
  restoreMemorySummaryBaseline(memory, job.baseline);
  const createdIds = new Set(Array.isArray(job.createdSummaryIds) ? job.createdSummaryIds : []);
  memory.summaries = memory.summaries.filter((summary) => !createdIds.has(summary.id));
  for (const id of createdIds) await deleteMemoryDocumentGroup(id);
  memory.summaryJob = null;
  saveChatHistoriesToCache();
}

function stopMemorySummary(chat) {
  const task = activeMemorySummaryTask(chat);
  if (!task) return;
  task.action = 'stop';
  task.stage = '正在停止，已完成的进度会保留…';
  updateMemorySummaryUi(chat);
  task.controller.abort();
}

async function cancelMemorySummary(chat) {
  const task = activeMemorySummaryTask(chat);
  if (task) {
    task.action = 'cancel';
    task.stage = '正在取消并撤销本次进度…';
    updateMemorySummaryUi(chat);
    task.controller.abort();
    return;
  }
  await rollbackMemorySummaryJob(chat);
  updateMemorySummaryUi(chat);
  showToast('已取消总结，本次进度已撤销');
}

function requestCancelMemorySummary(chat) {
  const memory = ensureChatMemory(chat);
  const job = memory.summaryJob;
  if (!job || Number(job.nextIndex) >= Number(job.endIndex)) return;
  const processed = Math.max(0, Number(job.nextIndex) - Number(job.startIndex));
  const total = Math.max(0, Number(job.endIndex) - Number(job.startIndex));
  if (!confirm(`确定取消本次总结？\n\n会撤销本次任务已经生成的 ${processed} / ${total} 条进度和检索资料；任务开始前已有的记忆不会删除。`)) return;
  cancelMemorySummary(chat);
}

function mergeRelationshipCards(previous, updates) {
  const cards = normalizeRelationshipCards(previous);
  normalizeRelationshipCards(updates).forEach((incoming) => {
    const key = relationshipPairKey(incoming.source, incoming.target);
    const index = cards.findIndex((card) => relationshipPairKey(card.source, card.target) === key);
    if (index < 0) {
      cards.push({ ...incoming, updatedAt: new Date().toISOString() });
      return;
    }
    const old = cards[index];
    const changed = incoming.currentRelation && incoming.currentRelation !== old.currentRelation;
    const history = [...(old.history || [])];
    if (changed && !history.some((entry) => entry.relation === old.currentRelation && entry.evidence === old.evidence)) {
      history.push({ relation: old.currentRelation, evidence: old.evidence || '', reason: '', changedAt: old.updatedAt || '' });
    }
    if (changed) history.push({ relation: incoming.currentRelation, evidence: incoming.evidence || '', reason: incoming.history?.at(-1)?.reason || '', changedAt: new Date().toISOString() });
    cards[index] = {
      ...old,
      currentRelation: incoming.currentRelation || old.currentRelation,
      evidence: incoming.evidence || old.evidence,
      tags: [...new Set([...(old.tags || []), ...(incoming.tags || [])])],
      history: history.filter((entry, itemIndex, all) => itemIndex === all.findIndex((other) => `${other.relation}\u0000${other.evidence}` === `${entry.relation}\u0000${entry.evidence}`)).slice(-50),
      updatedAt: new Date().toISOString(),
      manual: old.manual || incoming.manual,
    };
  });
  return cards.slice(-200);
}

function applyMemorySummaryResult(memory, result) {
  memory.anchors = memory.anchors || defaultMemoryAnchors();
  memory.sectionControls = memory.sectionControls || {};
  if (memory.sectionControls.summaries?.updateEnabled !== false && String(result.plotSummary || '').trim()) {
    memory.plotSummary = String(result.plotSummary).trim();
  }
  Object.entries(result.anchorUpdates || {}).forEach(([id, value]) => {
    if (memory.anchors[id]?.updateEnabled && String(value || '').trim()) memory.anchors[id].value = String(value).trim();
  });
  memory.globalState = normalizeMemoryRecord(memory.globalState, ['currentTime', 'previousSceneTime', 'elapsedTime', 'currentLocation', 'sceneDetails']);
  memory.globalState.currentTime = memory.anchors.currentTime?.value || memory.globalState.currentTime;
  memory.globalState.currentLocation = memory.anchors.currentLocation?.value || memory.globalState.currentLocation;
  if (memory.sectionControls.relationships?.updateEnabled !== false) {
    memory.relationshipCards = mergeRelationshipCards(memory.relationshipCards, result.relationshipUpdates);
  }
  if (memory.sectionControls.openPlots?.updateEnabled !== false) {
    let plots = normalizeOpenPlots(memory.openPlots);
    normalizeOpenPlots(result.openPlotOps?.upsert).forEach((incoming) => {
      const index = plots.findIndex((item) => item.id === incoming.id || item.title.toLocaleLowerCase() === incoming.title.toLocaleLowerCase());
      if (index >= 0) plots[index] = { ...plots[index], ...incoming, id: plots[index].id, updatedAt: new Date().toISOString() };
      else plots.push({ ...incoming, updatedAt: new Date().toISOString() });
    });
    (result.openPlotOps?.resolve || []).forEach((resolved) => {
      plots = plots.filter((item) => !(resolved.id && item.id === resolved.id) && !(resolved.title && item.title.toLocaleLowerCase() === resolved.title.toLocaleLowerCase()));
    });
    memory.openPlots = plots;
  }
  memory.customStates = normalizeCustomStates(memory.customStates).map((item) => {
    const update = (result.customStateUpdates || []).find((incoming) => incoming.id === item.id);
    if (!item.updateEnabled || !update) return item;
    const checked = validatedCustomStateValue(item, update.value);
    if (!checked.ok) {
      logRuntime('warn', 'memory', '忽略无效的数值状态更新', { id: item.id, name: item.name, value: update.value });
      return item;
    }
    return { ...item, value: checked.value };
  });
  memory.keywords = mergeUniqueMemoryList(memory.keywords, result.keywords);
}

function memorySummaryConfigWarning() {
  const api = memorySummaryApi();
  const missing = [];
  if (!api?.url || !api?.key) missing.push('总结 API 链接和密钥');
  const configuredModel = api?.model || modelSettings.model;
  if (!configuredModel || configuredModel === '手动选择') missing.push('总结模型');
  if (memorySettings.vector) {
    if (!memorySettings.embeddingEndpoint || !memorySettings.embeddingApiKey) missing.push('向量 API 链接和密钥');
    if (!effectiveMemoryModel('embedding')) missing.push('向量模型');
  }
  if (memorySettings.rerank) {
    if (!memorySettings.rerankEndpoint || !memorySettings.rerankApiKey) missing.push('重排 API 链接和密钥');
    if (!effectiveMemoryModel('rerank')) missing.push('重排模型');
  }
  if (!missing.length) return '';
  return `请先到上方“记忆 API”里填写：${[...new Set(missing)].join('、')}。`;
}

async function organizeStructuredChatMemoryFromBatches(chat = activeChat, { silent = false, allowDuringSummary = false, reopen = true, buttonSelector = '#summarizeChatNow' } = {}) {
  if (!chat || (memorySummaryTask && !allowDuringSummary)) return false;
  const memory = ensureChatMemory(chat);
  const entries = memory.summaries.filter((entry) => String(entry?.text || '').trim()).slice(-50);
  if (!entries.length) {
    if (!silent) showToast('还没有可整理的分批总结记录');
    return false;
  }
  const sourceText = entries.map((entry) => {
    const start = Math.max(1, Number(entry.start) + 1);
    const end = Math.max(start, Number(entry.end) + 1);
    return `【第 ${start}–${end} 条的分批总结】\n${entry.text}`;
  }).join('\n\n');
  const button = detailBody.querySelector(buttonSelector);
  if (button) {
    button.disabled = true;
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 正在整理';
  }
  try {
    const result = await callMemorySummaryApi(chat, [{ role: 'assistant', text: sourceText }]);
    applyMemorySummaryResult(memory, result);
    memory.updatedAt = new Date().toISOString();
    saveChatHistoriesToCache();
    if (!silent) showToast('已从分批总结整理到动态数据库');
    if (reopen) openChatMemoryDetail(chat);
    return true;
  } catch (error) {
    if (!silent) showToast(`整理失败：${error.message || '请稍后重试'}`);
    if (button) {
      button.disabled = false;
      button.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> 立即总结/整理';
    }
    return false;
  }
}

async function summarizeChatMemory(chat = activeChat, { manual = false } = {}) {
  if (!chat || memorySummaryTask) return false;
  const memory = ensureChatMemory(chat);
  const keep = manual ? 0 : Math.max(0, Number(memorySettings.recentKeep) || 0);
  let job = memory.summaryJob;
  if (job && Number(job.nextIndex) >= Number(job.endIndex)) {
    memory.summaryJob = null;
    saveChatHistoriesToCache();
    showToast('已总结到当前楼层');
    return true;
  }
  if (!job || job.status === 'complete' || Number(job.nextIndex) >= Number(job.endIndex)) {
    const startIndex = memory.lastSummarizedMessageIndex;
    const endIndex = Math.max(startIndex, chat.messages.length - keep);
    if (!chat.messages.slice(startIndex, endIndex).some((message) => message.text)) {
      if (manual) showToast('已总结到当前楼层');
      return false;
    }
    job = {
      id: `summary-job-${chat.id}-${Date.now()}`,
      status: 'running',
      startIndex,
      nextIndex: startIndex,
      endIndex,
      baseline: createMemorySummaryBaseline(memory),
      createdSummaryIds: [],
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memory.summaryJob = job;
  } else {
    job.status = 'running';
    delete job.lastError;
    job.updatedAt = new Date().toISOString();
  }
  const controller = new AbortController();
  const task = { chat, controller, action: '', stage: '准备总结…', manual };
  memorySummaryTask = task;
  saveChatHistoriesToCache();
  updateMemorySummaryUi(chat);
  const batchSize = Math.max(10, Math.min(200, Number(memorySettings.summaryLimit) || 30));
  try {
    while (job.nextIndex < job.endIndex) {
      if (task.action) break;
      const batchStart = job.nextIndex;
      const batchEnd = Math.min(job.endIndex, batchStart + batchSize);
      const sourceMessages = chat.messages.slice(batchStart, batchEnd).filter((message) => message.text);
      if (!sourceMessages.length) {
        job.nextIndex = batchEnd;
        memory.lastSummarizedMessageIndex = batchEnd;
        continue;
      }
      const batchNumber = Math.floor((batchStart - job.startIndex) / batchSize) + 1;
      const batchTotal = Math.ceil((job.endIndex - job.startIndex) / batchSize);
      task.stage = `正在请求 AI 总结第 ${batchNumber} / ${batchTotal} 批…`;
      updateMemorySummaryUi(chat);
      const previousSummary = memory.plotSummary;
      const result = await callMemorySummaryApi(chat, sourceMessages, { signal: controller.signal });
      if (task.action) break;
      applyMemorySummaryResult(memory, result);
      memory.lastSummarizedMessageIndex = batchEnd;
      memory.updatedAt = new Date().toISOString();
      const summaryEnabled = memory.sectionControls?.summaries?.updateEnabled !== false;
      const batchSummaryText = summaryEnabled ? formatMemorySummaryRecord({ ...createEmptyChatMemory(), ...result }) : '';
      if (batchSummaryText) {
        const summaryEntry = {
          id: `summary-${chat.id}-${Date.now()}-${batchStart}`,
          start: batchStart,
          end: Math.max(batchStart, batchEnd - 1),
          text: batchSummaryText,
          createdAt: memory.updatedAt,
        };
        memory.summaries.push(summaryEntry);
        if (memory.summaries.length > 1000) memory.summaries = memory.summaries.slice(-1000);
        job.createdSummaryIds.push(summaryEntry.id);
        task.stage = '正在保存本批总结…';
        updateMemorySummaryUi(chat);
        await storeMemoryDocuments([{
          id: summaryEntry.id,
          groupId: summaryEntry.id,
          scope: 'chat',
          chatId: chat.id,
          roleId: chat.roleId,
          sourceName: `${chat.title}·分批总结`,
          text: batchSummaryText || previousSummary || memory.plotSummary,
          createdAt: memory.updatedAt,
        }]);
      }
      job.nextIndex = batchEnd;
      job.updatedAt = new Date().toISOString();
      saveChatHistoriesToCache();
      updateMemorySummaryUi(chat);
    }
    if (task.action === 'cancel') {
      await rollbackMemorySummaryJob(chat);
      showToast('已取消总结，本次进度已撤销');
      return false;
    }
    if (task.action === 'stop') {
      if (manual) await organizeStructuredChatMemoryFromBatches(chat, { silent: true, allowDuringSummary: true, reopen: false });
      if (job.nextIndex >= job.endIndex) {
        memory.summaryJob = null;
        saveChatHistoriesToCache();
        showToast(`已完成 ${job.endIndex - job.startIndex} 条对话总结，并已整理完成部分`);
        return true;
      }
      job.status = 'paused';
      job.updatedAt = new Date().toISOString();
      saveChatHistoriesToCache();
      showToast(`已停止总结，保留并整理 ${job.nextIndex - job.startIndex} / ${job.endIndex - job.startIndex} 条进度`);
      return false;
    }
    job.status = 'complete';
    const total = job.endIndex - job.startIndex;
    memory.summaryJob = null;
    saveChatHistoriesToCache();
    showToast(`已完成 ${total} 条对话总结`);
    return true;
  } catch (error) {
    if (task.action === 'cancel') {
      await rollbackMemorySummaryJob(chat);
      showToast('已取消总结，本次进度已撤销');
      return false;
    }
    if (task.action === 'stop' || error?.name === 'AbortError') {
      if (manual) await organizeStructuredChatMemoryFromBatches(chat, { silent: true, allowDuringSummary: true, reopen: false });
      job.status = 'paused';
      job.updatedAt = new Date().toISOString();
      saveChatHistoriesToCache();
      showToast(`已停止总结，保留并整理 ${job.nextIndex - job.startIndex} / ${job.endIndex - job.startIndex} 条进度`);
      return false;
    }
    job.status = 'paused';
    job.lastError = error.message || '记忆总结失败';
    job.updatedAt = new Date().toISOString();
    saveChatHistoriesToCache();
    if (manual) showToast(`${job.lastError}；已保留完成进度，可继续`);
    logRuntime('error', 'memory', '记忆总结失败', { error: error.message, chatId: chat.id });
    return false;
  } finally {
    if (memorySummaryTask === task) memorySummaryTask = null;
    updateMemorySummaryUi(chat);
  }
}

async function summarizeAndOrganizeChatMemory(chat = activeChat) {
  if (!chat || memorySummaryTask) return;
  const warning = memorySummaryConfigWarning();
  if (warning) {
    activeChatMemoryFeature = 'chat-data';
    showToast(warning);
    openMemoryDetail();
    return;
  }
  const success = await summarizeChatMemory(chat, { manual: true });
  const memory = ensureChatMemory(chat);
  const job = memory.summaryJob;
  if (success || !job) {
    await organizeStructuredChatMemoryFromBatches(chat, { reopen: false });
    openChatMemoryDetail(chat);
    return;
  }
  if (!success) {
    updateMemorySummaryUi(chat);
    return;
  }
  openChatMemoryDetail(chat);
}

function maybeAutoSummarizeChat(chat = activeChat) {
  if (!memorySettings.enabled || !memorySettings.autoSummary || !chat) return;
  const memory = ensureChatMemory(chat);
  const unsummarized = chat.messages.length - memory.lastSummarizedMessageIndex;
  if (unsummarized >= Math.max(10, Number(memorySettings.summaryLimit) || 30) + Math.max(0, Number(memorySettings.recentKeep) || 0)) {
    summarizeChatMemory(chat);
  }
}

/**
 * 按启用的正则规则处理文本（查找/替换，全局匹配，支持 $1/$2 捕获组）。
 * 当前作用于 AI 回复（相当于 Tavo 的「接收时 / 角色消息」时机）。
 */

function applyRegexRules(text) {
  if (!text || !regexRules.length) return text;
  let out = text;
  for (const rule of regexRules) {
    if (!rule.enabled || !rule.find) continue;
    try {
      const flags = rule.find.includes('(?s)') ? 'gs' : 'g';
      const source = rule.find.replace(/\(\?s\)/g, '');
      out = out.replace(new RegExp(source, flags), rule.replace || '');
    } catch {
      // 正则非法则跳过该规则，避免整条回复崩掉
    }
  }
  return out;
}

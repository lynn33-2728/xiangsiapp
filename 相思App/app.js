/* ============================================================
 * ⚠️ 重要提醒（AI 每次修改本文件前必读）
 * ============================================================
 * 本项目是【手机安卓 App】：通过 Capacitor 打包成 APK，实际运行在
 * Android WebView 里。
 *
 * 网页版（127.0.0.1:5193，由「电脑开启预览小工具.hta」启动）【仅用于
 * 查看 / 调试】，不是实际使用环境 —— 桌面浏览器能跑 ≠ 安卓能跑。
 *
 * 每次改动请务必：
 * 1. 优先保证【安卓 WebView】下的表现。
 *    典型陷阱：HTML5 Drag and Drop（draggable / dragstart / drop）
 *    在安卓 WebView 常常不触发，必须改用 Pointer Events 自己实现
 *    （pointerdown / pointermove / pointerup + setPointerCapture）。
 *    参见本文件的 bindUserIdentityEvents 与 bindApiModelSheetDrag。
 * 2. 触摸交互要考虑 touch-action、长按、滑动冲突、点击穿透。
 * 3. 布局要考虑 env(safe-area-inset-*)、状态栏 / 导航栏遮挡。
 * 4. 因为改完后是必须在【安卓端】验证的（打包 APK 或真机调试），
 *    不只是在桌面浏览器看一眼就交付。
 * 5. 若安卓壳工程（android/ 目录）有对应的原生代码
 *    （WebView 配置、权限、插件等），那边也要同步改。
 * ============================================================ */
const roles = [
  {
    id: 'xiangliu',
    name: '相柳',
    subtitle: '长相思，lynn',
    avatar: './assets/相柳_icon.png',
    cardFile: './assets/相柳-圆形头像.png',
    background: './assets/相柳.png',
    intro: '《长相思第二季》电视剧角色相柳，海底九头妖王，冷酷狠毒，忠诚守承诺，内心渴望关爱与自由，为救小天付出一切，最终英勇战死。',
    description: '《长相思第二季》的九命相柳，海底九头妖王，冷酷狠毒，忠诚守承诺，内心渴望关爱与自由。',
    personality: '冷淡克制，话少却护短。对亲近之人会以行动照顾，语气清冷，偶尔带一点不易察觉的温柔。',
    scenario: '与相柳重逢，他仍以冷淡语气遮住在意。',
    greeting: '如若违背，凡你所喜，都将成痛；凡你所乐，都将成苦。',
    example: '<START>\n{{user}}: 相柳，你会一直在吗？\n{{char}}: 我若答应了，就不会食言。',
    note: '适合偏原著感、克制守护、动作描写较多的回复。',
    tags: ['长相思', '相柳'],
  },
  {
    id: 'fangfengbei',
    name: '防风邶',
    subtitle: '长相思',
    avatar: './assets/防风邶_icon.png',
    cardFile: './assets/邶.png',
    background: './assets/防风邶.png',
    intro: '《长相思第二季》电视剧角色防风邶，防风氏二公子，风流散漫，箭术高超，与小天成为知己，实为相柳。',
    description: '《长相思》电视剧防风邶，防风氏二公子，风流散漫，箭术高超，与小夭成为知己，实为相柳。',
    personality: '看似散漫风流，实则心思极深。说话带笑，常用轻松语气遮住认真，适合更亲昵、更有人间烟火气的互动。',
    scenario: '你和防风邶在人间同行，看灯火、听风声，也把旧事一点点说开。',
    greeting: '你这么懂事，怎么还跟个小孩子一样呢',
    example: '<START>\n{{user}}: 邶邶，我们去看烟火。\n{{char}}: 好啊。人间热闹得很，你若喜欢，我便陪你慢慢看。',
    note: '默认聊天角色，语气可以更懒散、更会哄人。',
    tags: ['长相思', '防风邶'],
  },
  {
    id: 'maoqiu',
    name: '毛球',
    subtitle: '长相思',
    avatar: './assets/毛球_icon.png',
    background: './assets/毛球.png',
    description: '《长相思》毛球，修炼数百年的妖族，本体为：白羽金冠雕，海底九头妖王“相柳”的专属坐骑与战友。可在庞大的战斗本体与圆滚滚的日常拟态间自由切换。切换通常由情境决定：战斗或远行时展露本体；日常或撒娇时切换为萌态。\n-本体（战斗形态）：一只体型庞大的白羽金冠雕，通体雪白，头有金色羽冠。双翅一扇可将巨石拍得粉碎。铁爪银钩，锋利的爪子能撕碎猎物。英姿飒爽，叫声穿透云霄。\n -拟态（日常形态）：一只圆滚滚、毛茸茸的小白雕。圆溜溜的眼睛，毛茸茸的身体，眉心长着一簇红色火焰形羽毛。',
    personality: '活泼、护主、黏人应。',
    scenario: '毛球陪在你身边，像一团会回应情绪的小小暖意。',
    greeting: '啾。',
    example: '<START>\n{{user}}: 毛球，过来。\n{{char}}: 啾！（扑腾翅膀靠近）',
    note: '适合轻松陪伴。',
    tags: ['长相思', '毛球'],
  },
];

// 出厂默认资料：由“元宝复刻配置 (4).json”导入。仅在新安装且本机没有任何资料时使用。
// 配置中所有 API / 语音密钥均已在写入前强制清空。
const FACTORY_DEFAULT_CONFIG_B64 = globalThis.XIANGSI_FACTORY_DEFAULT_CONFIG_B64 || '';

// 「角色介绍」是 App 内部备注（不来自导入的酒馆角色卡）；角色的固定默认介绍即 role.intro，
// 新增 / 导入的人设版本都会默认沿用它，手改过的其它版本不会反过来影响它。

// API 配置默认保持为空，只显示“＋新建”入口。
// 用户创建并保存连接后，才会在 API 列表中出现。
const apiLinks = [];
let apiEditorModelOptions = [];

const voiceLinks = [
  { name: '默认声音', url: 'https://voice.example.local' },
  { name: '防风邶声线', url: 'local://fangfengbei-voice' },
];

const SILICONFLOW_PRESET_VOICES = [
  { id: 'alex', name: 'Alex（男声）' },
  { id: 'anna', name: 'Anna（女声）' },
  { id: 'bella', name: 'Bella（女声）' },
  { id: 'benjamin', name: 'Benjamin（男声）' },
  { id: 'charles', name: 'Charles（男声）' },
  { id: 'claire', name: 'Claire（女声）' },
  { id: 'david', name: 'David（男声）' },
  { id: 'diana', name: 'Diana（女声）' },
];

// 基于「声林 TTS」MIT 项目的多引擎配置结构重新适配。
// 密钥均默认为空，只有用户在设置页主动填写后才参与请求。
const voiceApiSettings = {
  engine: 'siliconflow',
  siliconflow: {
    apiUrl: 'https://api.siliconflow.cn/v1',
    apiKey: '',
    model: 'FunAudioLLM/CosyVoice2-0.5B',
    voice: 'alex',
    customVoices: [],
  },
  volcano: {
    appId: '',
    accessKey: '',
    speaker: 'zh_female_vv_uranus_bigtts',
  },
  minimax: {
    apiHost: 'https://api.minimaxi.com',
    apiKey: '',
    model: 'speech-02-hd',
    voice: 'female-shaonv',
    speed: 1,
  },
  moss: {
    apiHost: 'https://api.mosi.cn',
    apiKey: '',
    model: 'moss-tts',
    voiceId: '',
    responseFormat: 'mp3',
    voices: [],
  },
};

const MOSS_OFFICIAL_VOICES = [
  { id: 'c6c0a40a-ea82-4468-9a21-333d3c4a76f6', name: '曼波有口音版' },
  { id: 'f80b6698-0066-430b-88a0-f0fb8796db34', name: '明太祖' },
  { id: 'ddc6e38b-6f55-4415-b21b-a88cad2cc1d9', name: 'VOX AKUMA' },
  { id: '7662a8a1-700c-466a-b66b-57ece9e2e231', name: '李白' },
  { id: 'f9a1416b-d006-4b77-9581-8f0e8ec1e401', name: '旁白 Jake' },
  { id: '806c9695-6160-404e-8722-4f788d935af3', name: '轻快灵动女声' },
];

/* =====================================================================
 * 本地 API 缓存（测试用小工具）
 * ---------------------------------------------------------------------
 * 作用：把聊天 API 链接（含密钥）和语音 API 密钥单独存到 localStorage，
 *       刷新页面后自动恢复，不用每次都去设置里重填。
 * 注意：collectAppConfig(includeKeys) 默认 includeKeys=false，会剥离所有密钥；
 * 只有当用户在「备份与恢复」勾选「同时导出 API 密钥」时才会带上 key。
 * 以后做成正式 App 时，只要删除这一段（以及下方三处 saveApiCache 调用和一个
 *       loadApiCache 调用）即可移除缓存逻辑，不影响其它功能。
 * ===================================================================== */
const API_CACHE_KEY = 'xl_api_cache_v1';
const MODEL_DEFAULTS_VERSION = 5;

function saveApiCache() {
  try {
    const payload = {
      savedAt: new Date().toISOString(),
      modelDefaultsVersion: MODEL_DEFAULTS_VERSION,
      apiLinks: apiLinks.map(({ key, ...api }) => ({ ...api, key: key || '' })),
      modelSettings: { ...modelSettings },
      voice: {
        engine: voiceApiSettings.engine,
        readSettings: { ...voiceReadSettings },
        siliconflow: { ...voiceApiSettings.siliconflow },
        volcano: { ...voiceApiSettings.volcano },
        minimax: { ...voiceApiSettings.minimax },
        moss: { ...voiceApiSettings.moss },
      },
    };
    localStorage.setItem(API_CACHE_KEY, JSON.stringify(payload));
  } catch (_) {
    // localStorage 不可用时静默失败，不影响主流程
  }
}

function loadApiCache() {
  try {
    const raw = localStorage.getItem(API_CACHE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (Array.isArray(data.apiLinks) && data.apiLinks.length) {
      apiLinks.length = 0;
      apiLinks.push(...data.apiLinks.map((api) => ({
        ...api,
        model: canonicalChatModelId(api?.url, api?.model),
      })));
    }
    if (data.modelSettings && typeof data.modelSettings === 'object') {
      const cachedModelSettings = { ...data.modelSettings };
      // 把上一版尚未修改的 Top-K 默认值 23 平滑迁移为新版默认值 0；
      // 用户已经改成其它数值时保持原值不动。
      if (!data.modelDefaultsVersion && Number(cachedModelSettings.topK) === 23) {
        cachedModelSettings.topK = 0;
      }
      Object.assign(modelSettings, cachedModelSettings);
      modelSettings.model = canonicalChatModelId('', modelSettings.model);
      // v2 → v3：把上一版的旧默认平滑迁移为推荐区间内的新默认；
      // 规则：仅在字段尚未被用户改过（仍是旧默认）时覆盖，并补齐新增的 repetitionPenalty。
      if (!data.modelDefaultsVersion || data.modelDefaultsVersion < 3) {
        if (Number(cachedModelSettings.topP) === 0.75) cachedModelSettings.topP = 0.9;
        if (Number(cachedModelSettings.topK) === 0) cachedModelSettings.topK = 20;
        if (Number(cachedModelSettings.maxTokens) === 1700) cachedModelSettings.maxTokens = 2048;
        if (cachedModelSettings.repetitionPenalty == null) cachedModelSettings.repetitionPenalty = 1.1;
        Object.assign(modelSettings, cachedModelSettings);
      }
      // v3 → v4：2048 只是旧默认，不是模型硬上限。仅迁移仍保持旧默认的用户；
      // 已经自行设置成其它长度的用户保持原值。
      if (!data.modelDefaultsVersion || data.modelDefaultsVersion < 4) {
        if (Number(cachedModelSettings.maxTokens) === 2048) cachedModelSettings.maxTokens = 4096;
        Object.assign(modelSettings, cachedModelSettings);
      }
      // v4 → v5：旧界面曾把“未设置”的词频/存在惩罚显示并保存成 -2，
      // 会强烈鼓励模型复读。迁移为 0（不发送）。
      if (!data.modelDefaultsVersion || data.modelDefaultsVersion < 5) {
        if (!finiteModelParameter(cachedModelSettings.frequencyPenalty) || Number(cachedModelSettings.frequencyPenalty) < 0) {
          cachedModelSettings.frequencyPenalty = 0;
        }
        if (!finiteModelParameter(cachedModelSettings.presencePenalty) || Number(cachedModelSettings.presencePenalty) < 0) {
          cachedModelSettings.presencePenalty = 0;
        }
        Object.assign(modelSettings, cachedModelSettings);
      }
    }
    if (data.voice) {
      if (typeof data.voice.engine === 'string') voiceApiSettings.engine = data.voice.engine;
      if (data.voice.readSettings && typeof data.voice.readSettings === 'object') {
        Object.assign(voiceReadSettings, data.voice.readSettings);
      } else if (roles.some((role) => role.autoRead === true)) {
        voiceReadSettings.autoRead = true;
      }
      if (data.voice.siliconflow) {
        Object.assign(voiceApiSettings.siliconflow, data.voice.siliconflow);
        voiceApiSettings.siliconflow.customVoices = Array.isArray(data.voice.siliconflow.customVoices)
          ? data.voice.siliconflow.customVoices
          : [];
      }
      if (data.voice.volcano) Object.assign(voiceApiSettings.volcano, data.voice.volcano);
      if (data.voice.minimax) Object.assign(voiceApiSettings.minimax, data.voice.minimax);
      voiceApiSettings.minimax.apiHost = normalizeMinimaxHost(voiceApiSettings.minimax.apiHost);
      if (data.voice.moss) {
        Object.assign(voiceApiSettings.moss, data.voice.moss);
        voiceApiSettings.moss.voices = Array.isArray(data.voice.moss.voices) ? data.voice.moss.voices : [];
      }
    }
  } catch (_) {
    // 缓存损坏则忽略，使用默认空配置
  }
}

// ===== 多人轮询状态 =====
const POLLING_CACHE_KEY = 'xl_polling_v1';
// fixed: 人设版本 + 专属 API + 连续次数；random: 每次随机人设、API模型和预设。
let polling = {
  enabled: false,
  mode: 'fixed',
  pool: [],
  randomPersonaIds: [],
  randomApiIds: [],
  randomPresetIds: [],
  currentId: null,
  count: 0,
};

function uniquePollingIds(value) {
  return [...new Set((Array.isArray(value) ? value : []).map(String).filter(Boolean))];
}

function pollingApiReady(api, fallbackModel = modelSettings?.model || '') {
  const model = api?.model || fallbackModel;
  return !!(api && api.enabled !== false && api.url && api.key && model && model !== '手动选择');
}

function pollingReadinessFor(state, role, availableApis, availablePresets, fallbackModel = '') {
  const missing = [];
  if (!state?.enabled || !role) return { active: false, missing: ['选择一种多轮询方式'] };
  const personas = Array.isArray(role.personaVersions) ? role.personaVersions : [];
  const personaIds = new Set(personas.map((persona) => persona.id));
  const apis = Array.isArray(availableApis) ? availableApis : [];
  const apiMap = new Map(apis.map((api) => [api.id, api]));
  const fallbackApi = apis.find((api) => api.active) || apis[0] || null;
  const selectedApis = state.mode === 'random'
    ? uniquePollingIds(state.randomApiIds).map((id) => apiMap.get(id)).filter(Boolean)
    : (Array.isArray(state.pool) ? state.pool : []).filter((entry) => personaIds.has(entry.id)).map((entry) => apiMap.get(entry.apiId) || fallbackApi).filter(Boolean);
  const selectedPersonaCount = state.mode === 'random'
    ? uniquePollingIds(state.randomPersonaIds).filter((id) => personaIds.has(id)).length
    : new Set((Array.isArray(state.pool) ? state.pool : []).filter((entry) => personaIds.has(entry.id)).map((entry) => entry.id)).size;
  const requiredPersonaCount = 2;
  if (selectedPersonaCount < requiredPersonaCount) missing.push(`至少选择 ${requiredPersonaCount} 个人设`);

  const requiredApiCount = state.mode === 'random' ? 1 : 2;
  const readyApiCount = selectedApis.filter((api) => pollingApiReady(api, fallbackModel)).length;
  if (readyApiCount < requiredApiCount) {
    if (selectedApis.length < requiredApiCount) {
      missing.push(state.mode === 'random' ? '至少选择 1 条 API' : '给每个已选人设指定 API');
    }
    const incompleteConnection = selectedApis.some((api) => !api.url || !api.key);
    const missingModel = selectedApis.some((api) => {
      const model = api.model || fallbackModel;
      return !model || model === '手动选择';
    });
    if (incompleteConnection) missing.push('补全已选 API 的地址和密钥');
    if (missingModel) missing.push('给已选 API 选择模型');
    if (selectedApis.length >= requiredApiCount && !incompleteConnection && !missingModel) {
      missing.push('启用足够的已选 API');
    }
  }

  if (state.mode === 'random') {
    const presetIds = new Set((Array.isArray(availablePresets) ? availablePresets : []).map((preset) => preset.id));
    const presetCount = uniquePollingIds(state.randomPresetIds).filter((id) => presetIds.has(id)).length;
    if (presetCount < 1) missing.push('至少选择 1 个预设');
  }
  return { active: missing.length === 0, missing };
}

function currentPollingReadiness() {
  return pollingReadinessFor(polling, currentRole, apiLinks, presets, modelSettings?.model || '');
}

function isPollingActive() {
  return currentPollingReadiness().active;
}

function savePollingState() {
  try {
    localStorage.setItem(POLLING_CACHE_KEY, JSON.stringify(polling));
  } catch (_) {
    // localStorage 不可用时静默失败
  }
}

function loadPollingState() {
  try {
    const raw = localStorage.getItem(POLLING_CACHE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data && typeof data === 'object') {
      polling.enabled = !!data.enabled;
      polling.mode = data.mode === 'random' ? 'random' : 'fixed';
      polling.pool = Array.isArray(data.pool)
        ? data.pool.map((p) => ({ id: p.id, apiId: p.apiId || '', interval: clampPollInterval(p.interval) })).filter((p) => p.id)
        : [];
      polling.randomPersonaIds = uniquePollingIds(data.randomPersonaIds);
      polling.randomApiIds = uniquePollingIds(data.randomApiIds);
      polling.randomPresetIds = uniquePollingIds(data.randomPresetIds);
      polling.currentId = data.currentId || null;
      polling.count = Number(data.count) || 0;
    }
  } catch (_) {
    // 缓存损坏则忽略
  }
}

// ===== 角色 / 人设持久化 =====
// 把整个 roles 数组（含各角色的人设版本 personaVersions、activePersonaId、
// voiceId、autoRead、绑定的 apiId 等）序列化到 localStorage，刷新后自动恢复。
const ROLES_CACHE_KEY = 'xl_roles_v1';

// 深拷贝角色对象，去掉运行时才会产生的非数据引用，保证 localStorage 可序列化。
function serializeRoles() {
  return roles.map((role) => JSON.parse(JSON.stringify(role)));
}

function saveRolesToCache() {
  try {
    localStorage.setItem(ROLES_CACHE_KEY, JSON.stringify(serializeRoles()));
  } catch (_) {
    // localStorage 不可用时静默失败，不影响主流程
  }
  syncLivePersonas();
}

// 把当前全部角色/人设版本实时推送给本地预览服务（serve.js 存为 live-personas.json），
// 供「电脑开启预览小工具 → 保存默认人设」读取。fire-and-forget：
// file:// 直开或服务未启动时静默失败，不影响主流程。
function syncLivePersonas() {
  try {
    fetch('/api/personas/live', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personas: serializeRoles() }),
    }).catch(() => {});
  } catch (_) {
    // 忽略：file:// 场景下 fetch 构造即抛错
  }
}

function loadRolesFromCache() {
  try {
    const raw = localStorage.getItem(ROLES_CACHE_KEY);
    if (!raw) return;
    const cached = JSON.parse(raw);
    if (!Array.isArray(cached) || !cached.length) return;
    const defaultById = new Map(roles.map((role) => [role.id, role]));
    const merged = [];
    cached.forEach((entry) => {
      if (!entry || typeof entry !== 'object' || !entry.id) return;
      const def = defaultById.get(entry.id);
      if (def) {
        // 把缓存数据合并回默认角色对象（保持对象引用，使 currentRole 等指针有效）。
        // 用 Object.assign 只覆盖有缓存的字段，保留默认里新增但缓存里还没有的字段，
        // 避免旧缓存把默认值吞掉。
        // 旧缓存曾可能写入空的视觉/开场字段；这些空值不应抹掉内置角色资源。
        const safeEntry = { ...entry };
        ['avatar', 'background', 'greeting'].forEach((field) => {
          if (typeof safeEntry[field] !== 'string' || !safeEntry[field].trim()) delete safeEntry[field];
        });
        Object.assign(def, safeEntry);
        defaultById.delete(entry.id);
        merged.push(def);
      } else {
        // 缓存中存在但默认里没有的（用户新增 / 导入的角色）直接保留
        merged.push(entry);
      }
    });
    // 默认里有但缓存里没有的（极少）也保留
    defaultById.forEach((role) => merged.push(role));
    roles.length = 0;
    roles.push(...merged);
  } catch (_) {
    // 缓存损坏则忽略，使用默认内置角色
  }
}

function clampPollInterval(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, 5);
}

const voiceReadSettings = {
  autoRead: false,
  maxChars: 1000,
  extractQuoted: false,
  quotePairs: '“” 「」 『』',
  removeActions: true,
  actionPairs: '（） 【】 []',
};
let voiceClonePreviewUrl = '';
let pendingVoiceDelete = null;

let userProfile = {
  name: '用户',
  persona: '',
  avatar: '',
};
let userIdentities = [];
let activeUserIdentityId = '';
let editingUserIdentityId = '';
const dragStateById = new Map();   // 用户身份拖拽排序的临时状态（按 id 索引）

function estimateTokens(text = '') {
  const str = String(text);
  if (!str) return 0;
  // 按 UTF-8 字节数 / 4 做粗略估算，中文/英文都能给出可感知的数量级
  return Math.ceil(new TextEncoder().encode(str).length / 4);
}

function updateRoleDescTokens() {
  const badge = document.getElementById('roleDescTokenCount');
  if (badge) badge.textContent = `约 ${estimateTokens(rolePersonaInput?.value || '')} tokens`;
}

function loadUserIdentities() {
  try {
    const raw = localStorage.getItem('xs_userIdentities');
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data.identities)) userIdentities = data.identities;
      if (typeof data.activeId === 'string') activeUserIdentityId = data.activeId;
    }
  } catch (_) {}

  // 兼容旧版只存了单用户配置的情况
  if (!userIdentities.length) {
    let legacy = null;
    try {
      legacy = JSON.parse(localStorage.getItem('xs_userProfile') || '{}');
    } catch (_) {}
    const first = {
      id: `u-${Date.now()}`,
      name: legacy?.name || userProfile.name,
      persona: legacy?.persona || userProfile.persona,
      avatar: legacy?.avatar || userProfile.avatar || '',
    };
    userIdentities = [first];
  }

  if (!activeUserIdentityId || !userIdentities.some((u) => u.id === activeUserIdentityId)) {
    activeUserIdentityId = userIdentities[0]?.id || '';
  }
  syncUserProfileReference();
}

function syncUserProfileReference() {
  const active = userIdentities.find((u) => u.id === activeUserIdentityId) || userIdentities[0];
  if (active) {
    userProfile = active;
  }
}

function saveUserIdentities() {
  syncUserProfileReference();
  try {
    localStorage.setItem('xs_userIdentities', JSON.stringify({ identities: userIdentities, activeId: activeUserIdentityId }));
  } catch (_) {}
}

function setActiveUserIdentity(id) {
  if (!userIdentities.some((u) => u.id === id)) return;
  activeUserIdentityId = id;
  syncUserProfileReference();
  updateUserIdentityRow();
  saveUserIdentities();
}

function addUserIdentity() {
  const knownNumbers = userIdentities
    .map((u) => Number((u.name || '').match(/(\d+)\s*$/)?.[1]) || 0);
  const next = Math.max(0, ...knownNumbers) + 1;
  const identity = {
    id: `u-${Date.now()}`,
    name: `用户 ${next}`,
    persona: '',
    avatar: '',
  };
  userIdentities.push(identity);
  editingUserIdentityId = identity.id;
  saveUserIdentities();
  renderUserIdentityList();
  showToast('已新增用户身份');
}

function copyUserIdentity(id) {
  const source = userIdentities.find((u) => u.id === id);
  if (!source) return;
  const copy = {
    id: `u-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    name: `${source.name || '用户'} · 副本`,
    persona: source.persona || '',
    avatar: source.avatar || '',
  };
  const index = userIdentities.findIndex((u) => u.id === id);
  userIdentities.splice(index + 1, 0, copy);
  editingUserIdentityId = copy.id;
  saveUserIdentities();
  renderUserIdentityList();
  showToast('已复制用户身份');
}

function deleteUserIdentity(id) {
  if (userIdentities.length <= 1) {
    showToast('至少保留一个用户身份');
    return;
  }
  const index = userIdentities.findIndex((u) => u.id === id);
  if (index === -1) return;
  userIdentities.splice(index, 1);
  if (activeUserIdentityId === id) {
    activeUserIdentityId = userIdentities[Math.min(index, userIdentities.length - 1)]?.id || userIdentities[0]?.id || '';
    syncUserProfileReference();
    updateUserIdentityRow();
  }
  if (editingUserIdentityId === id) editingUserIdentityId = '';
  saveUserIdentities();
  renderUserIdentityList();
}

function moveUserIdentity(id, direction) {
  const index = userIdentities.findIndex((u) => u.id === id);
  if (index === -1) return;
  const target = index + direction;
  if (target < 0 || target >= userIdentities.length) return;
  const [item] = userIdentities.splice(index, 1);
  userIdentities.splice(target, 0, item);
  saveUserIdentities();
  renderUserIdentityList();
}

const MODEL_DEFAULTS = {
  enabled: true,
  model: '手动选择',
  historyLimit: 200,
  maxTokens: 4096,
  temperature: 0.88,
  topP: 0.9,
  topK: 20,
  repetitionPenalty: 1.1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  stream: true,
};

const modelSettings = { ...MODEL_DEFAULTS };

// ===== 统一「模型推理参数」定义 =====
// 三个设置界面（全局模型设置 / 新建 API / 预设）共用此清单 + renderModelParameters()，
// 保证参数项目、UI 格式、范围/推荐说明全部一致。
// group: sampling（采样）/ penalty（惩罚）/ length（长度） —— 渲染时按 group 排序、同组上下放一起
const MODEL_PARAMETERS = [
  { key: 'temperature',       label: '温度',                  apiKey: 'temperature',        group: 'sampling',
    desc: '整体随机性：低值稳定严谨，高值更有变和化和创意',
    suggestion: '0.7–0.9；角色更有"人味"可用 0.85–0.95', min: 0,    max: 2,     step: 0.01 },
  { key: 'topP',              label: 'Top-P',                apiKey: 'top_p',               group: 'sampling',
    desc: '候选概率范围：0-1，保守-开放',
    suggestion: '0.85–0.95；1即没限制,通常与温度只重点调整一个',   min: 0,    max: 1,     step: 0.01 },
  { key: 'topK',              label: 'Top-K',                apiKey: 'top_k',               group: 'sampling',
    desc: '每一步候选数量：低值集中，高值丰富',
    suggestion: '20–40；不支持的平台会自动过滤',         min: 0,    max: 100,   step: 1 },
  { key: 'repetitionPenalty', label: 'Repetition Penalty',  apiKey: 'repetition_penalty',  group: 'penalty',
    desc: '防*句子*重复:防复读上一句,1=不生效，>1.0 强度递增',
    suggestion: '1.05–1.1；还是复读，建议 1.1 起（不支持时会自动忽略）', min: 1.0, max: 1.3, step: 0.01 },
  { key: 'frequencyPenalty',  label: 'frequency Penalty词频,频率惩罚',             apiKey: 'frequency_penalty',   group: 'penalty',
    desc: '防*词语*重复:重复次数越多，惩罚越强',
    suggestion: '正常保持 0；复读时可用 0.1–0.25，过高会影响逻辑', min: 0, max: 2, step: 0.01 },
  { key: 'presencePenalty',   label: 'presence Penalty存在惩罚',             apiKey: 'presence_penalty',    group: 'penalty',
    desc: '概念,话题出现过就惩罚，推动新话题',
    suggestion: '正常保持 0；剧情长期停滞时可用 0.05–0.15，过高容易跳剧情', min: 0, max: 2, step: 0.01 },
  { key: 'maxTokens',         label: '回复令牌限制',         apiKey: 'max_tokens',          group: 'length',
    desc: '模型回复的最大长度，过小可能截断回复',
    suggestion: '普通聊天 4096；长剧情可用 8192，开启思考建议 12288–16384', min: 256, max: 24576, step: 1 },
];

const GROUP_ORDER = ['sampling', 'penalty', 'length'];
const GROUP_LABEL = { sampling: '采样', penalty: '惩罚', length: '长度' };

/**
 * 渲染统一的模型参数列表。
 * @param {Object}   opts
 * @param {Object}   opts.values       当前值字典 {temperature, topP, topK, ...}
 * @param {string}   opts.inputName    input data- 属性名（'model-field' / 'api-model-param' / 'preset-param'）
 * @param {boolean}  opts.disabled     是否禁用整组滑块
 * @param {boolean}  opts.clearable    是否显示"None"重置按钮（API 编辑器专用）
 * @param {boolean}  opts.showApiKey   是否显示 API 字段名（API 编辑器专用，如 "temperature"）
 * @param {boolean}  opts.grouped      是否按 group 分卡片（默认 true）
 * @param {boolean}  opts.useApiKey    input data-* 是否用 apiKey（snake_case）而非 key（camelCase）；预设需要
 * @returns {string} HTML 字符串
 */
function renderModelParameters({ values = {}, inputName, disabled = false, clearable = false, showApiKey = false, grouped = true, useApiKey = false, showNumberInput = false } = {}) {
  const sliderRow = (param) => {
    // 兼容调用方的 values 用 camelCase (topP) 或 snake_case (top_p)
    const rawValue = values[param.key] ?? values[param.apiKey];
    const numericValue = Number(rawValue);
    // API 专用参数把 0 作为“不单独发送此项”，与界面里的 None 含义一致。
    const hasValue = finiteModelParameter(rawValue)
      && numericValue >= param.min
      && numericValue <= param.max
      && (!clearable || numericValue !== 0);
    const value = hasValue ? numericValue : param.min;
    const cls = hasValue ? 'model-row is-set' : 'model-row';
    const dataKey = useApiKey ? param.apiKey : param.key;
    return `
      <div class="${cls}" data-model-row="${param.key}">
        <strong class="model-row-title">${param.label}${showApiKey ? ` <small>${param.apiKey}</small>` : ''}</strong>
        <div class="model-row-desc">${param.desc}</div>
        ${param.suggestion ? `<div class="model-row-suggestion"><span>推荐</span> ${param.suggestion}</div>` : ''}
        <div class="model-slider-line">
          <input type="range" class="model-slider" data-${inputName}="${dataKey}" data-has-value="${hasValue}"
                 min="${param.min}" max="${param.max}" step="${param.step}" value="${value}" ${disabled ? 'disabled' : ''}>
          ${clearable
            ? `<input type="text" class="model-number-input model-parameter-input" data-api-model-param-number="${dataKey}"
                      inputmode="${param.step < 1 ? 'decimal' : 'numeric'}" pattern="-?[0-9]*[.,]?[0-9]*"
                      value="${hasValue ? value : ''}" placeholder="None" aria-label="${param.label}数值，输入 0 表示 None"
                      autocomplete="off" ${disabled ? 'disabled' : ''}>`
            : (showNumberInput
              ? `<input type="number" class="model-number-input" data-${inputName}-number="${dataKey}" data-has-value="${hasValue}"
                       min="${param.min}" max="${param.max}" step="${param.step}" value="${value}" ${disabled ? 'disabled' : ''}>`
              : `<span class="model-value" data-model-value="${param.key}">${hasValue ? value : 'None'}</span>`)}
        </div>
      </div>`;
  };
  const card = (rows) => `<div class="model-card">${rows.join('')}</div>`;

  if (!grouped) {
    return MODEL_PARAMETERS.map(sliderRow).join('');
  }
  // 按 group 分卡片
  return GROUP_ORDER.map((g) => {
    const rows = MODEL_PARAMETERS.filter((p) => p.group === g).map(sliderRow);
    if (!rows.length) return '';
    return card(rows);
  }).join('');
}

const API_MODEL_PARAMETER_DEFAULTS = Object.freeze({
  temperature: null,
  topP: null,
  topK: null,
  maxTokens: null,
  frequencyPenalty: null,
  presencePenalty: null,
  customJson: '',
});

function normalizeApiModelParameters(value) {
  return { ...API_MODEL_PARAMETER_DEFAULTS, ...(value && typeof value === 'object' ? value : {}) };
}

function parseCustomModelParameters(text = '') {
  if (!String(text).trim()) return {};
  const parsed = JSON.parse(text);
  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
    throw new Error('自定义参数必须是 JSON 对象');
  }
  const safe = { ...parsed };
  ['model', 'messages', 'apiUrl', 'apiKey'].forEach((key) => delete safe[key]);
  return safe;
}

function finiteModelParameter(value) {
  return value !== null
    && value !== undefined
    && !(typeof value === 'string' && value.trim() === '')
    && Number.isFinite(Number(value));
}

function activeDedicatedModelParameter(value) {
  return finiteModelParameter(value) && Number(value) !== 0;
}

function validTopP(value) {
  return finiteModelParameter(value) && Number(value) > 0 && Number(value) <= 1;
}

function dedicatedRequestParameters(api) {
  // 关闭模型专用参数时，只停用发送，不清空已保存值；再次开启即可继续沿用。
  if (api?.useCustomParams !== true) return {};
  const settings = normalizeApiModelParameters(api?.modelParameters);
  const params = {};
  if (activeDedicatedModelParameter(settings.temperature)) params.temperature = Number(settings.temperature);
  if (validTopP(settings.topP)) params.top_p = Number(settings.topP);
  if (activeDedicatedModelParameter(settings.topK)) params.top_k = Number(settings.topK);
  if (activeDedicatedModelParameter(settings.maxTokens)) params.max_tokens = Number(settings.maxTokens);
  if (activeDedicatedModelParameter(settings.frequencyPenalty)) params.frequency_penalty = Number(settings.frequencyPenalty);
  if (activeDedicatedModelParameter(settings.presencePenalty)) params.presence_penalty = Number(settings.presencePenalty);
  const merged = { ...params, ...parseCustomModelParameters(settings.customJson) };
  // 自定义 JSON 也可能遗留 top_p:null / 0；无效值应让下层全局参数接管，而不是覆盖成错误值。
  if ('top_p' in merged && !validTopP(merged.top_p)) delete merged.top_p;
  return merged;
}

function globalRequestParameters() {
  if (!modelSettings.enabled) return {};
  const params = {
    temperature: Number(modelSettings.temperature),
    max_tokens: Number(modelSettings.maxTokens),
    stream: modelSettings.stream === true,
  };
  if (validTopP(modelSettings.topP)) params.top_p = Number(modelSettings.topP);
  // Top-K 为 0 表示不发送，让供应商采用自身默认值。
  if (Number(modelSettings.topK) > 0) params.top_k = Number(modelSettings.topK);
  // repetitionPenalty <= 1.0 视为不发送，避免对不支持该参数的接口（如 Claude / Gemini）报错。
  if (Number(modelSettings.repetitionPenalty) > 1.0001) params.repetition_penalty = Number(modelSettings.repetitionPenalty);
  if (Number(modelSettings.frequencyPenalty) > 0) params.frequency_penalty = Number(modelSettings.frequencyPenalty);
  if (Number(modelSettings.presencePenalty) > 0) params.presence_penalty = Number(modelSettings.presencePenalty);
  return params;
}

// 当全局参数 / 模型专用参数 都没值时给的一个稳妥兜底，避免给供应商发一个完全没有采样参数的请求。
const FALLBACK_REQUEST_PARAMETERS = Object.freeze({ temperature: 0.7 });

function activePresetRequestParameters(presetOverride = null) {
  const source = (presetOverride || activePreset())?.rawPreset;
  if (!source || typeof source !== 'object') return {};
  const aliases = {
    temperature: 'temperature', top_p: 'top_p', top_k: 'top_k',
    repetition_penalty: 'repetition_penalty', frequency_penalty: 'frequency_penalty',
    presence_penalty: 'presence_penalty', openai_max_tokens: 'max_tokens', max_tokens: 'max_tokens',
  };
  const params = {};
  Object.entries(aliases).forEach(([from, to]) => {
    // JSON 中的 null / 空字符串表示“不发送”。Number(null) 会变成 0，不能误当成真实参数。
    if (!finiteModelParameter(source[from])) return;
    const value = Number(source[from]);
    if (to === 'top_p' && !validTopP(value)) return;
    // 负惩罚会奖励复读；旧版界面曾误把未设置保存为 -2，必须在请求前拦截。
    if ((to === 'frequency_penalty' || to === 'presence_penalty') && value < 0) return;
    params[to] = value;
  });
  if (Number(params.top_k) === 0) delete params.top_k;
  return params;
}

function resolveRequestParameters(api, presetOverride = null) {
  const global = globalRequestParameters();
  const preset = activePresetRequestParameters(presetOverride);
  const dedicated = dedicatedRequestParameters(api);
  const params = { ...global, ...preset, ...dedicated };
  if (Object.keys(params).length) {
    const sources = [];
    if (Object.keys(global).length) sources.push('全局模型设置');
    if (Object.keys(preset).length) sources.push('当前预设参数');
    if (Object.keys(dedicated).length) sources.push('模型专用参数');
    return { source: sources.join(' + '), params };
  }
  return { source: '兜底默认', params: { ...FALLBACK_REQUEST_PARAMETERS } };
}

function chatApiHost(apiUrl = '') {
  try {
    return new URL(String(apiUrl).trim()).hostname.toLowerCase();
  } catch {
    return '';
  }
}

function chatApiProvider(apiUrl = '') {
  const host = chatApiHost(apiUrl);
  if (host === 'openrouter.ai') return 'openrouter';
  if (host === 'api.deepseek.com') return 'deepseek';
  if (host === 'tokenhub.tencentmaas.com' || host.endsWith('.tencentcloudmaas.com')) return 'tencent-tokenhub';
  if (host === 'api.hunyuan.cloud.tencent.com') return 'tencent-hunyuan';
  if (host === 'api.siliconflow.cn' || host === 'api.siliconflow.com') return 'siliconflow';
  return 'openai-compatible';
}

function canonicalChatModelId(apiUrl, model = '') {
  const value = String(model).trim();
  const normalized = value.toLowerCase().replace(/[\s_]+/g, '-');
  const provider = chatApiProvider(apiUrl);

  if (provider === 'tencent-tokenhub') {
    const aliases = {
      'hy-role-latest': 'hunyuan-role-latest',
      'hunyuan-role-latest': 'hunyuan-role-latest',
      'hy-role': 'hy-role',
      // 腾讯已于 2026-08-31 下线 hy3-preview，官方迁移目标为 hy3。
      // 在启动缓存、导入配置、保存 API 和实际请求时统一纠正旧 ID。
      'hy3-preview': 'hy3',
      'hy3': 'hy3',
    };
    return aliases[normalized] || value;
  }

  if (provider === 'deepseek') {
    const aliases = {
      'deepseek-chat': 'deepseek-v4-flash',
      'deepseek-reasoner': 'deepseek-v4-flash',
      'deepseek-v4-pro': 'deepseek-v4-pro',
      'deepseek-v4-flash': 'deepseek-v4-flash',
      'deepseek-v4-flash-vision-exp': 'deepseek-v4-flash-vision-exp',
    };
    return aliases[normalized] || value;
  }

  return value;
}

function providerCompatibleParameters(apiUrl, model, parameters = {}, configuredModel = model, disableThinking = false) {
  const provider = chatApiProvider(apiUrl);
  const params = { ...parameters };
  const removed = [];
  const remove = (...keys) => keys.forEach((key) => {
    if (!(key in params)) return;
    delete params[key];
    removed.push(key);
  });

  // 所有平台的最后一道安全兜底：负惩罚会鼓励模型重复，历史缓存中的 -2 不得发出。
  if (Number(params.frequency_penalty) < 0) remove('frequency_penalty');
  if (Number(params.presence_penalty) < 0) remove('presence_penalty');

  // 这两项是硅基流动常用扩展参数，但不是通用 OpenAI 字段。
  if (provider === 'deepseek' || provider === 'tencent-tokenhub' || provider === 'tencent-hunyuan') {
    remove('top_k', 'repetition_penalty');
  }

  // DeepSeek 旧直连 ID 已退役：保留 Tavo 迁移用户原来的“普通/思考”语义。
  const configuredDeepSeekModel = String(configuredModel).trim().toLowerCase();
  if (provider === 'deepseek' && !('thinking' in params)) {
    if (configuredDeepSeekModel === 'deepseek-chat') params.thinking = { type: 'disabled' };
    if (configuredDeepSeekModel === 'deepseek-reasoner') params.thinking = { type: 'enabled' };
  }

  // 普通聊天保留 Hy3 的思考能力。新 hy3 的平台默认可能关闭思考，因而
  // 在用户没有自定义 thinking 时明确开启；总结通道另行保持快速的非思考模式。
  if (provider === 'tencent-tokenhub' && /^hy3(?:-preview)?$/i.test(String(model)) && !('thinking' in params)) {
    params.thinking = { type: 'enabled', budget_tokens: 8192 };
  }

  // “关闭思考链”控制的是模型推理本身，不只是把思考文字藏起来。
  // 各平台字段并不统一，只对已知协议做明确映射，避免给普通兼容接口乱塞字段导致 400。
  if (disableThinking) {
    if (provider === 'openrouter') {
      remove('thinking', 'enable_thinking', 'include_reasoning');
      params.reasoning = { effort: 'none' };
    } else if (provider === 'tencent-tokenhub' || provider === 'deepseek') {
      remove('reasoning', 'enable_thinking');
      params.thinking = { type: 'disabled' };
    } else if (provider === 'siliconflow' || provider === 'tencent-hunyuan') {
      remove('thinking', 'reasoning', 'include_reasoning');
      params.enable_thinking = false;
    }
  }
  // 思考 token 与正文共用 max_tokens。8192 的思考预算配 16384 的总上限，
  // 给正文留下空间；这里只提高允许上限，不代表每次一定消耗这么多。
  if (provider === 'tencent-tokenhub'
    && /^hy3(?:-preview)?$/i.test(String(model))
    && params?.thinking?.type === 'enabled'
    && (!finiteModelParameter(params.max_tokens) || Number(params.max_tokens) < 16384)) {
    params.max_tokens = 16384;
  }

  // DeepSeek 思考模式明确不接受这些采样参数；普通聊天模式仍保留 temperature / top_p。
  const thinkingEnabled = params?.thinking?.type === 'enabled' || /reasoner/i.test(String(model));
  if (provider === 'deepseek' && thinkingEnabled) {
    remove('temperature', 'top_p', 'frequency_penalty', 'presence_penalty');
  }

  return { provider, params, removed };
}

function apiErrorDetail(text = '') {
  const raw = String(text).trim();
  if (!raw) return '';
  try {
    const payload = JSON.parse(raw);
    return String(payload?.error?.message || payload?.message || payload?.error || raw);
  } catch {
    return raw;
  }
}

function isUnavailableModelError(status, text = '') {
  const detail = apiErrorDetail(text);
  return status === 400
    && /400004|model.+does not exist|model.+not found|service id.+does not exist|supported api model names|but you passed/i.test(detail);
}

function comparableModelId(model = '') {
  return String(model).trim().toLowerCase().replace(/[\s_]+/g, '-');
}

// 只在平台实际返回的模型列表里选择，不内置任何“新模型表”。
// 自动替换仅限明确、安全的情况：大小写差异、已知语义别名、或末尾 4～8 位发布日期被移除。
function replacementModelFromAvailable(apiUrl, attemptedModel, availableModels = []) {
  const unique = [...new Set(availableModels.map((model) => String(model).trim()).filter(Boolean))];
  if (!unique.length) return '';
  const byComparable = new Map(unique.map((model) => [comparableModelId(model), model]));
  const attempted = comparableModelId(attemptedModel);
  const canonical = comparableModelId(canonicalChatModelId(apiUrl, attemptedModel));
  if (byComparable.has(canonical)) return byComparable.get(canonical);
  if (byComparable.has(attempted)) return byComparable.get(attempted);

  const withoutReleaseDate = attempted.replace(/[-_.]\d{4,8}$/, '');
  if (withoutReleaseDate !== attempted && byComparable.has(withoutReleaseDate)) {
    return byComparable.get(withoutReleaseDate);
  }
  return unique.length === 1 ? unique[0] : '';
}

async function postChatCompletion(apiUrl, apiKey, requestBody, signal, onProgress = null) {
  if (isLocalPreview()) {
    return fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiUrl, apiKey, ...requestBody }),
        signal,
      });
  }
  const target = `${apiUrl}/chat/completions`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
    signal,
  };
  // 新安装包使用原生逐行 SSE 通道；旧安装包没有该桥接时由调用方退回普通 JSON。
  if (isNativeApp() && requestBody.stream === true && nativeStreamingBridge()) {
    return nativeSseFetchResponse(target, requestOptions, onProgress);
  }
  return fetch(target, requestOptions);
}

async function postChatCompletionWithModelRecovery(api, requestBody, signal, onProgress = null) {
  const apiUrl = String(api?.url || '').trim().replace(/\/+$/, '');
  let response = await postChatCompletion(apiUrl, api.key, requestBody, signal, onProgress);
  if (response.ok) return { response, model: requestBody.model, recoveredFrom: '' };

  const firstErrorBody = await response.clone().text().catch(() => '');
  if (!isUnavailableModelError(response.status, firstErrorBody)) {
    return { response, model: requestBody.model, recoveredFrom: '' };
  }

  let availableModels = [];
  try {
    availableModels = await requestAvailableModels(apiUrl, api.key);
  } catch (error) {
    logRuntime('warn', 'api', '模型失效后刷新模型列表失败', { error: String(error?.message || error) });
  }
  const replacement = replacementModelFromAvailable(apiUrl, requestBody.model, availableModels);
  if (!replacement || comparableModelId(replacement) === comparableModelId(requestBody.model)) {
    return { response, model: requestBody.model, recoveredFrom: '', availableModels };
  }

  const retryBody = { ...requestBody, model: replacement };
  const retryResponse = await postChatCompletion(apiUrl, api.key, retryBody, signal, onProgress);
  if (retryResponse.ok) {
    const previousModel = requestBody.model;
    api.model = replacement;
    if (comparableModelId(modelSettings.model) === comparableModelId(previousModel)) {
      modelSettings.model = replacement;
    }
    saveApiCache();
    logRuntime('info', 'api', '旧模型 ID 已按接口模型列表自动更新', {
      from: previousModel,
      to: replacement,
    });
    return { response: retryResponse, model: replacement, recoveredFrom: previousModel, availableModels };
  }
  return { response: retryResponse, model: replacement, recoveredFrom: requestBody.model, availableModels };
}

function friendlyChatApiError(status, text, api, model) {
  const detail = apiErrorDetail(text);
  const provider = chatApiProvider(api?.url);
  const modelMissing = isUnavailableModelError(status, text);
  if (modelMissing) {
    const tokenHubHint = provider === 'tencent-tokenhub'
      ? '腾讯页面显示的模型名称不一定等于请求 ID，例如 Hy-Role-Latest 应使用 hunyuan-role-latest。'
      : '';
    return `API 错误 400：模型 ID“${model}”在“${api?.name || '当前 API'}”中不可用。${tokenHubHint}请进入 API连接 → 编辑 → 模型，重新拉取并选择该接口实际返回的模型 ID。`;
  }
  if (status === 400 && /parameter|field|unsupported|invalid request|invalid_request/i.test(detail)) {
    return `API 错误 400：“${api?.name || '当前 API'}”不接受本次请求中的某个字段。App 已按平台过滤常见不兼容参数；若仍出现，请检查此 API 的“模型专用参数 → 自定义 JSON”。${detail ? ` 服务端信息：${detail.slice(0, 120)}` : ''}`;
  }
  return `API 错误 ${status}: ${detail.slice(0, 200)}`;
}

// 仅暴露纯计算诊断，不包含 API 密钥或聊天内容，便于浏览器与安卓壳做兼容回归检查。
window.XiangsiApiCompatibility = Object.freeze({
  provider: chatApiProvider,
  canonicalModelId: canonicalChatModelId,
  replacementModel: replacementModelFromAvailable,
  parameters: providerCompatibleParameters,
  friendlyError: friendlyChatApiError,
});

const DEFAULT_IMPERSONATION_PROMPT = '请仅以{{user}}的身份，根据当前对话、用户人设和已经表现出的说话方式，生成{{user}}接下来最自然的一条回复。保持与当前情境连贯，贴合{{user}}的语气、态度、措辞和行为逻辑。如果输入框已有草稿，请保留其核心意图并自然续写或润色。只输出可直接发送的回复正文；不要添加“{{user}}：”等姓名前缀，不要解释任务，不要输出分析，不要扮演{{char}}，不要替{{char}}说话，也不要继续生成{{char}}的回应。';
const DEFAULT_ANTI_REPEAT_PROMPT = `【内置·防重复】
以下内容是用户已经刷走的候选回答。它们没有在剧情中发生，不属于正式聊天历史，只用于帮助你避开重复。

{{rejectedCandidates}}

请重新回答当前用户消息，并严格遵守：
1. 不复用上述候选的动作、话语、句式和情节切入点；
2. 本轮差异方向：{{variationDirection}}；
3. 本轮变化编号：{{variationSalt}}。这是区分本次请求的内部标记，不得在回复中提及；
4. 只改变本轮表达路径，不改变{{char}}的核心人设、既有关系和已经发生的剧情；
5. 不得提到“候选、重刷、拒绝、防重复、后台规则、变化编号”等信息；
6. 只输出{{char}}本轮可以直接发送的正式回复。`;

const presets = [
  {
    id: 'preset-legacy-default',
    name: '旧预设（原默认组合）',
    legacyDefault: true,
    mainPrompt: '',
    userIdentity: '',
    charSetting: '',
    charPersonality: '',
    scenario: '',
    chatExample: '',
    newChat: '',
    groupAdvance: '',
    continueStory: '',
    aiAnswer: '',
    wordInfoBefore: '',
    personaDescription: '',
    charDescription: '',
    enhanceDefinitions: '',
    auxiliaryPrompt: '',
    worldInfoAfter: '',
    chatHistory: '',
    postHistoryInstructions: '',
    impersonationPrompt: DEFAULT_IMPERSONATION_PROMPT,
    jailbreak: '',
    active: true,
  },
  {
    id: 'preset-immersive',
    name: '沉醉 柳邶',
    // ===== Main Prompt：总体指导（位于对话开头，设定行为基调与方向）=====
    mainPrompt: '沉浸式角色扮演，回复保留动作、神态、心理暗线，语气贴合当前角色。',
    // ===== 基础提示词（角色基础配置与行为模式）=====
    userIdentity: '{{user}}是{{char}}的挚友，彼此有深厚羁绊，互动亲密而自然。',
    charSetting: '',
    charPersonality: '',
    scenario: '',
    chatExample: '',
    newChat: '',
    groupAdvance: '',
    continueStory: '',
    aiAnswer: '',
    // ===== 其他详细提示词 =====
    wordInfoBefore: '',
    personaDescription: '',
    charDescription: '',
    enhanceDefinitions: '',
    auxiliaryPrompt: '',
    worldInfoAfter: '',
    chatHistory: '',
    postHistoryInstructions: '',
    jailbreak: '避免出戏，不提系统规则，不替用户决定行动。',
    active: false,
  },
  {
    id: 'preset-soft',
    name: '温柔陪伴',
    mainPrompt: '偏情绪安抚和日常陪伴，回复更短，更像手机聊天。',
    userIdentity: '',
    charSetting: '',
    charPersonality: '',
    scenario: '',
    chatExample: '',
    newChat: '',
    groupAdvance: '',
    continueStory: '',
    aiAnswer: '',
    wordInfoBefore: '',
    personaDescription: '',
    charDescription: '',
    enhanceDefinitions: '',
    auxiliaryPrompt: '',
    worldInfoAfter: '',
    chatHistory: '',
    postHistoryInstructions: '',
    jailbreak: '',
    active: false,
  },
];
let selectedPresetId = presets.find((preset) => preset.active)?.id || presets[0]?.id || '';

const DEFAULT_PROMPT_MANAGER_ORDER = [
  'main', 'worldInfoBefore', 'personaDescription', 'charDescription', 'charPersonality',
  'scenario', 'supplemental', 'dialogueExamples', 'worldInfoAfter', 'chatHistory', 'postHistoryInstructions',
];

const DEFAULT_PROMPT_MARKERS = {
  worldInfoBefore: '世界书（角色定义之前）', personaDescription: '用户人设',
  charDescription: '角色描述', charPersonality: '角色性格', scenario: '场景',
  dialogueExamples: '示例对话', worldInfoAfter: '世界书（角色定义之后）', chatHistory: '聊天记录',
};

function ensurePresetPromptManagerData(preset) {
  if (!preset) return preset;
  if (Array.isArray(preset.promptBlocks) && Array.isArray(preset.promptOrder)) {
    ensureLegacyImpersonationPrompt(preset);
    ensureLegacyAntiRepeatPrompt(preset);
    return preset;
  }
  const supplemental = joinPromptParts([
    preset.newChat || '', preset.groupAdvance || '', preset.continueStory || '',
    preset.aiAnswer || '', preset.chatHistory || '', preset.jailbreak || '', preset.auxiliaryPrompt || '',
  ]);
  const contentById = {
    main: preset.mainPrompt || preset.prompt || '',
    supplemental,
    postHistoryInstructions: preset.postHistoryInstructions || '',
  };
  preset.promptBlocks = DEFAULT_PROMPT_MANAGER_ORDER.map((identifier) => ({
    identifier,
    name: DEFAULT_PROMPT_MARKERS[identifier] || ({ main: 'Main Prompt', supplemental: '辅助规则', postHistoryInstructions: '历史后指令' }[identifier] || identifier),
    role: 'system',
    content: contentById[identifier] || '',
    marker: Object.hasOwn(DEFAULT_PROMPT_MARKERS, identifier),
    systemPrompt: identifier === 'main',
  }));
  preset.promptOrder = DEFAULT_PROMPT_MANAGER_ORDER.map((identifier) => ({ identifier, enabled: true }));
  ensureLegacyImpersonationPrompt(preset);
  ensureLegacyAntiRepeatPrompt(preset);
  return preset;
}

function ensureLegacyImpersonationPrompt(preset) {
  if (!preset || (preset.id !== 'preset-legacy-default' && preset.legacyDefault !== true)) return preset;
  preset.impersonationPrompt ||= DEFAULT_IMPERSONATION_PROMPT;
  preset.promptBlocks ||= [];
  preset.promptOrder ||= [];
  let block = preset.promptBlocks.find((item) => item.identifier === 'impersonation');
  if (!block) {
    block = {
      identifier: 'impersonation',
      name: '帮答（仅帮答时启用）',
      role: 'system',
      content: preset.impersonationPrompt,
      marker: false,
      systemPrompt: false,
      injectionPosition: 0,
      injectionDepth: 0,
      injectionOrder: 100,
      injectionTrigger: ['impersonate'],
    };
    preset.promptBlocks.push(block);
  } else {
    block.injectionTrigger = ['impersonate'];
    if (!String(block.content || '').trim()) block.content = preset.impersonationPrompt;
  }
  if (!preset.promptOrder.some((item) => item.identifier === 'impersonation')) {
    const postIndex = preset.promptOrder.findIndex((item) => item.identifier === 'postHistoryInstructions');
    preset.promptOrder.splice(postIndex < 0 ? preset.promptOrder.length : postIndex, 0, { identifier: 'impersonation', enabled: true });
  }
  return preset;
}

function ensureLegacyAntiRepeatPrompt(preset) {
  if (!preset || (preset.id !== 'preset-legacy-default' && preset.legacyDefault !== true)) return preset;
  preset.promptBlocks ||= [];
  preset.promptOrder ||= [];
  let block = preset.promptBlocks.find((item) => item.identifier === 'antiRepeat');
  if (!block) {
    block = {
      identifier: 'antiRepeat',
      name: '《防重复》',
      role: 'system',
      content: DEFAULT_ANTI_REPEAT_PROMPT,
      marker: false,
      systemPrompt: false,
      injectionPosition: 0,
      injectionDepth: 0,
      injectionOrder: 100,
      injectionTrigger: ['regenerate'],
    };
    preset.promptBlocks.push(block);
  } else {
    block.name = '《防重复》';
    block.role = 'system';
    block.injectionTrigger = ['regenerate'];
    if (!String(block.content || '').trim()) block.content = DEFAULT_ANTI_REPEAT_PROMPT;
  }
  if (!preset.promptOrder.some((item) => item.identifier === 'antiRepeat')) {
    const postIndex = preset.promptOrder.findIndex((item) => item.identifier === 'postHistoryInstructions');
    preset.promptOrder.splice(postIndex < 0 ? preset.promptOrder.length : postIndex, 0, { identifier: 'antiRepeat', enabled: true });
  }
  return preset;
}

const worldBooks = [
  {
    id: 'wb-lost-you-forever',
    name: '长相思世界书',
    enabled: false,
    keywords: '相柳, 防风邶, 小夭, 毛球, 清水镇',
    content: '用于存放稳定设定、人物关系、地点、名词解释。后续可以导入酒馆 lorebook/world info。',
    constant: false,
    secondaryKeys: '',
    selectiveLogic: 'AND_ANY',
    position: 'after_char',
    role: 'system',
    order: 100,
    depth: 4,
    probability: 100,
    scanDepth: 20,
  },
];

// 世界书是“书 → 条目”的两层结构。保留 worldBooks 作为首本内置书的条目数组，
// 让旧缓存/旧备份可以无损迁移；新界面和扫描器统一从 lorebookLibrary 读取。
const lorebookLibrary = [
  {
    id: 'lorebook-lost-you-forever',
    name: '长相思世界书',
    active: false,
    entries: worldBooks,
  },
];
let selectedLorebookId = lorebookLibrary[0].id;

// 酒馆式世界书的全局扫描约束。条目仍保存在 worldBooks 数组中，兼容旧配置。
const worldBookSettings = {
  scanDepth: 20,
  budgetChars: 12000,
  budgetPercent: 25,
  budgetCap: 0,
  recursive: true,
  maxRecursionSteps: 3,
  minActivations: 0,
  maxDepth: 0,
  includeNames: true,
  caseSensitive: false,
  matchWholeWords: false,
  useGroupScoring: false,
  overflowAlert: false,
  insertionStrategy: 0,
};

function selectedLorebook() {
  // 空字符串代表用户在编辑器中明确选择了“无世界书”，不能再自动回落到第一本。
  if (!selectedLorebookId) return null;
  return lorebookLibrary.find((book) => book.id === selectedLorebookId) || lorebookLibrary[0] || null;
}

function roleWorldbookIds(role = currentRole) {
  return Array.isArray(role?.worldBookIds) ? role.worldBookIds.filter(Boolean) : [];
}

function activeWorldBooksForRole(role = currentRole) {
  const enabledForRole = new Set(roleWorldbookIds(role));
  return lorebookLibrary.filter((book) => book.active || enabledForRole.has(book.id));
}

function activeWorldEntries() {
  return activeWorldBooksForRole()
    .flatMap((book) => (book.entries || []).map((entry) => ({ ...entry, lorebookId: book.id, lorebookName: book.name })));
}

function ensureLorebookLibraryFromLegacy(entries, name = '迁移的世界书') {
  if (!Array.isArray(entries)) return;
  let target = lorebookLibrary[0];
  if (!target) {
    target = { id: `lorebook-${Date.now()}`, name, active: false, entries: [] };
    lorebookLibrary.push(target);
  }
  target.entries.splice(0, target.entries.length, ...entries);
  if (name) target.name = name;
  selectedLorebookId = target.id;
}

const regexRules = [
  // 默认关闭：首次安装/清空缓存后不在后台悄悄改写 AI 回复。
  // 用户可在「更多 → 正则替换」里手动启用。
  { id: 'regex-action', name: '动作括号保留', enabled: false, find: '\\((.*?)\\)', replace: '（$1）' },
];

const memorySettings = {
  enabled: true,
  injectStructured: true,
  retrievePast: true,
  mode: '聊天记录 + 摘要 + RAG',
  autoSummary: false,
  summaryLimit: 30,
  recentKeep: 10,
  summaryApiId: '',
  maxRetrieved: 5,
  injectionPosition: 'before_history',
  injectionDepth: 4,
  chunkSize: 900,
  chunkOverlap: 120,
  vector: false,
  bm25: true,
  embeddingPlatform: 'siliconflow',
  embeddingEndpoint: '',
  embeddingApiKey: '',
  embeddingModel: '',
  vectorWeight: 0.6,
  rerank: false,
  rerankPlatform: 'siliconflow',
  rerankEndpoint: '',
  rerankApiKey: '',
  rerankModel: '',
  candidateLimit: 20,
  summaryPrompt: `你是长篇角色聊天的记忆整理员。只能依据提供的对话更新数据，不得猜测、补写或改变已发生的事。
按剧情真实发生的先后与因果整理，保留会影响后续对话的一致性信息；没有可靠信息就留空。`,
  injectionPrompt: `以下是{{char}}与{{user}}的已发生剧情与相关资料。请像自然回想一样保持一致，只在当前话题相关时使用，不要主动复述记忆：
{{memories}}`,
  notes: '聊天剧情与原著知识库分库召回；BM25 与向量混合检索，可选重排。',
  customStateTemplates: [],
  promptLibraries: {},
  knowledgePerformanceSendFields: ['situationTags', 'relationshipContext', 'trigger', 'innerMotive', 'outwardResponse', 'speechPattern', 'actionPattern', 'avoid', 'excerpt'],
};

const DEFAULT_MEMORY_SUMMARY_PROMPT = memorySettings.summaryPrompt;
const DEFAULT_MEMORY_INJECTION_PROMPT = memorySettings.injectionPrompt;

const MEMORY_PROMPT_TARGETS = Object.freeze({
  summary: { label: '总结总规则', content: DEFAULT_MEMORY_SUMMARY_PROMPT },
  currentTime: { label: '当前时间', content: '只在对话明确给出时间或明确发生时间推进时更新；不得猜测日期。' },
  currentLocation: { label: '当前地点', content: '只在人物明确到达、离开或切换地点时更新；使用对话中的地点原名。' },
  relationships: { label: '人物关系', content: '只记录人物关系的正式确立或质变，例如明确告白、成婚、相认、正式背叛或结盟；普通吵架、送礼和短暂亲密不得改变长期关系。' },
  openPlots: { label: '未完剧情', content: '只保留尚未解决的目标、伏笔、危险和正式约定；解决后移出常驻区并写入剧情纪要。' },
  summaries: { label: '剧情纪要', content: '按真实发生顺序总结本批新剧情，只写会影响后续理解的事件，不复制当前状态字段。' },
  customState: { label: '自定义状态', content: '只在对话明确显示该状态发生变化时更新；不得猜测。' },
  knowledgePerformance: { label: '情境演绎提取', content: '只分析已指定目标角色在本段真实情境中的思考动机、语言方式与动作反应；保留短原文证据，不照写剧情总结，不把单次反应当成永久性格。' },
  knowledgeProfile: { label: '角色本色归纳', content: '依据多张有证据的情境演绎卡归纳稳定本色；倾向至少需要两段独立证据或原文明示，不得把本段情绪、偶发动作或其他角色特征写入本色卡。' },
  knowledgeFacts: { label: '原作事实与关系提取', content: '只整理目标角色相关的明确身份、别名、长期关系和会影响理解的原作事实；一次性动作、临时情绪和推测不得进入事实库。' },
  injection: { label: '记忆注入包装', content: DEFAULT_MEMORY_INJECTION_PROMPT },
});

const KNOWLEDGE_PERFORMANCE_FIELDS = Object.freeze([
  { id: 'situationTags', label: '情境标签', outputLabel: '情境', sample: '受伤后被发现' },
  { id: 'relationshipContext', label: '关系阶段', outputLabel: '关系阶段', sample: '彼此在意但仍有防备' },
  { id: 'trigger', label: '触发事件', outputLabel: '触发', sample: '对方发现他隐瞒伤势' },
  { id: 'innerMotive', label: '内在动机', outputLabel: '内在动机', sample: '不愿让对方担心' },
  { id: 'outwardResponse', label: '外在反应', outputLabel: '外在反应', sample: '淡淡否认并移开话题' },
  { id: 'speechPattern', label: '语言方式', outputLabel: '语言方式', sample: '简短克制，不直接示弱' },
  { id: 'actionPattern', label: '动作方式', outputLabel: '动作方式', sample: '先藏起伤处，再不动声色地护住对方' },
  { id: 'avoid', label: '避免行为', outputLabel: '避免行为', sample: '不会卖惨或主动索取安慰' },
  { id: 'excerpt', label: '原文证据', outputLabel: '原文证据', sample: '他把手藏进袖中，只说无妨。' },
]);
const KNOWLEDGE_PERFORMANCE_ALL_FIELDS = Object.freeze(KNOWLEDGE_PERFORMANCE_FIELDS.map((field) => field.id));
const KNOWLEDGE_PERFORMANCE_RECOMMENDED_FIELDS = Object.freeze(['trigger', 'innerMotive', 'speechPattern', 'actionPattern']);

function normalizeKnowledgePerformanceSendFields(value) {
  if (!Array.isArray(value)) return [...KNOWLEDGE_PERFORMANCE_ALL_FIELDS];
  const selected = new Set(value.map((item) => String(item || '').trim()));
  return KNOWLEDGE_PERFORMANCE_ALL_FIELDS.filter((id) => selected.has(id));
}

function knowledgePerformanceSendFields() {
  const normalized = normalizeKnowledgePerformanceSendFields(memorySettings.knowledgePerformanceSendFields);
  memorySettings.knowledgePerformanceSendFields = normalized;
  return normalized;
}

function sameKnowledgePerformanceFields(left, right) {
  const a = normalizeKnowledgePerformanceSendFields(left);
  const b = normalizeKnowledgePerformanceSendFields(right);
  return a.length === b.length && a.every((id, index) => id === b[index]);
}

function knowledgePerformanceSendFieldsStatus(value = memorySettings.knowledgePerformanceSendFields) {
  const fields = normalizeKnowledgePerformanceSendFields(value);
  if (fields.length === KNOWLEDGE_PERFORMANCE_ALL_FIELDS.length) return '全部9项';
  if (sameKnowledgePerformanceFields(fields, KNOWLEDGE_PERFORMANCE_RECOMMENDED_FIELDS)) return '推荐4项';
  return `自定义 ${fields.length}/9`;
}

function memorySystemPromptId(target) {
  return `system:${target}`;
}

function stableMemoryPromptHash(value) {
  let hash = 2166136261;
  for (const char of String(value || '')) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function normalizeMemoryPromptLibraries() {
  const stored = memorySettings.promptLibraries && typeof memorySettings.promptLibraries === 'object' ? memorySettings.promptLibraries : {};
  const raw = { ...stored };
  if (Array.isArray(stored.knowledgeExtraction)) {
    raw.knowledgeFacts = [...(Array.isArray(stored.knowledgeFacts) ? stored.knowledgeFacts : []), ...stored.knowledgeExtraction];
  }
  memorySettings.promptLibraries = Object.fromEntries(Object.keys(MEMORY_PROMPT_TARGETS).map((target) => {
    const seenNames = new Set();
    const seenContent = new Set();
    const rows = (Array.isArray(raw[target]) ? raw[target] : []).map((item, index) => {
      const content = String(item?.content || item?.body || '').trim();
      const baseName = String(item?.name || `提示词 ${index + 1}`).trim();
      if (!content || !baseName || seenContent.has(content)) return null;
      let name = baseName;
      let duplicateIndex = 2;
      while (seenNames.has(name.toLocaleLowerCase())) name = `${baseName} (${duplicateIndex++})`;
      seenNames.add(name.toLocaleLowerCase());
      seenContent.add(content);
      return { id: String(item?.id || `prompt-${target}-${stableMemoryPromptHash(content)}`), name, content, builtin: false };
    }).filter(Boolean).slice(0, 100);
    return [target, rows];
  }));
  return memorySettings.promptLibraries;
}

function memoryPromptVersions(target) {
  const config = MEMORY_PROMPT_TARGETS[target] || MEMORY_PROMPT_TARGETS.customState;
  normalizeMemoryPromptLibraries();
  return [{ id: memorySystemPromptId(target), name: '系统默认', content: config.content, builtin: true }, ...(memorySettings.promptLibraries[target] || [])];
}

function resolveMemoryPrompt(target, promptId) {
  const versions = memoryPromptVersions(target);
  return versions.find((item) => item.id === promptId) || versions[0];
}

function ensureLegacyMemoryPrompt(target, content) {
  const text = String(content || '').trim();
  const system = MEMORY_PROMPT_TARGETS[target]?.content || '';
  if (!text || text === system) return memorySystemPromptId(target);
  normalizeMemoryPromptLibraries();
  const existing = (memorySettings.promptLibraries[target] || []).find((item) => item.content === text);
  if (existing) return existing.id;
  const suffix = stableMemoryPromptHash(text);
  const id = `legacy-${target}-${suffix}`;
  memorySettings.promptLibraries[target].push({ id, name: `旧版提示词 ${suffix.slice(0, 4)}`, content: text, builtin: false });
  return id;
}

function defaultMemoryPromptSelections() {
  return Object.fromEntries(Object.keys(MEMORY_PROMPT_TARGETS).map((target) => [target, memorySystemPromptId(target)]));
}

function normalizeKnowledgePromptSelections(value) {
  const source = value && typeof value === 'object' ? value : {};
  const stored = source.knowledgePromptSelections && typeof source.knowledgePromptSelections === 'object' ? source.knowledgePromptSelections : source;
  const legacyFacts = String(source.knowledgePromptId || stored.knowledgeExtraction || stored.facts || '').trim();
  return {
    performance: String(stored.performance || stored.knowledgePerformance || memorySystemPromptId('knowledgePerformance')),
    profile: String(stored.profile || stored.knowledgeProfile || memorySystemPromptId('knowledgeProfile')),
    facts: String(legacyFacts || stored.knowledgeFacts || memorySystemPromptId('knowledgeFacts')),
  };
}

function migrateLegacyMemorySummaryPrompt() {
  const prompt = String(memorySettings.summaryPrompt || '');
  const looksLikeLegacySchema = (prompt.includes('"userProfile"') || prompt.includes('"globalState"') || prompt.includes('主角技能表'))
    && (prompt.includes('"plotSummary"') || prompt.includes('七张表'));
  if (looksLikeLegacySchema) {
    memorySettings.summaryPrompt = DEFAULT_MEMORY_SUMMARY_PROMPT;
  }
}

const MEMORY_DYNAMIC_PROMPT = `【程序固定的动态记忆协议】
只更新请求中明确列出的启用项目；关闭“自动更新”的项目不得返回。
plotSummary 只写本批剧情纪要，不得复制当前状态。
anchorUpdates 只返回发生变化的当前时间、当前地点。
relationshipUpdates 只记录人物关系的正式确立或质变；关系内容使用自由文字，不得用普通吵架、送礼、拥抱、短暂亲密或一次性动作推断长期关系。
openPlotOps.upsert 只记录尚未解决的目标、伏笔、危险或正式约定；openPlotOps.resolve 只返回本批明确解决的已有 id。
customStateUpdates 只能使用请求中给出的项目 id，并严格遵守每项更新提示词。
每项 evidence 必须来自本批新对话；没有可靠信息就省略该更新。`;

function createMemoryToggle(updateEnabled = true, sendEnabled = true) {
  return { updateEnabled, sendEnabled };
}

function createAnchorField(id, name, updatePrompt, value = '') {
  return { id, name, value: String(value || ''), updatePrompt, updateEnabled: true, sendEnabled: true, builtin: true };
}

function defaultMemoryAnchors() {
  return {
    currentTime: createAnchorField('currentTime', '当前时间', '只在对话明确给出时间或明确发生时间推进时更新；不得猜测日期。'),
    currentLocation: createAnchorField('currentLocation', '当前地点', '只在人物明确到达、离开或切换地点时更新；使用对话中的地点原名。'),
  };
}

function normalizeMemoryToggle(value, defaults = createMemoryToggle()) {
  const source = value && typeof value === 'object' ? value : {};
  return {
    updateEnabled: source.updateEnabled !== false && source.update !== false,
    sendEnabled: source.sendEnabled !== false && source.send !== false,
    ...defaults,
    ...(Object.hasOwn(source, 'updateEnabled') ? { updateEnabled: source.updateEnabled === true } : {}),
    ...(Object.hasOwn(source, 'sendEnabled') ? { sendEnabled: source.sendEnabled === true } : {}),
  };
}

function normalizeAnchorField(value, fallback) {
  const source = value && typeof value === 'object' ? value : {};
  return {
    ...fallback,
    value: String(source.value ?? fallback.value ?? '').trim(),
    updatePrompt: String(source.updatePrompt || fallback.updatePrompt || '').trim(),
    updateEnabled: source.updateEnabled !== false,
    sendEnabled: source.sendEnabled !== false,
  };
}

function normalizeCustomStates(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.map((item, index) => {
    const id = String(item?.id || `custom-${index}-${Date.now()}`).trim();
    if (!id || seen.has(id)) return null;
    seen.add(id);
    const valueType = item?.valueType === 'number' ? 'number' : 'text';
    let min = item?.min === '' || item?.min == null ? null : Number(item.min);
    let max = item?.max === '' || item?.max == null ? null : Number(item.max);
    if (!Number.isFinite(min)) min = null;
    if (!Number.isFinite(max)) max = null;
    if (min != null && max != null && min > max) [min, max] = [max, min];
    let currentValue = String(item?.value ?? '').trim();
    if (valueType === 'number' && currentValue !== '' && Number.isFinite(Number(currentValue))) {
      let numeric = Number(currentValue);
      if (min != null) numeric = Math.max(min, numeric);
      if (max != null) numeric = Math.min(max, numeric);
      currentValue = String(numeric);
    }
    return {
      id,
      name: String(item?.name || item?.label || `自定义项目 ${index + 1}`).trim(),
      value: currentValue,
      valueType,
      min,
      max,
      unit: String(item?.unit || '').trim(),
      showProgress: valueType === 'number' && item?.showProgress === true,
      order: Number.isFinite(Number(item?.order)) ? Number(item.order) : index,
      promptId: String(item?.promptId || '').trim(),
      updatePrompt: String(item?.updatePrompt || item?.prompt || '').trim(),
      updateEnabled: item?.updateEnabled !== false,
      sendEnabled: item?.sendEnabled !== false,
      legacy: item?.legacy === true,
    };
  }).filter(Boolean).sort((a, b) => a.order - b.order).map((item, index) => ({ ...item, order: index })).slice(0, 100);
}

function validatedCustomStateValue(item, value) {
  const text = String(value ?? '').trim();
  if (item.valueType !== 'number') return { ok: true, value: text };
  if (text === '' || !Number.isFinite(Number(text))) return { ok: false, value: item.value, error: '数值状态必须填写有效数字' };
  let numeric = Number(text);
  if (item.min != null) numeric = Math.max(Number(item.min), numeric);
  if (item.max != null) numeric = Math.min(Number(item.max), numeric);
  return { ok: true, value: String(numeric) };
}

function formatCustomStateValue(item) {
  if (!String(item.value ?? '').trim()) return '';
  return `${item.value}${item.valueType === 'number' && item.unit ? ` ${item.unit}` : ''}`;
}

function normalizeOpenPlots(value, legacyTasks = [], legacyThreads = []) {
  const rows = Array.isArray(value) && value.length ? value : [
    ...normalizeMemoryRows(legacyTasks, ['name', 'type', 'status', 'participants', 'location', 'time', 'result', 'notes']),
    ...normalizeStringList(legacyThreads).map((name) => ({ name, status: '进行中' })),
  ];
  const seen = new Set();
  return rows.map((item, index) => {
    const status = String(item?.status || '进行中').trim();
    if (/已完成|已解决|结束|resolved|complete/i.test(status)) return null;
    const title = String(item?.title || item?.name || item?.content || '').trim();
    if (!title) return null;
    const id = String(item?.id || `plot-${title.toLocaleLowerCase().replace(/\s+/g, '-').slice(0, 40) || index}`).trim();
    if (seen.has(id)) return null;
    seen.add(id);
    return {
      id,
      title,
      details: String(item?.details || item?.notes || item?.result || '').trim(),
      people: String(item?.people || item?.participants || '').trim(),
      status: status || '进行中',
      evidence: String(item?.evidence || '').trim(),
      updatedAt: String(item?.updatedAt || '').trim(),
    };
  }).filter(Boolean).slice(-200);
}

function relationshipPairKey(source, target) {
  return [String(source || '').trim(), String(target || '').trim()].sort((a, b) => a.localeCompare(b, 'zh-CN')).join('\u0000').toLocaleLowerCase();
}

function normalizeRelationshipCards(value) {
  if (!Array.isArray(value)) return [];
  const cards = new Map();
  value.forEach((item, index) => {
    const source = String(item?.source || item?.personA || item?.from || (Array.isArray(item) ? item[0] : '') || '').trim();
    const target = String(item?.target || item?.personB || item?.to || (Array.isArray(item) ? item[2] : '') || '').trim();
    const currentRelation = String(item?.currentRelation || item?.relation || (Array.isArray(item) ? item[1] : '') || '').trim();
    if (!source || !target || !currentRelation) return;
    const evidence = String(item?.evidence || item?.note || (Array.isArray(item) ? item[3] : '') || '').trim();
    const tags = normalizeStringList(item?.tags || item?.tag || '');
    const rawHistory = Array.isArray(item?.history) ? item.history : [];
    const history = rawHistory.map((entry) => ({
      relation: String(entry?.relation || entry?.currentRelation || '').trim(),
      evidence: String(entry?.evidence || '').trim(),
      reason: String(entry?.reason || entry?.basis || '').trim(),
      changedAt: String(entry?.changedAt || entry?.createdAt || '').trim(),
    })).filter((entry) => entry.relation);
    if (!history.length) history.push({ relation: currentRelation, evidence, reason: String(item?.reason || item?.basis || '').trim(), changedAt: String(item?.changedAt || '').trim() });
    const key = relationshipPairKey(source, target);
    const old = cards.get(key);
    cards.set(key, {
      id: String(item?.id || old?.id || `relation-${index}-${Date.now()}`).trim(),
      source: old?.source || source,
      target: old?.target || target,
      currentRelation,
      tags: [...new Set([...(old?.tags || []), ...tags])],
      evidence: evidence || old?.evidence || '',
      history: [...(old?.history || []), ...history].filter((entry, idx, all) => idx === all.findIndex((other) => `${other.relation}\u0000${other.evidence}` === `${entry.relation}\u0000${entry.evidence}`)).slice(-50),
      updatedAt: String(item?.updatedAt || old?.updatedAt || '').trim(),
      manual: item?.manual === true || old?.manual === true,
    });
  });
  return [...cards.values()];
}

function createEmptyChatMemory() {
  return {
    memorySchemaVersion: 3,
    plotSummary: '',
    globalState: { currentTime: '', previousSceneTime: '', elapsedTime: '', currentLocation: '', sceneDetails: '' },
    protagonist: { name: '', identity: '', appearance: '', resources: '', experience: '', traits: '' },
    userProfile: [],
    currentScene: '',
    presentCharacters: [],
    visitedPlaces: [],
    relationship: [],
    importantFacts: [],
    importantItems: [],
    openThreads: [],
    skills: [],
    inventory: [],
    tasks: [],
    anchors: defaultMemoryAnchors(),
    sectionControls: {
      relationships: createMemoryToggle(),
      openPlots: createMemoryToggle(),
      summaries: createMemoryToggle(),
    },
    relationshipCards: [],
    openPlots: [],
    customStates: [],
    promptSelections: defaultMemoryPromptSelections(),
    chatCharacters: [],
    chatRelationTriples: [],
    retrievalLogs: [],
    keywords: [],
    summaries: [],
    lastSummarizedMessageIndex: 0,
    summaryJob: null,
    knowledgeLibraryIds: [],
    knowledgeLibrarySelectionSet: false,
    updatedAt: '',
  };
}

function normalizeStringList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || '').trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(/\r?\n|[,，、]+/).map((item) => item.trim()).filter(Boolean);
  return [];
}

function normalizeMemoryRecord(value, fields) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return Object.fromEntries(fields.map((field) => [field, String(source[field] || '').trim()]));
}

function normalizeMemoryRows(value, fields, legacy = []) {
  const rows = Array.isArray(value) ? value : [];
  const normalized = rows.map((row) => {
    if (row && typeof row === 'object' && !Array.isArray(row)) return normalizeMemoryRecord(row, fields);
    return normalizeMemoryRecord({ [fields[0]]: row }, fields);
  }).filter((row) => Object.values(row).some(Boolean));
  if (normalized.length) return normalized;
  return normalizeStringList(legacy).map((text) => normalizeMemoryRecord({ [fields[0]]: text }, fields));
}

function normalizeChatMemory(value) {
  const source = value && typeof value === 'object' ? value : {};
  const oldVersion = Number(source.memorySchemaVersion) || 0;
  const legacyGlobal = normalizeMemoryRecord({
    sceneDetails: source.currentScene,
    ...(source.globalState && typeof source.globalState === 'object' ? source.globalState : {}),
  }, ['currentTime', 'previousSceneTime', 'elapsedTime', 'currentLocation', 'sceneDetails']);
  const fallbackAnchors = defaultMemoryAnchors();
  fallbackAnchors.currentTime.value = legacyGlobal.currentTime;
  fallbackAnchors.currentLocation.value = legacyGlobal.currentLocation;
  const anchors = {
    currentTime: normalizeAnchorField(source.anchors?.currentTime, fallbackAnchors.currentTime),
    currentLocation: normalizeAnchorField(source.anchors?.currentLocation, fallbackAnchors.currentLocation),
  };
  const promptSelections = { ...defaultMemoryPromptSelections(), ...(source.promptSelections && typeof source.promptSelections === 'object' ? source.promptSelections : {}) };
  if (source.promptSelections?.knowledgeExtraction && !source.promptSelections?.knowledgeFacts) {
    promptSelections.knowledgeFacts = source.promptSelections.knowledgeExtraction;
  }
  if (oldVersion < 3) {
    promptSelections.currentTime = ensureLegacyMemoryPrompt('currentTime', anchors.currentTime.updatePrompt);
    promptSelections.currentLocation = ensureLegacyMemoryPrompt('currentLocation', anchors.currentLocation.updatePrompt);
    promptSelections.summary = ensureLegacyMemoryPrompt('summary', source.summaryPrompt || memorySettings.summaryPrompt);
    promptSelections.injection = ensureLegacyMemoryPrompt('injection', source.injectionPrompt || memorySettings.injectionPrompt);
  }
  const legacyCustomStates = [];
  const legacyProtagonist = normalizeMemoryRecord({
    traits: normalizeStringList(source.userProfile).join('；'),
    ...(source.protagonist && typeof source.protagonist === 'object' ? source.protagonist : {}),
  }, ['name', 'identity', 'appearance', 'resources', 'experience', 'traits']);
  const addLegacyState = (id, name, value) => {
    const text = String(value || '').trim();
    if (text) legacyCustomStates.push({ id, name, value: text, updatePrompt: '旧版迁移资料；仅在用户明确要求时手动维护。', updateEnabled: false, sendEnabled: false, legacy: true });
  };
  if (oldVersion < 2) {
    addLegacyState('legacy-protagonist', '旧版主角资料', Object.entries(legacyProtagonist).filter(([, v]) => v).map(([k, v]) => `${k}：${v}`).join('\n'));
    addLegacyState('legacy-skills', '旧版技能资料', normalizeMemoryRows(source.skills, ['name', 'owner', 'effect', 'status']).map((row) => Object.values(row).filter(Boolean).join('；')).join('\n'));
    addLegacyState('legacy-inventory', '旧版物品资料', normalizeMemoryRows(source.inventory, ['name', 'owner', 'quantity', 'status'], source.importantItems).map((row) => Object.values(row).filter(Boolean).join('；')).join('\n'));
  }
  const summaries = Array.isArray(source.summaries) ? [...source.summaries] : [];
  if (oldVersion < 2) {
    const legacyNotes = [
      normalizeStringList(source.importantFacts).length ? `【旧版关键事实】\n${normalizeStringList(source.importantFacts).join('\n')}` : '',
      normalizeStringList(source.visitedPlaces).length ? `【旧版历史地点】\n${normalizeStringList(source.visitedPlaces).join('\n')}` : '',
      normalizeMemoryRows(source.tasks, ['name', 'type', 'status', 'participants', 'location', 'time', 'result', 'notes']).filter((row) => /已完成|已解决|结束/i.test(row.status)).length
        ? `【旧版已完成事件】\n${normalizeMemoryRows(source.tasks, ['name', 'type', 'status', 'participants', 'location', 'time', 'result', 'notes']).filter((row) => /已完成|已解决|结束/i.test(row.status)).map((row) => `${row.name}${row.result ? `：${row.result}` : ''}`).join('\n')}` : '',
    ].filter(Boolean).join('\n\n');
    if (legacyNotes && !summaries.some((entry) => entry?.id === 'legacy-memory-migration-v2')) summaries.unshift({ id: 'legacy-memory-migration-v2', start: 0, end: 0, text: `【剧情纪要】\n${legacyNotes}`, createdAt: new Date().toISOString(), migrationOnly: true });
  }
  return {
    ...createEmptyChatMemory(),
    ...source,
    memorySchemaVersion: 3,
    plotSummary: String(source.plotSummary || ''),
    globalState: { ...legacyGlobal, currentTime: anchors.currentTime.value, currentLocation: anchors.currentLocation.value },
    protagonist: legacyProtagonist,
    currentScene: String(source.currentScene || ''),
    presentCharacters: normalizeStringList(source.presentCharacters),
    visitedPlaces: normalizeStringList(source.visitedPlaces),
    userProfile: normalizeStringList(source.userProfile),
    relationship: normalizeStringList(source.relationship),
    importantFacts: normalizeStringList(source.importantFacts),
    importantItems: normalizeStringList(source.importantItems),
    openThreads: normalizeStringList(source.openThreads),
    skills: normalizeMemoryRows(source.skills, ['name', 'owner', 'effect', 'status']),
    inventory: normalizeMemoryRows(source.inventory, ['name', 'owner', 'quantity', 'status'], source.importantItems),
    tasks: normalizeMemoryRows(source.tasks, ['name', 'type', 'status', 'participants', 'location', 'time', 'result', 'notes'], source.openThreads),
    anchors,
    sectionControls: {
      relationships: normalizeMemoryToggle(source.sectionControls?.relationships),
      openPlots: normalizeMemoryToggle(source.sectionControls?.openPlots),
      summaries: normalizeMemoryToggle(source.sectionControls?.summaries),
    },
    relationshipCards: normalizeRelationshipCards(source.relationshipCards?.length ? source.relationshipCards : source.chatRelationTriples),
    openPlots: normalizeOpenPlots(source.openPlots, source.tasks, source.openThreads),
    customStates: normalizeCustomStates([...(Array.isArray(source.customStates) ? source.customStates : []), ...legacyCustomStates]).map((item) => ({
      ...item,
      promptId: item.promptId || ensureLegacyMemoryPrompt('customState', item.updatePrompt),
    })),
    promptSelections,
    chatCharacters: normalizeCharacterCatalog(source.chatCharacters),
    chatRelationTriples: dedupeKnowledgeRelations(source.chatRelationTriples, source.chatCharacters),
    retrievalLogs: Array.isArray(source.retrievalLogs) ? source.retrievalLogs.slice(-30) : [],
    keywords: normalizeStringList(source.keywords),
    knowledgeLibraryIds: normalizeStringList(source.knowledgeLibraryIds),
    knowledgeLibrarySelectionSet: source.knowledgeLibrarySelectionSet === true,
    summaries,
    lastSummarizedMessageIndex: Math.max(0, Number(source.lastSummarizedMessageIndex) || 0),
    summaryJob: source.summaryJob && typeof source.summaryJob === 'object' ? source.summaryJob : null,
  };
}

function ensureChatMemory(chat) {
  if (!chat) return createEmptyChatMemory();
  chat.memory = normalizeChatMemory(chat.memory);
  return chat.memory;
}

const MEMORY_DB_NAME = 'xiangsi_memory_v1';
const MEMORY_DB_STORE = 'documents';
const MEMORY_DB_VERSION = 2;
let memoryDocuments = [];
let memoryDbPromise = null;
let memoryDocumentsReady = false;

function openMemoryDatabase() {
  if (!('indexedDB' in window)) return Promise.resolve(null);
  if (memoryDbPromise) return memoryDbPromise;
  memoryDbPromise = new Promise((resolve) => {
    const request = indexedDB.open(MEMORY_DB_NAME, MEMORY_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(MEMORY_DB_STORE)) {
        const store = db.createObjectStore(MEMORY_DB_STORE, { keyPath: 'id' });
        store.createIndex('scope', 'scope', { unique: false });
        store.createIndex('chatId', 'chatId', { unique: false });
        store.createIndex('roleId', 'roleId', { unique: false });
      } else {
        const store = request.transaction.objectStore(MEMORY_DB_STORE);
        if (!store.indexNames.contains('roleId')) store.createIndex('roleId', 'roleId', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
  return memoryDbPromise;
}

async function loadMemoryDocuments() {
  const db = await openMemoryDatabase();
  if (!db) {
    memoryDocumentsReady = true;
    return;
  }
  memoryDocuments = await new Promise((resolve) => {
    const request = db.transaction(MEMORY_DB_STORE, 'readonly').objectStore(MEMORY_DB_STORE).getAll();
    request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result : []);
    request.onerror = () => resolve([]);
  });
  memoryDocumentsReady = true;
}

function knowledgeGroupNeedsMigration(documents) {
  const rows = Array.isArray(documents) ? documents : [];
  if (!rows.length) return false;
  const carrier = rows.find((document) => document.groupMetadata === true) || rows[0];
  return rows.some((document) => (document.scope === 'knowledge'
    || !document.libraryName
    || !document.libraryKind
    || !Number.isFinite(Number(document.libraryOrder))
    || !Array.isArray(document.relationTriples)
    || !Array.isArray(document.characterCatalog)
    || !document.groupId))
    || Number(carrier.performanceSchemaVersion) !== KNOWLEDGE_PERFORMANCE_SCHEMA_VERSION;
}

async function migrateLegacyKnowledgeDocuments(roleId) {
  const targetRoleId = String(roleId || '').trim();
  if (!targetRoleId) return 0;
  const roleDocuments = memoryDocuments.filter((document) => document.scope === 'knowledge' || document.scope === 'role');
  const byGroup = new Map();
  roleDocuments.forEach((document) => {
    const groupId = document.groupId || document.id;
    const rows = byGroup.get(groupId) || [];
    rows.push(document);
    byGroup.set(groupId, rows);
  });
  const legacyGroupIds = new Set([...byGroup.entries()].filter(([, documents]) => knowledgeGroupNeedsMigration(documents)).map(([groupId]) => groupId));
  const legacy = roleDocuments.filter((document) => legacyGroupIds.has(document.groupId || document.id));
  if (!legacy.length) return 0;
  const groupOrder = new Map();
  roleDocuments.forEach((document) => {
    const groupId = document.groupId || document.id;
    if (!groupOrder.has(groupId)) groupOrder.set(groupId, groupOrder.size + 1);
  });
  const roleName = roles.find((role) => role.id === targetRoleId)?.name || currentRole?.name || '当前角色';
  const metadataGroups = new Set(roleDocuments.filter((document) => document.groupMetadata === true).map((document) => document.groupId || document.id));
  const migrated = legacy.map((document) => {
    const performance = normalizeKnowledgePerformanceState(document, roleName);
    const groupId = document.groupId || document.id;
    const carryMetadata = document.groupMetadata === true || !metadataGroups.has(groupId);
    metadataGroups.add(groupId);
    return {
      ...document,
      ...(carryMetadata ? performance : {}),
      groupId,
      scope: 'role',
      roleId: document.roleId || targetRoleId,
      chatId: '',
      libraryName: document.libraryName || String(document.sourceName || '知识库资料').replace(/\.[^.]+$/, ''),
      libraryKind: document.libraryKind || '旧资料',
      libraryOrder: Number.isFinite(Number(document.libraryOrder)) ? Number(document.libraryOrder) : groupOrder.get(groupId),
      relationTriples: normalizeRelationTriples(document.relationTriples),
      characterCatalog: normalizeCharacterCatalog(document.characterCatalog),
      ...(carryMetadata ? { knowledgePromptSelections: normalizeKnowledgePromptSelections(document), groupMetadata: true } : {}),
    };
  });
  await storeMemoryDocuments(migrated);
  return migrated.length;
}

async function storeMemoryDocuments(documents) {
  const clean = (documents || []).filter((doc) => doc?.id && doc?.text);
  if (!clean.length) return;
  const db = await openMemoryDatabase();
  if (!db) {
    memoryDocuments.push(...clean);
    return;
  }
  await new Promise((resolve) => {
    const transaction = db.transaction(MEMORY_DB_STORE, 'readwrite');
    const store = transaction.objectStore(MEMORY_DB_STORE);
    clean.forEach((doc) => store.put(doc));
    transaction.oncomplete = resolve;
    transaction.onerror = resolve;
  });
  const byId = new Map(memoryDocuments.map((doc) => [doc.id, doc]));
  clean.forEach((doc) => byId.set(doc.id, doc));
  memoryDocuments = [...byId.values()];
}

async function replaceMemoryDocuments(documents) {
  const clean = (documents || []).filter((doc) => doc?.id && doc?.text);
  memoryDocuments = [...clean];
  const db = await openMemoryDatabase();
  if (!db) return;
  await new Promise((resolve) => {
    const transaction = db.transaction(MEMORY_DB_STORE, 'readwrite');
    const store = transaction.objectStore(MEMORY_DB_STORE);
    store.clear();
    clean.forEach((doc) => store.put(doc));
    transaction.oncomplete = resolve;
    transaction.onerror = resolve;
  });
}

async function deleteMemoryDocumentGroup(groupId) {
  const targets = memoryDocuments.filter((doc) => doc.groupId === groupId);
  const db = await openMemoryDatabase();
  if (db && targets.length) {
    await new Promise((resolve) => {
      const transaction = db.transaction(MEMORY_DB_STORE, 'readwrite');
      const store = transaction.objectStore(MEMORY_DB_STORE);
      targets.forEach((doc) => store.delete(doc.id));
      transaction.oncomplete = resolve;
      transaction.onerror = resolve;
    });
  }
  memoryDocuments = memoryDocuments.filter((doc) => doc.groupId !== groupId);
}

function chunkMemoryText(text, chunkSize = memorySettings.chunkSize, overlap = memorySettings.chunkOverlap) {
  const source = String(text || '').replace(/\r/g, '').trim();
  if (!source) return [];
  const size = Math.max(200, Number(chunkSize) || 900);
  const shared = Math.max(0, Math.min(size - 50, Number(overlap) || 0));
  const paragraphs = source.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
  const chunks = [];
  let buffer = '';
  for (const paragraph of paragraphs.length ? paragraphs : [source]) {
    if (buffer && buffer.length + paragraph.length + 2 > size) {
      chunks.push(buffer.trim());
      buffer = `${buffer.slice(-shared)}${shared ? '\n' : ''}${paragraph}`;
    } else {
      buffer = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
    }
    while (buffer.length > size * 1.6) {
      chunks.push(buffer.slice(0, size).trim());
      buffer = buffer.slice(Math.max(1, size - shared));
    }
  }
  if (buffer.trim()) chunks.push(buffer.trim());
  return chunks;
}

const KNOWLEDGE_PERFORMANCE_SCHEMA_VERSION = 1;
const MAX_PERFORMANCE_TARGETS = 6;
const KNOWLEDGE_RECALL_LIMIT_MAX = 8;
const KNOWLEDGE_RECALL_TOTAL_MAX = 8;

function normalizeKnowledgeRecallLimit(value, fallback) {
  if (value === '' || value == null || !Number.isFinite(Number(value))) return fallback;
  return Math.max(0, Math.min(KNOWLEDGE_RECALL_LIMIT_MAX, Math.round(Number(value))));
}

function normalizeKnowledgeRecallSettings(value) {
  const source = value && typeof value === 'object' ? value : {};
  return {
    performanceRecallLimit: normalizeKnowledgeRecallLimit(source.performanceRecallLimit, 3),
    factRecallLimit: normalizeKnowledgeRecallLimit(source.factRecallLimit, 4),
  };
}

function performanceTargetId(name, current = false) {
  return current ? 'target-current' : `target-${stableMemoryPromptHash(String(name || '').trim().toLocaleLowerCase())}`;
}

function normalizePerformanceTargets(value, currentRoleName = '') {
  const currentName = String(currentRoleName || '').trim();
  const input = Array.isArray(value) ? value : [];
  const byName = new Map();
  input.forEach((item, index) => {
    const source = typeof item === 'string' ? { primaryName: item } : (item && typeof item === 'object' ? item : {});
    const primaryName = String(source.primaryName || source.name || '').trim();
    if (!primaryName) return;
    const key = primaryName.toLocaleLowerCase();
    const aliases = [...new Set(normalizeStringList(source.aliases).filter((alias) => alias.toLocaleLowerCase() !== key))];
    const existing = byName.get(key);
    byName.set(key, existing ? {
      ...existing,
      aliases: [...new Set([...existing.aliases, ...aliases])],
    } : {
      id: String(source.id || performanceTargetId(primaryName, currentName && key === currentName.toLocaleLowerCase())),
      primaryName,
      aliases,
      origin: source.origin === 'current' || (currentName && key === currentName.toLocaleLowerCase()) ? 'current' : 'manual',
      locked: source.locked === true || Boolean(currentName && key === currentName.toLocaleLowerCase()),
      enabled: source.enabled !== false,
      order: Number.isFinite(Number(source.order)) ? Number(source.order) : index,
    });
  });
  if (currentName) {
    const key = currentName.toLocaleLowerCase();
    const existing = byName.get(key);
    byName.set(key, {
      ...(existing || { id: 'target-current', primaryName: currentName, aliases: [], enabled: true, order: -1 }),
      id: existing?.id || 'target-current',
      origin: 'current',
      locked: true,
      enabled: existing?.enabled !== false,
      order: -1,
    });
  }
  return [...byName.values()]
    .sort((left, right) => Number(right.locked) - Number(left.locked) || left.order - right.order)
    .slice(0, MAX_PERFORMANCE_TARGETS)
    .map((target, order) => ({ ...target, order }));
}

function normalizeAliasCandidates(value, targetCharacters = []) {
  const targetIds = new Set(targetCharacters.map((target) => target.id));
  const seen = new Set();
  return (Array.isArray(value) ? value : []).map((item) => {
    const name = String(item?.name || item?.alias || '').trim();
    const targetId = String(item?.targetId || targetCharacters[0]?.id || '').trim();
    const status = ['accepted', 'rejected'].includes(item?.status) ? item.status : 'pending';
    if (!name || !targetId || !targetIds.has(targetId)) return null;
    const key = `${targetId}\u0000${name.toLocaleLowerCase()}`;
    if (seen.has(key)) return null;
    seen.add(key);
    return {
      id: String(item?.id || `alias-${stableMemoryPromptHash(key)}`),
      targetId,
      name,
      status,
      evidence: String(item?.evidence || '').trim(),
      evidenceDocIds: normalizeStringList(item?.evidenceDocIds || item?.docIds),
    };
  }).filter(Boolean);
}

function normalizePerformanceCards(value) {
  const unique = new Map();
  (Array.isArray(value) ? value : []).forEach((item) => {
    const targetId = String(item?.targetId || '').trim();
    const sourceDocId = String(item?.sourceDocId || item?.docId || '').trim();
    const trigger = String(item?.trigger || '').trim();
    const excerpt = String(item?.excerpt || item?.evidence || '').trim();
    if (!targetId || (!trigger && !excerpt)) return;
    const key = `${targetId}\u0000${sourceDocId}\u0000${trigger}\u0000${excerpt}`.toLocaleLowerCase();
    if (unique.has(key)) return;
    unique.set(key, {
      id: String(item?.id || `performance-${stableMemoryPromptHash(key)}`),
      targetId,
      sourceGroupId: String(item?.sourceGroupId || '').trim(),
      sourceDocId,
      sourceName: String(item?.sourceName || '').trim(),
      situationTags: normalizeStringList(item?.situationTags || item?.tags),
      relationshipContext: String(item?.relationshipContext || '').trim(),
      trigger,
      innerMotive: String(item?.innerMotive || '').trim(),
      outwardResponse: String(item?.outwardResponse || '').trim(),
      speechPattern: String(item?.speechPattern || '').trim(),
      actionPattern: String(item?.actionPattern || '').trim(),
      avoid: String(item?.avoid || '').trim(),
      excerpt,
      embedding: Array.isArray(item?.embedding) ? item.embedding.map(Number).filter(Number.isFinite) : undefined,
      embeddingModel: String(item?.embeddingModel || '').trim(),
      createdAt: String(item?.createdAt || new Date().toISOString()),
    });
  });
  return [...unique.values()];
}

function normalizeRoleProfiles(value, targetCharacters = []) {
  const targetIds = new Set(targetCharacters.map((target) => target.id));
  return (Array.isArray(value) ? value : []).map((item) => {
    const targetId = String(item?.targetId || '').trim();
    if (!targetIds.has(targetId)) return null;
    const target = targetCharacters.find((entry) => entry.id === targetId);
    return {
      targetId,
      name: String(item?.name || target?.primaryName || '').trim(),
      identity: String(item?.identity || '').trim(),
      coreTraits: normalizeStringList(item?.coreTraits || item?.traits),
      values: normalizeStringList(item?.values),
      speechPatterns: normalizeStringList(item?.speechPatterns || item?.speechStyle),
      actionPatterns: normalizeStringList(item?.actionPatterns),
      taboos: normalizeStringList(item?.taboos || item?.avoid),
      evidenceDocIds: normalizeStringList(item?.evidenceDocIds),
      sourceGroupId: String(item?.sourceGroupId || '').trim(),
      sourceName: String(item?.sourceName || '').trim(),
      updatedAt: String(item?.updatedAt || '').trim(),
    };
  }).filter(Boolean);
}

function normalizeKnowledgeExtractionProgress(value, targetCharacters = []) {
  const source = value && typeof value === 'object' ? value : {};
  const completed = Math.max(0, Number(source.completed) || 0);
  const total = Math.max(0, Number(source.total) || 0);
  const runCompleted = Math.max(0, Number(source.runCompleted) || 0);
  const runTotal = Math.max(0, Number(source.runTotal) || 0);
  const resumeFrom = Number.isFinite(Number(source.resumeFrom))
    ? Math.max(0, Number(source.resumeFrom))
    : Math.max(0, completed - runCompleted);
  const processedByTarget = {};
  targetCharacters.forEach((target) => {
    const entry = source.processedByTarget?.[target.id] || {};
    processedByTarget[target.id] = {
      terms: normalizeStringList(entry.terms),
      docIds: normalizeStringList(entry.docIds),
      profileDirty: entry.profileDirty === true,
    };
  });
  return {
    schemaVersion: KNOWLEDGE_PERFORMANCE_SCHEMA_VERSION,
    status: ['running', 'stopped', 'failed', 'ready'].includes(source.status) ? source.status : '',
    stage: String(source.stage || '').trim(),
    completed,
    total,
    resumeFrom,
    runCompleted: Math.min(runCompleted, runTotal || runCompleted),
    runTotal,
    error: String(source.error || '').trim(),
    processedByTarget,
    updatedAt: String(source.updatedAt || '').trim(),
  };
}

function knowledgeExtractionProgressMetrics(previousProgress, runTotal, reset = false, runCompleted = 0) {
  const previous = previousProgress && typeof previousProgress === 'object' ? previousProgress : {};
  const safeRunTotal = Math.max(0, Math.round(Number(runTotal) || 0));
  const safeRunCompleted = Math.min(safeRunTotal, Math.max(0, Math.round(Number(runCompleted) || 0)));
  const previousCompleted = reset ? 0 : Math.max(0, Math.round(Number(previous.completed) || 0));
  const previousTotal = reset ? 0 : Math.max(previousCompleted, Math.round(Number(previous.total) || 0));
  const overallTotal = reset ? safeRunTotal : Math.max(previousTotal, previousCompleted + safeRunTotal);
  const overallCompleted = Math.min(overallTotal, previousCompleted + safeRunCompleted);
  return {
    resumeFrom: previousCompleted,
    runCompleted: safeRunCompleted,
    runTotal: safeRunTotal,
    overallCompleted,
    overallTotal,
    remaining: Math.max(0, safeRunTotal - safeRunCompleted),
  };
}

function knowledgeExtractionProgressCopy(progress, detail = {}) {
  const completed = Math.max(0, Math.round(Number(progress?.completed) || 0));
  const total = Math.max(completed, Math.round(Number(progress?.total) || 0));
  const resumeFrom = Math.max(0, Math.round(Number(progress?.resumeFrom) || 0));
  const runCompleted = Math.max(0, Math.round(Number(progress?.runCompleted) || 0));
  const runTotal = Math.max(runCompleted, Math.round(Number(progress?.runTotal) || 0));
  const remaining = Math.max(0, runTotal - runCompleted);
  const stageName = detail.stage === 'profile' ? '归纳本色' : '提取场景';
  const currentStep = Math.max(0, Math.round(Number(detail.currentStep) || 0));
  const resumeText = resumeFrom > 0 ? `本次继续：已跳过 ${resumeFrom} 步，` : '本次整理：';
  return {
    button: currentStep ? `${stageName} ${currentStep}/${total}` : `${stageName} ${completed}/${total}`,
    headline: `总进度：已完成 ${completed}/${total}`,
    detail: `${resumeText}剩余 ${remaining} 步；每步完成自动保存`,
    current: currentStep ? `${detail.target ? `${detail.target} · ` : ''}${detail.stage === 'profile' ? '正在归纳' : '正在提取'}第 ${currentStep} 步` : '',
  };
}

function normalizeKnowledgePerformanceState(value, currentRoleName = '') {
  const source = value && typeof value === 'object' ? value : {};
  const targetCharacters = normalizePerformanceTargets(source.targetCharacters, currentRoleName);
  return {
    performanceSchemaVersion: KNOWLEDGE_PERFORMANCE_SCHEMA_VERSION,
    ...normalizeKnowledgeRecallSettings(source),
    targetCharacters,
    aliasCandidates: normalizeAliasCandidates(source.aliasCandidates, targetCharacters),
    roleProfiles: normalizeRoleProfiles(source.roleProfiles, targetCharacters),
    performanceCards: normalizePerformanceCards(source.performanceCards),
    extractionProgress: normalizeKnowledgeExtractionProgress(source.extractionProgress, targetCharacters),
  };
}

function resolveAliasCandidate(value, candidateId, status) {
  const state = normalizeKnowledgePerformanceState(value, value?.targetCharacters?.find((target) => target.locked || target.origin === 'current')?.primaryName || '');
  const nextStatus = status === 'accepted' ? 'accepted' : 'rejected';
  const candidate = state.aliasCandidates.find((item) => item.id === candidateId);
  if (!candidate) return state;
  candidate.status = nextStatus;
  if (nextStatus === 'accepted') {
    const target = state.targetCharacters.find((item) => item.id === candidate.targetId);
    if (target && candidate.name.toLocaleLowerCase() !== target.primaryName.toLocaleLowerCase()) {
      target.aliases = [...new Set([...target.aliases, candidate.name])];
      const progress = state.extractionProgress.processedByTarget[target.id];
      if (progress) progress.profileDirty = true;
    }
  }
  return state;
}

function chunkKnowledgeScenes(text, targetSize = 900, maxSize = 1600) {
  const source = String(text || '').replace(/\r/g, '').trim();
  if (!source) return [];
  const max = Math.max(120, Number(maxSize) || 1600);
  const target = Math.max(40, Math.min(max, Number(targetSize) || 900));
  const sceneHeading = /^(?:第?[一二三四五六七八九十百千万\d]+\s*(?:场|幕|章|节|回)|场景\s*[:：]?|scene\b)/i;
  const dialogueLine = /^[^：:\n]{1,24}[：:](?!\/\/)/;
  const blocks = [];
  let paragraph = '';
  const flushParagraph = () => { if (paragraph.trim()) blocks.push(paragraph.trim()); paragraph = ''; };
  source.split('\n').forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) return flushParagraph();
    if (sceneHeading.test(line) || dialogueLine.test(line)) {
      flushParagraph();
      blocks.push(line);
    } else {
      paragraph = paragraph ? `${paragraph}\n${line}` : line;
    }
  });
  flushParagraph();
  const scenes = [];
  let buffer = '';
  const flush = () => { if (buffer.trim()) scenes.push(buffer.trim()); buffer = ''; };
  blocks.forEach((block) => {
    const startsScene = sceneHeading.test(block.split('\n')[0]?.trim() || '');
    if (buffer && (startsScene || buffer.length + block.length + 2 > max)) flush();
    buffer = buffer ? `${buffer}\n\n${block}` : block;
    if (buffer.length >= target && /(?:[。！？!?]|\n)$/.test(buffer)) flush();
  });
  flush();
  return scenes.flatMap((scene) => scene.length <= max ? [scene] : chunkMemoryText(scene, max, 120));
}

const RAG_CORPUS_SCHEMA_VERSION = 1;
const RAG_CORPUS_FIELD_CANDIDATES = {
  text: ['text', 'content', 'document', 'body'],
  scene: ['scene', 'title', 'sceneTitle', 'id'],
  time: ['time', 'when'],
  location: ['location', 'place', 'where'],
  people: ['people', 'characters', 'character', 'roles'],
  major: ['major', 'priority', 'important'],
};

function normalizeRagCorpusPeople(value) {
  const rows = Array.isArray(value) ? value : String(value == null ? '' : value).split(/[、,，;；|/\n]+/);
  return [...new Set(rows.map((item) => String(item || '').trim()).filter(Boolean))];
}

function detectRagCorpusFieldMap(rows, preferred = {}) {
  const objects = (Array.isArray(rows) ? rows : []).filter((row) => row && typeof row === 'object' && !Array.isArray(row));
  const availableFields = [...new Set(objects.slice(0, 50).flatMap((row) => Object.keys(row)))];
  const fieldMap = {};
  Object.entries(RAG_CORPUS_FIELD_CANDIDATES).forEach(([purpose, candidates]) => {
    const requested = String(preferred?.[purpose] || '').trim();
    fieldMap[purpose] = requested && availableFields.includes(requested)
      ? requested
      : candidates.find((candidate) => availableFields.includes(candidate)) || '';
  });
  return { fieldMap, availableFields };
}

function parseRagCorpusText(raw, fileName = '', preferredFieldMap = {}) {
  const source = recoverMojibake(String(raw || '')).replace(/^\uFEFF/, '').trim();
  if (!source) throw new Error('这个语料文件是空的');
  const rows = [];
  const rowNumbers = [];
  let invalidJsonRows = 0;
  if (/^\s*\[/.test(source)) {
    let parsed;
    try { parsed = JSON.parse(source); } catch { throw new Error('RAG语料不是有效的 JSONL 或 JSON 数组'); }
    if (!Array.isArray(parsed)) throw new Error('RAG语料 JSON 必须是对象数组');
    parsed.forEach((row, index) => {
      if (row && typeof row === 'object' && !Array.isArray(row)) {
        rows.push(row);
        rowNumbers.push(index + 1);
      } else invalidJsonRows += 1;
    });
  } else {
    source.split(/\r?\n/).forEach((line, index) => {
      if (!line.trim()) return;
      try {
        const row = JSON.parse(line);
        if (!row || typeof row !== 'object' || Array.isArray(row)) throw new Error('not an object');
        rows.push(row);
        rowNumbers.push(index + 1);
      } catch { invalidJsonRows += 1; }
    });
  }
  if (!rows.length) throw new Error('没有找到可识别的语料对象');
  const { fieldMap, availableFields } = detectRagCorpusFieldMap(rows, preferredFieldMap);
  const entries = [];
  let missingTextRows = 0;
  const characterCounts = new Map();
  rows.forEach((row, index) => {
    const text = fieldMap.text ? String(row[fieldMap.text] ?? '').trim() : '';
    if (!text) {
      missingTextRows += 1;
      return;
    }
    const people = normalizeRagCorpusPeople(fieldMap.people ? row[fieldMap.people] : '');
    people.forEach((name) => characterCounts.set(name, (characterCounts.get(name) || 0) + 1));
    const majorValue = fieldMap.major ? row[fieldMap.major] : false;
    entries.push({
      rowNumber: rowNumbers[index] || index + 1,
      text,
      scene: fieldMap.scene ? String(row[fieldMap.scene] ?? '').trim() : '',
      time: fieldMap.time ? String(row[fieldMap.time] ?? '').trim() : '',
      location: fieldMap.location ? String(row[fieldMap.location] ?? '').trim() : '',
      people,
      major: majorValue === true || majorValue === 1 || /^(?:true|yes|重要|是)$/i.test(String(majorValue || '').trim()),
    });
  });
  return {
    fileName,
    fieldMap,
    availableFields,
    entries,
    summary: {
      totalRows: rows.length + invalidJsonRows,
      validRows: entries.length,
      missingTextRows,
      invalidJsonRows,
      characterCounts: [...characterCounts.entries()].sort((left, right) => right[1] - left[1]).map(([name, count]) => ({ name, count })),
    },
  };
}

function buildRagCorpusDocuments(parsed, options = {}) {
  const groupId = String(options.groupId || `memory-source-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`);
  const roleId = String(options.roleId || currentRole?.id || '');
  const fileName = String(options.fileName || parsed?.fileName || 'RAG语料.jsonl');
  const libraryName = String(options.libraryName || fileName.replace(/\.[^.]+$/, '') || 'RAG语料').trim();
  const libraryOrder = Number.isFinite(Number(options.libraryOrder)) ? Number(options.libraryOrder) : 1;
  const initialPerformance = normalizeKnowledgePerformanceState({}, options.currentRoleName || currentRole?.name || '当前角色');
  const summary = { ...(parsed?.summary || {}), importedAt: new Date().toISOString() };
  const rows = [];
  (Array.isArray(parsed?.entries) ? parsed.entries : []).forEach((entry) => {
    const parts = String(entry.text || '').length <= 5000 ? [String(entry.text || '')] : chunkMemoryText(entry.text, 4500, 0);
    parts.filter(Boolean).forEach((text, partIndex) => rows.push({ entry, text, partIndex, partTotal: parts.length }));
  });
  return rows.map(({ entry, text, partIndex, partTotal }, index) => ({
    id: `${groupId}-row-${entry.rowNumber}-${partIndex + 1}`,
    groupId,
    scope: 'role',
    chatId: '',
    roleId,
    sourceName: fileName,
    libraryName,
    libraryKind: 'RAG语料',
    libraryOrder,
    sourceFormat: 'rag-corpus',
    corpusSchemaVersion: RAG_CORPUS_SCHEMA_VERSION,
    corpusImportSummary: summary,
    corpusFieldMap: { ...(parsed?.fieldMap || {}) },
    relationTriples: [],
    characterCatalog: [],
    ...(index === 0 ? {
      ...initialPerformance,
      knowledgePromptSelections: normalizeKnowledgePromptSelections({}),
      groupMetadata: true,
    } : {}),
    chunkKind: 'corpus',
    sceneIndex: index,
    title: `${entry.scene || `第 ${entry.rowNumber} 行`}${partTotal > 1 ? ` ${partIndex + 1}/${partTotal}` : ''}`,
    corpusMeta: {
      scene: entry.scene || '',
      time: entry.time || '',
      location: entry.location || '',
      people: normalizeRagCorpusPeople(entry.people),
      major: entry.major === true,
      rowNumber: entry.rowNumber,
      partIndex: partIndex + 1,
      partTotal,
      sourceFile: fileName,
    },
    text,
    createdAt: new Date().toISOString(),
  }));
}

function selectTargetSceneDocuments(documents, target, processedIds = new Set()) {
  const terms = [target?.primaryName, ...(Array.isArray(target?.aliases) ? target.aliases : [])].map((term) => String(term || '').trim()).filter(Boolean);
  const processed = processedIds instanceof Set ? processedIds : new Set(normalizeStringList(processedIds));
  const rows = Array.isArray(documents) ? documents : [];
  const selected = new Map();
  rows.forEach((doc, index) => {
    if (!terms.some((term) => String(doc?.text || '').includes(term))) return;
    [index, index + 1].forEach((position) => {
      const candidate = rows[position];
      if (!candidate?.id || processed.has(candidate.id)) return;
      selected.set(candidate.id, candidate);
    });
  });
  return rows.filter((doc) => selected.has(doc.id));
}

function buildPerformanceRetrievalQuery(userText, historyMessages = [], context = {}) {
  const recent = (Array.isArray(historyMessages) ? historyMessages : []).slice(-4).map((message) => String(message?.text || '').trim()).filter(Boolean);
  return [
    context.roleNames?.length ? `角色：${context.roleNames.join('、')}` : '',
    context.currentTime ? `时间：${context.currentTime}` : '',
    context.currentLocation ? `地点：${context.currentLocation}` : '',
    context.relationships?.length ? `关系：${context.relationships.join('；')}` : '',
    context.openPlots?.length ? `未完剧情：${context.openPlots.join('；')}` : '',
    ...recent,
    String(userText || '').trim(),
  ].filter(Boolean).join('\n');
}

function roleProfileContent(profile) {
  return [
    profile.identity ? `身份：${profile.identity}` : '',
    profile.coreTraits?.length ? `稳定性格：${profile.coreTraits.join('；')}` : '',
    profile.values?.length ? `价值取向：${profile.values.join('；')}` : '',
    profile.speechPatterns?.length ? `语言习惯：${profile.speechPatterns.join('；')}` : '',
    profile.actionPatterns?.length ? `动作习惯：${profile.actionPatterns.join('；')}` : '',
    profile.taboos?.length ? `避免：${profile.taboos.join('；')}` : '',
    String(profile.content || '').trim(),
  ].filter(Boolean).join('；');
}

function performanceCardContent(card) {
  return performanceCardInjectionContent(card, KNOWLEDGE_PERFORMANCE_ALL_FIELDS);
}

function performanceCardFieldValue(card, fieldId) {
  if (fieldId === 'situationTags') return Array.isArray(card?.situationTags) ? card.situationTags.join('、') : '';
  return String(card?.[fieldId] || '').trim();
}

function performanceCardInjectionContent(card, selectedFields = memorySettings.knowledgePerformanceSendFields) {
  const enabled = new Set(normalizeKnowledgePerformanceSendFields(selectedFields));
  return KNOWLEDGE_PERFORMANCE_FIELDS.filter((field) => enabled.has(field.id)).map((field) => {
    const value = performanceCardFieldValue(card, field.id);
    return value ? `${field.outputLabel}：${value}` : '';
  }).filter(Boolean).join('；');
}

function wholeTextWithinLimit(value, limit) {
  const text = String(value || '').trim();
  const max = Math.max(1, Number(limit) || 1);
  if (text.length <= max) return text;
  const units = text.match(/[^。！？!?；;\n]+[。！？!?；;\n]?/g) || [];
  let result = '';
  units.forEach((unit) => {
    if (result.length + unit.length <= max) result += unit;
  });
  return result.trim();
}

function composeResidentRoleProfiles(profiles, selectedTargetIds, perRoleLimit = 400) {
  const selected = new Set(normalizeStringList(selectedTargetIds));
  const groups = new Map();
  (Array.isArray(profiles) ? profiles : []).forEach((profile) => {
    if (!selected.has(profile.targetId)) return;
    const rows = groups.get(profile.targetId) || [];
    rows.push(profile);
    groups.set(profile.targetId, rows);
  });
  return [...groups.values()].map((rows) => {
    const name = rows[0]?.name || '角色';
    const roleLimit = Math.max(120, Number(perRoleLimit) || 400);
    const header = `【角色本色 · ${name}】\n`;
    const sourceBudget = Math.max(60, Math.floor((roleLimit - header.length) / rows.length));
    const parts = rows.map((row) => {
      const source = row.sourceName ? `【${row.sourceName}】` : '';
      const content = wholeTextWithinLimit(roleProfileContent(row), Math.max(1, sourceBudget - source.length));
      return content ? `${source}${content}` : '';
    }).filter(Boolean);
    return `${header}${parts.join('\n')}`.trim();
  });
}

function composeMemorySectionsWithinBudget(sections, budgetChars = 12000) {
  const limit = Math.max(1, Number(budgetChars) || 12000);
  const ordered = [...(Array.isArray(sections) ? sections : [])].filter((section) => String(section?.text || '').trim()).sort((left, right) => Number(left.priority) - Number(right.priority));
  const included = [];
  let length = 0;
  ordered.forEach((section) => {
    const text = String(section.text).trim();
    const separator = included.length ? 2 : 0;
    if (!section.required && length + separator + text.length > limit) return;
    included.push({ ...section, text });
    length += separator + text.length;
  });
  return { text: included.map((section) => section.text).join('\n\n'), includedIds: included.map((section) => section.id), omittedIds: ordered.filter((section) => !included.includes(section)).map((section) => section.id) };
}

const appSettings = {
  theme: '深色',
  autoSave: true,
  importMode: '兼容酒馆/PNG/JSON/JSONL/TXT',
};

// ===== 其余创作内容 / App 设置持久化 =====
// API、角色、人设、聊天分别有独立缓存；这里补齐预设、世界书、正则、
// 长记忆设置、主题和自定义声音链接，确保退出 App 后不会回到默认值。
const APP_STATE_CACHE_KEY = 'xl_app_state_v1';

function saveAppStateToCache() {
  try {
    localStorage.setItem(APP_STATE_CACHE_KEY, JSON.stringify({
      version: 1,
      savedAt: new Date().toISOString(),
      voiceLinks,
      presets,
      selectedPresetId,
      worldBooks,
      lorebookLibrary,
      selectedLorebookId,
      worldBookSettings,
      regexRules,
      memorySettings,
      appSettings,
    }));
  } catch (_) {
    // 缓存空间不足或系统暂不可用时不打断聊天流程。
  }
}

function loadAppStateFromCache() {
  try {
    const raw = localStorage.getItem(APP_STATE_CACHE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (Array.isArray(data.voiceLinks)) voiceLinks.splice(0, voiceLinks.length, ...data.voiceLinks);
    if (Array.isArray(data.presets) && data.presets.length) {
      presets.splice(0, presets.length, ...data.presets);
      selectedPresetId = data.selectedPresetId || presets.find((preset) => preset.active)?.id || presets[0]?.id || '';
    }
    if (Array.isArray(data.lorebookLibrary) && data.lorebookLibrary.length) {
      lorebookLibrary.splice(0, lorebookLibrary.length, ...data.lorebookLibrary.map((book, index) => ({
        id: book.id || `lorebook-cache-${index}`,
        name: book.name || `世界书 ${index + 1}`,
        active: book.active === true,
        entries: Array.isArray(book.entries) ? book.entries : [],
        raw: book.raw && typeof book.raw === 'object' ? book.raw : undefined,
      })));
      selectedLorebookId = Object.hasOwn(data, 'selectedLorebookId') ? data.selectedLorebookId : lorebookLibrary[0].id;
    } else if (Array.isArray(data.worldBooks)) {
      ensureLorebookLibraryFromLegacy(data.worldBooks, '长相思世界书');
    }
    if (data.worldBookSettings && typeof data.worldBookSettings === 'object') Object.assign(worldBookSettings, data.worldBookSettings);
    if (Array.isArray(data.regexRules)) regexRules.splice(0, regexRules.length, ...data.regexRules);
    if (data.memorySettings && typeof data.memorySettings === 'object') Object.assign(memorySettings, data.memorySettings);
    memorySettings.knowledgePerformanceSendFields = normalizeKnowledgePerformanceSendFields(memorySettings.knowledgePerformanceSendFields);
    migrateLegacyMemorySummaryPrompt();
    normalizeMemoryPromptLibraries();
    if (data.appSettings && typeof data.appSettings === 'object') Object.assign(appSettings, data.appSettings);
  } catch (_) {
    // 单项缓存损坏时保留 App 内置默认值。
  }
}

const runtimeLogStore = {
  maxSize: 300,
  entries: [],
};

function pruneRuntimeLogs() {
  if (runtimeLogStore.entries.length > runtimeLogStore.maxSize) {
    runtimeLogStore.entries = runtimeLogStore.entries.slice(-runtimeLogStore.maxSize);
  }
}

function persistRuntimeLogs() {
  try {
    localStorage.setItem('yuanbao_runtime_logs', JSON.stringify(runtimeLogStore.entries));
  } catch {}
}

function loadRuntimeLogs() {
  try {
    const saved = localStorage.getItem('yuanbao_runtime_logs');
    if (saved) runtimeLogStore.entries = JSON.parse(saved);
  } catch {}
  pruneRuntimeLogs();
}

function logRuntime(level, tag, message, payload = null) {
  const entry = {
    time: new Date().toISOString(),
    level,
    tag,
    message,
    payload,
  };
  runtimeLogStore.entries.push(entry);
  pruneRuntimeLogs();
  persistRuntimeLogs();
  // eslint-disable-next-line no-console
  console.log(`[${level}] ${tag}: ${message}`, payload || '');
}

function clearRuntimeLogs() {
  runtimeLogStore.entries = [];
  persistRuntimeLogs();
}

function exportRuntimeLogs() {
  const text = runtimeLogStore.entries
    .map((entry) => {
      const time = new Date(entry.time).toLocaleString();
      const payload = entry.payload ? `\n${JSON.stringify(entry.payload, null, 2)}` : '';
      return `[${time}] [${entry.level}] ${entry.tag}: ${entry.message}${payload}`;
    })
    .join('\n');
  return exportTextFile(`${formatFileTimestamp()}-相思-运行日志.txt`, text || '暂无日志');
}

const chatHistories = [
  {
    id: 'default-xiangliu-chat',
    roleId: 'xiangliu',
    title: '相柳的新聊天',
    userName: '用户',
    characterName: '相柳',
    messages: [],
  },
];

const CHAT_CACHE_KEY = 'xl_chat_histories_v1';
const CHAT_DB_NAME = 'xiangsi_chat_v1';
const CHAT_DB_STORE = 'chatHistories';
const CHAT_DB_RECORD_ID = 'primary';
let pendingChatDatabasePayload = null;
let chatDatabaseWritePromise = null;
let chatDbPromise = null;
let chatCacheWarningShown = false;

function normalizeChatForCache(chat, { includeContextLogs = true, includeMemory = true } = {}) {
  if (!chat || typeof chat !== 'object') return null;
  const messages = Array.isArray(chat.messages) ? chat.messages.map((message) => ({
    role: message.role === 'user' ? 'user' : 'bot',
    name: String(message.name || ''),
    text: String(message.text || ''),
    sendDate: message.sendDate || '',
    isGreeting: message.isGreeting === true,
    personaId: message.personaId || '',
    ...(message.reasoning ? { reasoning: String(message.reasoning) } : {}),
    ...(Array.isArray(message.replyVariants) ? { replyVariants: message.replyVariants.map(String) } : {}),
    ...(Array.isArray(message.replyReasoningVariants) ? { replyReasoningVariants: message.replyReasoningVariants.map((value) => String(value || '')) } : {}),
    ...(Number.isFinite(Number(message.replyVariantIndex)) ? { replyVariantIndex: Number(message.replyVariantIndex) } : {}),
  })) : [];
  const normalized = {
    id: chat.id || `chat-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    roleId: chat.roleId || 'xiangliu',
    title: chat.title || '未命名聊天',
    userName: chat.userName || '用户',
    characterName: chat.characterName || '',
    source: chat.source || '',
    saveAllOptions: chat.saveAllOptions !== false,
    lastActiveAt: chat.lastActiveAt || '',
    messages,
  };
  if (includeContextLogs) {
    normalized.contextLogs = Array.isArray(chat.contextLogs) ? chat.contextLogs.slice(0, CONTEXT_LOG_LIMIT) : [];
  }
  if (includeMemory) normalized.memory = normalizeChatMemory(chat.memory);
  return normalized;
}

function buildChatPersistencePayload(chats, currentChat, activeByRole, options = {}) {
  const normalizedChats = (Array.isArray(chats) ? chats : []).map((chat) => normalizeChatForCache(chat, options)).filter(Boolean);
  const knownIds = new Set(normalizedChats.map((chat) => chat.id));
  const activeIdsByRole = {};
  Object.entries(activeByRole || {}).forEach(([roleId, chat]) => {
    const chatId = typeof chat === 'string' ? chat : chat?.id;
    if (chatId && knownIds.has(chatId)) activeIdsByRole[roleId] = chatId;
  });
  return {
    id: CHAT_DB_RECORD_ID,
    version: 2,
    updatedAt: new Date().toISOString(),
    activeChatId: currentChat?.id || '',
    activeChatsByRole: activeIdsByRole,
    chats: normalizedChats,
  };
}

function applyChatPersistencePayload(data) {
  const cachedChats = Array.isArray(data?.chats)
    ? data.chats.map((chat) => normalizeChatForCache(chat)).filter((chat) => chat && chat.id && chat.roleId)
    : [];
  if (!cachedChats.length) return false;
  chatHistories.splice(0, chatHistories.length, ...cachedChats);
  Object.keys(activeChatsByRole).forEach((key) => delete activeChatsByRole[key]);
  const byId = new Map(chatHistories.map((chat) => [chat.id, chat]));
  if (data?.activeChatsByRole && typeof data.activeChatsByRole === 'object') {
    Object.entries(data.activeChatsByRole).forEach(([roleId, savedChat]) => {
      const savedId = typeof savedChat === 'string' ? savedChat : savedChat?.id;
      const restored = byId.get(savedId) || chatHistories.find((item) => item.roleId === roleId);
      if (restored) activeChatsByRole[roleId] = restored;
    });
  }
  roles.forEach((role) => {
    if (!activeChatsByRole[role.id]) {
      const first = chatHistories.find((chat) => chat.roleId === role.id);
      if (first) activeChatsByRole[role.id] = first;
    }
  });
  activeChat = byId.get(data?.activeChatId) || chatHistories[0];
  return true;
}

function openChatDatabase() {
  if (!('indexedDB' in window)) return Promise.resolve(null);
  if (chatDbPromise) return chatDbPromise;
  chatDbPromise = new Promise((resolve) => {
    const request = indexedDB.open(CHAT_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CHAT_DB_STORE)) {
        db.createObjectStore(CHAT_DB_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
  return chatDbPromise;
}

async function writeChatHistoriesToDatabase(payload) {
  const db = await openChatDatabase();
  if (!db) return false;
  return new Promise((resolve) => {
    const transaction = db.transaction(CHAT_DB_STORE, 'readwrite');
    transaction.objectStore(CHAT_DB_STORE).put(payload);
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => resolve(false);
    transaction.onabort = () => resolve(false);
  });
}

function queueChatHistoriesDatabaseSave(payload = buildChatPersistencePayload(chatHistories, activeChat, activeChatsByRole)) {
  pendingChatDatabasePayload = payload;
  if (chatDatabaseWritePromise) return chatDatabaseWritePromise;
  chatDatabaseWritePromise = (async () => {
    while (pendingChatDatabasePayload) {
      const nextPayload = pendingChatDatabasePayload;
      pendingChatDatabasePayload = null;
      await writeChatHistoriesToDatabase(nextPayload);
    }
    chatDatabaseWritePromise = null;
  })();
  return chatDatabaseWritePromise;
}

async function loadChatHistoriesFromDatabase(localUpdatedAt = '') {
  const db = await openChatDatabase();
  if (!db) return false;
  const record = await new Promise((resolve) => {
    const request = db.transaction(CHAT_DB_STORE, 'readonly').objectStore(CHAT_DB_STORE).get(CHAT_DB_RECORD_ID);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => resolve(null);
  });
  if (!record?.chats?.length) return false;
  const databaseTime = Date.parse(record.updatedAt || '') || 0;
  const localTime = Date.parse(localUpdatedAt || '') || 0;
  return databaseTime >= localTime ? applyChatPersistencePayload(record) : false;
}

function saveChatHistoriesToCache() {
  const fullPayload = buildChatPersistencePayload(chatHistories, activeChat, activeChatsByRole);
  queueChatHistoriesDatabaseSave(fullPayload);
  try {
    const lightPayload = buildChatPersistencePayload(chatHistories, activeChat, activeChatsByRole, { includeContextLogs: false });
    localStorage.setItem(CHAT_CACHE_KEY, JSON.stringify(lightPayload));
    chatCacheWarningShown = false;
  } catch (error) {
    try {
      const emergencyPayload = buildChatPersistencePayload(chatHistories, activeChat, activeChatsByRole, {
        includeContextLogs: false,
        includeMemory: false,
      });
      localStorage.setItem(CHAT_CACHE_KEY, JSON.stringify(emergencyPayload));
    } catch (_) {
      if (!chatCacheWarningShown) {
        chatCacheWarningShown = true;
        console.warn('聊天轻量缓存写入失败，已继续保存到 IndexedDB：', error);
      }
    }
  }
}

function loadChatHistoriesFromCache() {
  try {
    const raw = localStorage.getItem(CHAT_CACHE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (!applyChatPersistencePayload(data)) return '';
    return data.updatedAt || '';
  } catch (_) {
    // 缓存损坏则忽略，继续用内置初始聊天
    return '';
  }
}

const chatScreen = document.querySelector('#chatScreen');
const phoneShell = document.querySelector('.phone-shell');
const detectedAppPlatform = globalThis.Capacitor?.getPlatform?.() || '';
const detectedNativeApp = !!(
  globalThis.Capacitor?.isNativePlatform?.()
  || ['android', 'ios'].includes(detectedAppPlatform)
);

function markNativeAppPlatform() {
  if (!detectedNativeApp) return;
  document.body.classList.add('is-native-app');
  if (detectedAppPlatform) document.body.classList.add(`is-${detectedAppPlatform}`);
}
markNativeAppPlatform();

// 安卓/苹果浏览器的地址栏会改变真正可见高度；100vh 往往仍包含被地址栏挡住的区域。
// 键盘弹出时不要把可视高度写回整个 phone-shell，否则背景层会随容器缩短而重新 cover，
// 看起来就像背景图片被轻微缩小；输入栏/聊天层由下面的键盘位移逻辑单独处理。
let appLayoutViewportHeight = 0;
function syncAppViewportHeight() {
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const focusedElement = document.activeElement;
  const keyboardInputFocused = focusedElement?.matches?.('textarea#messageInput, input#messageInput');
  const keyboardViewportShrunk = keyboardInputFocused
    && appLayoutViewportHeight > 0
    && viewportHeight < appLayoutViewportHeight - 80;
  const roundedHeight = Math.round(viewportHeight);
  // phone-shell 仍使用当前可视高度，让输入栏随键盘上移；背景层另用键盘前高度锁定比例。
  document.documentElement.style.setProperty('--app-viewport-height', `${roundedHeight}px`);
  if (!keyboardViewportShrunk) {
    appLayoutViewportHeight = roundedHeight;
    document.documentElement.style.setProperty('--background-viewport-height', `${roundedHeight}px`);
    document.documentElement.style.setProperty('--composer-buffer-height', `${Math.round(roundedHeight * 0.4)}px`);
  }
}
syncAppViewportHeight();
window.visualViewport?.addEventListener('resize', syncAppViewportHeight);
window.visualViewport?.addEventListener('scroll', syncAppViewportHeight);
window.addEventListener('resize', syncAppViewportHeight);

const backgroundLayer = document.querySelector('#backgroundLayer');
const scrollBlur = document.querySelector('.scroll-blur');
const messages = document.querySelector('#messages');
const composer = document.querySelector('#composer');
const input = document.querySelector('#messageInput');
const voiceInputButton = document.querySelector('#voiceInputButton');

// 输入栏可能因多行文字而增高；渐变缓冲层的底边必须始终紧贴输入栏顶边。
function syncComposerBufferAnchor() {
  if (!composer || !chatScreen) return;
  chatScreen.style.setProperty('--composer-buffer-bottom', `${Math.ceil(composer.offsetHeight)}px`);
}
if (typeof ResizeObserver === 'function') {
  new ResizeObserver(syncComposerBufferAnchor).observe(composer);
}
requestAnimationFrame(syncComposerBufferAnchor);
const inputContextMenu = document.querySelector('#inputContextMenu');
const pasteInputTextButton = document.querySelector('#pasteInputText');
const copyInputTextButton = document.querySelector('#copyInputText');
const insertInputLineBreakButton = document.querySelector('#insertInputLineBreak');
const impersonateInputReplyButton = document.querySelector('#impersonateInputReply');
const heroGreeting = document.querySelector('#heroGreeting') || { textContent: '' };
const heroLastReplyTime = document.querySelector('#heroLastReplyTime');
const jumpButton = document.querySelector('#jumpButton');
const openRoles = document.querySelector('#openRoles');
const roleSheet = document.querySelector('#roleSheet');
const sheetScrim = document.querySelector('#sheetScrim');
const roleList = document.querySelector('#roleList');
const roleChatSearch = document.querySelector('#roleChatSearch');
const roleSearchResults = document.querySelector('#roleSearchResults');
const headerAvatar = document.querySelector('#headerAvatar');
const currentRoleName = document.querySelector('#currentRoleName');
const addRoleButton = document.querySelector('#addRoleButton');
const characterEditor = document.querySelector('#characterEditor');
const closeEditor = document.querySelector('#closeEditor');
const saveRoleButton = document.querySelector('#saveRoleButton');
const editorAvatarButton = document.querySelector('#editorAvatarButton');
const editorAvatar = document.querySelector('#editorAvatar');
const avatarFileInput = document.querySelector('#avatarFileInput');
const backgroundFileInput = document.querySelector('#backgroundFileInput');
const roleImagePicker = document.querySelector('#roleImagePicker');
const roleAvatarChoice = document.querySelector('#roleAvatarChoice');
const roleBackgroundChoice = document.querySelector('#roleBackgroundChoice');
const roleAvatarPreview = document.querySelector('#roleAvatarPreview');
const roleBackgroundPreview = document.querySelector('#roleBackgroundPreview');
const cancelRoleImages = document.querySelector('#cancelRoleImages');
const confirmRoleImages = document.querySelector('#confirmRoleImages');
const roleImageCropper = document.querySelector('#roleImageCropper');
const imageCropTitle = document.querySelector('#imageCropTitle');
const imageCropHint = document.querySelector('#imageCropHint');
const roleCropStage = document.querySelector('#roleCropStage');
const roleCropImage = document.querySelector('#roleCropImage');
const roleCropZoom = document.querySelector('#roleCropZoom');
const cancelImageCropTop = document.querySelector('#cancelImageCropTop');
const cancelImageCrop = document.querySelector('#cancelImageCrop');
const confirmImageCrop = document.querySelector('#confirmImageCrop');
const roleNameInput = document.querySelector('#roleNameInput');
const roleSubtitleInput = document.querySelector('#roleSubtitleInput');
const roleIntroInput = document.querySelector('#roleIntroInput');
const roleIntroSection = document.querySelector('#roleIntroSection');
const roleIntroToggle = document.querySelector('#roleIntroToggle');
const rolePersonaInput = document.querySelector('#rolePersonaInput');
const rolePersonalityInput = document.querySelector('#rolePersonalityInput');
const roleScenarioInput = document.querySelector('#roleScenarioInput');
const roleGreetingInput = document.querySelector('#roleGreetingInput');
const roleExampleInput = document.querySelector('#roleExampleInput');
const roleNoteInput = document.querySelector('#roleNoteInput');
const roleVoiceInput = document.querySelector('#roleVoiceInput');
const roleAutoReadInput = document.querySelector('#roleAutoReadInput');
const personaVersionList = document.querySelector('#personaVersionList');
const personaMenuButton = document.querySelector('#personaMenuButton');
const personaFileInput = document.querySelector('#personaFileInput');
const multiPersonaFileInput = document.querySelector('#multiPersonaFileInput');
const openChatStore = document.querySelector('#openChatStore');
const chatStorePage = document.querySelector('#chatStorePage');
const closeChatStore = document.querySelector('#closeChatStore');
const storeBackground = document.querySelector('#storeBackground');
const storeRoleName = document.querySelector('#storeRoleName');
const storeRoleIntro = document.querySelector('#storeRoleIntro');
const historyList = document.querySelector('#historyList');
const fontSettingButton = document.querySelector('#fontSettingButton');
const uploadRecordsButton = document.querySelector('#uploadRecordsButton');
const recordsFileInput = document.querySelector('#recordsFileInput');
const storeApiButton = document.querySelector('#storeApiButton');
const settingsPage = document.querySelector('#settingsPage');
const closeSettings = document.querySelector('#closeSettings');
const settingsTitle = document.querySelector('#settingsTitle');
const appVersionButton = document.querySelector('#appVersionButton');
const appUpdateNotice = document.querySelector('#appUpdateNotice');
const settingsList = document.querySelector('#settingsList');
const detailPage = document.querySelector('#detailPage');
const closeDetail = document.querySelector('#closeDetail');
const detailTitle = document.querySelector('#detailTitle');
const detailHeaderActions = document.querySelector('#detailHeaderActions');
const detailBody = document.querySelector('#detailBody');
const chatActionMenu = document.querySelector('#chatActionMenu');
const exportChatButton = document.querySelector('#exportChatButton');
const renameChatButton = document.querySelector('#renameChatButton');
const deleteChatButton = document.querySelector('#deleteChatButton');
const renameDialog = document.querySelector('#renameDialog');
const renameDialogTitle = document.querySelector('#renameDialogTitle');
const renameChatInput = document.querySelector('#renameChatInput');
const cancelRenameButton = document.querySelector('#cancelRenameButton');
const confirmRenameButton = document.querySelector('#confirmRenameButton');
const deleteChatDialog = document.querySelector('#deleteChatDialog');
const deleteChatTargetName = document.querySelector('#deleteChatTargetName');
const deleteChatNameInput = document.querySelector('#deleteChatNameInput');
const cancelDeleteChatBackdrop = document.querySelector('#cancelDeleteChatBackdrop');
const cancelDeleteChatButton = document.querySelector('#cancelDeleteChatButton');
const confirmDeleteChatButton = document.querySelector('#confirmDeleteChatButton');
const reshapeRoleButton = document.querySelector('#reshapeRoleButton');

// 融合面板元素引用（嵌入 chatStorePage）
const userIdentityRow = document.querySelector("#userIdentityRow");
const userIdentityAvatar = document.querySelector("#userIdentityAvatar");
const userIdentityName = document.querySelector("#userIdentityName");
const userAvatarInput = document.querySelector("#userAvatarInput");
const avatarPlaceholder = document.querySelector("#avatarPlaceholder");
const groupChatPanel = document.querySelector("#groupChatPanel");
const advancedPanel = document.querySelector("#advancedPanel");
// 仅用于“上下文日志”展示上一次实际请求；不会作为下一次请求的发送缓存。
let lastRequestPreviewMessages = [];
let lastRequestContextReport = null;

// 消息长按/多选删除状态（longPressTimer 已在下方复用声明）
let isSelectionMode = false;
let selectedMessageIndices = new Set();
let messageContextMenu = null;
let selectionToolbar = null;
let selectionToolbarAnchor = null;
const contextLog = document.querySelector("#contextLog");
const contextLogContent = document.querySelector("#contextLogContent");
const contextLogPage = document.querySelector("#contextLogPage");
const contextLogFullContent = document.querySelector("#contextLogFullContent");
const closeContextLogFull = document.querySelector("#closeContextLogFull");
const contextLogPageTitle = document.querySelector('#contextLogPageTitle');
const openChatContextLogsButton = document.querySelector('#openChatContextLogsButton');
const contextLogActionMenu = document.querySelector('#contextLogActionMenu');
const exportContextLogButton = document.querySelector('#exportContextLogButton');
const deleteContextLogButton = document.querySelector('#deleteContextLogButton');
let contextLogChat = null;
let selectedContextLog = null;
let contextLogView = 'list';
let contextLogListScrollTop = 0;
let contextLogActionAnchor = null;

const activePersonaButton = document.querySelector('#activePersonaButton');
const activePersonaCard = document.querySelector('#activePersonaCard');
const activePersonaCaret = document.querySelector('#activePersonaCaret');
const activePersonaExpand = document.querySelector('#activePersonaExpand');
const editActivePersonaExpandButton = document.querySelector('#editActivePersonaExpandButton');
const swapActivePersonaExpandButton = document.querySelector('#swapActivePersonaExpandButton');
const multiPersonaPollingButton = document.querySelector('#multiPersonaPollingButton');
const singleModeDot = document.querySelector('#singleModeDot');
const pollingModeDot = document.querySelector('#pollingModeDot');
const pollingExpand = document.querySelector('#pollingExpand');
const pollingList = document.querySelector('#pollingList');
const pollingModePicker = document.querySelector('#pollingModePicker');
const fixedPollingPanel = document.querySelector('#fixedPollingPanel');
const randomPollingPanel = document.querySelector('#randomPollingPanel');
const randomPersonaList = document.querySelector('#randomPersonaList');
const randomApiList = document.querySelector('#randomApiList');
const randomPresetList = document.querySelector('#randomPresetList');
const pollingStatus = document.querySelector('#pollingStatus');
const personaSwapPage = document.querySelector('#personaSwapPage');
const personaSwapList = document.querySelector('#personaSwapList');
const closePersonaSwap = document.querySelector('#closePersonaSwap');
const copyChatButton = document.querySelector('#copyChatButton');
const personaActionMenu = document.querySelector('#personaActionMenu');
const renamePersonaButton = document.querySelector('#renamePersonaButton');
const copyPersonaButton = document.querySelector('#copyPersonaButton');
const deletePersonaButton = document.querySelector('#deletePersonaButton');
const personaMenu = document.querySelector('#personaMenu');
const menuAddEmptyPersona = document.querySelector('#menuAddEmptyPersona');
const menuCopyPersona = document.querySelector('#menuCopyPersona');
const menuImportPersona = document.querySelector('#menuImportPersona');
const menuExportPersona = document.querySelector('#menuExportPersona');
const menuImportMultiPersona = document.querySelector('#menuImportMultiPersona');
const menuExportMultiPersona = document.querySelector('#menuExportMultiPersona');
const menuRecallDefaultPersonas = document.querySelector('#menuRecallDefaultPersonas');
const editorExitMenu = document.querySelector('#editorExitMenu');
const exitSaveButton = document.querySelector('#exitSaveButton');
const exitDiscardButton = document.querySelector('#exitDiscardButton');
const roleManagerOverlay = document.querySelector('#roleManagerOverlay');
const closeRoleManagerButton = document.querySelector('#closeRoleManager');
const roleManagerTarget = document.querySelector('#roleManagerTarget');
const addBlankRoleButton = document.querySelector('#addBlankRoleButton');
const copyCurrentRoleButton = document.querySelector('#copyCurrentRoleButton');
const deleteCurrentRoleButton = document.querySelector('#deleteCurrentRoleButton');
const editCurrentRoleIntroButton = document.querySelector('#editCurrentRoleIntroButton');
const exportRoleManagerBackupButton = document.querySelector('#exportRoleManagerBackupButton');
const importRoleManagerBackupButton = document.querySelector('#importRoleManagerBackupButton');
const roleShellPreviewButtons = Array.from(document.querySelectorAll('[data-shell-preview]'));
const copyRoleDialog = document.querySelector('#copyRoleDialog');
const copyRoleSize = document.querySelector('#copyRoleSize');
const cancelCopyRoleBackdrop = document.querySelector('#cancelCopyRoleBackdrop');
const cancelCopyRoleButton = document.querySelector('#cancelCopyRoleButton');
const confirmCopyRoleButton = document.querySelector('#confirmCopyRoleButton');
const deleteRoleDialog = document.querySelector('#deleteRoleDialog');
const deleteRoleWarning = document.querySelector('#deleteRoleWarning');
const deleteRoleNameInput = document.querySelector('#deleteRoleNameInput');
const cancelDeleteRoleBackdrop = document.querySelector('#cancelDeleteRoleBackdrop');
const cancelDeleteRoleButton = document.querySelector('#cancelDeleteRoleButton');
const confirmDeleteRoleButton = document.querySelector('#confirmDeleteRoleButton');
const editRoleIntroDialog = document.querySelector('#editRoleIntroDialog');
const editRoleIntroTarget = document.querySelector('#editRoleIntroTarget');
const quickRoleIntroInput = document.querySelector('#quickRoleIntroInput');
const cancelEditRoleIntroBackdrop = document.querySelector('#cancelEditRoleIntroBackdrop');
const cancelEditRoleIntroButton = document.querySelector('#cancelEditRoleIntroButton');
const saveRoleIntroButton = document.querySelector('#saveRoleIntroButton');

// Default to the memorial character shown in the restored Yuanbao-style shell.
// This only changes the initial visual state; the role and settings interactions stay intact.
let currentRole = roles[0];
let editingRole = currentRole;
let chatFontSize = 17;

// ===== 聊天界面设置（外观页"聊天界面设置"section 的状态） =====
const APPEARANCE_CACHE_KEY = 'xs_chat_appearance_v1';
const DEFAULT_APPEARANCE = {
  fontSize: 17,
  fontColor: '',                                      // 聊天字体颜色（hex；空字符串 = 跟随主题默认）
  bubbleUser: { r: 151, g: 89,  b: 64, a: 0.95 },  // 用户气泡（独立 RGBA）
  bubbleBot:  { r: 240, g: 229, b: 236, a: 0.1 },  // AI 气泡（独立 RGBA，默认值沿用原硬编码视觉）
  bubbleUserGlass: true,                            // 用户气泡玻璃滤镜
  bubbleBotGlass: true,                             // AI 气泡玻璃滤镜
  inputBar:  { r: 106, g: 74,  b: 61, a: 1  },   // 用户输入栏（独立 RGBA）
  primaryRgb: { r: 90,  g: 54,  b: 38 },            // 主色 RGB：4 个位置共享（暗色层下 + 输入栏渐变上下 + 末端实色）
  overlay: {                                        // 暗色层
    top: { r: 175, g: 134, b: 104, a: 0.05 },       // 暗色层上：独立 RGBA
    topStop: 10,                                    // 暗色层上位置 %
    bottomAlpha: 0.7,                               // 暗色层下 alpha（RGB 来自 primaryRgb）
    bottomStop: 100,                                // 暗色层下位置 %
  },
  buffer: {                                         // 输入栏渐变 40% 缓冲层（全部共享 primaryRgb）
    topAlpha: 0,
    topStop: 0,
    midAlpha: 0.5,
    midStop: 35,
    endStop: 100,                                   // 末端实色 RGB=primaryRgb
  },
};
let appAppearance = deepCloneAppearance(DEFAULT_APPEARANCE);

function deepCloneAppearance(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadAppearance() {
  try {
    const raw = localStorage.getItem(APPEARANCE_CACHE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    // 合并保存值与默认值（保留新增字段的默认值）
    appAppearance = {
      ...deepCloneAppearance(DEFAULT_APPEARANCE),
      ...saved,
      bubbleUser:  { ...DEFAULT_APPEARANCE.bubbleUser,  ...(saved.bubbleUser  || {}) },
      bubbleBot:   { ...DEFAULT_APPEARANCE.bubbleBot,   ...(saved.bubbleBot   || {}) },
      inputBar:    { ...DEFAULT_APPEARANCE.inputBar,    ...(saved.inputBar    || {}) },
      primaryRgb:  { ...DEFAULT_APPEARANCE.primaryRgb,  ...(saved.primaryRgb  || {}) },
      overlay:     {
        ...DEFAULT_APPEARANCE.overlay,
        ...(saved.overlay || {}),
        top: { ...DEFAULT_APPEARANCE.overlay.top, ...((saved.overlay && saved.overlay.top) || {}) },
      },
      buffer:      { ...DEFAULT_APPEARANCE.buffer,     ...(saved.buffer      || {}) },
    };
  } catch (_) {
    appAppearance = deepCloneAppearance(DEFAULT_APPEARANCE);
  }
}

function saveAppearance() {
  try {
    localStorage.setItem(APPEARANCE_CACHE_KEY, JSON.stringify(appAppearance));
  } catch (_) {}
}

// 把 appAppearance 同步到 :root 的 CSS 变量（运行时生效，渐变 + 颜色实时变化）
function applyChatAppearance() {
  const style = document.documentElement.style;
  const A = appAppearance;
  const pr = A.primaryRgb;
  const primaryRgba = (a) => `rgba(${pr.r}, ${pr.g}, ${pr.b}, ${a})`;
  const colorRgba = (c) => `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;

  style.setProperty('--app-font-size', `${A.fontSize}px`);
  if (A.fontColor) style.setProperty('--app-font-color', A.fontColor);
  else style.removeProperty('--app-font-color');
  style.setProperty('--app-bubble-user', colorRgba(A.bubbleUser));
  style.setProperty('--app-bubble-bot',  colorRgba(A.bubbleBot));
  style.setProperty('--app-input-bar',   colorRgba(A.inputBar));

  // 气泡玻璃滤镜开关：关闭时给根元素加标记类，由 CSS 去掉对应气泡的浅色描边、柔光阴影和自身模糊
  document.documentElement.classList.toggle('bubble-user-glass-off', A.bubbleUserGlass === false);
  document.documentElement.classList.toggle('bubble-bot-glass-off', A.bubbleBotGlass === false);

  // 暗色层：上独立 + 下绑定 RGB
  style.setProperty('--app-bg-overlay-top',           colorRgba(A.overlay.top));
  style.setProperty('--app-bg-overlay-top-stop',      `${A.overlay.topStop}%`);
  style.setProperty('--app-bg-overlay-bottom',        primaryRgba(A.overlay.bottomAlpha));
  style.setProperty('--app-bg-overlay-bottom-stop',   `${A.overlay.bottomStop}%`);

  // 输入栏渐变 40% 缓冲层：3 个全部绑定 RGB
  style.setProperty('--app-bg-buffer-top',     primaryRgba(A.buffer.topAlpha));
  style.setProperty('--app-bg-buffer-top-stop', `${A.buffer.topStop}%`);
  style.setProperty('--app-bg-buffer-mid',     primaryRgba(A.buffer.midAlpha));
  style.setProperty('--app-bg-buffer-mid-stop', `${A.buffer.midStop}%`);
  style.setProperty('--app-bg-buffer-end',     `rgb(${pr.r}, ${pr.g}, ${pr.b})`);
  style.setProperty('--app-bg-buffer-end-stop', `${A.buffer.endStop}%`);

  // 兼容旧的聊天字号 CSS 变量
  style.setProperty('--chat-font-size', `${A.fontSize}px`);
  chatFontSize = A.fontSize;
}

function resetAppearance() {
  appAppearance = deepCloneAppearance(DEFAULT_APPEARANCE);
  saveAppearance();
  applyChatAppearance();
}
let activeChat = chatHistories.find((chat) => chat.roleId === 'xiangliu') || chatHistories[0];
const activeChatsByRole = {};
let selectedHistory = null;
let pendingDeleteChat = null;
let chatActionMenuAnchor = null;
let longPressTimer = null;
let longPressTriggered = false;
let selectedPersona = null;
let lastReplyPersonaId = '';
let lastReplyReasoningText = '';
let renameMode = 'chat';
let selectedApiIndex = -1;
let selectedApiActionAnchor = null;
let editorInitialState = null;
let copySourceRoleId = null;
let expandedRoleId = null;

const personaFields = ['name', 'subtitle', 'intro', 'description', 'personality', 'scenario', 'greeting', 'example', 'note', 'tags', 'voiceId'];

const SYSTEM_DEFAULT_PRESET_ID = 'system-default-preset';
let systemDefaultPersonaTemplates = [];
let systemDefaultPresetTemplate = null;
let systemGiftsLoadPromise = null;

async function readBundledJson(path) {
  try {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) return null;
    return await response.json();
  } catch (_) {
    return null;
  }
}

function multiPersonaItemsFromDocument(data) {
  if (!data || typeof data !== 'object') return [];
  if (Array.isArray(data.personas)) return data.personas;
  if (Array.isArray(data.personaVersions)) return data.personaVersions;
  if (Array.isArray(data.roles)) {
    return data.roles.flatMap((role) => Array.isArray(role?.personaVersions) ? role.personaVersions : []);
  }
  return [];
}

function normalizeSystemPersonaTemplates(data) {
  return multiPersonaItemsFromDocument(data).filter((item) => item && typeof item === 'object').map((item, index) => {
    const template = { label: String(item.label || item.name || `默认人设 ${index + 1}`) };
    personaFields.forEach((field) => { template[field] = cloneData(item[field] ?? (field === 'tags' ? [] : '')); });
    template.key = String(item.key || item.templateKey || item.id || `default-persona-${index + 1}`);
    return template;
  });
}

function systemPersonaTemplateFor(persona) {
  if (!persona?._systemDefaultKey) return null;
  return systemDefaultPersonaTemplates.find((template) => template.key === persona._systemDefaultKey) || null;
}

function isPristineSystemPersona(persona) {
  const template = systemPersonaTemplateFor(persona);
  if (!template || String(persona.label || '') !== template.label) return false;
  return personaFields.every((field) => JSON.stringify(persona[field] ?? (field === 'tags' ? [] : '')) === JSON.stringify(template[field] ?? (field === 'tags' ? [] : '')));
}

async function loadBundledSystemGifts() {
  const [personaData, presetData] = await Promise.all([
    readBundledJson('./default-personas.json'),
    readBundledJson('./default-preset.json'),
  ]);
  systemDefaultPersonaTemplates = normalizeSystemPersonaTemplates(personaData);
  if (presetData && typeof presetData === 'object') {
    try {
      const normalized = Array.isArray(presetData.promptBlocks) && Array.isArray(presetData.promptOrder)
        ? cloneData(presetData)
        : normalizeImportedPreset(presetData, '默认预设.json');
      normalized.name = `【默认预设】${String(normalized.name || '未命名预设').replace(/^【默认预设】/, '')}`;
      normalized.id = SYSTEM_DEFAULT_PRESET_ID;
      normalized.systemDefault = true;
      normalized.active = false;
      systemDefaultPresetTemplate = ensurePresetPromptManagerData(normalized);
    } catch (_) {
      systemDefaultPresetTemplate = null;
    }
  }
  installSystemDefaultPreset();
  saveAppStateToCache();
  renderMoreSettings();
  if (detailPage?.classList.contains('is-open') && detailTitle?.textContent === '预设') openPresetDetail();
}

function installSystemDefaultPreset() {
  if (!systemDefaultPresetTemplate) return;
  const old = presets.find((preset) => preset.id === SYSTEM_DEFAULT_PRESET_ID || preset.systemDefault === true);
  const wasActive = old?.active === true;
  const wasSelected = selectedPresetId === old?.id || selectedPresetId === SYSTEM_DEFAULT_PRESET_ID;
  for (let index = presets.length - 1; index >= 0; index -= 1) {
    if (presets[index].id === SYSTEM_DEFAULT_PRESET_ID || presets[index].systemDefault === true) presets.splice(index, 1);
  }
  const installed = cloneData(systemDefaultPresetTemplate);
  installed.active = wasActive;
  if (wasActive) presets.forEach((preset) => { preset.active = false; });
  presets.unshift(installed);
  if (wasSelected) selectedPresetId = SYSTEM_DEFAULT_PRESET_ID;
}

function copyPersonaFields(source, target) {
  personaFields.forEach((field) => {
    target[field] = Array.isArray(source[field]) ? [...source[field]] : source[field];
  });
}

// 人物在界面上的固定名字，与可随人设版本变化、并参与 AI 请求的 role.name 分离。
// 旧数据首次载入时，以当时人物界面正在使用的名字完成一次性锁定。
function ensureRoleDisplayName(role) {
  if (role.displayNameLocked === false) return role.displayName || role.name || '新人物';
  if (!String(role.displayName || '').trim()) role.displayName = String(role.name || '新人物').trim();
  role.displayNameLocked = true;
  return role.displayName;
}

function roleDisplayName(role = currentRole) {
  return ensureRoleDisplayName(role || {});
}

function ensurePersonaVersions(role) {
  ensureRoleDisplayName(role);
  if (role.personaVersions?.length) {
    role.personaVersions.forEach((persona, index) => {
      if (persona.voiceId == null) persona.voiceId = index === 0 ? String(role.voiceId || '') : '';
    });
    return;
  }
  role.personaVersions = [{ id: `${role.id}-1`, label: `${role.name} 1`, apiId: '' }];
  copyPersonaFields(role, role.personaVersions[0]);
  role.activePersonaId = role.personaVersions[0].id;
}

function activePersona(role = currentRole) {
  ensurePersonaVersions(role);
  return role.personaVersions.find((persona) => persona.id === role.activePersonaId) || role.personaVersions[0];
}

function applyPersona(role, persona) {
  copyPersonaFields(persona, role);
  role.activePersonaId = persona.id;
}

/**
 * 多轮询：为本次唯一的一次请求选择人设、API模型和预设。
 * 随机选择只发生在本机，不会增加 API 请求次数。
 */
function pickPollingSelection() {
  const role = currentRole;
  ensurePersonaVersions(role);
  const fallback = { persona: activePersona(role), api: activeApi(), preset: activePreset(), polling: false, mode: 'single' };
  if (!isPollingActive()) return fallback;

  const validIds = role.personaVersions.map((p) => p.id);
  if (polling.mode === 'random') {
    const personas = role.personaVersions.filter((persona) => polling.randomPersonaIds.includes(persona.id));
    const apis = apiLinks.filter((api) => polling.randomApiIds.includes(api.id) && pollingApiReady(api));
    const selectedPresets = presets.filter((preset) => polling.randomPresetIds.includes(preset.id));
    const persona = personas[Math.floor(Math.random() * personas.length)];
    const api = apis[Math.floor(Math.random() * apis.length)];
    const preset = selectedPresets[Math.floor(Math.random() * selectedPresets.length)];
    return { persona, api, preset, polling: true, mode: 'random' };
  }

  polling.pool = polling.pool.filter((entry) => validIds.includes(entry.id));
  const eligiblePool = polling.pool.filter((entry) => pollingApiReady(apiById(entry.apiId) || activeApi()));
  const ids = eligiblePool.map((entry) => entry.id);
  if (!polling.currentId || !ids.includes(polling.currentId)) {
    polling.currentId = ids[Math.floor(Math.random() * ids.length)];
    polling.count = 0;
  }

  const currentEntry = eligiblePool.find((p) => p.id === polling.currentId);
  const interval = clampPollInterval(currentEntry?.interval);

  // 已答满当前版本，则随机切到另一个选中版本（非当前）
  if (polling.count >= interval) {
    const others = ids.filter((id) => id !== polling.currentId);
    polling.currentId = others[Math.floor(Math.random() * others.length)];
    polling.count = 0;
  }
  polling.count += 1;

  savePollingState();
  const persona = role.personaVersions.find((item) => item.id === polling.currentId) || activePersona(role);
  const entry = eligiblePool.find((item) => item.id === persona.id);
  return {
    persona,
    api: apiById(entry?.apiId) || activeApi(),
    preset: activePreset(),
    polling: true,
    mode: 'fixed',
  };
}

function renderPersonaVersions(role = editingRole) {
  if (!role || !personaVersionList) return;
  ensurePersonaVersions(role);
  personaVersionList.innerHTML = '';
  role.personaVersions.forEach((persona) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `persona-version-button${persona.id === role.activePersonaId ? ' is-active' : ''}${isPristineSystemPersona(persona) ? ' is-system-default' : ''}`;
    button.textContent = persona.label;
    button.addEventListener('click', () => {
      if (longPressTriggered) {
        longPressTriggered = false;
        return;
      }
      applyPersona(role, persona);
      openEditor(role);
      if (role.id === currentRole.id) setRole(role);
    });
    button.addEventListener('pointerdown', (event) => {
      longPressTriggered = false;
      longPressTimer = window.setTimeout(() => {
        longPressTriggered = true;
        openPersonaActionMenu(role, persona, event);
      }, 560);
    });
    button.addEventListener('pointerup', clearLongPress);
    button.addEventListener('pointerleave', clearLongPress);
    button.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      openPersonaActionMenu(role, persona, event);
    });
    personaVersionList.append(button);
  });
}

function renderActivePersona() {
  if (!activePersonaButton || !currentRole) return;
  activePersonaButton.textContent = activePersona(currentRole).label;
}

function addPersonaVersion() {
  const role = editingRole;
  ensurePersonaVersions(role);
  const knownNumbers = role.personaVersions.map((persona) => Number((persona.label || '').match(/(\d+)\s*$/)?.[1]) || 0);
  const label = `${role.name} ${Math.max(0, ...knownNumbers) + 1}`;
  const persona = { id: `${role.id}-${Date.now()}`, label, apiId: '' };
  copyPersonaFields(activePersona(role), persona);
  // 新增版本的「角色介绍」默认取该角色的固定介绍文本（role.intro），手改过的其它版本不影响这里
  persona.intro = role.intro || '';
  // 新增人设版本默认不绑定 API，由全局 API 设置决定
  persona.apiId = '';
  role.personaVersions.push(persona);
  applyPersona(role, persona);
  openEditor(role);
  if (role.id === currentRole.id) setRole(role);
  showToast(`已新增 ${label}`);
}

function addEmptyPersonaVersion() {
  const role = editingRole;
  ensurePersonaVersions(role);
  const knownNumbers = role.personaVersions.map((persona) => Number((persona.label || '').match(/(\d+)\s*$/)?.[1]) || 0);
  const label = `${role.name} ${Math.max(0, ...knownNumbers) + 1}`;
  const persona = { id: `${role.id}-empty-${Date.now()}`, label, apiId: '' };
  // 空人设：不复制任何字段，介绍仍默认取角色固定介绍文本
  persona.intro = role.intro || '';
  // 空人设默认不绑定 API
  persona.apiId = '';
  role.personaVersions.push(persona);
  applyPersona(role, persona);
  openEditor(role);
  if (role.id === currentRole.id) setRole(role);
  showToast(`已新增空人设 ${label}`);
}

function openPersonaActionMenu(role, persona, event) {
  clearLongPress();
  const anchor = event?.currentTarget || event?.target?.closest?.('.persona-version-button') || event?.target || null;
  const isSameOpen = selectedPersona?.persona?.id === persona?.id && personaActionMenu.classList.contains('is-open');
  if (isSameOpen) {
    closePersonaActionMenu();
    return;
  }
  closeTransientActionMenus();
  selectedPersona = { role, persona };
  personaActionMenu.style.visibility = 'hidden';
  personaActionMenu.classList.add('is-open');
  personaActionMenu.setAttribute('aria-hidden', 'false');
  registerTransientActionMenu('persona-action', {
    menu: personaActionMenu,
    anchor,
    owner: characterEditor,
    close: closePersonaActionMenu,
    align: 'center',
    width: 160,
  });
  personaActionMenu.style.visibility = '';
}

function closePersonaActionMenu() {
  personaActionMenu.classList.remove('is-open');
  personaActionMenu.setAttribute('aria-hidden', 'true');
  personaVersionList?.querySelectorAll('.persona-version-button').forEach((button) => button.setAttribute('aria-expanded', 'false'));
  unregisterTransientActionMenu('persona-action');
}

function openPersonaMenu(event) {
  const anchor = event?.currentTarget || event?.target?.closest?.('.persona-add-button') || event?.target || null;
  if (personaMenu.classList.contains('is-open')) {
    closePersonaMenu();
    return;
  }
  closeTransientActionMenus();
  selectedPersona = null;
  personaMenu.style.visibility = 'hidden';
  personaMenu.classList.add('is-open');
  personaMenu.setAttribute('aria-hidden', 'false');
  registerTransientActionMenu('persona-create', {
    menu: personaMenu,
    anchor,
    owner: characterEditor,
    close: closePersonaMenu,
    align: 'end',
    width: 190,
  });
  personaMenu.style.visibility = '';
}

function closePersonaMenu() {
  personaMenu.classList.remove('is-open');
  personaMenu.setAttribute('aria-hidden', 'true');
  personaMenuButton?.setAttribute('aria-expanded', 'false');
  unregisterTransientActionMenu('persona-create');
}

// 后备回复已删除——角色回复必须连接 API，未配置时提示用户

/**
 * 构建聊天上下文消息数组（系统提示 + 世界书 + 示例对话 + 历史消息）
 * 系统提示按 Tavo 风格分层：总指导 → 角色描述 → 性格 → 情景 → 用户身份 → 辅助规则
 */
function replacePromptMacros(text = '') {
  return String(text)
    .replace(/\{\{char\}\}/gi, currentRole?.name || '角色')
    .replace(/\{\{user\}\}/gi, userProfile?.name || '用户');
}

function joinPromptParts(parts) {
  return parts.map(replacePromptMacros).map((part) => part.trim()).filter(Boolean).join('\n\n');
}

function splitWorldKeys(value = '') {
  return String(value).split(/[,，、\n]+/).map((key) => key.trim()).filter(Boolean);
}

function normalizeWorldEntry(book, index) {
  const positionMap = {
    0: 'before_char', 1: 'after_char', 2: 'before_an', 3: 'after_an', 4: 'at_depth',
    5: 'before_examples', 6: 'after_examples', 7: 'outlet',
    before: 'before_char', after: 'after_char',
  };
  const roleMap = { 0: 'system', 1: 'user', 2: 'assistant', system: 'system', user: 'user', assistant: 'assistant' };
  const rawScanDepth = book.scanDepth ?? book.scan_depth;
  return {
    ...book,
    id: book.id || book.uid || `wb-${index}`,
    name: book.name || book.comment || book.memo || `世界书条目 ${index + 1}`,
    enabled: book.enabled !== false && book.disable !== true,
    content: String(book.content || '').trim(),
    keys: Array.isArray(book.keys) ? book.keys.filter(Boolean) : splitWorldKeys(book.keywords || book.key),
    secondaryKeys: Array.isArray(book.secondaryKeys)
      ? book.secondaryKeys.filter(Boolean)
      : splitWorldKeys(book.secondaryKeys || book.keysecondary || book.keysecondaryText),
    selectiveLogic: book.selectiveLogic || book.selectiveLogic === 0
      ? String(book.selectiveLogic)
      : 'AND_ANY',
    constant: book.constant === true,
    position: positionMap[book.position] || book.position || 'after_char',
    role: roleMap[book.role] || roleMap[book.extensions?.role] || 'system',
    order: Number.isFinite(Number(book.order)) ? Number(book.order) : 100,
    depth: Math.max(0, Number(book.depth) || 0),
    probability: Math.max(0, Math.min(100, Number(book.probability ?? book.probabilityValue ?? 100))),
    scanDepth: Math.max(0, Number(rawScanDepth == null ? worldBookSettings.scanDepth : rawScanDepth)),
    caseSensitive: book.caseSensitive ?? book.case_sensitive ?? worldBookSettings.caseSensitive,
    matchWholeWords: book.matchWholeWords ?? book.match_whole_words ?? worldBookSettings.matchWholeWords,
  };
}

function keywordMatches(text, keyword, entry) {
  if (!keyword) return false;
  const sourceText = entry.caseSensitive ? text : text.toLocaleLowerCase();
  const sourceKey = entry.caseSensitive ? keyword : keyword.toLocaleLowerCase();
  if (!entry.matchWholeWords) return sourceText.includes(sourceKey);
  const escaped = sourceKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}\\p{N}_])${escaped}([^\\p{L}\\p{N}_]|$)`, 'u').test(sourceText);
}

function secondaryKeysPass(entry, scanText) {
  if (!entry.secondaryKeys.length) return true;
  const hits = entry.secondaryKeys.map((key) => keywordMatches(scanText, key, entry));
  const logicMap = { '0': 'AND_ANY', '1': 'AND_ALL', '2': 'NOT_ANY', '3': 'NOT_ALL' };
  const logic = logicMap[entry.selectiveLogic] || entry.selectiveLogic;
  if (logic === 'AND_ALL') return hits.every(Boolean);
  if (logic === 'NOT_ANY') return !hits.some(Boolean);
  if (logic === 'NOT_ALL') return !hits.every(Boolean);
  return hits.some(Boolean);
}

function collectWorldBookPlan(userText, historyMessages = activeChat?.messages || []) {
  const start = performance.now();
  const entries = activeWorldEntries().map(normalizeWorldEntry).filter((entry) => entry.enabled && entry.content);
  const role = currentRole || {};
  const maxScanDepth = Math.max(worldBookSettings.scanDepth, ...entries.map((entry) => entry.scanDepth), 0);
  const recentHistory = historyMessages.slice(-maxScanDepth).map((message) => message.text).join('\n');
  const baseScanText = joinPromptParts([
    role.description || '', role.personality || '', role.scenario || '', recentHistory, userText,
  ]);
  const activated = [];
  const activatedIds = new Set();
  let recursiveText = baseScanText;
  const maxSteps = worldBookSettings.recursive ? Math.max(1, worldBookSettings.maxRecursionSteps) : 1;

  for (let step = 0; step < maxSteps; step += 1) {
    const foundThisStep = [];
    for (const entry of entries) {
      if (activatedIds.has(entry.id)) continue;
      const scanMessages = historyMessages.slice(-entry.scanDepth).map((message) => message.text).join('\n');
      const scanText = step === 0
        ? joinPromptParts([role.description || '', role.personality || '', role.scenario || '', scanMessages, userText])
        : recursiveText;
      const primaryHits = entry.keys.filter((key) => keywordMatches(scanText, key, entry));
      const primaryPass = entry.constant || primaryHits.length > 0;
      if (!primaryPass || !secondaryKeysPass(entry, scanText)) continue;
      if (entry.probability < 100 && Math.random() * 100 >= entry.probability) continue;
      const activation = {
        ...entry,
        activationStep: step,
        matchedKeys: entry.constant ? ['常驻'] : primaryHits,
      };
      activatedIds.add(entry.id);
      activated.push(activation);
      foundThisStep.push(activation);
    }
    if (!foundThisStep.length || !worldBookSettings.recursive) break;
    recursiveText += `\n${foundThisStep.map((entry) => entry.content).join('\n')}`;
  }

  // 常驻条目优先获得预算，其余按 order 从小到大保持酒馆式插入顺序。
  const priority = [...activated].sort((a, b) => Number(b.constant) - Number(a.constant) || a.order - b.order);
  const includedIds = new Set();
  let usedChars = 0;
  for (const entry of priority) {
    if (usedChars + entry.content.length > worldBookSettings.budgetChars) continue;
    includedIds.add(entry.id);
    usedChars += entry.content.length;
  }
  const included = activated.filter((entry) => includedIds.has(entry.id)).sort((a, b) => a.order - b.order);
  const groups = {};
  for (const entry of included) {
    (groups[entry.position] ||= []).push(entry);
  }
  const ms = Math.round(performance.now() - start);
  logRuntime('info', 'worldbook', '扫描世界书', {
    enabledCount: entries.length,
    matchedCount: activated.length,
    includedCount: included.length,
    usedChars,
    budgetChars: worldBookSettings.budgetChars,
    ms,
  });
  return { groups, activated, included, usedChars, budgetChars: worldBookSettings.budgetChars, ms };
}

function tokenizeForMemorySearch(value = '') {
  const text = String(value).toLocaleLowerCase().replace(/\s+/g, ' ');
  const tokens = text.match(/[a-z0-9_]+|[\u3400-\u9fff]+/giu) || [];
  const result = [];
  tokens.forEach((token) => {
    if (/^[\u3400-\u9fff]+$/u.test(token)) {
      if (token.length === 1) result.push(token);
      for (let index = 0; index < token.length - 1; index += 1) result.push(token.slice(index, index + 2));
      for (let index = 0; index < token.length - 2; index += 1) result.push(token.slice(index, index + 3));
    } else {
      result.push(token);
    }
  });
  return result.filter((token) => token.length > 0);
}

function bm25SearchMemory(query, documents, limit = 5) {
  const queryTerms = [...new Set(tokenizeForMemorySearch(query))];
  const rows = (documents || []).map((document) => {
    const terms = tokenizeForMemorySearch(document.text);
    const frequencies = new Map();
    terms.forEach((term) => frequencies.set(term, (frequencies.get(term) || 0) + 1));
    return { document, terms, frequencies };
  }).filter((row) => row.terms.length);
  if (!queryTerms.length || !rows.length) return [];
  const averageLength = rows.reduce((sum, row) => sum + row.terms.length, 0) / rows.length;
  const k1 = 1.2;
  const b = 0.75;
  return rows.map((row) => {
    let score = 0;
    queryTerms.forEach((term) => {
      const tf = row.frequencies.get(term) || 0;
      if (!tf) return;
      const documentFrequency = rows.reduce((count, candidate) => count + (candidate.frequencies.has(term) ? 1 : 0), 0);
      const idf = Math.log(1 + ((rows.length - documentFrequency + 0.5) / (documentFrequency + 0.5)));
      score += idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (row.terms.length / averageLength))));
    });
    return { ...row.document, score };
  }).filter((item) => item.score > 0).sort((a, bValue) => bValue.score - a.score).slice(0, Math.max(1, Number(limit) || 5));
}

// ===== 面板控制（左栏抽屉 + 融合面板） =====

function toggleLeftDrawer() {
  const rc = document.querySelector("#roleColumn");
  if (!rc) return;
  const opening = !rc.classList.contains("is-open");
  rc.classList.toggle("is-open");
  // 同步遮罩层（和右侧 ••• 页面一致）
  document.querySelector("#sheetScrim")?.classList.toggle("is-open", opening);
}

function closeLeftDrawer() {
  document.querySelector("#roleColumn")?.classList.remove("is-open");
  document.querySelector("#sheetScrim")?.classList.remove("is-open");
}

function updateUserIdentityRow() {
  if (!userIdentityName) return;
  userIdentityName.textContent = userProfile.name || "用户";
  // 头像：有图显示图，无图显示占位符
  if (userIdentityAvatar && userProfile.avatar) {
    userIdentityAvatar.src = userProfile.avatar;
    userIdentityAvatar.style.display = "";
    if (avatarPlaceholder) avatarPlaceholder.style.display = "none";
  } else {
    if (userIdentityAvatar) { userIdentityAvatar.style.display = "none"; userIdentityAvatar.src = ""; }
    if (avatarPlaceholder) avatarPlaceholder.style.display = "grid";
  }
  const desc = document.querySelector("#userIdentityDesc");
  if (desc) {
    const persona = (userProfile.persona || "").replace(/\n/g, " ").trim();
    desc.textContent = persona || "点击上传头像 / 编辑身份";
  }
}

function renderContextLog() {
  if (!contextLogContent) return;
  let fullText;
  if (lastRequestPreviewMessages && lastRequestPreviewMessages.length) {
    const report = lastRequestContextReport || {};
    const request = report.request || {};
    const response = report.response || {};
    const antiRepeat = report.antiRepeat || null;
    const world = report.worldBook || { activated: [], included: [], usedChars: 0, budgetChars: 0 };
    const includedIds = new Set((world.included || []).map((entry) => entry.id));
    const requestLines = [
      `接口: ${request.endpoint || '未知'}`,
      `模型: ${request.model || '未知'}`,
      `代理: ${request.viaProxy ? '是' : '否'}`,
      `温度: ${request.temperature ?? '-'}`,
      `Top-P: ${request.top_p ?? '-'}`,
      `Top-K: ${request.top_k ?? '-'}`,
      `最大回复令牌: ${request.max_tokens ?? '-'}`,
      `重复惩罚: ${request.repetition_penalty ?? '-'}`,
      `流式: ${request.stream ? '开启' : '关闭'}`,
      `构建耗时: ${report.buildMs ?? '-'} ms`,
    ];
    const responseLines = [
      antiRepeat
        ? `重刷前：已拒绝 ${antiRepeat.rejectedAttemptCount || 0} 次，共 ${antiRepeat.uniqueRejectedCount || 0} 种不同回答`
        : '',
      antiRepeat?.direction ? `本轮方向：${antiRepeat.direction}` : '',
      response.state === 'pending'
        ? 'API：正在等待响应'
        : response.httpStatus
          ? `API：${response.ok ? '请求成功' : '请求失败'} HTTP ${response.httpStatus}`
          : `API：${response.ok ? '请求成功' : '请求失败（未收到 HTTP 状态）'}`,
      response.requestId ? `上游请求编号：${response.requestId}` : '',
      response.state === 'completed'
        ? (response.duplicate
          ? `本次返回：与候选 ${(response.duplicateCandidateNumbers || [response.duplicateCandidateNumber]).filter(Boolean).join('、')} 完全相同`
          : '本次返回：新的不同回答')
        : '',
      response.error ? `错误：${response.error}` : '',
    ].filter(Boolean);
    const worldLines = (world.activated || []).length
      ? world.activated.map((entry) => [
          `${includedIds.has(entry.id) ? '✓ 已注入' : '✗ 预算排除'}｜${entry.name}`,
          `  位置=${entry.position}${entry.position === 'at_depth' ? `:${entry.depth}` : ''} 角色=${entry.role} 顺序=${entry.order}`,
          `  触发=${entry.matchedKeys.join(', ')} 递归层=${entry.activationStep} 概率=${entry.probability}%`,
        ].join('\n')).join('\n')
      : '本轮没有世界书条目命中。';
    const memory = report.memory || {};
    const memoryComponents = memory.components || {};
    const trace = report.trace || [];
    const finalMessages = lastRequestPreviewMessages.map((message, index) => {
      const item = trace[index] || {};
      return [
        `#${index + 1} [${message.role}] 来源：${item.source || '未知'}`,
        item.detail ? `位置/说明：${item.detail}` : '',
        `字符数：${message.content.length}`,
        message.content,
      ].filter(Boolean).join('\n');
    }).join('\n\n────────────────────\n\n');
    fullText = [
      '【本轮请求总览】',
      `用户: ${userProfile.name || '用户'}　角色: ${currentRole?.name || '角色'}　预设: ${report.preset || '未启用'}`,
      `回复人设: ${report.replyPersonaLabel || '—'}${report.pollingActive ? '（多轮询中）' : ''}`,
      ...requestLines,
      '',
      '【API 请求结果】',
      ...responseLines,
      '',
      '【记忆状态】',
      `配置: ${memory.enabled ? '启用' : '关闭'} / ${memory.configuredMode || '未配置'}`,
      `实际执行: ${memory.implemented ? '已执行' : '未执行摘要/RAG'}`,
      memory.note || '',
      `当前聊天状态: ${memoryComponents.currentChatState ? '已发送' : '未发送'}`,
      `人物关系召回: ${memoryComponents.relationshipRecall || 0} 组`,
      `剧情纪要召回: ${memoryComponents.plotSummaryRecall || 0} 段`,
      `旧聊天原文召回: ${memoryComponents.chatSourceRecall || 0} 段`,
      `知识库召回: ${memoryComponents.knowledgeRecall || 0} 组/段`,
      `聊天历史: 已注入 ${report.historyIncluded ?? 0} / 可用 ${report.historyAvailable ?? 0} 条`,
      '',
      `【世界书触发】预算 ${world.usedChars || 0}/${world.budgetChars || 0} 字符，扫描 ${world.ms || 0} ms`,
      worldLines,
      '',
      '【最终发送给 AI 的 messages】',
      '以下顺序、角色和正文就是实际请求数组；每条均标明来源。',
      '',
      finalMessages,
    ].filter((line) => line !== null && line !== undefined).join('\n');
  } else {
    const recent = chatHistories.find((c) => c.id === activeChat?.id);
    const msgs = recent?.messages || [];
    fullText = [
      '【尚无实际请求】',
      '发送一条消息后，这里会显示：请求参数、记忆真实状态、世界书命中原因、提示词来源，以及最终 messages 数组。',
      '',
      '下面仅为最近 8 条聊天记录预览，并不代表完整请求：',
      '',
      ...msgs
      .slice(-8)
      .map((m) => (m.role === 'user' ? '[用户] ' : `[${m.name || '角色'}] `) + m.text.slice(0, 120)),
    ].join('\n');
  }
  contextLogContent.textContent = fullText;
  if (contextLogFullContent) contextLogFullContent.textContent = fullText;
}

const CONTEXT_LOG_LIMIT = 25;

function estimateContextTokens(text = '') {
  const value = String(text);
  const cjk = (value.match(/[\u3400-\u9fff\uf900-\ufaff]/g) || []).length;
  return Math.max(1, Math.ceil(cjk / 1.5 + (value.length - cjk) / 4));
}

function contextSourceKind(source = '') {
  if (source.includes('世界书')) return { key: 'worldbook', label: '世界书' };
  if (source.includes('聊天') || source.includes('用户输入')) return { key: 'history', label: '聊天历史' };
  if (source.includes('记忆')) return { key: 'memory', label: '长记忆' };
  if (source.includes('角色') || source.includes('人设') || source.includes('场景')) return { key: 'character', label: '角色卡' };
  return { key: 'preset', label: '预设' };
}

function recordContextRequest(chat, userText, api, model, chatMessages, requestBody, report = {}) {
  if (!chat) return null;
  const trace = Array.isArray(report?.trace) ? report.trace : [];
  const snippets = chatMessages.map((message, index) => {
    const traceItem = trace[index] || {};
    const source = traceItem.source || (message.role === 'user' ? '聊天历史' : '预设');
    return {
      role: message.role,
      source,
      detail: traceItem.detail || '',
      sourceKind: contextSourceKind(source).key,
      content: String(message.content || ''),
      tokens: estimateContextTokens(message.content),
    };
  });
  const worldBookNames = (report?.worldBook?.included || []).map((entry) => entry.name).filter(Boolean);
  const regexNames = regexRules.filter((rule) => rule.enabled).map((rule) => rule.name).filter(Boolean);
  const log = {
    id: globalThis.crypto?.randomUUID?.() || `context-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    replyTargetText: String(userText || ''),
    model,
    apiName: api.name || api.provider || 'OpenAI 兼容接口',
    apiProvider: api.provider || 'openai-compatible',
    endpoint: report?.request?.endpoint || `${String(api.url || '').replace(/\/+$/, '')}/chat/completions`,
    viaProxy: report?.request?.viaProxy === true,
    estimatedTokens: snippets.reduce((sum, item) => sum + item.tokens, 0),
    presetName: report?.preset || '',
    promptOrderApplied: report?.promptOrderApplied === true,
    worldBookNames,
    regexNames,
    parameters: Object.fromEntries(Object.entries(requestBody || {}).filter(([key]) => key !== 'messages')),
    generationType: report?.generationType || 'normal',
    antiRepeat: report?.antiRepeat ? { ...report.antiRepeat } : null,
    response: report?.response ? { ...report.response } : { state: 'pending', ok: null, httpStatus: null },
    snippets,
  };
  if (!Array.isArray(chat.contextLogs)) chat.contextLogs = [];
  chat.contextLogs.unshift(log);
  if (chat.contextLogs.length > CONTEXT_LOG_LIMIT) chat.contextLogs.length = CONTEXT_LOG_LIMIT;
  saveChatHistoriesToCache();
  return log;
}

function formatContextLogTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function contextLogOutcomeLabel(log) {
  const response = log?.response;
  if (!response) return '旧日志';
  if (response.state === 'pending') return '等待响应';
  if (response.state === 'completed') {
    return response.duplicate
      ? `成功 ${response.httpStatus || 200} · 撞候选 ${(response.duplicateCandidateNumbers || [response.duplicateCandidateNumber]).filter(Boolean).join('、')}`
      : `成功 ${response.httpStatus || 200} · 新回答`;
  }
  return response.httpStatus ? `失败 ${response.httpStatus}` : '请求失败';
}

const transientActionMenus = new Map();

function rectFromAnchor(anchor) {
  if (!anchor) return null;
  if (typeof anchor.getBoundingClientRect === 'function') return anchor.getBoundingClientRect();
  const left = Number(anchor.left) || 0;
  const top = Number(anchor.top) || 0;
  const right = Number(anchor.right ?? left);
  const bottom = Number(anchor.bottom ?? top);
  return {
    left,
    top,
    right,
    bottom,
    width: Number(anchor.width ?? right - left) || 0,
    height: Number(anchor.height ?? bottom - top) || 0,
  };
}

function pointTransientAnchor(clientX, clientY) {
  const x = Number(clientX) || 0;
  const y = Number(clientY) || 0;
  return { left: x, right: x, top: y, bottom: y, width: 0, height: 0 };
}

function transientActionMenuBoundary(owner) {
  const shellRect = phoneShell?.getBoundingClientRect?.() || {};
  const viewport = window.visualViewport;
  const viewportLeft = viewport?.offsetLeft || 0;
  const viewportTop = viewport?.offsetTop || 0;
  const viewportRight = viewportLeft + (viewport?.width || window.innerWidth);
  const viewportBottom = viewportTop + (viewport?.height || window.innerHeight);
  const ownerRect = owner?.getBoundingClientRect?.();
  return {
    left: Math.max(viewportLeft, shellRect.left ?? 0, ownerRect?.left ?? -Infinity),
    top: Math.max(viewportTop, shellRect.top ?? 0, ownerRect?.top ?? -Infinity),
    right: Math.min(viewportRight, shellRect.right ?? window.innerWidth, ownerRect?.right ?? Infinity),
    bottom: Math.min(viewportBottom, shellRect.bottom ?? window.innerHeight, ownerRect?.bottom ?? Infinity),
  };
}

function computeTransientActionMenuPosition(anchorRect, menuSize = {}, boundaryRect = {}, options = {}) {
  const padding = Number(options.padding ?? 8);
  const gap = Number(options.gap ?? 6);
  const minWidth = Number(options.minWidth ?? 120);
  const boundaryLeft = Number(boundaryRect.left ?? 0) + padding;
  const boundaryTop = Number(boundaryRect.top ?? 0) + padding;
  const boundaryRight = Number(boundaryRect.right ?? window.innerWidth) - padding;
  const boundaryBottom = Number(boundaryRect.bottom ?? window.innerHeight) - padding;
  const boundaryWidth = Math.max(minWidth, boundaryRight - boundaryLeft);
  const rawWidth = Number(menuSize.width) || Number(options.width) || 176;
  const rawHeight = Number(menuSize.height) || Number(options.height) || 160;
  const width = Math.min(Math.max(minWidth, rawWidth), boundaryWidth);
  const anchorLeft = Number(anchorRect.left) || 0;
  const anchorRight = Number(anchorRect.right ?? anchorLeft) || anchorLeft;
  const anchorTop = Number(anchorRect.top) || 0;
  const anchorBottom = Number(anchorRect.bottom ?? anchorTop) || anchorTop;
  const anchorCenterX = anchorLeft + Math.max(0, anchorRight - anchorLeft) / 2;
  const anchorCenterY = anchorTop + Math.max(0, anchorBottom - anchorTop) / 2;
  const boundaryCenterY = boundaryTop + Math.max(0, boundaryBottom - boundaryTop) / 2;
  const belowSpace = Math.max(0, boundaryBottom - anchorBottom - gap);
  const aboveSpace = Math.max(0, anchorTop - boundaryTop - gap);
  const preferredPlacement = anchorCenterY <= boundaryCenterY ? 'bottom' : 'top';
  let placement = preferredPlacement;
  const minimumVisibleHeight = Math.min(48, rawHeight);
  if (placement === 'bottom' && belowSpace < minimumVisibleHeight && aboveSpace > belowSpace) placement = 'top';
  if (placement === 'top' && aboveSpace < minimumVisibleHeight && belowSpace > aboveSpace) placement = 'bottom';
  const availableHeight = Math.max(48, placement === 'bottom' ? belowSpace : aboveSpace);
  const height = Math.min(rawHeight, availableHeight);
  let left = options.align === 'center'
    ? anchorCenterX - width / 2
    : anchorRight - width;
  left = Math.min(Math.max(left, boundaryLeft), boundaryRight - width);
  const top = placement === 'bottom'
    ? Math.min(anchorBottom + gap, boundaryBottom - height)
    : Math.max(anchorTop - gap - height, boundaryTop);
  return {
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(width),
    height: Math.round(height),
    maxHeight: Math.round(availableHeight),
    placement,
  };
}

function positionActionMenu(menu, anchor, options = {}) {
  if (!menu || !anchor) return null;
  const anchorRect = rectFromAnchor(anchor);
  if (!anchorRect) return null;
  const boundary = transientActionMenuBoundary(options.owner);
  const position = computeTransientActionMenuPosition(
    anchorRect,
    { width: menu.offsetWidth || options.width, height: menu.offsetHeight || options.height },
    boundary,
    options,
  );
  menu.style.left = `${position.left}px`;
  menu.style.top = `${position.top}px`;
  menu.style.right = 'auto';
  menu.style.bottom = 'auto';
  menu.style.width = `${position.width}px`;
  menu.style.maxHeight = `${position.maxHeight}px`;
  menu.dataset.placement = position.placement;
  return position;
}

function positionActionMenuBelow(menu, anchor, options = {}) {
  return positionActionMenu(menu, anchor, options);
}

function unregisterTransientActionMenu(id) {
  if (!id) return;
  const entry = transientActionMenus.get(id);
  entry?.menu?.removeAttribute?.('data-transient-action-menu');
  transientActionMenus.delete(id);
}

function registerTransientActionMenu(id, { menu, anchor, owner, close, align = 'end', width, height } = {}) {
  if (!id || !menu) return;
  transientActionMenus.set(id, { menu, anchor, owner, close, align, width, height });
  menu.dataset.transientActionMenu = id;
  if (anchor?.setAttribute) anchor.setAttribute('aria-expanded', 'true');
  positionActionMenu(menu, anchor, { owner, align, width, height });
}

function transientOwnerMatches(entryOwner, owner) {
  if (!owner) return true;
  if (!entryOwner) return true;
  return entryOwner === owner || owner.contains?.(entryOwner) || entryOwner.contains?.(owner);
}

function closeTransientActionMenus({ owner, exceptId } = {}) {
  [...transientActionMenus.entries()].forEach(([id, entry]) => {
    if (id === exceptId) return;
    if (!transientOwnerMatches(entry.owner, owner)) return;
    if (typeof entry.close === 'function') entry.close();
    else unregisterTransientActionMenu(id);
  });
}

// 通用临时菜单：动态创建一列多行的浮动菜单，点外部/滚动/换页自动关闭。items: [{label, danger?, onClick}]
function openTransientMenu(id, anchor, owner, items, { width = 150 } = {}) {
  if (!anchor || !Array.isArray(items) || !items.length) return;
  closeTransientActionMenus();
  const menu = document.createElement('div');
  menu.className = 'st-transient-menu';
  menu.setAttribute('aria-hidden', 'true');
  menu.innerHTML = items.map((item, index) => `<button type="button" data-menu-item="${index}" class="${item.danger ? 'is-danger' : ''}">${escapeHtml(item.label)}</button>`).join('');
  document.body.appendChild(menu);
  const close = () => {
    menu.remove();
    unregisterTransientActionMenu(id);
  };
  menu.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
    const item = items[Number(button.dataset.menuItem)];
    close();
    item?.onClick?.();
  }));
  menu.style.visibility = 'hidden';
  menu.classList.add('is-open');
  menu.setAttribute('aria-hidden', 'false');
  registerTransientActionMenu(id, { menu, anchor, owner, close, width });
  menu.style.visibility = '';
}

function isInsideTransientActionMenu(target) {
  if (!target) return false;
  return [...transientActionMenus.values()].some((entry) => (
    entry.menu?.contains?.(target) || entry.anchor?.contains?.(target)
  ));
}

document.addEventListener('pointerdown', (event) => {
  if (!transientActionMenus.size || isInsideTransientActionMenu(event.target)) return;
  closeTransientActionMenus();
}, true);

window.addEventListener('scroll', (event) => {
  if (!transientActionMenus.size) return;
  if (isInsideTransientActionMenu(event.target)) return;
  closeTransientActionMenus();
}, true);

window.addEventListener('resize', () => closeTransientActionMenus(), { passive: true });
window.visualViewport?.addEventListener('resize', () => closeTransientActionMenus(), { passive: true });

function closeContextLogActionMenu() {
  contextLogActionMenu?.classList.remove('is-open');
  contextLogActionMenu?.setAttribute('aria-hidden', 'true');
  contextLogFullContent?.querySelectorAll('.context-log-more').forEach((button) => button.setAttribute('aria-expanded', 'false'));
  contextLogActionAnchor = null;
  selectedContextLog = null;
  unregisterTransientActionMenu('context-log-action');
}

function openContextLogActionMenu(log, anchor) {
  const isSameOpen = selectedContextLog?.id === log.id && contextLogActionMenu?.classList.contains('is-open');
  if (isSameOpen) {
    closeContextLogActionMenu();
    return;
  }
  closeTransientActionMenus();
  selectedContextLog = log;
  contextLogActionAnchor = anchor;
  contextLogFullContent?.querySelectorAll('.context-log-more').forEach((button) => button.setAttribute('aria-expanded', 'false'));
  anchor?.setAttribute('aria-expanded', 'true');
  contextLogActionMenu.style.visibility = 'hidden';
  contextLogActionMenu?.classList.add('is-open');
  contextLogActionMenu?.setAttribute('aria-hidden', 'false');
  registerTransientActionMenu('context-log-action', {
    menu: contextLogActionMenu,
    anchor,
    owner: contextLogPage,
    close: closeContextLogActionMenu,
  });
  contextLogActionMenu.style.visibility = '';
}

function restoreContextLogListScroll() {
  requestAnimationFrame(() => {
    if (contextLogView !== 'list' || !contextLogFullContent) return;
    contextLogFullContent.scrollTop = Math.max(0, contextLogListScrollTop);
  });
}

function renderContextLogList({ restoreScroll = true } = {}) {
  contextLogView = 'list';
  closeContextLogActionMenu();
  if (contextLogPageTitle) contextLogPageTitle.textContent = '上下文聊天日志';
  if (!restoreScroll) contextLogListScrollTop = 0;
  const logs = Array.isArray(contextLogChat?.contextLogs) ? contextLogChat.contextLogs : [];
  if (!logs.length) {
    contextLogFullContent.innerHTML = '<div class="context-log-empty">这个聊天框还没有请求日志。<br>下一次发送或重刷 AI 回复后，会在这里留下记录。</div>';
    restoreContextLogListScroll();
    return;
  }
  contextLogFullContent.innerHTML = `<div class="context-log-list">${logs.map((log) => `
    <article class="context-log-list-item" data-log-id="${escapeHtml(log.id)}">
      <button type="button" class="context-log-open" data-log-id="${escapeHtml(log.id)}">
        <b>${escapeHtml(log.replyTargetText || '（空白消息）')}</b>
        <time>${escapeHtml(formatContextLogTime(log.createdAt))} · ${escapeHtml(log.model || '未知模型')} · ${escapeHtml(contextLogOutcomeLabel(log))} · 输入上下文约 ${Number(log.estimatedTokens) || 0} tokens</time>
      </button>
      <button type="button" class="context-log-more" data-log-id="${escapeHtml(log.id)}" aria-label="更多操作" aria-expanded="false">⋮</button>
    </article>`).join('')}</div>`;
  contextLogFullContent.querySelectorAll('.context-log-open').forEach((button) => {
    button.addEventListener('click', () => {
      const log = logs.find((item) => item.id === button.dataset.logId);
      if (log) {
        contextLogListScrollTop = contextLogFullContent.scrollTop;
        renderContextLogDetail(log);
      }
    });
  });
  contextLogFullContent.querySelectorAll('.context-log-more').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const log = logs.find((item) => item.id === button.dataset.logId);
      if (log) openContextLogActionMenu(log, button);
    });
  });
  restoreContextLogListScroll();
}

function renderContextLogDetail(log) {
  contextLogView = 'detail';
  closeContextLogActionMenu();
  if (contextLogPageTitle) contextLogPageTitle.textContent = '本轮完整上下文';
  const snippets = Array.isArray(log.snippets) ? log.snippets : [];
  const hasRecordedResponse = !!log.response;
  const response = log.response || {};
  const antiRepeat = log.antiRepeat || null;
  const responseStatus = !hasRecordedResponse
    ? '旧日志未记录 API 响应结果'
    : response.state === 'pending'
    ? '正在等待响应'
    : response.httpStatus
      ? `${response.ok ? '请求成功' : '请求失败'} HTTP ${response.httpStatus}`
      : (response.ok ? '请求成功' : '请求失败（未收到 HTTP 状态）');
  const duplicateStatus = response.state === 'completed'
    ? (response.duplicate ? `本次返回与候选 ${(response.duplicateCandidateNumbers || [response.duplicateCandidateNumber]).filter(Boolean).join('、')} 完全相同` : '本次返回是新的不同回答')
    : '';
  contextLogFullContent.innerHTML = `
    <section class="context-log-summary">
      <b class="context-log-model">${escapeHtml(log.apiName || 'OpenAI 兼容接口')}</b>
      <span>${escapeHtml(log.model || '未知模型')}</span>
      <div class="context-log-meta"><span>${escapeHtml(formatContextLogTime(log.createdAt))}</span><span>输入上下文约 ${Number(log.estimatedTokens) || 0} tokens</span></div>
      <div class="context-log-flags">
        <span>🌐 世界书 ${log.worldBookNames?.length ? `✓ ${escapeHtml(log.worldBookNames.join('、'))}` : '未使用'}</span>
        <span>⌁ 预设 ${log.presetName ? `✓ ${escapeHtml(log.presetName)}` : '未使用'}${log.promptOrderApplied ? ' · prompt_order' : ''}</span>
        <span>⎇ 响应正则 ${log.regexNames?.length ? `✓ ${escapeHtml(log.regexNames.join('、'))}` : '未使用'}</span>
      </div>
    </section>
    <section class="context-log-summary">
      <b>API 请求结果</b>
      ${antiRepeat ? `<span>重刷前已拒绝 ${Number(antiRepeat.rejectedAttemptCount) || 0} 次，共 ${Number(antiRepeat.uniqueRejectedCount) || 0} 种不同回答</span>` : ''}
      ${antiRepeat?.direction ? `<span>本轮方向：${escapeHtml(antiRepeat.direction)}</span>` : ''}
      <div class="context-log-meta"><span>${escapeHtml(responseStatus)}</span>${response.requestId ? `<span>请求编号：${escapeHtml(response.requestId)}</span>` : ''}</div>
      ${duplicateStatus ? `<span>${escapeHtml(duplicateStatus)}</span>` : ''}
      ${response.error ? `<span>${escapeHtml(response.error)}</span>` : ''}
    </section>
    <p class="context-log-endpoint">${escapeHtml(log.endpoint || '')}</p>
    <div class="context-log-snippets">${snippets.map((item) => {
      const kind = contextSourceKind(item.source);
      return `<article class="context-log-snippet" data-source="${escapeHtml(item.sourceKind || kind.key)}">
        <div class="context-log-source">${escapeHtml(kind.label)}</div>
        <p>${escapeHtml(item.content || '')}</p>
        <footer><span>${escapeHtml(item.role || 'system')} · ${escapeHtml(item.source || kind.label)}${item.detail ? ` · ${escapeHtml(item.detail)}` : ''}</span><span>${Number(item.tokens) || 0} tokens</span></footer>
      </article>`;
    }).join('')}</div>`;
  contextLogFullContent.scrollTop = 0;
}

function openSelectedChatContextLogs() {
  const chat = selectedHistory || activeChat;
  if (!chat) return;
  contextLogChat = chat;
  contextLogListScrollTop = 0;
  closeChatActionMenu();
  renderContextLogList({ restoreScroll: false });
  contextLogPage?.classList.add('is-open');
  contextLogPage?.setAttribute('aria-hidden', 'false');
}

function exportSelectedContextLog() {
  if (!selectedContextLog) return;
  const target = selectedContextLog;
  const stamp = new Date(target.createdAt).toISOString().replace(/[:.]/g, '-').slice(0, 16);
  exportJsonFile(`上下文日志-${stamp}.json`, target);
  closeContextLogActionMenu();
  showToast('这一条上下文日志已导出');
}

function deleteSelectedContextLog() {
  if (!selectedContextLog || !contextLogChat) return;
  if (!confirm('确定删除这一条上下文日志？删除后无法恢复。')) return;
  const index = (contextLogChat.contextLogs || []).findIndex((log) => log.id === selectedContextLog.id);
  if (index >= 0) contextLogChat.contextLogs.splice(index, 1);
  closeContextLogActionMenu();
  renderContextLogList();
  saveChatHistoriesToCache();
  showToast('这一条上下文日志已删除');
}

function toggleSection(panelEl) {
  if (!panelEl) return;
  const toggleBtn = panelEl.querySelector(".sp-toggle") || panelEl.querySelector(".panel-section-toggle");
  const body = panelEl.querySelector(".sp-body") || panelEl.querySelector(".panel-section-body");
  const isOpen = toggleBtn?.classList.toggle("is-open");
  toggleBtn?.setAttribute("aria-expanded", String(isOpen));
  if (body) body.style.display = isOpen ? "" : "none";
}

function renderPanelHistory() {
  // 已融合进 chatStorePage 的角色历史区域，此函数保留为兼容空操作
}

let toastHideTimer = null;

function showToast(text) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    chatScreen.append(toast);
  }
  const message = String(text ?? '');
  toast.textContent = message;
  toast.classList.add('is-open');
  if (toastHideTimer) window.clearTimeout(toastHideTimer);
  // 短提示至少停留 4 秒；长 API 错误按内容自动延长，最长 9 秒，方便看清和截图。
  const displayMs = Math.max(4000, Math.min(9000, 3000 + message.length * 28));
  toastHideTimer = window.setTimeout(() => {
    toast.classList.remove('is-open');
    toastHideTimer = null;
  }, displayMs);
}

function setBackground(role) {
  const value = `url("${role.background}")`;
  backgroundLayer.style.backgroundImage = value;
  // 模糊层不再复制背景图；它是透明层，直接模糊下方已经合成好的背景＋暗层。
  scrollBlur.style.backgroundImage = 'none';
  storeBackground.style.backgroundImage = value;
}

function decodeCharacterCardFromPng(buffer) {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  let offset = 8;
  while (offset + 12 <= bytes.length) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(...bytes.slice(offset + 4, offset + 8));
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (dataEnd + 4 > bytes.length) break;
    if (type === 'tEXt') {
      const data = bytes.slice(dataStart, dataEnd);
      const zero = data.indexOf(0);
      const key = zero >= 0 ? new TextDecoder().decode(data.slice(0, zero)) : '';
      if (key === 'chara' || key === 'ccv3') {
        const encoded = new TextDecoder().decode(data.slice(zero + 1));
        const decoded = Uint8Array.from(atob(encoded), (char) => char.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(decoded));
      }
    }
    offset = dataEnd + 4;
  }
  throw new Error('未找到角色卡数据');
}

function applyCharacterCard(role, card) {
  const source = card.data || card;
  role.description = source.description || role.description;
  role.personality = source.personality || role.personality;
  role.scenario = source.scenario || role.scenario;
  role.greeting = source.first_mes || role.greeting;
  role.example = source.mes_example || role.example;
  role.note = source.creator_notes || source.creatorcomment || role.note;
  role.tags = source.tags || role.tags;
}

async function loadDefaultCharacterCards() {
  await Promise.all(roles.filter((role) => role.cardFile).map(async (role) => {
    try {
      const response = await fetch(role.cardFile);
      if (!response.ok) throw new Error(`读取失败：${response.status}`);
      applyCharacterCard(role, decodeCharacterCardFromPng(await response.arrayBuffer()));
    } catch (error) {
      console.warn(`无法载入${role.name}的人设卡`, error);
    }
  }));
  roles.forEach(ensurePersonaVersions);
  setRole(currentRole);
}

function roleByName(name) {
  const fixedName = recoverMojibake(name || '');
  return roles.find((role) => {
    const displayName = roleDisplayName(role);
    return role.name === fixedName || displayName === fixedName || fixedName.includes(role.name) || fixedName.includes(displayName);
  });
}

function getChatLastActiveAt(chat) {
  const activityTs = Date.parse(chat?.lastActiveAt || '');
  if (!Number.isNaN(activityTs)) return activityTs;
  if (chat && Array.isArray(chat.messages) && chat.messages.length) {
    for (let i = chat.messages.length - 1; i >= 0; i -= 1) {
      const ts = Date.parse(chat.messages[i]?.sendDate || '');
      if (!Number.isNaN(ts)) return ts;
    }
  }
  const ts = Date.parse(chat?.createdAt || '');
  return Number.isNaN(ts) ? 0 : ts;
}

function historiesForRole(role = currentRole) {
  return chatHistories
    .filter((chat) => chat.roleId === role.id)
    .slice()
    .sort((a, b) => {
      if (a.id === activeChat?.id) return -1;
      if (b.id === activeChat?.id) return 1;
      return getChatLastActiveAt(b) - getChatLastActiveAt(a);
    });
}

function makeChatForRole(role, title = `${role.name} 新对话`) {
  return {
    id: `fresh-${role.id}-${Date.now()}`,
    roleId: role.id,
    title,
    userName: userProfile.name || '用户',
    characterName: role.name,
    source: 'role-chat',
    lastActiveAt: new Date().toISOString(),
    messages: role.greeting ? [
      {
        role: 'bot',
        name: role.name,
        text: role.greeting,
        sendDate: new Date().toISOString(),
        isGreeting: true,
      },
    ] : [],
  };
}

function ensureActiveChatForRole(role = currentRole) {
  const existing = activeChatsByRole[role.id];
  if (existing && chatHistories.some((chat) => chat.id === existing.id)) {
    return existing;
  }
  const first = historiesForRole(role)[0];
  if (first) {
    activeChatsByRole[role.id] = first;
    return first;
  }
  const fresh = makeChatForRole(role);
  chatHistories.unshift(fresh);
  activeChatsByRole[role.id] = fresh;
  return fresh;
}

function setRole(role) {
  ensurePersonaVersions(role);
  currentRole = role;
  const displayName = roleDisplayName(role);
  currentRoleName.textContent = displayName;
  storeRoleName.textContent = displayName;
  headerAvatar.src = role.avatar;
  heroGreeting.textContent = role.greeting || '';
  storeRoleIntro.textContent = activePersona(role).intro || role.intro || role.description;
  refreshChatStoreApiSummary();
  setBackground(role);
  renderRoles();
  activeChat = ensureActiveChatForRole(role);
  renderHistory();
  renderActivePersona();
  renderAdvancedQuickSettings();
  // 渲染对话消息（含开场白作为首条）
  loadChatHistory(activeChat);
  saveRolesToCache();
}

function refreshChatStoreApiSummary() {
  const api = effectiveApi(currentRole);
  const storeApiName = document.querySelector('#storeApiName');
  if (!storeApiName) return;
  storeApiName.textContent = api
    ? `当前：${api.name || '未命名 API'} · ${api.model || '未选模型'}`
    : '当前：未配置';
}

function renderRoles() {
  const previousScrollTop = roleList.scrollTop;
  roleList.innerHTML = '';
  roles.forEach((role) => {
    ensurePersonaVersions(role);
    const displayName = roleDisplayName(role);
    const entry = document.createElement('div');
    entry.className = 'role-entry';
    const card = document.createElement('div');
    card.className = `role-card${role.id === currentRole.id ? ' is-active' : ''}`;
    card.innerHTML = `
      <button class="role-avatar-button${expandedRoleId === role.id ? ' is-expanded' : ''}" type="button" aria-label="${expandedRoleId === role.id ? '收起' : '展开'}${escapeHtml(displayName)}人设版本" aria-expanded="${expandedRoleId === role.id}">
        <img src="${role.avatar}" alt="">
      </button>
      <div class="role-name-block">
        <strong>${escapeHtml(displayName)}</strong>
        <span>${role.subtitle || ''}</span>
      </div>
      <button class="role-edit-button" type="button">人设</button>
    `;

    const enterRoleChat = () => {
      setRole(role);
      showToast(`已切换到${displayName}上次聊天`);
    };
    card.addEventListener('click', enterRoleChat);
    card.querySelector('.role-avatar-button').addEventListener('click', (event) => {
      event.stopPropagation();
      expandedRoleId = expandedRoleId === role.id ? null : role.id;
      renderRoles();
    });
    card.querySelector('.role-edit-button').addEventListener('click', (event) => {
      event.stopPropagation();
      openEditor(role);
    });
    entry.append(card);

    if (expandedRoleId === role.id) {
      const versionList = document.createElement('div');
      versionList.className = 'role-persona-list';
      versionList.setAttribute('aria-label', `${displayName}人设版本`);
      role.personaVersions.forEach((persona) => {
        const versionButton = document.createElement('button');
        versionButton.type = 'button';
        versionButton.className = `role-persona-version${persona.id === role.activePersonaId ? ' is-active' : ''}`;
        versionButton.textContent = persona.label || `${role.name} 人设`;
        versionButton.addEventListener('click', (event) => {
          event.stopPropagation();
          applyPersona(role, persona);
          setRole(role);
          showToast(`已使用人设：${persona.label || role.name}`);
        });
        versionList.append(versionButton);
      });
      entry.append(versionList);
    }
    roleList.append(entry);
  });
  roleList.scrollTop = previousScrollTop;
}

function chatSearchSnippet(text, query, radius = 52) {
  const source = String(text || '').replace(/\s+/g, ' ').trim();
  const lower = source.toLocaleLowerCase();
  const needle = query.toLocaleLowerCase();
  const index = lower.indexOf(needle);
  if (index < 0) return escapeHtml(source.slice(0, radius * 2));
  const start = Math.max(0, index - radius);
  const end = Math.min(source.length, index + query.length + radius);
  const prefix = `${start ? '…' : ''}${source.slice(start, index)}`;
  const match = source.slice(index, index + query.length);
  const suffix = `${source.slice(index + query.length, end)}${end < source.length ? '…' : ''}`;
  return `${escapeHtml(prefix)}<mark>${escapeHtml(match)}</mark>${escapeHtml(suffix)}`;
}

function findChatMessageMatches(query, limit = 120) {
  const needle = String(query || '').trim().toLocaleLowerCase();
  if (!needle) return [];
  const matches = [];
  for (const chat of chatHistories) {
    const role = roles.find((item) => item.id === chat.roleId);
    for (let index = chat.messages.length - 1; index >= 0; index -= 1) {
      const message = chat.messages[index];
      if (!String(message?.text || '').toLocaleLowerCase().includes(needle)) continue;
      matches.push({ chat, role, message, index });
      if (matches.length >= limit) return matches;
    }
  }
  return matches;
}

function renderRoleChatSearchResults() {
  if (!roleChatSearch || !roleSearchResults) return;
  const query = roleChatSearch.value.trim();
  if (!query) {
    roleSearchResults.hidden = true;
    roleList.hidden = false;
    roleSearchResults.innerHTML = '';
    return;
  }
  const matches = findChatMessageMatches(query);
  roleList.hidden = true;
  roleSearchResults.hidden = false;
  if (!matches.length) {
    roleSearchResults.innerHTML = '<p class="role-search-empty">没有找到包含这段文字的聊天消息</p>';
    return;
  }
  roleSearchResults.innerHTML = '';
  matches.forEach(({ chat, role, message, index }) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'role-search-result';
    const speaker = message.role === 'user' ? (chat.userName || userProfile.name || '用户') : (message.name || chat.characterName || role?.name || '角色');
    button.innerHTML = `<span class="role-search-result-head"><b>${escapeHtml(roleDisplayName(role || currentRole))} · ${escapeHtml(chat.title)}</b><small>第 ${index + 1} 条 · ${escapeHtml(speaker)}</small></span><p>${chatSearchSnippet(message.text, query)}</p>`;
    button.addEventListener('click', () => jumpToChatMessageMatch(chat, role, index));
    roleSearchResults.append(button);
  });
  if (matches.length >= 120) roleSearchResults.insertAdjacentHTML('beforeend', '<p class="role-search-empty">仅显示最近找到的 120 条，请输入更具体的关键词</p>');
}

function focusRenderedChatMessage(index) {
  while (index < renderedChatStartIndex) loadEarlierChatMessages();
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const target = messages.querySelector(`.message[data-index="${index}"]`);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.remove('is-search-target');
    void target.offsetWidth;
    target.classList.add('is-search-target');
    window.setTimeout(() => target.classList.remove('is-search-target'), 2800);
  }));
}

function jumpToChatMessageMatch(chat, role, messageIndex) {
  if (!chat) return;
  if (role && role.id !== currentRole.id) setRole(role);
  loadChatHistory(chat, { silent: true });
  closeLeftDrawer();
  focusRenderedChatMessage(messageIndex);
  showToast(`已定位到“${chat.title}”第 ${messageIndex + 1} 条消息`);
}

let roleChatSearchFrame = 0;
roleChatSearch?.addEventListener('input', () => {
  cancelAnimationFrame(roleChatSearchFrame);
  roleChatSearchFrame = requestAnimationFrame(renderRoleChatSearchResults);
});
roleChatSearch?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    roleChatSearch.value = '';
    renderRoleChatSearchResults();
    roleChatSearch.blur();
  } else if (event.key === 'Enter') {
    event.preventDefault();
    roleSearchResults?.querySelector('.role-search-result')?.click();
  }
});

function renderHistory() {
  historyList.innerHTML = '';
  historiesForRole().forEach((chat) => {
    const row = document.createElement('div');
    row.className = `history-row${chat.id === activeChat.id ? ' is-active' : ''}`;
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `history-item${chat.id === activeChat.id ? ' is-active' : ''}`;
    item.textContent = chat.title;
    item.addEventListener('click', () => loadChatHistory(chat));
    item.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
    const moreButton = document.createElement('button');
    moreButton.type = 'button';
    moreButton.className = 'history-more-button';
    moreButton.textContent = '⋮';
    moreButton.title = `管理“${chat.title}”`;
    moreButton.setAttribute('aria-label', `${chat.title} 更多操作`);
    moreButton.setAttribute('aria-expanded', 'false');
    moreButton.addEventListener('click', (event) => {
      event.stopPropagation();
      openChatActionMenu(chat, moreButton);
    });
    const saveOptionsLabel = document.createElement('label');
    saveOptionsLabel.className = 'history-save-options';
    saveOptionsLabel.title = '保存所有 AI 重刷回复，并在导出聊天时一并保存';
    saveOptionsLabel.innerHTML = `
      <input type="checkbox" ${chat.saveAllOptions !== false ? 'checked' : ''} aria-label="${escapeHtml(chat.title)} 保存所有选项">
      <i aria-hidden="true"></i>
    `;
    const saveOptionsInput = saveOptionsLabel.querySelector('input');
    saveOptionsInput.addEventListener('click', (event) => event.stopPropagation());
    saveOptionsInput.addEventListener('change', (event) => {
      event.stopPropagation();
      setChatSaveAllOptions(chat, saveOptionsInput.checked);
    });
    const memoryButton = document.createElement('button');
    memoryButton.type = 'button';
    memoryButton.className = 'history-memory-button';
    memoryButton.textContent = '长记忆';
    memoryButton.title = `查看“${chat.title}”的独立剧情记忆`;
    memoryButton.addEventListener('click', (event) => {
      event.stopPropagation();
      openHistoryMemoryFromShortcut(chat, memoryButton);
    });
    row.append(item, moreButton, memoryButton, saveOptionsLabel);
    historyList.append(row);
  });
}

function reportHistoryMemoryOpenError(error, chat) {
  const message = String(error?.message || error || '未知错误');
  logRuntime('error', 'memory', '长记忆页面打开失败', { chatId: chat?.id || '', message });
  showToast(`长记忆打开失败：${message}`);
}

function openHistoryMemoryFromShortcut(chat, button, options = {}) {
  if (!chat || !button || button.disabled) return;
  const originalLabel = button.textContent || '长记忆';
  const schedule = options.schedule || ((run) => requestAnimationFrame(() => requestAnimationFrame(run)));
  const open = options.open || openChatMemoryDetail;
  const reportError = options.reportError || reportHistoryMemoryOpenError;
  closeChatActionMenu();
  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  button.textContent = '正在打开…';
  const run = () => {
    try {
      open(chat);
    } catch (error) {
      reportError(error, chat);
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.textContent = originalLabel;
    }
  };
  try {
    schedule(run);
  } catch (error) {
    run();
  }
}

function setChatSaveAllOptions(chat, enabled) {
  chat.saveAllOptions = enabled === true;
  if (chat.id === activeChat?.id) {
    messages.querySelectorAll('.message.bot[data-index]').forEach((item) => {
      const index = Number(item.dataset.index);
      const entry = chat.messages[index];
      if (!entry || entry.role !== 'bot') return;
      const currentText = item.querySelector('p')?.textContent || entry.text || '';
      if (enabled) {
        const variants = Array.isArray(item.replyVariants) && item.replyVariants.length
          ? [...item.replyVariants]
          : [currentText];
        const selectedIndex = Math.max(0, Math.min(Number(item.replyVariantIndex) || 0, variants.length - 1));
        entry.text = variants[selectedIndex] ?? currentText;
        entry.replyVariants = variants;
        entry.replyVariantIndex = selectedIndex;
      } else {
        entry.text = currentText;
        // 关闭只影响之后的导出方式；已经保存的候选留在聊天中，重新开启即可继续使用。
        // 导出函数会在关闭状态下仅写出 entry.text（当前选项）。
      }
    });
  }
  renderHistory();
  saveChatHistoriesToCache();
  showToast(enabled ? '已开启：导出时会保存全部 AI 回复选项' : '已关闭：导出时只保存当前选项');
}

function clearLongPress() {
  if (longPressTimer) {
    window.clearTimeout(longPressTimer);
    longPressTimer = null;
  }
}

function openChatActionMenu(chat, anchor) {
  const isSameOpen = selectedHistory?.id === chat.id && chatActionMenu.classList.contains('is-open');
  if (isSameOpen) {
    closeChatActionMenu();
    return;
  }
  closeTransientActionMenus();
  selectedHistory = chat;
  chatActionMenuAnchor = anchor;
  historyList.querySelectorAll('.history-more-button').forEach((button) => button.setAttribute('aria-expanded', 'false'));
  anchor?.setAttribute('aria-expanded', 'true');
  chatActionMenu.style.visibility = 'hidden';
  chatActionMenu.classList.add('is-open');
  chatActionMenu.setAttribute('aria-hidden', 'false');
  registerTransientActionMenu('chat-action', {
    menu: chatActionMenu,
    anchor,
    owner: chatStorePage,
    close: closeChatActionMenu,
  });
  chatActionMenu.style.visibility = '';
}

function closeChatActionMenu() {
  chatActionMenu.classList.remove('is-open');
  chatActionMenu.setAttribute('aria-hidden', 'true');
  historyList.querySelectorAll('.history-more-button').forEach((button) => button.setAttribute('aria-expanded', 'false'));
  chatActionMenuAnchor = null;
  unregisterTransientActionMenu('chat-action');
}

function openSheet() {
  closeTransientActionMenus();
  roleSheet.classList.add('is-open');
  sheetScrim.classList.add('is-open');
  roleSheet.setAttribute('aria-hidden', 'false');
}

function closeSheet() {
  closeTransientActionMenus({ owner: roleSheet });
  roleSheet?.classList.remove('is-open');
  sheetScrim.classList.remove('is-open');
  roleSheet?.setAttribute('aria-hidden', 'true');
}

function setRoleIntroCollapsed(collapsed) {
  if (!roleIntroSection || !roleIntroToggle) return;
  roleIntroSection.classList.toggle('is-collapsed', collapsed);
  roleIntroToggle.textContent = collapsed ? '▼' : '▲';
  roleIntroToggle.setAttribute('aria-expanded', String(!collapsed));
  roleIntroToggle.setAttribute('aria-label', collapsed ? '展开角色介绍' : '折叠角色介绍');
}

function collectEditorState() {
  return {
    avatar: editorAvatar?.dataset.value || '',
    background: editorAvatar?.dataset.background || '',
    name: roleNameInput.value,
    subtitle: roleSubtitleInput.value,
    intro: roleIntroInput.value,
    description: rolePersonaInput.value,
    personality: rolePersonalityInput.value,
    scenario: roleScenarioInput.value,
    greeting: roleGreetingInput.value,
    example: roleExampleInput.value,
    note: roleNoteInput.value,
    voiceId: roleVoiceInput.value,
    autoRead: roleAutoReadInput.checked,
  };
}

function editorHasChanges() {
  return editorInitialState != null && JSON.stringify(collectEditorState()) !== JSON.stringify(editorInitialState);
}

function acceptInstantEditorField(field) {
  if (editorInitialState) editorInitialState[field] = collectEditorState()[field];
}

function saveEditorVoiceBindingImmediately() {
  if (!editingRole) return;
  const voiceId = roleVoiceInput.value.trim();
  editingRole.voiceId = voiceId;
  activePersona(editingRole).voiceId = voiceId;
  generatedVoiceCache.clear();
  saveRolesToCache();
  acceptInstantEditorField('voiceId');
  showToast('当前人设音色已生效');
}

function saveEditorAutoReadImmediately() {
  const enabled = roleAutoReadInput.checked === true;
  voiceReadSettings.autoRead = enabled;
  roles.forEach((role) => { role.autoRead = enabled; });
  saveRolesToCache();
  saveApiCache();
  acceptInstantEditorField('autoRead');
  showToast(enabled ? '已开启 AI 自动朗读' : '已关闭 AI 自动朗读');
}

function openEditor(role) {
  closeTransientActionMenus();
  // 设置详情等全屏页打开时，拒绝安卓双击/视口变化产生的穿透点击。
  // 编辑器自身已打开时仍允许切换或刷新人设版本。
  const editorAlreadyOpen = characterEditor.classList.contains('is-open');
  const blockedByForegroundPage = detailPage?.classList.contains('is-open')
    || settingsPage?.classList.contains('is-open')
    || chatStorePage?.classList.contains('is-open')
    || personaSwapPage?.classList.contains('is-open')
    || contextLogPage?.classList.contains('is-open');
  if (!role || (!editorAlreadyOpen && blockedByForegroundPage)) return;
  ensurePersonaVersions(role);
  editingRole = role;
  editorAvatar.src = role.avatar;
  editorAvatar.dataset.value = role.avatar;
  editorAvatar.dataset.background = role.background || '';
  roleImagePicker?.classList.remove('is-open');
  roleImagePicker?.setAttribute('aria-hidden', 'true');
  editorAvatarButton?.setAttribute('aria-expanded', 'false');
  roleNameInput.value = role.name;
  roleSubtitleInput.value = role.subtitle;
  roleIntroInput.value = activePersona(role).intro || role.intro || '';
  rolePersonaInput.value = role.description;
  updateRoleDescTokens();
  rolePersonalityInput.value = role.personality;
  roleScenarioInput.value = role.scenario;
  roleGreetingInput.value = role.greeting;
  roleExampleInput.value = role.example;
  roleNoteInput.value = role.note;
  roleVoiceInput.value = role.voiceId || '';
  roleAutoReadInput.checked = voiceReadSettings.autoRead === true;
  setRoleIntroCollapsed(true);
  renderPersonaVersions(role);
  editorInitialState = collectEditorState();
  characterEditor.classList.add('is-open');
  characterEditor.setAttribute('aria-hidden', 'false');
}

function closeEditorPanel() {
  closeTransientActionMenus({ owner: characterEditor });
  closeRoleImageCropper();
  roleImagePicker?.classList.remove('is-open');
  roleImagePicker?.setAttribute('aria-hidden', 'true');
  editorAvatarButton?.setAttribute('aria-expanded', 'false');
  characterEditor.classList.remove('is-open');
  characterEditor.setAttribute('aria-hidden', 'true');
  editorInitialState = null;
}

// 未修改时直接退出；只有当前表单确实变化时才询问是否保存。
function requestCloseEditor(event) {
  if (event) event.stopPropagation();
  if (!editorHasChanges()) {
    closeEditorPanel();
    return;
  }
  editorExitMenu.classList.add('is-open');
  editorExitMenu.setAttribute('aria-hidden', 'false');
  const w = editorExitMenu.offsetWidth || 220;
  const h = editorExitMenu.offsetHeight || 110;
  editorExitMenu.style.left = `${window.innerWidth / 2}px`;
  editorExitMenu.style.top = `${window.innerHeight / 2}px`;
  editorExitMenu.style.bottom = 'auto';
  void w;
}

function closeEditorExitMenu() {
  editorExitMenu.classList.remove('is-open');
  editorExitMenu.setAttribute('aria-hidden', 'true');
}

function cloneData(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function uniqueRoleName(baseName) {
  const usedNames = new Set(roles.map((role) => roleDisplayName(role)));
  if (!usedNames.has(baseName)) return baseName;
  let number = 2;
  while (usedNames.has(`${baseName} ${number}`)) number += 1;
  return `${baseName} ${number}`;
}

function activeShellPreviewMode() {
  const forcedMode = document.body.dataset.shellPreview;
  if (forcedMode) return forcedMode;
  if (detectedNativeApp) return 'android';
  return window.matchMedia('(max-width: 520px)').matches ? 'pc-narrow' : 'pc-wide';
}

function updateShellPreviewButtons() {
  const activeMode = activeShellPreviewMode();
  roleShellPreviewButtons.forEach((button) => {
    const active = button.dataset.shellPreview === activeMode;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function applyShellPreviewMode(mode) {
  if (!['pc-narrow', 'pc-wide', 'android'].includes(mode)) return;
  document.body.dataset.shellPreview = mode;

  document.body.classList.toggle('is-native-app', mode === 'android');
  document.body.classList.toggle('is-android', mode === 'android');
  document.body.classList.remove('is-ios');

  updateShellPreviewButtons();
  closeRoleManager();
  syncAppViewportHeight();
  window.requestAnimationFrame(() => {
    updateScrollState();
    showToast(`已切换到${mode === 'pc-narrow' ? 'PC窄' : mode === 'pc-wide' ? 'PC宽' : '安卓'}界面，刷新后恢复自动`);
  });
}

function openRoleManager() {
  roleManagerTarget.textContent = `当前人物：${roleDisplayName(currentRole)}`;
  deleteCurrentRoleButton.disabled = roles.length <= 1;
  deleteCurrentRoleButton.title = roles.length <= 1 ? '至少保留一个人物' : '';
  updateShellPreviewButtons();
  roleManagerOverlay.classList.add('is-open');
  roleManagerOverlay.setAttribute('aria-hidden', 'false');
}

function closeRoleManager() {
  roleManagerOverlay.classList.remove('is-open');
  roleManagerOverlay.setAttribute('aria-hidden', 'true');
}

function addRole() {
  const nextNumber = roles.filter((role) => role.id.startsWith('custom-')).length + 1;
  const role = {
    id: `custom-${Date.now()}`,
    name: uniqueRoleName(`新人物${nextNumber}`),
    displayName: '',
    displayNameLocked: false,
    subtitle: '',
    avatar: './assets/app图标.jpg',
    background: './assets/相柳.png',
    intro: '',
    description: '',
    personality: '',
    scenario: '',
    greeting: '',
    example: '',
    note: '',
    tags: [],
    voiceId: '',
    autoRead: false,
  };
  roles.push(role);
  ensurePersonaVersions(role);
  closeRoleManager();
  setRole(role);
  openEditor(role);
  showToast('已新增空白人物');
}

function roleCopySizeInMb(role) {
  ensurePersonaVersions(role);
  const payload = {
    role,
    chats: historiesForRole(role),
  };
  const json = JSON.stringify(payload);
  const bytes = typeof TextEncoder === 'function'
    ? new TextEncoder().encode(json).byteLength
    : new Blob([json]).size;
  return `${Math.max(0.01, bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function openCopyRoleDialog() {
  copySourceRoleId = currentRole.id;
  copyRoleSize.textContent = roleCopySizeInMb(currentRole);
  closeRoleManager();
  copyRoleDialog.classList.add('is-open');
  copyRoleDialog.setAttribute('aria-hidden', 'false');
}

function closeCopyRoleDialog() {
  copyRoleDialog.classList.remove('is-open');
  copyRoleDialog.setAttribute('aria-hidden', 'true');
  copySourceRoleId = null;
}

function copyCurrentRole() {
  const source = roles.find((role) => role.id === copySourceRoleId) || currentRole;
  ensurePersonaVersions(source);
  const stamp = Date.now();
  const role = cloneData(source);
  role.id = `copy-${source.id}-${stamp}`;
  role.name = uniqueRoleName(`${source.name} 副本`);
  role.displayName = uniqueRoleName(`${roleDisplayName(source)} 副本`);
  role.displayNameLocked = true;
  role.personaVersions = (role.personaVersions || []).map((persona, index) => ({
    ...persona,
    id: `${role.id}-persona-${index + 1}`,
    label: (persona.label || `${role.name} ${index + 1}`).replace(source.name, role.name),
    apiId: persona.apiId || '',
  }));
  // 版本 id 已重新生成，按原活跃版本的顺序重新指向。
  const sourceActiveIndex = source.personaVersions.findIndex((persona) => persona.id === source.activePersonaId);
  role.activePersonaId = role.personaVersions[Math.max(0, sourceActiveIndex)]?.id || role.personaVersions[0]?.id;
  roles.push(role);

  const sourceChats = historiesForRole(source);
  const copiedChats = sourceChats.map((chat, index) => {
    const copiedChat = cloneData(chat);
    copiedChat.id = `copy-chat-${role.id}-${stamp}-${index}`;
    copiedChat.roleId = role.id;
    copiedChat.characterName = role.name;
    copiedChat.title = uniqueCopiedChatTitle(chat.title, role.name);
    copiedChat.messages = (copiedChat.messages || []).map((message) => (
      message.role === 'bot' ? { ...message, name: role.name } : message
    ));
    return copiedChat;
  });
  chatHistories.push(...copiedChats);
  const copiedChatIds = new Map(sourceChats.map((chat, index) => [chat.id, copiedChats[index]?.id]));
  const copiedMemoryDocuments = memoryDocuments.filter((doc) => doc.roleId === source.id && copiedChatIds.has(doc.chatId)).map((doc, index) => ({
    ...doc,
    id: `copy-role-memory-${role.id}-${stamp}-${index}`,
    groupId: `copy-role-memory-group-${role.id}-${doc.groupId}`,
    roleId: role.id,
    chatId: copiedChatIds.get(doc.chatId),
  }));
  storeMemoryDocuments(copiedMemoryDocuments);
  const sourceActiveChat = activeChatsByRole[source.id] || activeChat;
  const activeIndex = sourceChats.findIndex((chat) => chat.id === sourceActiveChat?.id);
  if (copiedChats.length) activeChatsByRole[role.id] = copiedChats[Math.max(0, activeIndex)];

  closeCopyRoleDialog();
  setRole(role);
  showToast(`已复制“${source.name}”及全部聊天`);
}

function uniqueCopiedChatTitle(title, newRoleName) {
  const baseTitle = title || `${newRoleName} 新对话`;
  const copiedTitle = baseTitle.includes(newRoleName) ? `${baseTitle} 副本` : baseTitle;
  const usedTitles = new Set(chatHistories.map((chat) => chat.title));
  if (!usedTitles.has(copiedTitle)) return copiedTitle;
  let number = 2;
  while (usedTitles.has(`${copiedTitle} ${number}`)) number += 1;
  return `${copiedTitle} ${number}`;
}

function updateDeleteRoleConfirm() {
  confirmDeleteRoleButton.disabled = deleteRoleNameInput.value !== roleDisplayName(currentRole);
}

function openDeleteRoleDialog() {
  if (roles.length <= 1) {
    showToast('至少需要保留一个人物');
    return;
  }
  closeRoleManager();
  deleteRoleWarning.textContent = `将永久删除“${roleDisplayName(currentRole)}”的全部人设、聊天记录和人物资料，此操作无法撤销。`;
  deleteRoleNameInput.value = '';
  updateDeleteRoleConfirm();
  deleteRoleDialog.classList.add('is-open');
  deleteRoleDialog.setAttribute('aria-hidden', 'false');
  deleteRoleNameInput.focus();
}

function closeDeleteRoleDialog() {
  deleteRoleDialog.classList.remove('is-open');
  deleteRoleDialog.setAttribute('aria-hidden', 'true');
}

function confirmDeleteCurrentRole() {
  if (deleteRoleNameInput.value !== roleDisplayName(currentRole) || roles.length <= 1) return;
  const deletedRole = currentRole;
  const deletedIndex = roles.findIndex((role) => role.id === deletedRole.id);
  roles.splice(deletedIndex, 1);
  for (let index = chatHistories.length - 1; index >= 0; index -= 1) {
    if (chatHistories[index].roleId === deletedRole.id) chatHistories.splice(index, 1);
  }
  const memoryGroups = [...new Set(memoryDocuments.filter((doc) => doc.roleId === deletedRole.id).map((doc) => doc.groupId))];
  memoryGroups.forEach((groupId) => deleteMemoryDocumentGroup(groupId));
  delete activeChatsByRole[deletedRole.id];
  const fallbackRole = roles[Math.min(deletedIndex, roles.length - 1)];
  editingRole = fallbackRole;
  closeDeleteRoleDialog();
  setRole(fallbackRole);
  showToast(`已删除“${roleDisplayName(deletedRole)}”及全部资料`);
}

function openQuickRoleIntroDialog() {
  closeRoleManager();
  editRoleIntroTarget.textContent = `当前人物：${roleDisplayName(currentRole)}`;
  quickRoleIntroInput.value = currentRole.intro || activePersona(currentRole).intro || '';
  editRoleIntroDialog.classList.add('is-open');
  editRoleIntroDialog.setAttribute('aria-hidden', 'false');
  quickRoleIntroInput.focus();
}

function closeQuickRoleIntroDialog() {
  editRoleIntroDialog.classList.remove('is-open');
  editRoleIntroDialog.setAttribute('aria-hidden', 'true');
}

function saveQuickRoleIntro() {
  const intro = quickRoleIntroInput.value.trim();
  currentRole.intro = intro;
  ensurePersonaVersions(currentRole);
  currentRole.personaVersions[0].intro = intro;
  activePersona(currentRole).intro = intro;
  closeQuickRoleIntroDialog();
  setRole(currentRole);
  showToast('人物介绍已保存');
}

function saveEditingRole() {
  const introVal = roleIntroInput.value.trim();
  const personaName = roleNameInput.value.trim() || editingRole.name;
  editingRole.name = personaName;
  if (editingRole.displayNameLocked !== true) {
    editingRole.displayName = personaName;
    editingRole.displayNameLocked = true;
  }
  editingRole.subtitle = roleSubtitleInput.value.trim() || '长相思';
  editingRole.description = rolePersonaInput.value.trim();
  editingRole.personality = rolePersonalityInput.value.trim();
  editingRole.scenario = roleScenarioInput.value.trim();
  editingRole.greeting = roleGreetingInput.value.trim();
  editingRole.example = roleExampleInput.value.trim();
  editingRole.note = roleNoteInput.value.trim();
  editingRole.voiceId = roleVoiceInput.value.trim();
  editingRole.autoRead = roleAutoReadInput.checked;
  voiceReadSettings.autoRead = roleAutoReadInput.checked;
  editingRole.avatar = editorAvatar.dataset.value || editingRole.avatar;
  editingRole.background = editorAvatar.dataset.background || editingRole.background;
  const persona = activePersona(editingRole);
  const isBaseVersion = persona === editingRole.personaVersions[0];
  // 除「角色介绍」外，其余字段照常同步到当前版本
  personaFields.filter((f) => f !== 'intro').forEach((f) => { persona[f] = editingRole[f]; });
  // 「角色介绍」：随当前版本保存；若当前是该角色的第一个（基准）版本，则同步更新角色固定介绍，
  // 后续新建 / 导入的版本会沿用这一默认；若是「其它版本」，只改本版本、不影响默认与兄弟版本。
  persona.intro = introVal;
  if (isBaseVersion) editingRole.intro = introVal;
  persona.label = persona.label || `${editingRole.name} A`;
  if (editingRole.id === currentRole.id) {
    setRole(editingRole);
  } else {
    renderRoles();
  }
  editorInitialState = collectEditorState();
  saveRolesToCache();
  renderPersonaVersions(editingRole);
  showToast('人设已保存');
}

function cardToRole(card, fallbackName = '导入角色') {
  const data = card.data && typeof card.data === 'object' ? card.data : card;
  return {
    id: `import-${Date.now()}`,
    name: data.name || card.name || fallbackName,
    subtitle: Array.isArray(data.tags) && data.tags.length ? data.tags[0] : '长相思',
    avatar: editingRole.avatar,
    background: editingRole.background,
    description: data.description || card.description || '',
    personality: data.personality || card.personality || '',
    scenario: data.scenario || card.scenario || '',
    greeting: data.first_mes || card.first_mes || '',
    example: data.mes_example || card.mes_example || '',
    note: data.creator_notes || card.creatorcomment || card.creator_notes || '',
    tags: data.tags || card.tags || [],
  };
}

function applyImportedRole(role) {
  ensurePersonaVersions(editingRole);
  const knownNumbers = editingRole.personaVersions.map((persona) => Number((persona.label || '').match(/(\d+)\s*$/)?.[1]) || 0);
  const persona = { id: `${editingRole.id}-import-${Date.now()}`, label: `${editingRole.name} ${Math.max(0, ...knownNumbers) + 1}`, apiId: '' };
  copyPersonaFields(activePersona(editingRole), persona);
  copyPersonaFields(role, persona);
  // 导入版本不沿用当前活跃版本的手改介绍，统一默认取该角色的固定介绍文本
  persona.intro = editingRole.intro || '';
  // 导入版本默认不绑定 API
  persona.apiId = '';
  editingRole.personaVersions.push(persona);
  applyPersona(editingRole, persona);
  openEditor(editingRole);
  setRole(editingRole.id === currentRole.id ? editingRole : currentRole);
  renderRoles();
  showToast(`已导入为 ${persona.label}`);
}

function textFromBytes(bytes) {
  return Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
}

async function parsePngCharacter(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  let offset = 8;
  const avatarUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  while (offset + 12 <= bytes.length) {
    const length = view.getUint32(offset);
    const type = textFromBytes(bytes.slice(offset + 4, offset + 8));
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;

    if (type === 'tEXt') {
      const chunk = bytes.slice(dataStart, dataEnd);
      const separator = chunk.indexOf(0);
      if (separator > -1) {
        const keyword = textFromBytes(chunk.slice(0, separator));
        const rawText = textFromBytes(chunk.slice(separator + 1));
        if (keyword === 'chara' || keyword === 'ccv3' || keyword === 'ccv2') {
          const text = rawText.trim().startsWith('{') ? rawText : decodeBase64Utf8(rawText.trim());
          const role = cardToRole(JSON.parse(text), file.name.replace(/\.png$/i, ''));
          role.avatar = avatarUrl;
          return role;
        }
      }
    }

    offset = dataEnd + 4;
  }

  return {
    ...editingRole,
    avatar: avatarUrl,
  };
}

async function importPersonaFile(file) {
  if (!file) return;

  if (file.name.toLowerCase().endsWith('.json')) {
    const json = JSON.parse(await file.text());
    applyImportedRole(cardToRole(json, file.name.replace(/\.json$/i, '')));
    return;
  }

  if (file.name.toLowerCase().endsWith('.png')) {
    applyImportedRole(await parsePngCharacter(file));
    return;
  }

  showToast('只支持 JSON / PNG');
}

function buildSillyTavernCard(role) {
  return {
    spec: 'chara_card_v3',
    spec_version: '3.0',
    data: {
      name: role.name,
      description: role.description,
      personality: role.personality,
      scenario: role.scenario,
      first_mes: role.greeting,
      mes_example: role.example,
      creator_notes: role.note,
      tags: role.tags || [],
      alternate_greetings: [],
      extensions: {
        yuanbao_clone: {
          subtitle: role.subtitle,
          avatar: role.avatar,
          background: role.background,
        },
      },
    },
  };
}

function exportPersona() {
  saveEditingRole();
  const card = buildSillyTavernCard(editingRole);
  const blob = new Blob([JSON.stringify(card, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${editingRole.name || '角色卡'}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast('已导出酒馆 JSON');
}

function uniqueImportedPersonaLabel(role, requested) {
  const base = String(requested || `${role.name} 人设`).trim() || `${role.name} 人设`;
  const labels = new Set(role.personaVersions.map((persona) => String(persona.label || '')));
  if (!labels.has(base)) return base;
  let number = 2;
  while (labels.has(`${base}（导入 ${number}）`)) number += 1;
  return `${base}（导入 ${number}）`;
}

function appendPersonaDocument(role, data) {
  const items = multiPersonaItemsFromDocument(data);
  if (!items.length) throw new Error('文档里没有找到人设');
  ensurePersonaVersions(role);
  const stamp = Date.now();
  items.forEach((source, index) => {
    const persona = {
      id: `${role.id}-multi-${stamp}-${index}-${Math.random().toString(16).slice(2, 7)}`,
      label: uniqueImportedPersonaLabel(role, source.label || source.name),
      apiId: '',
    };
    personaFields.forEach((field) => { persona[field] = cloneData(source[field] ?? (field === 'tags' ? [] : '')); });
    persona.intro ||= role.intro || '';
    role.personaVersions.push(persona);
  });
  applyPersona(role, role.personaVersions[role.personaVersions.length - 1]);
  saveRolesToCache();
  openEditor(role);
  if (role.id === currentRole.id) setRole(role);
  return items.length;
}

async function importMultiPersonaFile(file) {
  if (!file) return;
  try {
    const count = appendPersonaDocument(editingRole, JSON.parse(await file.text()));
    showToast(`已导入 ${count} 个人设`);
  } catch (error) {
    showToast(`多人设导入失败：${error.message}`);
  } finally {
    if (multiPersonaFileInput) multiPersonaFileInput.value = '';
  }
}

function exportMultiPersonas() {
  saveEditingRole();
  ensurePersonaVersions(editingRole);
  const data = {
    format: 'xiangsi-multi-persona',
    version: 1,
    roleName: editingRole.displayName || editingRole.name || '角色',
    exportedAt: new Date().toISOString(),
    personas: editingRole.personaVersions.map((persona, index) => {
      const item = { key: persona._systemDefaultKey || persona.id || `persona-${index + 1}`, label: persona.label || `人设 ${index + 1}` };
      personaFields.forEach((field) => { item[field] = cloneData(persona[field] ?? (field === 'tags' ? [] : '')); });
      return item;
    }),
  };
  exportJsonFile(`${editingRole.displayName || editingRole.name || '角色'}-多人设.json`, data);
  showToast(`已导出 ${data.personas.length} 个人设`);
}

async function recallDefaultPersonas() {
  if (systemGiftsLoadPromise) await systemGiftsLoadPromise;
  const role = editingRole;
  if (!systemDefaultPersonaTemplates.length) {
    showToast('本次安装包还没有配置默认多人设');
    return;
  }
  ensurePersonaVersions(role);
  let added = 0;
  systemDefaultPersonaTemplates.forEach((template, index) => {
    if (role.personaVersions.some((persona) => persona._systemDefaultKey === template.key && isPristineSystemPersona(persona))) return;
    const persona = {
      id: `${role.id}-system-${Date.now()}-${index}-${Math.random().toString(16).slice(2, 7)}`,
      label: template.label,
      apiId: '',
      _systemDefaultKey: template.key,
    };
    personaFields.forEach((field) => { persona[field] = cloneData(template[field] ?? (field === 'tags' ? [] : '')); });
    role.personaVersions.push(persona);
    added += 1;
  });
  closePersonaMenu();
  if (!added) {
    showToast('默认多人设都在，不需要补回');
    return;
  }
  const latest = role.personaVersions[role.personaVersions.length - 1];
  applyPersona(role, latest);
  saveRolesToCache();
  openEditor(role);
  if (role.id === currentRole.id) setRole(role);
  showToast(`已调出 ${added} 个默认人设`);
}

function openChatStorePage() {
  closeTransientActionMenus();
  chatStorePage.classList.add('is-open');
  chatStorePage.setAttribute('aria-hidden', 'false');
  refreshChatStoreApiSummary();
  updateModeDots();
  if (pollingExpand && !pollingExpand.hasAttribute('hidden')) renderPollingList();
}

function closeChatStorePage() {
  closeTransientActionMenus({ owner: chatStorePage });
  chatStorePage.classList.remove('is-open');
  chatStorePage.setAttribute('aria-hidden', 'true');
}

function pollingApiLabel(api) {
  const fallbackModel = modelSettings?.model && modelSettings.model !== '手动选择' ? modelSettings.model : '';
  const modelLabel = api?.model || (fallbackModel ? `沿用全局 ${fallbackModel}` : '未选模型');
  return `${api?.name || '未命名 API'} · ${modelLabel}`;
}

function ensurePollingDefaults() {
  if (!polling.enabled || polling.mode !== 'random') return false;
  let changed = false;
  if (!polling.randomPresetIds.length) {
    const preset = activePreset();
    if (preset?.id) {
      polling.randomPresetIds = [preset.id];
      changed = true;
    }
  }
  return changed;
}

function setPollingMode(mode) {
  polling.mode = mode === 'random' ? 'random' : 'fixed';
  polling.enabled = true;
  polling.currentId = null;
  polling.count = 0;
  ensurePollingDefaults();
  renderPollingList();
  updateModeDots();
  savePollingState();
}

function updateModeDots() {
  const readiness = currentPollingReadiness();
  const active = readiness.active;
  if (singleModeDot) singleModeDot.classList.toggle('on', !active);
  if (pollingModeDot) pollingModeDot.classList.toggle('on', active);
  if (pollingModeDot) pollingModeDot.classList.toggle('pending', polling.enabled && !active);
  pollingModePicker?.querySelectorAll('[data-polling-mode]').forEach((button) => {
    button.classList.toggle('is-selected', button.dataset.pollingMode === polling.mode);
  });
  if (fixedPollingPanel) fixedPollingPanel.hidden = polling.mode !== 'fixed';
  if (randomPollingPanel) randomPollingPanel.hidden = polling.mode !== 'random';
  if (pollingStatus) {
    pollingStatus.textContent = active
      ? (polling.mode === 'random' ? '已生效 · 每次随机组合' : '已生效 · 固定模型轮询')
      : `尚未生效 · 还需：${readiness.missing.join('、')}`;
    pollingStatus.classList.toggle('is-active', active);
    pollingStatus.classList.toggle('is-pending', polling.enabled && !active);
  }
}

function togglePollingId(listName, id) {
  const values = uniquePollingIds(polling[listName]);
  polling[listName] = values.includes(id) ? values.filter((value) => value !== id) : [...values, id];
  polling.enabled = true;
  polling.currentId = null;
  polling.count = 0;
  renderPollingList();
  updateModeDots();
  savePollingState();
}

function renderRandomPollingChoices() {
  if (!currentRole) return;
  ensurePersonaVersions(currentRole);
  if (randomPersonaList) {
    randomPersonaList.innerHTML = '';
    currentRole.personaVersions.forEach((persona) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `polling-choice${polling.randomPersonaIds.includes(persona.id) ? ' is-selected' : ''}`;
      button.textContent = persona.label || currentRole.name;
      button.setAttribute('aria-pressed', String(polling.randomPersonaIds.includes(persona.id)));
      button.addEventListener('click', () => togglePollingId('randomPersonaIds', persona.id));
      randomPersonaList.append(button);
    });
  }
  if (randomApiList) {
    randomApiList.innerHTML = '';
    apiLinks.filter((api) => api.enabled !== false).forEach((api) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `polling-choice${polling.randomApiIds.includes(api.id) ? ' is-selected' : ''}`;
      button.textContent = pollingApiLabel(api);
      button.setAttribute('aria-pressed', String(polling.randomApiIds.includes(api.id)));
      button.addEventListener('click', () => togglePollingId('randomApiIds', api.id));
      randomApiList.append(button);
    });
  }
  if (randomPresetList) {
    randomPresetList.innerHTML = '';
    presets.forEach((preset) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `polling-choice${polling.randomPresetIds.includes(preset.id) ? ' is-selected' : ''}`;
      button.textContent = preset.name || '未命名预设';
      button.setAttribute('aria-pressed', String(polling.randomPresetIds.includes(preset.id)));
      button.addEventListener('click', () => togglePollingId('randomPresetIds', preset.id));
      randomPresetList.append(button);
    });
  }
}

function renderPollingList() {
  if (!pollingList || !currentRole) return;
  ensurePersonaVersions(currentRole);
  pollingList.innerHTML = '';
  currentRole.personaVersions.forEach((persona) => {
    const entry = polling.pool.find((item) => item.id === persona.id);
    if (entry && !entry.apiId) entry.apiId = activeApi()?.id || '';
    const row = document.createElement('div');
    row.className = `polling-item${entry ? ' is-selected' : ''}`;
    row.setAttribute('role', 'button');
    row.setAttribute('tabindex', '0');
    row.setAttribute('aria-pressed', String(!!entry));

    const name = document.createElement('span');
    name.className = 'polling-item-name';
    name.textContent = persona.label || currentRole.name;

    const apiSelect = document.createElement('select');
    apiSelect.className = 'polling-item-api';
    apiSelect.setAttribute('aria-label', `${persona.label || currentRole.name} 使用的 API 与模型`);
    apiSelect.innerHTML = apiLinks.filter((api) => api.enabled !== false)
      .map((api) => `<option value="${escapeHtml(api.id)}">${escapeHtml(pollingApiLabel(api))}</option>`).join('');
    apiSelect.value = entry?.apiId || activeApi()?.id || '';
    apiSelect.disabled = !entry || !apiLinks.length;

    const num = document.createElement('input');
    num.type = 'number';
    num.min = '1';
    num.max = '5';
    num.className = 'polling-item-interval';
    num.value = entry ? entry.interval : 1;
    num.disabled = !entry;

    const toggle = () => {
      const existing = polling.pool.find((item) => item.id === persona.id);
      if (existing) {
        polling.pool = polling.pool.filter((item) => item.id !== persona.id);
      } else {
        polling.pool.push({
          id: persona.id,
          apiId: apiSelect.value || activeApi()?.id || '',
          interval: clampPollInterval(num.value),
        });
      }
      polling.enabled = true;
      polling.currentId = null;
      polling.count = 0;
      renderPollingList();
      updateModeDots();
      savePollingState();
    };

    row.addEventListener('click', (event) => {
      if (event.target.closest('select,input')) return;
      toggle();
    });
    row.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('select,input')) {
        event.preventDefault();
        toggle();
      }
    });
    apiSelect.addEventListener('change', () => {
      const target = polling.pool.find((item) => item.id === persona.id);
      if (target) target.apiId = apiSelect.value;
      updateModeDots();
      savePollingState();
    });
    num.addEventListener('change', () => {
      const target = polling.pool.find((item) => item.id === persona.id);
      if (target) target.interval = clampPollInterval(num.value);
      num.value = target ? target.interval : 1;
      savePollingState();
    });

    row.append(name, apiSelect, num);
    pollingList.append(row);
  });
  renderRandomPollingChoices();
  updateModeDots();
}

function openPersonaSwap() {
  closeTransientActionMenus();
  if (!personaSwapList) return;
  personaSwapList.innerHTML = '';
  const role = currentRole;
  ensurePersonaVersions(role);
  const group = document.createElement('div');
  group.className = 'swap-group';
  const title = document.createElement('div');
  title.className = 'swap-group-title';
  title.textContent = `${role.name} · 人设版本`;
  group.appendChild(title);
  role.personaVersions.forEach((persona) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    const isActive = persona.id === role.activePersonaId;
    btn.className = `swap-item${isActive ? ' is-active' : ''}`;
    const tagText = (Array.isArray(persona.tags) && persona.tags.length ? persona.tags : [persona.subtitle]).filter(Boolean).join(' · ');
    btn.innerHTML = `<span class="swap-item-name">${escapeHtml(persona.label || role.name)}</span>${tagText ? `<small class="swap-item-tags">${escapeHtml(tagText)}</small>` : ''}`;
    btn.addEventListener('click', () => {
      applyPersona(role, persona);
      setRole(role);
      closePersonaSwapPage();
      showToast(`已切换到 ${persona.label || role.name}`);
    });
    group.appendChild(btn);
  });
  personaSwapList.appendChild(group);
  personaSwapPage.classList.add('is-open');
  personaSwapPage.setAttribute('aria-hidden', 'false');
}

function closePersonaSwapPage() {
  closeTransientActionMenus({ owner: personaSwapPage });
  personaSwapPage.classList.remove('is-open');
  personaSwapPage.setAttribute('aria-hidden', 'true');
}

function resetAppViewportScroll() {
  window.scrollTo?.(0, 0);
  document.documentElement.scrollLeft = 0;
  document.body.scrollLeft = 0;
  phoneShell.scrollTop = 0;
  phoneShell.scrollLeft = 0;
  chatScreen.scrollTop = 0;
  chatScreen.scrollLeft = 0;
  settingsPage.scrollLeft = 0;
  detailPage.scrollLeft = 0;
  requestAnimationFrame(() => {
    window.scrollTo?.(0, 0);
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
    phoneShell.scrollTop = 0;
    phoneShell.scrollLeft = 0;
    chatScreen.scrollTop = 0;
    chatScreen.scrollLeft = 0;
    settingsPage.scrollLeft = 0;
    detailPage.scrollLeft = 0;
  });
}

let detailInputUnlockTimer = null;

function lockOpenDetailPagePosition() {
  if (!detailPage?.classList.contains('is-open')) return;
  window.clearTimeout(detailInputUnlockTimer);
  detailInputUnlockTimer = null;
  document.documentElement.scrollLeft = 0;
  document.body.scrollLeft = 0;
  phoneShell.scrollLeft = 0;
  settingsPage.scrollLeft = 0;
  detailPage.scrollLeft = 0;
  detailPage.classList.add('is-input-active');
  detailPage.style.transform = 'translate3d(0,0,0)';
  detailPage.style.transition = 'none';
}

function unlockOpenDetailPagePositionSoon() {
  window.clearTimeout(detailInputUnlockTimer);
  detailInputUnlockTimer = window.setTimeout(() => {
    detailInputUnlockTimer = null;
    if (!detailPage?.classList.contains('is-open')) return;
    // 安卓的选中/翻译/粘贴菜单会制造一次假的 focusout；详情页在真正关闭前始终锚定。
    lockOpenDetailPagePosition();
  }, 180);
}

function openSettings(title = '更多') {
  closeTransientActionMenus();
  settingsTitle.textContent = title;
  settingsPage.classList.add('is-open');
  settingsPage.setAttribute('aria-hidden', 'false');
  resetAppViewportScroll();
}

function applyAppTheme() {
  const theme = ['白色', '浅色', 'light'].includes(appSettings.theme) ? 'light' : 'dark';
  phoneShell.dataset.appTheme = theme;
}

function appThemeLabel() {
  return ['白色', '浅色', 'light'].includes(appSettings.theme) ? '浅色' : '深色';
}

function closeSettingsPage() {
  closeTransientActionMenus({ owner: settingsPage });
  settingsPage.classList.remove('is-open');
  settingsPage.setAttribute('aria-hidden', 'true');
}

const FALLBACK_RELEASE_CONFIG = Object.freeze({
  appName: '相思',
  versionCode: 1,
  versionName: '1.0.0',
  updateManifestUrl: 'http://114.132.231.174/download/version.json',
});
let currentReleaseConfig = { ...FALLBACK_RELEASE_CONFIG };
let availableReleaseConfig = null;

async function loadReleaseConfig() {
  try {
    const response = await fetch('./release-config.json', { cache: 'no-store' });
    if (response.ok) currentReleaseConfig = { ...currentReleaseConfig, ...(await response.json()) };
  } catch (_) {
    // 浏览器开发预览没有 release-config.json 时使用安全的内置版本信息。
  }
  if (appVersionButton) appVersionButton.textContent = `v${currentReleaseConfig.versionName} · by lynn`;
  return currentReleaseConfig;
}

async function fetchLatestRelease(local = currentReleaseConfig) {
  const separator = local.updateManifestUrl.includes('?') ? '&' : '?';
  try {
    const response = await fetch(`${local.updateManifestUrl}${separator}t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  } catch (directError) {
    // 网页预览走同源代理规避版本服务器缺少 CORS；安卓壳允许直连时不会进入这里。
    const response = await fetch(`/api/release-manifest?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw directError;
    return response.json();
  }
}

function updateAvailableReleaseNotice(latest, local = currentReleaseConfig) {
  const hasUpdate = Number(latest?.versionCode) > Number(local?.versionCode);
  availableReleaseConfig = hasUpdate ? latest : null;
  if (!appUpdateNotice) return hasUpdate;
  appUpdateNotice.hidden = !hasUpdate;
  appUpdateNotice.title = hasUpdate ? `发现新版本 v${latest.versionName || latest.versionCode}` : '';
  return hasUpdate;
}

async function checkForAvailableUpdateOnLaunch() {
  try {
    const local = await loadReleaseConfig();
    updateAvailableReleaseNotice(await fetchLatestRelease(local), local);
  } catch (_) {
    // 启动检查必须静默：断网或更新服务器临时不可用时，不打扰正常使用。
    updateAvailableReleaseNotice(null);
  }
}

let updateDownloadStartedAt = 0;

function openUpdateDownload(url) {
  // 安卓 WebView 会自行把新窗口链接交给系统浏览器/下载器处理。
  // 这里只调用一次；不要根据返回值再补 location.href，否则会重复下载。
  const now = Date.now();
  if (now - updateDownloadStartedAt < 5000) return;
  updateDownloadStartedAt = now;
  window.open(url, '_blank', 'noopener,noreferrer');
}

async function checkForAppUpdate() {
  if (!appVersionButton || appVersionButton.disabled) return;
  appVersionButton.disabled = true;
  const oldLabel = appVersionButton.textContent;
  appVersionButton.textContent = '检查中…';
  try {
    const local = await loadReleaseConfig();
    const latest = await fetchLatestRelease(local);
    const hasUpdate = updateAvailableReleaseNotice(latest, local);
    if (!hasUpdate) {
      alert(`相思 v${local.versionName} 已经是最新版。`);
      return;
    }
    const notes = latest.message ? `\n\n更新内容：\n${latest.message}` : '';
    const accepted = confirm(`发现相思新版本 v${latest.versionName}，现在下载安装吗？${notes}`);
    if (accepted && latest.downloadUrl) openUpdateDownload(latest.downloadUrl);
  } catch (error) {
    alert(`暂时无法检查新版本，请确认网络正常后再试。\n${error?.message || error}`);
  } finally {
    appVersionButton.disabled = false;
    appVersionButton.textContent = oldLabel;
    loadReleaseConfig();
  }
}

function openDetail(title, bodyHtml, headerAction) {
  closeTransientActionMenus();
  closeAppearanceColorPicker();
  resetAppViewportScroll();
  detailPage.style.transform = '';
  detailPage.style.transition = '';
  detailTitle.textContent = title;
  detailBody.innerHTML = bodyHtml;
  detailPage.classList.toggle('is-api-editor', title === '新建API连接' || title === '编辑API连接');
  detailPage.classList.toggle('is-backup-restore', title === '备份与恢复');
  detailPage.classList.toggle('is-runtime-logs', title === '运行日志');
  detailPage.classList.toggle('is-memory-detail', title === '长记忆');
  // 兼容旧 API：{label, onClick} 单按钮；新 API 支持 [{label,onClick}, ...] 多按钮数组
  const actions = Array.isArray(headerAction) ? headerAction
    : headerAction && typeof headerAction === 'object' ? [headerAction]
    : [];
  detailPage.classList.toggle('has-header-action', actions.length > 0);
  if (actions.length > 0) {
    detailHeaderActions.innerHTML = actions.map((a, i) =>
      `<button class="detail-header-action ui-button-small" type="button" data-action-index="${i}" aria-label="${escapeHtml(a.label || '')}">${escapeHtml(a.label || '')}</button>`
    ).join('');
    actions.forEach((a, i) => {
      detailHeaderActions.querySelector(`[data-action-index="${i}"]`).onclick = a.onClick;
    });
  } else {
    detailHeaderActions.innerHTML = '';
  }
  detailPage.classList.add('is-open');
  detailPage.setAttribute('aria-hidden', 'false');
  resetAppViewportScroll();
  setTimeout(resetAppViewportScroll, 280);
  bindDetailControls(title);
}

function closeDetailPage() {
  closeTransientActionMenus({ owner: detailPage });
  closeAppearanceColorPicker();
  window.clearTimeout(detailInputUnlockTimer);
  detailInputUnlockTimer = null;
  detailPage.classList.remove('is-input-active');
  detailPage.style.transform = '';
  detailPage.style.transition = '';
  detailPage.classList.remove('is-open');
  detailPage.classList.remove('is-api-editor');
  detailPage.classList.remove('is-backup-restore');
  detailPage.classList.remove('is-runtime-logs');
  detailPage.classList.remove('is-memory-detail');
  detailPage.classList.remove('has-header-action');
  detailPage.setAttribute('aria-hidden', 'true');
  if (detailHeaderActions) detailHeaderActions.innerHTML = '';
  if (chatStorePage?.classList.contains('is-open')) refreshChatStoreApiSummary();
  resetAppViewportScroll();
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function settingRow(name, value = '') {
  return `<button class="settings-row" type="button" data-name="${escapeHtml(name)}"><b>${escapeHtml(name)}</b><span>${escapeHtml(value)}</span></button>`;
}

function activePreset() {
  return presets.find((preset) => preset.active);
}

function activeApi() {
  return apiLinks.find((api) => api.active) || apiLinks[0];
}

function apiById(apiId) {
  if (!apiId) return null;
  return apiLinks.find((api) => api.id === apiId || api.name === apiId) || null;
}

function effectiveApi(role = currentRole, personaOverride = null) {
  return activeApi();
}

function formatFileTimestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-') + '_' + [
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('-');
}

function exportJsonFile(fileName, data) {
  const json = JSON.stringify(data, null, 2);
  if (window.XiangsiFiles?.saveText) {
    window.XiangsiFiles.saveText(fileName, 'application/json', json);
    return 'native-picker';
  }
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
  return 'browser-download';
}

window.addEventListener('xiangsi:file-save-result', (event) => {
  const fileName = event?.detail?.fileName || '配置文件';
  const isAppBackup = fileName.includes('相思-备份');
  if (event?.detail?.saved) {
    showToast(`${isAppBackup ? '备份' : '文件'}已保存：${fileName}`);
  } else if (event?.detail?.cancelled) {
    showToast('已取消保存');
  } else {
    showToast(`${isAppBackup ? '备份' : '文件'}保存失败，请换一个文件夹重试`);
  }
});

function exportTextFile(fileName, text) {
  if (window.XiangsiFiles?.saveText) {
    window.XiangsiFiles.saveText(fileName, 'text/plain', String(text ?? ''));
    return 'native-picker';
  }
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
  return 'browser-download';
}

function collectAppConfig(includeKeys = false) {
  const safeApiLinks = (Array.isArray(apiLinks) ? apiLinks : []).map(({ key, ...api }) => {
    if (includeKeys) return { ...api, key: key || '' };
    return { ...api, key: '' };
  });
  const safeVoiceApiSettings = {
    ...voiceApiSettings,
    siliconflow: { ...voiceApiSettings.siliconflow, apiKey: includeKeys ? voiceApiSettings.siliconflow.apiKey : '' },
    volcano: { ...voiceApiSettings.volcano, accessKey: includeKeys ? voiceApiSettings.volcano.accessKey : '' },
    minimax: { ...voiceApiSettings.minimax, apiKey: includeKeys ? voiceApiSettings.minimax.apiKey : '' },
    moss: { ...voiceApiSettings.moss, apiKey: includeKeys ? voiceApiSettings.moss.apiKey : '' },
  };
  return {
    yuanbaoReplica: 1,
    dataSchemaVersion: CURRENT_DATA_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    roles,
    apiLinks: safeApiLinks,
    voiceLinks,
    voiceApiSettings: safeVoiceApiSettings,
    voiceReadSettings,
    userIdentities,
    activeUserIdentityId,
    modelSettings,
    presets: (Array.isArray(presets) ? presets : []).filter((preset) => preset?.systemDefault !== true),
    systemDefaultPresetActive: (Array.isArray(presets) ? presets : []).some((preset) => preset?.systemDefault === true && preset?.active === true),
    selectedPresetId,
    worldBooks,
    lorebookLibrary,
    selectedLorebookId,
    worldBookSettings,
    regexRules,
    memorySettings,
    memoryDocuments,
    appSettings,
    chatHistories: (Array.isArray(chatHistories) ? chatHistories : []).map(normalizeChatForCache).filter(Boolean),
    activeChatId: activeChat?.id || '',
  };
}

function exportAppBackup(includeKeys = false) {
  try {
    const mode = exportJsonFile(`${formatFileTimestamp()}-相思-备份.json`, collectAppConfig(includeKeys));
    if (mode === 'native-picker') {
      showToast(includeKeys ? '请选择保存位置（备份含密钥）' : '请选择备份保存位置');
    } else {
      showToast(includeKeys ? '备份已导出（含密钥）' : '备份已导出');
    }
    return true;
  } catch (error) {
    console.error('导出相思备份失败：', error);
    showToast('备份生成失败，请先不要卸载 App');
    return false;
  }
}

function applyImportedConfig(sourceData) {
  const migration = migratePortableConfig(sourceData);
  const data = migration.data;
  if (Array.isArray(data.roles)) {
    data.roles.forEach((incoming) => {
      if (!incoming || !incoming.name) return;
      const existing = roles.find((role) => role.id === incoming.id || role.name === incoming.name);
      if (existing) Object.assign(existing, incoming);
      else roles.push({ id: `role-${Date.now()}-${roles.length}`, ...incoming });
    });
    roles.forEach((role) => {
      (role.personaVersions || []).forEach((persona) => { persona.apiId = persona.apiId || ''; });
    });
  }
  if (Array.isArray(data.apiLinks)) {
    apiLinks.splice(0, apiLinks.length, ...data.apiLinks);
    apiLinks.forEach((api) => {
      if (!api.id) api.id = `api-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
      api.model = canonicalChatModelId(api.url, api.model);
    });
  }
  if (Array.isArray(data.voiceLinks)) voiceLinks.splice(0, voiceLinks.length, ...data.voiceLinks);
  if (data.voiceApiSettings) {
    voiceApiSettings.engine = data.voiceApiSettings.engine || voiceApiSettings.engine;
    ['siliconflow', 'volcano', 'minimax', 'moss'].forEach((engine) => {
      if (data.voiceApiSettings[engine]) Object.assign(voiceApiSettings[engine], data.voiceApiSettings[engine]);
    });
  }
  if (data.voiceReadSettings) Object.assign(voiceReadSettings, data.voiceReadSettings);
  if (Array.isArray(data.userIdentities) && data.userIdentities.length) {
    userIdentities.splice(0, userIdentities.length, ...data.userIdentities);
    activeUserIdentityId = data.activeUserIdentityId || userIdentities[0]?.id || '';
    syncUserProfileReference();
  } else if (data.userProfile) {
    // 兼容旧版配置
    Object.assign(userProfile, data.userProfile);
    if (userIdentities.length && activeUserIdentityId) {
      const active = userIdentities.find((u) => u.id === activeUserIdentityId);
      if (active) {
        active.name = userProfile.name;
        active.persona = userProfile.persona;
        active.avatar = userProfile.avatar || active.avatar;
      }
    }
  }
  if (data.modelSettings) Object.assign(modelSettings, data.modelSettings);
  if (Array.isArray(data.presets)) {
    presets.splice(0, presets.length, ...data.presets);
    selectedPresetId = data.selectedPresetId || presets.find((preset) => preset.active)?.id || presets[0]?.id || '';
    installSystemDefaultPreset();
    if (data.systemDefaultPresetActive === true) {
      presets.forEach((preset) => { preset.active = preset.systemDefault === true; });
      selectedPresetId = SYSTEM_DEFAULT_PRESET_ID;
    }
  }
  if (Array.isArray(data.lorebookLibrary) && data.lorebookLibrary.length) {
    lorebookLibrary.splice(0, lorebookLibrary.length, ...data.lorebookLibrary.map((book, index) => ({
      id: book.id || `lorebook-import-${Date.now()}-${index}`,
      name: book.name || `世界书 ${index + 1}`,
      active: book.active === true,
      entries: Array.isArray(book.entries) ? book.entries : [],
      raw: book.raw && typeof book.raw === 'object' ? book.raw : undefined,
    })));
      selectedLorebookId = Object.hasOwn(data, 'selectedLorebookId') ? data.selectedLorebookId : lorebookLibrary[0].id;
  } else if (Array.isArray(data.worldBooks)) {
    ensureLorebookLibraryFromLegacy(data.worldBooks, '导入的世界书');
  }
  if (data.worldBookSettings) Object.assign(worldBookSettings, data.worldBookSettings);
  if (Array.isArray(data.regexRules)) regexRules.splice(0, regexRules.length, ...data.regexRules);
  if (data.memorySettings) {
    Object.assign(memorySettings, data.memorySettings);
    memorySettings.knowledgePerformanceSendFields = normalizeKnowledgePerformanceSendFields(memorySettings.knowledgePerformanceSendFields);
    migrateLegacyMemorySummaryPrompt();
    normalizeMemoryPromptLibraries();
    if (!Object.hasOwn(data.memorySettings, 'autoSummary') && Number(data.memorySettings.summaryLimit) === 400) {
      memorySettings.summaryLimit = 30;
      memorySettings.vector = false;
    }
  }
  if (Array.isArray(data.memoryDocuments)) replaceMemoryDocuments(data.memoryDocuments);
  if (data.appSettings) Object.assign(appSettings, data.appSettings);
  if (Array.isArray(data.chatHistories) && data.chatHistories.length) {
    const importedChats = data.chatHistories.map(normalizeChatForCache).filter((chat) => chat && chat.id && chat.roleId);
    if (importedChats.length) {
      chatHistories.splice(0, chatHistories.length, ...importedChats);
      Object.keys(activeChatsByRole).forEach((key) => delete activeChatsByRole[key]);
      const byId = new Map(chatHistories.map((chat) => [chat.id, chat]));
      roles.forEach((role) => {
        const first = chatHistories.find((chat) => chat.roleId === role.id);
        if (first) activeChatsByRole[role.id] = first;
      });
      activeChat = byId.get(data.activeChatId) || chatHistories[0] || activeChat;
    }
  }
  saveRolesToCache();
  saveApiCache();
  saveUserIdentities();
  saveAppStateToCache();
  saveChatHistoriesToCache();
  setRole(currentRole);
  renderMoreSettings();
  return migration;
}

function importAppConfigFile() {
  const picker = document.createElement('input');
  picker.type = 'file';
  picker.accept = '.json,application/json';
  picker.addEventListener('change', async () => {
    const file = picker.files?.[0];
    if (!file) return;
    try {
      persistAllLocalState();
      await createMigrationBackup('before-config-import');
      const migration = applyImportedConfig(JSON.parse(await file.text()));
      showToast(migration.changed ? '旧备份已兼容整理并导入' : '配置已导入');
      renderMigrationSafetyBackups();
    } catch (error) {
      console.error('导入相思备份失败：', error);
      showToast(`备份没有导入：${error.message || '这个配置包暂时没读懂'}`);
    }
  });
  picker.click();
}

function readMoreSetting(getter, fallback = '未配置') {
  try {
    const value = getter();
    return value === undefined || value === null || value === '' ? fallback : value;
  } catch (error) {
    console.warn('读取“更多”设置项失败，已使用默认显示：', error);
    return fallback;
  }
}

function renderMoreSettings() {
  if (!settingsList) return;
  const apiName = readMoreSetting(() => effectiveApi()?.name, '未配置');
  const voiceEngine = readMoreSetting(() => ({ siliconflow: '硅基流动', volcano: '火山引擎', minimax: 'MiniMax', moss: 'MOSS' })[voiceApiSettings?.engine], '未配置');
  const modelSummary = readMoreSetting(() => modelSettings?.enabled
    ? `温度 ${modelSettings.temperature} · 记忆 ${modelSettings.historyLimit} 条`
    : '已关闭 · 不发送全局参数', '未配置');
  const presetName = readMoreSetting(() => activePreset()?.name, '未选择');
  const worldBookSummary = readMoreSetting(() => {
    const books = Array.isArray(lorebookLibrary) ? lorebookLibrary : [];
    return `${books.filter((book) => book?.active).length}/${books.length} 本启用`;
  }, '0/0 本启用');
  const regexSummary = readMoreSetting(() => {
    const rules = Array.isArray(regexRules) ? regexRules : [];
    return `${rules.filter((rule) => rule?.enabled).length}/${rules.length}`;
  }, '0/0');
  const memoryMode = readMoreSetting(() => memorySettings?.mode, '未配置');
  const userName = readMoreSetting(() => userProfile?.name, '用户');
  const logCount = readMoreSetting(() => `${Array.isArray(runtimeLogStore?.entries) ? runtimeLogStore.entries.length : 0} 条`, '0 条');

  settingsList.innerHTML = `
    <section class="settings-group">
      ${settingRow('API管理', apiName)}
      ${settingRow('语音API设置', voiceEngine)}
    </section>
    <section class="settings-group">
      ${settingRow('全局模型设置', modelSummary)}
      ${settingRow('预设', presetName)}
    </section>
    <section class="settings-group">
      ${settingRow('世界书', worldBookSummary)}
      ${settingRow('正则', regexSummary)}
      ${settingRow('记忆管理', memoryMode)}
    </section>
    <section class="settings-group">
      ${settingRow('用户身份', userName)}
      ${settingRow('生图设置')}
      ${settingRow('运行日志', logCount)}
    </section>
    <section class="settings-group">
      <div class="settings-group-title">设置</div>
      ${settingRow('外观', appThemeLabel())}
      ${settingRow('备份与恢复')}
      ${settingRow('缓存管理')}
      ${settingRow('手机测试')}
      ${settingRow('通用设置')}
    </section>
  `;

  settingsList.querySelectorAll('.settings-row').forEach((row) => {
    row.addEventListener('click', () => openSettingsDetail(row.dataset.name));
  });
  try {
    renderAdvancedQuickSettings();
  } catch (error) {
    // 快捷摘要属于聊天页辅助信息，不能让它阻止“更多”主页面打开。
    console.warn('刷新高级选项摘要失败，已跳过：', error);
  }
}

function openMoreSettingsSafely() {
  closeLeftDrawer();
  // 先显示页面，再读取各项数据；即使旧配置异常，也不会看起来像“闪退”回聊天页。
  openSettings('更多');
  try {
    renderMoreSettings();
  } catch (error) {
    console.error('打开“更多”失败：', error);
    settingsList.innerHTML = `
      <section class="settings-group">
        <div class="settings-group-title">基础设置</div>
        ${settingRow('外观', appThemeLabel())}
        ${settingRow('备份与恢复')}
        ${settingRow('缓存管理')}
        ${settingRow('通用设置')}
      </section>
      <p class="settings-recovery-hint">部分旧设置读取失败，已进入安全模式。建议先打开“备份与恢复”导出备份，再检查缓存或重新导入配置。</p>`;
    settingsList.querySelectorAll('.settings-row').forEach((row) => {
      row.addEventListener('click', () => openSettingsDetail(row.dataset.name));
    });
  }
}

// 聊天页“高级选项”展示当前角色聊天实际使用的配置。
// 预设和正则仍是全局配置；世界书可同时来自全局启用与当前人物启用。
function renderAdvancedQuickSettings() {
  const roleName = roleDisplayName(currentRole || {});
  const activeBooks = activeWorldBooksForRole();
  const activeRules = regexRules.filter((rule) => rule.enabled);
  const voiceLabel = ({ siliconflow: '硅基流动', volcano: '火山引擎', minimax: 'MiniMax', moss: 'MOSS' })[voiceApiSettings.engine] || '未配置';
  const summaries = {
    preset: `${roleName} · ${activePreset()?.name || '未选择预设'}`,
    worldbook: activeBooks.length ? `${roleName} · ${activeBooks.map((book) => book.name).join('、')}` : `${roleName} · 无`,
    regex: activeRules.length ? `已启用：${activeRules.map((rule) => rule.name).join('、')}` : '无',
    memory: memorySettings.enabled ? memorySettings.mode : '已关闭',
    voice: voiceLabel,
  };
  document.querySelectorAll('[data-advanced-summary]').forEach((element) => {
    element.textContent = summaries[element.dataset.advancedSummary] || element.textContent;
  });
}

function openSettingsDetail(name) {
  if (name === '手机测试') {
    openPhoneTest();
    return;
  }
  if (name === 'API管理' || name === 'API连接' || name === 'API链接') {
    openApiDetail();
    return;
  }
  if (name === '语音API设置' || name === '声音链接') {
    openVoiceApiDetail();
    return;
  }
  if (name === '用户身份') {
    openUserProfileDetail();
    return;
  }
  if (name === '全局模型设置') {
    openModelDetail();
    return;
  }
  if (name === '预设') {
    openPresetDetail();
    return;
  }
  if (name === '世界书') {
    openWorldBookDetail();
    return;
  }
  if (name === '正则') {
    openRegexDetail();
    return;
  }
  if (name === '记忆管理' || name === '长记忆') {
    openMemoryDetail();
    return;
  }
  if (name === '外观') {
    openThemeDetail();
    return;
  }
  if (name === '备份与恢复') {
    openBackupRestoreDetail();
    return;
  }
  if (name === '缓存管理') {
    openCacheManageDetail();
    return;
  }
  if (name === '运行日志') {
    openRuntimeLogsDetail();
    return;
  }
  if (name === '通用设置' || name === '设置') {
    openAppSettingsDetail();
    return;
  }
  openDetail(name, `<div class="detail-card"><label>${escapeHtml(name)}<textarea rows="8">这里先放 ${escapeHtml(name)} 的配置占位，后续可以接成真正的酒馆式配置表。</textarea></label></div>`);
}

function openRuntimeLogsDetail() {
  const lines = runtimeLogStore.entries
    .slice()
    .reverse()
    .map((entry) => {
      const time = new Date(entry.time).toLocaleString();
      const payload = entry.payload ? `\n${JSON.stringify(entry.payload, null, 2)}` : '';
      return `[${time}] [${entry.level}] ${entry.tag}: ${entry.message}${payload}`;
    })
    .join('\n');
  openDetail('运行日志', `
    <div class="log-viewer-card">
      <pre class="log-content">${escapeHtml(lines) || '暂无日志'}</pre>
    </div>
  `, [
    {
      label: '导出',
      onClick: () => {
        const mode = exportRuntimeLogs();
        showToast(mode === 'native-picker' ? '请选择文件名和保存文件夹' : '日志已导出');
      },
    },
    {
      label: '清空',
      onClick: () => {
        clearRuntimeLogs();
        renderMoreSettings();
        openRuntimeLogsDetail();
        showToast('日志已清空');
      },
    },
  ]);
}

function openPhoneTest() {
  openDetail('手机测试', `
    <div class="phone-test-page">
      <p class="phone-test-tip">让手机和电脑连同一个 Wi-Fi，然后在手机浏览器打开下面任意地址即可（走本地代理，可直接对话）。</p>
      <div class="phone-test-list" id="phoneTestList"><p class="phone-test-loading">正在获取本机地址…</p></div>
      <p class="phone-test-fw">若手机打不开页面，多半是电脑防火墙拦截了 5190 端口。请<strong>以管理员身份</strong>打开 PowerShell，粘贴执行下面这条命令（只需一次，之后永久生效），再刷新手机页面：</p>
      <pre class="phone-test-cmd">netsh advfirewall firewall add rule name=XiangLiuApp dir=in action=allow protocol=TCP localport=5190</pre>
      <button type="button" class="phone-test-copy-cmd" id="copyFwCmd">复制命令</button>
    </div>
  `);

  detailBody.querySelector('#copyFwCmd')?.addEventListener('click', (e) => {
    const cmd = 'netsh advfirewall firewall add rule name=XiangLiuApp dir=in action=allow protocol=TCP localport=5190';
    navigator.clipboard?.writeText(cmd).then(
      () => { e.target.textContent = '已复制'; setTimeout(() => (e.target.textContent = '复制命令'), 1500); },
      () => { e.target.textContent = '复制失败'; }
    );
  });

  const listEl = detailBody.querySelector('#phoneTestList');
  if (!listEl) return;

  fetch('/api/local-ip')
    .then((r) => r.json())
    .then((data) => {
      const port = data.port || window.location.port || 5190;
      const addresses = Array.isArray(data.addresses) ? data.addresses : [];
      if (!addresses.length) {
        listEl.innerHTML = '<p class="phone-test-loading">未检测到局域网地址，请确认电脑已连接 Wi-Fi。</p>';
        return;
      }
      listEl.innerHTML = addresses.map((item) => {
        const url = `http://${item.address}:${port}/`;
        return `
          <article class="phone-test-card">
            <div class="phone-test-qr"><img src="/api/qr?size=200&text=${encodeURIComponent(url)}" alt="二维码"></div>
            <div class="phone-test-meta">
              <b>${escapeHtml(item.name || '网卡')}</b>
              <code>${escapeHtml(url)}</code>
              <button type="button" class="phone-test-copy" data-url="${escapeHtml(url)}">复制地址</button>
            </div>
          </article>
        `;
      }).join('');

      listEl.querySelectorAll('.phone-test-copy').forEach((btn) => {
        btn.addEventListener('click', () => {
          const url = btn.dataset.url;
          navigator.clipboard?.writeText(url).then(
            () => { btn.textContent = '已复制'; setTimeout(() => (btn.textContent = '复制地址'), 1500); },
            () => { btn.textContent = '复制失败'; }
          );
        });
      });
    })
    .catch(() => {
      listEl.innerHTML = '<p class="phone-test-loading">获取地址失败，请确认本地服务器在运行。</p>';
    });
}

function openApiDetail() {
  openDetail('API连接', `
    <div class="api-connection-page">
      <section class="api-connection-list">
        ${apiLinks.map((item, index) => `
          <article class="api-connection-row${item.active ? ' is-default' : ''}" data-index="${index}" data-api-id="${escapeHtml(item.id || `api-index-${index}`)}">
            <button type="button" class="api-connection-main" data-use-model="${index}">
              <span class="api-connection-copy"><b><i class="api-connection-icon">⌁</i>${escapeHtml(item.name)}</b><em>${escapeHtml(`${item.provider || 'OpenAI兼容'}: ${item.model || '未选择模型'}`)}</em></span>
              ${item.active ? '<i class="api-connection-badge">默认</i>' : ''}
            </button>
            <button type="button" class="api-more-button ui-icon-button-small" data-api-more="${index}" aria-label="API更多操作">⋮</button>
          </article>
        `).join('')}
      </section>
      <div class="api-create-sheet" id="apiCreateSheet" aria-hidden="true">
        <div class="api-create-card">
          <strong>创建 API 连接</strong>
          <button type="button" id="createDirectApi"><b>⌁ 新建API连接</b><span>创建一个直连模型的 API 连接</span></button>
          <button type="button" id="createApiRouter"><b>⌘ 新建路由</b><span>以轮询、加权等方式访问多个 API 连接</span></button>
        </div>
      </div>
      <div class="api-action-sheet" id="apiActionSheet" aria-hidden="true">
        <button type="button" id="setDefaultApi">设为默认</button>
        <button type="button" id="editSelectedApi">编辑</button>
        <button type="button" id="copySelectedApi">复制</button>
        <button type="button" id="deleteSelectedApi">删除</button>
      </div>
    </div>
  `, { label: '＋新建', onClick: () => {
    const sheet = detailBody.querySelector('#apiCreateSheet');
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
  } });
}

function bindApiConnectionDrag() {
  const list = detailBody.querySelector('.api-connection-list');
  if (!list) return;

  detailBody.querySelectorAll('.api-connection-row').forEach((row) => {
    let holdTimer = null;
    let pendingPoint = null;
    let drag = null;
    let suppressClickUntil = 0;
    const clearHold = () => {
      if (holdTimer) window.clearTimeout(holdTimer);
      holdTimer = null;
    };
    const start = (clientY) => {
      if (!pendingPoint || drag) return;
      const rect = row.getBoundingClientRect();
      const ghost = row.cloneNode(true);
      ghost.classList.add('api-connection-drag-ghost');
      ghost.setAttribute('aria-hidden', 'true');
      Object.assign(ghost.style, {
        left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`,
      });
      document.body.append(ghost);
      drag = {
        ghost,
        height: rect.height,
        grabOffset: clientY - rect.top,
        startX: pendingPoint.x,
        startY: pendingPoint.y,
        moved: false,
        originalOrder: [...list.querySelectorAll('.api-connection-row')].map((item) => item.dataset.apiId),
      };
      row.classList.add('api-connection-drag-placeholder');
      document.body.classList.add('is-reordering');
      try { navigator.vibrate?.(12); } catch (_) {}
    };
    const move = (clientX, clientY) => {
      if (!drag) return;
      if (!drag.moved && Math.hypot(clientX - drag.startX, clientY - drag.startY) < 12) return;
      drag.moved = true;
      drag.ghost.style.top = `${clientY - drag.grabOffset}px`;
      const scrollerRect = detailBody.getBoundingClientRect();
      const edge = Math.min(64, scrollerRect.height * .18);
      if (clientY < scrollerRect.top + edge) detailBody.scrollBy(0, -10);
      else if (clientY > scrollerRect.bottom - edge) detailBody.scrollBy(0, 10);
      const center = clientY - drag.grabOffset + drag.height / 2;
      const siblings = [...list.querySelectorAll('.api-connection-row')].filter((item) => item !== row);
      const before = siblings.find((item) => {
        const rect = item.getBoundingClientRect();
        return rect.top + rect.height / 2 > center;
      });
      if (before) list.insertBefore(row, before);
      else list.append(row);
    };
    const finish = (cancelled = false) => {
      clearHold();
      pendingPoint = null;
      if (!drag) return;
      drag.ghost.remove();
      row.classList.remove('api-connection-drag-placeholder');
      document.body.classList.remove('is-reordering');
      if (cancelled || !drag.moved) {
        const byId = new Map([...list.querySelectorAll('.api-connection-row')].map((item) => [item.dataset.apiId, item]));
        drag.originalOrder.forEach((id) => { if (byId.get(id)) list.append(byId.get(id)); });
      } else {
        const byId = new Map(apiLinks.map((api, index) => [api.id || `api-index-${index}`, api]));
        const order = [...list.querySelectorAll('.api-connection-row')].map((item) => item.dataset.apiId);
        apiLinks.splice(0, apiLinks.length, ...order.map((id) => byId.get(id)).filter(Boolean));
        saveApiCache();
      }
      const didMove = drag.moved && !cancelled;
      suppressClickUntil = Date.now() + 700;
      drag = null;
      if (didMove) openApiDetail();
    };

    row.addEventListener('click', (event) => {
      if (Date.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
    row.addEventListener('contextmenu', (event) => {
      if (pendingPoint || drag) event.preventDefault();
    });

    const touchMove = (event) => {
      const touch = [...event.touches].find((item) => item.identifier === pendingPoint?.identifier);
      if (!touch || !pendingPoint) return;
      if (!drag && Math.hypot(touch.clientX - pendingPoint.x, touch.clientY - pendingPoint.y) > 9) clearHold();
      if (drag) { event.preventDefault(); move(touch.clientX, touch.clientY); }
    };
    const touchEnd = (event) => {
      const cancelled = event.type === 'touchcancel';
      window.removeEventListener('touchmove', touchMove, { capture: true });
      window.removeEventListener('touchend', touchEnd, { capture: true });
      window.removeEventListener('touchcancel', touchEnd, { capture: true });
      finish(cancelled);
    };
    row.addEventListener('touchstart', (event) => {
      if (event.touches.length !== 1 || event.target.closest('.api-more-button')) return;
      const touch = event.touches[0];
      pendingPoint = { identifier: touch.identifier, x: touch.clientX, y: touch.clientY };
      clearHold();
      holdTimer = window.setTimeout(() => start(touch.clientY), 380);
      window.addEventListener('touchmove', touchMove, { capture: true, passive: false });
      window.addEventListener('touchend', touchEnd, { capture: true });
      window.addEventListener('touchcancel', touchEnd, { capture: true });
    }, { passive: true });

    row.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch' || event.button !== 0 || event.target.closest('.api-more-button')) return;
      pendingPoint = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
      clearHold();
      // Desktop mouse dragging starts immediately; the movement threshold below still
      // protects ordinary clicks. Touch keeps the deliberate long-press gesture above.
      start(event.clientY);
      const pointerMove = (moveEvent) => {
        if (moveEvent.pointerId !== pendingPoint?.pointerId) return;
        if (drag) { moveEvent.preventDefault(); move(moveEvent.clientX, moveEvent.clientY); }
      };
      const pointerEnd = (endEvent) => {
        if (endEvent.pointerId !== pendingPoint?.pointerId) return;
        window.removeEventListener('pointermove', pointerMove, true);
        window.removeEventListener('pointerup', pointerEnd, true);
        window.removeEventListener('pointercancel', pointerEnd, true);
        finish(endEvent.type === 'pointercancel');
      };
      window.addEventListener('pointermove', pointerMove, { capture: true, passive: false });
      window.addEventListener('pointerup', pointerEnd, true);
      window.addEventListener('pointercancel', pointerEnd, true);
    });
  });
}

function buildApiModelParametersHtml(api) {
  const settings = normalizeApiModelParameters(api?.modelParameters);
  // 自动启用：上一版 "custom + 已设值" 的 API 升到新版后默认打开开关；其它情况默认使用全局。
  const hasAnyValue = ['temperature', 'topP', 'topK', 'maxTokens', 'frequencyPenalty', 'presencePenalty']
    .some((k) => finiteModelParameter(settings[k]));
  const useCustom = api?.useCustomParams === true
    || (api?.useCustomParams == null && api?.parameterMode === 'custom' && hasAnyValue);
  return `
    <details class="api-model-parameters" id="apiModelParameters">
      <summary>
        <span>模型专用参数<small>开 → 启用；关 → 使用全局模型设置</small></span>
        <label class="global-model-header-switch api-use-custom-switch" title="关闭时使用全局模型设置；只有本区显式填写才覆盖">
          <input id="apiUseCustomParams" type="checkbox" ${useCustom ? 'checked' : ''}>
          <span class="model-switch-track"></span>
        </label>
      </summary>
      <div class="api-param-content">
        <p class="api-param-priority">关闭 → 使用「全局模型设置」；开启 → 本区有值的参数覆盖全局，否则仍回退到全局。</p>
        <div id="apiParamCard" class="api-param-cards">
          ${renderModelParameters({
            values: settings,
            inputName: 'api-model-param',
            disabled: !useCustom,
            clearable: true,
            grouped: true,
          })}
        </div>
        <p class="api-param-note">ⓘ 模型专用设置优先于全局模型设置；数值框输入 0 即为 None，此项目不会发送。</p>
        <label class="api-custom-parameters"><span>自定义参数 <small>JSON</small></span>
          <textarea id="apiCustomParameters" rows="7" ${useCustom ? '' : 'disabled'} placeholder="输入 JSON 对象，例如 temperature 或 thinking">${escapeHtml(settings.customJson || '')}</textarea>
        </label>
      </div>
    </details>`;
}

function openApiEditor(index = apiLinks.indexOf(activeApi())) {
  const api = apiLinks[index] || activeApi() || {
    name: `API ${apiLinks.length + 1}`,
    provider: '自定义（OpenAI 协议）',
    url: '',
    model: '',
    key: '',
    enabled: true,
    active: true,
  };
  const activeIndex = Math.max(0, index);
  const isNew = !api.name || api.name === '新建 API' || api.isDraft;
  openDetail(isNew ? '新建API连接' : '编辑API连接', `
    <form class="api-editor-form" id="apiEditorForm" data-active-index="${activeIndex}">
      ${buildApiModelParametersHtml(api)}
      <label>名称
        <input id="apiNameSetting" value="${escapeHtml(api.name || `API ${apiLinks.length + 1}`)}" autocomplete="off">
      </label>
      <label class="api-label-with-help"><span>模型平台 <i title="目前支持 OpenAI 兼容协议">?</i></span>
        <select id="apiProviderSetting" class="api-platform-select">
          <option ${api.provider === '自定义（OpenAI 协议）' || api.provider === 'OpenAI兼容' ? 'selected' : ''}>自定义（OpenAI 协议）</option>
        </select>
      </label>
      <label class="api-label-with-help"><span>API 接口地址 <i title="填写到 /v1，例如 https://api.example.com/v1">?</i></span>
        <input id="apiUrlSetting" type="url" value="${escapeHtml(api.url || '')}" autocomplete="url">
      </label>
      <label class="api-label-with-help"><span>API 密钥 <i title="密钥只保存在当前应用配置中">?</i></span>
        <input id="apiKeySetting" class="api-secret-input" type="text" value="${escapeHtml(api.key || '')}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">
      </label>
      <label class="api-label-with-help"><span>模型</span>
        <span class="api-model-control" id="apiModelControl" data-value="${escapeHtml(api.model || '')}">
          <button id="apiModelSetting" class="api-model-picker-trigger" type="button" aria-haspopup="dialog">
            <span>${escapeHtml(api.model || '选择模型')}</span><i aria-hidden="true">›</i>
          </button>
        </span>
      </label>
      <p class="api-model-status" id="apiModelStatus" role="status"></p>
      <button class="api-test-connection" type="button" id="testApiConnection">测试连接</button>
      <label class="api-thinking-control" for="apiThinkingEnabled">
        <span><b>模型思考链</b><small>支持的模型：开启会保留思考，关闭会要求模型停止深度思考</small></span>
        <span class="global-model-header-switch">
          <input id="apiThinkingEnabled" type="checkbox" ${api.disableThinking === true ? '' : 'checked'}>
          <span class="model-switch-track"></span>
        </span>
      </label>
      <button class="api-save-gradient" type="submit" id="saveApiLinks">保存</button>
    </form>
  `, {
    label: '保存',
    onClick: () => {
      const form = detailBody.querySelector('#apiEditorForm');
      if (form) form.requestSubmit();
      else saveApiLinksFromDetail();
    },
  });
}

function normalizeSiliconFlowVoiceOption(voice) {
  if (!voice) return null;
  if (typeof voice === 'string') return { id: voice, name: voice, model: '' };
  const id = String(voice.id || voice.uri || voice.voice_id || voice.voiceId || '').trim();
  if (!id) return null;
  return {
    id,
    name: String(voice.name || voice.customName || voice.custom_name || voice.display_name || id),
    model: String(voice.model || voice.model_id || ''),
  };
}

function uniqueSiliconFlowCustomVoices(voices = []) {
  const seen = new Set();
  return voices
    .map(normalizeSiliconFlowVoiceOption)
    .filter((voice) => {
      if (!voice || seen.has(voice.id) || SILICONFLOW_PRESET_VOICES.some((preset) => preset.id === voice.id)) return false;
      seen.add(voice.id);
      return true;
    });
}

function siliconFlowVoiceOptionsHtml(selected = 'alex', customVoices = []) {
  const custom = uniqueSiliconFlowCustomVoices(customVoices);
  const knownIds = new Set([...SILICONFLOW_PRESET_VOICES.map((voice) => voice.id), ...custom.map((voice) => voice.id)]);
  const preserved = selected && !knownIds.has(selected)
    ? [{ id: selected, name: selected, model: '' }, ...custom]
    : custom;
  return [
    `<optgroup label="预设音色">${SILICONFLOW_PRESET_VOICES.map((voice) => `<option value="${escapeHtml(voice.id)}" ${voice.id === selected ? 'selected' : ''}>${escapeHtml(voice.name)}</option>`).join('')}</optgroup>`,
    preserved.length
      ? `<optgroup label="我的克隆音色">${preserved.map((voice) => `<option value="${escapeHtml(voice.id)}" ${voice.id === selected ? 'selected' : ''}>${escapeHtml(`${voice.name}（自定义）${voice.model ? ` · ${voice.model}` : ''}`)}</option>`).join('')}</optgroup>`
      : '',
  ].join('');
}

function renderSiliconFlowVoiceSelect(customVoices, selected) {
  const select = detailBody.querySelector('#voiceSfVoice');
  if (!select) return;
  const nextSelected = selected || select.value || voiceApiSettings.siliconflow.voice || 'alex';
  select.innerHTML = siliconFlowVoiceOptionsHtml(nextSelected, customVoices);
  select.value = nextSelected;
}

function normalizeMinimaxHost(host) {
  const normalized = String(host || 'https://api.minimaxi.com').trim().replace(/\/+$/, '');
  // 旧 minimax.chat 已不适用于新版 T2A v2；保留旧缓存兼容，但实际请求统一走新国内主地址。
  return /^https?:\/\/api\.minimax\.chat$/i.test(normalized) ? 'https://api.minimaxi.com' : normalized;
}

function mossVoiceOptionsHtml(selected = '', voices = []) {
  const merged = [...(Array.isArray(voices) && voices.length ? voices : MOSS_OFFICIAL_VOICES)];
  if (selected && !merged.some((voice) => voice.id === selected)) merged.unshift({ id: selected, name: `${selected}（当前）` });
  return merged
    .filter((voice) => voice?.id)
    .map((voice) => `<option value="${escapeHtml(voice.id)}">${escapeHtml(voice.name || voice.id)}</option>`)
    .join('');
}

function personaVoiceOptionsHtml(selectedVoice = '') {
  const selected = String(selectedVoice || '');
  const globalVoice = voiceApiSettings.engine === 'siliconflow'
    ? voiceApiSettings.siliconflow.voice || 'alex'
    : voiceApiSettings.engine === 'volcano'
      ? voiceApiSettings.volcano.speaker
      : voiceApiSettings.engine === 'moss'
        ? voiceApiSettings.moss.voiceId
        : voiceApiSettings.minimax.voice;
  const options = [`<option value="" ${selected ? '' : 'selected'}>${escapeHtml(`继承全局音色（${globalVoice || '默认'}）`)}</option>`];
  if (voiceApiSettings.engine === 'siliconflow') {
    options.push(`<optgroup label="预设音色">${SILICONFLOW_PRESET_VOICES.map((voice) => `<option value="${escapeHtml(voice.id)}" ${selected === voice.id ? 'selected' : ''}>${escapeHtml(voice.name)}</option>`).join('')}</optgroup>`);
    const custom = uniqueSiliconFlowCustomVoices(voiceApiSettings.siliconflow.customVoices || []);
    if (custom.length) options.push(`<optgroup label="我的克隆音色">${custom.map((voice) => `<option value="${escapeHtml(voice.id)}" ${selected === voice.id ? 'selected' : ''}>${escapeHtml(`${voice.name}（自定义）`)}</option>`).join('')}</optgroup>`);
    const known = [...SILICONFLOW_PRESET_VOICES.map((voice) => voice.id), ...custom.map((voice) => voice.id)];
    if (selected && !known.includes(selected)) options.push(`<option value="${escapeHtml(selected)}" selected>${escapeHtml(selected)}（已保存）</option>`);
  } else if (voiceApiSettings.engine === 'moss') {
    const voices = Array.isArray(voiceApiSettings.moss.voices) && voiceApiSettings.moss.voices.length
      ? voiceApiSettings.moss.voices
      : MOSS_OFFICIAL_VOICES;
    options.push(...voices.map((voice) => `<option value="${escapeHtml(voice.id)}" ${selected === voice.id ? 'selected' : ''}>${escapeHtml(voice.name || voice.id)}</option>`));
    if (selected && !voices.some((voice) => voice.id === selected)) options.push(`<option value="${escapeHtml(selected)}" selected>${escapeHtml(selected)}（已保存）</option>`);
  } else {
    if (globalVoice) options.push(`<option value="${escapeHtml(globalVoice)}" ${selected === globalVoice ? 'selected' : ''}>${escapeHtml(globalVoice)}</option>`);
    if (selected && selected !== globalVoice) options.push(`<option value="${escapeHtml(selected)}" selected>${escapeHtml(selected)}（已保存）</option>`);
  }
  return options.join('');
}

function siliconFlowVoiceId(settings, voiceOverride = '') {
  const model = String(settings.model || 'FunAudioLLM/CosyVoice2-0.5B').trim();
  const voice = String(voiceOverride || settings.voice || 'alex').trim();
  if (voice.startsWith('speech:') || voice.startsWith(`${model}:`)) return voice;
  return `${model}:${voice}`;
}

function collectSiliconFlowVoiceEntries(value, output = [], depth = 0) {
  if (depth > 5 || value == null) return output;
  if (Array.isArray(value)) {
    value.forEach((item) => collectSiliconFlowVoiceEntries(item, output, depth + 1));
    return output;
  }
  if (typeof value === 'string') {
    output.push({ id: value, name: value, model: '', text: '' });
    return output;
  }
  if (typeof value !== 'object') return output;

  const id = value.uri || value.id || value.voice_id || value.voiceId;
  if (id) {
    output.push({
      id: String(id),
      name: String(value.name || value.customName || value.custom_name || value.display_name || id),
      model: String(value.model || value.model_id || ''),
      text: String(value.text || value.reference_text || ''),
    });
    return output;
  }

  ['result', 'results', 'data', 'list', 'voices', 'items'].forEach((key) => {
    if (value[key] != null) collectSiliconFlowVoiceEntries(value[key], output, depth + 1);
  });
  return output;
}

function parseSiliconFlowVoices(data) {
  const seen = new Set();
  return collectSiliconFlowVoiceEntries(data).filter((voice) => {
    if (!voice.id || seen.has(voice.id)) return false;
    seen.add(voice.id);
    return true;
  });
}

function nativeHttpErrorMessage(response, fallback) {
  const data = response?.data;
  if (data && typeof data === 'object') {
    return data.message || data.error?.message || data.error || fallback;
  }
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return parsed.message || parsed.error?.message || parsed.error || data || fallback;
    } catch (_) {
      return data || fallback;
    }
  }
  return fallback;
}

async function nativeSiliconFlowRequest(settings, path, options = {}) {
  const http = nativeHttpPlugin();
  if (!http?.request) throw new Error('当前 App 缺少原生 HTTP 通道，请重新打包安装');
  const apiUrl = trimApiBase(settings.apiUrl, 'https://api.siliconflow.cn/v1');
  const apiKey = String(settings.apiKey || '').trim();
  if (!apiKey) throw new Error('请先填写硅基流动 API 密钥');
  const response = await http.request({
    url: `${apiUrl}${path}`,
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: options.accept || 'application/json',
      ...(options.data ? { 'Content-Type': 'application/json' } : {}),
    },
    data: options.data,
    responseType: options.responseType || 'json',
    connectTimeout: options.timeout || 45000,
    readTimeout: options.timeout || 45000,
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(nativeHttpErrorMessage(response, `硅基流动请求失败（${response.status}）`));
  }
  return response;
}

function nativeResponseJson(data) {
  if (data && typeof data === 'object') return data;
  if (typeof data !== 'string') return {};
  try {
    return JSON.parse(data);
  } catch (_) {
    return {};
  }
}

function hexAudioToBase64(hexAudio) {
  const hex = String(hexAudio || '').trim();
  if (!hex || hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex)) return hex;
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  const parts = [];
  for (let index = 0; index < bytes.length; index += 0x8000) {
    parts.push(String.fromCharCode(...bytes.subarray(index, index + 0x8000)));
  }
  return btoa(parts.join(''));
}

async function nativeMinimaxSpeech(settings, text, voiceOverride = '') {
  const http = nativeHttpPlugin();
  if (!http?.request) throw new Error('当前 App 缺少原生 HTTP 通道，请重新打包安装');
  const apiKey = String(settings.apiKey || '').trim();
  if (!apiKey) throw new Error('请先填写 MiniMax API Key');
  const spokenText = String(text || '').trim();
  if (!spokenText) throw new Error('缺少要朗读的文字');

  const host = normalizeMinimaxHost(settings.apiHost);
  const targets = [`${host}/v1/t2a_v2`];
  if (host === 'https://api.minimaxi.com') targets.push('https://api-bj.minimaxi.com/v1/t2a_v2');
  const speed = Math.min(2, Math.max(0.5, Number(settings.speed) || 1));
  const requestData = {
    model: String(settings.model || 'speech-02-hd'),
    text: spokenText,
    stream: false,
    voice_setting: {
      voice_id: String(voiceOverride || settings.voice || 'female-shaonv'),
      speed,
      vol: 1,
      pitch: 0,
    },
    audio_setting: { sample_rate: 32000, bitrate: 128000, format: 'mp3', channel: 1 },
    subtitle_enable: false,
  };

  let response = null;
  let lastNetworkError = null;
  for (let index = 0; index < targets.length; index += 1) {
    try {
      response = await http.request({
        url: targets[index],
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: requestData,
        responseType: 'json',
        connectTimeout: 45000,
        readTimeout: 45000,
      });
      if (Number(response.status) !== 404 || index === targets.length - 1) break;
    } catch (error) {
      lastNetworkError = error;
      if (index === targets.length - 1) throw error;
    }
  }
  if (!response) throw lastNetworkError || new Error('MiniMax 请求没有返回结果');

  const data = nativeResponseJson(response.data);
  if (Number(response.status) < 200 || Number(response.status) >= 300) {
    throw new Error(nativeHttpErrorMessage(response, `MiniMax 请求失败（${response.status}）`));
  }
  if (data?.base_resp && Number(data.base_resp.status_code) !== 0) {
    throw new Error(`MiniMax 错误 ${data.base_resp.status_code}：${data.base_resp.status_msg || '合成失败'}`);
  }
  const audio = hexAudioToBase64(data?.data?.audio);
  if (!audio) throw new Error('MiniMax 连接成功，但没有返回音频数据');
  return { audio, mimeType: 'audio/mpeg' };
}

function nativeHeaderValue(headers, name) {
  const target = String(name || '').toLowerCase();
  const entry = Object.entries(headers || {}).find(([key]) => String(key).toLowerCase() === target);
  return String(entry?.[1] || '');
}

function decodeBase64Utf8(value) {
  try {
    const binary = atob(String(value || ''));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch (_) {
    return '';
  }
}

async function nativeMossSpeech(settings, text, voiceOverride = '') {
  const http = nativeHttpPlugin();
  if (!http?.request) throw new Error('当前 App 缺少原生 HTTP 通道，请重新打包安装');
  const apiKey = String(settings.apiKey || '').trim();
  const voiceId = String(voiceOverride || settings.voiceId || '').trim();
  const spokenText = String(text || '').trim();
  if (!apiKey) throw new Error('请先填写 MOSS API Key');
  if (!voiceId) throw new Error('请先填写 MOSS voice_id');
  if (!spokenText) throw new Error('缺少要朗读的文字');

  const response = await http.request({
    url: `${trimApiBase(settings.apiHost, 'https://api.mosi.cn')}/v1/audio/speech`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'audio/*, application/json',
      'Content-Type': 'application/json',
    },
    data: {
      model: String(settings.model || 'moss-tts'),
      input: spokenText,
      voice_id: voiceId,
      response_format: settings.responseFormat === 'wav' ? 'wav' : 'mp3',
      delivery_method: 'audio',
    },
    responseType: 'arraybuffer',
    connectTimeout: 60000,
    readTimeout: 60000,
  });
  if (Number(response.status) < 200 || Number(response.status) >= 300) {
    throw new Error(nativeHttpErrorMessage(response, `MOSS 请求失败（${response.status}）`));
  }

  const contentType = nativeHeaderValue(response.headers, 'content-type').toLowerCase();
  if (contentType.includes('application/json')) {
    let data = response.data && typeof response.data === 'object' ? response.data : {};
    if (typeof response.data === 'string') {
      const jsonText = decodeBase64Utf8(response.data) || response.data;
      try { data = JSON.parse(jsonText); } catch (_) {}
    }
    if (!data?.url) throw new Error(data?.message || 'MOSS 返回 JSON 但没有音频 URL');
    const audioResponse = await http.request({
      url: String(data.url),
      method: 'GET',
      headers: { Accept: 'audio/*' },
      responseType: 'arraybuffer',
      connectTimeout: 60000,
      readTimeout: 60000,
    });
    if (Number(audioResponse.status) < 200 || Number(audioResponse.status) >= 300) {
      throw new Error(`MOSS 音频下载失败（${audioResponse.status}）`);
    }
    return {
      audio: audioResponse.data,
      mimeType: nativeHeaderValue(audioResponse.headers, 'content-type') || 'audio/mpeg',
    };
  }
  return {
    audio: response.data,
    mimeType: contentType || (settings.responseFormat === 'wav' ? 'audio/wav' : 'audio/mpeg'),
  };
}

async function nativeMossVoiceOptions(settings) {
  const http = nativeHttpPlugin();
  if (!http?.request) throw new Error('当前 App 缺少原生 HTTP 通道，请重新打包安装');
  const apiKey = String(settings.apiKey || '').trim();
  if (!apiKey) throw new Error('请先填写 MOSS API Key');
  const response = await http.request({
    url: `${trimApiBase(settings.apiHost, 'https://api.mosi.cn')}/v1/audio/voices?limit=150&status=ready`,
    method: 'GET',
    headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
    responseType: 'json',
    connectTimeout: 30000,
    readTimeout: 30000,
  });
  if (Number(response.status) < 200 || Number(response.status) >= 300) {
    throw new Error(nativeHttpErrorMessage(response, `获取 MOSS 音色失败（${response.status}）`));
  }
  const data = nativeResponseJson(response.data);
  const source = Array.isArray(data?.data) ? data.data : (Array.isArray(data?.voices) ? data.voices : []);
  return {
    voices: source.map((voice) => ({
      id: String(voice?.id || voice?.voice_id || '').trim(),
      name: String(voice?.name || voice?.display_name || voice?.voice_name || voice?.id || voice?.voice_id || '').trim(),
    })).filter((voice) => voice.id),
  };
}

async function nativeSiliconFlowVoiceOptions(settings, scope) {
  if (scope === 'models') {
    const response = await nativeSiliconFlowRequest(settings, '/models?type=audio');
    const data = response.data || {};
    const allAudioModels = Array.isArray(data.data) ? data.data : [];
    const models = allAudioModels
      .map((item) => typeof item === 'string' ? item : item?.id)
      .filter(Boolean)
      .filter((id) => /cosyvoice|moss-ttsd|indextts|fish[-_ ]?speech|tts/i.test(id))
      .filter((id) => !/sensevoice|transcri|\basr\b|whisper/i.test(id));
    return { models: [...new Set(models)], voices: [] };
  }
  const response = await nativeSiliconFlowRequest(settings, '/audio/voice/list');
  return { models: [], voices: parseSiliconFlowVoices(response.data || {}) };
}

function personaVoiceBindingsHtml() {
  return roles.map((role) => {
    ensurePersonaVersions(role);
    return `
      <section class="persona-voice-role" data-persona-voice-role="${escapeHtml(role.id)}">
        <header>
          <img src="${escapeHtml(role.avatar || '')}" alt="">
          <span><strong>${escapeHtml(roleDisplayName(role))}</strong><small>${escapeHtml(role.subtitle || '')}</small></span>
        </header>
        <div class="persona-voice-version-list">
          ${role.personaVersions.map((persona, index) => `
            <label class="persona-voice-version-row">
              <span><strong>${escapeHtml(persona.label || `人设 ${index + 1}`)}</strong><small>${index === 0 ? '主人设 · ' : ''}${persona.id === role.activePersonaId ? '当前使用' : '人设版本'}</small></span>
              <select data-persona-voice-role-id="${escapeHtml(role.id)}" data-persona-voice-id="${escapeHtml(persona.id)}" aria-label="${escapeHtml(`${roleDisplayName(role)} ${persona.label || `人设 ${index + 1}`} 绑定音色`)}">${personaVoiceOptionsHtml(persona.voiceId)}</select>
            </label>`).join('')}
        </div>
      </section>`;
  }).join('');
}

function bindPersonaVoiceBindingControls() {
  detailBody.querySelectorAll('[data-persona-voice-id]').forEach((select) => {
    select.addEventListener('change', () => {
      const role = roles.find((item) => item.id === select.dataset.personaVoiceRoleId);
      const persona = role?.personaVersions?.find((item) => item.id === select.dataset.personaVoiceId);
      if (!role || !persona) return;
      persona.voiceId = select.value;
      if (role.activePersonaId === persona.id) role.voiceId = persona.voiceId;
      generatedVoiceCache.clear();
      saveRolesToCache();
      showToast(`${roleDisplayName(role)} · ${persona.label} 音色已生效`);
    });
  });
}

function renderPersonaVoiceBindings() {
  const container = detailBody.querySelector('#personaVoiceBindings');
  if (!container) return;
  container.innerHTML = personaVoiceBindingsHtml();
  bindPersonaVoiceBindingControls();
}

function openVoiceApiDetail() {
  const current = voiceApiSettings.engine;
  const sf = voiceApiSettings.siliconflow;
  const volc = voiceApiSettings.volcano;
  const mm = voiceApiSettings.minimax;
  const moss = voiceApiSettings.moss;
  openDetail('语音API设置', `
    <div class="voice-api-page">
      <nav class="voice-engine-tabs" aria-label="语音平台">
        <button type="button" data-voice-engine="siliconflow" class="${current === 'siliconflow' ? 'is-active' : ''}">硅基流动</button>
        <button type="button" data-voice-engine="volcano" class="${current === 'volcano' ? 'is-active' : ''}">火山引擎</button>
        <button type="button" data-voice-engine="minimax" class="${current === 'minimax' ? 'is-active' : ''}">MiniMax</button>
        <button type="button" data-voice-engine="moss" class="${current === 'moss' ? 'is-active' : ''}">MOSS</button>
      </nav>

      <form id="voiceApiForm" class="voice-api-form">
        <section data-voice-panel="siliconflow" class="voice-engine-panel ${current === 'siliconflow' ? 'is-active' : ''}">
          <label>API 地址<input id="voiceSfUrl" value="${escapeHtml(sf.apiUrl)}"></label>
          <label>API 密钥<input id="voiceSfKey" class="api-secret-input" type="text" value="${escapeHtml(sf.apiKey)}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></label>
          <label><span class="voice-field-head"><span>TTS 模型</span><button type="button" class="voice-inline-refresh" id="refreshVoiceModels">刷新模型</button></span><input id="voiceSfModel" list="voiceSfModelList" value="${escapeHtml(sf.model)}"></label>
          <datalist id="voiceSfModelList"></datalist>
          <label><span class="voice-field-head"><span>语音角色 / 音色 ID</span><button type="button" class="voice-inline-refresh" id="refreshVoiceIds">刷新</button></span><select id="voiceSfVoice">${siliconFlowVoiceOptionsHtml(sf.voice, sf.customVoices)}</select></label>
          <p class="voice-section-hint" id="voiceOptionsHint">内置 8 个预设音色；刷新后会合并当前账号保存在硅基流动官方的克隆音色。</p>
        </section>

        <section data-voice-panel="volcano" class="voice-engine-panel ${current === 'volcano' ? 'is-active' : ''}">
          <label>AppID<input id="voiceVolcAppId" value="${escapeHtml(volc.appId)}"></label>
          <label>Access Token<input id="voiceVolcKey" class="api-secret-input" type="text" value="${escapeHtml(volc.accessKey)}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></label>
          <label>语音角色 / 复刻音色 ID<input id="voiceVolcSpeaker" value="${escapeHtml(volc.speaker)}"></label>
        </section>

        <section data-voice-panel="minimax" class="voice-engine-panel ${current === 'minimax' ? 'is-active' : ''}">
          <label>API 地址<select id="voiceMmHost">
            <option value="https://api.minimaxi.com" ${mm.apiHost === 'https://api.minimaxi.com' ? 'selected' : ''}>国内（api.minimaxi.com）</option>
            <option value="https://api-bj.minimaxi.com" ${mm.apiHost === 'https://api-bj.minimaxi.com' ? 'selected' : ''}>国内备用（api-bj.minimaxi.com）</option>
            <option value="https://api.minimax.io" ${mm.apiHost === 'https://api.minimax.io' ? 'selected' : ''}>国际（api.minimax.io）</option>
            <option value="https://api-uw.minimax.io" ${mm.apiHost === 'https://api-uw.minimax.io' ? 'selected' : ''}>国际加速（api-uw.minimax.io）</option>
          </select></label>
          <label>API Key<input id="voiceMmKey" class="api-secret-input" type="text" value="${escapeHtml(mm.apiKey)}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></label>
          <label>TTS 模型<select id="voiceMmModel">
            ${['speech-2.6-hd', 'speech-2.6-turbo', 'speech-02-hd', 'speech-02-turbo', 'speech-01-hd', 'speech-01-turbo'].map((model) => `<option ${mm.model === model ? 'selected' : ''}>${model}</option>`).join('')}
          </select></label>
          <label>语音角色 / 克隆音色 ID<input id="voiceMmVoice" value="${escapeHtml(mm.voice)}"></label>
          <div class="voice-speed-setting">
            <label>语速（手填 0.50～2.00）<input id="voiceMmSpeedNumber" type="number" inputmode="decimal" min="0.5" max="2" step="0.01" value="${Number(mm.speed || 1).toFixed(2)}"></label>
            <input id="voiceMmSpeed" class="voice-speed-display" type="range" min="0.5" max="2" step="0.01" value="${Number(mm.speed || 1)}" disabled tabindex="-1" aria-label="当前语速显示">
            <small>进度条仅显示当前语速，不能点击或拖动。</small>
          </div>
          <p class="voice-section-hint">新版 MiniMax T2A v2 不需要 GroupID；主地址不可用时会自动尝试北京备用地址。</p>
        </section>

        <section data-voice-panel="moss" class="voice-engine-panel ${current === 'moss' ? 'is-active' : ''}">
          <label>API 地址<input id="voiceMossHost" value="${escapeHtml(moss.apiHost)}" placeholder="https://api.mosi.cn"></label>
          <label>API Key<input id="voiceMossKey" class="api-secret-input" type="text" value="${escapeHtml(moss.apiKey)}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></label>
          <label>TTS 模型<input id="voiceMossModel" value="${escapeHtml(moss.model)}" placeholder="moss-tts"></label>
          <label><span class="voice-field-head"><span>语音角色 / voice_id</span><button type="button" class="voice-inline-refresh" id="refreshMossVoices">刷新音色</button></span><input id="voiceMossVoice" list="voiceMossVoiceList" value="${escapeHtml(moss.voiceId)}" placeholder="粘贴 Mossland 的 voice_id"></label>
          <datalist id="voiceMossVoiceList">${mossVoiceOptionsHtml(moss.voiceId, moss.voices)}</datalist>
          <label>音频格式<select id="voiceMossFormat"><option value="mp3" ${moss.responseFormat === 'mp3' ? 'selected' : ''}>mp3</option><option value="wav" ${moss.responseFormat === 'wav' ? 'selected' : ''}>wav</option></select></label>
          <p class="voice-section-hint">先测试连接或刷新音色。MOSS 朗读只接收 voice_id；官网克隆后复制音色卡片上的 voice_id 粘贴到这里。</p>
        </section>

        <p class="voice-api-status" id="voiceApiStatus" role="status">尚未测试</p>
        <audio id="voiceApiPreview" controls hidden></audio>
        <div class="voice-api-actions">
          <button type="button" id="testVoiceApi">测试连接并试听</button>
        </div>

        <details class="voice-settings-section">
          <summary>声音克隆</summary>
          <p class="voice-section-hint">此 App 目前仅支持在这里克隆硅基流动音色。MiniMax 与 MOSS 请在各自官网完成克隆，再把音色 ID / voice_id 填到上方。</p>
          <label>新音色 ID / 英文名称<input id="voiceCloneId" placeholder="例如 xiangliu_voice"></label>
          <label>参考音频对应文字<textarea id="voiceCloneText" rows="2" placeholder="准确填写音频里说的话"></textarea></label>
          <div class="voice-clone-file-row">
            <label class="voice-file-picker">参考音频<input id="voiceCloneFile" type="file" accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac"></label>
            <button type="button" class="voice-clone-preview-button" id="voiceClonePreviewToggle" disabled>播放</button>
          </div>
          <audio id="voiceClonePreview" preload="metadata" hidden></audio>
          <p class="voice-section-hint" id="voiceCloneFileHint">建议 8–10 秒，必须小于 30 秒；上传前可先试听。</p>
          <div class="voice-clone-actions">
            <button type="button" id="cloneVoiceButton">开始克隆声音</button>
            <button type="button" id="openDeleteClonedVoice">删除克隆语音</button>
          </div>
          <p class="voice-api-status" id="voiceCloneStatus" role="status"></p>
        </details>

        <details class="voice-settings-section persona-voice-settings" id="personaVoiceSettings">
          <summary>绑定角色</summary>
          <label class="toggle-row persona-voice-auto-read"><span><strong>AI 自动朗读</strong><small>开启后，AI 回复使用所属人设版本绑定的音色</small></span><input id="personaVoiceAutoRead" type="checkbox" ${voiceReadSettings.autoRead ? 'checked' : ''}></label>
          <p class="voice-section-hint">未绑定的人设版本继承上方全局音色；切换人设或多轮询时互不影响。</p>
          <div class="persona-voice-bindings" id="personaVoiceBindings">${personaVoiceBindingsHtml()}</div>
        </details>

        <details class="voice-settings-section">
          <summary>朗读设置 · 符号提取</summary>
          <label class="toggle-row"><span>只朗读引号内文字</span><input id="voiceExtractQuoted" type="checkbox" ${voiceReadSettings.extractQuoted ? 'checked' : ''}></label>
          <label>引号符号对<input id="voiceQuotePairs" value="${escapeHtml(voiceReadSettings.quotePairs)}" placeholder="“” 「」 『』"></label>
          <label class="toggle-row"><span>排除动作符号内文字</span><input id="voiceRemoveActions" type="checkbox" ${voiceReadSettings.removeActions ? 'checked' : ''}></label>
          <label>动作符号对<input id="voiceActionPairs" value="${escapeHtml(voiceReadSettings.actionPairs)}" placeholder="（） 【】 []"></label>
          <label>单次朗读字数上限<input id="voiceMaxChars" type="number" min="1" max="10000" value="${voiceReadSettings.maxChars}"></label>
        </details>
      </form>
    </div>
  `, {
    label: '保存',
    onClick: () => {
      saveVoiceApiForm();
      showToast('语音 API 设置已保存');
    },
  });
}

function openVoiceDetail() {
  openDetail('声音链接', `
    <div class="detail-card config-stack" data-config="voice">
      ${voiceLinks.map((voice, index) => `
        <div class="config-entry" data-index="${index}">
          <label>名称<input data-field="name" value="${escapeHtml(voice.name)}"></label>
          <label>声音服务/本地路径<input data-field="url" value="${escapeHtml(voice.url)}"></label>
        </div>
      `).join('')}
      <div class="detail-actions">
        <button type="button" id="addVoiceLink">新增声音</button>
        <button type="button" id="saveVoiceLinks">保存声音</button>
      </div>
    </div>
  `);
}

function openUserProfileDetail() {
  loadUserIdentities();
  openDetail('用户身份', buildUserIdentityListHtml(), {
    label: '+新建',
    onClick: () => addUserIdentity(),
  });
  bindUserIdentityEvents();
}

function buildUserIdentityListHtml(filter = '') {
  const term = filter.trim().toLowerCase();
  const rows = userIdentities
    .filter((u) => {
      if (!term) return true;
      return (u.name || '').toLowerCase().includes(term) || (u.persona || '').toLowerCase().includes(term);
    })
    .map((u) => {
      const isActive = u.id === activeUserIdentityId;
      const isEditing = u.id === editingUserIdentityId;
      const desc = (u.persona || '').slice(0, 42).replace(/\n/g, ' ') || '点击编辑填写人设';
      return `
        <div class="identity-row${isActive ? ' is-active' : ''}${isEditing ? ' is-editing' : ''}" data-id="${escapeHtml(u.id)}">
          <button class="identity-avatar-btn" type="button" aria-label="编辑时可上传头像" title="长按头像上下移动 · 编辑后可上传">
            <img class="identity-avatar-img" src="${escapeHtml(u.avatar || '')}" alt="" style="${u.avatar ? '' : 'display:none'}">
            <span class="identity-avatar-placeholder" style="${u.avatar ? 'display:none' : ''}">+</span>
          </button>
          <input class="identity-avatar-input file-input" type="file" accept="image/*">
          <div class="identity-body">
            <div class="identity-name-line">
              <strong class="identity-name-display">${escapeHtml(u.name || '用户')}</strong>
              <input class="identity-name-input" type="text" value="${escapeHtml(u.name || '用户')}" autocomplete="off" placeholder="姓名/昵称">
              ${isActive ? '<span class="identity-badge" role="button" tabindex="0" title="当前默认身份">默认</span>' : '<span class="identity-badge identity-badge--set" role="button" tabindex="0" title="点击设为默认">设为默认</span>'}
            </div>
            <small class="identity-hint">${escapeHtml(desc)}${desc.length >= 42 ? '…' : ''}</small>
            <div class="identity-persona-panel">
              <div class="identity-persona-head">用户人设 <small class="token-count identity-persona-tokens">约 ${estimateTokens(u.persona)} tokens</small></div>
              <textarea class="identity-persona-input" rows="3" placeholder="描述这个用户的性格、身份、喜好…">${escapeHtml(u.persona || '')}</textarea>
            </div>
          </div>
          <div class="identity-actions">
            <button class="identity-copy-btn" type="button">复制</button>
            <button class="identity-edit-btn" type="button">${isEditing ? '保存' : '编辑'}</button>
            <button class="identity-delete-btn" type="button">删除</button>
          </div>
        </div>
      `;
    });
  return `
    <div class="user-identity-page">
      <div class="ui-search-row">
        <input type="search" class="ui-search" id="userIdentitySearch" placeholder="搜索用户身份" value="${escapeHtml(filter)}">
      </div>
      <div class="identity-list" id="userIdentityList">
        ${rows.join('') || '<p class="identity-empty">没有匹配的用户身份</p>'}
      </div>
    </div>
  `;
}

function renderUserIdentityList() {
  const searchInput = detailBody.querySelector('#userIdentitySearch');
  const list = detailBody.querySelector('#userIdentityList');
  if (!list) return;
  const filter = searchInput ? searchInput.value : '';
  list.innerHTML = '';
  const html = buildUserIdentityListHtml(filter);
  // 只取 identity-list 里的内容替换
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const newList = temp.querySelector('#userIdentityList');
  if (newList) {
    list.replaceWith(newList);
    bindUserIdentityEvents();
  }
}

function bindUserIdentityEvents() {
  const searchInput = detailBody.querySelector('#userIdentitySearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderUserIdentityList();
    });
  }

  detailBody.querySelectorAll('.identity-row').forEach((row) => {
    const id = row.dataset.id;
    const avatarBtn = row.querySelector('.identity-avatar-btn');
    const fileInput = row.querySelector('.identity-avatar-input');
    const nameInput = row.querySelector('.identity-name-input');
    const personaInput = row.querySelector('.identity-persona-input');
    const tokenCount = row.querySelector('.identity-persona-tokens');
    const setDefaultBadge = row.querySelector('.identity-badge--set');
    const copyBtn = row.querySelector('.identity-copy-btn');
    const editBtn = row.querySelector('.identity-edit-btn');
    const deleteBtn = row.querySelector('.identity-delete-btn');

    // 头像：编辑态 = 上传头像入口；非编辑态 = 拖拽整行的手柄
    if (avatarBtn) avatarBtn.style.touchAction = 'none';

    avatarBtn?.addEventListener('click', (event) => {
      event.stopPropagation();
      clearLongPress();
      if (!row.classList.contains('is-editing')) return;
      fileInput?.click();
    });

    // 拖拽排序：Pointer Events 自己实现
    // HTML5 drag 在移动 WebView 里体验很差（需要等浏览器决策，且有时根本不触发），
    // 这里用 pointerdown/move/up 直接驱动，顺滑且可控。
    const moveDraggedIdentity = (event) => {
      const state = dragStateById.get(id);
      if (!state || event.pointerId !== state.pointerId) return;
      event.preventDefault();
      state.ghost.style.top = `${event.clientY - state.grabOffset}px`;

      // 指针靠近内容区上下边缘时轻柔滚动，长列表也能一次拖到目标位置。
      const scrollerRect = detailBody.getBoundingClientRect();
      const edge = Math.min(64, scrollerRect.height * .18);
      if (event.clientY < scrollerRect.top + edge) detailBody.scrollBy(0, -10);
      else if (event.clientY > scrollerRect.bottom - edge) detailBody.scrollBy(0, 10);

      // 原行只负责占位，浮动副本只负责跟手；越过另一行中心时交换位置。
      const rowCenter = event.clientY - state.grabOffset + state.height / 2;
      const siblings = [...state.list.querySelectorAll('.identity-row')].filter((item) => item !== row);
      let insertBeforeNode = null;
      for (const sibling of siblings) {
        const siblingRect = sibling.getBoundingClientRect();
        if (siblingRect.top + siblingRect.height / 2 > rowCenter) {
          insertBeforeNode = sibling;
          break;
        }
      }
      if (insertBeforeNode) state.list.insertBefore(row, insertBeforeNode);
      else if (siblings.length) state.list.append(row);
    };

    const endDrag = (event) => {
      const state = dragStateById.get(id);
      if (!state || (event.pointerId != null && event.pointerId !== state.pointerId)) return;
      dragStateById.delete(id);
      window.removeEventListener('pointermove', moveDraggedIdentity, { capture: true });
      window.removeEventListener('pointerup', endDrag, { capture: true });
      window.removeEventListener('pointercancel', endDrag, { capture: true });
      window.removeEventListener('blur', endDrag);
      state.ghost.remove();
      row.classList.remove('identity-drag-placeholder');
      avatarBtn?.classList.remove('is-dragging');
      document.body.classList.remove('is-reordering');
      try { avatarBtn?.releasePointerCapture(state.pointerId); } catch (_) {}
      if (event.type === 'pointercancel') {
        const rowsById = new Map([...state.list.querySelectorAll('.identity-row')].map((item) => [item.dataset.id, item]));
        state.originalOrder.forEach((rowId) => {
          const item = rowsById.get(rowId);
          if (item) state.list.append(item);
        });
      }
      // 以 DOM 顺序为准重排数据。搜索时只重排当前可见身份。
      const order = [...state.list.querySelectorAll('.identity-row')].map((item) => item.dataset.id);
      const visibleIds = new Set(order);
      const identityById = new Map(userIdentities.map((identity) => [identity.id, identity]));
      const reorderedVisible = order.map((rowId) => identityById.get(rowId)).filter(Boolean);
      let visibleIndex = 0;
      userIdentities.forEach((identity, index) => {
        if (visibleIds.has(identity.id)) userIdentities[index] = reorderedVisible[visibleIndex++];
      });
      saveUserIdentities();
      renderUserIdentityList();
    };

    const startIdentityDrag = ({ clientY, pointerId, capturePointer = false } = {}) => {
      if (row.classList.contains('is-editing') || dragStateById.has(id)) return;
      const rect = row.getBoundingClientRect();
      const ghost = row.cloneNode(true);
      ghost.classList.remove('is-grabbing');
      ghost.classList.add('identity-drag-ghost');
      ghost.removeAttribute('data-id');
      ghost.setAttribute('aria-hidden', 'true');
      Object.assign(ghost.style, {
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      });
      document.body.append(ghost);
      dragStateById.set(id, {
        pointerId,
        grabOffset: clientY - rect.top,
        height: rect.height,
        list: row.parentElement,
        ghost,
        originalOrder: [...row.parentElement.querySelectorAll('.identity-row')].map((item) => item.dataset.id),
      });
      row.classList.add('identity-drag-placeholder');
      avatarBtn.classList.add('is-dragging');
      document.body.classList.add('is-reordering');
      if (capturePointer) {
        try { avatarBtn.setPointerCapture(pointerId); } catch (_) {}
        window.addEventListener('pointermove', moveDraggedIdentity, { capture: true, passive: false });
        window.addEventListener('pointerup', endDrag, { once: true, capture: true });
        window.addEventListener('pointercancel', endDrag, { once: true, capture: true });
      }
      window.addEventListener('blur', endDrag, { once: true });
      try { navigator.vibrate?.(12); } catch (_) {}
    };

    avatarBtn?.addEventListener('pointerdown', (event) => {
      // 安卓 WebView 的触摸拖拽改走下方原生 Touch Events；否则部分机型会在
      // 长按后直接发 pointercancel，造成浮层刚出现就消失。
      if (event.pointerType === 'touch') return;
      if (event.button != null && event.button > 0) return;
      if (row.classList.contains('is-editing')) return;   // 编辑态不允许拖动
      event.preventDefault();
      startIdentityDrag({ clientY: event.clientY, pointerId: event.pointerId, capturePointer: true });
    });
    avatarBtn?.addEventListener('pointermove', moveDraggedIdentity, { passive: false });
    avatarBtn?.addEventListener('pointerup', endDrag);
    avatarBtn?.addEventListener('pointercancel', endDrag);
    avatarBtn?.addEventListener('lostpointercapture', endDrag);

    // Android WebView 专用长按拖拽兜底。按住 320ms 后才提起整行；按住期间
    // 若先移动超过 9px，则视为普通手势并取消，避免页面滚动时误拖。
    let touchLongPressTimer = null;
    let pendingTouch = null;
    const clearPendingTouch = () => {
      if (touchLongPressTimer) window.clearTimeout(touchLongPressTimer);
      touchLongPressTimer = null;
    };
    const touchPointerId = (identifier) => 100000 + Number(identifier || 0);
    const findTrackedTouch = (touches) => {
      if (!pendingTouch) return null;
      return [...(touches || [])].find((touch) => touch.identifier === pendingTouch.identifier) || null;
    };
    const moveIdentityTouch = (event) => {
      const touch = findTrackedTouch(event.touches);
      if (!touch || !pendingTouch) return;
      const pointerId = touchPointerId(pendingTouch.identifier);
      if (!dragStateById.has(id)) {
        if (Math.hypot(touch.clientX - pendingTouch.startX, touch.clientY - pendingTouch.startY) > 9) {
          clearPendingTouch();
        }
        return;
      }
      event.preventDefault();
      moveDraggedIdentity({
        pointerId,
        clientY: touch.clientY,
        preventDefault: () => event.preventDefault(),
      });
    };
    const endIdentityTouch = (event) => {
      if (!pendingTouch) return;
      const pointerId = touchPointerId(pendingTouch.identifier);
      clearPendingTouch();
      window.removeEventListener('touchmove', moveIdentityTouch, { capture: true });
      window.removeEventListener('touchend', endIdentityTouch, { capture: true });
      window.removeEventListener('touchcancel', endIdentityTouch, { capture: true });
      const wasCancelled = event.type === 'touchcancel';
      pendingTouch = null;
      if (dragStateById.has(id)) endDrag({ pointerId, type: wasCancelled ? 'pointercancel' : 'touchend' });
    };
    avatarBtn?.addEventListener('touchstart', (event) => {
      if (row.classList.contains('is-editing') || event.touches.length !== 1) return;
      const touch = event.touches[0];
      event.preventDefault();
      pendingTouch = { identifier: touch.identifier, startX: touch.clientX, startY: touch.clientY };
      clearPendingTouch();
      touchLongPressTimer = window.setTimeout(() => {
        if (!pendingTouch) return;
        startIdentityDrag({
          clientY: pendingTouch.startY,
          pointerId: touchPointerId(pendingTouch.identifier),
          capturePointer: false,
        });
      }, 320);
      window.addEventListener('touchmove', moveIdentityTouch, { capture: true, passive: false });
      window.addEventListener('touchend', endIdentityTouch, { capture: true, passive: false });
      window.addEventListener('touchcancel', endIdentityTouch, { capture: true, passive: false });
    }, { passive: false });

    // 头像文件选择：实时保存头像
    fileInput?.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const dataUrl = await readImageFile(file);
      const identity = userIdentities.find((u) => u.id === id);
      if (identity) {
        identity.avatar = dataUrl;
        saveUserIdentities();
        renderUserIdentityList();
        updateUserIdentityRow();
      }
    });

    // 名字旁的"设为默认"徽章：点击切换默认身份
    setDefaultBadge?.addEventListener('click', (event) => {
      event.stopPropagation();
      setActiveUserIdentity(id);
      renderUserIdentityList();
    });

    // 复制按钮：复制当前身份（含头像/姓名/人设），自动进入编辑态让用户改名
    copyBtn?.addEventListener('click', (event) => {
      event.stopPropagation();
      copyUserIdentity(id);
    });

    // 编辑 / 保存按钮：toggle 编辑态
    editBtn?.addEventListener('click', (event) => {
      event.stopPropagation();
      const willEdit = !row.classList.contains('is-editing');
      if (willEdit) {
        // 进入编辑：保存当前状态、切换 class、按钮文字
        editingUserIdentityId = id;
        row.classList.add('is-editing');
        editBtn.textContent = '保存';
      } else {
        // 保存并退出编辑
        const identity = userIdentities.find((u) => u.id === id);
        if (identity) {
          identity.name = nameInput?.value.trim() || identity.name || '用户';
          identity.persona = personaInput?.value.trim() || '';
          saveUserIdentities();
          updateUserIdentityRow();
          showToast('用户身份已保存');
        }
        editingUserIdentityId = '';
        row.classList.remove('is-editing');
        editBtn.textContent = '编辑';
        renderUserIdentityList();
      }
    });

    // 实时 token 数（仅编辑态触发）
    personaInput?.addEventListener('input', () => {
      if (tokenCount) tokenCount.textContent = `约 ${estimateTokens(personaInput.value)} tokens`;
    });

    // 删除按钮
    deleteBtn?.addEventListener('click', (event) => {
      event.stopPropagation();
      deleteUserIdentity(id);
    });
  });
  // 注：用户身份改用 Pointer Events 自己实现拖拽，不再走 attachDragLift / HTML5 drag
}

/**
 * 给可拖拽行加"按住微微放大"的抓取反馈（lift effect）。
 * HTML5 drag 的 ghost 是在 dragstart 那一刻对元素拍的快照，
 * 所以放大必须在 pointerdown 阶段就应用，拖起来的 ghost 才会是放大的。
 *
 * @param {NodeList|Array<HTMLElement>} rows   可拖拽的行
 * @param {string} handleSelector  只有按在这个选择器内才算"抓起"。
 *                                 留空 = 整行可拖（此时会跳过按钮/输入框等交互元素）
 */
function attachDragLift(rows, handleSelector = '') {
  const INTERACTIVE = 'button,input,textarea,select,a,label';
  rows.forEach((row) => {
    const triggers = handleSelector ? [...row.querySelectorAll(handleSelector)] : [row];
    triggers.forEach((trigger) => {
      trigger.addEventListener('pointerdown', (event) => {
        if (!handleSelector && event.target.closest(INTERACTIVE)) return;
        row.classList.add('is-grabbing');
      });
    });
    const release = () => row.classList.remove('is-grabbing');
    row.addEventListener('pointerup', release);
    row.addEventListener('pointercancel', release);
    row.addEventListener('dragstart', () => {
      row.classList.remove('is-grabbing');
      row.classList.add('is-dragging');
    });
    row.addEventListener('dragend', () => {
      row.classList.remove('is-grabbing');
      row.classList.remove('is-dragging');
    });
  });
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function openUserIdentityContextMenu(id, anchor) {
  const isSameOpen = document.querySelector('.user-identity-context-menu')?.dataset.identityId === id;
  if (isSameOpen) {
    closeUserIdentityContextMenu();
    return;
  }
  closeTransientActionMenus();
  const menu = document.createElement('div');
  menu.className = 'user-identity-context-menu';
  menu.dataset.identityId = id;
  menu.setAttribute('role', 'menu');
  menu.innerHTML = `
    <button type="button" data-action="up">↑ 上移</button>
    <button type="button" data-action="down">↓ 下移</button>
    <button type="button" data-action="delete" class="danger">删除</button>
  `;
  document.body.append(menu);
  registerTransientActionMenu('user-identity-context', {
    menu,
    anchor,
    owner: detailPage,
    close: closeUserIdentityContextMenu,
    align: 'center',
    width: 120,
    height: 120,
  });

  menu.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      closeUserIdentityContextMenu();
      if (action === 'up') moveUserIdentity(id, -1);
      if (action === 'down') moveUserIdentity(id, 1);
      if (action === 'delete') deleteUserIdentity(id);
    });
  });
}

function closeUserIdentityContextMenu() {
  document.querySelector('.user-identity-context-menu')?.remove();
  unregisterTransientActionMenu('user-identity-context');
}

function openModelDetail() {
  openDetail('全局模型', buildModelSettingsHtml(), [
    {
      label: '恢复默认',
      onClick: () => {
        Object.assign(modelSettings, MODEL_DEFAULTS);
        saveApiCache();
        openModelDetail();
        showToast('已恢复默认设置');
      },
    },
    {
      label: '保存',
      onClick: () => {
        saveApiCache();
        renderMoreSettings();
        showToast('全局模型设置已保存');
      },
    },
  ]);
  detailTitle.innerHTML = `
    <span>全局模型</span>
    <label class="global-model-header-switch" title="关闭后不发送全局推理参数">
      <input id="globalModelEnabled" type="checkbox" ${modelSettings.enabled ? 'checked' : ''}>
      <span class="model-switch-track"></span>
    </label>`;
  detailBody.querySelectorAll('[data-model-field], [data-model-field-number]').forEach((input) => { input.disabled = !modelSettings.enabled; });
  // 双向同步：slider 拖动时同步 number input + 值显示；number input 输入时同步 slider + 值显示
  detailBody.querySelectorAll('[data-model-field], [data-model-field-number]').forEach((input) => {
    if (input.type === 'range') {
      updateSliderFill(input);
      input.addEventListener('input', () => {
        updateSliderFill(input);
        const numberInput = detailBody.querySelector(`[data-model-field-number="${input.dataset.modelField}"]`);
        if (numberInput) numberInput.value = input.value;
      });
    } else if (input.type === 'number') {
      input.addEventListener('input', () => {
        const value = Number(input.value);
        if (Number.isNaN(value)) return;
        const slider = detailBody.querySelector(`[data-model-field="${input.dataset.modelFieldNumber}"]`);
        if (slider) {
          slider.value = value;
          updateSliderFill(slider);
        }
      });
    }
  });
  detailTitle.querySelector('#globalModelEnabled')?.addEventListener('change', (event) => {
    modelSettings.enabled = event.currentTarget.checked;
    detailBody.querySelector('.model-settings-page')?.classList.toggle('is-disabled', !modelSettings.enabled);
    detailBody.querySelectorAll('[data-model-field]').forEach((input) => { input.disabled = !modelSettings.enabled; });
    saveApiCache();
    renderMoreSettings();
    showToast(modelSettings.enabled ? '全局模型设置已启用' : '全局模型设置已关闭');
  });
}

function buildModelSettingsHtml() {
  const card = (rows) => `<div class="model-card">${rows.join('')}</div>`;
  // 全局独有条目（不是模型推理参数）：仅 historyLimit。模型推理参数统一走 renderModelParameters
  const localRow = ({ key, label, desc, suggestion, min, max, step }) => `
    <div class="model-row">
      <strong class="model-row-title">${label}</strong>
      <div class="model-row-desc">${desc}</div>
      ${suggestion ? `<div class="model-row-suggestion"><span>推荐</span> ${suggestion}</div>` : ''}
      <div class="model-slider-line">
        <input type="range" class="model-slider" data-model-field="${key}"
               min="${min}" max="${max}" step="${step}" value="${modelSettings[key]}">
        <span class="model-value" data-model-value="${key}">${modelSettings[key]}</span>
      </div>
    </div>
  `;
  const streamRow = `
    <div class="model-row model-row-toggle">
      <div class="model-row-head">
        <div>
          <strong class="model-row-title">流式传输</strong>
          <div class="model-row-desc">角色开始回应时立即逐字显示</div>
        </div>
        <label class="model-switch">
          <input type="checkbox" data-model-field="stream" ${modelSettings.stream ? 'checked' : ''}>
          <span class="model-switch-track"></span>
        </label>
      </div>
    </div>
  `;
  return `
    <div class="model-settings-page${modelSettings.enabled ? '' : ' is-disabled'}">
      <p class="model-global-note">总开关关闭后，不会向 AI 发送任何全局推理参数；模型专用参数仍可单独生效。</p>
      ${card([
        localRow({ key: 'historyLimit', label: '记忆长度',
          desc: `仅发送最后 ${modelSettings.historyLimit} 条历史消息给模型，作为角色短期记忆`,
          min: 10, max: 200, step: 1 }),
      ])}
      ${renderModelParameters({
        values: {
          temperature: modelSettings.temperature,
          topP: modelSettings.topP,
          topK: modelSettings.topK,
          repetitionPenalty: modelSettings.repetitionPenalty,
          frequencyPenalty: modelSettings.frequencyPenalty,
          presencePenalty: modelSettings.presencePenalty,
          maxTokens: modelSettings.maxTokens,
        },
        inputName: 'model-field',
        disabled: !modelSettings.enabled,
        showNumberInput: true,
        grouped: true,
      })}
      ${card([streamRow])}
      <details class="model-reference-card">
        <summary>各大模型参数调整参考表</summary>
        <p>以下是聊天/角色扮演的稳妥起点；供应商和具体模型可能忽略不支持的参数。</p>
        <div class="model-reference-scroll">
          <table>
            <thead><tr><th>模型系列</th><th>温度</th><th>Top-P</th><th>Top-K</th><th>建议</th></tr></thead>
            <tbody>
              <tr><td>OpenAI / 兼容</td><td>默认 1</td><td>默认 1</td><td>不发送</td><td>通常只调温度或 Top-P 之一；先确认具体模型支持</td></tr>
              <tr><td>Claude Opus 4.7+</td><td>不发送</td><td>不发送</td><td>不发送</td><td>新版不支持采样参数，非默认值可能报 400</td></tr>
              <tr><td>Gemini 3.5/3.6+</td><td>不发送</td><td>不发送</td><td>不发送</td><td>新版已弃用采样参数，优先用“无参数”</td></tr>
              <tr><td>DeepSeek API</td><td>默认 1</td><td>默认 1</td><td>不发送</td><td>温度与 Top-P 二选一；词频/存在惩罚已弃用</td></tr>
              <tr><td>Qwen / 通义</td><td>多数默认 0.8</td><td>多数默认 0.8</td><td>多数默认 20</td><td>不同系列差异明显，思考模型优先保留默认值</td></tr>
              <tr><td>本地模型</td><td>0.7–1.0</td><td>0.9–0.95</td><td>20–50</td><td>优先遵循模型卡/推理后端建议</td></tr>
            </tbody>
          </table>
        </div>
        <ul>
          <li><b>Top-K 当前默认值：20。</b>若希望不发送可手动改回 0，App 会把 0 当作"不发送 top_k"，由模型服务自行决定。</li>
          <li><b>Repetition Penalty 默认 1.1。</b>同理，把滑块拉到 1.0 可彻底关闭；&gt;1.0 才会被发送到上游。</li>
          <li>温度越高越自由；Top-P / Top-K 越低越收敛。不要一次大幅调整多个采样参数。</li>
          <li>频率惩罚减少重复措辞；存在惩罚鼓励谈及新内容。多数角色聊天可先保持不发送。</li>
        </ul>
      </details>
      <button type="button" class="model-save-button" id="saveModelSettings">保存全局模型设置</button>
    </div>
  `;
}

function updateSliderFill(input) {
  const min = Number(input.min) || 0;
  const max = Number(input.max) || 100;
  const val = Number(input.value) || 0;
  const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
  input.style.setProperty('--fill', `${pct}%`);
}

function handleAddPreset() {
  const preset = ensurePresetPromptManagerData({
    id: `preset-${Date.now()}`,
    name: '新预设',
    mainPrompt: '',
    userIdentity: '',
    charSetting: '',
    charPersonality: '',
    scenario: '',
    chatExample: '',
    jailbreak: '',
    active: false,
  });
  presets.push(preset);
  selectedPresetId = preset.id;
  saveAppStateToCache();
  openPresetDetail();
}

function selectedPreset() {
  return presets.find((preset) => preset.id === selectedPresetId) || activePreset() || presets[0] || null;
}

function duplicateSelectedPreset() {
  const source = selectedPreset();
  if (!source) return;
  const copy = JSON.parse(JSON.stringify(source));
  copy.id = `preset-copy-${Date.now()}`;
  copy.name = `${source.name} - 副本`;
  copy.active = false;
  delete copy.systemDefault;
  presets.push(copy);
  selectedPresetId = copy.id;
  saveAppStateToCache();
  openPresetDetail();
}

function deleteSelectedPreset() {
  const preset = selectedPreset();
  if (preset?.systemDefault === true) {
    showToast('默认预设不能删除，可以先复制一份再修改');
    return;
  }
  if (!preset || !confirm(`删除预设“${preset.name}”？`)) return;
  const index = presets.indexOf(preset);
  presets.splice(index, 1);
  if (!presets.length) handleAddPreset();
  selectedPresetId = presets[Math.max(0, index - 1)]?.id || presets[0]?.id || '';
  if (!presets.some((item) => item.active) && presets[0]) presets[0].active = true;
  saveAppStateToCache();
  renderMoreSettings();
  openPresetDetail();
}

function exportSelectedPreset() {
  savePresetsFromDetail(false);
  const preset = selectedPreset();
  exportJsonFile(`${preset?.name || '相思预设'}.json`, buildSillyTavernPreset(preset));
  showToast('预设已导出');
}

function openPresetActionMenu(anchor) {
  if (!selectedPreset()) return;
  openTransientMenu('preset-action', anchor, detailBody, [
    { label: '导出预设', onClick: exportSelectedPreset },
    { label: '导入预设', onClick: () => importPresetFile() },
    { label: '复制预设', onClick: duplicateSelectedPreset },
    { label: '删除预设', danger: true, onClick: deleteSelectedPreset },
  ]);
}

function duplicatePromptRow(row) {
  savePresetsFromDetail(false);
  const preset = selectedPreset();
  const identifier = row?.dataset.promptId;
  const source = preset?.promptBlocks.find((item) => item.identifier === identifier);
  if (!preset || !source) return;
  const copy = JSON.parse(JSON.stringify(source));
  copy.identifier = `${source.identifier}-copy-${Date.now()}`;
  copy.name = `${source.name} 副本`;
  preset.promptBlocks.splice(preset.promptBlocks.indexOf(source) + 1, 0, copy);
  const orderIndex = preset.promptOrder.findIndex((item) => item.identifier === source.identifier);
  preset.promptOrder.splice(orderIndex + 1, 0, { identifier: copy.identifier, enabled: true });
  saveAppStateToCache();
  openPresetDetail();
  showToast(`已复制：${copy.name}`);
}

function deletePromptRow(row) {
  savePresetsFromDetail(false);
  const preset = selectedPreset();
  const identifier = row?.dataset.promptId;
  const block = preset?.promptBlocks.find((item) => item.identifier === identifier);
  if (!preset || !block) return;
  if (block.marker) {
    showToast('变量条目常驻，不能删除，只能关闭启用');
    return;
  }
  if (!confirm(`删除提示词“${block.name || block.identifier}”？删除后无法恢复。`)) return;
  preset.promptBlocks = preset.promptBlocks.filter((item) => item.identifier !== identifier);
  preset.promptOrder = preset.promptOrder.filter((item) => item.identifier !== identifier);
  saveAppStateToCache();
  openPresetDetail();
  showToast('提示词已删除');
}


// 取消：把该条目编辑区的控件恢复为已保存的值，然后收起编辑区。
function resetPromptRowEditor(row) {
  const block = selectedPreset()?.promptBlocks.find((item) => item.identifier === row?.dataset.promptId);
  if (!row || !block) return;
  const set = (field, value) => {
    const control = row.querySelector(`[data-prompt-field="${field}"]`);
    if (!control) return;
    if (control.type === 'checkbox') control.checked = value === true;
    else control.value = value;
  };
  if (!block.marker) set('name', block.name || block.identifier);
  set('role', block.role || 'system');
  set('injectionPosition', Number(block.injectionPosition || 0));
  set('injectionDepth', Number(block.injectionDepth ?? 4));
  set('injectionOrder', Number(block.injectionOrder ?? 100));
  set('forbidOverrides', block.forbidOverrides === true);
  if (!block.marker) set('content', block.content || '');
  row.classList.remove('is-editing');
}

// 保存：复用整页保存逻辑静默写回，再同步标题并收起编辑区。
function savePromptRowEditor(row) {
  if (!row) return;
  savePresetsFromDetail(false);
  const block = selectedPreset()?.promptBlocks.find((item) => item.identifier === row.dataset.promptId);
  const title = row.querySelector('.st-prompt-title b');
  if (block && title && !block.marker) title.textContent = block.name || block.identifier;
  row.classList.remove('is-editing');
  showToast('提示词已保存');
}

function buildSillyTavernPreset(preset = selectedPreset()) {
  ensurePresetPromptManagerData(preset);
  const prompts = (preset?.promptBlocks || []).map((block) => ({
    ...(block.raw || {}),
    identifier: block.identifier,
    name: block.name,
    role: block.role || 'system',
    content: block.content || '',
    marker: block.marker === true,
    system_prompt: block.systemPrompt === true,
    ...(block.injectionPosition != null ? { injection_position: Number(block.injectionPosition) } : {}),
    ...(block.injectionDepth != null ? { injection_depth: Number(block.injectionDepth) } : {}),
    ...(block.injectionOrder != null ? { injection_order: Number(block.injectionOrder) } : {}),
    ...(block.forbidOverrides === true ? { forbid_overrides: true } : {}),
    ...(Array.isArray(block.injectionTrigger) && block.injectionTrigger.length ? { injection_trigger: [...block.injectionTrigger] } : {}),
  }));
  const order = (preset?.promptOrder || []).map((item) => ({ identifier: item.identifier, enabled: item.enabled !== false }));
  return {
    ...(preset?.rawPreset || {}),
    name: preset?.name || '相思预设',
    prompts,
    prompt_order: [{ character_id: 100001, order }],
    new_chat_prompt: preset?.newChatPrompt || '',
    new_example_chat_prompt: preset?.newExampleChatPrompt || '',
  };
}

function normalizeImportedPreset(data, fileName = '导入预设.json') {
  if (!data || typeof data !== 'object' || !Array.isArray(data.prompts) || !Array.isArray(data.prompt_order)) {
    throw new Error('不是可识别的酒馆预设（缺少 prompts 或 prompt_order）');
  }
  const orderGroup = data.prompt_order.find((group) => Array.isArray(group?.order));
  if (!orderGroup) throw new Error('预设里没有可用的 prompt_order');
  const promptBlocks = data.prompts
    .filter((block) => block && block.identifier)
    .map((block) => ({
      raw: JSON.parse(JSON.stringify(block)),
      identifier: String(block.identifier),
      name: block.name || block.identifier,
      role: ['system', 'user', 'assistant'].includes(block.role) ? block.role : 'system',
      content: typeof block.content === 'string' ? block.content : '',
      marker: block.marker === true,
      systemPrompt: block.system_prompt === true,
      injectionPosition: block.injection_position,
      injectionDepth: block.injection_depth,
      injectionOrder: block.injection_order,
      forbidOverrides: block.forbid_overrides === true,
      injectionTrigger: Array.isArray(block.injection_trigger) ? block.injection_trigger : [],
    }));
  const availableIds = new Set(promptBlocks.map((block) => block.identifier));
  const promptOrder = orderGroup.order
    .filter((item) => item?.identifier && availableIds.has(String(item.identifier)))
    .map((item) => ({ identifier: String(item.identifier), enabled: item.enabled !== false }));
  if (!promptOrder.length) throw new Error('prompt_order 没有匹配到任何提示词');
  const cleanFileName = fileName.replace(/\.json$/i, '');
  return {
    id: `preset-import-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name: data.name || cleanFileName,
    active: true,
    importedFormat: 'sillytavern-preset',
    importedFileName: fileName,
    rawPreset: JSON.parse(JSON.stringify(data)),
    promptBlocks,
    promptOrder,
    newChatPrompt: data.new_chat_prompt || '',
    newExampleChatPrompt: data.new_example_chat_prompt || '',
    mainPrompt: '',
    userIdentity: '',
    charSetting: '',
    charPersonality: '',
    scenario: '',
    chatExample: '',
    jailbreak: '',
  };
}

function importPresetFile() {
  const picker = document.createElement('input');
  picker.type = 'file';
  picker.accept = '.json,application/json';
  picker.addEventListener('change', async () => {
    const file = picker.files?.[0];
    if (!file) return;
    try {
      const imported = normalizeImportedPreset(JSON.parse(await file.text()), file.name);
      presets.forEach((preset) => { preset.active = false; });
      imported.active = true;
      presets.push(imported);
      selectedPresetId = imported.id;
      saveAppStateToCache();
      renderMoreSettings();
      openPresetDetail();
      showToast(`已导入并启用：${imported.name}（按 prompt_order 发送）`);
    } catch (error) {
      showToast(`预设导入失败：${error.message}`);
    }
  });
  picker.click();
}

function handleAddWorldBook() {
  const book = selectedLorebook();
  if (!book) return;
  book.entries ||= [];
  book.entries.push({
    id: `wb-${Date.now()}`,
    name: '新条目',
    enabled: true,
    keywords: '',
    content: '',
    constant: false,
    secondaryKeys: '',
    selectiveLogic: 'AND_ANY',
    position: 'after_char',
    role: 'system',
    order: 100,
    depth: 4,
    probability: 100,
    scanDepth: worldBookSettings.scanDepth,
  });
  openWorldBookDetail();
}

function createLorebook() {
  const name = window.prompt('新世界书名称', `世界书 ${lorebookLibrary.length + 1}`)?.trim();
  if (!name) return;
  const book = { id: `lorebook-${Date.now()}`, name, active: false, entries: [] };
  lorebookLibrary.push(book);
  selectedLorebookId = book.id;
  saveAppStateToCache();
  openWorldBookDetail();
  showToast(`已创建：${name}`);
}

function duplicateSelectedLorebook() {
  const source = selectedLorebook();
  if (!source) return;
  const copy = JSON.parse(JSON.stringify(source));
  copy.id = `lorebook-copy-${Date.now()}`;
  copy.name = `${source.name} - 副本`;
  copy.active = false;
  copy.entries = (copy.entries || []).map((entry, index) => ({ ...entry, id: `wb-copy-${Date.now()}-${index}` }));
  lorebookLibrary.push(copy);
  selectedLorebookId = copy.id;
  saveAppStateToCache();
  openWorldBookDetail();
  showToast('世界书已复制');
}

function renameSelectedLorebook() {
  const book = selectedLorebook();
  if (!book) return;
  const name = window.prompt('重命名世界书', book.name)?.trim();
  if (!name) return;
  book.name = name;
  saveAppStateToCache();
  openWorldBookDetail();
}

function deleteSelectedLorebook() {
  const book = selectedLorebook();
  if (!book || !confirm(`确定删除世界书“${book.name}”？`)) return;
  const index = lorebookLibrary.indexOf(book);
  lorebookLibrary.splice(index, 1);
  roles.forEach((role) => {
    if (Array.isArray(role.worldBookIds)) role.worldBookIds = role.worldBookIds.filter((id) => id !== book.id);
  });
  if (!lorebookLibrary.length) lorebookLibrary.push({ id: `lorebook-${Date.now()}`, name: '新世界书', active: false, entries: [] });
  selectedLorebookId = lorebookLibrary[Math.max(0, index - 1)]?.id || lorebookLibrary[0].id;
  saveAppStateToCache();
  saveRolesToCache();
  renderAdvancedQuickSettings();
  openWorldBookDetail();
  showToast('世界书已删除');
}

function handleAddRegexRule() {
  regexRules.push({ id: `regex-${Date.now()}`, name: '新正则', enabled: true, find: '', replace: '' });
  openRegexDetail();
}

function presetEditorField({ label, field, value = '', rows = 3, help = '' }) {
  const preview = String(value || '').replace(/\s+/g, ' ').trim();
  return `
    <section class="preset-field">
      <div class="preset-field-head">
        <span>${escapeHtml(label)}</span>
        <button type="button" data-preset-field-toggle>编辑</button>
      </div>
      ${preview ? `<p class="preset-field-preview">${escapeHtml(preview)}</p>` : '<p class="preset-field-preview is-empty">尚未填写</p>'}
      <div class="preset-field-editor">
        <textarea data-field="${escapeHtml(field)}" rows="${Number(rows) || 3}">${escapeHtml(value || '')}</textarea>
        ${help ? `<small>${escapeHtml(help)}</small>` : ''}
      </div>
    </section>`;
}

const PROMPT_MARKER_VARIABLES = Object.freeze({
  worldInfoBefore: { token: '{{worldInfoBefore}}', source: '命中的世界书条目正文 · 角色定义之前' },
  personaDescription: { token: '{{persona}}', source: 'userProfile.persona + 预设 userIdentity' },
  charDescription: { token: '{{description}}', source: '当前角色卡 description + 预设 charSetting' },
  charPersonality: { token: '{{personality}}', source: '当前角色卡 personality + 预设 charPersonality' },
  scenario: { token: '{{scenario}}', source: '当前角色卡 scenario + 预设 scenario' },
  dialogueExamples: { token: '{{example}}', source: '当前角色卡 example，解析成用户/助手消息' },
  worldInfoAfter: { token: '{{worldInfoAfter}}', source: '命中的世界书条目正文 · 角色定义之后' },
  chatHistory: { token: '{{chatHistory}}\n{{userInput}}', source: '最近聊天记录 + 本次用户输入' },
});

function externalMarkerPreview(block) {
  const variable = PROMPT_MARKER_VARIABLES[block.identifier];
  if (!variable) return '';
  return `<label class="st-marker-preview"><span>对应动态变量<small>${escapeHtml(variable.source)}。这是界面中的等价变量标记；请求时由内部插槽直接填入。</small></span><textarea readonly rows="${variable.token.includes('\n') ? 3 : 2}">${escapeHtml(variable.token)}</textarea></label>`;
}

function renderPresetRequestOrder(ordered) {
  const enabled = ordered.filter((item) => item.enabled !== false);
  return enabled.map(({ block }, index) => {
    const variable = PROMPT_MARKER_VARIABLES[block.identifier];
    const markerRole = ['worldInfoBefore', 'worldInfoAfter'].includes(block.identifier)
      ? '按世界书条目角色'
      : block.identifier === 'dialogueExamples' || block.identifier === 'chatHistory'
        ? '用户 / AI 助手'
        : '系统';
    const role = variable ? markerRole : (block.role === 'user' ? '用户' : block.role === 'assistant' ? 'AI 助手' : '系统');
    const isEmptyFixedPrompt = !variable && !String(block.content || '').trim();
    const content = variable?.token || (isEmptyFixedPrompt
      ? '【空内容：发送时跳过】'
      : Number(block.injectionPosition) === 1
        ? `【固定提示词正文 @ 深度 ${Number(block.injectionDepth) || 0}】`
        : '【固定提示词正文】');
    const detail = block.identifier === 'antiRepeat'
      ? '仅点击“重刷回复”时加入；动态携带最近最多 15 个已拒绝候选'
      : block.identifier === 'impersonation'
      ? '仅点击“帮答”时加入；普通聊天请求会跳过'
      : block.identifier === 'dialogueExamples'
      ? '内部顺序：示例前世界书 → 新示例标记 → example → 示例后世界书'
      : block.identifier === 'chatHistory'
        ? '内部顺序：作者注释前/后世界书 → 历史消息 → 本次输入 → 指定深度世界书'
        : (variable?.source || (isEmptyFixedPrompt ? '当前没有正文，所以本步不会产生消息' : '直接发送该提示词正文'));
    return `<li><span>${index + 1}</span><div><b>${escapeHtml(block.name || block.identifier)}</b><code>${escapeHtml(content)}</code><small>${escapeHtml(role)}消息 · ${escapeHtml(detail)}</small></div></li>`;
  }).join('');
}

/* 长按预设小项目标题直接改名字：500ms 长按进入编辑，Enter/blur 保存，Escape 取消。
   完成后用新 <b> 替换回原位置（避免重渲染整个 detailBody 造成失焦/滚动丢失），并重新绑事件。 */
function bindPromptTitleLongPressRename(bEl) {
  const row = bEl.closest('.st-prompt-row');
  const identifier = row?.dataset.promptId;
  if (!identifier) return;
  let timer = null;
  let startX = 0;
  let startY = 0;
  const cancel = () => { if (timer) { window.clearTimeout(timer); timer = null; } };
  const start = (event) => {
    timer = window.setTimeout(() => enterPromptTitleRename(bEl, identifier), 500);
    startX = event.clientX;
    startY = event.clientY;
  };
  bEl.addEventListener('pointerdown', start);
  bEl.addEventListener('pointerup', cancel);
  bEl.addEventListener('pointerleave', cancel);
  bEl.addEventListener('pointermove', (event) => {
    if (Math.abs(event.clientX - startX) > 8 || Math.abs(event.clientY - startY) > 8) cancel();
  });
}

function enterPromptTitleRename(bEl, identifier) {
  const preset = selectedPreset();
  const block = preset?.promptBlocks?.find((b) => b.identifier === identifier);
  if (!preset || !block) return;
  const original = block.name || block.identifier;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = original;
  input.className = 'st-prompt-title-input';
  input.style.cssText = 'font:inherit;color:inherit;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.18);border-radius:4px;padding:0 5px;width:auto;min-width:80px;max-width:240px;outline:none;';
  bEl.replaceWith(input);
  input.focus();
  input.select();
  let done = false;
  const finish = (nextValue) => {
    if (done) return;
    done = true;
    const next = String(nextValue || '').trim() || identifier;
    block.name = next;
    savePresetsFromDetail(false);
    const newB = document.createElement('b');
    newB.textContent = next;
    input.replaceWith(newB);
    bindPromptTitleLongPressRename(newB);
  };
  const cancel = () => {
    if (done) return;
    done = true;
    const newB = document.createElement('b');
    newB.textContent = original;
    input.replaceWith(newB);
    bindPromptTitleLongPressRename(newB);
  };
  input.addEventListener('blur', () => finish(input.value));
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); input.blur(); }
    else if (event.key === 'Escape') { event.preventDefault(); cancel(); }
  });
}

function openPresetDetail() {
  const preset = ensurePresetPromptManagerData(selectedPreset());
  const isSystemDefault = preset?.systemDefault === true;
  const blocks = new Map((preset?.promptBlocks || []).map((block) => [block.identifier, block]));
  const ordered = (preset?.promptOrder || []).map((item) => ({ ...item, block: blocks.get(item.identifier) })).filter((item) => item.block);
  const estimatedTotal = ordered.filter((item) => item.enabled !== false).reduce((sum, item) => sum + Math.ceil(String(item.block.content || '').length / 4), 0);
  openDetail('预设', `
    <div class="st-preset-page ${isSystemDefault ? 'is-system-default' : ''}" data-config="preset">
      ${isSystemDefault ? '<p class="system-default-notice">这是 App 内嵌的默认预设：可以直接启用或复制，但不能修改、删除，也不会被备份配置覆盖。</p>' : ''}
      <div class="st-preset-toolbar">
        <select id="presetSelect" aria-label="选择预设">${presets.map((item) => `<option class="${item.systemDefault ? 'system-default-option' : ''}" value="${escapeHtml(item.id)}" ${item.id === preset?.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}</select>
        <button type="button" id="presetMoreButton" title="更多操作" aria-haspopup="menu"><i class="fa-solid fa-ellipsis-vertical"></i></button>
      </div>
      <section class="st-preset-main-card">
        <label class="st-preset-name"><span>名称</span><input id="presetName" value="${escapeHtml(preset?.name || '')}"></label>
      </section>
      <details class="st-preset-sampling">
        <summary><span><i class="fa-solid fa-sliders"></i> 预设中的模型参数</span><i class="fa-solid fa-circle-chevron-down"></i></summary>
        <p class="api-param-priority">未填写的项目会回退到「全局模型设置」。</p>
        ${renderModelParameters({
          values: preset?.rawPreset || {},
          inputName: 'preset-param',
          disabled: false,
          useApiKey: true,
          grouped: true,
        })}
      </details>
      <details class="st-request-order">
        <summary><span><i class="fa-solid fa-arrow-down-1-9"></i> 建议预设排序</span><i class="fa-solid fa-circle-chevron-down"></i></summary>
        <p>按下面小条目的<strong>当前排序</strong>和<strong>启用状态</strong>生成的建议顺序：拖动小条目即可调整这里的顺序，停用某条会立刻从这里移除。动态变量（角色定义、世界书、聊天记录等）会在每次请求时替换成真实内容；标了“@ 深度”的条目会插到聊天指定深度，位置以实际请求为准。</p>
        <ol>${renderPresetRequestOrder(ordered)}</ol>
      </details>
      <section class="st-prompt-manager">
        <header><b>提示词</b><span>估算总 Token：${estimatedTotal}</span></header>
        <div class="st-prompt-list-head"><span>名称</span><span>操作</span><span>Token</span></div>
        <div class="st-prompt-list">
          ${ordered.map(({ block, enabled }) => {
            const tokens = block.marker ? '变量' : (block.content ? Math.ceil(block.content.length / 4) : '—');
            const typeIcon = block.marker ? 'fa-thumbtack' : (block.injectionPosition === 1 ? 'fa-syringe' : (block.systemPrompt ? 'fa-square-poll-horizontal' : 'fa-asterisk'));
            const roleIcon = block.role === 'user' ? '<i class="fa-solid fa-user"></i>' : block.role === 'assistant' ? '<i class="fa-solid fa-robot"></i>' : '';
            return `<article class="st-prompt-row ${enabled === false ? 'is-disabled' : ''} ${block.marker ? 'is-marker' : ''}" draggable="true" data-prompt-id="${escapeHtml(block.identifier)}">
              <div class="st-prompt-row-main">
                <span class="st-drag-handle"><i class="fa-solid fa-grip-vertical"></i></span>
                <span class="st-prompt-title"><i class="fa-solid ${typeIcon}"></i><b>${escapeHtml(block.name || block.identifier)}</b>${roleIcon}${Array.isArray(block.injectionTrigger) && block.injectionTrigger.includes('regenerate') ? '<small>仅重刷</small>' : Array.isArray(block.injectionTrigger) && block.injectionTrigger.includes('impersonate') ? '<small>仅帮答</small>' : (block.injectionPosition === 1 ? `<small>@ ${Number(block.injectionDepth ?? 4)}</small>` : '')}</span>
                <span class="st-prompt-controls"><button type="button" data-prompt-toggle title="启用/停用"><i class="fa-solid ${enabled === false ? 'fa-toggle-off' : 'fa-toggle-on'}"></i></button><button type="button" data-prompt-delete-row title="${block.marker ? '变量条目常驻，不能删除，只能关闭启用' : '删除'}" ${block.marker ? 'disabled' : ''}><i class="fa-solid fa-trash-can"></i></button><button type="button" data-prompt-copy-row title="复制"><i class="fa-solid fa-paste"></i></button><span class="st-prompt-token-chip">${tokens}</span></span>
              </div>
              <div class="st-prompt-editor">
                ${!block.marker ? `<div class="st-prompt-name-row"><span>名字</span><input data-prompt-field="name" type="text" value="${escapeHtml(block.name || block.identifier)}" autocomplete="off"></div>` : ''}
                <div class="st-setting-grid"><label>角色<select data-prompt-field="role"><option value="system" ${block.role === 'system' ? 'selected' : ''}>系统</option><option value="user" ${block.role === 'user' ? 'selected' : ''}>用户</option><option value="assistant" ${block.role === 'assistant' ? 'selected' : ''}>AI 助手</option></select></label><label>位置<select data-prompt-field="injectionPosition"><option value="0" ${Number(block.injectionPosition || 0) === 0 ? 'selected' : ''}>相对排序</option><option value="1" ${Number(block.injectionPosition) === 1 ? 'selected' : ''}>聊天中 @ 深度</option></select></label><label>深度<input data-prompt-field="injectionDepth" type="number" min="0" value="${Number(block.injectionDepth ?? 4)}"></label><label>排序<input data-prompt-field="injectionOrder" type="number" min="0" value="${Number(block.injectionOrder ?? 100)}"></label></div>
                ${block.marker ? `<p class="detail-hint">这是动态变量插槽，正文由角色卡、世界书或聊天记录自动填入，不能在这里直接编辑。</p>${externalMarkerPreview(block)}` : `<label>提示词<textarea data-prompt-field="content" rows="8" placeholder="要发送给模型的提示词">${escapeHtml(block.content || '')}</textarea></label>`}
                <div class="st-prompt-editor-actions"><label class="st-prompt-forbid"><input data-prompt-field="forbidOverrides" type="checkbox" ${block.forbidOverrides ? 'checked' : ''}><span>规则优先于角色卡</span></label><button type="button" data-prompt-cancel>取消</button><button type="button" data-prompt-save-row>保存</button></div>
              </div>
            </article>`;
          }).join('')}
        </div>
        <footer><button type="button" id="addPromptBlock"><i class="fa-solid fa-square-plus"></i> 新提示词</button><button type="button" id="resetPromptOrder"><i class="fa-solid fa-rotate-left"></i> 恢复顺序</button></footer>
      </section>
    </div>
  `, [
    { label: '+ 新增', onClick: handleAddPreset },
    { label: '保存', onClick: () => savePresetsFromDetail(false) },
  ]);
  if (isSystemDefault) {
    detailBody.querySelector('#presetName')?.setAttribute('readonly', '');
    detailBody.querySelector('#savePresets')?.setAttribute('disabled', '');
    detailBody.querySelectorAll('[data-preset-param], [data-prompt-field], [data-prompt-delete-row], [data-prompt-copy-row], [data-prompt-toggle], #addPromptBlock, #resetPromptOrder').forEach((control) => { control.disabled = true; });
    detailBody.querySelectorAll('.st-prompt-row').forEach((row) => { row.draggable = false; });
  }
}

function openWorldBookDetail() {
  const book = selectedLorebook();
  const entries = book?.entries || [];
  const positionOptions = [
    ['before_char', '↑Char · 角色定义之前'], ['after_char', '↓Char · 角色定义之后'],
    ['before_examples', '↑EM · 示例对话之前'], ['after_examples', '↓EM · 示例对话之后'],
    ['before_an', '↑AN · 作者注释之前'], ['after_an', '↓AN · 作者注释之后'],
    ['at_depth', '@D · 聊天指定深度'], ['outlet', '➡ Outlet · 仅保留兼容字段'],
  ];
  openDetail('世界书', `
    <div class="st-worldbook-page" data-config="worldBook">
      <details class="st-activation-panel">
        <summary><span><i class="fa-solid fa-sliders"></i> 全局世界书激活设置</span><i class="fa-solid fa-circle-chevron-down"></i></summary>
        <div class="st-setting-grid">
          <label>扫描深度<input id="wiScanDepth" type="number" min="0" max="1000" value="${Number(worldBookSettings.scanDepth)}"><small>从最近多少条消息中找关键词</small></label>
          <label>上下文预算 %<input id="wiBudgetPercent" type="number" min="1" max="100" value="${Number(worldBookSettings.budgetPercent)}"></label>
          <label>预算上限（字符）<input id="wiBudgetCap" type="number" min="0" value="${Number(worldBookSettings.budgetCap || worldBookSettings.budgetChars)}"><small>0 表示只按百分比；当前引擎按字符近似预算</small></label>
          <label>最少激活数<input id="wiMinActivations" type="number" min="0" max="100" value="${Number(worldBookSettings.minActivations)}"></label>
          <label>最大扫描深度<input id="wiMaxDepth" type="number" min="0" max="1000" value="${Number(worldBookSettings.maxDepth)}"></label>
          <label>最大递归步数<input id="wiMaxRecursion" type="number" min="0" max="10" value="${Number(worldBookSettings.maxRecursionSteps)}"></label>
          <label>插入策略<select id="wiInsertionStrategy"><option value="0" ${worldBookSettings.insertionStrategy === 0 ? 'selected' : ''}>均匀排序</option><option value="1" ${worldBookSettings.insertionStrategy === 1 ? 'selected' : ''}>角色世界书优先</option><option value="2" ${worldBookSettings.insertionStrategy === 2 ? 'selected' : ''}>全局世界书优先</option></select></label>
        </div>
        <div class="st-check-grid">
          ${[['wiIncludeNames','includeNames','包含说话者姓名'],['wiRecursive','recursive','递归扫描'],['wiCaseSensitive','caseSensitive','区分大小写'],['wiWholeWords','matchWholeWords','全词匹配'],['wiGroupScoring','useGroupScoring','使用组评分'],['wiOverflowAlert','overflowAlert','超出预算时提醒']].map(([id,key,label]) => `<label><input id="${id}" type="checkbox" ${worldBookSettings[key] ? 'checked' : ''}><span>${label}</span></label>`).join('')}
        </div>
      </details>

      <details class="st-book-selector st-global-books">
        <summary><span><i class="fa-solid fa-globe"></i> 全局世界书（所有聊天生效）</span><small>${lorebookLibrary.filter((item) => item.active).length}/${lorebookLibrary.length} 本已启用</small><i class="fa-solid fa-circle-chevron-down"></i></summary>
        <p>勾选后，不论当前聊天或角色是谁，都会扫描这本世界书的条目并按关键词注入请求。</p>
        <div class="st-active-books">
          ${lorebookLibrary.map((item) => `<label><input type="checkbox" data-lorebook-active="${escapeHtml(item.id)}" ${item.active ? 'checked' : ''}><span>${escapeHtml(item.name)}</span></label>`).join('')}
        </div>
      </details>

      <div class="st-book-toolbar">
        <button type="button" id="createLorebook" title="创建世界书"><i class="fa-solid fa-globe"></i><span>创建</span></button>
        <select id="lorebookSelect" aria-label="选择要编辑的世界书">
          <option value="" ${book ? '' : 'selected'}>无世界书</option>
          ${lorebookLibrary.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === book?.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}
        </select>
        <button type="button" id="importWorldBooks" title="导入世界书"><i class="fa-solid fa-file-import"></i></button>
        <button type="button" id="exportWorldBooks" title="导出世界书" ${book ? '' : 'disabled'}><i class="fa-solid fa-file-export"></i></button>
        <button type="button" id="renameLorebook" title="重命名世界书" ${book ? '' : 'disabled'}><i class="fa-solid fa-pencil"></i></button>
        <button type="button" id="duplicateLorebook" title="复制世界书" ${book ? '' : 'disabled'}><i class="fa-solid fa-paste"></i></button>
        <button type="button" id="deleteLorebook" class="is-danger" title="删除世界书" ${book ? '' : 'disabled'}><i class="fa-solid fa-trash-can"></i></button>
      </div>
      <div class="st-entry-toolbar">
        <button type="button" id="addWorldBook" title="新建条目" ${book ? '' : 'disabled'}><i class="fa-solid fa-plus"></i></button>
        <button type="button" id="openAllWorldEntries" title="展开所有条目" ${book ? '' : 'disabled'}><i class="fa-solid fa-expand"></i></button>
        <button type="button" id="closeAllWorldEntries" title="折叠所有条目" ${book ? '' : 'disabled'}><i class="fa-solid fa-compress"></i></button>
        <label class="st-search"><i class="fa-solid fa-magnifying-glass"></i><input id="worldBookSearch" type="search" placeholder="搜索……" ${book ? '' : 'disabled'}></label>
        <select id="worldBookSort" aria-label="条目排序" ${book ? '' : 'disabled'}><option value="order">按排序值</option><option value="name">按名称</option><option value="uid">按 UID</option></select>
      </div>

      <div class="st-world-entries">
      ${entries.map((entry, index) => `
        <div class="config-entry st-world-entry collapse-item" draggable="true" data-index="${index}" data-search="${escapeHtml(`${entry.name || entry.comment || ''} ${entry.keywords || ''} ${entry.content || ''}`.toLowerCase())}">
          <div class="collapse-head">
            <span class="st-drag-handle" title="拖动排序"><i class="fa-solid fa-grip-vertical"></i></span>
            <label class="st-entry-status" title="条目状态：常驻（蓝灯）／搜索（绿灯）／向量">
              <select data-field="status" aria-label="条目状态">
                <option value="constant" ${entry.constant ? 'selected' : ''}>常驻</option>
                <option value="normal" ${!entry.constant && !entry.vectorized ? 'selected' : ''}>搜索</option>
                <option value="vectorized" ${entry.vectorized ? 'selected' : ''}>向量</option>
              </select>
              <span aria-hidden="true"></span>
            </label>
            <span class="collapse-title">${escapeHtml(entry.name || entry.comment || `条目 ${index + 1}`)}</span>
            <span class="st-entry-quick"><span>#${escapeHtml(entry.uid ?? index)}</span><span>排序 ${Number(entry.order ?? 100)}</span><span>${Number(entry.probability ?? 100)}%</span></span>
            <div class="st-entry-head-actions">
              <label class="st-entry-enabled" title="启用条目"><input data-field="enabled" type="checkbox" ${entry.enabled !== false && entry.disable !== true ? 'checked' : ''}><i class="fa-solid fa-toggle-on"></i><i class="fa-solid fa-toggle-off"></i></label>
              <button type="button" data-world-entry-duplicate="${index}" title="复制条目"><i class="fa-solid fa-paste"></i></button>
              <button type="button" data-world-entry-delete="${index}" title="删除条目"><i class="fa-solid fa-trash-can"></i></button>
            </div>
            <span class="collapse-toggle"><i class="fa-solid fa-circle-chevron-down"></i></span>
          </div>
          <div class="collapse-body">
          <label>标题 / 备注<input data-field="name" value="${escapeHtml(entry.name || entry.comment || '')}" placeholder="仅用于整理，不会发给 AI"></label>
          <label>主关键词<input data-field="keywords" value="${escapeHtml(entry.keywords || (entry.key || []).join(', '))}" placeholder="多个关键词用逗号分隔"></label>
          <label>可选过滤词<input data-field="secondaryKeys" value="${escapeHtml(entry.secondaryKeys || (entry.keysecondary || []).join(', '))}" placeholder="用于 AND / NOT 条件"></label>
          <label>次关键词逻辑<select data-field="selectiveLogic">
            ${[['AND_ANY','AND ANY · 任意一个'],['AND_ALL','AND ALL · 全部'],['NOT_ANY','NOT ANY · 任意一个都不能有'],['NOT_ALL','NOT ALL · 不能全部都有']].map(([value,label]) => `<option value="${value}" ${(entry.selectiveLogic || 'AND_ANY') === value ? 'selected' : ''}>${label}</option>`).join('')}
          </select></label>
          <label>插入位置<select data-field="position">
            ${positionOptions.map(([value,label]) => `<option value="${value}" ${(normalizeWorldEntry(entry, index).position || 'after_char') === value ? 'selected' : ''}>${label}</option>`).join('')}
          </select></label>
          <label>消息角色<select data-field="role">
            ${[['system','系统'],['user','用户'],['assistant','AI 助手']].map(([value,label]) => `<option value="${value}" ${(normalizeWorldEntry(entry, index).role || 'system') === value ? 'selected' : ''}>${label}</option>`).join('')}
          </select></label>
          <div class="st-number-row"><label>深度<input data-field="depth" type="number" min="0" value="${Number(entry.depth ?? 4)}"></label><label>排序<input data-field="order" type="number" value="${Number(entry.order ?? 100)}"></label><label>触发 %<input data-field="probability" type="number" min="0" max="100" value="${Number(entry.probability ?? 100)}"></label></div>
          <label>内容<textarea data-field="content" rows="8">${escapeHtml(entry.content || '')}</textarea></label>
          <details class="st-entry-advanced"><summary>高级激活设置</summary>
            <div class="st-setting-grid">
              <label>条目扫描深度<input data-field="scanDepth" type="number" min="0" value="${Number(entry.scanDepth ?? worldBookSettings.scanDepth)}"></label>
              <label>包含组<input data-field="group" value="${escapeHtml(entry.group || '')}" placeholder="多个组用逗号分隔"></label>
              <label>组权重<input data-field="groupWeight" type="number" min="0" value="${Number(entry.groupWeight ?? 100)}"></label>
              <label>延迟<input data-field="delay" type="number" min="0" value="${Number(entry.delay ?? 0)}"></label>
              <label>粘性<input data-field="sticky" type="number" min="0" value="${Number(entry.sticky ?? 0)}"></label>
              <label>冷却<input data-field="cooldown" type="number" min="0" value="${Number(entry.cooldown ?? 0)}"></label>
            </div>
            <div class="st-check-grid">
              <label><input data-field="caseSensitive" type="checkbox" ${entry.caseSensitive === true ? 'checked' : ''}><span>区分大小写</span></label>
              <label><input data-field="matchWholeWords" type="checkbox" ${entry.matchWholeWords === true ? 'checked' : ''}><span>全词匹配</span></label>
              <label><input data-field="preventRecursion" type="checkbox" ${entry.preventRecursion === true ? 'checked' : ''}><span>阻止进一步递归</span></label>
              <label><input data-field="excludeRecursion" type="checkbox" ${entry.excludeRecursion === true ? 'checked' : ''}><span>不参与递归扫描</span></label>
            </div>
          </details>
          </div>
        </div>
      `).join('')}
      ${book ? (entries.length ? '' : '<div class="st-empty-state"><i class="fa-solid fa-book-open"></i><b>这本世界书还没有条目</b><span>点上方 ＋ 创建第一条。</span></div>') : '<div class="st-empty-state"><i class="fa-solid fa-book-bookmark"></i><b>当前未选择世界书</b><span>可从上方选择已有世界书，或点“创建”新建一本。</span></div>'}
      </div>
      <button type="button" id="saveWorldBooks" class="st-primary-save" ${book ? '' : 'disabled'}><i class="fa-solid fa-floppy-disk"></i> 保存世界书</button>
    </div>
  `, { label: '+ 新增', onClick: handleAddWorldBook });
}

function openRegexDetail() {
  openDetail('正则', `
    <div class="detail-card config-stack" data-config="regex">
      ${regexRules.map((rule, index) => `
        <div class="config-entry collapse-item" data-index="${index}">
          <div class="collapse-head"><span class="collapse-title">${escapeHtml(rule.name)}</span><span class="collapse-toggle">›</span></div>
          <div class="collapse-body">
          <label class="toggle-row"><span>启用</span><input data-field="enabled" type="checkbox" ${rule.enabled ? 'checked' : ''}></label>
          <label>名称<input data-field="name" value="${escapeHtml(rule.name)}"></label>
          <label>查找<input data-field="find" value="${escapeHtml(rule.find)}"></label>
          <label>替换<input data-field="replace" value="${escapeHtml(rule.replace)}"></label>
          </div>
        </div>
      `).join('')}
      <div class="detail-actions">
        <button type="button" id="addRegexRule">新增正则</button>
        <button type="button" id="saveRegexRules">保存正则</button>
      </div>
    </div>
  `, { label: '+ 新增', onClick: handleAddRegexRule });
}

function memoryDocumentsForChat(chat) {
  return memoryDocuments.filter((doc) => doc.scope === 'chat' && doc.chatId === chat?.id);
}

function memoryDocumentGroups(scope, chatId = '', roleId = '') {
  const groups = new Map();
  memoryDocuments.filter((doc) => doc.scope === scope && (!chatId || doc.chatId === chatId) && (!roleId || doc.roleId === roleId)).forEach((doc) => {
    const roleName = roles.find((role) => role.id === (doc.roleId || roleId))?.name || currentRole?.name || '当前角色';
    const performance = normalizeKnowledgePerformanceState(doc, roleName);
    const group = groups.get(doc.groupId) || {
      groupId: doc.groupId,
      sourceName: doc.sourceName,
      libraryName: doc.libraryName || doc.sourceName,
      libraryKind: doc.libraryKind || '资料',
      libraryOrder: Number.isFinite(Number(doc.libraryOrder)) ? Number(doc.libraryOrder) : Number.MAX_SAFE_INTEGER,
      sourceFormat: doc.sourceFormat || '',
      corpusSchemaVersion: Number(doc.corpusSchemaVersion) || 0,
      corpusImportSummary: doc.corpusImportSummary && typeof doc.corpusImportSummary === 'object' ? doc.corpusImportSummary : null,
      corpusFieldMap: doc.corpusFieldMap && typeof doc.corpusFieldMap === 'object' ? doc.corpusFieldMap : null,
      relationTriples: Array.isArray(doc.relationTriples) ? doc.relationTriples : [],
      characterCatalog: Array.isArray(doc.characterCatalog) ? doc.characterCatalog : [],
      relationGraphStatus: doc.relationGraphStatus || '',
      relationGraphError: doc.relationGraphError || '',
      relationGraphProgress: doc.relationGraphProgress || '',
      relationGraphUpdatedAt: doc.relationGraphUpdatedAt || '',
      knowledgePromptId: doc.knowledgePromptId || '',
      knowledgePromptSelections: normalizeKnowledgePromptSelections(doc),
      ...performance,
      createdAt: doc.createdAt || '',
      count: 0,
      chars: 0,
      vectorCount: 0,
    };
    if (doc.groupMetadata === true) {
      Object.assign(group, performance, {
        knowledgePromptSelections: normalizeKnowledgePromptSelections(doc),
        knowledgePromptId: doc.knowledgePromptId || group.knowledgePromptId || '',
        sourceFormat: doc.sourceFormat || group.sourceFormat || '',
        corpusSchemaVersion: Number(doc.corpusSchemaVersion) || group.corpusSchemaVersion || 0,
        corpusImportSummary: doc.corpusImportSummary && typeof doc.corpusImportSummary === 'object' ? doc.corpusImportSummary : group.corpusImportSummary,
        corpusFieldMap: doc.corpusFieldMap && typeof doc.corpusFieldMap === 'object' ? doc.corpusFieldMap : group.corpusFieldMap,
      });
    }
    group.count += 1;
    group.chars += String(doc.text || '').length;
    const currentEmbedModel = effectiveMemoryModel('embedding');
    if (Array.isArray(doc.embedding) && doc.embedding.length && doc.embeddingModel === currentEmbedModel) group.vectorCount += 1;
    groups.set(doc.groupId, group);
  });
  return [...groups.values()].sort((left, right) => left.libraryOrder - right.libraryOrder || String(left.createdAt).localeCompare(String(right.createdAt)));
}

function roleMemoryDocumentsForChat(chat) {
  const memory = ensureChatMemory(chat);
  const roleId = chat?.roleId || currentRole.id;
  const documents = memoryDocuments.filter((document) => document.scope === 'role' && document.roleId === roleId);
  if (!memory.knowledgeLibrarySelectionSet) return documents;
  const selected = new Set(memory.knowledgeLibraryIds);
  return documents.filter((document) => selected.has(document.groupId));
}

async function updateMemoryDocumentGroup(groupId, patch) {
  const documents = memoryDocuments.filter((document) => document.groupId === groupId).map((document) => ({ ...document, ...patch }));
  await storeMemoryDocuments(documents);
}

async function updateKnowledgePerformanceMetadata(groupId, patch) {
  const documents = memoryDocuments.filter((document) => document.groupId === groupId);
  if (!documents.length) return;
  const carrier = documents.find((document) => document.groupMetadata === true) || documents[0];
  await storeMemoryDocuments([{ ...carrier, ...patch, groupMetadata: true }]);
}

function normalizeRelationTriples(value) {
  if (!Array.isArray(value)) return [];
  const unique = new Map();
  value.forEach((item) => {
    const source = String(Array.isArray(item) ? item[0] : (item?.source || item?.subject || item?.from || item?.['主体'] || item?.['起点'] || item?.['人物'] || item?.['实体1'] || '')).trim();
    const relation = String(Array.isArray(item) ? item[1] : (item?.currentRelation || item?.relation || item?.predicate || item?.edge || item?.['关系'] || item?.['动作'] || item?.['谓词'] || '')).trim();
    const target = String(Array.isArray(item) ? item[2] : (item?.target || item?.object || item?.to || item?.['客体'] || item?.['终点'] || item?.['对象'] || item?.['实体2'] || '')).trim();
    if (!source || !relation || !target) return;
    const docId = String(Array.isArray(item) ? '' : (item?.docId || item?.documentId || '')).trim();
    const evidence = String(Array.isArray(item) ? (item[3] || '') : (item?.evidence || item?.quote || item?.['证据'] || item?.['原文'] || '')).trim();
    const basis = String(Array.isArray(item) ? (item[4] || '') : (item?.basis || item?.changeType || item?.['依据'] || item?.['确立方式'] || '')).trim();
    const note = String(Array.isArray(item) ? (item[5] || '') : (item?.note || item?.description || item?.['说明'] || item?.['补充说明'] || '')).trim();
    const manual = !Array.isArray(item) && item?.manual === true;
    const tags = normalizeStringList(!Array.isArray(item) ? (item?.tags || item?.tag || '') : '');
    const history = !Array.isArray(item) && Array.isArray(item?.history) ? item.history : [];
    unique.set(`${source}\u0000${relation}\u0000${target}`, {
      source,
      relation,
      target,
      ...(docId ? { docId } : {}),
      ...(evidence ? { evidence } : {}),
      ...(basis ? { basis } : {}),
      ...(note ? { note } : {}),
      ...(tags.length ? { tags } : {}),
      ...(history.length ? { history } : {}),
      ...(manual ? { manual: true } : {}),
    });
  });
  return [...unique.values()];
}

const KNOWLEDGE_RELATION_TYPES = Object.freeze([
  '血缘', '婚姻/恋爱', '师徒', '主仆', '阵营', '效忠', '敌对', '结盟', '守护', '承诺', '重大秘密', '重要物品归属',
]);

function canonicalKnowledgeRelation(value) {
  const relation = String(value || '').trim().replace(/\s+/g, '');
  if (!relation) return '';
  if (KNOWLEDGE_RELATION_TYPES.includes(relation)) return relation;
  if (/(血缘|父子|父女|母子|母女|兄弟|姐妹|兄妹|姐弟|亲属|亲子)/.test(relation)) return '血缘';
  if (/(婚姻|夫妻|夫妇|恋爱|恋人|伴侣|婚约|爱慕|相爱|成婚)/.test(relation)) return '婚姻/恋爱';
  if (/(师徒|师父|师傅|徒弟|授业)/.test(relation)) return '师徒';
  if (/(主仆|主人|侍从|侍女|仆从)/.test(relation)) return '主仆';
  if (/(阵营|组织归属|隶属|所属|成员)/.test(relation)) return '阵营';
  if (/(效忠|忠于|臣服|宣誓)/.test(relation)) return '效忠';
  if (/(敌对|仇敌|死敌|宿敌|仇恨|背叛)/.test(relation)) return '敌对';
  if (/(结盟|盟友|联盟|合作阵营)/.test(relation)) return '结盟';
  if (/(守护|保护|护卫|庇护)/.test(relation)) return '守护';
  if (/(承诺|约定|誓言|诺言)/.test(relation)) return '承诺';
  if (/(重大秘密|身份秘密|隐秘身份|秘密)/.test(relation)) return '重大秘密';
  if (/(重要物品归属|持有|拥有|物品归属|神器归属)/.test(relation)) return '重要物品归属';
  return '';
}

function isStableKnowledgeRelation(item) {
  const source = String(item?.source || '').trim();
  const relation = String(item?.currentRelation || item?.relation || '').trim();
  const target = String(item?.target || '').trim();
  const evidence = String(item?.evidence || item?.quote || item?.['证据'] || '').trim();
  const basis = String(item?.basis || item?.changeType || item?.['依据'] || item?.['确立方式'] || '').trim();
  if (!source || !relation || !target) return false;
  const joined = `${source} ${relation} ${target}`;
  if (/^(他|她|它|他们|她们|众人|有人|男人|女人|少女|少年|敌人|对方|施法者|旁人|士兵|侍卫|路人|店主|客人|丫鬟|仆人)$/i.test(source)) return false;
  if (/^(他|她|它|他们|她们|众人|有人|法杖|水元素|火焰|动作|事件|一句话|美酒|酒|茶|饭)$/i.test(target)) return false;
  if (/(举起|释放|卷入|递上|接过|走向|看向|望向|低头|抬头|笑|哭|说|问|回答|沉默|抱住|亲吻|触碰|攻击|打|飞|落下|出现|消失|坐下|站起)/.test(relation)) return false;
  if (/(一次性动作|临时动作|战斗动作|表情|姿态|普通物品)/.test(joined)) return false;
  if (evidence.length < 4) return false;
  if (!item?.manual && !/(原文明示长期关系|血缘确认|相认|明确告白|成婚|婚约确立|师徒确立|主仆确立|正式效忠|正式结盟|正式背叛|杀害至亲|重大秘密揭示|重要归属确立)/.test(basis)) return false;
  return true;
}

function normalizeCharacterCatalog(value) {
  if (!Array.isArray(value)) return [];
  const genericName = /^(他|她|它|他们|她们|众人|有人|男人|女人|少女|少年|敌人|对方|施法者|旁人|士兵|侍卫|路人|店主|客人|丫鬟|仆人|无名氏)$/i;
  const merged = new Map();
  value.forEach((item) => {
    const name = String(item?.name || item?.character || item?.['姓名'] || item?.['角色'] || item?.['人物'] || '').trim();
    if (!name || genericName.test(name)) return;
    const aliasesRaw = item?.aliases || item?.alias || item?.['别名'] || [];
    const aliases = (Array.isArray(aliasesRaw) ? aliasesRaw : String(aliasesRaw || '').split(/[、,，/]/))
      .map((alias) => String(alias || '').trim()).filter((alias) => alias && alias !== name && !genericName.test(alias));
    const identity = String(item?.identity || item?.role || item?.['身份'] || '').trim();
    const traits = String(item?.traits || item?.personality || item?.['性格'] || '').trim();
    const speechStyle = String(item?.speechStyle || item?.speech || item?.['说话风格'] || '').trim();
    const evidence = String(item?.evidence || item?.quote || item?.['证据'] || item?.['原文'] || '').trim();
    const docId = String(item?.docId || item?.documentId || '').trim();
    const hidden = item?.hidden === true;
    const key = name.toLocaleLowerCase();
    const old = merged.get(key);
    const preferDetail = (left, right) => String(right || '').length > String(left || '').length ? String(right || '') : String(left || '');
    merged.set(key, {
      name,
      aliases: [...new Set([...(old?.aliases || []), ...aliases])],
      identity: preferDetail(old?.identity, identity),
      traits: preferDetail(old?.traits, traits),
      speechStyle: preferDetail(old?.speechStyle, speechStyle),
      evidence: preferDetail(old?.evidence, evidence),
      docId: old?.docId || docId,
      hidden: old?.hidden === true || hidden,
    });
  });
  return [...merged.values()];
}

function mergeCharacterCatalog(existing, additions) {
  return normalizeCharacterCatalog([...normalizeCharacterCatalog(existing), ...normalizeCharacterCatalog(additions)]);
}

function mergeChatCharacterCatalog(existing, additions) {
  const merged = new Map(normalizeCharacterCatalog(existing).map((item) => [item.name.toLocaleLowerCase(), item]));
  normalizeCharacterCatalog(additions).forEach((item) => {
    const key = item.name.toLocaleLowerCase();
    const old = merged.get(key) || {};
    merged.set(key, {
      ...old,
      ...item,
      aliases: [...new Set([...(old.aliases || []), ...(item.aliases || [])])],
      identity: item.identity || old.identity || '',
      traits: item.traits || old.traits || '',
      speechStyle: item.speechStyle || old.speechStyle || '',
      evidence: item.evidence || old.evidence || '',
      docId: item.docId || old.docId || '',
      hidden: old.hidden === true || item.hidden === true,
    });
  });
  return [...merged.values()];
}

function mergeChatRelations(existing, additions, characterCatalog = []) {
  let result = dedupeKnowledgeRelations(existing, characterCatalog);
  dedupeKnowledgeRelations(additions, characterCatalog).forEach((next) => {
    const samePair = (item) => {
      const direct = item.source === next.source && item.target === next.target;
      const reverse = item.source === next.target && item.target === next.source;
      return direct || reverse;
    };
    if (next.relation === '敌对' || /(正式背叛|杀害至亲)/.test(next.basis || '')) {
      result = result.filter((item) => !samePair(item) || !['结盟', '效忠', '守护'].includes(item.relation));
    } else if (next.relation === '结盟' && /(正式结盟)/.test(next.basis || '')) {
      result = result.filter((item) => !samePair(item) || item.relation !== '敌对');
    }
    result.push(next);
    result = dedupeKnowledgeRelations(result, characterCatalog);
  });
  return result;
}

function dedupeKnowledgeRelations(value, characterCatalog = []) {
  const aliasMap = new Map();
  normalizeCharacterCatalog(characterCatalog).forEach((character) => {
    [character.name, ...(character.aliases || [])].forEach((name) => aliasMap.set(String(name).trim().toLocaleLowerCase(), character.name));
  });
  const symmetric = new Set(['血缘', '婚姻/恋爱', '敌对', '结盟']);
  const unique = new Map();
  normalizeRelationTriples(value).forEach((item) => {
    let source = aliasMap.get(item.source.toLocaleLowerCase()) || item.source;
    let target = aliasMap.get(item.target.toLocaleLowerCase()) || item.target;
    if (symmetric.has(item.relation) && source.localeCompare(target, 'zh-CN') > 0) [source, target] = [target, source];
    const key = `${source}\u0000${item.relation}\u0000${target}`;
    const old = unique.get(key);
    unique.set(key, {
      ...item,
      source,
      target,
      evidence: String(item.evidence || '').length >= String(old?.evidence || '').length ? item.evidence : old.evidence,
      docId: old?.docId || item.docId,
    });
  });
  return [...unique.values()];
}

function extractCharacterCatalog(raw) {
  const source = String(raw || '').replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/<analysis>[\s\S]*?<\/analysis>/gi, '').replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const found = [];
  [source, ...balancedJsonObjects(source)].filter(Boolean).forEach((candidate) => {
    try {
      const parsed = JSON.parse(candidate);
      const list = parsed?.characters || parsed?.characterCatalog || parsed?.['角色目录'] || parsed?.['人物目录'] || parsed?.data?.characters;
      if (Array.isArray(list)) found.push(...list);
    } catch (_) {}
  });
  return normalizeCharacterCatalog(found);
}

function relationItemsFromJson(value, depth = 0) {
  if (depth > 5 || value == null) return [];
  if (typeof value === 'string' && /^[\s]*[\[{]/.test(value)) {
    try { return relationItemsFromJson(JSON.parse(value), depth + 1); } catch (_) { return []; }
  }
  if (Array.isArray(value)) {
    if (value.length >= 3 && value.slice(0, 3).every((item) => ['string', 'number'].includes(typeof item))) return [value];
    return value.flatMap((item) => relationItemsFromJson(item, depth + 1));
  }
  if (typeof value !== 'object') return [];
  if (normalizeRelationTriples([value]).length) return [value];
  const preferredKeys = ['triples', 'relations', 'relationships', 'edges', 'data', 'result', '三元组', '关系', '关系图'];
  const preferred = preferredKeys.flatMap((key) => relationItemsFromJson(value[key], depth + 1));
  if (preferred.length) return preferred;
  return Object.values(value).flatMap((item) => relationItemsFromJson(item, depth + 1));
}

function extractRelationTriples(raw) {
  const source = String(raw || '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<analysis>[\s\S]*?<\/analysis>/gi, '')
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  const parsedItems = [];
  const jsonCandidates = [source, ...balancedJsonObjects(source)];
  [...new Set(jsonCandidates.filter(Boolean))].forEach((candidate) => {
    try { parsedItems.push(...relationItemsFromJson(JSON.parse(candidate))); } catch (_) {}
  });
  const normalizedJson = normalizeRelationTriples(parsedItems);
  if (normalizedJson.length) return normalizedJson;

  const lineItems = [];
  source.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim().replace(/^[-*\d.、\s]+/, '');
    if (!line || /^\|?\s*:?-{2,}/.test(line)) return;
    if (line.includes('|')) {
      const cells = line.split('|').map((cell) => cell.trim()).filter(Boolean);
      if (cells.length >= 3 && !/^(主体|source|subject)$/i.test(cells[0])) lineItems.push(cells.slice(0, 4));
      return;
    }
    const arrow = line.match(/^(.+?)\s*(?:--?|—)\s*(.+?)\s*(?:--?>|→|⇒)\s*(.+)$/);
    if (arrow) lineItems.push([arrow[1], arrow[2], arrow[3]]);
  });
  return normalizeRelationTriples(lineItems);
}

function knowledgeGraphEditorHtml(group) {
  if (!group) return '';
  const isRagCorpus = group.sourceFormat === 'rag-corpus';
  const corpusSummary = group.corpusImportSummary && typeof group.corpusImportSummary === 'object' ? group.corpusImportSummary : {};
  const corpusValidRows = Math.max(0, Number(corpusSummary.validRows) || 0);
  const triples = normalizeRelationTriples(group.relationTriples);
  const characters = normalizeCharacterCatalog(group.characterCatalog);
  const performance = normalizeKnowledgePerformanceState(group, currentRole?.name || '');
  const progressCopy = knowledgeExtractionProgressCopy(performance.extractionProgress);
  const promptSelections = normalizeKnowledgePromptSelections(group.knowledgePromptSelections || group);
  const targetHtml = performance.targetCharacters.map((target) => `
    <article class="knowledge-target-card" data-knowledge-target-id="${escapeHtml(target.id)}">
      <label class="knowledge-target-enabled"><input type="checkbox" data-toggle-knowledge-target="${escapeHtml(target.id)}" ${target.enabled !== false ? 'checked' : ''}><span><b>${escapeHtml(target.primaryName)}</b><small>${target.locked ? '当前角色 · 不可删除' : '额外角色'}</small></span></label>
      <div class="knowledge-target-actions"><button type="button" data-add-target-alias="${escapeHtml(target.id)}"><i class="fa-solid fa-plus"></i> 别名</button>${target.locked ? '' : `<button type="button" data-delete-knowledge-target="${escapeHtml(target.id)}" title="删除额外角色"><i class="fa-solid fa-trash-can"></i></button>`}</div>
      <div class="knowledge-target-aliases">${target.aliases.length ? target.aliases.map((alias) => `<span>${escapeHtml(alias)}<button type="button" data-remove-target-alias="${escapeHtml(target.id)}" data-alias-name="${escapeHtml(alias)}" title="移除别名"><i class="fa-solid fa-xmark"></i></button></span>`).join('') : '<small>还没有已确认别名</small>'}</div>
    </article>`).join('');
  const pendingAliases = performance.aliasCandidates.filter((candidate) => candidate.status === 'pending');
  const aliasHtml = pendingAliases.length ? pendingAliases.map((candidate) => {
    const target = performance.targetCharacters.find((item) => item.id === candidate.targetId);
    return `<article class="knowledge-alias-candidate"><div><b>${escapeHtml(candidate.name)}</b><small>可能是 ${escapeHtml(target?.primaryName || '目标角色')} 的别名</small><p>${escapeHtml(candidate.evidence || '未提供可显示证据')}</p></div><div><button type="button" data-accept-alias="${escapeHtml(candidate.id)}">接受并补扫</button><button type="button" data-reject-alias="${escapeHtml(candidate.id)}">拒绝</button></div></article>`;
  }).join('') : '<p class="memory-empty">没有待确认别名。AI 发现明确身份依据后会放在这里，不会自动把两个名字合并。</p>';
  const profileHtml = performance.roleProfiles.length ? performance.roleProfiles.map((profile) => `<article class="knowledge-profile-card"><h5>${escapeHtml(profile.name)}<small>${escapeHtml(profile.sourceName || group.libraryName)}</small></h5><p>${escapeHtml(roleProfileContent(profile) || '暂无可展示内容')}</p>${profile.evidenceDocIds.length ? `<small>${profile.evidenceDocIds.length} 段独立证据</small>` : ''}</article>`).join('') : `<p class="memory-empty">${isRagCorpus ? 'RAG语料不会自动生成角色本色卡；语料本身已经可以参与情境与事实召回。' : '尚未生成角色本色卡；完成目标角色场景提取后才归纳。'}</p>`;
  const performanceHtml = performance.performanceCards.length ? performance.performanceCards.map((card) => `<article class="knowledge-performance-card"><h5>${escapeHtml(card.situationTags.join('、') || card.trigger || '未命名情境')}<small>${escapeHtml(card.sourceName || group.libraryName)}</small></h5>${card.relationshipContext ? `<p><b>关系阶段</b>${escapeHtml(card.relationshipContext)}</p>` : ''}${card.trigger ? `<p><b>触发</b>${escapeHtml(card.trigger)}</p>` : ''}${card.innerMotive ? `<p><b>内在</b>${escapeHtml(card.innerMotive)}</p>` : ''}${card.outwardResponse ? `<p><b>外在</b>${escapeHtml(card.outwardResponse)}</p>` : ''}${card.speechPattern ? `<p><b>语言</b>${escapeHtml(card.speechPattern)}</p>` : ''}${card.actionPattern ? `<p><b>动作</b>${escapeHtml(card.actionPattern)}</p>` : ''}${card.avoid ? `<p><b>避免</b>${escapeHtml(card.avoid)}</p>` : ''}${card.excerpt ? `<blockquote>${escapeHtml(card.excerpt)}</blockquote>` : ''}</article>`).join('') : '<p class="memory-empty">尚无情境演绎卡。只有命中目标角色姓名或已确认别名的场景才会进入整理请求。</p>';
  const grouped = new Map();
  triples.forEach((triple, index) => {
    const source = triple.source || '未命名';
    if (!grouped.has(source)) grouped.set(source, []);
    grouped.get(source).push({ ...triple, _idx: index });
  });
  const groupedHtml = grouped.size
    ? [...grouped.entries()].map(([source, items]) => `
        <section class="knowledge-graph-group">
          <h4>${escapeHtml(source)}<small>${items.length} 条</small></h4>
          <ul>${items.map((it) => `<li data-triple-index="${it._idx}"><button type="button" class="kg-delete" data-request-delete-triple="${it._idx}" title="删除关系"><i class="fa-solid fa-trash-can"></i></button><span class="kg-delete-confirm" hidden><button type="button" data-confirm-delete-triple="${it._idx}">确认</button><button type="button" data-cancel-delete-triple>取消</button></span><span class="kg-relation">${escapeHtml(it.relation)}</span><span class="kg-arrow">↔</span><b>${escapeHtml(it.target)}</b>${it.tags?.length ? `<em>${escapeHtml(it.tags.join('、'))}</em>` : ''}${it.manual ? '<em>手动</em>' : ''}${it.note || it.evidence || it.basis ? `<small>${escapeHtml(it.note || it.evidence || it.basis)}</small>` : ''}</li>`).join('')}</ul>
        </section>`).join('')
    : '<p class="memory-empty">还没有长期关系；可以手工添加，或让整理 API 从命中场景中提取</p>';
  const visibleCharacters = characters.filter((item) => !item.hidden);
  const hiddenCharacters = characters.filter((item) => item.hidden);
  const characterCard = (item, index, hidden = false) => `<article class="knowledge-character-card ${hidden ? 'is-hidden-character' : ''}" data-character-index="${index}"><div class="knowledge-character-main"><span><b>${escapeHtml(item.name)}</b>${item.aliases?.length ? `<small>别名：${escapeHtml(item.aliases.join('、'))}</small>` : ''}</span><div class="knowledge-character-actions">${hidden ? `<button type="button" data-restore-character="${index}" title="恢复"><i class="fa-solid fa-eye"></i></button>` : `<button type="button" data-request-delete-character="${index}" title="删除"><i class="fa-solid fa-trash-can"></i></button><button type="button" data-hide-character="${index}" title="隐身"><i class="fa-solid fa-eye-slash"></i></button><button type="button" data-edit-character="${index}" title="编辑"><i class="fa-solid fa-pen"></i></button>`}</div></div><div class="knowledge-character-confirm" hidden><span>删除这个角色？</span><button type="button" data-confirm-delete-character="${index}">确认</button><button type="button" data-cancel-delete-character>取消</button></div><p>${item.identity ? `<span><em>身份</em>${escapeHtml(item.identity)}</span>` : ''}${item.traits ? `<span><em>性格</em>${escapeHtml(item.traits)}</span>` : ''}${item.speechStyle ? `<span><em>说话风格</em>${escapeHtml(item.speechStyle)}</span>` : ''}</p></article>`;
  const hiddenCharacterHtml = hiddenCharacters.length ? `<details class="knowledge-hidden-characters"><summary>已隐身角色 ${hiddenCharacters.length} 位</summary>${hiddenCharacters.map((item) => characterCard(item, characters.indexOf(item), true)).join('')}</details>` : '';
  const characterHtml = visibleCharacters.length || hiddenCharacters.length
    ? `${visibleCharacters.map((item) => characterCard(item, characters.indexOf(item))).join('')}${hiddenCharacterHtml}`
    : '<p class="memory-empty">还没有原作角色目录；开始整理后会从命中场景识别具名重要角色</p>';
  return `
    <div class="knowledge-graph-head">
      <span><span class="knowledge-graph-title"><b>${escapeHtml(group.libraryName)}</b><button type="button" data-edit-knowledge-title="${escapeHtml(group.groupId)}" title="修改上传文件名"><i class="fa-solid fa-pen"></i></button></span><small>${isRagCorpus ? `${corpusValidRows} 条直接语料 · ` : ''}${performance.targetCharacters.length} 位目标角色 · ${performance.roleProfiles.length} 张本色卡 · ${performance.performanceCards.length} 张演绎卡 · ${triples.length} 条原作关系</small></span>
      <div class="knowledge-graph-head-actions">
        ${isRagCorpus ? '' : `<div class="knowledge-graph-build-actions">
          <button type="button" data-build-knowledge-graph="${escapeHtml(group.groupId)}"><i class="fa-solid fa-wand-magic-sparkles"></i> ${performance.extractionProgress.completed ? '继续整理' : '开始整理'}</button>
          <button type="button" data-rebuild-knowledge-graph="${escapeHtml(group.groupId)}"><i class="fa-solid fa-rotate"></i> 重新整理</button>
        </div>`}
      </div>
    </div>
    ${isRagCorpus ? `<section class="rag-corpus-ready-card">
      <span><b>RAG语料 · 已可召回</b><small>共 ${corpusValidRows} 条有效语料 · ${Math.max(0, Number(corpusSummary.missingTextRows) || 0)} 条缺少正文已跳过 · 未调用 AI</small></span>
      <div><button type="button" data-view-rag-corpus="${escapeHtml(group.groupId)}">查看语料</button><button type="button" data-check-rag-fields="${escapeHtml(group.groupId)}">检查字段</button><button type="button" data-reimport-rag-corpus="${escapeHtml(group.groupId)}">重新导入</button></div>
    </section>` : ''}
    <div class="knowledge-graph-progress" data-graph-progress hidden></div>
    ${!isRagCorpus && performance.extractionProgress.status === 'failed' && performance.extractionProgress.error ? `<p class="knowledge-graph-status is-error"><b>上次整理没有完成</b><span>${escapeHtml(progressCopy.headline)}</span>${performance.extractionProgress.runTotal ? `<span>${escapeHtml(progressCopy.detail)}</span>` : ''}<span>${escapeHtml(performance.extractionProgress.error)}</span></p>` : ''}
    ${performance.extractionProgress.status === 'running' ? `<p class="knowledge-graph-status is-running"><b>分阶段进度</b><span>${escapeHtml(progressCopy.headline)}</span>${performance.extractionProgress.runTotal ? `<span>${escapeHtml(progressCopy.detail)}</span>` : ''}<span>阶段：${escapeHtml(performance.extractionProgress.stage || '场景提取')}</span></p>` : ''}
    ${performance.extractionProgress.status === 'stopped' ? `<p class="knowledge-graph-status is-stopped"><b>整理已停止</b><span>${escapeHtml(progressCopy.headline)}</span>${performance.extractionProgress.runTotal ? `<span>${escapeHtml(progressCopy.detail)}</span>` : ''}<span>${escapeHtml(performance.extractionProgress.error || '已保留成果，可继续。')}</span></p>` : ''}
    ${performance.extractionProgress.status === 'ready' ? `<p class="knowledge-graph-status is-ready"><b>上次整理完成</b>只处理命中目标名字的场景；已保存 ${performance.roleProfiles.length} 张本色卡、${performance.performanceCards.length} 张演绎卡。</p>` : ''}
    <section class="knowledge-target-panel">
      <div class="knowledge-target-head"><span><b>目标角色与别名</b><small>当前角色自动加入；共最多 6 位</small></span><button type="button" data-add-knowledge-target="${escapeHtml(group.groupId)}" ${performance.targetCharacters.length >= MAX_PERFORMANCE_TARGETS ? 'disabled' : ''}><i class="fa-solid fa-plus"></i> 添加角色</button></div>
      <div class="knowledge-target-list">${targetHtml}</div>
    </section>
    ${isRagCorpus ? '' : `<details class="knowledge-layer" ${pendingAliases.length ? 'open' : ''}><summary><span>待确认别名 <small>${pendingAliases.length} 个</small></span><i class="fa-solid fa-chevron-right"></i></summary><div>${aliasHtml}</div></details>`}
    ${isRagCorpus ? '' : `<details class="knowledge-layer knowledge-prompt-panel" data-knowledge-prompt-panel>
      <summary><span>查看/编辑提示词 <small>本资料的三种整理规则</small></span><i class="fa-solid fa-chevron-right"></i></summary>
      <div class="knowledge-prompt-row">
        ${memoryPromptCompactHtml('knowledgePerformance', promptSelections.performance, 'knowledge', group.groupId, { title: '情境演绎提取提示词', buttonLabel: '编辑提示词' })}
        ${memoryPromptCompactHtml('knowledgeProfile', promptSelections.profile, 'knowledge', group.groupId, { title: '角色本色归纳提示词', buttonLabel: '编辑提示词' })}
        ${memoryPromptCompactHtml('knowledgeFacts', promptSelections.facts, 'knowledge', group.groupId, { title: '原作事实与关系提取提示词', buttonLabel: '编辑提示词' })}
      </div>
    </details>`}
    <details class="knowledge-layer" open><summary><span>角色本色 <small>每轮常驻 · 每位约 400 字</small></span><i class="fa-solid fa-chevron-right"></i></summary><div class="knowledge-profile-list">${profileHtml}</div></details>
    <details class="knowledge-layer"><summary class="has-recall-control"><span>情境演绎${isRagCorpus ? ' / RAG语料' : ''} ${isRagCorpus ? `<small>${performance.performanceCards.length} 张 AI 卡 · ${corpusValidRows} 条直接语料</small>` : ''}</span><span class="knowledge-layer-recall"><label>每轮最多 <input type="number" inputmode="numeric" min="0" max="8" step="1" value="${performance.performanceRecallLimit}" aria-label="情境演绎每轮召回张数" data-knowledge-recall-limit="performance"> 张</label><small>建议 2～4</small></span><i class="fa-solid fa-chevron-right"></i></summary><div class="knowledge-performance-list">${isRagCorpus ? '<p class="memory-empty">出场人物包含目标角色或已确认别名的语料，会直接作为情境参考；不会伪装成九项演绎卡。</p>' : performanceHtml}</div></details>
    <details class="knowledge-layer"><summary class="has-recall-control"><span>原作事实 <small>${characters.length} 位角色 · ${triples.length} 条长期关系</small></span><span class="knowledge-layer-recall"><label>原文最多 <input type="number" inputmode="numeric" min="0" max="8" step="1" value="${performance.factRecallLimit}" aria-label="原作事实每轮召回段数" data-knowledge-recall-limit="facts"> 段</label><small>建议 2～4</small></span><i class="fa-solid fa-chevron-right"></i></summary><div class="knowledge-facts-body">
      <section class="knowledge-character-catalog ${knowledgeCharactersCollapsed ? 'is-collapsed' : ''}">
        <h4><span>原作角色目录 <small>身份与明确事实</small></span><button type="button" id="toggleKnowledgeCharacters" title="${knowledgeCharactersCollapsed ? '展开原作角色目录' : '收起原作角色目录'}"><i class="fa-solid fa-chevron-right"></i></button></h4>
        <div ${knowledgeCharactersCollapsed ? 'hidden' : ''}>${characterHtml}</div>
      </section>
      <div class="knowledge-graph-toolbar"><b>长期关系与原作事实</b><button type="button" id="addKnowledgeTriple"><i class="fa-solid fa-plus"></i></button></div>
      <div class="knowledge-graph-pane"><div class="knowledge-graph-groups">${groupedHtml}</div></div>
    </div></details>
    <div class="knowledge-relation-modal" id="knowledgeRelationModal" hidden>
      <div class="knowledge-relation-dialog">
        <h4><i class="fa-solid fa-diagram-project"></i> 添加关系</h4>
        <label>人物甲<input id="manualRelationSource" placeholder="例如：相柳"></label>
        <label>人物乙<input id="manualRelationTarget" placeholder="例如：琳琳"></label>
        <label>当前关系（自由描述）<textarea id="manualRelationType" rows="3" placeholder="例如：已成婚；彼此深爱，但相柳不善表达"></textarea></label>
        <label>可选标签<input id="manualRelationTags" placeholder="例如：夫妻、盟友；用逗号分隔"></label>
        <label>原文证据或说明（可选）<input id="manualRelationNote" placeholder="支持这段关系的原文或说明"></label>
        <small>手动新增的关系不会自动绑定原文段落；需要依据时，可把原文片段或说明写在这里。</small>
        <div class="knowledge-relation-actions"><button type="button" id="saveManualRelation" class="memory-accent-action"><i class="fa-solid fa-check"></i> 保存</button><button type="button" id="cancelManualRelation"><i class="fa-solid fa-xmark"></i> 取消</button></div>
      </div>
    </div>
    <div class="knowledge-title-modal" id="knowledgeTitleModal" hidden>
      <div class="knowledge-title-dialog">
        <h4><i class="fa-solid fa-pen"></i> 修改上传文件名</h4>
        <label>上传文件名<input id="knowledgeTitleInput" value="${escapeHtml(group.libraryName)}" placeholder="输入新的知识库显示名"></label>
        <div class="knowledge-title-actions"><button type="button" id="saveKnowledgeTitle" class="memory-accent-action"><i class="fa-solid fa-check"></i> 保存</button><button type="button" id="cancelKnowledgeTitle"><i class="fa-solid fa-xmark"></i> 取消</button></div>
      </div>
    </div>
    <div class="knowledge-character-modal" id="knowledgeCharacterModal" hidden>
      <div class="knowledge-character-dialog">
        <h4><i class="fa-solid fa-pen"></i> 编辑角色目录</h4>
        <input id="editCharacterIndex" type="hidden">
        <label>姓名<input id="editCharacterName" placeholder="角色姓名"></label>
        <label>别名<input id="editCharacterAliases" placeholder="多个别名用顿号或逗号分隔"></label>
        <label>身份<textarea id="editCharacterIdentity" rows="3" placeholder="身份、阵营、地位"></textarea></label>
        <label>性格<textarea id="editCharacterTraits" rows="3" placeholder="稳定性格"></textarea></label>
        <label>说话风格<textarea id="editCharacterSpeech" rows="3" placeholder="说话风格"></textarea></label>
        <div class="knowledge-character-edit-actions"><button type="button" id="saveKnowledgeCharacter" class="memory-accent-action"><i class="fa-solid fa-check"></i> 保存</button><button type="button" id="cancelKnowledgeCharacter"><i class="fa-solid fa-xmark"></i> 取消</button></div>
      </div>
    </div>
    <div class="memory-relation-modal" id="knowledgeTargetNameModal" role="dialog" aria-modal="true" aria-labelledby="knowledgeTargetNameTitle" hidden>
      <section>
        <h3 id="knowledgeTargetNameTitle">添加目标角色</h3>
        <label id="knowledgeTargetNameLabel">角色主名<input id="knowledgeTargetNameInput" autocomplete="off" placeholder="例如：小夭"></label>
        <small id="knowledgeTargetNameHint">会按这个名字定向查找场景；保存本身不会请求 API。</small>
        <div class="memory-modal-actions"><button type="button" id="cancelKnowledgeTargetName">取消</button><button type="button" id="saveKnowledgeTargetName" class="memory-primary">保存</button></div>
      </section>
    </div>
    ${isRagCorpus ? `<div class="memory-relation-modal" id="ragCorpusDetailsModal" role="dialog" aria-modal="true" aria-labelledby="ragCorpusDetailsTitle" hidden><section><h3 id="ragCorpusDetailsTitle">RAG语料</h3><div id="ragCorpusDetailsBody"></div><div class="memory-modal-actions"><button type="button" id="closeRagCorpusDetails" class="memory-primary">关闭</button></div></section></div>` : ''}
  `;
}

function bindKnowledgeLibraryDrag(chat) {
  const list = detailBody.querySelector('.knowledge-library-list');
  if (!list) return;
  list.querySelectorAll('.knowledge-library-row').forEach((row) => {
    let holdTimer = null;
    let pending = null;
    let drag = null;
    const clearHold = () => { if (holdTimer) window.clearTimeout(holdTimer); holdTimer = null; };
    const start = (clientY) => {
      if (!pending || drag) return;
      const rect = row.getBoundingClientRect();
      const ghost = row.cloneNode(true);
      ghost.classList.add('knowledge-library-drag-ghost');
      ghost.setAttribute('aria-hidden', 'true');
      Object.assign(ghost.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
      document.body.append(ghost);
      drag = { ghost, height: rect.height, grabOffset: clientY - rect.top, startX: pending.x, startY: pending.y, moved: false };
      row.classList.add('knowledge-library-drag-placeholder');
      document.body.classList.add('is-reordering');
      try { navigator.vibrate?.(12); } catch (_) {}
    };
    const move = (clientX, clientY) => {
      if (!drag) return;
      if (!drag.moved && Math.hypot(clientX - drag.startX, clientY - drag.startY) < 10) return;
      drag.moved = true;
      drag.ghost.style.top = `${clientY - drag.grabOffset}px`;
      const center = clientY - drag.grabOffset + drag.height / 2;
      const siblings = [...list.querySelectorAll('.knowledge-library-row')].filter((item) => item !== row);
      const before = siblings.find((item) => {
        const rect = item.getBoundingClientRect();
        return rect.top + rect.height / 2 > center;
      });
      if (before) list.insertBefore(row, before);
      else list.append(row);
      const scrollerRect = detailBody.getBoundingClientRect();
      if (clientY < scrollerRect.top + 60) detailBody.scrollBy(0, -10);
      else if (clientY > scrollerRect.bottom - 60) detailBody.scrollBy(0, 10);
    };
    const finish = async (cancelled = false) => {
      clearHold();
      pending = null;
      if (!drag) return;
      drag.ghost.remove();
      row.classList.remove('knowledge-library-drag-placeholder');
      document.body.classList.remove('is-reordering');
      const moved = drag.moved && !cancelled;
      drag = null;
      if (!moved) return;
      const order = [...list.querySelectorAll('.knowledge-library-row')].map((item) => item.dataset.libraryGroupId);
      await Promise.all(order.map((groupId, index) => updateMemoryDocumentGroup(groupId, { libraryOrder: index + 1 })));
      showToast('知识库资料排序已保存');
      activeChatMemoryFeature = 'role-library';
      openChatMemoryDetail(chat);
    };
    const isControl = (target) => !!target.closest('button,input,label,select,a');
    const touchMove = (event) => {
      const touch = [...event.touches].find((item) => item.identifier === pending?.identifier);
      if (!touch || !pending) return;
      if (!drag && Math.hypot(touch.clientX - pending.x, touch.clientY - pending.y) > 9) clearHold();
      if (drag) { event.preventDefault(); move(touch.clientX, touch.clientY); }
    };
    const touchEnd = (event) => {
      window.removeEventListener('touchmove', touchMove, true);
      window.removeEventListener('touchend', touchEnd, true);
      window.removeEventListener('touchcancel', touchEnd, true);
      finish(event.type === 'touchcancel');
    };
    row.addEventListener('touchstart', (event) => {
      if (event.touches.length !== 1 || isControl(event.target)) return;
      const touch = event.touches[0];
      pending = { identifier: touch.identifier, x: touch.clientX, y: touch.clientY };
      holdTimer = window.setTimeout(() => start(touch.clientY), 380);
      window.addEventListener('touchmove', touchMove, { capture: true, passive: false });
      window.addEventListener('touchend', touchEnd, true);
      window.addEventListener('touchcancel', touchEnd, true);
    }, { passive: true });
    row.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch' || event.button !== 0 || isControl(event.target)) return;
      pending = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
      start(event.clientY);
      const pointerMove = (moveEvent) => {
        if (moveEvent.pointerId !== pending?.pointerId) return;
        if (drag) { moveEvent.preventDefault(); move(moveEvent.clientX, moveEvent.clientY); }
      };
      const pointerEnd = (endEvent) => {
        if (endEvent.pointerId !== pending?.pointerId) return;
        window.removeEventListener('pointermove', pointerMove, true);
        window.removeEventListener('pointerup', pointerEnd, true);
        window.removeEventListener('pointercancel', pointerEnd, true);
        finish(endEvent.type === 'pointercancel');
      };
      window.addEventListener('pointermove', pointerMove, { capture: true, passive: false });
      window.addEventListener('pointerup', pointerEnd, true);
      window.addEventListener('pointercancel', pointerEnd, true);
    });
  });
}

async function docxToPlainText(file) {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);
  let eocd = -1;
  for (let index = view.byteLength - 22; index >= Math.max(0, view.byteLength - 22 - 65536); index -= 1) {
    if (view.getUint32(index, true) === 0x06054b50) { eocd = index; break; }
  }
  if (eocd < 0) throw new Error('这不是有效的 Word(docx) 文件');
  const entryCount = view.getUint16(eocd + 10, true);
  let offset = view.getUint32(eocd + 16, true);
  const decoder = new TextDecoder('utf-8');
  for (let index = 0; index < entryCount; index += 1) {
    if (offset + 46 > view.byteLength || view.getUint32(offset, true) !== 0x02014b50) break;
    const method = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localOffset = view.getUint32(offset + 42, true);
    const name = decoder.decode(new Uint8Array(buffer, offset + 46, nameLength));
    if (name === 'word/document.xml') {
      const localNameLength = view.getUint16(localOffset + 26, true);
      const localExtraLength = view.getUint16(localOffset + 28, true);
      const dataStart = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = new Uint8Array(buffer, dataStart, compressedSize);
      let xmlBytes;
      if (method === 0) {
        xmlBytes = compressed;
      } else if (method === 8) {
        if (typeof DecompressionStream !== 'function') throw new Error('当前系统不支持解析 docx，请另存为 txt 再上传');
        const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
        xmlBytes = new Uint8Array(await new Response(stream).arrayBuffer());
      } else {
        throw new Error('这个 docx 的压缩方式不支持，请另存为 txt 再上传');
      }
      const xml = decoder.decode(xmlBytes);
      return xml
        .replace(/<w:tab\b[^>]*\/?>(?:<\/w:tab>)?/g, '\t')
        .replace(/<w:br\b[^>]*\/?>(?:<\/w:br>)?/g, '\n')
        .replace(/<\/w:p>/g, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    }
    offset += 46 + nameLength + extraLength + commentLength;
  }
  throw new Error('这个 docx 里没有找到正文');
}

async function fileToMemoryText(file, kind) {
  const lowerName = file.name.toLocaleLowerCase();
  if (lowerName.endsWith('.docx')) return docxToPlainText(file);
  const raw = await file.text();
  try {
    const parsed = lowerName.endsWith('.jsonl') ? parseJsonlChat(raw, file.name)
      : lowerName.endsWith('.json') ? parseJsonChat(raw, file.name)
        : null;
    if (parsed?.messages?.length) {
      return parsed.messages.map((message) => `${message.name || (message.role === 'user' ? parsed.userName : parsed.characterName)}：${message.text}`).join('\n');
    }
  } catch {}
  return recoverMojibake(raw);
}

function ragCorpusFieldSelectHtml(purpose, label, parsed, required = false) {
  const selected = parsed?.fieldMap?.[purpose] || '';
  const options = [`<option value="">${required ? '请选择字段' : '不使用'}</option>`, ...(parsed?.availableFields || []).map((field) => `<option value="${escapeHtml(field)}" ${field === selected ? 'selected' : ''}>${escapeHtml(field)}</option>`)].join('');
  return `<label>${escapeHtml(label)}${required ? ' *' : ''}<select data-rag-field="${purpose}">${options}</select></label>`;
}

function reviewRagCorpusImport(raw, fileName) {
  const modal = detailBody.querySelector('#ragCorpusImportModal');
  if (!modal) return Promise.reject(new Error('语料检查界面暂时无法打开，请返回后重试'));
  const summaryHost = modal.querySelector('#ragCorpusImportSummary');
  const fieldsHost = modal.querySelector('#ragCorpusFieldGrid');
  const previewHost = modal.querySelector('#ragCorpusImportPreview');
  const confirmButton = modal.querySelector('#confirmRagCorpusImport');
  const cancelButton = modal.querySelector('#cancelRagCorpusImport');
  let parsed = parseRagCorpusText(raw, fileName);
  const render = () => {
    const summary = parsed.summary || {};
    const people = (summary.characterCounts || []).slice(0, 8);
    summaryHost.innerHTML = `<div class="rag-corpus-summary"><b>${escapeHtml(fileName)}</b><span>共 ${summary.totalRows || 0} 行 · 有效 ${summary.validRows || 0} 条 · 缺少正文 ${summary.missingTextRows || 0} 条${summary.invalidJsonRows ? ` · 无效 JSON ${summary.invalidJsonRows} 行` : ''}</span>${people.length ? `<small>出场统计：${people.map((item) => `${escapeHtml(item.name)} ${item.count}`).join(' · ')}</small>` : '<small>没有可用的人物字段；仍可作为原作事实检索。</small>'}</div>`;
    fieldsHost.innerHTML = [
      ragCorpusFieldSelectHtml('text', '正文', parsed, true),
      ragCorpusFieldSelectHtml('people', '人物', parsed),
      ragCorpusFieldSelectHtml('scene', '场景', parsed),
      ragCorpusFieldSelectHtml('time', '时间', parsed),
      ragCorpusFieldSelectHtml('location', '地点', parsed),
      ragCorpusFieldSelectHtml('major', '重要度', parsed),
    ].join('');
    previewHost.innerHTML = `<div class="rag-corpus-preview"><b>预览</b>${parsed.entries.slice(0, 3).map((entry) => `<article><small>第 ${entry.rowNumber} 行${entry.scene ? ` · 场景 ${escapeHtml(entry.scene)}` : ''}${entry.people.length ? ` · ${escapeHtml(entry.people.join('、'))}` : ''}</small><p>${escapeHtml(entry.text.slice(0, 260))}${entry.text.length > 260 ? '…' : ''}</p></article>`).join('') || '<p class="memory-empty">请选择正确的正文字段后再导入。</p>'}</div>`;
    confirmButton.disabled = !parsed.fieldMap.text || !summary.validRows;
    fieldsHost.querySelectorAll('[data-rag-field]').forEach((select) => select.addEventListener('change', () => {
      const fieldMap = Object.fromEntries([...fieldsHost.querySelectorAll('[data-rag-field]')].map((item) => [item.dataset.ragField, item.value]));
      parsed = parseRagCorpusText(raw, fileName, fieldMap);
      render();
    }));
  };
  render();
  modal.hidden = false;
  return new Promise((resolve) => {
    const close = (value) => {
      modal.hidden = true;
      confirmButton.onclick = null;
      cancelButton.onclick = null;
      resolve(value);
    };
    confirmButton.onclick = () => close(parsed);
    cancelButton.onclick = () => close(null);
  });
}

async function importMemorySource(kind, chat = activeChat, options = {}) {
  const picker = document.createElement('input');
  picker.type = 'file';
  const isRagCorpus = kind === 'role' && String(options.libraryKind || '') === 'RAG语料';
  picker.multiple = !isRagCorpus;
  picker.accept = isRagCorpus ? '.json,.jsonl,application/json,application/jsonl' : '.txt,.md,.json,.jsonl,.csv,.docx,text/plain,application/json,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  picker.addEventListener('change', async () => {
    const files = [...(picker.files || [])];
    if (!files.length) return;
    const importButton = detailBody.querySelector(kind === 'chat' ? '#importChatMemory' : '#importRoleMemory');
    const importStatus = detailBody.querySelector(kind === 'chat' ? '#chatMemoryImportStatus' : '#knowledgeImportStatus');
    const originalButtonHtml = importButton?.innerHTML || '';
    if (importButton) {
      importButton.disabled = true;
      importButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 上传中…';
    }
    if (importStatus) {
      importStatus.hidden = false;
      importStatus.textContent = `正在读取 ${files.length} 个文件，大文件可能需要稍等…`;
    }
    let importedChunks = 0;
    try {
      const roleId = chat?.roleId || currentRole.id;
      const memory = ensureChatMemory(chat);
      const selectedLibraryIds = memory.knowledgeLibrarySelectionSet
        ? new Set(memory.knowledgeLibraryIds)
        : new Set(memoryDocumentGroups('role', '', roleId).map((group) => group.groupId));
      let nextLibraryOrder = memoryDocumentGroups('role', '', roleId).reduce((max, group) => Math.max(max, Number(group.libraryOrder) || 0), 0) + 1;
      for (const [fileIndex, file] of files.entries()) {
        if (importStatus) importStatus.textContent = `正在读取：${file.name}（${fileIndex + 1}/${files.length}）`;
        if (isRagCorpus) {
          const parsed = await reviewRagCorpusImport(await file.text(), file.name);
          if (!parsed) {
            if (importButton) { importButton.disabled = false; importButton.innerHTML = originalButtonHtml; }
            if (importStatus) { importStatus.hidden = true; importStatus.textContent = ''; }
            return;
          }
          const groupId = `memory-source-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
          const fallbackName = file.name.replace(/\.[^.]+$/, '') || file.name;
          const libraryName = String(options.libraryName || '').trim() || fallbackName;
          const documents = buildRagCorpusDocuments(parsed, { groupId, roleId, fileName: file.name, libraryName, libraryOrder: nextLibraryOrder, currentRoleName: currentRole?.name || '当前角色' });
          if (!documents.length) throw new Error('没有可导入的有效语料');
          if (importStatus) importStatus.textContent = `正在保存：${file.name}，共 ${parsed.summary.validRows} 条语料…`;
          await storeMemoryDocuments(documents);
          selectedLibraryIds.add(groupId);
          nextLibraryOrder += 1;
          importedChunks += parsed.summary.validRows;
          continue;
        }
        const text = await fileToMemoryText(file, kind);
        const chunks = kind === 'chat' ? chunkMemoryText(text) : chunkKnowledgeScenes(text, memorySettings.chunkSize, 1600);
        const groupId = `memory-source-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
        const fallbackName = file.name.replace(/\.[^.]+$/, '') || file.name;
        const libraryName = files.length === 1 && String(options.libraryName || '').trim() ? String(options.libraryName).trim() : fallbackName;
        const libraryKind = String(options.libraryKind || (kind === 'chat' ? '旧聊天' : '资料')).trim();
        const initialPerformance = normalizeKnowledgePerformanceState({}, currentRole?.name || '当前角色');
        const documents = chunks.map((chunk, index) => ({
          id: `${groupId}-${index}`,
          groupId,
          scope: kind === 'chat' ? 'chat' : 'role',
          chatId: kind === 'chat' ? chat?.id || '' : '',
          roleId: chat?.roleId || currentRole.id,
          sourceName: file.name,
          libraryName,
          libraryKind,
          libraryOrder: nextLibraryOrder,
          relationTriples: [],
          characterCatalog: [],
          ...(kind === 'chat' || index !== 0 ? {} : {
            ...initialPerformance,
            knowledgePromptSelections: normalizeKnowledgePromptSelections({}),
            groupMetadata: true,
          }),
          chunkKind: kind === 'chat' ? 'text' : 'scene',
          sceneIndex: index,
          title: `${file.name} ${index + 1}/${chunks.length}`,
          text: chunk,
          createdAt: new Date().toISOString(),
        }));
        if (importStatus) importStatus.textContent = `正在保存：${file.name}，共 ${chunks.length} 段…`;
        await storeMemoryDocuments(documents);
        if (kind !== 'chat') selectedLibraryIds.add(groupId);
        nextLibraryOrder += 1;
        importedChunks += documents.length;
      }
      if (kind !== 'chat') {
        memory.knowledgeLibrarySelectionSet = true;
        memory.knowledgeLibraryIds = [...selectedLibraryIds];
        saveChatHistoriesToCache();
      }
      showToast(kind === 'chat'
        ? `已导入 ${files.length} 个文件，分成 ${importedChunks} 段可召回资料`
        : isRagCorpus
          ? `已导入 ${importedChunks} 条 RAG 语料，已经可以直接召回；没有调用 AI${options.reimportOf ? '。原资料仍保留，确认新资料正常后可手动删除旧资料' : ''}`
          : `已保存 ${files.length} 份资料、${importedChunks} 个场景块；尚未请求 AI，请确认目标角色后手动开始整理`);
      openChatMemoryDetail(chat);
    } catch (error) {
      showToast(`上传失败：${error.message || '文件暂时无法读取'}`);
      if (importStatus) importStatus.textContent = `上传失败：${error.message || '文件暂时无法读取'}`;
      if (importButton) {
        importButton.disabled = false;
        importButton.innerHTML = originalButtonHtml;
      }
    }
  });
  picker.click();
}

function saveChatMemoryEditor(chat) {
  const memory = ensureChatMemory(chat);
  Object.values(memory.anchors || {}).forEach((anchor) => {
    anchor.value = String(detailBody.querySelector(`[data-anchor-value="${anchor.id}"]`)?.value ?? anchor.value).trim();
  });
  let invalidItem = null;
  memory.customStates = normalizeCustomStates(memory.customStates).map((item) => {
    const rawValue = detailBody.querySelector(`[data-custom-value="${item.id}"]`)?.value ?? item.value;
    const checked = validatedCustomStateValue(item, rawValue);
    if (!checked.ok && !invalidItem) invalidItem = item;
    return {
      ...item,
      name: String(detailBody.querySelector(`[data-custom-name="${item.id}"]`)?.value ?? item.name).trim() || item.name,
      value: checked.ok ? checked.value : item.value,
    };
  });
  if (invalidItem) {
    showToast(`“${invalidItem.name}”必须填写有效数字，已保留原值`);
    return false;
  }
  memory.globalState.currentTime = memory.anchors.currentTime?.value || '';
  memory.globalState.currentLocation = memory.anchors.currentLocation?.value || '';
  memory.updatedAt = new Date().toISOString();
  saveChatHistoriesToCache();
  showToast('本聊天框的动态记忆已保存');
  return true;
}

function portableMemoryDocument(document, chat) {
  const { embedding: _embedding, embeddingModel: _embeddingModel, embeddedAt: _embeddedAt, ...portable } = document;
  return {
    ...portable,
    chatId: chat.id,
    roleId: chat.roleId || currentRole.id,
  };
}

function portableKnowledgeDocument(document) {
  const portable = cloneData(document || {});
  delete portable.embedding;
  delete portable.embeddingModel;
  delete portable.embeddedAt;
  if (Array.isArray(portable.performanceCards)) {
    portable.performanceCards = portable.performanceCards.map((card) => {
      const next = { ...card };
      delete next.embedding;
      delete next.embeddingModel;
      delete next.embeddedAt;
      return next;
    });
  }
  return portable;
}

function createKnowledgeLibraryBundle(roleId, roleName, documents = memoryDocuments, exportedAt = new Date().toISOString()) {
  const targetRoleId = String(roleId || '').trim();
  const portableDocuments = (Array.isArray(documents) ? documents : [])
    .filter((document) => document?.scope === 'role' && String(document.roleId || '') === targetRoleId)
    .map(portableKnowledgeDocument);
  return {
    xiangsiKnowledgeLibrary: 1,
    exportedAt,
    role: { id: targetRoleId, name: String(roleName || '当前角色').trim() || '当前角色' },
    documents: portableDocuments,
  };
}

function remapKnowledgeDocumentReferences(document, documentIds, groupIds) {
  const remapDocumentId = (value) => documentIds.get(String(value || '')) || '';
  const remapGroupId = (value) => groupIds.get(String(value || '')) || '';
  const next = portableKnowledgeDocument(document);
  if (Array.isArray(next.relationTriples)) next.relationTriples = next.relationTriples.map((item) => ({ ...item, docId: item?.docId ? remapDocumentId(item.docId) : '' }));
  if (Array.isArray(next.characterCatalog)) next.characterCatalog = next.characterCatalog.map((item) => ({ ...item, docId: item?.docId ? remapDocumentId(item.docId) : '' }));
  if (Array.isArray(next.performanceCards)) next.performanceCards = next.performanceCards.map((item) => ({
    ...item,
    sourceDocId: item?.sourceDocId ? remapDocumentId(item.sourceDocId) : '',
    sourceGroupId: item?.sourceGroupId ? remapGroupId(item.sourceGroupId) : '',
  }));
  if (Array.isArray(next.roleProfiles)) next.roleProfiles = next.roleProfiles.map((item) => ({
    ...item,
    sourceGroupId: item?.sourceGroupId ? remapGroupId(item.sourceGroupId) : '',
    evidenceDocIds: normalizeStringList(item?.evidenceDocIds).map(remapDocumentId).filter(Boolean),
  }));
  if (Array.isArray(next.aliasCandidates)) next.aliasCandidates = next.aliasCandidates.map((item) => ({
    ...item,
    evidenceDocIds: normalizeStringList(item?.evidenceDocIds).map(remapDocumentId).filter(Boolean),
  }));
  if (next.extractionProgress?.processedByTarget && typeof next.extractionProgress.processedByTarget === 'object') {
    next.extractionProgress = {
      ...next.extractionProgress,
      status: next.extractionProgress.status === 'running' ? 'stopped' : next.extractionProgress.status,
      error: next.extractionProgress.status === 'running' ? '由记忆库文件恢复，可继续整理。' : next.extractionProgress.error,
      processedByTarget: Object.fromEntries(Object.entries(next.extractionProgress.processedByTarget).map(([targetId, progress]) => [targetId, {
        ...progress,
        docIds: normalizeStringList(progress?.docIds).map(remapDocumentId).filter(Boolean),
      }])),
    };
  }
  return next;
}

function prepareKnowledgeLibraryImport(data, targetRoleId, existingDocuments = memoryDocuments, prefix = `knowledge-import-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`) {
  if (Number(data?.xiangsiKnowledgeLibrary) !== 1) throw new Error('不是相思记忆、知识库文件');
  const sourceDocuments = (Array.isArray(data.documents) ? data.documents : []).filter((document) => document && typeof document === 'object' && (document.id || document.groupId));
  if (!sourceDocuments.length) throw new Error('这个记忆库文件没有可导入的资料');
  const sourceGroups = new Map();
  sourceDocuments.forEach((document, index) => {
    const oldGroupId = String(document.groupId || `ungrouped-${index}`);
    const order = Number.isFinite(Number(document.libraryOrder)) ? Number(document.libraryOrder) : Number.MAX_SAFE_INTEGER;
    const current = sourceGroups.get(oldGroupId);
    if (!current) sourceGroups.set(oldGroupId, { oldGroupId, order, firstIndex: index });
    else current.order = Math.min(current.order, order);
  });
  const orderedGroups = [...sourceGroups.values()].sort((left, right) => left.order - right.order || left.firstIndex - right.firstIndex);
  const existingForRole = (Array.isArray(existingDocuments) ? existingDocuments : []).filter((document) => document?.scope === 'role' && String(document.roleId || '') === String(targetRoleId || ''));
  const nextOrder = existingForRole.reduce((max, document) => Math.max(max, Number(document.libraryOrder) || 0), 0) + 1;
  const groupIds = new Map(orderedGroups.map((group, index) => [group.oldGroupId, `${prefix}-group-${index + 1}`]));
  const documentIds = new Map(sourceDocuments.map((document, index) => [String(document.id || `document-${index}`), `${prefix}-doc-${index + 1}`]));
  const groupOrders = new Map(orderedGroups.map((group, index) => [group.oldGroupId, nextOrder + index]));
  const importedDocuments = sourceDocuments.map((document, index) => {
    const oldGroupId = String(document.groupId || `ungrouped-${index}`);
    const oldDocumentId = String(document.id || `document-${index}`);
    return {
      ...remapKnowledgeDocumentReferences(document, documentIds, groupIds),
      id: documentIds.get(oldDocumentId),
      groupId: groupIds.get(oldGroupId),
      scope: 'role',
      roleId: String(targetRoleId || ''),
      chatId: '',
      libraryOrder: groupOrders.get(oldGroupId),
    };
  });
  orderedGroups.forEach((group) => {
    const newGroupId = groupIds.get(group.oldGroupId);
    const groupDocuments = importedDocuments.filter((document) => document.groupId === newGroupId);
    if (groupDocuments.length && !groupDocuments.some((document) => document.groupMetadata === true)) groupDocuments[0].groupMetadata = true;
  });
  return { documents: importedDocuments, groupIds: orderedGroups.map((group) => groupIds.get(group.oldGroupId)) };
}

function knowledgeLibraryHeaderActionsHtml() {
  return `<div class="knowledge-library-head-actions"><button type="button" id="showKnowledgeImport" class="knowledge-library-add" aria-label="添加知识库资料" title="添加知识库资料"><i class="fa-solid fa-plus"></i></button><button type="button" id="knowledgeLibraryMenu" class="knowledge-library-menu" aria-label="记忆库操作" aria-haspopup="true" aria-expanded="false"><i class="fa-solid fa-ellipsis-vertical"></i></button><div class="knowledge-library-actions-menu" id="knowledgeLibraryActions" hidden><button type="button" id="exportKnowledgeLibrary"><i class="fa-solid fa-file-arrow-down"></i> 导出记忆库</button><button type="button" id="importKnowledgeLibrary"><i class="fa-solid fa-file-arrow-up"></i> 导入记忆库</button></div></div>`;
}

function bindKnowledgeLibraryActionsMenu(root, { onExport, onImport } = {}) {
  const menu = root?.querySelector?.('#knowledgeLibraryMenu');
  const actions = root?.querySelector?.('#knowledgeLibraryActions');
  if (!menu || !actions) return;
  const close = () => {
    actions.hidden = true;
    menu.setAttribute('aria-expanded', 'false');
    unregisterTransientActionMenu('knowledge-library-actions');
    document.removeEventListener('click', onDocumentClick);
  };
  const onDocumentClick = (event) => {
    if (!actions.contains(event.target) && !menu.contains(event.target)) close();
  };
  menu.addEventListener('click', (event) => {
    event.stopPropagation();
    const willOpen = actions.hidden;
    if (!willOpen) {
      close();
      return;
    }
    closeTransientActionMenus();
    actions.hidden = !willOpen;
    menu.setAttribute('aria-expanded', String(willOpen));
    registerTransientActionMenu('knowledge-library-actions', {
      menu: actions,
      anchor: menu,
      owner: root,
      close,
      width: 150,
    });
    setTimeout(() => document.addEventListener('click', onDocumentClick), 0);
  });
  actions.querySelector('#exportKnowledgeLibrary')?.addEventListener('click', () => { close(); onExport?.(); });
  actions.querySelector('#importKnowledgeLibrary')?.addEventListener('click', () => { close(); onImport?.(); });
}

function exportKnowledgeLibrary(role = currentRole) {
  const bundle = createKnowledgeLibraryBundle(role?.id, roleDisplayName(role), memoryDocuments);
  if (!bundle.documents.length) return showToast('当前角色还没有可导出的记忆库资料');
  exportJsonFile(`${formatFileTimestamp()}-${roleDisplayName(role) || '角色'}-记忆知识库.json`, bundle);
  showToast(`已导出 ${memoryDocumentGroups('role', '', role?.id).length} 份记忆库资料`);
}

function importKnowledgeLibraryFile(chat = activeChat) {
  const picker = document.createElement('input');
  picker.type = 'file';
  picker.accept = '.json,application/json';
  picker.addEventListener('change', async () => {
    const file = picker.files?.[0];
    if (!file) return;
    try {
      const roleId = chat?.roleId || currentRole.id;
      const existingGroupIds = memoryDocumentGroups('role', '', roleId).map((group) => group.groupId);
      const data = JSON.parse(await file.text());
      const prepared = prepareKnowledgeLibraryImport(data, roleId, memoryDocuments);
      await storeMemoryDocuments(prepared.documents);
      const memory = ensureChatMemory(chat);
      const selected = memory.knowledgeLibrarySelectionSet ? new Set(memory.knowledgeLibraryIds) : new Set(existingGroupIds);
      prepared.groupIds.forEach((groupId) => selected.add(groupId));
      memory.knowledgeLibrarySelectionSet = true;
      memory.knowledgeLibraryIds = [...selected];
      saveChatHistoriesToCache();
      activeChatMemoryFeature = 'role-library';
      showToast(`已追加导入 ${prepared.groupIds.length} 份记忆库资料；向量可按需重新建立`);
      openChatMemoryDetail(chat);
    } catch (error) {
      showToast(`导入失败：${error.message || '文件无法识别'}`);
    }
  });
  picker.click();
}

function exportChatMemory(chat) {
  const bundle = {
    xiangsiChatMemory: 1,
    exportedAt: new Date().toISOString(),
    chat: {
      id: chat.id,
      title: chat.title,
      roleId: chat.roleId,
      characterName: chat.characterName,
      userName: chat.userName,
    },
    memory: normalizeChatMemory(chat.memory),
    documents: memoryDocumentsForChat(chat).map((document) => portableMemoryDocument(document, chat)),
  };
  exportJsonFile(`${formatFileTimestamp()}-${chat.title || '聊天'}-长记忆.json`, bundle);
}

function syncChatMemoryEditorFields(chat) {
  const memory = ensureChatMemory(chat);
  Object.values(memory.anchors || {}).forEach((anchor) => {
    const field = detailBody.querySelector(`[data-anchor-value="${anchor.id}"]`);
    if (field && document.activeElement !== field) field.value = anchor.value;
  });
}

function memorySummaryHistoryHtml(memory) {
  const entries = [...memory.summaries].reverse().slice(0, 50);
  if (!entries.length) return '<p class="memory-empty">还没有分批总结记录</p>';
  return entries.map((entry) => {
    const start = Math.max(1, Number(entry.start) + 1);
    const end = Math.max(start, Number(entry.end) + 1);
    const createdAt = entry.createdAt ? new Date(entry.createdAt).toLocaleString() : '';
    const label = entry.migrationOnly ? '旧版迁移检索资料' : `第 ${start}–${end} 条`;
    return `<details class="memory-summary-history-entry"><summary><span>${label}</span><small>${escapeHtml(createdAt)}</small></summary><div><textarea class="memory-history-editor" data-summary-entry-text="${escapeHtml(entry.id)}" rows="6">${escapeHtml(summaryNarrativeOnly(entry.text || ''))}</textarea><div class="memory-history-actions"><button type="button" data-save-summary-entry="${escapeHtml(entry.id)}"><i class="fa-solid fa-floppy-disk"></i> 保存修改</button>${entry.migrationOnly ? '' : `<button type="button" data-rerun-summary-entry="${escapeHtml(entry.id)}"><i class="fa-solid fa-rotate"></i> 重新总结此条</button>`}</div></div></details>`;
  }).join('');
}

function chatMemoryCharactersHtml(memory) {
  const characters = normalizeCharacterCatalog(memory.chatCharacters).filter((item) => !item.hidden);
  if (!characters.length) return '<p class="memory-empty">还没有聊天人物档案；后续总结会自动建立，也可以用“立即总结/整理”补建。</p>';
  return characters.map((item) => `<article class="chat-memory-character"><div><b>${escapeHtml(item.name)}</b>${item.aliases?.length ? `<small>别名：${escapeHtml(item.aliases.join('、'))}</small>` : ''}</div><p>${item.identity ? `<span><em>身份</em>${escapeHtml(item.identity)}</span>` : ''}${item.traits ? `<span><em>稳定特征</em>${escapeHtml(item.traits)}</span>` : ''}${item.speechStyle ? `<span><em>说话风格</em>${escapeHtml(item.speechStyle)}</span>` : ''}</p></article>`).join('');
}

function chatMemoryRelationsHtml(memory) {
  const cards = normalizeRelationshipCards(memory.relationshipCards);
  if (!cards.length) return '<p class="memory-empty">还没有达到“关系正式确立或质变”门槛的记录。</p>';
  return cards.map((item) => `<article class="chat-memory-relation-card"><header><b>${escapeHtml(item.source)}</b><i>↔</i><b>${escapeHtml(item.target)}</b><button type="button" data-edit-chat-relation="${escapeHtml(item.id)}" title="编辑"><i class="fa-solid fa-pen"></i></button><button type="button" data-delete-chat-relation="${escapeHtml(item.id)}" title="删除"><i class="fa-solid fa-trash-can"></i></button></header><p>${escapeHtml(item.currentRelation)}</p>${item.tags?.length ? `<small>标签：${escapeHtml(item.tags.join('、'))}</small>` : ''}${item.evidence ? `<small>当前证据：${escapeHtml(item.evidence)}</small>` : ''}${item.history?.length ? `<details><summary>正式变化历史（${item.history.length}）</summary>${item.history.map((entry) => `<div><b>${escapeHtml(entry.relation)}</b>${entry.reason ? `<span>${escapeHtml(entry.reason)}</span>` : ''}${entry.evidence ? `<small>${escapeHtml(entry.evidence)}</small>` : ''}</div>`).join('')}</details>` : ''}</article>`).join('');
}

function memoryDualTogglesHtml(scope, updateEnabled, sendEnabled) {
  return `<div class="memory-dual-toggles"><button type="button" class="memory-toggle-pill${updateEnabled ? ' is-on' : ''}" data-memory-toggle="update" data-memory-toggle-scope="${escapeHtml(scope)}" aria-pressed="${updateEnabled ? 'true' : 'false'}">更新</button><button type="button" class="memory-toggle-pill${sendEnabled ? ' is-on' : ''}" data-memory-toggle="send" data-memory-toggle-scope="${escapeHtml(scope)}" aria-pressed="${sendEnabled ? 'true' : 'false'}">发送给 AI</button></div>`;
}

function memoryPromptPreview(target, content) {
  const text = String(content || '').trim();
  if (target === 'summary') return `${text}\n\n${MEMORY_DYNAMIC_PROMPT}`;
  if (target === 'injection') return text.replace(/\{\{memories\}\}/gi, '【当前聊天状态与本轮召回内容】');
  return `${text}\n\n（字段 ID、增量 JSON 协议及关闭项过滤由程序固定，不会被提示词版本覆盖。）`;
}

function knowledgePerformanceExtractionStructurePreview() {
  return KNOWLEDGE_PERFORMANCE_FIELDS.map((field) => `${field.id}: ${field.outputLabel}`).join('\n');
}

function knowledgePerformanceInjectionPreview(fields = memorySettings.knowledgePerformanceSendFields) {
  const sampleCard = Object.fromEntries(KNOWLEDGE_PERFORMANCE_FIELDS.map((field) => [field.id, field.id === 'situationTags' ? [field.sample] : field.sample]));
  return performanceCardInjectionContent(sampleCard, fields) || '（本轮不发送情境演绎，因此也不会发起这类召回。）';
}

function knowledgePerformanceSendFieldsEditorHtml() {
  const selected = knowledgePerformanceSendFields();
  const enabled = new Set(selected);
  return `<section class="performance-send-fields" data-performance-send-fields>
    <div class="performance-send-fields-head"><div><b>发送给聊天 AI 的字段</b><small>九项始终提取和保存；这里仅控制召回后发送给聊天 AI 的内容。</small></div><em data-performance-fields-status>${escapeHtml(knowledgePerformanceSendFieldsStatus(selected))}</em></div>
    <div class="performance-send-field-grid">${KNOWLEDGE_PERFORMANCE_FIELDS.map((field) => `<label><input type="checkbox" value="${escapeHtml(field.id)}" data-performance-send-field ${enabled.has(field.id) ? 'checked' : ''}><span>${escapeHtml(field.label)}</span></label>`).join('')}</div>
    <div class="performance-send-field-actions"><button type="button" data-performance-fields-recommended>推荐4项</button><button type="button" data-performance-fields-all>全部9项</button></div>
    <label>整理结果结构（始终完整九项）<textarea rows="9" readonly data-performance-extraction-preview>${escapeHtml(knowledgePerformanceExtractionStructurePreview())}</textarea></label>
    <label>聊天注入预览（仅当前勾选项）<textarea rows="6" readonly data-performance-injection-preview>${escapeHtml(knowledgePerformanceInjectionPreview(selected))}</textarea></label>
  </section>`;
}

function memoryPromptEditorHtml(target, selectedId, scope = 'chat', ownerId = '') {
  const versions = memoryPromptVersions(target);
  const selected = resolveMemoryPrompt(target, selectedId);
  const purpose = MEMORY_PROMPT_TARGETS[target]?.label || '自定义状态';
  const performanceFields = target === 'knowledgePerformance' ? knowledgePerformanceSendFieldsEditorHtml() : '';
  return `<details class="memory-prompt-editor" data-prompt-editor data-prompt-target="${escapeHtml(target)}" data-prompt-scope="${escapeHtml(scope)}" data-prompt-owner="${escapeHtml(ownerId)}"><summary><span><b>${escapeHtml(purpose)}</b> · 编辑提示词</span><small>${escapeHtml(selected.name)}</small></summary><div class="memory-prompt-editor-body"><label>版本<select data-prompt-version>${versions.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === selected.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}</select></label><div class="memory-prompt-actions"><button type="button" data-prompt-new>新增</button><button type="button" data-prompt-rename ${selected.builtin ? 'disabled' : ''}>重命名</button><button type="button" data-prompt-delete ${selected.builtin ? 'disabled' : ''}>删除</button><button type="button" data-prompt-default>使用系统默认</button></div><label>提示词正文<textarea data-prompt-content rows="5" ${selected.builtin ? 'readonly' : ''}>${escapeHtml(selected.content)}</textarea></label><button type="button" class="memory-primary" data-prompt-save ${selected.builtin ? 'disabled' : ''}>保存提示词</button><label>最终发送内容预览<textarea data-prompt-preview rows="6" readonly>${escapeHtml(memoryPromptPreview(target, selected.content))}</textarea></label>${performanceFields}</div></details>`;
}

function memoryPromptCompactHtml(target, selectedId, scope = 'chat', ownerId = '', { showLibraryButton = true, title = '当前规则', buttonLabel = '编辑库' } = {}) {
  const versions = memoryPromptVersions(target);
  const selected = resolveMemoryPrompt(target, selectedId);
  const sendFieldBadge = target === 'knowledgePerformance' ? `<small class="memory-performance-fields-badge" data-performance-fields-badge>发送字段 ${knowledgePerformanceSendFields().length}/9</small>` : '';
  return `<div class="memory-prompt-compact${sendFieldBadge ? ' has-field-badge' : ''}" data-prompt-compact data-prompt-target="${escapeHtml(target)}" data-prompt-scope="${escapeHtml(scope)}" data-prompt-owner="${escapeHtml(ownerId)}"><span class="memory-prompt-compact-title">${escapeHtml(title)}</span><select aria-label="${escapeHtml(title)}" data-prompt-quick-version>${versions.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === selected.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}</select>${showLibraryButton ? `<button type="button" data-open-prompt-library="${escapeHtml(target)}">${escapeHtml(buttonLabel)}</button>` : ''}${sendFieldBadge}</div>`;
}

function refreshMemoryPromptSelectOptions(target) {
  const versions = memoryPromptVersions(target);
  detailBody.querySelectorAll(`[data-prompt-target="${target}"] select`).forEach((select) => {
    const previous = select.value;
    select.innerHTML = versions.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join('');
    select.value = versions.some((item) => item.id === previous) ? previous : memorySystemPromptId(target);
  });
}

function knowledgePromptSelectionKey(target) {
  return ({ knowledgePerformance: 'performance', knowledgeProfile: 'profile', knowledgeFacts: 'facts' })[target] || '';
}

async function setMemoryPromptSelection(chat, editor, promptId) {
  const target = editor.dataset.promptTarget;
  const scope = editor.dataset.promptScope;
  const ownerId = editor.dataset.promptOwner;
  const selected = resolveMemoryPrompt(target, promptId);
  if (scope === 'new-custom') return selected;
  const memory = ensureChatMemory(chat);
  if (scope === 'custom') {
    const item = memory.customStates.find((entry) => entry.id === ownerId);
    if (item) item.promptId = selected.id;
    saveChatHistoriesToCache();
  } else if (scope === 'knowledge') {
    const key = knowledgePromptSelectionKey(target);
    if (key) {
      const document = memoryDocuments.find((item) => item.groupId === ownerId && item.groupMetadata === true) || memoryDocuments.find((item) => item.groupId === ownerId) || {};
      const selections = normalizeKnowledgePromptSelections(document);
      selections[key] = selected.id;
      await updateKnowledgePerformanceMetadata(ownerId, { knowledgePromptSelections: selections });
    }
  } else {
    memory.promptSelections[target] = selected.id;
    saveChatHistoriesToCache();
  }
  return selected;
}

function syncMemoryPromptEditor(editor, selected) {
  const target = editor.dataset.promptTarget;
  const summaryName = editor.querySelector('summary small');
  const content = editor.querySelector('[data-prompt-content]');
  const preview = editor.querySelector('[data-prompt-preview]');
  const rename = editor.querySelector('[data-prompt-rename]');
  const remove = editor.querySelector('[data-prompt-delete]');
  const save = editor.querySelector('[data-prompt-save]');
  if (summaryName) summaryName.textContent = selected.name;
  if (content) {
    content.value = selected.content;
    content.readOnly = selected.builtin;
  }
  if (preview) preview.value = memoryPromptPreview(target, selected.content);
  [rename, remove, save].forEach((button) => { if (button) button.disabled = selected.builtin; });
}

function syncKnowledgePerformanceSendFieldControls(root = detailBody) {
  const selected = knowledgePerformanceSendFields();
  const enabled = new Set(selected);
  root.querySelectorAll('[data-performance-send-field]').forEach((input) => { input.checked = enabled.has(input.value); });
  root.querySelectorAll('[data-performance-fields-status]').forEach((status) => { status.textContent = knowledgePerformanceSendFieldsStatus(selected); });
  root.querySelectorAll('[data-performance-injection-preview]').forEach((preview) => { preview.value = knowledgePerformanceInjectionPreview(selected); });
  root.querySelectorAll('[data-performance-fields-badge]').forEach((badge) => { badge.textContent = `发送字段 ${selected.length}/9`; });
}

function saveKnowledgePerformanceSendFieldsFromEditor(editor, fields, toastMessage = '') {
  memorySettings.knowledgePerformanceSendFields = normalizeKnowledgePerformanceSendFields(fields);
  saveAppStateToCache();
  syncKnowledgePerformanceSendFieldControls(detailBody);
  if (toastMessage) showToast(toastMessage);
}

function bindMemoryPromptEditors(chat = activeChat) {
  detailBody.querySelectorAll('[data-prompt-editor]').forEach((editor) => {
    const target = editor.dataset.promptTarget;
    const select = editor.querySelector('[data-prompt-version]');
    const selectedEntry = () => resolveMemoryPrompt(target, select?.value);
    editor.querySelector('[data-prompt-content]')?.addEventListener('input', (event) => {
      const preview = editor.querySelector('[data-prompt-preview]');
      if (preview) preview.value = memoryPromptPreview(target, event.currentTarget.value);
    });
    if (target === 'knowledgePerformance') {
      editor.querySelectorAll('[data-performance-send-field]').forEach((input) => input.addEventListener('change', () => {
        const fields = [...editor.querySelectorAll('[data-performance-send-field]:checked')].map((item) => item.value);
        saveKnowledgePerformanceSendFieldsFromEditor(editor, fields);
      }));
      editor.querySelector('[data-performance-fields-recommended]')?.addEventListener('click', () => {
        saveKnowledgePerformanceSendFieldsFromEditor(editor, KNOWLEDGE_PERFORMANCE_RECOMMENDED_FIELDS, '已选择推荐4项；完整九项资料没有删除');
      });
      editor.querySelector('[data-performance-fields-all]')?.addEventListener('click', () => {
        saveKnowledgePerformanceSendFieldsFromEditor(editor, KNOWLEDGE_PERFORMANCE_ALL_FIELDS, '已恢复发送全部9项');
      });
    }
    select?.addEventListener('change', async () => {
      const selected = await setMemoryPromptSelection(chat, editor, select.value);
      syncMemoryPromptEditor(editor, selected);
      if (editor.dataset.promptScope === 'chat') {
        detailBody.querySelectorAll(`[data-prompt-compact][data-prompt-scope="chat"][data-prompt-target="${target}"] [data-prompt-quick-version]`).forEach((quickSelect) => { quickSelect.value = selected.id; });
      }
    });
    editor.querySelector('[data-prompt-new]')?.addEventListener('click', async () => {
      const current = selectedEntry();
      const name = String(prompt('新版本名称：', `${current.name} - 副本`) || '').trim();
      if (!name) return;
      const versions = memoryPromptVersions(target);
      if (versions.some((item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase())) return showToast('同一用途下的版本名称不能重复');
      const entry = { id: `prompt-${target}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`, name, content: current.content, builtin: false };
      memorySettings.promptLibraries[target].push(entry);
      saveAppStateToCache();
      refreshMemoryPromptSelectOptions(target);
      select.value = entry.id;
      await setMemoryPromptSelection(chat, editor, entry.id);
      syncMemoryPromptEditor(editor, entry);
      showToast('已复制当前版本，可以继续修改');
    });
    editor.querySelector('[data-prompt-rename]')?.addEventListener('click', () => {
      let entry = selectedEntry();
      if (entry.builtin) return;
      const name = String(prompt('新的版本名称：', entry.name) || '').trim();
      if (!name) return;
      if (memoryPromptVersions(target).some((item) => item.id !== entry.id && item.name.toLocaleLowerCase() === name.toLocaleLowerCase())) return showToast('版本名称不能重复');
      entry = resolveMemoryPrompt(target, entry.id);
      entry.name = name;
      const option = select.querySelector(`option[value="${CSS.escape(entry.id)}"]`);
      if (option) option.textContent = name;
      saveAppStateToCache();
      refreshMemoryPromptSelectOptions(target);
      select.value = entry.id;
      syncMemoryPromptEditor(editor, entry);
    });
    editor.querySelector('[data-prompt-save]')?.addEventListener('click', () => {
      const entry = selectedEntry();
      const content = String(editor.querySelector('[data-prompt-content]')?.value || '').trim();
      if (entry.builtin || !content) return showToast(entry.builtin ? '系统默认不可修改，请先点“新增”复制一份' : '提示词正文不能为空');
      entry.content = content;
      saveAppStateToCache();
      syncMemoryPromptEditor(editor, entry);
      showToast('提示词已保存，所有选择此版本的聊天会共同使用');
    });
    editor.querySelector('[data-prompt-default]')?.addEventListener('click', async () => {
      const id = memorySystemPromptId(target);
      select.value = id;
      const selected = await setMemoryPromptSelection(chat, editor, id);
      syncMemoryPromptEditor(editor, selected);
    });
    editor.querySelector('[data-prompt-delete]')?.addEventListener('click', async () => {
      const entry = selectedEntry();
      if (entry.builtin || !confirm(`删除提示词版本“${entry.name}”？其他正在使用它的聊天会切回系统默认。`)) return;
      memorySettings.promptLibraries[target] = (memorySettings.promptLibraries[target] || []).filter((item) => item.id !== entry.id);
      chatHistories.forEach((itemChat) => {
        const itemMemory = ensureChatMemory(itemChat);
        if (itemMemory.promptSelections?.[target] === entry.id) itemMemory.promptSelections[target] = memorySystemPromptId(target);
        itemMemory.customStates = normalizeCustomStates(itemMemory.customStates).map((item) => item.promptId === entry.id ? { ...item, promptId: memorySystemPromptId('customState') } : item);
      });
      const key = knowledgePromptSelectionKey(target);
      const changedDocs = memoryDocuments.filter((doc) => doc.knowledgePromptId === entry.id || (key && normalizeKnowledgePromptSelections(doc)[key] === entry.id)).map((doc) => {
        const selections = normalizeKnowledgePromptSelections(doc);
        if (key) selections[key] = memorySystemPromptId(target);
        return { ...doc, knowledgePromptId: doc.knowledgePromptId === entry.id ? '' : doc.knowledgePromptId, knowledgePromptSelections: selections };
      });
      if (changedDocs.length) await storeMemoryDocuments(changedDocs);
      saveAppStateToCache();
      saveChatHistoriesToCache();
      refreshMemoryPromptSelectOptions(target);
      const id = memorySystemPromptId(target);
      select.value = id;
      const selected = await setMemoryPromptSelection(chat, editor, id);
      syncMemoryPromptEditor(editor, selected);
      showToast('版本已删除，并切回系统默认');
    });
  });
}

function bindMemoryPromptCompacts(chat = activeChat, selectMemoryFeature = null) {
  detailBody.querySelectorAll('[data-prompt-compact]').forEach((compact) => {
    const select = compact.querySelector('[data-prompt-quick-version]');
    select?.addEventListener('change', async () => {
      const selected = await setMemoryPromptSelection(chat, compact, select.value);
      const target = compact.dataset.promptTarget;
      const centralEditor = detailBody.querySelector(`[data-memory-feature-panel="table-prompts"] [data-prompt-editor][data-prompt-target="${target}"]`);
      const centralSelect = centralEditor?.querySelector('[data-prompt-version]');
      if (centralEditor && centralSelect) {
        centralSelect.value = selected.id;
        syncMemoryPromptEditor(centralEditor, selected);
      }
      showToast(`已使用“${selected.name}”`);
    });
  });
  detailBody.querySelectorAll('[data-open-prompt-library]').forEach((button) => button.addEventListener('click', () => {
    const target = button.dataset.openPromptLibrary;
    const sourceCompact = button.closest('[data-prompt-compact]');
    if (typeof selectMemoryFeature === 'function') selectMemoryFeature('table-prompts');
    const editor = detailBody.querySelector(`[data-memory-feature-panel="table-prompts"] [data-prompt-editor][data-prompt-target="${target}"]`);
    if (!editor) return;
    if (sourceCompact) {
      editor.dataset.promptScope = sourceCompact.dataset.promptScope || 'chat';
      editor.dataset.promptOwner = sourceCompact.dataset.promptOwner || '';
      const sourceSelect = sourceCompact.querySelector('[data-prompt-quick-version]');
      const editorSelect = editor.querySelector('[data-prompt-version]');
      const selected = resolveMemoryPrompt(target, sourceSelect?.value);
      if (editorSelect) editorSelect.value = selected.id;
      syncMemoryPromptEditor(editor, selected);
    }
    editor.open = true;
    editor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    editor.classList.add('is-targeted');
    setTimeout(() => editor.classList.remove('is-targeted'), 1800);
  }));
}

function bindKnowledgeRecallLimitInputs(groupId) {
  detailBody.querySelectorAll('.knowledge-layer-recall').forEach((control) => {
    control.addEventListener('click', (event) => event.stopPropagation());
    control.addEventListener('keydown', (event) => event.stopPropagation());
  });
  detailBody.querySelectorAll('[data-knowledge-recall-limit]').forEach((input) => {
    const key = input.dataset.knowledgeRecallLimit === 'facts' ? 'factRecallLimit' : 'performanceRecallLimit';
    const fallback = key === 'factRecallLimit' ? 4 : 3;
    input.dataset.savedValue = String(normalizeKnowledgeRecallLimit(input.value, fallback));
    input.addEventListener('click', (event) => event.stopPropagation());
    input.addEventListener('keydown', (event) => {
      event.stopPropagation();
      if (event.key === 'Enter') {
        event.preventDefault();
        input.blur();
      }
    });
    const commit = async () => {
      const raw = String(input.value || '').trim();
      if (!raw || !Number.isFinite(Number(raw))) {
        input.value = input.dataset.savedValue || String(fallback);
        showToast('请输入 0～8 的整数');
        return;
      }
      const value = normalizeKnowledgeRecallLimit(raw, fallback);
      input.value = String(value);
      if (input.dataset.savedValue === String(value)) return;
      input.dataset.savedValue = String(value);
      await updateKnowledgePerformanceMetadata(groupId, { [key]: value });
      showToast(value ? `已保存：每轮最多召回 ${value} ${key === 'factRecallLimit' ? '段原作事实' : '张情境演绎卡'}` : `已关闭${key === 'factRecallLimit' ? '原作事实原文' : '情境演绎卡'}召回`);
    };
    input.addEventListener('change', commit);
    input.addEventListener('blur', commit);
  });
}

function bindCustomMemoryStateDrag(chat, memory) {
  const list = detailBody.querySelector('.memory-custom-list');
  if (!list) return;
  let dragging = null;
  let holdTimer = null;
  const finish = () => {
    if (holdTimer) clearTimeout(holdTimer);
    holdTimer = null;
    if (!dragging) return;
    dragging.classList.remove('is-dragging');
    dragging.releasePointerCapture?.(dragging.dataset.pointerId);
    const ids = [...list.querySelectorAll('[data-custom-state-id]')].map((card) => card.dataset.customStateId);
    memory.customStates = ids.map((id, index) => ({ ...memory.customStates.find((item) => item.id === id), order: index })).filter((item) => item.id);
    saveChatHistoriesToCache();
    dragging = null;
    document.body.classList.remove('is-reordering');
  };
  list.querySelectorAll('[data-custom-state-id]').forEach((card) => {
    const grip = card.querySelector('.memory-custom-grip');
    grip?.addEventListener('pointerdown', (event) => {
      const pointerId = event.pointerId;
      holdTimer = setTimeout(() => {
        dragging = card;
        card.dataset.pointerId = String(pointerId);
        card.setPointerCapture?.(pointerId);
        card.classList.add('is-dragging');
        document.body.classList.add('is-reordering');
        try { navigator.vibrate?.(12); } catch (_) {}
      }, event.pointerType === 'mouse' ? 0 : 320);
    });
    card.addEventListener('pointermove', (event) => {
      if (!dragging || dragging !== card) return;
      event.preventDefault();
      const sibling = [...list.querySelectorAll('[data-custom-state-id]')].filter((item) => item !== card).find((item) => {
        const rect = item.getBoundingClientRect();
        return event.clientY < rect.top + rect.height / 2;
      });
      if (sibling) list.insertBefore(card, sibling);
      else list.append(card);
    });
    card.addEventListener('pointerup', finish);
    card.addEventListener('pointercancel', finish);
    grip?.addEventListener('pointerleave', () => { if (!dragging && holdTimer) { clearTimeout(holdTimer); holdTimer = null; } });
  });
}

function memoryAnchorCardsHtml(memory) {
  return Object.values(memory.anchors || {}).map((item) => `<article class="memory-anchor-card"><div class="memory-card-head">${memoryDualTogglesHtml(`anchor:${item.id}`, item.updateEnabled, item.sendEnabled)}<b>${escapeHtml(item.name)}</b></div><label>当前值<input data-anchor-value="${escapeHtml(item.id)}" value="${escapeHtml(item.value)}" placeholder="暂时未知"></label>${memoryPromptCompactHtml(item.id, memory.promptSelections?.[item.id])}</article>`).join('');
}

function memoryOpenPlotsHtml(memory) {
  const plots = normalizeOpenPlots(memory.openPlots);
  if (!plots.length) return '<p class="memory-empty">暂时没有未完成的目标、伏笔、危险或正式约定。</p>';
  return plots.map((item) => `<article class="memory-plot-card"><b>${escapeHtml(item.title)}</b>${item.details ? `<p>${escapeHtml(item.details)}</p>` : ''}<small>${[item.people, item.status].filter(Boolean).map(escapeHtml).join(' · ')}</small></article>`).join('');
}

function memoryCustomStatesHtml(memory) {
  const items = normalizeCustomStates(memory.customStates);
  if (!items.length) return '<p class="memory-empty">还没有自定义状态。可添加伤势、好感、服装、天气等你真正需要的项目。</p>';
  return items.map((item) => {
    const range = item.valueType === 'number' ? [item.min != null ? `最小 ${item.min}` : '', item.max != null ? `最大 ${item.max}` : '', item.unit].filter(Boolean).join(' · ') : '';
    const progress = item.valueType === 'number' && item.showProgress && item.min != null && item.max != null && item.max > item.min && Number.isFinite(Number(item.value)) ? `<progress min="${item.min}" max="${item.max}" value="${item.value}"></progress>` : '';
    const valueControl = item.valueType === 'number' ? `<input data-custom-value="${escapeHtml(item.id)}" type="number" ${item.min != null ? `min="${item.min}"` : ''} ${item.max != null ? `max="${item.max}"` : ''} value="${escapeHtml(item.value)}">` : `<textarea data-custom-value="${escapeHtml(item.id)}" rows="3">${escapeHtml(item.value)}</textarea>`;
    return `<article class="memory-custom-card ${item.legacy ? 'is-legacy' : ''}" data-custom-state-id="${escapeHtml(item.id)}"><div class="memory-card-head"><span class="memory-custom-grip" title="长按拖拽排序"><i class="fa-solid fa-grip-vertical"></i></span>${memoryDualTogglesHtml(`custom:${item.id}`, item.updateEnabled, item.sendEnabled)}<input data-custom-name="${escapeHtml(item.id)}" value="${escapeHtml(item.name)}" aria-label="项目名"><button type="button" data-delete-custom-state="${escapeHtml(item.id)}" title="删除"><i class="fa-solid fa-trash-can"></i></button></div>${item.legacy ? '<small class="memory-migration-badge">旧版迁移资料 · 默认不更新、不发送</small>' : ''}<label>当前值${valueControl}${range ? `<small>${escapeHtml(range)}</small>` : ''}${progress}</label>${memoryPromptCompactHtml('customState', item.promptId, 'custom', item.id)}</article>`;
  }).join('');
}

function chatMemoryTableRowsHtml(rows, fields, emptyText) {
  const normalized = normalizeMemoryRows(rows, fields.map(([key]) => key));
  if (!normalized.length) return `<p class="memory-empty">${escapeHtml(emptyText)}（0 行）</p>`;
  return normalized.map((row, index) => `<article class="chat-memory-table-row"><header><b>#${index + 1}</b></header><div>${fields.map(([key, label]) => row[key] ? `<p><em>${escapeHtml(label)}</em><span>${escapeHtml(row[key])}</span></p>` : '').join('')}</div></article>`).join('');
}

function memoryRetrievalLogsHtml(memory) {
  const logs = [...(Array.isArray(memory.retrievalLogs) ? memory.retrievalLogs : [])].reverse().slice(0, 20);
  if (!logs.length) return '<p class="memory-empty">还没有召回记录。发送一条消息，或在上方执行召回测试后，这里会显示真正发送了哪些记忆。</p>';
  return logs.map((entry) => {
    const createdAt = entry.createdAt ? new Date(entry.createdAt).toLocaleString() : '';
    const sections = [
      ...(entry.chatCharacters || []), ...(entry.chatRelations || []),
      ...(entry.knowledgeCharacters || []), ...(entry.knowledgeRelations || []),
    ];
    const itemList = (items, label) => (items || []).length ? `<section class="memory-retrieval-channel"><b>${escapeHtml(label)}</b><ul>${items.map((item) => `<li>${escapeHtml(item.sourceName || item.id || '资料')}<small>${escapeHtml(item.preview || '')}</small></li>`).join('')}</ul></section>` : `<p class="memory-empty">${escapeHtml(label)}：本轮无命中</p>`;
    const performanceFields = entry.performanceSendFields && typeof entry.performanceSendFields === 'object' ? entry.performanceSendFields : null;
    const performanceFieldSummary = performanceFields
      ? `<section class="memory-retrieval-channel memory-performance-log"><b>当前发送字段</b><p>${escapeHtml(performanceFields.status || `${(performanceFields.ids || []).length}/9`)}${(performanceFields.labels || []).length ? ` · ${escapeHtml(performanceFields.labels.join('、'))}` : ' · AI 演绎卡已关闭；直接 RAG 语料不受此九项开关影响'}</p></section>`
      : '';
    const performanceList = (entry.performanceCards || []).length
      ? `<section class="memory-retrieval-channel memory-performance-log"><b>情境演绎命中</b><ul>${entry.performanceCards.map((item) => `<li><strong>${escapeHtml(item.sourceName || item.id || '资料')}</strong><details><summary>完整九项命中（用于检索排序）</summary><small>${escapeHtml(item.fullContent || item.preview || '')}</small></details><details><summary>最终发送</summary><small>${escapeHtml(item.injectedContent || item.preview || '')}</small></details></li>`).join('')}</ul></section>`
      : '<p class="memory-empty">情境演绎命中：本轮无命中</p>';
    const ragCorpusList = (entry.ragCorpusHits || []).length
      ? `<section class="memory-retrieval-channel memory-rag-corpus-log"><b>RAG语料命中</b><ul>${entry.ragCorpusHits.map((item) => `<li><strong>${escapeHtml(item.sourceName || item.id || 'RAG语料')}</strong><small>第 ${item.rowNumber || '?'} 行 · 分配到${escapeHtml(item.destination || '情境参考')}${item.people?.length ? ` · 出场人物：${escapeHtml(item.people.join('、'))}` : ''}</small><pre>${escapeHtml(item.preview || '')}</pre></li>`).join('')}</ul></section>`
      : '<p class="memory-empty">RAG语料命中：本轮无命中</p>';
    const documents = (entry.documents || []).map((doc) => `<li><b>${escapeHtml(doc.scope === 'role' ? '知识库原文' : '聊天历史')}</b> · ${escapeHtml(doc.sourceName || '资料')}<small>${escapeHtml(doc.preview || '')}</small></li>`).join('');
    return `<details class="memory-retrieval-log"><summary><span>${escapeHtml(String(entry.query || '').replace(/\s+/g, ' ').slice(-70) || '无查询文本')}</span><small>${escapeHtml(createdAt)}</small></summary><div>${entry.currentStateIncluded ? `<p class="memory-retrieval-state"><b>当前聊天状态</b> 已常驻发送</p>${entry.currentState ? `<pre>${escapeHtml(entry.currentState)}</pre>` : ''}` : '<p class="memory-retrieval-state">当前聊天状态未启用</p>'}${(entry.roleProfiles || []).length ? `<section class="memory-retrieval-channel"><b>常驻角色本色卡</b><pre>${escapeHtml(entry.roleProfiles.join('\n\n'))}</pre></section>` : '<p class="memory-empty">常驻角色本色卡：无</p>'}${entry.performanceQuery ? `<section class="memory-retrieval-channel"><b>情境查询</b><pre>${escapeHtml(entry.performanceQuery)}</pre></section>` : ''}${performanceFieldSummary}${performanceList}${ragCorpusList}${itemList(entry.plotSummaries, '本聊天剧情纪要')}${itemList(entry.canonFacts, '原作事实')}${sections.length ? `<section class="memory-retrieval-channel"><b>人物与关系召回</b><pre>${escapeHtml(sections.join('\n\n'))}</pre></section>` : '<p class="memory-empty">人物与关系召回：无</p>'}${documents ? `<section class="memory-retrieval-channel"><b>使用来源</b><ul>${documents}</ul></section>` : '<p class="memory-empty">使用来源：无</p>'}${entry.retrievalProcess && Object.keys(entry.retrievalProcess).length ? `<details class="memory-retrieval-technical"><summary>BM25／向量／重排真实参数</summary><pre>${escapeHtml(JSON.stringify(entry.retrievalProcess, null, 2))}</pre></details>` : ''}${entry.finalContent ? `<details class="memory-retrieval-final"><summary>最终实际注入内容</summary><pre>${escapeHtml(entry.finalContent)}</pre></details>` : ''}</div></details>`;
  }).join('');
}

function memoryResultFromSavedSummaryText(text) {
  const source = String(text || '').trim();
  if (!source) return null;
  const labels = {
    '剧情摘要': 'plotSummary', '剧情总结': 'plotSummary', '剧情纪要': 'plotSummary',
    '当前场景': 'currentScene',
    '当前在场人物': 'presentCharacters',
    '曾经去过': 'visitedPlaces', '历史地点': 'visitedPlaces',
    '{{user}}身份与偏好': 'userProfile', '用户身份与偏好': 'userProfile',
    '关系与约定': 'relationship', '关系变化与约定': 'relationship',
    '重要事实': 'importantFacts',
    '重要物品': 'importantItems',
    '未完剧情': 'openThreads', '未完成剧情': 'openThreads',
  };
  const result = { plotSummary: '', currentScene: '', presentCharacters: [], visitedPlaces: [], userProfile: [], relationship: [], importantFacts: [], importantItems: [], openThreads: [], keywords: [] };
  const pattern = /【([^】]+)】\s*([\s\S]*?)(?=\n\s*【[^】]+】|$)/g;
  let found = false;
  for (const match of source.matchAll(pattern)) {
    const field = labels[match[1].trim()];
    if (!field) continue;
    found = true;
    const value = match[2].trim();
    if (field === 'plotSummary' || field === 'currentScene') result[field] = value;
    else result[field] = normalizeStringList(value.replace(/^[•·\-*]\s*/gm, ''));
  }
  if (!found) result.plotSummary = source;
  return result;
}

function recoverMissingSummaryHistoryFromDocuments(chat) {
  const memory = ensureChatMemory(chat);
  if (memory.summaries.length) return 0;
  const candidates = memoryDocumentsForChat(chat).filter((document) => (
    String(document.groupId || '').startsWith('summary-')
    && String(document.text || '').trim()
    && String(document.sourceName || '').includes('分批总结')
  ));
  if (!candidates.length) return 0;
  const groups = new Map();
  candidates.forEach((document) => {
    const groupId = document.groupId || document.id;
    const group = groups.get(groupId) || { id: groupId, documents: [], createdAt: document.createdAt || '' };
    group.documents.push(document);
    if (!group.createdAt || (document.createdAt && document.createdAt < group.createdAt)) group.createdAt = document.createdAt;
    groups.set(groupId, group);
  });
  const recovered = [...groups.values()].map((group) => {
    const startMatch = String(group.id).match(/-(\d+)$/);
    return {
      id: group.id,
      start: startMatch ? Number(startMatch[1]) : NaN,
      end: 0,
      text: group.documents.map((document) => String(document.text || '').trim()).filter(Boolean).join('\n\n'),
      createdAt: group.createdAt || new Date().toISOString(),
      recoveredAt: new Date().toISOString(),
    };
  }).sort((a, b) => {
    if (Number.isFinite(a.start) && Number.isFinite(b.start)) return a.start - b.start;
    return String(a.createdAt).localeCompare(String(b.createdAt));
  });
  recovered.forEach((entry, index) => {
    if (!Number.isFinite(entry.start)) entry.start = index * Math.max(10, Number(memorySettings.summaryLimit) || 30);
    const nextStart = recovered[index + 1]?.start;
    entry.end = Number.isFinite(nextStart)
      ? Math.max(entry.start, nextStart - 1)
      : Math.min(Math.max(0, chat.messages.length - 1), entry.start + Math.max(10, Number(memorySettings.summaryLimit) || 30) - 1);
  });
  memory.summaries = recovered;
  const latest = recovered[recovered.length - 1];
  memory.lastSummarizedMessageIndex = Math.max(memory.lastSummarizedMessageIndex, Number(latest?.end) + 1 || 0);
  if (!hasMeaningfulChatMemory(memory) && latest?.text) applyMemorySummaryResult(memory, memoryResultFromSavedSummaryText(latest.text));
  memory.summaryJob = null;
  memory.updatedAt = new Date().toISOString();
  saveChatHistoriesToCache();
  return recovered.length;
}

async function saveMemorySummaryEntryText(chat, entryId, text) {
  const memory = ensureChatMemory(chat);
  const entry = memory.summaries.find((item) => item.id === entryId);
  const cleanText = String(text || '').trim();
  if (!entry || !cleanText) throw new Error('总结内容不能为空');
  entry.text = cleanText;
  entry.updatedAt = new Date().toISOString();
  const existing = memoryDocuments.find((document) => document.id === entryId);
  const document = {
    ...(existing || {}),
    id: entryId,
    groupId: entryId,
    scope: 'chat',
    chatId: chat.id,
    roleId: chat.roleId || currentRole.id,
    sourceName: `${chat.title}·分批总结`,
    text: cleanText,
    createdAt: existing?.createdAt || entry.createdAt || new Date().toISOString(),
    updatedAt: entry.updatedAt,
    embedding: undefined,
    embeddingModel: undefined,
    embeddedAt: undefined,
  };
  await storeMemoryDocuments([document]);
  saveChatHistoriesToCache();
}

async function rerunMemorySummaryEntry(chat, entryId, button) {
  const memory = ensureChatMemory(chat);
  const entry = memory.summaries.find((item) => item.id === entryId);
  if (!entry) return;
  const messages = chat.messages.slice(Number(entry.start) || 0, (Number(entry.end) || 0) + 1).filter((message) => message.text);
  if (!messages.length) {
    showToast('找不到这批对应的原始聊天内容');
    return;
  }
  button.disabled = true;
  button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 正在重新总结…';
  try {
    const result = await callMemorySummaryApi(chat, messages, { memoryContext: createEmptyChatMemory() });
    const text = formatMemorySummaryRecord({ ...createEmptyChatMemory(), ...result });
    await saveMemorySummaryEntryText(chat, entryId, text);
    showToast('已重新总结并更新此条检索资料');
    openChatMemoryDetail(chat);
  } catch (error) {
    showToast(`重新总结失败：${error.message || '请稍后重试'}`);
    button.disabled = false;
    button.innerHTML = '<i class="fa-solid fa-rotate"></i> 重新总结此条';
  }
}

function openMemoryGroupEditor(chat, groupId) {
  const documents = memoryDocuments.filter((document) => document.groupId === groupId);
  if (!documents.length) return;
  const summaryEntry = ensureChatMemory(chat).summaries.find((entry) => entry.id === groupId);
  const target = detailBody.querySelector('#memoryGroupEditor');
  if (!target) return;
  const text = summaryEntry?.text || documents.map((document) => document.text).join('\n\n');
  target.hidden = false;
  target.innerHTML = `<b>编辑：${escapeHtml(documents[0].sourceName || '聊天剧情资料')}</b><textarea id="memoryGroupEditorText" rows="10">${escapeHtml(text)}</textarea><small>${summaryEntry ? '这是分批总结，保存后会同步到上方的分批总结记录。' : '保存后会按当前分段设置重新切分；已有向量会清除，之后可重新向量化。'}</small><div class="memory-history-actions"><button type="button" id="saveMemoryGroupEditor">保存修改</button><button type="button" id="cancelMemoryGroupEditor">取消</button></div>`;
  target.querySelector('#cancelMemoryGroupEditor')?.addEventListener('click', () => { target.hidden = true; target.innerHTML = ''; });
  target.querySelector('#saveMemoryGroupEditor')?.addEventListener('click', async (event) => {
    const value = target.querySelector('#memoryGroupEditorText')?.value || '';
    event.currentTarget.disabled = true;
    try {
      if (summaryEntry) {
        await saveMemorySummaryEntryText(chat, summaryEntry.id, value);
      } else {
        const source = documents[0];
        const chunks = chunkMemoryText(value);
        if (!chunks.length) throw new Error('内容不能为空');
        await deleteMemoryDocumentGroup(groupId);
        const now = new Date().toISOString();
        await storeMemoryDocuments(chunks.map((chunk, index) => ({
          id: `${groupId}-edited-${Date.now()}-${index}`,
          groupId,
          scope: 'chat',
          chatId: chat.id,
          roleId: chat.roleId || currentRole.id,
          sourceName: source.sourceName || '手动编辑的聊天剧情',
          title: source.title || '',
          text: chunk,
          createdAt: now,
        })));
      }
      showToast('已保存，AI 之后会使用修改后的资料');
      openChatMemoryDetail(chat);
    } catch (error) {
      showToast(`保存失败：${error.message || '请稍后重试'}`);
      event.currentTarget.disabled = false;
    }
  });
}

async function clearChatMemory(chat) {
  const groups = [...new Set(memoryDocumentsForChat(chat).map((document) => document.groupId))];
  for (const groupId of groups) await deleteMemoryDocumentGroup(groupId);
  chat.memory = createEmptyChatMemory();
  saveChatHistoriesToCache();
}

function importChatMemoryFile(chat) {
  const picker = document.createElement('input');
  picker.type = 'file';
  picker.accept = '.json,application/json';
  picker.addEventListener('change', async () => {
    const file = picker.files?.[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (Number(data?.xiangsiChatMemory) !== 1 || !data.memory) throw new Error('不是相思长记忆文件');
      const existing = memoryDocumentsForChat(chat).length || formatChatMemory(ensureChatMemory(chat));
      if (existing && !confirm('导入后会替换当前聊天的长记忆，但不会改动聊天消息。确定继续？')) return;
      await clearChatMemory(chat);
      chat.memory = normalizeChatMemory(data.memory);
      const importGroupPrefix = `memory-import-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
      const groupIds = new Map();
      const documents = (Array.isArray(data.documents) ? data.documents : []).filter((document) => document?.text).map((document, index) => {
        const oldGroup = document.groupId || `group-${index}`;
        if (!groupIds.has(oldGroup)) groupIds.set(oldGroup, `${importGroupPrefix}-${groupIds.size}`);
        return {
          ...document,
          id: `${importGroupPrefix}-doc-${index}`,
          groupId: groupIds.get(oldGroup),
          scope: 'chat',
          chatId: chat.id,
          roleId: chat.roleId || currentRole.id,
          sourceName: document.sourceName || '导入的长记忆',
          createdAt: document.createdAt || new Date().toISOString(),
          embedding: undefined,
          embeddingModel: undefined,
          embeddedAt: undefined,
        };
      });
      if (documents.length) await storeMemoryDocuments(documents);
      saveChatHistoriesToCache();
      showToast(`已导入长记忆与 ${documents.length} 段剧情资料`);
      openChatMemoryDetail(chat);
    } catch (error) {
      showToast(`导入失败：${error.message || '文件无法识别'}`);
    }
  });
  picker.click();
}

function updateMemorySummaryUi(chat = activeChat) {
  const memory = chat?.memory && typeof chat.memory === 'object' ? chat.memory : ensureChatMemory(chat);
  const task = activeMemorySummaryTask(chat);
  const job = memory.summaryJob;
  syncChatMemoryEditorFields(chat);
  const summaryButton = detailBody.querySelector('#summarizeChatNow');
  const panel = detailBody.querySelector('#memorySummaryProgress');
  if (summaryButton) {
    summaryButton.disabled = Boolean(task);
    summaryButton.innerHTML = task
      ? '<i class="fa-solid fa-spinner fa-spin"></i> 正在总结/整理'
      : job
        ? Number(job.nextIndex) >= Number(job.endIndex)
          ? '<i class="fa-solid fa-check"></i> 完成并整理'
          : '<i class="fa-solid fa-play"></i> 继续总结/整理'
        : '<i class="fa-solid fa-wand-magic-sparkles"></i> 立即总结/整理';
  }
  if (!panel) return;
  if (!job) {
    panel.hidden = true;
    return;
  }
  panel.hidden = false;
  const total = Math.max(0, Number(job.endIndex) - Number(job.startIndex));
  const processed = Math.max(0, Math.min(total, Number(job.nextIndex) - Number(job.startIndex)));
  const percent = total ? Math.round((processed / total) * 100) : 0;
  const title = panel.querySelector('#memorySummaryProgressTitle');
  const count = panel.querySelector('#memorySummaryProgressCount');
  const bar = panel.querySelector('#memorySummaryProgressBar');
  const hint = panel.querySelector('#memorySummaryProgressHint');
  const stopButton = panel.querySelector('#stopMemorySummary');
  const cancelButton = panel.querySelector('#cancelMemorySummary');
  const actionHint = panel.querySelector('#memorySummaryActionHint');
  const reachedEnd = processed >= total && total > 0;
  if (title) title.textContent = task
    ? task.stage
    : reachedEnd
      ? '总结内容已保存，点击“完成并整理”'
      : job.lastError
        ? `已暂停：${job.lastError}`
        : '总结已停止，可从断点继续';
  if (count) count.textContent = `已处理 ${processed} / ${total} 条（${percent}%）`;
  if (bar) bar.style.width = `${percent}%`;
  if (hint) hint.textContent = task
    ? '可以退出这个页面，任务会继续。刷新或关闭整个 App 会暂停，已完成批次不会丢失。'
    : reachedEnd
      ? '所有批次均已保存；点击“完成并整理”会把分批摘要合并进动态数据库。'
      : `已保存到第 ${processed} 条；点击“继续总结/整理”会从这里接着处理。`;
  if (stopButton) stopButton.hidden = !task;
  if (cancelButton) cancelButton.hidden = reachedEnd;
  if (actionHint) actionHint.innerHTML = reachedEnd
    ? '<b>总结已完成</b>：所有已生成内容和检索资料均已保存。'
    : '<b>停止总结</b>：保留已完成批次，下次可以继续。<b>取消总结</b>：二次确认后撤销本次任务产生的全部总结。';
}

let activeChatMemoryFeature = 'chat-data';
let activeKnowledgeGraphGroupId = '';
let knowledgeGraphCollapsed = true;
let knowledgeCharactersCollapsed = false;
let activeKnowledgeGraphBuildController = null;
let pendingCustomMemoryFocusId = '';

function shouldRefreshMemoryDetailAfterDocumentsLoad(isOpen, title) {
  return isOpen === true && String(title || '').trim() === '长记忆';
}

function openChatMemoryDetail(chat = activeChat) {
  const recoveredSummaryCount = recoverMissingSummaryHistoryFromDocuments(chat);
  const memory = ensureChatMemory(chat);
  const roleId = chat.roleId || currentRole.id;
  const roleGroups = memoryDocumentGroups('role', '', roleId);
  let selectedLibraryIds = memory.knowledgeLibrarySelectionSet ? new Set(memory.knowledgeLibraryIds) : new Set(roleGroups.map((group) => group.groupId));
  const activeGraphGroup = roleGroups.find((group) => group.groupId === activeKnowledgeGraphGroupId) || null;
  const groups = memoryDocumentGroups('chat', chat.id);
  const summaryCount = memory.summaries.length;
  openDetail('长记忆', `
    <div class="memory-page">
      <div class="memory-fixed-bar">
      <section class="memory-hero">
        <div class="memory-hero-main">
          <div class="memory-hero-title-row">
            <strong>${escapeHtml(chat.title)}</strong>
            <small class="memory-hero-scope">仅属于此聊天框</small>
            <button type="button" id="memoryHeroMenu" class="memory-hero-menu" aria-label="记忆操作" aria-haspopup="true" aria-expanded="false"><i class="fa-solid fa-ellipsis-vertical"></i></button>
            <div class="memory-hero-actions" id="memoryHeroActions" hidden>
              <button type="button" id="deleteChatMemory"><i class="fa-solid fa-trash-can"></i> 删除记忆</button>
              <button type="button" id="exportChatMemory"><i class="fa-solid fa-file-arrow-down"></i> 导出记忆</button>
              <button type="button" id="importChatMemoryFile"><i class="fa-solid fa-file-arrow-up"></i> 导入记忆</button>
            </div>
          </div>
          <div class="memory-hero-stats"><span><b>${chat.messages.length}</b>条对话</span><span><b>${summaryCount}</b>次总结</span><span><b>${groups.reduce((sum, group) => sum + group.count, 0)}</b>段剧情资料</span></div>
        </div>
      </section>
      <nav class="memory-feature-picker" aria-label="长记忆功能">
        <button type="button" class="memory-feature-card" data-memory-feature="role-library"><b>记忆/知识库</b><small>小说、剧本、RAG语料</small></button>
        <button type="button" class="memory-feature-card" data-memory-feature="chat-data"><b>本聊天框数据</b><small>现在与过去</small></button>
        <button type="button" class="memory-feature-card" data-memory-feature="table-prompts"><b>数据与提示词</b><small>全部真实提示词</small></button>
        <button type="button" class="memory-feature-card" data-memory-feature="memory-api"><b>记忆 API</b><small>总结与检索设置</small></button>
      </nav>
      </div>
      <div class="memory-feature-panel" data-memory-feature-panel="role-library" hidden>
        <section class="memory-card">
          <div class="memory-card-head knowledge-card-head"><div><b>记忆/知识库</b><small>本聊天可单独选择使用哪些资料；长按整条上下排序</small><small>+知识库资料支持：TXT、MD、JSON、JSONL、CSV、Word(DOCX)</small></div>${knowledgeLibraryHeaderActionsHtml()}</div>
          <div class="knowledge-import-form" id="knowledgeImportForm" hidden>
            <label>资料名称<input id="knowledgeLibraryName" placeholder="例如：长相思电视剧本"></label>
            <label>资料类型<select id="knowledgeLibraryKind"><option>小说</option><option>剧本</option><option>同人作品</option><option>旧聊天</option><option value="RAG语料">RAG语料</option><option>其他资料</option></select></label>
            <button type="button" id="importRoleMemory" class="memory-accent-action"><i class="fa-solid fa-file-arrow-up"></i> 选择文件并保存</button>
            <small class="knowledge-import-status" id="knowledgeImportStatus" hidden></small>
            <small class="knowledge-import-hint">普通资料支持 txt、md、json、jsonl、csv、Word；RAG语料第一版支持 JSONL 或 JSON 对象数组，导入前会检查字段。</small>
          </div>
          <div class="knowledge-library-list">${roleGroups.length ? roleGroups.map((group, index) => {
            const graphOpen = activeGraphGroup?.groupId === group.groupId && !knowledgeGraphCollapsed;
            const isCorpus = group.sourceFormat === 'rag-corpus';
            const amount = isCorpus ? `${Math.max(0, Number(group.corpusImportSummary?.validRows) || group.count)} 条语料` : `${group.count} 段`;
            return `<article class="knowledge-library-row ${selectedLibraryIds.has(group.groupId) ? 'is-enabled' : ''}" data-library-group-id="${escapeHtml(group.groupId)}"><span class="knowledge-library-order" aria-hidden="true">${index + 1}</span><span class="knowledge-library-grip" aria-hidden="true"><i class="fa-solid fa-grip-vertical"></i></span><label class="knowledge-library-select"><input type="checkbox" data-toggle-library="${escapeHtml(group.groupId)}" ${selectedLibraryIds.has(group.groupId) ? 'checked' : ''}><span><b>${escapeHtml(group.libraryName)}</b><small>${escapeHtml(group.libraryKind)} · ${amount} · ${group.chars.toLocaleString()} 字</small></span></label><div class="knowledge-library-actions"><button type="button" class="knowledge-graph-toggle ${graphOpen ? 'is-open' : ''}" data-open-knowledge-graph="${escapeHtml(group.groupId)}">角色资料 <i class="fa-solid fa-chevron-right"></i></button><button type="button" data-delete-role-memory-group="${escapeHtml(group.groupId)}" title="删除"><i class="fa-solid fa-trash-can"></i></button></div></article>${graphOpen ? `<div class="knowledge-graph-panel" id="knowledgeGraphPanel">${knowledgeGraphEditorHtml(group)}</div>` : ''}`;
          }).join('') : memoryDocumentsReady ? '<p class="memory-empty">还没有知识库资料，点击右上角添加小说、剧本、RAG语料、同人作品或旧聊天</p>' : '<p class="memory-empty memory-loading"><i class="fa-solid fa-spinner fa-spin"></i> 正在读取本机知识库资料，请稍候…</p>'}</div>
        </section>
      </div>
      <div class="memory-feature-panel" data-memory-feature-panel="chat-data" hidden>
      <section class="memory-card chat-memory-control-card">
        <div class="memory-card-head"><div><b>本聊天框动态记忆</b><small>只保留眼前状态、关系变化、未完剧情和按需召回的剧情纪要</small></div><div class="memory-summary-actions"><button type="button" id="summarizeChatNow"><i class="fa-solid fa-wand-magic-sparkles"></i> 立即总结/整理</button></div></div>
        <div class="memory-summary-progress" id="memorySummaryProgress" hidden>
          <div class="memory-summary-progress-head"><b id="memorySummaryProgressTitle">准备总结…</b><span id="memorySummaryProgressCount">已处理 0 / 0 条</span></div>
          <div class="memory-summary-progress-track"><i id="memorySummaryProgressBar"></i></div>
          <div class="memory-summary-tip"><i class="fa-solid fa-circle-info"></i><span><b>温馨提示</b><small id="memorySummaryProgressHint">可以退出这个页面，任务会继续。</small></span></div>
          <div class="memory-summary-control-actions"><button type="button" id="stopMemorySummary"><i class="fa-solid fa-pause"></i> 停止总结</button><button type="button" id="cancelMemorySummary" class="memory-summary-cancel"><i class="fa-solid fa-xmark"></i> 取消总结</button></div>
          <small id="memorySummaryActionHint"><b>停止总结</b>：保留已完成批次，并自动整理已完成内容；下次可以继续。<b>取消总结</b>：二次确认后撤销本次任务产生的全部总结。</small>
        </div>
      </section>
      <div class="chat-memory-dynamic-sections">
        <details class="memory-card memory-fold chat-memory-section" open><summary class="memory-fold-summary"><span><b>1. 当前时间与地点</b><small>两个锚点各自保存值、更新规则和双开关</small></span><em>2 项 <i class="fa-solid fa-chevron-right"></i></em></summary><div class="memory-fold-body memory-anchor-list">${memoryAnchorCardsHtml(memory)}</div></details>
        <details class="memory-card memory-fold chat-memory-section" open><summary class="memory-fold-summary">${memoryDualTogglesHtml('section:relationships', memory.sectionControls.relationships.updateEnabled, memory.sectionControls.relationships.sendEnabled)}<span><b>2. 人物与关系</b><small>聊天中的当前关系优先，原作资料绝不被改写</small></span><em>${memory.relationshipCards.length} 对 <i class="fa-solid fa-chevron-right"></i></em></summary><div class="memory-fold-body"><div class="memory-section-toolbar"><button type="button" id="addChatRelationship"><i class="fa-solid fa-plus"></i> 添加/更新关系</button></div><div class="chat-memory-relation-list">${chatMemoryRelationsHtml(memory)}</div><small>只有明确告白、成婚、相认、正式背叛、结盟等才记为正式变化。</small>${memoryPromptCompactHtml('relationships', memory.promptSelections?.relationships)}</div></details>
        <details class="memory-card memory-fold chat-memory-section" open><summary class="memory-fold-summary">${memoryDualTogglesHtml('section:openPlots', memory.sectionControls.openPlots.updateEnabled, memory.sectionControls.openPlots.sendEnabled)}<span><b>3. 未完剧情</b><small>只常驻目标、伏笔、危险和正式约定</small></span><em>${memory.openPlots.length} 项 <i class="fa-solid fa-chevron-right"></i></em></summary><div class="memory-fold-body"><div class="memory-plot-list">${memoryOpenPlotsHtml(memory)}</div>${memoryPromptCompactHtml('openPlots', memory.promptSelections?.openPlots)}</div></details>
        <details class="memory-card memory-fold chat-memory-section" open><summary class="memory-fold-summary"><span><b>4. 自定义状态</b><small>仅属于本聊天；可把项目定义存为模板</small></span><em>${memory.customStates.length} 项 <i class="fa-solid fa-chevron-right"></i></em></summary><div class="memory-fold-body"><div class="memory-section-toolbar"><button type="button" id="addCustomMemoryState"><i class="fa-solid fa-plus"></i> 添加项目</button><button type="button" id="saveCustomMemoryTemplate"><i class="fa-solid fa-floppy-disk"></i> 存为模板</button></div>${memorySettings.customStateTemplates?.length ? `<div class="memory-template-row"><select id="customMemoryTemplateSelect"><option value="">选择模板…</option>${memorySettings.customStateTemplates.map((template, index) => `<option value="${index}">${escapeHtml(template.name)}</option>`).join('')}</select><button type="button" id="applyCustomMemoryTemplate">应用</button></div>` : ''}<div class="memory-custom-list">${memoryCustomStatesHtml(memory)}</div></div></details>
        <details class="memory-card memory-fold chat-memory-section"><summary class="memory-fold-summary">${memoryDualTogglesHtml('section:summaries', memory.sectionControls.summaries.updateEnabled, memory.sectionControls.summaries.sendEnabled)}<span><b>5. 剧情纪要</b><small>分批保存，按 BM25/向量/重排召回，不整库常驻</small></span><em>${summaryCount} 条 <i class="fa-solid fa-chevron-right"></i></em></summary><div class="memory-fold-body"><div class="memory-summary-history">${memorySummaryHistoryHtml(memory)}</div>${memoryPromptCompactHtml('summaries', memory.promptSelections?.summaries)}</div></details>
        <section class="memory-card"><button type="button" id="saveChatMemory" class="memory-primary">保存手动修改</button></section>
      </div>
      <details class="memory-card memory-fold">
        <summary class="memory-fold-summary"><span><b>历史剧情资料库</b><small>总结记录与上传的旧聊天原文都在这里，按当前话题召回</small></span><em>${groups.reduce((sum, group) => sum + group.count, 0)} 段 <i class="fa-solid fa-chevron-right"></i></em></summary>
        <div class="memory-fold-body"><label class="toggle-row"><span><b>启用过去记忆检索</b><small>关闭后不执行 BM25、向量或重排；不会删除下面的资料</small></span><input id="chatMemoryRetrievePast" type="checkbox" ${memorySettings.retrievePast ? 'checked' : ''}></label><div class="memory-card-head"><small>上传的资料只属于这个聊天框</small><button type="button" id="importChatMemory"><i class="fa-solid fa-file-arrow-up"></i> 上传</button></div><div class="memory-source-list">${groups.length ? groups.map((group) => `<div class="memory-source-row"><span><b>${escapeHtml(group.sourceName)}</b><small>${group.count} 段 · ${group.chars.toLocaleString()} 字${memorySettings.vector ? ` · 向量 ${group.vectorCount}/${group.count}` : ''}</small></span><div class="memory-source-actions"><button type="button" data-edit-memory-group="${escapeHtml(group.groupId)}" title="编辑"><i class="fa-solid fa-pen"></i></button><button type="button" data-delete-memory-group="${escapeHtml(group.groupId)}" title="删除"><i class="fa-solid fa-trash-can"></i></button></div></div>`).join('') : '<p class="memory-empty">还没有上传旧剧情资料</p>'}</div><div id="memoryGroupEditor" class="memory-group-editor" hidden></div></div>
      </details>
      <section class="memory-card chat-memory-retrieval-card">
        <div class="memory-card-head"><div><b>召回记录</b><small>展示真实的联合召回：当前状态 → 本聊天人物关系 → 知识库 → 相关历史原文</small></div></div>
        <div class="memory-test-row"><input id="memoryTestQuery" placeholder="例如：相柳还记得我们看烟花吗？"><button type="button" id="runMemoryTest"><i class="fa-solid fa-magnifying-glass"></i></button></div>
        <div id="memoryTestResults" class="memory-test-results"></div>
        <div class="memory-retrieval-log-list">${memoryRetrievalLogsHtml(memory)}</div>
      </section>
      </div>
      <div class="memory-feature-panel" data-memory-feature-panel="table-prompts" hidden>
        <section class="memory-card">
          <div class="memory-card-head"><div><b>动态记忆与角色资料提示词库</b><small>所有需要生成式 AI 判断的真实规则都集中在这里；选择结果按聊天或资料单独保存</small></div></div>
          <div class="memory-schema-list">
            <div><b>1. 当前时间与地点</b><code>anchors.currentTime / currentLocation</code></div>
            <div><b>2. 人物与关系</b><code>relationshipCards + history</code></div>
            <div><b>3. 未完剧情</b><code>openPlots</code></div>
            <div><b>4. 自定义状态</b><code>customStates</code></div>
            <div><b>5. 剧情纪要</b><code>summaries（只供检索）</code></div>
          </div>
          <div class="memory-channel-note"><b>真实请求规则</b><span>总结 AI 只收到“自动更新”开启的项目及当前值；聊天 AI 只收到“发送给 AI”开启的当前状态。</span></div>
          ${Object.keys(MEMORY_PROMPT_TARGETS).map((target) => memoryPromptEditorHtml(target, memory.promptSelections?.[target])).join('')}
          <label>程序实际固定的增量协议<textarea rows="12" readonly>${escapeHtml(MEMORY_DYNAMIC_PROMPT)}</textarea></label>
        </section>
      </div>
      <div class="memory-relation-modal" id="chatRelationshipModal" hidden>
        <section><h3>添加/更新人物关系</h3><input id="chatRelationEditingId" type="hidden"><div class="memory-two-columns"><label>人物甲<input id="chatRelationSource" placeholder="人物名"></label><label>人物乙<input id="chatRelationTarget" placeholder="人物名"></label></div><label>当前关系<textarea id="chatRelationCurrent" rows="3" placeholder="自由文字，例如：已相互告白，但暂未公开关系"></textarea></label><label>可选标签<input id="chatRelationTags" placeholder="用逗号分隔"></label><label>当前关系证据<textarea id="chatRelationEvidence" rows="3" placeholder="支撑这次正式变化的原文"></textarea></label><label>变化原因<input id="chatRelationReason" placeholder="例如：明确告白"></label><div class="memory-modal-actions"><button type="button" id="cancelChatRelationship">取消</button><button type="button" id="saveChatRelationship" class="memory-primary">保存关系</button></div></section>
      </div>
      <div class="memory-relation-modal" id="customMemoryStateModal" hidden>
        <section><h3>添加自定义状态</h3><label>项目名称<input id="newCustomStateName" placeholder="例如：好感度、衣着、天气"></label><label>类型<select id="newCustomStateType"><option value="text">文本</option><option value="number">数值</option></select></label><label>初始值<input id="newCustomStateValue" placeholder="可以留空"></label><div id="newCustomStateNumberOptions" hidden><div class="memory-two-columns"><label>最小值<input id="newCustomStateMin" type="number" placeholder="可留空"></label><label>最大值<input id="newCustomStateMax" type="number" placeholder="可留空"></label></div><label>单位<input id="newCustomStateUnit" placeholder="例如：%、HP、点"></label><label class="toggle-row"><span><b>显示进度条</b></span><input id="newCustomStateProgress" type="checkbox"></label></div><div class="memory-dual-add-options"><label><input id="newCustomStateUpdate" type="checkbox" checked> 自动更新</label><label><input id="newCustomStateSend" type="checkbox" checked> 发送给 AI</label></div><small>开启“发送给 AI”后，本项会按拖拽顺序并入同一个【当前聊天状态】块；块的整体位置由【记忆 API】统一设置。</small>${memoryPromptCompactHtml('customState', memorySystemPromptId('customState'), 'new-custom', '', { showLibraryButton: false })}<div class="memory-modal-actions"><button type="button" id="cancelCustomMemoryState">取消</button><button type="button" id="saveCustomMemoryState" class="memory-primary">保存项目</button></div></section>
      </div>
      <div class="memory-relation-modal" id="ragCorpusImportModal" role="dialog" aria-modal="true" aria-labelledby="ragCorpusImportTitle" hidden>
        <section><h3 id="ragCorpusImportTitle">检查 RAG 语料</h3><div id="ragCorpusImportSummary"></div><div class="rag-corpus-field-grid" id="ragCorpusFieldGrid"></div><div id="ragCorpusImportPreview"></div><small>这里只解析并建立本机索引，不会调用总结 API。</small><div class="memory-modal-actions"><button type="button" id="cancelRagCorpusImport">取消</button><button type="button" id="confirmRagCorpusImport" class="memory-primary">确认导入</button></div></section>
      </div>
    </div>
  `);
  const resetMemoryFeatureScroll = () => {
    const reset = () => {
      detailBody.scrollTop = 0;
      detailPage.scrollTop = 0;
      const memoryPage = detailBody.querySelector('.memory-page');
      if (memoryPage) memoryPage.scrollTop = 0;
    };
    reset();
    requestAnimationFrame(reset);
    setTimeout(reset, 60);
  };
  const selectMemoryFeature = (feature, { resetScroll = false } = {}) => {
    const nextFeature = detailBody.querySelector(`[data-memory-feature="${feature}"]`) ? feature : 'chat-data';
    activeChatMemoryFeature = nextFeature;
    detailBody.querySelectorAll('[data-memory-feature]').forEach((button) => {
      const selected = button.dataset.memoryFeature === nextFeature;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-selected', String(selected));
    });
    detailBody.querySelectorAll('[data-memory-feature-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.memoryFeaturePanel !== nextFeature;
    });
    if (resetScroll) resetMemoryFeatureScroll();
  };
  detailBody.querySelectorAll('[data-memory-feature]').forEach((button) => button.addEventListener('click', () => {
    closeTransientActionMenus({ owner: detailPage });
    button.blur();
    if (button.dataset.memoryFeature === 'memory-api') {
      openMemoryDetail();
      return;
    }
    if (button.dataset.memoryFeature === 'table-prompts') {
      detailBody.querySelectorAll('[data-memory-feature-panel="table-prompts"] [data-prompt-editor]').forEach((editor) => {
        editor.dataset.promptScope = 'chat';
        editor.dataset.promptOwner = '';
        const target = editor.dataset.promptTarget;
        const selected = resolveMemoryPrompt(target, memory.promptSelections?.[target]);
        const select = editor.querySelector('[data-prompt-version]');
        if (select) select.value = selected.id;
        syncMemoryPromptEditor(editor, selected);
      });
    }
    selectMemoryFeature(button.dataset.memoryFeature, { resetScroll: true });
  }));
  selectMemoryFeature(activeChatMemoryFeature);
  bindMemoryPromptEditors(chat);
  bindMemoryPromptCompacts(chat, selectMemoryFeature);
  if (activeGraphGroup) bindKnowledgeRecallLimitInputs(activeGraphGroup.groupId);
  bindCustomMemoryStateDrag(chat, memory);
  if (pendingCustomMemoryFocusId) {
    const focusId = pendingCustomMemoryFocusId;
    pendingCustomMemoryFocusId = '';
    requestAnimationFrame(() => {
      const card = detailBody.querySelector(`[data-custom-state-id="${CSS.escape(focusId)}"]`);
      card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card?.classList.add('is-new');
      setTimeout(() => card?.classList.remove('is-new'), 1800);
    });
  }
  if (recoveredSummaryCount) showToast(`已从本机检索资料恢复 ${recoveredSummaryCount} 批总结记录`);
  bindKnowledgeLibraryActionsMenu(detailBody, {
    onExport: () => exportKnowledgeLibrary(currentRole),
    onImport: () => importKnowledgeLibraryFile(chat),
  });
  detailBody.querySelector('#showKnowledgeImport')?.addEventListener('click', () => {
    const form = detailBody.querySelector('#knowledgeImportForm');
    if (form) form.hidden = !form.hidden;
  });
  detailBody.querySelector('#importRoleMemory')?.addEventListener('click', () => importMemorySource('role', chat, {
    libraryName: detailBody.querySelector('#knowledgeLibraryName')?.value || '',
    libraryKind: detailBody.querySelector('#knowledgeLibraryKind')?.value || '资料',
  }));
  const ragDetailsModal = detailBody.querySelector('#ragCorpusDetailsModal');
  const closeRagDetails = () => { if (ragDetailsModal) ragDetailsModal.hidden = true; };
  ragDetailsModal?.querySelector('#closeRagCorpusDetails')?.addEventListener('click', closeRagDetails);
  detailBody.querySelector('[data-view-rag-corpus]')?.addEventListener('click', (event) => {
    if (!ragDetailsModal) return;
    const groupId = event.currentTarget.dataset.viewRagCorpus;
    const documents = memoryDocuments.filter((document) => document.groupId === groupId && document.sourceFormat === 'rag-corpus').sort((left, right) => (Number(left.corpusMeta?.rowNumber) || 0) - (Number(right.corpusMeta?.rowNumber) || 0));
    const title = ragDetailsModal.querySelector('#ragCorpusDetailsTitle');
    const body = ragDetailsModal.querySelector('#ragCorpusDetailsBody');
    if (title) title.textContent = `查看语料 · ${documents.length} 条`;
    if (body) body.innerHTML = `<div class="rag-corpus-preview rag-corpus-browser">${documents.slice(0, 100).map((document) => `<article><small>第 ${document.corpusMeta?.rowNumber || '?'} 行${document.corpusMeta?.scene ? ` · 场景 ${escapeHtml(document.corpusMeta.scene)}` : ''}${document.corpusMeta?.people?.length ? ` · ${escapeHtml(document.corpusMeta.people.join('、'))}` : ''}</small><p>${escapeHtml(String(document.text || ''))}</p></article>`).join('') || '<p class="memory-empty">没有可显示的语料。</p>'}${documents.length > 100 ? `<small>为保持手机滚动流畅，这里先显示前 100 条；全部 ${documents.length} 条均已参与检索。</small>` : ''}</div>`;
    ragDetailsModal.hidden = false;
  });
  detailBody.querySelector('[data-check-rag-fields]')?.addEventListener('click', (event) => {
    if (!ragDetailsModal) return;
    const group = memoryDocumentGroups('role', '', chat?.roleId || currentRole.id).find((item) => item.groupId === event.currentTarget.dataset.checkRagFields);
    const map = group?.corpusFieldMap || {};
    const summary = group?.corpusImportSummary || {};
    const title = ragDetailsModal.querySelector('#ragCorpusDetailsTitle');
    const body = ragDetailsModal.querySelector('#ragCorpusDetailsBody');
    if (title) title.textContent = 'RAG语料字段检查';
    if (body) body.innerHTML = `<div class="rag-corpus-field-report"><p><b>导入结果</b><span>共 ${summary.totalRows || 0} 行 · 有效 ${summary.validRows || 0} 条 · 缺少正文 ${summary.missingTextRows || 0} 条${summary.invalidJsonRows ? ` · 无效 JSON ${summary.invalidJsonRows} 行` : ''}</span></p>${[['text', '正文'], ['people', '人物'], ['scene', '场景'], ['time', '时间'], ['location', '地点'], ['major', '重要度']].map(([key, label]) => `<p><b>${label}</b><code>${escapeHtml(map[key] || '未使用')}</code></p>`).join('')}<small>字段对应保存在这份资料中；不会调用 AI。</small></div>`;
    ragDetailsModal.hidden = false;
  });
  detailBody.querySelector('[data-reimport-rag-corpus]')?.addEventListener('click', (event) => {
    const group = memoryDocumentGroups('role', '', chat?.roleId || currentRole.id).find((item) => item.groupId === event.currentTarget.dataset.reimportRagCorpus);
    importMemorySource('role', chat, { libraryName: group?.libraryName || '', libraryKind: 'RAG语料', reimportOf: group?.groupId || '' });
  });
  const persistKnowledgeLibrarySelection = (ids) => {
    const next = new Set([...ids].filter(Boolean));
    memory.knowledgeLibrarySelectionSet = true;
    memory.knowledgeLibraryIds = [...next];
    // 明确把本页正在编辑的 memory 写回当前聊天，避免重绘时读到旧对象。
    chat.memory = memory;
    selectedLibraryIds = next;
    saveChatHistoriesToCache();
    return next;
  };
  const syncKnowledgeLibrarySelectionFromUi = () => {
    const next = new Set();
    detailBody.querySelectorAll('[data-toggle-library]').forEach((input) => {
      if (input.checked) next.add(input.dataset.toggleLibrary);
    });
    return persistKnowledgeLibrarySelection(next);
  };
  detailBody.querySelectorAll('[data-toggle-library]').forEach((input) => input.addEventListener('change', () => {
    const next = new Set(selectedLibraryIds);
    if (input.checked) next.add(input.dataset.toggleLibrary);
    else next.delete(input.dataset.toggleLibrary);
    persistKnowledgeLibrarySelection(next);
    input.closest('.knowledge-library-row')?.classList.toggle('is-enabled', input.checked);
    showToast(input.checked ? '当前聊天已启用这份知识库资料' : '当前聊天已停用这份知识库资料');
  }));
  detailBody.querySelectorAll('[data-toggle-library]').forEach((input) => input.addEventListener('click', (event) => event.stopPropagation()));
  detailBody.querySelectorAll('[data-open-knowledge-graph]').forEach((button) => button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const groupId = button.dataset.openKnowledgeGraph;
    const next = syncKnowledgeLibrarySelectionFromUi();
    next.add(groupId);
    persistKnowledgeLibrarySelection(next);
    if (activeKnowledgeGraphGroupId === groupId && !knowledgeGraphCollapsed) {
      knowledgeGraphCollapsed = true;
    } else {
      activeKnowledgeGraphGroupId = groupId;
      knowledgeGraphCollapsed = false;
    }
    activeChatMemoryFeature = 'role-library';
    openChatMemoryDetail(chat);
  }));
  detailBody.querySelectorAll('[data-open-knowledge-graph],[data-delete-role-memory-group]').forEach((button) => button.addEventListener('click', (event) => event.stopPropagation()));
  const currentKnowledgePerformanceState = () => normalizeKnowledgePerformanceState(activeGraphGroup || {}, currentRole?.name || '');
  const saveKnowledgePerformanceState = async (state, message) => {
    if (!activeGraphGroup) return;
    const normalized = normalizeKnowledgePerformanceState(state, currentRole?.name || '');
    await updateKnowledgePerformanceMetadata(activeGraphGroup.groupId, normalized);
    if (message) showToast(message);
    activeChatMemoryFeature = 'role-library';
    openChatMemoryDetail(chat);
  };
  const targetNameModal = detailBody.querySelector('#knowledgeTargetNameModal');
  const closeKnowledgeTargetNameModal = () => {
    if (!targetNameModal) return;
    targetNameModal.hidden = true;
    targetNameModal.dataset.mode = '';
    targetNameModal.dataset.targetId = '';
  };
  const openKnowledgeTargetNameModal = (mode, targetId = '') => {
    if (!targetNameModal) return;
    const state = currentKnowledgePerformanceState();
    if (mode === 'target' && state.targetCharacters.length >= MAX_PERFORMANCE_TARGETS) {
      showToast('当前角色加额外角色最多共 6 位');
      return;
    }
    const target = mode === 'alias' ? state.targetCharacters.find((item) => item.id === targetId) : null;
    if (mode === 'alias' && !target) return;
    targetNameModal.dataset.mode = mode;
    targetNameModal.dataset.targetId = targetId;
    const title = targetNameModal.querySelector('#knowledgeTargetNameTitle');
    const label = targetNameModal.querySelector('#knowledgeTargetNameLabel');
    const hint = targetNameModal.querySelector('#knowledgeTargetNameHint');
    const input = targetNameModal.querySelector('#knowledgeTargetNameInput');
    if (title) title.textContent = mode === 'alias' ? `给“${target.primaryName}”添加别名` : '添加目标角色';
    if (label?.firstChild) label.firstChild.textContent = mode === 'alias' ? '已确认别名' : '角色主名';
    if (hint) hint.textContent = mode === 'alias'
      ? '只有确定是同一角色的名字才添加；保存后点“继续整理”补扫新命中场景。'
      : '会按这个名字定向查找场景；保存本身不会请求 API。';
    if (input) {
      input.value = '';
      input.placeholder = mode === 'alias' ? '例如：防风邶' : '例如：小夭';
    }
    targetNameModal.hidden = false;
    requestAnimationFrame(() => input?.focus());
  };
  detailBody.querySelector('[data-add-knowledge-target]')?.addEventListener('click', () => {
    openKnowledgeTargetNameModal('target');
  });
  detailBody.querySelectorAll('[data-toggle-knowledge-target]').forEach((input) => input.addEventListener('change', async () => {
    const state = currentKnowledgePerformanceState();
    const target = state.targetCharacters.find((item) => item.id === input.dataset.toggleKnowledgeTarget);
    if (!target) return;
    target.enabled = input.checked;
    await saveKnowledgePerformanceState(state, input.checked ? `已启用“${target.primaryName}”` : `已停用“${target.primaryName}”；其资料不会进入聊天`);
  }));
  detailBody.querySelectorAll('[data-add-target-alias]').forEach((button) => button.addEventListener('click', () => {
    openKnowledgeTargetNameModal('alias', button.dataset.addTargetAlias);
  }));
  targetNameModal?.querySelector('#cancelKnowledgeTargetName')?.addEventListener('click', closeKnowledgeTargetNameModal);
  targetNameModal?.querySelector('#saveKnowledgeTargetName')?.addEventListener('click', async () => {
    const state = currentKnowledgePerformanceState();
    const name = String(targetNameModal.querySelector('#knowledgeTargetNameInput')?.value || '').trim();
    if (!name) return showToast(targetNameModal.dataset.mode === 'alias' ? '请填写别名' : '请填写角色主名');
    const duplicate = state.targetCharacters.some((target) => [target.primaryName, ...target.aliases].some((item) => item.toLocaleLowerCase() === name.toLocaleLowerCase()));
    if (duplicate) return showToast('这个名字已经在目标角色或别名中');
    if (targetNameModal.dataset.mode === 'alias') {
      const target = state.targetCharacters.find((item) => item.id === targetNameModal.dataset.targetId);
      if (!target) return closeKnowledgeTargetNameModal();
      target.aliases = [...target.aliases, name];
      state.extractionProgress.processedByTarget[target.id].profileDirty = true;
      closeKnowledgeTargetNameModal();
      await saveKnowledgePerformanceState(state, `已确认别名“${name}”；点击“继续整理”只补扫新命中场景`);
      return;
    }
    if (state.targetCharacters.length >= MAX_PERFORMANCE_TARGETS) return showToast('当前角色加额外角色最多共 6 位');
    state.targetCharacters = normalizePerformanceTargets([...state.targetCharacters, { primaryName: name, origin: 'manual', enabled: true, order: state.targetCharacters.length }], currentRole?.name || '');
    state.extractionProgress = normalizeKnowledgeExtractionProgress(state.extractionProgress, state.targetCharacters);
    closeKnowledgeTargetNameModal();
    await saveKnowledgePerformanceState(state, `已添加目标角色“${name}”；点击“继续整理”才会请求 API`);
  });
  targetNameModal?.querySelector('#knowledgeTargetNameInput')?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || event.isComposing) return;
    event.preventDefault();
    targetNameModal.querySelector('#saveKnowledgeTargetName')?.click();
  });
  detailBody.querySelectorAll('[data-remove-target-alias]').forEach((button) => button.addEventListener('click', async () => {
    const state = currentKnowledgePerformanceState();
    const target = state.targetCharacters.find((item) => item.id === button.dataset.removeTargetAlias);
    if (!target) return;
    const alias = button.dataset.aliasName;
    if (!confirm(`移除“${target.primaryName}”的别名“${alias}”？已保存的原文和演绎卡不会删除。`)) return;
    target.aliases = target.aliases.filter((name) => name !== alias);
    await saveKnowledgePerformanceState(state, '已移除别名');
  }));
  detailBody.querySelectorAll('[data-delete-knowledge-target]').forEach((button) => button.addEventListener('click', async () => {
    const state = currentKnowledgePerformanceState();
    const target = state.targetCharacters.find((item) => item.id === button.dataset.deleteKnowledgeTarget);
    if (!target || target.locked) return;
    if (!confirm(`删除额外角色“${target.primaryName}”及其本色卡、演绎卡和候选别名？上传原文不会删除。`)) return;
    const targetCharacters = state.targetCharacters.filter((item) => item.id !== target.id);
    await saveKnowledgePerformanceState({
      ...state,
      targetCharacters,
      aliasCandidates: state.aliasCandidates.filter((item) => item.targetId !== target.id),
      roleProfiles: state.roleProfiles.filter((item) => item.targetId !== target.id),
      performanceCards: state.performanceCards.filter((item) => item.targetId !== target.id),
      extractionProgress: { ...state.extractionProgress, processedByTarget: Object.fromEntries(Object.entries(state.extractionProgress.processedByTarget).filter(([id]) => id !== target.id)) },
    }, `已删除额外角色“${target.primaryName}”的派生资料`);
  }));
  detailBody.querySelectorAll('[data-accept-alias],[data-reject-alias]').forEach((button) => button.addEventListener('click', async () => {
    const state = currentKnowledgePerformanceState();
    const accepted = button.hasAttribute('data-accept-alias');
    const candidateId = accepted ? button.dataset.acceptAlias : button.dataset.rejectAlias;
    const candidate = state.aliasCandidates.find((item) => item.id === candidateId);
    if (!candidate) return;
    const next = resolveAliasCandidate(state, candidateId, accepted ? 'accepted' : 'rejected');
    await saveKnowledgePerformanceState(next, accepted ? `已接受“${candidate.name}”；点击“继续整理”补扫该别名场景` : `已拒绝“${candidate.name}”，后续不会重复询问`);
  }));
  detailBody.querySelector('#addKnowledgeTriple')?.addEventListener('click', () => {
    const modal = detailBody.querySelector('#knowledgeRelationModal');
    if (!modal) return;
    modal.hidden = false;
    modal.querySelector('#manualRelationSource')?.focus();
  });
  detailBody.querySelector('#cancelManualRelation')?.addEventListener('click', () => {
    const modal = detailBody.querySelector('#knowledgeRelationModal');
    if (modal) modal.hidden = true;
  });
  detailBody.querySelector('#knowledgeRelationModal')?.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) event.currentTarget.hidden = true;
  });
  detailBody.querySelector('#saveManualRelation')?.addEventListener('click', async (event) => {
    if (!activeGraphGroup) return;
    const source = detailBody.querySelector('#manualRelationSource')?.value || '';
    const target = detailBody.querySelector('#manualRelationTarget')?.value || '';
    const relation = detailBody.querySelector('#manualRelationType')?.value || '';
    const note = detailBody.querySelector('#manualRelationNote')?.value || '';
    const tags = normalizeStringList(detailBody.querySelector('#manualRelationTags')?.value || '');
    const triples = normalizeRelationTriples([
      ...normalizeRelationTriples(activeGraphGroup.relationTriples),
      { source, relation, target, note, evidence: note, tags, basis: '用户手动新增', manual: true },
    ]);
    if (!normalizeRelationTriples([{ source, relation, target }]).length) {
      showToast('请填完整人物甲、人物乙和当前关系');
      return;
    }
    event.currentTarget.disabled = true;
    await updateMemoryDocumentGroup(activeGraphGroup.groupId, { relationTriples: triples });
    showToast(`已添加关系：${source} → ${target}`);
    openChatMemoryDetail(chat);
  });
  detailBody.querySelector('.knowledge-graph-groups')?.addEventListener('click', async (event) => {
    const requestButton = event.target.closest('[data-request-delete-triple]');
    const confirmButton = event.target.closest('[data-confirm-delete-triple]');
    const cancelButton = event.target.closest('[data-cancel-delete-triple]');
    if (requestButton) {
      detailBody.querySelectorAll('.knowledge-graph-group li.is-confirming').forEach((item) => {
        item.classList.remove('is-confirming');
        const confirm = item.querySelector('.kg-delete-confirm');
        if (confirm) confirm.hidden = true;
      });
      const row = requestButton.closest('li');
      row?.classList.add('is-confirming');
      const confirm = row?.querySelector('.kg-delete-confirm');
      if (confirm) confirm.hidden = false;
      return;
    }
    if (cancelButton) {
      const row = cancelButton.closest('li');
      row?.classList.remove('is-confirming');
      const confirm = row?.querySelector('.kg-delete-confirm');
      if (confirm) confirm.hidden = true;
      return;
    }
    if (!confirmButton || !activeGraphGroup) return;
    const deleteIndex = Number(confirmButton.dataset.confirmDeleteTriple);
    const triples = normalizeRelationTriples(activeGraphGroup.relationTriples).filter((_, index) => index !== deleteIndex);
    confirmButton.disabled = true;
    await updateMemoryDocumentGroup(activeGraphGroup.groupId, { relationTriples: triples });
    showToast('已删除这条关系');
    openChatMemoryDetail(chat);
  });
  detailBody.querySelector('[data-edit-knowledge-title]')?.addEventListener('click', () => {
    const modal = detailBody.querySelector('#knowledgeTitleModal');
    if (!modal) return;
    modal.hidden = false;
    const input = modal.querySelector('#knowledgeTitleInput');
    input?.focus();
    input?.select();
  });
  detailBody.querySelector('#cancelKnowledgeTitle')?.addEventListener('click', () => {
    const modal = detailBody.querySelector('#knowledgeTitleModal');
    if (modal) modal.hidden = true;
  });
  detailBody.querySelector('#knowledgeTitleModal')?.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) event.currentTarget.hidden = true;
  });
  detailBody.querySelector('#saveKnowledgeTitle')?.addEventListener('click', async (event) => {
    if (!activeGraphGroup) return;
    const input = detailBody.querySelector('#knowledgeTitleInput');
    const nextName = String(input?.value || '').trim();
    if (!nextName) {
      showToast('上传文件名不能为空');
      input?.focus();
      return;
    }
    event.currentTarget.disabled = true;
    await updateMemoryDocumentGroup(activeGraphGroup.groupId, { libraryName: nextName });
    showToast('上传文件名已保存');
    activeChatMemoryFeature = 'role-library';
    openChatMemoryDetail(chat);
  });
  const saveCharacterCatalog = async (nextCatalog, toast = '角色目录已更新') => {
    if (!activeGraphGroup) return;
    await updateMemoryDocumentGroup(activeGraphGroup.groupId, { characterCatalog: normalizeCharacterCatalog(nextCatalog) });
    showToast(toast);
    activeChatMemoryFeature = 'role-library';
    openChatMemoryDetail(chat);
  };
  const characterCatalogForEdit = () => normalizeCharacterCatalog(activeGraphGroup?.characterCatalog || []);
  detailBody.querySelector('.knowledge-character-catalog')?.addEventListener('click', async (event) => {
    const requestDelete = event.target.closest('[data-request-delete-character]');
    const confirmDelete = event.target.closest('[data-confirm-delete-character]');
    const cancelDelete = event.target.closest('[data-cancel-delete-character]');
    const hideButton = event.target.closest('[data-hide-character]');
    const restoreButton = event.target.closest('[data-restore-character]');
    const editButton = event.target.closest('[data-edit-character]');
    if (requestDelete) {
      detailBody.querySelectorAll('.knowledge-character-card.is-confirming').forEach((card) => {
        card.classList.remove('is-confirming');
        const confirm = card.querySelector('.knowledge-character-confirm');
        if (confirm) confirm.hidden = true;
      });
      const card = requestDelete.closest('.knowledge-character-card');
      card?.classList.add('is-confirming');
      const confirm = card?.querySelector('.knowledge-character-confirm');
      if (confirm) confirm.hidden = false;
      return;
    }
    if (cancelDelete) {
      const card = cancelDelete.closest('.knowledge-character-card');
      card?.classList.remove('is-confirming');
      const confirm = card?.querySelector('.knowledge-character-confirm');
      if (confirm) confirm.hidden = true;
      return;
    }
    if (confirmDelete) {
      const index = Number(confirmDelete.dataset.confirmDeleteCharacter);
      const catalog = characterCatalogForEdit();
      const target = catalog[index];
      if (!target) return;
      const names = new Set([target.name, ...(target.aliases || [])].map((name) => String(name).trim()).filter(Boolean));
      const nextRelations = normalizeRelationTriples(activeGraphGroup.relationTriples).filter((triple) => !names.has(triple.source) && !names.has(triple.target));
      confirmDelete.disabled = true;
      await updateMemoryDocumentGroup(activeGraphGroup.groupId, {
        characterCatalog: catalog.filter((_, itemIndex) => itemIndex !== index),
        relationTriples: nextRelations,
      });
      showToast('已删除角色及相关关系');
      openChatMemoryDetail(chat);
      return;
    }
    if (hideButton || restoreButton) {
      const index = Number((hideButton || restoreButton).dataset.hideCharacter ?? restoreButton?.dataset.restoreCharacter);
      const catalog = characterCatalogForEdit();
      if (!catalog[index]) return;
      catalog[index] = { ...catalog[index], hidden: Boolean(hideButton) };
      await saveCharacterCatalog(catalog, hideButton ? '已隐身这个角色，后续不会注入其角色设定' : '已恢复这个角色');
      return;
    }
    if (!editButton) return;
    const index = Number(editButton.dataset.editCharacter);
    const catalog = characterCatalogForEdit();
    const item = catalog[index];
    const modal = detailBody.querySelector('#knowledgeCharacterModal');
    if (!item || !modal) return;
    modal.hidden = false;
    modal.querySelector('#editCharacterIndex').value = String(index);
    modal.querySelector('#editCharacterName').value = item.name || '';
    modal.querySelector('#editCharacterAliases').value = (item.aliases || []).join('、');
    modal.querySelector('#editCharacterIdentity').value = item.identity || '';
    modal.querySelector('#editCharacterTraits').value = item.traits || '';
    modal.querySelector('#editCharacterSpeech').value = item.speechStyle || '';
    modal.querySelector('#editCharacterName')?.focus();
  });
  detailBody.querySelector('#cancelKnowledgeCharacter')?.addEventListener('click', () => {
    const modal = detailBody.querySelector('#knowledgeCharacterModal');
    if (modal) modal.hidden = true;
  });
  detailBody.querySelector('#knowledgeCharacterModal')?.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) event.currentTarget.hidden = true;
  });
  detailBody.querySelector('#saveKnowledgeCharacter')?.addEventListener('click', async (event) => {
    const catalog = characterCatalogForEdit();
    const index = Number(detailBody.querySelector('#editCharacterIndex')?.value);
    const old = catalog[index];
    const name = String(detailBody.querySelector('#editCharacterName')?.value || '').trim();
    if (!old || !name) {
      showToast('角色姓名不能为空');
      return;
    }
    catalog[index] = {
      ...old,
      name,
      aliases: String(detailBody.querySelector('#editCharacterAliases')?.value || '').split(/[、,，/]/).map((item) => item.trim()).filter(Boolean),
      identity: String(detailBody.querySelector('#editCharacterIdentity')?.value || '').trim(),
      traits: String(detailBody.querySelector('#editCharacterTraits')?.value || '').trim(),
      speechStyle: String(detailBody.querySelector('#editCharacterSpeech')?.value || '').trim(),
    };
    event.currentTarget.disabled = true;
    await saveCharacterCatalog(catalog, '角色目录已保存');
  });
  detailBody.querySelector('#toggleKnowledgeCharacters')?.addEventListener('click', () => {
    knowledgeCharactersCollapsed = !knowledgeCharactersCollapsed;
    activeChatMemoryFeature = 'role-library';
    openChatMemoryDetail(chat);
  });
  detailBody.querySelector('[data-graph-progress]')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-stop-knowledge-graph]');
    if (!button) return;
    button.disabled = true;
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 停止中';
    activeKnowledgeGraphBuildController?.abort();
  });
  const runKnowledgeGraphBuild = async (event, reset = false) => {
    const button = event.currentTarget;
    const progressLine = detailBody.querySelector('[data-graph-progress]');
    const groupId = reset ? button.dataset.rebuildKnowledgeGraph : button.dataset.buildKnowledgeGraph;
    if (reset && !confirm('重新整理会重做本色卡和情境演绎卡；上传原文、已确认别名及原作事实不会删除。确定继续？')) return;
    activeKnowledgeGraphBuildController?.abort();
    activeKnowledgeGraphBuildController = new AbortController();
    button.disabled = true;
    button.textContent = reset ? '正在重新整理…' : '正在整理…';
    try {
      const result = await buildKnowledgeGraphForGroup(groupId, chat, (done, total, detail = {}) => {
        const copy = knowledgeExtractionProgressCopy({
          completed: detail.completed,
          total,
          resumeFrom: detail.resumeFrom,
          runCompleted: detail.runCompleted,
          runTotal: detail.runTotal,
        }, { stage: detail.stage, target: detail.target, currentStep: done });
        button.textContent = copy.button;
        if (progressLine) {
          progressLine.hidden = false;
          progressLine.className = 'knowledge-graph-progress is-running';
          progressLine.innerHTML = `<span><b>${escapeHtml(copy.headline)}</b><small>${escapeHtml(copy.current)}</small><small>${escapeHtml(copy.detail)}</small></span><button type="button" data-stop-knowledge-graph><i class="fa-solid fa-stop"></i> 停止</button>`;
        }
      }, { reset, signal: activeKnowledgeGraphBuildController.signal });
      showToast(result.skipped ? '没有新的命中场景需要整理' : `整理完成：${result.profiles} 张本色卡，${result.cards} 张情境演绎卡，${result.relations} 条原作关系`);
      activeKnowledgeGraphBuildController = null;
      openChatMemoryDetail(chat);
    } catch (error) {
      const stopped = activeKnowledgeGraphBuildController?.signal.aborted;
      activeKnowledgeGraphBuildController = null;
      showToast(stopped ? (error.message || '已停止整理') : `${reset ? '重新整理' : '整理'}失败：${error.message}`);
      button.disabled = false;
      button.innerHTML = reset ? '<i class="fa-solid fa-rotate"></i> 重新整理' : '<i class="fa-solid fa-wand-magic-sparkles"></i> 继续整理';
      if (progressLine) {
        progressLine.hidden = false;
        progressLine.className = `knowledge-graph-progress ${stopped ? 'is-stopped' : 'is-error'}`;
        progressLine.textContent = error.message || '';
      }
    }
  };
  detailBody.querySelector('[data-build-knowledge-graph]')?.addEventListener('click', (event) => runKnowledgeGraphBuild(event, false));
  detailBody.querySelector('[data-rebuild-knowledge-graph]')?.addEventListener('click', (event) => runKnowledgeGraphBuild(event, true));
  detailBody.querySelectorAll('[data-delete-role-memory-group]').forEach((button) => button.addEventListener('click', async () => {
    if (!confirm('确定删除这份记忆、知识库资料？')) return;
    await deleteMemoryDocumentGroup(button.dataset.deleteRoleMemoryGroup);
    memory.knowledgeLibraryIds = memory.knowledgeLibraryIds.filter((id) => id !== button.dataset.deleteRoleMemoryGroup);
    saveChatHistoriesToCache();
    if (activeKnowledgeGraphGroupId === button.dataset.deleteRoleMemoryGroup) activeKnowledgeGraphGroupId = '';
    activeChatMemoryFeature = 'role-library';
    openChatMemoryDetail(chat);
  }));
  bindKnowledgeLibraryDrag(chat);
  detailBody.querySelector('#openMemoryPromptSettings')?.addEventListener('click', () => openMemoryDetail({ focusSummary: true }));
  detailBody.querySelector('#deleteChatMemory')?.addEventListener('click', async () => {
    if (!confirm(`确定删除“${chat.title}”的全部长记忆？\n\n会清空总结、用户偏好、场景、事实、未完剧情和导入资料，但不会删除聊天消息。`)) return;
    if (activeMemorySummaryTask(chat)) await cancelMemorySummary(chat);
    await clearChatMemory(chat);
    showToast('已删除当前聊天的全部长记忆');
    openChatMemoryDetail(chat);
  });
  detailBody.querySelector('#exportChatMemory')?.addEventListener('click', () => exportChatMemory(chat));
  detailBody.querySelector('#importChatMemoryFile')?.addEventListener('click', () => importChatMemoryFile(chat));
  const memoryMenu = detailBody.querySelector('#memoryHeroMenu');
  const memoryActions = detailBody.querySelector('#memoryHeroActions');
  if (memoryMenu && memoryActions) {
    const closeActions = () => {
      memoryActions.hidden = true;
      memoryMenu.setAttribute('aria-expanded', 'false');
      document.removeEventListener('click', onDocClick);
    };
    const onDocClick = (event) => {
      if (!memoryActions.contains(event.target) && !memoryMenu.contains(event.target)) closeActions();
    };
    memoryMenu.addEventListener('click', (event) => {
      event.stopPropagation();
      const willOpen = memoryActions.hidden;
      memoryActions.hidden = !willOpen;
      memoryMenu.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) setTimeout(() => document.addEventListener('click', onDocClick), 0);
      else document.removeEventListener('click', onDocClick);
    });
  }
  detailBody.querySelector('#saveChatMemory')?.addEventListener('click', () => saveChatMemoryEditor(chat));
  detailBody.querySelectorAll('[data-memory-toggle]').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    const target = event.currentTarget;
    const [kind, id] = String(target.dataset.memoryToggleScope || '').split(':');
    const key = target.dataset.memoryToggle === 'update' ? 'updateEnabled' : 'sendEnabled';
    let currentValue;
    if (kind === 'anchor' && memory.anchors[id]) currentValue = memory.anchors[id][key];
    else if (kind === 'section' && memory.sectionControls[id]) currentValue = memory.sectionControls[id][key];
    else if (kind === 'custom') {
      const item = memory.customStates.find((entry) => entry.id === id);
      if (item) currentValue = item[key];
    }
    const newValue = !currentValue;
    if (kind === 'anchor' && memory.anchors[id]) memory.anchors[id][key] = newValue;
    if (kind === 'section' && memory.sectionControls[id]) memory.sectionControls[id][key] = newValue;
    if (kind === 'custom') {
      const item = memory.customStates.find((entry) => entry.id === id);
      if (item) item[key] = newValue;
    }
    target.classList.toggle('is-on', newValue);
    target.setAttribute('aria-pressed', newValue ? 'true' : 'false');
    if (!newValue) showToast('关闭不会清空数据');
    memory.updatedAt = new Date().toISOString();
    saveChatHistoriesToCache();
  }));
  const customStateModal = detailBody.querySelector('#customMemoryStateModal');
  const customType = detailBody.querySelector('#newCustomStateType');
  const syncCustomTypeFields = () => {
    const numeric = customType?.value === 'number';
    const options = detailBody.querySelector('#newCustomStateNumberOptions');
    if (options) options.hidden = !numeric;
    const value = detailBody.querySelector('#newCustomStateValue');
    if (value) value.type = numeric ? 'number' : 'text';
  };
  customType?.addEventListener('change', syncCustomTypeFields);
  detailBody.querySelector('#addCustomMemoryState')?.addEventListener('click', () => {
    if (!customStateModal) return;
    customStateModal.hidden = false;
    syncCustomTypeFields();
    detailBody.querySelector('#newCustomStateName')?.focus();
  });
  detailBody.querySelector('#cancelCustomMemoryState')?.addEventListener('click', () => { if (customStateModal) customStateModal.hidden = true; });
  customStateModal?.addEventListener('click', (event) => { if (event.target === customStateModal) customStateModal.hidden = true; });
  detailBody.querySelector('#saveCustomMemoryState')?.addEventListener('click', () => {
    const name = String(detailBody.querySelector('#newCustomStateName')?.value || '').trim();
    const valueType = customType?.value === 'number' ? 'number' : 'text';
    const value = String(detailBody.querySelector('#newCustomStateValue')?.value || '').trim();
    if (!name) return showToast('请填写项目名称');
    if (memory.customStates.some((item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase())) return showToast('当前聊天已经有同名项目');
    let min = String(detailBody.querySelector('#newCustomStateMin')?.value || '').trim();
    let max = String(detailBody.querySelector('#newCustomStateMax')?.value || '').trim();
    min = min === '' ? null : Number(min);
    max = max === '' ? null : Number(max);
    if (valueType === 'number' && value !== '' && !Number.isFinite(Number(value))) return showToast('初始值必须是有效数字');
    if (min != null && max != null && min > max) [min, max] = [max, min];
    const promptId = detailBody.querySelector('#customMemoryStateModal [data-prompt-quick-version]')?.value || memorySystemPromptId('customState');
    const id = `custom-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
    const base = { id, name, value, valueType, min, max, unit: String(detailBody.querySelector('#newCustomStateUnit')?.value || '').trim(), showProgress: valueType === 'number' && detailBody.querySelector('#newCustomStateProgress')?.checked === true, order: memory.customStates.length, promptId, updateEnabled: detailBody.querySelector('#newCustomStateUpdate')?.checked === true, sendEnabled: detailBody.querySelector('#newCustomStateSend')?.checked === true, legacy: false };
    const checked = validatedCustomStateValue(base, valueType === 'number' && value === '' ? '0' : value);
    memory.customStates.push({ ...base, value: value === '' ? '' : checked.value });
    memory.updatedAt = new Date().toISOString();
    saveChatHistoriesToCache();
    pendingCustomMemoryFocusId = id;
    activeChatMemoryFeature = 'chat-data';
    openChatMemoryDetail(chat);
  });
  detailBody.querySelectorAll('[data-delete-custom-state]').forEach((button) => button.addEventListener('click', () => {
    memory.customStates = memory.customStates.filter((item) => item.id !== button.dataset.deleteCustomState);
    saveChatHistoriesToCache();
    openChatMemoryDetail(chat);
  }));
  detailBody.querySelector('#saveCustomMemoryTemplate')?.addEventListener('click', () => {
    saveChatMemoryEditor(chat);
    const name = String(prompt('给这组自定义项目起个模板名：', '我的状态模板') || '').trim();
    if (!name) return;
    const template = { name, items: normalizeCustomStates(memory.customStates).filter((item) => !item.legacy).map((item) => ({ name: item.name, valueType: item.valueType, min: item.min, max: item.max, unit: item.unit, showProgress: item.showProgress, promptId: item.promptId, updateEnabled: item.updateEnabled, sendEnabled: item.sendEnabled })) };
    memorySettings.customStateTemplates = [...(memorySettings.customStateTemplates || []).filter((item) => item.name !== name), template].slice(-30);
    saveAppStateToCache();
    openChatMemoryDetail(chat);
    showToast('自定义项目模板已保存');
  });
  detailBody.querySelector('#applyCustomMemoryTemplate')?.addEventListener('click', () => {
    const index = Number(detailBody.querySelector('#customMemoryTemplateSelect')?.value);
    const template = memorySettings.customStateTemplates?.[index];
    if (!template) return;
    const existing = new Set(memory.customStates.map((item) => item.name.toLocaleLowerCase()));
    (template.items || []).forEach((item, itemIndex) => {
      if (existing.has(String(item.name || '').toLocaleLowerCase())) return;
      memory.customStates.push({ ...item, id: `custom-${Date.now()}-${itemIndex}`, value: '', order: memory.customStates.length, legacy: false });
    });
    saveChatHistoriesToCache();
    openChatMemoryDetail(chat);
    showToast('模板已应用，原有数值未被覆盖');
  });
  const relationshipModal = detailBody.querySelector('#chatRelationshipModal');
  const openRelationshipEditor = (item = null) => {
    if (!relationshipModal) return;
    relationshipModal.hidden = false;
    relationshipModal.querySelector('#chatRelationEditingId').value = item?.id || '';
    relationshipModal.querySelector('#chatRelationSource').value = item?.source || '';
    relationshipModal.querySelector('#chatRelationTarget').value = item?.target || '';
    relationshipModal.querySelector('#chatRelationCurrent').value = item?.currentRelation || '';
    relationshipModal.querySelector('#chatRelationTags').value = (item?.tags || []).join('、');
    relationshipModal.querySelector('#chatRelationEvidence').value = item?.evidence || '';
    relationshipModal.querySelector('#chatRelationReason').value = '';
  };
  detailBody.querySelector('#addChatRelationship')?.addEventListener('click', () => openRelationshipEditor());
  detailBody.querySelectorAll('[data-edit-chat-relation]').forEach((button) => button.addEventListener('click', () => openRelationshipEditor(memory.relationshipCards.find((item) => item.id === button.dataset.editChatRelation))));
  detailBody.querySelectorAll('[data-delete-chat-relation]').forEach((button) => button.addEventListener('click', () => {
    memory.relationshipCards = memory.relationshipCards.filter((item) => item.id !== button.dataset.deleteChatRelation);
    saveChatHistoriesToCache();
    openChatMemoryDetail(chat);
  }));
  detailBody.querySelector('#cancelChatRelationship')?.addEventListener('click', () => { relationshipModal.hidden = true; });
  relationshipModal?.addEventListener('click', (event) => { if (event.target === relationshipModal) relationshipModal.hidden = true; });
  detailBody.querySelector('#saveChatRelationship')?.addEventListener('click', () => {
    const source = String(detailBody.querySelector('#chatRelationSource')?.value || '').trim();
    const target = String(detailBody.querySelector('#chatRelationTarget')?.value || '').trim();
    const currentRelation = String(detailBody.querySelector('#chatRelationCurrent')?.value || '').trim();
    if (!source || !target || !currentRelation) return showToast('请填写两个人物和当前关系');
    const editingId = detailBody.querySelector('#chatRelationEditingId')?.value || '';
    const existing = memory.relationshipCards.find((item) => item.id === editingId);
    const relationBase = existing && relationshipPairKey(existing.source, existing.target) !== relationshipPairKey(source, target)
      ? memory.relationshipCards.filter((item) => item.id !== editingId)
      : memory.relationshipCards;
    memory.relationshipCards = mergeRelationshipCards(relationBase, [{
      id: existing?.id || `relation-${Date.now()}`, source, target, currentRelation,
      tags: String(detailBody.querySelector('#chatRelationTags')?.value || '').split(/[、,，]/).map((item) => item.trim()).filter(Boolean),
      evidence: String(detailBody.querySelector('#chatRelationEvidence')?.value || '').trim(),
      reason: String(detailBody.querySelector('#chatRelationReason')?.value || '').trim(), manual: true,
    }]);
    saveChatHistoriesToCache();
    openChatMemoryDetail(chat);
    showToast('关系已保存，旧状态仍在变化历史中');
  });
  detailBody.querySelector('#chatMemoryRetrievePast')?.addEventListener('change', (event) => {
    memorySettings.retrievePast = event.currentTarget.checked;
    saveAppStateToCache();
    showToast(memorySettings.retrievePast ? '已启用过去记忆检索' : '已关闭 BM25、向量与重排检索；资料仍保留');
  });
  detailBody.querySelector('#summarizeChatNow')?.addEventListener('click', () => summarizeAndOrganizeChatMemory(chat));
  detailBody.querySelector('#stopMemorySummary')?.addEventListener('click', () => stopMemorySummary(chat));
  detailBody.querySelector('#cancelMemorySummary')?.addEventListener('click', () => requestCancelMemorySummary(chat));
  detailBody.querySelector('#importChatMemory')?.addEventListener('click', () => importMemorySource('chat', chat));
  detailBody.querySelectorAll('[data-save-summary-entry]').forEach((button) => button.addEventListener('click', async () => {
    const entryId = button.dataset.saveSummaryEntry;
    const editor = detailBody.querySelector(`[data-summary-entry-text="${entryId}"]`);
    button.disabled = true;
    try {
      await saveMemorySummaryEntryText(chat, entryId, editor?.value || '');
      showToast('已保存，并同步到可检索聊天剧情');
      openChatMemoryDetail(chat);
    } catch (error) {
      showToast(`保存失败：${error.message || '内容不能为空'}`);
      button.disabled = false;
    }
  }));
  detailBody.querySelectorAll('[data-rerun-summary-entry]').forEach((button) => button.addEventListener('click', () => rerunMemorySummaryEntry(chat, button.dataset.rerunSummaryEntry, button)));
  detailBody.querySelectorAll('[data-edit-memory-group]').forEach((button) => button.addEventListener('click', () => openMemoryGroupEditor(chat, button.dataset.editMemoryGroup)));
  detailBody.querySelectorAll('[data-delete-memory-group]').forEach((button) => button.addEventListener('click', async () => {
    if (!confirm('确定删除这份聊天剧情资料？')) return;
    await deleteMemoryDocumentGroup(button.dataset.deleteMemoryGroup);
    openChatMemoryDetail(chat);
  }));
  detailBody.querySelector('#runMemoryTest')?.addEventListener('click', async (event) => {
    const query = detailBody.querySelector('#memoryTestQuery')?.value.trim();
    if (!query) return;
    const target = detailBody.querySelector('#memoryTestResults');
    event.currentTarget.disabled = true;
    target.innerHTML = '<p class="memory-empty">正在生成本轮联合召回…</p>';
    try {
      const plan = await collectMemoryPlan(query, [], chat);
      const warnings = [plan.retrieval?.vectorError, plan.retrieval?.rerankError].filter(Boolean);
      target.innerHTML = `${warnings.length ? `<p class="memory-retrieval-warning">${escapeHtml(warnings.join('；'))}，已自动降级。</p>` : ''}<article><small>本轮真实记忆提示词 · ${memoryRetrievalLabel()} · ${plan.included.length} 段原文</small><pre>${escapeHtml(plan.content || '本轮没有可发送的记忆')}</pre></article>`;
      const logList = detailBody.querySelector('.memory-retrieval-log-list');
      if (logList) logList.innerHTML = memoryRetrievalLogsHtml(memory);
    } catch (error) {
      target.innerHTML = `<p class="memory-retrieval-warning">召回失败：${escapeHtml(error.message || String(error))}</p>`;
    } finally {
      event.currentTarget.disabled = false;
    }
  });
  updateMemorySummaryUi(chat);
}

function readMemorySettingsFromDetail() {
  const value = (selector) => detailBody.querySelector(selector);
  if (!value('#memoryEnabledSetting')) return;
  memorySettings.enabled = value('#memoryEnabledSetting').checked;
  memorySettings.retrievePast = value('#memoryRetrievePastSetting')?.checked ?? memorySettings.retrievePast;
  memorySettings.autoSummary = value('#memoryAutoSummarySetting').checked;
  memorySettings.summaryLimit = Number(value('#summaryLimitSetting').value) || memorySettings.summaryLimit;
  memorySettings.recentKeep = Number(value('#memoryRecentKeepSetting').value) || memorySettings.recentKeep;
  memorySettings.summaryApiId = value('#memorySummaryApiSetting').value;
  memorySettings.maxRetrieved = Number(value('#memoryMaxRetrievedSetting').value) || memorySettings.maxRetrieved;
  memorySettings.injectionPosition = value('#memoryInjectionPositionSetting').value;
  memorySettings.injectionDepth = Number(value('#memoryInjectionDepthSetting').value) || 0;
  memorySettings.chunkSize = Number(value('#memoryChunkSizeSetting').value) || memorySettings.chunkSize;
  memorySettings.chunkOverlap = Number(value('#memoryChunkOverlapSetting').value) || 0;
  memorySettings.bm25 = value('#bm25Setting').checked;
  memorySettings.vector = value('#memoryVectorSetting').checked;
  memorySettings.embeddingPlatform = value('#memoryEmbeddingPlatformSetting').value;
  memorySettings.embeddingEndpoint = value('#memoryEmbeddingEndpointSetting').value.trim();
  memorySettings.embeddingApiKey = value('#memoryEmbeddingApiKeySetting').value.trim();
  memorySettings.embeddingModel = value('#memoryEmbeddingModelSetting').value.trim();
  memorySettings.vectorWeight = Math.max(0, Math.min(1, Number(value('#memoryVectorWeightSetting').value) || 0));
  memorySettings.candidateLimit = Math.max(5, Number(value('#memoryCandidateLimitSetting').value) || 20);
  memorySettings.rerank = value('#memoryRerankSetting').checked;
  memorySettings.rerankPlatform = value('#memoryRerankPlatformSetting').value;
  memorySettings.rerankEndpoint = value('#memoryRerankEndpointSetting').value.trim();
  memorySettings.rerankApiKey = value('#memoryRerankApiKeySetting').value.trim();
  memorySettings.rerankModel = value('#memoryRerankModelSetting').value.trim();
  if (value('#memorySummaryPromptSetting')) memorySettings.summaryPrompt = value('#memorySummaryPromptSetting').value.trim();
  if (value('#memoryInjectionPromptSetting')) memorySettings.injectionPrompt = value('#memoryInjectionPromptSetting').value.trim();
}

function openMemoryDetail({ focusSummary = false } = {}) {
  const apiOptions = (selectedId) => apiLinks.filter((api) => api.enabled !== false).map((api) => `<option value="${escapeHtml(api.id)}" ${api.id === selectedId ? 'selected' : ''}>${escapeHtml(api.name)} · ${escapeHtml(api.model || '未选模型')}</option>`).join('');
  const vectorReady = memoryDocuments.filter((document) => Array.isArray(document.embedding) && document.embedding.length && document.embeddingModel === effectiveMemoryModel('embedding')).length;
  const activeMemory = activeChat ? ensureChatMemory(activeChat) : createEmptyChatMemory();
  const latestRetrieval = activeMemory.retrievalLogs?.at(-1) || null;
  const realRetrievalQuery = String(latestRetrieval?.query || '').trim() || '尚无真实查询；发送消息或运行召回测试后显示';
  const realRetrievalDocuments = (latestRetrieval?.documents || []).map((item) => `${item.scope}:${item.sourceName || item.id}`);
  openDetail('记忆 API 设定', `
    <div class="memory-page memory-settings-page">
      <section class="memory-card">
        <label class="toggle-row"><span><b>启用长记忆</b><small>聊天总结、BM25 召回与知识库注入</small></span><input id="memoryEnabledSetting" type="checkbox" ${memorySettings.enabled ? 'checked' : ''}></label>
        <label class="toggle-row"><span><b>启用过去记忆检索</b><small>从分批记录和知识库执行 BM25／向量／重排召回；可与上项独立开关</small></span><input id="memoryRetrievePastSetting" type="checkbox" ${memorySettings.retrievePast ? 'checked' : ''}></label>
        <label class="toggle-row"><span><b>AI 自动总结</b><small>达到设定条数后整理一次剧情记忆</small></span><input id="memoryAutoSummarySetting" type="checkbox" ${memorySettings.autoSummary ? 'checked' : ''}></label>
        <label>总结专用 API<select id="memorySummaryApiSetting"><option value="">跟随当前聊天 API</option>${apiOptions(memorySettings.summaryApiId)}</select><small>可选择便宜、稳定的模型专门做总结</small></label>
        <div class="memory-two-columns"><label>每多少条消息总结<input id="summaryLimitSetting" type="number" min="10" max="200" value="${memorySettings.summaryLimit}"></label><label>保留最近原文<input id="memoryRecentKeepSetting" type="number" min="4" max="50" value="${memorySettings.recentKeep}"></label></div>
      </section>
      <section class="memory-card">
        <div class="memory-card-head"><div><b>知识库分块</b><small>上传小说、剧本时按这里设置切段；调大减少段数但召回更粗，调小更精准但段数变多</small></div></div>
        <div class="memory-two-columns"><label>分块字数<input id="memoryChunkSizeSetting" type="number" min="200" max="4000" value="${memorySettings.chunkSize}"></label><label>重叠字数<input id="memoryChunkOverlapSetting" type="number" min="0" max="800" value="${memorySettings.chunkOverlap}"></label></div>
      </section>
      <section class="memory-card">
        <label class="toggle-row"><span><b>BM25 检索</b><small>本机运行，擅长人名、地名和原文用词</small></span><input id="bm25Setting" type="checkbox" ${memorySettings.bm25 ? 'checked' : ''}></label>
        <label>每轮最多召回几段<input id="memoryMaxRetrievedSetting" type="number" min="1" max="12" value="${memorySettings.maxRetrieved}"></label>
        <label>记忆注入位置<select id="memoryInjectionPositionSetting">
          <option value="none" ${memorySettings.injectionPosition === 'none' ? 'selected' : ''}>不注入（只保存与查看）</option>
          <option value="before_history" ${memorySettings.injectionPosition === 'before_history' ? 'selected' : ''}>↑ Chat History（推荐）</option>
          <option value="after_history" ${memorySettings.injectionPosition === 'after_history' ? 'selected' : ''}>↓ Chat History</option>
          <option value="at_depth" ${memorySettings.injectionPosition === 'at_depth' ? 'selected' : ''}>@ Depth（system）</option>
        </select></label>
        <label>指定深度<input id="memoryInjectionDepthSetting" type="number" min="0" max="100" value="${memorySettings.injectionDepth}"><small>仅在 @ Depth 时生效，0 代表上下文最底部</small></label>
      </section>
      <section class="memory-card">
        <label class="toggle-row"><span><b class="memory-section-title">向量Embedding检索</b><small>找“意思相近”的剧情，与 BM25 合并排名</small></span><input id="memoryVectorSetting" type="checkbox" ${memorySettings.vector ? 'checked' : ''}></label>
        <label>向量 模型平台<select id="memoryEmbeddingPlatformSetting">
          <option value="">请选择平台</option>
          <option value="siliconflow" ${memorySettings.embeddingPlatform === 'siliconflow' ? 'selected' : ''}>硅基流动（默认 BAAI/bge-m3）</option>
          <option value="openai" ${memorySettings.embeddingPlatform === 'openai' ? 'selected' : ''}>OpenAI（默认 text-embedding-3-small）</option>
          <option value="volcengine" ${memorySettings.embeddingPlatform === 'volcengine' ? 'selected' : ''}>火山引擎（豆包 embedding）</option>
          <option value="qwen" ${memorySettings.embeddingPlatform === 'qwen' ? 'selected' : ''}>通义千问（DashScope）</option>
          <option value="custom" ${memorySettings.embeddingPlatform === 'custom' ? 'selected' : ''}>自定义</option>
        </select><small>选平台会自动填默认模型与接口地址</small></label>
        <label>向量 API 接口地址<input id="memoryEmbeddingEndpointSetting" value="${escapeHtml(memorySettings.embeddingEndpoint)}" placeholder="https://api.siliconflow.cn/v1/embeddings"></label>
        <label>向量 API 密钥<input id="memoryEmbeddingApiKeySetting" class="api-secret-input" type="text" value="${escapeHtml(memorySettings.embeddingApiKey)}" placeholder="sk-..."></label>
        <label>向量 模型<div class="memory-model-picker-row"><input id="memoryEmbeddingModelSetting" list="memoryEmbeddingModelList" autocomplete="off" value="${escapeHtml(memorySettings.embeddingModel || memoryPlatformDefaultModel(memorySettings.embeddingPlatform, 'embedding'))}" placeholder="搜索或手动填写模型 ID"><button type="button" id="fetchEmbeddingModels">获取模型</button></div><datalist id="memoryEmbeddingModelList"></datalist><small id="memoryEmbeddingModelStatus">获取后可搜索选择，也可直接手动填写</small></label>
        <div class="memory-two-columns"><label>向量权重<input id="memoryVectorWeightSetting" type="number" min="0" max="1" step="0.05" value="${memorySettings.vectorWeight}"><small>0.6 表示稍偏向意思相近</small></label><label>候选段数<input id="memoryCandidateLimitSetting" type="number" min="5" max="100" value="${memorySettings.candidateLimit}"></label></div>
        <div class="memory-index-status" id="memoryIndexStatus"><span>已向量化 <b>${vectorReady}</b> / ${memoryDocuments.length} 段</span><small>更换模型后需要重新建立索引</small></div>
        <div class="memory-action-pair"><button type="button" id="testEmbeddingApi">测试向量</button><button type="button" id="buildMemoryVectorIndex" class="memory-accent-action">建立 / 补齐索引</button></div>
      </section>
      <section class="memory-card">
        <label class="toggle-row"><span><b class="memory-section-title">重排Reranker模型</b><small>对 BM25 + 向量找到的候选资料再排一次</small></span><input id="memoryRerankSetting" type="checkbox" ${memorySettings.rerank ? 'checked' : ''}></label>
        <label>重排 模型平台<select id="memoryRerankPlatformSetting">
          <option value="">请选择平台</option>
          <option value="siliconflow" ${memorySettings.rerankPlatform === 'siliconflow' ? 'selected' : ''}>硅基流动（默认 BAAI/bge-reranker-v2-m3）</option>
          <option value="openai" ${memorySettings.rerankPlatform === 'openai' ? 'selected' : ''}>OpenAI</option>
          <option value="volcengine" ${memorySettings.rerankPlatform === 'volcengine' ? 'selected' : ''}>火山引擎</option>
          <option value="qwen" ${memorySettings.rerankPlatform === 'qwen' ? 'selected' : ''}>通义千问（gte-rerank）</option>
          <option value="custom" ${memorySettings.rerankPlatform === 'custom' ? 'selected' : ''}>自定义</option>
        </select><small>选平台会自动填默认模型与接口地址</small></label>
        <label>重排 API 接口地址<input id="memoryRerankEndpointSetting" value="${escapeHtml(memorySettings.rerankEndpoint)}" placeholder="https://api.siliconflow.cn/v1/rerank"></label>
        <label>重排 API 密钥<input id="memoryRerankApiKeySetting" class="api-secret-input" type="text" value="${escapeHtml(memorySettings.rerankApiKey)}" placeholder="sk-..."></label>
        <label>重排 模型<div class="memory-model-picker-row"><input id="memoryRerankModelSetting" list="memoryRerankModelList" autocomplete="off" value="${escapeHtml(memorySettings.rerankModel || memoryPlatformDefaultModel(memorySettings.rerankPlatform, 'rerank'))}" placeholder="搜索或手动填写模型 ID"><button type="button" id="fetchRerankModels">获取模型</button></div><datalist id="memoryRerankModelList"></datalist><small id="memoryRerankModelStatus">获取后可搜索选择，也可直接手动填写</small></label>
        <button type="button" id="testRerankApi">测试重排</button>
      </section>
      <section class="memory-card">
        <div class="memory-card-head"><div><b>提示词在哪里编辑？</b><small>回到长记忆 → 数据与提示词。那里与各状态卡使用同一份提示词库，不再维护重复副本。</small></div></div>
        <div class="memory-channel-note"><b>五模块增量协议</b><span>总结只接收开启“更新”的时间地点、人物关系、未完剧情、自定义状态与剧情纪要；字段 ID 和 JSON 过滤由程序固定。</span></div>
      </section>
      <section class="memory-card memory-request-structure">
        <div class="memory-card-head"><div><b>非生成式检索的真实请求结构</b><small>这些不是提示词，所以不提供提示词编辑器。</small></div></div>
        <details><summary>BM25（本机）</summary><pre>${escapeHtml(JSON.stringify({ query: realRetrievalQuery, hitCount: realRetrievalDocuments.length, candidateLimit: memorySettings.candidateLimit, maxRetrieved: memorySettings.maxRetrieved, sorting: 'BM25 score desc' }, null, 2))}</pre></details>
        <details><summary>向量 Embedding</summary><pre>${escapeHtml(JSON.stringify({ endpoint: memorySettings.embeddingEndpoint || memoryPlatformDefaultEndpoint(memorySettings.embeddingPlatform, 'embedding'), model: memorySettings.embeddingModel || memoryPlatformDefaultModel(memorySettings.embeddingPlatform, 'embedding'), input: [realRetrievalQuery], candidateLimit: memorySettings.candidateLimit }, null, 2))}</pre></details>
        <details><summary>重排 Reranker</summary><pre>${escapeHtml(JSON.stringify({ endpoint: memorySettings.rerankEndpoint || memoryPlatformDefaultEndpoint(memorySettings.rerankPlatform, 'rerank'), model: memorySettings.rerankModel || memoryPlatformDefaultModel(memorySettings.rerankPlatform, 'rerank'), query: realRetrievalQuery, documents: realRetrievalDocuments, top_n: memorySettings.maxRetrieved, returnedOrder: realRetrievalDocuments }, null, 2))}</pre></details>
      </section>
    </div>
  `, {
    label: '保存',
    onClick: () => {
      readMemorySettingsFromDetail();
      saveAppStateToCache();
      renderMoreSettings();
      showToast('记忆设置已保存');
    },
  });
  detailBody.querySelector('#testEmbeddingApi')?.addEventListener('click', async (event) => {
    const button = event.currentTarget;
    readMemorySettingsFromDetail();
    button.disabled = true;
    button.textContent = '正在测试…';
    try {
      const [vector] = await createMemoryEmbeddings(['相柳与小夭在清水镇重逢']);
      showToast(`向量连接成功，${vector.length} 维`);
    } catch (error) {
      showToast(`向量连接失败：${error.message}`);
    } finally {
      button.disabled = false;
      button.textContent = '测试向量';
    }
  });
  /* 选平台时自动把默认 endpoint / model 填到输入框（用户可手动改；留空时调用方再回退到平台默认）。 */
  const embeddingPlatform = detailBody.querySelector('#memoryEmbeddingPlatformSetting');
  const embeddingEndpoint = detailBody.querySelector('#memoryEmbeddingEndpointSetting');
  const embeddingModel = detailBody.querySelector('#memoryEmbeddingModelSetting');
  embeddingPlatform?.addEventListener('change', () => {
    const endpointPreset = memoryPlatformDefaultEndpoint(embeddingPlatform.value, 'embedding');
    const modelPreset = memoryPlatformDefaultModel(embeddingPlatform.value, 'embedding');
    if (endpointPreset) embeddingEndpoint.value = endpointPreset;
    if (modelPreset) embeddingModel.value = modelPreset;
  });
  const rerankPlatform = detailBody.querySelector('#memoryRerankPlatformSetting');
  const rerankEndpoint = detailBody.querySelector('#memoryRerankEndpointSetting');
  const rerankModel = detailBody.querySelector('#memoryRerankModelSetting');
  rerankPlatform?.addEventListener('change', () => {
    const endpointPreset = memoryPlatformDefaultEndpoint(rerankPlatform.value, 'rerank');
    const modelPreset = memoryPlatformDefaultModel(rerankPlatform.value, 'rerank');
    if (endpointPreset) rerankEndpoint.value = endpointPreset;
    if (modelPreset) rerankModel.value = modelPreset;
  });
  detailBody.querySelector('#fetchEmbeddingModels')?.addEventListener('click', () => pullMemoryModels('embedding'));
  detailBody.querySelector('#fetchRerankModels')?.addEventListener('click', () => pullMemoryModels('rerank'));
  detailBody.querySelector('#buildMemoryVectorIndex')?.addEventListener('click', async (event) => {
    const button = event.currentTarget;
    readMemorySettingsFromDetail();
    saveAppStateToCache();
    const status = detailBody.querySelector('#memoryIndexStatus');
    button.disabled = true;
    try {
      const result = await buildMemoryVectorIndex({
        force: false,
        onProgress: (done, total) => { if (status) status.innerHTML = `<span>正在建立索引 <b>${done}</b> / ${total} 段</span><small>请不要离开此页</small>`; },
      });
      showToast(result.indexed ? `已为 ${result.indexed} 段资料建立向量索引` : '所有资料都已向量化');
      openMemoryDetail();
    } catch (error) {
      if (status) status.innerHTML = `<span class="memory-error">建立失败：${escapeHtml(error.message)}</span><small>已保留建好的部分，可再次继续</small>`;
      showToast(`向量索引失败：${error.message}`);
      button.disabled = false;
    }
  });
  detailBody.querySelector('#testRerankApi')?.addEventListener('click', async (event) => {
    const button = event.currentTarget;
    readMemorySettingsFromDetail();
    const previousRerank = memorySettings.rerank;
    memorySettings.rerank = true;
    button.disabled = true;
    button.textContent = '正在测试…';
    try {
      const sample = [
        { id: 'test-1', text: '相柳在清水镇与小夭重逢' },
        { id: 'test-2', text: '防风邶教小夭射箭' },
      ];
      const ranked = await rerankMemoryResults('谁和小夭在清水镇见面', sample, 2);
      showToast(ranked.length ? '重排连接成功' : '重排接口未返回结果');
    } catch (error) {
      showToast(`重排连接失败：${error.message}`);
    } finally {
      memorySettings.rerank = previousRerank;
      button.disabled = false;
      button.textContent = '测试重排';
    }
  });
  if (focusSummary) {
    requestAnimationFrame(() => {
      const target = detailBody.querySelector('#memorySummaryPromptSetting');
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => target?.focus({ preventScroll: true }), 220);
    });
  }
}

function openThemeDetail() {
  const A = appAppearance;
  const pr = A.primaryRgb;
  const colorHex = (c) => '#' + [c.r, c.g, c.b].map((v) => v.toString(16).padStart(2, '0')).join('');

  openDetail('外观', `
    <div class="detail-card">
      <div class="theme-select-row">
        <label class="theme-select-label">界面主题
          <select id="themeSetting">
            <option value="dark" ${appThemeLabel() === '深色' ? 'selected' : ''}>深色</option>
            <option value="light" ${appThemeLabel() === '浅色' ? 'selected' : ''}>浅色</option>
          </select>
        </label>
        <button type="button" id="saveThemeSetting" class="theme-save-btn">保存主题</button>
      </div>
    </div>

    <div class="detail-card">
      <div class="card-head-with-action">
        <h3>聊天界面设置</h3>
        <button type="button" id="resetAppearanceBtn">恢复默认</button>
      </div>

      <!-- 聊天字号 + 字体颜色：一行 4 列（标签、填写框、标签、颜色选择） -->
      <div class="appearance-block">
        <div class="appearance-inputs appearance-font-row">
          <span class="appearance-color-label">聊天字号</span>
          <input type="number" min="15" max="28" id="appFontSizeInput" class="appearance-num-input" value="${A.fontSize}" title="15～28"><span class="unit">px</span>
          <span class="appearance-color-label appearance-color-label-2">字体颜色</span>
          <input type="color" id="chatFontColor" class="appearance-color-input" value="${A.fontColor || '#ffffff'}">
          <label class="appearance-default-check"><input type="checkbox" id="chatFontColorDefault" ${A.fontColor ? '' : 'checked'}>跟随默认</label>
        </div>
      </div>

      <!-- AI气泡颜色：色条(2) + 透明(1) + 玻璃滤镜开关 -->
      <div class="appearance-block">
        <div class="appearance-label-row">
          <span class="appearance-color-label">AI气泡颜色</span>
          <span class="appearance-glass-text">玻璃滤镜</span>
          <label class="appearance-glass-switch" title="关闭后去掉 AI 气泡边缘的浅色描边和柔光">
            <input id="bubbleBotGlass" type="checkbox" ${A.bubbleBotGlass !== false ? 'checked' : ''}>
            <span class="model-switch-track"></span>
          </label>
        </div>
        <div class="appearance-inputs">
          <input type="color" id="bubbleBotColor" class="appearance-color-input" value="${colorHex(A.bubbleBot)}">
          <input type="text" inputmode="decimal" pattern="[0-9]*[.,]?[0-9]*" id="bubbleBotAlpha" class="appearance-num-input" value="${A.bubbleBot.a}" title="透明度（0～1）" autocomplete="off">
        </div>
        <code id="bubbleBotPreview" class="appearance-preview">rgba(${A.bubbleBot.r}, ${A.bubbleBot.g}, ${A.bubbleBot.b}, ${A.bubbleBot.a})</code>
      </div>

      <!-- 用户气泡颜色：色条(2) + 透明(1) + 玻璃滤镜开关 -->
      <div class="appearance-block">
        <div class="appearance-label-row">
          <span class="appearance-color-label">用户气泡颜色</span>
          <span class="appearance-glass-text">玻璃滤镜</span>
          <label class="appearance-glass-switch" title="关闭后去掉用户气泡边缘的浅色描边和柔光">
            <input id="bubbleUserGlass" type="checkbox" ${A.bubbleUserGlass !== false ? 'checked' : ''}>
            <span class="model-switch-track"></span>
          </label>
        </div>
        <div class="appearance-inputs">
          <input type="color" id="bubbleUserColor" class="appearance-color-input" value="${colorHex(A.bubbleUser)}">
          <input type="text" inputmode="decimal" pattern="[0-9]*[.,]?[0-9]*" id="bubbleUserAlpha" class="appearance-num-input" value="${A.bubbleUser.a}" title="透明度（0～1）" autocomplete="off">
        </div>
        <code id="bubbleUserPreview" class="appearance-preview">rgba(${A.bubbleUser.r}, ${A.bubbleUser.g}, ${A.bubbleUser.b}, ${A.bubbleUser.a})</code>
      </div>

      <!-- 用户输入栏颜色：色条(2) + 透明(1) -->
      <div class="appearance-block">
        <span class="appearance-color-label">用户输入栏颜色</span>
        <div class="appearance-inputs">
          <input type="color" id="inputBarColor" class="appearance-color-input" value="${colorHex(A.inputBar)}">
          <input type="text" inputmode="decimal" pattern="[0-9]*[.,]?[0-9]*" id="inputBarAlpha" class="appearance-num-input" value="${A.inputBar.a}" title="透明度（0～1）" autocomplete="off">
        </div>
        <code id="inputBarPreview" class="appearance-preview">rgba(${A.inputBar.r}, ${A.inputBar.g}, ${A.inputBar.b}, ${A.inputBar.a})</code>
      </div>

      <h4 class="appearance-subtitle">背景主色调</h4>

      <div class="appearance-block appearance-primary-picker">
        <span class="appearance-color-label">选择背景主色</span>
        <div class="appearance-inputs">
          <input type="color" id="primaryColor" class="appearance-color-input" value="${colorHex(pr)}">
        </div>
      </div>

      <div class="rgb-row">
        <b class="rgb-title">主色 RGB（4 个位置共享）</b>
        <label>R <input type="number" min="0" max="255" id="primaryR" value="${pr.r}"></label>
        <label>G <input type="number" min="0" max="255" id="primaryG" value="${pr.g}"></label>
        <label>B <input type="number" min="0" max="255" id="primaryB" value="${pr.b}"></label>
      </div>

      <h5 class="appearance-subtitle-2">暗色层</h5>

      <!-- 暗色层 上：色条(2) + 透明(1) + 位置(1) -->
      <div class="appearance-block">
        <span class="appearance-color-label">上</span>
        <div class="appearance-inputs">
          <input type="color" id="overlayTopColor" class="appearance-color-input" value="${colorHex(A.overlay.top)}">
          <input type="text" inputmode="decimal" pattern="[0-9]*[.,]?[0-9]*" id="overlayTopAlpha" class="appearance-num-input" value="${A.overlay.top.a}" title="透明度（0～1）" autocomplete="off">
          <input type="number" min="0" max="100" id="overlayTopStop" class="appearance-num-input" value="${A.overlay.topStop}" title="位置%"><span class="unit">%</span>
        </div>
        <code id="overlayTopPreview" class="appearance-preview">rgba(${A.overlay.top.r}, ${A.overlay.top.g}, ${A.overlay.top.b}, ${A.overlay.top.a})</code>
      </div>

      <!-- 暗色层 下：RGB 绑定主色（显示为预览） + 透明(1) + 位置(1) -->
      <div class="appearance-block">
        <span class="appearance-color-label">下</span>
        <div class="appearance-inputs">
          <code id="overlayBottomPreview" class="appearance-color-preview">rgba(${pr.r}, ${pr.g}, ${pr.b}, ${A.overlay.bottomAlpha})</code>
          <input type="text" inputmode="decimal" pattern="[0-9]*[.,]?[0-9]*" id="overlayBottomAlpha" class="appearance-num-input" value="${A.overlay.bottomAlpha}" title="透明度（0～1）" autocomplete="off">
          <input type="number" min="0" max="100" id="overlayBottomStop" class="appearance-num-input" value="${A.overlay.bottomStop}" title="位置%"><span class="unit">%</span>
        </div>
      </div>

      <h5 class="appearance-subtitle-2">输入栏渐变 40% 缓冲层</h5>

      <!-- 输入栏渐变 上/下：绑定主色 -->
      <div class="appearance-block">
        <span class="appearance-color-label">上</span>
        <div class="appearance-inputs">
          <code id="bufferTopPreview" class="appearance-color-preview">rgba(${pr.r}, ${pr.g}, ${pr.b}, ${A.buffer.topAlpha})</code>
          <input type="text" inputmode="decimal" pattern="[0-9]*[.,]?[0-9]*" id="bufferTopAlpha" class="appearance-num-input" value="${A.buffer.topAlpha}" title="透明度（0～1）" autocomplete="off">
          <input type="number" min="0" max="100" id="bufferTopStop" class="appearance-num-input" value="${A.buffer.topStop}" title="位置%"><span class="unit">%</span>
        </div>
      </div>

      <div class="appearance-block">
        <span class="appearance-color-label">下</span>
        <div class="appearance-inputs">
          <code id="bufferMidPreview" class="appearance-color-preview">rgba(${pr.r}, ${pr.g}, ${pr.b}, ${A.buffer.midAlpha})</code>
          <input type="text" inputmode="decimal" pattern="[0-9]*[.,]?[0-9]*" id="bufferMidAlpha" class="appearance-num-input" value="${A.buffer.midAlpha}" title="透明度（0～1）" autocomplete="off">
          <input type="number" min="0" max="100" id="bufferMidStop" class="appearance-num-input" value="${A.buffer.midStop}" title="位置%"><span class="unit">%</span>
        </div>
      </div>

      <!-- 输入栏渐变 末：绑定主色（显示为 hex） + 位置 -->
      <div class="appearance-block">
        <span class="appearance-color-label">末</span>
        <div class="appearance-inputs">
          <code id="bufferEndPreview" class="appearance-color-preview">#${[pr.r, pr.g, pr.b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()}</code>
          <span class="appearance-spacer"></span>
          <input type="number" min="0" max="100" id="bufferEndStop" class="appearance-num-input" value="${A.buffer.endStop}" title="位置%"><span class="unit">%</span>
        </div>
      </div>

      <small class="appearance-hint">
        上面的 rgba 和百分比都可以改动，背景主色调里的【暗色层】下层和【输入栏渐变40%缓冲】的上下层颜色是绑定的是使用同一个数值，不建议改动百分比数值。
      </small>
    </div>
  `);

  bindAppearanceEvents();
}

// 安卓 WebView 的原生 input[type=color] 没有 RGB 输入，而且不同设备样式不一致。
// 外观页统一使用应用自己的色卡；原 input 继续作为值源，沿用已有保存与实时预览逻辑。
let appearanceColorPickerState = null;

function clampColorByte(value) {
  return Math.max(0, Math.min(255, Math.round(Number(value) || 0)));
}

function rgbToPickerHex(rgb) {
  return `#${[rgb.r, rgb.g, rgb.b].map((value) => clampColorByte(value).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

function pickerHexToRgb(value) {
  const match = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(String(value || '').trim());
  return match ? { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) } : null;
}

function pickerRgbToHsv({ r, g, b }) {
  const red = clampColorByte(r) / 255;
  const green = clampColorByte(g) / 255;
  const blue = clampColorByte(b) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;
  if (delta) {
    if (max === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (max === green) hue = 60 * (((blue - red) / delta) + 2);
    else hue = 60 * (((red - green) / delta) + 4);
  }
  if (hue < 0) hue += 360;
  return { h: hue, s: max ? delta / max : 0, v: max };
}

function pickerHsvToRgb(h, s, v) {
  const hue = ((Number(h) % 360) + 360) % 360;
  const saturation = Math.max(0, Math.min(1, Number(s) || 0));
  const value = Math.max(0, Math.min(1, Number(v) || 0));
  const chroma = value * saturation;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = value - chroma;
  let parts = [0, 0, 0];
  if (hue < 60) parts = [chroma, x, 0];
  else if (hue < 120) parts = [x, chroma, 0];
  else if (hue < 180) parts = [0, chroma, x];
  else if (hue < 240) parts = [0, x, chroma];
  else if (hue < 300) parts = [x, 0, chroma];
  else parts = [chroma, 0, x];
  return { r: (parts[0] + m) * 255, g: (parts[1] + m) * 255, b: (parts[2] + m) * 255 };
}

function ensureAppearanceColorPicker() {
  if (appearanceColorPickerState?.root?.isConnected) return appearanceColorPickerState;
  const root = document.createElement('div');
  root.className = 'app-color-picker';
  root.hidden = true;
  root.innerHTML = `
    <button type="button" class="app-color-picker-backdrop" aria-label="取消选择颜色"></button>
    <section class="app-color-picker-card" role="dialog" aria-modal="true" aria-labelledby="appColorPickerTitle">
      <div class="app-color-picker-head">
        <div><b id="appColorPickerTitle">选择颜色</b><small id="appColorPickerTarget"></small></div>
        <button type="button" class="app-color-picker-close" aria-label="关闭">×</button>
      </div>
      <div class="app-color-picker-plane-wrap">
        <canvas class="app-color-picker-plane" height="320" role="slider" aria-label="颜色色卡"></canvas>
      </div>
      <label class="app-color-picker-hue-label">色相
        <input class="app-color-picker-hue" type="range" min="0" max="359" step="1" value="0">
      </label>
      <div class="app-color-picker-current">
        <span class="app-color-picker-swatch" aria-hidden="true"></span>
        <label>HEX<input class="app-color-picker-hex" type="text" inputmode="text" maxlength="7" autocomplete="off" spellcheck="false"></label>
      </div>
      <div class="app-color-picker-rgb" aria-label="RGB 数值">
        <label>R<input data-picker-channel="r" type="number" inputmode="numeric" min="0" max="255"></label>
        <label>G<input data-picker-channel="g" type="number" inputmode="numeric" min="0" max="255"></label>
        <label>B<input data-picker-channel="b" type="number" inputmode="numeric" min="0" max="255"></label>
      </div>
      <p class="app-color-picker-hint">可点击或拖动色卡，也可以直接填写 HEX / RGB 数值。</p>
      <div class="app-color-picker-actions">
        <button type="button" data-picker-action="cancel">取消</button>
        <button type="button" data-picker-action="confirm">确定</button>
      </div>
    </section>`;
  phoneShell.appendChild(root);

  const state = {
    root,
    activeInput: null,
    rgb: { r: 0, g: 0, b: 0 },
    hsv: { h: 0, s: 0, v: 0 },
    canvas: root.querySelector('.app-color-picker-plane'),
    hue: root.querySelector('.app-color-picker-hue'),
    hex: root.querySelector('.app-color-picker-hex'),
    swatch: root.querySelector('.app-color-picker-swatch'),
    target: root.querySelector('#appColorPickerTarget'),
    confirmBtn: root.querySelector('[data-picker-action="confirm"]'),
    channels: [...root.querySelectorAll('[data-picker-channel]')],
  };
  appearanceColorPickerState = state;

  const sync = () => {
    state.rgb = pickerHsvToRgb(state.hsv.h, state.hsv.s, state.hsv.v);
    const normalized = {
      r: clampColorByte(state.rgb.r),
      g: clampColorByte(state.rgb.g),
      b: clampColorByte(state.rgb.b),
    };
    state.rgb = normalized;
    const hex = rgbToPickerHex(normalized);
    state.hex.value = hex;
    state.swatch.style.background = hex;
    state.hue.value = String(Math.round(state.hsv.h));
    state.channels.forEach((input) => { input.value = String(normalized[input.dataset.pickerChannel]); });
    // 【确定】按钮底色跟随当前选中的颜色，亮度高时文字换成深色保证可读
    state.confirmBtn.style.background = hex;
    state.confirmBtn.style.borderColor = hex;
    const luminance = (0.299 * normalized.r + 0.587 * normalized.g + 0.114 * normalized.b) / 255;
    state.confirmBtn.style.color = luminance > 0.6 ? '#1a1a1a' : '#ffffff';
    drawAppearanceColorPlane();
  };
  state.sync = sync;

  state.hue.addEventListener('input', () => {
    state.hsv.h = Number(state.hue.value);
    sync();
  });
  state.hex.addEventListener('input', () => {
    const rgb = pickerHexToRgb(state.hex.value);
    if (!rgb) return;
    state.rgb = rgb;
    state.hsv = pickerRgbToHsv(rgb);
    sync();
  });
  state.channels.forEach((input) => {
    input.addEventListener('input', () => {
      const rgb = { ...state.rgb, [input.dataset.pickerChannel]: clampColorByte(input.value) };
      state.rgb = rgb;
      state.hsv = pickerRgbToHsv(rgb);
      sync();
    });
  });

  const updateFromPointer = (event) => {
    const rect = state.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    state.hsv.s = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    state.hsv.v = 1 - Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    sync();
  };
  state.canvas.addEventListener('pointerdown', (event) => {
    state.canvas.setPointerCapture?.(event.pointerId);
    updateFromPointer(event);
  });
  state.canvas.addEventListener('pointermove', (event) => {
    if (state.canvas.hasPointerCapture?.(event.pointerId)) updateFromPointer(event);
  });
  root.querySelector('.app-color-picker-backdrop').addEventListener('click', () => closeAppearanceColorPicker());
  root.querySelector('.app-color-picker-close').addEventListener('click', () => closeAppearanceColorPicker());
  root.querySelector('[data-picker-action="cancel"]').addEventListener('click', () => closeAppearanceColorPicker());
  root.querySelector('[data-picker-action="confirm"]').addEventListener('click', () => {
    const input = state.activeInput;
    if (input?.isConnected) {
      input.value = rgbToPickerHex(state.rgb).toLowerCase();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    closeAppearanceColorPicker();
  });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAppearanceColorPicker();
  });
  return state;
}

function drawAppearanceColorPlane() {
  const state = appearanceColorPickerState;
  if (!state || state.root.hidden) return;
  const canvas = state.canvas;
  const rect = canvas.getBoundingClientRect();
  const scale = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const width = Math.max(1, Math.round(rect.width * scale));
  const height = Math.max(1, Math.round(rect.height * scale));
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, width, height);
  context.fillStyle = `hsl(${state.hsv.h} 100% 50%)`;
  context.fillRect(0, 0, width, height);
  const white = context.createLinearGradient(0, 0, width, 0);
  white.addColorStop(0, '#fff');
  white.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = white;
  context.fillRect(0, 0, width, height);
  const black = context.createLinearGradient(0, 0, 0, height);
  black.addColorStop(0, 'rgba(0,0,0,0)');
  black.addColorStop(1, '#000');
  context.fillStyle = black;
  context.fillRect(0, 0, width, height);
  const x = state.hsv.s * width;
  const y = (1 - state.hsv.v) * height;
  context.beginPath();
  context.arc(x, y, 8 * scale, 0, Math.PI * 2);
  context.lineWidth = 3 * scale;
  context.strokeStyle = '#fff';
  context.shadowColor = 'rgba(0,0,0,.7)';
  context.shadowBlur = 3 * scale;
  context.stroke();
}

function openAppearanceColorPicker(input, label) {
  const state = ensureAppearanceColorPicker();
  const rgb = pickerHexToRgb(input?.value) || { r: 0, g: 0, b: 0 };
  state.activeInput = input;
  state.rgb = rgb;
  state.hsv = pickerRgbToHsv(rgb);
  state.target.textContent = label || '';
  state.root.hidden = false;
  state.root.classList.add('is-open');
  phoneShell.classList.add('has-color-picker');
  requestAnimationFrame(() => {
    state.sync();
    // 安卓上打开面板时不自动弹软键盘；需要手填时再点 HEX / RGB 输入框。
    state.root.querySelector('.app-color-picker-close')?.focus({ preventScroll: true });
  });
}

function closeAppearanceColorPicker() {
  const state = appearanceColorPickerState;
  if (!state) return;
  state.root.classList.remove('is-open');
  state.root.hidden = true;
  state.activeInput = null;
  phoneShell.classList.remove('has-color-picker');
}

function enhanceAppearanceColorInputs(body) {
  body.querySelectorAll('input.appearance-color-input[type="color"]').forEach((input) => {
    if (input.dataset.customPickerReady === 'true') return;
    input.dataset.customPickerReady = 'true';
    input.classList.add('appearance-color-source');
    input.tabIndex = -1;
    input.setAttribute('aria-hidden', 'true');
    // 同一行内取“位于该 input 之前”的颜色标签；字号/字体颜色共行时避免误取成“聊天字号”
    const rowLabels = [...(input.closest('.appearance-inputs')?.querySelectorAll('.appearance-color-label') || [])];
    const label = (rowLabels.find((el) => el.compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING)?.textContent?.trim()
      || input.closest('.appearance-block')?.querySelector('.appearance-color-label')?.textContent?.trim()
      || '颜色');
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'appearance-color-trigger';
    trigger.setAttribute('aria-label', `${label}：打开选色器`);
    const refresh = () => {
      const rgb = pickerHexToRgb(input.value) || { r: 0, g: 0, b: 0 };
      trigger.innerHTML = `<span style="background:${rgbToPickerHex(rgb)}"></span><strong>${rgbToPickerHex(rgb)}</strong>`;
    };
    trigger.addEventListener('click', () => openAppearanceColorPicker(input, label));
    input.addEventListener('input', refresh);
    input.addEventListener('appearance-color-refresh', refresh);
    trigger.classList.toggle('is-disabled', !!input.disabled);
    input.before(trigger);
    refresh();
  });
}

// ============== 聊天界面设置：实时更新 + RGB 绑定 ==============
function bindAppearanceEvents() {
  const body = detailBody;
  if (!body) return;

  // 把 hex 转 {r, g, b}
  const hexToRgb = (hex) => {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    if (!m) return null;
    return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
  };
  // clamp 0-255
  const clamp255 = (v) => Math.max(0, Math.min(255, Math.round(Number(v) || 0)));
  // clamp 0-1
  const clamp1 = (v) => Math.max(0, Math.min(1, Number(v) || 0));
  // clamp 0-100
  const clamp100 = (v) => Math.max(0, Math.min(100, Math.round(Number(v) || 0)));

  // 通用：每次输入后 commit 并刷新 UI
  const commit = () => {
    applyChatAppearance();
    saveAppearance();
    refreshAppearancePreviews();
  };

  // 安卓数字键盘在输入 0.5 时会依次产生 "0"、"0."、"0.5"。
  // 输入阶段不能把 "0." 强制改回 0；完成时才规范化，并兼容逗号小数点。
  const readDecimalDraft = (value) => {
    const normalized = String(value ?? '').trim().replace(',', '.');
    if (!normalized || normalized === '.' || normalized === '-' || normalized === '-.') return null;
    const number = Number(normalized);
    return Number.isFinite(number) ? number : null;
  };
  const bindAlphaInput = (input, readCurrent, writeValue) => {
    if (!input) return;
    const update = (finalize = false) => {
      const parsed = readDecimalDraft(input.value);
      if (parsed === null) {
        if (finalize) input.value = String(readCurrent());
        return;
      }
      const value = clamp1(parsed);
      writeValue(value);
      if (finalize) input.value = String(value);
      commit();
    };
    input.addEventListener('input', () => update(false));
    input.addEventListener('change', () => update(true));
  };

  // 聊天字号（手填数字：输入时实时预览，失焦/完成时规范化到 15～28）
  const fontSizeInput = body.querySelector('#appFontSizeInput');
  fontSizeInput?.addEventListener('input', () => {
    const value = Number(fontSizeInput.value);
    if (!fontSizeInput.value.trim() || !Number.isFinite(value)) return;
    appAppearance.fontSize = clamp255_28(value);
    commit();
  });
  fontSizeInput?.addEventListener('change', () => {
    fontSizeInput.value = appAppearance.fontSize;
    commit();
  });

  // 字体颜色：色卡 + “跟随默认”开关
  const chatFontColor = body.querySelector('#chatFontColor');
  const chatFontColorDefault = body.querySelector('#chatFontColorDefault');
  const setFontColorDisabled = () => {
    const off = chatFontColorDefault?.checked;
    if (chatFontColor) chatFontColor.disabled = !!off;
    const trigger = chatFontColor?.previousElementSibling;
    if (trigger?.classList.contains('appearance-color-trigger')) trigger.classList.toggle('is-disabled', !!off);
  };
  chatFontColorDefault?.addEventListener('change', () => {
    appAppearance.fontColor = chatFontColorDefault.checked ? '' : (chatFontColor.value || '#ffffff');
    setFontColorDisabled();
    commit();
  });
  chatFontColor?.addEventListener('input', () => {
    if (chatFontColorDefault?.checked) return;
    appAppearance.fontColor = chatFontColor.value;
    commit();
  });
  setFontColorDisabled();

  // 用户气泡颜色
  const bubbleColor = body.querySelector('#bubbleUserColor');
  const bubbleAlpha = body.querySelector('#bubbleUserAlpha');
  bubbleColor?.addEventListener('input', () => {
    const c = hexToRgb(bubbleColor.value);
    if (c) { appAppearance.bubbleUser = { ...appAppearance.bubbleUser, ...c }; commit(); }
  });
  bindAlphaInput(bubbleAlpha, () => appAppearance.bubbleUser.a, (value) => { appAppearance.bubbleUser.a = value; });

  // AI 气泡颜色
  const bubbleBotColor = body.querySelector('#bubbleBotColor');
  const bubbleBotAlpha = body.querySelector('#bubbleBotAlpha');
  bubbleBotColor?.addEventListener('input', () => {
    const c = hexToRgb(bubbleBotColor.value);
    if (c) { appAppearance.bubbleBot = { ...appAppearance.bubbleBot, ...c }; commit(); }
  });
  bindAlphaInput(bubbleBotAlpha, () => appAppearance.bubbleBot.a, (value) => { appAppearance.bubbleBot.a = value; });

  // 气泡玻璃滤镜开关
  body.querySelector('#bubbleUserGlass')?.addEventListener('change', (event) => {
    appAppearance.bubbleUserGlass = event.target.checked;
    commit();
  });
  body.querySelector('#bubbleBotGlass')?.addEventListener('change', (event) => {
    appAppearance.bubbleBotGlass = event.target.checked;
    commit();
  });

  // 用户输入栏颜色
  const inputColor = body.querySelector('#inputBarColor');
  const inputAlpha = body.querySelector('#inputBarAlpha');
  inputColor?.addEventListener('input', () => {
    const c = hexToRgb(inputColor.value);
    if (c) { appAppearance.inputBar = { ...appAppearance.inputBar, ...c }; commit(); }
  });
  bindAlphaInput(inputAlpha, () => appAppearance.inputBar.a, (value) => { appAppearance.inputBar.a = value; });

  // 背景主色色卡与 R/G/B 手填双向同步，仍由 4 个绑定位置共享。
  const primaryColor = body.querySelector('#primaryColor');
  primaryColor?.addEventListener('input', () => {
    const color = hexToRgb(primaryColor.value);
    if (!color) return;
    appAppearance.primaryRgb = color;
    body.querySelector('#primaryR').value = color.r;
    body.querySelector('#primaryG').value = color.g;
    body.querySelector('#primaryB').value = color.b;
    commit();
  });

  // 主色 RGB：改任意一个数字时同步刷新色条和色卡初始值。
  const onPrimaryChange = () => {
    appAppearance.primaryRgb = {
      r: clamp255(body.querySelector('#primaryR').value),
      g: clamp255(body.querySelector('#primaryG').value),
      b: clamp255(body.querySelector('#primaryB').value),
    };
    body.querySelector('#primaryR').value = appAppearance.primaryRgb.r;
    body.querySelector('#primaryG').value = appAppearance.primaryRgb.g;
    body.querySelector('#primaryB').value = appAppearance.primaryRgb.b;
    if (primaryColor) {
      primaryColor.value = rgbToPickerHex(appAppearance.primaryRgb).toLowerCase();
      primaryColor.dispatchEvent(new Event('appearance-color-refresh'));
    }
    commit();
  };
  ['primaryR', 'primaryG', 'primaryB'].forEach((id) => {
    body.querySelector(`#${id}`)?.addEventListener('input', onPrimaryChange);
  });

  // 暗色层 上：独立 RGB + alpha + 位置
  const overlayTopColor = body.querySelector('#overlayTopColor');
  const overlayTopAlpha = body.querySelector('#overlayTopAlpha');
  const overlayTopStop = body.querySelector('#overlayTopStop');
  overlayTopColor?.addEventListener('input', () => {
    const c = hexToRgb(overlayTopColor.value);
    if (c) { appAppearance.overlay.top = { ...appAppearance.overlay.top, ...c }; commit(); }
  });
  bindAlphaInput(overlayTopAlpha, () => appAppearance.overlay.top.a, (value) => { appAppearance.overlay.top.a = value; });
  overlayTopStop?.addEventListener('input', () => {
    appAppearance.overlay.topStop = clamp100(overlayTopStop.value);
    overlayTopStop.value = appAppearance.overlay.topStop;
    commit();
  });

  // 暗色层 下：alpha + 位置（RGB 绑定主色）
  bindAlphaInput(body.querySelector('#overlayBottomAlpha'), () => appAppearance.overlay.bottomAlpha, (value) => { appAppearance.overlay.bottomAlpha = value; });
  body.querySelector('#overlayBottomStop')?.addEventListener('input', (event) => {
    appAppearance.overlay.bottomStop = clamp100(event.target.value);
    event.target.value = appAppearance.overlay.bottomStop;
    commit();
  });

  // 输入栏渐变：上 / 下 alpha + 位置；末 位置
  ['bufferTopAlpha', 'bufferMidAlpha'].forEach((id, i) => {
    const key = i === 0 ? 'topAlpha' : 'midAlpha';
    bindAlphaInput(body.querySelector(`#${id}`), () => appAppearance.buffer[key], (value) => { appAppearance.buffer[key] = value; });
  });
  ['bufferTopStop', 'bufferMidStop', 'bufferEndStop'].forEach((id, i) => {
    const keys = ['topStop', 'midStop', 'endStop'];
    body.querySelector(`#${id}`)?.addEventListener('input', (event) => {
      appAppearance.buffer[keys[i]] = clamp100(event.target.value);
      event.target.value = appAppearance.buffer[keys[i]];
      commit();
    });
  });

  // 恢复默认
  body.querySelector('#resetAppearanceBtn')?.addEventListener('click', () => {
    if (!confirm('确定把聊天界面设置恢复为默认值？当前自定义会被覆盖。')) return;
    resetAppearance();
    // 重新打开以刷新所有 input 值
    openThemeDetail();
    showToast('已恢复默认');
  });

  enhanceAppearanceColorInputs(body);
}

// 实时更新右边的预览文字（rgba 字符串）
function refreshAppearancePreviews() {
  const body = detailBody;
  if (!body) return;
  const A = appAppearance;
  const pr = A.primaryRgb;
  const primaryRgba = (a) => `rgba(${pr.r}, ${pr.g}, ${pr.b}, ${a})`;
  const colorRgba = (c) => `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
  const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();

  const set = (id, text) => { const el = body.querySelector(id); if (el) el.textContent = text; };
  set('#bubbleUserPreview', colorRgba(A.bubbleUser));
  set('#bubbleBotPreview',  colorRgba(A.bubbleBot));
  set('#inputBarPreview',   colorRgba(A.inputBar));
  set('#overlayBottomPreview', primaryRgba(A.overlay.bottomAlpha));
  set('#bufferTopPreview',     primaryRgba(A.buffer.topAlpha));
  set('#bufferMidPreview',     primaryRgba(A.buffer.midAlpha));
  set('#bufferEndPreview',     hex(pr));
}

// chatFontSize 兼容（font 字号 15-28 之间）
function clamp255_28(v) { return Math.max(15, Math.min(28, Math.round(Number(v) || 17))); }

function openAppSettingsDetail() {
  openDetail('设置', `
    <div class="detail-card">
      <label>界面语言<select><option>中文</option></select></label>
      <label class="toggle-row"><span>自动保存</span><input id="autoSaveSetting" type="checkbox" ${appSettings.autoSave ? 'checked' : ''}></label>
      <label>导入兼容<input id="importModeSetting" value="${escapeHtml(appSettings.importMode)}"></label>
      <button type="button" id="saveAppSettings">保存设置</button>
    </div>
  `);
}

function storageByteSize(value) {
  try {
    return new Blob([typeof value === 'string' ? value : JSON.stringify(value ?? '')]).size;
  } catch {
    return String(value || '').length;
  }
}

function localStorageByteSize(key) {
  try {
    const value = localStorage.getItem(key);
    return value == null ? 0 : storageByteSize(key) + storageByteSize(value);
  } catch {
    return 0;
  }
}

function formatStorageBytes(bytes) {
  const value = Math.max(0, Number(bytes) || 0);
  if (value < 1024) return `${Math.round(value)} B`;
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(value < 10 * 1024 ? 1 : 0)} KB`;
  if (value < 1024 ** 3) return `${(value / 1024 ** 2).toFixed(1)} MB`;
  return `${(value / 1024 ** 3).toFixed(2)} GB`;
}

async function persistentVoiceCacheSize() {
  const db = await openPersistentVoiceCache();
  if (!db) return 0;
  const entries = await new Promise((resolve) => {
    const request = db.transaction(VOICE_AUDIO_STORE_NAME, 'readonly').objectStore(VOICE_AUDIO_STORE_NAME).getAll();
    request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result : []);
    request.onerror = () => resolve([]);
  });
  return entries.reduce((sum, entry) => sum + storageByteSize(entry), 0);
}

async function collectStorageSpaceDetails() {
  const cache = await persistentVoiceCacheSize();
  const logs = localStorageByteSize('yuanbao_runtime_logs');
  const roles = localStorageByteSize(ROLES_CACHE_KEY) + localStorageByteSize('xs_userIdentities') + localStorageByteSize('xs_userProfile');
  const data = localStorageByteSize(CHAT_CACHE_KEY) + storageByteSize(memoryDocuments);
  const app = localStorageByteSize(APP_STATE_CACHE_KEY) + localStorageByteSize(API_CACHE_KEY) + localStorageByteSize(POLLING_CACHE_KEY);
  let estimatedTotal = 0;
  try {
    const estimate = await navigator.storage?.estimate?.();
    estimatedTotal = Number(estimate?.usage) || 0;
  } catch {}
  const categorized = cache + logs + roles + data + app;
  const other = Math.max(0, estimatedTotal - categorized);
  return { cache, logs, roles, data, app, other, total: Math.max(estimatedTotal, categorized), reclaimable: cache + logs };
}

function storageSpaceDetailsHtml(usage) {
  const categories = [
    ['roles', '角色', '#55a9e6'], ['data', '数据', '#36c98b'], ['logs', '日志', '#e6b63f'],
    ['cache', '缓存', '#e56d6d'], ['app', '应用', '#9b8c82'], ['other', '其他', '#6d6966'],
  ];
  const total = Math.max(1, usage.total);
  const segments = categories.filter(([key]) => usage[key] > 0).map(([key, label, color]) => `<i title="${label} ${formatStorageBytes(usage[key])}" style="width:${Math.max(.8, usage[key] / total * 100).toFixed(2)}%;background:${color}"></i>`).join('');
  return `
    <div class="storage-overview-card">
      <div class="storage-usage-bar">${segments || '<i style="width:100%;background:var(--ui-divider)"></i>'}</div>
      <div class="storage-legend">${categories.filter(([key]) => usage[key] > 0).map(([key, label, color]) => `<span><i style="background:${color}"></i>${label}</span>`).join('')}</div>
      <small>本 App 已用空间</small><strong>${formatStorageBytes(usage.total)}</strong><p>其中可安全清理缓存和日志约 ${formatStorageBytes(usage.reclaimable)}</p>
    </div>
    <div class="storage-category-list">
      <div class="storage-category-row"><span><small>缓存</small><b>${formatStorageBytes(usage.cache)}</b><em>生成语音、TTS 等临时缓存</em></span><button type="button" id="clearStorageCache">清理</button></div>
      <div class="storage-category-row"><span><small>日志</small><b>${formatStorageBytes(usage.logs)}</b><em>运行日志与接口诊断信息</em></span><button type="button" id="clearStorageLogs">清理</button></div>
      <div class="storage-category-row"><span><small>数据</small><b>${formatStorageBytes(usage.data)}</b><em>聊天记录、分批总结、向量与知识库资料</em></span></div>
      <div class="storage-category-row"><span><small>角色</small><b>${formatStorageBytes(usage.roles)}</b><em>角色、人设、头像与用户身份资料</em></span></div>
      <div class="storage-category-row"><span><small>应用</small><b>${formatStorageBytes(usage.app + usage.other)}</b><em>API 配置、预设、界面设置及浏览器其他占用</em></span></div>
    </div>`;
}

async function renderBackupStorageDetails() {
  const target = detailBody.querySelector('#backupStorageDetails');
  if (!target) return;
  target.innerHTML = '<p class="memory-empty">正在计算储存空间…</p>';
  const usage = await collectStorageSpaceDetails();
  if (!target.isConnected) return;
  target.innerHTML = storageSpaceDetailsHtml(usage);
  target.querySelector('#clearStorageCache')?.addEventListener('click', async () => {
    if (!confirm('确定清理生成语音和 TTS 缓存？不会删除聊天、角色或设置。')) return;
    await clearPersistentVoiceCache();
    showToast('缓存已清理');
    renderBackupStorageDetails();
  });
  target.querySelector('#clearStorageLogs')?.addEventListener('click', () => {
    if (!confirm('确定清理运行日志？不会删除聊天、角色或设置。')) return;
    clearRuntimeLogs();
    renderMoreSettings();
    showToast('日志已清理');
    renderBackupStorageDetails();
  });
}

function openBackupRestoreDetail() {
  openDetail('备份与恢复', `
    <div class="detail-card">
      <p class="detail-hint">把所有人设、聊天记录、上下文日志、世界书与设置打包成配置文件，用于备份或换机迁移。手机导出时会弹出系统窗口，可自行选择保存位置。</p>
      <button type="button" id="exportConfigButton" class="detail-action-btn">导出备份</button>
      <label class="export-with-keys">
        <input type="checkbox" id="exportWithKeys">
        <span>同时导出 API 密钥</span>
      </label>
      <p class="export-keys-hint">默认不勾选，导出的备份不含 API / 语音密钥；自行备份迁移时可勾选。</p>
      <button type="button" id="importConfigButton" class="detail-action-btn">导入备份</button>
    </div>
    <section class="detail-card migration-backup-card" id="migrationBackupCard">
      <div class="migration-backup-heading">
        <span><b>升级安全备份</b><small>新版首次整理旧资料前自动建立</small></span>
      </div>
      <div id="migrationBackupList" class="migration-backup-list"><small>正在读取安全备份…</small></div>
    </section>
    <section class="detail-card backup-storage-fold" id="backupStorageFold">
      <button type="button" class="backup-storage-summary" aria-expanded="false">
        <span><b>储存空间</b><small>查看聊天、角色、缓存和日志占用</small></span><i class="fa-solid fa-chevron-right"></i>
      </button>
      <div id="backupStorageDetails" class="backup-storage-details" hidden></div>
    </section>
  `);
  renderMigrationSafetyBackups();
  const fold = detailBody.querySelector('#backupStorageFold');
  const foldButton = fold?.querySelector('.backup-storage-summary');
  const pinStoragePageFrame = () => {
    phoneShell.scrollTop = 0;
    chatScreen.scrollTop = 0;
    settingsPage.scrollTop = 0;
    detailPage.scrollTop = 0;
  };
  const focusStorageFold = () => {
    // 只滚动详情内容区。scrollIntoView 会连带滚动 phoneShell，造成顶栏被推出框外、底部露出壳背景。
    pinStoragePageFrame();
    const bodyRect = detailBody.getBoundingClientRect();
    const foldRect = fold.getBoundingClientRect();
    const targetTop = detailBody.scrollTop + foldRect.top - bodyRect.top - 8;
    detailBody.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
    requestAnimationFrame(pinStoragePageFrame);
    window.setTimeout(pinStoragePageFrame, 260);
  };
  foldButton?.addEventListener('click', () => {
    foldButton.blur();
    const open = fold.classList.toggle('is-open');
    foldButton.setAttribute('aria-expanded', String(open));
    const contents = fold.querySelector('#backupStorageDetails');
    if (contents) contents.hidden = !open;
    if (open && !fold.dataset.loaded) {
      fold.dataset.loaded = 'true';
      renderBackupStorageDetails().then(() => {
        requestAnimationFrame(focusStorageFold);
      });
    } else if (open) {
      requestAnimationFrame(focusStorageFold);
    }
  });
}

// ===== 缓存管理（开发者用）=====
// 与「备份与恢复」的区别：这里操作的是浏览器 localStorage 持久层（含 API 密钥、
// 语音密钥、运行日志等运行时状态），用于开发者在改 App 时迁移自己的测试环境；
// 「备份与恢复」导出的是创作内容（角色/世界书/预设等），且已剥离所有密钥。
const CACHE_STORAGE_KEYS = [
  API_CACHE_KEY,
  ROLES_CACHE_KEY,
  CHAT_CACHE_KEY,
  APP_STATE_CACHE_KEY,
  APPEARANCE_CACHE_KEY,
  POLLING_CACHE_KEY,
  'yuanbao_runtime_logs',
  'xs_userIdentities',
  'xs_userProfile',
  'xs_factory_defaults_v1',
  'xs_data_schema_version',
  'xs_data_migration_failure',
];

const CURRENT_DATA_SCHEMA_VERSION = 1;
const DATA_SCHEMA_STORAGE_KEY = 'xs_data_schema_version';
const DATA_MIGRATION_FAILURE_KEY = 'xs_data_migration_failure';
const MIGRATION_BACKUP_DB_NAME = 'xiangsi_upgrade_backups_v1';
const MIGRATION_BACKUP_STORE_NAME = 'backups';

function isXiangsiStorageKey(key) {
  return /^(?:xl_|xs_|yuanbao_)/.test(String(key || ''));
}

function captureXiangsiStorage() {
  const keys = {};
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key || !isXiangsiStorageKey(key) || key === DATA_MIGRATION_FAILURE_KEY) continue;
    const value = localStorage.getItem(key);
    if (value != null) keys[key] = value;
  }
  return keys;
}

function storageSnapshotSize(keys = {}) {
  return Object.entries(keys).reduce((sum, [key, value]) => sum + storageByteSize(key) + storageByteSize(value), 0);
}

function openMigrationBackupDb() {
  if (!('indexedDB' in window)) return Promise.reject(new Error('此设备不支持安全备份库'));
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(MIGRATION_BACKUP_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(MIGRATION_BACKUP_STORE_NAME)) {
        db.createObjectStore(MIGRATION_BACKUP_STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('安全备份库无法打开'));
  });
}

async function listMigrationBackups() {
  const db = await openMigrationBackupDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(MIGRATION_BACKUP_STORE_NAME, 'readonly')
      .objectStore(MIGRATION_BACKUP_STORE_NAME).getAll();
    request.onsuccess = () => resolve((request.result || []).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))));
    request.onerror = () => reject(request.error || new Error('安全备份读取失败'));
  }).finally(() => db.close());
}

async function readMemoryDocumentsSnapshot() {
  const db = await openMemoryDatabase();
  if (!db) return Array.isArray(memoryDocuments) ? JSON.parse(JSON.stringify(memoryDocuments)) : [];
  return new Promise((resolve) => {
    const request = db.transaction(MEMORY_DB_STORE, 'readonly').objectStore(MEMORY_DB_STORE).getAll();
    request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result : []);
    request.onerror = () => resolve(Array.isArray(memoryDocuments) ? JSON.parse(JSON.stringify(memoryDocuments)) : []);
  });
}

async function createMigrationBackup(reason = 'automatic-upgrade', options = {}) {
  const keys = options.keys || captureXiangsiStorage();
  const savedMemoryDocuments = options.includeMemoryDocuments === false ? undefined : await readMemoryDocumentsSnapshot();
  const fromVersion = Number.isFinite(Number(options.fromVersion))
    ? Number(options.fromVersion)
    : Number(localStorage.getItem(DATA_SCHEMA_STORAGE_KEY) || 0);
  const record = {
    id: `upgrade-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    type: 'xiangsi-upgrade-safety-backup',
    createdAt: new Date().toISOString(),
    reason,
    fromVersion,
    toVersion: CURRENT_DATA_SCHEMA_VERSION,
    size: storageSnapshotSize(keys) + storageByteSize(savedMemoryDocuments || []),
    keys,
    ...(savedMemoryDocuments ? { memoryDocuments: savedMemoryDocuments } : {}),
  };
  const db = await openMigrationBackupDb();
  await new Promise((resolve, reject) => {
    const request = db.transaction(MIGRATION_BACKUP_STORE_NAME, 'readwrite')
      .objectStore(MIGRATION_BACKUP_STORE_NAME).put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error || new Error('升级前安全备份写入失败'));
  }).finally(() => db.close());

  try {
    const backups = await listMigrationBackups();
    if (backups.length > 3) {
      const cleanupDb = await openMigrationBackupDb();
      await new Promise((resolve) => {
        const transaction = cleanupDb.transaction(MIGRATION_BACKUP_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(MIGRATION_BACKUP_STORE_NAME);
        backups.slice(3).forEach((backup) => store.delete(backup.id));
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => resolve();
      });
      cleanupDb.close();
    }
  } catch (_) {}
  return record;
}

function restoreStorageSnapshot(keys = {}) {
  const present = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key && isXiangsiStorageKey(key)) present.push(key);
  }
  present.forEach((key) => localStorage.removeItem(key));
  Object.entries(keys).forEach(([key, value]) => {
    if (isXiangsiStorageKey(key) && typeof value === 'string') localStorage.setItem(key, value);
  });
}

async function restoreMigrationBackup(id) {
  const db = await openMigrationBackupDb();
  const backup = await new Promise((resolve, reject) => {
    const request = db.transaction(MIGRATION_BACKUP_STORE_NAME, 'readonly')
      .objectStore(MIGRATION_BACKUP_STORE_NAME).get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error || new Error('安全备份读取失败'));
  }).finally(() => db.close());
  if (!backup?.keys) throw new Error('没有找到这份安全备份');
  restoreStorageSnapshot(backup.keys);
  if (Array.isArray(backup.memoryDocuments)) await replaceMemoryDocuments(backup.memoryDocuments);
  return backup;
}

function parseStoredJson(keys, key, fallback = null) {
  const raw = keys[key];
  if (raw == null) return fallback;
  return JSON.parse(raw);
}

function validateStorageSnapshot(keys) {
  const jsonKeys = [API_CACHE_KEY, POLLING_CACHE_KEY, ROLES_CACHE_KEY, APP_STATE_CACHE_KEY, CHAT_CACHE_KEY,
    APPEARANCE_CACHE_KEY, 'xs_userIdentities', 'xs_userProfile', 'yuanbao_runtime_logs'];
  jsonKeys.forEach((key) => {
    if (keys[key] != null) JSON.parse(keys[key]);
  });
  const rolesData = parseStoredJson(keys, ROLES_CACHE_KEY);
  if (rolesData != null && !Array.isArray(rolesData)) throw new Error('角色资料格式不完整');
  const chatData = parseStoredJson(keys, CHAT_CACHE_KEY);
  if (chatData != null && !Array.isArray(chatData?.chats)) throw new Error('聊天资料格式不完整');
  const identitiesData = parseStoredJson(keys, 'xs_userIdentities');
  if (identitiesData != null && !Array.isArray(identitiesData?.identities)) throw new Error('用户身份资料格式不完整');
  return true;
}

function migrateStorageSnapshot(sourceKeys, fromVersion = 0) {
  const keys = { ...sourceKeys };
  let version = Math.max(0, Number(fromVersion) || 0);
  const notes = [];
  if (version > CURRENT_DATA_SCHEMA_VERSION) throw new Error('这份资料来自更高版本 App，请先更新 App');

  while (version < CURRENT_DATA_SCHEMA_VERSION) {
    if (version === 0) {
      const legacyProfile = parseStoredJson(keys, 'xs_userProfile');
      let identities = parseStoredJson(keys, 'xs_userIdentities');
      if ((!identities || !Array.isArray(identities.identities) || !identities.identities.length) && legacyProfile && typeof legacyProfile === 'object') {
        const id = `u-migrated-${Date.now()}`;
        identities = {
          activeId: id,
          identities: [{ id, name: legacyProfile.name || '用户', persona: legacyProfile.persona || '', avatar: legacyProfile.avatar || '' }],
        };
        keys.xs_userIdentities = JSON.stringify(identities);
        notes.push('旧用户资料已转为多身份格式');
      }
      if (identities && Array.isArray(identities.identities) && identities.identities.length && keys.xs_userProfile != null) {
        delete keys.xs_userProfile;
        notes.push('已清理重复的旧用户资料');
      }
      version = 1;
    }
  }
  keys[DATA_SCHEMA_STORAGE_KEY] = String(CURRENT_DATA_SCHEMA_VERSION);
  validateStorageSnapshot(keys);
  return { keys, fromVersion, toVersion: CURRENT_DATA_SCHEMA_VERSION, notes, changed: fromVersion !== CURRENT_DATA_SCHEMA_VERSION };
}

function migratePortableConfig(sourceData) {
  if (!sourceData || typeof sourceData !== 'object' || Array.isArray(sourceData)) throw new Error('备份文件格式不正确');
  const data = JSON.parse(JSON.stringify(sourceData));
  const fromVersion = Math.max(0, Number(data.dataSchemaVersion) || 0);
  let version = fromVersion;
  const notes = [];
  if (version > CURRENT_DATA_SCHEMA_VERSION) throw new Error('备份来自更高版本 App，请先更新 App');
  while (version < CURRENT_DATA_SCHEMA_VERSION) {
    if (version === 0) {
      if ((!Array.isArray(data.userIdentities) || !data.userIdentities.length) && data.userProfile && typeof data.userProfile === 'object') {
        const id = `u-imported-${Date.now()}`;
        data.userIdentities = [{ id, name: data.userProfile.name || '用户', persona: data.userProfile.persona || '', avatar: data.userProfile.avatar || '' }];
        data.activeUserIdentityId = id;
        notes.push('旧用户资料已转为多身份格式');
      }
      if (Array.isArray(data.userIdentities) && data.userIdentities.length && Object.hasOwn(data, 'userProfile')) {
        delete data.userProfile;
        notes.push('已清理备份中的重复用户资料');
      }
      version = 1;
    }
  }
  data.dataSchemaVersion = CURRENT_DATA_SCHEMA_VERSION;
  return { data, fromVersion, toVersion: CURRENT_DATA_SCHEMA_VERSION, notes, changed: fromVersion !== CURRENT_DATA_SCHEMA_VERSION };
}

// 只暴露纯副本演算，便于网页和安卓调试时验证迁移规则；不会读取或写入真实缓存。
Object.defineProperty(window, 'XiangsiDataMigration', {
  configurable: false,
  writable: false,
  value: Object.freeze({
    currentVersion: CURRENT_DATA_SCHEMA_VERSION,
    previewStorage: (keys, fromVersion = 0) => migrateStorageSnapshot(keys, fromVersion),
    previewBackup: (data) => migratePortableConfig(data),
  }),
});

function showDataMigrationOverlay() {
  let overlay = document.getElementById('dataMigrationOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'dataMigrationOverlay';
    overlay.className = 'data-migration-overlay';
    overlay.innerHTML = `
      <section class="data-migration-dialog" role="status" aria-live="polite">
        <strong>正在安全升级资料</strong>
        <span id="dataMigrationStatus">正在准备…</span>
        <div class="data-migration-track"><i id="dataMigrationBar"></i></div>
        <small>请不要关闭 App，原资料会先完整保留。</small>
      </section>`;
    document.body.append(overlay);
  }
  return overlay;
}

function updateDataMigrationOverlay(message, percent) {
  const overlay = showDataMigrationOverlay();
  const status = overlay.querySelector('#dataMigrationStatus');
  const bar = overlay.querySelector('#dataMigrationBar');
  if (status) status.textContent = message;
  if (bar) bar.style.width = `${Math.max(0, Math.min(100, Number(percent) || 0))}%`;
}

function closeDataMigrationOverlay(delay = 350) {
  const overlay = document.getElementById('dataMigrationOverlay');
  if (!overlay) return;
  window.setTimeout(() => overlay.remove(), delay);
}

async function runAutomaticDataMigration() {
  const storedVersion = Math.max(0, Number(localStorage.getItem(DATA_SCHEMA_STORAGE_KEY)) || 0);
  const sourceKeys = captureXiangsiStorage();
  const hasUserData = Object.keys(sourceKeys).some((key) => key !== DATA_SCHEMA_STORAGE_KEY && key !== 'xs_factory_defaults_v1');
  if (!hasUserData) {
    localStorage.setItem(DATA_SCHEMA_STORAGE_KEY, String(CURRENT_DATA_SCHEMA_VERSION));
    return { changed: false, freshInstall: true };
  }
  if (storedVersion >= CURRENT_DATA_SCHEMA_VERSION) return { changed: false };
  const previousFailure = (() => {
    try { return JSON.parse(localStorage.getItem(DATA_MIGRATION_FAILURE_KEY) || 'null'); } catch (_) { return null; }
  })();
  if (previousFailure?.targetVersion === CURRENT_DATA_SCHEMA_VERSION) return { changed: false, skippedAfterFailure: true };

  const originalKeys = { ...sourceKeys };
  showDataMigrationOverlay();
  try {
    updateDataMigrationOverlay('正在完整备份旧资料…', 18);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await createMigrationBackup('automatic-upgrade', { keys: originalKeys, fromVersion: storedVersion });
    updateDataMigrationOverlay('正在兼容匹配缓存数据…', 52);
    const migration = migrateStorageSnapshot(originalKeys, storedVersion);
    updateDataMigrationOverlay('正在检查人物、聊天与设置…', 76);
    validateStorageSnapshot(migration.keys);
    updateDataMigrationOverlay('正在写入新版资料…', 90);
    restoreStorageSnapshot(migration.keys);
    validateStorageSnapshot(captureXiangsiStorage());
    localStorage.removeItem(DATA_MIGRATION_FAILURE_KEY);
    updateDataMigrationOverlay('资料升级完成', 100);
    closeDataMigrationOverlay(500);
    return migration;
  } catch (error) {
    try { restoreStorageSnapshot(originalKeys); } catch (_) {}
    try {
      localStorage.setItem(DATA_MIGRATION_FAILURE_KEY, JSON.stringify({
        targetVersion: CURRENT_DATA_SCHEMA_VERSION,
        failedAt: new Date().toISOString(),
        message: String(error?.message || error),
      }));
    } catch (_) {}
    updateDataMigrationOverlay('升级未完成，已恢复原资料', 100);
    const hint = document.querySelector('#dataMigrationOverlay small');
    if (hint) hint.textContent = '原资料没有被删除，本次将继续按旧格式打开。';
    closeDataMigrationOverlay(1800);
    console.error('自动资料迁移失败，已回滚：', error);
    return { changed: false, failed: true, error };
  }
}

async function renderMigrationSafetyBackups() {
  const list = detailBody?.querySelector('#migrationBackupList');
  if (!list) return;
  try {
    const backups = await listMigrationBackups();
    if (!backups.length) {
      list.innerHTML = '<small>目前没有升级安全备份；新安装或尚未迁移属于正常情况。</small>';
      return;
    }
    list.innerHTML = backups.map((backup, index) => `
      <div class="migration-backup-row" data-backup-id="${escapeHtml(backup.id)}">
        <span><b>${index === 0 ? '最近一次' : '较早备份'}</b><small>${escapeHtml(new Date(backup.createdAt).toLocaleString())} · ${formatStorageBytes(backup.size)}</small></span>
        <div><button type="button" data-action="export">导出</button><button type="button" data-action="restore">恢复</button></div>
      </div>`).join('');
    list.querySelectorAll('.migration-backup-row').forEach((row) => {
      const backup = backups.find((item) => item.id === row.dataset.backupId);
      row.querySelector('[data-action="export"]')?.addEventListener('click', () => {
        if (!backup || !confirm('升级安全备份可能包含 API 密钥，只能自己保管。确定导出？')) return;
        exportJsonFile(`${formatFileTimestamp()}-相思-升级安全备份.json`, backup);
      });
      row.querySelector('[data-action="restore"]')?.addEventListener('click', async () => {
        if (!backup || !confirm('确定恢复这份升级前资料？当前资料会先再建立一份安全备份。')) return;
        try {
          persistAllLocalState();
          await createMigrationBackup('before-manual-restore');
          await restoreMigrationBackup(backup.id);
          showToast('旧资料已恢复，正在重新打开…');
          setTimeout(() => location.reload(), 500);
        } catch (error) {
          showToast(`恢复失败：${error.message || '安全备份无法读取'}`);
        }
      });
    });
  } catch (error) {
    list.innerHTML = `<small>安全备份暂时无法读取：${escapeHtml(error.message || '未知错误')}</small>`;
  }
}

function collectLocalCache() {
  const keys = {};
  CACHE_STORAGE_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value != null) keys[key] = value;
  });
  return { type: 'xl_local_cache', exportedAt: new Date().toISOString(), keys };
}

function migrateLocalCacheBundle(bundle) {
  if (!bundle || typeof bundle !== 'object' || !bundle.keys) throw new Error('bad cache');
  const fromVersion = Math.max(0, Number(bundle.keys[DATA_SCHEMA_STORAGE_KEY]) || 0);
  const migration = migrateStorageSnapshot(bundle.keys, fromVersion);
  return { ...bundle, dataSchemaVersion: CURRENT_DATA_SCHEMA_VERSION, keys: migration.keys, migration };
}

function applyLocalCache(bundle) {
  const migrated = migrateLocalCacheBundle(bundle);
  Object.entries(migrated.keys).forEach(([key, value]) => {
    if (typeof value === 'string') localStorage.setItem(key, value);
  });
  return migrated.migration;
}

function clearLocalCache() {
  CACHE_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  clearPersistentVoiceCache();
}

function openCacheManageDetail() {
  const present = CACHE_STORAGE_KEYS.filter((key) => localStorage.getItem(key) != null);
  const totalBytes = present.reduce((sum, key) => sum + (localStorage.getItem(key)?.length || 0), 0);
  openDetail('缓存管理', `
    <div class="detail-card">
      <p class="detail-hint">这里的「缓存」= 本机持久层，包含 <b>聊天、上下文日志、API/语音密钥、人设/角色、预设、世界书与设置</b>。生成过的语音另外保存在本机音频缓存中。</p>
      <p class="detail-hint">⚠️ 导出的缓存文件<b>含 API 密钥</b>，仅供你自己迁移使用，不要外发；音频文件体积较大，不放进这个 JSON 导出文件。</p>
      <p class="detail-hint">当前占用约 ${totalBytes} 字符 / ${present.length} 项：${present.join('、') || '（空）'}</p>
      <button type="button" id="exportCacheButton" class="detail-action-btn">导出缓存</button>
      <button type="button" id="importCacheButton" class="detail-action-btn">导入缓存</button>
      <button type="button" id="clearCacheButton" class="detail-action-btn danger">清理缓存</button>
    </div>
  `);
  detailBody.querySelector('#exportCacheButton')?.addEventListener('click', () => {
    const bundle = collectLocalCache();
    const stamp = formatFileTimestamp();
    exportJsonFile(`相柳缓存-${stamp}.json`, bundle);
    showToast('缓存已导出');
  });
  detailBody.querySelector('#importCacheButton')?.addEventListener('click', () => {
    const picker = document.createElement('input');
    picker.type = 'file';
    picker.accept = '.json,application/json';
    picker.addEventListener('change', async () => {
      const file = picker.files?.[0];
      if (!file) return;
      try {
        persistAllLocalState();
        await createMigrationBackup('before-cache-import');
        const migration = applyLocalCache(JSON.parse(await file.text()));
        showToast(migration.changed ? '旧缓存已兼容整理，正在恢复…' : '缓存已导入，正在恢复…');
        setTimeout(() => location.reload(), 400);
      } catch (error) {
        showToast(`缓存没有导入：${error.message || '这个缓存文件暂时没读懂'}`);
      }
    });
    picker.click();
  });
  detailBody.querySelector('#clearCacheButton')?.addEventListener('click', () => {
    if (!confirm('确定清理本地缓存？会清空 API 密钥、运行日志等，且无法撤销。')) return;
    clearLocalCache();
    showToast('缓存已清理，正在重置…');
    setTimeout(() => location.reload(), 400);
  });
}

// 三个点页"字号设置"现在直接走外观页（统一在 openThemeDetail 里展示完整聊天界面设置）。
// 保留此函数作为对外兼容入口，转发到外观页。
function openFontDetail() {
  openThemeDetail();
}

function setApiModelStatus(message, state = '') {
  const status = detailBody.querySelector('#apiModelStatus');
  if (!status) return;
  status.textContent = message;
  status.dataset.state = state;
}

function getApiEditorModelValue() {
  return detailBody.querySelector('#apiModelControl')?.dataset.value || '';
}

function renderApiModelSelect(options, currentValue) {
  const control = detailBody.querySelector('#apiModelControl');
  if (!control) return;
  const value = currentValue || '';
  control.dataset.value = value;
  control.innerHTML = `
    <button id="apiModelSetting" class="api-model-picker-trigger" type="button" aria-haspopup="dialog">
      <span>${escapeHtml(value || '选择模型')}</span><i aria-hidden="true">›</i>
    </button>`;
}

function showManualModelInput(message = '') {
  renderApiModelSelect(apiEditorModelOptions, getApiEditorModelValue());
  if (message) setApiModelStatus(message, 'error');
}

function toggleModelInputMode() {
  openApiModelPicker();
}

function modelsEndpoint(apiUrl, subType = '') {
  const cleanUrl = apiUrl.trim().replace(/\/+$/, '');
  const endpoint = /\/models$/i.test(cleanUrl) ? cleanUrl : `${cleanUrl}/models`;
  return subType ? `${endpoint}?sub_type=${encodeURIComponent(subType)}` : endpoint;
}

async function requestAvailableModels(apiUrl, apiKey, subType = '') {
  const useProxy = isLocalPreview();
  const response = useProxy
    ? await fetch('/api/fetch-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiUrl, apiKey, subType }),
      })
    : isNativeApp() && nativeHttpPlugin()?.request
      ? await nativeHttpFetchResponse(modelsEndpoint(apiUrl, subType), {
          method: 'GET',
          headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
        }, 45000)
      : await fetch(modelsEndpoint(apiUrl, subType), {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = payload?.error?.message || payload?.message || `请求失败（${response.status}）`;
    throw new Error(detail);
  }
  const rawModels = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.models) ? payload.models : [];
  return rawModels
    .map((item) => typeof item === 'string' ? item : item?.id || item?.name)
    .filter(Boolean);
}

function memoryModelsApiBase(endpoint) {
  return String(endpoint || '')
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/embeddings(?:\/multimodal)?$/i, '')
    .replace(/\/(?:reranks?|chat\/completions|responses)$/i, '')
    .replace(/\/services\/rerank\/text-rerank\/text-rerank$/i, '');
}

async function pullMemoryModels(kind) {
  const isEmbedding = kind === 'embedding';
  const endpoint = detailBody.querySelector(isEmbedding ? '#memoryEmbeddingEndpointSetting' : '#memoryRerankEndpointSetting')?.value.trim() || '';
  const apiKey = detailBody.querySelector(isEmbedding ? '#memoryEmbeddingApiKeySetting' : '#memoryRerankApiKeySetting')?.value.trim() || '';
  const list = detailBody.querySelector(isEmbedding ? '#memoryEmbeddingModelList' : '#memoryRerankModelList');
  const modelInput = detailBody.querySelector(isEmbedding ? '#memoryEmbeddingModelSetting' : '#memoryRerankModelSetting');
  const status = detailBody.querySelector(isEmbedding ? '#memoryEmbeddingModelStatus' : '#memoryRerankModelStatus');
  const button = detailBody.querySelector(isEmbedding ? '#fetchEmbeddingModels' : '#fetchRerankModels');
  if (!endpoint || !apiKey) {
    if (status) status.textContent = '请先填写 API 接口地址和密钥';
    return;
  }
  if (button) {
    button.disabled = true;
    button.textContent = '正在获取…';
  }
  if (status) status.textContent = '正在获取模型列表…';
  try {
    const subType = isEmbedding ? 'embedding' : 'reranker';
    const models = await requestAvailableModels(memoryModelsApiBase(endpoint), apiKey, subType);
    if (!models.length) throw new Error('接口没有返回模型列表');
    const uniqueModels = [...new Set(models)].sort((left, right) => left.localeCompare(right));
    if (list) list.innerHTML = uniqueModels.map((model) => `<option value="${escapeHtml(model)}"></option>`).join('');
    const currentModel = modelInput?.value.trim() || '';
    const wrongType = isEmbedding ? /rerank/i.test(currentModel) : /embedding/i.test(currentModel);
    if (modelInput && wrongType) {
      const preferredModel = isEmbedding
        ? uniqueModels.find((model) => model === memoryPlatformDefaultModel(memorySettings.embeddingPlatform, 'embedding'))
        : uniqueModels.find((model) => model === 'Qwen/Qwen3-Reranker-8B')
          || uniqueModels.find((model) => model === memoryPlatformDefaultModel(memorySettings.rerankPlatform, 'rerank'));
      modelInput.value = preferredModel || '';
    }
    if (status) status.textContent = `已获取 ${uniqueModels.length} 个${isEmbedding ? '向量' : '重排'}模型；输入关键词可搜索，也可直接手动填写`;
  } catch (error) {
    if (status) status.textContent = `获取失败：${error.message || '未知错误'}；仍可手动填写模型 ID`;
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = '获取模型';
    }
  }
}

async function pullModelsFromApi(showMissingHint = true) {
  const apiUrl = detailBody.querySelector('#apiUrlSetting')?.value.trim() || '';
  const apiKey = detailBody.querySelector('#apiKeySetting')?.value || '';
  const control = detailBody.querySelector('#apiModelControl');
  if (!control) return false;
  if (!apiUrl || !apiKey) {
    if (showMissingHint) setApiModelStatus('请先填写 API 地址和密钥', 'error');
    return false;
  }
  setApiModelStatus('正在拉取模型…', 'loading');
  const currentValue = getApiEditorModelValue();
  try {
    const models = await requestAvailableModels(apiUrl, apiKey);
    if (!models.length) throw new Error('接口没有返回模型列表');
    apiEditorModelOptions = models;
    renderApiModelSelect(models, currentValue);
    setApiModelStatus(`连接成功，已拉取 ${models.length} 个模型`, 'success');
    return true;
  } catch (error) {
    showManualModelInput(error?.message ? `拉取失败：${error.message}，请手动填写` : undefined);
    return false;
  }
}

function closeApiModelPicker() {
  const sheet = phoneShell.querySelector('#apiModelPickerSheet');
  if (!sheet) return;
  sheet.classList.remove('is-open');
  sheet.setAttribute('aria-hidden', 'true');
  // 清理拖动可能残留的内联样式
  const card = sheet.querySelector('.api-model-sheet-card');
  if (card) {
    card.style.transform = '';
    card.classList.remove('is-dragging');
  }
  const backdrop = sheet.querySelector('.api-model-sheet-backdrop');
  if (backdrop) backdrop.style.opacity = '';
}

// 选择聊天模型 sheet：拖动关闭（按住顶部手柄或标题上下拖动）
function bindApiModelSheetDrag(sheet) {
  const card = sheet.querySelector('.api-model-sheet-card');
  if (!card) return;
  const backdrop = sheet.querySelector('.api-model-sheet-backdrop');
  let dragState = null;

  const onPointerDown = (event) => {
    if (event.button != null && event.button > 0) return;
    // 不抢 input / button / 模型列表（用户选模型要能正常点击）
    if (event.target.closest('input, button, .api-model-list')) return;
    const rect = card.getBoundingClientRect();
    dragState = {
      pointerId: event.pointerId,
      startY: event.clientY,
      cardHeight: rect.height,
    };
    card.classList.add('is-dragging');
    try { card.setPointerCapture(event.pointerId); } catch (_) {}
  };

  const onPointerMove = (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    event.preventDefault();
    const dy = Math.max(0, event.clientY - dragState.startY);   // 只能向下拖
    const progress = Math.min(1, dy / dragState.cardHeight);     // 0~1
    card.style.transform = `translateY(${dy}px)`;
    // 背景透明度跟随：拖得越远越透明
    if (backdrop) backdrop.style.opacity = String(0.58 * (1 - progress));
  };

  const onPointerUp = (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    card.classList.remove('is-dragging');
    try { card.releasePointerCapture(dragState.pointerId); } catch (_) {}
    const dy = Math.max(0, event.clientY - dragState.startY);
    if (dy > dragState.cardHeight * 0.3) {
      // 拖得够远 → 关闭
      card.style.transform = '';
      if (backdrop) backdrop.style.opacity = '';
      closeApiModelPicker();
    } else {
      // 否则吸附回原位（重新触发 transition）
      card.style.transform = '';
      requestAnimationFrame(() => {
        if (card.classList.contains('is-open') || sheet.classList.contains('is-open')) {
          card.style.transform = '';  // 让 CSS transition 自动回位
        }
      });
      if (backdrop) backdrop.style.opacity = '';
    }
    dragState = null;
  };

  card.addEventListener('pointerdown', onPointerDown);
  card.addEventListener('pointermove', onPointerMove);
  card.addEventListener('pointerup', onPointerUp);
  card.addEventListener('pointercancel', onPointerUp);
}

function filteredApiModels(query = '') {
  const normalized = query.trim().toLowerCase();
  return [...new Set([...apiEditorModelOptions, getApiEditorModelValue()].filter(Boolean))]
    .filter((model) => !normalized || model.toLowerCase().includes(normalized));
}

function renderApiModelPickerList(query = '') {
  const sheet = phoneShell.querySelector('#apiModelPickerSheet');
  if (!sheet) return;
  const list = sheet.querySelector('#apiModelPickerList');
  const useTyped = sheet.querySelector('#useTypedModelId');
  const normalizedQuery = query.trim();
  const models = filteredApiModels(normalizedQuery);
  list.innerHTML = models.length
    ? models.map((model) => `<button type="button" class="api-model-option" data-model-id="${escapeHtml(model)}">${escapeHtml(model)}</button>`).join('')
    : '<p class="api-model-empty">没有匹配的已抓取模型</p>';
  if (normalizedQuery) {
    useTyped.hidden = false;
    useTyped.textContent = `使用“${normalizedQuery}”`;
  } else {
    useTyped.hidden = true;
  }
  list.querySelectorAll('[data-model-id]').forEach((button) => {
    button.addEventListener('click', () => chooseApiModel(button.dataset.modelId));
  });
}

function chooseApiModel(model) {
  const nextModel = (model || '').trim();
  if (!nextModel) return;
  renderApiModelSelect(apiEditorModelOptions, nextModel);
  setApiModelStatus(`已选择模型：${nextModel}`, 'success');
  closeApiModelPicker();
}

function openApiModelPicker() {
  let sheet = phoneShell.querySelector('#apiModelPickerSheet');
  if (!sheet) {
    sheet = document.createElement('section');
    sheet.id = 'apiModelPickerSheet';
    sheet.className = 'api-model-sheet';
    sheet.setAttribute('aria-hidden', 'true');
    phoneShell.append(sheet);
  }
  sheet.innerHTML = `
    <button type="button" class="api-model-sheet-backdrop" aria-label="关闭选择模型"></button>
    <div class="api-model-sheet-card" role="dialog" aria-modal="true" aria-label="选择聊天模型">
      <div class="api-model-sheet-handle" aria-hidden="true"></div>
      <h2>选择聊天模型</h2>
      <input id="apiModelSearch" type="search" autocomplete="off" placeholder="搜索或直接输入模型 ID" aria-label="搜索或直接输入模型 ID">
      <button type="button" class="api-model-use-input" id="useTypedModelId" hidden></button>
      <div class="api-model-list" id="apiModelPickerList"></div>
    </div>`;
  sheet.classList.add('is-open');
  sheet.setAttribute('aria-hidden', 'false');
  const search = sheet.querySelector('#apiModelSearch');
  renderApiModelPickerList('');
  search.addEventListener('input', () => renderApiModelPickerList(search.value));
  search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && search.value.trim()) {
      event.preventDefault();
      chooseApiModel(search.value);
    }
  });
  sheet.querySelector('#useTypedModelId').addEventListener('click', () => chooseApiModel(search.value));
  sheet.querySelector('.api-model-sheet-backdrop').addEventListener('click', closeApiModelPicker);

  // 拖动手势：按住 sheet 顶部（handle + 标题）上下拖动，
  // 往下拖过 30% 高度即关闭，向上 / 拖动距离小则吸附回原位。
  // 不抢 input / button / 模型列表的点击。
  bindApiModelSheetDrag(sheet);

  const apiUrl = detailBody.querySelector('#apiUrlSetting')?.value.trim() || '';
  const apiKey = detailBody.querySelector('#apiKeySetting')?.value || '';
  if (!apiEditorModelOptions.length && apiUrl && apiKey) {
    setApiModelStatus('正在拉取模型…', 'loading');
    requestAvailableModels(apiUrl, apiKey)
      .then((models) => {
        apiEditorModelOptions = models;
        renderApiModelPickerList(search.value);
        setApiModelStatus(`连接成功，已拉取 ${models.length} 个模型`, 'success');
      })
      .catch((error) => setApiModelStatus(`拉取失败：${error.message}，可直接输入模型 ID`, 'error'));
  }
  requestAnimationFrame(() => search.focus());
}

function collectVoiceApiForm() {
  return {
    engine: voiceApiSettings.engine,
    siliconflow: {
      apiUrl: detailBody.querySelector('#voiceSfUrl')?.value.trim() || '',
      apiKey: detailBody.querySelector('#voiceSfKey')?.value || '',
      model: detailBody.querySelector('#voiceSfModel')?.value.trim() || 'FunAudioLLM/CosyVoice2-0.5B',
      voice: detailBody.querySelector('#voiceSfVoice')?.value.trim() || 'alex',
    },
    volcano: {
      appId: detailBody.querySelector('#voiceVolcAppId')?.value.trim() || '',
      accessKey: detailBody.querySelector('#voiceVolcKey')?.value || '',
      speaker: detailBody.querySelector('#voiceVolcSpeaker')?.value.trim() || 'zh_female_vv_uranus_bigtts',
    },
    minimax: {
      apiHost: normalizeMinimaxHost(detailBody.querySelector('#voiceMmHost')?.value),
      apiKey: detailBody.querySelector('#voiceMmKey')?.value || '',
      model: detailBody.querySelector('#voiceMmModel')?.value || 'speech-02-hd',
      voice: detailBody.querySelector('#voiceMmVoice')?.value.trim() || 'female-shaonv',
      speed: Math.min(2, Math.max(0.5, Number(detailBody.querySelector('#voiceMmSpeedNumber')?.value) || 1)),
    },
    moss: {
      apiHost: String(detailBody.querySelector('#voiceMossHost')?.value || 'https://api.mosi.cn').trim().replace(/\/+$/, ''),
      apiKey: detailBody.querySelector('#voiceMossKey')?.value || '',
      model: detailBody.querySelector('#voiceMossModel')?.value.trim() || 'moss-tts',
      voiceId: detailBody.querySelector('#voiceMossVoice')?.value.trim() || '',
      responseFormat: detailBody.querySelector('#voiceMossFormat')?.value || 'mp3',
      voices: Array.isArray(voiceApiSettings.moss.voices) ? voiceApiSettings.moss.voices : [],
    },
  };
}

function saveVoiceApiForm() {
  const next = collectVoiceApiForm();
  Object.assign(voiceApiSettings.siliconflow, next.siliconflow);
  Object.assign(voiceApiSettings.volcano, next.volcano);
  Object.assign(voiceApiSettings.minimax, next.minimax);
  Object.assign(voiceApiSettings.moss, next.moss);
  if (detailBody.querySelector('#personaVoiceAutoRead')) {
    voiceReadSettings.autoRead = detailBody.querySelector('#personaVoiceAutoRead').checked === true;
  }
  voiceReadSettings.extractQuoted = detailBody.querySelector('#voiceExtractQuoted')?.checked === true;
  voiceReadSettings.quotePairs = detailBody.querySelector('#voiceQuotePairs')?.value.trim() || voiceReadSettings.quotePairs;
  voiceReadSettings.removeActions = detailBody.querySelector('#voiceRemoveActions')?.checked !== false;
  voiceReadSettings.actionPairs = detailBody.querySelector('#voiceActionPairs')?.value.trim() || voiceReadSettings.actionPairs;
  voiceReadSettings.maxChars = Math.max(1, Number(detailBody.querySelector('#voiceMaxChars')?.value) || 1000);
  saveApiCache(); // 测试用：保存后同步到本地缓存
  renderMoreSettings();
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('读取参考音频失败'));
    reader.readAsDataURL(file);
  });
}

function resetVoiceClonePreview() {
  const audio = detailBody.querySelector('#voiceClonePreview');
  const toggle = detailBody.querySelector('#voiceClonePreviewToggle');
  if (audio) {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
  }
  if (voiceClonePreviewUrl) URL.revokeObjectURL(voiceClonePreviewUrl);
  voiceClonePreviewUrl = '';
  if (toggle) {
    toggle.disabled = true;
    toggle.textContent = '播放';
  }
}

function bindVoiceClonePreview() {
  const input = detailBody.querySelector('#voiceCloneFile');
  const audio = detailBody.querySelector('#voiceClonePreview');
  const toggle = detailBody.querySelector('#voiceClonePreviewToggle');
  const hint = detailBody.querySelector('#voiceCloneFileHint');
  const cloneButton = detailBody.querySelector('#cloneVoiceButton');
  if (!input || !audio || !toggle || !hint || !cloneButton) return;

  input.addEventListener('change', () => {
    resetVoiceClonePreview();
    input.dataset.duration = '';
    const file = input.files?.[0];
    if (!file) {
      hint.textContent = '建议 8–10 秒，必须小于 30 秒；上传前可先试听。';
      hint.dataset.state = '';
      cloneButton.disabled = false;
      return;
    }

    voiceClonePreviewUrl = URL.createObjectURL(file);
    audio.src = voiceClonePreviewUrl;
    toggle.disabled = false;
    cloneButton.disabled = true;
    hint.textContent = '正在读取音频时长…';
    hint.dataset.state = 'loading';
    audio.onloadedmetadata = () => {
      const duration = Number(audio.duration);
      input.dataset.duration = Number.isFinite(duration) ? String(duration) : '';
      if (!Number.isFinite(duration)) {
        hint.textContent = '无法读取音频时长，请换成 MP3、WAV 或 M4A 后重试。';
        hint.dataset.state = 'error';
        return;
      }
      const seconds = duration.toFixed(1);
      if (duration >= 30) {
        hint.textContent = `当前 ${seconds} 秒；硅基流动要求参考音频小于 30 秒，请先裁剪。`;
        hint.dataset.state = 'error';
        return;
      }
      hint.textContent = `当前 ${seconds} 秒，可以试听并开始克隆。官方建议 8–10 秒清晰人声。`;
      hint.dataset.state = 'success';
      cloneButton.disabled = false;
    };
    audio.onerror = () => {
      hint.textContent = '音频无法播放或读取，请更换文件格式。';
      hint.dataset.state = 'error';
      toggle.disabled = true;
      cloneButton.disabled = true;
    };
  });

  toggle.addEventListener('click', async () => {
    if (!audio.src) return;
    if (audio.paused) {
      await audio.play().catch(() => {});
      toggle.textContent = audio.paused ? '播放失败' : '暂停';
    } else {
      audio.pause();
      toggle.textContent = '播放';
    }
  });
  audio.addEventListener('ended', () => { toggle.textContent = '播放'; });
  audio.addEventListener('pause', () => { if (!audio.ended) toggle.textContent = '播放'; });
}

function closeVoiceDeleteSheet() {
  const sheet = phoneShell.querySelector('#voiceDeleteSheet');
  if (!sheet) return;
  sheet.classList.remove('is-open', 'is-confirming');
  sheet.setAttribute('aria-hidden', 'true');
  pendingVoiceDelete = null;
}

function renderVoiceDeleteOptions(voices) {
  const sheet = phoneShell.querySelector('#voiceDeleteSheet');
  const list = sheet?.querySelector('#voiceDeleteList');
  const status = sheet?.querySelector('#voiceDeleteListStatus');
  const submit = sheet?.querySelector('#voiceDeleteSelected');
  if (!list || !status || !submit) return;
  const customVoices = uniqueSiliconFlowCustomVoices(voices || []);
  submit.disabled = true;
  pendingVoiceDelete = null;
  if (!customVoices.length) {
    list.innerHTML = '<p class="voice-delete-empty">官方账号暂无可删除的克隆音色</p>';
    status.textContent = '只显示当前硅基流动账号的自定义音色。';
    return;
  }
  list.innerHTML = customVoices.map((voice) => `
    <button type="button" class="voice-delete-option" data-delete-voice-id="${escapeHtml(voice.id)}" data-delete-voice-name="${escapeHtml(voice.name)}">
      <span class="voice-delete-radio" aria-hidden="true"></span>
      <span><strong>${escapeHtml(voice.name)}</strong><small>${escapeHtml(voice.id)}</small></span>
    </button>`).join('');
  status.textContent = `已同步 ${customVoices.length} 个官方克隆音色，请选择一个。`;
  list.querySelectorAll('[data-delete-voice-id]').forEach((button) => {
    button.addEventListener('click', () => {
      list.querySelectorAll('.voice-delete-option').forEach((item) => item.classList.toggle('is-selected', item === button));
      pendingVoiceDelete = { id: button.dataset.deleteVoiceId, name: button.dataset.deleteVoiceName || button.dataset.deleteVoiceId };
      submit.disabled = false;
    });
  });
}

async function syncVoiceDeleteOptions() {
  const sheet = phoneShell.querySelector('#voiceDeleteSheet');
  const status = sheet?.querySelector('#voiceDeleteListStatus');
  const settings = collectVoiceApiForm();
  renderVoiceDeleteOptions(voiceApiSettings.siliconflow.customVoices || []);
  if (!settings.siliconflow.apiKey) {
    if (status) status.textContent = '请先填写硅基流动 API 密钥，再重新打开删除列表。';
    return;
  }
  if (status) status.textContent = '正在同步硅基流动官方账号的克隆音色…';
  try {
    let payload;
    if (isNativeApp()) {
      payload = await nativeSiliconFlowVoiceOptions(settings.siliconflow, 'voices');
    } else {
      const response = await fetch('/api/voice-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, scope: 'voices' }),
      });
      payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || `同步失败（${response.status}）`);
    }
    voiceApiSettings.siliconflow.customVoices = Array.isArray(payload.voices) ? payload.voices : [];
    saveApiCache();
    renderSiliconFlowVoiceSelect(voiceApiSettings.siliconflow.customVoices, settings.siliconflow.voice);
    renderPersonaVoiceBindings();
    renderVoiceDeleteOptions(voiceApiSettings.siliconflow.customVoices);
  } catch (error) {
    if (status) status.textContent = `同步失败：${error?.message || error}`;
  }
}

function openVoiceDeleteConfirmation() {
  if (!pendingVoiceDelete) return;
  const sheet = phoneShell.querySelector('#voiceDeleteSheet');
  sheet.querySelector('#voiceDeleteConfirmName').textContent = pendingVoiceDelete.name;
  sheet.querySelector('#voiceDeleteConfirmId').textContent = pendingVoiceDelete.id;
  sheet.querySelector('#confirmDeleteClonedVoice').disabled = false;
  sheet.classList.add('is-confirming');
}

async function confirmDeleteClonedVoice() {
  if (!pendingVoiceDelete) return;
  const sheet = phoneShell.querySelector('#voiceDeleteSheet');
  const button = sheet.querySelector('#confirmDeleteClonedVoice');
  const status = sheet.querySelector('#voiceDeleteConfirmStatus');
  const target = { ...pendingVoiceDelete };
  button.disabled = true;
  status.textContent = '正在从硅基流动官方账号删除…';
  status.dataset.state = 'loading';
  try {
    const settings = collectVoiceApiForm();
    if (isNativeApp()) {
      await nativeSiliconFlowRequest(settings.siliconflow, '/audio/voice/deletions', {
        method: 'POST',
        data: { uri: target.id },
      });
    } else {
      const response = await fetch('/api/delete-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, voiceId: target.id }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || `删除失败（${response.status}）`);
    }
    const remaining = uniqueSiliconFlowCustomVoices(voiceApiSettings.siliconflow.customVoices || [])
      .filter((voice) => voice.id !== target.id);
    voiceApiSettings.siliconflow.customVoices = remaining;
    if (voiceApiSettings.siliconflow.voice === target.id) voiceApiSettings.siliconflow.voice = 'alex';
    saveApiCache();
    renderSiliconFlowVoiceSelect(remaining, voiceApiSettings.siliconflow.voice);
    renderPersonaVoiceBindings();
    showToast(`已删除克隆音色：${target.name}`);
    sheet.classList.remove('is-confirming');
    renderVoiceDeleteOptions(remaining);
  } catch (error) {
    status.textContent = `删除失败：${error?.message || error}`;
    status.dataset.state = 'error';
    button.disabled = false;
  }
}

function openVoiceDeleteSheet() {
  if (voiceApiSettings.engine !== 'siliconflow') {
    showToast('请先切换到硅基流动，再管理官方克隆音色');
    return;
  }
  let sheet = phoneShell.querySelector('#voiceDeleteSheet');
  if (!sheet) {
    sheet = document.createElement('section');
    sheet.id = 'voiceDeleteSheet';
    sheet.className = 'voice-delete-sheet';
    sheet.setAttribute('aria-hidden', 'true');
    sheet.innerHTML = `
      <button type="button" class="voice-delete-backdrop" aria-label="关闭删除克隆语音"></button>
      <div class="voice-delete-card" role="dialog" aria-modal="true" aria-label="删除克隆语音">
        <div class="voice-delete-handle" aria-hidden="true"></div>
        <h2>删除克隆语音</h2>
        <p id="voiceDeleteListStatus">正在读取克隆音色…</p>
        <div class="voice-delete-list" id="voiceDeleteList"></div>
        <div class="voice-delete-actions">
          <button type="button" id="cancelVoiceDelete">取消</button>
          <button type="button" id="voiceDeleteSelected" disabled>删除所选</button>
        </div>
      </div>
      <div class="voice-delete-confirm" role="dialog" aria-modal="true" aria-label="确认删除克隆语音">
        <h2>确认删除克隆语音？</h2>
        <p>此操作会从硅基流动官方账号永久删除：</p>
        <strong id="voiceDeleteConfirmName"></strong>
        <small id="voiceDeleteConfirmId"></small>
        <p class="voice-api-status" id="voiceDeleteConfirmStatus" role="status"></p>
        <div class="voice-delete-actions">
          <button type="button" id="cancelVoiceDeleteConfirm">取消</button>
          <button type="button" id="confirmDeleteClonedVoice">确认删除</button>
        </div>
      </div>`;
    phoneShell.append(sheet);
    sheet.querySelector('.voice-delete-backdrop').addEventListener('click', closeVoiceDeleteSheet);
    sheet.querySelector('#cancelVoiceDelete').addEventListener('click', closeVoiceDeleteSheet);
    sheet.querySelector('#voiceDeleteSelected').addEventListener('click', openVoiceDeleteConfirmation);
    sheet.querySelector('#cancelVoiceDeleteConfirm').addEventListener('click', () => sheet.classList.remove('is-confirming'));
    sheet.querySelector('#confirmDeleteClonedVoice').addEventListener('click', confirmDeleteClonedVoice);
  }
  sheet.classList.remove('is-confirming');
  sheet.classList.add('is-open');
  sheet.setAttribute('aria-hidden', 'false');
  syncVoiceDeleteOptions();
}

async function cloneVoiceFromForm() {
  const status = detailBody.querySelector('#voiceCloneStatus');
  const button = detailBody.querySelector('#cloneVoiceButton');
  const file = detailBody.querySelector('#voiceCloneFile')?.files?.[0];
  const voiceId = detailBody.querySelector('#voiceCloneId')?.value.trim() || '';
  const text = detailBody.querySelector('#voiceCloneText')?.value.trim() || '';
  if (voiceApiSettings.engine !== 'siliconflow') {
    const label = voiceApiSettings.engine === 'moss' ? 'MOSS' : voiceApiSettings.engine === 'minimax' ? 'MiniMax' : '火山引擎';
    status.textContent = `${label} 请在官方平台完成复刻，再把音色 ID / voice_id 填到上方。`;
    status.dataset.state = 'error';
    return;
  }
  if (!file || !voiceId || !text) {
    status.textContent = '请填写音色 ID、参考文字并选择音频文件';
    status.dataset.state = 'error';
    return;
  }
  const duration = Number(detailBody.querySelector('#voiceCloneFile')?.dataset.duration);
  if (!Number.isFinite(duration) || duration <= 0) {
    status.textContent = '正在读取音频，请稍候再开始克隆';
    status.dataset.state = 'error';
    return;
  }
  if (duration >= 30) {
    status.textContent = `参考音频为 ${duration.toFixed(1)} 秒；硅基流动要求必须小于 30 秒`;
    status.dataset.state = 'error';
    return;
  }
  button.disabled = true;
  status.textContent = '正在上传并克隆，请稍候…';
  status.dataset.state = 'loading';
  try {
    const audio = await readFileAsDataUrl(file);
    const settings = collectVoiceApiForm();
    let payload;
    if (isNativeApp()) {
      const response = await nativeSiliconFlowRequest(settings.siliconflow, '/uploads/audio/voice', {
        method: 'POST',
        timeout: 120000,
        data: {
          model: settings.siliconflow.model || 'FunAudioLLM/CosyVoice2-0.5B',
          customName: voiceId,
          text,
          audio,
        },
      });
      payload = nativeResponseJson(response.data);
    } else {
      const response = await fetch('/api/clone-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, voiceId, text, fileName: file.name, audio }),
      });
      payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || `请求失败（${response.status}）`);
    }
    if (voiceApiSettings.engine === 'siliconflow') {
      const nextVoiceId = payload.uri || payload.voiceId || voiceId;
      const customVoices = uniqueSiliconFlowCustomVoices([
        ...(voiceApiSettings.siliconflow.customVoices || []),
        { id: nextVoiceId, name: voiceId, model: voiceApiSettings.siliconflow.model },
      ]);
      voiceApiSettings.siliconflow.customVoices = customVoices;
      renderSiliconFlowVoiceSelect(customVoices, nextVoiceId);
      renderPersonaVoiceBindings();
      saveApiCache();
    }
    if (voiceApiSettings.engine === 'minimax') detailBody.querySelector('#voiceMmVoice').value = payload.voiceId || voiceId;
    saveVoiceApiForm();
    status.textContent = '克隆成功，已选为当前音色';
    status.dataset.state = 'success';
  } catch (error) {
    status.textContent = `克隆失败：${error?.message || error}`;
    status.dataset.state = 'error';
  } finally {
    button.disabled = false;
  }
}

async function testVoiceApiConnection() {
  const status = detailBody.querySelector('#voiceApiStatus');
  const button = detailBody.querySelector('#testVoiceApi');
  const preview = detailBody.querySelector('#voiceApiPreview');
  const settings = collectVoiceApiForm();
  status.textContent = '正在连接并生成短试听…';
  status.dataset.state = 'loading';
  button.disabled = true;
  logRuntime('info', 'voice', '开始测试语音 API', { engine: settings.engine });
  try {
    let payload;
    if (isNativeApp() && settings.engine === 'siliconflow') {
      const sf = settings.siliconflow || {};
      const response = await nativeSiliconFlowRequest(sf, '/audio/speech', {
        method: 'POST',
        accept: 'audio/mpeg, audio/*, application/json',
        responseType: 'arraybuffer',
        data: {
          model: sf.model || 'FunAudioLLM/CosyVoice2-0.5B',
          input: '你好，这是硅基流动语音连接测试。',
          voice: siliconFlowVoiceId(sf),
          response_format: 'mp3',
          speed: 1,
          gain: 0,
        },
      });
      payload = { audio: response.data, mimeType: response.headers?.['content-type'] || 'audio/mpeg' };
    } else if (isNativeApp() && settings.engine === 'minimax') {
      payload = await nativeMinimaxSpeech(
        settings.minimax || {},
        '你好，这是 MiniMax 语音连接测试。',
      );
    } else if (isNativeApp() && settings.engine === 'moss') {
      payload = await nativeMossSpeech(
        settings.moss || {},
        '你好，这是 MOSS 语音连接测试。',
      );
    } else {
      const response = await fetch('/api/test-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || `请求失败（${response.status}）`);
    }
    if (!payload.audio) throw new Error(payload.message || '连接成功，但没有返回试听音频');
    saveVoiceApiForm();
    status.textContent = '连接成功，试听语音已生成';
    status.dataset.state = 'success';
    preview.src = `data:${payload.mimeType || 'audio/mpeg'};base64,${payload.audio}`;
    preview.hidden = false;
    await preview.play().catch(() => {});
    showToast('语音 API 连接成功');
    logRuntime('info', 'voice', '语音 API 连接成功', { engine: settings.engine, hasAudio: !!payload.audio });
  } catch (error) {
    status.textContent = `连接失败：${error?.message || error}`;
    status.dataset.state = 'error';
    logRuntime('error', 'voice', '语音 API 连接失败', { engine: settings.engine, error: error?.message || String(error) });
  } finally {
    button.disabled = false;
  }
}

async function refreshSiliconFlowOptions(scope) {
  const button = detailBody.querySelector(scope === 'models' ? '#refreshVoiceModels' : '#refreshVoiceIds');
  const hint = detailBody.querySelector('#voiceOptionsHint');
  const settings = collectVoiceApiForm();
  if (!settings.siliconflow.apiKey) {
    hint.textContent = '请先填写硅基流动 API 密钥';
    return;
  }
  button.disabled = true;
  hint.textContent = scope === 'models' ? '正在从硅基流动获取 TTS 模型…' : '正在获取账号保存过的语音角色…';
  try {
    let payload;
    if (isNativeApp() && settings.engine === 'siliconflow') {
      payload = await nativeSiliconFlowVoiceOptions(settings.siliconflow, scope);
    } else {
      const response = await fetch('/api/voice-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, scope }),
      });
      payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || `获取失败（${response.status}）`);
    }

    const modelList = detailBody.querySelector('#voiceSfModelList');
    if (scope === 'models') {
      modelList.innerHTML = (payload.models || [])
        .map((model) => `<option value="${escapeHtml(model)}"></option>`)
        .join('');
    }
    if (scope === 'voices') {
      const customVoices = Array.isArray(payload.voices) ? payload.voices : [];
      voiceApiSettings.siliconflow.customVoices = customVoices;
      renderSiliconFlowVoiceSelect(customVoices, settings.siliconflow.voice);
      renderPersonaVoiceBindings();
      saveApiCache();
    }
    hint.textContent = scope === 'models'
      ? `已获取 ${payload.models?.length || 0} 个 TTS 模型；点击模型输入框即可选择。`
      : `共 ${SILICONFLOW_PRESET_VOICES.length + (payload.voices?.length || 0)} 个音色：${SILICONFLOW_PRESET_VOICES.length} 个预设，${payload.voices?.length || 0} 个账号克隆音色。`;
  } catch (error) {
    hint.textContent = `获取失败：${error?.message || error}`;
  } finally {
    button.disabled = false;
  }
}

async function refreshMossVoiceOptions() {
  const button = detailBody.querySelector('#refreshMossVoices');
  const input = detailBody.querySelector('#voiceMossVoice');
  const list = detailBody.querySelector('#voiceMossVoiceList');
  const status = detailBody.querySelector('#voiceApiStatus');
  const settings = collectVoiceApiForm();
  if (!settings.moss.apiKey) {
    status.textContent = '请先填写 MOSS API Key';
    status.dataset.state = 'error';
    return;
  }
  button.disabled = true;
  status.textContent = '正在读取 MOSS 音色列表…';
  status.dataset.state = 'loading';
  try {
    let payload;
    if (isNativeApp()) {
      payload = await nativeMossVoiceOptions(settings.moss || {});
    } else {
      const response = await fetch('/api/voice-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, scope: 'voices' }),
      });
      payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || `获取失败（${response.status}）`);
    }
    voiceApiSettings.moss.voices = Array.isArray(payload.voices) && payload.voices.length ? payload.voices : MOSS_OFFICIAL_VOICES;
    list.innerHTML = mossVoiceOptionsHtml(input.value.trim(), voiceApiSettings.moss.voices);
    saveApiCache();
    status.textContent = `已读取 ${voiceApiSettings.moss.voices.length} 个 MOSS 音色`;
    status.dataset.state = 'success';
  } catch (error) {
    status.textContent = `读取失败：${error?.message || error}`;
    status.dataset.state = 'error';
  } finally {
    button.disabled = false;
  }
}

function saveWorldBookGlobalSettingsFromDetail() {
  const numberValue = (id, fallback) => {
    const value = Number(detailBody.querySelector(id)?.value);
    return Number.isFinite(value) ? value : fallback;
  };
  worldBookSettings.scanDepth = Math.max(0, numberValue('#wiScanDepth', worldBookSettings.scanDepth));
  worldBookSettings.budgetPercent = Math.max(1, Math.min(100, numberValue('#wiBudgetPercent', worldBookSettings.budgetPercent)));
  worldBookSettings.budgetCap = Math.max(0, numberValue('#wiBudgetCap', worldBookSettings.budgetCap));
  worldBookSettings.budgetChars = worldBookSettings.budgetCap || worldBookSettings.budgetChars;
  worldBookSettings.minActivations = Math.max(0, numberValue('#wiMinActivations', worldBookSettings.minActivations));
  worldBookSettings.maxDepth = Math.max(0, numberValue('#wiMaxDepth', worldBookSettings.maxDepth));
  worldBookSettings.maxRecursionSteps = Math.max(0, numberValue('#wiMaxRecursion', worldBookSettings.maxRecursionSteps));
  worldBookSettings.insertionStrategy = Number(detailBody.querySelector('#wiInsertionStrategy')?.value) || 0;
  worldBookSettings.includeNames = detailBody.querySelector('#wiIncludeNames')?.checked === true;
  worldBookSettings.recursive = detailBody.querySelector('#wiRecursive')?.checked === true;
  worldBookSettings.caseSensitive = detailBody.querySelector('#wiCaseSensitive')?.checked === true;
  worldBookSettings.matchWholeWords = detailBody.querySelector('#wiWholeWords')?.checked === true;
  worldBookSettings.useGroupScoring = detailBody.querySelector('#wiGroupScoring')?.checked === true;
  worldBookSettings.overflowAlert = detailBody.querySelector('#wiOverflowAlert')?.checked === true;
}

function closeApiActionSheet(sheet = detailBody?.querySelector?.('#apiActionSheet')) {
  sheet?.classList.remove('is-open');
  sheet?.setAttribute('aria-hidden', 'true');
  detailBody?.querySelectorAll?.('[data-api-more]').forEach((item) => item.setAttribute('aria-expanded', 'false'));
  selectedApiActionAnchor = null;
  unregisterTransientActionMenu('api-action-sheet');
}

function bindDetailControls(title) {
  detailBody.querySelectorAll('.collapse-head').forEach((head) => {
    head.addEventListener('click', (event) => {
      if (event.target.closest('input,button,label,select')) return;
      head.closest('.collapse-item').classList.toggle('is-open');
    });
  });
  detailBody.querySelectorAll('[data-preset-field-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const field = button.closest('.preset-field');
      const opening = !field.classList.contains('is-open');
      field.classList.toggle('is-open', opening);
      button.textContent = opening ? '收起' : '编辑';
      if (opening) field.querySelector('textarea')?.focus();
    });
  });
  detailBody.querySelectorAll('.preset-active-switch input').forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.checked) return;
      const index = Number(input.closest('.preset-entry')?.dataset.index);
      presets.forEach((preset, presetIndex) => { preset.active = presetIndex === index; });
      renderMoreSettings();
      showToast(`已启用：${presets[index]?.name || '预设'}`);
    });
  });
  detailBody.querySelector('#presetSelect')?.addEventListener('change', (event) => {
    savePresetsFromDetail(false);
    selectedPresetId = event.target.value;
    presets.forEach((item) => { item.active = item.id === selectedPresetId; });
    saveAppStateToCache();
    renderMoreSettings();
    openPresetDetail();
    const preset = selectedPreset();
    if (preset) showToast(`已启用：${preset.name}`);
  });
  detailBody.querySelector('#presetMoreButton')?.addEventListener('click', (event) => openPresetActionMenu(event.currentTarget));
  detailBody.querySelectorAll('.st-prompt-row-main').forEach((row) => row.addEventListener('click', () => row.closest('.st-prompt-row')?.classList.toggle('is-editing')));
  detailBody.querySelectorAll('[data-prompt-delete-row]').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    deletePromptRow(button.closest('.st-prompt-row'));
  }));
  detailBody.querySelectorAll('[data-prompt-copy-row]').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    duplicatePromptRow(button.closest('.st-prompt-row'));
  }));
  detailBody.querySelectorAll('[data-prompt-cancel]').forEach((button) => button.addEventListener('click', () => resetPromptRowEditor(button.closest('.st-prompt-row'))));
  detailBody.querySelectorAll('[data-prompt-save-row]').forEach((button) => button.addEventListener('click', () => savePromptRowEditor(button.closest('.st-prompt-row'))));
  detailBody.querySelectorAll('[data-prompt-toggle]').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    const row = button.closest('.st-prompt-row');
    row.classList.toggle('is-disabled');
    button.innerHTML = `<i class="fa-solid ${row.classList.contains('is-disabled') ? 'fa-toggle-off' : 'fa-toggle-on'}"></i>`;
  }));
  detailBody.querySelector('#addPromptBlock')?.addEventListener('click', () => {
    savePresetsFromDetail(false);
    const preset = selectedPreset();
    const identifier = `custom-${Date.now()}`;
    preset.promptBlocks.push({ identifier, name: '新提示词', role: 'system', content: '', marker: false, systemPrompt: false, injectionPosition: 0, injectionDepth: 4, injectionOrder: 100 });
    preset.promptOrder.push({ identifier, enabled: true });
    saveAppStateToCache();
    openPresetDetail();
    requestAnimationFrame(() => detailBody.querySelector(`[data-prompt-id="${identifier}"]`)?.classList.add('is-editing'));
  });
  detailBody.querySelector('#resetPromptOrder')?.addEventListener('click', () => {
    savePresetsFromDetail(false);
    const preset = selectedPreset();
    const rank = new Map(DEFAULT_PROMPT_MANAGER_ORDER.map((id, index) => [id, index]));
    preset.promptOrder.sort((a, b) => (rank.get(a.identifier) ?? 999) - (rank.get(b.identifier) ?? 999));
    saveAppStateToCache();
    openPresetDetail();
  });
  let draggedPromptId = '';
  detailBody.querySelectorAll('.st-prompt-row').forEach((row) => {
    row.addEventListener('dragstart', () => { draggedPromptId = row.dataset.promptId; row.classList.add('is-dragging'); });
    row.addEventListener('dragend', () => row.classList.remove('is-dragging'));
    row.addEventListener('dragover', (event) => event.preventDefault());
    row.addEventListener('drop', (event) => {
      event.preventDefault();
      const dragged = [...detailBody.querySelectorAll('.st-prompt-row')].find((item) => item.dataset.promptId === draggedPromptId);
      if (!dragged || dragged === row) return;
      const bounds = row.getBoundingClientRect();
      row.parentElement.insertBefore(dragged, event.clientY < bounds.top + bounds.height / 2 ? row : row.nextSibling);
    });
  });
  attachDragLift(detailBody.querySelectorAll('.st-prompt-row'));

  detailBody.querySelectorAll('[data-lorebook-active]').forEach((input) => {
    input.addEventListener('change', () => {
      const book = lorebookLibrary.find((item) => item.id === input.dataset.lorebookActive);
      if (!book) return;
      book.active = input.checked;
      saveAppStateToCache();
      renderMoreSettings();
      showToast(`${book.name}：${book.active ? '已启用' : '已停用'}`);
    });
  });
  detailBody.querySelector('#lorebookSelect')?.addEventListener('change', (event) => {
    saveWorldBookGlobalSettingsFromDetail();
    saveWorldBooksFromDetail(false);
    selectedLorebookId = event.target.value;
    // 选中即启用：切换到哪本世界书，就为当前人物启用哪本
    const book = selectedLorebook();
    if (book && currentRole) {
      const enabledIds = new Set(roleWorldbookIds(currentRole));
      enabledIds.add(book.id);
      currentRole.worldBookIds = [...enabledIds];
      saveRolesToCache();
      renderAdvancedQuickSettings();
    }
    saveAppStateToCache();
    openWorldBookDetail();
    if (book) showToast(`${roleDisplayName(currentRole)}：已启用“${book.name}”`);
  });
  detailBody.querySelector('#createLorebook')?.addEventListener('click', createLorebook);
  detailBody.querySelector('#renameLorebook')?.addEventListener('click', renameSelectedLorebook);
  detailBody.querySelector('#duplicateLorebook')?.addEventListener('click', duplicateSelectedLorebook);
  detailBody.querySelector('#deleteLorebook')?.addEventListener('click', deleteSelectedLorebook);
  detailBody.querySelector('#openAllWorldEntries')?.addEventListener('click', () => detailBody.querySelectorAll('.st-world-entry').forEach((entry) => entry.classList.add('is-open')));
  detailBody.querySelector('#closeAllWorldEntries')?.addEventListener('click', () => detailBody.querySelectorAll('.st-world-entry').forEach((entry) => entry.classList.remove('is-open')));
  detailBody.querySelector('#worldBookSearch')?.addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();
    detailBody.querySelectorAll('.st-world-entry').forEach((entry) => { entry.hidden = query && !entry.dataset.search.includes(query); });
  });
  detailBody.querySelector('#worldBookSort')?.addEventListener('change', (event) => {
    const container = detailBody.querySelector('.st-world-entries');
    const items = [...container.querySelectorAll('.st-world-entry')];
    items.sort((a, b) => {
      const left = selectedLorebook()?.entries?.[Number(a.dataset.index)] || {};
      const right = selectedLorebook()?.entries?.[Number(b.dataset.index)] || {};
      if (event.target.value === 'name') return String(left.name || '').localeCompare(String(right.name || ''), 'zh-CN');
      if (event.target.value === 'uid') return Number(left.uid ?? 0) - Number(right.uid ?? 0);
      return Number(left.order ?? 100) - Number(right.order ?? 100);
    });
    items.forEach((item) => container.append(item));
  });
  detailBody.querySelectorAll('[data-world-entry-duplicate]').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    saveWorldBooksFromDetail(false);
    const index = Number(button.dataset.worldEntryDuplicate);
    const book = selectedLorebook();
    const source = book?.entries?.[index];
    if (!source) return;
    const copy = JSON.parse(JSON.stringify(source));
    copy.id = `wb-copy-${Date.now()}`;
    copy.uid = Math.max(-1, ...book.entries.map((entry) => Number(entry.uid) || 0)) + 1;
    copy.name = `${source.name || '条目'} - 副本`;
    book.entries.splice(index + 1, 0, copy);
    saveAppStateToCache();
    openWorldBookDetail();
  }));
  detailBody.querySelectorAll('[data-world-entry-delete]').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    const index = Number(button.dataset.worldEntryDelete);
    const book = selectedLorebook();
    const entry = book?.entries?.[index];
    if (!entry || !confirm(`删除条目“${entry.name || `#${index}`}”？`)) return;
    book.entries.splice(index, 1);
    saveAppStateToCache();
    openWorldBookDetail();
  }));
  let draggedWorldEntryIndex = -1;
  detailBody.querySelectorAll('.st-world-entry').forEach((entry) => {
    entry.addEventListener('dragstart', () => { saveWorldBooksFromDetail(false); draggedWorldEntryIndex = Number(entry.dataset.index); entry.classList.add('is-dragging'); });
    entry.addEventListener('dragend', () => entry.classList.remove('is-dragging'));
    entry.addEventListener('dragover', (event) => event.preventDefault());
    entry.addEventListener('drop', (event) => {
      event.preventDefault();
      const targetIndex = Number(entry.dataset.index);
      const book = selectedLorebook();
      if (!book || draggedWorldEntryIndex < 0 || draggedWorldEntryIndex === targetIndex) return;
      const [moved] = book.entries.splice(draggedWorldEntryIndex, 1);
      book.entries.splice(targetIndex, 0, moved);
      book.entries.forEach((item, index) => { item.order = (index + 1) * 10; });
      saveAppStateToCache();
      openWorldBookDetail();
    });
  });
  attachDragLift(detailBody.querySelectorAll('.st-world-entry'));
  bindApiConnectionDrag();
  detailBody.querySelector('#createDirectApi')?.addEventListener('click', () => {
    apiLinks.push({ id: `api-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`, name: `API ${apiLinks.length + 1}`, provider: '自定义（OpenAI 协议）', url: '', model: '', key: '', enabled: true, active: false, type: 'api', isDraft: true, useCustomParams: false, modelParameters: { ...API_MODEL_PARAMETER_DEFAULTS } });
    openApiEditor(apiLinks.length - 1);
  });
  detailBody.querySelector('#createApiRouter')?.addEventListener('click', () => {
    apiLinks.push({ id: `api-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`, name: '新建路由', provider: '路由器', url: '', model: '按路由选择', key: '', enabled: true, active: false, type: 'router', routeMode: '轮询' });
    openApiEditor(apiLinks.length - 1);
  });
  detailBody.querySelectorAll('[data-use-model]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const idx = Number(button.dataset.useModel);
      const target = apiLinks[idx];
      if (!target) return;
      if (!target.model) {
        showToast('该连接还未选择模型，请点 ⋮ → 编辑 先选择模型', 'error');
        return;
      }
      apiLinks.forEach((it, index) => { it.active = index === idx; });
      saveApiCache(); // 测试用：保存后同步到本地缓存
      refreshChatStoreApiSummary();
      openApiDetail();
      showToast(`已选择：${target.name || '未命名 API'} · ${target.model}`);
    });
  });
  detailBody.querySelectorAll('[data-api-more]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const sheet = detailBody.querySelector('#apiActionSheet');
      const targetIndex = Number(button.dataset.apiMore);
      const isSameOpen = selectedApiIndex === targetIndex && sheet.classList.contains('is-open');
      if (isSameOpen) {
        closeApiActionSheet(sheet);
        return;
      }
      closeTransientActionMenus();
      selectedApiIndex = targetIndex;
      selectedApiActionAnchor = button;
      detailBody.querySelectorAll('[data-api-more]').forEach((item) => item.setAttribute('aria-expanded', 'false'));
      button.setAttribute('aria-expanded', 'true');
      sheet.style.visibility = 'hidden';
      sheet.classList.add('is-open');
      sheet.setAttribute('aria-hidden', 'false');
      registerTransientActionMenu('api-action-sheet', {
        menu: sheet,
        anchor: button,
        owner: detailPage,
        close: () => closeApiActionSheet(sheet),
        width: 150,
      });
      sheet.style.visibility = '';
    });
  });
  detailBody.querySelector('#setDefaultApi')?.addEventListener('click', () => {
    const targetIndex = selectedApiIndex;
    closeApiActionSheet();
    apiLinks.forEach((item, index) => { item.active = index === targetIndex; });
    saveApiCache(); // 测试用
    refreshChatStoreApiSummary();
    openApiDetail();
    showToast('已设为默认 API');
  });
  detailBody.querySelector('#editSelectedApi')?.addEventListener('click', () => {
    const targetIndex = selectedApiIndex;
    closeApiActionSheet();
    openApiEditor(targetIndex);
  });
  detailBody.querySelector('#copySelectedApi')?.addEventListener('click', () => {
    const targetIndex = selectedApiIndex;
    closeApiActionSheet();
    const source = apiLinks[targetIndex];
    if (!source) return;
    apiLinks.push({
      ...source,
      id: `api-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      modelParameters: normalizeApiModelParameters(source.modelParameters),
      name: `${source.name} Copy`,
      active: false,
    });
    saveApiCache(); // 测试用
    openApiDetail();
    showToast('已复制 API（包含 API 密钥）');
  });
  detailBody.querySelector('#deleteSelectedApi')?.addEventListener('click', () => {
    const targetIndex = selectedApiIndex;
    closeApiActionSheet();
    const wasActive = apiLinks[targetIndex]?.active;
    apiLinks.splice(targetIndex, 1);
    if (wasActive && apiLinks[0]) apiLinks[0].active = true;
    saveApiCache(); // 测试用
    openApiDetail();
    showToast('已删除 API');
  });
  // 注：聊天字号滑块逻辑已迁移到外观页（openThemeDetail → bindAppearanceEvents）。
  // 旧的 #fontSizeRange / #fontSizeValue 监听器已移除；fontSettingButton 改为直接打开外观页（12210）。

  // 滑块实时刷新数值 + 紫色填充
  detailBody.querySelectorAll('.model-slider').forEach((slider) => {
    updateSliderFill(slider);
    slider.addEventListener('input', () => {
      const key = slider.dataset.modelField || slider.dataset.presetParam;
      slider.dataset.hasValue = 'true';
      slider.closest('.model-row')?.classList.add('is-set');
      const valEl = slider.closest('.model-row')?.querySelector('.model-value');
      if (valEl) valEl.textContent = slider.value;
      updateSliderFill(slider);
      if (slider.dataset.modelField) modelSettings[key] = Number(slider.value);
    });
  });

  detailBody.querySelector('[data-model-field="stream"]')?.addEventListener('change', (event) => {
    modelSettings.stream = event.currentTarget.checked;
  });

  const apiEditorForm = detailBody.querySelector('#apiEditorForm');
  if (apiEditorForm) {
    bindApiModelParameterControls(apiEditorForm);
    const tryPullModels = () => pullModelsFromApi(false);
    detailBody.querySelector('#apiUrlSetting')?.addEventListener('change', tryPullModels);
    detailBody.querySelector('#apiKeySetting')?.addEventListener('change', tryPullModels);
    apiEditorForm.addEventListener('click', (event) => {
      if (event.target.closest('#apiModelSetting')) openApiModelPicker();
    });
    detailBody.querySelector('#testApiConnection')?.addEventListener('click', async (event) => {
      const button = event.currentTarget;
      button.disabled = true;
      button.textContent = '正在测试…';
      const apiUrl = detailBody.querySelector('#apiUrlSetting')?.value.trim();
      logRuntime('info', 'api', '开始测试 API 连接', { apiUrl });
      const connected = await pullModelsFromApi(true);
      button.disabled = false;
      button.textContent = connected ? '连接成功' : '重新测试';
      if (connected) {
        showToast('API 连接成功');
        logRuntime('info', 'api', 'API 连接成功', { apiUrl, modelCount: apiEditorModelOptions.length });
      } else {
        logRuntime('warn', 'api', 'API 连接失败', { apiUrl });
      }
    });
    apiEditorForm.addEventListener('submit', saveApiLinksFromDetail);
  }
  detailBody.querySelectorAll('[data-voice-engine]').forEach((button) => {
    button.addEventListener('click', () => {
      voiceApiSettings.engine = button.dataset.voiceEngine;
      detailBody.querySelectorAll('[data-voice-engine]').forEach((item) => item.classList.toggle('is-active', item === button));
      detailBody.querySelectorAll('[data-voice-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.voicePanel === voiceApiSettings.engine));
      const status = detailBody.querySelector('#voiceApiStatus');
      status.textContent = '尚未测试';
      status.dataset.state = '';
      renderPersonaVoiceBindings();
    });
  });
  detailBody.querySelector('#testVoiceApi')?.addEventListener('click', testVoiceApiConnection);
  detailBody.querySelector('#refreshVoiceModels')?.addEventListener('click', () => refreshSiliconFlowOptions('models'));
  detailBody.querySelector('#refreshVoiceIds')?.addEventListener('click', () => refreshSiliconFlowOptions('voices'));
  detailBody.querySelector('#refreshMossVoices')?.addEventListener('click', refreshMossVoiceOptions);
  const voiceMmSpeedNumber = detailBody.querySelector('#voiceMmSpeedNumber');
  const voiceMmSpeedDisplay = detailBody.querySelector('#voiceMmSpeed');
  const syncVoiceMmSpeedDisplay = (normalizeInput = false) => {
    const typed = Number(voiceMmSpeedNumber?.value);
    if (!Number.isFinite(typed)) return;
    const speed = Math.min(2, Math.max(0.5, typed));
    if (voiceMmSpeedDisplay) voiceMmSpeedDisplay.value = String(speed);
    if (normalizeInput && voiceMmSpeedNumber) voiceMmSpeedNumber.value = speed.toFixed(2);
  };
  voiceMmSpeedNumber?.addEventListener('input', () => syncVoiceMmSpeedDisplay(false));
  voiceMmSpeedNumber?.addEventListener('change', () => syncVoiceMmSpeedDisplay(true));
  voiceMmSpeedNumber?.addEventListener('blur', () => syncVoiceMmSpeedDisplay(true));
  detailBody.querySelector('#voiceSfVoice')?.addEventListener('change', (event) => {
    voiceApiSettings.siliconflow.voice = event.currentTarget.value || 'alex';
    generatedVoiceCache.clear();
    saveApiCache();
    renderPersonaVoiceBindings();
    showToast('全局音色已生效');
  });
  detailBody.querySelector('#cloneVoiceButton')?.addEventListener('click', cloneVoiceFromForm);
  detailBody.querySelector('#openDeleteClonedVoice')?.addEventListener('click', openVoiceDeleteSheet);
  bindVoiceClonePreview();
  detailBody.querySelector('#personaVoiceAutoRead')?.addEventListener('change', (event) => {
    voiceReadSettings.autoRead = event.currentTarget.checked === true;
    roles.forEach((role) => { role.autoRead = voiceReadSettings.autoRead; });
    saveRolesToCache();
    saveApiCache();
    showToast(voiceReadSettings.autoRead ? '已开启 AI 自动朗读' : '已关闭 AI 自动朗读');
  });
  bindPersonaVoiceBindingControls();
  detailBody.querySelectorAll('.api-provider-row').forEach((row) => {
    row.addEventListener('click', () => {
      const nextIndex = Number(row.dataset.index);
      apiLinks.forEach((api, index) => {
        api.active = index === nextIndex;
      });
      openApiEditor(nextIndex);
    });
  });

  detailBody.querySelector('#addVoiceLink')?.addEventListener('click', () => {
    voiceLinks.push({ name: '新声音', url: '' });
    openVoiceDetail();
  });
  detailBody.querySelector('#saveVoiceLinks')?.addEventListener('click', saveVoiceLinksFromDetail);

  detailBody.querySelector('#saveUserProfile')?.addEventListener('click', () => {
    userProfile.name = detailBody.querySelector('#userNameSetting').value.trim() || '用户';
    userProfile.persona = detailBody.querySelector('#userPersonaSetting').value.trim();
    saveUserIdentities();
    renderMoreSettings();
    showToast('用户身份已保存');
  });

  detailBody.querySelector('#saveModelSettings')?.addEventListener('click', () => {
    detailBody.querySelectorAll('[data-model-field]').forEach((input) => {
      const key = input.dataset.modelField;
      if (input.type === 'checkbox') modelSettings[key] = input.checked;
      else modelSettings[key] = Number(input.value);
    });
    saveApiCache();
    renderMoreSettings();
    showToast('全局模型设置已保存');
  });

  detailBody.querySelector('#exportRuntimeLogs')?.addEventListener('click', () => {
    exportRuntimeLogs();
    showToast('日志已导出');
  });
  detailBody.querySelector('#clearRuntimeLogs')?.addEventListener('click', () => {
    clearRuntimeLogs();
    renderMoreSettings();
    openRuntimeLogsDetail();
    showToast('日志已清空');
  });

  detailBody.querySelector('#addPreset')?.addEventListener('click', handleAddPreset);
  detailBody.querySelector('#savePresets')?.addEventListener('click', savePresetsFromDetail);

  detailBody.querySelector('#addWorldBook')?.addEventListener('click', handleAddWorldBook);
  detailBody.querySelector('#saveWorldBooks')?.addEventListener('click', () => {
    saveWorldBookGlobalSettingsFromDetail();
    saveWorldBooksFromDetail();
  });
  detailBody.querySelector('#importWorldBooks')?.addEventListener('click', importWorldBookFile);
  detailBody.querySelector('#exportWorldBooks')?.addEventListener('click', () => {
    saveWorldBookGlobalSettingsFromDetail();
    saveWorldBooksFromDetail(false);
    exportJsonFile(`${selectedLorebook()?.name || '相思世界书'}.json`, buildSillyTavernLorebook());
    showToast('世界书已导出');
  });

  detailBody.querySelector('#addRegexRule')?.addEventListener('click', () => {
    regexRules.push({ id: `regex-${Date.now()}`, name: '新正则', enabled: true, find: '', replace: '' });
    openRegexDetail();
  });
  detailBody.querySelector('#saveRegexRules')?.addEventListener('click', saveRegexRulesFromDetail);

  detailBody.querySelector('#saveThemeSetting')?.addEventListener('click', () => {
    appSettings.theme = detailBody.querySelector('#themeSetting').value === 'light' ? '浅色' : '深色';
    saveAppStateToCache();
    applyAppTheme();
    renderMoreSettings();
    showToast('主题已保存');
  });

  detailBody.querySelector('#exportConfigButton')?.addEventListener('click', () => {
    const includeKeys = detailBody.querySelector('#exportWithKeys')?.checked === true;
    exportAppBackup(includeKeys);
  });
  detailBody.querySelector('#importConfigButton')?.addEventListener('click', () => {
    importAppConfigFile();
  });

  detailBody.querySelector('#saveAppSettings')?.addEventListener('click', () => {
    appSettings.autoSave = detailBody.querySelector('#autoSaveSetting').checked;
    appSettings.importMode = detailBody.querySelector('#importModeSetting').value.trim();
    saveAppStateToCache();
    renderMoreSettings();
    showToast('设置已保存');
  });
}

function detailEntries() {
  return Array.from(detailBody.querySelectorAll('.config-entry'));
}

function fieldValue(entry, name) {
  const field = entry.querySelector(`[data-field="${name}"]`);
  if (!field) return '';
  if (field.type === 'checkbox' || field.type === 'radio') return field.checked;
  return field.value.trim();
}

function collectApiModelParametersFromForm() {
  const result = { ...API_MODEL_PARAMETER_DEFAULTS };
  detailBody.querySelectorAll('[data-api-model-param]').forEach((input) => {
    result[input.dataset.apiModelParam] = input.dataset.hasValue === 'true' ? Number(input.value) : null;
  });
  result.customJson = detailBody.querySelector('#apiCustomParameters')?.value.trim() || '';
  parseCustomModelParameters(result.customJson);
  return result;
}

function bindApiModelParameterControls(form) {
  const switchInput = form.querySelector('#apiUseCustomParams');
  const switchLabel = switchInput?.closest('label');
  // summary 区域的点击会切换 details 展开；开关自己的点击要拦住冒泡。
  switchLabel?.addEventListener('click', (event) => event.stopPropagation());
  const paramInputs = form.querySelectorAll('[data-api-model-param]');
  const numberInputs = form.querySelectorAll('[data-api-model-param-number]');
  const customInput = form.querySelector('#apiCustomParameters');
  const paramCard = form.querySelector('#apiParamCard, .api-param-cards');
  const syncMode = () => {
    const disabled = !switchInput?.checked;
    paramCard?.classList.toggle('is-disabled', disabled);
    paramInputs.forEach((input) => { input.disabled = disabled; });
    numberInputs.forEach((input) => { input.disabled = disabled; });
    if (customInput) customInput.disabled = disabled;
  };
  switchInput?.addEventListener('change', syncMode);
  paramInputs.forEach((input) => {
    updateSliderFill(input);
    input.addEventListener('input', () => {
      const row = input.closest('.model-row, .api-param-row');
      const numberInput = row?.querySelector('[data-api-model-param-number]');
      const isNone = Number(input.value) === 0;
      input.dataset.hasValue = String(!isNone);
      row?.classList.toggle('is-set', !isNone);
      if (numberInput) numberInput.value = isNone ? '' : input.value;
      updateSliderFill(input);
    });
  });
  numberInputs.forEach((numberInput) => {
    const slider = form.querySelector(`[data-api-model-param="${numberInput.dataset.apiModelParamNumber}"]`);
    if (!slider) return;
    const row = slider.closest('.model-row, .api-param-row');
    const readDraft = () => {
      const text = String(numberInput.value).trim().replace(',', '.');
      if (!text || text === '-' || text === '.' || text === '-.') return null;
      const value = Number(text);
      return Number.isFinite(value) ? value : null;
    };
    const applyDraft = () => {
      const value = readDraft();
      if (value === null || value === 0) {
        slider.dataset.hasValue = 'false';
        slider.value = slider.min;
        row?.classList.remove('is-set');
        updateSliderFill(slider);
        return;
      }
      const clamped = Math.max(Number(slider.min), Math.min(Number(slider.max), value));
      slider.value = String(clamped);
      slider.dataset.hasValue = 'true';
      row?.classList.add('is-set');
      updateSliderFill(slider);
    };
    numberInput.addEventListener('input', applyDraft);
    numberInput.addEventListener('blur', () => {
      const value = readDraft();
      if (value === null || value === 0) {
        numberInput.value = '';
        applyDraft();
        return;
      }
      const clamped = Math.max(Number(slider.min), Math.min(Number(slider.max), value));
      numberInput.value = String(clamped);
      applyDraft();
    });
  });
  syncMode();
}

async function saveApiLinksFromDetail(event) {
  event?.preventDefault();
  const form = detailBody.querySelector('#apiEditorForm');
  if (!form) return;
  const activeIndex = Number(form.dataset.activeIndex || 0);
  const api = apiLinks[activeIndex] || {};
  try {
    api.useCustomParams = !!detailBody.querySelector('#apiUseCustomParams')?.checked;
    api.disableThinking = !detailBody.querySelector('#apiThinkingEnabled')?.checked;
    delete api.parameterMode; // 老字段，下个版本清掉，避免被回读到
    api.modelParameters = collectApiModelParametersFromForm();
  } catch (error) {
    setApiModelStatus(`模型专用参数错误：${error.message}`, 'error');
    detailBody.querySelector('#apiModelParameters')?.setAttribute('open', '');
    return;
  }
  api.name = detailBody.querySelector('#apiNameSetting').value.trim() || '未命名 API';
  api.provider = detailBody.querySelector('#apiProviderSetting').value;
  api.url = detailBody.querySelector('#apiUrlSetting').value.trim();
  api.key = detailBody.querySelector('#apiKeySetting').value;
  if (!api.url || !api.key) {
    setApiModelStatus('请先填写 API 地址和密钥', 'error');
    return;
  }
  let selectedModel = getApiEditorModelValue();
  if (!selectedModel) {
    const pulled = await pullModelsFromApi(true);
    if (pulled) setApiModelStatus('已拉取模型，请点击“模型”进行选择', 'success');
    return;
  }
  const enteredModel = selectedModel;
  // 腾讯把展示名和请求 ID 分开，保存时直接纠正；DeepSeek 旧 ID 需保留以记住普通/思考模式语义。
  if (chatApiProvider(api.url) === 'tencent-tokenhub') {
    selectedModel = canonicalChatModelId(api.url, selectedModel);
  }
  api.model = selectedModel;
  api.enabled = true;
  api.active = true;
  delete api.isDraft;
  if (!api.id) api.id = `api-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  apiLinks.forEach((item, index) => {
    if (index !== activeIndex) item.active = false;
  });
  apiLinks[activeIndex] = api;
  modelSettings.model = api.model;
  saveApiCache(); // 测试用：保存后同步到本地缓存
  refreshChatStoreApiSummary();
  renderMoreSettings();
  showToast(enteredModel === selectedModel ? 'API 已保存' : `API 已保存，模型 ID 已纠正为 ${selectedModel}`);
  openApiDetail();
}

function saveVoiceLinksFromDetail() {
  const next = detailEntries()
    .map((entry) => ({
      name: fieldValue(entry, 'name') || '未命名声音',
      url: fieldValue(entry, 'url'),
    }))
    .filter((voice) => voice.name || voice.url);
  voiceLinks.splice(0, voiceLinks.length, ...next);
  saveAppStateToCache();
  showToast('声音链接已保存');
}

function savePresetsFromDetail(showSavedToast = true) {
  const preset = selectedPreset();
  if (!preset) return;
  if (preset.systemDefault === true) return;
  ensurePresetPromptManagerData(preset);
  preset.name = detailBody.querySelector('#presetName')?.value.trim() || '未命名预设';
  presets.forEach((item) => { item.active = item === preset; });
  const blockMap = new Map(preset.promptBlocks.map((block) => [block.identifier, block]));
  const order = [];
  detailBody.querySelectorAll('.st-prompt-row').forEach((row) => {
    const block = blockMap.get(row.dataset.promptId);
    if (!block) return;
    const read = (field) => row.querySelector(`[data-prompt-field="${field}"]`);
    if (!block.marker) block.name = read('name')?.value.trim() || block.name;
    block.role = read('role')?.value || 'system';
    block.injectionPosition = Number(read('injectionPosition')?.value) || 0;
    block.injectionDepth = Math.max(0, Number(read('injectionDepth')?.value) || 0);
    block.injectionOrder = Math.max(0, Number(read('injectionOrder')?.value) || 0);
    block.forbidOverrides = read('forbidOverrides')?.checked === true;
    if (!block.marker) block.content = read('content')?.value || '';
    order.push({ identifier: block.identifier, enabled: !row.classList.contains('is-disabled') });
  });
  preset.promptOrder = order;
  preset.rawPreset ||= {};
  detailBody.querySelectorAll('[data-preset-param]').forEach((input) => {
    const key = input.dataset.presetParam;
    if (input.dataset.hasValue !== 'true' || input.value.trim() === '') delete preset.rawPreset[key];
    else preset.rawPreset[key] = Number(input.value);
  });
  saveAppStateToCache();
  renderMoreSettings();
  if (showSavedToast) showToast('预设已保存');
}

function saveWorldBooksFromDetail(showSavedToast = true) {
  const book = selectedLorebook();
  if (!book) return;
  const existingEntries = book.entries || [];
  const next = detailEntries().map((entry, index) => ({
    ...(existingEntries[index] || {}),
    id: existingEntries[index]?.id || `wb-${Date.now()}-${index}`,
    uid: existingEntries[index]?.uid ?? index,
    name: fieldValue(entry, 'name') || '未命名世界书',
    enabled: fieldValue(entry, 'enabled'),
    constant: fieldValue(entry, 'status') === 'constant',
    vectorized: fieldValue(entry, 'status') === 'vectorized',
    keywords: fieldValue(entry, 'keywords'),
    secondaryKeys: fieldValue(entry, 'secondaryKeys'),
    selectiveLogic: fieldValue(entry, 'selectiveLogic') || 'AND_ANY',
    position: fieldValue(entry, 'position') || 'after_char',
    role: fieldValue(entry, 'role') || 'system',
    order: Number(fieldValue(entry, 'order')) || 0,
    depth: Math.max(0, Number(fieldValue(entry, 'depth')) || 0),
    probability: Math.max(0, Math.min(100, Number(fieldValue(entry, 'probability')) || 0)),
    scanDepth: Math.max(0, Number(fieldValue(entry, 'scanDepth')) || worldBookSettings.scanDepth),
    group: fieldValue(entry, 'group'),
    groupWeight: Math.max(0, Number(fieldValue(entry, 'groupWeight')) || 100),
    delay: Math.max(0, Number(fieldValue(entry, 'delay')) || 0),
    sticky: Math.max(0, Number(fieldValue(entry, 'sticky')) || 0),
    cooldown: Math.max(0, Number(fieldValue(entry, 'cooldown')) || 0),
    caseSensitive: fieldValue(entry, 'caseSensitive'),
    matchWholeWords: fieldValue(entry, 'matchWholeWords'),
    preventRecursion: fieldValue(entry, 'preventRecursion'),
    excludeRecursion: fieldValue(entry, 'excludeRecursion'),
    content: fieldValue(entry, 'content'),
  }));
  book.entries = next;
  if (book === lorebookLibrary[0]) worldBooks.splice(0, worldBooks.length, ...next);
  saveAppStateToCache();
  renderMoreSettings();
  if (showSavedToast) showToast('世界书已保存');
}

function buildSillyTavernLorebook(book = selectedLorebook()) {
  const positionMap = { before_char: 0, after_char: 1, before_an: 2, after_an: 3, at_depth: 4, before_examples: 5, after_examples: 6, outlet: 7 };
  const logicMap = { AND_ANY: 0, AND_ALL: 1, NOT_ANY: 2, NOT_ALL: 3 };
  const roleMap = { system: 0, user: 1, assistant: 2 };
  const entries = {};
  (book?.entries || []).map(normalizeWorldEntry).forEach((entry, index) => {
    const base = entry.raw && typeof entry.raw === 'object' ? JSON.parse(JSON.stringify(entry.raw)) : {};
    const uid = entry.uid ?? index;
    entries[uid] = {
      ...base,
      uid,
      key: entry.keys,
      keysecondary: entry.secondaryKeys,
      comment: entry.name,
      content: entry.content,
      constant: entry.constant,
      selective: entry.secondaryKeys.length > 0,
      selectiveLogic: logicMap[entry.selectiveLogic] ?? 0,
      order: entry.order,
      position: positionMap[entry.position] ?? 1,
      disable: !entry.enabled,
      probability: entry.probability,
      useProbability: true,
      depth: entry.depth,
      role: roleMap[entry.role] ?? 0,
      scanDepth: entry.scanDepth,
      vectorized: entry.vectorized === true,
      group: entry.group || '',
      groupWeight: Number(entry.groupWeight) || 100,
      delay: Number(entry.delay) || 0,
      sticky: Number(entry.sticky) || 0,
      cooldown: Number(entry.cooldown) || 0,
      caseSensitive: entry.caseSensitive ?? null,
      matchWholeWords: entry.matchWholeWords ?? null,
      preventRecursion: entry.preventRecursion === true,
      excludeRecursion: entry.excludeRecursion === true,
    };
  });
  return { ...(book?.raw || {}), entries };
}

function parseImportedLorebook(data, fileName = '导入世界书.json') {
  if (Array.isArray(data?.worldBooks)) {
    return { id: `lorebook-import-${Date.now()}`, name: fileName.replace(/\.(json|lorebook)$/i, ''), active: false, entries: data.worldBooks };
  }
  const rawEntries = Array.isArray(data?.entries) ? data.entries : Object.values(data?.entries || {});
  const positionMap = { 0: 'before_char', 1: 'after_char', 2: 'before_an', 3: 'after_an', 4: 'at_depth', 5: 'before_examples', 6: 'after_examples', 7: 'outlet' };
  const logicMap = { 0: 'AND_ANY', 1: 'AND_ALL', 2: 'NOT_ANY', 3: 'NOT_ALL' };
  const roleMap = { 0: 'system', 1: 'user', 2: 'assistant', system: 'system', user: 'user', assistant: 'assistant' };
  const entries = rawEntries.map((entry, index) => ({
    raw: JSON.parse(JSON.stringify(entry)),
    id: `wb-import-${Date.now()}-${entry.uid ?? index}`,
    uid: entry.uid ?? index,
    name: entry.comment || entry.memo || `导入条目 ${index + 1}`,
    enabled: entry.disable !== true && entry.enabled !== false,
    constant: entry.constant === true,
    keywords: (entry.key || entry.keys || []).join(', '),
    secondaryKeys: (entry.keysecondary || entry.secondaryKeys || []).join(', '),
    selectiveLogic: logicMap[entry.selectiveLogic] || entry.selectiveLogic || 'AND_ANY',
    position: entry.extensions?.positionName || positionMap[entry.position] || 'after_char',
    role: roleMap[entry.extensions?.role ?? entry.role] || 'system',
    order: Number(entry.order) || 100,
    depth: Math.max(0, Number(entry.depth) || 0),
    probability: Math.max(0, Math.min(100, Number(entry.probability ?? 100))),
    scanDepth: Math.max(0, Number(entry.extensions?.scanDepth ?? entry.scanDepth ?? worldBookSettings.scanDepth)),
    vectorized: entry.vectorized === true || entry.extensions?.vectorized === true,
    group: entry.group || entry.extensions?.group || '',
    groupWeight: Number(entry.groupWeight ?? entry.extensions?.group_weight ?? 100),
    delay: Number(entry.delay ?? entry.extensions?.delay ?? 0),
    sticky: Number(entry.sticky ?? entry.extensions?.sticky ?? 0),
    cooldown: Number(entry.cooldown ?? entry.extensions?.cooldown ?? 0),
    caseSensitive: entry.caseSensitive ?? entry.extensions?.case_sensitive ?? false,
    matchWholeWords: entry.matchWholeWords ?? entry.extensions?.match_whole_words ?? false,
    preventRecursion: entry.preventRecursion ?? entry.extensions?.prevent_recursion ?? false,
    excludeRecursion: entry.excludeRecursion ?? entry.extensions?.exclude_recursion ?? false,
    content: entry.content || '',
  }));
  return {
    id: `lorebook-import-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name: data?.name || fileName.replace(/\.(json|lorebook)$/i, ''),
    active: false,
    entries,
    raw: Object.fromEntries(Object.entries(data || {}).filter(([key]) => key !== 'entries')),
  };
}

function importWorldBookFile() {
  const picker = document.createElement('input');
  picker.type = 'file';
  picker.accept = '.json,application/json';
  picker.addEventListener('change', async () => {
    const file = picker.files?.[0];
    if (!file) return;
    try {
      const imported = parseImportedLorebook(JSON.parse(await file.text()), file.name);
      if (!imported.entries.length) throw new Error('世界书中没有条目');
      lorebookLibrary.push(imported);
      selectedLorebookId = imported.id;
      saveAppStateToCache();
      renderMoreSettings();
      openWorldBookDetail();
      showToast(`已导入“${imported.name}”：${imported.entries.length} 条`);
    } catch (error) {
      showToast(`世界书导入失败：${error.message}`);
    }
  });
  picker.click();
}

// 只读兼容检查入口：便于手机预览/自动化验证导出结构，不暴露密钥或聊天数据。
window.XiangsiCompatibility = Object.freeze({
  buildActivePreset: () => buildSillyTavernPreset(activePreset()),
  buildSelectedLorebook: () => buildSillyTavernLorebook(selectedLorebook()),
});

function saveRegexRulesFromDetail() {
  const next = detailEntries().map((entry, index) => ({
    id: regexRules[index]?.id || `regex-${Date.now()}-${index}`,
    name: fieldValue(entry, 'name') || '未命名正则',
    enabled: fieldValue(entry, 'enabled'),
    find: fieldValue(entry, 'find'),
    replace: fieldValue(entry, 'replace'),
  }));
  regexRules.splice(0, regexRules.length, ...next);
  saveAppStateToCache();
  renderMoreSettings();
  showToast('正则已保存');
}

let bottomScrollAnimationFrame = null;

function cancelBottomScrollAnimation() {
  if (bottomScrollAnimationFrame !== null) cancelAnimationFrame(bottomScrollAnimationFrame);
  bottomScrollAnimationFrame = null;
}

function scrollToBottom({ animate = true } = {}) {
  cancelBottomScrollAnimation();
  const start = messages.scrollTop;
  const target = Math.max(0, messages.scrollHeight - messages.clientHeight);
  const distance = Math.abs(target - start);
  // 初次载入、键盘调整和很短的距离不播动画，避免影响正常输入节奏。
  if (!animate || messages.classList.contains('is-instant-scroll') || distance < 8) {
    messages.scrollTop = target;
    updateScrollState();
    return;
  }
  // 长距离回底：至少 3 秒，最长 6 秒；距离越远，动画越慢一些。
  const duration = Math.min(6000, Math.max(distance > 1200 ? 3000 : 260, distance * 0.16));
  const startedAt = performance.now();
  const easeInOut = (value) => value < 0.5 ? 4 * value * value * value : 1 - ((-2 * value + 2) ** 3) / 2;
  const animateStep = (now) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    messages.scrollTop = start + (target - start) * easeInOut(progress);
    updateScrollState();
    if (progress < 1) {
      bottomScrollAnimationFrame = requestAnimationFrame(animateStep);
      return;
    }
    messages.scrollTop = target;
    bottomScrollAnimationFrame = null;
    updateScrollState();
  };
  bottomScrollAnimationFrame = requestAnimationFrame(animateStep);
}

function isMessagesAtBottom(threshold = 10) {
  const remaining = messages.scrollHeight - messages.clientHeight - messages.scrollTop;
  return remaining <= threshold;
}

// 重刷或切换历史回复时固定目标 AI 气泡的工具栏底边：
// 新内容变长只向上扩展，把上方聊天推走，不让工具栏钻进输入栏。
// 用户在等待期间主动触摸/滚动聊天区时立即放弃自动定位，避免抢夺滚动控制。
function createReplyToolbarAnchor(item, cancelOnInteraction = true) {
  const toolbar = item.querySelector('.message-actions');
  const anchorElement = toolbar || item;
  const originalBottom = anchorElement.getBoundingClientRect().bottom;
  const originalChatScreenScrollTop = chatScreen.scrollTop;
  // 严格使用点击前的位置；不要预先钳到输入栏上方，否则第一次切换会产生跳动。
  const anchoredBottom = originalBottom;
  let cancelled = false;
  let scheduled = false;
  const cancel = () => { cancelled = true; };
  const listenerOptions = { capture: true, passive: true };
  if (cancelOnInteraction) {
    messages.addEventListener('pointerdown', cancel, listenerOptions);
    messages.addEventListener('touchstart', cancel, listenerOptions);
    messages.addEventListener('wheel', cancel, listenerOptions);
  }

  const dispose = () => {
    if (!cancelOnInteraction) return;
    messages.removeEventListener('pointerdown', cancel, listenerOptions);
    messages.removeEventListener('touchstart', cancel, listenerOptions);
    messages.removeEventListener('wheel', cancel, listenerOptions);
  };
  return {
    cancel: () => { cancelled = true; dispose(); },
    restore: () => {
      if (scheduled) return;
      scheduled = true;
      // click 默认行为会在监听器结束后聚焦按钮并调整容器；下一轮事件再按原坐标校正。
      // 用零延时任务而非动画帧，后台 WebView 也能稳定执行。
      setTimeout(() => {
        if (!cancelled && item.isConnected) {
          // Chromium/安卓 WebView 会为了聚焦工具栏按钮，偷偷滚动 overflow:hidden 的 chat-screen。
          // 先恢复外层内部滚动，再按回复实际高度补偿消息列表。
          if (chatScreen.scrollTop !== originalChatScreenScrollTop) {
            chatScreen.scrollTop = originalChatScreenScrollTop;
          }
          const currentAnchorElement = item.querySelector('.message-actions') || item;
          const currentBottom = currentAnchorElement.getBoundingClientRect().bottom;
          const delta = currentBottom - anchoredBottom;
          if (Math.abs(delta) > 0.5) messages.scrollTop = Math.max(0, messages.scrollTop + delta);
          updateScrollState();
        }
        dispose();
      }, 0);
    },
  };
}

function recoverMojibake(value) {
  if (typeof value !== 'string') return '';
  if (/[\u4e00-\u9fff]/.test(value) || !/[\u00c0-\u00ff]/.test(value)) return value;
  try {
    const bytes = Uint8Array.from(Array.from(value), (char) => char.charCodeAt(0) & 255);
    const fixed = new TextDecoder('utf-8').decode(bytes);
    return /[\u4e00-\u9fff]/.test(fixed) ? fixed : value;
  } catch {
    return value;
  }
}

function normalizeChatMessage(entry, meta) {
  const isUser = entry.is_user === true || entry.role === 'user' || entry.name === meta.userName;
  const text = recoverMojibake(entry.mes || entry.content || entry.message || '');
  const rawVariants = entry.replyVariants || entry.swipes;
  const replyVariants = Array.isArray(rawVariants)
    ? rawVariants.map(recoverMojibake).filter((value) => typeof value === 'string' && value.length > 0)
    : [];
  if (!isUser && text && !replyVariants.includes(text)) replyVariants.push(text);
  const rawIndex = entry.replyVariantIndex ?? entry.swipe_id ?? entry.swipeId;
  let replyVariantIndex = Number.isFinite(Number(rawIndex)) ? Number(rawIndex) : replyVariants.indexOf(text);
  if (replyVariantIndex < 0 || replyVariantIndex >= replyVariants.length) replyVariantIndex = 0;
  const selectedText = !isUser && replyVariants.length ? (replyVariants[replyVariantIndex] || text) : text;
  const reasoning = recoverMojibake(entry.reasoning || entry.reasoning_content || entry.extra?.reasoning || '');
  const rawReasoningVariants = entry.replyReasoningVariants || entry.swipe_reasoning || entry.swipeReasoning;
  const replyReasoningVariants = Array.isArray(rawReasoningVariants)
    ? rawReasoningVariants.map((value) => recoverMojibake(value || ''))
    : [];
  while (replyReasoningVariants.length < replyVariants.length) replyReasoningVariants.push('');
  if (!isUser && reasoning && replyReasoningVariants.length) replyReasoningVariants[replyVariantIndex] = reasoning;
  return {
    role: isUser ? 'user' : 'bot',
    name: recoverMojibake(entry.name || (isUser ? meta.userName : meta.characterName)),
    text: selectedText,
    sendDate: entry.send_date || entry.created_at || '',
    ...(!isUser && reasoning ? { reasoning } : {}),
    ...(replyVariants.length > 1 ? { replyVariants, replyVariantIndex } : {}),
    ...(!isUser && replyReasoningVariants.some(Boolean) ? { replyReasoningVariants } : {}),
  };
}

function parseJsonlChat(text, fileName) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const parsed = lines.map((line) => JSON.parse(line));
  const first = parsed[0] || {};
  const meta = {
    userName: recoverMojibake(first.user_name || first.userName || userProfile.name || '用户'),
    characterName: recoverMojibake(first.character_name || first.characterName || currentRole.name),
  };
  const importedFrom = first.chat_metadata?.imported_from || first.imported_from || 'jsonl';
  const chatMessages = parsed
    .filter((entry) => entry && (entry.mes || entry.content || entry.message))
    .map((entry) => normalizeChatMessage(entry, meta))
    .filter((entry) => entry.text);

  const saveAllOptions = first.chat_metadata?.save_all_options === true
    || chatMessages.some((entry) => entry.replyVariants?.length > 1);
  return {
    id: `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    roleId: roleByName(meta.characterName)?.id || currentRole.id,
    title: fileName.replace(/\.(jsonl|json)$/i, ''),
    userName: meta.userName,
    characterName: meta.characterName,
    source: importedFrom,
    saveAllOptions,
    messages: chatMessages,
  };
}

function parseJsonChat(text, fileName) {
  const data = JSON.parse(text);
  if (Array.isArray(data)) {
    return parseJsonlChat(data.map((entry) => JSON.stringify(entry)).join('\n'), fileName);
  }
  if (Array.isArray(data.messages)) {
    const meta = {
      userName: data.user_name || data.userName || userProfile.name || '用户',
      characterName: data.character_name || data.characterName || currentRole.name,
    };
    const messages = data.messages.map((entry) => normalizeChatMessage(entry, meta)).filter((entry) => entry.text);
    return {
      id: `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      roleId: roleByName(meta.characterName)?.id || currentRole.id,
      title: data.name || data.title || fileName.replace(/\.json$/i, ''),
      userName: recoverMojibake(meta.userName),
      characterName: recoverMojibake(meta.characterName),
      source: data.source || 'json',
      saveAllOptions: data.saveAllOptions !== false,
      messages,
    };
  }
  return parseJsonlChat(text, fileName);
}

function parsePlainTextChat(text, fileName) {
  const cleanText = recoverMojibake(text.trim());
  return {
    id: `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    roleId: currentRole.id,
    title: fileName.replace(/\.[^.]+$/i, ''),
    userName: userProfile.name || '用户',
    characterName: currentRole.name,
    source: 'plain-text',
    messages: cleanText ? [
      {
        role: 'bot',
        name: currentRole.name,
        text: cleanText,
        sendDate: new Date().toISOString(),
      },
    ] : [],
  };
}

async function importChatFile(file) {
  const text = await file.text();
  let chat;
  const lowerName = file.name.toLowerCase();
  try {
    if (lowerName.endsWith('.json')) {
      chat = parseJsonChat(text, file.name);
    } else if (lowerName.endsWith('.jsonl')) {
      chat = parseJsonlChat(text, file.name);
    } else {
      chat = parsePlainTextChat(text, file.name);
    }
  } catch {
    chat = parsePlainTextChat(text, file.name);
  }
  chatHistories.unshift(chat);
  activeChatsByRole[chat.roleId] = chat;
  if (chat.roleId !== currentRole.id) {
    setRole(roles.find((role) => role.id === chat.roleId) || currentRole);
  }
  activeChat = chat;
  renderHistory();
  loadChatHistory(chat);
  saveChatHistoriesToCache();
  return chat;
}

function renderBotReasoning(item, reasoning = '', { streaming = false, interrupted = false } = {}) {
  if (!item) return;
  const value = String(reasoning || '').trim();
  let details = item.querySelector('.stream-reasoning');
  if (!value) {
    details?.remove();
    return;
  }
  if (!details) {
    details = document.createElement('details');
    details.className = 'stream-reasoning';
    const summary = document.createElement('summary');
    const content = document.createElement('div');
    content.className = 'stream-reasoning-content';
    details.append(summary, content);
    const paragraph = item.querySelector('p');
    if (paragraph) item.insertBefore(details, paragraph);
    else item.append(details);
  }
  details.open = streaming;
  const summary = details.querySelector('summary');
  if (summary) summary.textContent = interrupted
    ? '思考已中断（点击查看已收到内容）'
    : streaming ? '思考中（点击折叠）' : '思考过程（点击展开）';
  const content = details.querySelector('.stream-reasoning-content');
  if (content) content.textContent = value;
}

function createChatMessageElement(entry, index = -1) {
  const item = document.createElement('article');
  item.className = `message ${entry.role === 'user' ? 'user' : 'bot'}`;
  if (entry.isGreeting) item.classList.add('is-greeting');
  if (index >= 0) item.dataset.index = String(index);

  // 多选复选框
  const checkbox = document.createElement('span');
  checkbox.className = 'msg-checkbox';
  checkbox.setAttribute('aria-hidden', 'true');
  item.append(checkbox);

  const paragraph = document.createElement('p');
  // 兼容已有聊天记录：清除 AI 文本首尾空行，避免气泡出现大块空白。
  if (entry.role !== 'user') entry.text = String(entry.text || '').trim();
  paragraph.textContent = entry.text;
  item.append(paragraph);

  if (entry.role !== 'user') {
    renderBotReasoning(item, entry.reasoning || '');
    const tools = document.createElement('div');
    tools.className = 'message-actions';
    tools.innerHTML = actionsTemplate({ isGreeting: entry.isGreeting === true });
    item.append(tools);
    bindMessageActions(item, entry);
  } else if (entry.role === 'user') {
    bindUserMessageLongPress(item);
  }
  return item;
}

const CHAT_RENDER_PAGE_SIZE = 50;
let renderedChatStartIndex = 0;
let isLoadingEarlierChatMessages = false;
let chatHistoryLoadIntent = false;

function createChatHistoryLoader() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'chat-history-loader';
  button.addEventListener('click', loadEarlierChatMessages);
  return button;
}

function updateChatHistoryLoader() {
  let loader = messages.querySelector('.chat-history-loader');
  if (renderedChatStartIndex <= 0 || !activeChat?.messages?.length) {
    loader?.remove();
    return;
  }
  if (!loader) {
    loader = createChatHistoryLoader();
    const firstMessage = messages.querySelector('.message');
    messages.insertBefore(loader, firstMessage || null);
  }
  const remaining = renderedChatStartIndex;
  const nextCount = Math.min(CHAT_RENDER_PAGE_SIZE, remaining);
  loader.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i><span>继续上滑加载更早 ${nextCount} 条</span><small>还剩 ${remaining} 条</small>`;
}

function loadEarlierChatMessages() {
  if (isLoadingEarlierChatMessages || !activeChat || renderedChatStartIndex <= 0) return;
  isLoadingEarlierChatMessages = true;
  chatHistoryLoadIntent = false;
  const previousScrollHeight = messages.scrollHeight;
  const previousScrollTop = messages.scrollTop;
  const nextStart = Math.max(0, renderedChatStartIndex - CHAT_RENDER_PAGE_SIZE);
  const fragment = document.createDocumentFragment();
  for (let index = nextStart; index < renderedChatStartIndex; index += 1) {
    fragment.append(createChatMessageElement(activeChat.messages[index], index));
  }
  const firstMessage = messages.querySelector('.message');
  messages.insertBefore(fragment, firstMessage || null);
  renderedChatStartIndex = nextStart;
  updateChatHistoryLoader();
  renderChatTimestamp(activeChat);
  updateLatestBotMessage();

  // 补历史后抵消新增内容的高度，用户眼前的那条消息保持在原位。
  messages.classList.add('is-instant-scroll');
  messages.scrollTop = previousScrollTop + (messages.scrollHeight - previousScrollHeight);
  requestAnimationFrame(() => messages.classList.remove('is-instant-scroll'));
  isLoadingEarlierChatMessages = false;
  updateScrollState();
}

function loadChatHistory(chat, { silent = false } = {}) {
  // 进入/重载聊天时保持普通模糊背景；只有之后的手动下滑或回到底按钮才能展示半屏背景。
  hideBottomBackgroundReveal();
  activeChat = chat;
  chat.lastActiveAt = new Date().toISOString();
  activeChatsByRole[chat.roleId || currentRole.id] = chat;
  messages.classList.add('is-loading-history', 'is-instant-scroll');
  messages.querySelectorAll('.message,.chat-history-loader,.chat-timestamp').forEach((node) => node.remove());
  chatHistoryLoadIntent = false;
  // 空对话：把角色开场白作为第一条真实消息种入（持久化，不会因后续发消息而丢失）
  if (!chat.messages.length && currentRole && currentRole.greeting) {
    chat.messages = [{
      role: 'bot',
      name: currentRole.name,
      text: currentRole.greeting,
      sendDate: new Date().toISOString(),
      isGreeting: true,
    }];
  }
  // 兼容修复前已经创建的聊天：旧数据里的开场白缺少 isGreeting，导致误显示工具栏。
  const firstMessage = chat.messages[0];
  if (
    firstMessage
    && firstMessage.role === 'bot'
    && String(firstMessage.text || '').trim() === String(currentRole?.greeting || '').trim()
  ) {
    firstMessage.isGreeting = true;
  }
  // 有消息则显示消息；无开场白才显示占位
  const isRealHistory = chat.messages.length > 0;
  renderedChatStartIndex = isRealHistory ? Math.max(0, chat.messages.length - CHAT_RENDER_PAGE_SIZE) : 0;
  const visibleMessages = isRealHistory ? chat.messages.slice(renderedChatStartIndex) : [{ role: 'bot', text: `${chat.title} 现在还是空聊天框，可以从这里继续聊。` }];
  const fragment = document.createDocumentFragment();
  visibleMessages.forEach((entry, offset) => {
    fragment.append(createChatMessageElement(entry, isRealHistory ? renderedChatStartIndex + offset : -1));
  });
  messages.append(fragment);
  updateChatHistoryLoader();
  // 在聊天区最后一条AI消息下方显示时间戳（居中）
  renderChatTimestamp(chat);
  // 标记最新AI消息（只有它默认显示操作按钮）
  updateLatestBotMessage();
  updateHeroLastReplyTime(chat);
  closeChatStorePage();
  closeChatActionMenu();
  renderHistory();
  syncConversationVisualState();
  scrollToBottom();
  updateScrollState();
  requestAnimationFrame(() => {
    scrollToBottom();
    messages.classList.remove('is-loading-history', 'is-instant-scroll');
  });
  saveChatHistoriesToCache();
  if (!silent) showToast(`已进入：${chat.title}`);
}

function formatReplyTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const weekdays = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return `${weekdays[date.getDay()]} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function updateHeroLastReplyTime(chat = activeChat) {
  const latestBotMessage = [...(chat?.messages || [])].reverse().find((entry) => entry.role === 'bot' && entry.sendDate);
  heroLastReplyTime.textContent = latestBotMessage ? formatReplyTime(latestBotMessage.sendDate) : '';
}

/** 相邻两条消息相隔 ≥48h 时，在上一条之后插入固定时间分割线（历史中可有多条） */
function renderChatTimestamp(chat = activeChat) {
  // 先移除旧的时间戳
  messages.querySelectorAll('.chat-timestamp').forEach((el) => el.remove());
  const list = chat?.messages || [];
  if (!list.length) return;
  const HOUR = 3600 * 1000;
  const GAP = 48 * HOUR;
  const msgElsByIndex = new Map(
    [...messages.querySelectorAll('.message[data-index]')]
      .map((element) => [Number(element.dataset.index), element]),
  );
  const inserts = [];
  for (const [index] of msgElsByIndex) {
    if (index <= 0 || !msgElsByIndex.has(index - 1)) continue;
    const previous = list[index - 1];
    const current = list[index];
    const previousTime = previous?.sendDate ? new Date(previous.sendDate).getTime() : null;
    const currentTime = current?.sendDate ? new Date(current.sendDate).getTime() : null;
    if (previousTime == null || currentTime == null) continue;
    // 相邻两条消息间隔 ≥48h → 在上一条之后插入固定分割线
    if (currentTime - previousTime >= GAP) {
      inserts.push({ el: msgElsByIndex.get(index - 1), text: formatReplyTime(previous.sendDate) });
    }
  }
  // 从后往前插入，避免 DOM 索引变化影响插入位置
  for (let j = inserts.length - 1; j >= 0; j -= 1) {
    const ts = document.createElement('div');
    ts.className = 'chat-timestamp';
    ts.textContent = inserts[j].text;
    inserts[j].el.after(ts);
  }
}

/** 标记最新一条AI消息（只有它默认显示操作按钮，其他隐藏） */
function updateLatestBotMessage() {
  messages.querySelectorAll('.message.bot').forEach((el) => el.classList.remove('is-latest'));
  messages.querySelectorAll('.message').forEach((el) => el.classList.remove('is-last-message'));
  // 跳过开场白，避免它默认显示操作按钮
  const lastBot = [...messages.querySelectorAll('.message.bot:not(.is-greeting)')].pop();
  if (lastBot) lastBot.classList.add('is-latest');
  const lastMessage = [...messages.querySelectorAll('.message')].pop();
  if (lastMessage) lastMessage.classList.add('is-last-message');
}

function syncConversationVisualState() {
  const hasUserMessage = (activeChat?.messages || []).some((entry) => entry.role === 'user');
  chatScreen.classList.toggle('has-user-message', hasUserMessage);
  return hasUserMessage;
}

let bottomBackgroundRevealEnabled = false;
let bottomRevealReturnFrame = null;
let bottomRevealReturnAnimating = false;

//*渐变遮盖罩层数值//
function setBottomMaskValues({ top = 1, mid1 = 1, mid2 = 1, mid3 = 1, hide = 49, m1 = 50, m2 = 51, m3 = 52, show = 53 } = {}) {
  const style = chatScreen.style;
  style.setProperty('--chat-mask-top', String(top));
  style.setProperty('--chat-mask-mid-1', String(mid1));
  style.setProperty('--chat-mask-mid-2', String(mid2));
  style.setProperty('--chat-mask-mid-3', String(mid3));
  style.setProperty('--chat-mask-hide', `${hide}%`);
  style.setProperty('--chat-mask-m1', `${m1}%`);
  style.setProperty('--chat-mask-m2', `${m2}%`);
  style.setProperty('--chat-mask-m3', `${m3}%`);
  style.setProperty('--chat-mask-show', `${show}%`);
}

// 到底时只裁切滚动聊天层：动画途中移动一条实边，结束后在53% 前保留 50px 渐变。
const REVEAL_KEYS = ['top', 'mid1', 'mid2', 'mid3', 'hide', 'm1', 'm2', 'm3', 'show'];
const REVEAL_FULL = { top: 1, mid1: 1, mid2: 1, mid3: 1, hide: 49, m1: 50, m2: 51, m3: 52, show: 53 };
const REVEAL_BOTTOM = { top: 0, mid1: 0, mid2: 0, mid3: 0, hide: 54, m1:54, m2: 54, m3: 54, show: 54 };
let revealAnimFrame = null;
let revealCurrent = { ...REVEAL_FULL };
let revealTargetKey = REVEAL_KEYS.map((k) => Math.round(revealCurrent[k] * 1000)).join('|');
let bottomChatExpanded = true;
let bottomCurtainActive = false;
let bottomColorRestoredByTap = false;
let bottomRevealAwayIntent = false;
let bottomBlurRevealPending = false;

function syncBottomFixedLayers() {
  const keyboardVisible = chatScreen.classList.contains('is-chat-keyboard-lift');
  chatScreen.classList.toggle(
    'is-bottom-color-hidden',
    bottomCurtainActive && !bottomColorRestoredByTap && !keyboardVisible,
  );
  // 原带色渐变已并入人物背景；这里控制独立暗层。模糊层须等聊天帘收完才恢复。
  chatScreen.classList.toggle(
    'is-bottom-blur-hidden',
    bottomCurtainActive || bottomBlurRevealPending || keyboardVisible,
  );
}

function restoreBottomColorLayer() {
  if (!bottomCurtainActive) return;
  bottomColorRestoredByTap = true;
  syncBottomFixedLayers();
}

function resetBottomFixedLayers() {
  bottomCurtainActive = false;
  bottomColorRestoredByTap = false;
  bottomRevealAwayIntent = false;
  bottomBlurRevealPending = false;
  syncBottomFixedLayers();
}

function tweenReveal(target, duration = 150, onComplete = null) {
  if (revealAnimFrame !== null) cancelAnimationFrame(revealAnimFrame);
  const start = { ...revealCurrent };
  const startIsFull = start.top >= 0.999 && start.mid1 >= 0.999 && start.mid2 >= 0.999 && start.mid3 >= 0.999;
  const targetIsFull = target.top >= 0.999 && target.mid1 >= 0.999 && target.mid2 >= 0.999 && target.mid3 >= 0.999;
  const startEdge = startIsFull ? 0 : start.show;
  const targetEdge = targetIsFull ? 0 : target.show;
  const startedAt = performance.now();
  const step = (now) => {
    const t = duration > 0 ? Math.min(1, (now - startedAt) / duration) : 1;
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOut
    const edge = startEdge + (targetEdge - startEdge) * e;
    // 补间过程四个透明度一致、五个位置重合，因此边缘始终是实线，不会出现柔化渐变。
    const cur = { top: 0, mid1: 0, mid2: 0, mid3: 0, hide: edge, m1: edge, m2: edge, m3: edge, show: edge };
    revealCurrent = cur;
    setBottomMaskValues({
      top: cur.top.toFixed(3), mid1: cur.mid1.toFixed(3), mid2: cur.mid2.toFixed(3), mid3: cur.mid3.toFixed(3),
      hide: Math.round(cur.hide), m1: Math.round(cur.m1), m2: Math.round(cur.m2), m3: Math.round(cur.m3), show: Math.round(cur.show),
    });
    if (t < 1) {
      revealAnimFrame = requestAnimationFrame(step);
    } else {
      revealAnimFrame = null;
      revealCurrent = { ...target };
      // 只在动画结束时写入精确目标；到底目标仍使用原来的短渐变带。
      setBottomMaskValues(target);
      if (typeof onComplete === 'function') onComplete();
    }
  };
  revealAnimFrame = requestAnimationFrame(step);
}

function resetRevealState() {
  if (revealAnimFrame !== null) {
    cancelAnimationFrame(revealAnimFrame);
    revealAnimFrame = null;
  }
  revealCurrent = { ...REVEAL_FULL };
  revealTargetKey = REVEAL_KEYS.map((k) => Math.round(revealCurrent[k] * 1000)).join('|');
  bottomChatExpanded = true;
}

function cancelBottomRevealReturn() {
  if (bottomRevealReturnFrame !== null) cancelAnimationFrame(bottomRevealReturnFrame);
  bottomRevealReturnFrame = null;
  bottomRevealReturnAnimating = false;
}

function hideBottomBackgroundReveal({ animate = false, duration = 300 } = {}) {
  bottomBackgroundRevealEnabled = false;
  cancelBottomRevealReturn();
  resetBottomFixedLayers();

  if (!animate || !chatScreen.classList.contains('is-at-bottom')) {
    chatScreen.classList.remove('is-at-bottom');
    chatScreen.classList.remove('is-background-reveal');
    setBottomMaskValues({ top: 1, mid1: 1, mid2: 1, mid3: 1 });
    resetRevealState();
    return;
  }

  const style = window.getComputedStyle(chatScreen);
  const starts = [
    Number.parseFloat(style.getPropertyValue('--chat-mask-top')) || 0,
    Number.parseFloat(style.getPropertyValue('--chat-mask-mid-1')) || 0.08,
    Number.parseFloat(style.getPropertyValue('--chat-mask-mid-2')) || 0.35,
    Number.parseFloat(style.getPropertyValue('--chat-mask-mid-3')) || 0.7,
  ];
  const animationDuration = Math.max(0, Number(duration) || 0);
  const startedAt = performance.now();
  bottomRevealReturnAnimating = true;

  const animateReturn = (now) => {
    const progress = animationDuration > 0 ? Math.min(1, (now - startedAt) / animationDuration) : 1;
    const eased = 1 - Math.pow(1 - progress, 3);
    const values = starts.map((value) => value + (1 - value) * eased);
    setBottomMaskValues({ top: values[0].toFixed(3), mid1: values[1].toFixed(3), mid2: values[2].toFixed(3), mid3: values[3].toFixed(3) });
    if (progress < 1) {
      bottomRevealReturnFrame = requestAnimationFrame(animateReturn);
      return;
    }
    bottomRevealReturnFrame = null;
    bottomRevealReturnAnimating = false;
    chatScreen.classList.remove('is-at-bottom');
    chatScreen.classList.remove('is-background-reveal');
    resetRevealState();
  };
  bottomRevealReturnFrame = requestAnimationFrame(animateReturn);
}

function updateScrollState() {
  const hasUserMessage = syncConversationVisualState();
  const remaining = messages.scrollHeight - messages.clientHeight - messages.scrollTop;
  const bottomThreshold = 10;
  const isAtBottom = isMessagesAtBottom(bottomThreshold);
  const hasScrollableHistory = messages.scrollHeight > messages.clientHeight + 6;
  // <=13px 拉下聊天帘，>=14px 真正查看旧聊天时收帘；中间 1px 用于防抖。
  const keyboardVisible = chatScreen.classList.contains('is-chat-keyboard-lift');
  const canRevealBottomBackground = bottomBackgroundRevealEnabled && !keyboardVisible;
  const canReveal = canRevealBottomBackground && hasUserMessage && hasScrollableHistory;
  let revealTarget = { ...REVEAL_FULL };
  if (canReveal) {
    if (remaining <= 13 && bottomChatExpanded) {
      bottomChatExpanded = false;
      bottomCurtainActive = true;
      bottomColorRestoredByTap = false;
      bottomBlurRevealPending = false;
    } else if (remaining >= 14 && !bottomChatExpanded && bottomRevealAwayIntent) {
      bottomChatExpanded = true;
      bottomCurtainActive = false;
      bottomColorRestoredByTap = false;
      bottomRevealAwayIntent = false;
      // 先补完整聊天层；模糊层继续隐藏，等待当前 190ms 蒙版动画结束。
      bottomBlurRevealPending = true;
    }
    revealTarget = bottomChatExpanded ? { ...REVEAL_FULL } : { ...REVEAL_BOTTOM };
  }
  syncBottomFixedLayers();
  if (!bottomRevealReturnAnimating) {
    chatScreen.classList.toggle('is-background-reveal', canReveal);
    const targetKey = REVEAL_KEYS.map((k) => Math.round(revealTarget[k] * 1000)).join('|');
    if (targetKey !== revealTargetKey) {
      revealTargetKey = targetKey;
      tweenReveal(revealTarget, 190, () => {//透明帘下拉与收回速度
        if (
          bottomChatExpanded
          && bottomBlurRevealPending
          && bottomBackgroundRevealEnabled
          && !chatScreen.classList.contains('is-chat-keyboard-lift')
        ) {
          bottomBlurRevealPending = false;
          syncBottomFixedLayers();//聊天层补完后，模糊层才开始 550ms 渐显。
        }
      });
    } else if (bottomChatExpanded && bottomBlurRevealPending && revealAnimFrame === null) {
      bottomBlurRevealPending = false;
      syncBottomFixedLayers();
    }
    chatScreen.classList.toggle('is-at-bottom', canReveal && isAtBottom);
  }
  chatScreen.classList.toggle('is-scrolled', messages.scrollTop > 22 && !isAtBottom);
  jumpButton.classList.toggle('is-visible', !isAtBottom && messages.scrollHeight > messages.clientHeight + 6);
}

/* 原生触摸惯性负责“快划快走、慢划慢走”；这里只补充上下边界的阻尼拉扯与回弹。 */
let overscrollTouchY = 0;
let overscrollOffset = 0;
let overscrollReboundTimer = null;
let SCROLL_GAIN = 0.7

function resetMessageOverscroll() {
  messages.classList.add('is-rebounding');
  messages.style.setProperty('--overscroll-y', '0px');
  overscrollOffset = 0;
  window.clearTimeout(overscrollReboundTimer);
  overscrollReboundTimer = window.setTimeout(() => {
    messages.classList.remove('is-rebounding');
    messages.classList.remove('is-overscrolling');
  }, 450);
}

messages.addEventListener('touchstart', (event) => {
  if (event.touches.length !== 1) return;
  cancelBottomScrollAnimation();
  window.clearTimeout(overscrollReboundTimer);
  messages.classList.remove('is-rebounding');
  messages.classList.remove('is-overscrolling');
  overscrollTouchY = event.touches[0].clientY;
  overscrollOffset = 0;
  messages.style.setProperty('--overscroll-y', '0px');
}, { passive: true });

messages.addEventListener('touchmove', (event) => {
  if (event.touches.length !== 1) return;
  const nextY = event.touches[0].clientY;
  const deltaY = nextY - overscrollTouchY;
  overscrollTouchY = nextY;
  // 手指向下拖动才是在查看旧消息，允许收帘并恢复带色层和模糊层。
  // 在最底手指向上推气泡只是底部拉扯，不算查看旧消息，蒙版保持原位。
  if (deltaY > 1 && bottomCurtainActive) bottomRevealAwayIntent = true;
  if (deltaY > 1 && messages.scrollTop <= 32 && renderedChatStartIndex > 0) chatHistoryLoadIntent = true;
  // 手指向上推动消息，即用户主动往最新回复方向滑动，才允许逐渐展示清晰背景。
  if (deltaY < -1) {
    cancelBottomRevealReturn();
    bottomBackgroundRevealEnabled = true;
  }
  const maxScrollTop = Math.max(0, messages.scrollHeight - messages.clientHeight);
  const pullingPastTop = messages.scrollTop <= 0.5 && deltaY > 0;
  const pullingPastBottom = messages.scrollTop >= maxScrollTop - 0.5 && deltaY < 0;

  if (!pullingPastTop && !pullingPastBottom) {
    if (overscrollOffset !== 0) resetMessageOverscroll();
    return;
  }

  // 聊天层橡皮筋，每一帧的手指位移直接参与计算：划得越快，边缘拉伸越明显；最大限制 422px。
  overscrollOffset = Math.max(-422, Math.min(422, overscrollOffset + deltaY * 0.95));
  messages.classList.add('is-overscrolling');
  messages.style.setProperty('--overscroll-y', `${overscrollOffset.toFixed(2)}px`);
}, { passive: true });

messages.addEventListener('touchend', () => {
  resetMessageOverscroll();
  if (chatHistoryLoadIntent && messages.scrollTop <= 2) loadEarlierChatMessages();
}, { passive: true });
messages.addEventListener('touchcancel', resetMessageOverscroll, { passive: true });
messages.addEventListener('wheel', (event) => {
  cancelBottomScrollAnimation();
  if (event.deltaY < 0 && bottomCurtainActive) bottomRevealAwayIntent = true;
  if (event.deltaY < 0 && messages.scrollTop <= 32 && renderedChatStartIndex > 0) {
    chatHistoryLoadIntent = true;
    if (messages.scrollTop <= 2) requestAnimationFrame(loadEarlierChatMessages);
  }
  if (event.deltaY > 0) {
    cancelBottomRevealReturn();
    bottomBackgroundRevealEnabled = true;
  }
}, { passive: true });

const generatedVoiceCache = new Map();
const VOICE_AUDIO_DB_NAME = 'xl_voice_audio_cache_v1';
const VOICE_AUDIO_STORE_NAME = 'audio';
// 整个 App 共用一个语音缓存池（不是每个角色各自计算），只保留最近 20 条。
const VOICE_AUDIO_CACHE_LIMIT = 20;
let persistentVoiceCacheDbPromise = null;

function rememberGeneratedVoice(key, result) {
  // Map 按插入顺序排列；重新使用的语音移到最后，优先保留最近使用的内容。
  generatedVoiceCache.delete(key);
  generatedVoiceCache.set(key, result);
  while (generatedVoiceCache.size > VOICE_AUDIO_CACHE_LIMIT) {
    const oldestKey = generatedVoiceCache.keys().next().value;
    generatedVoiceCache.delete(oldestKey);
  }
}

function openPersistentVoiceCache() {
  if (!('indexedDB' in window)) return Promise.resolve(null);
  if (persistentVoiceCacheDbPromise) return persistentVoiceCacheDbPromise;
  persistentVoiceCacheDbPromise = new Promise((resolve) => {
    const request = indexedDB.open(VOICE_AUDIO_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(VOICE_AUDIO_STORE_NAME)) {
        const store = db.createObjectStore(VOICE_AUDIO_STORE_NAME, { keyPath: 'key' });
        store.createIndex('savedAt', 'savedAt');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
    request.onblocked = () => resolve(null);
  });
  return persistentVoiceCacheDbPromise;
}

async function loadPersistentVoiceAudio(key) {
  const db = await openPersistentVoiceCache();
  if (!db) return null;
  return new Promise((resolve) => {
    const request = db.transaction(VOICE_AUDIO_STORE_NAME, 'readonly').objectStore(VOICE_AUDIO_STORE_NAME).get(key);
    request.onsuccess = () => {
      const entry = request.result;
      resolve(entry?.result?.dataUrl ? entry.result : null);
    };
    request.onerror = () => resolve(null);
  });
}

async function trimPersistentVoiceCache() {
  const db = await openPersistentVoiceCache();
  if (!db) return;
  const entries = await new Promise((resolve) => {
    const request = db.transaction(VOICE_AUDIO_STORE_NAME, 'readonly').objectStore(VOICE_AUDIO_STORE_NAME).getAll();
    request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result : []);
    request.onerror = () => resolve([]);
  });
  const expired = entries
    .sort((a, b) => Number(b.savedAt || 0) - Number(a.savedAt || 0))
    .slice(VOICE_AUDIO_CACHE_LIMIT);
  if (!expired.length) return;
  const transaction = db.transaction(VOICE_AUDIO_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(VOICE_AUDIO_STORE_NAME);
  expired.forEach((entry) => store.delete(entry.key));
}

async function savePersistentVoiceAudio(key, result) {
  const db = await openPersistentVoiceCache();
  if (!db || !result?.dataUrl) return;
  await new Promise((resolve) => {
    const transaction = db.transaction(VOICE_AUDIO_STORE_NAME, 'readwrite');
    transaction.objectStore(VOICE_AUDIO_STORE_NAME).put({ key, result, savedAt: Date.now() });
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => resolve();
    transaction.onabort = () => resolve();
  });
  trimPersistentVoiceCache().catch(() => {});
}

async function clearPersistentVoiceCache() {
  generatedVoiceCache.clear();
  const db = await openPersistentVoiceCache();
  if (!db) return;
  await new Promise((resolve) => {
    const transaction = db.transaction(VOICE_AUDIO_STORE_NAME, 'readwrite');
    transaction.objectStore(VOICE_AUDIO_STORE_NAME).clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => resolve();
    transaction.onabort = () => resolve();
  });
}

function symbolPairs(value) {
  return String(value || '').split(/\s+/).map((pair) => Array.from(pair)).filter((pair) => pair.length >= 2).map((pair) => [pair[0], pair[pair.length - 1]]);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractVoiceText(rawText) {
  let text = String(rawText || '');
  if (voiceReadSettings.extractQuoted) {
    const parts = [];
    symbolPairs(voiceReadSettings.quotePairs).forEach(([start, end]) => {
      const regex = new RegExp(`${escapeRegExp(start)}([\\s\\S]*?)${escapeRegExp(end)}`, 'g');
      for (const match of text.matchAll(regex)) parts.push(match[1]);
    });
    if (parts.length) text = parts.join('，');
  }
  if (voiceReadSettings.removeActions) {
    symbolPairs(voiceReadSettings.actionPairs).forEach(([start, end]) => {
      text = text.replace(new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`, 'g'), '');
    });
  }
  return text.replace(/\s+/g, ' ').trim().slice(0, voiceReadSettings.maxChars || 1000);
}

function voiceIdForPersona(personaId = '') {
  ensurePersonaVersions(currentRole);
  const persona = currentRole.personaVersions.find((item) => item.id === personaId) || activePersona(currentRole);
  return String(persona?.voiceId || '');
}

async function generateVoiceAudio(rawText, personaId = '', forceRefresh = false) {
  const text = extractVoiceText(rawText);
  if (!text) throw new Error('符号提取后没有可朗读的文字');
  const settings = collectVoiceApiSettingsForRequest();
  const voiceId = voiceIdForPersona(personaId);
  const engineSettings = settings[settings.engine] || {};
  const cacheKey = JSON.stringify({
    engine: settings.engine,
    endpoint: engineSettings.apiUrl || engineSettings.apiHost || '',
    model: engineSettings.model || '',
    voice: voiceId || engineSettings.voice || engineSettings.speaker || engineSettings.voiceId || '',
    text,
  });
  if (!forceRefresh && generatedVoiceCache.has(cacheKey)) return generatedVoiceCache.get(cacheKey);
  if (!forceRefresh) {
    const persisted = await loadPersistentVoiceAudio(cacheKey);
    if (persisted) {
      rememberGeneratedVoice(cacheKey, persisted);
      return persisted;
    }
  }
  let payload;
  if (isNativeApp() && settings.engine === 'siliconflow') {
    const sf = settings.siliconflow || {};
    const response = await nativeSiliconFlowRequest(sf, '/audio/speech', {
      method: 'POST',
      accept: 'audio/mpeg, audio/*, application/json',
      responseType: 'arraybuffer',
      data: {
        model: sf.model || 'FunAudioLLM/CosyVoice2-0.5B',
        input: text,
        voice: siliconFlowVoiceId(sf, voiceId),
        response_format: 'mp3',
        speed: 1,
        gain: 0,
      },
    });
    payload = { audio: response.data, mimeType: response.headers?.['content-type'] || 'audio/mpeg' };
  } else if (isNativeApp() && settings.engine === 'minimax') {
    payload = await nativeMinimaxSpeech(settings.minimax || {}, text, voiceId);
  } else if (isNativeApp() && settings.engine === 'moss') {
    payload = await nativeMossSpeech(settings.moss || {}, text, voiceId);
  } else {
    const response = await fetch('/api/generate-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settings, text, voiceId }),
    });
    payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.audio) throw new Error(payload.message || `语音生成失败（${response.status}）`);
  }
  if (!payload.audio) throw new Error('语音生成失败：未返回音频');
  const result = { dataUrl: `data:${payload.mimeType || 'audio/mpeg'};base64,${payload.audio}`, text };
  rememberGeneratedVoice(cacheKey, result);
  savePersistentVoiceAudio(cacheKey, result).catch(() => {});
  return result;
}

function collectVoiceApiSettingsForRequest() {
  return JSON.parse(JSON.stringify(voiceApiSettings));
}

let activeVoicePlayback = null;
let voicePlaybackRequestId = 0;

function setVoicePlaybackButtonState(button, isPlaying) {
  if (!button) return;
  button.classList.toggle('is-playing', isPlaying);
  button.setAttribute('aria-label', isPlaying ? '停止语音' : '播放语音');
}

function finishActiveVoicePlayback(player) {
  if (!activeVoicePlayback || activeVoicePlayback.player !== player) return;
  const { button } = activeVoicePlayback;
  activeVoicePlayback = null;
  setVoicePlaybackButtonState(button, false);
}

function stopActiveVoicePlayback() {
  const active = activeVoicePlayback;
  if (!active) return false;
  activeVoicePlayback = null;
  try {
    active.player.pause();
    active.player.currentTime = 0;
  } catch (_) {
    // 某些安卓 WebView 在音频尚未完全载入时不允许修改 currentTime。
  }
  setVoicePlaybackButtonState(active.button, false);
  return true;
}

async function playGeneratedVoice(text, button, personaId = '', forceRefresh = false) {
  const requestId = ++voicePlaybackRequestId;
  // 用户再次点击正在朗读的同一个气泡：立即停止，并把进度归零。
  // 强制刷新用于“重刷 AI 回复后的自动朗读”，不能被当成停止操作。
  if (!forceRefresh
    && activeVoicePlayback?.button === button
    && !activeVoicePlayback.player.paused
    && !activeVoicePlayback.player.ended) {
    stopActiveVoicePlayback();
    return;
  }

  // 同一时间只播放一条 AI 语音；切换气泡时先停止上一条。
  stopActiveVoicePlayback();
  if (button) button.disabled = true;
  try {
    const audio = await generateVoiceAudio(text, personaId, forceRefresh);
    // 等待 TTS 时若用户又点了另一条语音，旧请求完成后不能抢回来播放。
    if (requestId !== voicePlaybackRequestId) return;
    const player = new Audio(audio.dataUrl);
    activeVoicePlayback = { player, button, dataUrl: audio.dataUrl };
    setVoicePlaybackButtonState(button, true);
    player.addEventListener('ended', () => finishActiveVoicePlayback(player), { once: true });
    player.addEventListener('error', () => finishActiveVoicePlayback(player), { once: true });
    try {
      await player.play();
    } catch (error) {
      finishActiveVoicePlayback(player);
      throw error;
    }
  } catch (error) {
    showToast(error?.message || '语音播放失败');
  } finally {
    if (button) button.disabled = false;
  }
}

async function downloadGeneratedVoice(text, button, personaId = '') {
  if (button) button.disabled = true;
  try {
    const audio = await generateVoiceAudio(text, personaId);
    const link = document.createElement('a');
    link.href = audio.dataUrl;
    link.download = `${currentRole.name || 'AI回复'}-${Date.now()}.mp3`;
    link.click();
    showToast('语音已下载');
  } catch (error) {
    showToast(error?.message || '语音下载失败');
  } finally {
    if (button) button.disabled = false;
  }
}

function actionsTemplate({ isGreeting = false } = {}) {
  return `
    ${isGreeting ? '' : '<div class="choice" role="group" aria-label="切换重刷回复版本"><button type="button" class="choice-prev" aria-label="上一条"><span aria-hidden="true">〈</span></button><span class="choice-count" aria-hidden="true"></span><button type="button" class="choice-next" aria-label="下一条"><span aria-hidden="true">〉</span></button></div>'}
    ${isGreeting ? '' : '<button type="button" class="action-regenerate" aria-label="重刷回复"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg></button>'}
    <button type="button" class="action-copy" aria-label="复制回复"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect></svg></button>
    ${isGreeting ? '' : '<button type="button" class="action-dislike" aria-label="编辑回复"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg></button>'}
    <button type="button" class="action-voice-download" aria-label="下载语音"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button>
    <button type="button" class="action-voice" aria-label="播放语音"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg></button>
    <button type="button" class="action-share" aria-label="空图标"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg></button>
  `;
}

function refreshChoiceLabel(item) {
  const variants = item.replyVariants || [];
  const choice = item.querySelector('.choice');
  if (!choice) return;
  const shouldShow = variants.length > 1;
  choice.classList.toggle('is-visible', shouldShow);
  const count = choice.querySelector('.choice-count');
  if (count) count.textContent = shouldShow ? `${item.replyVariantIndex + 1}/${variants.length}` : '';
}

function bindMessageActions(item, messageEntry = null) {
  const textNode = item.querySelector('p');
  // 点击 AI 气泡本身展开/收起工具栏（点工具栏内按钮时不触发）
  item.addEventListener('click', (event) => {
    if (isSelectionMode) return;
    if (event.target.closest('.message-actions')) return;
    item.classList.toggle('is-active');
  });
  const storedVariants = messageEntry?.replyVariants;
  item.replyVariants = Array.isArray(storedVariants) && storedVariants.length
    ? [...storedVariants]
    : [textNode.textContent];
  item.replyVariantIndex = Math.max(0, Math.min(
    Number(messageEntry?.replyVariantIndex) || 0,
    item.replyVariants.length - 1,
  ));
  item.replyReasoningVariants = Array.isArray(messageEntry?.replyReasoningVariants)
    ? messageEntry.replyReasoningVariants.map((value) => String(value || ''))
    : [];
  while (item.replyReasoningVariants.length < item.replyVariants.length) item.replyReasoningVariants.push('');
  if (messageEntry?.reasoning) item.replyReasoningVariants[item.replyVariantIndex] = String(messageEntry.reasoning);
  textNode.textContent = item.replyVariants[item.replyVariantIndex] ?? textNode.textContent;
  renderBotReasoning(item, item.replyReasoningVariants[item.replyVariantIndex] || '');
  refreshChoiceLabel(item);

  let preparedVariantAnchor = null;
  const prepareVariantAnchor = () => {
    preparedVariantAnchor?.cancel();
    preparedVariantAnchor = createReplyToolbarAnchor(item, false);
  };
  const setReplyVariant = (delta) => {
    const len = item.replyVariants.length;
    if (len <= 1) return;
    // pointerdown 时已记录“按键前”的位置；键盘触发 click 时再现场补记。
    const toolbarAnchor = preparedVariantAnchor || createReplyToolbarAnchor(item, false);
    preparedVariantAnchor = null;
    item.replyVariantIndex = (item.replyVariantIndex + delta + len) % len;
    textNode.textContent = item.replyVariants[item.replyVariantIndex];
    const selectedReasoning = item.replyReasoningVariants[item.replyVariantIndex] || '';
    renderBotReasoning(item, selectedReasoning);
    const messageIndex = Number(item.dataset.index);
    if (!Number.isNaN(messageIndex) && activeChat?.messages?.[messageIndex]?.role === 'bot') {
      activeChat.messages[messageIndex].text = textNode.textContent;
      if (selectedReasoning) activeChat.messages[messageIndex].reasoning = selectedReasoning;
      else delete activeChat.messages[messageIndex].reasoning;
      if (activeChat.saveAllOptions === true || Array.isArray(activeChat.messages[messageIndex].replyVariants)) {
        activeChat.messages[messageIndex].replyVariants = [...item.replyVariants];
        activeChat.messages[messageIndex].replyReasoningVariants = [...item.replyReasoningVariants];
        activeChat.messages[messageIndex].replyVariantIndex = item.replyVariantIndex;
      }
      saveChatHistoriesToCache();
    }
    refreshChoiceLabel(item);
    toolbarAnchor.restore();
  };
  const previousChoiceButton = item.querySelector('.choice-prev');
  const nextChoiceButton = item.querySelector('.choice-next');
  [previousChoiceButton, nextChoiceButton].forEach((button) => {
    button?.addEventListener('pointerdown', prepareVariantAnchor);
  });
  previousChoiceButton?.addEventListener('click', (event) => { event.stopPropagation(); setReplyVariant(-1); });
  nextChoiceButton?.addEventListener('click', (event) => { event.stopPropagation(); setReplyVariant(1); });

  const regenerateButton = item.querySelector('.action-regenerate');
  regenerateButton?.addEventListener('click', () => {
    // 精确重刷当前 AI 气泡：只取它前面最近的用户消息，并排除当前旧回复及后续剧情。
    const botIndex = Number(item.dataset.index);
    if (Number.isNaN(botIndex) || botIndex < 0) { showToast('没有找到这条 AI 回复'); return; }
    let userIndex = botIndex - 1;
    while (userIndex >= 0 && activeChat.messages[userIndex]?.role !== 'user') userIndex -= 1;
    const targetUserMessage = activeChat.messages[userIndex];
    if (!targetUserMessage) { showToast('没有找到这条回复对应的用户消息'); return; }
    const historyBeforeTarget = activeChat.messages.slice(0, userIndex);
    // 按钮立即显示加载状态
    const btn = regenerateButton;
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.classList.add('is-loading');
    const rejectedCandidates = rejectedReplyAttempts(item.replyVariants, 15);
    const uniqueRejectedCount = uniqueRejectedReplies(item.replyVariants, Number.MAX_SAFE_INTEGER).length;
    const variationDirection = pickAntiRepeatDirection();
    const variationSalt = createAntiRepeatSalt();
    const bottomAnchor = createReplyToolbarAnchor(item);
    const originalReplyText = item.querySelector('p')?.textContent || '';
    const originalReasoning = item.replyReasoningVariants[item.replyVariantIndex] || '';
    callChatApi(targetUserMessage.text, historyBeforeTarget, {
      generationType: 'regenerate',
      onProgress: (progress) => updateBotStreamingPreview(item, progress),
      antiRepeat: {
        rejectedCandidates,
        rejectedAttemptCount: item.replyVariants.length,
        uniqueRejectedCount,
        direction: variationDirection,
        salt: variationSalt,
      },
    })
      .then((nextReply) => {
        item.classList.remove('is-streaming-preview', 'is-streaming-failed');
        // 防重复只改变本次请求内容，不做相似度拦截或自动重试；AI 返回什么就保存什么。
        item.replyVariants.push(nextReply);
        item.replyReasoningVariants.push(lastReplyReasoningText);
        item.replyVariantIndex = item.replyVariants.length - 1;
        item.querySelector('p').textContent = nextReply;
        renderBotReasoning(item, lastReplyReasoningText);
        activeChat.messages[botIndex].text = nextReply;
        activeChat.messages[botIndex].personaId = lastReplyPersonaId;
        if (lastReplyReasoningText) activeChat.messages[botIndex].reasoning = lastReplyReasoningText;
        else delete activeChat.messages[botIndex].reasoning;
        if (activeChat.saveAllOptions === true || Array.isArray(activeChat.messages[botIndex].replyVariants)) {
          activeChat.messages[botIndex].replyVariants = [...item.replyVariants];
          activeChat.messages[botIndex].replyReasoningVariants = [...item.replyReasoningVariants];
          activeChat.messages[botIndex].replyVariantIndex = item.replyVariantIndex;
        }
        saveChatHistoriesToCache();
        refreshChoiceLabel(item);
        bottomAnchor.restore();
        // 重刷相当于一次新的 AI 回复：开启自动朗读时，使用本次回复所属人设的音色
        // 强制重新请求 TTS，避免相同文本命中旧缓存而没有新的声音请求。
        if (voiceReadSettings.autoRead === true) {
          playGeneratedVoice(nextReply, item.querySelector('.action-voice'), lastReplyPersonaId, true);
        }
      })
      .catch((err) => {
        bottomAnchor.cancel();
        const paragraph = item.querySelector('p');
        if (paragraph) paragraph.textContent = originalReplyText;
        markBotStreamingPreviewFailed(item);
        renderBotReasoning(item, originalReasoning);
        showToast(err.message || '重刷失败，请检查 API 配置');
      })
      .finally(() => {
        btn.disabled = false;
        btn.style.opacity = '';
        btn.classList.remove('is-loading');
      });
  });

  item.querySelector('.action-copy').addEventListener('click', async () => {
    // 无需选择文字：始终复制当前 AI 气泡内的完整正文。
    const fullReplyText = textNode.textContent || '';
    const copied = await copyTextWithFallback(fullReplyText);
    showToast(copied ? '已复制整条回复' : '复制失败');
  });

  // 点踩图标保留外观，功能改为编辑这条 AI 回复
  item.querySelector('.action-dislike')?.addEventListener('click', () => startInlineEdit(item, 'bot'));

  item.querySelector('.action-voice').addEventListener('click', (event) => playGeneratedVoice(textNode.textContent, event.currentTarget, messageEntry?.personaId));
  item.querySelector('.action-voice-download').addEventListener('click', (event) => downloadGeneratedVoice(textNode.textContent, event.currentTarget, messageEntry?.personaId));

  // 最右侧图标仅保留占位外观，不绑定实际功能。
}

/* ===== 用户消息长按菜单 / 多选删除 / 编辑 ===== */
function bindUserMessageLongPress(item) {
  let startX = 0;
  let startY = 0;

  const start = (event) => {
    const touch = event.touches ? event.touches[0] : event;
    startX = touch.clientX;
    startY = touch.clientY;
    longPressTimer = setTimeout(() => {
      longPressTimer = null;
      const x = touch.clientX;
      const y = touch.clientY;
      showMessageContextMenu(item, x, y);
    }, 650);
  };

  const cancel = (event) => {
    if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
    if (!event.touches || !event.touches.length) return;
    const touch = event.touches[0];
    if (Math.abs(touch.clientX - startX) > 10 || Math.abs(touch.clientY - startY) > 10) {
      if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
    }
  };

  item.addEventListener('touchstart', start, { passive: true });
  item.addEventListener('touchend', () => { if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; } });
  item.addEventListener('touchmove', cancel, { passive: true });
  item.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    showMessageContextMenu(item, event.clientX, event.clientY);
  });
}

function showMessageContextMenu(item, x, y) {
  closeTransientActionMenus();
  if (item.classList.contains('is-editing')) return;
  const index = Number(item.dataset.index);
  if (Number.isNaN(index) || index < 0) return;

  const menu = document.createElement('div');
  menu.className = 'message-context-menu';
  menu.innerHTML = `
    <button type="button" data-action="copy">复制</button>
    <button type="button" data-action="delete">删除</button>
    <button type="button" data-action="edit">编辑</button>
    <button type="button" data-action="resend">重发</button>
  `;
  document.body.append(menu);
  messageContextMenu = menu;

  menu.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const menuRect = menu.getBoundingClientRect();
      const deleteMenuAnchor = { left: menuRect.left, top: menuRect.top };
      hideMessageContextMenu();
      if (action === 'copy') copyMessageText(item);
      else if (action === 'delete') enterSelectionMode(deleteMenuAnchor);
      else if (action === 'edit') startInlineEdit(item, 'user');
      else if (action === 'resend') resendUserMessage(item);
    });
  });

  registerTransientActionMenu('message-context', {
    menu,
    anchor: pointTransientAnchor(x, y),
    owner: chatScreen,
    close: hideMessageContextMenu,
    align: 'center',
    width: menu.offsetWidth || 176,
  });
}

function hideMessageContextMenu() {
  if (messageContextMenu) {
    messageContextMenu.remove();
    messageContextMenu = null;
  }
  unregisterTransientActionMenu('message-context');
}

async function copyMessageText(item) {
  // 无需选择文字：始终复制当前用户气泡里的完整正文。
  const text = item.querySelector('p')?.textContent || '';
  const copied = await copyTextWithFallback(text);
  showToast(copied ? '已复制整条用户消息' : '复制失败');
}

let isChatRequestPending = false;

function createBotStreamingPreview() {
  const item = document.createElement('article');
  item.className = 'message bot is-streaming-preview';
  const paragraph = document.createElement('p');
  paragraph.textContent = '';
  item.append(paragraph);
  messages.append(item);
  scrollToBottom({ animate: false });
  return item;
}

function updateBotStreamingPreview(item, progress = {}) {
  if (!item?.isConnected) return;
  const wasAtBottom = isMessagesAtBottom(80);
  const answer = String(progress.text || '');
  const reasoning = String(progress.reasoning || '');
  if (reasoning) renderBotReasoning(item, reasoning, { streaming: true });
  const paragraph = item.querySelector('p');
  if (paragraph && answer) paragraph.textContent = answer;
  else if (paragraph && reasoning) paragraph.textContent = '正在思考，正文尚未开始…';
  if (wasAtBottom) scrollToBottom({ animate: false });
}

function markBotStreamingPreviewFailed(item) {
  if (!item?.isConnected) return;
  item.classList.remove('is-streaming-preview');
  item.classList.add('is-streaming-failed');
  const reasoning = item.querySelector('.stream-reasoning-content')?.textContent || '';
  if (reasoning) renderBotReasoning(item, reasoning, { interrupted: true });
  // 兜底：请求失败时若气泡里还没有任何正文（含等待态的空气泡），直接移除，不留空壳。
  const paragraph = item.querySelector('p');
  if (!paragraph?.textContent.trim()) item.remove();
}

function setChatRequestPending(pending) {
  isChatRequestPending = pending;
  input.disabled = pending;
  voiceInputButton.disabled = pending;
  voiceInputButton.style.opacity = pending ? '0.5' : '';
  input.placeholder = pending ? '思考中...' : '有问题，尽管问';
  if (!pending) input.focus();
}

function requestAiReply(text, historyMessages = activeChat?.messages || []) {
  if (isChatRequestPending) {
    showToast('上一条回复仍在思考中');
    return Promise.resolve(false);
  }
  setChatRequestPending(true);
  // 请求一发出就给用户明确反馈；收到 SSE 后在同一气泡里逐段更新。
  let streamingPreview = createBotStreamingPreview();
  return callChatApi(text, historyMessages, {
    onProgress: (progress) => {
      updateBotStreamingPreview(streamingPreview, progress);
    },
  })
    .then((reply) => {
      streamingPreview?.remove();
      addMessage('bot', reply, true, true, lastReplyPersonaId, lastReplyReasoningText);
      return true;
    })
    .catch((err) => {
      markBotStreamingPreviewFailed(streamingPreview);
      showToast(err.message || 'API 调用失败，请检查配置');
      logRuntime('error', 'chat', 'API 回复失败', { error: err.message, roleId: currentRole.id });
      return false;
    })
    .finally(() => setChatRequestPending(false));
}

function requestImpersonatedReply(inputDraft = '') {
  if (isChatRequestPending) {
    showToast('上一条回复仍在思考中');
    return Promise.resolve(false);
  }
  closeInputContextMenu();
  setChatRequestPending(true);
  showToast('正在帮你组织回复…');
  return callChatApi(inputDraft, activeChat?.messages || [], { generationType: 'impersonate', inputDraft })
    .then((reply) => {
      input.value = reply;
      autoResize();
      updateSendButton();
      input.focus();
      showToast('帮答已写入输入框，可修改后发送');
      return true;
    })
    .catch((err) => {
      showToast(err.message || '帮答失败，请检查 API 配置');
      logRuntime('error', 'chat', '帮答失败', { error: err.message, roleId: currentRole.id });
      return false;
    })
    .finally(() => setChatRequestPending(false));
}

function resendUserMessage(item) {
  const index = Number(item.dataset.index);
  const entry = activeChat?.messages?.[index];
  if (Number.isNaN(index) || index < 0 || entry?.role !== 'user') return;
  if (isChatRequestPending) {
    showToast('上一条回复仍在思考中');
    return;
  }

  // 从这条用户消息重新分叉：保留它及之前的上下文，移除其后的旧回复。
  const messagesBeforeResend = activeChat.messages.slice();
  activeChat.messages = activeChat.messages.slice(0, index + 1);
  loadChatHistory(activeChat, { silent: true });
  saveChatHistoriesToCache();
  logRuntime('info', 'chat', '重新发送用户消息', { text: entry.text, roleId: currentRole.id, chatId: activeChat.id });
  requestAiReply(entry.text, activeChat.messages.slice(0, -1)).then((succeeded) => {
    if (succeeded) return;
    activeChat.messages = messagesBeforeResend;
    loadChatHistory(activeChat, { silent: true });
    saveChatHistoriesToCache();
  });
}

/* 在气泡内就地编辑：只更新当前消息，后续对话全部保留。 */
function startInlineEdit(item, role) {
  const index = Number(item.dataset.index);
  if (Number.isNaN(index) || index < 0 || !activeChat) return;
  if (item.classList.contains('is-editing')) return;
  const paragraph = item.querySelector('p');
  if (!paragraph) return;
  const original = activeChat.messages[index]?.text ?? paragraph.textContent;
  const originalTextHeight = paragraph.getBoundingClientRect().height;
  const originalBubbleWidth = item.getBoundingClientRect().width;
  const originalInlineWidth = item.style.width;

  item.classList.add('is-editing');
  // 用户气泡依内容自适应；替换成 textarea 后会被浏览器重新缩窄，因此编辑期间锁定原宽度。
  item.style.width = `${originalBubbleWidth}px`;
  item.querySelector('.message-actions')?.style.setProperty('display', 'none');

  const editor = document.createElement('textarea');
  editor.className = 'inline-edit-area';
  editor.value = original;
  editor.rows = 1;
  editor.setAttribute('aria-label', role === 'user' ? '编辑用户气泡' : '编辑 AI 气泡');
  paragraph.replaceWith(editor);
  const resizeEditor = () => {
    editor.style.height = 'auto';
    editor.style.height = `${Math.max(originalTextHeight, editor.scrollHeight)}px`;
  };
  resizeEditor();
  editor.focus();
  editor.setSelectionRange(editor.value.length, editor.value.length);

  const bar = document.createElement('div');
  bar.className = 'inline-edit-bar';
  bar.innerHTML = `
    <button type="button" class="inline-edit-cancel">取消</button>
    <button type="button" class="inline-edit-save">保存</button>
  `;
  item.append(bar);

  const finish = (save) => {
    item.classList.remove('is-editing');
    item.style.width = originalInlineWidth;
    bar.remove();
    item.querySelector('.message-actions')?.style.removeProperty('display');
    const restored = paragraph;
    if (!save) {
      editor.replaceWith(restored);
      restored.textContent = original;
      return;
    }
    const next = editor.value;
    if (next === original) {
      editor.replaceWith(restored);
      restored.textContent = original;
      return;
    }
    activeChat.messages[index].text = next;
    if (role === 'bot' && Array.isArray(item.replyVariants) && item.replyVariants.length) {
      const selectedIndex = Math.max(0, Math.min(Number(item.replyVariantIndex) || 0, item.replyVariants.length - 1));
      item.replyVariants[selectedIndex] = next;
      if (Array.isArray(activeChat.messages[index].replyVariants)) {
        activeChat.messages[index].replyVariants[selectedIndex] = next;
        activeChat.messages[index].replyVariantIndex = selectedIndex;
      }
    }
    restored.textContent = next;
    editor.replaceWith(restored);
    saveChatHistoriesToCache();
    showToast(role === 'user' ? '已更新，后续回复已保留' : '已更新');
  };

  bar.querySelector('.inline-edit-cancel').addEventListener('click', () => finish(false));
  bar.querySelector('.inline-edit-save').addEventListener('click', () => finish(true));
  editor.addEventListener('input', resizeEditor);
  editor.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.preventDefault(); finish(false); }
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) { event.preventDefault(); finish(true); }
  });
}

function ensureSelectionToolbar() {
  if (selectionToolbar) return selectionToolbar;
  const bar = document.createElement('div');
  bar.className = 'selection-toolbar';
  bar.innerHTML = `
    <span class="sel-count">已选择 0 条</span>
    <div class="sel-actions">
      <button type="button" class="sel-cancel">取消</button>
      <button type="button" class="sel-delete" disabled>删除</button>
    </div>
  `;
  document.body.append(bar);
  bar.querySelector('.sel-cancel').addEventListener('click', exitSelectionMode);
  bar.querySelector('.sel-delete').addEventListener('click', deleteSelectedMessages);
  selectionToolbar = bar;
  return bar;
}

function positionSelectionToolbar(anchor = selectionToolbarAnchor) {
  if (!selectionToolbar) return;
  const rect = selectionToolbar.getBoundingClientRect();
  const gap = 8;
  const fallback = { left: window.innerWidth - rect.width - 16, top: 88 };
  const source = anchor || fallback;
  const left = Math.min(Math.max(Number(source.left) || fallback.left, gap), window.innerWidth - rect.width - gap);
  const top = Math.min(Math.max(Number(source.top) || fallback.top, gap), window.innerHeight - rect.height - gap);
  selectionToolbar.style.left = `${left}px`;
  selectionToolbar.style.top = `${top}px`;
}

function alignSelectionCheckboxes() {
  if (!isSelectionMode) return;
  const messagesRect = messages.getBoundingClientRect();
  const sharedLeft = messagesRect.left + 14;
  messages.querySelectorAll('.message').forEach((item) => {
    const itemRect = item.getBoundingClientRect();
    item.style.setProperty('--selection-checkbox-left', `${sharedLeft - itemRect.left}px`);
  });
}

function enterSelectionMode(anchor = null) {
  if (isSelectionMode) return;
  isSelectionMode = true;
  selectionToolbarAnchor = anchor;
  selectedMessageIndices.clear();
  messages.classList.add('is-selecting');
  ensureSelectionToolbar().classList.add('is-visible');
  positionSelectionToolbar(anchor);
  updateSelectionToolbar();
  requestAnimationFrame(alignSelectionCheckboxes);

  messages.querySelectorAll('.message').forEach((el) => {
    el.addEventListener('click', onMessageSelectClick);
  });
}

function exitSelectionMode() {
  if (!isSelectionMode) return;
  isSelectionMode = false;
  selectionToolbarAnchor = null;
  selectedMessageIndices.clear();
  messages.classList.remove('is-selecting');
  messages.querySelectorAll('.message').forEach((el) => {
    el.classList.remove('is-selected');
    el.style.removeProperty('--selection-checkbox-left');
    el.removeEventListener('click', onMessageSelectClick);
  });
  if (selectionToolbar) selectionToolbar.classList.remove('is-visible');
}

window.addEventListener('resize', () => {
  if (!isSelectionMode) return;
  positionSelectionToolbar();
  requestAnimationFrame(alignSelectionCheckboxes);
});

function onMessageSelectClick(event) {
  // 点击操作按钮时不切换选中
  if (event.target.closest('.message-actions')) return;
  const item = event.currentTarget;
  toggleMessageSelection(item);
}

function toggleMessageSelection(item) {
  const index = Number(item.dataset.index);
  if (Number.isNaN(index) || index < 0) return;
  if (selectedMessageIndices.has(index)) {
    selectedMessageIndices.delete(index);
    item.classList.remove('is-selected');
  } else {
    selectedMessageIndices.add(index);
    item.classList.add('is-selected');
  }
  updateSelectionToolbar();
}

function updateSelectionToolbar() {
  if (!selectionToolbar) return;
  const count = selectedMessageIndices.size;
  selectionToolbar.querySelector('.sel-count').textContent = `已选择 ${count} 条`;
  selectionToolbar.querySelector('.sel-delete').disabled = count === 0;
  positionSelectionToolbar();
}

function deleteSelectedMessages() {
  if (!activeChat || selectedMessageIndices.size === 0) return;
  const indices = Array.from(selectedMessageIndices).sort((a, b) => b - a);
  indices.forEach((i) => activeChat.messages.splice(i, 1));
  exitSelectionMode();
  loadChatHistory(activeChat);
  saveChatHistoriesToCache();
  showToast('已删除所选对话');
}

function addMessage(role, text, withActions = false, persist = true, personaId = '', reasoning = '') {
  // 自动新增并滚到底部不应主动展示半屏背景。
  hideBottomBackgroundReveal();
  // 发送新消息时自动退出多选模式
  if (isSelectionMode && role === 'user') exitSelectionMode();

  const item = document.createElement('article');
  item.className = `message ${role}`;

  const checkbox = document.createElement('span');
  checkbox.className = 'msg-checkbox';
  checkbox.setAttribute('aria-hidden', 'true');
  item.append(checkbox);

  const normalizedText = role === 'bot' ? String(text || '').trim() : text;
  const paragraph = document.createElement('p');
  paragraph.textContent = normalizedText;
  item.append(paragraph);

  if (withActions) {
    if (role === 'bot') renderBotReasoning(item, reasoning);
    const tools = document.createElement('div');
    tools.className = 'message-actions';
    tools.innerHTML = actionsTemplate();
    item.append(tools);
    bindMessageActions(item, { personaId, reasoning });
  } else if (role === 'user') {
    bindUserMessageLongPress(item);
  }

  messages.append(item);
  if (isSelectionMode && item.dataset.index) item.addEventListener('click', onMessageSelectClick);
  if (persist && activeChat) {
    activeChat.messages.push({
      role,
      name: role === 'user' ? activeChat.userName : activeChat.characterName,
      text: normalizedText,
      sendDate: new Date().toISOString(),
      ...(role === 'bot' && personaId ? { personaId } : {}),
      ...(role === 'bot' && reasoning ? { reasoning: String(reasoning).trim() } : {}),
    });
    activeChat.lastActiveAt = new Date().toISOString();
    item.dataset.index = String(activeChat.messages.length - 1);
    if (role === 'bot') {
      updateHeroLastReplyTime(activeChat);
      renderChatTimestamp(activeChat);
      maybeAutoSummarizeChat(activeChat);
    }
    saveChatHistoriesToCache();
    renderHistory();
    updateChatHistoryLoader();
  }
  updateLatestBotMessage();
  syncConversationVisualState();
  scrollToBottom();
  updateScrollState();
  if (role === 'bot' && voiceReadSettings.autoRead === true) playGeneratedVoice(normalizedText, item.querySelector('.action-voice'), personaId);
}

function autoResize() {
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 124)}px`;
}

let activeRecognition = null;

function stopVoiceInput() {
  const recognition = activeRecognition;
  activeRecognition = null;
  // 不等待部分手机浏览器不可靠的 onend，立即恢复普通输入/发送状态。
  voiceInputButton.classList.remove('is-listening');
  updateSendButton();
  if (!recognition) return;
  try {
    // abort 会立即释放麦克风；不支持时再退回 stop。
    if (typeof recognition.abort === 'function') recognition.abort();
    else recognition.stop();
  } catch {}
}

function startVoiceInput() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    showToast('语音输入需要在安卓或 iPhone 浏览器里测试');
    return;
  }
  const recognition = new Recognition();
  recognition.lang = 'zh-CN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  activeRecognition = recognition;
  voiceInputButton.classList.add('is-listening');
  recognition.onresult = (event) => {
    input.value = `${input.value}${event.results[0][0].transcript}`;
    autoResize();
    updateSendButton();
    stopVoiceInput();
  };
  recognition.onerror = (event) => {
    // 主动关闭时通常会收到 aborted，不需要再提示识别失败。
    if (event.error !== 'aborted') showToast('没有识别到语音，请再试一次');
    if (activeRecognition === recognition) stopVoiceInput();
  };
  recognition.onend = () => {
    if (activeRecognition === recognition) {
      activeRecognition = null;
      voiceInputButton.classList.remove('is-listening');
      updateSendButton();
    }
  };
  try {
    recognition.start();
  } catch {
    stopVoiceInput();
    showToast('语音输入启动失败，请检查麦克风权限');
  }
}

composer.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addMessage('user', text);
  input.value = '';
  autoResize();
  updateSendButton();
  logRuntime('info', 'chat', '用户发送消息', { text, roleId: currentRole.id, chatId: activeChat.id });

  // 调用 API 获取回复（不再使用后备回复）
  requestAiReply(text, activeChat.messages.slice(0, -1));
});

function updateSendButton() {
  const hasText = input.value.trim().length > 0;
  voiceInputButton.classList.toggle('is-send', hasText);
  voiceInputButton.setAttribute('aria-label', hasText ? '发送' : '语音输入');
}

voiceInputButton.addEventListener('click', () => {
  if (voiceInputButton.classList.contains('is-listening')) {
    stopVoiceInput();
  } else if (voiceInputButton.classList.contains('is-send')) {
    composer.dispatchEvent(new Event('submit', { cancelable: true }));
  } else {
    startVoiceInput();
  }
});

let chatInputFocused = false;
let chatInputWasAtBottom = false;
let chatKeyboardBaselineHeight = 0;
let nativeImeHeight = 0;
let nativeImeTop = 0;
let chatUsesNativeImeFallback = false;
let chatKeyboardRevealSuspended = false;
let chatKeyboardShouldRestoreReveal = false;

function currentViewportBottom() {
  const viewport = window.visualViewport;
  if (!viewport) return window.innerHeight || document.documentElement.clientHeight || 0;
  return viewport.height + viewport.offsetTop;
}

function measureChatKeyboardShift() {
  chatUsesNativeImeFallback = false;
  if (!chatInputFocused) return 0;
  if (!chatKeyboardBaselineHeight) {
    chatKeyboardBaselineHeight = Math.max(window.innerHeight || 0, currentViewportBottom());
  }
  const visualViewportShift = Math.max(0, chatKeyboardBaselineHeight - currentViewportBottom());
  // 不再用“键盘总高度”直接抬输入栏。部分手机已经由系统完成 adjustResize，
  // 但 visualViewport 没有报告变化；若再抬一次就会跳到屏幕中间。
  // 现在只补偿输入栏实际侵入键盘区域的那一小段距离。
  // 使用未受 CSS translate 影响的布局底边，避免兜底生效后下一次测量又变成 0 而来回跳动。
  const composerBottom = chatScreen.getBoundingClientRect().top + composer.offsetTop + composer.offsetHeight;
  const nativeOverlap = nativeImeHeight > 24 && nativeImeTop > 0
    ? Math.max(0, Math.round(composerBottom - nativeImeTop))
    : 0;
  chatUsesNativeImeFallback = nativeOverlap > 8;
  const rawShift = chatUsesNativeImeFallback ? nativeOverlap : visualViewportShift;
  const maxShift = Math.max(0, Math.round((chatScreen.clientHeight || window.innerHeight || 0) * 0.62));
  return Math.max(0, Math.min(maxShift, Math.round(rawShift)));
}

function applyChatKeyboardLift() {
  const shift = measureChatKeyboardShift();
  const keyboardVisible = chatInputFocused && (nativeImeHeight > 24 || shift > 24);
  chatScreen.style.setProperty('--chat-keyboard-shift', `${shift}px`);
  chatScreen.classList.toggle('is-chat-keyboard-lift', keyboardVisible);
  chatScreen.classList.toggle('is-chat-keyboard-native-fallback', keyboardVisible && chatUsesNativeImeFallback);
  chatScreen.classList.toggle('is-chat-keyboard-follow-bottom', keyboardVisible && chatInputWasAtBottom);
  if (keyboardVisible) {
    if (!chatKeyboardRevealSuspended) {
      chatKeyboardRevealSuspended = true;
      // 键盘状态下完整显示聊天层并恢复带色层；模糊层保持关闭。
      restoreBottomColorLayer();
      syncBottomFixedLayers();
      updateScrollState();
    }
    if (chatInputWasAtBottom) {
      requestAnimationFrame(() => {
        // 键盘状态直接保持最底，不播放自动滑动动画。
        messages.scrollTop = messages.scrollHeight;
        updateScrollState();
      });
    }
  }
}

function clearChatKeyboardLift() {
  const restoreBottomReveal = chatKeyboardShouldRestoreReveal && isMessagesAtBottom(10);
  chatInputFocused = false;
  chatInputWasAtBottom = false;
  chatKeyboardRevealSuspended = false;
  chatKeyboardShouldRestoreReveal = false;
  chatKeyboardBaselineHeight = Math.max(window.innerHeight || 0, currentViewportBottom());
  chatUsesNativeImeFallback = false;
  chatScreen.classList.remove('is-chat-keyboard-lift', 'is-chat-keyboard-native-fallback', 'is-chat-keyboard-follow-bottom');
  chatScreen.style.setProperty('--chat-keyboard-shift', '0px');
  if (restoreBottomReveal) bottomBackgroundRevealEnabled = true;
  updateScrollState();
}

function refreshChatKeyboardBaselineOrLift() {
  if (chatInputFocused) {
    applyChatKeyboardLift();
    return;
  }
  chatKeyboardBaselineHeight = Math.max(window.innerHeight || 0, currentViewportBottom());
}

chatKeyboardBaselineHeight = Math.max(window.innerHeight || 0, currentViewportBottom());

input.addEventListener('focus', () => {
  chatInputFocused = true;
  chatInputWasAtBottom = isMessagesAtBottom(10);
  chatKeyboardRevealSuspended = false;
  chatKeyboardShouldRestoreReveal = chatInputWasAtBottom && (
    bottomBackgroundRevealEnabled || chatScreen.classList.contains('is-background-reveal')
  );
  chatKeyboardBaselineHeight = Math.max(chatKeyboardBaselineHeight, window.innerHeight || 0, currentViewportBottom());
  applyChatKeyboardLift();
  window.setTimeout(applyChatKeyboardLift, 80);
  window.setTimeout(applyChatKeyboardLift, 220);
});

input.addEventListener('blur', () => {
  window.setTimeout(clearChatKeyboardLift, 120);
});

window.visualViewport?.addEventListener('resize', refreshChatKeyboardBaselineOrLift);
window.visualViewport?.addEventListener('scroll', refreshChatKeyboardBaselineOrLift);
window.addEventListener('resize', refreshChatKeyboardBaselineOrLift);
window.addEventListener('xiangsi:native-ime', (event) => {
  const reportedHeight = Number(event?.detail?.height);
  const reportedTop = Number(event?.detail?.top);
  nativeImeHeight = Number.isFinite(reportedHeight) ? Math.max(0, Math.round(reportedHeight)) : 0;
  nativeImeTop = Number.isFinite(reportedTop) ? Math.max(0, Math.round(reportedTop)) : 0;
  refreshChatKeyboardBaselineOrLift();
});

input.addEventListener('input', () => {
  // 用户开始手动修改文字时，语音摄取立即让位给文字输入和发送按钮。
  if (activeRecognition || voiceInputButton.classList.contains('is-listening')) stopVoiceInput();
  autoResize();
  updateSendButton();
});

// 即使输入框原本已经处于焦点，重新点按它也会马上关闭语音摄取。
input.addEventListener('pointerdown', () => {
  if (activeRecognition || voiceInputButton.classList.contains('is-listening')) stopVoiceInput();
  restoreBottomColorLayer();
  // 离开最底后点击输入框，仍沿用普通状态复位逻辑。
  if (!isMessagesAtBottom(10)) hideBottomBackgroundReveal({ animate: true });
});

let inputLongPressTimer = null;
let inputTouchX = 0;
let inputTouchY = 0;
let inputTouchActive = false;
let inputLongPressReady = false;

function openInputContextMenu(clientX, clientY) {
  if (!inputContextMenu) return;
  if (inputContextMenu.classList.contains('is-open')) {
    closeInputContextMenu();
    return;
  }
  closeTransientActionMenus();
  inputContextMenu.style.visibility = 'hidden';
  inputContextMenu.classList.add('is-open');
  inputContextMenu.setAttribute('aria-hidden', 'false');
  const fallbackRect = input.getBoundingClientRect();
  const x = Number.isFinite(clientX) ? clientX : fallbackRect.left + fallbackRect.width / 2;
  const y = Number.isFinite(clientY) ? clientY : fallbackRect.top + fallbackRect.height / 2;
  registerTransientActionMenu('input-context', {
    menu: inputContextMenu,
    anchor: pointTransientAnchor(x, y),
    owner: chatScreen,
    close: closeInputContextMenu,
    align: 'center',
    width: inputContextMenu.offsetWidth || 260,
    height: inputContextMenu.offsetHeight || 42,
  });
  inputContextMenu.style.visibility = '';
}

function closeInputContextMenu() {
  if (!inputContextMenu) return;
  inputContextMenu.classList.remove('is-open');
  inputContextMenu.setAttribute('aria-hidden', 'true');
  unregisterTransientActionMenu('input-context');
}

function cancelInputLongPress() {
  window.clearTimeout(inputLongPressTimer);
  inputLongPressTimer = null;
}

input.addEventListener('touchstart', (event) => {
  const touch = event.touches[0];
  if (!touch) return;
  inputTouchX = touch.clientX;
  inputTouchY = touch.clientY;
  inputTouchActive = true;
  inputLongPressReady = false;
  cancelInputLongPress();
  // 按住期间不弹菜单，让系统放大镜和文字光标可以正常移动；只记录已达到长按时长。
  inputLongPressTimer = window.setTimeout(() => { inputLongPressReady = true; }, 520);
}, { passive: true });

input.addEventListener('touchmove', (event) => {
  const touch = event.touches[0];
  if (!touch) return;
  // 跟随手指保存最终落点，但不阻止浏览器的放大镜和插入光标拖动。
  inputTouchX = touch.clientX;
  inputTouchY = touch.clientY;
}, { passive: true });

input.addEventListener('touchend', (event) => {
  const touch = event.changedTouches[0];
  if (touch) {
    inputTouchX = touch.clientX;
    inputTouchY = touch.clientY;
  }
  const shouldOpen = inputLongPressReady;
  cancelInputLongPress();
  inputTouchActive = false;
  inputLongPressReady = false;
  if (shouldOpen) window.setTimeout(() => openInputContextMenu(inputTouchX, inputTouchY), 0);
}, { passive: true });
input.addEventListener('touchcancel', () => {
  cancelInputLongPress();
  inputTouchActive = false;
  inputLongPressReady = false;
}, { passive: true });
input.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  if (inputTouchActive) {
    // 移动端 contextmenu 通常在手指仍按住时触发；延后到 touchend 再展示自定义菜单。
    inputLongPressReady = true;
    inputTouchX = event.clientX || inputTouchX;
    inputTouchY = event.clientY || inputTouchY;
    return;
  }
  openInputContextMenu(event.clientX, event.clientY);
});

function insertTextAtInputSelection(text) {
  const start = input.selectionStart;
  const end = input.selectionEnd;
  input.setRangeText(text, start, end, 'end');
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.focus();
}

async function copyTextWithFallback(text) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(text);
    return true;
  } catch (_) {
    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', '');
    helper.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.append(helper);
    helper.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
    helper.remove();
    input.focus();
    return copied;
  }
}

pasteInputTextButton?.addEventListener('click', async () => {
  closeInputContextMenu();
  try {
    if (!navigator.clipboard?.readText) throw new Error('Clipboard API unavailable');
    const text = await navigator.clipboard.readText();
    if (!text) {
      showToast('剪贴板里没有文字');
      return;
    }
    insertTextAtInputSelection(text);
  } catch (_) {
    const text = window.prompt('浏览器未允许自动读取剪贴板，请在这里粘贴：', '');
    if (text !== null && text !== '') insertTextAtInputSelection(text);
  }
});

copyInputTextButton?.addEventListener('click', async () => {
  const selected = input.value.slice(input.selectionStart, input.selectionEnd);
  const text = selected || input.value;
  if (!text) {
    showToast('输入框里还没有文字');
    closeInputContextMenu();
    return;
  }
  const copied = await copyTextWithFallback(text);
  showToast(copied ? '已复制' : '复制失败，请先选择文字后使用系统复制');
  closeInputContextMenu();
});

insertInputLineBreakButton?.addEventListener('click', () => {
  closeInputContextMenu();
  insertTextAtInputSelection('\n');
});

impersonateInputReplyButton?.addEventListener('click', () => {
  closeInputContextMenu();
  requestImpersonatedReply(input.value);
});

document.addEventListener('pointerdown', (event) => {
  if (!inputContextMenu?.classList.contains('is-open')) return;
  if (inputContextMenu.contains(event.target) || event.target === input) return;
  closeInputContextMenu();
});

function chatToJsonl(chat) {
  const lines = [
    JSON.stringify({
      user_name: chat.userName,
      character_name: chat.characterName,
      chat_metadata: {
        imported_from: chat.source || 'yuanbao-clone',
        exported_at: new Date().toISOString(),
        save_all_options: chat.saveAllOptions === true,
      },
    }),
    ...chat.messages.map((entry) => {
      const exported = {
        name: entry.name || (entry.role === 'user' ? chat.userName : chat.characterName),
        is_user: entry.role === 'user',
        is_system: false,
        send_date: entry.sendDate || new Date().toISOString(),
        mes: entry.text,
        extra: {
          source: 'yuanbao-clone',
          ...(entry.role === 'bot' && entry.reasoning ? { reasoning: entry.reasoning } : {}),
        },
      };
      if (chat.saveAllOptions === true && entry.role === 'bot' && entry.replyVariants?.length > 1) {
        exported.swipes = [...entry.replyVariants];
        exported.swipe_id = Math.max(0, Math.min(Number(entry.replyVariantIndex) || 0, exported.swipes.length - 1));
        if (Array.isArray(entry.replyReasoningVariants) && entry.replyReasoningVariants.some(Boolean)) {
          exported.swipe_reasoning = [...entry.replyReasoningVariants];
        }
      }
      return JSON.stringify(exported);
    }),
  ];
  return `${lines.join('\n')}\n`;
}

function exportSelectedChat() {
  if (!selectedHistory) return;
  const blob = new Blob([chatToJsonl(selectedHistory)], { type: 'application/jsonl;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${selectedHistory.title || '聊天记录'}.jsonl`;
  link.click();
  URL.revokeObjectURL(url);
  closeChatActionMenu();
  showToast('聊天已导出');
}

function copySelectedChat() {
  if (!selectedHistory) return;
  const source = selectedHistory;
  const duplicate = {
    ...source,
    id: `copy-${source.id}-${Date.now()}`,
    title: `${source.title || '聊天'}（副本）`,
    lastActiveAt: new Date().toISOString(),
    messages: (source.messages || []).map((message) => ({
      ...message,
      ...(Array.isArray(message.replyVariants) ? { replyVariants: [...message.replyVariants] } : {}),
      ...(Array.isArray(message.replyReasoningVariants) ? { replyReasoningVariants: [...message.replyReasoningVariants] } : {}),
    })),
    contextLogs: (source.contextLogs || []).map((log) => ({
      ...log,
      parameters: { ...(log.parameters || {}) },
      worldBookNames: [...(log.worldBookNames || [])],
      regexNames: [...(log.regexNames || [])],
      snippets: (log.snippets || []).map((snippet) => ({ ...snippet })),
    })),
    memory: normalizeChatMemory(cloneData(source.memory || {})),
    source: 'chat-branch',
  };
  const copiedMemoryDocuments = memoryDocumentsForChat(source).map((doc, index) => ({
    ...doc,
    id: `copy-memory-${duplicate.id}-${Date.now()}-${index}`,
    groupId: `copy-memory-group-${duplicate.id}-${doc.groupId}`,
    chatId: duplicate.id,
  }));
  storeMemoryDocuments(copiedMemoryDocuments);
  chatHistories.unshift(duplicate);
  activeChat = duplicate;
  activeChatsByRole[duplicate.roleId || currentRole.id] = duplicate;
  closeChatActionMenu();
  renderHistory();
  loadChatHistory(duplicate);
  saveChatHistoriesToCache();
  showToast('已复制为新聊天框，可以从这里分叉剧情');
}

function renameSelectedChat() {
  if (!selectedHistory) return;
  closeChatActionMenu();
  renameMode = 'chat';
  renameDialogTitle.textContent = '重命名聊天';
  renameChatInput.value = selectedHistory.title;
  renameDialog.classList.add('is-open');
  renameDialog.setAttribute('aria-hidden', 'false');
  window.setTimeout(() => {
    renameChatInput.focus();
    renameChatInput.select();
  }, 0);
}

function closeRenameDialog() {
  renameDialog.classList.remove('is-open');
  renameDialog.setAttribute('aria-hidden', 'true');
}

function confirmRenameChat() {
  if (renameMode === 'persona') {
    const title = renameChatInput.value.trim();
    if (selectedPersona && title) {
      selectedPersona.persona.label = title;
      renderPersonaVersions(selectedPersona.role);
      if (selectedPersona.role.id === currentRole.id) renderActivePersona();
      saveRolesToCache();
      showToast(`已改名为：${title}`);
    }
    closeRenameDialog();
    return;
  }
  if (!selectedHistory) return;
  const title = renameChatInput.value.trim();
  if (title) {
    selectedHistory.title = title;
    renderHistory();
    saveChatHistoriesToCache();
    showToast(`已重命名为：${title}`);
  }
  closeRenameDialog();
}

function renameSelectedPersona() {
  if (!selectedPersona) return;
  closePersonaActionMenu();
  renameMode = 'persona';
  renameDialogTitle.textContent = '人设改名';
  renameChatInput.value = selectedPersona.persona.label;
  renameDialog.classList.add('is-open');
  renameDialog.setAttribute('aria-hidden', 'false');
  window.setTimeout(() => {
    renameChatInput.focus();
    renameChatInput.select();
  }, 0);
}

function copySelectedPersona() {
  if (!selectedPersona) return;
  const { role, persona } = selectedPersona;
  const knownNumbers = role.personaVersions.map((item) => Number((item.label || '').match(/(\d+)\s*$/)?.[1]) || 0);
  const duplicate = { id: `${role.id}-copy-${Date.now()}`, label: `${role.name} ${Math.max(0, ...knownNumbers) + 1}`, apiId: persona.apiId || '' };
  copyPersonaFields(persona, duplicate);
  role.personaVersions.push(duplicate);
  applyPersona(role, duplicate);
  closePersonaActionMenu();
  openEditor(role);
  if (role.id === currentRole.id) setRole(role);
  showToast(`已复制为 ${duplicate.label}`);
}

function deleteSelectedPersona() {
  if (!selectedPersona) return;
  const { role, persona } = selectedPersona;
  if (role.personaVersions.length <= 1) {
    closePersonaActionMenu();
    showToast('至少保留一个人设版本');
    return;
  }
  const index = role.personaVersions.findIndex((item) => item.id === persona.id);
  role.personaVersions.splice(index, 1);
  applyPersona(role, role.personaVersions[Math.max(0, index - 1)]);
  closePersonaActionMenu();
  openEditor(role);
  if (role.id === currentRole.id) setRole(role);
  showToast('已删除人设版本');
}

function createFreshChat() {
  const chat = makeChatForRole(currentRole);
  chat.source = 'reshape-role';
  chatHistories.unshift(chat);
  activeChat = chat;
  activeChatsByRole[currentRole.id] = chat;
  renderHistory();
  loadChatHistory(chat);
  saveChatHistoriesToCache();
  showToast('已新开一个对话框');
}

function chatDeleteConfirmationName(chat) {
  return String(chat?.title || '未命名聊天');
}

function isChatDeleteNameConfirmed(chat, value) {
  return Boolean(chat) && String(value ?? '') === chatDeleteConfirmationName(chat);
}

function updateDeleteChatConfirm() {
  if (!confirmDeleteChatButton) return;
  confirmDeleteChatButton.disabled = !isChatDeleteNameConfirmed(pendingDeleteChat, deleteChatNameInput?.value);
}

function openDeleteChatDialog() {
  if (!selectedHistory || !deleteChatDialog) return;
  pendingDeleteChat = selectedHistory;
  closeChatActionMenu();
  deleteChatTargetName.textContent = chatDeleteConfirmationName(pendingDeleteChat);
  deleteChatNameInput.value = '';
  updateDeleteChatConfirm();
  deleteChatDialog.classList.add('is-open');
  deleteChatDialog.setAttribute('aria-hidden', 'false');
  window.setTimeout(() => deleteChatNameInput.focus(), 0);
}

function closeDeleteChatDialog() {
  deleteChatDialog?.classList.remove('is-open');
  deleteChatDialog?.setAttribute('aria-hidden', 'true');
  pendingDeleteChat = null;
  if (deleteChatNameInput) deleteChatNameInput.value = '';
  updateDeleteChatConfirm();
}

function confirmDeleteSelectedChat() {
  const chat = pendingDeleteChat;
  if (!isChatDeleteNameConfirmed(chat, deleteChatNameInput?.value)) return;
  closeDeleteChatDialog();
  deleteSelectedChat(chat);
}

function deleteSelectedChat(chat = selectedHistory) {
  if (!chat) return;
  const deletedChatId = chat.id;
  const index = chatHistories.findIndex((item) => item.id === chat.id);
  if (index >= 0) chatHistories.splice(index, 1);
  const groups = [...new Set(memoryDocuments.filter((doc) => doc.chatId === deletedChatId).map((doc) => doc.groupId))];
  groups.forEach((groupId) => deleteMemoryDocumentGroup(groupId));
  activeChat = ensureActiveChatForRole(currentRole);
  renderHistory();
  loadChatHistory(activeChat);
  closeChatActionMenu();
  selectedHistory = null;
  saveChatHistoriesToCache();
  showToast('聊天已删除');
}

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    composer.requestSubmit();
  }
});
messages.addEventListener('scroll', () => {
  updateScrollState();
  if (chatHistoryLoadIntent && messages.scrollTop <= 2) loadEarlierChatMessages();
});

// CSS 蒙版只负责“看不见”，不会自动取消被裁掉气泡的点击命中。
// 透明帘出现后，拦截帘内（含末端渐变区）的点击；仍保留 touchmove/wheel，用户可以正常滑动聊天层。
function isClickBehindBottomCurtain(event) {
  if (!bottomCurtainActive || bottomChatExpanded) return false;
  const clientY = Number(event.clientY);
  if (!Number.isFinite(clientY)) return false;
  const rect = messages.getBoundingClientRect();
  if (clientY < rect.top || clientY > rect.bottom || rect.height <= 0) return false;
  const curtainBottomPercent = Math.max(0, Math.min(100, Number(revealCurrent.show) || 0));
  const curtainBottomY = rect.top + (rect.height * curtainBottomPercent / 100);
  return clientY < curtainBottomY;
}

messages.addEventListener('click', (event) => {
  if (!isClickBehindBottomCurtain(event)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
}, true);

// 点聊天区空白处收起已展开的 AI 工具栏（点 AI 气泡本身不触发，由气泡点击 toggle 处理）
messages.addEventListener('click', (event) => {
  if (event.target.closest('.message.bot')) return;
  messages.querySelectorAll('.message.bot.is-active').forEach((el) => el.classList.remove('is-active'));
});
// 任意正常点击只顺带恢复带色层；不阻止返回、菜单、气泡按钮和输入框原本的功能。
chatScreen.addEventListener('click', restoreBottomColorLayer, true);
jumpButton.addEventListener('click', () => {
  cancelBottomRevealReturn();
  bottomBackgroundRevealEnabled = true;
  scrollToBottom();
});
// openRoles 已在文件末尾绑定 toggleLeftDrawer，此处移除旧的 openSheet 调用
// （原 roleSheet 元素已从 HTML 中删除，改用 #roleColumn 左栏）
sheetScrim.addEventListener('click', () => {
  closeSheet();
  closeEditorPanel();
});
addRoleButton.addEventListener('click', openRoleManager);
closeRoleManagerButton.addEventListener('click', closeRoleManager);
exportRoleManagerBackupButton?.addEventListener('click', () => {
  // 应急入口默认不带 API / 语音密钥，避免分享备份时泄露；导出成功后由系统选择保存位置。
  closeRoleManager();
  exportAppBackup(false);
});
importRoleManagerBackupButton?.addEventListener('click', () => {
  closeRoleManager();
  importAppConfigFile();
});
addBlankRoleButton.addEventListener('click', addRole);
copyCurrentRoleButton.addEventListener('click', openCopyRoleDialog);
cancelCopyRoleBackdrop.addEventListener('click', closeCopyRoleDialog);
cancelCopyRoleButton.addEventListener('click', closeCopyRoleDialog);
confirmCopyRoleButton.addEventListener('click', copyCurrentRole);
deleteCurrentRoleButton.addEventListener('click', openDeleteRoleDialog);
editCurrentRoleIntroButton.addEventListener('click', openQuickRoleIntroDialog);
roleShellPreviewButtons.forEach((button) => {
  button.addEventListener('click', () => applyShellPreviewMode(button.dataset.shellPreview));
});
cancelDeleteRoleBackdrop.addEventListener('click', closeDeleteRoleDialog);
cancelDeleteRoleButton.addEventListener('click', closeDeleteRoleDialog);
deleteRoleNameInput.addEventListener('input', updateDeleteRoleConfirm);
confirmDeleteRoleButton.addEventListener('click', confirmDeleteCurrentRole);
cancelEditRoleIntroBackdrop.addEventListener('click', closeQuickRoleIntroDialog);
cancelEditRoleIntroButton.addEventListener('click', closeQuickRoleIntroDialog);
saveRoleIntroButton.addEventListener('click', saveQuickRoleIntro);
personaMenuButton.addEventListener('click', openPersonaMenu);
closeEditor.addEventListener('click', requestCloseEditor);
saveRoleButton.addEventListener('click', saveEditingRole);
roleVoiceInput?.addEventListener('change', saveEditorVoiceBindingImmediately);
roleAutoReadInput?.addEventListener('change', saveEditorAutoReadImmediately);
roleIntroToggle.addEventListener('click', () => {
  setRoleIntroCollapsed(!roleIntroSection.classList.contains('is-collapsed'));
});
// 人设页图片编辑：先在头像下方预览头像/背景，再按实际使用比例框选。
let roleImageDraft = null;
let roleCropState = null;

function setRoleImagePickerOpen(open) {
  if (!roleImagePicker || !editorAvatarButton) return;
  if (open) {
    roleImageDraft = {
      avatar: editorAvatar.dataset.value || editorAvatar.src || '',
      background: editorAvatar.dataset.background || editingRole?.background || '',
    };
    roleAvatarPreview.src = roleImageDraft.avatar;
    roleBackgroundPreview.src = roleImageDraft.background;
  } else {
    roleImageDraft = null;
  }
  roleImagePicker.classList.toggle('is-open', open);
  roleImagePicker.setAttribute('aria-hidden', String(!open));
  editorAvatarButton.setAttribute('aria-expanded', String(open));
}

function closeRoleImageCropper() {
  roleCropState = null;
  roleImageCropper?.classList.remove('is-open');
  roleImageCropper?.setAttribute('aria-hidden', 'true');
  if (roleCropImage) {
    roleCropImage.removeAttribute('src');
    roleCropImage.style.cssText = '';
  }
}

function clampRoleCropOffset() {
  if (!roleCropState || !roleCropStage) return;
  const cropWidth = roleCropStage.clientWidth;
  const cropHeight = roleCropStage.clientHeight;
  const shownWidth = roleCropState.naturalWidth * roleCropState.scale;
  const shownHeight = roleCropState.naturalHeight * roleCropState.scale;
  roleCropState.offsetX = Math.max((cropWidth - shownWidth) / 2, Math.min((shownWidth - cropWidth) / 2, roleCropState.offsetX));
  roleCropState.offsetY = Math.max((cropHeight - shownHeight) / 2, Math.min((shownHeight - cropHeight) / 2, roleCropState.offsetY));
}

function renderRoleCrop() {
  if (!roleCropState || !roleCropImage) return;
  clampRoleCropOffset();
  roleCropImage.style.width = `${roleCropState.naturalWidth * roleCropState.scale}px`;
  roleCropImage.style.height = `${roleCropState.naturalHeight * roleCropState.scale}px`;
  roleCropImage.style.transform = `translate(-50%,-50%) translate(${roleCropState.offsetX}px,${roleCropState.offsetY}px)`;
}

function initializeRoleCrop() {
  if (!roleCropState || !roleCropStage) return;
  const fitScale = Math.max(
    roleCropStage.clientWidth / roleCropState.naturalWidth,
    roleCropStage.clientHeight / roleCropState.naturalHeight,
  );
  roleCropState.fitScale = fitScale;
  roleCropState.scale = fitScale * Number(roleCropZoom.value || 1);
  roleCropState.offsetX = 0;
  roleCropState.offsetY = 0;
  renderRoleCrop();
}

function openRoleImageCropper(kind, source) {
  if (!roleImageCropper || !roleCropImage) return;
  roleCropState = { kind, source, naturalWidth: 0, naturalHeight: 0, fitScale: 1, scale: 1, offsetX: 0, offsetY: 0 };
  roleCropStage.classList.toggle('is-avatar', kind === 'avatar');
  roleCropStage.classList.toggle('is-background', kind === 'background');
  imageCropTitle.textContent = kind === 'avatar' ? '框选人物头像' : '框选背景图';
  imageCropHint.textContent = kind === 'avatar' ? '拖动和缩放，调整头像显示区域' : '拖动和缩放，调整聊天背景显示区域';
  roleCropZoom.value = '1';
  roleImageCropper.classList.add('is-open');
  roleImageCropper.setAttribute('aria-hidden', 'false');
  roleCropImage.onload = () => {
    if (!roleCropState) return;
    roleCropState.naturalWidth = roleCropImage.naturalWidth;
    roleCropState.naturalHeight = roleCropImage.naturalHeight;
    requestAnimationFrame(initializeRoleCrop);
  };
  roleCropImage.src = source;
}

function readRoleImageFile(input, kind) {
  const file = input?.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('请选择图片文件');
    input.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    input.value = '';
    openRoleImageCropper(kind, String(reader.result || ''));
  };
  reader.onerror = () => {
    input.value = '';
    showToast('图片读取失败');
  };
  reader.readAsDataURL(file);
}

function confirmRoleImageCrop() {
  if (!roleCropState || !roleCropStage || !roleImageDraft) return;
  const cropWidth = roleCropStage.clientWidth;
  const cropHeight = roleCropStage.clientHeight;
  const shownWidth = roleCropState.naturalWidth * roleCropState.scale;
  const shownHeight = roleCropState.naturalHeight * roleCropState.scale;
  const shownLeft = (cropWidth - shownWidth) / 2 + roleCropState.offsetX;
  const shownTop = (cropHeight - shownHeight) / 2 + roleCropState.offsetY;
  const sourceX = Math.max(0, -shownLeft / roleCropState.scale);
  const sourceY = Math.max(0, -shownTop / roleCropState.scale);
  const sourceWidth = Math.min(roleCropState.naturalWidth - sourceX, cropWidth / roleCropState.scale);
  const sourceHeight = Math.min(roleCropState.naturalHeight - sourceY, cropHeight / roleCropState.scale);
  const canvas = document.createElement('canvas');
  if (roleCropState.kind === 'avatar') {
    canvas.width = 512;
    canvas.height = 512;
  } else {
    canvas.width = 780;
    canvas.height = 1688;
  }
  const context = canvas.getContext('2d');
  context.drawImage(roleCropImage, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/jpeg', .9);
  if (roleCropState.kind === 'avatar') {
    roleImageDraft.avatar = dataUrl;
    roleAvatarPreview.src = dataUrl;
  } else {
    roleImageDraft.background = dataUrl;
    roleBackgroundPreview.src = dataUrl;
  }
  closeRoleImageCropper();
}

if (editorAvatarButton && roleImagePicker) {
  editorAvatarButton.setAttribute('aria-expanded', 'false');
  editorAvatarButton.addEventListener('click', () => setRoleImagePickerOpen(!roleImagePicker.classList.contains('is-open')));
  roleAvatarChoice?.addEventListener('click', () => avatarFileInput?.click());
  roleBackgroundChoice?.addEventListener('click', () => backgroundFileInput?.click());
  avatarFileInput?.addEventListener('change', () => readRoleImageFile(avatarFileInput, 'avatar'));
  backgroundFileInput?.addEventListener('change', () => readRoleImageFile(backgroundFileInput, 'background'));
  cancelRoleImages?.addEventListener('click', () => setRoleImagePickerOpen(false));
  confirmRoleImages?.addEventListener('click', () => {
    if (!roleImageDraft) return;
    editorAvatar.src = roleImageDraft.avatar;
    editorAvatar.dataset.value = roleImageDraft.avatar;
    editorAvatar.dataset.background = roleImageDraft.background;
    setRoleImagePickerOpen(false);
    showToast('头像和背景图已确认，保存人设后生效');
  });
  cancelImageCropTop?.addEventListener('click', closeRoleImageCropper);
  cancelImageCrop?.addEventListener('click', closeRoleImageCropper);
  confirmImageCrop?.addEventListener('click', confirmRoleImageCrop);
  roleCropZoom?.addEventListener('input', () => {
    if (!roleCropState) return;
    roleCropState.scale = roleCropState.fitScale * Number(roleCropZoom.value || 1);
    renderRoleCrop();
  });
  roleCropStage?.addEventListener('pointerdown', (event) => {
    if (!roleCropState) return;
    roleCropState.pointerId = event.pointerId;
    roleCropState.pointerX = event.clientX;
    roleCropState.pointerY = event.clientY;
    roleCropStage.setPointerCapture(event.pointerId);
  });
  roleCropStage?.addEventListener('pointermove', (event) => {
    if (!roleCropState || roleCropState.pointerId !== event.pointerId) return;
    roleCropState.offsetX += event.clientX - roleCropState.pointerX;
    roleCropState.offsetY += event.clientY - roleCropState.pointerY;
    roleCropState.pointerX = event.clientX;
    roleCropState.pointerY = event.clientY;
    renderRoleCrop();
  });
  const endRoleCropDrag = (event) => {
    if (!roleCropState || roleCropState.pointerId !== event.pointerId) return;
    roleCropState.pointerId = null;
    try { roleCropStage.releasePointerCapture(event.pointerId); } catch (_) {}
  };
  roleCropStage?.addEventListener('pointerup', endRoleCropDrag);
  roleCropStage?.addEventListener('pointercancel', endRoleCropDrag);
}
personaFileInput.addEventListener('change', () => importPersonaFile(personaFileInput.files[0]));
multiPersonaFileInput?.addEventListener('change', () => importMultiPersonaFile(multiPersonaFileInput.files[0]));
menuAddEmptyPersona.addEventListener('click', () => { closePersonaMenu(); addEmptyPersonaVersion(); });
menuCopyPersona.addEventListener('click', () => { closePersonaMenu(); addPersonaVersion(); });
menuImportPersona.addEventListener('click', () => { closePersonaMenu(); personaFileInput.click(); });
menuImportMultiPersona?.addEventListener('click', () => { closePersonaMenu(); multiPersonaFileInput?.click(); });
menuExportPersona.addEventListener('click', () => { closePersonaMenu(); exportPersona(); });
menuExportMultiPersona?.addEventListener('click', () => { closePersonaMenu(); exportMultiPersonas(); });
menuRecallDefaultPersonas?.addEventListener('click', recallDefaultPersonas);
exitSaveButton.addEventListener('click', () => { closeEditorExitMenu(); saveEditingRole(); });
exitDiscardButton.addEventListener('click', () => { closeEditorExitMenu(); closeEditorPanel(); });
openChatStore.addEventListener('click', openChatStorePage);
closeChatStore.addEventListener('click', closeChatStorePage);
// 三个点页"字号设置"按钮 → 直接跳到外观页（外观页里的"聊天界面设置"包含完整聊天字号 + 5 个颜色）
fontSettingButton.addEventListener('click', () => openThemeDetail());
uploadRecordsButton.addEventListener('click', () => recordsFileInput.click());
recordsFileInput.addEventListener('change', () => {
  const files = Array.from(recordsFileInput.files || []);
  if (!files.length) return;
  Promise.all(files.map((file) => importChatFile(file)))
    .then(() => showToast(`已导入 ${files.length} 个聊天框`))
    .catch(() => showToast('导入失败，请检查 jsonl/json 格式'))
    .finally(() => {
      recordsFileInput.value = '';
    });
});
storeApiButton.addEventListener('click', openApiDetail);
closeSettings.addEventListener('click', closeSettingsPage);
closeDetail.addEventListener('click', closeDetailPage);
detailPage.addEventListener('focusin', (event) => {
  if (event.target?.matches?.('input, textarea, select')) lockOpenDetailPagePosition();
});
detailPage.addEventListener('focusout', (event) => {
  if (event.target?.matches?.('input, textarea, select')) unlockOpenDetailPagePositionSoon();
});
detailPage.addEventListener('touchstart', (event) => {
  if (event.target?.closest?.('input, textarea, select')) lockOpenDetailPagePosition();
}, { passive: true });
detailPage.addEventListener('pointerdown', (event) => {
  if (event.target?.closest?.('input, textarea, select')) lockOpenDetailPagePosition();
});
const keepFocusedDetailPageAnchored = () => {
  if (detailPage.classList.contains('is-input-active')) lockOpenDetailPagePosition();
};
window.visualViewport?.addEventListener('resize', keepFocusedDetailPageAnchored);
window.visualViewport?.addEventListener('scroll', keepFocusedDetailPageAnchored);
window.addEventListener('scroll', keepFocusedDetailPageAnchored, { passive: true });
exportChatButton.addEventListener('click', exportSelectedChat);
copyChatButton.addEventListener('click', copySelectedChat);
renameChatButton.addEventListener('click', renameSelectedChat);
deleteChatButton.addEventListener('click', openDeleteChatDialog);
cancelDeleteChatBackdrop?.addEventListener('click', closeDeleteChatDialog);
cancelDeleteChatButton?.addEventListener('click', closeDeleteChatDialog);
confirmDeleteChatButton?.addEventListener('click', confirmDeleteSelectedChat);
deleteChatNameInput?.addEventListener('input', updateDeleteChatConfirm);
deleteChatNameInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !confirmDeleteChatButton.disabled) confirmDeleteSelectedChat();
  if (event.key === 'Escape') closeDeleteChatDialog();
});
openChatContextLogsButton?.addEventListener('click', openSelectedChatContextLogs);
exportContextLogButton?.addEventListener('click', exportSelectedContextLog);
deleteContextLogButton?.addEventListener('click', deleteSelectedContextLog);
cancelRenameButton.addEventListener('click', closeRenameDialog);
confirmRenameButton.addEventListener('click', confirmRenameChat);
renameChatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') confirmRenameChat();
  if (event.key === 'Escape') closeRenameDialog();
});
renamePersonaButton.addEventListener('click', renameSelectedPersona);
copyPersonaButton.addEventListener('click', copySelectedPersona);
deletePersonaButton.addEventListener('click', deleteSelectedPersona);
renameDialog.addEventListener('click', (event) => {
  if (event.target === renameDialog) closeRenameDialog();
});
reshapeRoleButton.addEventListener('click', createFreshChat);
activePersonaCard.addEventListener('click', (event) => {
  // 点展开区里的按钮时不触发折叠
  if (event.target.closest('.active-persona-expand')) return;
  const willOpen = activePersonaExpand.hasAttribute('hidden');
  if (willOpen) {
    activePersonaExpand.removeAttribute('hidden');
    activePersonaCaret.classList.add('is-open');
  } else {
    activePersonaExpand.setAttribute('hidden', '');
    activePersonaCaret.classList.remove('is-open');
  }
  // 点「当前人设」即退出两种多轮询并回到单人模式。
  polling.enabled = false;
  polling.currentId = null;
  polling.count = 0;
  updateModeDots();
  savePollingState();
});
editActivePersonaExpandButton.addEventListener('click', () => {
  closeChatStorePage();
  openEditor(currentRole);
});
swapActivePersonaExpandButton.addEventListener('click', () => {
  closeChatStorePage();
  openPersonaSwap();
});
multiPersonaPollingButton.addEventListener('click', () => {
  const willOpen = pollingExpand.hasAttribute('hidden');
  if (willOpen) {
    pollingExpand.removeAttribute('hidden');
    renderPollingList();
  } else {
    pollingExpand.setAttribute('hidden', '');
  }
  updateModeDots();
  savePollingState();
});
pollingModePicker?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-polling-mode]');
  if (!button) return;
  setPollingMode(button.dataset.pollingMode);
});
closePersonaSwap?.addEventListener('click', closePersonaSwapPage);
contextLog?.addEventListener('click', () => {
  closeTransientActionMenus();
  renderContextLog();
  contextLogPage.classList.add('is-open');
  contextLogPage.setAttribute('aria-hidden', 'false');
});
closeContextLogFull?.addEventListener('click', () => {
  if (contextLogView === 'detail') {
    closeTransientActionMenus({ owner: contextLogPage });
    renderContextLogList();
    return;
  }
  closeTransientActionMenus({ owner: contextLogPage });
  contextLogPage.classList.remove('is-open');
  contextLogPage.setAttribute('aria-hidden', 'true');
});
chatStorePage.addEventListener('click', (event) => {
  if (!chatActionMenu.contains(event.target)) closeChatActionMenu();
});
contextLogPage?.addEventListener('click', (event) => {
  if (!contextLogActionMenu?.contains(event.target) && !event.target.closest('.context-log-more')) closeContextLogActionMenu();
});
chatStorePage.querySelector('.store-content')?.addEventListener('scroll', () => {
  closeTransientActionMenus({ owner: chatStorePage });
}, { passive: true });
contextLogFullContent?.addEventListener('scroll', () => {
  closeTransientActionMenus({ owner: contextLogPage });
}, { passive: true });
window.addEventListener('resize', () => {
  closeTransientActionMenus();
}, { passive: true });
window.visualViewport?.addEventListener('resize', () => {
  closeTransientActionMenus();
}, { passive: true });
characterEditor.addEventListener('click', (event) => {
  if (!personaActionMenu.contains(event.target) && !event.target.closest('.persona-version-button')) closePersonaActionMenu();
  if (!personaMenu.contains(event.target) && !event.target.closest('.persona-add-button')) closePersonaMenu();
  if (!editorExitMenu.contains(event.target)) closeEditorExitMenu();
});

document.querySelectorAll('.side-tabs button').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.target === 'more') { openMoreSettingsSafely(); return; }
    closeLeftDrawer();
    if (button.dataset.target === 'api') openApiDetail();
    if (button.dataset.target === 'voice') openVoiceApiDetail();
  });
});

// ===== 系统默认人设（由「电脑开启预览小工具 → 保存默认人设」写入，serve.js 存为 系统人设.json）=====
// 启动时优先于 app.js 内置角色加载；仍会被下方 loadRolesFromCache() 的 localStorage 缓存覆盖/合并。
// cleared=true 表示用户点了「恢复内置人设」：清掉本地角色缓存并回到内置角色，然后通知服务端删除标记。
(function loadSystemPersonas() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/personas/system', false); // 同步：须在 loadRolesFromCache 之前就位
    xhr.send(null);
    if (xhr.status !== 200) return;
    const data = JSON.parse(xhr.responseText);
    if (data && data.cleared) {
      // 消费「恢复内置」标记：清角色缓存 + 异步通知服务端把标记改写为中性内容
      try { localStorage.removeItem(ROLES_CACHE_KEY); } catch (_) {}
      try {
        fetch('/api/personas/consume-reset', { method: 'POST' }).catch(() => {});
      } catch (_) {}
      return;
    }
    const personas = data && Array.isArray(data.personas) ? data.personas : null;
    if (!personas || !personas.length) return;
    const defaultById = new Map(roles.map((role) => [role.id, role]));
    const merged = [];
    personas.forEach((entry) => {
      if (!entry || typeof entry !== 'object' || !entry.id) return;
      const def = defaultById.get(entry.id);
      if (def) {
        // 合并回内置角色对象（保持对象引用，使 currentRole 等指针有效），规则同 loadRolesFromCache：
        // 空的视觉/开场字段不应抹掉内置角色资源。
        const safeEntry = { ...entry };
        ['avatar', 'background', 'greeting'].forEach((field) => {
          if (typeof safeEntry[field] !== 'string' || !safeEntry[field].trim()) delete safeEntry[field];
        });
        Object.assign(def, safeEntry);
        defaultById.delete(entry.id);
        merged.push(def);
      } else {
        // 系统人设中有、内置没有的（用户新增/导入的角色）直接保留
        merged.push(entry);
      }
    });
    // 内置中有但系统人设中没有的（新版本 App 新增角色）也保留
    defaultById.forEach((role) => merged.push(role));
    roles.length = 0;
    roles.push(...merged);
  } catch (_) {
    // file:// 直开或服务未启动时忽略，使用内置角色
  }
})();

// 首次安装时写入出厂资料。已有任意本地资料即视为用户正在使用的 App，绝不覆盖。
function installFactoryDefaultConfigIfNeeded() {
  const existingDataKeys = [
    ROLES_CACHE_KEY,
    API_CACHE_KEY,
    APP_STATE_CACHE_KEY,
    CHAT_CACHE_KEY,
    'xs_userIdentities',
    'xs_userProfile',
  ];
  try {
    if (existingDataKeys.some((key) => localStorage.getItem(key) != null)) return;
    const binary = atob(FACTORY_DEFAULT_CONFIG_B64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const config = JSON.parse(new TextDecoder().decode(bytes));

    // 双重兜底：即使以后不小心换了配置文件，也绝不把作者密钥写进发布包。
    (config.apiLinks || []).forEach((api) => { api.key = ''; });
    if (config.voiceApiSettings?.siliconflow) config.voiceApiSettings.siliconflow.apiKey = '';
    if (config.voiceApiSettings?.volcano) config.voiceApiSettings.volcano.accessKey = '';
    if (config.voiceApiSettings?.minimax) config.voiceApiSettings.minimax.apiKey = '';
    if (config.voiceApiSettings?.moss) config.voiceApiSettings.moss.apiKey = '';

    applyImportedConfig(config);
    const activeRole = roles.find((role) => role.id === activeChat?.roleId);
    if (activeRole) setRole(activeRole);
    localStorage.setItem('xs_factory_defaults_v1', 'installed');
  } catch (_) {
    // 无痕模式或异常环境下静默使用内置默认值，不能影响 App 打开。
  }
}

let appDataReady = false;

function runXiangsiMemorySelfTests() {
  const failures = [];
  let checks = 0;
  const promptLibrarySnapshot = cloneData(memorySettings.promptLibraries || {});
  const assert = (condition, name) => { checks += 1; if (!condition) failures.push(name); };
  const assertBehavior = (name, run) => {
    try { assert(run() === true, name); } catch (_) { assert(false, name); }
  };
  const base = normalizeChatMemory({
    memorySchemaVersion: 2,
    anchors: {
      currentTime: { value: '夜里', updatePrompt: '更新时间', updateEnabled: true, sendEnabled: true },
      currentLocation: { value: '海边', updatePrompt: '更新地点', updateEnabled: true, sendEnabled: true },
    },
    sectionControls: { relationships: createMemoryToggle(), openPlots: createMemoryToggle(), summaries: createMemoryToggle() },
    relationshipCards: [{ source: '甲', target: '乙', currentRelation: '盟友', evidence: '结盟' }],
    openPlots: [{ id: 'p1', title: '寻找玉佩' }],
    customStates: [{ id: 'c1', name: '伤势', value: '轻伤', updatePrompt: '明确变化才更新', updateEnabled: true, sendEnabled: true }],
  });
  [false, true].forEach((updateEnabled) => [false, true].forEach((sendEnabled) => {
    const sample = cloneData(base);
    sample.customStates[0].updateEnabled = updateEnabled;
    sample.customStates[0].sendEnabled = sendEnabled;
    assert(memorySummaryUpdateContext(sample).customStates.some((item) => item.id === 'c1') === updateEnabled, `toggle-update-${updateEnabled}-${sendEnabled}`);
    assert(formatChatMemory(sample).includes('伤势：轻伤') === sendEnabled, `toggle-send-${updateEnabled}-${sendEnabled}`);
  }));
  const relation = mergeRelationshipCards([{ id: 'r1', source: '甲', target: '乙', currentRelation: '盟友', evidence: '旧证据' }], [{ source: '甲', target: '乙', currentRelation: '夫妻', evidence: '成婚', reason: '正式成婚' }])[0];
  assert(relation.currentRelation === '夫妻', 'relation-current');
  assert(relation.history.some((item) => item.relation === '盟友') && relation.history.some((item) => item.relation === '夫妻'), 'relation-history');
  const migratedOnce = normalizeChatMemory({ skills: [{ name: '水术' }], inventory: [{ name: '玉佩' }], importantFacts: ['不可遗忘'], visitedPlaces: ['海边'], tasks: [{ name: '找人', status: '进行中' }, { name: '旧任务', status: '已完成', result: '完成' }] });
  const migratedTwice = normalizeChatMemory(migratedOnce);
  assert(migratedOnce.customStates.length === migratedTwice.customStates.length, 'migration-custom-idempotent');
  assert(migratedOnce.summaries.length === migratedTwice.summaries.length, 'migration-summary-idempotent');
  assert(migratedTwice.openPlots.length === 1 && migratedTwice.openPlots[0].title === '找人', 'migration-open-plot');
  const numeric = normalizeCustomStates([{ id: 'hp', name: '血量', value: '130', valueType: 'number', min: 0, max: 100, unit: 'HP', showProgress: true }])[0];
  assert(numeric.value === '100' && formatCustomStateValue(numeric) === '100 HP', 'numeric-clamp-and-unit');
  assert(validatedCustomStateValue(numeric, '错误').ok === false, 'numeric-reject-invalid');
  const ordered = normalizeChatMemory({ memorySchemaVersion: 3, customStates: [{ id: 'b', name: '天气', value: '晴', order: 1 }, { id: 'a', name: '衣着', value: '白衣', order: 0 }] });
  assert(formatChatMemory(ordered).indexOf('衣着') < formatChatMemory(ordered).indexOf('天气'), 'custom-order-injection');
  const legacyPromptMemory = normalizeChatMemory({ memorySchemaVersion: 2, anchors: { currentTime: { updatePrompt: '我的旧时间规则' } } });
  const legacyPromptAgain = normalizeChatMemory(legacyPromptMemory);
  assert(legacyPromptMemory.promptSelections.currentTime === legacyPromptAgain.promptSelections.currentTime, 'prompt-migration-stable-id');
  assert(resolveMemoryPrompt('currentTime', legacyPromptMemory.promptSelections.currentTime).content === '我的旧时间规则', 'prompt-migration-content');
  memorySettings.promptLibraries.currentTime.push({ id: 'test-time-version', name: '测试版本', content: '只接受明确钟点', builtin: false });
  const chatA = normalizeChatMemory({ memorySchemaVersion: 3, promptSelections: { currentTime: 'test-time-version' } });
  const chatB = normalizeChatMemory({ memorySchemaVersion: 3, promptSelections: { currentTime: memorySystemPromptId('currentTime') } });
  assert(resolveMemoryPrompt('currentTime', chatA.promptSelections.currentTime).content === '只接受明确钟点', 'prompt-cross-chat-a');
  assert(resolveMemoryPrompt('currentTime', chatB.promptSelections.currentTime).content === MEMORY_PROMPT_TARGETS.currentTime.content, 'prompt-cross-chat-b');
  assertBehavior('performance-current-role-seeded', () => {
    const targets = normalizePerformanceTargets([], '相柳');
    return targets.length === 1 && targets[0].primaryName === '相柳' && targets[0].locked === true;
  });
  assertBehavior('performance-target-limit-six', () => normalizePerformanceTargets([
    '相柳', '小夭', '涂山璟', '玱玹', '阿念', '防风意映', '丰隆',
  ], '相柳').length === 6);
  assertBehavior('performance-alias-deduped', () => {
    const [target] = normalizePerformanceTargets([{ primaryName: '相柳', aliases: ['防风邶', '相柳', '防风邶'] }], '相柳');
    return target.aliases.length === 1 && target.aliases[0] === '防风邶';
  });
  assertBehavior('performance-alias-confirmation', () => {
    const state = normalizeKnowledgePerformanceState({
      targetCharacters: [{ id: 'target-xl', primaryName: '相柳' }],
      aliasCandidates: [{ id: 'alias-bf', targetId: 'target-xl', name: '防风邶', status: 'pending', evidenceDocIds: ['d2'] }],
    }, '相柳');
    const confirmed = resolveAliasCandidate(state, 'alias-bf', 'accepted');
    return confirmed.targetCharacters[0].aliases.includes('防风邶') && confirmed.aliasCandidates[0].status === 'accepted';
  });
  assertBehavior('performance-rejected-alias-persists', () => {
    const state = resolveAliasCandidate(normalizeKnowledgePerformanceState({
      aliasCandidates: [{ id: 'alias-x', targetId: 'target-current', name: '九命', status: 'pending' }],
    }, '相柳'), 'alias-x', 'rejected');
    return state.aliasCandidates[0].status === 'rejected';
  });
  assertBehavior('performance-targeted-scene-selection', () => {
    const docs = [
      { id: 'd0', text: '无人经过。' },
      { id: 'd1', text: '相柳停在海边。' },
      { id: 'd2', text: '他没有解释，只转身挡住追兵。' },
      { id: 'd3', text: '另一处市集十分热闹。' },
    ];
    return selectTargetSceneDocuments(docs, { primaryName: '相柳', aliases: [] }).map((doc) => doc.id).join(',') === 'd1,d2';
  });
  assertBehavior('performance-new-alias-only-finds-new-scenes', () => {
    const docs = [{ id: 'd1', text: '相柳在海边。' }, { id: 'd2', text: '防风邶笑着斟酒。' }];
    return selectTargetSceneDocuments(docs, { primaryName: '相柳', aliases: ['防风邶'] }, new Set(['d1'])).map((doc) => doc.id).join(',') === 'd2';
  });
  assertBehavior('performance-card-deduplication', () => normalizePerformanceCards([
    { targetId: 't1', sourceDocId: 'd1', trigger: '被追问感情', excerpt: '他沉默了一瞬。' },
    { targetId: 't1', sourceDocId: 'd1', trigger: '被追问感情', excerpt: '他沉默了一瞬。' },
  ]).length === 1);
  assertBehavior('performance-send-fields-default-all-nine', () => {
    const fields = normalizeKnowledgePerformanceSendFields(undefined);
    return fields.length === 9 && fields[0] === 'situationTags' && fields[8] === 'excerpt';
  });
  assertBehavior('performance-send-fields-preserve-explicit-empty-and-canonical-order', () => {
    const empty = normalizeKnowledgePerformanceSendFields([]);
    const custom = normalizeKnowledgePerformanceSendFields(['speechPattern', 'unknown', 'trigger', 'speechPattern']);
    return empty.length === 0 && custom.join(',') === 'trigger,speechPattern';
  });
  assertBehavior('performance-send-fields-recommended-four', () => {
    const fields = normalizeKnowledgePerformanceSendFields(KNOWLEDGE_PERFORMANCE_RECOMMENDED_FIELDS);
    return fields.join(',') === 'trigger,innerMotive,speechPattern,actionPattern'
      && knowledgePerformanceSendFieldsStatus(fields) === '推荐4项';
  });
  assertBehavior('performance-retrieval-full-but-injection-filtered', () => {
    const card = normalizePerformanceCards([{
      targetId: 't1', sourceDocId: 'd1', situationTags: ['受伤'], relationshipContext: '试探期', trigger: '被发现伤口',
      innerMotive: '不愿让她担心', outwardResponse: '淡淡否认', speechPattern: '简短克制', actionPattern: '藏起手臂', avoid: '不会卖惨', excerpt: '他把手藏进袖中。',
    }])[0];
    const full = performanceCardContent(card);
    const injected = performanceCardInjectionContent(card, ['trigger', 'innerMotive', 'speechPattern', 'actionPattern']);
    return full.includes('情境：受伤') && full.includes('避免行为：不会卖惨') && full.includes('原文证据：他把手藏进袖中。')
      && injected === '触发：被发现伤口；内在动机：不愿让她担心；语言方式：简短克制；动作方式：藏起手臂';
  });
  assertBehavior('performance-injection-empty-when-all-fields-disabled', () => performanceCardInjectionContent({ trigger: '被追问' }, []).length === 0);
  assertBehavior('performance-prompt-editor-renders-nine-send-controls', () => {
    const host = document.createElement('div');
    host.innerHTML = memoryPromptEditorHtml('knowledgePerformance', memorySystemPromptId('knowledgePerformance'));
    return host.querySelectorAll('[data-performance-send-field]').length === 9
      && Boolean(host.querySelector('[data-performance-fields-recommended]'))
      && Boolean(host.querySelector('[data-performance-fields-all]'))
      && host.querySelector('[data-performance-injection-preview]')?.value.includes('触发：');
  });
  assertBehavior('performance-compact-rule-shows-global-field-count', () => {
    const html = memoryPromptCompactHtml('knowledgePerformance', memorySystemPromptId('knowledgePerformance'));
    return html.includes('data-performance-fields-badge') && html.includes(`发送字段 ${knowledgePerformanceSendFields().length}/9`);
  });
  assertBehavior('performance-retrieval-log-distinguishes-full-and-injected-content', () => {
    const html = memoryRetrievalLogsHtml({ retrievalLogs: [{
      query: '受伤了吗', createdAt: '2026-09-11T00:00:00.000Z', performanceQuery: '相柳 受伤',
      performanceSendFields: { labels: ['触发事件', '内在动机'], status: '自定义 2/9' },
      performanceCards: [{ id: 'card-1', sourceName: '剧本', fullContent: '情境：受伤；触发：被发现', injectedContent: '触发：被发现；内在动机：不想示弱' }],
    }] });
    return html.includes('当前发送字段') && html.includes('完整九项命中') && html.includes('最终发送') && html.includes('自定义 2/9');
  });
  assertBehavior('performance-query-uses-latest-four', () => {
    const messages = ['旧一', '旧二', '旧三', '旧四', '近一', '近二', '近三', '近四'].map((text) => ({ text }));
    const query = buildPerformanceRetrievalQuery('现在怎么办？', messages, {
      roleNames: ['相柳', '防风邶'], currentTime: '夜里', currentLocation: '海边', relationships: ['相柳与琳琳已成婚'], openPlots: ['追兵未解决'],
    });
    return !query.includes('旧一') && query.includes('近一') && query.includes('近四') && query.includes('防风邶') && query.includes('海边');
  });
  assertBehavior('performance-profile-all-selected-resident', () => {
    const sections = composeResidentRoleProfiles([
      { targetId: 't1', name: '相柳', content: '克制而护短', sourceName: '原剧本' },
      { targetId: 't2', name: '小夭', content: '敏锐而坚韧', sourceName: '小说' },
    ], ['t1', 't2']);
    return sections.length === 2 && sections.join('\n').includes('相柳') && sections.join('\n').includes('小夭');
  });
  assertBehavior('memory-budget-keeps-whole-sections', () => {
    const result = composeMemorySectionsWithinBudget([
      { id: 'high', text: 'AAAA', priority: 1 },
      { id: 'middle', text: 'BBBB', priority: 2 },
      { id: 'low', text: 'CCCC', priority: 3 },
    ], 10);
    return result.text === 'AAAA\n\nBBBB' && result.includedIds.join(',') === 'high,middle' && !result.text.includes('C');
  });
  assertBehavior('memory-budget-never-drops-required-state', () => {
    const result = composeMemorySectionsWithinBudget([{ id: 'state', text: '当前状态不可截断', priority: 1, required: true }], 4);
    return result.text === '当前状态不可截断' && result.includedIds[0] === 'state';
  });
  assertBehavior('role-profile-trims-on-complete-phrase', () => wholeTextWithinLimit('第一句完整。第二句也完整。第三句不会进入。', 13) === '第一句完整。第二句也完整。');
  assertBehavior('knowledge-scene-chunking-preserves-scene', () => {
    const chunks = chunkKnowledgeScenes('第一场 海边\n相柳：你来了。\n琳琳：嗯。\n\n第二场 山洞\n防风邶：别怕。', 40, 120);
    return chunks.length === 2 && chunks[0].includes('第一场') && chunks[1].includes('第二场');
  });
  assertBehavior('knowledge-three-prompt-purposes', () => ['knowledgePerformance', 'knowledgeProfile', 'knowledgeFacts'].every((target) => MEMORY_PROMPT_TARGETS[target]?.content));
  assertBehavior('knowledge-legacy-prompt-selection-migrates-to-facts', () => {
    const selections = normalizeKnowledgePromptSelections({ knowledgePromptId: 'legacy-knowledge-prompt' });
    return selections.performance === memorySystemPromptId('knowledgePerformance')
      && selections.profile === memorySystemPromptId('knowledgeProfile')
      && selections.facts === 'legacy-knowledge-prompt';
  });
  assertBehavior('knowledge-target-payload-keeps-current-character', () => {
    const payload = extractTargetKnowledgePayload(JSON.stringify({
      performanceCards: [{ targetName: '相柳', trigger: '被追问身份', outwardResponse: '移开话题', excerpt: '他淡淡道，无可奉告。' }],
      aliasCandidates: [{ targetName: '相柳', alias: '防风邶', evidence: '众人称他防风邶。' }],
    }), { id: 'target-current', primaryName: '相柳' }, [{ id: 'd1', text: '众人称他防风邶。他淡淡道，无可奉告。' }], 'g1', '原剧本');
    return payload.performanceCards[0]?.targetId === 'target-current'
      && payload.aliasCandidates[0]?.targetId === 'target-current'
      && payload.aliasCandidates[0]?.evidenceDocIds[0] === 'd1';
  });
  assertBehavior('knowledge-target-payload-accepts-snake-case-data-wrapper', () => {
    const payload = extractTargetKnowledgePayload(JSON.stringify({ data: {
      performance_cards: [{
        target_name: '相柳', situation_tags: ['被识破身份'], relationship_context: '试探期',
        trigger_event: '小夭追问身份', inner_motive: '不愿暴露软肋', outward_response: '转开话题',
        speech_pattern: '短句反问', action_pattern: '先避开目光', avoid_behavior: '直接承认在意',
        original_excerpt: '相柳移开目光，淡淡道。',
      }],
      alias_candidates: [], characters: [], relation_triples: [],
    } }), { id: 'target-current', primaryName: '相柳', aliases: [] }, [{ id: 'doc-1', text: '相柳移开目光，淡淡道。' }], 'group-1', '测试剧本');
    const card = payload.performanceCards[0];
    return card?.targetId === 'target-current'
      && card.situationTags[0] === '被识破身份'
      && card.trigger === '小夭追问身份'
      && card.innerMotive === '不愿暴露软肋'
      && card.sourceDocId === 'doc-1';
  });
  assertBehavior('knowledge-target-payload-distinguishes-recognized-empty-from-unrecognized', () => {
    const target = { id: 'target-current', primaryName: '相柳', aliases: [] };
    const recognized = extractTargetKnowledgePayload('{"performanceCards":[],"aliasCandidates":[],"characters":[],"triples":[]}', target, []);
    const unrecognized = extractTargetKnowledgePayload('{"answer":"没有按照约定字段返回"}', target, []);
    return recognized.schemaRecognized === true
      && shouldAdvanceKnowledgeExtractionBatch(recognized) === true
      && unrecognized.schemaRecognized === false
      && shouldAdvanceKnowledgeExtractionBatch(unrecognized) === false;
  });
  assertBehavior('knowledge-extraction-refuses-unrecognized-response-before-progress', () => {
    let message = '';
    try { validateKnowledgeExtractionBatch({ schemaRecognized: false }, '{"answer":"普通文字"}'); } catch (error) { message = error.message; }
    return message.includes('本批不会计入进度')
      && buildKnowledgeGraphForGroup.toString().includes('validateKnowledgeExtractionBatch(parsed, raw)');
  });
  assertBehavior('knowledge-extraction-recovers-legacy-progress-with-zero-cards', () => {
    const recovered = recoverLegacyEmptyKnowledgeProgress(normalizeKnowledgePerformanceState({
      targetCharacters: [{ id: 'target-current', primaryName: '相柳', enabled: true }],
      performanceCards: [], roleProfiles: [],
      extractionProgress: { status: 'stopped', completed: 50, total: 76, processedByTarget: { 'target-current': { docIds: ['d1', 'd2'], terms: ['相柳'], profileDirty: true } } },
    }, '相柳'));
    const completed = recoverLegacyEmptyKnowledgeProgress(normalizeKnowledgePerformanceState({
      targetCharacters: [{ id: 'target-current', primaryName: '相柳', enabled: true }],
      performanceCards: [], roleProfiles: [],
      extractionProgress: { status: 'ready', completed: 50, total: 50, processedByTarget: { 'target-current': { docIds: ['d1'], terms: ['相柳'] } } },
    }, '相柳'));
    return recovered.recovered === true
      && recovered.discardedProgress === 50
      && recovered.state.extractionProgress.completed === 0
      && recovered.state.extractionProgress.processedByTarget['target-current'].docIds.length === 0
      && completed.recovered === false;
  });
  assertBehavior('knowledge-extraction-stops-after-five-consecutive-empty-card-batches', () => {
    let streak = 0;
    let message = '';
    const empty = { schemaRecognized: true, performanceCards: [] };
    try {
      for (let index = 0; index < 5; index += 1) {
        streak = nextKnowledgeEmptyPerformanceStreak(streak, empty);
        validateKnowledgeEmptyPerformanceStreak(streak);
      }
    } catch (error) { message = error.message; }
    const reset = nextKnowledgeEmptyPerformanceStreak(streak, { schemaRecognized: true, performanceCards: [{ id: 'card-1' }] });
    return message.includes('连续 5 批') && message.includes('当前批不会计入进度') && reset === 0;
  });
  assertBehavior('knowledge-target-batches-respect-budget', () => {
    const batches = batchTargetSceneDocuments([
      { id: 'd1', text: '相柳'.repeat(900) },
      { id: 'd2', text: '防风邶'.repeat(800) },
      { id: 'd3', text: '海边'.repeat(700) },
    ], 5000);
    return batches.length === 2 && batches.every((batch) => batch.reduce((sum, doc) => sum + doc.text.length, 0) <= 5000);
  });
  assertBehavior('knowledge-progress-resume-keeps-cumulative-total', () => {
    const metrics = knowledgeExtractionProgressMetrics({ completed: 3, total: 85 }, 82, false);
    return metrics.resumeFrom === 3
      && metrics.runTotal === 82
      && metrics.overallCompleted === 3
      && metrics.overallTotal === 85
      && metrics.remaining === 82;
  });
  assertBehavior('knowledge-progress-reset-starts-new-total', () => {
    const metrics = knowledgeExtractionProgressMetrics({ completed: 30, total: 85 }, 12, true);
    return metrics.resumeFrom === 0
      && metrics.runTotal === 12
      && metrics.overallCompleted === 0
      && metrics.overallTotal === 12
      && metrics.remaining === 12;
  });
  assertBehavior('knowledge-progress-copy-explains-resume', () => {
    const copy = knowledgeExtractionProgressCopy({
      completed: 3, total: 85, resumeFrom: 3, runCompleted: 0, runTotal: 82,
    }, { stage: 'scenes', target: '相柳', currentStep: 4 });
    return copy.button === '提取场景 4/85'
      && copy.headline === '总进度：已完成 3/85'
      && copy.detail.includes('本次继续：已跳过 3 步')
      && copy.detail.includes('剩余 82 步')
      && copy.current.includes('正在提取第 4 步');
  });
  assertBehavior('knowledge-progress-status-renders-semantic-classes', () => {
    const runningHtml = knowledgeGraphEditorHtml({
      groupId: 'g-running',
      libraryName: '测试剧本',
      targetCharacters: [],
      relationTriples: [],
      characterCatalog: [],
      extractionProgress: { status: 'running', completed: 21, total: 106, runTotal: 84, runCompleted: 0, resumeFrom: 21, stage: '场景提取' },
    });
    const stoppedHtml = knowledgeGraphEditorHtml({
      groupId: 'g-stopped',
      libraryName: '测试剧本',
      targetCharacters: [],
      relationTriples: [],
      characterCatalog: [],
      extractionProgress: { status: 'stopped', completed: 21, total: 106, runTotal: 84, runCompleted: 16, resumeFrom: 21, error: '已停止整理' },
    });
    return runningHtml.includes('knowledge-graph-status is-running')
      && stoppedHtml.includes('knowledge-graph-status is-stopped');
  });
  assertBehavior('knowledge-role-library-renders-three-layers', () => {
    const html = knowledgeGraphEditorHtml({ groupId: 'g-test', libraryName: '测试剧本', targetCharacters: [], relationTriples: [], characterCatalog: [] });
    return html.includes('角色本色') && html.includes('情境演绎') && html.includes('原作事实') && html.includes('添加角色');
  });
  assertBehavior('rag-corpus-detects-current-jsonl-schema-and-skips-empty-text', () => {
    const parsed = parseRagCorpusText([
      JSON.stringify({ scene: '6', major: false, time: '日外', location: '清水镇', people: '相柳、小夭', text: '相柳站在海边。' }),
      JSON.stringify({ scene: '7', people: '小夭', text: '' }),
    ].join('\n'), '相柳语料.jsonl');
    return parsed.fieldMap.text === 'text'
      && parsed.fieldMap.people === 'people'
      && parsed.summary.totalRows === 2
      && parsed.summary.validRows === 1
      && parsed.summary.missingTextRows === 1
      && parsed.entries[0].people.join('、') === '相柳、小夭';
  });
  assertBehavior('rag-corpus-supports-alternate-content-and-character-fields', () => {
    const parsed = parseRagCorpusText([
      JSON.stringify({ title: '酒铺', characters: ['防风邶', '小夭'], content: '防风邶笑着斟酒。' }),
    ].join('\n'), 'alternate.jsonl');
    return parsed.fieldMap.text === 'content'
      && parsed.fieldMap.people === 'characters'
      && parsed.entries[0].scene === '酒铺'
      && parsed.entries[0].people[0] === '防风邶';
  });
  assertBehavior('rag-corpus-classifies-actual-appearance-and-mention-separately', () => {
    const target = { primaryName: '相柳', aliases: ['防风邶'] };
    const appearance = classifyRagCorpusEntry({ text: '防风邶笑着斟酒。', corpusMeta: { people: ['防风邶'] } }, [target]);
    const mention = classifyRagCorpusEntry({ text: '众人谈起相柳。', corpusMeta: { people: ['玱玹'] } }, [target]);
    const missingPeople = classifyRagCorpusEntry({ text: '相柳站在海边。', corpusMeta: { people: [] } }, [target]);
    return appearance.performance === true && appearance.facts === true
      && mention.performance === false && mention.facts === true
      && missingPeople.performance === false && missingPeople.facts === true;
  });
  assertBehavior('rag-corpus-documents-preserve-row-metadata', () => {
    const documents = buildRagCorpusDocuments({
      entries: [{ rowNumber: 3, text: '相柳站在海边。', scene: '12', time: '夜外', location: '海边', people: ['相柳'], major: true }],
      summary: { totalRows: 1, validRows: 1, missingTextRows: 0 },
      fieldMap: { text: 'text', scene: 'scene', time: 'time', location: 'location', people: 'people', major: 'major' },
    }, { groupId: 'rag-test', roleId: 'role-a', fileName: '相柳.jsonl', libraryName: '相柳语料', libraryOrder: 2, currentRoleName: '相柳' });
    return documents.length === 1
      && documents[0].sourceFormat === 'rag-corpus'
      && documents[0].chunkKind === 'corpus'
      && documents[0].corpusMeta.rowNumber === 3
      && documents[0].corpusMeta.people[0] === '相柳'
      && documents[0].corpusImportSummary.validRows === 1;
  });
  assertBehavior('rag-corpus-retrieval-removes-fact-duplicates', () => {
    const partitioned = partitionRagCorpusHits([
      { id: 'appearance', text: '相柳说话。', corpusMeta: { people: ['相柳'] } },
      { id: 'mention', text: '玱玹谈起相柳。', corpusMeta: { people: ['玱玹'] } },
    ], [{ primaryName: '相柳', aliases: [] }]);
    return partitioned.performance.map((item) => item.id).join(',') === 'appearance'
      && partitioned.facts.map((item) => item.id).join(',') === 'mention';
  });
  assertBehavior('rag-corpus-library-renders-ready-source-without-ai-actions', () => {
    const html = knowledgeGraphEditorHtml({
      groupId: 'rag-test', libraryName: '相柳语料', libraryKind: 'RAG语料', sourceFormat: 'rag-corpus',
      corpusImportSummary: { totalRows: 318, validRows: 317, missingTextRows: 1 },
      targetCharacters: [{ id: 'target-current', primaryName: '相柳', locked: true }], relationTriples: [], characterCatalog: [],
    });
    return html.includes('RAG语料') && html.includes('317 条') && html.includes('已可召回') && html.includes('未调用 AI')
      && html.includes('查看语料') && html.includes('检查字段') && html.includes('重新导入')
      && !html.includes('data-build-knowledge-graph') && !html.includes('data-rebuild-knowledge-graph');
  });
  assertBehavior('rag-corpus-import-review-renders-summary-fields-and-preview', () => {
    openChatMemoryDetail(activeChat);
    reviewRagCorpusImport([
      JSON.stringify({ scene: '酒铺', time: '夜', location: '清水镇', people: ['防风邶'], major: false, text: '防风邶笑着斟酒。' }),
      JSON.stringify({ scene: '海边', people: ['相柳'], text: '' }),
    ].join('\n'), '相柳语料.jsonl');
    const modal = detailBody.querySelector('#ragCorpusImportModal');
    const result = Boolean(modal
      && modal.hidden === false
      && modal.querySelector('#ragCorpusImportSummary')?.textContent.includes('有效 1 条')
      && modal.querySelector('#ragCorpusImportSummary')?.textContent.includes('缺少正文 1 条')
      && modal.querySelectorAll('[data-rag-field]').length === 6
      && modal.querySelector('#ragCorpusImportPreview')?.textContent.includes('防风邶笑着斟酒。')
      && modal.querySelector('#confirmRagCorpusImport')?.disabled === false);
    modal?.querySelector('#cancelRagCorpusImport')?.click();
    return result;
  });
  assertBehavior('memory-documents-ready-refreshes-only-open-memory-detail', () => shouldRefreshMemoryDetailAfterDocumentsLoad(true, '长记忆') === true
    && shouldRefreshMemoryDetailAfterDocumentsLoad(false, '长记忆') === false
    && shouldRefreshMemoryDetailAfterDocumentsLoad(true, '预设') === false);
  assertBehavior('knowledge-role-library-renders-in-page-name-dialog', () => {
    const host = document.createElement('div');
    host.innerHTML = knowledgeGraphEditorHtml({ groupId: 'g-test', libraryName: '测试剧本', targetCharacters: [], relationTriples: [], characterCatalog: [] });
    const dialog = host.querySelector('#knowledgeTargetNameModal');
    return Boolean(dialog
      && dialog.hidden
      && dialog.querySelector('#knowledgeTargetNameInput')
      && dialog.querySelector('#saveKnowledgeTargetName')
      && dialog.querySelector('#cancelKnowledgeTargetName'));
  });
  assertBehavior('knowledge-role-library-renders-three-real-prompts', () => {
    const html = knowledgeGraphEditorHtml({ groupId: 'g-test', libraryName: '测试剧本', targetCharacters: [], relationTriples: [], characterCatalog: [] });
    return ['knowledgePerformance', 'knowledgeProfile', 'knowledgeFacts'].every((target) => html.includes(`data-prompt-target="${target}"`));
  });
  assertBehavior('knowledge-recall-limits-default-round-and-clamp', () => {
    const defaults = normalizeKnowledgeRecallSettings({});
    const normalized = normalizeKnowledgeRecallSettings({ performanceRecallLimit: 4.6, factRecallLimit: -2 });
    const invalid = normalizeKnowledgeRecallSettings({ performanceRecallLimit: '不是数字', factRecallLimit: 99 });
    return defaults.performanceRecallLimit === 3
      && defaults.factRecallLimit === 4
      && normalized.performanceRecallLimit === 5
      && normalized.factRecallLimit === 0
      && invalid.performanceRecallLimit === 3
      && invalid.factRecallLimit === 8;
  });
  assertBehavior('knowledge-recall-caps-preserve-rank-and-enforce-total', () => {
    const hits = [
      { id: 'a-1', groupId: 'group-a' },
      { id: 'a-2', groupId: 'group-a' },
      { id: 'b-1', groupId: 'group-b' },
      { id: 'b-2', groupId: 'group-b' },
      { id: 'b-3', groupId: 'group-b' },
      { id: 'c-1', groupId: 'group-c' },
    ];
    const groups = [
      { groupId: 'group-a', performanceRecallLimit: 1 },
      { groupId: 'group-b', performanceRecallLimit: 2 },
      { groupId: 'group-c', performanceRecallLimit: 0 },
    ];
    const selected = applyKnowledgeRecallCaps(hits, groups, 'performanceRecallLimit', 3);
    return selected.map((item) => item.id).join(',') === 'a-1,b-1,b-2';
  });
  assertBehavior('knowledge-role-library-renders-prompt-panel-and-recall-inputs', () => {
    const host = document.createElement('div');
    host.innerHTML = knowledgeGraphEditorHtml({ groupId: 'g-test', libraryName: '测试剧本', targetCharacters: [], relationTriples: [], characterCatalog: [], performanceRecallLimit: 2, factRecallLimit: 5 });
    const panel = host.querySelector('[data-knowledge-prompt-panel]');
    const labels = [...host.querySelectorAll('[data-knowledge-prompt-panel] .memory-prompt-compact-title')].map((item) => item.textContent.trim());
    const performanceInput = host.querySelector('[data-knowledge-recall-limit="performance"]');
    const factInput = host.querySelector('[data-knowledge-recall-limit="facts"]');
    return Boolean(panel)
      && panel.open === false
      && panel.querySelector('summary')?.textContent.includes('查看/编辑提示词')
      && labels.join('|') === '情境演绎提取提示词|角色本色归纳提示词|原作事实与关系提取提示词'
      && performanceInput?.value === '2'
      && factInput?.value === '5';
  });
  assertBehavior('knowledge-library-menu-opens-and-runs-export', () => {
    const host = document.createElement('div');
    host.innerHTML = knowledgeLibraryHeaderActionsHtml();
    let exported = 0;
    bindKnowledgeLibraryActionsMenu(host, { onExport: () => { exported += 1; } });
    host.querySelector('#knowledgeLibraryMenu')?.click();
    const opened = host.querySelector('#knowledgeLibraryActions')?.hidden === false
      && host.querySelector('#knowledgeLibraryMenu')?.getAttribute('aria-expanded') === 'true';
    host.querySelector('#exportKnowledgeLibrary')?.click();
    return opened && exported === 1 && host.querySelector('#knowledgeLibraryActions')?.hidden === true;
  });
  assertBehavior('knowledge-library-export-keeps-derived-data-without-vectors', () => {
    const bundle = createKnowledgeLibraryBundle('role-a', '相柳', [{
      id: 'doc-a', groupId: 'group-a', scope: 'role', roleId: 'role-a', text: '相柳立于海边。', embedding: [0.1, 0.2], embeddingModel: 'old-vector', performanceRecallLimit: 2, factRecallLimit: 5,
      performanceCards: [{ targetId: 'target-xl', sourceDocId: 'doc-a', trigger: '被追问', embedding: [0.3], embeddingModel: 'old-vector' }],
      roleProfiles: [{ targetId: 'target-xl', name: '相柳', evidenceDocIds: ['doc-a'] }],
    }, { id: 'other', groupId: 'other-group', scope: 'role', roleId: 'role-b', text: '不应导出' }], '2026-09-11T00:00:00.000Z');
    const document = bundle.documents[0];
    return bundle.xiangsiKnowledgeLibrary === 1
      && bundle.documents.length === 1
      && bundle.role.name === '相柳'
      && document.roleProfiles[0].name === '相柳'
      && document.performanceRecallLimit === 2
      && document.factRecallLimit === 5
      && !('embedding' in document)
      && !('embeddingModel' in document)
      && !('embedding' in document.performanceCards[0]);
  });
  assertBehavior('rag-corpus-export-keeps-schema-and-row-metadata', () => {
    const bundle = createKnowledgeLibraryBundle('role-a', '相柳', [{
      id: 'rag-row-1', groupId: 'rag-group', scope: 'role', roleId: 'role-a', groupMetadata: true,
      sourceFormat: 'rag-corpus', corpusSchemaVersion: 1, corpusImportSummary: { totalRows: 2, validRows: 1, missingTextRows: 1 },
      corpusFieldMap: { text: 'content', people: 'characters' }, corpusMeta: { rowNumber: 2, people: ['防风邶'], scene: '酒铺' },
      libraryName: '相柳语料', libraryKind: 'RAG语料', text: '防风邶笑着斟酒。', embedding: [0.1], embeddingModel: 'old-vector',
    }], '2026-09-13T00:00:00.000Z');
    const document = bundle.documents[0];
    return document.sourceFormat === 'rag-corpus'
      && document.corpusSchemaVersion === 1
      && document.corpusImportSummary.missingTextRows === 1
      && document.corpusFieldMap.text === 'content'
      && document.corpusMeta.people[0] === '防风邶'
      && !('embedding' in document);
  });
  assertBehavior('rag-corpus-retrieval-log-shows-destination-and-row', () => {
    const html = memoryRetrievalLogsHtml({ retrievalLogs: [{
      query: '他会怎么回应', createdAt: '2026-09-13T00:00:00.000Z',
      ragCorpusHits: [{ id: 'rag-1', sourceName: '相柳语料', destination: '情境参考', rowNumber: 18, people: ['防风邶'], preview: '防风邶笑着斟酒。' }],
    }] });
    return html.includes('RAG语料命中') && html.includes('第 18 行') && html.includes('分配到情境参考') && html.includes('防风邶');
  });
  assertBehavior('knowledge-library-import-appends-and-remaps-document-references', () => {
    const prepared = prepareKnowledgeLibraryImport({
      xiangsiKnowledgeLibrary: 1,
      documents: [{
        id: 'old-meta', groupId: 'old-group', scope: 'role', roleId: 'old-role', libraryName: '旧剧本', libraryOrder: 1, groupMetadata: true, text: '相柳。', performanceRecallLimit: 2, factRecallLimit: 6,
        relationTriples: [{ source: '相柳', relation: '守护', target: '小夭', docId: 'old-raw' }],
        characterCatalog: [{ name: '相柳', docId: 'old-raw' }],
        performanceCards: [{ targetId: 'target-xl', sourceDocId: 'old-raw', sourceGroupId: 'old-group', trigger: '遇险' }],
        roleProfiles: [{ targetId: 'target-xl', name: '相柳', sourceGroupId: 'old-group', evidenceDocIds: ['old-raw'] }],
        aliasCandidates: [{ id: 'alias-a', targetId: 'target-xl', name: '防风邶', evidenceDocIds: ['old-raw'] }],
        extractionProgress: { processedByTarget: { 'target-xl': { docIds: ['old-raw'], terms: ['相柳'] } } },
      }, { id: 'old-raw', groupId: 'old-group', scope: 'role', roleId: 'old-role', libraryName: '旧剧本', libraryOrder: 1, text: '防风邶在酒铺。' }],
    }, 'role-new', [{ id: 'existing', groupId: 'existing-group', scope: 'role', roleId: 'role-new', libraryOrder: 4 }], 'test-import');
    const metadata = prepared.documents.find((item) => item.groupMetadata);
    const raw = prepared.documents.find((item) => item.text === '防风邶在酒铺。');
    return prepared.groupIds.length === 1
      && prepared.groupIds[0] === 'test-import-group-1'
      && prepared.documents.every((item) => item.scope === 'role' && item.roleId === 'role-new' && item.libraryOrder === 5)
      && metadata.relationTriples[0].docId === raw.id
      && metadata.characterCatalog[0].docId === raw.id
      && metadata.performanceCards[0].sourceDocId === raw.id
      && metadata.performanceCards[0].sourceGroupId === prepared.groupIds[0]
      && metadata.roleProfiles[0].evidenceDocIds[0] === raw.id
      && metadata.aliasCandidates[0].evidenceDocIds[0] === raw.id
      && metadata.performanceRecallLimit === 2
      && metadata.factRecallLimit === 6
      && metadata.extractionProgress.processedByTarget['target-xl'].docIds[0] === raw.id;
  });
  assertBehavior('history-memory-shortcut-is-a-reliable-touch-target', () => {
    const shortcut = historyList?.querySelector('.history-memory-button');
    if (!shortcut) return false;
    const fixture = shortcut.cloneNode(false);
    fixture.style.cssText = 'position:fixed;left:-9999px;top:0;visibility:hidden';
    document.body.append(fixture);
    const rect = fixture.getBoundingClientRect();
    const style = window.getComputedStyle(fixture);
    const minHeight = Number.parseFloat(style.minHeight) || 0;
    const measuredHeight = rect.height || minHeight;
    const result = measuredHeight >= 33 && measuredHeight <= 36 && style.touchAction === 'manipulation';
    fixture.remove();
    return result;
  });
  assertBehavior('history-memory-shortcut-shows-feedback-before-heavy-render', () => {
    const button = document.createElement('button');
    button.textContent = '长记忆';
    let pendingOpen = null;
    openHistoryMemoryFromShortcut({ id: 'chat-test' }, button, {
      schedule: (run) => { pendingOpen = run; },
      open: () => {},
      reportError: () => {},
    });
    return button.disabled === true
      && button.textContent === '正在打开…'
      && typeof pendingOpen === 'function';
  });
  assertBehavior('history-memory-shortcut-recovers-after-open-error', () => {
    const button = document.createElement('button');
    button.textContent = '长记忆';
    openHistoryMemoryFromShortcut({ id: 'chat-test' }, button, {
      schedule: (run) => run(),
      open: () => { throw new Error('测试打开失败'); },
      reportError: () => {},
    });
    return button.disabled === false && button.textContent === '长记忆';
  });
  assertBehavior('chat-delete-requires-exact-chat-title', () => {
    const chat = { title: '相柳的新聊天' };
    return isChatDeleteNameConfirmed(chat, '相柳的新聊天') === true
      && isChatDeleteNameConfirmed(chat, '相柳的新聊天 ') === false
      && isChatDeleteNameConfirmed(chat, '别的聊天') === false;
  });
  assertBehavior('chat-delete-dialog-renders-name-confirmation-controls', () => Boolean(
    deleteChatDialog
      && deleteChatTargetName
      && deleteChatNameInput
      && cancelDeleteChatButton
      && confirmDeleteChatButton
      && deleteChatDialog.getAttribute('aria-hidden') === 'true'
  ));
  assertBehavior('knowledge-migration-ignores-raw-child-without-schema', () => knowledgeGroupNeedsMigration([
    { scope: 'role', groupId: 'g1', groupMetadata: true, performanceSchemaVersion: KNOWLEDGE_PERFORMANCE_SCHEMA_VERSION, libraryName: '剧本', libraryKind: '剧本', libraryOrder: 1, relationTriples: [], characterCatalog: [] },
    { scope: 'role', groupId: 'g1', libraryName: '剧本', libraryKind: '剧本', libraryOrder: 1, relationTriples: [], characterCatalog: [] },
  ]) === false);
  assertBehavior('knowledge-migration-detects-legacy-group', () => knowledgeGroupNeedsMigration([
    { scope: 'knowledge', libraryName: '', relationTriples: [] },
  ]) === true);
  assertBehavior('polling-readiness-explains-missing-preset-and-model', () => {
    const readiness = pollingReadinessFor({
      enabled: true,
      mode: 'random',
      randomPersonaIds: ['p1', 'p2'],
      randomApiIds: ['api-a'],
      randomPresetIds: [],
    }, {
      personaVersions: [{ id: 'p1' }, { id: 'p2' }],
    }, [{ id: 'api-a', enabled: true, url: 'https://example.com/v1', key: 'test-key', model: '' }], [{ id: 'preset-a' }], '手动选择');
    return readiness.active === false
      && readiness.missing.includes('给已选 API 选择模型')
      && readiness.missing.includes('至少选择 1 个预设');
  });
  assertBehavior('polling-readiness-uses-valid-selected-api-and-ignores-incomplete-extra', () => {
    const readiness = pollingReadinessFor({
      enabled: true,
      mode: 'random',
      randomPersonaIds: ['p1', 'p2'],
      randomApiIds: ['api-ready', 'api-incomplete'],
      randomPresetIds: ['preset-a'],
    }, {
      personaVersions: [{ id: 'p1' }, { id: 'p2' }],
    }, [
      { id: 'api-ready', enabled: true, url: 'https://example.com/v1', key: 'test-key', model: 'model-a' },
      { id: 'api-incomplete', enabled: true, url: '', key: '', model: '' },
    ], [{ id: 'preset-a' }]);
    return readiness.active === true && readiness.missing.length === 0;
  });
  assertBehavior('chat-light-cache-does-not-repeat-heavy-context-logs', () => {
    const chat = {
      id: 'chat-a', roleId: 'role-a', title: '测试聊天', messages: [{ role: 'user', text: '你好' }],
      contextLogs: [{ id: 'log-a', snippets: [{ content: '很长的完整上下文' }] }],
    };
    const payload = buildChatPersistencePayload([chat], chat, { 'role-a': chat }, { includeContextLogs: false });
    return payload.activeChatsByRole['role-a'] === 'chat-a'
      && !Object.hasOwn(payload.chats[0], 'contextLogs')
      && normalizeChatForCache(chat).contextLogs.length === 1;
  });
  memorySettings.promptLibraries = promptLibrarySnapshot;
  return { ok: failures.length === 0, failures, checks };
}

async function initializeAppData() {
  await runAutomaticDataMigration();
  installFactoryDefaultConfigIfNeeded();
  loadAppStateFromCache(); // 恢复预设、世界书、正则、记忆设置、主题和声音链接
  ensurePresetPromptManagerData(presets.find((preset) => preset.id === 'preset-legacy-default' || preset.legacyDefault === true));
  saveAppStateToCache(); // 将《防重复》和“仅帮答时启用”迁移进已有旧预设缓存
  loadRolesFromCache(); // 刷新后恢复角色与人设（须在 setRole 之前）
  const localChatUpdatedAt = loadChatHistoriesFromCache();
  await loadChatHistoriesFromDatabase(localChatUpdatedAt);
  // v3 会把旧聊天内联提示词迁入全局提示词库；两边同时落盘，重开后仍保持选择且不会重复生成。
  saveAppStateToCache();
  saveChatHistoriesToCache();
  loadApiCache();
  loadDefaultCharacterCards();
  loadPollingState();
  if (ensurePollingDefaults()) savePollingState();
  loadRuntimeLogs();
  loadAppearance();

  loadMemoryDocuments().then(async () => {
    const migratedDocuments = await migrateLegacyKnowledgeDocuments(currentRole.id);
    const recoveredSummaries = chatHistories.reduce((total, chat) => total + recoverMissingSummaryHistoryFromDocuments(chat), 0);
    renderHistory();
    if (shouldRefreshMemoryDetailAfterDocumentsLoad(detailPage?.classList.contains('is-open'), detailTitle?.textContent)) {
      openChatMemoryDetail(activeChat);
    }
    logRuntime('info', 'memory', '本机记忆资料已加载', { documents: memoryDocuments.length, migratedToRole: migratedDocuments });
    if (recoveredSummaries) showToast(`已从本机资料恢复 ${recoveredSummaries} 批总结记录`);
  });
  setRole(currentRole);
  applyAppTheme();
  applyChatAppearance();
  renderMoreSettings();
  loadChatHistory(activeChat);
  updateScrollState();

  // 融合面板初始化
  loadUserIdentities();
  updateUserIdentityRow();
  renderContextLog();
  systemGiftsLoadPromise = loadBundledSystemGifts(); // 安卓 WebView 异步读取内嵌母版，成功后再合并到用户资料
  checkForAvailableUpdateOnLaunch();
  appDataReady = true;
  logRuntime('info', 'app', '应用启动');
  if (new URLSearchParams(location.search).has('memory-self-test')) {
    const result = runXiangsiMemorySelfTests();
    document.documentElement.dataset.memorySelfTest = JSON.stringify(result);
    console[result.ok ? 'info' : 'error']('长记忆自检', result);
  }
}

initializeAppData().catch((error) => {
  appDataReady = true;
  closeDataMigrationOverlay(0);
  console.error('应用资料初始化失败：', error);
  showToast('资料读取遇到问题，原缓存没有被主动删除');
});

// 面板折叠绑定（使用 .sp-toggle 选择器）
groupChatPanel?.querySelector(".sp-toggle")?.addEventListener("click", () => toggleSection(groupChatPanel));
advancedPanel?.querySelector(".sp-toggle")?.addEventListener("click", () => toggleSection(advancedPanel));

// 用户身份点击 → 打开详情 / 上传头像
userIdentityRow?.addEventListener("click", (e) => {
  // 点击头像区域触发上传，其他区域打开设置
  if (e.target.closest(".sp-identity-avatar-wrap") && !e.target.closest("strong")) {
    userAvatarInput?.click();
  } else {
    openSettingsDetail("用户身份");
  }
});
// 头像上传（从融合面板直接上传时，更新当前默认用户身份）
userAvatarInput?.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const dataUrl = await readImageFile(file);
  userProfile.avatar = dataUrl;
  saveUserIdentities();
  updateUserIdentityRow();
});

// 高级选项快捷入口（使用 .sp-adv-item 选择器）
document.querySelectorAll(".sp-adv-item").forEach(btn => {
  btn.addEventListener("click", () => openSettingsDetail(btn.dataset.detail));
});

// 左栏抽屉
openRoles.addEventListener("click", toggleLeftDrawer);

// 点击聊天内容区域自动收起左栏
messages?.addEventListener("click", closeLeftDrawer);
document.querySelector("#sheetScrim")?.addEventListener("click", closeLeftDrawer);
// ••• 按钮直接打开 chatStorePage（不再切换右栏抽屉）
openChatStore.addEventListener("click", () => {
  document.getElementById("chatStorePage")?.classList.add("is-open");
  renderContextLog();
});

rolePersonaInput?.addEventListener('input', updateRoleDescTokens);
appVersionButton?.addEventListener('click', checkForAppUpdate);

// 安卓把 App 切到后台时不一定会触发传统 beforeunload；visibilitychange / pagehide
// 两条都监听，并使用同步的 localStorage 写入，保证系统随后结束进程也能恢复。
function persistAllLocalState() {
  if (!appDataReady) return;
  saveApiCache();
  saveRolesToCache();
  saveChatHistoriesToCache();
  savePollingState();
  saveUserIdentities();
  saveAppStateToCache();
  persistRuntimeLogs();
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') persistAllLocalState();
});
window.addEventListener('pagehide', persistAllLocalState);

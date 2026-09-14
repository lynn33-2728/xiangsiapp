// 静态服务器：服务本文件夹（相柳聊天App 完整打包版）
// 双击「开启预览.bat」即可启动并自动打开测试页
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { URL } = require('url');

// 从隔离的 node workspace 加载 qrcode（用于生成局域网访问二维码）
// 跟随当前用户目录，兼容不同电脑（公司/家里）的用户名
const NODE_MODULES = path.join(os.homedir(), '.workbuddy', 'binaries', 'node', 'workspace', 'node_modules');
let qrcode = null;
try {
  qrcode = require(path.join(NODE_MODULES, 'qrcode'));
} catch (e) {
  console.warn('[相柳聊天App] 未找到 qrcode，二维码功能不可用：', e.message);
}

const ROOT = __dirname;
const PORT = process.env.PORT ? Number(process.env.PORT) : 5193;
const RELEASE_MANIFEST_URL = 'http://114.132.231.174/download/version.json';

// ===== 系统默认人设（配合「电脑开启预览小工具 → 保存默认人设」）=====
// live-personas.json：网页端每次人设变动后实时推送的快照（临时数据）。
// 系统人设.json：用户在启动器点「保存默认人设」后固化下来的系统默认人设；
//               网页启动时会优先于 app.js 内置角色加载它（localStorage 缓存仍会覆盖在其上）。
//               reset 时写入 { personas:null, cleared:true } 标记，网页启动消费后改写为中性内容。
const LIVE_PERSONAS_FILE = path.join(ROOT, 'live-personas.json');
const SYSTEM_PERSONAS_FILE = path.join(ROOT, '系统人设.json');

function readJsonFileSafe(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (_) {
    return null;
  }
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

/** 获取本机所有局域网 IPv4 地址 */
function getLanAddresses() {
  const list = [];
  const ni = os.networkInterfaces();
  for (const name of Object.keys(ni)) {
    for (const addr of ni[name] || []) {
      if (addr.family === 'IPv4' && !addr.internal) {
        list.push({ name, address: addr.address });
      }
    }
  }
  return list;
}

/**
 * 代理请求到目标 URL
 * @param {string} targetUrl
 * @param {object} options
 * @param {Buffer|string|null} body
 * @returns {Promise<{status:number, headers:object, body:Buffer}>}
 */
function proxyRequest(targetUrl, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(targetUrl);
    const lib = url.protocol === 'https:' ? https : http;
    const req = lib.request(
      url,
      {
        method: options.method || 'GET',
        headers: options.headers || {},
        timeout: options.timeout || 120000,
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(chunks),
          });
        });
      }
    );
    req.on('error', reject);
    const abortUpstream = () => {
      const error = new Error('请求已取消');
      error.code = 'ABORT_ERR';
      req.destroy(error);
    };
    if (options.signal?.aborted) abortUpstream();
    else options.signal?.addEventListener('abort', abortUpstream, { once: true });
    req.on('close', () => options.signal?.removeEventListener('abort', abortUpstream));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('请求超时'));
    });
    if (body) req.write(body);
    req.end();
  });
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      try {
        resolve(Buffer.concat(chunks));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function trimApiBase(value, fallback = '') {
  return String(value || fallback).trim().replace(/\/+$/, '');
}

function siliconFlowVoice(settings, voiceOverride = '') {
  const model = String(settings.model || 'FunAudioLLM/CosyVoice2-0.5B').trim();
  const voice = String(voiceOverride || settings.voice || 'alex').trim();
  // SiliconFlow 内置音色需要“模型:音色”格式；克隆音色会直接返回 speech:...。
  if (voice.startsWith('speech:') || voice.startsWith(`${model}:`)) return voice;
  return `${model}:${voice}`;
}

function upstreamErrorMessage(result, fallback) {
  const text = result.body.toString('utf8');
  try {
    const data = JSON.parse(text);
    return data.message || data.error?.message || data.error || text || fallback;
  } catch (_) {
    return text || fallback;
  }
}

function proxyFailureMessage(error) {
  const detail = String(error?.message || '').trim();
  const code = String(error?.code || '').trim();
  if (detail && detail !== '代理请求失败') {
    return code && !detail.includes(code) ? `${detail}（${code}）` : detail;
  }
  return code
    ? `代理无法连接上游服务（${code}）`
    : '代理无法连接上游服务，请检查网络或 API 地址';
}

async function requestSiliconFlowSpeech(settings, text, voiceOverride = '') {
  const apiUrl = trimApiBase(settings.apiUrl, 'https://api.siliconflow.cn/v1');
  const apiKey = String(settings.apiKey || '').trim();
  if (!apiKey) throw Object.assign(new Error('请先填写硅基流动 API 密钥'), { statusCode: 400 });
  if (!text) throw Object.assign(new Error('缺少要朗读的文字'), { statusCode: 400 });

  const target = /\/audio\/speech$/i.test(apiUrl) ? apiUrl : `${apiUrl}/audio/speech`;
  const model = String(settings.model || 'FunAudioLLM/CosyVoice2-0.5B').trim();
  const body = JSON.stringify({
    model,
    input: String(text),
    voice: siliconFlowVoice(settings, voiceOverride),
    response_format: 'mp3',
    speed: 1,
    gain: 0,
  });
  return proxyRequest(target, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg, audio/*, application/json',
      'Content-Length': Buffer.byteLength(body),
    },
    timeout: 45000,
  }, body);
}

function normalizeMinimaxHost(host) {
  const normalized = trimApiBase(host, 'https://api.minimaxi.com');
  return /^https?:\/\/api\.minimax\.chat$/i.test(normalized) ? 'https://api.minimaxi.com' : normalized;
}

function minimaxErrorMessage(result) {
  const data = parseJsonBuffer(result);
  const base = data?.base_resp;
  if (base && Number(base.status_code) !== 0) return `MiniMax 错误 ${base.status_code}: ${base.status_msg || '合成失败'}`;
  return upstreamErrorMessage(result, `MiniMax 请求失败（${result.status}）`);
}

async function requestMinimaxSpeech(settings, text, voiceOverride = '') {
  const apiKey = String(settings.apiKey || '').trim();
  if (!apiKey) throw Object.assign(new Error('请先填写 MiniMax API Key'), { statusCode: 400 });
  if (!text) throw Object.assign(new Error('缺少要朗读的文字'), { statusCode: 400 });
  const host = normalizeMinimaxHost(settings.apiHost);
  const targets = [`${host}/v1/t2a_v2`];
  if (host === 'https://api.minimaxi.com') targets.push('https://api-bj.minimaxi.com/v1/t2a_v2');
  const speed = Math.min(2, Math.max(0.5, Number(settings.speed) || 1));
  const body = JSON.stringify({
    model: String(settings.model || 'speech-02-hd'),
    text: String(text),
    stream: false,
    voice_setting: { voice_id: String(voiceOverride || settings.voice || 'female-shaonv'), speed, vol: 1, pitch: 0 },
    audio_setting: { sample_rate: 32000, bitrate: 128000, format: 'mp3', channel: 1 },
    subtitle_enable: false,
  });
  let result;
  for (const target of targets) {
    result = await proxyRequest(target, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 45000,
    }, body);
    if (result.status !== 404 || target === targets[targets.length - 1]) break;
  }
  if (result.status < 200 || result.status >= 300) {
    const error = new Error(minimaxErrorMessage(result));
    error.statusCode = result.status;
    throw error;
  }
  const data = parseJsonBuffer(result);
  if (data?.base_resp && Number(data.base_resp.status_code) !== 0) {
    throw Object.assign(new Error(`MiniMax 错误 ${data.base_resp.status_code}: ${data.base_resp.status_msg || '合成失败'}`), { statusCode: 502 });
  }
  const audio = String(data?.data?.audio || '');
  if (!audio) throw Object.assign(new Error('MiniMax 未返回音频数据'), { statusCode: 502 });
  const bodyBuffer = /^[0-9a-f]+$/i.test(audio) && audio.length % 2 === 0
    ? Buffer.from(audio, 'hex')
    : Buffer.from(audio, 'base64');
  return { status: 200, headers: { 'content-type': 'audio/mpeg' }, body: bodyBuffer };
}

function normalizeMossHost(host) {
  return trimApiBase(host, 'https://api.mosi.cn');
}

async function requestMossSpeech(settings, text, voiceOverride = '') {
  const apiKey = String(settings.apiKey || '').trim();
  const voiceId = String(voiceOverride || settings.voiceId || '').trim();
  if (!apiKey) throw Object.assign(new Error('请先填写 MOSS API Key'), { statusCode: 400 });
  if (!voiceId) throw Object.assign(new Error('请先填写 MOSS voice_id'), { statusCode: 400 });
  if (!text) throw Object.assign(new Error('缺少要朗读的文字'), { statusCode: 400 });
  const requestBody = JSON.stringify({
    model: String(settings.model || 'moss-tts'),
    input: String(text),
    voice_id: voiceId,
    response_format: settings.responseFormat === 'wav' ? 'wav' : 'mp3',
    delivery_method: 'audio',
  });
  const result = await proxyRequest(`${normalizeMossHost(settings.apiHost)}/v1/audio/speech`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'audio/*, application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    },
    timeout: 60000,
  }, requestBody);
  if (result.status < 200 || result.status >= 300) {
    const error = new Error(upstreamErrorMessage(result, `MOSS 请求失败（${result.status}）`));
    error.statusCode = result.status;
    throw error;
  }
  if (String(result.headers['content-type'] || '').includes('application/json')) {
    const data = parseJsonBuffer(result);
    if (!data?.url) throw Object.assign(new Error('MOSS 返回 JSON 但没有音频 URL'), { statusCode: 502 });
    const audioResult = await proxyRequest(String(data.url), { method: 'GET', headers: { Accept: 'audio/*' }, timeout: 60000 });
    if (audioResult.status < 200 || audioResult.status >= 300) {
      throw Object.assign(new Error(`MOSS 音频下载失败（${audioResult.status}）`), { statusCode: audioResult.status });
    }
    return audioResult;
  }
  return result;
}

function sendAudioProxyResult(res, result) {
  if (result.status < 200 || result.status >= 300) {
    sendJson(res, result.status, {
      message: upstreamErrorMessage(result, `硅基流动请求失败（${result.status}）`),
    });
    return;
  }
  const mimeType = String(result.headers['content-type'] || 'audio/mpeg').split(';')[0];
  sendJson(res, 200, { audio: result.body.toString('base64'), mimeType });
}

function parseJsonBuffer(result) {
  try {
    return JSON.parse(result.body.toString('utf8'));
  } catch (_) {
    return {};
  }
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

async function handleApiProxy(req, res, pathname) {
  try {
    const raw = await readRequestBody(req);
    let payload;
    try {
      payload = JSON.parse(raw.toString() || '{}');
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: '请求体必须是 JSON' }));
      return;
    }

    // 局域网地址查询（GET，无需 body）
    if (pathname === '/api/local-ip') {
      const addresses = getLanAddresses();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ port: PORT, addresses }));
      return;
    }

    // 二维码生成（GET ?text=...&size=...）
    if (pathname === '/api/qr') {
      const u = new URL(req.url, 'http://localhost');
      const text = u.searchParams.get('text') || '';
      const size = Math.min(2000, Math.max(80, Number(u.searchParams.get('size')) || 240));
      if (!text) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: '缺少 text 参数' }));
        return;
      }
      if (!qrcode) {
        res.writeHead(501, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: '服务器未安装 qrcode' }));
        return;
      }
      try {
        const png = await qrcode.toBuffer(text, { margin: 1, width: size });
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(png);
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    // 版本服务器未开放浏览器 CORS；仅代理固定的公开版本清单，不接受任意目标 URL。
    if (pathname === '/api/release-manifest') {
      const result = await proxyRequest(`${RELEASE_MANIFEST_URL}?t=${Date.now()}`, {
        headers: { 'Accept': 'application/json' },
        timeout: 10000,
      });
      if (result.status < 200 || result.status >= 300) {
        sendJson(res, result.status || 502, { error: `版本服务器返回 HTTP ${result.status || 502}` });
        return;
      }
      try {
        sendJson(res, 200, JSON.parse(result.body.toString('utf8').replace(/^\uFEFF/, '')));
      } catch (_) {
        sendJson(res, 502, { error: '版本服务器返回的清单不是有效 JSON' });
      }
      return;
    }

    // ---- 系统默认人设：网页端实时推送当前人设 ----
    if (pathname === '/api/personas/live') {
      const personas = Array.isArray(payload.personas) ? payload.personas : null;
      if (!personas || !personas.length) {
        sendJson(res, 400, { error: '缺少 personas 数组' });
        return;
      }
      try {
        fs.writeFileSync(
          LIVE_PERSONAS_FILE,
          JSON.stringify({ savedAt: new Date().toISOString(), personas }),
          'utf8'
        );
        sendJson(res, 200, { ok: true, count: personas.length });
      } catch (e) {
        sendJson(res, 500, { error: e.message || '写入失败' });
      }
      return;
    }

    // ---- 系统默认人设：启动器「保存默认人设」按钮调用 ----
    if (pathname === '/api/personas/commit') {
      const live = readJsonFileSafe(LIVE_PERSONAS_FILE);
      if (!live || !Array.isArray(live.personas) || !live.personas.length) {
        sendJson(res, 404, { error: '尚无人设数据：请先打开网页（或修改任意人设）后再保存' });
        return;
      }
      try {
        const snapshot = {
          savedAt: new Date().toISOString(),
          count: live.personas.length,
          personas: live.personas,
        };
        fs.writeFileSync(SYSTEM_PERSONAS_FILE, JSON.stringify(snapshot, null, 2), 'utf8');
        console.log('[相柳聊天App] 已固化系统默认人设：' + snapshot.count + ' 个角色');
        sendJson(res, 200, { ok: true, count: snapshot.count, savedAt: snapshot.savedAt });
      } catch (e) {
        sendJson(res, 500, { error: e.message || '写入失败' });
      }
      return;
    }

    // ---- 系统默认人设：网页启动时读取（无文件时返回空，不报错） ----
    if (pathname === '/api/personas/system') {
      const system = readJsonFileSafe(SYSTEM_PERSONAS_FILE);
      sendJson(res, 200, system || { personas: null, cleared: false });
      return;
    }

    // ---- 系统默认人设：启动器「恢复内置人设」按钮调用 ----
    if (pathname === '/api/personas/reset') {
      try {
        fs.writeFileSync(
          SYSTEM_PERSONAS_FILE,
          JSON.stringify({ personas: null, cleared: true, resetAt: new Date().toISOString() }),
          'utf8'
        );
        console.log('[相柳聊天App] 已标记恢复内置人设（下次打开网页时生效并清空角色缓存）');
        sendJson(res, 200, { ok: true });
      } catch (e) {
        sendJson(res, 500, { error: e.message || '写入失败' });
      }
      return;
    }

    // ---- 系统默认人设：网页端消费「恢复内置」标记 ----
    // 不删除文件（避免文件锁/回收站拦截等环境差异），改写为中性内容，
    // 语义等价于「从未保存过系统人设」。
    if (pathname === '/api/personas/consume-reset') {
      try {
        fs.writeFileSync(
          SYSTEM_PERSONAS_FILE,
          JSON.stringify({ personas: null, cleared: false, consumedAt: new Date().toISOString() }),
          'utf8'
        );
        sendJson(res, 200, { ok: true });
      } catch (e) {
        sendJson(res, 500, { error: e.message || '写入失败' });
      }
      return;
    }

    // ---- 语音 API：前端只连接本地服务，由本地服务代转，避免浏览器 CORS ----
    if (pathname === '/api/test-voice' || pathname === '/api/generate-voice') {
      const text = pathname === '/api/test-voice'
        ? `你好，这是${({ siliconflow: '硅基流动', minimax: 'MiniMax', moss: 'MOSS', volcano: '火山引擎' })[payload.engine] || '语音'}连接测试。`
        : String(payload.text || '').trim();
      let result;
      if (payload.engine === 'siliconflow') {
        result = await requestSiliconFlowSpeech(payload.siliconflow || {}, text, payload.voiceId);
      } else if (payload.engine === 'minimax') {
        result = await requestMinimaxSpeech(payload.minimax || {}, text, payload.voiceId);
      } else if (payload.engine === 'moss') {
        result = await requestMossSpeech(payload.moss || {}, text, payload.voiceId);
      } else {
        sendJson(res, 501, { message: `当前本地服务暂未接入语音引擎：${payload.engine || '未选择'}` });
        return;
      }
      sendAudioProxyResult(res, result);
      return;
    }

    if (pathname === '/api/voice-options') {
      if (payload.engine === 'moss') {
        const settings = payload.moss || {};
        const apiKey = String(settings.apiKey || '').trim();
        if (!apiKey) {
          sendJson(res, 400, { message: '请先填写 MOSS API Key' });
          return;
        }
        const result = await proxyRequest(`${normalizeMossHost(settings.apiHost)}/v1/audio/voices?limit=150&status=ready`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${apiKey}`, Accept: 'application/json' },
          timeout: 30000,
        });
        if (result.status < 200 || result.status >= 300) {
          sendJson(res, result.status, { message: upstreamErrorMessage(result, `获取 MOSS 音色失败（${result.status}）`) });
          return;
        }
        const data = parseJsonBuffer(result);
        const source = Array.isArray(data?.data) ? data.data : (Array.isArray(data?.voices) ? data.voices : []);
        const voices = source.map((voice) => ({
          id: String(voice?.id || voice?.voice_id || '').trim(),
          name: String(voice?.name || voice?.display_name || voice?.voice_name || voice?.id || voice?.voice_id || '').trim(),
        })).filter((voice) => voice.id);
        sendJson(res, 200, { voices });
        return;
      }
      if (payload.engine !== 'siliconflow') {
        sendJson(res, 501, { message: '当前仅支持获取硅基流动或 MOSS 的音色列表' });
        return;
      }
      const settings = payload.siliconflow || {};
      const apiUrl = trimApiBase(settings.apiUrl, 'https://api.siliconflow.cn/v1');
      const apiKey = String(settings.apiKey || '').trim();
      if (!apiKey) {
        sendJson(res, 400, { message: '请先填写硅基流动 API 密钥' });
        return;
      }
      const headers = { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/json' };
      const scope = payload.scope === 'models' ? 'models' : 'voices';
      const modelsResult = scope === 'models'
        ? await proxyRequest(`${apiUrl}/models?type=audio`, { method: 'GET', headers, timeout: 30000 })
        : null;
      const voicesResult = scope === 'voices'
        ? await proxyRequest(`${apiUrl}/audio/voice/list`, { method: 'GET', headers, timeout: 30000 })
        : null;
      const failed = [modelsResult, voicesResult].filter(Boolean).find((item) => item.status < 200 || item.status >= 300);
      if (failed) {
        sendJson(res, failed.status, { message: upstreamErrorMessage(failed, `获取语音选项失败（${failed.status}）`) });
        return;
      }
      const modelData = modelsResult ? parseJsonBuffer(modelsResult) : {};
      const voiceData = voicesResult ? parseJsonBuffer(voicesResult) : {};
      const allAudioModels = Array.isArray(modelData.data) ? modelData.data : [];
      const ttsModels = allAudioModels
        .map((item) => typeof item === 'string' ? item : item?.id)
        .filter(Boolean)
        .filter((id) => /cosyvoice|moss-ttsd|indextts|fish[-_ ]?speech|tts/i.test(id))
        .filter((id) => !/sensevoice|transcri|\basr\b|whisper/i.test(id));
      const voices = parseSiliconFlowVoices(voiceData);
      sendJson(res, 200, {
        models: [...new Set(ttsModels)],
        voices,
      });
      return;
    }

    if (pathname === '/api/clone-voice') {
      if (payload.engine !== 'siliconflow') {
        sendJson(res, 501, { message: '当前仅支持通过本地服务克隆硅基流动音色' });
        return;
      }
      const settings = payload.siliconflow || {};
      const apiUrl = trimApiBase(settings.apiUrl, 'https://api.siliconflow.cn/v1');
      const apiKey = String(settings.apiKey || '').trim();
      if (!apiKey || !payload.voiceId || !payload.text || !payload.audio) {
        sendJson(res, 400, { message: '请填写 API 密钥、音色 ID、参考文字并选择音频' });
        return;
      }
      const target = /\/uploads\/audio\/voice$/i.test(apiUrl) ? apiUrl : `${apiUrl}/uploads/audio/voice`;
      const cloneBody = JSON.stringify({
        model: String(settings.model || 'FunAudioLLM/CosyVoice2-0.5B'),
        customName: String(payload.voiceId),
        text: String(payload.text),
        audio: String(payload.audio),
      });
      const result = await proxyRequest(target, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Content-Length': Buffer.byteLength(cloneBody),
        },
        timeout: 120000,
      }, cloneBody);
      if (result.status < 200 || result.status >= 300) {
        sendJson(res, result.status, { message: upstreamErrorMessage(result, `克隆失败（${result.status}）`) });
        return;
      }
      let data = {};
      try { data = JSON.parse(result.body.toString('utf8')); } catch (_) {}
      sendJson(res, 200, { ...data, voiceId: data.uri || data.voiceId || payload.voiceId });
      return;
    }

    if (pathname === '/api/delete-voice') {
      if (payload.engine !== 'siliconflow') {
        sendJson(res, 501, { message: '当前仅支持删除硅基流动官方克隆音色' });
        return;
      }
      const settings = payload.siliconflow || {};
      const apiUrl = trimApiBase(settings.apiUrl, 'https://api.siliconflow.cn/v1');
      const apiKey = String(settings.apiKey || '').trim();
      const voiceId = String(payload.voiceId || '').trim();
      if (!apiKey || !voiceId) {
        sendJson(res, 400, { message: '缺少硅基流动 API 密钥或克隆音色 ID' });
        return;
      }
      const deleteBody = JSON.stringify({ uri: voiceId });
      const result = await proxyRequest(`${apiUrl}/audio/voice/deletions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Content-Length': Buffer.byteLength(deleteBody),
        },
        timeout: 45000,
      }, deleteBody);
      if (result.status < 200 || result.status >= 300) {
        sendJson(res, result.status, { message: upstreamErrorMessage(result, `删除失败（${result.status}）`) });
        return;
      }
      sendJson(res, 200, { ok: true, voiceId });
      return;
    }

    const apiUrl = (payload.apiUrl || '').trim().replace(/\/+$/, '');
    const apiKey = payload.apiKey || '';

    if (!apiUrl) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: '缺少 apiUrl' }));
      return;
    }

    if (pathname === '/api/fetch-models') {
      const targetBase = /\/models$/i.test(apiUrl) ? apiUrl : `${apiUrl}/models`;
      const subType = ['embedding', 'reranker'].includes(String(payload.subType || '')) ? String(payload.subType) : '';
      const target = subType ? `${targetBase}?sub_type=${encodeURIComponent(subType)}` : targetBase;
      const result = await proxyRequest(target, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
      });
      res.writeHead(result.status, {
        'Content-Type': result.headers['content-type'] || 'application/json',
      });
      res.end(result.body);
      return;
    }

    if (pathname === '/api/chat') {
      const target = `${apiUrl}/chat/completions`;
      // 原样转发前端明确提供的推理参数；不再给“无参数”请求偷偷补默认值。
      const { apiUrl: _apiUrl, apiKey: _apiKey, ...chatPayload } = payload;
      const chatBody = JSON.stringify({ ...chatPayload, messages: payload.messages || [] });
      const upstreamController = new AbortController();
      const abortOnClientClose = () => { if (!res.writableEnded) upstreamController.abort(); };
      res.once('close', abortOnClientClose);
      const result = await proxyRequest(target, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
        signal: upstreamController.signal,
      }, chatBody).finally(() => res.removeListener('close', abortOnClientClose));
      res.writeHead(result.status, {
        'Content-Type': result.headers['content-type'] || 'application/json',
      });
      res.end(result.body);
      return;
    }

    if (pathname === '/api/memory-embeddings' || pathname === '/api/memory-rerank') {
      // 前端传入已经解析好的完整接口地址；不要再次追加 /embeddings 或 /rerank。
      const target = apiUrl;
      const { apiUrl: _apiUrl, apiKey: _apiKey, ...memoryPayload } = payload;
      const result = await proxyRequest(target, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
      }, JSON.stringify(memoryPayload));
      res.writeHead(result.status, {
        'Content-Type': result.headers['content-type'] || 'application/json',
      });
      res.end(result.body);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: '未知代理接口' }));
  } catch (err) {
    if (res.destroyed || res.writableEnded || err?.code === 'ABORT_ERR') return;
    const message = proxyFailureMessage(err);
    console.error('[proxy error]', message);
    const status = Number(err.statusCode) || 502;
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ message }));
  }
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

const server = http.createServer(async (req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  // API 代理接口：解决浏览器 CORS 并安全转发密钥
  if (urlPath === '/api/fetch-models' || urlPath === '/api/chat' || urlPath === '/api/memory-embeddings' || urlPath === '/api/memory-rerank' || urlPath === '/api/test-voice' || urlPath === '/api/generate-voice' || urlPath === '/api/clone-voice' || urlPath === '/api/delete-voice' || urlPath === '/api/voice-options' || urlPath === '/api/local-ip' || urlPath === '/api/qr' || urlPath === '/api/release-manifest' || urlPath.startsWith('/api/personas/')) {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
      return;
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    await handleApiProxy(req, res, urlPath);
    return;
  }

  if (urlPath === '/') urlPath = '/index.html';

  // 防目录穿越
  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found: ' + urlPath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream' };
    // 开发阶段禁止浏览器缓存 HTML/CSS/JS，避免改代码后客户端仍显示旧版
    if (ext === '.html' || ext === '.css' || ext === '.js') {
      headers['Cache-Control'] = 'no-store, must-revalidate';
      headers['Pragma'] = 'no-cache';
    }
    res.writeHead(200, headers);
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('[相柳聊天App] serving', ROOT);
  console.log('[相柳聊天App] 本机访问:   http://127.0.0.1:' + PORT + '/');
  const lan = getLanAddresses();
  if (lan.length) {
    console.log('[相柳聊天App] 手机/同网设备访问（同一 WiFi）:');
    lan.forEach((item) => console.log('   http://' + item.address + ':' + PORT + '/   (' + item.name + ')'));
  } else {
    console.log('[相柳聊天App] 未检测到局域网网卡，手机可能无法通过 IP 访问');
  }
});


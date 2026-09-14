import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'xiangsi-memory-self-test-'));
const browser = spawn(edge, [
  '--headless=new',
  `--user-data-dir=${profile}`,
  '--remote-debugging-port=0',
  '--disable-gpu',
  '--no-first-run',
  '--disable-extensions',
  'http://127.0.0.1:5193/?memory-self-test=1',
], { stdio: 'ignore', windowsHide: true });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const activePortFile = path.join(profile, 'DevToolsActivePort');

async function waitForFile(file, timeoutMs = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (fs.existsSync(file)) return;
    if (browser.exitCode != null) throw new Error(`Edge exited before DevTools started (${browser.exitCode})`);
    await delay(100);
  }
  throw new Error('Timed out waiting for Edge DevTools');
}

async function evaluate(wsUrl, expression) {
  const socket = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  const id = 1;
  const result = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timed out waiting for browser self-test result')), 20000);
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id !== id) return;
      clearTimeout(timer);
      resolve(message);
    });
    socket.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression, awaitPromise: true, returnByValue: true } }));
  });
  socket.close();
  if (result.error) throw new Error(result.error.message || 'CDP evaluation failed');
  if (result.result?.exceptionDetails) throw new Error(result.result.exceptionDetails.text || 'Browser evaluation failed');
  return result.result?.result?.value;
}

try {
  await waitForFile(activePortFile);
  const [port] = fs.readFileSync(activePortFile, 'utf8').trim().split(/\r?\n/);
  let pages = [];
  const started = Date.now();
  while (Date.now() - started < 10000) {
    pages = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
    if (pages.some((page) => page.type === 'page' && page.url.includes('127.0.0.1:5193'))) break;
    await delay(100);
  }
  const page = pages.find((item) => item.type === 'page' && item.url.includes('127.0.0.1:5193'));
  if (!page?.webSocketDebuggerUrl) throw new Error('Self-test page was not opened');
  await delay(1000);
  const raw = await evaluate(page.webSocketDebuggerUrl, `new Promise((resolve, reject) => {
    const started = Date.now();
    const timer = setInterval(() => {
      const value = document.documentElement.dataset.memorySelfTest;
      if (value) { clearInterval(timer); resolve(value); }
      else if (Date.now() - started > 15000) { clearInterval(timer); reject(new Error('memory self-test did not finish')); }
    }, 100);
  })`);
  const result = JSON.parse(raw);
  const corpusPath = process.argv[2];
  if (corpusPath) {
    const corpusRaw = fs.readFileSync(corpusPath, 'utf8');
    const corpusResultRaw = await evaluate(page.webSocketDebuggerUrl, `JSON.stringify(parseRagCorpusText(${JSON.stringify(corpusRaw)}, ${JSON.stringify(path.basename(corpusPath))}))`);
    const corpusResult = JSON.parse(corpusResultRaw);
    console.log(`CORPUS: ${corpusResult.summary.validRows}/${corpusResult.summary.totalRows} valid, ${corpusResult.summary.missingTextRows} missing text, fields=${JSON.stringify(corpusResult.fieldMap)}`);
  }
  if (!result.ok) {
    console.error(`FAIL: ${result.failures.length}/${result.checks} long-memory checks failed`);
    result.failures.forEach((failure) => console.error(`- ${failure}`));
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${result.checks}/${result.checks} long-memory checks`);
  }
} finally {
  browser.kill();
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
}

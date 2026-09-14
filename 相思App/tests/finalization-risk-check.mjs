import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const index = read('index.html');
const app = read('app.js');
const builder = read('build-phone-test-apk.ps1');
const publisherRoot = path.resolve(root, '..', '相思发布工具');
const publisherScript = path.join(publisherRoot, '发布核心.ps1');

check(!/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome/i.test(index), 'index.html must not load Font Awesome from cdnjs');
check(index.includes('./assets/vendor/fontawesome/css/fontawesome.min.css?v=97'), 'index.html must load local Font Awesome base CSS');
check(index.includes('./assets/vendor/fontawesome/css/solid.min.css?v=97'), 'index.html must load local Font Awesome solid CSS');

for (const asset of [
  'assets/vendor/fontawesome/css/fontawesome.min.css',
  'assets/vendor/fontawesome/css/solid.min.css',
  'assets/vendor/fontawesome/webfonts/fa-solid-900.woff2',
  'assets/vendor/fontawesome/LICENSE.txt',
  'factory-default-config.js',
  'app-memory.js',
]) {
  check(exists(asset), `missing local asset: ${asset}`);
}

const configIndex = index.indexOf('./factory-default-config.js?v=100');
const memoryIndex = index.indexOf('./app-memory.js?v=100');
const appIndex = index.indexOf('./app.js?v=100');
check(configIndex >= 0 && configIndex < memoryIndex && memoryIndex < appIndex, 'scripts must load in config -> memory -> app order');

check(!app.includes('const FACTORY_DEFAULT_CONFIG_B64 = \'ey'), 'app.js must not contain the embedded factory Base64 payload');
check(!app.includes('async function buildKnowledgeGraphForGroup('), 'app.js must not contain the extracted long-memory implementation');

if (exists('factory-default-config.js')) {
  check(read('factory-default-config.js').includes('globalThis.XIANGSI_FACTORY_DEFAULT_CONFIG_B64'), 'factory config file must publish the payload explicitly');
}
if (exists('app-memory.js')) {
  const memory = read('app-memory.js');
  for (const symbol of ['collectMemoryPlan', 'buildKnowledgeGraphForGroup', 'summarizeChatMemory']) {
    check(memory.includes(`function ${symbol}(`), `app-memory.js must contain ${symbol}`);
  }
}

for (const target of [
  'assets/public/factory-default-config.js',
  'assets/public/app-memory.js',
  'assets/public/assets/vendor/fontawesome/css/fontawesome.min.css',
  'assets/public/assets/vendor/fontawesome/css/solid.min.css',
  'assets/public/assets/vendor/fontawesome/webfonts/fa-solid-900.woff2',
  'assets/public/assets/vendor/fontawesome/LICENSE.txt',
]) {
  check(builder.includes(target), `APK builder must include ${target}`);
}

const preflight = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', publisherScript, '-Action', 'Preflight'], {
  cwd: publisherRoot,
  encoding: 'utf8',
});
check(preflight.status === 0, `publisher preflight must succeed: ${(preflight.stderr || preflight.stdout || '').trim()}`);
const cleanWebRoot = path.join(publisherRoot, 'work', 'clean-web');
for (const script of ['factory-default-config.js', 'app-memory.js', 'app.js']) {
  const output = path.join(cleanWebRoot, script);
  check(fs.existsSync(output), `publisher clean bundle must include ${script}`);
}
const publishedMemory = path.join(cleanWebRoot, 'app-memory.js');
if (fs.existsSync(publishedMemory)) {
  check(fs.readFileSync(publishedMemory, 'utf8').includes('function effectiveMemoryModel('), 'published memory bundle must define effectiveMemoryModel');
}

if (failures.length) {
  console.error(`FAIL (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('PASS: offline icons, script split, and APK asset list are complete');

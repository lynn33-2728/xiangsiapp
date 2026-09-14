import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const appPath = path.resolve('相思App/app.js');
const source = fs.readFileSync(appPath, 'utf8');

const match = source.match(/function computeTransientActionMenuPosition[\s\S]*?\r?\n}\r?\n/);
assert.ok(match, 'app.js should define computeTransientActionMenuPosition() for unified transient menus');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${match[0]}; this.computeTransientActionMenuPosition = computeTransientActionMenuPosition;`, sandbox);

const compute = sandbox.computeTransientActionMenuPosition;
const boundary = { left: 0, top: 0, right: 360, bottom: 640 };
const menu = { width: 120, height: 150 };

const topAnchor = { left: 280, right: 320, top: 40, bottom: 80 };
const topPosition = compute(topAnchor, menu, boundary);
assert.equal(topPosition.placement, 'bottom', 'top-half anchors should open below the button');
assert.ok(topPosition.top >= topAnchor.bottom, 'bottom placement should sit under the anchor');
assert.ok(topPosition.left >= boundary.left + 8, 'menu should stay inside the left boundary');
assert.ok(topPosition.left + topPosition.width <= boundary.right - 8, 'menu should stay inside the right boundary');

const bottomAnchor = { left: 40, right: 80, top: 560, bottom: 600 };
const bottomPosition = compute(bottomAnchor, menu, boundary);
assert.equal(bottomPosition.placement, 'top', 'bottom-half anchors should open above the button');
assert.ok(bottomPosition.top + bottomPosition.height <= bottomAnchor.top, 'top placement should sit above the anchor');

assert.match(source, /function closeTransientActionMenus\s*\(/, 'app.js should define closeTransientActionMenus()');
assert.match(source, /closeTransientActionMenus\(\{ owner:/, 'page and panel transitions should close transient menus by owner');

console.log('PASS: transient action menu rules are present');

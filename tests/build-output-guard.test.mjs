// Written by Kone Tshivhinda & Claude
// Checks how tests/build-output.test.mjs treats a missing dist/: skipped with the build instruction
// on an unbuilt checkout, failed with the same instruction when CI is set. A copy of the test file
// and src/data/services.ts runs in a temporary folder that has no dist/.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MESSAGE = 'dist/ not found: run npm run build before npm test';

// Every dist/ check in tests/build-output.test.mjs is declared with `{ skip: distSkip }`, so the
// expected skip and fail counts follow the test file as checks are added.
const DIST_CHECKS = readFileSync(join(ROOT, 'tests', 'build-output.test.mjs'), 'utf8').split('{ skip: distSkip }').length - 1;

const runWithoutDist = (ci) => {
  const dir = mkdtempSync(join(tmpdir(), 'k-one-build-output-'));
  try {
    mkdirSync(join(dir, 'tests'));
    mkdirSync(join(dir, 'src', 'data'), { recursive: true });
    copyFileSync(join(ROOT, 'tests', 'build-output.test.mjs'), join(dir, 'tests', 'build-output.test.mjs'));
    copyFileSync(join(ROOT, 'src', 'data', 'services.ts'), join(dir, 'src', 'data', 'services.ts'));
    const env = { ...process.env };
    delete env.CI;
    delete env.NODE_TEST_CONTEXT;
    if (ci) env.CI = 'true';
    const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', join('tests', 'build-output.test.mjs')], {
      cwd: dir,
      env,
      encoding: 'utf8',
    });
    return { status: result.status, output: `${result.stdout}\n${result.stderr}` };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

test('build-output.test.mjs declares its dist/ checks with the distSkip option', () => {
  assert.ok(DIST_CHECKS > 0, 'no `{ skip: distSkip }` checks found in tests/build-output.test.mjs');
});

test('without dist/ the build output checks are skipped with the build instruction', () => {
  const { status, output } = runWithoutDist(false);
  assert.equal(status, 0, `expected a pass with skips, got exit ${status}:\n${output}`);
  assert.match(output, new RegExp(`# skipped ${DIST_CHECKS}\\b`), output);
  assert.ok(output.includes(MESSAGE), output);
});

test('without dist/ in CI the build output checks fail with the build instruction', () => {
  const { status, output } = runWithoutDist(true);
  assert.notEqual(status, 0, `expected a failure in CI without dist/:\n${output}`);
  assert.match(output, new RegExp(`# fail ${DIST_CHECKS}\\b`), output);
  assert.ok(output.includes(MESSAGE), output);
});

// Written by Kone Tshivhinda & Claude
// Checks the shape of src/data/repos.json, the GitHub snapshot written by scripts/sync-repos.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SNAPSHOT = fileURLToPath(new URL('../src/data/repos.json', import.meta.url));
const repos = JSON.parse(readFileSync(SNAPSHOT, 'utf8'));

const isStringOrNull = (value) => value === null || typeof value === 'string';
const label = (repo, index) => `entry ${index} (${typeof repo?.name === 'string' ? repo.name : 'unnamed'})`;

test('snapshot is a non-empty array', () => {
  assert.ok(Array.isArray(repos), 'repos.json must contain a JSON array');
  assert.ok(repos.length > 0, 'repos.json must list at least one repository');
});

test('every entry has the expected field types', () => {
  repos.forEach((repo, index) => {
    const at = label(repo, index);
    assert.ok(repo !== null && typeof repo === 'object' && !Array.isArray(repo), `${at}: must be an object`);
    assert.equal(typeof repo.name, 'string', `${at}: name must be a string`);
    assert.equal(typeof repo.description, 'string', `${at}: description must be a string`);
    assert.ok(isStringOrNull(repo.language), `${at}: language must be a string or null`);
    assert.ok(Array.isArray(repo.topics), `${at}: topics must be an array`);
    repo.topics.forEach((topic, t) => {
      assert.equal(typeof topic, 'string', `${at}: topics[${t}] must be a string`);
    });
    assert.ok(isStringOrNull(repo.homepage), `${at}: homepage must be a string or null`);
    assert.equal(typeof repo.fork, 'boolean', `${at}: fork must be a boolean`);
    assert.ok(isStringOrNull(repo.license), `${at}: license must be a string or null`);
  });
});

test('repository names are unique', () => {
  const seen = new Set();
  repos.forEach((repo, index) => {
    assert.ok(!seen.has(repo.name), `${label(repo, index)}: duplicate name "${repo.name}"`);
    seen.add(repo.name);
  });
});

test('repository names are sorted with localeCompare, as sync-repos.mjs writes them', () => {
  const names = repos.map((repo) => repo.name);
  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  names.forEach((name, index) => {
    assert.equal(name, sorted[index], `entry ${index} (${name}): out of order, expected "${sorted[index]}" at this position`);
  });
});

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

// `latestRelease` is optional in the schema but only agentos-studio may carry it, and the
// committed snapshot must hold a real one so the build has a release when GitHub is unreachable.
const RELEASE_REPO = 'agentos-studio';
const RELEASE_FIELDS = ['tag', 'name', 'publishedAt', 'url'];

test('only agentos-studio carries latestRelease', () => {
  repos.forEach((repo, index) => {
    if (repo.name !== RELEASE_REPO) {
      assert.ok(!('latestRelease' in repo), `${label(repo, index)}: latestRelease is only stored on ${RELEASE_REPO}`);
    }
  });
});

test('agentos-studio has a valid latestRelease', () => {
  const studio = repos.find((repo) => repo.name === RELEASE_REPO);
  assert.ok(studio, `repos.json must list ${RELEASE_REPO}`);
  const release = studio.latestRelease;
  assert.ok(release !== null && typeof release === 'object' && !Array.isArray(release), `${RELEASE_REPO}: latestRelease must be an object`);
  assert.deepEqual(Object.keys(release), RELEASE_FIELDS, `${RELEASE_REPO}: latestRelease must have exactly ${RELEASE_FIELDS.join(', ')}`);
  assert.equal(typeof release.tag, 'string', 'latestRelease.tag must be a string');
  assert.ok(release.tag.length > 0, 'latestRelease.tag must not be empty');
  assert.equal(typeof release.name, 'string', 'latestRelease.name must be a string');
  assert.ok(release.name.length > 0, 'latestRelease.name must not be empty');
  assert.equal(typeof release.publishedAt, 'string', 'latestRelease.publishedAt must be a string');
  assert.ok(!Number.isNaN(Date.parse(release.publishedAt)), `latestRelease.publishedAt "${release.publishedAt}" must be a date`);
  assert.equal(
    release.url,
    `https://github.com/konethegreat/${RELEASE_REPO}/releases/tag/${encodeURIComponent(release.tag)}`,
    'latestRelease.url must be the GitHub release page for latestRelease.tag',
  );
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

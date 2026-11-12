// Written by Kone Tshivhinda & Claude
// Unit tests for toSnapshot in scripts/sync-repos.mjs, using GitHub API-shaped fixtures.
import { test } from 'node:test';
import assert from 'node:assert/strict';

// Fails any network access while the module is imported: importing must not run the sync.
const realFetch = globalThis.fetch;
let fetchCalls = 0;
globalThis.fetch = async () => {
  fetchCalls += 1;
  throw new Error('fetch must not be called when sync-repos.mjs is imported');
};
const { toSnapshot } = await import('../scripts/sync-repos.mjs');
globalThis.fetch = realFetch;

// Shaped like entries from GET /users/{user}/repos, including fields the snapshot ignores.
const fixture = () => [
  {
    id: 3,
    name: 'zeta-tool',
    full_name: 'konethegreat/zeta-tool',
    private: false,
    description: 'Last by name.',
    language: 'Rust',
    topics: ['cli', 'rust'],
    homepage: 'https://example.com/zeta',
    fork: false,
    license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT' },
    stargazers_count: 4,
  },
  {
    id: 1,
    name: 'secret-project',
    full_name: 'konethegreat/secret-project',
    private: true,
    description: 'Private, must be dropped.',
    language: 'TypeScript',
    topics: [],
    homepage: 'https://example.com/secret',
    fork: false,
    license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT' },
  },
  {
    id: 2,
    name: 'alpha-site',
    full_name: 'konethegreat/alpha-site',
    private: false,
    description: null,
    language: null,
    topics: ['astro'],
    homepage: '',
    fork: true,
    license: { key: 'other', name: 'Other', spdx_id: 'NOASSERTION' },
  },
  {
    id: 4,
    name: 'Middle-app',
    full_name: 'konethegreat/Middle-app',
    private: false,
    description: 'No licence and no topics field.',
    language: 'Python',
    homepage: null,
    fork: false,
    license: null,
  },
];

test('importing the module does not fetch or sync', () => {
  assert.equal(typeof toSnapshot, 'function');
  assert.equal(fetchCalls, 0);
});

test('private repositories are dropped', () => {
  const names = toSnapshot(fixture()).map((repo) => repo.name);
  assert.ok(!names.includes('secret-project'), 'secret-project is private and must not be listed');
  assert.equal(names.length, 3);
});

test('a NOASSERTION licence becomes null', () => {
  const alpha = toSnapshot(fixture()).find((repo) => repo.name === 'alpha-site');
  assert.equal(alpha.license, null);
});

test('an empty homepage becomes null', () => {
  const alpha = toSnapshot(fixture()).find((repo) => repo.name === 'alpha-site');
  assert.equal(alpha.homepage, null);
});

test('unsorted input comes out sorted by name with localeCompare', () => {
  const names = toSnapshot(fixture()).map((repo) => repo.name);
  assert.deepEqual(names, ['alpha-site', 'Middle-app', 'zeta-tool']);
  assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b)));
});

test('entries have exactly the snapshot fields, in order', () => {
  const [alpha, middle, zeta] = toSnapshot(fixture());
  assert.deepEqual(Object.keys(zeta), ['name', 'description', 'language', 'topics', 'homepage', 'fork', 'license']);
  assert.deepEqual(zeta, {
    name: 'zeta-tool',
    description: 'Last by name.',
    language: 'Rust',
    topics: ['cli', 'rust'],
    homepage: 'https://example.com/zeta',
    fork: false,
    license: 'MIT',
  });
  assert.deepEqual(alpha, {
    name: 'alpha-site',
    description: '',
    language: null,
    topics: ['astro'],
    homepage: null,
    fork: true,
    license: null,
  });
  assert.deepEqual(middle, {
    name: 'Middle-app',
    description: 'No licence and no topics field.',
    language: 'Python',
    topics: [],
    homepage: null,
    fork: false,
    license: null,
  });
});

test('the input is not mutated', () => {
  const input = fixture();
  toSnapshot(input);
  assert.deepEqual(input, fixture());
});

test('output serialises the way the script writes repos.json', () => {
  const written = JSON.stringify(toSnapshot(fixture()), null, 2) + '\n';
  assert.ok(written.startsWith('[\n  {\n    "name": "alpha-site",\n'));
  assert.ok(written.endsWith('}\n]\n'));
});

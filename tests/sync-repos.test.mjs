// Written by Kone Tshivhinda & Claude
// Unit tests for scripts/sync-repos.mjs, using GitHub API-shaped fixtures: toSnapshot, toRelease,
// withLatestRelease, and sync against a mocked fetch and a temporary repos.json.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Fails any network access while the module is imported: importing must not run the sync.
const realFetch = globalThis.fetch;
let fetchCalls = 0;
globalThis.fetch = async () => {
  fetchCalls += 1;
  throw new Error('fetch must not be called when sync-repos.mjs is imported');
};
const { toSnapshot, toRelease, withLatestRelease, sync, RELEASE_REPO } = await import('../scripts/sync-repos.mjs');
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

// Shaped like GET /repos/{owner}/{repo}/releases/latest, including fields toRelease ignores.
const releaseFixture = () => ({
  id: 99,
  tag_name: 'v2.0.0',
  name: 'AgentOS Studio v2.0.0',
  draft: false,
  prerelease: false,
  published_at: '2026-11-13T09:56:25Z',
  html_url: 'https://github.com/konethegreat/agentos-studio/releases/tag/v2.0.0',
  assets: [],
});

const committedRelease = {
  tag: 'v1.0.0',
  name: 'AgentOS Studio v1.0.0',
  publishedAt: '2026-11-01T08:00:00Z',
  url: 'https://github.com/konethegreat/agentos-studio/releases/tag/v1.0.0',
};

const apiRepo = (name) => ({
  name,
  private: false,
  description: `${name} description`,
  language: 'Rust',
  topics: [],
  homepage: '',
  fork: false,
  license: null,
});

const RELEASES_URL = 'https://api.github.com/repos/konethegreat/agentos-studio/releases/latest';
const REPOS_URL = 'https://api.github.com/users/konethegreat/repos?per_page=100&type=owner&sort=pushed';

// A fetch stand-in: `routes` maps a URL to a JSON body, an HTTP status number or an Error to throw.
function mockFetch(routes) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    const route = routes[url];
    if (route instanceof Error) throw route;
    if (typeof route === 'number') return { ok: false, status: route, json: async () => ({ message: 'error' }) };
    if (route === undefined) return { ok: false, status: 404, json: async () => ({ message: 'Not Found' }) };
    return { ok: true, status: 200, json: async () => route };
  };
  return { fetchImpl, calls };
}

// Collects log lines instead of printing them.
const quietLog = () => {
  const lines = [];
  return { lines, log: { log: (...args) => lines.push(args.join(' ')), warn: (...args) => lines.push(args.join(' ')) } };
};

// Runs fn with a temporary repos.json holding `content`, and returns the file text afterwards.
async function withTempSnapshot(content, fn) {
  const dir = await mkdtemp(join(tmpdir(), 'sync-repos-test-'));
  const out = join(dir, 'repos.json');
  try {
    await writeFile(out, content);
    await fn(out);
    return await readFile(out, 'utf8');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const committedSnapshot = () =>
  JSON.stringify(
    [
      {
        name: 'agentos-studio',
        description: 'old',
        language: 'Rust',
        topics: [],
        homepage: null,
        fork: false,
        license: 'MIT',
        latestRelease: committedRelease,
      },
      { name: 'zeta-tool', description: 'old', language: 'Rust', topics: [], homepage: null, fork: false, license: null },
    ],
    null,
    2,
  ) + '\n';

test('toRelease maps tag_name, name, published_at and html_url', () => {
  assert.equal(RELEASE_REPO, 'agentos-studio');
  const release = toRelease(releaseFixture());
  assert.deepEqual(Object.keys(release), ['tag', 'name', 'publishedAt', 'url']);
  assert.deepEqual(release, {
    tag: 'v2.0.0',
    name: 'AgentOS Studio v2.0.0',
    publishedAt: '2026-11-13T09:56:25Z',
    url: 'https://github.com/konethegreat/agentos-studio/releases/tag/v2.0.0',
  });
});

test('toRelease uses the tag when the release has no name', () => {
  assert.equal(toRelease({ ...releaseFixture(), name: null }).name, 'v2.0.0');
  assert.equal(toRelease({ ...releaseFixture(), name: '' }).name, 'v2.0.0');
});

test('toRelease rejects a response without a tag, a valid date or a URL', () => {
  assert.throws(() => toRelease({ message: 'Not Found' }), /tag_name/);
  assert.throws(() => toRelease(null), /tag_name/);
  assert.throws(() => toRelease({ ...releaseFixture(), published_at: 'not a date' }), /published_at/);
  assert.throws(() => toRelease({ ...releaseFixture(), html_url: null }), /html_url/);
});

test('withLatestRelease sets the release on agentos-studio only and leaves the input untouched', () => {
  const repos = [
    { name: 'agentos-studio', license: 'MIT' },
    { name: 'other', license: null, latestRelease: committedRelease },
  ];
  const release = toRelease(releaseFixture());
  assert.deepEqual(withLatestRelease(repos, release), [
    { name: 'agentos-studio', license: 'MIT', latestRelease: release },
    { name: 'other', license: null },
  ]);
  assert.deepEqual(repos[0], { name: 'agentos-studio', license: 'MIT' }, 'input must not be mutated');
  assert.equal(withLatestRelease(repos, null), repos);
});

test('sync writes the fetched list with the fetched latestRelease on agentos-studio', async () => {
  const { fetchImpl, calls } = mockFetch({
    [REPOS_URL]: [apiRepo('zeta-tool'), apiRepo('agentos-studio'), apiRepo('alpha-site')],
    [RELEASES_URL]: releaseFixture(),
  });
  const { log } = quietLog();
  const written = await withTempSnapshot(committedSnapshot(), (out) => sync({ fetchImpl, out, token: 'test-token', log }));
  const repos = JSON.parse(written);
  assert.deepEqual(repos.map((repo) => repo.name), ['agentos-studio', 'alpha-site', 'zeta-tool']);
  assert.deepEqual(Object.keys(repos[0]), ['name', 'description', 'language', 'topics', 'homepage', 'fork', 'license', 'latestRelease']);
  assert.deepEqual(repos[0].latestRelease, toRelease(releaseFixture()));
  assert.equal(repos[0].description, 'agentos-studio description');
  assert.ok(repos.slice(1).every((repo) => !('latestRelease' in repo)), 'only agentos-studio carries latestRelease');
  assert.ok(written.endsWith('}\n]\n'));
  assert.deepEqual(calls.map((call) => call.url).sort(), [RELEASES_URL, REPOS_URL].sort());
  assert.ok(calls.every((call) => call.options.headers.Authorization === 'Bearer test-token'));
});

test('sync keeps the committed latestRelease when the release request fails', async () => {
  for (const failure of [500, 401, new Error('getaddrinfo ENOTFOUND api.github.com')]) {
    const { fetchImpl } = mockFetch({
      [REPOS_URL]: [apiRepo('zeta-tool'), apiRepo('agentos-studio')],
      [RELEASES_URL]: failure,
    });
    const { log, lines } = quietLog();
    const written = await withTempSnapshot(committedSnapshot(), (out) => sync({ fetchImpl, out, log }));
    const studio = JSON.parse(written).find((repo) => repo.name === 'agentos-studio');
    assert.deepEqual(studio.latestRelease, committedRelease, `release failure ${failure} must keep the committed value`);
    assert.equal(studio.description, 'agentos-studio description', 'the repository list is still refreshed');
    assert.ok(lines.some((line) => line.includes('using committed latestRelease')));
  }
});

test('sync leaves repos.json byte-identical when GitHub is unreachable', async () => {
  const offline = new Error('fetch failed');
  const { fetchImpl, calls } = mockFetch({ [REPOS_URL]: offline, [RELEASES_URL]: offline });
  const { log } = quietLog();
  const committed = committedSnapshot().replace(/\n/g, '\r\n');
  const written = await withTempSnapshot(committed, (out) => sync({ fetchImpl, out, log }));
  assert.equal(written, committed);
  assert.equal(calls.length, 2);
});

test('sync with a bad token keeps the committed list and latestRelease', async () => {
  const { fetchImpl } = mockFetch({ [REPOS_URL]: 401, [RELEASES_URL]: 401 });
  const { log } = quietLog();
  const written = await withTempSnapshot(committedSnapshot(), (out) => sync({ fetchImpl, out, token: 'bad', log }));
  assert.equal(written, committedSnapshot());
});

test('sync updates latestRelease on the committed list when only the list request fails', async () => {
  const { fetchImpl } = mockFetch({ [REPOS_URL]: 403, [RELEASES_URL]: releaseFixture() });
  const { log } = quietLog();
  const written = await withTempSnapshot(committedSnapshot(), (out) => sync({ fetchImpl, out, log }));
  const repos = JSON.parse(written);
  assert.deepEqual(repos.map((repo) => repo.description), ['old', 'old'], 'the committed list is kept');
  assert.deepEqual(repos[0].latestRelease, toRelease(releaseFixture()));
});

// Written by Kone Tshivhinda & Claude
// Refreshes src/data/repos.json from the public GitHub API. Public repositories only.
// Also stores the latest GitHub release of agentos-studio as `latestRelease` on that entry.
// Never fails the build: if GitHub is unreachable or rate-limited, the committed snapshot is kept,
// and if the release request fails, the committed `latestRelease` is kept.
// toSnapshot, toRelease, withLatestRelease and sync are exported for tests; the sync runs only
// when this file is executed directly.
import { writeFile, readFile } from 'node:fs/promises';
import { realpathSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const USER = 'konethegreat';
export const RELEASE_REPO = 'agentos-studio';
const OUT = fileURLToPath(new URL('../src/data/repos.json', import.meta.url));

// Turns the GitHub API repository list into snapshot entries: drops private repositories,
// keeps the seven fields the site reads and sorts by name. Pure: no network, no file access,
// and the input array and its objects are left untouched.
export function toSnapshot(apiRepos) {
  return apiRepos
    .filter((r) => !r.private)
    .map((r) => ({
      name: r.name,
      description: r.description ?? '',
      language: r.language ?? null,
      topics: r.topics ?? [],
      homepage: r.homepage || null,
      fork: Boolean(r.fork),
      license: r.license?.spdx_id && r.license.spdx_id !== 'NOASSERTION' ? r.license.spdx_id : null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Turns a GET /repos/{owner}/{repo}/releases/latest response into the `latestRelease` object.
// Throws on a response without a tag, a valid publish date or an https release URL, so the
// caller keeps the committed value. A release without a name falls back to its tag.
export function toRelease(apiRelease) {
  const { tag_name: tag, name, published_at: publishedAt, html_url: url } = apiRelease ?? {};
  if (typeof tag !== 'string' || tag === '') throw new Error('release has no tag_name');
  if (typeof publishedAt !== 'string' || Number.isNaN(Date.parse(publishedAt))) {
    throw new Error('release has no valid published_at');
  }
  if (typeof url !== 'string' || !url.startsWith('https://')) throw new Error('release has no html_url');
  return { tag, name: typeof name === 'string' && name !== '' ? name : tag, publishedAt, url };
}

// Returns a copy of the snapshot with `release` as `latestRelease` on the RELEASE_REPO entry
// and no `latestRelease` on any other entry. With `release` null the snapshot is returned as is.
export function withLatestRelease(repos, release) {
  if (!release) return repos;
  return repos.map((repo) => {
    const { latestRelease, ...rest } = repo;
    return repo.name === RELEASE_REPO ? { ...rest, latestRelease: { ...release } } : rest;
  });
}

async function getJson(fetchImpl, url, headers) {
  const res = await fetchImpl(url, { headers });
  if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
  return res.json();
}

// Fetches the repository list and the latest release, each with its own fallback to the
// committed file, and writes `out` only when a request succeeded and the content changed.
// Never throws: every failure is logged and the committed data is kept.
export async function sync({
  fetchImpl = globalThis.fetch,
  out = OUT,
  token = process.env.GITHUB_TOKEN,
  log = console,
} = {}) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'k-one-site-build' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const before = await readFile(out, 'utf8').catch(() => '');
  let committed = [];
  try {
    const parsed = JSON.parse(before);
    if (Array.isArray(parsed)) committed = parsed;
  } catch {
    committed = [];
  }

  let repos = null;
  try {
    const data = await getJson(fetchImpl, `https://api.github.com/users/${USER}/repos?per_page=100&type=owner&sort=pushed`, headers);
    if (!Array.isArray(data) || data.length === 0) throw new Error('unexpected response');
    repos = toSnapshot(data);
  } catch (err) {
    log.warn(`[sync-repos] skipped, using committed snapshot: ${err.message}`);
  }

  let release = null;
  try {
    release = toRelease(await getJson(fetchImpl, `https://api.github.com/repos/${USER}/${RELEASE_REPO}/releases/latest`, headers));
  } catch (err) {
    log.warn(`[sync-repos] release skipped, using committed latestRelease: ${err.message}`);
  }

  // Nothing fetched, or only a release with no committed list to attach it to: keep the file.
  if (!repos && (!release || committed.length === 0)) return;

  const keptRelease = committed.find((repo) => repo?.name === RELEASE_REPO)?.latestRelease ?? null;
  const result = withLatestRelease(repos ?? committed, release ?? keptRelease);

  const after = JSON.stringify(result, null, 2) + '\n';
  const changed = before.replace(/\r\n/g, '\n') !== after;
  if (changed) await writeFile(out, after);
  const tag = result.find((repo) => repo.name === RELEASE_REPO)?.latestRelease?.tag ?? 'none';
  log.log(`[sync-repos] ${result.length} public repositories, ${RELEASE_REPO} release ${tag}${changed ? ' (updated)' : ' (unchanged)'}`);
}

// True when Node was started with this file as its entry point (`node scripts/sync-repos.mjs`).
// realpathSync resolves symlinks and the path the same way Node does for import.meta.url,
// and pathToFileURL handles Windows drive letters and backslashes.
function isMain() {
  if (!process.argv[1]) return false;
  try {
    return import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href;
  } catch {
    return false;
  }
}

if (isMain()) await sync();

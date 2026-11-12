// Written by Kone Tshivhinda & Claude
// Refreshes src/data/repos.json from the public GitHub API. Public repositories only.
// Never fails the build: if GitHub is unreachable or rate-limited, the committed snapshot is kept.
// toSnapshot is exported for tests; the fetch and write run only when this file is executed directly.
import { writeFile, readFile } from 'node:fs/promises';
import { realpathSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const USER = 'konethegreat';
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

async function sync() {
  try {
    const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'k-one-site-build' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

    const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner&sort=pushed`, { headers });
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('unexpected response');

    const repos = toSnapshot(data);

    const before = await readFile(OUT, 'utf8').catch(() => '');
    const after = JSON.stringify(repos, null, 2) + '\n';
    if (before !== after) await writeFile(OUT, after);
    console.log(`[sync-repos] ${repos.length} public repositories${before !== after ? ' (updated)' : ' (unchanged)'}`);
  } catch (err) {
    console.warn(`[sync-repos] skipped, using committed snapshot: ${err.message}`);
  }
}

if (isMain()) await sync();

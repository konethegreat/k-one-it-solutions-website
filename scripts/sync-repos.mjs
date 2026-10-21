// Written by Kone Tshivhinda & Claude
// Refreshes src/data/repos.json from the public GitHub API. Public repositories only.
// Never fails the build: if GitHub is unreachable or rate-limited, the committed snapshot is kept.
import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const USER = 'konethegreat';
const OUT = fileURLToPath(new URL('../src/data/repos.json', import.meta.url));

try {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'k-one-site-build' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner&sort=pushed`, { headers });
  if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error('unexpected response');

  const repos = data
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

  const before = await readFile(OUT, 'utf8').catch(() => '');
  const after = JSON.stringify(repos, null, 2) + '\n';
  if (before !== after) await writeFile(OUT, after);
  console.log(`[sync-repos] ${repos.length} public repositories${before !== after ? ' (updated)' : ' (unchanged)'}`);
} catch (err) {
  console.warn(`[sync-repos] skipped, using committed snapshot: ${err.message}`);
}

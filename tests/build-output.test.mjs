// Written by Kone Tshivhinda & Claude
// Checks the built site in dist/: the expected pages exist, every HTML page names the company,
// no HTML page contains an em dash or an en dash, /, /work/ and the /about/ footer list every live product from
// src/data/projects.ts, the home page links its dossier cards in order and shows every stack item from
// src/data/content.ts, the dossier count on /about/ and the "technical dossiers" figure on / equal
// the number of /work/<slug>/ pages, and the AgentOS Studio dossier and brief show its README and
// release facts with the test count dated.
// Run `npm run build` before `npm test`.
// Without dist/ these checks are skipped with that instruction, so `npm test` passes on a fresh
// checkout that has not been built (AgentOS Studio runs its done checks in one). When CI is set,
// as GitHub Actions sets it, a missing dist/ fails instead, because CI always builds first.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const SERVICES = join(ROOT, 'src', 'data', 'services.ts');
const PROJECTS = join(ROOT, 'src', 'data', 'projects.ts');
const CONFIG = join(ROOT, 'src', 'config.ts');
const CONTENT = join(ROOT, 'src', 'data', 'content.ts');
const REPOS = join(ROOT, 'src', 'data', 'repos.json');
const BRAND = 'K-ONE IT SOLUTIONS';
const DOSSIERS = ['agentos-studio', 'vigil', 'sajas', 'clearcut', 'timelex'];
const DASHES = [
  { char: '\u2014', name: 'em dash (U+2014)' },
  { char: '\u2013', name: 'en dash (U+2013)' },
];

const MISSING_DIST = 'dist/ not found: run npm run build before npm test';

// The `skip` option for the dist/ tests: false when dist/ exists or in CI, otherwise the reason.
const distSkip = existsSync(DIST) || process.env.CI ? false : MISSING_DIST;

const requireDist = () => {
  assert.ok(existsSync(DIST), MISSING_DIST);
};

// services.ts is TypeScript that imports ../config without an extension, so a .mjs test cannot
// import it. The slugs are read from its source instead: each service in the `serviceDetails`
// array opens with an `id: '<slug>'` line indented four spaces, which is the value
// src/pages/services/[slug].astro uses as the page slug. Nested objects are indented deeper.
const serviceSlugs = () => {
  const source = readFileSync(SERVICES, 'utf8');
  const start = source.indexOf('export const serviceDetails');
  assert.ok(start !== -1, 'src/data/services.ts must export serviceDetails');
  return [...source.slice(start).matchAll(/^ {4}id: '([^']+)'/gm)].map((match) => match[1]);
};

// The live products are read from source the same way. Each `links` entry in src/config.ts is a
// `<key>: '<url>',` line indented two spaces. Each `liveProducts` entry in src/data/projects.ts has a
// `name: '<name>',` line and an `href: links.<key>,` line indented four spaces, so the URL is the
// `links` value for that key. Both files are read inside the dist/ check that uses them, because
// tests/build-output-guard.test.mjs runs this file in a folder that holds only services.ts.
const configLinks = () => {
  const source = readFileSync(CONFIG, 'utf8');
  const start = source.indexOf('export const links = {');
  assert.ok(start !== -1, 'src/config.ts must export links');
  const body = source.slice(start, source.indexOf('};', start));
  return Object.fromEntries([...body.matchAll(/^ {2}(\w+): '([^']+)',/gm)].map((match) => [match[1], match[2]]));
};

const liveProducts = () => {
  const source = readFileSync(PROJECTS, 'utf8');
  const start = source.indexOf('export const liveProducts');
  assert.ok(start !== -1, 'src/data/projects.ts must export liveProducts');
  const body = source.slice(start, source.indexOf('\n];', start));
  const names = [...body.matchAll(/^ {4}name: '([^']+)',/gm)].map((match) => match[1]);
  const keys = [...body.matchAll(/^ {4}href: links\.(\w+),/gm)].map((match) => match[1]);
  assert.ok(names.length > 0, 'no live products found in src/data/projects.ts');
  assert.equal(keys.length, names.length, 'every live product in src/data/projects.ts needs an `href: links.<key>` line');
  const urls = configLinks();
  return names.map((name, index) => {
    const url = urls[keys[index]];
    assert.ok(url, `${name}: links.${keys[index]} is not in src/config.ts`);
    return { name, url };
  });
};

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const htmlFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.isFile() && entry.name.endsWith('.html') ? [path] : [];
  });

const shortPath = (path) => relative(ROOT, path).split(sep).join('/');

const pageFile = (route) => (route === '/' ? join(DIST, 'index.html') : join(DIST, ...route.split('/').filter(Boolean), 'index.html'));

const excerpt = (html, index) =>
  html
    .slice(Math.max(0, index - 40), index + 40)
    .replace(/\s+/g, ' ')
    .trim();

test('service slugs are read from src/data/services.ts', () => {
  const slugs = serviceSlugs();
  assert.ok(slugs.length > 0, 'no service slugs found in src/data/services.ts');
  assert.equal(new Set(slugs).size, slugs.length, `duplicate service slugs: ${slugs.join(', ')}`);
});

test('every expected page is built', { skip: distSkip }, () => {
  requireDist();
  const routes = [
    '/',
    '/services/',
    ...serviceSlugs().map((slug) => `/services/${slug}/`),
    '/work/',
    ...DOSSIERS.flatMap((slug) => [`/work/${slug}/`, `/briefs/${slug}/`]),
    '/about/',
    '/contact/',
    '/privacy/',
  ];
  const expected = [...routes.map(pageFile), join(DIST, '404.html')];
  const missing = expected.filter((file) => !existsSync(file)).map(shortPath);
  assert.deepEqual(missing, [], `pages missing from dist/:\n${missing.join('\n')}`);
});

test(`every HTML page names ${BRAND}`, { skip: distSkip }, () => {
  requireDist();
  const files = htmlFiles(DIST);
  assert.ok(files.length > 0, 'dist/ contains no HTML files: run npm run build before npm test');
  const without = files.filter((file) => !readFileSync(file, 'utf8').includes(BRAND)).map(shortPath);
  assert.deepEqual(without, [], `HTML pages without "${BRAND}":\n${without.join('\n')}`);
});

test('no HTML page contains an em dash or an en dash', { skip: distSkip }, () => {
  requireDist();
  const hits = [];
  for (const file of htmlFiles(DIST)) {
    const html = readFileSync(file, 'utf8');
    for (const { char, name } of DASHES) {
      for (let index = html.indexOf(char); index !== -1; index = html.indexOf(char, index + 1)) {
        hits.push(`${shortPath(file)}: ${name}: ...${excerpt(html, index)}...`);
      }
    }
  }
  assert.deepEqual(hits, [], `dashes found in dist/:\n${hits.join('\n')}`);
});

// The live products band on /work/ is its only `section band-ink` section. Names and URLs are looked
// up inside it, because the dossiers and the repository archive on the same page repeat some of them.
test('/work/ lists every live product by name and URL', { skip: distSkip }, () => {
  requireDist();
  const html = readFileSync(pageFile('/work/'), 'utf8');
  const start = html.indexOf('<section class="section band-ink">');
  assert.ok(start !== -1, '/work/ has no live products band (<section class="section band-ink">)');
  const band = html.slice(start, html.indexOf('</section>', start));
  const missing = liveProducts().flatMap(({ name, url }) => [
    ...(band.includes(`>${escapeHtml(name)}</h3>`) ? [] : [`${name}: no <h3> with the name`]),
    ...(band.includes(`href="${escapeHtml(url)}"`) ? [] : [`${name}: no link to ${url}`]),
  ]);
  assert.deepEqual(missing, [], `live products missing from /work/:\n${missing.join('\n')}`);
});

// The "Live right now" list on / is the section labelled by its `live-title` heading. Names and URLs
// are looked up inside it, because the dossier cards and the footer on the same page repeat some.
test('/ lists every live product by name and URL', { skip: distSkip }, () => {
  requireDist();
  const html = readFileSync(pageFile('/'), 'utf8');
  const start = html.indexOf('aria-labelledby="live-title"');
  assert.ok(start !== -1, '/ has no "Live right now" section (aria-labelledby="live-title")');
  const section = html.slice(start, html.indexOf('</section>', start));
  const missing = liveProducts().flatMap(({ name, url }) => [
    ...(section.includes(`>${escapeHtml(name)}</span>`) ? [] : [`${name}: no <span> with the name`]),
    ...(section.includes(`href="${escapeHtml(url)}"`) ? [] : [`${name}: no link to ${url}`]),
  ]);
  assert.deepEqual(missing, [], `live products missing from /:\n${missing.join('\n')}`);
});

// StatTicker renders the final number on the server as `<span>N</span>` just before its label.
test('the "live deployments" figure on / equals the number of live products', { skip: distSkip }, () => {
  requireDist();
  const html = readFileSync(pageFile('/'), 'utf8');
  const match = html.match(/<span>(\d+)<\/span><\/p><p[^>]*>live deployments<\/p>/);
  assert.ok(match, '/ has no "live deployments" figure');
  assert.equal(Number(match[1]), liveProducts().length, 'the "live deployments" figure on / does not match liveProducts');
});

// The "Live work" list in the site footer starts at its eyebrow and ends at the list's `</ul>`. Each
// product is a link whose text starts with the name, followed by the note in a `<span>`.
test('the footer on /about/ lists every live product by name and URL', { skip: distSkip }, () => {
  requireDist();
  const html = readFileSync(pageFile('/about/'), 'utf8');
  const footerStart = html.indexOf('<footer');
  assert.ok(footerStart !== -1, '/about/ has no <footer>');
  const start = html.indexOf('>Live work</p>', footerStart);
  assert.ok(start !== -1, 'the footer on /about/ has no "Live work" list');
  const list = html.slice(start, html.indexOf('</ul>', start));
  const missing = liveProducts().flatMap(({ name, url }) => [
    ...(list.includes(`>${escapeHtml(name)}<span`) ? [] : [`${name}: no link text with the name`]),
    ...(list.includes(`href="${escapeHtml(url)}"`) ? [] : [`${name}: no link to ${url}`]),
  ]);
  assert.deepEqual(missing, [], `live products missing from the footer on /about/:\n${missing.join('\n')}`);
});

// The home cards come from the dossiers in src/data/dossiers.ts that have a homeCard, ordered by its
// index. Each card links its dossier page from the image, the title and the "Read the dossier" link,
// so the first link to each page is the card's image and the first links must appear in this order.
const HOME_CARD_ORDER = ['/work/sajas/', '/work/clearcut/', '/work/vigil/', '/work/timelex/'];

test('/ links the SA-JAS, ClearCut, Vigil and TimeLex dossiers in that order', { skip: distSkip }, () => {
  requireDist();
  const html = readFileSync(pageFile('/'), 'utf8');
  const positions = HOME_CARD_ORDER.map((href) => ({ href, at: html.indexOf(`href="${href}"`) }));
  const missing = positions.filter(({ at }) => at === -1).map(({ href }) => href);
  assert.deepEqual(missing, [], `/ does not link: ${missing.join(', ')}`);
  const found = [...positions].sort((a, b) => a.at - b.at).map(({ href }) => href);
  assert.deepEqual(found, HOME_CARD_ORDER, 'the dossier links on / are out of order');
});

// The stack list is read from source: `export const stack = [...]` in src/data/content.ts is one line
// of single-quoted strings. The Working stack marquee on / repeats each item as an `<li>` in its
// screen-reader list, which is looked up from the "Working stack" label to the list's `</ul>`.
const stackItems = () => {
  const source = readFileSync(CONTENT, 'utf8');
  const match = source.match(/^export const stack = \[(.*)\];/m);
  assert.ok(match, 'src/data/content.ts must export stack on one line');
  const items = [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]);
  assert.ok(items.length > 0, 'no stack items found in src/data/content.ts');
  return items;
};

test('/ shows every stack item from src/data/content.ts in the Working stack marquee', { skip: distSkip }, () => {
  requireDist();
  const html = readFileSync(pageFile('/'), 'utf8');
  const start = html.indexOf('>Working stack</p>');
  assert.ok(start !== -1, '/ has no "Working stack" marquee');
  const list = html.slice(start, html.indexOf('</ul>', start));
  const missing = stackItems().filter((item) => !list.includes(`<li>${escapeHtml(item)}</li>`));
  assert.deepEqual(missing, [], `stack items missing from /:\n${missing.join('\n')}`);
});

// The /about/ page states the dossier count twice: "The <count> dossiers on this site" in the intro and
// "<Count> technical dossiers" in the credentials, as a word or as digits. Both must equal the number of
// dossier pages, which are the folders under dist/work/ that hold an index.html.
const COUNT_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

const countValue = (text) => (/^\d+$/.test(text) ? Number(text) : COUNT_WORDS.indexOf(text.toLowerCase()));

const dossierPages = () =>
  readdirSync(join(DIST, 'work'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(DIST, 'work', entry.name, 'index.html')))
    .map((entry) => entry.name);

test('the dossier count on /about/ equals the number of /work/<slug>/ dossier pages', { skip: distSkip }, () => {
  requireDist();
  const html = readFileSync(pageFile('/about/'), 'utf8');
  const pages = dossierPages();
  assert.ok(pages.length > 0, 'dist/work/ has no /work/<slug>/ dossier pages');
  const statements = [
    { label: 'intro', match: html.match(/The (\w+) dossiers on this site/) },
    { label: 'credentials', match: html.match(/>\s*(\w+) technical dossiers/) },
  ];
  for (const { label, match } of statements) {
    assert.ok(match, `/about/ has no dossier count in the ${label}`);
    assert.equal(countValue(match[1]), pages.length, `the ${label} on /about/ says "${match[1]}" dossiers, dist/work/ has ${pages.length}: ${pages.join(', ')}`);
  }
});

// The "technical dossiers" figure on / counts every dossier in src/data/dossiers.ts, not only the ones
// with a homeCard, so it must equal the number of /work/<slug>/ dossier pages. StatTicker renders the
// final number on the server as `<span>N</span>` just before its label.
test('the "technical dossiers" figure on / equals the number of /work/<slug>/ dossier pages', { skip: distSkip }, () => {
  requireDist();
  const html = readFileSync(pageFile('/'), 'utf8');
  const pages = dossierPages();
  assert.ok(pages.length > 0, 'dist/work/ has no /work/<slug>/ dossier pages');
  const match = html.match(/<span>(\d+)<\/span><\/p><p[^>]*>technical dossiers<\/p>/);
  assert.ok(match, '/ has no "technical dossiers" figure');
  assert.equal(Number(match[1]), pages.length, `the "technical dossiers" figure on / says ${match[1]}, dist/work/ has ${pages.length}: ${pages.join(', ')}`);
});

// AgentOS Studio is the only project on the site with a `vX.Y.Z` release tag (Vigil uses `P0 v1.0`,
// TimeLex uses `0.1.0`), so matching `v\d+\.\d+\.\d+` across a built page catches any stale or
// hard-coded AgentOS Studio version without false positives from unrelated versions. The home page `/`
// renders the four homeCards and liveProducts (not AgentOS Studio), so it has no `v\d+\.\d+\.\d+`
// string, while `/work/`, `/work/agentos-studio/`, `/about/` and `/briefs/agentos-studio/` must show
// `latestRelease.tag` from src/data/repos.json and no other `v\d+\.\d+\.\d+` string.
const agentosStudioTag = () => {
  const repos = JSON.parse(readFileSync(REPOS, 'utf8'));
  const studio = repos.find((entry) => entry.name === 'agentos-studio');
  assert.ok(studio?.latestRelease?.tag, 'src/data/repos.json must have agentos-studio latestRelease.tag');
  return studio.latestRelease.tag;
};

test('AgentOS Studio pages show latestRelease.tag from src/data/repos.json and no other version string', { skip: distSkip }, () => {
  requireDist();
  const tag = agentosStudioTag();
  const homeHtml = readFileSync(pageFile('/'), 'utf8');
  const homeVersions = homeHtml.match(/v\d+\.\d+\.\d+/g) ?? [];
  assert.deepEqual(homeVersions, [], `/ should not contain an AgentOS Studio version string, found: ${homeVersions.join(', ')}`);
  for (const route of ['/work/', '/work/agentos-studio/', '/about/', '/briefs/agentos-studio/']) {
    const html = readFileSync(pageFile(route), 'utf8');
    assert.ok(html.includes(tag), `${route} does not contain AgentOS Studio latestRelease.tag (${tag})`);
    const versions = html.match(/v\d+\.\d+\.\d+/g) ?? [];
    const stale = versions.filter((v) => v !== tag);
    assert.deepEqual(stale, [], `${route} contains AgentOS Studio version(s) other than ${tag}: ${stale.join(', ')}`);
  }
});

// The AgentOS Studio facts checked against its README and release notes: 13 hub tools, the MIT
// licence, the installer formats of the release, the download site, and the Rust test count, which
// may appear only next to the date it was measured.
const AGENTOS_FACTS = [
  '13 over JSON-RPC 2.0',
  'Source and installers are public under the MIT licence.',
  'Installers for Windows (NSIS and MSI), macOS (Apple Silicon and Intel DMG) and Linux (AppImage, deb and rpm) are on GitHub Releases.',
  'https://agentos-studio-website.erictshivhinda.workers.dev sends each platform to its installer on the latest GitHub release.',
  'Full Rust suite on 11 November 2026: 436 passed, 0 failed, 62 ignored.',
];

test('AgentOS Studio dossier and brief show the README and release facts, with the test count dated', { skip: distSkip }, () => {
  requireDist();
  for (const route of ['/work/agentos-studio/', '/briefs/agentos-studio/']) {
    const html = readFileSync(pageFile(route), 'utf8');
    for (const fact of AGENTOS_FACTS) {
      assert.ok(html.includes(fact), `${route} does not contain "${fact}"`);
    }
  }
  for (const route of ['/', '/work/', '/work/agentos-studio/', '/briefs/agentos-studio/', '/about/']) {
    const html = readFileSync(pageFile(route), 'utf8');
    // Text nodes only: the home page system map has an SVG coordinate y="436".
    const undated = (html.match(/>[^<]*\b436\b[^<]*</g) ?? []).filter((hit) => !hit.includes('11 November 2026: 436 passed'));
    assert.deepEqual(undated, [], `${route} shows the 436 Rust test figure without its measurement date: ${undated.join(' | ')}`);
  }
});

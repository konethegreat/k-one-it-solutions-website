// Written by Kone Tshivhinda & Claude
// Checks the built site in dist/: the expected pages exist, every HTML page names the company,
// and no HTML page contains an em dash or an en dash. Run `npm run build` before `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const SERVICES = join(ROOT, 'src', 'data', 'services.ts');
const BRAND = 'K-ONE IT SOLUTIONS';
const DOSSIERS = ['agentos-studio', 'vigil', 'sajas', 'clearcut', 'timelex'];
const DASHES = [
  { char: '\u2014', name: 'em dash (U+2014)' },
  { char: '\u2013', name: 'en dash (U+2013)' },
];

const requireDist = () => {
  assert.ok(existsSync(DIST), 'dist/ not found: run npm run build before npm test');
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

test('every expected page is built', () => {
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

test(`every HTML page names ${BRAND}`, () => {
  requireDist();
  const files = htmlFiles(DIST);
  assert.ok(files.length > 0, 'dist/ contains no HTML files: run npm run build before npm test');
  const without = files.filter((file) => !readFileSync(file, 'utf8').includes(BRAND)).map(shortPath);
  assert.deepEqual(without, [], `HTML pages without "${BRAND}":\n${without.join('\n')}`);
});

test('no HTML page contains an em dash or an en dash', () => {
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

<!-- Written by Kone Tshivhinda & Claude -->
<div align="center">

# K-ONE IT SOLUTIONS

**Your vision, our code.**

An independent software studio in Johannesburg, South Africa, building AI systems, web and mobile apps, and cloud infrastructure that are auditable, cost-capped and built to last.

[**Live site**](https://k-one-it-solutions-website.erictshivhinda.workers.dev) · [Services](https://k-one-it-solutions-website.erictshivhinda.workers.dev/services/) · [Work](https://k-one-it-solutions-website.erictshivhinda.workers.dev/work/) · [Contact](https://k-one-it-solutions-website.erictshivhinda.workers.dev/contact/)

</div>

---

## What the site covers

| Page | Purpose |
| --- | --- |
| Home | Who we are, the live proof, services at a glance, featured work |
| Services | Six service lines, the four working rules and the four-step process |
| Work | Five evidence dossiers, the live products, and every public repository, searchable and filterable with honest status labels |
| About | The founder, working principles, timeline, current builds, skills and credentials |
| Contact | Direct lines, what happens next and an enquiry form |
| Privacy | Plain-language notice (no cookies, no analytics, no ad scripts) |
| Briefs | Two-page A4 technical PDFs for each dossier at `/briefs/<slug>.pdf` |

### Services

1. AI agents and workflow automation
2. RAG and document intelligence
3. Web and mobile applications
4. Cloud, DevOps and CI/CD
5. Local and sovereign AI
6. QA, testing and technical support

## Tech stack

- [Astro](https://astro.build) 7, static output, with React islands where the page needs interactivity
- [Tailwind CSS](https://tailwindcss.com) v4 with CSS-variable theme tokens
- [Framer Motion](https://www.framer.com/motion/) for the hero system map, stat ticker and circular navigation (all respect reduced-motion settings)
- Light theme by default with a dark-mode toggle that remembers the choice
- Self-hosted fonts (Inter Variable, Instrument Serif and its italic, JetBrains Mono), no third-party requests
- [Sharp](https://sharp.pixelplumbing.com/) optimises screenshots and the portrait at build time
- Hosted on [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) (free plan)
- GitHub Actions build check on every push and pull request

No PHP, no database, no server code. The site builds to plain files in `dist/`.

## Project layout

```
.
├── public/
│   ├── briefs/             generated A4 technical brief PDFs
│   └── ...                 favicons, social image, web manifest, Cloudflare _headers
├── scripts/
│   └── sync-repos.mjs      refreshes the public repository snapshot at build time
├── src/
│   ├── assets/             logo, portrait and dossier screenshots, optimised by Astro
│   ├── components/         header, footer, circular nav, cards, explorer, diagrams
│   ├── data/               content, services, dossiers, projects, about, repos.json
│   ├── layouts/Base.astro  SEO tags, theme script, page shell
│   ├── pages/              home, services, work, briefs, about, contact, privacy, 404
│   ├── styles/global.css   design tokens and shared classes
│   └── config.ts           company details, contact info and links
├── astro.config.mjs
├── wrangler.jsonc          Cloudflare deployment configuration
└── .github/workflows/ci.yml
```

## Develop

Requires Node 22.12 or newer.

```sh
npm ci
npm run dev        # local dev server
npm run build      # refresh project list, type-check, build to dist/
npm run preview    # serve the built site locally
npm test           # content tests in tests/ (node:test, no extra dependencies)
```

## Where to change things

| To change | Edit |
| --- | --- |
| Phone, email, links, company details | `src/config.ts` |
| Services and process | `src/data/services.ts` and `src/data/content.ts` |
| Dossier copy, screenshots and PDF content | `src/data/dossiers.ts` and `src/components/diagrams/` |
| About intro, principles, timeline, credentials | `src/data/about.ts` and `src/data/content.ts` |
| Project titles, summaries, categories and featured projects | `src/data/projects.ts` |
| Colours, fonts, spacing | `src/styles/global.css` |
| Public site address (sitemap, canonical links, social image) | `SITE_URL` in `astro.config.mjs`, or the `SITE_URL` environment variable at build time |

### Work, dossiers and live links

The Work page leads with five dossiers: AgentOS Studio, Vigil, SA-JAS, ClearCut and TimeLex. Each has its own page with screenshots, architecture, decisions and an honest status. Below the dossiers is the live products band and the searchable archive of every public repository.

`npm run build` first runs `scripts/sync-repos.mjs`, which reads the public repositories of the GitHub profile and updates `src/data/repos.json`. If GitHub is unreachable or rate-limited, the committed snapshot is used and the build continues. Only public repositories are ever listed. The filter, field selection and sort live in the exported pure function `toSnapshot(apiRepos)`, which `tests/sync-repos.test.mjs` covers with a fixture; the fetch and write run only when the script is executed directly, so importing it never calls GitHub. A new public repository appears in the archive automatically; add an entry to `curated` in `src/data/projects.ts` to give it a title, summary, category, `status`, `liveUrl` and `highlights`.

The same script also reads `GET /repos/konethegreat/agentos-studio/releases/latest` and stores the result as `latestRelease` on the `agentos-studio` entry of `src/data/repos.json`, and on no other entry:

| Field | From the GitHub API | Example |
|---|---|---|
| `tag` | `tag_name` | `v1.2.6` |
| `name` | `name` (the tag when the release has no name) | `AgentOS Studio v1.2.6` |
| `publishedAt` | `published_at` | `2026-11-13T09:56:25Z` |
| `url` | `html_url` | `https://github.com/konethegreat/agentos-studio/releases/tag/v1.2.6` |

The release request has its own fallback, the same as the repository list: if it fails on its own (an error status or a response without a tag), the committed `latestRelease` is kept while the repository list still refreshes, and if both requests fail (GitHub unreachable, rate-limited or a bad `GITHUB_TOKEN`) `src/data/repos.json` is left byte for byte as committed and the build continues. In the site code the entry type is `RepoSnapshot` (with an optional `latestRelease: LatestRelease`), exported from `src/data/projects.ts`. The mapping lives in the exported `toRelease(apiRelease)` and `withLatestRelease(repos, release)`, and `tests/sync-repos.test.mjs` runs the exported `sync()` against a mocked fetch for the success and failure cases. `tests/repos-snapshot.test.mjs` checks that the committed `agentos-studio` entry has a `latestRelease` with exactly these four fields and a `url` matching its `tag`.

### Technical briefs

`/briefs/<slug>/` is a print-first A4 layout. It is `noindex` and points its canonical at the matching dossier. The committed PDFs in `public/briefs/` are generated from those pages with headless Chrome:

```sh
npm run build
npm run preview
"/c/Program Files/Google/Chrome/Application/chrome.exe" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=6000 \
  --print-to-pdf=public/briefs/vigil.pdf \
  http://localhost:4321/briefs/vigil/
```

Repeat for `agentos-studio`, `sajas`, `clearcut` and `timelex`, using the Chrome path for your operating system. Each brief must stay exactly two A4 pages; check the page count and inspect page two after regenerating.

### The contact form

By default the form opens the visitor's email app with the message filled in, so nothing is collected by the site. To use a hosted form service instead, create a [Formspree](https://formspree.io) form and paste its URL into `formEndpoint` in `src/config.ts`. The privacy page updates itself to match.

## Deploy

Production runs on Cloudflare, connected to this repository through Workers Builds.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Worker name | `k-one-it-solutions-website` (must match `wrangler.jsonc`) |
| Environment variable | `NODE_VERSION` = `22` if the build asks for it |

Every push to `main` builds and deploys the site. To use a custom domain later, add it under the Worker's **Settings → Domains & Routes** and update `SITE_URL`.

## Continuous integration

`.github/workflows/ci.yml` runs `npm ci`, `npm run build` (type-check included) and `npm test` on pushes to `main` and on pull requests, so a broken change is caught before it deploys. `tests/build-output.test.mjs` reads `dist/`, so run `npm run build` before `npm test` locally too: it checks that every page (each service from `src/data/services.ts`, each dossier and brief, and `404.html`) is built, that every HTML page names "K-ONE IT SOLUTIONS" and that no page contains an em dash or an en dash. On a checkout that has not been built, those three checks are skipped with the message "dist/ not found: run npm run build before npm test", so `npm test` still passes there; when `CI` is set (GitHub Actions sets it) a missing `dist/` fails them instead. `tests/build-output-guard.test.mjs` covers both cases.

## History

The first version of this site was static HTML with a PHP contact handler. It was retired in October 2026 in favour of the current build and is preserved on the [`legacy/php-site`](../../tree/legacy/php-site) branch for reference.

## Contact

**Kone Tshivhinda**, founder
Email: [erictshivhinda@gmail.com](mailto:erictshivhinda@gmail.com) · Phone: [+27 81 302 5435](tel:+27813025435)
[GitHub](https://github.com/konethegreat) · [LinkedIn](https://www.linkedin.com/in/kone-tshivhinda-32a760233) · [Portfolio](https://konethegreat.github.io)

© K-ONE IT SOLUTIONS. All rights reserved.

---

Written by Kone Tshivhinda & Claude

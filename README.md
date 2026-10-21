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
| Home | Who we are, the proof points, services at a glance, featured work |
| Services | Six service lines, the four working rules and the four-step process |
| Work | Every public repository on the [GitHub profile](https://github.com/konethegreat), searchable and filterable, with honest status labels |
| About | The founder, skills, certifications and timeline |
| Contact | Phone, email and an enquiry form |
| Privacy | Plain-language notice (no cookies, no analytics, no ad scripts) |

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
- [Framer Motion](https://www.framer.com/motion/) for the hero animation (respects reduced-motion settings)
- Light theme by default with a dark-mode toggle that remembers the choice
- Self-hosted fonts (Inter, Space Grotesk, JetBrains Mono), no third-party requests
- Hosted on [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) (free plan)
- GitHub Actions build check on every push and pull request

No PHP, no database, no server code. The site builds to plain files in `dist/`.

## Project layout

```
.
├── public/                 favicons, social image, web manifest, Cloudflare _headers
├── scripts/
│   └── sync-repos.mjs      refreshes the public repository snapshot at build time
├── src/
│   ├── assets/             logo files
│   ├── components/         Header, Footer, Logo, cards, project explorer, hero visual
│   ├── data/               content.ts, projects.ts, repos.json
│   ├── layouts/Base.astro  SEO tags, theme script, page shell
│   ├── pages/              index, services, work, about, contact, privacy, 404, robots.txt
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
```

## Where to change things

| To change | Edit |
| --- | --- |
| Phone, email, links, company details | `src/config.ts` |
| Services, principles, process, skills, About timeline | `src/data/content.ts` |
| Project titles, summaries, categories and the featured projects | `src/data/projects.ts` |
| Colours, fonts, spacing | `src/styles/global.css` |
| Public site address (sitemap, canonical links, social image) | `SITE_URL` in `astro.config.mjs`, or the `SITE_URL` environment variable at build time |

### The project list

`npm run build` first runs `scripts/sync-repos.mjs`, which reads the public repositories of the GitHub profile and updates `src/data/repos.json`. If GitHub is unreachable or rate-limited, the committed snapshot is used and the build continues. Only public repositories are ever listed. A new public repository appears on the Work page automatically; add an entry to `curated` in `src/data/projects.ts` to give it a title, summary and category.

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

`.github/workflows/ci.yml` runs `npm ci` and `npm run build` (type-check included) on pushes to `main` and on pull requests, so a broken change is caught before it deploys.

## History

The first version of this site was static HTML with a PHP contact handler. It was retired in October 2026 in favour of the current build and is preserved on the [`legacy/php-site`](../../tree/legacy/php-site) branch for reference.

## Contact

**Kone Tshivhinda**, founder
Email: [erictshivhinda@gmail.com](mailto:erictshivhinda@gmail.com) · Phone: [+27 81 302 5435](tel:+27813025435)
[GitHub](https://github.com/konethegreat) · [LinkedIn](https://www.linkedin.com/in/kone-tshivhinda-32a760233) · [Portfolio](https://konethegreat.github.io)

© K-ONE IT SOLUTIONS. All rights reserved.

---

Written by Kone Tshivhinda & Claude

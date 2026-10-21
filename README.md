# K-ONE IT SOLUTIONS website

Source for the K-ONE IT SOLUTIONS company website: an independent software studio in Johannesburg building AI systems, web and mobile apps, and cloud infrastructure.

- **Stack:** [Astro](https://astro.build) (static output) with React islands, Tailwind CSS v4 and Framer Motion
- **Pages:** Home, Services, Work, About, Contact, Privacy and a 404
- **Theme:** light by default, with a dark-mode toggle that remembers the choice
- **Hosting:** Cloudflare Workers Static Assets (free plan). The site builds to plain static files in `dist/`.
- **No tracking:** no cookies, analytics or ad scripts

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
| Project titles, summaries, categories and the six featured projects | `src/data/projects.ts` |
| Colours, fonts, spacing | `src/styles/global.css` |
| Public site address (sitemap, canonical links, social image) | `SITE_URL` in `astro.config.mjs`, or the `SITE_URL` environment variable at build time |

### The project list

`npm run build` first runs `scripts/sync-repos.mjs`, which reads the public repositories of the GitHub profile and updates `src/data/repos.json`. If GitHub is unreachable or rate-limited, the committed snapshot is used and the build continues. Only public repositories are ever listed. A new public repository appears on the Work page automatically; add an entry to `curated` in `src/data/projects.ts` to give it a title, summary and category.

### The contact form

By default the form opens the visitor's email app with the message filled in, so nothing is collected by the site. To use a hosted form service instead, create a [Formspree](https://formspree.io) form and paste its URL into `formEndpoint` in `src/config.ts`. The privacy page updates itself to match.

## Deploy on Cloudflare (free)

1. In the Cloudflare dashboard open **Workers & Pages**, choose **Create**, then **Import a repository**, and pick this repository.
2. Set the production branch to `main`.
3. Build command: `npm run build`
4. Deploy command: `npx wrangler deploy` (configuration is in `wrangler.jsonc`)
5. Environment variable: `NODE_VERSION` = `22` if the build asks for it.

Every push to `main` then builds and deploys the site. Other branches get preview builds.

## History

The previous PHP and plain-HTML version of the site is preserved on the `legacy/php-site` branch.

---

Written by Kone Tshivhinda & Claude

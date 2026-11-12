# AgentOS working plan: phases

This plan keeps the site design exactly as it is. Every phase changes content, data plumbing, tests or docs only: no layout, page structure, component, style, colour, font, image or animation changes, and no dependency swaps. Facts come only from `gh repo list konethegreat`, each repository's README and GitHub releases, and the live sites. Credit stays with Kone Tshivhinda and K-ONE IT SOLUTIONS.

State found on 2026-11-12: CI on `main` is green (`npm ci` and `npm run build`, which runs `astro check`). The repository has no test script and no tests. There are no open issues and no open pull requests.

## Phase 1: Content tests on the existing build

The build passes, but nothing checks the data files or the rendered content. Add a dependency-free test suite with the Node built-in test runner (`node --test`), run it in CI after the build, and cover the repository snapshot, the sync script and the built pages, so the content changes in later phases are caught when they break something.

Done when: `npm test` exists in `package.json`, runs in `.github/workflows/ci.yml` after `npm run build`, passes locally and in CI, and covers `src/data/repos.json`, `scripts/sync-repos.mjs` and the pages in `dist/`.

## Phase 2: Move hard-coded project facts into the data files

Project facts are repeated as literal copy in pages and components: the live products list exists three times (`src/pages/index.astro`, `src/pages/work.astro`, `src/components/Footer.astro`), the home page keeps its own four-dossier array with statuses and summaries, `src/data/about.ts` says "four dossiers" while `src/data/dossiers.ts` has five, and the AgentOS Studio version is typed by hand in `src/data/projects.ts` and `src/data/dossiers.ts`. Move each fact into the existing data files and the existing sync script, keeping the rendered markup identical.

Done when: the live products list, the home dossier cards and every dossier count come from `src/data/`, the latest AgentOS Studio release is written by `scripts/sync-repos.mjs` into `src/data/repos.json` and read from there, no page or component holds a literal project status or version, and the Phase 1 tests plus new tests for each move pass.

## Phase 3: Bring project and release content up to date

With the facts in one place, update them from checkable sources: refresh the repository snapshot (it is missing `agentos-studio-website` and `animation-and-game-studio`), show the latest AgentOS Studio release (1.2.3 per the owner's brief; `gh release list` showed v1.2.4 as Latest on 2026-11-12, and the brief says to always follow the latest release), curate the new public repositories, and re-check each dossier's status rows and highlights against its repository README and releases.

Done when: every curated project and dossier fact in `src/data/projects.ts` and `src/data/dossiers.ts` cites a README, release or live site checked in the pull request that changed it, the snapshot matches `gh repo list konethegreat` (public repositories only), the AgentOS Studio brief PDF matches its dossier, and the build and all tests pass.

## Phase 4: Services, skills, experience and links

Check the studio and founder content against the public record: the services in `src/data/services.ts`, the skills and timeline in `src/data/content.ts`, the about data and credentials in `src/data/about.ts`, and the links in `src/config.ts`. Change only what a source shows is wrong or missing, and remove nothing a source still supports.

Done when: each of those files has been reviewed in its own pull request that lists the source for every changed line, every link in `src/config.ts` resolves or has been replaced from a source, and the build and all tests pass.

## Phase 5: Docs match the code

After the data moves and content updates, the README tables ("What the site covers", "Where to change things", "Work, dossiers and live links") and the project layout drift from the code. Bring the Markdown back in line and keep `docs/agentos/` current.

Done when: every path, command and data file named in `README.md` exists and does what the README says, `docs/agentos/TASKS.md` has every finished task ticked, and `docs/agentos/REPORT.md` has one line per merged pull request.

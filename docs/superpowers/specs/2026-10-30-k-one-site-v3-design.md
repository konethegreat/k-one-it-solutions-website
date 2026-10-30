# K-ONE Site v3: Proof in the open

Date: 2026-10-30
Status: Approved design, ready for implementation planning
Owner: Kone Tshivhinda

## 1. Goal

Turn the current five-page studio site into a company website that demonstrates the work instead of describing it. Every service, claim and project links to real evidence: a live product, public source, an architecture decision record, a verified certificate or a downloadable technical brief.

The site must still feel like K-ONE: light by default, plain language, honest about status, no invented metrics, prices, clients or testimonials.

## 2. Success criteria

- A first-time visitor can tell what the studio does, see proof, and reach a project page or contact form in one or two clicks.
- All public live products are linked: portfolio, SA-JAS, ClearCut, MuniSolve, UI Vault and this site.
- Four dossier pages exist with real screenshots or architecture diagrams and a downloadable PDF brief.
- Six service pages exist, each with deliverables, engagement models, proof links and a FAQ.
- The circular navigation works with keyboard, screen readers and reduced motion.
- `npm run check` and `npm run build` pass. No console errors on any route.
- Lighthouse mobile: performance, accessibility and best practices at least 95, SEO 100, subject to the hosting check.
- No horizontal overflow at 320 px. No text below WCAG AA contrast.

## 3. Non-goals

- No CMS. Content stays in typed TypeScript data files.
- No pricing figures or fixed packages. Engagement models only.
- No client logos, testimonials, metrics or case studies that cannot be sourced.
- No dark-by-default redesign. Light is the default; dark mode remains a saved preference.
- No backend or database work.
- No replacement of the GitHub repo sync.

## 4. Positioning and voice

Working concept: **Proof in the open.** An independent studio that shows its working. Copy is direct, specific and honest. Prototypes are called prototypes. Alpha is labelled alpha. Simulated integrations are labelled simulated.

Rules:

- No em dashes in copy.
- Sentence case for body and headings unless a proper noun requires otherwise.
- British and South African spelling, for example "organisation", "colour", "licence" as a noun.
- Amounts and dates in South African context where relevant.
- Every external claim carries an evidence link or an explicit status.

## 5. Information architecture

```
/                     Home
/services/            Services overview, engagement models, fit finder
/services/[slug]/     Six service pages
/work/                Case studies plus the full public repo explorer
/work/[slug]/         Four dossier pages
/about/               Founder and studio
/contact/             Contact form and direct channels
/privacy/             Existing privacy page, reviewed
/404                  Existing, restyled
/briefs/[slug].pdf    Downloadable technical briefs
```

Header navigation: Work, Services, About, Contact, plus the primary CTA.

The circular navigation is an additional quick-nav control, not a replacement for the header or footer navigation.

## 6. Visual system

### 6.1 Direction

An engineering dossier on warm paper, with dark night-lab bands for contrast. Editorial serif headlines, precise mono annotations, hairline rules, numbered sections and real status stamps. The visual language should feel like a well-kept technical file, not a generic SaaS landing page.

### 6.2 Tokens

Light theme:

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#FAF8F2` | Page background |
| `--surface` | `#FFFFFF` | Cards and panels |
| `--surface-2` | `#F2EEE3` | Raised or alternate bands |
| `--ink` | `#14151C` | Primary text |
| `--muted` | `#5C5A52` | Secondary text |
| `--line` | `#DED8C9` | Hairlines and borders |
| `--cobalt` | `#2B4EFF` | Primary action and links |
| `--cobalt-deep` | `#1A2FA8` | Hover and focus |
| `--lime` | `#C6F24E` | Accent on ink only |
| `--stamp-ok` | `#0F7B4F` | Verified status |
| `--stamp-warn` | `#9A5B00` | Alpha or prototype status |

Dark theme and night-lab bands:

| Token | Value | Use |
| --- | --- | --- |
| `--ink-bg` | `#0B0C10` | Night-lab background |
| `--ink-surface` | `#14161F` | Night-lab cards |
| `--ink-fg` | `#F4F1E8` | Night-lab text |
| `--ink-muted` | `#A9A69B` | Night-lab secondary text |
| `--ink-line` | `#2A2C38` | Night-lab borders |
| `--cyan` | `#4DE1E6` | Night-lab accent |
| `--violet` | `#8B7BFF` | Night-lab accent |

Contrast must be checked for every text and background pair. Lime is never used as text on paper.

### 6.3 Type

- Display: Instrument Serif, fallback Georgia, serif. Used for h1 and section h2 only. Tight leading, no letter-spacing reduction below -0.02em.
- Body: Inter Variable.
- Labels, annotations, code: JetBrains Mono Variable.
- Scale: fluid `clamp()` for h1 and h2. Body 1rem, large lead 1.125rem to 1.25rem.
- Max line length 68 characters for prose.

Fonts are self-hosted through Fontsource packages. No third-party font requests.

### 6.4 Texture and motifs

- Blueprint grid at low opacity on hero and dossier headers.
- Hairline section rules with a small mono section number.
- Corner ticks or crop marks on evidence cards and diagrams.
- Status stamps: `VERIFIED`, `LIVE`, `ALPHA`, `PROTOTYPE`, `SOURCE ONLY`.
- A recurring "evidence" chip with a small link icon.

## 7. Page designs

### 7.1 Home

1. Hero: eyebrow, serif headline, one-paragraph lead, primary CTA (Start a project), secondary CTA (See the proof), and the live system map.
2. Proof strip: four real numbers with tickers. Public repositories, live products, architecture decisions in Vigil, services offered.
3. Services: six numbered entries with short descriptions and links.
4. Selected work: four large evidence cards for the dossiers, each with a screenshot or diagram, status, one-line summary and links.
5. Principles: four operating rules, presented as a manifesto with hairline rules.
6. About teaser: portrait, two sentences, link to About.
7. Night-lab band: "What is live right now", with live links to SA-JAS, ClearCut, MuniSolve, portfolio and vault.
8. Closing CTA with email and phone.

The current aurora and grid decoration is replaced by the dossier grid and hairlines. The hero must render its headline and lead without JavaScript.

### 7.2 Services overview

- Intro and a three-step "which service do I need" helper: describe the problem, choose the closest track, link to the service.
- Six service cards, each with icon, promise, three deliverables and a link.
- Engagement models: discovery sprint, fixed-scope build, monthly retainer. What each includes, who it suits and what happens next. No numbers.
- Process strip: Discover, Design, Build, Hand over.
- Stack overview, collapsed by default with details elements.
- CTA.

### 7.3 Service detail template

Fields: `id`, `icon`, `number`, `title`, `promise`, `summary`, `outcomes`, `included`, `engagements`, `process`, `proof`, `stack`, `faq`, `cta`.

Sections:

1. Header: number, title, promise, primary CTA, related live proof.
2. "What this looks like in practice": three outcome cards.
3. "What is included": checklist grouped by discovery, build, handover.
4. "How an engagement runs": the three models filtered to this service.
5. Proof: one to three related dossiers or live projects with evidence chips.
6. Stack: chips.
7. FAQ: details and summary elements.
8. CTA.

The six services remain: AI agents and workflow automation, RAG and document intelligence, web and mobile applications, cloud, DevOps and CI/CD, local and sovereign AI, QA, testing and technical support.

### 7.4 Work index

1. Header with the line "Everything built in the open, in one place".
2. Four dossier cards, large, with real imagery.
3. Live products row: SA-JAS, ClearCut, MuniSolve, portfolio, UI Vault.
4. The existing filterable repo explorer, kept, restyled.
5. Note that private work is available as a walkthrough on request.

### 7.5 Dossier template

Dossiers: `vigil`, `sajas`, `clearcut`, `timelex`.

Sections:

1. Header: title, codename, status stamp, year, role, one-line summary, live and source links, brief download.
2. At a glance: category, stack, licence, status, related docs.
3. The problem: two or three short paragraphs from the real README or docs.
4. What it does: three to five capability cards.
5. Architecture: an authored SVG diagram with a legend and a short caption. The diagram is based on the repository architecture docs and names real components.
6. Decisions: two or three real ADR cards with the ADR number, title, the decision and why it matters. Each links to the ADR on GitHub.
7. Screenshots: a gallery. SA-JAS uses its own repository screenshots. ClearCut and MuniSolve use captured demo screens. Vigil and TimeLex use documentation and diagram excerpts instead of invented UI.
8. What is real and what is not: an honesty table with status per area.
9. Stack and repository links.
10. Download the technical brief.
11. Next dossier.

Dossier status must match reality:

- Vigil: public source, in development, no live deployment.
- SA-JAS: hosted web alpha, live link, human sign-off.
- ClearCut: live alpha, live link, source.
- TimeLex: public source, in development, no live deployment.

### 7.6 Technical briefs

A print stylesheet and a dedicated print route produce a two-page A4 brief per dossier: title, status, summary, architecture diagram, decisions, stack, links and a footer with the generation date. The PDF is committed to `public/briefs/<slug>.pdf`.

PDFs are generated once with headless Chromium and committed. The build never depends on a browser. A short note in the README documents regeneration.

### 7.7 About

1. Header: portrait, founder name, role, one-paragraph story, location and availability.
2. Operating principles: four cards.
3. Timeline: four real roles, with a line that draws on scroll and stamps for current and past.
4. Currently building: four real projects with status and links.
5. Skills: grouped chips plus a mono marquee of tools.
6. Credentials: IBM certificate and NQF 6 diploma, with verification links.
7. Languages, location and working style.
8. CTA.

No Mostoeneng Bill work. No CV PDF. No private client details.

### 7.8 Contact and footer

Contact keeps the existing form and mailto fallback. Add response expectation, location and time zone. Footer adds a "Live work" column, availability, the circular-nav credit and a colophon link note.

## 8. Signature interactions

All motion respects `prefers-reduced-motion: reduce`. When reduced motion is on, content is visible immediately, transitions are fades or none, and parallax is disabled.

### 8.1 Circular navigation

- Fixed bottom centre, 56 px trigger, offset 24 px.
- Half-circle of five items above the trigger: Home, Services, Work, About, Contact.
- Spring orbit with stagger. Labels appear on hover and focus.
- Closed by default. Opens on click or Enter or Space. Closes on Escape, outside click, or selection.
- Arrow keys move between items. Home and End jump to first and last. Focus is trapped while open and returned to the trigger on close.
- `aria-expanded`, `aria-controls`, `aria-label`, and a visually hidden instruction.
- Reduced motion: fade and scale only, no orbit.
- Hidden while printing.
- The trigger is not shown until the page has scrolled past the hero, so it never covers the primary hero CTA.

Implementation: one React island with framer-motion. Original code. Credit: pattern inspired by the Circular Navigation Bar reference in the UI Vault, by Kaif UI on 21st.dev, implemented from scratch. The credit appears in the footer colophon and in a code comment.

### 8.2 Hero system map

- Inline SVG, approximately 520 by 520, with the studio node at the centre, six service nodes on an orbit and four project nodes attached to relevant services.
- Rings, hairlines, small mono labels, one cobalt highlight.
- On load, arcs draw with `stroke-dashoffset`.
- Pointer parallax of at most 8 px, disabled on touch and reduced motion.
- Text content remains in the DOM and readable without the SVG.

### 8.3 Motion set

- Page transitions with Astro ClientRouter. Respect reduced motion.
- Scroll reveals with IntersectionObserver and a `data-reveal` attribute. Stagger via `--i`. No layout shift.
- Number tickers on the four real home stats. Client-side only, with a static value as fallback.
- Skills and tools marquee, CSS only, pause on hover and focus, hidden under reduced motion.
- Card spotlight using pointer position CSS variables. Disabled on touch and reduced motion.
- Magnetic CTA with at most 4 px translate. Disabled under reduced motion.
- Reading progress bar on dossier pages, using a scroll-driven CSS animation with a script fallback.
- Status stamp reveal on scroll, one time only.

## 9. Technical architecture

### 9.1 Stack

Existing Astro 7, React 19, Tailwind 4 and framer-motion. Add `@fontsource/instrument-serif`. No other runtime dependencies without a specific reason.

### 9.2 Data

- `src/data/content.ts`: existing principles, process and skills.
- `src/data/services.ts`: extended service detail model.
- `src/data/dossiers.ts`: typed dossier content, decisions, links, screenshots and status.
- `src/data/about.ts`: timeline, currently building, credentials.
- `src/config.ts`: add live project links and the vault link.

Content is typed. No MDX dependency.

### 9.3 Components

New:

- `CircularNav.tsx`: radial navigation island.
- `SystemMap.tsx`: hero SVG island or static SVG with a small parallax island.
- `StatTicker.tsx`: one small island for the proof strip.
- `StatusStamp.astro`: status label with accessible text.
- `EvidenceLink.astro`: labelled source link.
- `SectionHeading.astro`: number, title, optional lead.
- `ProjectEvidenceCard.astro`: large dossier card.
- `ArchitectureDiagram.astro`: wrapper plus four authored SVG diagrams.
- `DecisionCard.astro`: ADR card.
- `ScreenshotGallery.astro`: accessible gallery.
- `BriefDownload.astro`: PDF link with file size.
- `PageHero.astro`: shared header for inner pages.
- `Marquee.astro`: CSS marquee.
- `Reveal.astro`: wrapper or a global script for scroll reveals.

Modified:

- `Header.astro`: new navigation and CTA.
- `Footer.astro`: live work column, availability, credit.
- `Base.astro`: ClientRouter, skip link, new meta defaults.
- `global.css`: new tokens, type, bands, utilities.
- `index.astro`, `services.astro`, `work.astro`, `about.astro`, `contact.astro`, `404.astro`.
- `ProjectExplorer.tsx` and `ProjectCard.tsx`: restyle and add live links.

New routes:

- `services/[slug].astro`
- `work/[slug].astro`
- `briefs/[slug].astro` for print output

### 9.4 Images

- Download the five SA-JAS screenshots from its public repository into `src/assets/work/sajas/`. These are the owner's own assets.
- Capture ClearCut demo and MuniSolve screens with Playwright, using only demo or fictional data. Redact anything sensitive.
- Capture the portfolio and UI Vault heroes for the live row.
- Convert to WebP with sharp where useful. Serve through `astro:assets` with explicit width and height.
- Screenshots must be labelled by source and date in the data file.

### 9.5 External links

All external links use `target="_blank"` with `rel="noopener noreferrer"` and a screen-reader note. A build-time check script lists external links and verifies HTTP status where possible, but does not fail the build on transient network errors.

## 10. Accessibility

- Semantic landmarks, one h1 per page, ordered headings.
- Skip link and visible focus rings.
- Circular nav keyboard model as specified.
- Every interactive control has an accessible name.
- Status never communicated by colour alone.
- Images have meaningful alt text, decorative images are hidden.
- `prefers-reduced-motion` support across all motion.
- Reduced transparency is not required, but glass surfaces keep AA contrast.
- Test with keyboard only and with the browser's accessibility snapshot.

## 11. Performance

- Inline critical SVG diagrams, lazy load screenshots below the fold.
- Limit React islands to the radial nav, the hero parallax and the tickers. Everything else is static Astro.
- No new heavy animation library.
- Fonts self-hosted, `font-display: swap`, limited to used weights.
- Avoid layout shift by reserving image dimensions and not animating layout properties.
- Target LCP under 2.5 s on a throttled mobile connection.

## 12. SEO and metadata

- Per-page titles and descriptions.
- Canonical URLs.
- JSON-LD: ProfessionalService on home, Service on service pages, CreativeWork or SoftwareSourceCode on dossiers, Person on About.
- Sitemap through the existing integration.
- Per-dossier social image is optional. If time allows, generate one from a shared template.
- `robots.txt` stays.

## 13. Attribution and rights

- Circular navigation: inspired by Kaif UI, 21st.dev, unknown licence. Implemented from scratch, credited in the colophon.
- UI Vault is linked as a project, not copied.
- No third-party design is presented as original.
- Fonts are OFL through Fontsource.
- Screenshots are the owner's own work, captured from the owner's own deployments.

## 14. Testing

- `npm run check`.
- `npm run build`.
- Browser QA at 360, 768, 1024 and 1440 widths.
- Routes: home, services index, all six services, work index, four dossiers, about, contact, 404, briefs.
- Keyboard pass on the radial nav, mobile menu, skip link and form.
- Reduced motion emulation pass.
- Light and dark pass on every page.
- External link status check.
- No console errors.
- Verify PDFs open and contain the correct dossier.
- Verify screenshots do not expose keys, tokens or personal data.

## 15. Delivery plan

1. Foundation: tokens, fonts, base layout, ClientRouter, reveal utilities, header, footer, radial nav, home hero and proof strip.
2. Services: data model, overview, six detail pages, engagement models.
3. Work: dossier data, template, four dossiers, diagrams, screenshots, PDFs, live links.
4. About, contact, 404, SEO, polish.
5. QA, accessibility, performance, final review, PR.

Each phase lands in small commits on `feat/site-v3`. Review happens before the PR. The PR summary includes screenshots and the test results.

## 16. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Circular nav harms usability | Standard header stays, labels on focus, keyboard support, hidden until after hero |
| Screenshots expose secrets or personal data | Capture demo modes only, review every image, redact if needed |
| PDFs drift from page content | Generate from the same data and route, stamp the generation date, commit outputs |
| Dark bands break contrast | Test every token pair, avoid lime text on light surfaces |
| Too much motion hurts performance | Limit islands, animate transform and opacity only, reduced-motion paths |
| Case study claims drift from reality | Source every statement from the repository docs, add a status table and review dates |
| Astro 7 API differences | Check current Astro docs during implementation, keep the fallback simple |

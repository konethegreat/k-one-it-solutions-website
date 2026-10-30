// Written by Kone Tshivhinda & Claude
// Every fact below is sourced from the public repositories and live sites listed in
// docs/research/2026-10-30-dossier-notes.md. No metrics, clients or claims are invented.
import type { ImageMetadata } from 'astro';

import sajasDashboard from '../assets/work/sajas/01-dashboard.jpg';
import sajasCopilot from '../assets/work/sajas/02-copilot-form.png';
import sajasReview from '../assets/work/sajas/03-human-review.png';
import sajasReceipt from '../assets/work/sajas/04-local-receipt.png';
import sajasSaved from '../assets/work/sajas/05-saved-answer.jpg';
import clearcutDemo from '../assets/work/clearcut/demo.png';
import clearcutRead from '../assets/work/clearcut/read.png';
import clearcutResult from '../assets/work/clearcut/result.png';

export type DossierStatus = 'source' | 'live-alpha';
export type DiagramKind = 'vigil' | 'timelex' | 'clearcut' | 'sajas';

export interface DossierFact {
  label: string;
  value: string;
}

export interface DossierCapability {
  title: string;
  body: string;
}

export interface DossierDecision {
  code: string;
  title: string;
  decision: string;
  why: string;
  href: string;
  state: string;
}

export interface DossierScreenshot {
  src: ImageMetadata;
  alt: string;
  caption: string;
}

export interface DossierExcerpt {
  label: string;
  title: string;
  body: string;
  href: string;
}

export interface DossierHonesty {
  area: string;
  status: string;
  note: string;
}

export interface Dossier {
  slug: string;
  title: string;
  codename?: string;
  status: DossierStatus;
  statusLabel: string;
  statusTone: 'ok' | 'warn' | 'neutral';
  year: string;
  role: string;
  summary: string;
  repoUrl: string;
  liveUrl?: string;
  docsUrl: string;
  licence: string;
  stack: string[];
  facts: DossierFact[];
  problem: string[];
  capabilities: DossierCapability[];
  diagram: DiagramKind;
  diagramCaption: string;
  decisions: DossierDecision[];
  screenshots: DossierScreenshot[];
  excerpts: DossierExcerpt[];
  honesty: DossierHonesty[];
  relatedService: { label: string; href: string };
}

export const dossiers: Dossier[] = [
  {
    slug: 'vigil',
    title: 'Vigil',
    codename: 'Project codename, pending trademark clearance',
    status: 'source',
    statusLabel: 'Source available, in development',
    statusTone: 'warn',
    year: '2026',
    role: 'Founder, architecture and platform engineering',
    summary:
      'A sovereign operational-intelligence platform that models assets, people, places and events as a governed ontology, so operators and AI agents can act on the same version of the truth.',
    repoUrl: 'https://github.com/konethegreat/Vigil/tree/develop',
    docsUrl: 'https://github.com/konethegreat/Vigil/blob/develop/docs/ARCHITECTURE.md',
    licence: 'Source available, no licence declared',
    stack: [
      'Java 25',
      'Spring Boot 4',
      'Spring Modulith 2',
      'Rust',
      'Python 3.13',
      'FastAPI',
      'TypeScript',
      'Next.js',
      'Go',
      'Kotlin',
      'Elixir',
      'PostgreSQL',
      'Apache Iceberg',
      'OpenSearch',
      'ClickHouse',
      'Kafka',
      'NATS JetStream',
      'Temporal',
    ],
    facts: [
      { label: 'Status', value: 'In development, no live deployment' },
      { label: 'Branch', value: 'develop (main is an empty shell)' },
      { label: 'Architecture', value: '12 ADRs, frozen at P0 v1.0' },
      { label: 'Roadmap', value: 'Plan spans P0 to P43' },
      { label: 'Deployment', value: 'Sovereign first, air-gap capable' },
      { label: 'Ontology', value: 'Metadata layer over polyglot persistence' },
    ],
    problem: [
      'Operational decisions in Africa are made across disconnected systems: spreadsheets, inboxes, case files and tools that rarely share a model of the world. Analysts reconcile evidence by hand while institutional memory sits in people\u2019s heads.',
      'Vigil is designed as a sovereign operational-intelligence platform. Assets, people, places and events are modelled in a governed ontology, and operators plus AI agents act through governed actions that write back to systems of record.',
      'The default topology is South African colocation, customer premises or an air-gapped appliance. Hyperscaler regions are a separately labelled commercial tier, with no required egress.',
    ],
    capabilities: [
      {
        title: 'Warden, the security kernel',
        body: 'A Rust kernel that every read, write and inference passes through. Authority is checked before data moves, not after.',
      },
      {
        title: 'Core, the ontology plane',
        body: 'Object sets, an action engine with an outbox, indexing, traversal, lineage and audit. The ontology is metadata over polyglot storage, not a graph database.',
      },
      {
        title: 'Forge, the data plane',
        body: 'Connectors, Apache Iceberg datasets and transforms that bring outside systems into the same governed model.',
      },
      {
        title: 'Mind, the AI plane',
        body: 'A model gateway, agents and MCP tools, entity resolution and document AI, with every inference inside the same security boundary.',
      },
      {
        title: 'Cockpit and Field',
        body: 'A Next.js operator workspace and an Android edge agent for work that happens away from a desk.',
      },
      {
        title: 'Relay, sovereign delivery',
        body: 'Signed bundles move between cloud, South African data centres and air-gapped appliances with no required egress.',
      },
    ],
    diagram: 'vigil',
    diagramCaption:
      'Every request enters through the gateway and Warden before it reaches the ontology, data or AI planes. Relay carries signed bundles to sovereign and air-gapped targets.',
    decisions: [
      {
        code: 'ADR-0002',
        title: 'The ontology is not a graph database',
        decision:
          'The ontology is a metadata-driven layer over polyglot persistence. Graph engines can only be replaceable projections, never the system of record.',
        why:
          'Operational traversals are shallow, while graph databases carry licence and viability risk. The metadata layer keeps storage replaceable and the model stable.',
        href: 'https://github.com/konethegreat/Vigil/blob/develop/docs/adr/ADR-0002-ontology-not-a-graph-database.md',
        state: 'Proposed (P0)',
      },
      {
        code: 'ADR-0004',
        title: 'Sovereign-first deployment',
        decision:
          'The default topology is South African colocation, customer premises or air-gapped. Hyperscaler regions are a separately labelled commercial tier.',
        why:
          'No required egress and no prompt leaving South Africa can be tested guarantees rather than marketing language, because the deployment model is the default.',
        href: 'https://github.com/konethegreat/Vigil/blob/develop/docs/adr/ADR-0004-sovereign-first-deployment.md',
        state: 'Proposed (P0)',
      },
      {
        code: 'ADR-0006',
        title: 'Vigil is a codename',
        decision:
          'The product name is a codename until trademark clearance is complete, and public copy labels it as such.',
        why:
          'Naming a platform after a word with existing marks is a legal risk. The codename keeps the architecture public without committing the brand.',
        href: 'https://github.com/konethegreat/Vigil/blob/develop/docs/adr/ADR-0006-codename-and-trademark-clearance.md',
        state: 'Proposed (P0)',
      },
    ],
    screenshots: [],
    excerpts: [
      {
        label: 'Architecture',
        title: 'docs/ARCHITECTURE.md',
        body: 'Planes, components and the security boundary, written before the first increment of source review.',
        href: 'https://github.com/konethegreat/Vigil/blob/develop/docs/ARCHITECTURE.md',
      },
      {
        label: 'Roadmap',
        title: 'docs/PHASES_AND_TASKS.md',
        body: 'The P0 to P43 plan, including the tasks that gate acceptance of the P0 architecture.',
        href: 'https://github.com/konethegreat/Vigil/blob/develop/docs/PHASES_AND_TASKS.md',
      },
      {
        label: 'Domain',
        title: 'docs/VIGIL_DOMAIN_BLUEPRINT.md',
        body: 'The domain blueprint behind the ontology: objects, links, actions and the questions operators ask.',
        href: 'https://github.com/konethegreat/Vigil/blob/develop/docs/VIGIL_DOMAIN_BLUEPRINT.md',
      },
    ],
    honesty: [
      { area: 'Live service', status: 'Not live', note: 'No public deployment. The platform is in development.' },
      { area: 'Source', status: 'Available', note: 'Public repository on the develop branch.' },
      { area: 'Licence', status: 'Not declared', note: 'Source available, not open source. No licence is granted by default.' },
      { area: 'Architecture', status: 'Proposed', note: 'The P0 ADRs are proposed and await founder sign-off, not accepted.' },
      { area: 'Demo data', status: 'Fictional', note: 'Every demo identity in the repository is explicitly fictional.' },
      { area: 'AI claims', status: 'Designed', note: 'Agents are designed and specified. They are not in production.' },
    ],
    relatedService: { label: 'Sovereign AI', href: '/services/sovereign-ai/' },
  },
  {
    slug: 'sajas',
    title: 'SA-JAS',
    codename: 'South African Job Agent Suite',
    status: 'live-alpha',
    statusLabel: 'Hosted web alpha',
    statusTone: 'ok',
    year: '2026',
    role: 'Founder, product and full-stack engineering',
    summary:
      'Three agents find South African vacancies, tailor an ATS-friendly CV and cover letter, and guide the application in a visible browser. The person still presses submit.',
    repoUrl: 'https://github.com/konethegreat/scratch',
    liveUrl: 'https://sajas.pages.dev/',
    docsUrl: 'https://github.com/konethegreat/scratch/blob/main/README.md',
    licence: 'MIT',
    stack: [
      'Electron',
      'React',
      'Vite',
      'Express',
      'Node 22',
      'Playwright Chromium',
      'Anthropic Claude',
      'Cloudflare Pages',
      'IndexedDB',
    ],
    facts: [
      { label: 'Status', value: 'Hosted web alpha' },
      { label: 'Desktop', value: 'Electron app in the repository' },
      { label: 'Agents', value: '3, with human sign-off' },
      { label: 'Job boards', value: '12 South African fallbacks' },
      { label: 'Data', value: 'Local files or browser IndexedDB' },
      { label: 'Licence', value: 'MIT' },
    ],
    problem: [
      'A job search in South Africa means juggling several boards, rewriting a CV for every advert and retyping the same answers into long application forms. The work is repetitive and easy to abandon halfway.',
      'SA-JAS runs three agents. Job Hunter finds vacancies with grounded search and fallbacks across South African job boards. Document Tailor writes an ATS-friendly CV and a 300 to 400 word cover letter. Apply Copilot guides multi-step forms in a visible browser.',
      'The person submits. The copilot refuses submit, send, finish, confirm and pay wording, hands CAPTCHAs to the user, and stops at final review for confirmation.',
    ],
    capabilities: [
      {
        title: 'Agent 1, Job Hunter',
        body: 'Grounded search plus 12 South African job-board fallbacks, refreshed on a 15-minute feed cycle.',
      },
      {
        title: 'Agent 2, Document Tailor',
        body: 'Rewrites the CV for the advert and writes a 300 to 400 word cover letter, using the same shared core and cost accounting.',
      },
      {
        title: 'Agent 3, Apply Copilot',
        body: 'A page brain that plans and fills long forms in a visible browser with a three-pass smart fill, then waits for the person.',
      },
      {
        title: 'Two delivery modes',
        body: 'A hosted web app for API-only work and a local Electron runner for Chromium, persistent sessions and apply.',
      },
      {
        title: 'Local-first storage',
        body: 'JSON files locally or IndexedDB on the web. The host stores nothing personal.',
      },
      {
        title: 'Zero-knowledge keys',
        body: 'The Anthropic key travels from the browser to Anthropic only. It is never persisted by the host.',
      },
    ],
    diagram: 'sajas',
    diagramCaption:
      'The web shell and desktop shell share one core. Three agents call Claude and job feeds, write to local storage, and hand the final submission back to the person.',
    decisions: [
      {
        code: 'Plan decision',
        title: 'Hybrid delivery',
        decision:
          'A hosted web app for API-only work, and a local runner for Chromium, persistent sessions and apply.',
        why:
          'Free hosts cannot run Chromium with a persistent profile. Splitting the work by capability keeps the hosted alpha cheap without losing the application flow.',
        href: 'https://github.com/konethegreat/scratch/blob/main/README.md',
        state: 'Design decision',
      },
      {
        code: 'Plan decision',
        title: 'Local-first data and zero-knowledge keys',
        decision:
          'The host stores nothing personal, and the Anthropic key travels from the browser to Anthropic only.',
        why:
          'A job search exposes identity, work history and sometimes ID numbers. Keeping the data local removes a breach target instead of managing one.',
        href: 'https://github.com/konethegreat/scratch/blob/main/THREAT-MODEL.md',
        state: 'Design decision',
      },
      {
        code: 'Plan decision',
        title: 'Never auto-submit',
        decision:
          'Guards refuse submit, send, finish, confirm and pay wording, and allow only Next, Continue and Proceed on form pages.',
        why:
          'An application is a representation made in someone\u2019s name. The person confirms, presses once and has 60 seconds to change their mind.',
        href: 'https://github.com/konethegreat/scratch/blob/main/POLICY.md',
        state: 'Design decision',
      },
    ],
    screenshots: [
      {
        src: sajasDashboard,
        alt: 'SA-JAS dashboard with a synthetic demo banner, one discovered opportunity and an idle agent terminal.',
        caption: 'The dashboard runs on a clearly labelled synthetic fixture, so no live search or AI call is made.',
      },
      {
        src: sajasCopilot,
        alt: 'SA-JAS Apply Copilot form with saved answers and a missing question highlighted.',
        caption: 'Apply Copilot fills what it can, saves unanswered required questions and asks the person for the rest.',
      },
      {
        src: sajasReview,
        alt: 'SA-JAS human review screen listing the application steps before submission.',
        caption: 'Final review is a person\u2019s job. The copilot stops here and waits for confirmation.',
      },
      {
        src: sajasReceipt,
        alt: 'SA-JAS local receipt showing where the application data is stored on the device.',
        caption: 'A receipt makes local storage visible instead of implied.',
      },
      {
        src: sajasSaved,
        alt: 'SA-JAS saved answer screen showing a reusable answer for recurring application questions.',
        caption: 'The 17 recurring South African questions are answered once and reused, with the person in control.',
      },
    ],
    excerpts: [],
    honesty: [
      { area: 'Live service', status: 'Alpha', note: 'Hosted web alpha at sajas.pages.dev. The Electron desktop build runs from source.' },
      { area: 'Screenshots', status: 'Fictional data', note: 'Every screenshot uses the repository\u2019s synthetic demo fixture.' },
      { area: 'Matching score', status: 'Fixture', note: 'The 82 percent match score is demo data, not a measured result.' },
      { area: 'Submissions', status: 'Human', note: 'The copilot never submits. CAPTCHAs are handed off, never solved.' },
      { area: 'Identifiers', status: 'Not stored', note: 'ID and passport numbers are not stored by the app.' },
      { area: 'Licence', status: 'MIT', note: 'Source is public under the MIT licence.' },
    ],
    relatedService: { label: 'AI agents and automation', href: '/services/ai-agents/' },
  },
  {
    slug: 'clearcut',
    title: 'ClearCut',
    codename: 'Agent-native invoicing',
    status: 'live-alpha',
    statusLabel: 'Live alpha, invite only',
    statusTone: 'ok',
    year: '2026',
    role: 'Founder, product and systems engineering',
    summary:
      'Upload a South African invoice, read it page by page, check every figure against the page it came from, then export. One Rust core, three ways in.',
    repoUrl: 'https://github.com/konethegreat/clearcut',
    liveUrl: 'https://145-241-100-85.sslip.io/',
    docsUrl: 'https://github.com/konethegreat/clearcut/blob/main/README.md',
    licence: 'Apache-2.0',
    stack: [
      'Rust',
      'axum',
      'sqlx',
      'rmcp',
      'tokio',
      'PostgreSQL',
      'TypeScript SDK',
      'Python',
      'FastAPI',
      'Tesseract',
      'Docker',
      'Caddy',
    ],
    facts: [
      { label: 'Status', value: 'Live alpha, invite-only accounts' },
      { label: 'Demo', value: 'Public, no key, prepared fixtures' },
      { label: 'Surfaces', value: 'REST API, MCP server, Claude plugin' },
      { label: 'MCP tools', value: '13' },
      { label: 'Tests', value: '641 core, 1,013 Python worker' },
      { label: 'Licence', value: 'Apache-2.0' },
    ],
    problem: [
      'Invoicing in South Africa is a compliance exercise disguised as admin. VAT categories, rounding, line quantities and the page a figure came from all matter, and a single transposed digit is expensive.',
      'ClearCut reads an invoice page by page, checks every figure against the page it came from, explains what it found and sends anything unsettled to a person.',
      'One Rust core is exposed as a REST API, an MCP server with 13 tools and a Claude plugin, so a person, a script and an agent all use the same tested rules.',
    ],
    capabilities: [
      {
        title: 'clearcut-core',
        body: 'Money, VAT and South African compliance, the invoice lifecycle, events, extraction, narration and review rules in one Rust crate.',
      },
      {
        title: 'Server and store',
        body: 'An axum REST API and web page, API keys, rate limits, a retention sweep, and PostgreSQL with forced row-level security.',
      },
      {
        title: 'Document pipeline',
        body: 'Text, OCR and render, then a context pack, model call, validation and assessment. Every page ends as read or needs review.',
      },
      {
        title: 'Sandboxed worker',
        body: 'Untrusted files are handled by a Python worker with no network, database or model access. Tesseract handles scans.',
      },
      {
        title: 'Bring your own key',
        body: 'A tenant key vault and an Anthropic adapter, with model budgets checked before each call.',
      },
      {
        title: 'Evaluation',
        body: 'A gold-set scoring harness, so a model or prompt change is measured before it reaches a customer.',
      },
    ],
    diagram: 'clearcut',
    diagramCaption:
      'Clients enter through REST, MCP or the web page. Untrusted documents go to a sandboxed worker, the pipeline reads and validates them, and the review queue keeps a person in the loop.',
    decisions: [
      {
        code: 'ADR-0002',
        title: 'Money as integer minor units',
        decision:
          'Amounts are i64 cents, quantities are thousandths and rates are basis points, with half-away-from-zero rounding and VAT per tax category on the subtotal.',
        why:
          'Floats cannot represent cents exactly, and JSON numbers above 2^53 lose precision. Integer money makes the arithmetic auditable.',
        href: 'https://github.com/konethegreat/clearcut/blob/main/docs/adr/0002-money-representation.md',
        state: 'Accepted',
      },
      {
        code: 'ADR-0007',
        title: 'Authentication and tenant isolation',
        decision:
          '256-bit ccut_ keys stored only as SHA-256, scopes, forced row-level security, and an application role that refuses to start as the owner.',
        why:
          'Tenant isolation should be enforced by the database even when application code is wrong. The role boundary makes a missed filter fail closed.',
        href: 'https://github.com/konethegreat/clearcut/blob/main/docs/adr/0007-auth-and-row-level-security.md',
        state: 'Accepted',
      },
      {
        code: 'ADR-0018',
        title: 'Model router and escalation ladder',
        decision:
          'A cheaper model reads first and escalates only when needed. Every page ends as read or needs review, and budgets are checked before each call.',
        why:
          'Most invoices are routine. Reading every page with the largest model would spend money without improving the answer.',
        href: 'https://github.com/konethegreat/clearcut/blob/main/docs/adr/0018-model-router-and-escalation.md',
        state: 'Accepted and implemented',
      },
    ],
    screenshots: [
      {
        src: clearcutDemo,
        alt: 'ClearCut public demo showing two fictional invoices, one done and one needing review.',
        caption: 'The public demo uses prepared fixtures. No model is called, nothing is uploaded and nothing is saved.',
      },
      {
        src: clearcutRead,
        alt: 'ClearCut invoice reading view with extracted lines and page references.',
        caption: 'Each figure is tied to the page it came from, so a reviewer can check the source instead of trusting the output.',
      },
      {
        src: clearcutResult,
        alt: 'ClearCut completed result view with invoice totals and a checked status.',
        caption: 'The result is a checked document, not a black-box answer. What cannot be settled goes to a person.',
      },
    ],
    excerpts: [],
    honesty: [
      { area: 'Live service', status: 'Alpha', note: 'Invite-only accounts. The demo is public and uses prepared fixtures.' },
      { area: 'Demo calls', status: 'None', note: 'The public demo calls no model and saves nothing.' },
      { area: 'Human review', status: 'Required', note: 'Unsettled pages cannot finish without a person.' },
      { area: 'MCP safety', status: 'Soft guard', note: 'Review and delete tools require confirmation. It is documented as a soft guard, not a hard boundary.' },
      { area: 'Licence', status: 'Apache-2.0', note: 'Source is public under Apache-2.0.' },
      { area: 'Tax advice', status: 'None', note: 'ClearCut checks figures. It does not give tax advice.' },
    ],
    relatedService: { label: 'AI agents and automation', href: '/services/ai-agents/' },
  },
  {
    slug: 'timelex',
    title: 'TimeLex',
    codename: 'Exception-based practice management',
    status: 'source',
    statusLabel: 'Pre-alpha, in development',
    statusTone: 'warn',
    year: '2026',
    role: 'Founder, architecture and systems engineering',
    summary:
      'Autonomous, exception-based practice management for South African law firms. It captures work, attributes it to the right matter, writes the narrative and prepares the bill.',
    repoUrl: 'https://github.com/konethegreat/timelex',
    docsUrl: 'https://github.com/konethegreat/timelex/blob/main/docs/ARCHITECTURE.md',
    licence: 'Apache-2.0',
    stack: [
      'Rust',
      'Python',
      'TypeScript',
      'PostgreSQL',
      'NATS JetStream (planned)',
      'MCP',
      'Outlook add-in',
      'Claude plugin',
    ],
    facts: [
      { label: 'Status', value: 'Pre-alpha, version 0.1.0' },
      { label: 'Dated', value: '20 October 2026' },
      { label: 'Architecture', value: '12 services specified, 12 ADRs' },
      { label: 'Gates', value: '9 phases with gates A, B and C' },
      { label: 'Built', value: 'Walking skeleton' },
      { label: 'Licence', value: 'Apache-2.0' },
    ],
    problem: [
      'A small law firm loses billable time in the gaps: a call that was never captured, a document that cannot be tied to a matter, a narrative written from memory at month end.',
      'TimeLex is designed as autonomous, exception-based practice management. It captures work signals, attributes them to the right matter, writes the narrative and prepares the bill, asking a person only when it must.',
      'The project is pre-alpha. Research, ADRs, a phase plan and a walking skeleton exist. Capture, attribution, ledger, billing and trust accounting are not built yet.',
    ],
    capabilities: [
      {
        title: 'Gateway and identity',
        body: 'Authentication, tenant context and rate limits, with outward MCP aggregation and contract-first boundaries between services.',
      },
      {
        title: 'Vault and mcp-host',
        body: 'Bring-your-own keys, with the vault as the only decryptor, and an inward agent runtime for MCP tools.',
      },
      {
        title: 'Capture hub',
        body: 'Microsoft 365 and Google connectors that turn meetings, mail and documents into activity signals.',
      },
      {
        title: 'Attribution',
        body: 'Segmentation and a cascade that decides which matter a piece of work belongs to, with evidence for the choice.',
      },
      {
        title: 'Narrative and ledger',
        body: 'A narrative writer with a number guard, and an append-only time ledger that enforces the autonomy policy.',
      },
      {
        title: 'Billing and trust',
        body: 'Work in progress and pro-forma billing, with ClearCut for invoice maths and VAT. Trust accounting is planned, not built.',
      },
    ],
    diagram: 'timelex',
    diagramCaption:
      'Clients enter through the gateway. Identity, vault, capture and attribution feed an append-only ledger, which drives narrative, billing and ClearCut.',
    decisions: [
      {
        code: 'ADR-0001',
        title: 'Service boundaries and contract-first microservices',
        decision:
          'A service exists only if it owns its data, has a versioned contract and differs in scaling, security or language. Every service exposes REST, MCP and a typed SDK from one codebase.',
        why:
          'A small team can build a distributed monolith by accident. Hard boundaries and a budget of four deployables through Phase 2 keep the system operable.',
        href: 'https://github.com/konethegreat/timelex/blob/main/docs/adr/0001-service-boundaries-and-contract-first.md',
        state: 'Accepted',
      },
      {
        code: 'ADR-0005',
        title: 'Autonomy ladder and exception-based review',
        decision:
          'Five rungs from observe to autonomous to pre-bill. Auto-execution only when confidence meets a calibrated threshold, deterministic checks pass and policy allows.',
        why:
          'Trust money, signing, filing, legal advice and rate changes are never autonomous. The ladder makes that limit explicit instead of implied.',
        href: 'https://github.com/konethegreat/timelex/blob/main/docs/adr/0005-autonomy-ladder-and-review.md',
        state: 'Accepted',
      },
      {
        code: 'ADR-0006',
        title: 'Event-sourced activity and an append-only ledger',
        decision:
          'Activity events are immutable. Derived entries cite evidence, corrections supersede rather than overwrite, amounts are integer cents, the audit is hash-chained and retention has a seven-year floor.',
        why:
          'A bill must be explainable years later. An append-only record preserves what happened and why, even after a correction.',
        href: 'https://github.com/konethegreat/timelex/blob/main/docs/adr/0006-event-sourced-activity-and-ledger.md',
        state: 'Accepted',
      },
    ],
    screenshots: [],
    excerpts: [
      {
        label: 'Architecture',
        title: 'docs/ARCHITECTURE.md',
        body: 'Service boundaries, contracts and the reasoning behind each deployable.',
        href: 'https://github.com/konethegreat/timelex/blob/main/docs/ARCHITECTURE.md',
      },
      {
        label: 'Autonomy',
        title: 'docs/AUTONOMY.md',
        body: 'The five-rung ladder, the thresholds and what is never allowed to run without a person.',
        href: 'https://github.com/konethegreat/timelex/blob/main/docs/AUTONOMY.md',
      },
      {
        label: 'Threat model',
        title: 'docs/THREAT_MODEL.md',
        body: 'Tenancy, key handling, data residency and the limits of what the current design can promise.',
        href: 'https://github.com/konethegreat/timelex/blob/main/docs/THREAT_MODEL.md',
      },
    ],
    honesty: [
      { area: 'Live service', status: 'Not live', note: 'No public deployment. The repository is pre-alpha.' },
      { area: 'Built', status: 'Skeleton', note: 'Capture, attribution, ledger, billing and trust accounting are not built yet.' },
      { area: 'Data residency', status: 'At rest', note: 'Anthropic offers no African inference region, so residency claims apply to data at rest only (ADR-0007).' },
      { area: 'ADRs', status: '7 accepted, 5 proposed', note: 'Proposed decisions are labelled as proposed on this page.' },
      { area: 'Licence', status: 'Apache-2.0', note: 'Source is public under Apache-2.0.' },
      { area: 'Claims', status: 'Designed', note: 'The autonomy ladder is a design commitment. It has not run in production.' },
    ],
    relatedService: { label: 'Sovereign AI', href: '/services/sovereign-ai/' },
  },
];

export const getDossier = (slug: string) => dossiers.find((d) => d.slug === slug);

export const dossierOrder = dossiers.map((d) => d.slug);

export const statusToneLabel: Record<Dossier['statusTone'], string> = {
  ok: 'Live alpha',
  warn: 'In development',
  neutral: 'Source available',
};

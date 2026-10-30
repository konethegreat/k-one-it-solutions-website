# Dossier research notes

Source material for the four case studies, gathered 2026-10-30 from the public repositories and the live sites. Use only these facts. Do not invent metrics, clients or deployment claims.

## Vigil

- Repo: https://github.com/konethegreat/Vigil
- Default branch: `develop`. The `main` branch is an empty shell, so all documentation links must use `develop`.
- Status: in development. Source review increment 03. The larger P0 to P43 platform remains in development. No live deployment.
- Licence: none declared. Do not call it open source. Say "source available".
- Purpose: a sovereign operational intelligence platform that models assets, people, places and events as a governed ontology, on which operators and AI agents act through governed actions that write back to systems of record.
- Stack: Java 25, Spring Boot 4, Spring Modulith 2, Rust, Python 3.13 FastAPI, TypeScript and Next.js, Go, Kotlin, Elixir, SQL. PostgreSQL, Iceberg, OpenSearch, ClickHouse, Kafka, NATS JetStream, Temporal.
- Components: Warden (Rust security kernel, every read, write and inference passes through it), Core (ontology plane: OMS, object sets, action engine and outbox, indexer, traversal, lineage, audit), Forge (connectors, Iceberg datasets, transforms), Mind (model gateway, agents and MCP tools, entity resolution, document AI), Cockpit (Next.js operator UI), Field (Android and edge agent), Relay (signed bundles to cloud, sovereign data centres and air-gapped appliances).
- Decisions:
  - ADR-0002: the ontology is a metadata-driven layer over polyglot persistence, not a graph database. Graph engines can only be replaceable projections, never the system of record.
  - ADR-0004: sovereign-first deployment. Default topology is South African colocation, customer on-premises or air-gapped. Hyperscaler regions are a separately labelled commercial tier. No required egress and no prompt leaving South Africa as a tested guarantee.
  - ADR-0006: "Vigil" is a codename until trademark clearance. Use it as a codename in public copy.
- Real facts: 12 ADRs, plan spans P0 to P43, architecture frozen at P0 v1.0 on 2026-09-25, three explicitly fictional demo identities.
- Links: README, docs/ARCHITECTURE.md, docs/adr, docs/PHASES_AND_TASKS.md, docs/VIGIL_DOMAIN_BLUEPRINT.md, all on `develop`.

## TimeLex

- Repo: https://github.com/konethegreat/timelex
- Status: pre-alpha, version 0.1.0 dated 2026-10-20. The repo contains research, ADRs, a phase plan and a walking skeleton. Capture, attribution, ledger, billing and trust accounting are not built yet.
- Licence: Apache-2.0.
- Purpose: autonomous, exception-based practice management for South African law firms. It captures work, attributes it to the right matter, writes the narrative, prepares the bill and asks a person only when it must.
- Stack: Rust for service domain, HTTP and MCP layers, gateway, mcp-host, vault and desktop agent. Python for OCR, ML and redaction workers. TypeScript for the web app, Outlook add-in, SDK and Claude plugin. PostgreSQL with a schema and role per service. Transactional outbox. NATS JetStream planned.
- Components: gateway (authentication, tenant, rate limits, outward MCP aggregation), identity, vault (bring-your-own keys, the only decryptor), mcp-host (inward agent runtime), capture-hub (Microsoft 365 and Google connectors), attribution (segmentation and cascade), narrative (number guard), time-ledger (append-only, autonomy policy), billing (work in progress and pro-forma), matters and trust, ClearCut for invoice maths and VAT.
- Decisions:
  - ADR-0001: service boundaries and contract-first microservices. A service exists only if it owns its data, has a versioned contract and differs in scaling, security or language. Budget of four deployables through Phase 2 and eight by Phase 5.
  - ADR-0005: autonomy ladder and exception-based review. Five rungs from observe to autonomous to pre-bill. Auto-execution only when confidence meets a calibrated threshold, deterministic checks pass and policy allows. Trust money, signing, filing, legal advice and rate changes are never autonomous.
  - ADR-0006: event-sourced activity and an append-only ledger. Activity events are immutable, derived entries cite evidence, corrections supersede rather than overwrite, integer cents, hash-chained audit, seven-year retention floor.
- Real facts: 12 ADRs (7 accepted, 5 proposed), 9 phases with gates A, B and C, 12 services specified.
- Important nuance: ADR-0007 notes Anthropic offers no African inference region, so data-residency claims apply to data at rest, not inference.
- Links: README, docs/ARCHITECTURE.md, docs/adr, docs/PHASES.md, docs/INDEX.md, docs/AUTONOMY.md, docs/THREAT_MODEL.md.

## ClearCut

- Repo: https://github.com/konethegreat/clearcut
- Live: https://145-241-100-85.sslip.io/
- Status: live alpha, invite-only accounts, no-key public demo. Licence Apache-2.0.
- Purpose: agent-native invoicing for South Africa. Upload an invoice, read it page by page, check and explain the figures, then export. One Rust core exposed as a REST API, an MCP server and a Claude plugin.
- Stack: Rust with axum, sqlx, rmcp and tokio, PostgreSQL, TypeScript SDK, Python FastAPI worker with pypdfium2, pypdf and Tesseract, Docker and Caddy.
- Components: clearcut-core (money, VAT and South African compliance, invoice lifecycle, events, extraction, narration, review rules), clearcut-server (axum REST and web page, API keys, rate limits, retention sweep), clearcut-mcp (stdio MCP, thin REST client with 13 tools), clearcut-store (PostgreSQL, forced row-level security, append-only audit and events, durable job queue), clearcut-jobs (lease and heartbeat worker), clearcut-pipeline and clearcut-router (text, OCR and render, then context pack, model, validate and assess), clearcut-docproc and clearcut-intake (untrusted files, no network, database or model access in the Python worker), clearcut-anthropic (bring-your-own-key vault and adapter), clearcut-eval (gold-set scoring).
- Decisions:
  - ADR-0002: money as integer minor units. i64 cents, quantities in thousandths, rates in basis points, half-away-from-zero rounding, VAT per tax category on the subtotal.
  - ADR-0007: authentication, authorisation and tenant isolation. 256-bit `ccut_` keys stored only as SHA-256, scopes, forced row-level security, restricted application role that refuses to start as owner.
  - ADR-0018: model router and escalation ladder. Cheaper model first, escalate only when needed, every page ends as read or needs review, budgets checked before each call.
- Human safeguards: a review queue lets a person correct and confirm an unsettled page, recorded as a human extractor with no model call. Instruction-like document text cannot finish without a person. MCP review and delete tools require confirmation, documented as a soft guard.
- Real facts: 22 ADRs, 13 MCP tools, 641 core tests and 1,013 Python worker tests, R5 per document and R100 per month model budgets, 365-day default retention, 120 requests per minute default, 15 percent VAT.
- Screenshots: capture the public demo at `#/demo` with fictional data.

## SA-JAS

- Repo: https://github.com/konethegreat/scratch
- Live: https://sajas.pages.dev/
- Status: hosted web alpha. The full product is an Electron desktop app. Licence MIT.
- Purpose: a three-agent suite that finds South African vacancies, tailors an ATS-friendly CV and cover letter, and guides multi-step applications while leaving the final submission to the person.
- Stack: Electron, React and Vite, Express and Node 22, Playwright Chromium, Anthropic Claude, shared `@sajas/core`, JSON files locally, IndexedDB on the web, Cloudflare Pages.
- Components: Electron shell, React dashboard, Express API with asynchronous agents and polling, shared core for models, Claude calls, costs, secrets and feeds, Agent 1 Job Hunter (grounded search plus South African job-board fallbacks), Agent 2 Document Tailor (CV rewrite and 300 to 400 word letter), Agent 3 Apply Copilot with page brain (visible browser, planner, three-pass smart fill), local storage and hosted IndexedDB.
- Decisions from the master plan:
  - Hybrid delivery: hosted web app for API-only work, local runner for Chromium, persistent sessions and apply, because free hosts cannot run Chromium with a persistent profile.
  - Local-first data and zero-knowledge key handling: the host stores nothing personal, the key travels from the browser to Anthropic only.
  - Never auto-submit: guards refuse submit, send, finish, confirm and pay wording, and allow only Next, Continue and Proceed on form pages.
- Human safeguards: the copilot stops at final review and asks for confirmation, presses once, and waits up to 60 seconds. CAPTCHAs are detected and handed off, never solved. Unanswered required questions are saved for the user. ID and passport numbers are not stored. Pages are scanned for prompt injection.
- Real facts: three agents, 12 fallback South African job boards, 17 recurring South African questions, 300 to 400 word cover letter, 15-minute feed refresh, 60-second confirmation window.
- Do not use the 82 percent match score as a metric. It is a fictional demo fixture.
- Screenshots: `docs/screenshots/01-dashboard.jpg`, `02-copilot-form.png`, `03-human-review.png`, `04-local-receipt.png`, `05-saved-answer.jpg`. All use fictional demo data.

## Shared rules

- No em dashes in copy.
- Label status honestly: Vigil and TimeLex are source only and in development. ClearCut and SA-JAS are live alphas.
- Do not publish licence claims for Vigil.
- Do not call proposed ADRs ratified. Say "proposed" or "accepted" only where the repo says so.
- Link every claim to a source where possible.

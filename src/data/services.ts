// Written by Kone Tshivhinda & Claude
// Services, outcomes, deliverables, engagement models and proof links.
import { links } from '../config';

export type ServiceIcon = 'bot' | 'search' | 'layout' | 'cloud' | 'shield' | 'wrench';
export type EngagementId = 'discovery' | 'build' | 'retainer';
export type ProofKind = 'dossier' | 'live' | 'source' | 'docs';

export interface ServiceProof {
  label: string;
  href: string;
  kind: ProofKind;
}

export interface ServiceDetail {
  id: string;
  number: string;
  icon: ServiceIcon;
  title: string;
  promise: string;
  summary: string;
  points: string[];
  outcomes: { title: string; body: string }[];
  included: { group: string; items: string[] }[];
  engagements: EngagementId[];
  proof: ServiceProof[];
  stack: string[];
  faq: { q: string; a: string }[];
}

export const engagements: Record<EngagementId, { title: string; body: string; suits: string; next: string }> = {
  discovery: {
    title: 'Discovery sprint',
    body: 'A short, fixed piece of work to map the problem, risks, data and options. The output is a written recommendation and an estimate you can take anywhere.',
    suits: 'Useful when the problem is clear but the right shape of the solution is not.',
    next: 'A scoping call, then a written plan in days rather than weeks.',
  },
  build: {
    title: 'Fixed-scope build',
    body: 'An agreed outcome, a written plan and delivery in tested increments. Progress is visible on a shared board and a staging link.',
    suits: 'Best when the scope can be defined and you want a clear end date.',
    next: 'Scope, plan and estimate in writing before any code starts.',
  },
  retainer: {
    title: 'Monthly retainer',
    body: 'Ongoing changes, monitoring and support for a system that is already live, with a set number of hours each month.',
    suits: 'For teams that need a steady pair of hands without a full-time hire.',
    next: 'A short onboarding, then a monthly plan and a written report.',
  },
};

export const serviceDetails: ServiceDetail[] = [
  {
    id: 'ai-agents',
    number: '01',
    icon: 'bot',
    title: 'AI agents & workflow automation',
    promise: 'Agents that do the work, with a person holding the door.',
    summary:
      'Agents that plan, act, verify and retry, with the controls a business needs: tool calling, MCP integrations, human sign-off and spend caps.',
    points: [
      'Multi-agent design with supervisor and sub-agents',
      'MCP servers and tool integrations',
      'Workflow automation, including n8n',
      'Usage metering, budgets and audit trails',
    ],
    outcomes: [
      {
        title: 'A defined job, not a chatbot',
        body: 'The agent has a goal, a set of tools, stop conditions and a record of every step it took. If it cannot finish, it says so.',
      },
      {
        title: 'Spend you can see',
        body: 'Usage is metered, budgets are checked before each model call, and every run leaves a ledger you can inspect.',
      },
      {
        title: 'A human gate where it matters',
        body: 'Anything consequential waits for a person. The system prepares the action and a person approves, edits or rejects it.',
      },
    ],
    included: [
      { group: 'Discovery', items: ['Task and risk mapping', 'Tool and data inventory', 'Human gate definition'] },
      {
        group: 'Build',
        items: [
          'Supervisor and sub-agent design',
          'MCP servers and tool integrations',
          'Retries, timeouts and stop conditions',
          'Usage metering and budget guards',
        ],
      },
      { group: 'Handover', items: ['Evaluation set and pass criteria', 'Runbook and failure playbook', 'Monitoring and audit trail'] },
    ],
    engagements: ['discovery', 'build', 'retainer'],
    proof: [
      { label: 'SA-JAS dossier', href: '/work/sajas/', kind: 'dossier' },
      { label: 'ClearCut live demo', href: links.clearcut, kind: 'live' },
      { label: 'ClearCut source', href: 'https://github.com/konethegreat/clearcut', kind: 'source' },
    ],
    stack: ['Claude', 'OpenAI', 'MCP', 'Python', 'TypeScript', 'n8n', 'PostgreSQL'],
    faq: [
      {
        q: 'Will the agent act without approval?',
        a: 'Only on tasks you mark as safe. Submitting forms, moving money, deleting records and sending external messages require a person.',
      },
      {
        q: 'What happens when a model or tool fails?',
        a: 'Runs have retries, timeouts and a recorded failure state. The system stops and reports instead of guessing.',
      },
      {
        q: 'How is usage kept under control?',
        a: 'Budgets and rate limits are checked before each call, and every run records token and tool usage.',
      },
    ],
  },
  {
    id: 'rag',
    number: '02',
    icon: 'search',
    title: 'RAG & document intelligence',
    promise: 'Answers you can trace back to the page.',
    summary:
      'Search and question-answering that answers only from your own documents, with citations, so people can check the source.',
    points: [
      'Hybrid keyword and vector retrieval',
      'Document and OCR pipelines',
      'Entity resolution and knowledge graphs',
      'Offline evaluations and source attribution',
    ],
    outcomes: [
      {
        title: 'Citations, not confidence',
        body: 'Every answer points to the document and page it came from, so a person can check the claim instead of trusting a tone.',
      },
      {
        title: 'Messy documents handled',
        body: 'Scanned PDFs, tables and long reports are read through OCR and structure-aware pipelines, not treated as clean text.',
      },
      {
        title: 'Measured before launch',
        body: 'Retrieval and answer quality are scored against a test set built with you before anyone relies on the system.',
      },
    ],
    included: [
      { group: 'Discovery', items: ['Corpus and access mapping', 'Question set and success criteria', 'Retention and privacy rules'] },
      {
        group: 'Build',
        items: [
          'Hybrid keyword and vector search',
          'Chunking, OCR and table extraction',
          'Entity resolution and knowledge graphs',
          'Grounded answering with citations',
        ],
      },
      { group: 'Handover', items: ['Offline evaluation report', 'Re-indexing and update process', 'Source attribution in the interface'] },
    ],
    engagements: ['discovery', 'build', 'retainer'],
    proof: [
      { label: 'ClearCut dossier', href: '/work/clearcut/', kind: 'dossier' },
      { label: 'Vigil architecture docs', href: 'https://github.com/konethegreat/Vigil/tree/develop/docs', kind: 'docs' },
      { label: 'ClearCut live demo', href: links.clearcut, kind: 'live' },
    ],
    stack: ['pgvector', 'PostgreSQL', 'Neo4j', 'Tesseract', 'Voyage AI', 'Python', 'FastAPI'],
    faq: [
      {
        q: 'Can it answer from our internal documents only?',
        a: 'Yes. The system retrieves from the corpus you provide and is instructed to say when the answer is not in it.',
      },
      {
        q: 'Do we need a vector database?',
        a: 'Not always. PostgreSQL with pgvector covers many workloads. A separate engine is added only when scale or features justify it.',
      },
      {
        q: 'How do you know the answers are good?',
        a: 'A question set is built with you and the pipeline is scored against it. The result is part of handover, not an afterthought.',
      },
    ],
  },
  {
    id: 'web-mobile',
    number: '03',
    icon: 'layout',
    title: 'Web & mobile applications',
    promise: 'From first commit to a live address.',
    summary:
      'Full-stack products from first commit to live deployment: responsive web apps, progressive web apps and React Native mobile apps.',
    points: [
      'React, Next.js and Vite front ends',
      'FastAPI, Node.js and Spring Boot back ends',
      'PostgreSQL, REST and GraphQL APIs',
      'PWAs and React Native (Expo)',
    ],
    outcomes: [
      {
        title: 'One product, every screen',
        body: 'Responsive web, PWA and React Native builds share the same API and design tokens, so the product stays consistent.',
      },
      {
        title: 'Safe releases',
        body: 'Tests, type checks and preview builds run before anything reaches production. A broken build cannot ship quietly.',
      },
      {
        title: 'A codebase you can keep',
        body: 'Documented structure, typed interfaces and a README that explains how to run, test and deploy the system.',
      },
    ],
    included: [
      { group: 'Discovery', items: ['User journeys and scope', 'Data model and API sketch', 'Accessibility and performance targets'] },
      {
        group: 'Build',
        items: [
          'React, Next.js or Astro front ends',
          'FastAPI, Node.js or Spring Boot back ends',
          'PostgreSQL, REST and GraphQL',
          'Authentication and role-based access',
        ],
      },
      { group: 'Handover', items: ['CI pipeline and deployment guide', 'Automated tests', 'Analytics and error reporting'] },
    ],
    engagements: ['discovery', 'build', 'retainer'],
    proof: [
      { label: 'MuniSolve ZA live', href: links.munisolve, kind: 'live' },
      { label: 'SA-JAS dossier', href: '/work/sajas/', kind: 'dossier' },
      { label: 'This site source', href: 'https://github.com/konethegreat/k-one-it-solutions-website', kind: 'source' },
    ],
    stack: ['React', 'Next.js', 'Astro', 'TypeScript', 'React Native', 'FastAPI', 'PostgreSQL'],
    faq: [
      {
        q: 'Do you build the design too?',
        a: 'Yes. Interfaces are designed in the browser as they are built, with accessibility and small screens treated as first-class.',
      },
      {
        q: 'Can you take over an existing codebase?',
        a: 'After a short review. You get a written assessment of what is safe to keep and what needs work before a plan is agreed.',
      },
      {
        q: 'What about app store releases?',
        a: 'React Native apps are prepared for TestFlight and Play internal testing, with signing and store metadata handled during handover.',
      },
    ],
  },
  {
    id: 'cloud-devops',
    number: '04',
    icon: 'cloud',
    title: 'Cloud, DevOps & CI/CD',
    promise: 'Infrastructure you can read, rebuild and roll back.',
    summary:
      'Infrastructure defined as code and delivery pipelines that test, scan and ship safely, on AWS and other major platforms.',
    points: [
      'AWS: ECS Fargate, RDS, S3, CloudFront',
      'Terraform and CloudFormation',
      'Docker and GitHub Actions pipelines',
      'Secret scanning, SBOM and CVE checks',
    ],
    outcomes: [
      {
        title: 'Defined, not clicked',
        body: 'Infrastructure lives in versioned code, so environments can be rebuilt, reviewed and compared instead of remembered.',
      },
      {
        title: 'Delivery with gates',
        body: 'Every change runs tests, scans and a build before it can deploy. Production is a decision, not an accident.',
      },
      {
        title: 'Fewer secrets in the wrong place',
        body: 'Keys live in managed secret stores and are scanned for before they reach a repository or a log.',
      },
    ],
    included: [
      { group: 'Discovery', items: ['Environment and cost review', 'Deployment and rollback plan', 'Security baseline'] },
      {
        group: 'Build',
        items: [
          'AWS ECS Fargate, RDS, S3 and CloudFront',
          'Terraform and CloudFormation',
          'Docker images and GitHub Actions',
          'Secret scanning, SBOM and CVE checks',
        ],
      },
      { group: 'Handover', items: ['Runbooks and on-call notes', 'Cost and alert dashboards', 'Access review and key rotation'] },
    ],
    engagements: ['discovery', 'build', 'retainer'],
    proof: [
      { label: 'This site source', href: 'https://github.com/konethegreat/k-one-it-solutions-website', kind: 'source' },
      { label: 'ClearCut source', href: 'https://github.com/konethegreat/clearcut', kind: 'source' },
    ],
    stack: ['AWS', 'Terraform', 'CloudFormation', 'Docker', 'GitHub Actions', 'Cloudflare', 'nginx'],
    faq: [
      {
        q: 'Do we have to move to AWS?',
        a: 'No. The same practices apply to Cloudflare, Azure, a South African host or your own hardware.',
      },
      {
        q: 'Can you work with our existing pipeline?',
        a: 'Yes. The first step is a review, then targeted changes rather than a rewrite for its own sake.',
      },
      {
        q: 'How are costs controlled?',
        a: 'Budgets, alerts and right-sized services are part of the build, and the monthly cost is reviewed with you.',
      },
    ],
  },
  {
    id: 'sovereign-ai',
    number: '05',
    icon: 'shield',
    title: 'Local & sovereign AI',
    promise: 'Sensitive work stays on your hardware, in your country.',
    summary:
      'AI that runs on your own hardware or in your own country when the data is sensitive, with POPIA-aware handling built in.',
    points: [
      'Local models with Ollama and LM Studio',
      'Open-weight model selection and fine-tuning',
      'Data residency and POPIA-aware design',
      'Role-based access, MFA and rate limiting',
    ],
    outcomes: [
      {
        title: 'Prompts that stay home',
        body: 'Open-weight models run on your own hardware or in a South African environment you control, with no required egress.',
      },
      {
        title: 'POPIA-aware by design',
        body: 'Data residency, retention and access rules are decided before the first model is chosen, not after an incident.',
      },
      {
        title: 'No per-token surprise',
        body: 'Local inference removes per-token billing, so usage is bounded by hardware you own and can plan for.',
      },
    ],
    included: [
      { group: 'Discovery', items: ['Data classification and residency review', 'Model and hardware fit', 'Threat model and access rules'] },
      {
        group: 'Build',
        items: [
          'Ollama and LM Studio deployments',
          'Open-weight model selection and fine-tuning',
          'Role-based access, MFA and rate limiting',
          'Local retrieval and audit logs',
        ],
      },
      { group: 'Handover', items: ['Hardware and model runbook', 'Evaluation of answer quality', 'Update and rollback process'] },
    ],
    engagements: ['discovery', 'build', 'retainer'],
    proof: [
      { label: 'Vigil dossier', href: '/work/vigil/', kind: 'dossier' },
      { label: 'TimeLex dossier', href: '/work/timelex/', kind: 'dossier' },
      { label: 'Vigil ADRs', href: 'https://github.com/konethegreat/Vigil/tree/develop/docs/adr', kind: 'docs' },
    ],
    stack: ['Ollama', 'LM Studio', 'open-weight models', 'Python', 'Rust', 'PostgreSQL', 'Linux'],
    faq: [
      {
        q: 'Is local AI as good as a hosted model?',
        a: 'Not always. Model choice is matched to the task, and the trade-off is measured on your own examples before a decision.',
      },
      {
        q: 'What hardware is needed?',
        a: 'It depends on the model and concurrency. A short pilot on representative hardware answers that before any purchase.',
      },
      {
        q: 'Does this guarantee POPIA compliance?',
        a: 'No tool can. It reduces data leaving your control and produces the records your compliance process needs. Legal review remains yours.',
      },
    ],
  },
  {
    id: 'qa-support',
    number: '06',
    icon: 'wrench',
    title: 'QA, testing & technical support',
    promise: 'Problems found before your users find them.',
    summary:
      'Testing that finds problems before users do, and hands-on technical support when systems misbehave.',
    points: [
      'Functional, integration and performance testing',
      'Playwright, pytest, Jest and Vitest',
      'Tier-2 support and network troubleshooting',
      'Structured diagnostics and clear reporting',
    ],
    outcomes: [
      {
        title: 'Tests that cover the real path',
        body: 'Critical journeys are tested end to end, including the failure states people actually hit, not only the happy path.',
      },
      {
        title: 'Clear evidence',
        body: 'Each defect comes with steps to reproduce, the expected result and the actual result, so it can be fixed without a meeting.',
      },
      {
        title: 'Support that diagnoses',
        body: 'Tier-2 support looks past the symptom to the cause and records the fix, so the same problem is cheaper next time.',
      },
    ],
    included: [
      { group: 'Discovery', items: ['Risk and journey mapping', 'Test environment review', 'Support and severity model'] },
      {
        group: 'Build',
        items: [
          'Functional, integration and performance testing',
          'Playwright, pytest, Jest and Vitest suites',
          'Network and device troubleshooting',
          'Structured diagnostics and reports',
        ],
      },
      { group: 'Handover', items: ['Regression suite in CI', 'Known issues and caveats', 'Support handover notes'] },
    ],
    engagements: ['discovery', 'retainer'],
    proof: [
      { label: 'ClearCut source', href: 'https://github.com/konethegreat/clearcut', kind: 'source' },
      { label: 'This site source', href: 'https://github.com/konethegreat/k-one-it-solutions-website', kind: 'source' },
    ],
    stack: ['Playwright', 'pytest', 'Jest', 'Vitest', 'Docker', 'Linux', 'Windows'],
    faq: [
      {
        q: 'Can you test without access to production?',
        a: 'Yes. A staging copy with representative data is enough. Production access is never required.',
      },
      {
        q: 'Do you fix the bugs you find?',
        a: 'If the engagement includes it, yes. Otherwise each defect is documented so your team can act on it.',
      },
      {
        q: 'What does support cover?',
        a: 'Defined systems and hours, with a severity model, response times and a named contact.',
      },
    ],
  },
];

export const services = serviceDetails;

export const getService = (id: string) => serviceDetails.find((service) => service.id === id);

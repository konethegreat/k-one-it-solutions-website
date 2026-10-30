// Written by Kone Tshivhinda & Claude
// Copy for principles, process, skills and the About timeline.

export const principles = [
  {
    title: 'AI drafts. People decide.',
    body: 'Every system has a human gate before anything consequential happens. AI proposes; a person approves.',
  },
  {
    title: 'Predictable spend, by design.',
    body: 'Usage ledgers, budget guards and rate limits keep AI features useful without surprise invoices. Where it fits, a local model does the work for no per-token cost.',
  },
  {
    title: 'Honest about status.',
    body: 'Prototypes are called prototypes. Simulated integrations are labelled as simulated. If it has not been verified, it is not called production-ready.',
  },
  {
    title: 'Data that stays home.',
    body: 'Privacy-sensitive work runs on local or open-weight models, with POPIA-aware handling, so prompts and evidence do not have to leave the machine, or the country.',
  },
];

export const process = [
  { step: '01', title: 'Discover', body: 'Understand the problem, the people involved, the data and the constraints, including privacy and budget.' },
  { step: '02', title: 'Design', body: 'Agree the architecture, decisions and estimate in writing, so everyone knows what will be built and why.' },
  { step: '03', title: 'Build', body: 'Ship in small, tested increments with CI from day one, so progress is visible and changes stay safe.' },
  { step: '04', title: 'Hand over', body: 'Deploy, document and hand over, with support available afterwards.' },
];

export const skillGroups = [
  { title: 'AI & agents', items: ['Multi-agent orchestration', 'MCP hosts and servers', 'Tool calling', 'Human-in-the-loop controls', 'Spec-driven development'] },
  { title: 'Retrieval & data', items: ['Hybrid RAG', 'pgvector', 'Embeddings', 'Document AI and OCR', 'Neo4j', 'PostgreSQL', 'Redis', 'SQLite'] },
  { title: 'Models & APIs', items: ['Claude', 'OpenAI', 'Gemini', 'Ollama', 'LM Studio', 'Voyage AI', 'Open-weight models'] },
  { title: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'Rust', 'SQL', 'Bash', 'PowerShell'] },
  { title: 'Back end & front end', items: ['FastAPI', 'Spring Boot', 'Node.js / Express', 'NestJS', 'React', 'Next.js', 'Vite', 'Tailwind CSS', 'React Native (Expo)'] },
  { title: 'Cloud & DevOps', items: ['AWS', 'Terraform', 'CloudFormation', 'Docker', 'GitHub Actions', 'nginx'] },
  { title: 'Security & quality', items: ['RBAC', 'MFA', 'Rate limiting', 'CSP', 'Secret scanning', 'SBOM and CVE scanning', 'Playwright', 'pytest', 'Jest', 'Vitest'] },
];

export const timeline = [
  {
    when: '2025 to present',
    role: 'Founder',
    org: 'K-ONE IT SOLUTIONS, Johannesburg',
    body: 'An independent software studio building AI systems, web apps and tooling, from first commit to live deployment.',
  },
  {
    when: 'Jun to Oct 2026',
    role: 'Founding engineer',
    org: 'Law-firm technology team, Johannesburg',
    body: 'Helped set up a new in-house software engineering team and led multi-tenant, POPIA-aligned application work, including AI integrations with human sign-off, cloud infrastructure and CI/CD.',
  },
  {
    when: 'Jan 2025 to Feb 2026',
    role: 'Software tester & technical support specialist',
    org: 'Mademe ICT, Centurion',
    body: 'Functional, integration and performance testing, plus tier-2 support, across IT service deployments, network infrastructure and smart automation systems.',
  },
  {
    when: 'Apr to Aug 2024',
    role: 'Intern assistant platoon leader & tech support',
    org: 'GAO Tek Inc., remote (Canada)',
    body: 'Directed technical squads, reviewed work and mentored new interns.',
  },
];

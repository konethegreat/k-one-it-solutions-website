// Written by Kone Tshivhinda & Claude
// Merges the GitHub snapshot (repos.json, public repositories only) with curated copy.
// Any new public repo appears automatically; add an entry to `curated` to give it a title, summary and category.
import repos from './repos.json';
import { links } from '../config';

export type Status = 'live' | 'public' | 'prototype' | 'demo' | 'coursework';
export type Category = 'AI & agents' | 'Legal & civic tech' | 'Web & apps' | 'Tools & DevOps' | 'Learning';

export const categories: Category[] = ['AI & agents', 'Legal & civic tech', 'Web & apps', 'Tools & DevOps', 'Learning'];

export const statusLabel: Record<Status, string> = {
  live: 'Live',
  public: 'Public source',
  prototype: 'Prototype',
  demo: 'Demo',
  coursework: 'Coursework',
};

interface Curated {
  /** Overrides the GitHub homepage field for the live link. */
  liveUrl?: string;
  title: string;
  summary?: string;
  category: Category;
  status: Status;
  featured?: number; // lower = earlier on the home page
  tech?: string[];
  highlights?: string[];
}

const curated: Record<string, Curated> = {
  'agentos-studio': {
    title: 'AgentOS Studio',
    summary:
      'A local control plane for a multi-agent fleet: one desktop app and MCP hub where agents take work from a shared bus, share one memory and merge only after the checks pass. Released, v1.0.0.',
    category: 'AI & agents',
    status: 'public',
    featured: 0,
    tech: ['Rust', 'Tauri', 'React', 'SQLite', 'MCP'],
    highlights: ['v1.0.0', '13 hub tools', '436 Rust tests'],
  },
  Vigil: {
    title: 'Vigil',
    summary:
      'A sovereign operational-intelligence platform that models assets, people, places and events as a governed ontology. In development, source available, no live deployment.',
    category: 'AI & agents',
    status: 'public',
    featured: 1,
    tech: ['Java', 'Python', 'TypeScript', 'Next.js', 'PostgreSQL'],
    highlights: ['In development', '12 ADRs', 'Source available'],
  },
  scratch: {
    title: 'SA-JAS',
    summary:
      'Three AI agents find South African vacancies, tailor an ATS-friendly CV and cover letter, and guide the application in a visible browser. The person still presses submit. Hosted web alpha.',
    category: 'AI & agents',
    status: 'live',
    liveUrl: 'https://sajas.pages.dev/',
    featured: 2,
    tech: ['Electron', 'React', 'Express', 'Playwright', 'Claude'],
    highlights: ['Hosted alpha', '3 AI agents', '12 job boards'],
  },
  'munisolve-za': {
    title: 'MuniSolve ZA',
    summary:
      'Citizens report municipal issues, administrators triage them on a live heat map, and a Claude-powered assistant answers citizen questions within a strict hourly limit.',
    category: 'Legal & civic tech',
    status: 'live',
    liveUrl: 'https://munisolve-za.vercel.app/',
    featured: 3,
    tech: ['React 19', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'],
    highlights: ['Live', '3 user roles', 'Rate-limited AI assistant'],
  },
  clearcut: {
    title: 'ClearCut',
    summary:
      'Agent-native invoicing for South Africa: one Rust codebase exposed as a REST API, an MCP server and a Claude plugin, with VAT rules written as tested code. Live alpha, invite only.',
    category: 'AI & agents',
    status: 'live',
    liveUrl: 'https://145-241-100-85.sslip.io/',
    featured: 4,
    tech: ['Rust', 'axum', 'PostgreSQL', 'MCP', 'TypeScript'],
    highlights: ['Live alpha', 'Apache-2.0', '13 MCP tools'],
  },
  timelex: {
    title: 'TimeLex',
    summary:
      'Open, API-first practice management for South African law firms. It captures work signals, drafts the narrative and prepares the bill, asking a person only when it must. Pre-alpha.',
    category: 'Legal & civic tech',
    status: 'public',
    featured: 5,
    tech: ['Rust', 'Python', 'TypeScript', 'PostgreSQL', 'MCP'],
    highlights: ['Pre-alpha', 'Apache-2.0', 'Designed in the open'],
  },
  'ui-vault': {
    title: 'UI Vault',
    summary:
      'A provenance-first index of UI and UX patterns, with attribution and usage rights recorded for every entry.',
    category: 'Web & apps',
    status: 'live',
    liveUrl: 'https://konethegreat.github.io/ui-vault/',
    tech: ['TypeScript', 'Astro'],
    highlights: ['Live gallery', 'MIT'],
  },
  Diary: {
    title: 'Diary',
    summary:
      'A private, single-user diary with local SQLite storage and optional AI providers, including local models, so entries can stay on your own machine.',
    category: 'AI & agents',
    status: 'public',
    featured: 6,
    tech: ['Python', 'FastAPI', 'HTMX', 'SQLite', 'Ollama'],
    highlights: ['Local-first', 'PolyForm Noncommercial'],
  },
  'timelex-automated-time-tracking-v2': { title: 'TimeLex v2 (prototype)', category: 'Legal & civic tech', status: 'prototype' },
  'timelex-automated-time-tracking': { title: 'TimeLex v1 (prototype)', category: 'Legal & civic tech', status: 'prototype' },
  'performance-management-tool': { title: 'Performance management tool', category: 'Legal & civic tech', status: 'demo' },
  'systems-project-management-': { title: 'Engineering project workspace', category: 'Web & apps', status: 'demo' },
  'k-one-solutions-media': { title: 'K-ONE Solutions Media', category: 'Web & apps', status: 'prototype' },
  'konethegreat.github.io': { title: 'Portfolio site', category: 'Web & apps', status: 'live' },
  konethegreat: { title: 'GitHub profile README', category: 'Web & apps', status: 'public' },
  'k-one-it-solutions-website': {
    title: 'This website',
    summary: 'The source for this site: Astro, React islands and Tailwind CSS, deployed as static files.',
    category: 'Web & apps',
    status: 'live',
    liveUrl: import.meta.env.SITE,
  },
  'server-health-monitor': {
    title: 'Server Health Monitor',
    summary: 'Monitors CPU, memory and disk with configurable thresholds, alerting to Slack and email, with Docker packaging and tests on Windows and Linux.',
    category: 'Tools & DevOps',
    status: 'public',
    tech: ['Python', 'Docker', 'GitHub Actions'],
  },
};

export interface Project {
  name: string;
  title: string;
  summary: string;
  category: Category;
  status: Status;
  featured: number | null;
  tech: string[];
  highlights: string[];
  repoUrl: string;
  liveUrl: string | null;
  license: string | null;
}

const prettify = (name: string) => name.replace(/[-_.]+/g, ' ').replace(/\s+/g, ' ').trim();
const tidy = (text: string) => text.replace(/\s*\u2014\s*/g, ', ');

export const projects: Project[] = repos.map((r) => {
  const c = curated[r.name];
  const isLearning = r.fork || r.topics.includes('coursework');
  const category: Category = c?.category ?? (isLearning ? 'Learning' : 'Web & apps');
  const status: Status = c?.status ?? (isLearning ? 'coursework' : 'public');
  const tech = c?.tech ?? [r.language, ...r.topics.filter((t) => !['coursework', 'ibm-skills-network', 'portfolio'].includes(t))]
    .filter((t): t is string => Boolean(t))
    .slice(0, 5);
  return {
    name: r.name,
    title: c?.title ?? prettify(r.name),
    summary: c?.summary ?? tidy(r.description),
    category: isLearning && !c ? 'Learning' : category,
    status,
    featured: c?.featured ?? null,
    tech,
    highlights: c?.highlights ?? [],
    repoUrl: `https://github.com/konethegreat/${r.name}`,
    liveUrl: c?.liveUrl ?? r.homepage,
    license: r.license,
  };
});

export const featured = projects
  .filter((p) => p.featured !== null)
  .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));

const learningLast = (p: Project) => (p.category === 'Learning' ? 1 : 0);
export const allProjects = [...projects].sort(
  (a, b) => learningLast(a) - learningLast(b) || (a.featured ?? 99) - (b.featured ?? 99) || a.title.localeCompare(b.title),
);

/**
 * The live deployments. `href` is the matching entry in `links` in src/config.ts. Each page that
 * lists them reads its own copy from a per-surface field: `work` holds the note and status shown
 * in the live products band on /work/, and `home` holds the note and status shown in the "Live right
 * now" list on the home page, whose length is also the home page's "live deployments" figure.
 */
export interface LiveProduct {
  name: string;
  href: string;
  work: { note: string; status: string };
  home: { note: string; status: string };
}

export const liveProducts: LiveProduct[] = [
  {
    name: 'SA-JAS',
    href: links.sajas,
    work: { note: 'Find vacancies, tailor the CV, guide the application.', status: 'Hosted alpha' },
    home: { note: 'AI job application suite', status: 'Alpha' },
  },
  {
    name: 'ClearCut',
    href: links.clearcut,
    work: { note: 'Read a South African invoice and check every figure.', status: 'Live alpha, invite only' },
    home: { note: 'Invoice reading demo', status: 'Alpha' },
  },
  {
    name: 'MuniSolve ZA',
    href: links.munisolve,
    work: { note: 'Report a municipal fault and follow it on a live map.', status: 'Live' },
    home: { note: 'Municipal issue reporting', status: 'Live' },
  },
  {
    name: 'Portfolio',
    href: links.portfolio,
    work: { note: 'The personal site and the rest of the public record.', status: 'Live' },
    home: { note: 'Personal site and notes', status: 'Live' },
  },
  {
    name: 'UI Vault',
    href: links.vault,
    work: { note: 'A sourced index of interface patterns and their rights.', status: 'Live' },
    home: { note: 'Interface reference gallery', status: 'Live' },
  },
];

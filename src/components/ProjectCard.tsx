// Written by Kone Tshivhinda & Claude
import { Code, ExternalLink } from 'lucide-react';
import { statusLabel, type Project } from '../data/projects';

const statusStyle: Record<Project['status'], string> = {
  live: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  public: 'border-line bg-surface-2 text-muted',
  prototype: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  demo: 'border-line bg-surface-2 text-muted',
  coursework: 'border-line bg-surface-2 text-muted',
};

export default function ProjectCard({ project: p }: { project: Project }) {
  return (
    <article className="card card-hover flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">{p.title}</h3>
        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle[p.status]}`}>
          {statusLabel[p.status]}
        </span>
      </div>

      <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted">{p.category}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{p.summary}</p>

      {p.highlights.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Highlights">
          {p.highlights.map((h) => (
            <li key={h} className="chip text-fg!">
              {h}
            </li>
          ))}
        </ul>
      )}

      {p.tech.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
          {p.tech.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <a className="pill-link" href={p.repoUrl} target="_blank" rel="noopener noreferrer">
          <Code size={14} aria-hidden="true" />
          Source
          <span className="sr-only">for {p.title} (opens in a new tab)</span>
        </a>
        {p.liveUrl && (
          <a className="pill-link" href={p.liveUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={14} aria-hidden="true" />
            Live
            <span className="sr-only">site for {p.title} (opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}

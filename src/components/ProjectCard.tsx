// Written by Kone Tshivhinda & Claude
import { Code, ExternalLink } from 'lucide-react';
import { statusLabel, type Project } from '../data/projects';

const statusStyle: Record<Project['status'], string> = {
  live: 'stamp-ok',
  public: 'stamp-neutral',
  prototype: 'stamp-warn',
  demo: 'stamp-neutral',
  coursework: 'stamp-neutral',
};

export default function ProjectCard({ project: p }: { project: Project }) {
  return (
    <article className="card card-hover flex h-full flex-col rounded-[0.3rem] p-5 hover:border-brand">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted">
            <span className="text-brand">{p.name}</span>
          </p>
          <h3 className="mt-1 text-lg leading-snug">{p.title}</h3>
        </div>
        <span className={`stamp ${statusStyle[p.status]} shrink-0`}>{statusLabel[p.status]}</span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted">{p.summary}</p>

      {p.highlights.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Highlights">
          {p.highlights.map((h) => (
            <li key={h} className="chip border-brand/30 text-fg!">
              {h}
            </li>
          ))}
        </ul>
      )}

      {p.tech.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Technologies">
          {p.tech.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-5">
        <div className="flex flex-wrap gap-2 border-t border-line pt-4">
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
      </div>
    </article>
  );
}

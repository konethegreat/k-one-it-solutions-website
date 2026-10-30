// Written by Kone Tshivhinda & Claude
// Searchable, filterable list of every public GitHub project. Server-rendered with all cards,
// then enhanced in the browser, so the full list is readable even before JavaScript runs.
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import ProjectCard from './ProjectCard';
import type { Category, Project } from '../data/projects';

interface Props {
  projects: Project[];
  categories: Category[];
}

export default function ProjectExplorer({ projects, categories }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | Category>('All');
  const [liveOnly, setLiveOnly] = useState(false);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        if (category !== 'All' && p.category !== category) return false;
        if (liveOnly && p.status !== 'live') return false;
        if (!q) return true;
        return [p.title, p.name, p.summary, p.category, ...p.tech, ...p.highlights].join(' ').toLowerCase().includes(q);
      }),
    [projects, category, liveOnly, q],
  );

  const countFor = (c: Category) => projects.filter((p) => p.category === c).length;
  const active = q !== '' || category !== 'All' || liveOnly;

  const reset = () => {
    setQuery('');
    setCategory('All');
    setLiveOnly(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-line py-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects and technologies"
            className="w-full rounded-[0.3rem] border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-fg placeholder:text-muted focus:border-brand"
          />
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
          <input
            type="checkbox"
            checked={liveOnly}
            onChange={(e) => setLiveOnly(e.target.checked)}
            className="h-4 w-4 accent-[var(--brand)]"
          />
          Live only
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {(['All', ...categories] as const).map((c) => {
          const selected = category === c;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={selected}
              onClick={() => setCategory(c)}
              className={`inline-flex items-center gap-2 rounded-[0.3rem] border px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] transition ${
                selected
                  ? 'border-brand bg-brand text-white'
                  : 'border-line bg-surface text-fg hover:border-brand'
              }`}
            >
              {c}
              <span className={selected ? 'text-white/75' : 'text-muted'}>{c === 'All' ? projects.length : countFor(c)}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted" aria-live="polite">
          Showing {filtered.length} of {projects.length} public repositories
        </p>
        {active && (
          <button
            type="button"
            onClick={reset}
            className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-brand underline underline-offset-4"
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
      ) : (
        <div className="card mt-4 flex flex-col items-start gap-4 rounded-[0.3rem] p-8">
          <p className="text-sm text-muted">
            Nothing in the public archive matches that search. Try a different word or clear the filters.
          </p>
          <button type="button" onClick={reset} className="btn btn-ghost text-sm">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

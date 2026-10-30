// Written by Kone Tshivhinda & Claude
import { useState, type PointerEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const services = [
  { label: 'AI agents', x: 260, y: 110, lx: 260, ly: 88, anchor: 'middle' },
  { label: 'Web', x: 390, y: 185, lx: 404, ly: 174, anchor: 'start' },
  { label: 'Cloud', x: 390, y: 335, lx: 404, ly: 346, anchor: 'start' },
  { label: 'QA', x: 260, y: 410, lx: 260, ly: 436, anchor: 'middle' },
  { label: 'Sovereign AI', x: 130, y: 335, lx: 116, ly: 346, anchor: 'end' },
  { label: 'Retrieval', x: 130, y: 185, lx: 116, ly: 174, anchor: 'end' },
] as const;

const projects = [
  { label: 'SA-JAS', x: 97, y: 97, lx: 97, ly: 76, from: 0, to: 5 },
  { label: 'ClearCut', x: 423, y: 97, lx: 423, ly: 76, from: 1, to: 0 },
  { label: 'Vigil', x: 423, y: 423, lx: 423, ly: 450, from: 2, to: 4 },
  { label: 'TimeLex', x: 97, y: 423, lx: 97, ly: 450, from: 4, to: 3 },
] as const;

export default function SystemMap() {
  const reduce = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 16;
    setOffset({ x, y });
  };

  return (
    <div className="mx-auto w-full max-w-[540px]" onPointerMove={onMove} onPointerLeave={() => setOffset({ x: 0, y: 0 })}>
      <motion.div animate={{ x: offset.x, y: offset.y }} transition={{ type: 'spring', stiffness: 60, damping: 18 }}>
        <svg
          viewBox="0 0 520 520"
          role="img"
          aria-label="A map of the studio at the centre, six services on an inner ring and four projects on an outer ring: SA-JAS, ClearCut, Vigil and TimeLex."
          className="h-auto w-full overflow-visible"
        >
          <defs>
            <radialGradient id="map-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2b4eff" />
              <stop offset="100%" stopColor="#14151c" />
            </radialGradient>
          </defs>

          {[76, 150, 225].map((r, index) => (
            <circle
              key={r}
              cx="260"
              cy="260"
              r={r}
              fill="none"
              stroke="var(--line)"
              strokeWidth="1"
              strokeDasharray={index === 2 ? '2 7' : '1 9'}
              opacity="0.9"
            />
          ))}

          {[0, 90, 180, 270].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={angle}
                x1={260 + Math.cos(rad) * 232}
                y1={260 + Math.sin(rad) * 232}
                x2={260 + Math.cos(rad) * 238}
                y2={260 + Math.sin(rad) * 238}
                stroke="var(--line)"
                strokeWidth="1"
              />
            );
          })}

          {services.map((service, index) => (
            <line
              key={`spoke-${service.label}`}
              x1="260"
              y1="260"
              x2={service.x}
              y2={service.y}
              stroke="var(--line)"
              strokeWidth="1"
              className="map-draw"
              style={{ animationDelay: `${index * 90}ms` }}
            />
          ))}

          {projects.map((project, index) => {
            const from = services[project.from];
            const to = services[project.to];
            return (
              <path
                key={`link-${project.label}`}
                d={`M ${from.x} ${from.y} Q 260 260 ${to.x} ${to.y}`}
                fill="none"
                stroke="var(--brand)"
                strokeWidth="1"
                strokeDasharray="2 5"
                opacity="0.28"
                className="map-draw"
                style={{ animationDelay: `${400 + index * 110}ms` }}
              />
            );
          })}

          {services.map((service, index) => (
            <g key={service.label}>
              <circle cx={service.x} cy={service.y} r="4.5" fill="var(--bg)" stroke="var(--fg)" strokeWidth="1.2" />
              <text
                x={service.lx}
                y={service.ly}
                textAnchor={service.anchor}
                fill="var(--muted)"
                fontFamily="var(--font-mono)"
                fontSize="9.5"
                letterSpacing="0.08em"
                style={{ textTransform: 'uppercase' }}
                className="map-label"
              >
                {service.label}
              </text>
              <circle cx={service.x} cy={service.y} r="10" fill="none" stroke="var(--brand)" opacity="0.14" className="map-pulse" style={{ animationDelay: `${index * 280}ms` }} />
            </g>
          ))}

          {projects.map((project) => (
            <g key={project.label}>
              <rect x={project.x - 4} y={project.y - 4} width="8" height="8" fill="var(--fg)" transform={`rotate(45 ${project.x} ${project.y})`} />
              <text
                x={project.lx}
                y={project.ly}
                textAnchor="middle"
                fill="var(--fg)"
                fontFamily="var(--font-mono)"
                fontSize="9"
                letterSpacing="0.1em"
                style={{ textTransform: 'uppercase' }}
                className="map-label"
              >
                {project.label}
              </text>
            </g>
          ))}

          <circle cx="260" cy="260" r="46" fill="none" stroke="var(--line)" strokeWidth="1" />
          <circle cx="260" cy="260" r="38" fill="url(#map-core)" />
          <circle cx="260" cy="222" r="3.5" fill="var(--lime)" className="animate-pulse" />
          <text x="260" y="256" textAnchor="middle" fill="#ffffff" fontFamily="var(--font-display)" fontSize="17">
            K-ONE
          </text>
          <text x="260" y="272" textAnchor="middle" fill="#c6f24e" fontFamily="var(--font-mono)" fontSize="6.5" letterSpacing="0.22em">
            IT SOLUTIONS
          </text>
        </svg>
      </motion.div>
      <p className="mt-2 text-center font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
        Six services. Four systems in the open.
      </p>
    </div>
  );
}

// Written by Kone Tshivhinda & Claude
// Animated "agent loop" card for the home page hero. Respects prefers-reduced-motion.
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const steps = [
  { label: 'plan', text: 'Break the task into steps' },
  { label: 'act', text: 'Call tools and search the sources' },
  { label: 'verify', text: 'Check every claim against a citation' },
  { label: 'retry', text: 'Fix the gaps, or ask a person' },
];

export default function HeroVisual() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % steps.length), 1800);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <motion.div
      role="img"
      aria-label="Illustration of an AI agent loop: plan, act, verify, retry, with cited sources, capped usage and human sign-off"
      animate={reduce ? undefined : { y: [0, -8, 0] }}
      transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      className="relative mx-auto w-full max-w-md"
    >
      <div
        aria-hidden="true"
        className="absolute -inset-3 rounded-[2rem] opacity-60 blur-2xl"
        style={{ backgroundImage: 'linear-gradient(135deg, var(--d1), var(--d2), var(--d3))' }}
      />
      <div
        className="relative rounded-[1.6rem] p-px"
        style={{ backgroundImage: 'linear-gradient(135deg, var(--d1), var(--d2), var(--d3))' }}
      >
        <div className="rounded-[1.55rem] bg-surface p-5 sm:p-6" aria-hidden="true">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="font-mono text-xs text-muted">agent-loop.sh</span>
          </div>

          <ol className="space-y-2">
            {steps.map((s, i) => (
              <li key={s.label} className="relative">
                {active === i && (
                  <motion.span
                    layoutId="active-step"
                    className="absolute inset-0 rounded-xl border border-brand/60 bg-surface-2"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <div className="relative flex items-center gap-3 px-3 py-2.5">
                  <span
                    className={`w-14 shrink-0 font-mono text-xs uppercase tracking-wider ${
                      active === i ? 'text-brand' : 'text-muted'
                    }`}
                  >
                    {s.label}
                  </span>
                  <span className={`text-sm ${active === i ? 'text-fg' : 'text-muted'}`}>{s.text}</span>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-5 space-y-1.5 border-t border-line pt-4 font-mono text-xs">
            <p className="text-emerald-600 dark:text-emerald-400">✓ cited sources only</p>
            <p className="text-emerald-600 dark:text-emerald-400">✓ usage capped, cost visible</p>
            <p className="text-amber-600 dark:text-amber-400">! human sign-off required</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

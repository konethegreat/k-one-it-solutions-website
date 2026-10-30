// Written by Kone Tshivhinda & Claude
// Renders the final number on the server, then counts up once when it comes into view.
import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  label: string;
  suffix?: string;
}

const formatter = new Intl.NumberFormat('en-ZA');

export default function StatTicker({ value, label, suffix = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let started = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started) return;
        started = true;
        observer.disconnect();

        const start = performance.now();
        setDisplay(0);
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / 900);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <div>
      <p className="font-display text-5xl leading-none tracking-tight sm:text-6xl">
        <span ref={ref}>{formatter.format(display)}</span>
        {suffix && <span className="text-brand">{suffix}</span>}
      </p>
      <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">{label}</p>
    </div>
  );
}

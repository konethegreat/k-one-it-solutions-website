// Written by Kone Tshivhinda & Claude
// Pattern inspired by Kaif UI's Circular Navigation Bar (21st.dev), implemented from scratch.
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FolderOpen, Home, Layers, Mail, Plus, User, X } from 'lucide-react';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/services/', label: 'Services', icon: Layers },
  { href: '/work/', label: 'Work', icon: FolderOpen },
  { href: '/about/', label: 'About', icon: User },
  { href: '/contact/', label: 'Contact', icon: Mail },
];

export default function CircularNav() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [compact, setCompact] = useState(false);
  const [path, setPath] = useState('');
  const reduce = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    setPath(window.location.pathname);
    const onScroll = () => setVisible(window.scrollY > 480);
    const onResize = () => setCompact(window.innerWidth < 640);
    onScroll();
    onResize();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const onRoute = () => {
      setPath(window.location.pathname);
      setOpen(false);
      setVisible(window.scrollY > 480);
    };
    document.addEventListener('astro:page-load', onRoute);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('astro:page-load', onRoute);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (wrapRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  useEffect(() => {
    if (open) {
      const first = itemRefs.current[0];
      window.requestAnimationFrame(() => first?.focus());
    }
  }, [open]);

  const close = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  const focusables = (): (HTMLAnchorElement | HTMLButtonElement)[] =>
    [...itemRefs.current.filter((el): el is HTMLAnchorElement => Boolean(el)), triggerRef.current].filter(
      (el): el is HTMLAnchorElement | HTMLButtonElement => Boolean(el),
    );

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      close(true);
      return;
    }
    if (event.key === 'Tab' && open) {
      const list = focusables();
      const first = list[0];
      const last = list.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    if (!open) {
      if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    const current = itemRefs.current.findIndex((el) => el === document.activeElement);
    if (current === -1) return;
    let next = current;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % items.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (current - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;
    event.preventDefault();
    itemRefs.current[next]?.focus();
  };

  const radius = compact ? 100 : 132;
  const start = -168;
  const end = -12;
  const step = (end - start) / (items.length - 1);

  if (!visible) return null;

  return (
    <div ref={wrapRef} className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 print:hidden" onKeyDown={onKeyDown}>
      <nav aria-label="Quick navigation" aria-describedby="quick-nav-help">
        <p id="quick-nav-help" className="sr-only">
          Use the arrow keys to move between links, and Escape to close.
        </p>

        <AnimatePresence>
          {open && (
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.18 }}
              className={`pointer-events-none absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full bg-bg/65 backdrop-blur-md ${
                compact ? 'h-64 w-64' : 'h-80 w-80'
              }`}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {open && (
            <ul id="quick-nav" className="absolute bottom-1/2 left-1/2 z-10 m-0 list-none p-0">
              {items.map((item, index) => {
                const angle = ((start + step * index) * Math.PI) / 180;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const Icon = item.icon;
                return (
                  <motion.li
                    key={item.href}
                    className="absolute left-0 top-0"
                    initial={reduce ? { opacity: 0, scale: 0.85 } : { x: 0, y: 0, opacity: 0, scale: 0.5 }}
                    animate={reduce ? { opacity: 1, scale: 1 } : { x, y, opacity: 1, scale: 1 }}
                    exit={reduce ? { opacity: 0, scale: 0.85 } : { x: 0, y: 0, opacity: 0, scale: 0.5 }}
                    transition={
                      reduce
                        ? { duration: 0.14 }
                        : { type: 'spring', stiffness: 420, damping: 30, delay: index * 0.035 }
                    }
                  >
                    <a
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      href={item.href}
                      aria-current={path === item.href ? 'page' : undefined}
                      onClick={() => close()}
                      className="group relative grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-fg no-underline shadow-lg transition hover:border-brand hover:text-brand aria-[current=page]:border-brand aria-[current=page]:text-brand"
                    >
                      <Icon size={17} aria-hidden="true" />
                      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-ink-bg px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-fg opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                        {item.label}
                      </span>
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </AnimatePresence>

        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={open ? 'quick-nav' : undefined}
          aria-label={open ? 'Close quick navigation' : 'Open quick navigation'}
          onClick={() => setOpen((value) => !value)}
          className="relative z-10 grid h-16 w-16 place-items-center rounded-full bg-ink-bg text-lime shadow-2xl ring-1 ring-white/15 transition hover:scale-[1.03]"
        >
          <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" aria-hidden="true" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? 'close' : 'open'}
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.16 }}
              className="grid place-items-center"
              aria-hidden="true"
            >
              {open ? <X size={20} /> : <Plus size={20} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </nav>
    </div>
  );
}

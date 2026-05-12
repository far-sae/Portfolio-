'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

const items = [
  { href: '#about', label: 'About', n: '02' },
  { href: '#experience', label: 'Trajectory', n: '03' },
  { href: '#projects', label: 'Work', n: '04' },
  { href: '#contact', label: 'Contact', n: '05' }
];

export function Nav() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 right-0 top-0 z-50"
      >
        <div className="container-x mt-4">
          <div className="glass flex items-center justify-between rounded-full px-4 py-2.5">
            <Link href="/" data-cursor="home" className="group flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="mono text-[11px] uppercase tracking-[0.22em] text-ink">
                faraz / portfolio
              </span>
            </Link>
            <nav className="hidden gap-1 sm:flex">
              {items.map((it) => (
                <a
                  key={it.href}
                  href={it.href}
                  data-cursor={it.label.toLowerCase()}
                  className="group flex items-center gap-1.5 rounded-full px-3 py-1.5 mono text-[10px] uppercase tracking-[0.22em] text-muted transition-colors hover:text-ink"
                >
                  <span className="text-muted/60">{it.n}</span>
                  <span>{it.label}</span>
                </a>
              ))}
            </nav>
            <a
              href="mailto:farazs156@gmail.com"
              data-cursor="email"
              className="mono rounded-full bg-ink px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-bg transition-colors hover:bg-white"
            >
              Hire
            </a>
          </div>
        </div>
      </motion.header>

      {/* page scroll progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 right-0 top-0 z-[60] h-px origin-left bg-accent"
      />
    </>
  );
}

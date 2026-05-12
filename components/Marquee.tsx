'use client';

import { motion } from 'framer-motion';

export function Marquee({
  items,
  duration = 35,
  reverse = false,
  className
}: {
  items: string[];
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent"
      />
      <motion.div
        className="flex w-max gap-12 whitespace-nowrap py-2"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {[...items, ...items].map((it, i) => (
          <span
            key={i}
            className="flex items-center gap-3 font-mono text-sm uppercase tracking-[0.18em] text-muted"
          >
            <span className="h-1 w-1 rounded-full bg-accent" />
            {it}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

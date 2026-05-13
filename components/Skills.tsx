'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import skills from '@/data/skills.json';
import { Section, SectionHeader } from './Section';
import { BrandLogo } from './BrandLogo';
import { Marquee } from './Marquee';

const ease = [0.16, 1, 0.3, 1] as const;

export function Skills() {
  const [activeGroup, setActiveGroup] = useState(0);
  const active = skills.groups[activeGroup];

  // flatten everything for the scrolling strip
  const allLogos = skills.groups.flatMap((g) => g.items.map((it) => it));

  return (
    <Section id="skills" className="!py-28">
      <SectionHeader
        index="N° 02.5"
        eyebrow="Toolbelt / Stack"
        title={
          <>
            The actual tools.{' '}
            <span className="text-muted">Used, shipped, supported.</span>
          </>
        }
        description="No buzzwords. Every logo here represents something I have wired into a production system or supported under SLA."
      />

      {/* group selector */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {skills.groups.map((g, i) => (
            <motion.button
              key={g.label}
              onClick={() => setActiveGroup(i)}
              data-cursor="tab"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={`mono rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-all ${
                activeGroup === i
                  ? 'border-ink bg-ink text-bg'
                  : 'border-line bg-surface/40 text-muted hover:border-muted hover:text-ink'
              }`}
            >
              {g.label}
              <span className="ml-2 text-muted/60">{g.items.length}</span>
            </motion.button>
          ))}
        </div>
        <div className="label">
          {active.items.length} tools / {active.label}
        </div>
      </div>

      {/* logo grid */}
      <motion.div
        key={activeGroup}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6"
      >
        {active.items.map((it, i) => (
          <motion.div
            key={it.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.04, ease }}
            whileHover={{ y: -4 }}
            className="group relative flex aspect-square flex-col items-center justify-between overflow-hidden bg-bg p-5"
          >
            {/* hover glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(closest-side at center, rgba(255,255,255,0.08), transparent 75%)'
              }}
            />

            {/* level chip */}
            <div className="relative flex w-full items-start justify-between">
              <span className="mono text-[9px] uppercase tracking-[0.22em] text-muted">
                /{String(i + 1).padStart(2, '0')}
              </span>
              <span className="mono text-[9px] uppercase tracking-[0.22em] text-muted">
                {it.level}
              </span>
            </div>

            {/* logo */}
            <motion.div
              whileHover={{ scale: 1.12, rotate: -2 }}
              transition={{ type: 'spring', stiffness: 220, damping: 14 }}
              className="relative flex items-center justify-center"
            >
              <div
                aria-hidden
                className="absolute h-16 w-16 rounded-full bg-white opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-15"
              />
              <BrandLogo
                slug={it.slug}
                name={it.name}
                size={48}
                monochrome
                className="relative drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-110"
              />
            </motion.div>

            {/* name */}
            <div className="relative w-full text-center">
              <div className="text-sm font-medium text-ink/90">{it.name}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* scrolling logo strip below */}
      <div className="mt-12 border-y border-line/80 py-5">
        <div className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent"
          />
          <motion.div
            className="flex w-max items-center gap-10"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 50, ease: 'linear', repeat: Infinity }}
          >
            {[...allLogos, ...allLogos].map((it, i) => (
              <div key={i} className="flex items-center gap-3 opacity-60 transition-opacity hover:opacity-100">
                <BrandLogo
                  slug={it.slug}
                  name={it.name}
                  size={28}
                  monochrome
                />
                <span className="mono whitespace-nowrap text-xs uppercase tracking-[0.18em] text-muted">
                  {it.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

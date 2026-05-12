'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import experience from '@/data/experience.json';
import { Section, SectionHeader } from './Section';

export function Experience() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start 60%', 'end 40%']
  });
  const fillHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <Section id="experience">
      <SectionHeader
        index="N° 03"
        eyebrow="Trajectory / 2020 → 2026"
        title={
          <>
            Five roles. One thread.{' '}
            <span className="text-muted">Turning signal into systems.</span>
          </>
        }
        description="From the data desk at a US mortgage giant to running engineering at a London cyber AI startup."
      />

      <div ref={wrapRef} className="relative grid grid-cols-1 gap-x-12 md:grid-cols-12">
        {/* Sticky left rail */}
        <aside className="md:col-span-3">
          <div className="sticky top-32">
            <div className="label mb-4">Timeline</div>

            <ol className="relative space-y-3 pl-6">
              {/* full track */}
              <div className="absolute left-2 top-1 h-full w-px bg-line" />
              {/* fill */}
              <motion.div
                style={{ height: fillHeight }}
                className="absolute left-2 top-1 w-px bg-gradient-to-b from-accent via-accent2 to-warn"
              />
              {experience.map((job, i) => (
                <li key={job.company + job.role} className="relative">
                  <span className="absolute left-[-22px] top-2 inline-flex h-3 w-3 items-center justify-center">
                    <span className="block h-1.5 w-1.5 rounded-full bg-ink ring-2 ring-bg" />
                  </span>
                  <a href={`#exp-${i}`} className="group flex items-baseline gap-3">
                    <span className="mono text-xs text-muted">
                      {job.period.split(' / ')[0]}
                    </span>
                    <span className="text-sm text-ink/80 transition-colors group-hover:text-ink">
                      {job.company}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            <div className="mono mt-6 border-t border-line pt-4 text-[10px] uppercase tracking-[0.22em] text-muted">
              5 roles · 2 countries · 1 mindset
            </div>
          </div>
        </aside>

        {/* Long-form scrolling roles */}
        <div className="md:col-span-9">
          <div className="space-y-28">
            {experience.map((job, i) => (
              <Role key={job.company + job.role} job={job} index={i} total={experience.length} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Role({
  job,
  index,
  total
}: {
  job: (typeof import('@/data/experience.json'))[number];
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 70%', 'end 30%']
  });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <motion.div
      id={`exp-${index}`}
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="relative scroll-mt-32"
    >
      <div className="flex items-baseline justify-between gap-6">
        <span className="mono text-xs text-muted">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <span className="mono text-xs uppercase tracking-[0.22em] text-muted">
          {job.period}
        </span>
      </div>

      <div className="relative mt-2 h-px overflow-hidden bg-line">
        <motion.div
          style={{ width: lineWidth }}
          className="absolute left-0 top-0 h-px bg-accent"
        />
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="display mt-6 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl"
      >
        {job.role}
      </motion.h3>
      <div className="mt-1 flex items-center gap-3 text-sm text-muted">
        <span className="text-ink/85">{job.company}</span>
        <span className="h-1 w-1 rounded-full bg-muted/60" />
        <span>{job.location}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.tags.map((t) => (
          <motion.span
            key={t}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -2 }}
            className="mono rounded-full border border-line bg-bg/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-muted"
          >
            {t}
          </motion.span>
        ))}
      </div>

      <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-ink/85">
        {job.highlights.map((h, hi) => (
          <motion.li
            key={hi}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: hi * 0.04 }}
            className="flex items-start gap-3"
          >
            <span className="mono mt-1.5 text-[10px] text-muted/60">
              {String(hi + 1).padStart(2, '0')}
            </span>
            <span>{h}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import skills from '@/data/skills.json';
import { Section, SectionHeader } from './Section';
import { BrandLogo } from './BrandLogo';

const ease = [0.16, 1, 0.3, 1] as const;

export function Achievements() {
  return (
    <Section id="achievements" className="!pb-32 !pt-12">
      <SectionHeader
        index="N° 02.7"
        eyebrow="Achievements / Certifications"
        title={
          <>
            Eight certifications.{' '}
            <span className="text-muted">All earned, all current.</span>
          </>
        }
        description="Cloud fundamentals, networking, malware reverse engineering, and the bedrock security stack. Each one came with weeks of evening study and a real exam."
      />

      <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {skills.achievements.map((a, i) => (
          <AchievementCard key={a.name} cert={a} index={i} />
        ))}
      </div>

      {/* under-row meta */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        <div className="mono text-[10px] uppercase tracking-[0.22em] text-muted">
          MSc Cyber Security / University of Gloucestershire / 2024
        </div>
        <div className="mono text-[10px] uppercase tracking-[0.22em] text-muted">
          B.Tech IT / CSVTU / 2020
        </div>
      </div>
    </Section>
  );
}

function AchievementCard({
  cert,
  index
}: {
  cert: (typeof import('@/data/skills.json'))['achievements'][number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.05, ease }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden bg-bg p-6"
    >
      {/* corner accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
        style={{ background: `#${cert.color}` }}
      />

      {/* corner ticks */}
      <div className="relative flex items-start justify-between">
        <span className="mono text-[10px] uppercase tracking-[0.22em] text-muted">
          /{String(index + 1).padStart(2, '0')}
        </span>
        <CheckCircle2
          className="h-4 w-4"
          style={{ color: `#${cert.color}` }}
        />
      </div>

      {/* logo + ribbon */}
      <div className="relative mt-8 flex items-center gap-4">
        <div className="relative">
          {/* glow */}
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-full blur-2xl"
            style={{ background: `#${cert.color}` }}
            animate={{ opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 4 + index * 0.2, repeat: Infinity }}
          />
          <div
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl border"
            style={{ borderColor: `#${cert.color}66`, background: '#0a0c12' }}
          >
            <BrandLogo
              slug={cert.slug}
              name={cert.name}
              color={cert.color}
              size={40}
            />
          </div>
        </div>
        <div className="min-w-0">
          <div className="display text-lg font-semibold leading-tight tracking-[-0.01em] text-ink">
            {cert.name}
          </div>
          <div className="mt-0.5 text-xs text-muted">{cert.issuer}</div>
        </div>
      </div>

      {/* description */}
      <div className="relative mt-6 text-sm text-ink/85">{cert.title}</div>

      {/* footer hairline */}
      <div className="relative mt-6 flex items-center justify-between border-t border-line pt-3">
        <span className="mono text-[10px] uppercase tracking-[0.22em] text-muted">
          {cert.year}
        </span>
        <span
          className="mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color: `#${cert.color}` }}
        >
          Verified
        </span>
      </div>
    </motion.div>
  );
}

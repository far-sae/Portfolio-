'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import profile from '@/data/profile.json';
import { Scramble } from './Scramble';
import { Magnetic } from './Magnetic';
import { Marquee } from './Marquee';
import { Aurora } from './Aurora';
import { Counter } from './Counter';

const ease = [0.16, 1, 0.3, 1] as const;

function LondonClock() {
  const [t, setT] = useState('--:--:--');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      setT(f.format(d));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="mono tabular-nums">{t}</span>;
}

function LetterStagger({
  text,
  delay = 0,
  className
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`inline-block ${className ?? ''}`} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            initial={{ y: '120%', rotate: 8, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            transition={{
              delay: delay + i * 0.035,
              duration: 0.95,
              ease
            }}
            className="inline-block"
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  return (
    <section ref={ref} className="relative isolate min-h-[100svh] overflow-hidden">
      {/* layered backgrounds */}
      <Aurora />
      <div aria-hidden className="bg-grid grid-fade absolute inset-0 -z-10" />
      <div aria-hidden className="bg-dots absolute inset-0 -z-10 opacity-50" />

      {/* corner labels */}
      <div className="pointer-events-none absolute left-6 top-24 z-10 hidden sm:left-10 md:flex md:flex-col md:gap-1">
        <span className="label">N° 01</span>
        <span className="label">Index / Hero</span>
      </div>
      <div className="pointer-events-none absolute right-6 top-24 z-10 hidden sm:right-10 md:flex md:flex-col md:items-end md:gap-1">
        <span className="label">London / GMT</span>
        <span className="mono text-xs text-ink">
          <LondonClock />
        </span>
      </div>

      <motion.div
        style={{ y, opacity, scale }}
        className="container-x relative flex min-h-[100svh] flex-col justify-between pb-12 pt-40 sm:pt-48"
      >
        {/* top meta row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center gap-x-5 gap-y-2"
        >
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
            </span>
            <span className="mono text-[11px] uppercase tracking-[0.22em] text-muted">
              available / q3 2026
            </span>
          </span>
          <span className="hidden h-3 w-px bg-line sm:block" />
          <span className="mono text-[11px] uppercase tracking-[0.22em] text-muted">
            {profile.location}
          </span>
        </motion.div>

        {/* main title */}
        <div className="my-12">
          <h1 className="display text-[clamp(3.4rem,11vw,11rem)] font-bold leading-[0.86] tracking-[-0.045em] text-ink">
            <LetterStagger text="Faraz" delay={0.1} />
            <br />
            <span className="text-muted">
              <LetterStagger text="Saeed" delay={0.32} />
            </span>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.85,
                duration: 0.6,
                type: 'spring',
                stiffness: 200,
                damping: 12
              }}
              className="ml-1 inline-block align-baseline text-accent"
            >
              .
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease }}
            className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-12"
          >
            <div className="md:col-span-7">
              <p className="max-w-xl text-balance text-lg leading-relaxed text-ink/85 sm:text-xl">
                Security focused engineer building{' '}
                <span className="text-ink">AI driven systems</span> at{' '}
                <a
                  href={profile.links.company}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline text-accent"
                >
                  Securovix
                </a>
                . SOC tooling, cloud detection pipelines, and the data plumbing
                that makes them work in production.
              </p>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              <div className="space-y-2">
                <div className="label">Currently</div>
                <div className="mono text-sm text-ink/85">
                  <Scramble text="Co Founder & CTO" startDelay={1100} />
                </div>
                <div className="mono text-xs text-muted">
                  Securovix · est. nov 2025
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* animated stat bar */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1, ease }}
          className="mb-10 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-line py-6 sm:grid-cols-4"
        >
          {[
            { v: 47, suf: '', label: 'Public repos' },
            { v: 5, suf: '', label: 'Years shipped' },
            { v: 8, suf: '', label: 'Certifications' },
            { v: 10, suf: '', label: 'Case studies' }
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + i * 0.06 }}
              className="flex items-baseline justify-between border-r border-line/40 pr-6 last:border-r-0 sm:block sm:border-r-0 sm:pr-0"
            >
              <div className="display text-3xl font-bold tracking-tighter sm:text-4xl">
                <Counter to={s.v} suffix={s.suf} duration={1.4 + i * 0.15} />
              </div>
              <div className="label mt-1">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3, ease }}
          className="flex flex-wrap items-end justify-between gap-y-8"
        >
          <div className="flex items-center gap-3">
            <Magnetic strength={0.35}>
              <a
                href="#projects"
                data-cursor="view"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink px-5 py-3 mono text-xs uppercase tracking-[0.2em] text-bg transition-colors hover:bg-white"
              >
                <span>Work / 10 case studies</span>
                <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href={`mailto:${profile.email}`}
                data-cursor="email"
                className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-3 mono text-xs uppercase tracking-[0.2em] text-ink/90 transition-colors hover:bg-surface"
              >
                <span>Get in touch</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
          </div>

          {/* scroll cue */}
          <div className="flex items-end gap-3 text-muted">
            <span className="label">Scroll</span>
            <span className="relative block h-10 w-px bg-line">
              <motion.span
                className="absolute left-0 top-0 block w-px bg-ink"
                animate={{ height: ['0%', '100%', '0%'], top: ['0%', '0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* marquee strip */}
      <div className="relative z-10 border-y border-line/80 bg-bg/70 py-3">
        <Marquee
          items={[
            'Cyber Security',
            'AI Agents',
            'SIEM / Threat Hunting',
            'AWS + Azure',
            'Python · TypeScript',
            'ETL / Data Engineering',
            'Power BI / Forecasting',
            'GREM',
            'CompTIA Security+',
            'CCNA',
            'MSc Cyber Security',
            'Securovix.com'
          ]}
        />
      </div>
    </section>
  );
}

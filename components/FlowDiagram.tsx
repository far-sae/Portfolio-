'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function FlowDiagram({
  steps,
  accent,
  index = 'N° 05',
  title = 'Flow'
}: {
  steps: { step: string; desc: string }[];
  accent: string;
  index?: string;
  title?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 30%']
  });
  // Used to animate stroke length 0 → 1
  const path = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="container-x mt-32">
      <div className="grid grid-cols-1 gap-x-12 md:grid-cols-12">
        <div className="md:col-span-3">
          <div className="sticky top-32 space-y-3">
            <div className="mono text-[10px] uppercase tracking-[0.22em] text-muted">
              {index} / {title}
            </div>
            <div className="text-sm text-muted">
              Data flow through the system, scroll to draw the path.
            </div>
          </div>
        </div>

        <div className="md:col-span-9">
          {/* mobile -- vertical list */}
          <ol className="space-y-3 md:hidden">
            {steps.map((s, i) => (
              <motion.li
                key={s.step}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex gap-4 rounded-lg border border-line bg-surface/40 p-4"
              >
                <span
                  className="mono text-xs"
                  style={{ color: accent }}
                >
                  /{String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <div className="display text-base font-semibold">{s.step}</div>
                  <div className="mt-1 text-sm text-muted">{s.desc}</div>
                </div>
              </motion.li>
            ))}
          </ol>

          {/* desktop -- animated SVG flow */}
          <div className="hidden md:block">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line bg-bg/60">
              <DesktopFlow steps={steps} accent={accent} progress={path} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DesktopFlow({
  steps,
  accent,
  progress
}: {
  steps: { step: string; desc: string }[];
  accent: string;
  progress: any;
}) {
  // Lay out nodes along a zig-zag path
  const count = steps.length;
  const rows = Math.ceil(count / 3);
  const positions = steps.map((_, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = 10 + col * 40 + (row % 2 === 1 ? 20 : 0);
    const y = 18 + row * 30;
    return { x, y };
  });

  // Build cumulative path
  const pathD = positions
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  return (
    <>
      {/* grid background */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="g" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" fill="none" />
          </pattern>
          <linearGradient id={`grad-${accent}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accent} stopOpacity="0.2" />
            <stop offset="50%" stopColor={accent} stopOpacity="1" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#g)`} />
      </svg>

      {/* corner labels */}
      <div className="absolute left-4 top-4 mono text-[10px] uppercase tracking-[0.22em] text-muted">
        Pipeline / scroll to trace
      </div>
      <div className="absolute right-4 top-4 mono text-[10px] uppercase tracking-[0.22em] text-muted">
        {count} stages
      </div>

      {/* animated path */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* faint underlying */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.path
          d={pathD}
          fill="none"
          stroke={`url(#grad-${accent})`}
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: progress }}
        />
      </svg>

      {/* nodes */}
      {steps.map((s, i) => {
        const p = positions[i];
        // Each node lights up as path passes it
        return <FlowNode key={s.step} step={s} accent={accent} x={p.x} y={p.y} index={i} total={count} progress={progress} />;
      })}
    </>
  );
}

function FlowNode({
  step,
  accent,
  x,
  y,
  index,
  total,
  progress
}: {
  step: { step: string; desc: string };
  accent: string;
  x: number;
  y: number;
  index: number;
  total: number;
  progress: any;
}) {
  // threshold at which this node lights up
  const threshold = index / total;
  const opacity = useTransform(progress, (p: number) => (p > threshold ? 1 : 0.35));
  const scale = useTransform(progress, (p: number) => (p > threshold ? 1 : 0.92));

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%`, opacity, scale }}
    >
      <div
        className="relative h-3 w-3 rounded-full"
        style={{ background: accent, boxShadow: `0 0 18px ${accent}` }}
      />
      <div className="absolute left-5 top-1/2 w-44 -translate-y-1/2">
        <div className="mono text-[9px] uppercase tracking-[0.22em] text-muted">
          /{String(index + 1).padStart(2, '0')}
        </div>
        <div className="display text-sm font-semibold leading-tight text-ink">
          {step.step}
        </div>
        <div className="mt-0.5 text-[11px] leading-snug text-muted">
          {step.desc}
        </div>
      </div>
    </motion.div>
  );
}

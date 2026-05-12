'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function RepoCard({
  owner = 'far-sae',
  repo,
  accent,
  className
}: {
  owner?: string;
  repo: string;
  accent: string;
  className?: string;
}) {
  const src = `https://opengraph.githubassets.com/1/${owner}/${repo}`;
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 18 });
  const sy = useSpring(my, { stiffness: 150, damping: 18 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-6, 6]);
  const rotX = useTransform(sy, [-0.5, 0.5], [4, -4]);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 1400,
        transformStyle: 'preserve-3d'
      }}
      className={`relative ${className ?? ''}`}
    >
      {/* glow behind */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-4 rounded-3xl blur-2xl"
        style={{ background: accent, opacity: 0.25 }}
        animate={{ opacity: [0.18, 0.35, 0.18] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* browser-style frame */}
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
        {/* window chrome */}
        <div className="flex items-center justify-between border-b border-line bg-bg/80 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="mono text-[10px] uppercase tracking-[0.22em] text-muted">
            github.com / {owner} / {repo}
          </div>
          <div className="h-2.5 w-12" />
        </div>

        {/* image area */}
        <div className="relative aspect-[1280/640] w-full bg-bg">
          {!errored && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={`${owner}/${repo} on GitHub`}
              className={`h-full w-full object-cover transition-opacity duration-700 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setLoaded(true)}
              onError={() => setErrored(true)}
              loading="lazy"
            />
          )}

          {/* fallback skeleton */}
          {(!loaded || errored) && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div
                  className="mono text-xs uppercase tracking-[0.22em]"
                  style={{ color: accent }}
                >
                  github.com
                </div>
                <div className="display mt-3 text-3xl font-bold tracking-tighter text-ink">
                  {owner}/{repo}
                </div>
                <div className="mono mt-2 text-[10px] uppercase tracking-[0.22em] text-muted">
                  preview loading
                </div>
              </div>
            </div>
          )}

          {/* shimmer overlay */}
          {!loaded && !errored && (
            <div
              className="absolute inset-0 animate-shimmer"
              style={{
                background:
                  'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)',
                backgroundSize: '200% 100%'
              }}
            />
          )}
        </div>

        {/* under bar */}
        <div className="flex items-center justify-between border-t border-line bg-bg/80 px-3 py-2">
          <span className="mono text-[10px] uppercase tracking-[0.22em] text-muted">
            Repo / OG card
          </span>
          <span
            className="mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: accent }}
          >
            Live ↗
          </span>
        </div>
      </div>
    </motion.div>
  );
}

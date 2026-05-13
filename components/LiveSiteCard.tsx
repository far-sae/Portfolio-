'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

type Props = {
  url: string;
  title: string;
  subtitle?: string;
  accent: string;
  stack?: string[];
};

export function LiveSiteCard({ url, title, subtitle, accent, stack }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 18 });
  const sy = useSpring(my, { stiffness: 180, damping: 18 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-5, 5]);
  const rotX = useTransform(sy, [-0.5, 0.5], [3, -3]);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  // thum.io provides free no-auth screenshots
  const shotUrl = `https://image.thum.io/get/width/1400/crop/900/noanimate/${url}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noreferrer"
      data-cursor="open"
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
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
      className="group relative block"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-3 rounded-3xl blur-2xl"
        style={{ background: accent, opacity: 0.18 }}
        animate={{ opacity: [0.14, 0.28, 0.14] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
        {/* window chrome */}
        <div className="flex items-center justify-between border-b border-line bg-black/80 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a3a]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#5f5f5f]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#8a8a8a]" />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="mono inline-flex items-center gap-2 rounded-full border border-line bg-bg/60 px-3 py-0.5 text-[10px] uppercase tracking-[0.18em] text-muted">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
              />
              {cleanUrl}
            </div>
          </div>
          <div className="w-12" />
        </div>

        {/* screenshot */}
        <div className="relative aspect-[14/9] w-full overflow-hidden bg-black">
          {!errored && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={shotUrl}
              alt={`${title} screenshot`}
              className={`h-full w-full object-cover transition-all duration-700 ${
                loaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'
              }`}
              onLoad={() => setLoaded(true)}
              onError={() => setErrored(true)}
              loading="lazy"
            />
          )}
          {(!loaded || errored) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div
                  className="mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: accent }}
                >
                  Loading live screenshot
                </div>
                <div className="display mt-3 text-2xl font-bold tracking-tighter text-ink">
                  {title}
                </div>
              </div>
            </div>
          )}
          {/* shimmer */}
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
          {/* hover overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)`
            }}
          />
          <div className="pointer-events-none absolute bottom-3 right-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span
              className="mono inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white"
              style={{ background: accent }}
            >
              Visit live <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* meta */}
        <div className="flex items-center justify-between gap-4 border-t border-line bg-black/60 px-4 py-3">
          <div className="min-w-0">
            <div className="display truncate text-sm font-semibold tracking-[-0.01em] text-ink">
              {title}
            </div>
            {subtitle && (
              <div className="mt-0.5 truncate text-xs text-muted">{subtitle}</div>
            )}
          </div>
          {stack && (
            <div className="flex flex-wrap items-center gap-1.5">
              {stack.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="mono rounded-full border border-line bg-bg/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.a>
  );
}

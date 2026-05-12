'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function ScrollStory({
  paragraphs,
  accent,
  index = 'N° 02',
  title = 'Long form'
}: {
  paragraphs: string[];
  accent: string;
  index?: string;
  title?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const ringScale = useTransform(scrollYProgress, [0, 1], [0.7, 1.2]);
  const innerScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1.2, 0.6]);
  const innerY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={ref} className="container-x mt-32">
      <div className="grid grid-cols-1 gap-x-12 md:grid-cols-12">
        {/* Sticky visual */}
        <div className="md:col-span-5">
          <div className="sticky top-32">
            <div className="mono mb-6 text-[10px] uppercase tracking-[0.22em] text-muted">
              {index} / {title}
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-bg/60">
              {/* concentric rings */}
              <motion.div
                aria-hidden
                className="absolute inset-0 grid place-items-center"
                style={{ rotate: ringRotate }}
              >
                <div className="absolute h-[80%] w-[80%] rounded-full border border-line/60" />
                <div className="absolute h-[60%] w-[60%] rounded-full border border-line/40" />
                <div className="absolute h-[40%] w-[40%] rounded-full border border-line/30" />
                <div className="absolute h-[20%] w-[20%] rounded-full border border-line/20" />
              </motion.div>

              {/* orbiting accent ring */}
              <motion.div
                aria-hidden
                className="absolute inset-0 grid place-items-center"
                style={{ scale: ringScale }}
              >
                <div
                  className="h-[55%] w-[55%] rounded-full"
                  style={{
                    background: `radial-gradient(circle at center, ${accent}40 0%, transparent 70%)`
                  }}
                />
              </motion.div>

              {/* core */}
              <motion.div
                aria-hidden
                className="absolute inset-0 grid place-items-center"
                style={{ scale: innerScale, y: innerY }}
              >
                <div
                  className="h-24 w-24 rounded-full blur-2xl"
                  style={{ background: accent }}
                />
              </motion.div>

              {/* corner ticks */}
              <div className="absolute left-3 top-3 mono text-[9px] uppercase tracking-[0.22em] text-muted">
                Story / scroll
              </div>
              <div className="absolute right-3 top-3 mono text-[9px] uppercase tracking-[0.22em] text-muted">
                {paragraphs.length} stages
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-line">
                  <motion.div
                    style={{ width: progress, background: accent }}
                    className="h-px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling paragraphs */}
        <div className="md:col-span-7">
          <div className="space-y-12 pt-2">
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-balance text-xl leading-relaxed text-ink/90 sm:text-2xl"
              >
                <span
                  className="mono mr-3 align-middle text-xs"
                  style={{ color: accent }}
                >
                  /{String(i + 1).padStart(2, '0')}
                </span>
                {p}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


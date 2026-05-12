'use client';

import { motion } from 'framer-motion';

export function TechStackMatrix({
  stack,
  accent,
  index = 'N° 04',
  title = 'Tech stack'
}: {
  stack: { name: string; role: string; why: string }[];
  accent: string;
  index?: string;
  title?: string;
}) {
  return (
    <section className="container-x mt-32">
      <div className="grid grid-cols-1 gap-x-12 md:grid-cols-12">
        <div className="md:col-span-3">
          <div className="sticky top-32 space-y-3">
            <div className="mono text-[10px] uppercase tracking-[0.22em] text-muted">
              {index} / {title}
            </div>
            <div className="text-sm text-muted">
              Every choice has a reason. Hover any card for the why.
            </div>
          </div>
        </div>

        <div className="md:col-span-9">
          <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {stack.map((t, i) => (
              <motion.div
                key={t.name + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
                className="group relative overflow-hidden bg-bg p-6"
              >
                {/* hover bg */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: accent }}
                />

                {/* index */}
                <div
                  className="mono mb-3 text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: accent }}
                >
                  /{String(i + 1).padStart(2, '0')}
                </div>

                <div className="display text-lg font-semibold tracking-[-0.01em] text-ink">
                  {t.name}
                </div>
                <div className="mt-1 text-xs text-muted">{t.role}</div>

                {/* why -- reveal on hover */}
                <div className="mt-4 overflow-hidden">
                  <motion.div
                    initial={false}
                    className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 group-hover:grid-rows-[1fr]"
                  >
                    <div className="overflow-hidden">
                      <div className="pt-2 text-sm text-ink/85">{t.why}</div>
                    </div>
                  </motion.div>
                </div>

                {/* always-visible hint at why */}
                <div className="mt-3 truncate text-[12px] text-muted/80 group-hover:opacity-0">
                  {t.why}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

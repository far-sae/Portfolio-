'use client';

import { motion } from 'framer-motion';

export function BuiltList({
  items,
  accent,
  index = 'N° 03',
  title = 'What I built'
}: {
  items: { title: string; desc: string }[];
  accent: string;
  index?: string;
  title?: string;
}) {
  return (
    <section className="container-x mt-32">
      <div className="grid grid-cols-1 gap-x-12 md:grid-cols-12">
        <div className="md:col-span-3">
          <div className="mono sticky top-32 text-[10px] uppercase tracking-[0.22em] text-muted">
            {index} / {title}
          </div>
        </div>
        <div className="md:col-span-9">
          <ul className="divide-y divide-line border-y border-line">
            {items.map((it, i) => (
              <motion.li
                key={it.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="group grid grid-cols-12 items-baseline gap-4 py-6 transition-colors hover:bg-surface/40"
              >
                <div
                  className="col-span-1 mono text-xs"
                  style={{ color: accent }}
                >
                  /{String(i + 1).padStart(2, '0')}
                </div>
                <div className="col-span-11 sm:col-span-4">
                  <motion.span
                    className="display block text-xl font-semibold tracking-[-0.01em] text-ink transition-colors group-hover:text-white sm:text-2xl"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                  >
                    {it.title}
                  </motion.span>
                </div>
                <div className="col-span-12 col-start-2 text-base text-muted sm:col-span-7 sm:col-start-auto">
                  {it.desc}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

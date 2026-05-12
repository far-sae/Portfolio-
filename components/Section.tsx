'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import clsx from 'clsx';

function StaggerWords({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <span>
      {words.map((w, i) => (
        <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
          <motion.span
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              delay: i * 0.04,
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="inline-block"
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  description
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-6"
      >
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mono text-xs text-muted"
        >
          {index}
        </motion.span>
        <svg
          aria-hidden
          className="h-px flex-1"
          preserveAspectRatio="none"
          viewBox="0 0 100 1"
        >
          <motion.line
            x1="0"
            y1="0.5"
            x2="100"
            y2="0.5"
            stroke="currentColor"
            strokeWidth="1"
            className="text-line"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ vectorEffect: 'non-scaling-stroke' }}
          />
        </svg>
        <motion.span
          initial={{ opacity: 0, x: 8 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="label"
        >
          {eyebrow}
        </motion.span>
      </motion.div>

      <h2 className="display mt-8 max-w-4xl text-balance text-4xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-5xl md:text-6xl">
        {typeof title === 'string' ? <StaggerWords text={title} /> : title}
      </h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

export function Section({
  id,
  className,
  children
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={clsx('container-x py-28 sm:py-36', className)}>
      {children}
    </section>
  );
}

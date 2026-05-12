'use client';

import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function Tilt({
  children,
  className,
  max = 8,
  scale = 1.01,
  glare = true
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  scale?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 16 });
  const sy = useSpring(y, { stiffness: 150, damping: 16 });
  const rotX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const glareX = useTransform(sx, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(sy, [-0.5, 0.5], ['0%', '100%']);
  const glareBg = useMotionTemplate`radial-gradient(220px circle at ${glareX} ${glareY}, rgba(255,255,255,0.10), transparent 60%)`;

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileHover={{ scale }}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d'
      }}
      className={`relative ${className ?? ''}`}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-0 transition-opacity duration-200 [.group:hover_&]:opacity-100"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
}

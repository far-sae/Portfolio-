'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40 });
  const springY = useSpring(y, { stiffness: 500, damping: 40 });
  const ringX = useSpring(x, { stiffness: 120, damping: 18 });
  const ringY = useSpring(y, { stiffness: 120, damping: 18 });
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const visible = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.body.classList.add('has-custom-cursor');

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible.current) visible.current = true;

      const t = e.target as HTMLElement | null;
      const interactive = t?.closest('a, button, [data-cursor]');
      if (interactive) {
        setHover(true);
        setLabel(interactive.getAttribute('data-cursor'));
      } else {
        setHover(false);
        setLabel(null);
      }
    };
    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [x, y]);

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference md:block"
        style={{ x: springX, y: springY }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center md:flex"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: hover ? (label ? 88 : 44) : 28,
          height: hover ? (label ? 32 : 44) : 28,
          borderRadius: label ? 999 : 999,
          backgroundColor: label ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0)',
          borderColor: 'rgba(255,255,255,0.6)'
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      >
        <span className="select-none text-[10px] font-medium uppercase tracking-wider text-black">
          {label}
        </span>
        {!label && (
          <span className="block h-full w-full rounded-full border border-white/40" />
        )}
      </motion.div>
    </>
  );
}

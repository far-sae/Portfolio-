'use client';
import { ReactNode } from 'react';
import { useGsapReveal } from '@/components/hooks/useGsapReveal';

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;
  selector?: string;
  x?: number;
  y?: number;
  stagger?: number;
  duration?: number;
};

/**
 * Wraps a server-rendered subtree in a client component that runs
 * useGsapReveal on its descendants. Use when the surrounding section
 * is a server component but its children need the scroll-reveal
 * animation (e.g. data fetched at build time).
 */
export default function Reveal({
  children,
  className,
  id,
  ariaLabel,
  selector = '[data-reveal]',
  x = 0,
  y = 24,
  stagger = 0.08,
  duration = 0.8,
}: Props) {
  const ref = useGsapReveal<HTMLDivElement>({ selector, x, y, stagger, duration });

  return (
    <div ref={ref} className={className} id={id} aria-label={ariaLabel}>
      {children}
    </div>
  );
}

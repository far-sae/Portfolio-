'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

type Options = {
  y?: number;
  /**
   * Alternating horizontal offset (px). When > 0, even-indexed targets
   * enter from -x and odd-indexed from +x, producing the left/right
   * cascade. 0 disables horizontal motion.
   */
  x?: number;
  delay?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  end?: string;
  selector?: string;
  /**
   * When true (default), the animation re-fires every time the section
   * enters the viewport from either direction. Off-screen, elements are
   * reset to the hidden state instantly (no visible reverse), so cards
   * never look like they're flying off the page as you scroll past.
   * When false, animation plays once on first entry and elements stay
   * visible.
   */
  bidirectional?: boolean;
};

export function useGsapReveal<T extends HTMLElement>({
  y = 24,
  x = 0,
  delay = 0,
  stagger = 0,
  duration = 0.8,
  start = 'top 85%',
  end = 'bottom 15%',
  selector,
  bidirectional = true,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const targets: Element[] = selector
      ? Array.from(el.querySelectorAll(selector))
      : [el];

    if (targets.length === 0) return;

    if (reduced) {
      gsap.set(targets, { opacity: 1, x: 0, y: 0 });
      return;
    }

    targets.forEach((t, i) => {
      const xOffset = x === 0 ? 0 : i % 2 === 0 ? -x : x;
      gsap.set(t, { opacity: 0, x: xOffset, y });
    });

    const tween = gsap.to(targets, {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start,
        end,
        toggleActions: bidirectional
          ? 'play reset play reset'
          : 'play none none none',
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [y, x, delay, stagger, duration, start, end, selector, bidirectional, reduced]);

  return ref;
}

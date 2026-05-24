'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

type Options = {
  y?: number;
  delay?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  selector?: string;
};

export function useGsapReveal<T extends HTMLElement>({
  y = 24,
  delay = 0,
  stagger = 0,
  duration = 0.8,
  start = 'top 75%',
  selector,
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
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(targets, { opacity: 0, y });

    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start,
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [y, delay, stagger, duration, start, selector, reduced]);

  return ref;
}

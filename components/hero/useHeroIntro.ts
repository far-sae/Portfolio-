'use client';
import { RefObject, useEffect } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';

export function useHeroIntro(root: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const q = gsap.utils.selector(el);
    const ambient = el.querySelector<HTMLVideoElement>('video[aria-hidden]');
    const main = el.querySelector<HTMLVideoElement>('video:not([aria-hidden])');

    if (reduced) {
      if (ambient) ambient.style.opacity = '0.4';
      if (main) main.style.opacity = '1';
      gsap.set(q('[data-hero="controls"]'), { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    if (ambient) {
      tl.fromTo(ambient, { opacity: 0 }, { opacity: 0.4, duration: 1.2, ease: 'sine.inOut' }, 0);
    }
    if (main) {
      tl.fromTo(main, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out' }, 0.4);
    }
    tl.fromTo(q('[data-hero="controls"]'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      1.4);

    return () => {
      tl.kill();
    };
  }, [root, reduced]);
}

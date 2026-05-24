# Cinematic Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the single-page cinematic portfolio defined in `docs/superpowers/specs/2026-05-24-cinematic-portfolio-design.md` — video hero with Three.js particles + GSAP, then About/Projects/Experience/Skills/Contact driven by existing `data/*.json`.

**Architecture:** Next.js 15 App Router, single `app/page.tsx`, server components for content sections, `'use client'` only for interactive layers (video, particles, smooth scroll, hover effects). Three.js code-split via `next/dynamic`. Lenis smooth scroll synced to GSAP ticker.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind, CSS Modules, `three`, `gsap`, `lenis`, `lucide-react`.

**Verification model:** This project has no test suite and is primarily visual. Each task's verification step is browser-based per the spec's verification gate. Run `npx tsc --noEmit` at task boundaries to catch type errors. No unit-test framework is being added (YAGNI for a portfolio site).

**Working tree caveat:** Starts on branch `feat/mixer` with many uncommitted deletions and additions (the macOS desktop WIP). Task 1 wipes that state. Confirm there is nothing on this branch worth saving before starting.

---

## Task 1: Wipe the macOS work and reset to a clean app shell

**Files:**
- Delete: `components/macos/`, `components/vscode/`, `components/apps/`, `components/car/`
- Delete: `data/github-repos.json` (only consumed by removed macOS GitHub app — verify with grep first)
- Modify: `app/page.tsx`, `app/layout.tsx`, `app/globals.css` (replace with stubs that compile)
- Restore (from git) the old deleted files that are NOT being kept (we are not restoring them — confirm they stay deleted)

- [ ] **Step 1: Confirm nothing on this branch needs saving**

Run:
```bash
git status --short
git log --oneline -5
```
Expected: many `D ` deletions of old leaf components (About, Projects, Hero, etc.) and `??` additions for `components/macos/`, `components/vscode/`, `components/apps/`, `components/car/`. Recent commits include "Strict black and white editorial design" and "Pure black bg, live screenshots…". None of the uncommitted work is being preserved.

- [ ] **Step 2: Verify data/github-repos.json has no other consumers**

Run:
```bash
grep -r "github-repos" --include="*.ts" --include="*.tsx" .
```
Expected: matches only inside `components/macos/` or `components/apps/` (which we are deleting). If matches appear elsewhere, stop and ask before deleting the JSON.

- [ ] **Step 3: Delete macOS work and unused data**

Run:
```bash
rm -rf components/macos components/vscode components/apps components/car
rm -f data/github-repos.json
```

- [ ] **Step 4: Replace `app/page.tsx` with a placeholder that compiles**

Write `app/page.tsx`:
```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <p className="text-sm tracking-[0.3em] uppercase opacity-50">Scaffolding…</p>
    </main>
  );
}
```

- [ ] **Step 5: Replace `app/layout.tsx` with the cinematic shell**

Write `app/layout.tsx`:
```tsx
import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Faraz Saeed Khwaja — Cybersecurity · AI · Creator',
  description: 'Building cinematic digital experiences, intelligent AI systems, and next-generation cybersecurity platforms.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="font-sans bg-black text-white antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Replace `app/globals.css` with a clean baseline (full cinematic tokens come in Task 4)**

Write `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { background: #050505; color: #ffffff; }
```

- [ ] **Step 7: Verify build still compiles**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors. If errors mention files we already deleted, also check `app/projects/[slug]/page.tsx` is gone (it should already be — appears in `git status` as deleted).

- [ ] **Step 8: Commit**

Run:
```bash
git add -A
git commit -m "Wipe macOS desktop work, reset to cinematic scaffold"
```

---

## Task 2: Add dependencies (three, gsap, lenis); remove framer-motion

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Remove framer-motion**

Run:
```bash
npm uninstall framer-motion
```

- [ ] **Step 2: Add runtime deps**

Run:
```bash
npm install three gsap lenis
```

- [ ] **Step 3: Add type deps**

Run:
```bash
npm install --save-dev @types/three
```

- [ ] **Step 4: Verify package.json**

Read `package.json` and confirm `dependencies` now contains `three`, `gsap`, `lenis`, and does NOT contain `framer-motion`. `devDependencies` should contain `@types/three`.

- [ ] **Step 5: Confirm nothing imports framer-motion**

Run:
```bash
grep -r "framer-motion" --include="*.ts" --include="*.tsx" .
```
Expected: no matches.

- [ ] **Step 6: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 7: Commit**

Run:
```bash
git add package.json package-lock.json
git commit -m "Add three, gsap, lenis; drop framer-motion"
```

---

## Task 3: Move hero video to public/, extract poster, verify playable

**Files:**
- Move: `assets/a_d_ca_e_b_video_mp_.mp4` → `public/hero.mp4`
- Create: `public/hero-poster.jpg`
- Delete: `assets/` (folder)

- [ ] **Step 1: Inspect the video file (confirm it is a real, playable video)**

Run:
```bash
ffprobe -v error -show_entries stream=codec_name,codec_type,width,height,duration -of default=noprint_wrappers=1 assets/a_d_ca_e_b_video_mp_.mp4
```
Expected: at least one video stream with non-zero width/height and a duration > 5s. If duration is < 2s or width/height is 0, STOP and ask for a replacement file — the spec called for cinematic talking-head footage and a sub-2s clip is not viable as the hero.

- [ ] **Step 2: Move video into public/**

Run:
```bash
mkdir -p public
mv assets/a_d_ca_e_b_video_mp_.mp4 public/hero.mp4
```

- [ ] **Step 3: Extract first frame as poster**

Run:
```bash
ffmpeg -y -i public/hero.mp4 -ss 00:00:01 -frames:v 1 -q:v 3 public/hero-poster.jpg
```
Expected: the file `public/hero-poster.jpg` is created. If `-ss 00:00:01` exceeds duration, the command will fail or produce a tiny file; in that case re-run without `-ss`:
```bash
ffmpeg -y -i public/hero.mp4 -frames:v 1 -q:v 3 public/hero-poster.jpg
```

- [ ] **Step 4: Remove now-empty assets folder**

Run:
```bash
rmdir assets
```
Expected: succeeds. If it fails because something else is in the folder, list contents (`ls assets/`) and decide what to do.

- [ ] **Step 5: Verify the video plays in the browser**

Start the dev server:
```bash
npm run dev
```
In a browser, visit `http://localhost:3000/hero.mp4` directly (Next.js serves files from `public/` at the root). Confirm the video plays with audio. Also visit `http://localhost:3000/hero-poster.jpg` and confirm a still image renders. Stop the dev server.

- [ ] **Step 6: Commit**

Run:
```bash
git add -A
git commit -m "Move hero video to public/, extract poster frame"
```

---

## Task 4: Cinematic CSS tokens, reset, and reduced-motion baseline

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace globals.css with full token set**

Write `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #050505;
  --surface: rgba(255, 255, 255, 0.05);
  --border: rgba(255, 255, 255, 0.08);
  --text: #ffffff;
  --muted: rgba(255, 255, 255, 0.65);
  --orange: #ff7b32;
  --blue: #6ab7ff;

  --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
}

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
html { scroll-behavior: auto; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans), -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection { background: var(--orange); color: var(--bg); }

::-webkit-scrollbar { width: 0; height: 0; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Clean Tailwind theme of the macOS-era tokens**

Replace `tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050505',
        muted: 'rgba(255, 255, 255, 0.65)',
        orange: '#ff7b32',
        blueGlow: '#6ab7ff',
      },
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: Verify dev server starts and renders the placeholder over the new bg**

Run:
```bash
npm run dev
```
Visit `http://localhost:3000` — the placeholder text "Scaffolding…" should render in light grey against pure black `#050505`. Stop the server.

- [ ] **Step 4: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 5: Commit**

Run:
```bash
git add app/globals.css tailwind.config.ts
git commit -m "Cinematic CSS tokens, reset, reduced-motion baseline"
```

---

## Task 5: `useReducedMotion` hook

**Files:**
- Create: `components/hooks/useReducedMotion.ts`

- [ ] **Step 1: Write the hook**

Write `components/hooks/useReducedMotion.ts`:
```ts
'use client';
import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
```

- [ ] **Step 2: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 3: Commit**

Run:
```bash
git add components/hooks/useReducedMotion.ts
git commit -m "Add useReducedMotion hook"
```

---

## Task 6: `useIsMobile` hook

**Files:**
- Create: `components/hooks/useIsMobile.ts`

- [ ] **Step 1: Write the hook**

Write `components/hooks/useIsMobile.ts`:
```ts
'use client';
import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = '(max-width: 768px)';

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(MOBILE_BREAKPOINT);
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
```

- [ ] **Step 2: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 3: Commit**

Run:
```bash
git add components/hooks/useIsMobile.ts
git commit -m "Add useIsMobile hook"
```

---

## Task 7: `SmoothScroll` provider (Lenis + GSAP ticker sync)

**Files:**
- Create: `components/motion/SmoothScroll.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write the SmoothScroll provider**

Write `components/motion/SmoothScroll.tsx`:
```tsx
'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';

export default function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
```

- [ ] **Step 2: Mount the provider in the root layout**

Replace `app/layout.tsx`:
```tsx
import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import SmoothScroll from '@/components/motion/SmoothScroll';

const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Faraz Saeed Khwaja — Cybersecurity · AI · Creator',
  description: 'Building cinematic digital experiences, intelligent AI systems, and next-generation cybersecurity platforms.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="font-sans bg-black text-white antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 4: Verify in browser (smooth-scroll is visible only once content exists, so just confirm no console errors)**

Run:
```bash
npm run dev
```
Visit `http://localhost:3000`. Open DevTools console. Expected: no errors. Stop the server.

- [ ] **Step 5: Commit**

Run:
```bash
git add components/motion/SmoothScroll.tsx app/layout.tsx
git commit -m "Mount Lenis smooth scroll, sync to GSAP ticker"
```

---

## Task 8: `useGsapReveal` hook (shared scroll-reveal primitive)

**Files:**
- Create: `components/hooks/useGsapReveal.ts`

- [ ] **Step 1: Write the hook**

Write `components/hooks/useGsapReveal.ts`:
```ts
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
```

- [ ] **Step 2: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 3: Commit**

Run:
```bash
git add components/hooks/useGsapReveal.ts
git commit -m "Add useGsapReveal hook"
```

---

## Task 9: `GlassButton` component

**Files:**
- Create: `components/ui/GlassButton.tsx`
- Create: `components/ui/GlassButton.module.css`

- [ ] **Step 1: Write the CSS module**

Write `components/ui/GlassButton.module.css`:
```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: var(--text);
  cursor: pointer;
  transition: transform 200ms var(--ease-out-quart),
              border-color 200ms var(--ease-out-quart),
              background 200ms var(--ease-out-quart);
}

.button:hover {
  transform: scale(1.06);
  border-color: rgba(255, 255, 255, 0.32);
  background: rgba(255, 255, 255, 0.08);
}

.button:focus-visible {
  outline: 2px solid var(--orange);
  outline-offset: 4px;
}

.button > svg {
  width: 18px;
  height: 18px;
}
```

- [ ] **Step 2: Write the component**

Write `components/ui/GlassButton.tsx`:
```tsx
'use client';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import styles from './GlassButton.module.css';
import clsx from 'clsx';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

const GlassButton = forwardRef<HTMLButtonElement, Props>(
  ({ label, className, children, ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={clsx(styles.button, className)}
      {...rest}
    >
      {children}
    </button>
  )
);

GlassButton.displayName = 'GlassButton';
export default GlassButton;
```

- [ ] **Step 3: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 4: Commit**

Run:
```bash
git add components/ui/GlassButton.tsx components/ui/GlassButton.module.css
git commit -m "Add GlassButton component"
```

---

## Task 10: `useHeroAudio` hook (shared video element state)

**Files:**
- Create: `components/hooks/useHeroAudio.ts`

- [ ] **Step 1: Write the hook**

Write `components/hooks/useHeroAudio.ts`:
```ts
'use client';
import { RefObject, useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'hero-audio-acknowledged';

export function useHeroAudio(videoRef: RefObject<HTMLVideoElement | null>) {
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setAcknowledged(sessionStorage.getItem(STORAGE_KEY) === '1');
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setMuted(next);
    if (!next && typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setAcknowledged(true);
    }
  }, [videoRef]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [videoRef]);

  return { muted, playing, acknowledged, toggleMute, togglePlay };
}
```

- [ ] **Step 2: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 3: Commit**

Run:
```bash
git add components/hooks/useHeroAudio.ts
git commit -m "Add useHeroAudio hook"
```

---

## Task 11: `SoundBadge` component

**Files:**
- Create: `components/ui/SoundBadge.tsx`
- Create: `components/ui/SoundBadge.module.css`

- [ ] **Step 1: Write the CSS module**

Write `components/ui/SoundBadge.module.css`:
```css
.badge {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: var(--text);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 600ms var(--ease-out-quart);
}

.badge.visible {
  opacity: 1;
  pointer-events: auto;
}

.badge:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 123, 50, 0.4);
}

.badge svg {
  width: 14px;
  height: 14px;
}
```

- [ ] **Step 2: Write the component**

Write `components/ui/SoundBadge.tsx`:
```tsx
'use client';
import { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import clsx from 'clsx';
import styles from './SoundBadge.module.css';

type Props = {
  onClick: () => void;
  acknowledged: boolean;
};

export default function SoundBadge({ onClick, acknowledged }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (acknowledged) return;
    const inTimer = setTimeout(() => setVisible(true), 2600);
    const outTimer = setTimeout(() => setVisible(false), 8600);
    return () => {
      clearTimeout(inTimer);
      clearTimeout(outTimer);
    };
  }, [acknowledged]);

  if (acknowledged) return null;

  return (
    <button
      type="button"
      className={clsx(styles.badge, visible && styles.visible)}
      onClick={onClick}
      aria-label="Tap for sound"
    >
      <Volume2 />
      Tap for sound
    </button>
  );
}
```

- [ ] **Step 3: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 4: Commit**

Run:
```bash
git add components/ui/SoundBadge.tsx components/ui/SoundBadge.module.css
git commit -m "Add SoundBadge component"
```

---

## Task 12: `ScrollIndicator` component

**Files:**
- Create: `components/ui/ScrollIndicator.tsx`
- Create: `components/ui/ScrollIndicator.module.css`

- [ ] **Step 1: Write the CSS module**

Write `components/ui/ScrollIndicator.module.css`:
```css
.wrap {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 56px;
  background: rgba(255, 255, 255, 0.18);
  cursor: pointer;
  border: none;
  padding: 0;
}

.dot {
  position: absolute;
  left: 50%;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--text);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
  transform: translateX(-50%);
  animation: scrollDot 2.4s var(--ease-out-quart) infinite;
}

@keyframes scrollDot {
  0%   { top: 0;    opacity: 0; }
  20%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
```

- [ ] **Step 2: Write the component**

Write `components/ui/ScrollIndicator.tsx`:
```tsx
'use client';
import styles from './ScrollIndicator.module.css';

type Props = {
  targetId: string;
};

export default function ScrollIndicator({ targetId }: Props) {
  const handleClick = () => {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <button
      type="button"
      className={styles.wrap}
      onClick={handleClick}
      aria-label={`Scroll to ${targetId}`}
    >
      <span className={styles.dot} />
    </button>
  );
}
```

Note: `scrollIntoView` uses the native scroll API. Lenis intercepts this transparently because it owns the window scroll position — no special API call needed.

- [ ] **Step 3: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 4: Commit**

Run:
```bash
git add components/ui/ScrollIndicator.tsx components/ui/ScrollIndicator.module.css
git commit -m "Add ScrollIndicator component"
```

---

## Task 13: `VideoIntro` component (main video + ambient blurred duplicate)

**Files:**
- Create: `components/hero/VideoIntro.tsx`
- Create: `components/hero/VideoIntro.module.css`

- [ ] **Step 1: Write the CSS module**

Write `components/hero/VideoIntro.module.css`:
```css
.ambient,
.main {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ambient {
  filter: blur(40px) saturate(1.2);
  transform: scale(1.15);
  opacity: 0;
  z-index: 0;
}

.main {
  opacity: 0;
  z-index: 2;
}

@media (max-width: 768px) {
  .ambient { filter: blur(20px) saturate(1.2); }
}

@media (prefers-reduced-motion: reduce) {
  .ambient,
  .main {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
}
```

- [ ] **Step 2: Write the component (honours `prefers-reduced-motion`)**

Write `components/hero/VideoIntro.tsx`:
```tsx
'use client';
import { forwardRef } from 'react';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';
import styles from './VideoIntro.module.css';

type Props = {
  src: string;
  poster?: string;
};

const VideoIntro = forwardRef<HTMLVideoElement, Props>(({ src, poster }, ref) => {
  const reduced = useReducedMotion();
  const playback = reduced
    ? { autoPlay: false, preload: 'none' as const }
    : { autoPlay: true,  preload: 'metadata' as const };

  return (
    <>
      {!reduced && (
        <video
          className={styles.ambient}
          src={src}
          poster={poster}
          {...playback}
          muted
          loop
          playsInline
          aria-hidden
        />
      )}
      <video
        ref={ref}
        className={styles.main}
        src={src}
        poster={poster}
        {...playback}
        muted
        loop
        playsInline
        aria-label="Faraz Saeed Khwaja — cinematic intro"
      />
    </>
  );
});

VideoIntro.displayName = 'VideoIntro';
export default VideoIntro;
```

When reduced-motion is on, the ambient blur duplicate is skipped, the main video does not autoplay or preload, and the poster is what the user sees. The play/mute controls still work — clicking play starts the video on demand.

- [ ] **Step 3: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 4: Commit**

Run:
```bash
git add components/hero/VideoIntro.tsx components/hero/VideoIntro.module.css
git commit -m "Add VideoIntro (main + ambient blur duplicate)"
```

---

## Task 14: `Hero` composition (overlay text + controls, no Three.js yet)

**Files:**
- Create: `components/hero/Hero.tsx`
- Create: `components/hero/Hero.module.css`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write the CSS module**

Write `components/hero/Hero.module.css`:
```css
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  background: #050505;
}

.overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  background:
    linear-gradient(180deg, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0) 18%, rgba(5,5,5,0) 60%, rgba(5,5,5,0.7) 100%),
    radial-gradient(ellipse at center, rgba(5,5,5,0) 40%, rgba(5,5,5,0.7) 100%);
  pointer-events: none;
}

.content {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 8vw 18vh;
  pointer-events: none;
}

.tagline {
  font-size: 12px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 28px;
  opacity: 0;
}

.name {
  font-size: clamp(4rem, 12vw, 12rem);
  line-height: 0.92;
  letter-spacing: -0.04em;
  font-weight: 300;
  margin: 0;
}

.name span {
  display: block;
  opacity: 0;
  transform: translateY(40px);
}

.subtitle {
  margin: 32px 0 0;
  max-width: 540px;
  color: var(--muted);
  font-size: clamp(0.95rem, 1.2vw, 1.1rem);
  line-height: 1.6;
  opacity: 0;
}

.controls {
  position: absolute;
  right: 5vw;
  bottom: 40px;
  z-index: 5;
  display: flex;
  gap: 12px;
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .tagline, .subtitle, .controls { opacity: 1 !important; }
  .name span { opacity: 1 !important; transform: none !important; }
}
```

- [ ] **Step 2: Write the Hero component (no Three.js, no GSAP entrance yet)**

Write `components/hero/Hero.tsx`:
```tsx
'use client';
import { useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import VideoIntro from './VideoIntro';
import GlassButton from '@/components/ui/GlassButton';
import SoundBadge from '@/components/ui/SoundBadge';
import ScrollIndicator from '@/components/ui/ScrollIndicator';
import { useHeroAudio } from '@/components/hooks/useHeroAudio';
import styles from './Hero.module.css';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { muted, playing, acknowledged, toggleMute, togglePlay } = useHeroAudio(videoRef);

  return (
    <section className={styles.hero} aria-label="Intro">
      <VideoIntro ref={videoRef} src="/hero.mp4" poster="/hero-poster.jpg" />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <p className={styles.tagline} data-hero="tagline">
          CYBERSECURITY · AI · CREATOR
        </p>
        <h1 className={styles.name} data-hero="name">
          <span>FARAZ SAEED</span>
          <span>KHWAJA</span>
        </h1>
        <p className={styles.subtitle} data-hero="subtitle">
          Building cinematic digital experiences, intelligent AI systems, and next-generation cybersecurity platforms.
        </p>
      </div>

      <div className={styles.controls} data-hero="controls">
        <GlassButton label={playing ? 'Pause video' : 'Play video'} onClick={togglePlay}>
          {playing ? <Pause /> : <Play />}
        </GlassButton>
        <GlassButton label={muted ? 'Unmute video' : 'Mute video'} onClick={toggleMute}>
          {muted ? <VolumeX /> : <Volume2 />}
        </GlassButton>
      </div>

      <SoundBadge onClick={toggleMute} acknowledged={acknowledged} />
      <ScrollIndicator targetId="about" />
    </section>
  );
}
```

- [ ] **Step 3: Wire Hero into `app/page.tsx`**

Replace `app/page.tsx`:
```tsx
import Hero from '@/components/hero/Hero';

export default function Home() {
  return (
    <main>
      <Hero />
      <section id="about" style={{ minHeight: '100vh', padding: '20vh 8vw', color: 'white' }}>
        About section placeholder
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run:
```bash
npm run dev
```
Visit `http://localhost:3000`. Expected:
- Black background with the video covering the viewport.
- Tagline, FARAZ SAEED / KHWAJA, and subtitle visible (no fade-in animation yet — they appear instantly because Task 15 has not happened).
- Two glass buttons bottom-right; clicking play/pause and mute/unmute affects the video.
- "Tap for sound" badge appears after ~2.6s, hides after another 6s.
- Vertical scroll-indicator line at bottom-centre with a dot pulsing top→bottom.
- Clicking the scroll indicator scrolls to the placeholder "About section placeholder".
- No console errors.

Stop the server.

- [ ] **Step 5: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 6: Commit**

Run:
```bash
git add components/hero app/page.tsx
git commit -m "Wire Hero composition: video, controls, badge, scroll indicator"
```

---

## Task 15: GSAP hero entrance choreography

**Files:**
- Create: `components/hero/useHeroIntro.ts`
- Modify: `components/hero/Hero.tsx`

- [ ] **Step 1: Write the choreography hook**

Write `components/hero/useHeroIntro.ts`:
```ts
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
      gsap.set(q('[data-hero="tagline"]'), { opacity: 1 });
      gsap.set(q('[data-hero="name"] span'), { opacity: 1, y: 0 });
      gsap.set(q('[data-hero="subtitle"]'), { opacity: 1 });
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
    tl.fromTo(q('[data-hero="tagline"]'),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      0.8);
    tl.fromTo(q('[data-hero="name"] span'),
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'expo.out' },
      1.1);
    tl.fromTo(q('[data-hero="subtitle"]'),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      1.6);
    tl.fromTo(q('[data-hero="controls"]'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      2.0);

    return () => {
      tl.kill();
    };
  }, [root, reduced]);
}
```

- [ ] **Step 2: Use the hook in `Hero.tsx`**

Modify `components/hero/Hero.tsx` — add the `rootRef` and the hook call:

Replace the existing component body with:
```tsx
'use client';
import { useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import VideoIntro from './VideoIntro';
import GlassButton from '@/components/ui/GlassButton';
import SoundBadge from '@/components/ui/SoundBadge';
import ScrollIndicator from '@/components/ui/ScrollIndicator';
import { useHeroAudio } from '@/components/hooks/useHeroAudio';
import { useHeroIntro } from './useHeroIntro';
import styles from './Hero.module.css';

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { muted, playing, acknowledged, toggleMute, togglePlay } = useHeroAudio(videoRef);
  useHeroIntro(rootRef);

  return (
    <section ref={rootRef} className={styles.hero} aria-label="Intro">
      <VideoIntro ref={videoRef} src="/hero.mp4" poster="/hero-poster.jpg" />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <p className={styles.tagline} data-hero="tagline">
          CYBERSECURITY · AI · CREATOR
        </p>
        <h1 className={styles.name} data-hero="name">
          <span>FARAZ SAEED</span>
          <span>KHWAJA</span>
        </h1>
        <p className={styles.subtitle} data-hero="subtitle">
          Building cinematic digital experiences, intelligent AI systems, and next-generation cybersecurity platforms.
        </p>
      </div>

      <div className={styles.controls} data-hero="controls">
        <GlassButton label={playing ? 'Pause video' : 'Play video'} onClick={togglePlay}>
          {playing ? <Pause /> : <Play />}
        </GlassButton>
        <GlassButton label={muted ? 'Unmute video' : 'Mute video'} onClick={toggleMute}>
          {muted ? <VolumeX /> : <Volume2 />}
        </GlassButton>
      </div>

      <SoundBadge onClick={toggleMute} acknowledged={acknowledged} />
      <ScrollIndicator targetId="about" />
    </section>
  );
}
```

- [ ] **Step 3: Verify entrance in browser**

Run:
```bash
npm run dev
```
Hard refresh `http://localhost:3000` (Ctrl+Shift+R). Expected:
- Ambient blur video fades in first.
- Main video fades + softly scales in (1.05 → 1.0).
- Tagline appears after ~0.8s.
- "FARAZ SAEED" then "KHWAJA" translate up into place.
- Subtitle fades in.
- Controls slide up from bottom.
- Sound badge appears after the rest.
- Total intro feels slow and premium, ~3 seconds end-to-end.

Toggle reduced motion (Windows: Settings → Accessibility → Visual effects → Animation effects off, OR DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce) and hard refresh. Expected: everything is visible immediately with no animation.

Stop the server.

- [ ] **Step 4: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 5: Commit**

Run:
```bash
git add components/hero/
git commit -m "Hero entrance choreography (GSAP timeline)"
```

---

## Task 16: `CinematicLayer` scaffold (canvas, scene, soft-circle texture, cleanup)

**Files:**
- Create: `components/three/CinematicLayer.tsx`
- Create: `components/three/CinematicLayer.module.css`

- [ ] **Step 1: Write the CSS module**

Write `components/three/CinematicLayer.module.css`:
```css
.canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mix-blend-mode: screen;
  z-index: 1;
}
```

- [ ] **Step 2: Write the scaffold (renderer + scene + cleanup, particles added in Task 17)**

Write `components/three/CinematicLayer.tsx`:
```tsx
'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '@/components/hooks/useIsMobile';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';
import styles from './CinematicLayer.module.css';

function makeSoftCircleTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0,   'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
  gradient.addColorStop(1,   'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export default function CinematicLayer() {
  const mountRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = mountRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    renderer.setSize(parent.clientWidth, parent.clientHeight, false);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, parent.clientWidth / parent.clientHeight, 0.1, 100);
    camera.position.z = 8;

    const texture = makeSoftCircleTexture();

    const onResize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(parent);

    // One render so the canvas isn't blank before Task 17.
    renderer.render(scene, camera);

    return () => {
      ro.disconnect();
      texture.dispose();
      renderer.dispose();
    };
  }, [isMobile, reduced]);

  if (reduced) return null;

  return <canvas ref={mountRef} className={styles.canvas} aria-hidden />;
}
```

- [ ] **Step 3: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 4: Commit**

Run:
```bash
git add components/three/
git commit -m "Add CinematicLayer scaffold (renderer, scene, cleanup)"
```

---

## Task 17: Add particles + drift + mouse parallax + visibility/intersection pause

**Files:**
- Modify: `components/three/CinematicLayer.tsx`

- [ ] **Step 1: Replace `CinematicLayer.tsx` with the full particle system**

Write `components/three/CinematicLayer.tsx`:
```tsx
'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '@/components/hooks/useIsMobile';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';
import styles from './CinematicLayer.module.css';

const ORANGE = new THREE.Color('#ff7b32');
const WARM_WHITE = new THREE.Color('#ffe9d6');
const BOX = { x: 16, y: 10, z: 6 };

function makeSoftCircleTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0,   'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
  gradient.addColorStop(1,   'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function buildParticles(count: number, texture: THREE.Texture) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * BOX.x;
    positions[i3 + 1] = (Math.random() - 0.5) * BOX.y;
    positions[i3 + 2] = (Math.random() - 0.5) * BOX.z;

    const c = Math.random() < 0.7 ? ORANGE : WARM_WHITE;
    colors[i3]     = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;

    velocities[i3]     = (Math.random() - 0.5) * 0.0016;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.0016;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.0016;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.08,
    map: texture,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);

  return { points, geometry, material, velocities };
}

export default function CinematicLayer() {
  const mountRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = mountRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    renderer.setSize(parent.clientWidth, parent.clientHeight, false);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, parent.clientWidth / parent.clientHeight, 0.1, 100);
    camera.position.z = 8;

    const texture = makeSoftCircleTexture();
    const count = isMobile ? 400 : 1200;
    const { points, geometry, material, velocities } = buildParticles(count, texture);
    scene.add(points);

    const target = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(parent);

    let running = true;
    let rafId = 0;
    let inView = true;

    const onVisibility = () => {
      running = document.visibilityState === 'visible' && inView;
      if (running) loop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        running = document.visibilityState === 'visible' && inView;
        if (running) loop();
      },
      { threshold: 0 }
    );
    io.observe(parent);

    const tick = () => {
      const pos = geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        arr[i3]     += velocities[i3];
        arr[i3 + 1] += velocities[i3 + 1] + 0.0005;
        arr[i3 + 2] += velocities[i3 + 2];

        if (arr[i3 + 1] > BOX.y / 2) arr[i3 + 1] = -BOX.y / 2;
        if (arr[i3]     >  BOX.x / 2) arr[i3]     = -BOX.x / 2;
        if (arr[i3]     < -BOX.x / 2) arr[i3]     =  BOX.x / 2;
      }
      pos.needsUpdate = true;

      camera.position.x += (target.x * 0.25 - camera.position.x) * 0.05;
      camera.position.y += (target.y * 0.25 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    const loop = () => {
      if (!running) return;
      tick();
      rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
      ro.disconnect();
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [isMobile, reduced]);

  if (reduced) return null;

  return <canvas ref={mountRef} className={styles.canvas} aria-hidden />;
}
```

- [ ] **Step 2: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 3: Commit**

Run:
```bash
git add components/three/CinematicLayer.tsx
git commit -m "Add particle system, drift, mouse parallax, visibility pause"
```

---

## Task 18: Mount `CinematicLayer` inside `Hero` via dynamic import

**Files:**
- Modify: `components/hero/Hero.tsx`

- [ ] **Step 1: Add a dynamic import for the particle layer**

At the top of `components/hero/Hero.tsx`, add the dynamic import and place the layer between the video and the overlay. Replace the file with:
```tsx
'use client';
import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import VideoIntro from './VideoIntro';
import GlassButton from '@/components/ui/GlassButton';
import SoundBadge from '@/components/ui/SoundBadge';
import ScrollIndicator from '@/components/ui/ScrollIndicator';
import { useHeroAudio } from '@/components/hooks/useHeroAudio';
import { useHeroIntro } from './useHeroIntro';
import styles from './Hero.module.css';

const CinematicLayer = dynamic(() => import('@/components/three/CinematicLayer'), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { muted, playing, acknowledged, toggleMute, togglePlay } = useHeroAudio(videoRef);
  useHeroIntro(rootRef);

  return (
    <section ref={rootRef} className={styles.hero} aria-label="Intro">
      <VideoIntro ref={videoRef} src="/hero.mp4" poster="/hero-poster.jpg" />

      <CinematicLayer />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <p className={styles.tagline} data-hero="tagline">
          CYBERSECURITY · AI · CREATOR
        </p>
        <h1 className={styles.name} data-hero="name">
          <span>FARAZ SAEED</span>
          <span>KHWAJA</span>
        </h1>
        <p className={styles.subtitle} data-hero="subtitle">
          Building cinematic digital experiences, intelligent AI systems, and next-generation cybersecurity platforms.
        </p>
      </div>

      <div className={styles.controls} data-hero="controls">
        <GlassButton label={playing ? 'Pause video' : 'Play video'} onClick={togglePlay}>
          {playing ? <Pause /> : <Play />}
        </GlassButton>
        <GlassButton label={muted ? 'Unmute video' : 'Mute video'} onClick={toggleMute}>
          {muted ? <VolumeX /> : <Volume2 />}
        </GlassButton>
      </div>

      <SoundBadge onClick={toggleMute} acknowledged={acknowledged} />
      <ScrollIndicator targetId="about" />
    </section>
  );
}
```

- [ ] **Step 2: Verify in browser**

Run:
```bash
npm run dev
```
Hard refresh `http://localhost:3000`. Expected:
- Particles render as soft warm bokeh over the video (additive blend), visible mostly in the darker areas.
- Moving the mouse causes a gentle parallax shift of the field.
- Particles drift slowly upward.
- Open DevTools → Performance, record 3 seconds, scroll the hero out of view, then keep recording 3 more seconds. Expected: RAF activity drops significantly when hero leaves the viewport (IntersectionObserver pause).
- Switch to a different browser tab for ~5s, return. Expected: no console errors, no broken state.

Stop the server.

- [ ] **Step 3: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 4: Commit**

Run:
```bash
git add components/hero/Hero.tsx
git commit -m "Mount CinematicLayer in Hero via dynamic import"
```

---

## Task 19: `About` section

**Files:**
- Create: `components/sections/About.tsx`
- Create: `components/sections/About.module.css`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write the CSS module**

Write `components/sections/About.module.css`:
```css
.section {
  padding: 20vh 8vw;
  max-width: 1200px;
  margin: 0 auto;
}

.eyebrow {
  font-size: 12px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 32px;
}

.headline {
  font-size: clamp(2rem, 4vw, 3.4rem);
  font-weight: 300;
  line-height: 1.25;
  letter-spacing: -0.02em;
  margin: 0 0 48px;
  max-width: 900px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.chip {
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: 13px;
  letter-spacing: 0.05em;
  color: var(--text);
}
```

- [ ] **Step 2: Write the component**

Write `components/sections/About.tsx`:
```tsx
'use client';
import { useGsapReveal } from '@/components/hooks/useGsapReveal';
import profile from '@/data/profile.json';
import styles from './About.module.css';

const ROLES = ['Cybersecurity Engineer', 'AI Builder', 'Founder', 'Creative Technologist'];

export default function About() {
  const ref = useGsapReveal<HTMLElement>({ selector: '[data-reveal]', stagger: 0.08 });

  return (
    <section ref={ref} id="about" className={styles.section} aria-label="About">
      <p className={styles.eyebrow} data-reveal>About</p>
      <h2 className={styles.headline} data-reveal>
        {profile.summary}
      </h2>
      <div className={styles.chips} data-reveal>
        {ROLES.map((r) => (
          <span key={r} className={styles.chip}>{r}</span>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire About into `app/page.tsx`** (remove placeholder)

Replace `app/page.tsx`:
```tsx
import Hero from '@/components/hero/Hero';
import About from '@/components/sections/About';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
    </main>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run:
```bash
npm run dev
```
Visit `http://localhost:3000`. Scroll down. Expected:
- Eyebrow, headline, and role chips fade-up in sequence as About enters viewport.
- Headline reads with profile summary text.
- Four chips render: Cybersecurity Engineer, AI Builder, Founder, Creative Technologist.

Stop the server.

- [ ] **Step 5: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 6: Commit**

Run:
```bash
git add components/sections/About.tsx components/sections/About.module.css app/page.tsx
git commit -m "Add About section"
```

---

## Task 20: `ProjectCard` component (with mouse-follow spotlight)

**Files:**
- Create: `components/sections/ProjectCard.tsx`
- Create: `components/sections/ProjectCard.module.css`

- [ ] **Step 1: Write the CSS module**

Write `components/sections/ProjectCard.module.css`:
```css
.card {
  --mx: 50%;
  --my: 50%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  color: var(--text);
  text-decoration: none;
  isolation: isolate;
  overflow: hidden;
  transition: transform 400ms var(--ease-out-quart),
              border-color 400ms var(--ease-out-quart),
              box-shadow 400ms var(--ease-out-quart);
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(420px circle at var(--mx) var(--my),
    rgba(255, 123, 50, 0.18),
    transparent 60%);
  opacity: 0;
  transition: opacity 400ms var(--ease-out-quart);
  pointer-events: none;
  z-index: -1;
}

.card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 123, 50, 0.4);
  box-shadow: 0 30px 60px -20px rgba(255, 123, 50, 0.25);
}

.card:hover::before {
  opacity: 1;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0;
}

.name {
  font-size: clamp(1.4rem, 2.2vw, 1.9rem);
  font-weight: 400;
  letter-spacing: -0.01em;
  margin: 0;
}

.tagline {
  margin: 0;
  color: var(--muted);
  line-height: 1.55;
  font-size: 0.95rem;
}

.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.pill {
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--muted);
}

.cta {
  margin-top: auto;
  padding-top: 16px;
  font-size: 13px;
  letter-spacing: 0.05em;
  color: var(--text);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.cta svg {
  width: 14px;
  height: 14px;
  transition: transform 200ms var(--ease-out-quart);
}

.card:hover .cta svg {
  transform: translateX(4px);
}
```

- [ ] **Step 2: Write the component**

Write `components/sections/ProjectCard.tsx`:
```tsx
'use client';
import { MouseEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import styles from './ProjectCard.module.css';

export type Project = {
  slug: string;
  name: string;
  url: string;
  tagline: string;
  category: string;
  stack: string[];
};

type Props = { project: Project };

export default function ProjectCard({ project }: Props) {
  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mx', `${x}%`);
    e.currentTarget.style.setProperty('--my', `${y}%`);
  };

  return (
    <a
      className={styles.card}
      href={project.url}
      target="_blank"
      rel="noreferrer"
      onMouseMove={onMove}
    >
      <p className={styles.eyebrow}>{project.category}</p>
      <h3 className={styles.name}>{project.name}</h3>
      <p className={styles.tagline}>{project.tagline}</p>
      <div className={styles.stack}>
        {project.stack.slice(0, 4).map((s) => (
          <span key={s} className={styles.pill}>{s}</span>
        ))}
      </div>
      <span className={styles.cta}>
        View on GitHub <ArrowUpRight />
      </span>
    </a>
  );
}
```

- [ ] **Step 3: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 4: Commit**

Run:
```bash
git add components/sections/ProjectCard.tsx components/sections/ProjectCard.module.css
git commit -m "Add ProjectCard with mouse-follow spotlight"
```

---

## Task 21: `Projects` section (consumes data/projects.json, all 10)

**Files:**
- Create: `components/sections/Projects.tsx`
- Create: `components/sections/Projects.module.css`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write the CSS module**

Write `components/sections/Projects.module.css`:
```css
.section {
  padding: 20vh 8vw;
  max-width: 1280px;
  margin: 0 auto;
}

.eyebrow {
  font-size: 12px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 24px;
}

.heading {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 300;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0 0 72px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Write the component**

Write `components/sections/Projects.tsx`:
```tsx
'use client';
import { useGsapReveal } from '@/components/hooks/useGsapReveal';
import ProjectCard, { Project } from './ProjectCard';
import projects from '@/data/projects.json';
import styles from './Projects.module.css';

export default function Projects() {
  const ref = useGsapReveal<HTMLElement>({ selector: '[data-reveal]', stagger: 0.08 });
  const items = projects.featured as Project[];

  return (
    <section ref={ref} id="projects" className={styles.section} aria-label="Projects">
      <p className={styles.eyebrow} data-reveal>Selected Work</p>
      <h2 className={styles.heading} data-reveal>Ten builds.</h2>
      <div className={styles.grid}>
        {items.map((p) => (
          <div key={p.slug} data-reveal>
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire Projects into `app/page.tsx`**

Replace `app/page.tsx`:
```tsx
import Hero from '@/components/hero/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
    </main>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run:
```bash
npm run dev
```
Scroll past Hero and About. Expected:
- "Selected Work" eyebrow + "Ten builds." heading.
- 10 cards in a 2-column grid (1 column at mobile widths).
- Hover a card: it lifts, orange glow appears, spotlight follows the cursor.
- Click a card: opens its GitHub URL in a new tab.
- Cards stagger-fade as they enter viewport.

Stop the server.

- [ ] **Step 5: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 6: Commit**

Run:
```bash
git add components/sections/Projects.tsx components/sections/Projects.module.css app/page.tsx
git commit -m "Add Projects section (10 cards from data)"
```

---

## Task 22: `Experience` section

**Files:**
- Create: `components/sections/Experience.tsx`
- Create: `components/sections/Experience.module.css`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write the CSS module**

Write `components/sections/Experience.module.css`:
```css
.section {
  padding: 20vh 8vw;
  max-width: 880px;
  margin: 0 auto;
}

.eyebrow {
  font-size: 12px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 24px;
}

.heading {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 300;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0 0 72px;
}

.timeline {
  position: relative;
  padding-left: 32px;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 6px;
  width: 1px;
  background: rgba(255, 123, 50, 0.3);
}

.entry {
  position: relative;
  margin-bottom: 56px;
}

.entry:last-child { margin-bottom: 0; }

.dot {
  position: absolute;
  top: 6px;
  left: -32px;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--orange);
  box-shadow: 0 0 16px rgba(255, 123, 50, 0.6);
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 8px;
}

.role {
  font-size: clamp(1.05rem, 1.4vw, 1.2rem);
  font-weight: 400;
  margin: 0;
}

.role strong {
  color: var(--text);
  font-weight: 400;
}

.role span {
  color: var(--muted);
}

.period {
  font-size: 13px;
  color: var(--muted);
  font-weight: 300;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.summary {
  margin: 0;
  color: var(--muted);
  line-height: 1.65;
  font-size: 0.95rem;
}
```

- [ ] **Step 2: Write the component**

Write `components/sections/Experience.tsx`:
```tsx
'use client';
import { useGsapReveal } from '@/components/hooks/useGsapReveal';
import experience from '@/data/experience.json';
import styles from './Experience.module.css';

type Entry = {
  company: string;
  role: string;
  period: string;
  location: string;
  tags: string[];
  highlights: string[];
};

export default function Experience() {
  const ref = useGsapReveal<HTMLElement>({ selector: '[data-reveal]', stagger: 0.06 });
  const entries = experience as Entry[];

  return (
    <section ref={ref} id="experience" className={styles.section} aria-label="Experience">
      <p className={styles.eyebrow} data-reveal>Experience</p>
      <h2 className={styles.heading} data-reveal>Operational history.</h2>
      <div className={styles.timeline}>
        {entries.map((e) => (
          <div key={`${e.company}-${e.period}`} className={styles.entry} data-reveal>
            <span className={styles.dot} aria-hidden />
            <div className={styles.row}>
              <p className={styles.role}>
                <strong>{e.role}</strong> <span>· {e.company}</span>
              </p>
              <span className={styles.period}>{e.period}</span>
            </div>
            <p className={styles.summary}>{e.highlights[0]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire Experience into `app/page.tsx`**

Replace `app/page.tsx`:
```tsx
import Hero from '@/components/hero/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Experience />
    </main>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run:
```bash
npm run dev
```
Scroll past Projects. Expected:
- Eyebrow + "Operational history." heading.
- 5 timeline entries with orange dots on a vertical line.
- Each entry shows role + company, period right-aligned, first highlight as summary.

Stop the server.

- [ ] **Step 5: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 6: Commit**

Run:
```bash
git add components/sections/Experience.tsx components/sections/Experience.module.css app/page.tsx
git commit -m "Add Experience timeline section"
```

---

## Task 23: `SkillsGrid` section (floating drift pills)

**Files:**
- Create: `components/sections/SkillsGrid.tsx`
- Create: `components/sections/SkillsGrid.module.css`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write the CSS module**

Write `components/sections/SkillsGrid.module.css`:
```css
.section {
  padding: 20vh 8vw;
  max-width: 1100px;
  margin: 0 auto;
}

.eyebrow {
  font-size: 12px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 24px;
}

.heading {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 300;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0 0 72px;
}

.group {
  margin-bottom: 48px;
}

.group:last-child { margin-bottom: 0; }

.groupLabel {
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 18px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
}

.pill {
  padding: 14px 18px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: 14px;
  letter-spacing: 0.02em;
  text-align: left;
  color: var(--text);
  transition: transform 300ms var(--ease-out-quart),
              border-color 300ms var(--ease-out-quart);
  animation-name: drift;
  animation-duration: 8s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.pill:hover {
  transform: translateY(-10px) !important;
  border-color: var(--orange);
}

@keyframes drift {
  0%, 100% { transform: translateY(-6px); }
  50%      { transform: translateY(6px); }
}

@media (prefers-reduced-motion: reduce) {
  .pill { animation: none; }
}
```

- [ ] **Step 2: Write the component**

Write `components/sections/SkillsGrid.tsx`:
```tsx
'use client';
import { useMemo } from 'react';
import { useGsapReveal } from '@/components/hooks/useGsapReveal';
import skills from '@/data/skills.json';
import styles from './SkillsGrid.module.css';

type Item = { name: string; slug: string; color: string; level: string };
type Group = { label: string; items: Item[] };

export default function SkillsGrid() {
  const ref = useGsapReveal<HTMLElement>({ selector: '[data-reveal]', stagger: 0.05 });
  const groups = skills.groups as Group[];

  const pillDelays = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of groups) {
      for (const it of g.items) {
        const duration = 6 + Math.random() * 4;
        const delay = -Math.random() * 6;
        map.set(`${g.label}:${it.slug}`, `${duration}s -${Math.abs(delay)}s`);
      }
    }
    return map;
  }, [groups]);

  return (
    <section ref={ref} id="skills" className={styles.section} aria-label="Skills">
      <p className={styles.eyebrow} data-reveal>Skills</p>
      <h2 className={styles.heading} data-reveal>Tools I reach for.</h2>
      {groups.map((g) => (
        <div key={g.label} className={styles.group} data-reveal>
          <p className={styles.groupLabel}>{g.label}</p>
          <div className={styles.grid}>
            {g.items.map((it) => {
              const [duration, delay] = (pillDelays.get(`${g.label}:${it.slug}`) ?? '8s 0s').split(' ');
              return (
                <span
                  key={it.slug}
                  className={styles.pill}
                  style={{ animationDuration: duration, animationDelay: delay }}
                >
                  {it.name}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
```

- [ ] **Step 3: Wire SkillsGrid into `app/page.tsx`**

Replace `app/page.tsx`:
```tsx
import Hero from '@/components/hero/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import SkillsGrid from '@/components/sections/SkillsGrid';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <SkillsGrid />
    </main>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run:
```bash
npm run dev
```
Scroll to Skills. Expected:
- 6 groups (Languages, Cloud & Infra, Security, Data & ML, Web & Backend, Ops & Productivity).
- Pills inside each group drift gently up/down out of phase with each other.
- Hover a pill: it lifts and its border turns orange.
- Toggle reduced motion: drift stops; pills are static.

Stop the server.

- [ ] **Step 5: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 6: Commit**

Run:
```bash
git add components/sections/SkillsGrid.tsx components/sections/SkillsGrid.module.css app/page.tsx
git commit -m "Add SkillsGrid section with drifting pills"
```

---

## Task 24: `ContactCTA` section

**Files:**
- Create: `components/sections/ContactCTA.tsx`
- Create: `components/sections/ContactCTA.module.css`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write the CSS module**

Write `components/sections/ContactCTA.module.css`:
```css
.section {
  position: relative;
  padding: 28vh 8vw 16vh;
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
  overflow: hidden;
}

.orb {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60vw;
  height: 60vw;
  max-width: 800px;
  max-height: 800px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 123, 50, 0.18) 0%, rgba(255, 123, 50, 0) 60%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  filter: blur(8px);
  z-index: 0;
  will-change: transform;
}

.eyebrow {
  position: relative;
  z-index: 1;
  font-size: 12px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 24px;
}

.headline {
  position: relative;
  z-index: 1;
  font-size: clamp(2.5rem, 7vw, 6rem);
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.04em;
  margin: 0 0 56px;
}

.cta {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 999px;
  border: 1px solid rgba(255, 123, 50, 0.5);
  background: rgba(255, 123, 50, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--text);
  font-size: 15px;
  letter-spacing: 0.05em;
  text-decoration: none;
  transition: transform 200ms var(--ease-out-quart),
              background 200ms var(--ease-out-quart);
}

.cta:hover {
  transform: scale(1.04);
  background: rgba(255, 123, 50, 0.15);
}

.socials {
  position: relative;
  z-index: 1;
  margin-top: 56px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.socials a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  transition: border-color 200ms var(--ease-out-quart),
              transform 200ms var(--ease-out-quart);
}

.socials a:hover {
  border-color: var(--orange);
  transform: translateY(-2px);
}

.socials svg {
  width: 16px;
  height: 16px;
}
```

- [ ] **Step 2: Write the component**

Write `components/sections/ContactCTA.tsx`:
```tsx
'use client';
import { useEffect, useRef } from 'react';
import { Mail, Github, Linkedin, Globe } from 'lucide-react';
import { useGsapReveal } from '@/components/hooks/useGsapReveal';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';
import profile from '@/data/profile.json';
import styles from './ContactCTA.module.css';

export default function ContactCTA() {
  const reveal = useGsapReveal<HTMLElement>({ selector: '[data-reveal]', stagger: 0.08 });
  const orbRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const orb = orbRef.current;
    if (!orb) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let rafId = 0;
    let running = true;

    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 60;
      target.y = (e.clientY / window.innerHeight - 0.5) * 60;
    };

    const loop = () => {
      if (!running) return;
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      orb.style.transform = `translate(calc(-50% + ${current.x}px), calc(-50% + ${current.y}px))`;
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    loop();

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
    };
  }, [reduced]);

  return (
    <section ref={reveal} id="contact" className={styles.section} aria-label="Contact">
      <div ref={orbRef} className={styles.orb} aria-hidden />
      <p className={styles.eyebrow} data-reveal>Contact</p>
      <h2 className={styles.headline} data-reveal>Let&rsquo;s build something cinematic.</h2>
      <a className={styles.cta} href={`mailto:${profile.email}`} data-reveal>
        <Mail style={{ width: 16, height: 16 }} />
        {profile.email}
      </a>
      <div className={styles.socials} data-reveal>
        <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a>
        <a href={profile.links.github}   target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a>
        <a href={profile.links.company}  target="_blank" rel="noreferrer" aria-label="Securovix"><Globe /></a>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire ContactCTA into `app/page.tsx`**

Replace `app/page.tsx`:
```tsx
import Hero from '@/components/hero/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import SkillsGrid from '@/components/sections/SkillsGrid';
import ContactCTA from '@/components/sections/ContactCTA';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <SkillsGrid />
      <ContactCTA />
    </main>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run:
```bash
npm run dev
```
Scroll to the bottom. Expected:
- "Let's build something cinematic." headline.
- An orange glow orb behind the headline that drifts with the mouse.
- Email pill with the address `farazs156@gmail.com` (clickable → mail client).
- 3 social icons (LinkedIn, GitHub, Globe → Securovix) below.
- All elements stagger-fade as the section enters viewport.

Stop the server.

- [ ] **Step 5: Compile check**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 6: Commit**

Run:
```bash
git add components/sections/ContactCTA.tsx components/sections/ContactCTA.module.css app/page.tsx
git commit -m "Add ContactCTA with drifting orb and social links"
```

---

## Task 25: Full verification gate

**Files:** none (verification-only task)

This task implements the verification gate from the design spec. Do not mark the project "done" unless every checkbox below is confirmed in a real browser.

- [ ] **Step 1: Typecheck**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 2: Production build**

Run:
```bash
npm run build
```
Expected: build succeeds with no errors. Warnings about image optimization or `<img>` usage are acceptable.

- [ ] **Step 3: Boot the dev server and open in a real browser**

Run:
```bash
npm run dev
```
Visit `http://localhost:3000` in a real browser (Chrome or Edge — not just curl).

- [ ] **Step 4: Hero gate**

Confirm in the open browser:
- Hero autoplays muted on first load.
- Poster image visible before video paints.
- "Tap for sound" badge fades in around 2.6s, fades out around 8.6s.
- Click the badge → video unmutes, badge dismisses, mute button icon flips to `Volume2`.
- Reload — badge does NOT show again (sessionStorage acknowledged flag).
- Open a new private/incognito window — badge shows again.
- Click pause button → video pauses, icon flips to `Play`. Click again → resumes.

- [ ] **Step 5: Particles gate**

Still on the hero:
- Three.js particles render as warm bokeh.
- Mouse movement parallax-shifts the field (subtle, slow).
- Open DevTools → Performance → record 3s. Scroll the hero out of view. Keep recording 3s. Stop. Expected: scripting activity drops markedly once hero is out of viewport.
- Switch tab away for 5s, switch back. No console errors, particles resume.

- [ ] **Step 6: Smooth scroll gate**

- Click the scroll indicator on the hero → smoothly scrolls to About.
- Use the mouse wheel — scroll should feel inertial (Lenis active).

- [ ] **Step 7: Sections gate**

Scroll all the way down:
- About: eyebrow + summary headline + 4 chips, fade-up reveal.
- Projects: 10 cards. Each card hovers (lift + glow + spotlight). Each card links out to its GitHub URL in a new tab.
- Experience: 5 timeline entries with orange dots on a vertical line.
- Skills: 6 groups, pills drifting gently, hover lifts a pill.
- Contact: orange orb that drifts with the mouse, email button, 3 socials.

- [ ] **Step 8: Mobile gate**

DevTools → toggle device toolbar → set viewport to 375×812 (iPhone X). Reload.
- Hero text fits without overflow.
- Projects grid is single column.
- Particles still render (or render at reduced count — there is no easy way to count from the UI, but the page should not stutter).
- Skills pills wrap into a single column or narrow grid.
- No horizontal scroll anywhere.

- [ ] **Step 9: Reduced-motion gate**

DevTools → Rendering panel → "Emulate CSS prefers-reduced-motion: reduce". Hard reload.
- Hero text is immediately visible (no entrance animation).
- Particles do NOT render (canvas is absent from DOM).
- Smooth scroll is disabled — page uses native scroll.
- Skills pills are static (no drift).
- Contact orb is static (no parallax).
- Site is fully usable.

- [ ] **Step 10: Lighthouse spot check (optional but recommended)**

Open DevTools → Lighthouse → run "Performance" + "Accessibility" against the desktop preset.
- Performance: aim for ≥85. If lower, note which audits fail — usually LCP from the video, fix only if egregious.
- Accessibility: aim for ≥95. Fix any failures around contrast or missing alt text inline.

- [ ] **Step 11: Stop the dev server**

Stop the `npm run dev` process.

- [ ] **Step 12: Final commit if anything changed during verification**

If verification surfaced and you fixed any defects:
```bash
git status
git add -A
git commit -m "Fixes from verification pass"
```
Otherwise skip this step.

- [ ] **Step 13: Mark project complete**

Report to the user:
- All verification checkboxes confirmed.
- Final commit SHA: `git rev-parse HEAD`
- Files changed since branch start: `git diff --stat main...HEAD | tail -1`

---

## Self-review (post-write check)

**Spec coverage** — every requirement in the spec maps to a task:

| Spec section                                  | Covered by task(s)      |
| --------------------------------------------- | ----------------------- |
| Cleanup (delete macOS, drop framer-motion)    | 1, 2                    |
| Video move + poster                           | 3                       |
| CSS tokens, reset, reduced-motion baseline    | 4                       |
| Layout, fonts, metadata                       | 1 (step 5), 7 (step 2)  |
| useReducedMotion, useIsMobile, useGsapReveal  | 5, 6, 8                 |
| SmoothScroll (Lenis + GSAP)                   | 7                       |
| GlassButton                                   | 9                       |
| useHeroAudio                                  | 10                      |
| SoundBadge                                    | 11                      |
| ScrollIndicator                               | 12                      |
| VideoIntro (main + ambient blur)              | 13                      |
| Hero composition + text overlay               | 14                      |
| Hero GSAP entrance choreography               | 15                      |
| CinematicLayer (Three.js scaffold)            | 16                      |
| Particles + drift + parallax + visibility     | 17                      |
| Dynamic import wiring                         | 18                      |
| About                                         | 19                      |
| ProjectCard with spotlight                    | 20                      |
| Projects (10 cards)                           | 21                      |
| Experience timeline                           | 22                      |
| SkillsGrid drifting pills                     | 23                      |
| ContactCTA + drifting orb                     | 24                      |
| Verification gate                             | 25                      |

No spec section is uncovered.

**Placeholder scan:** All "TBD" / "implement later" / vague guidance removed. Final Contact CTA copy is committed as "Let's build something cinematic." in Task 24.

**Type consistency:** `Project` type defined in Task 20 is reused in Task 21. `Entry` and `Group` types are defined inline in their consuming tasks (22, 23) and match the JSON shape. `useHeroAudio` returns the exact shape consumed by Hero in Task 14. Hook signatures stay consistent across tasks.

**Scope check:** 25 tasks, ~3-15 steps each. Feels right for one implementation pass. No subsystem warrants splitting into a separate plan.

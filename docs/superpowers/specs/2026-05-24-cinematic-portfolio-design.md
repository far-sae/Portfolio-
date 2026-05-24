# Cinematic Portfolio — Design

**Date:** 2026-05-24
**Owner:** Faraz Saeed Khwaja
**Status:** Approved for planning

## Purpose

Replace the in-progress macOS desktop simulation with a single cinematic portfolio: one continuous scroll, anchored by a fullscreen hero video, layered with a Three.js particle field and GSAP entrance choreography, then unfolding into About → Projects → Experience → Skills → Contact.

The site is the user's public identity surface. It must communicate: cybersecurity engineer, AI builder, founder, creative technologist. Premium, slow, restrained — not flashy.

## Decisions locked during brainstorming

- **Scope:** replace everything. The macOS desktop work on `feat/mixer` (`components/{macos,vscode,apps,car}/`) is deleted. `app/page.tsx` becomes the cinematic composition.
- **Display name:** "Faraz Saeed Khwaja". Hero renders as `FARAZ SAEED / KHWAJA` on two lines.
- **Project content:** the 10 real projects in `data/projects.json` drive the Projects section (AegisScan, Real-Time Threat Detection, AI Security Analyst, Autonomus, ETL Financial, Power BI Dashboard, Churn ML, IT Support Automation, Network IDS, Cyber Vault). The 5 names in the original spec were placeholders and are discarded.
- **Layout shape:** pure single-page vertical scroll (Approach A). No pinning, no horizontal scroll, no route splitting.

## Stack

**Add:** `three`, `@types/three`, `gsap` (includes `ScrollTrigger`), `lenis`.
**Remove:** `framer-motion` (unused after rewrite).
**Keep:** Next.js 15 App Router, React 19, TypeScript, Tailwind, `lucide-react`, `clsx`.

CSS Modules are used for component-scoped cinematic styling alongside Tailwind utilities. No new global CSS framework.

## File layout

```
app/
  layout.tsx                  # fonts, metadata, SmoothScroll provider mount
  page.tsx                    # composes the whole experience
  globals.css                 # CSS variables, resets, reduced-motion baseline

components/
  hero/
    Hero.tsx                  # composition: video + particles + overlay + controls
    VideoIntro.tsx            # <video> with autoplay/mute/loop + ambient blur duplicate
    Hero.module.css
  three/
    CinematicLayer.tsx        # fullscreen <canvas>, Three.js particle system
  ui/
    GlassButton.tsx           # reusable glass control (play/mute)
    ScrollIndicator.tsx       # animated vertical line + click-to-scroll
    SoundBadge.tsx            # "Tap for sound" floating, auto-hides
  sections/
    About.tsx
    Projects.tsx              # consumes data/projects.json (all 10)
    ProjectCard.tsx
    Experience.tsx            # consumes data/experience.json
    SkillsGrid.tsx            # consumes data/skills.json
    ContactCTA.tsx
  motion/
    SmoothScroll.tsx          # Lenis provider, mounted in layout
  hooks/
    useGsapReveal.ts          # ScrollTrigger fade/translate on enter
    useReducedMotion.ts       # prefers-reduced-motion shortcut
    useIsMobile.ts            # for particle-count downshift
    useHeroAudio.ts           # shared video-element mute/play state

public/
  hero.mp4                    # moved from assets/a_d_ca_e_b_video_mp_.mp4
  hero-poster.jpg             # first-frame extract via ffmpeg

data/                         # unchanged
```

Sections are server components where possible. `'use client'` is used only for interactive layers: `Hero`, `VideoIntro`, `CinematicLayer`, `SmoothScroll`, `ProjectCard` (mouse spotlight), `SkillsGrid` (drift animation).

## Design system

**Colour tokens** (in `globals.css` as CSS custom properties):

```
--bg:       #050505
--surface:  rgba(255,255,255,0.05)
--border:   rgba(255,255,255,0.08)
--text:     #ffffff
--muted:    rgba(255,255,255,0.65)
--orange:   #ff7b32
--blue:     #6ab7ff
```

**Typography:** Geist Sans (already configured). Hero name uses `font-weight: 300`, tracking `-0.04em`, size `clamp(4rem, 12vw, 12rem)`. Section headings: `clamp(2.5rem, 6vw, 5rem)`, weight 300. Body: weight 400, line-height 1.6.

**Motion vocabulary:**

| Use                        | Easing        | Duration      |
| -------------------------- | ------------- | ------------- |
| Hero entrance              | `expo.out`    | 0.9s – 1.4s   |
| Section scroll reveal      | `power3.out`  | 0.8s          |
| Ambient loops              | `sine.inOut`  | 2s+           |
| Hover transitions          | `power2.out`  | 0.2s          |
| Lenis scroll               | quart-out     | 1.2s          |

No bounce, no elastic, no scaling above 1.06.

## Hero (the emotional core)

**Stage:** single fullscreen section (`min-height: 100svh`), `position: sticky; top: 0` is **not** used — the spec called for it but on second look a sticky hero conflicts with Lenis smooth scroll behaviour and doesn't add anything once particles + parallax are in. The hero is a normal first section.

**Layer stack (bottom → top):**

| z   | Layer                                                            |
| --- | ---------------------------------------------------------------- |
| 0   | Ambient blurred duplicate video. `filter: blur(40px) saturate(1.2)`, `transform: scale(1.15)`, `opacity: 0.4` |
| 10  | `CinematicLayer` Three.js canvas, `mix-blend-mode: screen`, `pointer-events: none` |
| 20  | Main video, `object-fit: cover`, centred                         |
| 30  | Vignette + top/bottom gradient overlay (pure CSS, no asset)      |
| 40  | Text overlay: tagline / name / subtitle                          |
| 50  | Glass controls (bottom-right), sound badge (bottom-centre), scroll indicator (bottom-centre) |

**Video element:** `<video autoPlay muted loop playsInline preload="metadata" poster="/hero-poster.jpg">`. Both layers reference the same `/hero.mp4`; the browser deduplicates the request.

**Audio:** muted on load (browser autoplay requirement). `useHeroAudio()` exposes `{ muted, toggleMute, playing, togglePlay }` and is consumed by both the glass mute button and the sound badge so they stay in sync. Once unmuted, the badge does not show again in that session (sessionStorage flag `hero-audio-acknowledged`).

**Entrance choreography** (GSAP timeline, fires once on mount):

| t      | Action                                                         |
| ------ | -------------------------------------------------------------- |
| 0.0s   | Ambient video fades 0 → 0.4 (1.2s, `sine.inOut`)              |
| 0.4s   | Main video fades 0 → 1 and scales 1.05 → 1.0 (1.4s, `expo.out`) |
| 0.8s   | Tagline letter-staggers in (0.04s stagger, `power3.out`)       |
| 1.1s   | Name lines translate from y:40 + opacity:0 (0.9s, `expo.out`, 0.12s stagger) |
| 1.6s   | Subtitle fades in (0.8s)                                       |
| 2.0s   | Controls + scroll indicator slide in from bottom (0.6s)        |
| 2.6s   | Sound badge appears (if not previously acknowledged)           |

**Sound badge:** fades in at 2.6s, auto-hides at 8.6s (6s visible). Position: 80px above bottom, centred. "Tap for sound" plus a small `Volume2` icon. Click → unmute + dismiss.

**Glass controls:** two 44px round buttons, `Play/Pause` and `Mute/Unmute` (Lucide icons). Style: `background: rgba(255,255,255,0.05)`, `backdrop-filter: blur(20px)`, `border: 1px solid rgba(255,255,255,0.12)`. Hover: border brightens, scale 1.06, 200ms `power2.out`.

**Scroll indicator:** 1px-wide vertical line, 56px tall, centred horizontally 40px from bottom. A 12px luminous dot travels top → bottom on a 2s loop (CSS `@keyframes`, `sine.inOut`). Click → `lenis.scrollTo('#about', { duration: 1.4 })`.

**Overlay text content:**

- Tagline: `CYBERSECURITY · AI · CREATOR` — uppercase, tracking `0.4em`, size 12px, muted colour.
- Name: `FARAZ SAEED` line 1, `KHWAJA` line 2 — light weight, massive, slight negative tracking.
- Subtitle: "Building cinematic digital experiences, intelligent AI systems, and next-generation cybersecurity platforms." — max-width 540px, muted colour, weight 400, line-height 1.6.

## CinematicLayer (Three.js particles)

**Scene:** single `THREE.Scene`, `PerspectiveCamera(fov: 60, near: 0.1, far: 100)`, `camera.position.z = 8`.

**Geometry:** one `THREE.Points` with a `BufferGeometry` carrying `position`, `color`, `size` attributes.

**Particle count:** 1200 on desktop, 400 on mobile (< 768px), 0 if `prefers-reduced-motion`.

**Per-particle init:**
- Position: random in 16 × 10 × 6 box centred on camera target.
- Colour: 70% `#ff7b32`, 30% `#ffe9d6`, stored once in `BufferAttribute`.
- Size: random 0.02 – 0.10.
- Velocity (stored separately, not in geometry): random tiny vector, magnitudes 0.0008 – 0.002 per axis.

**Material:** `THREE.PointsMaterial`, `transparent: true`, `depthWrite: false`, `blending: THREE.AdditiveBlending`, `sizeAttenuation: true`, `vertexColors: true`. `map` is a soft-circle texture generated at init on a 64×64 canvas (radial gradient white → transparent) — no asset load.

**Animation loop:**
- Each particle drifts by its velocity per frame.
- Global y-drift +0.0005/frame so the field floats upward; particles wrap when they leave the top.
- Camera position lerps toward `(mouseX * 0.25, mouseY * 0.25, 8)` with damping factor 0.05 per frame — gentle parallax, no jitter.

**Renderer:** `THREE.WebGLRenderer({ alpha: true, antialias: true })`. DPR clamped to `Math.min(window.devicePixelRatio, 1.5)` on desktop, `1` on mobile. Canvas absolutely positioned over the hero, `pointer-events: none`, `mix-blend-mode: screen`.

**Lifecycle:**
- Single `requestAnimationFrame`.
- Pauses on `document.visibilitychange` when hidden.
- Pauses when hero is out of viewport (IntersectionObserver, threshold 0).
- On unmount: cancel RAF, disconnect observers, `geometry.dispose()`, `material.dispose()`, `texture.dispose()`, `renderer.dispose()`, remove canvas.

**Code split:** imported via `next/dynamic` with `ssr: false` so Three.js doesn't bloat the initial bundle.

## Content sections

All sections share `useGsapReveal()` for enter-on-scroll fade-up (ScrollTrigger `start: 'top 75%'`, `once: true`, fade + 24px translate, 0.8s `power3.out`).

### About

Single screen, left-aligned, `max-width: 960px`, centred. Section heading "About" (small eyebrow) plus a large headline derived from `profile.summary`. Four role chips below: Cybersecurity Engineer · AI Builder · Founder · Creative Technologist. Body lines stagger-fade as section enters viewport.

### Projects

All 10 from `data/projects.json`. Vertical CSS grid: 2 columns desktop, 1 column mobile. Section heading "Selected Work".

`ProjectCard`:
- Surface: `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(255,255,255,0.08)`, `backdrop-filter: blur(12px)`, `border-radius: 24px`, `padding: 32px`.
- Hover (pure CSS transition, 400ms ease):
  - `transform: translateY(-8px)`
  - Border brightens to `rgba(255,123,50,0.4)`
  - `box-shadow: 0 30px 60px -20px rgba(255,123,50,0.25)`
- Mouse-follow spotlight: `mousemove` writes `--mx` / `--my` CSS custom properties on the card; the card's `::before` is a radial gradient anchored at `(var(--mx), var(--my))`, `opacity: 0` baseline, `opacity: 1` on hover. No JS animation library — just CSS reading the custom props.
- Content order: category eyebrow → `name` heading → `tagline` muted line → 4 stack pills (first 4 from `stack[]`) → `View on GitHub →` link to `url`.

Cards stagger-reveal as the section enters viewport (0.08s between cards).

### Experience

Vertical timeline, single column, `max-width: 720px`, centred. Section heading "Experience". A 1px vertical line runs down the left at `padding-left: 24px`, painted `--orange` at 30% opacity. Each entry from `data/experience.json`:
- 12px dot on the line (filled `--orange`)
- Role and company on the top line, weight 400
- Period right-aligned, muted, weight 300
- Summary paragraph below, muted

Entries fade-up on enter (0.6s stagger).

### Skills

Floating pill grid from `data/skills.json`. CSS grid, `repeat(auto-fit, minmax(160px, 1fr))`, gap 16px. Each pill:
- Glass surface, same tokens as project cards but lighter
- CSS `@keyframes drift` translates Y between -6px and +6px on a random 6-10s duration, with a random negative animation-delay so they're out of phase
- Hover: lifts to -10px, border → `--orange`

Animation is pure CSS — no JS RAF — so it costs nothing.

### Contact CTA

Single oversized headline ("Let's build something cinematic." or "Open a channel." — final copy TBD during implementation, default to first). Below: a primary email button linking `mailto:farazs156@gmail.com`, and a row of three social links (LinkedIn, GitHub, Securovix) using Lucide icons.

Background: a single radial-gradient orb (`--orange` at 8% opacity, 60vw wide) drifts on mouse parallax via a small RAF that lerps a `transform: translate(...)` on the orb element. No Three.js needed for this — single element, single property.

## Smooth scroll & animation system

**Lenis:** mounted in `SmoothScroll.tsx` (client component) inside `RootLayout`. Configured:
```ts
new Lenis({ duration: 1.2, easing: t => 1 - Math.pow(1 - t, 4) })
```
Synced to GSAP ticker so `ScrollTrigger` reads Lenis's scroll position rather than the native one:
```ts
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
```
Disabled entirely when `prefers-reduced-motion: reduce`.

**GSAP:** `gsap.registerPlugin(ScrollTrigger)` once in a root effect. All section reveals route through `useGsapReveal({ y = 24, delay = 0, stagger = 0 })` so motion stays consistent.

**Reduced motion path:** `useReducedMotion()` returns `true` →
- All GSAP timelines `.progress(1).pause()` (final frame, no animation)
- Lenis is not initialised
- `CinematicLayer` renders nothing
- Video uses `preload="none"` and shows poster
- Skills drift `@keyframes` disabled via `@media (prefers-reduced-motion: reduce)`

The site still works end-to-end with motion off.

## Performance

| Concern              | Mitigation                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| Initial JS bundle    | `CinematicLayer` dynamically imported (`next/dynamic`, `ssr: false`)                            |
| LCP                  | Hero text is server-rendered HTML with CSS fade-in fallback. Independent of JS readiness.        |
| Video weight         | 1.86 MB is fine. `preload="metadata"`, poster frame shows before bytes arrive.                   |
| Three.js cost        | Single mesh, single draw call. RAF paused on tab hide and hero-out-of-viewport (IntersectionObserver). |
| Mobile               | Particle count 1200 → 400, blur 40px → 20px, DPR clamped to 1, single-column grid.              |
| Cleanup              | Standard Three.js teardown on unmount: dispose geometry, material, texture, renderer; cancel RAF; disconnect observers. |
| Hover spotlight      | CSS custom property updates only; no React re-renders.                                          |
| Skills drift         | Pure CSS `@keyframes`. No JS frame work.                                                        |

## Cleanup before building

1. `git rm -r components/{macos,vscode,apps,car}/`
2. Delete `data/github-repos.json` (currently consumed only by the macOS GitHub app being removed; verify with grep, delete if no other consumers).
3. Drop `framer-motion` from `package.json`.
4. Add `three`, `@types/three`, `gsap`, `lenis` to `package.json`.
5. Move `assets/a_d_ca_e_b_video_mp_.mp4` → `public/hero.mp4`. Extract first frame to `public/hero-poster.jpg` via `ffmpeg -i public/hero.mp4 -frames:v 1 public/hero-poster.jpg`. Delete `assets/` folder.
6. **Verify the video plays.** 1.86 MB is small — confirm it's a real talking-head clip and not a corrupt or placeholder file before building a hero around it. If broken, halt and ask for a replacement.

All cleanup happens in a single commit titled "Wipe macOS work, scaffold cinematic portfolio assets" before any new code lands.

## Verification gate (before claiming done)

Per the project's verification-before-completion rule, "done" requires all of the following confirmed in a real browser:

- `npm run dev` starts cleanly with no console errors.
- Hero autoplays muted on first visit, poster shows before video bytes.
- Sound badge appears, click unmutes, badge stays hidden on reload within the session.
- Glass play/mute controls work and stay in sync with the badge.
- Three.js particles render, drift, and respond to mouse parallax. Canvas pauses when the hero leaves the viewport (verify by scrolling and watching DevTools Performance).
- Lenis smooth scroll works; clicking the scroll indicator lands on About.
- All 10 project cards render from `data/projects.json` with the spotlight hover effect.
- Experience timeline and Skills grid render from their respective JSON.
- Contact CTA links open the right destinations.
- Mobile viewport (DevTools 375×812): single-column, reduced particles, no horizontal overflow.
- `prefers-reduced-motion: reduce` (toggle in DevTools): no animations, video shows poster, particles absent, site still navigable.
- Typecheck passes (`npx tsc --noEmit`).

No animation, performance, or "looks good" claim is made without browser confirmation.

## Out of scope

- Per-project deep pages (the old `app/projects/[slug]` route stays deleted). Cards link out to GitHub.
- Blog, CMS, or any backend.
- Internationalisation.
- Analytics.
- Splitting the hero video into multiple resolutions (single asset for now; revisit if Lighthouse complains).

## Open question for implementation

- **Final Contact CTA copy.** Default: "Let's build something cinematic." Alternate: "Open a channel." Decide during implementation.

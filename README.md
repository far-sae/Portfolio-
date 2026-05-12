# Faraz Saeed — Portfolio

A motion-driven personal portfolio for **Faraz Saeed Khwaja** built with Next.js 15, TypeScript, Tailwind CSS and Framer Motion.

It surfaces:
- A bio + skills/certs/education panel pulled from LinkedIn
- An animated experience timeline (5 roles, Nov 2025 back to Dec 2020)
- 10 deep-dive case studies of featured GitHub projects
- A full list of all 38 public repos
- Polished hero with scroll-linked parallax, name reveal, and ambient glow

## Stack

- **Next.js 15** (App Router)
- **TypeScript** strict mode
- **Tailwind CSS** 3.4
- **Framer Motion** 11 — scroll-linked transforms, layout animations, page-progress bar
- **lucide-react** icons

## Project structure

```
app/
  layout.tsx          // root layout + fonts + metadata
  page.tsx            // home (hero + about + experience + projects + contact)
  projects/[slug]/    // dynamic case-study pages, statically generated
  globals.css
components/
  Nav, Hero, About, Experience, Projects, ProjectDetail, Contact, Section
data/
  profile.json        // bio, skills, certs, education (from LinkedIn)
  experience.json     // 5 roles, each with tags + highlights
  projects.json       // 10 featured + 25 other repos
```

## Getting started

```bash
npm install
npm run dev
```

Visit http://localhost:3000.

## Build

```bash
npm run build
npm run start
```

For static export to host on GitHub Pages / Netlify, add `output: 'export'` to `next.config.mjs`.

## Editing content

- **Bio / skills / certs / education** — `data/profile.json`
- **Experience roles** — `data/experience.json`
- **Featured case studies** — `data/projects.json` (the `featured` array)
- **Secondary repo list** — `data/projects.json` (the `other` array)

Every featured project has a `problem`, `approach`, `highlights`, `outcomes` and `accent` colour — refine those to make each case study sing.

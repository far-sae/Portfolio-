'use client';

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import projects from '@/data/projects.json';
import githubRepos from '@/data/github-repos.json';
import { Section, SectionHeader } from './Section';
import { Counter } from './Counter';

const CATEGORIES = [
  'All',
  'Cybersecurity',
  'AI · Cybersecurity',
  'Cloud Security',
  'Data Engineering',
  'Analytics',
  'Machine Learning',
  'Automation',
  'Web · Fintech'
] as const;

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeader
        index="N° 04"
        eyebrow="Selected Work / 10"
        title={
          <>
            Ten case studies.{' '}
            <span className="text-muted">Forty seven shipped repos.</span>
          </>
        }
        description="Each row opens a full case study with problem, approach, highlights and outcomes. Filter by discipline. Lab archive sits below."
      />

      <Featured />

      <div className="mt-32">
        <AllRepos />
      </div>
    </Section>
  );
}

function Featured() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>('All');
  const list = useMemo(
    () =>
      filter === 'All'
        ? projects.featured
        : projects.featured.filter((p) => p.category === filter),
    [filter]
  );

  return (
    <>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <motion.button
              key={c}
              onClick={() => setFilter(c)}
              data-cursor="filter"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={`mono rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-all ${
                filter === c
                  ? 'border-ink bg-ink text-bg'
                  : 'border-line bg-surface/40 text-muted hover:border-muted hover:text-ink'
              }`}
            >
              {c}
            </motion.button>
          ))}
        </div>
        <div className="label">
          Showing {list.length} / {projects.featured.length}
        </div>
      </div>

      <motion.div layout className="border-t border-line">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function ProjectRow({ project, index }: { project: any; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 250, damping: 25 });
  const sy = useSpring(my, { stiffness: 250, damping: 25 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-2.5, 2.5]);
  const rotX = useTransform(sy, [-0.5, 0.5], [1.5, -1.5]);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      style={{
        transformPerspective: 1400,
        transformStyle: 'preserve-3d',
        rotateX: rotX,
        rotateY: rotY
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <Link
        href={`/projects/${project.slug}`}
        ref={ref}
        onMouseMove={onMove}
        data-cursor="case study"
        className="group relative grid grid-cols-12 items-center gap-4 overflow-hidden border-b border-line py-7 transition-colors hover:bg-surface/40"
      >
        {/* spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(520px circle at ${pos.x}px ${pos.y}px, ${project.accent}28, transparent 60%)`
          }}
        />

        {/* left accent bar */}
        <div
          aria-hidden
          className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 transition-transform duration-500 group-hover:scale-y-100"
          style={{ background: project.accent }}
        />

        {/* index */}
        <div className="col-span-1 mono text-xs text-muted">
          /{String(index + 1).padStart(2, '0')}
        </div>

        {/* name */}
        <div className="col-span-11 sm:col-span-5">
          <div className="flex items-baseline gap-3">
            <motion.span
              className="block h-2 w-2 rounded-full"
              style={{ background: project.accent }}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
            <h3 className="display text-xl font-semibold tracking-[-0.01em] text-ink transition-colors group-hover:text-white sm:text-2xl">
              {project.name}
            </h3>
          </div>
          <p className="mt-2 max-w-md pl-5 text-sm text-muted">{project.tagline}</p>
        </div>

        {/* stack */}
        <div className="col-span-12 hidden flex-wrap items-center gap-1.5 sm:col-span-4 sm:flex">
          {project.stack.slice(0, 3).map((s: string) => (
            <span
              key={s}
              className="mono rounded-full border border-line bg-bg/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-muted transition-colors group-hover:border-muted group-hover:text-ink/90"
            >
              {s}
            </span>
          ))}
        </div>

        {/* category */}
        <div className="col-span-11 col-start-2 flex items-center justify-between sm:col-span-2 sm:col-start-auto">
          <span className="mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {project.category}
          </span>
          <span className="relative h-5 w-5 overflow-hidden">
            <ArrowUpRight className="absolute h-5 w-5 text-muted transition-all duration-500 group-hover:-translate-y-5 group-hover:translate-x-5 group-hover:opacity-0" />
            <ArrowUpRight className="absolute h-5 w-5 translate-y-5 -translate-x-5 text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:opacity-100" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* -------- All 47 repos -------- */

function AllRepos() {
  const [sort, setSort] = useState<'recent' | 'lang' | 'year'>('recent');
  const [lang, setLang] = useState<string>('All');

  const languages = useMemo(() => {
    const set = new Set<string>();
    githubRepos.forEach((r) => set.add(r.language));
    return ['All', ...Array.from(set)];
  }, []);

  const sorted = useMemo(() => {
    let list = [...githubRepos];
    if (lang !== 'All') list = list.filter((r) => r.language === lang);
    if (sort === 'recent') {
      list.sort((a, b) => (a.pushed < b.pushed ? 1 : -1));
    } else if (sort === 'lang') {
      list.sort((a, b) => a.language.localeCompare(b.language));
    } else {
      list.sort((a, b) => (a.created < b.created ? 1 : -1));
    }
    return list;
  }, [sort, lang]);

  return (
    <div>
      <div className="flex items-center gap-6">
        <span className="mono text-xs text-muted">N° 04.5</span>
        <span className="h-px flex-1 bg-line" />
        <span className="label">Lab Archive / {githubRepos.length}</span>
      </div>

      <h3 className="display mt-6 max-w-3xl text-balance text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
        Every public repo I&apos;ve pushed since{' '}
        <span className="text-muted">Feb 2023</span>.
      </h3>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Click through to source. The featured ten above are the production grade
        ones. Everything else is in here. Labs, prototypes, coursework, weekend
        hacks.
      </p>

      {/* mini stats */}
      <div className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
        {[
          { v: 47, label: 'Total repos' },
          { v: 18, label: 'Python projects' },
          { v: 12, label: 'TypeScript' },
          { v: 3, label: 'Active years' }
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            className="bg-bg p-5"
          >
            <div className="display text-3xl font-bold tracking-tighter">
              <Counter to={s.v} duration={1.6 + i * 0.1} />
            </div>
            <div className="label mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {languages.map((l) => (
            <motion.button
              key={l}
              onClick={() => setLang(l)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              className={`mono rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] ${
                lang === l
                  ? 'border-ink bg-ink text-bg'
                  : 'border-line text-muted hover:border-muted hover:text-ink'
              }`}
            >
              {l}
            </motion.button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="label">Sort</span>
          {(['recent', 'lang', 'year'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`mono text-[10px] uppercase tracking-[0.18em] ${
                sort === s ? 'text-ink' : 'text-muted hover:text-ink'
              }`}
            >
              {s === 'recent' ? 'updated' : s}
            </button>
          ))}
        </div>
      </div>

      <motion.ul layout className="mt-8 grid grid-cols-1 gap-x-8 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {sorted.map((r, i) => (
            <RepoRow key={r.name} repo={r} index={i} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}

const LANG_COLORS: Record<string, string> = {
  Python: '#3b82f6',
  TypeScript: '#22d3ee',
  JavaScript: '#facc15',
  HTML: '#f87171',
  Solidity: '#a3a3a3',
  Other: '#6b7280'
};

function RepoRow({
  repo,
  index
}: {
  repo: (typeof import('@/data/github-repos.json'))[number];
  index: number;
}) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3, delay: Math.min(index, 20) * 0.015 }}
      className="border-b border-line"
      whileHover={{ x: 4 }}
    >
      <a
        href={repo.url}
        target="_blank"
        rel="noreferrer"
        data-cursor="github"
        className="group flex items-center gap-3 py-3"
      >
        <motion.span
          className="h-2 w-2 flex-none rounded-full"
          style={{ background: LANG_COLORS[repo.language] || LANG_COLORS.Other }}
          whileHover={{ scale: 1.6 }}
        />
        <span className="min-w-0 flex-1 truncate text-sm text-ink/90 group-hover:text-ink">
          {repo.name.replace(/-/g, ' ').replace(/_/g, ' ')}
        </span>
        <span className="mono hidden text-[10px] uppercase tracking-wider text-muted/70 sm:inline">
          {repo.pushed.slice(0, 7)}
        </span>
        <ArrowUpRight className="h-3.5 w-3.5 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
      </a>
    </motion.li>
  );
}

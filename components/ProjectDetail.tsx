'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';
import { Nav } from './Nav';
import { Footer } from './Contact';
import { Magnetic } from './Magnetic';
import { ScrollStory } from './ScrollStory';
import { BuiltList } from './BuiltList';
import { TechStackMatrix } from './TechStackMatrix';
import { FlowDiagram } from './FlowDiagram';
import { RepoCard } from './RepoCard';

type Project = {
  slug: string;
  name: string;
  repo: string;
  url: string;
  tagline: string;
  category: string;
  duration?: string;
  stack: string[];
  summary: string;
  longSummary?: string[];
  problem: string;
  approach: string;
  built?: { title: string; desc: string }[];
  techStack?: { name: string; role: string; why: string }[];
  flow?: { step: string; desc: string }[];
  learnings?: string[];
  highlights: string[];
  outcomes: string[];
  accent: string;
};

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'story', label: 'Story' },
  { id: 'built', label: 'Built' },
  { id: 'stack', label: 'Stack' },
  { id: 'flow', label: 'Flow' },
  { id: 'learnings', label: 'Learnings' },
  { id: 'outcomes', label: 'Outcomes' }
];

export function ProjectDetail({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const railProgress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <main className="relative">
      <Nav />

      {/* Floating side rail */}
      <SideRail accent={project.accent} progress={railProgress} />

      {/* hero */}
      <section ref={ref} className="relative isolate overflow-hidden pt-32 sm:pt-44">
        <div aria-hidden className="bg-grid grid-fade absolute inset-0 -z-10" />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-1/3 -z-10 h-[460px] w-[460px] rounded-full blur-3xl"
          style={{ background: project.accent, opacity: 0.18 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity }}
        />

        <motion.div style={{ y: heroY }} className="container-x">
          <div className="flex items-center gap-6">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mono text-xs text-muted"
            >
              CASE STUDY · {project.category.toUpperCase()}
            </motion.span>
            <span className="h-px flex-1 bg-line" />
            <Link
              href="/#projects"
              data-cursor="back"
              className="group inline-flex items-center gap-2 mono text-[10px] uppercase tracking-[0.22em] text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-3 w-3" /> All Work
            </Link>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="display mt-10 max-w-4xl text-balance text-5xl font-bold leading-[0.95] tracking-[-0.045em] sm:text-7xl md:text-8xl"
          >
            {project.name}
            <span style={{ color: project.accent }}>.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 max-w-3xl text-balance text-xl text-ink/85 sm:text-2xl"
          >
            {project.tagline}
          </motion.p>

          {/* Meta row */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4"
          >
            <MetaCell label="Category" value={project.category} />
            <MetaCell label="Build" value={project.duration ?? 'Solo'} />
            <MetaCell label="Stack" value={`${project.stack.length} tools`} />
            <MetaCell label="Source" value={
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                data-cursor="github"
                className="inline-flex items-center gap-1.5 text-ink hover:underline"
              >
                <Github className="h-3.5 w-3.5" /> github
              </a>
            } />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic strength={0.3}>
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                data-cursor="github"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 mono text-[10px] uppercase tracking-[0.22em] text-bg transition-colors hover:bg-white"
              >
                <Github className="h-3.5 w-3.5" /> Open source
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </Magnetic>
            {project.stack.map((s) => (
              <motion.span
                key={s}
                whileHover={{ y: -2 }}
                className="mono rounded-full border border-line bg-surface/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-muted"
              >
                {s}
              </motion.span>
            ))}
          </motion.div>

          {/* Real GitHub repo preview card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16"
          >
            <RepoCard repo={project.repo} accent={project.accent} />
          </motion.div>
        </motion.div>
      </section>

      {/* overview */}
      <section id="overview" className="container-x mt-24 scroll-mt-32">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 gap-x-12 md:grid-cols-12"
        >
          <div className="md:col-span-3">
            <div className="mono sticky top-32 text-[10px] uppercase tracking-[0.22em] text-muted">
              N° 01 / Overview
            </div>
          </div>
          <div className="md:col-span-9">
            <p className="text-balance text-2xl leading-snug text-ink/95 sm:text-3xl">
              {project.summary}
            </p>
          </div>
        </motion.div>
      </section>

      {/* story */}
      {project.longSummary && (
        <div id="story" className="scroll-mt-32">
          <ScrollStory
            paragraphs={project.longSummary}
            accent={project.accent}
            index="N° 02"
            title="Story"
          />
        </div>
      )}

      <Block index="N° 02.5" title="Problem" body={project.problem} accent={project.accent} />
      <Block index="N° 02.7" title="Approach" body={project.approach} accent={project.accent} />

      {/* built */}
      {project.built && (
        <div id="built" className="scroll-mt-32">
          <BuiltList
            items={project.built}
            accent={project.accent}
            index="N° 03"
            title="What I built"
          />
        </div>
      )}

      {/* tech stack */}
      {project.techStack && (
        <div id="stack" className="scroll-mt-32">
          <TechStackMatrix
            stack={project.techStack}
            accent={project.accent}
            index="N° 04"
            title="Tech stack"
          />
        </div>
      )}

      {/* flow diagram */}
      {project.flow && (
        <div id="flow" className="scroll-mt-32">
          <FlowDiagram
            steps={project.flow}
            accent={project.accent}
            index="N° 05"
            title="Architecture flow"
          />
        </div>
      )}

      {/* learnings */}
      {project.learnings && (
        <section id="learnings" className="container-x mt-32 scroll-mt-32">
          <div className="grid grid-cols-1 gap-x-12 md:grid-cols-12">
            <div className="md:col-span-3">
              <div className="mono sticky top-32 text-[10px] uppercase tracking-[0.22em] text-muted">
                N° 06 / Learnings
              </div>
            </div>
            <div className="md:col-span-9 space-y-6">
              {project.learnings.map((l, i) => (
                <motion.div
                  key={l}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-6 border-l border-line pl-6"
                >
                  <span
                    className="display text-3xl font-bold"
                    style={{ color: project.accent }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-balance text-xl leading-relaxed text-ink/90">
                    {l}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* highlights */}
      <section id="highlights" className="container-x mt-24 scroll-mt-32">
        <div className="grid grid-cols-1 gap-x-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="mono sticky top-32 text-[10px] uppercase tracking-[0.22em] text-muted">
              N° 07 / Highlights
            </div>
          </div>
          <div className="md:col-span-9">
            <ul className="divide-y divide-line border-y border-line">
              {project.highlights.map((h, i) => (
                <motion.li
                  key={h}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group flex items-start gap-6 py-5"
                >
                  <span
                    className="mono text-xs"
                    style={{ color: project.accent }}
                  >
                    /{String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-lg text-ink/90 transition-colors group-hover:text-ink">
                    {h}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* outcomes */}
      <section id="outcomes" className="container-x mt-24 mb-32 scroll-mt-32">
        <div className="grid grid-cols-1 gap-x-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="mono sticky top-32 text-[10px] uppercase tracking-[0.22em] text-muted">
              N° 08 / Outcomes
            </div>
          </div>
          <div className="md:col-span-9 grid gap-px bg-line sm:grid-cols-3 border border-line">
            {project.outcomes.map((o, i) => (
              <motion.div
                key={o}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="relative overflow-hidden bg-bg p-8"
              >
                <div
                  className="display text-6xl font-bold tracking-tighter"
                  style={{ color: project.accent, opacity: 0.85 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="mt-6 text-base text-ink/90">{o}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* back to all */}
      <section className="border-t border-line">
        <div className="container-x py-16">
          <Link
            href="/#projects"
            data-cursor="back"
            className="link-underline group inline-flex items-center gap-3 mono text-xs uppercase tracking-[0.22em] text-muted hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to selected work
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function MetaCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-bg p-4">
      <div className="mono text-[9px] uppercase tracking-[0.22em] text-muted">
        {label}
      </div>
      <div className="mt-1 text-sm text-ink/90">{value}</div>
    </div>
  );
}

function SideRail({ accent, progress }: { accent: string; progress: any }) {
  return (
    <aside className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div className="relative flex flex-col gap-3">
        <div className="absolute left-1 top-0 h-full w-px bg-line" />
        <motion.div
          style={{ height: progress, background: accent }}
          className="absolute left-1 top-0 w-px"
        />
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="pointer-events-auto group flex items-center gap-3 pl-4"
          >
            <span className="mono text-[9px] uppercase tracking-[0.22em] text-muted opacity-0 transition-opacity group-hover:opacity-100">
              {s.label}
            </span>
            <span
              className="h-1.5 w-1.5 rounded-full bg-muted/40 transition-all group-hover:scale-150"
              style={{ boxShadow: `0 0 0 3px ${accent}11` }}
            />
          </a>
        ))}
      </div>
    </aside>
  );
}

function Block({
  index,
  title,
  body,
  accent
}: {
  index: string;
  title: string;
  body: string;
  accent: string;
}) {
  return (
    <section className="container-x mt-24">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 gap-x-12 md:grid-cols-12"
      >
        <div className="md:col-span-3">
          <div className="mono sticky top-32 text-[10px] uppercase tracking-[0.22em] text-muted">
            {index} / {title}
          </div>
        </div>
        <div className="md:col-span-9">
          <p
            className="text-balance text-xl leading-relaxed text-ink/90 sm:text-2xl"
            style={{ textIndent: 0 }}
          >
            <span
              className="mr-3 inline-block h-3 w-3 -translate-y-1 rounded-full align-middle"
              style={{ background: accent }}
            />
            {body}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

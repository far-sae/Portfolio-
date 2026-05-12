'use client';

import { motion } from 'framer-motion';
import profile from '@/data/profile.json';
import { Section, SectionHeader } from './Section';

export function About() {
  return (
    <Section id="about">
      <SectionHeader
        index="N° 02"
        eyebrow="Profile / About"
        title={
          <>
            Five years between{' '}
            <span className="text-muted">Bangalore</span> and{' '}
            <span className="text-muted">London</span>. A security mindset,
            forged in data work.
          </>
        }
      />

      <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-12">
        {/* manifesto */}
        <div className="md:col-span-7">
          <p className="text-balance text-xl leading-relaxed text-ink/90 sm:text-2xl">
            I started as a data analyst at Fidelity National Financial in
            Bangalore, watching dashboards catch what humans missed. Then I came
            to London, did an{' '}
            <span className="text-ink underline decoration-accent decoration-2 underline-offset-4">
              MSc in Cyber Security
            </span>
            , and discovered the same instinct works on attacker telemetry. The
            anomaly is always written somewhere. You just have to read it.
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Today I run engineering at{' '}
            <a
              href="https://securovix.com"
              target="_blank"
              rel="noreferrer"
              className="link-underline text-ink"
            >
              Securovix
            </a>
            . Shipping AI driven SOC tooling, cloud native detection pipelines
            and the data plumbing that actually makes them work in production.
          </p>

          <div className="hairline my-10" />

          {/* pointer to skills and achievements below */}
          <div className="grid grid-cols-2 gap-px border border-line bg-line">
            <a
              href="#skills"
              data-cursor="stack"
              className="group flex items-center justify-between bg-bg p-4 transition-colors hover:bg-surface/40"
            >
              <div>
                <div className="label">Toolbelt</div>
                <div className="mt-1 text-sm text-ink">35+ tools, daily use</div>
              </div>
              <span
                className="mono text-[10px] uppercase tracking-[0.22em] text-muted group-hover:text-ink"
              >
                Scroll ↓
              </span>
            </a>
            <a
              href="#achievements"
              data-cursor="certs"
              className="group flex items-center justify-between bg-bg p-4 transition-colors hover:bg-surface/40"
            >
              <div>
                <div className="label">Certifications</div>
                <div className="mt-1 text-sm text-ink">8 earned, current</div>
              </div>
              <span
                className="mono text-[10px] uppercase tracking-[0.22em] text-muted group-hover:text-ink"
              >
                Scroll ↓
              </span>
            </a>
          </div>
        </div>

        {/* meta panel */}
        <aside className="md:col-span-4 md:col-start-9">
          <div className="sticky top-32 space-y-10">
            <div>
              <div className="label mb-3">Education</div>
              <ul className="space-y-4">
                {profile.education.map((e) => (
                  <li key={e.degree + e.school}>
                    <div className="text-sm font-medium text-ink">
                      {e.degree}
                    </div>
                    <div className="mt-0.5 text-xs text-muted">{e.school}</div>
                    {e.period && (
                      <div className="mono mt-1 text-[10px] uppercase tracking-wider text-muted/70">
                        {e.period}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="label mb-3">Stack / Skills</div>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                {profile.topSkills.map((s) => (
                  <span
                    key={s}
                    className="border-b border-transparent text-sm text-ink/80 transition-colors hover:border-accent hover:text-accent"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="label mb-3">Location</div>
              <div className="text-sm text-ink">{profile.location}</div>
              <div className="mt-1 mono text-xs text-muted">51.5° N, 0.1° W</div>
            </div>
          </div>
        </aside>
      </div>
    </Section>
  );
}

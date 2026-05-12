'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import profile from '@/data/profile.json';
import { Section, SectionHeader } from './Section';
import { Marquee } from './Marquee';
import { Magnetic } from './Magnetic';

export function Contact() {
  return (
    <>
      <Section id="contact" className="pb-12">
        <SectionHeader
          index="N° 05"
          eyebrow="Contact / Final"
          title={
            <>
              Hiring? Building?{' '}
              <span className="text-muted">Both work.</span>
            </>
          }
          description="Email is the fastest way through. I read everything in the London evening. Expect a reply within a day."
        />

        <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="label">Direct line</div>
            <Magnetic strength={0.15}>
              <a
                href={`mailto:${profile.email}`}
                data-cursor="email"
                className="link-underline group mt-3 inline-flex items-center gap-3 text-3xl font-medium text-ink sm:text-5xl"
              >
                <span className="display tracking-[-0.02em]">{profile.email}</span>
                <ArrowUpRight className="h-7 w-7 text-muted transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ink" />
              </a>
            </Magnetic>

            <div className="hairline my-10" />

            <ul className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {[
                { label: 'GitHub', href: profile.links.github, value: 'far-sae' },
                { label: 'LinkedIn', href: profile.links.linkedin, value: 'farazsaeed' },
                { label: 'Company', href: profile.links.company, value: 'securovix.com' },
                { label: 'Personal', href: profile.links.personal, value: 'cyber-hub.uk' }
              ].map((l) => (
                <li key={l.label} className="border-b border-line/70 pb-2">
                  <div className="label mb-1">{l.label}</div>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="open"
                    className="link-underline inline-flex items-center gap-2 text-ink/90 transition-colors hover:text-ink"
                  >
                    {l.value}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <div className="card relative overflow-hidden p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/30 blur-3xl"
              />
              <div className="label">Open to</div>
              <ul className="relative mt-3 space-y-2.5 text-sm text-ink/90">
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-ok" />
                  Cyber Security / SOC roles
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-ok" />
                  Cloud Security / Detection Eng.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-ok" />
                  Applied AI / Agent systems
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-ok" />
                  Securovix client engagements
                </li>
              </ul>
              <div className="hairline my-5" />
              <div className="mono text-[10px] uppercase tracking-[0.22em] text-muted">
                London · UK timezone · GMT
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* Outlined giant name */}
      <section className="container-x relative overflow-hidden pb-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="display select-none whitespace-nowrap font-extrabold leading-none tracking-[-0.06em]"
          style={{
            fontSize: 'clamp(4rem, 22vw, 22rem)',
            WebkitTextStroke: '1px rgba(231,233,238,0.18)',
            color: 'transparent'
          }}
        >
          FARAZ SAEED.
        </motion.div>
      </section>

      <div className="border-y border-line/80 bg-bg/70 py-3">
        <Marquee
          items={[
            'Open for collaboration',
            'London / GMT',
            'Securovix / co founder & CTO',
            'github.com/far-sae',
            'farazs156@gmail.com',
            'MSc Cyber Security',
            'AI · Cloud · Detection'
          ]}
          reverse
        />
      </div>
    </>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line/60 bg-bg/80">
      <div className="container-x flex flex-col items-start justify-between gap-3 py-10 sm:flex-row sm:items-center">
        <div className="mono text-[10px] uppercase tracking-[0.22em] text-muted">
          © {new Date().getFullYear()} Faraz Saeed Khwaja · Built in Next 15 ·
          Framer Motion
        </div>
        <div className="mono flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-ok" />
          All systems nominal
        </div>
      </div>
    </footer>
  );
}

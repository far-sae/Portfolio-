'use client';
import type { CSSProperties } from 'react';
import {
  MapPin,
  Shield,
  Monitor,
  BarChart3,
  Cloud,
  Landmark,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';
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

const ACCENTS = ['#ff7b32', '#6ab7ff', '#a78bfa', '#34d399', '#fb7185'];

const COMPANY_ICONS: Record<string, LucideIcon> = {
  Securovix: Shield,
  'SecureTech Insight': Monitor,
  'Secure Tech Insight': BarChart3,
  'Secure Tech': Cloud,
  'Fidelity National Financial': Landmark,
};

const COMPANY_MARKS: Record<string, string> = {
  Securovix: 'SV',
  'SecureTech Insight': 'ST',
  'Secure Tech Insight': 'ST',
  'Secure Tech': 'ST',
  'Fidelity National Financial': 'FNF',
};

export default function Experience() {
  const ref = useGsapReveal<HTMLElement>({ selector: '[data-reveal]', stagger: 0.1, x: 80 });
  const entries = experience as unknown as Entry[];

  return (
    <section ref={ref} id="experience" className={styles.section} aria-label="Experience">
      <p className={styles.eyebrow} data-reveal>Experience</p>
      <h2 className={styles.heading} data-reveal>Operational history.</h2>
      <div className={styles.timeline}>
        {entries.map((e, i) => {
          const Icon = COMPANY_ICONS[e.company] ?? Briefcase;
          const mark = COMPANY_MARKS[e.company] ?? e.company.slice(0, 2).toUpperCase();
          return (
            <article
              key={`${e.company}-${e.period}`}
              className={styles.entry}
              data-reveal
              style={{ '--accent': ACCENTS[i % ACCENTS.length] } as CSSProperties}
            >
              <span className={styles.dot} aria-hidden />
              <div className={styles.logo} aria-hidden>
                <div className={styles.logoIcon}>
                  <Icon size={22} strokeWidth={1.6} />
                </div>
                <div className={styles.logoMark}>{mark}</div>
              </div>
              <div className={styles.body}>
                <div className={styles.header}>
                  <div className={styles.titleBlock}>
                    <h3 className={styles.role}>{e.role}</h3>
                    <p className={styles.company}>{e.company}</p>
                  </div>
                  <div className={styles.metaBlock}>
                    <span className={styles.period}>{e.period}</span>
                    <span className={styles.location}>
                      <MapPin size={12} /> {e.location}
                    </span>
                  </div>
                </div>

                <div className={styles.tags}>
                  {e.tags.map((t) => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>

                <ul className={styles.highlights}>
                  {e.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

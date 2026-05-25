'use client';
import type { CSSProperties } from 'react';
import { MapPin } from 'lucide-react';
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

function initial(company: string): string {
  const words = company.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return company.slice(0, 2).toUpperCase();
}

export default function Experience() {
  const ref = useGsapReveal<HTMLElement>({ selector: '[data-reveal]', stagger: 0.1, x: 80 });
  const entries = experience as unknown as Entry[];

  return (
    <section ref={ref} id="experience" className={styles.section} aria-label="Experience">
      <p className={styles.eyebrow} data-reveal>Experience</p>
      <h2 className={styles.heading} data-reveal>Operational history.</h2>
      <div className={styles.timeline}>
        {entries.map((e, i) => (
          <article
            key={`${e.company}-${e.period}`}
            className={styles.entry}
            data-reveal
            style={{ '--accent': ACCENTS[i % ACCENTS.length] } as CSSProperties}
          >
            <span className={styles.dot} aria-hidden />
            <div className={styles.badge} aria-hidden>{initial(e.company)}</div>
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
        ))}
      </div>
    </section>
  );
}

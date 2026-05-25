import type { CSSProperties } from 'react';
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

const ACCENTS = ['var(--orange)', 'var(--blue)', 'var(--purple)', 'var(--green)', 'var(--pink)'];

export default function Experience() {
  const entries = experience as unknown as Entry[];
  // Stage numbers count UP through time — oldest = 1.0, current = 5.0.
  // experience.json is newest-first, so reverse for numbering then re-flip for display.
  const total = entries.length;

  return (
    <section id="experience" className={styles.section} aria-label="Career stages">
      <h2 className={styles.heading}>How I got here.</h2>
      <p className={styles.lede}>
        Five stages, oldest to newest. Each one taught me what to keep and
        what to leave in the drawer.
      </p>

      <div className={styles.stages}>
        {entries.map((e, displayIndex) => {
          // displayIndex 0 = newest; we want 5.0 → 1.0 going DOWN.
          const stageNum = total - displayIndex;
          return (
            <article
              key={`${e.company}-${e.period}`}
              className={styles.stage}
              style={{ '--accent': ACCENTS[displayIndex % ACCENTS.length] } as CSSProperties}
            >
              <header className={styles.rail}>
                <div className={styles.stageNumber}>{stageNum.toFixed(1)}</div>
                <div className={styles.stageLabel}>{e.tags[0] ?? 'Role'}</div>
                <div className={styles.period}>{e.period}</div>
                <div className={styles.location}>{e.location}</div>
              </header>

              <div className={styles.body}>
                <h3 className={styles.role}>{e.role}</h3>
                <p className={styles.company}>{e.company}</p>

                <ul className={styles.highlights}>
                  {e.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>

                <div className={styles.tags} aria-label="Stack">
                  {e.tags.map((t) => (
                    <span key={t}>{t.toLowerCase()}</span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

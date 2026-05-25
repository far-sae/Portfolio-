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
  const ref = useGsapReveal<HTMLElement>({ selector: '[data-reveal]', stagger: 0.08, x: 60 });
  const entries = experience as unknown as Entry[];

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

'use client';
import { useGsapReveal } from '@/components/hooks/useGsapReveal';
import skills from '@/data/skills.json';
import styles from './Achievements.module.css';

type Achievement = {
  name: string;
  title: string;
  issuer: string;
  slug: string;
  color: string;
  year: string;
};

export default function Achievements() {
  const ref = useGsapReveal<HTMLElement>({ selector: '[data-reveal]', stagger: 0.05 });
  const items = skills.achievements as unknown as Achievement[];

  return (
    <section ref={ref} id="achievements" className={styles.section} aria-label="Achievements">
      <p className={styles.eyebrow} data-reveal>Certifications</p>
      <h2 className={styles.heading} data-reveal>Proof on paper.</h2>
      <div className={styles.grid}>
        {items.map((cert) => (
          <div key={`${cert.name}-${cert.year}`} className={styles.card} data-reveal>
            <p className={styles.year}>{cert.year}</p>
            <h3 className={styles.title}>{cert.title}</h3>
            <p className={styles.issuer}>{cert.issuer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

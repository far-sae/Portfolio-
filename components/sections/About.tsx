'use client';
import { useGsapReveal } from '@/components/hooks/useGsapReveal';
import profile from '@/data/profile.json';
import styles from './About.module.css';

const ROLES = ['Cybersecurity Engineer', 'AI Builder', 'Founder', 'Creative Technologist'];

export default function About() {
  const ref = useGsapReveal<HTMLElement>({ selector: '[data-reveal]', stagger: 0.08 });

  return (
    <section ref={ref} id="about" className={styles.section} aria-label="About">
      <p className={styles.eyebrow} data-reveal>About</p>
      <h2 className={styles.headline} data-reveal>
        {profile.summary}
      </h2>
      <div className={styles.chips} data-reveal>
        {ROLES.map((r) => (
          <span key={r} className={styles.chip}>{r}</span>
        ))}
      </div>
    </section>
  );
}

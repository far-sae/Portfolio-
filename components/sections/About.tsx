'use client';
import { useGsapReveal } from '@/components/hooks/useGsapReveal';
import profile from '@/data/profile.json';
import styles from './About.module.css';

const ROLES = ['cybersecurity engineer', 'ai builder', 'founder', 'creative technologist'];

export default function About() {
  // Single orchestrated reveal for the section under the fold.
  const ref = useGsapReveal<HTMLElement>({
    selector: '[data-reveal]',
    stagger: 0.1,
    y: 16,
    duration: 0.9,
  });

  return (
    <section ref={ref} id="about" className={styles.section} aria-label="About">
      <p className={styles.salutation} data-reveal>Hello — I&rsquo;m</p>

      <h1 className={styles.signature} data-reveal>
        <span>Faraz Saeed</span>
        <span>Khwaja.</span>
      </h1>

      <p className={styles.prose} data-reveal>
        {profile.summary}
      </p>

      <div className={styles.separator} data-reveal>* * *</div>

      <p className={styles.prose} data-reveal>
        I co-founded <strong>Securovix</strong> in London to ship AI-driven
        cybersecurity and digital products. Before that, I led data analytics,
        cloud security, and IT support for fast-moving teams. The throughline
        across all of it: take a slow human workflow and put a clean, secure
        machine behind it.
      </p>

      <div className={styles.tags} data-reveal aria-label="Disciplines">
        {ROLES.map((r) => (
          <span key={r} className={styles.tag}>{r}</span>
        ))}
      </div>

      <p className={styles.signoff} data-reveal>
        — Faraz, writing from {profile.location}. Reach me at{' '}
        <a href={`mailto:${profile.email}`}>{profile.email}</a>.
      </p>
    </section>
  );
}

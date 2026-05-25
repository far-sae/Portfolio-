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
  const items = skills.achievements as unknown as Achievement[];

  return (
    <section id="achievements" className={styles.section} aria-label="Certifications">
      <div>
        <h3 className={styles.label}>Certifications</h3>
        <div className={styles.sub}>{String(items.length).padStart(2, '0')} on record</div>
      </div>
      <ul className={styles.list}>
        {items.map((c) => (
          <li key={`${c.name}-${c.year}`} className={styles.item}>
            <span className={styles.year}>{c.year}</span>
            <span className={styles.name}>{c.title}</span>
            <span className={styles.issuer}>{c.issuer}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

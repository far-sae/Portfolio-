'use client';
import { useGsapReveal } from '@/components/hooks/useGsapReveal';
import skills from '@/data/skills.json';
import styles from './SkillsGrid.module.css';

type Item = { name: string; slug: string; color: string; level: string };
type Group = { label: string; items: Item[] };

// Deterministic FNV-1a hash so server and client compute identical
// drift timings — Math.random() during render breaks hydration.
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pillTiming(key: string): { animationDuration: string; animationDelay: string } {
  const seed = hash(key);
  const duration = 6 + ((seed % 401) / 100);
  const delay = ((seed >>> 8) % 601) / 100;
  return { animationDuration: `${duration}s`, animationDelay: `-${delay}s` };
}

export default function SkillsGrid() {
  const ref = useGsapReveal<HTMLElement>({ selector: '[data-reveal]', stagger: 0.05 });
  const groups = skills.groups as unknown as Group[];

  return (
    <section ref={ref} id="skills" className={styles.section} aria-label="Skills">
      <p className={styles.eyebrow} data-reveal>Skills</p>
      <h2 className={styles.heading} data-reveal>Tools I reach for.</h2>
      {groups.map((g) => (
        <div key={g.label} className={styles.group} data-reveal>
          <p className={styles.groupLabel}>{g.label}</p>
          <div className={styles.grid}>
            {g.items.map((it) => (
              <span
                key={it.slug}
                className={styles.pill}
                style={pillTiming(`${g.label}:${it.slug}`)}
              >
                {it.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

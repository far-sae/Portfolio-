'use client';
import { useMemo } from 'react';
import { useGsapReveal } from '@/components/hooks/useGsapReveal';
import skills from '@/data/skills.json';
import styles from './SkillsGrid.module.css';

type Item = { name: string; slug: string; color: string; level: string };
type Group = { label: string; items: Item[] };

export default function SkillsGrid() {
  const ref = useGsapReveal<HTMLElement>({ selector: '[data-reveal]', stagger: 0.05 });
  const groups = skills.groups as unknown as Group[];

  const pillDelays = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of groups) {
      for (const it of g.items) {
        const duration = 6 + Math.random() * 4;
        const delay = -Math.random() * 6;
        map.set(`${g.label}:${it.slug}`, `${duration}s -${Math.abs(delay)}s`);
      }
    }
    return map;
  }, [groups]);

  return (
    <section ref={ref} id="skills" className={styles.section} aria-label="Skills">
      <p className={styles.eyebrow} data-reveal>Skills</p>
      <h2 className={styles.heading} data-reveal>Tools I reach for.</h2>
      {groups.map((g) => (
        <div key={g.label} className={styles.group} data-reveal>
          <p className={styles.groupLabel}>{g.label}</p>
          <div className={styles.grid}>
            {g.items.map((it) => {
              const [duration, delay] = (pillDelays.get(`${g.label}:${it.slug}`) ?? '8s 0s').split(' ');
              return (
                <span
                  key={it.slug}
                  className={styles.pill}
                  style={{ animationDuration: duration, animationDelay: delay }}
                >
                  {it.name}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

'use client';
import type { CSSProperties } from 'react';
import skills from '@/data/skills.json';
import styles from './SkillsGrid.module.css';

type Item = { name: string; slug: string; color: string; level: string };
type Group = { label: string; items: Item[] };

export default function SkillsGrid() {
  const groups = skills.groups as unknown as Group[];

  return (
    <section id="skills" className={styles.section} aria-label="Tools and stack">
      <h2 className={styles.heading}>What I reach for.</h2>
      <p className={styles.lede}>
        Six families. Each name links nowhere — they&rsquo;re a typographic
        index of the stack, not a marketing wall.
      </p>

      {groups.map((g) => (
        <div key={g.label} className={styles.group}>
          <div className={styles.groupHead}>
            <span className={styles.groupLabel}>{g.label}</span>
            <span className={styles.groupCount}>
              {String(g.items.length).padStart(2, '0')} entries
            </span>
          </div>

          <div className={styles.row}>
            {g.items.map((it) => (
              <span
                key={it.slug}
                className={styles.specimen}
                style={{ '--brand': `#${it.color}` } as CSSProperties}
              >
                <span className={styles.specimenName}>{it.name}</span>
                <span className={styles.specimenMeta}>{it.level}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

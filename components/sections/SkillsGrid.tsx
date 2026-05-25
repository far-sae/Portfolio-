'use client';
import { useState, type CSSProperties } from 'react';
import { useGsapReveal } from '@/components/hooks/useGsapReveal';
import skills from '@/data/skills.json';
import styles from './SkillsGrid.module.css';

type Item = { name: string; slug: string; color: string; level: string };
type Group = { label: string; items: Item[] };

function SkillIcon({ slug, color, name }: { slug: string; color: string; name: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <span className={styles.iconFallback} aria-hidden>
        {name[0].toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.simpleicons.org/${slug}/${color}`}
      alt=""
      className={styles.icon}
      width={20}
      height={20}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}

export default function SkillsGrid() {
  const ref = useGsapReveal<HTMLElement>({ selector: '[data-reveal]', stagger: 0.06, x: 60 });
  const groups = skills.groups as unknown as Group[];

  return (
    <section ref={ref} id="skills" className={styles.section} aria-label="Skills">
      <p className={styles.eyebrow} data-reveal>Skills</p>
      <h2 className={styles.heading} data-reveal>Tools I reach for.</h2>

      {groups.map((g) => (
        <div key={g.label} className={styles.group} data-reveal>
          <div className={styles.groupHeader}>
            <span className={styles.groupLabel}>{g.label}</span>
            <span className={styles.groupCount}>{String(g.items.length).padStart(2, '0')}</span>
          </div>
          <div className={styles.grid}>
            {g.items.map((it) => (
              <div
                key={it.slug}
                className={styles.card}
                style={{ '--brand': `#${it.color}` } as CSSProperties}
              >
                <div className={styles.iconWrap}>
                  <SkillIcon slug={it.slug} color={it.color} name={it.name} />
                </div>
                <div className={styles.info}>
                  <p className={styles.name}>{it.name}</p>
                  <p className={styles.level}>{it.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

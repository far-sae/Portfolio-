'use client';
import { MouseEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import styles from './ProjectCard.module.css';

export type Project = {
  slug: string;
  name: string;
  url: string;
  tagline: string;
  category: string;
  stack: string[];
};

type Props = { project: Project };

export default function ProjectCard({ project }: Props) {
  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mx', `${x}%`);
    e.currentTarget.style.setProperty('--my', `${y}%`);
  };

  return (
    <a
      className={styles.card}
      href={project.url}
      target="_blank"
      rel="noreferrer"
      onMouseMove={onMove}
    >
      <p className={styles.eyebrow}>{project.category}</p>
      <h3 className={styles.name}>{project.name}</h3>
      <p className={styles.tagline}>{project.tagline}</p>
      <div className={styles.stack}>
        {project.stack.slice(0, 4).map((s) => (
          <span key={s} className={styles.pill}>{s}</span>
        ))}
      </div>
      <span className={styles.cta}>
        View on GitHub <ArrowUpRight />
      </span>
    </a>
  );
}

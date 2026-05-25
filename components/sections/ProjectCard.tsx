'use client';
import { ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import styles from './ProjectCard.module.css';

export type Project = {
  slug: string;
  name: string;
  url: string;
  tagline: string;
  category: string;
  stack: string[];
};

type Props = {
  project: Project;
  feature?: boolean;
};

export default function ProjectCard({ project, feature = false }: Props) {
  return (
    <a
      className={clsx(styles.card, feature && styles.feature)}
      href={project.url}
      target="_blank"
      rel="noreferrer"
    >
      <p className={styles.eyebrow}>{project.category}</p>
      <h3 className={styles.name}>{project.name}</h3>
      <p className={styles.tagline}>{project.tagline}</p>
      <div className={styles.stack}>
        {project.stack.slice(0, feature ? 5 : 4).map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      <span className={styles.cta}>
        View on GitHub <ArrowUpRight />
      </span>
    </a>
  );
}

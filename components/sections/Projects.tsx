'use client';
import { useGsapReveal } from '@/components/hooks/useGsapReveal';
import ProjectCard, { Project } from './ProjectCard';
import projects from '@/data/projects.json';
import styles from './Projects.module.css';

export default function Projects() {
  const ref = useGsapReveal<HTMLElement>({ selector: '[data-reveal]', stagger: 0.08, x: 90 });
  const items = projects.featured as Project[];

  return (
    <section ref={ref} id="projects" className={styles.section} aria-label="Projects">
      <p className={styles.eyebrow} data-reveal>Selected Work</p>
      <h2 className={styles.heading} data-reveal>Ten builds.</h2>
      <div className={styles.grid}>
        {items.map((p) => (
          <div key={p.slug} data-reveal>
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

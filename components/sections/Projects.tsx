import ProjectCard, { Project } from './ProjectCard';
import projects from '@/data/projects.json';
import styles from './Projects.module.css';

// Bento span plan per project slug. Featured project takes the wide cell;
// the rest mix span-2 and span-3 to break the uniform grid rhythm.
const SPANS: Record<string, string> = {
  aegisscan:                  styles.span4, // feature
  'real-time-threat-detection': styles.span2,
  'ai-security-analyst':      styles.span3,
  autonomus:                  styles.span3,
  'etl-financial':            styles.span2,
  'powerbi-executive':        styles.span2,
  'churn-ml':                 styles.span2,
  'it-support-automation':    styles.span3,
  'network-ids':              styles.span3,
  'crypto-vault':             styles.span6,
};

const FEATURE_SLUG = 'aegisscan';

export default function Projects() {
  const items = projects.featured as Project[];

  return (
    <section id="projects" className={styles.section} aria-label="Selected work">
      <h2 className={styles.heading}>
        Ten things I&rsquo;ve shipped.
      </h2>
      <p className={styles.lede}>
        Each one started with a slow human workflow and ended with a clean
        machine behind it. Pick any tile.
      </p>

      <div className={styles.grid}>
        {items.map((p) => (
          <div key={p.slug} className={SPANS[p.slug] ?? styles.span2}>
            <ProjectCard project={p} feature={p.slug === FEATURE_SLUG} />
          </div>
        ))}
      </div>
    </section>
  );
}

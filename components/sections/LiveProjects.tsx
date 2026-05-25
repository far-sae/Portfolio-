import { ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import styles from './LiveProjects.module.css';

type Site = {
  name: string;
  url: string;
  tagline: string;
};

const SITES: Site[] = [
  {
    name: 'Securovix',
    url: 'https://securovix.com',
    tagline:
      'AI-driven cybersecurity, automation, and digital growth — the company I co-founded and lead as CTO.',
  },
  {
    name: 'Cyber Hub',
    url: 'https://cyber-hub.uk',
    tagline:
      'My personal knowledge hub for cybersecurity research, write-ups, and tooling.',
  },
];

export default function LiveProjects() {
  return (
    <section id="live" className={styles.section} aria-label="Live sites">
      <h2 className={styles.heading}>Two live, right now.</h2>

      {SITES.map((site, i) => {
        const display = site.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const num = String(i + 1).padStart(2, '0');
        return (
          <div
            key={site.url}
            className={clsx(styles.diptych, i % 2 === 1 && styles.reverse)}
          >
            <div className={styles.preview}>
              <iframe
                className={styles.frame}
                src={site.url}
                loading="lazy"
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin"
                title={`${site.name} preview`}
                aria-hidden
              />
              <span className={styles.liveTag}>Live</span>
            </div>

            <div className={styles.text}>
              <p className={styles.indexLabel}>Site {num}</p>
              <h3 className={styles.name}>{site.name}</h3>
              <p className={styles.tagline}>{site.tagline}</p>
              <p className={styles.url}>{display}</p>
              <a
                className={styles.visit}
                href={site.url}
                target="_blank"
                rel="noreferrer"
              >
                Visit site <ArrowUpRight />
              </a>
            </div>
          </div>
        );
      })}
    </section>
  );
}

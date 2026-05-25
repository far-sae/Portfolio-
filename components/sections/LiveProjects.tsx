'use client';
import { ArrowUpRight } from 'lucide-react';
import { useGsapReveal } from '@/components/hooks/useGsapReveal';
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
    tagline: 'AI-driven cybersecurity, automation, and digital growth — the company I co-founded and lead as CTO.',
  },
  {
    name: 'Cyber Hub',
    url: 'https://cyber-hub.uk',
    tagline: 'My personal knowledge hub for cybersecurity research, write-ups, and tooling.',
  },
];

export default function LiveProjects() {
  const ref = useGsapReveal<HTMLElement>({ selector: '[data-reveal]', stagger: 0.1 });

  return (
    <section ref={ref} id="live" className={styles.section} aria-label="Live projects">
      <p className={styles.eyebrow} data-reveal>Live in production</p>
      <h2 className={styles.heading} data-reveal>Sites shipping right now.</h2>
      <div className={styles.grid}>
        {SITES.map((site) => {
          const display = site.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
          return (
            <a
              key={site.url}
              href={site.url}
              target="_blank"
              rel="noreferrer"
              className={styles.card}
              data-reveal
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
                <div className={styles.previewVeil} />
                <span className={styles.previewLabel}>Live</span>
              </div>
              <div className={styles.info}>
                <h3 className={styles.name}>{site.name}</h3>
                <p className={styles.tagline}>{site.tagline}</p>
                <p className={styles.url}>{display}</p>
                <span className={styles.cta}>
                  Visit site <ArrowUpRight />
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

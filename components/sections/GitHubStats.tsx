'use client';
import { Github } from 'lucide-react';
import { useGsapReveal } from '@/components/hooks/useGsapReveal';
import profile from '@/data/profile.json';
import styles from './GitHubStats.module.css';

const USERNAME = 'far-sae';
const COMMON =
  'theme=transparent&hide_border=true&bg_color=00000000' +
  '&title_color=ffffff&text_color=cccccc&icon_color=ff7b32';

const STATS_URL = `https://github-readme-stats.vercel.app/api?username=${USERNAME}&show_icons=true&${COMMON}`;
const LANGS_URL = `https://github-readme-stats.vercel.app/api/top-langs/?username=${USERNAME}&layout=compact&${COMMON}`;

export default function GitHubStats() {
  const ref = useGsapReveal<HTMLElement>({ selector: '[data-reveal]', stagger: 0.08 });

  return (
    <section ref={ref} id="github" className={styles.section} aria-label="GitHub activity">
      <p className={styles.eyebrow} data-reveal>Open source</p>
      <h2 className={styles.heading} data-reveal>Things I push.</h2>
      <div className={styles.grid}>
        <div className={styles.card} data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={STATS_URL} alt={`${USERNAME} GitHub stats`} loading="lazy" />
        </div>
        <div className={styles.card} data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LANGS_URL} alt={`${USERNAME} most-used languages`} loading="lazy" />
        </div>
      </div>
      <a className={styles.cta} href={profile.links.github} target="_blank" rel="noreferrer" data-reveal>
        <Github />
        @{USERNAME} on GitHub
      </a>
    </section>
  );
}

import { Mail, Github, Linkedin, Globe } from 'lucide-react';
import profile from '@/data/profile.json';
import styles from './ContactCTA.module.css';

export default function ContactCTA() {
  return (
    <section id="contact" className={styles.section} aria-label="Contact">
      <h2 className={styles.signoff}>
        If any of this is your kind of problem, write.
      </h2>

      <p className={styles.prose}>
        I&rsquo;m taking on a small number of new collaborations — security
        reviews, AI-driven product builds, and senior data-analytics work.
        Email is the fastest path:{' '}
        <a href={`mailto:${profile.email}`}>{profile.email}</a>.
      </p>

      <p className={styles.signature}>
        — Faraz
        <span>{profile.location}</span>
      </p>

      <div className={styles.row}>
        <a href={`mailto:${profile.email}`}>
          <Mail /> Email
        </a>
        <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
          <Linkedin /> LinkedIn
        </a>
        <a href={profile.links.github} target="_blank" rel="noreferrer">
          <Github /> GitHub
        </a>
        <a href={profile.links.company} target="_blank" rel="noreferrer">
          <Globe /> Securovix
        </a>
      </div>
    </section>
  );
}

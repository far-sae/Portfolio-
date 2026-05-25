'use client';
import { useEffect, useRef } from 'react';
import { Mail, Github, Linkedin, Globe } from 'lucide-react';
import { useGsapReveal } from '@/components/hooks/useGsapReveal';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';
import profile from '@/data/profile.json';
import styles from './ContactCTA.module.css';

export default function ContactCTA() {
  const reveal = useGsapReveal<HTMLElement>({ selector: '[data-reveal]', stagger: 0.08 });
  const orbRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const orb = orbRef.current;
    if (!orb) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let rafId = 0;
    let running = true;

    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 60;
      target.y = (e.clientY / window.innerHeight - 0.5) * 60;
    };

    const loop = () => {
      if (!running) return;
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      orb.style.transform = `translate(calc(-50% + ${current.x}px), calc(-50% + ${current.y}px))`;
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    loop();

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
    };
  }, [reduced]);

  return (
    <section ref={reveal} id="contact" className={styles.section} aria-label="Contact">
      <div ref={orbRef} className={styles.orb} aria-hidden />
      <p className={styles.eyebrow} data-reveal>Contact</p>
      <h2 className={styles.headline} data-reveal>Let&rsquo;s build something cinematic.</h2>
      <a className={styles.cta} href={`mailto:${profile.email}`} data-reveal>
        <Mail style={{ width: 16, height: 16 }} />
        {profile.email}
      </a>
      <div className={styles.socials} data-reveal>
        <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a>
        <a href={profile.links.github}   target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a>
        <a href={profile.links.company}  target="_blank" rel="noreferrer" aria-label="Securovix"><Globe /></a>
      </div>
    </section>
  );
}

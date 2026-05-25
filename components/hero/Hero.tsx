'use client';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Volume2, VolumeX } from 'lucide-react';
import VideoIntro from './VideoIntro';
import GlassButton from '@/components/ui/GlassButton';
import SoundBadge from '@/components/ui/SoundBadge';
import ScrollIndicator from '@/components/ui/ScrollIndicator';
import { useHeroAudio } from '@/components/hooks/useHeroAudio';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';
import { useHeroIntro } from './useHeroIntro';
import styles from './Hero.module.css';

const CinematicLayer = dynamic(() => import('@/components/three/CinematicLayer'), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { muted, acknowledged, toggleMute } = useHeroAudio(videoRef);
  const reduced = useReducedMotion();
  useHeroIntro(rootRef);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(root);

    return () => io.disconnect();
  }, [reduced]);

  return (
    <section ref={rootRef} className={styles.hero} aria-label="Intro">
      <VideoIntro ref={videoRef} src="/hero.mp4" poster="/hero-poster.jpg" />

      <CinematicLayer />

      <div className={styles.overlay} />

      <div className={styles.controls} data-hero="controls">
        <GlassButton label={muted ? 'Unmute video' : 'Mute video'} onClick={toggleMute}>
          {muted ? <VolumeX /> : <Volume2 />}
        </GlassButton>
      </div>

      <SoundBadge onClick={toggleMute} acknowledged={acknowledged} />
      <ScrollIndicator targetId="about" />
    </section>
  );
}

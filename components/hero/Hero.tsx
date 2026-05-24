'use client';
import { useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import VideoIntro from './VideoIntro';
import GlassButton from '@/components/ui/GlassButton';
import SoundBadge from '@/components/ui/SoundBadge';
import ScrollIndicator from '@/components/ui/ScrollIndicator';
import { useHeroAudio } from '@/components/hooks/useHeroAudio';
import styles from './Hero.module.css';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { muted, playing, acknowledged, toggleMute, togglePlay } = useHeroAudio(videoRef);

  return (
    <section className={styles.hero} aria-label="Intro">
      <VideoIntro ref={videoRef} src="/hero.mp4" poster="/hero-poster.jpg" />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <p className={styles.tagline} data-hero="tagline">
          CYBERSECURITY · AI · CREATOR
        </p>
        <h1 className={styles.name} data-hero="name">
          <span>FARAZ SAEED</span>
          <span>KHWAJA</span>
        </h1>
        <p className={styles.subtitle} data-hero="subtitle">
          Building cinematic digital experiences, intelligent AI systems, and next-generation cybersecurity platforms.
        </p>
      </div>

      <div className={styles.controls} data-hero="controls">
        <GlassButton label={playing ? 'Pause video' : 'Play video'} onClick={togglePlay}>
          {playing ? <Pause /> : <Play />}
        </GlassButton>
        <GlassButton label={muted ? 'Unmute video' : 'Mute video'} onClick={toggleMute}>
          {muted ? <VolumeX /> : <Volume2 />}
        </GlassButton>
      </div>

      <SoundBadge onClick={toggleMute} acknowledged={acknowledged} />
      <ScrollIndicator targetId="about" />
    </section>
  );
}

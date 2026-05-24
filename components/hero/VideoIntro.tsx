'use client';
import { forwardRef } from 'react';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';
import styles from './VideoIntro.module.css';

type Props = {
  src: string;
  poster?: string;
};

const VideoIntro = forwardRef<HTMLVideoElement, Props>(({ src, poster }, ref) => {
  const reduced = useReducedMotion();
  const playback = reduced
    ? { autoPlay: false, preload: 'none' as const }
    : { autoPlay: true,  preload: 'metadata' as const };

  return (
    <>
      {!reduced && (
        <video
          className={styles.ambient}
          src={src}
          poster={poster}
          {...playback}
          muted
          loop
          playsInline
          aria-hidden
        />
      )}
      <video
        ref={ref}
        className={styles.main}
        src={src}
        poster={poster}
        {...playback}
        muted
        loop
        playsInline
        aria-label="Faraz Saeed Khwaja — cinematic intro"
      />
    </>
  );
});

VideoIntro.displayName = 'VideoIntro';
export default VideoIntro;

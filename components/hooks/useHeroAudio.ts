'use client';
import { RefObject, useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'hero-audio-acknowledged';

export function useHeroAudio(videoRef: RefObject<HTMLVideoElement | null>) {
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setAcknowledged(sessionStorage.getItem(STORAGE_KEY) === '1');
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setMuted(next);
    if (!next && typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setAcknowledged(true);
    }
  }, [videoRef]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [videoRef]);

  return { muted, playing, acknowledged, toggleMute, togglePlay };
}

'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '@/components/hooks/useIsMobile';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';
import styles from './CinematicLayer.module.css';

function makeSoftCircleTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0,   'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
  gradient.addColorStop(1,   'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export default function CinematicLayer() {
  const mountRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = mountRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    renderer.setSize(parent.clientWidth, parent.clientHeight, false);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, parent.clientWidth / parent.clientHeight, 0.1, 100);
    camera.position.z = 8;

    const texture = makeSoftCircleTexture();

    const onResize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(parent);

    // One render so the canvas isn't blank before Task 17.
    renderer.render(scene, camera);

    return () => {
      ro.disconnect();
      texture.dispose();
      renderer.dispose();
    };
  }, [isMobile, reduced]);

  if (reduced) return null;

  return <canvas ref={mountRef} className={styles.canvas} aria-hidden />;
}

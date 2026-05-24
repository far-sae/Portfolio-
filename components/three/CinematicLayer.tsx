'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '@/components/hooks/useIsMobile';
import { useReducedMotion } from '@/components/hooks/useReducedMotion';
import styles from './CinematicLayer.module.css';

const ORANGE = new THREE.Color('#ff7b32');
const WARM_WHITE = new THREE.Color('#ffe9d6');
const BOX = { x: 16, y: 10, z: 6 };

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

function buildParticles(count: number, texture: THREE.Texture) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * BOX.x;
    positions[i3 + 1] = (Math.random() - 0.5) * BOX.y;
    positions[i3 + 2] = (Math.random() - 0.5) * BOX.z;

    const c = Math.random() < 0.7 ? ORANGE : WARM_WHITE;
    colors[i3]     = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;

    velocities[i3]     = (Math.random() - 0.5) * 0.0016;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.0016;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.0016;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.08,
    map: texture,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);

  return { points, geometry, material, velocities };
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
    const count = isMobile ? 400 : 1200;
    const { points, geometry, material, velocities } = buildParticles(count, texture);
    scene.add(points);

    const target = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(parent);

    let running = true;
    let rafId = 0;
    let inView = true;

    const onVisibility = () => {
      running = document.visibilityState === 'visible' && inView;
      if (running) loop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        running = document.visibilityState === 'visible' && inView;
        if (running) loop();
      },
      { threshold: 0 }
    );
    io.observe(parent);

    const tick = () => {
      const pos = geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        arr[i3]     += velocities[i3];
        arr[i3 + 1] += velocities[i3 + 1] + 0.0005;
        arr[i3 + 2] += velocities[i3 + 2];

        if (arr[i3 + 1] > BOX.y / 2) arr[i3 + 1] = -BOX.y / 2;
        if (arr[i3]     >  BOX.x / 2) arr[i3]     = -BOX.x / 2;
        if (arr[i3]     < -BOX.x / 2) arr[i3]     =  BOX.x / 2;
      }
      pos.needsUpdate = true;

      camera.position.x += (target.x * 0.25 - camera.position.x) * 0.05;
      camera.position.y += (target.y * 0.25 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    const loop = () => {
      if (!running) return;
      tick();
      rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
      ro.disconnect();
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [isMobile, reduced]);

  if (reduced) return null;

  return <canvas ref={mountRef} className={styles.canvas} aria-hidden />;
}

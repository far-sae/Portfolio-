'use client';

import { useEffect, useRef } from 'react';

type Blob = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  baseR: number;
};

export function Aurora({
  className,
  intensity = 1
}: {
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, has: false });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const blobs: Blob[] = [
      { x: w * 0.2, y: h * 0.3, vx: 0.15, vy: 0.1, r: 360, baseR: 360, color: 'rgba(255,255,255,0.18)' },
      { x: w * 0.8, y: h * 0.4, vx: -0.12, vy: 0.18, r: 300, baseR: 300, color: 'rgba(255,255,255,0.12)' },
      { x: w * 0.5, y: h * 0.8, vx: 0.2, vy: -0.14, r: 260, baseR: 260, color: 'rgba(255,255,255,0.08)' },
      { x: w * 0.6, y: h * 0.2, vx: -0.18, vy: 0.08, r: 220, baseR: 220, color: 'rgba(255,255,255,0.06)' }
    ];

    setSize();
    // re-position after sizing
    blobs.forEach((b, i) => {
      b.x = w * [0.2, 0.8, 0.5, 0.6][i];
      b.y = h * [0.3, 0.4, 0.8, 0.2][i];
    });

    const onResize = () => {
      setSize();
    };
    window.addEventListener('resize', onResize);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
      mouse.current.has = true;
    };
    window.addEventListener('mousemove', onMove);

    let t = 0;
    const draw = () => {
      t += 0.005;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      blobs.forEach((b, i) => {
        // gentle drift
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < 0 || b.x > w) b.vx *= -1;
        if (b.y < 0 || b.y > h) b.vy *= -1;

        // pulse radius with sine
        b.r = b.baseR + Math.sin(t * (1 + i * 0.3)) * 30;

        // gentle attraction toward mouse for closest blob
        if (mouse.current.has && i === 0) {
          const dx = mouse.current.x - b.x;
          const dy = mouse.current.y - b.y;
          b.x += dx * 0.012;
          b.y += dy * 0.012;
        }

        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, b.color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.globalAlpha = 0.6 * intensity;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
    };
  }, [intensity]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className ?? ''}`}
      style={{ filter: 'blur(60px)', opacity: 0.5 }}
    />
  );
}

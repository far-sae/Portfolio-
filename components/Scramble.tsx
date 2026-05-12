'use client';

import { useEffect, useRef, useState } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01<>/?#@$&';

export function Scramble({
  text,
  className,
  startDelay = 0,
  speed = 32
}: {
  text: string;
  className?: string;
  startDelay?: number;
  speed?: number;
}) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);

  useEffect(() => {
    let raf = 0;
    let started = false;
    let queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];

    const start = () => {
      const oldText = display;
      const length = Math.max(oldText.length, text.length);
      queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = text[i] || '';
        const s = Math.floor(Math.random() * 12);
        const e = s + Math.floor(Math.random() * 18) + 8;
        queue.push({ from, to, start: s, end: e });
      }
      frame.current = 0;
      step();
    };

    const step = () => {
      let output = '';
      let complete = 0;
      for (let i = 0; i < queue.length; i++) {
        const q = queue[i];
        if (frame.current >= q.end) {
          complete++;
          output += q.to;
        } else if (frame.current >= q.start) {
          if (!q.char || Math.random() < 0.28) {
            q.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
          output += q.char;
        } else {
          output += q.from;
        }
      }
      setDisplay(output);
      if (complete < queue.length) {
        frame.current++;
        raf = window.setTimeout(step, speed) as unknown as number;
      }
    };

    const id = window.setTimeout(() => {
      started = true;
      start();
    }, startDelay);

    return () => {
      window.clearTimeout(id);
      window.clearTimeout(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return <span className={className}>{display}</span>;
}

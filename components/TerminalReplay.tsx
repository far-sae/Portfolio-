'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type Line = {
  prompt?: string;
  text: string;
  color?: 'in' | 'ok' | 'warn' | 'err' | 'muted';
};

export function TerminalReplay({
  title = 'demo · live replay',
  lines,
  accent,
  speed = 18,
  loop = true
}: {
  title?: string;
  lines: Line[];
  accent: string;
  speed?: number;
  loop?: boolean;
}) {
  const [out, setOut] = useState<{ idx: number; text: string }[]>([]);
  const idxRef = useRef(0);
  const charRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const step = () => {
      const lineIdx = idxRef.current;
      if (lineIdx >= lines.length) {
        if (loop) {
          // pause then restart
          timerRef.current = window.setTimeout(() => {
            idxRef.current = 0;
            charRef.current = 0;
            setOut([]);
            step();
          }, 2200);
        }
        return;
      }
      const target = lines[lineIdx].text;
      const next = target.slice(0, charRef.current + 1);
      setOut((prev) => {
        const copy = [...prev];
        copy[lineIdx] = { idx: lineIdx, text: next };
        return copy;
      });
      charRef.current++;
      if (charRef.current >= target.length) {
        idxRef.current++;
        charRef.current = 0;
        timerRef.current = window.setTimeout(step, target.startsWith('>') ? 220 : 90);
      } else {
        timerRef.current = window.setTimeout(step, speed + Math.random() * 30);
      }
    };
    step();
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [lines, speed, loop]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-black/80 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]">
      {/* chrome */}
      <div className="flex items-center justify-between border-b border-line bg-black px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="mono text-[10px] uppercase tracking-[0.22em] text-muted">
          {title}
        </div>
        <div className="flex items-center gap-1.5">
          <motion.span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="mono text-[10px] uppercase tracking-[0.18em] text-muted">REC</span>
        </div>
      </div>

      {/* terminal body */}
      <div className="mono h-[260px] overflow-hidden bg-[#08080a] p-4 text-[12px] leading-relaxed sm:h-[320px] sm:p-5 sm:text-[13px]">
        {lines.map((l, i) => {
          const written = out[i]?.text ?? '';
          const isCurrent = i === idxRef.current && written.length > 0;
          const colorClass =
            l.color === 'ok'
              ? 'text-[#34d399]'
              : l.color === 'warn'
                ? 'text-[#f59e0b]'
                : l.color === 'err'
                  ? 'text-[#ef4444]'
                  : l.color === 'muted'
                    ? 'text-muted'
                    : 'text-ink/90';
          return (
            <div key={i} className="flex items-baseline">
              {l.prompt && (
                <span
                  className="mr-2 shrink-0"
                  style={{ color: l.color === 'in' ? accent : '#34d399' }}
                >
                  {l.prompt}
                </span>
              )}
              <span className={colorClass}>{written}</span>
              {isCurrent && (
                <motion.span
                  className="ml-0.5 inline-block h-3 w-1.5 align-baseline"
                  style={{ background: accent }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

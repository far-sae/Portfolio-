'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Github, Terminal, Code2, Globe } from 'lucide-react';
import { RepoCard } from './RepoCard';
import { TerminalReplay } from './TerminalReplay';
import { CodeSnippet } from './CodeSnippet';
import { LiveSiteCard } from './LiveSiteCard';

type Media =
  | { type: 'github'; repo: string }
  | { type: 'terminal'; title?: string; lines: { prompt?: string; text: string; color?: any }[] }
  | { type: 'code'; lang?: string; filename?: string; code: string }
  | { type: 'live'; url: string; title: string; subtitle?: string };

export function MediaGallery({
  media,
  accent
}: {
  media: Media[];
  accent: string;
}) {
  const [active, setActive] = useState(0);

  if (!media || media.length === 0) return null;
  const current = media[active];

  const labelFor = (m: Media) =>
    m.type === 'github'
      ? 'Repository'
      : m.type === 'terminal'
        ? 'Live replay'
        : m.type === 'code'
          ? 'Source'
          : 'Live site';

  const iconFor = (m: Media) =>
    m.type === 'github' ? (
      <Github className="h-3.5 w-3.5" />
    ) : m.type === 'terminal' ? (
      <Terminal className="h-3.5 w-3.5" />
    ) : m.type === 'code' ? (
      <Code2 className="h-3.5 w-3.5" />
    ) : (
      <Globe className="h-3.5 w-3.5" />
    );

  return (
    <div className="relative">
      {/* tabs */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {media.map((m, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              className={`mono inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-all ${
                active === i
                  ? 'border-ink bg-ink text-bg'
                  : 'border-line bg-surface/40 text-muted hover:border-muted hover:text-ink'
              }`}
              data-cursor="tab"
            >
              {iconFor(m)}
              {labelFor(m)}
            </motion.button>
          ))}
        </div>
        <div className="mono text-[10px] uppercase tracking-[0.22em] text-muted">
          {active + 1} / {media.length}
        </div>
      </div>

      {/* viewport */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {current.type === 'github' && (
              <RepoCard repo={current.repo} accent={accent} />
            )}
            {current.type === 'terminal' && (
              <TerminalReplay
                title={current.title}
                lines={current.lines}
                accent={accent}
              />
            )}
            {current.type === 'code' && (
              <CodeSnippet
                code={current.code}
                lang={current.lang}
                filename={current.filename}
                accent={accent}
              />
            )}
            {current.type === 'live' && (
              <LiveSiteCard
                url={current.url}
                title={current.title}
                subtitle={current.subtitle}
                accent={accent}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

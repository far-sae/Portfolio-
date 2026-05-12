'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const PALETTE: Record<string, string> = {
  kw: '#c084fc', // keywords
  fn: '#22d3ee', // functions
  str: '#fbbf24', // strings
  num: '#34d399', // numbers
  cm: '#6b7280', // comments
  op: '#94a3b8', // operators
  txt: '#e5e7eb'
};

function tokenize(line: string, lang: string) {
  // Tiny tokenizer just for visual flair
  const keywords: Record<string, string[]> = {
    python: [
      'def', 'class', 'return', 'import', 'from', 'as', 'if', 'else', 'elif',
      'for', 'while', 'with', 'async', 'await', 'try', 'except', 'in', 'is',
      'and', 'or', 'not', 'lambda', 'self', 'True', 'False', 'None', 'yield'
    ],
    typescript: [
      'const', 'let', 'var', 'function', 'class', 'return', 'import', 'from',
      'as', 'if', 'else', 'for', 'while', 'async', 'await', 'try', 'catch',
      'export', 'default', 'interface', 'type', 'extends', 'implements',
      'new', 'this', 'true', 'false', 'null', 'undefined', 'in', 'of'
    ],
    bash: ['if', 'then', 'else', 'fi', 'for', 'do', 'done', 'while', 'echo', 'set', 'export'],
    yaml: []
  };
  const kw = new Set(keywords[lang] || keywords.python);
  const tokens: { v: string; c: keyof typeof PALETTE }[] = [];

  // comments
  if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
    tokens.push({ v: line, c: 'cm' });
    return tokens;
  }

  // poor man's split keeping separators
  const re = /(\s+|"[^"]*"|'[^']*'|[a-zA-Z_][a-zA-Z0-9_]*|\d+\.?\d*|[^\s\w])/g;
  const matches = line.match(re) || [line];
  let nextIsFn = false;
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    if (m === '(' && tokens.length > 0 && tokens[tokens.length - 1].c === 'txt') {
      tokens[tokens.length - 1].c = 'fn';
    }
    if (/^\s+$/.test(m)) {
      tokens.push({ v: m, c: 'txt' });
    } else if (m.startsWith('"') || m.startsWith("'")) {
      tokens.push({ v: m, c: 'str' });
    } else if (kw.has(m)) {
      tokens.push({ v: m, c: 'kw' });
    } else if (/^\d/.test(m)) {
      tokens.push({ v: m, c: 'num' });
    } else if (/[a-zA-Z_]/.test(m[0])) {
      tokens.push({ v: m, c: 'txt' });
    } else {
      tokens.push({ v: m, c: 'op' });
    }
  }
  return tokens;
}

export function CodeSnippet({
  code,
  lang = 'python',
  filename = 'snippet.py',
  accent
}: {
  code: string;
  lang?: string;
  filename?: string;
  accent: string;
}) {
  const lines = code.split('\n');
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRevealed((r) => (r < lines.length ? r + 1 : r));
    }, 70);
    return () => clearInterval(id);
  }, [lines.length]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-black/80">
      <div className="flex items-center justify-between border-b border-line bg-black px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="mono text-[10px] uppercase tracking-[0.22em] text-muted">
          {filename}
        </div>
        <div
          className="mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color: accent }}
        >
          {lang}
        </div>
      </div>
      <div className="mono overflow-x-auto bg-[#08080a] p-5 text-[13px] leading-relaxed">
        {lines.map((line, i) => {
          const tokens = tokenize(line, lang);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={
                i < revealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }
              }
              transition={{ duration: 0.4 }}
              className="flex items-baseline"
            >
              <span className="mono mr-4 inline-block w-6 select-none text-right text-[10px] text-muted/50">
                {i + 1}
              </span>
              <code className="block">
                {tokens.length === 0 ? (
                  <span>&nbsp;</span>
                ) : (
                  tokens.map((t, j) => (
                    <span key={j} style={{ color: PALETTE[t.c] }}>
                      {t.v}
                    </span>
                  ))
                )}
              </code>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

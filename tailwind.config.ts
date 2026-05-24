import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050505',
        muted: 'rgba(255, 255, 255, 0.65)',
        orange: '#ff7b32',
        blueGlow: '#6ab7ff',
      },
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        macBar:    'rgba(15, 14, 22, 0.55)',
        macWindow: '#1e1e2e',
        vscBg:     '#1e1e1e',
        vscSidebar:'#252526',
        vscTabs:   '#2d2d30',
        vscText:   '#cccccc',
        vscMuted:  '#858585',
        vscAccent: '#007acc',
        dotRed:    '#ff5f57',
        dotYellow: '#febc2e',
        dotGreen:  '#28c840',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'ui-monospace', 'Menlo', 'Consolas', 'monospace'],
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

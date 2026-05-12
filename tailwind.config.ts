import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#06070b',
        surface: '#0d0f16',
        line: '#1a1d27',
        ink: '#e7e9ee',
        muted: '#8a8f9c',
        accent: '#7c5cff',
        accent2: '#22d3ee',
        warn: '#f59e0b',
        ok: '#34d399'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
        float: 'float 6s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;

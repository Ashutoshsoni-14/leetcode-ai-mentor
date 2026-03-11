/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        void: '#0a0a0f',
        'void-2': '#0f0f1a',
        'void-3': '#151525',
        panel: '#1a1a2e',
        border: '#2a2a45',
        'border-bright': '#3d3d6b',
        acid: '#00ff88',
        'acid-dim': '#00cc6a',
        plasma: '#7c3aed',
        'plasma-bright': '#a855f7',
        warn: '#f59e0b',
        danger: '#ef4444',
        muted: '#6b7280',
        bright: '#e2e8f0',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 8s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00ff8844' },
          '100%': { boxShadow: '0 0 20px #00ff8899, 0 0 40px #00ff8844' },
        },
        scan: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        }
      }
    },
  },
  plugins: [],
};

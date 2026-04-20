/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif:   ['"Instrument Serif"', 'Georgia', 'serif'],
        mono:    ['"DM Mono"', 'monospace'],
        sans:    ['"Geist"', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50:  '#FDFAF5',
          100: '#F7F2E8',
          200: '#EDE6D6',
          300: '#E0D8C4',
          400: '#C8BDA6',
          500: '#A89880',
        },
        clay: {
          DEFAULT: '#C4501A',
          light:   '#E8693A',
          faint:   '#FDF0EB',
          border:  '#F0C8B8',
        },
        ink: {
          DEFAULT: '#1A1714',
          2:       '#3D3830',
          3:       '#6B6358',
        },
        surface: {
          DEFAULT: '#FFFCF7',
          2:       '#F9F5EE',
          3:       '#F0EBE0',
        },
      },
      animation: {
        'fade-up':   'fadeUp .45s ease forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'spin-slow': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%':     { opacity: '.4', transform: 'scale(.8)' },
        },
      },
    },
  },
  plugins: [],
}

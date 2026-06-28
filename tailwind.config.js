/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  '#f4f7f4',
          100: '#e0eade',
          200: '#c2d5be',
          300: '#96ba96',
          400: '#091309',
          500: '#4a7c59',
          600: '#3a6347',
          700: '#2d5038',
          800: '#263f2e',
          900: '#1e3325',
        },
        cream: '#faf8f5',
        'warm-white': '#f5f2ed',
        parchment: '#f0ece4',
        stone: {
          50:  '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)',     'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)',  'Georgia',   'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft':    '0 2px 24px rgba(0,0,0,0.06)',
        'card':    '0 1px 3px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.07)',
        'hover':   '0 8px 32px rgba(74,124,89,0.14)',
        'product': '0 4px 20px rgba(0,0,0,0.08)',
        'glow':    '0 0 40px rgba(74,124,89,0.18)',
      },
      backgroundImage: {
        'hero-gradient':     'linear-gradient(135deg, #f4f7f4 0%, #faf8f5 50%, #f0ece4 100%)',
        'sage-gradient':     'linear-gradient(135deg, #4a7c59 0%, #2d5038 100%)',
        'card-gradient':     'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 100%)',
        'dark-gradient':     'linear-gradient(180deg, rgba(28,25,23,0) 0%, rgba(28,25,23,0.75) 100%)',
      },
      keyframes: {
        'fade-up':  { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in':  { from: { opacity: '0' }, to: { opacity: '1' } },
        'float':    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.55s cubic-bezier(.22,1,.36,1) both',
        'fade-in': 'fade-in 0.4s ease both',
        'float':   'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

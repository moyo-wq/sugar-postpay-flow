/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'purple-light': '#F0EFFA',
        'purple-card': '#9B86EA',
        'navy-dark': '#221A51',
        // Concierge dashboard palette (from sugar-concierge origin/main)
        sugar: {
          50: '#f6f2ff',
          100: '#ede5fe',
          200: '#dccffd',
          300: '#c3aef9',
          400: '#a890f0',
          500: '#9b85e9',
          600: '#7c63d6',
          700: '#6849bc',
          800: '#553c98',
          900: '#43317a'
        },
        candy: {
          50: '#fff1f6',
          100: '#ffe3ed',
          200: '#ffc8dc',
          300: '#ffa3c2',
          400: '#ff7aa6',
          500: '#f04d8a'
        }
      },
      boxShadow: {
        sugar: '0 14px 40px -18px rgba(155, 133, 233, 0.45)',
        'sugar-lg': '0 25px 60px -25px rgba(124, 99, 214, 0.45)'
      },
      backgroundImage: {
        'sugar-gradient':
          'linear-gradient(135deg, #9b85e9 0%, #b89cf0 50%, #f9a8d4 100%)',
        'sugar-soft':
          'linear-gradient(180deg, #faf7ff 0%, #fff5fa 60%, #ffffff 100%)'
      },
      fontFamily: {
        lexend: ['Lexend', 'sans-serif'],
        octarine: ['Octarine', 'sans-serif'],
        schibsted: ['Schibsted Grotesk', 'sans-serif'],
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 200ms ease-in',
      },
    },
  },
  plugins: [],
};

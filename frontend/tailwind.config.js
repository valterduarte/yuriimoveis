/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#af1e23',
          dark:    '#9c1c1f',
          light:   '#d42a30',
        },
        dark: {
          DEFAULT: '#1a1a1a',
          deep:    '#0a0a0a',
          card:    '#272727',
        },
        gray: {
          50:  '#f9f9f9',
          100: '#f0f0f0',
          200: '#e6e7e8',
          300: '#d7d7d7',
          400: '#b0b0b0',
          500: '#888888',
          600: '#666666',
          700: '#434343',
          800: '#2a2a2a',
          900: '#1a1a1a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.2em',
      },
    },
  },
  plugins: [],
}

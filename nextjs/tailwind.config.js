/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
    './utils/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#af1e23',
        // Lighter brand red for use ON dark backgrounds. The base #af1e23 only
        // reaches 2.51:1 over #1a1a1a (below WCAG); this tint hits 5.76:1 while
        // keeping the red identity. Use for the price and accents on dark.
        'primary-light': '#f4675f',
        dark: '#1a1a1a',
        // Canonical WhatsApp brand green — one token for every "Falar no
        // WhatsApp" button so the same action looks identical site-wide.
        whatsapp: '#25D366',
        'whatsapp-dark': '#1ebe5d',
        gray: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

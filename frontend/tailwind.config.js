/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#312e81',   // Deep Indigo
        secondary: '#0d9488', // Teal
        accent: '#f59e0b',    // Amber
        dark: {
          bg: '#020617',      // Slate 950
          text: '#f8fafc',
          card: '#0f172a'     // Slate 900
        }
      },
      keyframes: {
        textShimmer: {
          to: { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-12px)' },
        },
        pulseRing: {
          '0%':   { transform: 'scale(.95)', boxShadow: '0 0 0 0 rgba(49,46,129,.4)' },
          '70%':  { transform: 'scale(1)',   boxShadow: '0 0 0 16px rgba(49,46,129,0)' },
          '100%': { transform: 'scale(.95)', boxShadow: '0 0 0 0 rgba(49,46,129,0)' },
        },
      },
      animation: {
        'text-shimmer': 'textShimmer 4s linear infinite',
        'float':        'float 6s ease-in-out infinite',
        'pulse-ring':   'pulseRing 2.5s ease infinite',
      },
    },
  },
  plugins: [],
}


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
        primary: {
          DEFAULT: '#2563eb', // Futuristic Blue
          glow: '#3b82f6',
          dark: '#1e40af'
        },
        secondary: {
          DEFAULT: '#f97316', // Radiant Orange
          glow: '#fb923c',
          dark: '#c2410c'
        },
        dark: {
          bg: '#030712',      // Deep Space Black
          card: '#0f172a',    // Slate 900
          text: '#f8fafc',
          accent: '#1e293b'
        }
      },
      keyframes: {
        mesh: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        glow: {
          '0%, 100%': { opacity: 0.5, filter: 'blur(20px)' },
          '50%': { opacity: 1, filter: 'blur(40px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        'mesh': 'mesh 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
}


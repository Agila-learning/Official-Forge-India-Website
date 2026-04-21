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
        sans: ['Poppins', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: '#0A66C2',
        secondary: '#FFC107',
        accent: '#F3F4F6',
        dark: {
          bg: '#0F172A',
          text: '#FFFFFF',
          card: '#1E293B'
        }
      }
    },
  },
  plugins: [],
}

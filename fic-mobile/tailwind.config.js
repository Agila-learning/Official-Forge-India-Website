/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#eab308",
        'dark-bg': '#0f172a',
        'dark-card': '#1e293b'
      },
      fontFamily: {
        sans: ['Outfit_400Regular'],
        medium: ['Outfit_500Medium'],
        bold: ['Outfit_700Bold'],
        black: ['Outfit_900Black']
      }
    },
  },
  plugins: [],
}

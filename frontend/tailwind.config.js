/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deolinda: {
          green: {
            DEFAULT: '#22c55e',
            dark: '#16a34a',
            light: '#4ade80',
          },
          lime: {
            DEFAULT: '#84cc16',
            dark: '#a3e635',
          },
          bg: {
            light: '#ffffff',
            dark: '#0f172a',
          },
          card: {
            light: '#f8fafc',
            dark: '#1e293b',
          },
          border: {
            light: '#e2e8f0',
            dark: '#334155',
          }
        }
      }
    },
  },
  plugins: [],
}
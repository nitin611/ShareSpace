/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#000501',
        'united-nations-blue': '#3993dd',
        'burnt-sienna': '#ee6c4d',
        'dark-background': '#111111',
        'light-background': '#FFF8F0',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

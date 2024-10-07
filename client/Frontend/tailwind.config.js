/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#000501',  // Custom black color
        'united-nations-blue': '#3993dd',  // Custom blue color
        'burnt-sienna': '#ee6c4d',  // Custom burnt sienna color
        'dark-background': '#111111',  // Dark background color
        'light-background': '#FFF8F0',  // Light background color
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
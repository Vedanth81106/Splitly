/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#957FEF',
        'secondary': '#525252',
        'background': '#FFFCFF',
        'text-primary': '#1A1B41',
        'accent': '#F7567C',
        'success' : '#549F93'
      }
    },
  },
  plugins: [],
}
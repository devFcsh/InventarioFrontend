/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'skygray': '#9ca3af',  
        'darkgray': '#374151', 
        'bluebtn': '#005099',
        'bluebtnh': '#1e40af', 
      },
    },
  },
  plugins: [],
}

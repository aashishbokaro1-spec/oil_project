/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tailwind default colors are already available (slate, cyan, emerald, amber, rose)
      }
    },
  },
  plugins: [],
}

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // WAJIB: Agar Tailwind membaca semua file komponen Anda
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
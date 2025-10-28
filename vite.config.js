// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- PERUBAHAN KRUSIAL UNTUK GITHUB PAGES ---
  base: '/marketcreator-app/', 
})
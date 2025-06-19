import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    strictPort: false, // This allows Vite to try the next available port if 3001 is taken
    open: true // This will open the browser automatically
  }
})

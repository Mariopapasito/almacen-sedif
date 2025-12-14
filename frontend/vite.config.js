import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
    strictPort: true,
    hmr: false, // Desactiva HMR para evitar websockets rotos en dev tunnels
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5050',
        changeOrigin: true,
        rewrite: (path) => path,
      },
      '/uploads': {
        target: 'http://127.0.0.1:5050',
        changeOrigin: true,
        rewrite: (path) => path,
      }
    }
  }
})

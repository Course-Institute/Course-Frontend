import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 4001,
    proxy: {
      '/api': {
        target : process.env.NODE_ENV === 'production'
        ? 'https://mivpsa.in'
        : 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure : (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            console.log('Proxying request to: ', proxyReq.path)
          })
        }
      }
    }
  }
})

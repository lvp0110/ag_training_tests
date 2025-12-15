import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ag_training_tests/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://51.250.123.41:3005',
        changeOrigin: true,
        secure: false,
      },
      "/api/v2": {
        target: "http://localhost:3005",
        changeOrigin: true,
        secure: false,
      },
      '/answers': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/check': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/themas': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/thema': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

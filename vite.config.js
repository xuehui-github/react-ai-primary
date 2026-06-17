import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ficc': {
        target: 'http://localhost:10010',
        changeOrigin: true,
      },
    },
  },
})

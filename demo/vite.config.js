import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Collider-2031/',
  publicDir: 'public',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})


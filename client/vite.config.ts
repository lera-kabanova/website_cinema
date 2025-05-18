import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url' // Используем современный синтаксис

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)) // Современный способ задания алиасов
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5218'
    }
  }
})

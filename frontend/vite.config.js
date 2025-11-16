import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, 
  },
  preview: {
    allowedHosts: [
      'bank-project-full-2.onrender.com', 
      'localhost', 
      '127.0.0.1',
      'bank-project-full-1.onrender.com', 
    ],
  },
})

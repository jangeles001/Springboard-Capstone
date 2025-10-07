import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
     tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react()
  ],
  server:{
    proxy:{
      "/api": {
        target: "http://localhost:5000", // Change if localhost port changes
        changeOrigin: true,
        secure: false
      }
    }
  }
})

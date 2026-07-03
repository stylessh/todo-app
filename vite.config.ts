import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy auth requests to the Better Auth server so the browser talks to a
    // single origin (no CORS needed in dev).
    proxy: {
      '/api/auth': {
        target: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})

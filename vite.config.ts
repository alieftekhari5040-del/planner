import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Keep local development and Arena previews available without disabling
    // Vite's host-header protection for every hostname.
    allowedHosts: ['localhost', '127.0.0.1', '.e2b.app'],
  },
})

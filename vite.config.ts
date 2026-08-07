import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-192x192.png', 'pwa-512x512.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'برنامه‌ریز صعود | برنامه‌ریزی روزانه',
        short_name: 'برنامه‌ریز صعود',
        description: 'پلنر روزانه و ردیاب حرفه‌ای عادت‌های شخصی با تقویم شمسی - نصب‌پذیر و آفلاین',
        theme_color: '#7c3aed',
        background_color: '#060412',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone'],
        orientation: 'portrait',
        dir: 'rtl',
        lang: 'fa',
        start_url: '/',
        scope: '/',
        categories: ['productivity', 'lifestyle'],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: 'پلنر امروز',
            short_name: 'امروز',
            description: 'مشاهده برنامه امروز',
            url: '/?tab=planner',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'ردیاب عادت',
            short_name: 'عادت‌ها',
            description: 'ماتریس هفتگی عادت‌ها',
            url: '/?tab=habits',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ],
        // برای سایت شخصی روی لپ‌تاپ: آفلاین کامل
        navigateFallback: 'index.html',
        clientsClaim: true,
        skipWaiting: true
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
      }
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Keep local development and Arena previews available without disabling
    // Vite's host-header protection for every hostname.
    allowedHosts: ['localhost', '127.0.0.1', '.e2b.app'],
  },
  // بهینه‌سازی نهایی لپ‌تاپ: باندل سبک‌تر و لود تنبل — ظاهر بدون تغییر
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('lucide-react') || id.includes('canvas-confetti')) return 'vendor';
            return 'deps';
          }
          if (id.includes('src/components/habits')) return 'habits';
          if (id.includes('src/components/analytics')) return 'analytics';
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
  },
})

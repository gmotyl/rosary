import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa'
import {fileURLToPath} from 'node:url'

// Run tests east of UTC so local-date logic (toLocalDate, day boundaries)
// can't pass by accident on a UTC CI box. Set here, before the test workers
// spawn, so every worker starts with it.
if (process.env.VITEST) process.env.TZ = 'Europe/Warsaw'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'apple-touch-icon.png',
        'android-chrome-192x192.png',
        'android-chrome-512x512.png',
        'browserconfig.xml',
        'manifest.json',
        'site.webmanifest',
        'img/**/*',
      ],
      // We ship a static manifest at public/manifest.json; tell the plugin
      // not to generate its own, but include it in the precache below so the
      // PWA still works offline.
      manifest: false,
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,webp,woff,woff2,json,webmanifest,xml}',
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  resolve: {
    alias: {
      src: fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: false,
    clearMocks: true,
    restoreMocks: true,
  },
})

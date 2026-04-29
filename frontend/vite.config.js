import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://www.forgeindiaconnect.com',
      dynamicRoutes: [
        '/about',
        '/services',
        '/contact',
        '/training-placement',
        '/explore-jobs',
        '/home-services',
        '/explore-shop',
        '/faq',
        '/privacy',
        '/terms'
      ],
      generateRobotsFile: false
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

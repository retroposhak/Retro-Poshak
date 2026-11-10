import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://www.retroposhak.com', // Your live domain
      dynamicRoutes: [
        '/',
        '/shop',
        '/our-story',
        '/blog',
        '/contact',
        '/cart',
        '/wishlist',
        '/track-order',
      ],
      // You can add dynamic product/blog slugs here if you want them in the sitemap
      // dynamicRoutes: ['/', '/shop', '/shop/cycle-ka-safar', ...]
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      // So the client can call /api/* without CORS in dev
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
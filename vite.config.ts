import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "AeroPal - AeroPress Companion",
        short_name: "AeroPal",
        description:
          "Your perfect AeroPress brewing companion with guided recipes and timers",
        start_url: "/",
        display: "standalone",
        background_color: "#F8F5F0",
        theme_color: "#B8564F",
        orientation: "natural",
        scope: "/",
        lang: "en-US",
        categories: ["food", "lifestyle", "utilities"],
        icons: [
          {
            src: "/icons/72.png",
            sizes: "72x72",
            type: "image/png",
            purpose: "maskable any",
          },
          {
            src: "/icons/96.png",
            sizes: "96x96",
            type: "image/png",
            purpose: "maskable any",
          },
          {
            src: "/icons/128.png",
            sizes: "128x128",
            type: "image/png",
            purpose: "maskable any",
          },
          {
            src: "/icons/144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "maskable any",
          },
          {
            src: "/icons/152.png",
            sizes: "152x152",
            type: "image/png",
            purpose: "maskable any",
          },
          {
            src: "/icons/192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable any",
          },
          {
            src: "/icons/384.png",
            sizes: "384x384",
            type: "image/png",
            purpose: "maskable any",
          },
          {
            src: "/icons/512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable any",
          },
        ],
      },
      devOptions: {
        enabled: true, // Enable PWA in development mode
      },
    }),
  ],
  server: {
    host: true, // Allows external connections for mobile testing
    port: 3000,
  },
});

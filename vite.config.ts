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
              }
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
        theme_color: "#B8564F",
        background_color: "#F8F5F0",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable any",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable any",
          },
        ],
        shortcuts: [
          {
            name: "Classic Brew",
            short_name: "Classic",
            description: "Start a classic AeroPress brew",
            url: "/?recipe=classic",
            icons: [
              {
                src: "icons/classic-shortcut.png",
                sizes: "96x96",
              },
            ],
          },
          {
            name: "Strong Brew",
            short_name: "Strong",
            description: "Start a strong AeroPress brew",
            url: "/?recipe=strong",
            icons: [
              {
                src: "icons/strong-shortcut.png",
                sizes: "96x96",
              },
            ],
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

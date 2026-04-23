import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      injectRegister: "script",
      manifest: false,
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico,json}"],
      },
    }),
  ],
});
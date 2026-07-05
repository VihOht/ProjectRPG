
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import path from "path"
import { defineConfig, loadEnv } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import tsconfigPaths from "vite-tsconfig-paths"


// const isCloudflareBuild =
//   process.env.CF_PAGES === "1" ||
//   process.env.CLOUDFLARE_ENV ||
//   process.env.WORKERS_CI;

// https://vite.dev/config/
export default defineConfig( ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
  plugins: [
    cloudflareDevProxy(),
    tailwindcss(), 
    reactRouter(), 
    tsconfigPaths(), 
    VitePWA({
    devOptions: {
      enabled: true
    },
    registerType: "autoUpdate",
    includeAssets: ["icon_temporary.png"],
    manifest: {
      name: "Insônia",
      short_name: "Insônia",
      description: "Gerenciador de fichas de RPG",
      theme_color: "#000000",
      background_color: "#000000",
      display: "standalone",
      orientation: "portrait",
      start_url: "/",
      icons: [
        {
          src: "icon_temporary.png",
          sizes: "447x447",
          type: "image/png"
        }
      ]
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      runtimeCaching: [
        {
          urlPattern: new RegExp(`^${env.VITE_API_URL}/.*`),
          handler: "NetworkFirst",
          options: {
            cacheName: "api-cache",
            networkTimeoutSeconds: 3,

            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 60 * 60 * 24, // 1 day
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        }
      ]
    }}
  )
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app")
    },
  }
}})

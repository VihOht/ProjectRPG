import { reactRouter } from "@react-router/dev/vite"
import { cloudflare } from "@cloudflare/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import path from "path"
import { defineConfig, loadEnv } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig( ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
     build: {
    manifest: true,
  },
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "app",
      filename: "sw.ts",
      // React Router + Cloudflare build client assets here, while Vite's
      // generic default is dist. Keep the service worker in the deployed root.
      outDir: "build/client",
      registerType: "autoUpdate",
      injectRegister: false,
      manifest: false,
      injectManifest: {
        // Phase 1: compile and register the worker without intercepting requests.
        // Precache injection is enabled with the offline-first implementation.
        injectionPoint: undefined,
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
    cloudflare({
      viteEnvironment: {
        name: "ssr"
      }
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app")
    },
  }
};})

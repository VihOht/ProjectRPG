import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import path from "path"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), cloudflare({
    viteEnvironment: {
      name: "ssr"
    }
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app")
    },
  }
})
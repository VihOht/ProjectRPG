
import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import path from "path"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"


// const isCloudflareBuild =
//   process.env.CF_PAGES === "1" ||
//   process.env.CLOUDFLARE_ENV ||
//   process.env.WORKERS_CI;

// https://vite.dev/config/
export default defineConfig( () => {
  return {
  plugins: [
    tailwindcss(), 
    reactRouter(), 
    tsconfigPaths(), 
  ]
  ,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app")
    },
  }
}})

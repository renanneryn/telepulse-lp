import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

/**
 * O painel admin vive sob /admin no domínio (tlpulse.com/admin) servido pelo
 * próprio FastAPI do bot. base="/admin/" faz com que os asset URLs já saiam
 * prefixados no index.html. O dev server roda em /admin/ também e faz proxy
 * de /api -> localhost:8080 pra simular o mesmo same-origin de produção.
 */
export default defineConfig({
  plugins: [react()],
  base: "/admin/",
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Toda chamada a /admin/api/* vai pro bot local (que serve nesse mesmo path)
      "/admin/api": {
        target: "http://localhost:8080",
        changeOrigin: false,
      },
    },
  },
  build: {
    target: "es2022",
    outDir: "dist",
    sourcemap: false,
  },
});

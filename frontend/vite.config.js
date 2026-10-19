import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Requests to /api/* are forwarded to the FastAPI backend on port 8000
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});


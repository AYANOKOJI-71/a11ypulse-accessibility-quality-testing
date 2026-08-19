import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiProxyTarget = process.env.VITE_API_PROXY_TARGET ?? "http://127.0.0.1:4920";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5202,
    strictPort: true,
    allowedHosts: [".manus.computer"],
    proxy: {
      "/api": apiProxyTarget,
      "/health": apiProxyTarget
    }
  }
});

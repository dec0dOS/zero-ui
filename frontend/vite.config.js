import process from "node:process";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/app",
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      "/auth": "http://127.0.0.1:4000",
      "/api": "http://127.0.0.1:4000",
      "/controller": "http://127.0.0.1:4000",
    },
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), "../node_modules"],
    },
  },
  resolve: {
    alias: {
      components: "/src/components",
      utils: "/src/utils",
      external: "/src/external",
    },
  },
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 1000,
  },
  plugins: [react()],
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// import { join, parse, resolve } from "path";
// import * as url from "url";
// const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// function entryPoints(...paths) {
//   const entries = paths.map(parse).map((entry) => {
//     const { dir, base, name } = entry;
//     const key = join(dir, name);
//     const path = resolve(__dirname, dir, base);
//     return [key, path];
//   });

//   const config = Object.fromEntries(entries);
//   return config;
// }

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

import path from "node:path";
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    lib: {
      entry: "./main/main.ts",
      formats: ["cjs"],
      fileName: () => `main.cjs`,
    },
    rollupOptions: {
      external: ["better-sqlite3"],
    },
  },
  resolve: {
    alias: {
      "@main": path.resolve(import.meta.dirname, "main"),
      "@client": path.resolve(import.meta.dirname, "client"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
});

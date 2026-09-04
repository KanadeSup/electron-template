import path from "node:path";
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      "@main": path.resolve(__dirname, "main"),
      "@client": path.resolve(__dirname, "client"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
});

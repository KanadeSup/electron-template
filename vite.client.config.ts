import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@main": path.resolve(import.meta.dirname, "main"),
      "@client": path.resolve(import.meta.dirname, "client"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
});

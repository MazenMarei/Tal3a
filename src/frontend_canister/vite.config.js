import path from "node:path";
import { URL, fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";
import dotenv from "dotenv";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

dotenv.config({ path: "../../.env" });

export default defineConfig({
  base: "./",
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
  ],
  envDir: "../",
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
    ],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
    host: "127.0.0.1",
  },
});

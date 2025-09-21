import { fileURLToPath, URL } from "url";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import environment from "vite-plugin-environment";
import dotenv from "dotenv";
import tailwindcss from "@tailwindcss/vite";

dotenv.config({ path: "../../.env" });

export default defineConfig({
  build: {
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  define: {
    global: "globalThis",
    "process.env": {},
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true,
    },
    host: "0.0.0.0",
    port: 5174,
    https: false,
  },
  plugins: [
    react(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        find: "crypto",
        replacement: "crypto-browserify",
      },
      {
        find: "stream",
        replacement: "stream-browserify",
      },
      {
        find: "util",
        replacement: "util",
      },
    ],
    dedupe: ["@dfinity/agent"],
  },
});

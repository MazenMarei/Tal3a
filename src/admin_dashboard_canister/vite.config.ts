import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import environment from "vite-plugin-environment";
import { config } from "dotenv";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

config({ path: "../../.env" });

export default defineConfig({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    tailwindcss(),
    react(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@/components": resolve(__dirname, "./src/components"),
      "@/contexts": resolve(__dirname, "./src/contexts"),
      "@/routes": resolve(__dirname, "./src/routes"),
      "@/utils": resolve(__dirname, "./src/utils"),
      "@/types": resolve(__dirname, "./src/types"),
      "@/lib": resolve(__dirname, "./src/lib"),
      "@/hooks": resolve(__dirname, "./src/hooks"),
      declarations: resolve(__dirname, "../declarations"),
      crypto: "crypto-browserify",
      stream: "stream-browserify",
    },
    dedupe: ["@dfinity/agent"],
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  define: {
    global: "globalThis",
    "process.env": {},
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});

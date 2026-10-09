import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // Relative asset paths, so the built app also works when Electron
  // loads it from a file (file://.../index.html) instead of a web server.
  base: "./",
  server: {
    port: 5173,
    strictPort: true, // Electron expects the dev server on exactly this port
  },
});

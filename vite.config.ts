import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      // Ignore demo tooling artifacts and temp browser profiles so the
      // dev server never crashes watching files it does not care about.
      ignored: [
        "**/.chrome-tmp*/**",
        "**/.chrome-tmp*",
        "**/dom_*.txt",
        "**/*_log.txt",
        "**/install*.txt",
        "**/build*.txt",
        "**/node_modules/**",
      ],
    },
  },
});

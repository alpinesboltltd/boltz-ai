import { defineConfig } from "vite";
import { resolve } from "path";

/**
 * Vite configuration for building the Level-X Widget
 *
 * This builds the widget as a standalone IIFE bundle that can be
 * loaded via a script tag on external websites.
 *
 * Output: public/widget.js
 */
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/widget/index.ts"),
      name: "LevelXWidget",
      fileName: () => "widget.js",
      formats: ["iife"], // Self-executing bundle for script tag inclusion
    },
    outDir: "public",
    emptyOutDir: false, // Preserve other public assets
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for debugging
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        // Ensure clean IIFE wrapper
        extend: true,
      },
    },
    // Generate source maps for debugging
    sourcemap: false,
    // Target modern browsers
    target: "es2018",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});

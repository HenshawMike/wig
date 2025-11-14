import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  // Exclude problematic deps from Vite's dependency optimizer when needed.
  // If you still see errors referencing node_modules/.vite/deps/chunk-*.js, add
  // other package names here (for example: 'zod', '@hookform/resolvers').
  optimizeDeps: {
    exclude: [
      // lucide-react sometimes causes issues with the dep optimizer
      'lucide-react',
    ],
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

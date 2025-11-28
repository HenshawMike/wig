/// <reference types="vite/client" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Only load VITE_ prefixed environment variables
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    server: {
      host: "::",
      port: 8080,
      cors: true,
      proxy: {
        // Proxy API requests to Supabase
        '/storage/v1': {
          target: env.VITE_SUPABASE_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/storage\/v1/, '/storage/v1')
        },
        '/rest/v1': {
          target: env.VITE_SUPABASE_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/rest\/v1/, '/rest/v1')
        },
        '/auth/v1': {
          target: env.VITE_SUPABASE_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/auth\/v1/, '/auth/v1')
        },
      },
      headers: {
        'Access-Control-Allow-Origin': env.VITE_SUPABASE_URL || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization, Accept, Range',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
      },
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
  };
});

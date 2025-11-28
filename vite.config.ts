/// <reference types="vite/client" />
import { defineConfig, loadEnv, type UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  // Only load VITE_ prefixed environment variables
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  // Filter only the environment variables we want to expose to the client
  const clientSideEnv: Record<string, string> = {};
  Object.entries(env).forEach(([key, value]) => {
    if (key.startsWith('VITE_')) {
      clientSideEnv[`import.meta.env.${key}`] = JSON.stringify(value);
    }
  });

  return {
    // Environment variables exposed to the client
    define: {
      // Only expose VITE_ prefixed env variables
      ...clientSideEnv,
      // Prevent exposing process.env
      'process.env': {}
    },
    
    // Build configuration
    build: {
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
      // Generate source maps for production
      sourcemap: mode !== 'production',
      // Minify with esbuild
      minify: 'esbuild',
      // Enable gzip compression
      reportCompressedSize: true,
      // Optimize dependencies
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor and app code
            vendor: ['react', 'react-dom', 'react-router-dom'],
            // Split firebase into separate chunk
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            // Split supabase into separate chunk
            supabase: ['@supabase/supabase-js']
          }
        }
      }
    },
    
    server: {
      host: "::",
      port: 8080,
      cors: {
        origin: [
          env.VITE_APP_URL,
          env.VITE_SUPABASE_URL
        ].filter(Boolean),
        credentials: true
      },
      proxy: {
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

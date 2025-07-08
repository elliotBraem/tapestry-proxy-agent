import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_SHADE_AGENT_CONTRACT_ID': JSON.stringify(env.NEXT_PUBLIC_contractId),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        '/api': {
          // How can this be set from the params?
          // target: 'https://b03b31d299edcd4611f45a3ea6b691089d6546b2-3000.dstack-prod8.phala.network',
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      },
    },
  };
});

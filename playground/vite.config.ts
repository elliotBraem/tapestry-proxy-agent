import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');

  return {
    plugins: [tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }), react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_SHADE_AGENT_CONTRACT_ID': JSON.stringify(env.NEXT_PUBLIC_contractId),
      'import.meta.env.PUBLIC_NETWORK': JSON.stringify(env.PUBLIC_NETWORK),
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
          target: 'https://tapestry-proxy.opencrosspost.com/',
          // target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      },
    },
  };
});

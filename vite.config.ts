/// <reference types="vitest/config" />
import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { imagetools } from 'vite-imagetools';
import svgr from 'vite-plugin-svgr';

const DEFAULT_DEV_API_PROXY_TARGET = 'https://api-dev.university.neordinary.com';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiProxyTarget = env.VITE_DEV_API_PROXY_TARGET || DEFAULT_DEV_API_PROXY_TARGET;
  const proxyUsesHttps = apiProxyTarget.startsWith('https://');

  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: './src/routes',
        generatedRouteTree: './src/routes/routeTree.gen.ts',
        routeFileIgnorePattern: '\\.gen\\.ts$',
      }),
      react(),
      tailwindcss(),
      svgr(),
      imagetools(),
    ],
    resolve: {
      alias: { '@': path.resolve(import.meta.dirname, 'src') },
    },
    build: {
      sourcemap: false,
    },
    // 로컬 SSO 패키지가 상대경로 `/api`를 쓰므로 프록시만 추가. 도메인 API는 VITE_API_URL 유지.
    server: {
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: proxyUsesHttps,
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              const raw = proxyRes.headers['set-cookie'];
              if (!raw) return;
              const cookies = Array.isArray(raw) ? raw : [raw];
              proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
                cookie.replace(/;\s*Domain=[^;]*/gi, ''),
              );
            });
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './vitest.setup.ts',
    },
  };
});

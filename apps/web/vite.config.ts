import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Vite 配置：将 /api 请求代理到 NestJS 后端
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'pages/login/index.html'),
        dashboard: resolve(__dirname, 'pages/dashboard/index.html'),
        newProduct: resolve(__dirname, 'pages/new-product/index.html'),
        stockEntry: resolve(__dirname, 'pages/stock-entry/index.html'),
        stockExit: resolve(__dirname, 'pages/stock-exit/index.html'),
        history: resolve(__dirname, 'pages/history/index.html')
      }
    }
  }
});

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        painel: resolve(__dirname, 'painel.html'),
        novo_produto: resolve(__dirname, 'novo_produto.html'),
        entrada: resolve(__dirname, 'entrada.html'),
        saida: resolve(__dirname, 'saida.html'),
        historico: resolve(__dirname, 'historico.html')
      }
    }
  }
});

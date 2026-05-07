// vite.config.js — configuração do Vite para o projeto EduKids
import { defineConfig } from 'vite';          // importa função de config do Vite
import react from '@vitejs/plugin-react';      // plugin para suporte ao React/JSX

export default defineConfig({
  plugins: [react()],                          // ativa o plugin React
  server: {
    port: 3000,                                // porta do servidor de desenvolvimento
    proxy: {
      '/api': {                                // redireciona chamadas /api para o backend
        target: 'http://localhost:5000',       // endereço do backend Node.js
        changeOrigin: true,                    // ajusta o header Origin na requisição
      }
    }
  },
  build: {
    outDir: 'dist',                            // pasta de saída do build para produção
  }
});

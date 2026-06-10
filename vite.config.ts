import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [

    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },

    dedupe: ['react', 'react-dom'],
  },

  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug', 'console.trace'],
      },
    },
    sourcemap: false,
  },


  assetsInclude: ['**/*.svg', '**/*.csv'],

  server: {
    allowedHosts: ['.ngrok-free.dev'],
    proxy: {
      '/api': {
        target: 'http://localhost:7860',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
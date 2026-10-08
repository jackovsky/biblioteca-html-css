import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// "npm run dev"   -> abre a página de demonstração
// "npm run build" -> gera a biblioteca em dist/ (JS + CSS)
export default defineConfig(({ mode }) => {
  if (mode !== 'lib') {
    return { plugins: [react()] }
  }

  return {
    plugins: [react()],
    build: {
      lib: {
        entry: resolve(import.meta.dirname, 'src/lib/index.js'),
        formats: ['es'],
        fileName: () => 'carregamento-neon.js',
        cssFileName: 'carregamento-neon',
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
      },
    },
  }
})

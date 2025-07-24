import { defineConfig } from 'vite'

export default defineConfig({
  root: 'example',
  base: process.env.NODE_ENV === 'production' ? '/codemirror-textlint/' : '/',
  build: {
    outDir: '../dist-example',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: process.env.NODE_ENV === 'production' ? {
      '../src/index.ts': '../dist/index.js'
    } : {}
  },
  define: {
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'global': 'globalThis'
  },
  optimizeDeps: {
    include: ['@textlint/kernel', '@textlint/types']
  },
  ssr: {
    noExternal: ['@textlint/kernel', '@textlint/types']
  }
})
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../js', // Output the bundled JS file to the plugin's `js/` folder
    emptyOutDir: true,
    manifest: true, // Enable manifest.json generation
    rollupOptions: {
      output: {
        entryFileNames: 'app.bundle.js',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
})

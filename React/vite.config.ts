import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Load env files based on mode (.env, .env.local, .env.[mode], .env.[mode].local)
  const env = loadEnv(mode, process.cwd())
  
  return {
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    manifest: true, // Enable manifest.json generation
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].js',
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
  define: {
    // Expose environment variables to the client (prefix with VITE_ to expose)
    'import.meta.env.VITE_API_ENDPOINT': JSON.stringify(env.VITE_API_ENDPOINT || ''),
  },
  }
})

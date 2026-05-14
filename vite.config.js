import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const ignoredWatchPaths = [
  '**/.git/**',
  '**/node_modules/**',
  '**/dist/**',
  '**/docs/**',
  '**/screenshots/**',
  '**/supabase/**',
  '**/*.log',
  '**/*.doc',
  '**/*.docx',
  '**/~$*',
  '**/chloro_*backup.sql',
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    hmr: {
      timeout: 10000,
      overlay: true,
    },
    watch: {
      ignored: ignoredWatchPaths,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 50,
      },
    },
    proxy: {
      '/api/khalti': {
        target: 'https://a.khalti.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/khalti/, '')
      }
    }
  }
})

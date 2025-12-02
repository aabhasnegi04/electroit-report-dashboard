import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    __API_BASE__: JSON.stringify(process.env.VITE_API_BASE || ''),
  },
  build: {
    // For production builds, the API calls will use the domain-based detection
    // in ReportRunner.jsx to automatically route to the correct backend
  },
})

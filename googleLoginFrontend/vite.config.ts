import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,          // Port where Vite will serve the app
    open: '/login', 
    proxy: {
      '/auth': 'http://localhost:3000',
    },
  },
})

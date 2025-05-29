import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from "url";
import dotenv from 'dotenv'

// Load environment variables
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
      "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "@types": fileURLToPath(new URL("./src/types", import.meta.url)),
      "@data": fileURLToPath(new URL("./src/data", import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://sun-proposal-cat-nature.trycloudflare.com/api',  // La URL de tu backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),  // Opcional: si tu backend no usa /api como prefijo
      },
    },
    // Option 1: If you want to specify the host/interface to bind to
    host: process.env.VITE_FRONTEND_URL || 'localhost',
    
    // Option 2: If you want to allow access from any host (be careful with this in production)
    // host: '0.0.0.0',
    
    // Option 3: If you want to specify the port
    // port: 3000,
  },
});
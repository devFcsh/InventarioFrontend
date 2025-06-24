import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from "url";
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
      "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "@types": fileURLToPath(new URL("./src/types", import.meta.url)),
      "@data": fileURLToPath(new URL("./src/data", import.meta.url)),
      "@context": fileURLToPath(new URL("./src/context", import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0', // Permitir acceso externo
    port: 5173,
    // Eliminar proxy ya que usas URLs completas
  },
});
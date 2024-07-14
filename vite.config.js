import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      'https://blog-2-server.vercel.app/api': {
        target: 'https://blog-2-server.vercel.app',
        changeOrigin: true,
        secure: true,
        logLevel: 'debug'
      },
    },
  },
})

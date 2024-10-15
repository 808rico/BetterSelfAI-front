import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permet d'écouter sur toutes les interfaces réseau
    port: 5173,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/privatekey.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/certificate.pem')),
    }
    // Le port utilisé pour le serveur de développement
  }
})

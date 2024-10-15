import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: process.env.NODE_ENV === 'development' ? {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/privatekey.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/certificate.pem')),
    } : false // Pas de HTTPS en production
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // Aggiorna l'app automaticamente quando rilasci nuovo codice
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'maskable-icon.png'],
      manifest: {
        name: 'EnoCost - COGS Vitivinicolo',
        short_name: 'EnoCost',
        description: 'Applicazione professionale per il calcolo del costo industriale del vino',
        theme_color: '#7f1d1d', // Rosso bordeaux coerente con l'header
        background_color: '#f3f4f6', // Grigio chiaro per il background dell'app
        display: 'standalone', // Nasconde la barra del browser per sembrare un'app nativa
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'maskable-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable' // Ottimale per le icone adattive di Android
          }
        ]
      }
    })
  ],
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Minhas Dívidas',
        short_name: 'Dívidas',
        description: 'Gerenciador Financeiro Avançado',
        theme_color: '#0f172a', /* Cor do topo do app no celular */
        background_color: '#0f172a',
        display: 'standalone', /* Faz sumir a barra do navegador! */
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3135/3135679.png', /* Ícone genérico de carteira, você pode trocar depois */
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
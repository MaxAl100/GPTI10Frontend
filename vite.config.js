import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/GPTI10Frontend/',
  server: {
    proxy: {
      '/ticketimg': {
        target: 'https://ticketing-uploads-1.ticketplus.global',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ticketimg/, ''),
      },
    },
  },
})

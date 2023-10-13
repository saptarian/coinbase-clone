import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      $: "/src",
      root: "/src",
      lib: "/src/lib",
      app: "/src/app",
    },
  },
})

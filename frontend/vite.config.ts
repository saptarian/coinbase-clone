import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src/', import.meta.url)),
        'app': fileURLToPath(new URL('./src/app/', import.meta.url)),
        'envConfig': fileURLToPath(new URL(`./src/configs/${mode}.ts`, import.meta.url)),
      },
    },
    server: {
      host: true,
    },
  }
})

import { resolve } from 'node:path'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  build: {
    // Two pages: the Walima invitation (/) and the wedding reception (/wedding-invitation/).
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        reception: resolve(import.meta.dirname, 'wedding-invitation/index.html'),
      },
    },
  },
})

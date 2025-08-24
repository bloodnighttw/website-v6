import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import rpress from '../../packages/rpress/dist/vite'
// import inspect from "vite-plugin-inspect";

export default defineConfig({
  plugins: [
    react(),
    rpress()
  ] 
})

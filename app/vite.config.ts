// noinspection JSUnusedGlobalSymbols

import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import viteCompression from 'vite-plugin-compression';
import vitePluginFaviconsInject from 'vite-plugin-favicons-inject';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    viteCompression({filter: /\.(js)$/}),
    vitePluginFaviconsInject('./src/images/logo.svg')
  ]
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import eslintPlugin from 'vite-plugin-eslint'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  publicDir: './public',
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
    alias: [{ find: '@', replacement: resolve('./src') }]
  },
  plugins: [vue(), eslintPlugin(), WindiCSS()],
  server: {
    port: 4566
  }
})

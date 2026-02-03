import { fileURLToPath, URL } from 'node:url'
import { copyFileSync } from 'node:fs'
import { join } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// Плагин для создания 404.html для GitHub Pages
function githubPages404() {
  return {
    name: 'github-pages-404',
    closeBundle() {
      const outDir = join(process.cwd(), 'dist')
      const indexPath = join(outDir, 'index.html')
      const notFoundPath = join(outDir, '404.html')

      try {
        // Копируем index.html в 404.html
        copyFileSync(indexPath, notFoundPath)
        console.log('✓ Создан 404.html для GitHub Pages')
      } catch (error) {
        console.error('Ошибка при создании 404.html:', error)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/starter-pack/': '/',
  plugins: [
    vue(),
    githubPages404(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/head',
        '@vueuse/core',
      ],
      dts: './auto-imports.d.ts',
      vueTemplate: true
    }),
    Components({
      dirs: ['src/**/components'],
      extensions: ['vue'],
      deep: true,
      dts: './components.d.ts',
      include: [/\.vue$/, /\.vue\?vue/],
      resolvers: [
        IconsResolver({
          // prefix: false,
        }),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
    ViteImageOptimizer({
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false, // https://github.com/svg/svgo/issues/1128
              },
              cleanupIDs: {
                minify: false,
                remove: false,
              },
              convertPathData: false,
            },
          },
          'sortAttrs',
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
            },
          },
        ],
      },
      png: {
        quality: 90,
      },
      jpeg: {
        quality: 90,
      },
      jpg: {
        quality: 90,
      },
      webp: {
        lossless: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/mixins.scss" as *;`,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    open: true, // Автоматически открывать браузер
    cors: true, // Разрешаем CORS для работы с VPN
  },
})

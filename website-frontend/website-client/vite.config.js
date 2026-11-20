import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { viteSourceZipPlugin } from './scripts/viteSourceZipPlugin.mjs'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, '')
  const publicBase = env.VITE_PUBLIC_URL || '/'
  const devApiTarget =
    env.VITE_DEV_API_TARGET?.trim() ||
    env.VITE_API_BASE_URL?.trim() ||
    'http://localhost:8080'
  const numberingSetupTarget = env.VITE_NUMBERING_SETUP_TARGET?.trim()

  /** @type {Record<string, import('vite').ProxyOptions>} */
  const proxy = {}

  if (numberingSetupTarget) {
    proxy['/api/v1/numbering-setup'] = {
      target: numberingSetupTarget,
      changeOrigin: true,
    }
  }

  proxy['/api'] = {
    target: devApiTarget,
    changeOrigin: true,
  }

  return {
    base: publicBase.endsWith('/') ? publicBase : `${publicBase}/`,
    plugins: [
      react({
        exclude: [/\/node_modules\//],
      }),
      viteSourceZipPlugin(),
    ],
    optimizeDeps: {
      include: ['lucide-react', 'react-toastify'],
    },
    resolve: {
      alias: {
        '@': path.resolve(projectRoot, 'src'),
        '@app': path.resolve(projectRoot, 'src/app'),
        '@domain': path.resolve(projectRoot, 'src/domain'),
        '@shared': path.resolve(projectRoot, 'src/shared'),
        '@/components': path.resolve(projectRoot, 'src/shared/components'),
      },
    },
    server: {
      port: Number(env.VITE_DEV_PORT) || 5173,
      strictPort: false,
      proxy: {
        '/api': {
          target: devApiTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/exceljs')) {
              return 'exceljs'
            }
            if (id.includes('node_modules/jspdf')) {
              return 'jspdf'
            }
            if (
              id.includes('node_modules/recharts') ||
              id.includes('node_modules/chart.js') ||
              id.includes('node_modules/react-chartjs-2')
            ) {
              return 'charts'
            }
            if (id.includes('node_modules/@mui/') || id.includes('node_modules/@emotion/')) {
              return 'mui'
            }
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
              return 'react-vendor'
            }
            if (
              id.includes('node_modules/@reduxjs/') ||
              id.includes('node_modules/react-redux') ||
              id.includes('node_modules/redux')
            ) {
              return 'redux'
            }
          },
        },
      },
    },
    test: {
      environment: 'node',
      globals: false,
      include: ['src/**/*.test.{js,jsx}', 'scripts/**/*.test.js'],
      environmentMatchGlobs: [['src/**/*.test.{js,jsx}', 'happy-dom']],
      setupFiles: ['./src/test/setup.js'],
    },
  }
})

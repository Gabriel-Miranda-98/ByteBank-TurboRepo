import { defineConfig, loadEnv } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { federation } from '@module-federation/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  const isProduction = mode === 'production'
  const menuUrl = isProduction
    ? env.VITE_MENU_MFE_URL || 'https://bytebank-menu.netlify.app'
    : 'http://localhost:3002'

  return {
    base: isProduction ? env.VITE_AUTH_BASE_URL || '/' : 'http://localhost:3001',
    plugins: [
      tanstackRouter({
        target: 'react',
        routesDirectory: './src/routes',
        generatedRouteTree: './src/routeTree.gen.ts',
        routeFileIgnorePrefix: '-',
        quoteStyle: 'single',
        semicolons: false,
        autoCodeSplitting: true,
        enableRouteTreeFormatting: true,
      }),
      viteReact(),
      tailwindcss(),
      federation({
        name: 'mfe-auth',
        filename: 'remoteEntry.js',
        manifest: true,
        exposes: {
          './useAuth': './src/hooks/useAuth.ts',
        },
        remotes: {
          dashboard: {
            type: 'module',
            name: 'dashboard',
            entry: `${menuUrl}/remoteEntry.js`,
          },
        },
        shared: {
          react: {
            requiredVersion: '^18.3.1',
            singleton: true,
          },
          'react-dom': {
            requiredVersion: '^18.3.1',
            singleton: true,
          },
          '@tanstack/react-query': {
            requiredVersion: '^5.84.1',
            singleton: true,
          },
          '@tanstack/react-router': {
            requiredVersion: '^1.130.2',
            singleton: true,
          },
        },
      }),
    ],
    server: {
      port: 3001,
      origin: 'http://localhost:3001',
      cors: true,
      strictPort: true,
    },
    preview: {
      port: 3001,
      strictPort: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
      build: {
      target: 'esnext',
      minify: false,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
        },
        plugins: [
          {
            name: 'lowercase-filenames',
            generateBundle(_options, bundle) {
              // Cast bundle to Record<string, any> to avoid index type errors
              const bundleRecord = bundle as Record<string, any>
              // Criar um mapa dos nomes antigos para os novos
              const renamedFiles: Record<string, string> = {}
              
              // Primeiro, coletar todos os nomes que precisam ser alterados
              for (const fileName in bundleRecord) {
                const newFileName = fileName.toLowerCase()
                if (fileName !== newFileName) {
                  renamedFiles[fileName] = newFileName
                }
              }
              
              // Renomear os arquivos no bundle
              for (const [oldName, newName] of Object.entries(renamedFiles)) {
                bundleRecord[newName] = bundleRecord[oldName]
                bundleRecord[newName].fileName = newName
                delete bundleRecord[oldName]
              }
              
              // Atualizar referências nos arquivos
              for (const file of Object.values(bundleRecord)) {
                if (file.type === 'chunk' && file.code) {
                  let updatedCode = file.code
                  for (const [oldName, newName] of Object.entries(renamedFiles)) {
                    updatedCode = updatedCode.replace(new RegExp(oldName, 'g'), newName)
                  }
                  file.code = updatedCode
                }
              }
            }
          }
        ]
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  }
})

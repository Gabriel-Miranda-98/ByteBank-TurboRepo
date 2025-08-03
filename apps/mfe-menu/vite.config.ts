import { defineConfig, loadEnv } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  const isProduction = mode === 'production'
  const authUrl = isProduction
    ? env.VITE_AUTH_MFE_URL
    : 'http://localhost:3001'

  return {
    base: isProduction ? env.VITE_MENU_BASE_URL || '/' : 'http://localhost:3002',
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
        name: 'mfe-menu',
        filename: 'remoteEntry.js',
        manifest: true,
        exposes: {
          './dashboard': './src/AppRouter.tsx',
        },
        remotes: {
          auth: {
            type: 'module',
            name: 'auth',
            entry: `${authUrl}/remoteEntry.js`,
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
          '@tanstack/react-router': {
            requiredVersion: '^1.130.2',
            singleton: true,
          },
          '@tanstack/react-query': {
            requiredVersion: '^5.66.5',
            singleton: true,
          },
        },
      }),
    ],
    server: {
      port: 3002,
      strictPort: true,
    },
    preview: {
      port: 3002,
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
                
                // Atualizar referências no index.html
                if (file.type === 'asset' && file.fileName === 'index.html' && typeof file.source === 'string') {
                  let updatedHtml = file.source
                  for (const [oldName, newName] of Object.entries(renamedFiles)) {
                    // Atualizar href e src attributes
                    updatedHtml = updatedHtml.replace(
                      new RegExp(`(href|src)="[^"]*${oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
                      (match: string): string => match.replace(oldName, newName)
                    )
                  }
                  file.source = updatedHtml
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
# 🚀 Deploy ByteBank - Guia Rápido

## ✅ Status: PRONTO PARA DEPLOY

### 📦 O que foi configurado:

1. **✅ Configurações do Vite**
   - Module Federation configurado para produção
   - URLs dinâmicas baseadas em environment variables
   - CORS configurado para produção

2. **✅ Environment Variables System**
   - Pacote @bytebank/env atualizado
   - Suporte a URLs dos microfrontends
   - Validação com Zod

3. **✅ Dockerfiles**
   - Multi-stage builds otimizados
   - Nginx configurado com CORS
   - Scripts de substituição dinâmica de envs

4. **✅ Netlify Configuration**
   - netlify.toml para cada app
   - Headers CORS corretos
   - Redirects para SPA routing
   - Cache otimizado

5. **✅ Build Scripts**
   - Scripts específicos para Netlify
   - Build testado e funcionando

## 🎯 PRÓXIMOS PASSOS NO NETLIFY:

### 1️⃣ Deploy do MFE-Auth

1. **Netlify Dashboard** → "New site from Git"
2. **Site Settings:**
   ```
   Site name: bytebank-auth
   Base directory: apps/mfe-auth
   Build command: pnpm install && pnpm build:netlify
   Publish directory: apps/mfe-auth/dist
   ```

3. **Environment Variables:**
   ```
   NODE_ENV=production
   VITE_AUTH_BASE_URL=/
   VITE_MENU_MFE_URL=https://bytebank-menu.netlify.app
   VITE_SUPABASE_URL=https://hsaxnladdipftthqhing.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzYXhubGFkZGlwZnR0aHFoaW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTcwNDksImV4cCI6MjA2OTczMzA0OX0.jey96m7tJI1L3RLSctw3epUfJxQoDQHQdV0t1pjPY2g
   VITE_APP_NAME=ByteBank
   VITE_APP_VERSION=1.0.0
   ```

### 2️⃣ Deploy do MFE-Menu

1. **Netlify Dashboard** → "New site from Git" (mesmo repo)
2. **Site Settings:**
   ```
   Site name: bytebank-menu
   Base directory: apps/mfe-menu
   Build command: pnpm install && pnpm build:netlify
   Publish directory: apps/mfe-menu/dist
   ```

3. **Environment Variables:**
   ```
   NODE_ENV=production
   VITE_MENU_BASE_URL=/
   VITE_AUTH_MFE_URL=https://bytebank-auth.netlify.app
   VITE_SUPABASE_URL=https://hsaxnladdipftthqhing.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzYXhubGFkZGlwZnR0aHFoaW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTcwNDksImV4cCI6MjA2OTczMzA0OX0.jey96m7tJI1L3RLSctw3epUfJxQoDQHQdV0t1pjPY2g
   VITE_APP_NAME=ByteBank
   VITE_APP_VERSION=1.0.0
   ```

### 3️⃣ Ajuste Final das URLs
Após ambos os deploys, atualize as variáveis com as URLs reais:
- No **bytebank-auth**: `VITE_MENU_MFE_URL=https://sua-url-menu-real.netlify.app`
- No **bytebank-menu**: `VITE_AUTH_MFE_URL=https://sua-url-auth-real.netlify.app`

## 🔍 Verificação Pós-Deploy:

- [ ] `https://sua-url/remoteEntry.js` acessível
- [ ] Console sem erros de CORS
- [ ] Module Federation funcionando
- [ ] Navegação entre rotas OK
- [ ] Conexão com Supabase OK

## 📞 Suporte:

- 📖 Documentação completa: `DEPLOY.md`
- 🐳 Deploy alternativo: Docker (configurado)
- 🔧 Troubleshooting: Ver seção no DEPLOY.md

---
**✨ Projeto pronto para produção!**

# Deploy do ByteBank TurboRepo no Netlify

Este guia explica como fazer o deploy dos micro front-ends no Netlify.

## 📋 Pré-requisitos

- Conta no Netlify
- Repositório no GitHub/GitLab
- Node.js 20+
- pnpm 10.4.1+

## 🚀 Configuração de Deploy

### 1. Deploy do MFE-Auth

1. **Conectar repositório no Netlify**
   - Acesse o dashboard do Netlify
   - Clique em "New site from Git"
   - Conecte seu repositório

2. **Configurar Build Settings**
   ```
   Base directory: apps/mfe-auth
   Build command: pnpm install && pnpm build:netlify
   Publish directory: apps/mfe-auth/dist
   ```

3. **Configurar Environment Variables**
   ```
   NODE_ENV=production
   VITE_AUTH_BASE_URL=/
   VITE_MENU_MFE_URL=https://bytebank-menu.netlify.app
   # Supabase Configuration (obrigatórias)
   VITE_SUPABASE_URL=https://hsaxnladdipftthqhing.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzYXhubGFkZGlwZnR0aHFoaW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTcwNDksImV4cCI6MjA2OTczMzA0OX0.jey96m7tJI1L3RLSctw3epUfJxQoDQHQdV0t1pjPY2g
   # App Configuration (opcionais)
   VITE_APP_NAME=ByteBank
   VITE_APP_VERSION=1.0.0
   VITE_APP_TITLE=ByteBank - Auth
   ```

4. **Site name sugerido**: `bytebank-auth`

### 2. Deploy do MFE-Menu

1. **Criar novo site no Netlify**
   - Conecte o mesmo repositório
   - Configure com os settings abaixo

2. **Configurar Build Settings**
   ```
   Base directory: apps/mfe-menu
   Build command: pnpm install && pnpm build:netlify
   Publish directory: apps/mfe-menu/dist
   ```

3. **Configurar Environment Variables**
   ```
   NODE_ENV=production
   VITE_MENU_BASE_URL=/
   VITE_AUTH_MFE_URL=https://bytebank-auth.netlify.app
   # Supabase Configuration (obrigatórias) 
   VITE_SUPABASE_URL=https://hsaxnladdipftthqhing.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzYXhubGFkZGlwZnR0aHFoaW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTcwNDksImV4cCI6MjA2OTczMzA0OX0.jey96m7tJI1L3RLSctw3epUfJxQoDQHQdV0t1pjPY2g
   # App Configuration (opcionais)
   VITE_APP_NAME=ByteBank
   VITE_APP_VERSION=1.0.0
   ```

4. **Site name sugerido**: `bytebank-menu` ou `bytebank-dashboard`

## 🔧 Configuração de CORS

Os arquivos `netlify.toml` já estão configurados com:
- Headers CORS apropriados para Module Federation
- Cache otimizado para `remoteEntry.js`
- Redirecionamentos para SPA routing

## ⚙️ Otimizações para Netlify

O projeto está otimizado para o Netlify com:
- **Nomes de arquivos em minúsculas** para compatibilidade
- **Minificação habilitada** para produção
- **Chunks otimizados** para carregamento rápido
- **Assets versionados** com hash para cache busting

## 🐳 Deploy via Docker (Alternativo)

### Build das imagens
```bash
# Build mfe-auth
docker build -f apps/mfe-auth/Dockerfile -t bytebank-auth .

# Build mfe-menu
docker build -f apps/mfe-menu/Dockerfile -t bytebank-menu .
```

### Run local
```bash
# Run mfe-auth
docker run -p 8080:80 \
  -e VITE_MENU_MFE_URL=http://localhost:8081 \
  -e VITE_SUPABASE_URL=https://hsaxnladdipftthqhing.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzYXhubGFkZGlwZnR0aHFoaW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTcwNDksImV4cCI6MjA2OTczMzA0OX0.jey96m7tJI1L3RLSctw3epUfJxQoDQHQdV0t1pjPY2g \
  bytebank-auth

# Run mfe-menu
docker run -p 8081:80 \
  -e VITE_AUTH_MFE_URL=http://localhost:8080 \
  -e VITE_SUPABASE_URL=https://hsaxnladdipftthqhing.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzYXhubGFkZGlwZnR0aHFoaW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTcwNDksImV4cCI6MjA2OTczMzA0OX0.jey96m7tJI1L3RLSctw3epUfJxQoDQHQdV0t1pjPY2g \
  bytebank-menu
```

## 🔄 Ordem de Deploy

1. **Primeiro**: Deploy do `mfe-auth` 
2. **Segundo**: Atualize as variáveis do `mfe-menu` com a URL real do auth
3. **Terceiro**: Deploy do `mfe-menu`
4. **Quarto**: Atualize as variáveis do `mfe-auth` com a URL real do menu

## 🚨 Pontos Importantes

- ⚠️ **Module Federation requer HTTPS em produção**
- 🔗 **URLs dos remotes devem ser atualizadas após deploy**
- 🎯 **remoteEntry.js não deve ser cacheado**
- 🔐 **CORS deve estar habilitado entre domínios**
- 🔑 **Variáveis do Supabase são obrigatórias para funcionamento**
- 🛡️ **VITE_SUPABASE_ANON_KEY é seguro expor (chave anônima pública)**

## 🔒 Segurança das Environment Variables

### Variáveis Seguras para Exposição (VITE_*)
```bash
VITE_SUPABASE_URL=https://...        # ✅ Seguro
VITE_SUPABASE_ANON_KEY=eyJ...        # ✅ Seguro (chave anônima)
VITE_AUTH_MFE_URL=https://...        # ✅ Seguro
VITE_MENU_MFE_URL=https://...        # ✅ Seguro
VITE_APP_NAME=ByteBank               # ✅ Seguro
```

### ⚠️ NUNCA expor no frontend:
- Service Role Keys do Supabase
- Secrets de API de terceiros
- Chaves privadas ou tokens de acesso

O Vite automaticamente inclui apenas variáveis com prefixo `VITE_` no bundle final.

## 📊 Monitoramento

Verifique se:
- [ ] remoteEntry.js está acessível
- [ ] Headers CORS estão corretos
- [ ] Console não apresenta erros de Module Federation
- [ ] Navegação entre rotas funciona

## 🐛 Troubleshooting

### Erro de CORS
- Verifique se os headers estão configurados no `netlify.toml`
- Confirme se as URLs dos remotes estão corretas

### Module Federation não carrega
- Verifique se o `remoteEntry.js` está acessível
- Confirme se as versões das dependências compartilhadas são compatíveis

### 404 em rotas
- Confirme se os redirects estão configurados no `netlify.toml`

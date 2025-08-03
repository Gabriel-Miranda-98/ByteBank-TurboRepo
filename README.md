# ByteBank TurboRepo

Monorepo com micro front-ends do ByteBank usando Module Federation, TanStack Router e shadcn/ui.

## 🏗️ Arquitetura

Este projeto utiliza uma arquitetura de micro front-ends com:

- **mfe-auth** (porta 3001): Micro front-end responsável pela autenticação
- **mfe-menu** (porta 3002): Micro front-end do dashboard principal
- **packages/ui**: Biblioteca compartilhada de componentes UI
- **packages/env**: Configuração de ambiente compartilhada

## 🚀 Desenvolvimento

### Pré-requisitos
- Node.js 20+
- pnpm 10.4.1+

### Instalação e execução
```bash
# Instalar dependências
pnpm install

# Executar em modo desenvolvimento
pnpm dev

# Build de produção
pnpm build
```

### URLs de desenvolvimento
- **mfe-auth**: http://localhost:3001
- **mfe-menu**: http://localhost:3002

## 📦 Deploy

Para deploy no Netlify, consulte o arquivo [`DEPLOY.md`](./DEPLOY.md) com instruções detalhadas.

### Deploy rápido
1. Configure dois sites no Netlify
2. Configure as variáveis de ambiente
3. Deploy na ordem: auth → menu → atualizar URLs

## 🔧 Tecnologias

- **Build System**: Turbo + pnpm
- **Frontend**: React 18 + TypeScript
- **Bundler**: Vite
- **Roteamento**: TanStack Router
- **Micro Front-ends**: Module Federation
- **UI Components**: shadcn/ui + Tailwind CSS
- **Deploy**: Netlify + Docker (opcional)

## 📁 Estrutura

```
apps/
├── mfe-auth/          # Micro front-end de autenticação
├── mfe-menu/          # Micro front-end do dashboard
packages/
├── ui/                # Componentes UI compartilhados
├── env/               # Configuração de ambiente
├── eslint-config/     # Configuração ESLint
└── typescript-config/ # Configuração TypeScript
```

# Multi-stage build for mfe-menu
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY tsconfig.json ./

# Copy packages
COPY packages/ ./packages/

# Copy mfe-menu app
COPY apps/mfe-menu/ ./apps/mfe-menu/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
WORKDIR /app

# Set environment variables for production
ENV NODE_ENV=production
ENV VITE_MENU_BASE_URL=/
ENV VITE_AUTH_REMOTE_URL=https://bytebank-auth.netlify.app/remoteEntry.js

# Build the application
RUN pnpm --filter=mfe-menu build

# Production stage
FROM nginx:alpine AS production

# Copy custom nginx config
COPY apps/mfe-menu/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/apps/mfe-menu/dist /usr/share/nginx/html

# Add environment substitution script
RUN apk add --no-cache gettext

# Create entrypoint script
COPY apps/mfe-menu/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

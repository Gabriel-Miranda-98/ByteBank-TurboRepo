# Multi-stage build for mfe-auth
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

# Copy mfe-auth app
COPY apps/mfe-auth/ ./apps/mfe-auth/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
WORKDIR /app

# Set environment variables for production
ENV NODE_ENV=production
ENV VITE_AUTH_BASE_URL=/
ENV VITE_DASHBOARD_REMOTE_URL=https://bytebank-dashboard.netlify.app/remoteEntry.js

# Build the application
RUN pnpm --filter=mfe-auth build

# Production stage
FROM nginx:alpine AS production

# Copy custom nginx config
COPY apps/mfe-auth/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/apps/mfe-auth/dist /usr/share/nginx/html

# Add environment substitution script
RUN apk add --no-cache gettext

# Create entrypoint script
COPY apps/mfe-auth/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

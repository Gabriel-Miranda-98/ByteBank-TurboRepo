#!/bin/sh

# Replace environment variables in JavaScript files
echo "Replacing environment variables..."

# Find all JS files and replace environment variables
find /usr/share/nginx/html -name "*.js" -type f -exec sed -i \
  -e "s|VITE_MENU_BASE_URL_PLACEHOLDER|${VITE_MENU_BASE_URL:-/}|g" \
  -e "s|VITE_AUTH_REMOTE_URL_PLACEHOLDER|${VITE_AUTH_REMOTE_URL:-https://bytebank-auth.netlify.app/remoteEntry.js}|g" \
  {} \;

echo "Environment variables replaced successfully"

# Start nginx
exec "$@"

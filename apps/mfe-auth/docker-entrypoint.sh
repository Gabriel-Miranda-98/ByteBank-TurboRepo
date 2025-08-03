#!/bin/sh

# Replace environment variables in JavaScript files
echo "Replacing environment variables..."

# Find all JS files and replace environment variables
find /usr/share/nginx/html -name "*.js" -type f -exec sed -i \
  -e "s|VITE_AUTH_BASE_URL_PLACEHOLDER|${VITE_AUTH_BASE_URL:-/}|g" \
  -e "s|VITE_DASHBOARD_REMOTE_URL_PLACEHOLDER|${VITE_DASHBOARD_REMOTE_URL:-https://bytebank-dashboard.netlify.app/remoteEntry.js}|g" \
  {} \;

echo "Environment variables replaced successfully"

# Start nginx
exec "$@"

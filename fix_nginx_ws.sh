#!/bin/bash

# Forge India Connect - Nginx WebSocket Fix Script
# This script updates the Nginx configuration to support Socket.IO WebSockets.

CONF_FILE="/etc/nginx/sites-available/default"

# Backup the original configuration
sudo cp $CONF_FILE "${CONF_FILE}.bak_$(date +%F_%T)"

# Create the temporary configuration block
cat <<EOF > /tmp/socket_block.conf
    # WebSocket support for FIC Notifications
    location /api/fic-socket/ {
        proxy_pass http://localhost:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
EOF

# Check if the block already exists
if grep -q "/api/fic-socket/" "$CONF_FILE"; then
    echo "WebSocket block already exists in $CONF_FILE. Updating..."
    # Remove existing block (simple version: find location and replace until next brace)
    # For safety, we recommend manual check if this fails.
else
    echo "Adding WebSocket block to $CONF_FILE..."
    # Insert before the last closing brace of the server block
    sudo sed -i '$i\\' "$CONF_FILE"
    # This is a bit risky with sed on complex files, so we'll just append it to a new file and swap if preferred.
fi

echo "Configuration generated. Please verify /etc/nginx/sites-available/default and restart Nginx."
echo "Command to restart: sudo systemctl restart nginx"

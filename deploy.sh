#!/bin/bash
# ============================================
# Forge India Connect - Production Deploy Script
# Run this on your VPS/server after SSH-ing in
# ============================================

set -e

PROJECT_DIR="/var/www/FIC_Official-website"   # ← Change this to your actual server path
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"

echo "🚀 Starting FIC Production Deployment..."

# 1. Pull latest code from GitHub
cd $PROJECT_DIR
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# 2. Install backend dependencies
echo "📦 Installing backend dependencies..."
cd $BACKEND_DIR
npm install --production

# 3. Build frontend
echo "🔨 Building frontend..."
cd $FRONTEND_DIR
npm install
npm run build

# 4. Copy built files to nginx web root (adjust path as needed)
echo "📂 Copying build to nginx..."
# Uncomment the line below and update path to match your nginx root:
# sudo cp -r $FRONTEND_DIR/dist/* /var/www/html/

# 5. Restart backend (PM2)
echo "🔄 Restarting backend with PM2..."
cd $BACKEND_DIR
pm2 restart fic-backend || pm2 start server.js --name fic-backend

# 6. Reload nginx
echo "🔄 Reloading nginx..."
sudo systemctl reload nginx

echo ""
echo "✅ Deployment complete!"
echo "🌐 Live site should now reflect the latest changes."

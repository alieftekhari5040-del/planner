#!/bin/bash
# ============================================================
# 🚀 Planner Auto-Start - Vite PWA - Ubuntu systemd
# یک بار اجرا: chmod +x scripts/setup-autostart.sh && ./scripts/setup-autostart.sh
# ============================================================
set -e
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
echo -e "${CYAN}📁 Planner: $PROJECT_DIR${NC}"

# Build first (برای PWA)
if [ ! -f "dist/index.html" ] || [ ! -f "dist/sw.js" ]; then
  echo -e "${YELLOW}🔨 بیلد PWA...${NC}"
  npm run build
fi

# Service setup
SERVICE_NAME="planner"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
CURRENT_USER=$(whoami)

echo -e "${YELLOW}🔧 ساخت سرویس $SERVICE_FILE ...${NC}"
sudo tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=برنامه‌ریز صعود - Auto Start on Boot
After=network.target network-online.target
Wants=network-online.target

[Service]
Type=simple
User=$CURRENT_USER
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/npm run preview -- --host 0.0.0.0 --port 4173
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=4173
StandardOutput=journal
StandardError=journal
SyslogIdentifier=$SERVICE_NAME

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now "${SERVICE_NAME}.service"
sleep 2
echo -e "${GREEN}✅ Planner خودکار شد! http://localhost:4173${NC}"
sudo systemctl status "${SERVICE_NAME}.service" --no-pager -l | head -n 20

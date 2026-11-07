#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

echo "🐉 Dragon Bot | Termux launcher"
echo "The phone number is used only for WhatsApp linked-device pairing."
read -r -p "WhatsApp number with country code (digits only, e.g. 267...): " PAIRING_PHONE
if [[ ! "$PAIRING_PHONE" =~ ^[0-9]{8,15}$ ]]; then
  echo "Invalid number. Include country code and digits only."
  exit 1
fi
export PAIRING_PHONE

read -r -p "Creator number (Enter to use the pairing number): " BOT_OWNER_NUMBERS
export BOT_OWNER_NUMBERS="${BOT_OWNER_NUMBERS:-$PAIRING_PHONE}"
export BOT_PREFIX="${BOT_PREFIX:-_}"
export AUTH_DIR="${AUTH_DIR:-./auth}"
export DB_PATH="${DB_PATH:-./data/database.json}"

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting Dragon Bot. Keep Termux open."
npm start

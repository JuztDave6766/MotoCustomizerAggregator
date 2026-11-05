#!/usr/bin/env bash
# Avvia MotoLab in locale. Uso: ./avvia.sh [porta]
set -e
cd "$(dirname "$0")"
PORT="${1:-8000}"
echo "MotoLab: http://localhost:${PORT}"
exec python3 server.py "${PORT}"

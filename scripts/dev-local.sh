#!/usr/bin/env zsh

set -euo pipefail

echo "[dev-local] Limpiando puertos 5050 y 5174..."
lsof -ti:5050,5174 | xargs kill -9 2>/dev/null || true
sleep 1

BACKEND_DIR="/Users/mac/Desktop/almacen-sedif-main-2/backend"
FRONTEND_DIR="/Users/mac/Desktop/almacen-sedif-main-2/frontend"

echo "[dev-local] Iniciando backend en 5050..."
pushd "$BACKEND_DIR" >/dev/null
PORT=5050 node server.js &
BACK_PID=$!
popd >/dev/null

echo "[dev-local] Backend PID: $BACK_PID"
echo "[dev-local] Esperando 2s a que levante..."
sleep 2

echo "[dev-local] Probando API de backend..."
STATUS=$(curl -s -o /tmp/dev_local_items.json -w "%{http_code}" http://localhost:5050/api/items || echo "000")
if [[ "$STATUS" != "200" ]]; then
  echo "[dev-local] Advertencia: API respondió HTTP $STATUS. Revisa logs del backend."
else
  echo "[dev-local] API OK (200)."
fi

echo "[dev-local] Iniciando frontend (Vite dev con proxy) en 5174..."
pushd "$FRONTEND_DIR" >/dev/null
rm -f .env 2>/dev/null || true
npm run dev -- --host --port 5174
FRONT_EXIT=$?
popd >/dev/null

echo "[dev-local] Terminando backend (PID $BACK_PID)..."
kill -9 "$BACK_PID" 2>/dev/null || true

exit "$FRONT_EXIT"

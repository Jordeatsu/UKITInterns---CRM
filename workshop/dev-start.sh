#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$SCRIPT_DIR"
LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$LOG_DIR"
SERVER_LOG="$LOG_DIR/server.log"
CLIENT_LOG="$LOG_DIR/client.log"

# ── Colours & helpers ─────────────────────────────────────────────────────────
BOLD=$'\033[1m'; DIM=$'\033[2m'; RESET=$'\033[0m'
GREEN=$'\033[92m'; BLUE=$'\033[94m'; CYAN=$'\033[96m'

hr()      { printf "${BLUE}  ────────────────────────────────────────────────${RESET}\n"; }
step()    { printf "\n  ${CYAN}→${RESET}  ${BOLD}%s${RESET}\n" "$1"; }
ok()      { printf "  ${GREEN}✓${RESET}  %s\n" "$1"; }
urlrow()  { printf "    ${DIM}%-6s${RESET}  ${BOLD}${CYAN}%s${RESET}\n" "$1" "$2"; }
inforow() { printf "    ${DIM}%-6s${RESET}  ${DIM}%s${RESET}\n" "$1" "$2"; }

# ── OS detection ─────────────────────────────────────────────────────────────
detect_os() {
    case "$(uname -s 2>/dev/null)" in
        Darwin*)              echo "mac"     ;;
        Linux*)               echo "linux"   ;;
        MINGW*|MSYS*|CYGWIN*) echo "windows" ;;
        *)                    echo "unix"    ;;
    esac
}

open_browser() {
    local url="$1"
    case "$OS" in
        mac)     open "$url" ;;
        linux)   xdg-open "$url" 2>/dev/null || sensible-browser "$url" 2>/dev/null || true ;;
        windows) cmd.exe /c start "$url" 2>/dev/null || true ;;
        *)       xdg-open "$url" 2>/dev/null || true ;;
    esac
}

OS=$(detect_os)

# ── Kill any process bound to a TCP port ─────────────────────────────────────
kill_port() {
    local port="$1"
    if [[ "$OS" == "windows" ]]; then
        powershell -Command "\
            \$c = Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue;\
            if (\$c) { Stop-Process -Id \$c.OwningProcess -Force -ErrorAction SilentlyContinue }\
            " 2>/dev/null || true
    elif command -v lsof &>/dev/null; then
        lsof -ti ":${port}" 2>/dev/null | xargs kill -9 2>/dev/null || true
    fi
}

# ── Resolve local IP address ──────────────────────────────────────────────────
get_ip() {
    case "$OS" in
        mac)
            ipconfig getifaddr en0 2>/dev/null ||
            ipconfig getifaddr en1 2>/dev/null ||
            echo "localhost"
            ;;
        linux)
            hostname -I 2>/dev/null | awk '{print $1}' ||
            echo "localhost"
            ;;
        windows)
            powershell -Command \
            "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { \$_.IPAddress -notmatch '^(127|169)' } | Select-Object -First 1).IPAddress" \
            2>/dev/null || echo "localhost"
            ;;
        *)
            hostname -I 2>/dev/null | awk '{print $1}' ||
            echo "localhost"
            ;;
    esac
}
IP=$(get_ip)

printf "\n"; hr
printf "  ${BOLD}  ◆  CRM Workshop  ·  Dev (hot reload)${RESET}\n"
hr

# ── 1. Start API server ───────────────────────────────────────────────────────
step "Starting API server on :5002..."
cd "$ROOT_DIR/server"
PORT=5002 nohup node node_modules/.bin/nodemon index.js >"$SERVER_LOG" 2>&1 &
SERVER_PID=$!
echo "$SERVER_PID" > "$LOG_DIR/server.pid"
for i in {1..15}; do
  if curl -sf http://localhost:5002/api/health >/dev/null 2>&1; then
    break
  fi
  sleep 1
done
ok "API server ready"

# ── 2. Start Vite dev server ──────────────────────────────────────────────────
step "Starting Vite dev server on :3002..."
cd "$ROOT_DIR/client"
# Clear stale Vite cache to prevent production-build contamination from parent env
rm -rf node_modules/.vite
NODE_ENV=development nohup node node_modules/.bin/vite >"$CLIENT_LOG" 2>&1 &
CLIENT_PID=$!
echo "$CLIENT_PID" > "$LOG_DIR/client.pid"
for i in {1..15}; do
  if curl -sf http://localhost:3002 >/dev/null 2>&1; then
    break
  fi
  sleep 1
done
ok "Vite dev server ready"

printf "\n"; hr
printf "  ${BOLD}${GREEN}  ✓  CRM Workshop is running!${RESET}\n"
hr
printf "\n"
urlrow  "App"   "http://localhost:3002"
urlrow  "LAN"   "http://$IP:3002"
urlrow  "API"   "http://localhost:5002/api"
printf "\n"
inforow "Logs"  "logs/server.log  ·  logs/client.log"
inforow "Stop"  "./dev-stop.sh"
printf "\n"
hr
printf "\n"

open_browser "http://localhost:3002/submit"
open_browser "http://localhost:3002/advisor/login"

#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$SCRIPT_DIR"

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
printf "  ${BOLD}  ◆  CRM Workshop  ·  Production${RESET}\n"
hr

step "Installing dependencies..."
cd "$ROOT_DIR/server" && npm install --prefer-offline
cd "$ROOT_DIR/client" && npm install --prefer-offline --include=dev
ok "Dependencies ready"

step "Building client..."
cd "$ROOT_DIR/client"
npm run build
ok "Client built"

step "Clearing ports 3008 and 5008..."
kill_port 3008
kill_port 5008
ok "Ports clear"

step "Starting API server on :5008..."
cd "$ROOT_DIR/server"
if command -v nohup &>/dev/null; then
    nohup env PORT=5008 NODE_ENV=production npm start > "$ROOT_DIR/logs/server.log" 2>&1 &
else
    env PORT=5008 NODE_ENV=production npm start > "$ROOT_DIR/logs/server.log" 2>&1 &
fi
echo $! > "$ROOT_DIR/logs/server.pid"
ok "API server started"

step "Serving client on :3008..."
cd "$ROOT_DIR/client"
if command -v nohup &>/dev/null; then
    nohup npm run preview > "$ROOT_DIR/logs/client.log" 2>&1 &
else
    npm run preview > "$ROOT_DIR/logs/client.log" 2>&1 &
fi
echo $! > "$ROOT_DIR/logs/client.pid"
ok "Client server started"

printf "\n"; hr
printf "  ${BOLD}${GREEN}  ✓  CRM Workshop is running!${RESET}\n"
hr
printf "\n"
urlrow  "App"   "http://localhost:3008"
urlrow  "LAN"   "http://$IP:3008"
urlrow  "API"   "http://localhost:5008/api"
printf "\n"
inforow "Logs"  "logs/server.log  ·  logs/client.log"
inforow "Stop"  "./stop.sh"
printf "\n"
hr
printf "\n"

open_browser "http://localhost:3008/submit"
open_browser "http://localhost:3008/advisor/login"

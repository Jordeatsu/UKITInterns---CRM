#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$ROOT_DIR/logs"

# ── Colours & helpers ─────────────────────────────────────────────────────────
BOLD=$'\033[1m'; DIM=$'\033[2m'; RESET=$'\033[0m'
GREEN=$'\033[92m'; BLUE=$'\033[94m'; CYAN=$'\033[96m'

hr()   { printf "${BLUE}  ────────────────────────────────────────────────${RESET}\n"; }
step() { printf "\n  ${CYAN}→${RESET}  ${BOLD}%s${RESET}\n" "$1"; }
ok()   { printf "  ${GREEN}✓${RESET}  %s\n" "$1"; }

# ── OS detection ─────────────────────────────────────────────────────────────
detect_os() {
    case "$(uname -s 2>/dev/null)" in
        Darwin*)              echo "mac"     ;;
        Linux*)               echo "linux"   ;;
        MINGW*|MSYS*|CYGWIN*) echo "windows" ;;
        *)                    echo "unix"    ;;
    esac
}
OS=$(detect_os)

printf "\n"; hr
printf "  ${BOLD}  ◆  CRM Workshop  ·  Stopping${RESET}\n"
hr

step "Stopping processes..."
for pid_file in "$LOG_DIR/server.pid" "$LOG_DIR/client.pid"; do
  if [[ -f "$pid_file" ]]; then
    pid=$(cat "$pid_file")
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null && ok "Stopped process (PID $pid)"
    fi
    rm -f "$pid_file"
  fi
done

# Kill any lingering Node/Vite dev processes
if [[ "$OS" == "windows" ]]; then
  taskkill /F /IM node.exe 2>/dev/null || true
else
  pkill -f "node.*nodemon.*index.js" 2>/dev/null || true
  pkill -f "node.*vite" 2>/dev/null || true
fi

step "Freeing ports..."
for port in 3002 5002; do
  if [[ "$OS" == "windows" ]]; then
    powershell -Command "
      \$c = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue;
      if (\$c) { Stop-Process -Id \$c.OwningProcess -Force -ErrorAction SilentlyContinue }
    " 2>/dev/null || true
    ok "Freed port $port"
  else
    pids=$(lsof -ti:"$port" 2>/dev/null || true)
    if [[ -n "$pids" ]]; then
      echo "$pids" | xargs kill -9 2>/dev/null || true
      ok "Freed port $port"
    fi
  fi
done

sleep 1

printf "\n"; hr
printf "  ${BOLD}${GREEN}  ✓  CRM Workshop stopped.${RESET}\n"
hr
printf "\n"

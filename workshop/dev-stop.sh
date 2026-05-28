#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$SCRIPT_DIR"
LOG_DIR="$ROOT_DIR/logs"

# ── Colours & helpers ─────────────────────────────────────────────────────────
BOLD=$'\033[1m'; DIM=$'\033[2m'; RESET=$'\033[0m'
GREEN=$'\033[92m'; BLUE=$'\033[94m'; CYAN=$'\033[96m'

hr()   { printf "${BLUE}  ────────────────────────────────────────────────${RESET}\n"; }
step() { printf "\n  ${CYAN}→${RESET}  ${BOLD}%s${RESET}\n" "$1"; }
ok()   { printf "  ${GREEN}✓${RESET}  %s\n" "$1"; }

printf "\n"; hr
printf "  ${BOLD}  ◆  CRM Workshop  ·  Stopping (Dev)${RESET}\n"
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

step "Freeing ports..."
for port in 3002 5002; do
  pids=$(lsof -ti:"$port" 2>/dev/null || true)
  if [[ -n "$pids" ]]; then
    echo "$pids" | xargs kill -9 2>/dev/null || true
    ok "Freed port $port"
  fi
done

sleep 1

printf "\n"; hr
printf "  ${BOLD}${GREEN}  ✓  CRM Workshop stopped.${RESET}\n"
hr
printf "\n"

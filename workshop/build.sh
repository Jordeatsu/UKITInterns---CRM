#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$SCRIPT_DIR"

# ── Colours & helpers ─────────────────────────────────────────────────────────
BOLD=$'\033[1m'; DIM=$'\033[2m'; RESET=$'\033[0m'
GREEN=$'\033[92m'; BLUE=$'\033[94m'; CYAN=$'\033[96m'

hr()   { printf "${BLUE}  ────────────────────────────────────────────────${RESET}\n"; }
step() { printf "\n  ${CYAN}→${RESET}  ${BOLD}%s${RESET}\n" "$1"; }
ok()   { printf "  ${GREEN}✓${RESET}  %s\n" "$1"; }

printf "\n"; hr
printf "  ${BOLD}  ◆  CRM Workshop  ·  Build${RESET}\n"
hr

step "Installing server dependencies..."
cd "$ROOT_DIR/server"
npm install --prefer-offline
ok "Server dependencies ready"

step "Installing client dependencies..."
cd "$ROOT_DIR/client"
npm install --include=dev
ok "Client dependencies ready"

step "Building client..."
cd "$ROOT_DIR/client"
npm run build
ok "Build complete  →  client/dist/"

printf "\n"; hr
printf "  ${BOLD}${GREEN}  ✓  Build complete.${RESET}\n"
hr
printf "\n"

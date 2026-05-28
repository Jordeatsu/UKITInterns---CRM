#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ── Colours & helpers ─────────────────────────────────────────────────────────
BOLD=$'\033[1m'; RESET=$'\033[0m'; BLUE=$'\033[94m'

hr() { printf "${BLUE}  ────────────────────────────────────────────────${RESET}\n"; }

printf "\n"; hr
printf "  ${BOLD}  ◆  CRM Workshop  ·  Restarting (Dev)${RESET}\n"
hr
printf "\n"

"$ROOT_DIR/dev-stop.sh"
printf "\n"
exec "$ROOT_DIR/dev-start.sh"

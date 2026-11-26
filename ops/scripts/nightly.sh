#!/usr/bin/env bash
# Alleen-lezen controle; geen agents, Git-mutaties, installaties of berichten.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec python3 "$SCRIPT_DIR/nightly-monitor.py" "$@"

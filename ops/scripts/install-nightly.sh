#!/usr/bin/env bash
# Installeer de gecontroleerde lokale versie; haalt nooit uitvoerbare code uit main.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STATE_DIR="$HOME/.topo-night/monitor"
LABEL="com.colddesert.topo-night"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
for tool in python3 gh; do command -v "$tool" >/dev/null; done
gh auth status >/dev/null 2>&1 || { echo "Log eerst in met gh auth login."; exit 1; }
# Valideer bronnen vóór installatie; geen proef-build of agentaanroep.
python3 -c 'import ast,sys; ast.parse(open(sys.argv[1]).read())' "$SCRIPT_DIR/nightly-monitor.py"
mkdir -p "$STATE_DIR" "$(dirname "$PLIST")"
cp "$SCRIPT_DIR/nightly-monitor.py" "$STATE_DIR/nightly-monitor.py"
python3 - "$PLIST" "$STATE_DIR" "$(command -v python3)" "$PATH" <<'PY'
import plistlib, sys
path, state, python, searchpath = sys.argv[1:]
data = {
    'Label': 'com.colddesert.topo-night',
    'ProgramArguments': [python, state + '/nightly-monitor.py', '--state-dir', state],
    'EnvironmentVariables': {'PATH': searchpath},
    'StartCalendarInterval': {'Hour': 1, 'Minute': 0},
    'StandardOutPath': '/dev/null',
    'StandardErrorPath': state + '/launchd.err',
}
with open(path, 'wb') as f:
    plistlib.dump(data, f)
PY
plutil -lint "$PLIST"
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
launchctl print "gui/$(id -u)/$LABEL" >/dev/null
echo "Controleronde geïnstalleerd: dagelijks 01:00 lokale Mac-tijd, maximaal 10 minuten."
echo "Uitvoer: $STATE_DIR/latest.md; geen Telegram of tweede ochtendbrief."

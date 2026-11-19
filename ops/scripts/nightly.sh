#!/usr/bin/env bash
# TOPO nachtrun — draait op de Mac mini via launchd (01:00), geïnstalleerd met ops/scripts/install-nightly.sh.
# Werkt in een aparte git worktree en raakt main nooit aan. Levert één draft-PR per nacht en een brief.
# launchd haalt dit script elke nacht vers van origin/main, dus wijzigingen via een PR werken automatisch door.
set -euo pipefail

STATE_DIR="$HOME/.topo-night"
# Paden, PATH en optioneel TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID (geschreven door install-nightly.sh)
[ -f "$STATE_DIR/env" ] && source "$STATE_DIR/env"
REPO="${TOPO_REPO:-$HOME/topo-claude}"
WT="${TOPO_WORKTREE:-$HOME/topo-night}"
DATE="$(date +%F)"
BRANCH="night/$DATE"
mkdir -p "$STATE_DIR"
LOG="$STATE_DIR/$DATE.log"
exec >>"$LOG" 2>&1
echo "=== start $(date) ==="


body() { awk 'BEGIN{n=0} /^---$/ && n<2 {n++; next} n>=2' "$1"; }   # strip frontmatter
# Limietmelding van Claude herkennen, o.a. "You've hit your 5-hour limit" (nacht 15-11 gemist).
# Alleen de laatste regels: de nachtrun zelf kan over "rate limit" praten zonder er een te raken.
LIMIT_RE="usage limit|limit reached|rate limit|hit your|5-hour limit|weekly limit"
hit_limit() { printf '%s\n' "$1" | tail -n 15 | grep -qiE "$LIMIT_RE"; }

# Resettijd uit de limietmelding, bv. "resets 4:40am (Europe/Amsterdam)" of "resets 5am (UTC)" -> epoch-seconden.
# Node (staat er toch voor npm) rekent de tijdzone om; ligt het tijdstip vandaag al achter ons, dan is het morgen.
reset_epoch() {
  printf '%s\n' "$1" | tail -n 15 | node -e '
    const t=require("fs").readFileSync(0,"utf8");
    const m=t.match(/resets\s+(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?(?:\s*\(([^)]+)\))?/i);
    if(!m)process.exit(1);
    let h=+m[1];const mi=+(m[2]||0),ap=(m[3]||"").toLowerCase(),tz=m[4]||Intl.DateTimeFormat().resolvedOptions().timeZone;
    if(ap==="pm"&&h<12)h+=12;if(ap==="am"&&h===12)h=0;
    const now=Date.now(),parts=o=>Object.fromEntries(new Intl.DateTimeFormat("en-US",{timeZone:tz,hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}).formatToParts(o).map(p=>[p.type,p.value]));
    const p=parts(new Date(now));
    // wandkloktijd in tz -> UTC: gok als UTC, corrigeer met de offset van tz op dat moment
    const guess=Date.UTC(+p.year,+p.month-1,+p.day,h,mi);const q=parts(new Date(guess));
    let at=guess-(Date.UTC(+q.year,+q.month-1,+q.day,+q.hour,+q.minute)-guess);
    if(at<=now-60e3)at+=864e5;
    console.log(Math.round(at/1e3));' 2>/dev/null
}

# Codex-flags verschillen per versie (--full-auto bestaat niet overal, nacht 16-11). Lees `codex exec --help`
# en kies wat deze versie kent: schrijven in de worktree, zonder vragen. De help-uitvoer gaat naar codex-help.txt.
codex_run() {
  local help args=()
  help="$(codex exec --help 2>&1)"; printf '%s\n' "$help" > "$STATE_DIR/codex-help.txt"
  if grep -q -- '--full-auto' <<<"$help"; then args+=(--full-auto)
  elif grep -q -- '--sandbox' <<<"$help"; then args+=(--sandbox workspace-write)
  else args+=(-c 'sandbox_mode="workspace-write"'); fi
  grep -q -- '--ask-for-approval' <<<"$help" && args+=(--ask-for-approval never)
  grep -q -- '--cd' <<<"$help" && args+=(--cd "$WT")
  # in een worktree staat .git buiten de map; git commit moet daar kunnen schrijven
  grep -q -- '--add-dir' <<<"$help" && args+=(--add-dir "$REPO/.git")
  echo "codex exec ${args[*]} ..."
  codex exec "${args[@]}" "$1"
}

# 1. Verse worktree vanaf origin/main
cd "$REPO"
git fetch origin --prune
git worktree remove --force "$WT" 2>/dev/null || true
git fetch origin main:main 2>/dev/null || true   # lokale main bijwerken (lukt alleen als main niet uitgecheckt is)
git worktree add -B "$BRANCH" "$WT" origin/main
cd "$WT"
npm ci --silent || npm install --silent

# Agents draaien in een eigen worktree zonder vragen (bypassPermissions), maar met harde verboden.
# Een allowlist per commando bleek te smal: pipes en samengestelde git-commando's werden geweigerd (nacht 14-11).
DENIED=( "Bash(git push*)" "Bash(git checkout main*)" "Bash(git switch main*)" "Bash(git reset --hard*)" "Bash(git branch -D*)"
         "Bash(git branch -d*)" "Bash(git push --delete*)" "Bash(git tag -d*)" "Bash(git worktree remove*)" "Bash(rm -rf*)"
         "Bash(vercel*)" "Bash(gh pr merge*)" "Bash(gh api*)" "Bash(gh repo*)" "Bash(launchctl*)" )

if [ "${DRY_RUN:-0}" = "1" ]; then echo "DRY_RUN: worktree klaar op $WT"; exit 0; fi

# 2. Claude-nachtrun: hoofdsessie orkestreert (Opus; override met TOPO_MAIN_MODEL in ~/.topo-night/env),
#    subagents draaien op hun eigen model (frontmatter in .claude/agents/).
#    Bij een limiet met resettijd: wachten tot reset + 2 min en hervatten, zolang dat ruim voor de deadline (07:00) kan.
DEADLINE="$(node -e 'const d=new Date();d.setHours(+process.argv[1],0,0,0);if(d<=Date.now())d.setDate(d.getDate()+1);console.log(Math.round(d/1e3))' "${TOPO_DEADLINE_HOUR:-7}")"
MIN_LEFT=$(( ${TOPO_MIN_RESUME_MIN:-20} * 60 ))   # minder werktijd over na de reset -> niet wachten maar Codex
hhmm() { date -r "$1" +%H:%M 2>/dev/null || date -d "@$1" +%H:%M; }   # macOS en Linux
PROMPT="$(body .claude/commands/nachtrun.md)"
LIMIT=nee; RESUMES=0; RC=0; OUT=""
set +e
while :; do
  OUT="$(claude -p "$PROMPT" \
    --model "${TOPO_MAIN_MODEL:-opus}" --max-turns 300 \
    --permission-mode bypassPermissions \
    --disallowedTools "${DENIED[@]}" \
    --append-system-prompt "Vergelijk altijd met origin/main (lokale main is bijgewerkt maar origin/main is de waarheid). Read-only git (for-each-ref, rev-list, cherry, merge-base, show, ls-tree) en pipes zijn toegestaan. Harde eindtijd $(hhmm "$DEADLINE"): rond daarvoor af." 2>&1)"
  RC=$?
  echo "$OUT" | tail -40
  if ! hit_limit "$OUT"; then LIMIT=nee; break; fi
  LIMIT=ja
  RESET="$(reset_epoch "$OUT")"
  NOW=$(date +%s)
  if [ -z "$RESET" ]; then echo "Limiet zonder leesbare resettijd -> Codex"; break; fi
  WAKE=$(( RESET + 120 ))
  if [ $(( DEADLINE - WAKE )) -lt "$MIN_LEFT" ] || [ "$RESUMES" -ge 3 ]; then
    echo "Reset $(hhmm "$RESET") te laat voor deadline $(hhmm "$DEADLINE") (of al ${RESUMES}x hervat) -> Codex"; break
  fi
  echo "Claude-limiet; wacht tot $(hhmm "$WAKE") en hervat (poging $((RESUMES+1)))"
  # caffeinate houdt de Mac mini wakker tijdens het wachten (bestaat niet op Linux)
  WAIT=$(( WAKE - NOW )); [ "$WAIT" -lt 0 ] && WAIT=0
  if command -v caffeinate >/dev/null; then caffeinate -i sleep "$WAIT"; else sleep "$WAIT"; fi
  RESUMES=$((RESUMES+1))
  echo "$DATE | hervat na limiet ($RESUMES) $(date +%H:%M)" >> "$STATE_DIR/failover.log"
  PROMPT="De nachtrun liep tegen de Claude-limiet en is nu hervat ($(date +%H:%M)). Kijk eerst wat er al gedaan is (git log origin/main..HEAD, git status, ops/STATE.md, ops/RUNLOG.md) en ga verder waar het werk stopte; begin geen taak opnieuw die al gecommit is.

$(body .claude/commands/nachtrun.md)"
done
set -e

# 3. Failover naar Codex als de limiet niet op tijd reset: bouwt de bovenste ready-taak, evaluatie volgt overdag door Claude
if [ "$LIMIT" = ja ]; then
  echo "Claude-limiet niet op tijd voorbij -> Codex-failover"
  codex_run "Lees AGENTS.md en ops/HARNESS.md. Pak de bovenste taak met status ready uit ops/BACKLOG.md en het contract in ops/contracts/. Bouw precies dat, draai de tests uit het contract, commit met de BL-ID in de message. Zet de status op 'review (wacht op evaluator)' en voeg een regel toe aan ops/RUNLOG.md met agent codex. Niet pushen, niet mergen." || true
  echo "$DATE | codex-failover | zie git log" >> "$STATE_DIR/failover.log"
fi

# 4. Machine-feiten in het nachtrapport (de brief rapporteert limiet/failover anders als "onbekend")
REPORT="ops/reports/night-$DATE.md"; mkdir -p ops/reports
FAILOVER=nee; grep -q "^$DATE" "$STATE_DIR/failover.log" 2>/dev/null && FAILOVER=ja
{ echo; echo "<!-- script -->"; echo "Claude exit-code: $RC · limiet geraakt (laatste poging): $LIMIT · hervat na limiet: ${RESUMES}x · failover Codex: $FAILOVER · duur: $SECONDS s"; } >> "$REPORT"
# Alleen het rapport committen: staged werk van een afgebroken run hoort hier niet bij (nacht 15-11)
git add "$REPORT" && git commit -qm "docs(night): machine-feiten $DATE" -- "$REPORT" || true

# 5. Push en draft-PR als er werk is
if [ -n "$(git log origin/main..HEAD --oneline)" ]; then
  git push -u origin "$BRANCH" || echo "push mislukt; brief draait toch"
  gh pr create --draft --base main --head "$BRANCH" --title "Nachtrun $DATE" --body-file "$REPORT" || true
fi

# 6. Brief (Sonnet) → bestand + Telegram. Na een Claude-limiet faalt ook deze aanroep (zelfde account),
#    dus: Claude → Codex → minimale brief uit de machine-feiten. Er gaat altijd iets naar Dennis.
BRIEF_FILE="ops/briefs/$DATE.md"
set +e
BRIEF=""
if [ "$LIMIT" = nee ]; then
  BRIEF="$(claude -p "$(body .claude/commands/brief.md)" --model sonnet --max-turns 30 \
    --permission-mode bypassPermissions --disallowedTools "${DENIED[@]}" 2>&1)"
  hit_limit "$BRIEF" && { echo "Brief: Claude-limiet → Codex"; BRIEF=""; }
fi
if [ -z "$BRIEF" ] || [ ! -s "$BRIEF_FILE" ]; then
  codex_run "$(body .claude/commands/brief.md) Vandaag is $DATE. Niet pushen." >/dev/null 2>&1
  [ -s "$BRIEF_FILE" ] && BRIEF="$(cat "$BRIEF_FILE")"
fi
if [ -z "$BRIEF" ]; then
  mkdir -p ops/briefs
  { echo "# Brief $DATE (noodbrief, script)"; echo
    echo "Claude-limiet: $LIMIT · hervat: ${RESUMES}x · Codex-failover: $FAILOVER · exit-code: $RC"
    echo "Commits deze nacht:"; git log origin/main..HEAD --oneline | head -10
    echo; echo "Laatste regels nachtrun:"; printf '%s\n' "$OUT" | tail -n 5; } > "$BRIEF_FILE"
  BRIEF="$(cat "$BRIEF_FILE")"
fi
set -e
if [ -n "$(git status --porcelain ops/briefs)" ]; then
  git add ops/briefs && git commit -m "docs(brief): $DATE" -- ops/briefs && git push origin "$BRANCH" || true
fi
if [ -n "${TELEGRAM_BOT_TOKEN:-}" ] && [ -n "${TELEGRAM_CHAT_ID:-}" ]; then
  curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
    --data-urlencode "text=${BRIEF:0:3900}" >/dev/null || true
fi
echo "=== einde $(date) ==="

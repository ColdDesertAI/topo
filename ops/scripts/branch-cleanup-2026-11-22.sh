#!/usr/bin/env bash
# Branch-opruiming 22-11 (BL-001b, optie a). Draai in je lokale topo-repo. Eerst droog: ./ops/scripts/branch-cleanup-2026-11-22.sh  (toont alleen)
# Echt uitvoeren: ./ops/scripts/branch-cleanup-2026-11-22.sh --uitvoeren
set -euo pipefail
RUN=${1:-}
BRANCHES=(
  "night/2026-11-22"
  "night/2026-11-21"
  "night/2026-11-20"
  "night/2026-11-19"
  "night/2026-11-18"
  "night/2026-11-17"
  "t/BL-008-usability-v3"
  "t/BL-NEXT-00-readiness"
  "night/2026-11-16"
  "t/AUDIT-v3"
  "claude/nachtfix-main"
  "night/2026-11-15"
  "t/BL-003-state-herleidbaar"
  "t/BL-007-karakterisering"
  "t/BL-015-v3-release"
  "t/BL-019-regios"
  "t/FR-01-items"
  "t/FR-02-geo"
  "art/nino-topo-r3-refinements"
  "feat/nino-topo-portal-r2"
  "night/2026-11-14"
  "ops/bl012"
  "ops/domein-gekocht"
  "ops/favicon-r3"
  "ops/model-routing"
  "ops/night1"
  "ops/nightly-fix"
  "t/BL-002-docs-inventaris"
  "t/BL-005-integratie"
  "t/BL-013-portal-r3"
  "art/nino-topo-website-v1"
  "codex/topo-v3"
  "ops/domein"
  "ops/nightly-install"
  "ops/setup"
  "arch/stap0-bron"
  "arch/v3-runtime"
  "art/v3-render-assets"
  "docs/ontwikkeling"
  "qa/v3-app-1a42590"
  "qa/v3-art-05ab1d0"
  "qa/v3-art-908b4a4"
  "qa/v3-ge01-6934799"
  "qa/v3-reis-afb32d1"
  "v3/relief-z8"
  "codex/nino-2.0.2"
  "codex/nino-settings-exam"
  "codex/nino-v2-artwork-closure-67"
  "docs/v2-afsluiting"
  "art/nino-final-closeout-20261107"
  "codex/nino-v2-integration-20261103"
  "qa/hermes-r2-final-bb27e61"
  "agent/topo-harness-v1"
  "agent/topo-harness-v2"
  "agent/topo-harness-v2-codex-reviewed"
  "agent/topo-harness-v2-improvement-fresh-package"
  "qa/hermes-harness-v2-beeaef4"
  "qa/hermes-playable-b06b130"
  "art/pisa-hinge-source-preserving-final-20261103"
  "qa/hermes-nino-v2-closure-67"
  "qa/hermes-nino2-final-71"
  "qa/hermes-pisa-final-72"
  "design/nino-cplus-20261102"
  "art/nino-venezia-scalloped-20261031"
  "codex/issue-52-calm-desktop-learning"
  "art/nino-micro-icons-v2-20261030"
  "art/nino-pisa-hinge-qa-20261030"
  "codex/issue-58-legible-map-picker"
  "codex/topo-nino-computer-release-20261030"
  "design/approved-map-choice-preview-20261030"
  "release/topo-nino-computer-v1-20261030"
  "codex/issue-58-rome-vatican-enclave-ui"
  "hermes/passport-final-art-qa-8a704cb"
  "art/nino-travel-stamps-v2-20261026"
  "codex/issue-50-offline-computer"
  "docs/nino-gold-journey-roadmap-20261026"
  "hermes/pr51-offline-computer-qa-bd1e57b"
  "hermes/pr59-qa-evidence-d55e9de"
  "codex/passport-scoperte-preparation-20261026"
  "fix/afternoon-ipad-blockers-20261026"
  "hermes/nino-art-intake-45"
  "hermes/topo-ipad-focus-mode"
  "art/nino-pizza-rewards-20261024"
  "codex/topo-pizza-reward-v2"
  "codex/topo-semantic-map-hotfix"
  "hermes/qa-pr39-fc8f5be"
  "hermes/topo-discovery-map-production"
  "art/nino-chapters-20261024"
  "art/nino-complete-20261024"
  "codex/topo-lakes-map-layer"
  "codex/topo-schoolblad-overlay"
  "design/nino-character-content-pack-20261023"
  "hermes/topo-exploration-map-design-proof"
  "hermes/topo-nino-visual-integration"
  "integration/topo-release-1-2-nino-lakes"
  "codex/topo-release-1-1-polish"
  "codex/topo-release-1-integration"
  "work/topo-sync-2026-10-23"
)
# Alleen de goedgekeurde lijst; night/2026-11-23 blijft buiten scope.
case "$RUN" in ""|--uitvoeren) ;; *) echo "Gebruik: $0 [--uitvoeren]" >&2; exit 2 ;; esac
remote_url=$(git remote get-url origin)
case "$remote_url" in
  https://github.com/ColdDesertAI/topo.git|git@github.com:ColdDesertAI/topo.git) ;;
  *) echo "Onverwachte origin: $remote_url" >&2; exit 1 ;;
esac
# Droog draaien schrijft geen refs. Lees actuele remote-SHA's, geen oude tracking refs.
snapshot=$(git ls-remote --heads --tags origin)
lookup() { printf '%s\n' "$snapshot" | awk -v ref="$1" '$2 == ref {print $1}'; }
ACTIVE=()
SHAS=()
for b in "${BRANCHES[@]}"; do
  sha=$(lookup "refs/heads/$b")
  if [ -z "$sha" ]; then echo "AL WEG: $b"; continue; fi
  tagsha=$(lookup "refs/tags/archive/$b")
  if [ -n "$tagsha" ] && [ "$tagsha" != "$sha" ]; then
    echo "STOP: archive/$b bestaat op een andere commit; niets overschrijven." >&2
    exit 1
  fi
  ACTIVE+=("$b")
  SHAS+=("$sha")
  echo "archive/$b -> $sha; daarna branch verwijderen"
done
if [ "$RUN" != "--uitvoeren" ]; then
  echo "Droog: ${#ACTIVE[@]} branches, niets gewijzigd."
  exit 0
fi
if [ "${#ACTIVE[@]}" -eq 0 ]; then echo "Geen branches meer op de lijst."; exit 0; fi
# Eerst alle archieven veiligstellen. Bestaande tags nooit forceren.
for ((i=0;i<${#ACTIVE[@]};i++)); do
  b=${ACTIVE[$i]}; sha=${SHAS[$i]}
  git fetch --no-tags origin "refs/heads/$b"
  git cat-file -e "$sha^{commit}"
  git push origin "$sha:refs/tags/archive/$b"
done
snapshot=$(git ls-remote --heads --tags origin)
for ((i=0;i<${#ACTIVE[@]};i++)); do
  b=${ACTIVE[$i]}; sha=${SHAS[$i]}
  [ "$(lookup "refs/tags/archive/$b")" = "$sha" ] || { echo "STOP: archief niet bevestigd: $b" >&2; exit 1; }
  [ "$(lookup "refs/heads/$b")" = "$sha" ] || { echo "STOP: branch veranderd: $b" >&2; exit 1; }
done
# Lease weigert verwijdering wanneer iemand sinds de controle nog pusht.
for ((i=0;i<${#ACTIVE[@]};i++)); do
  b=${ACTIVE[$i]}; sha=${SHAS[$i]}
  git push --force-with-lease="refs/heads/$b:$sha" origin ":refs/heads/$b"
done
git fetch --prune origin
echo "Remote-opruiming klaar; lokale branches en worktrees zijn behouden."

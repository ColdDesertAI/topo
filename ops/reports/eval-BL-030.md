# Evaluatie BL-030 — Nazorg BL-028 (toets-beveiliging, strikte adapter, aanwijzen getest)

Evaluator: evaluator (Opus) · 2026-11-22 · branch night/2026-11-22 · bouwcommit 5013e6ca (basis 31412696) · run 1/3

VERDICT: PASS

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | toets.js: alleen commentaar, noemt BL-030 | `git diff -U0 31412696 5013e6ca -- scripts/v3/toets.js \| grep -E '^[+-][^+-]' \| grep -vE '^[+-]\s*//'`; `grep -c BL-030` | PASS | eerste: geen uitvoer; tweede: `1`. Diff: 1 commentaarregel vervangen door 2 commentaarregels (r122–123), code ongewijzigd |
| 2 | Gooit bij 0 treffers | node -e uit contract | PASS | exit 0, `BL-028 exam-reward change expected exactly once, found 0` |
| 3 | Gooit bij 2 treffers | node -e met deelstring 2x | PASS | exit 0, `... found 2` |
| 4 | 1 treffer: byte-gelijk aan oud gedrag | `restoreExamReward(index.html) === html.replace(N,O)` | PASS | `true` (en resultaat ≠ invoer, lengte 41449687 → 41449642); `grep -c` deelstring in index.html = 1. Implementatie: `split().length-1` telt, daarna één `String.replace` met string, geen regex/replaceAll |
| 5 | Aanwijzen: dagdoel +1, beloning 0 | `node scripts/exam-flow.test.mjs`; diff | PASS | exit 0, "…: OK". Diff toont alleen toevoegingen in het point-blok (`dailyBefore`, `daily===dailyBefore+1`, `[good,slices,pizzas,trips]===[0,0,0,0]`); bestaande asserts ongewijzigd |
| 6 | Mutatietoets | 3 kopieën in $TMPDIR (import.meta.url → absolute scripts-URL); basis-kopie groen | PASS | M1 gewrapte `E.grade` met `state.slices++` in point-blok → faalt op "a point answer gives no reward in a test". M2 `examCode` in geheugen: guard lekt alleen bij `questionMode==='point'` → faalt op dezelfde assert (r72). M3 `recordDailyCorrect` telt niet bij point → faalt op "a correct point answer counts +1 for the daily goal" (r70). Alle drie exit 1 op de nieuwe asserts, niet op bestaande |
| 7 | Lint | `npm run lint` | PASS | exit 0 |
| 8 | Alle tests | `NODE_OPTIONS=--max-old-space-size=8192 npm test` | PASS | exit 0, overal `fail 0`; 1 skip = bestaande opt-in `--rebuild` (regions), niet gerelateerd. Aanroepers focus-mode, map-hit, schoolblad, discovery-map groen met de strikte adapter |
| 9 | Builds | `df -h .` (458 MB vrij ≥ 300) ; `npm run build && SITE_ITALIE=v3 npm run build:site` | PASS | beide exit 0; "Italië op /italie/: V3", "Site-check: OK"; git status daarna schoon |
| 10 | V3-build: wrapper actief, geen fouten | Playwright Chromium, statische server op dist/, /italie/ 1080×810 | PASS | 0 pageerrors; exam → `TopoLearning.award({trips:0}).pizza === false`, mode teruggezet (`route`). Extra (sterker dan contract): invoer `slices:7` geeft buiten de toets `pizza:true`, in de toets `pizza:false` en het object blijft ongemuteerd → wrapper werkelijk actief. Gebouwde dist/italie/index.html bevat "decision BL-030" (1x) |

DoD (QUALITY §G2): lint en test groen; geen UI- of geografiewijziging (geometriecheck in `npm run build` OK); STATE/RUNLOG/LEARNINGS en PR zijn taken van de hoofdsessie na deze PASS.

FAIL-redenen: geen.

Opmerkingen (niet blokkerend, wel herstellen):
- `scripts/v3/toets.js` r123: "To undo: remove the three lines below" klopt niet. De wrapper is twee coderegels (r124–125); de derde regel eronder is het commentaar van het volgende blok ("// Record what V2 graded, per question."). Wie letterlijk drie regels weghaalt, verwijdert dat commentaar. Onschadelijk voor gedrag, maar onjuist in een taak die juist het besluit moet documenteren. Herstel (alleen commentaar): "To undo: remove the two lines below; exam-flow.test.mjs must stay green."
- Contract zegt "Niets committen (nachtrun-instructie)", maar het werk staat in commit 5013e6ca (samen met ops/BACKLOG.md en het contract). Procesafwijking van de hoofdsessie, geen bouwfout; vermelden in RUNLOG.
- `scripts/audit-release-1-2.mjs` (niet in `npm test`): de strikte adapter (r28) passeert; het script faalt daarna op r33 `dist/index.html parity` omdat dist/ de V3-site is. Al bestaand en los van BL-030.

Buiten scope opgemerkt (→ backlog-idee):
- Contractcriterium 10 zoals geschreven (`award({trips:0}).pizza === false`) bewijst niets: ook zonder wrapper geeft die invoer `pizza:false`. Een toekomstige check moet een invoer gebruiken die buiten de toets een pizza oplevert (bijv. `slices: SLICES_PER_PIZZA-1`) en controleren dat het object niet muteert.
- `audit-release-1-2.mjs` dist-pariteit hoort bij een V2-build; script is na `build:site` niet bruikbaar. Idee: volgorde/doel vastleggen of het script uit de releaseset halen.
- 2x console "Failed to load resource: net::ERR_CACHE_MISS" op /italie/ (geen pageerror); niet onderzocht.

Les: een acceptatiecriterium dat een guard toetst moet een invoer gebruiken waarbij het onbewaakte pad een ander resultaat geeft; anders is de check groen met en zonder guard.

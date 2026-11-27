# Evaluatie FR-04: oefenkaart Frankrijk op /frankrijk/

Evaluator: `evaluator` (Opus), 27-11-2026. Werkboom `claude/project-thread-i8rmug` (HEAD = origin/main 02f3e5b, niet gecommit).

## Ronde 3 (contract aangepast: origineel + sjabloonfixes a–d; test met 2 toetsrondes)

VERDICT: PASS

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | Bestand = origineel + alleen fixes a–d | `diff` met `/tmp/claude-0/fr/fr.html` (sha256 `f7236200…2fb2`, gelijk aan het contract); `cmp` met dist | PASS | 12 diffregels in 6 hunks, allemaal a–d: `#toast{pointer-events:none…}` (c), `const WELK=…` + 2x `${WELK(it.type)}` (d), `let toetsT=0` + `clearTimeout(toetsT)` in `start` (b), `ans`-guard + `toetsT=setTimeout(…)` in `done` (a, b). Nieuwe sha256 `6c510f9f…dc658`. `cmp` met `dist/frankrijk/index.html`: 0. Gedragscheck met een eigen script (Toets → Weet ik niet → binnen 250 ms naar Leren): origineel geeft pageerror "Cannot read properties of null (reading 'i')", het nieuwe bestand 0 errors. Toast `pointer-events` = none. `WELK`: eiland/gebergte → "Welk", stad → "Welke" |
| 2 | Data compleet | `npm run test:fr`, 3x achter elkaar | PASS | 3/3 OK, exit 0 |
| 3 | Aanwijzen 44/44, 6/6 per soort | `npm run test:fr` 3x + mutant 1 + eigen run | PASS | 3x 44/44 en 6/6 op 3 formaten. Mutant 1 (fout telt als goed): "fouten herkend 0/6", 18 FAIL, exit 1. Eigen run via de echte UI: 6/6 op alle formaten |
| 4 | Schrijven strikt, bijna telt niet in toets | `npm run test:fr` 3x + mutant 2 + eigen run | PASS | mutant 2 (toets telt bijna): "44 / 44 …, verwacht 43 / 44 en cijfer 9,8" plus "italie staat niet bij 'Nog oefenen'", 6 FAIL, exit 1, geen crash. Eigen toets: accentloze namen tellen fout, hoofdletters/spaties goed (42/41/40 van 44, precies zoals verwacht) |
| 5 | Toets alles goed (dubbele Enter) → 44/44 en 10,0; voortgang | `npm run test:fr` 3x + mutant 3 | PASS | ronde A controleert `44 / 44` en `10,0`, ronde B `43 / 44` en `9,8`. Mutant 3 (zonder `ans`-guard): "toets toont vraag 3 niet", exit 1, dus de dubbele Enter toetst de guard echt. Voortgang na herladen: OK (test en eigen run) |
| 6 | Offline, 0 errors, tikdoelen ≥ 44 | `npm run test:fr` 3x + eigen meting | PASS | 0 verzoeken en 0 errors. Eigen meting (breedte en hoogte, alle schermen incl. keuzevenster, toets, uitslag en schoolblad): niets onder 44 px |
| 7 | Site-build intact | `npm run build && SITE_ITALIE=v3 npm run build:site` op de werkboom; diff met `/tmp/dist-base` | PASS | exit 0, "Site-check: OK". `diff -rq /tmp/dist-base dist`: alleen "Only in dist: frankrijk". `/tmp/dist-base` vertrouwd omdat hij in ronde 1 identiek bleek aan mijn eigen build van origin/main |

Flakiness uit ronde 2 opgelost:
- `accfirst.html` (accentitem op index 0, de oude faalvorm): OK.
- `acceven.html` (alle accentitems op even, dus aanwijsposities, waardoor het herschikpad `j ≥ 2 → 3` gebruikt wordt): OK.
- `npm run test:fr` 3/3 OK.

Mutanten en logs: `/tmp/claude-0/-home-user/cee8232a-4808-5848-8953-fa69de7d3ca2/scratchpad/r3/`.

Scope: alleen toegestane bestanden gewijzigd (`ops/BACKLOG.md`, `ops/STATE.md`, `package.json`, `scripts/build-site.mjs`, `scripts/verify-site.mjs`, `src/lands/fr/README.md`, en nieuw contract, test en `src/lands/fr/app/`).

### FAIL-redenen
Geen.

### Opmerkingen (niet blokkerend)
- Contract FR-04 is tijdens de evaluatie verruimd van "1-op-1, geen UI-wijziging" naar "+ fixes a–d". Fix d verandert zichtbare tekst ("Welk eiland"). De **Doel**-regel van het contract en de BACKLOG-regel zeggen nog "ongewijzigd", en "Max runs: 1/3" is niet bijgewerkt. Laat Dennis de afwijking van zijn bestand bij G4 expliciet zien.
- `npm test` (DoD) faalt in deze omgeving op een ontbrekend `jsdom` (geen `node_modules`). Dat ligt aan de omgeving en staat los van FR-04. `npm run lint`: exit 0 (ronde 1).
- RUNLOG nog bijwerken bij de afronding.

### Buiten scope opgemerkt (→ backlog-idee)
- De tikdoelcheck in `oefenkaart-e2e` meet alleen de hoogte, en niet het keuzevenster of het schoolblad.
- Fix b wordt niet door `oefenkaart-e2e` getoetst (moduswissel binnen 250 ms). Een korte stap toevoegen, voor hergebruik bij VK/Ierland.

### Les
Een e2e-test is pas bewijs als hij aantoonbaar faalt op een mutant voor elke "telt (niet)"-eis, en een paar keer achter elkaar groen is.

---

## Ronde 2 (samengevat)
FAIL: het herschikken van `test.ids` in de toets raakte index 0 terwijl vraag 1 al getoond werd. De test was flaky (op het ongewijzigde bestand 1x 42/44 in plaats van 43/44). De check op 44/44 en 10,0 was weggevallen.

## Ronde 1 (samengevat)
FAIL: het foute-tik-deel vervangt `onTap` door een eigen handler. Mutant 1 (fout = goed) en mutant 2 (toets telt bijna) bleven onopgemerkt. Het product was bij alle 7 criteria in orde (eigen Playwright-run met echte touch; build-diff met origin/main: alleen `frankrijk` erbij).

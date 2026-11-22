# Evaluatie BL-024a — glascheck Menu 1: toestandsmatrix, vergrendeld hoofdstuk, blurAll
Evaluator (Opus), 22-11 03:50–04:10. Branch `night/2026-11-22`, bouwcommit `bc745fee`, basis `5d836728`. Preview: `node scripts/build-v3-preview.mjs` (sha256 1620b364…). Alle runs zelf gedraaid, logs in `$TMPDIR/evalbl024a/`.

VERDICT: FAIL

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | Alleen het QA-script, in één commit | `git log --oneline 5d836728..HEAD`, `git show --stat HEAD` | **FAIL** | 1 commit (ok), maar die raakt 3 bestanden: `scripts/qa-v3-menu1.mjs` (+66/−22), `ops/BACKLOG.md` (+3/−1), `ops/contracts/BL-024a.md` (+45, nieuw). Contract: "alleen `scripts/qa-v3-menu1.mjs`"; "`ops/*` doet de hoofdsessie" |
| 2 | Syntax en tests groen | `npm run lint`; `NODE_OPTIONS=--max-old-space-size=8192 npm test` | PASS | lint exit 0; test exit 0, 9 suites, alle `fail 0` (1 skipped) |
| 3 | Build groen | `npm run build && SITE_ITALIE=v3 npm run build:site` | PASS | exit 0, "Site-check: OK" |
| 4 | Smoke draait met de nieuwe controles | `NODE_PATH=… node scripts/qa-v3-menu1.mjs --smoke` op HEAD (incl. `flex:none`-versie) | PASS | exit 0, "OK: geen fouten"; regels `#nieuw` voor overzicht/oefenen/toets/rewards/voortgang × 1440×900, 1080×810, 810×1080 (15) + 3× "vergrendeld hoofdstuk" (city2); `toestand …: #nieuw 0, #bezig 1` per maat |
| 5 | Geen regressie hoofdlus | smoke op basisscript (`git show 5d836728:…` naar $TMPDIR, `QA_HTML` = zelfde preview) vs HEAD | PASS | uitvoer identiek na weglaten van `toestand`/`#nieuw`/`blurAll`-regels (`diff` leeg); beide "OK: geen fouten" |
| 6 | Beveiliging blurAll | `QA_MUTATE_BLUR=1 … --smoke` + eigen probe van de div-posities | PASS | 6 meldingen `blur (hele scrollhoogte) op 4/5: qaMutBlur…` (voortgang, hoofdlus + matrix, alle 3 maten); géén `blur op`-melding (in-beeld blur blijft 0/1). Eigen probe: `.v3View-voortgang` is `overflow-y:auto` (scrollH 1874 vs clientH 848 @1440), alle 4 divs buiten beeld (top 1022/926/1425 px bij 900/810/1080 hoogte). Zonder mutatie: blurAll max 1 (`v3Side::after` @810), geen melding |
| 7 | Beveiliging toestandsmatrix | `QA_MATRIX_STATE=bezig … --smoke` | PASS | normaal: `#nieuw 0, #bezig 1`; mutatie: 3× `toestand niet gewisseld (#bezig 1, #bezig 1)`, exit 1. Telling = rijen `.v3Row[data-state=done|gold]` (gedocumenteerd r. 237–238, klopt met `reis.js` r. 50 `stateOf`) |
| 8 | Beveiliging vergrendeld | `QA_MATRIX_STATE=alles … --smoke` (alle hoofdstukken ontgrendeld) + eigen probe/screenshot | PASS | mutatie: 3× `vergrendeld hoofdstuk: geen vergrendeld hoofdstuk`, exit 1. Vergrendeling vóór de klik via `.v3Row[data-state=locked]` (commentaar r. 251–252: geval "kan geopend worden"). Eigen probe #nieuw: city1:now, city2..rivers:locked; klik city2 → hoofdstukpagina "Hoofdstuk 2: Steden 7–12 … Opent na Steden 1–6" met slotje (screenshot `$TMPDIR/evalbl024a/locked-1440.png`) |
| 9 | Geen app-bestand geraakt | `git diff 5d836728..HEAD --name-only` | PASS | geen `scripts/v3/*`, `src/*`, `index.html`, `*.css` |
| 10 | Looptijd smoke | `/usr/bin/time -p`, HEAD en basis tegelijk gedraaid (zelfde belasting) | PASS | HEAD 297,95 s vs basis 234,25 s = 1,27× (≤ 2×) |

FAIL-redenen (concreet, reproduceerbaar):
1. Criterium 1: `git show --stat bc745fee` toont naast `scripts/qa-v3-menu1.mjs` ook `ops/BACKLOG.md` en `ops/contracts/BL-024a.md`. De planningswijzigingen van de hoofdsessie (contract + backlogsplitsing BL-024 → a/b) zijn in de bouwcommit meegenomen. Gevolg: de rollback uit het contract (`git revert <commit>`, "één bestand geraakt") zou ook het contract en de backlogregels terugdraaien.
   Herstel (geen codewijziging): splits de commit, bijv. `git reset --soft 5d836728 && git restore --staged ops/ && git commit -m "ops: contract BL-024a, BL-024 gesplitst" -- ops/BACKLOG.md ops/contracts/BL-024a.md` gevolgd door `git commit -m "BL-024a: glascheck Menu 1 — toestandsmatrix #nieuw, vergrendeld hoofdstuk, blur over hele scrollhoogte" -- scripts/qa-v3-menu1.mjs` (body overnemen). Ops-commit vóór de bouwcommit, zodat `5d836728..HEAD` voor de bouw precies 1 commit met 1 bestand bevat; of het contract expliciet aanpassen als de hoofdsessie bundeling bewust wil. Daarna is alleen een herhaling van crit 1 nodig (de inhoud van het script verandert niet).

Buiten scope opgemerkt (→ backlog-idee):
- Vergrendeld hoofdstuk: het script controleert na de klik alleen dat `.v3Back` zichtbaar is, niet dat de geopende pagina die van hoofdstuk `id` is (bijv. `data-chapter`/titel). Zwakke postconditie; nu correct (probe bevestigt city2), maar een klik die een ander hoofdstuk opent zou niet opvallen.
- `toestand niet gewisseld`-check vergelijkt alleen het aantal afgeronde hoofdstukken; `#afgerond` vs `#bezig` met toevallig gelijk aantal zou ten onrechte falen (niet relevant voor `#nieuw`).
- De matrix draait `#nieuw` niet op `hoofdstuk` (actief) en `toetsresultaat`; contract vroeg dat ook niet.

Les (als die er is):
- Bouwcommits van subagents vegen ongecommitte ops-wijzigingen van de hoofdsessie mee (`git add -A`/`commit -a`). Hoofdsessie: commit contract en backlog vóór het delegeren; bouwer: commit alleen expliciet genoemde paden (`git commit -- <pad>`).

## Hertoets 2026-11-22 (alleen criterium 1)

VERDICT (hertoets): PASS — totaal BL-024a: PASS

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | Alleen het QA-script, in één commit | `git show --stat HEAD`, `git log --oneline 5d836728..HEAD` / `36224cf9..HEAD`, `git log --format='%H %P'`, `git diff bc745fee c1c092b8` | PASS | HEAD = c1c092b8, `--stat`: alleen `scripts/qa-v3-menu1.mjs` (+67/−21). Keten 5d836728 → 36224cf9 → c1c092b8 (parents geverifieerd). 36224cf9 raakt alleen `ops/BACKLOG.md` + `ops/contracts/BL-024a.md` (planning hoofdsessie). `git diff bc745fee c1c092b8` leeg; blob `scripts/qa-v3-menu1.mjs` gelijk (747fda65) in beide, dus crit 2–10 blijven geldig. Werkboom schoon behalve dit rapport. Commitboodschap gelijk aan contract; body meldt "Nieuwe meldingen …: geen". |

Opmerking: letterlijk geeft `git log --oneline 5d836728..HEAD` nu 2 commits. Dat is de splitsing die in de vorige FAIL als herstel was voorgesteld: de tweede commit is de ops-commit van de hoofdsessie (contract/backlog), geen bouwwerk. De bouw zelf (`36224cf9..HEAD`) is precies 1 commit met 1 bestand, en de rollback uit het contract (`git revert c1c092b8`) raakt alleen het script. Voor volgende contracten: basis-commit voor crit 1 pas vastleggen nadat de contract-commit bestaat.

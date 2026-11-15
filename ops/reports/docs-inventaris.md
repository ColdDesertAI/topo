# Docs-inventaris (BL-002): actueel, archief en gebroken verwijzingen

Contract `ops/contracts/BL-002.md` · bouwer: builder (Sonnet) · de evaluator oordeelt; dit rapport claimt geen PASS.

## Kop
| Onderdeel | Waarde |
|---|---|
| Datum | 2026-11-15 (nachtrun, branch `night/2026-11-15`) |
| BASE (inventaris, C1) | `c083832a64e9a688c5cc2ed6e5529d7a29b55059` (HEAD van de oude nachtbranch `night/2026-11-15` bij de start; de inventaris en alle BASE-cijfers hieronder zijn op deze commit gemeten; `git merge-base --is-ancestor 52427b5 c083832` slaagt) |
| BASE (C2, C3) | `c627d4d80da80bda86e47a2899454f25fd9155de` (`git rev-parse HEAD` bij de start van C2 op `claude/nightly-pr99-kaart-feestje-fvpl06`, bovenop `origin/main` `8ad5002`; het nachtwerk is hierheen overgezet met cherry-pick). `git diff --stat c083832 HEAD -- docs` was leeg: onder `docs/` is sinds de meting niets veranderd |
| `origin/main` | `52427b5c23413598a32566735d1067254a809329` bij de meting; nu `8ad5002` (BL-015 erbij, `52427b5` is voorouder van BASE C2) |
| C1 (inventaris, checker, contract) | `f11a79d` (oorspronkelijk `c083832` + C1 op de oude nachtbranch; hier overgezet) |
| C2 (verplaatsing) | `ff8596d` |
| C3 (cijfers na C2, boekhouding) | volgt (C3) |
| Vrije schijf bij de start | 9,7 GiB vrij (`df -h .`; contract eist ≥ 1 GB) |
| Baseline op BASE | `npm run lint` exit 0 · `npm test` exit 0 (6+4+4+10+9+33 tests, 0 fail) |
| Bestanden in `docs/qa/v3-reis/` | 33 (regels van `git ls-tree -r --name-only BASE -- docs/qa/v3-reis`) |
| Refs vóór de run | regels van `git for-each-ref refs/heads refs/remotes` = 134 · regels van `git tag -l` = 6 · `t/BL-002-docs-inventaris` = `44a4ce029fef044462d43d6b289403a0b38ae09d` |
| Docs-bestanden op BASE | 2373 getrackt onder `docs/` (qa 1463, visual 844, v3 29, root 27, geography 8, v4 1, superpowers 1) |

Afwijking bij de start: `git status --porcelain` was niet leeg (de planner liet `ops/contracts/BL-002.md` ongetrackt en `ops/BACKLOG.md` gewijzigd achter). Beide zijn bedoeld voor C1 en zijn daar opgenomen.

## Voorwerk t/BL-002-docs-inventaris
Branch `t/BL-002-docs-inventaris` (sha `44a4ce0`, alleen gelezen met `git log`, `git diff --name-only` en `git show`; ongewijzigd). Merge-base met `origin/main`: `b835a59`. De branch stamt van vóór #97 (BL-005-merge) en meet tegen `DRY` `df72c39`, niet tegen BASE.

**Commits (`%h %s`)**
- `44a4ce0` ops(BL-002): evaluatie docs-inventaris (PASS met voorbehoud)
- `ded045a` docs(BL-002): herstel na evaluatie (DRY-grootte, (d)/c-doel/c-bron, formuleringen, STATE, RUNLOG)
- `daf634f` docs(BL-002): docs-inventaris, verplaatsplan en linkanalyse (rapport, niets verplaatst)

**Gewijzigde bestanden**
| Bestand | Oordeel | Reden |
|---|---|---|
| `ops/BACKLOG.md` | vervalt | Alleen de BL-002-rij van die run; de nachtbranch heeft eigen BACKLOG-regels en BL-002 staat hier op de stand van BASE. |
| `ops/LEARNINGS.md` | vervalt | Les over de oude run (DRY-boom); hoort bij het oude rapport, niet bij de nieuwe meting. |
| `ops/RUNLOG.md` | vervalt | RUNLOG-regel van de oude run; de nachtbranch krijgt een eigen regel. |
| `ops/STATE.md` | vervalt | STATE-stand van 14-11; de nachtbranch heeft een nieuwere STATE. |
| `ops/contracts/BL-002.md` | vervangen | Het nieuwe contract (nachtrun 15-11) vervangt dit contract; het is op BASE niet getrackt en komt in C1. |
| `ops/reports/docs-inventaris.md` | vervangen | Oud rapport mat tegen de proefintegratie DRY (70 bestanden, 23 verplaatsingen incl. PROJECT_STATE en ROADMAP); BASE bevat docs/qa en docs/visual volledig. Indeling "release/handoff = archief" is overgenomen, elk getal is opnieuw gemeten, PROJECT_STATE en ROADMAP zijn archief-later (AGENTS.md). |
| ops/reports/eval-BL-002.md | vervalt | Evaluatie van het oude rapport (PASS met voorbehoud); beoordeelt een andere meting en blijft op de branch als historie. |

Verplaatsingen van die branch zijn niet overgenomen (er waren er geen: het oude rapport was alleen een voorstel). De branch blijft ongemoeid; voorstel voor `branches.md` staat in `## Verplaatsplan`.

## Inventaris
Besluiten: `actueel`, `archief` (verplaatst in C2), `archief-later` (blokkade in reden en in `## Verplaatsplan`), `bewijs` (QA- en visueel bewijs, blijft staan). `docs/qa/` en `docs/visual/` hebben één rij per submap, `docs/geography/` één rij. Tellingen: actueel 33, archief 19, archief-later 7, bewijs 37, samen 96 rijen.

| Pad | Soort | Laatst gewijzigd | Harde verwijzers | Besluit | Reden |
|---|---|---|---|---|---|
| `docs/AFTERNOON_IPAD_BETA_2026-10-26.md` | md | 2026-11-14 | — | archief | Sessieverslag iPad-beta 26-10 (datum in naam); alleen PROJECT_STATE verwijst ernaar (pad aan te passen) |
| `docs/APPROVED_ARTWORK_COMPUTER_RELEASE.md` | md | 2026-11-14 | — | archief | Releasebewijs goedgekeurd artwork (RELEASE in naam); alleen md-verwijzers, pad aan te passen |
| `docs/CODEX_INTEGRATION_QA_HANDOFF.md` | md | 2026-11-14 | — | archief | Handoff van Codex-integratie-QA (HANDOFF in naam); alleen md-verwijzers, pad aan te passen |
| `docs/COMPUTER_RELEASE_2026-10-30.md` | md | 2026-11-14 | — | archief | Release-kandidaat computer 30-10, door latere release vervangen (RELEASE + datum in naam) |
| `docs/CONTENT_MODEL.md` | md | 2026-09-28 | — | archief-later | Beschrijft V1-model met index.html als bron (45 items, 28-09); of V3-data dit vervangt is een inhoudelijk oordeel dat niet uit verwijzers volgt. Voorwaarde: Dennis of vervolgtaak (idee) toetst tegen docs/v3/SPEC.md |
| `docs/DECISIONS.md` | md | 2026-11-14 | AGENTS.md, CLAUDE.md | actueel | Beslislog, append-only; AGENTS.md en CLAUDE.md verwijzen ernaar (beslissing 5) |
| `docs/DESIGN_SYSTEM.md` | md | 2026-11-14 | scripts/v3/tokens.css | actueel | Ontwerpsysteem; scripts/v3/tokens.css, design-critic en ops/QUALITY.md verwijzen ernaar |
| `docs/DISCOVERY_MAP.md` | md | 2026-11-14 | — | archief | Feature-/releasedoc ontdekkingskaart (kandidaat-implementatie); alleen md-verwijzers, pad aan te passen |
| `docs/FOCUS_MODE.md` | md | 2026-11-14 | — | archief | Feature-/releasedoc focusmodus; alleen md-verwijzers, pad aan te passen |
| `docs/HERMES_QA_RELEASE_1.md` | md | 2026-11-14 | — | archief | QA-verslag Release 1 (RELEASE in naam); alleen md-verwijzers, pad aan te passen |
| `docs/INTEGRATED_RELEASE_CANDIDATE.md` | md | 2026-11-14 | — | archief | Integratie-release-kandidaat (RELEASE in naam); alleen md-verwijzers, pad aan te passen |
| `docs/LEARNING_MODEL.md` | md | 2026-09-28 | — | archief-later | Leermodel van 28-09 (schema 3); PRODUCT_SPEC en LEERROUTE_DESIGN verwijzen ernaar en blijven staan of gaan samen. Voorwaarde: beoordeling samen met PRODUCT_SPEC |
| `docs/LEERROUTE_DESIGN.md` | md | 2026-09-28 | — | archief-later | Ontwerpuitkomst leerroute (28-09), geen verwijzers maar geen RELEASE/HANDOFF/datum-signaal; twijfel dus archief-later. Voorwaarde: Dennis of vervolgtaak (idee) beslist of de leerroute in V3 nog leidend is |
| `docs/MAP_PICKER_58.md` | md | 2026-11-14 | — | archief | Feature-/releasedoc kaartkiezer PR58; MAP_SYSTEM en PROJECT_STATE verwijzen ernaar (pad aan te passen) |
| `docs/MAP_SELECTION_HOTFIX.md` | md | 2026-11-14 | — | archief | Hotfixverslag kaartselectie; MAP_SYSTEM en PROJECT_STATE verwijzen ernaar (pad aan te passen) |
| `docs/MAP_SYSTEM.md` | md | 2026-11-14 | AGENTS.md | actueel | Kaartsysteem en geografie-regels; AGENTS.md verwijst ernaar (beslissing 5) |
| `docs/OFFLINE_COMPUTER_50.md` | md | 2026-11-14 | — | archief | Release-/featuredoc offline computerversie PR50; alleen PROJECT_STATE verwijst ernaar (pad aan te passen) |
| `docs/PRODUCT_SPEC.md` | md | 2026-09-28 | — | archief-later | Productspec van 28-09 (V1/V2-gedrag); ops/MEMORY.md verwijst ernaar. Voorwaarde: ops/MEMORY.md aanpassen en beoordelen tegen docs/v3/SPEC.md (vervolgtaak, idee) |
| `docs/PROJECT_STATE.md` | md | 2026-11-14 | AGENTS.md | archief-later | AGENTS.md (r.9 en r.15), README.md en docs/v3/OVERDRACHT.md verwijzen ernaar; ops/STATE.md vervangt het inhoudelijk. Voorwaarde: AGENTS.md-wijziging (tekstvoorstel in Verplaatsplan) door Dennis goedgekeurd |
| `docs/RELEASE_1_1.md` | md | 2026-11-14 | — | archief | Releasedoc 1.1 (RELEASE in naam); alleen PROJECT_STATE en JSON-bewijs verwijzen ernaar |
| `docs/RELEASE_1_2.md` | md | 2026-11-14 | — | archief | Releasedoc 1.2 (RELEASE in naam); alleen PROJECT_STATE en JSON-bewijs verwijzen ernaar |
| `docs/RELEASE_1_2_INTEGRATION.md` | md | 2026-11-14 | — | archief | Integratiedoc release 1.2 (RELEASE in naam); alleen PROJECT_STATE en JSON-bewijs verwijzen ernaar |
| `docs/RELEASE_1_INTEGRATION.md` | md | 2026-11-14 | — | archief | Integratiedoc release 1 (RELEASE in naam); alleen md-verwijzers, pad aan te passen |
| `docs/ROADMAP.md` | md | 2026-11-14 | AGENTS.md, CLAUDE.md | archief-later | AGENTS.md (r.18), planner-agent en ops/README.md verwijzen ernaar (CLAUDE.md noemt alleen ops/ROADMAP.md); ops/ROADMAP.md vervangt het inhoudelijk. Voorwaarde: AGENTS.md-wijziging (tekstvoorstel) goedgekeurd |
| `docs/SCHOOLBLAD_OVERLAY.md` | md | 2026-11-14 | — | archief | Feature-/releasedoc schoolbladoverlay; alleen PROJECT_STATE verwijst ernaar (pad aan te passen) |
| `docs/V2_AFSLUITING.md` | md | 2026-11-14 | — | archief | V2-afsluiting 8-11 (AFSLUITING in naam), V2 is gesloten; alleen docs/v3/AUDIT.md verwijst ernaar (pad aan te passen) |
| `docs/WORK_HANDOFF_2026-10-23.md` | md | 2026-11-14 | — | archief | Werkoverdracht 23-10 (HANDOFF + datum in naam); alleen work-sync/2026-10-23/README.md verwijst ernaar |
| `docs/geography/` | map (8 bestanden) | 2026-11-14 | AGENTS.md, scripts/audit-map-picker-revision.mjs, scripts/geography/generate-apennines.py, scripts/geography/qa-apennines.py, scripts/qa-computer-release.mjs, scripts/work-regression.cjs | actueel | Geografische bron en provenance; AGENTS.md-regel "geografie niet raden" wijst hierheen, buiten scope voor verplaatsing |
| `docs/qa/approved-artwork-20261030/` | map (149 bestanden) | 2026-11-14 | scripts/qa-approved-selection-artwork.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/computer-release-20261030/` | map (134 bestanden) | 2026-11-14 | scripts/qa-computer-release.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/f1-71/` | map (29 bestanden) | 2026-11-14 | scripts/qa-f1-navigation.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/integration-lead-20261030/` | map (163 bestanden) | 2026-11-14 | scripts/qa-integrated-backup-transfer.mjs, scripts/qa-integrated-native-safari.py, scripts/summarize-integrated-release.mjs, scripts/validate-integrated-release.sh | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/nino-2.0.2/` | map (15 bestanden) | 2026-11-14 | scripts/qa-nino-202-exam-result.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/nino-v2-closure-67/` | map (47 bestanden) | 2026-11-14 | scripts/audit-nino-v2.mjs, scripts/close-nino-artwork-67.py, scripts/embed-nino-v2.mjs, scripts/focus-source.mjs, scripts/inventory-nino-artwork-67.py, scripts/qa-nino-artwork-67.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/nino-v2-integration/` | map (129 bestanden) | 2026-11-14 | scripts/audit-nino-v2.mjs, scripts/qa-nino-v2-played.mjs, scripts/qa-nino-v2.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/nino-v2-qa-refresh/` | map (16 bestanden) | 2026-11-14 | — | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/playable-20261104/` | map (93 bestanden) | 2026-11-14 | scripts/qa-nino-compare.mjs, scripts/qa-nino-playable.mjs, scripts/qa-nino-profile-transfer.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/playable-20261106/` | map (82 bestanden) | 2026-11-14 | scripts/qa-nino-candidate.mjs, scripts/qa-nino-compare.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/ux-20261107-r2/` | map (105 bestanden) | 2026-11-14 | scripts/qa-nino-ux-round.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/ux-20261107/` | map (30 bestanden) | 2026-11-14 | scripts/qa-nino-ux-round.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/v3-afwerking/` | map (2 bestanden) | 2026-11-14 | scripts/qa-v3-afwerking.py | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/v3-faseb/` | map (35 bestanden) | 2026-11-14 | scripts/qa-v3-faseb-beloningen.py, scripts/qa-v3-faseb-les.py, scripts/qa-v3-faseb-oefenen.py, scripts/qa-v3-faseb-toets.py, scripts/qa-v3-faseb-voortgang.py, scripts/qa-v3-faseb.py | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/v3-glas/` | map (18 bestanden) | 2026-11-14 | scripts/qa-v3-glas.py | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/v3-kennismaking/` | map (15 bestanden) | 2026-11-14 | scripts/qa-v3-kennismaking.py | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/v3-les/` | map (57 bestanden) | 2026-11-14 | scripts/qa-v3-les.py, scripts/qa-v3-toets-beloning.py | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/v3-reis/` | map (33 bestanden) | 2026-11-14 | scripts/qa-v3-reis.py | bewijs | QA-bewijs V3 reis; blijft staan (beslissing 3: staat op BASE, docs/v3/ verwijst ernaar) |
| `docs/qa/v3-schoolblad/` | map (32 bestanden) | 2026-11-14 | scripts/qa-v3-schoolblad.py | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/v3-shell/` | map (44 bestanden) | 2026-11-14 | scripts/qa-v3-shell.py | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/v3-stijlbeeld/` | map (196 bestanden) | 2026-11-14 | scripts/qa-v3-all.py, scripts/qa-v3-comparisons.py, scripts/qa-v3-faseb-beloningen.py, scripts/qa-v3-faseb-les.py, scripts/qa-v3-faseb-oefenen.py, scripts/qa-v3-faseb-toets.py, scripts/qa-v3-faseb-voortgang.py, scripts/qa-v3-faseb.py, scripts/qa-v3-glas.py, scripts/qa-v3-landmarks.py, scripts/qa-v3-master-assets.py, scripts/qa-v3-ronde2.py, scripts/qa-v3-ronde3.py, scripts/qa-v3-ronde4.py, scripts/qa-v3-ronde5.py, scripts/qa-v3-ronde5b.py, scripts/qa-v3-stijlbeeld.py, scripts/test-v3-qa-runner.py | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/v3-toets/` | map (17 bestanden) | 2026-11-14 | scripts/qa-v3-toets.py | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/qa/v3-voortgang/` | map (22 bestanden) | 2026-11-14 | scripts/qa-v3-voortgang.py | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/superpowers/plans/2026-11-04-nino-playable.md` | md (plan) | 2026-11-14 | — | archief | Implementatieplan NINO 2.0 playable (datum in naam), PR71-kandidaat is gesloten; geen verwijzers |
| `docs/v3/ARTWORK-INVENTARIS-RONDE3.md` | md | 2026-11-14 | scripts/qa-v3-ronde3.py | actueel | Actief V3-document: Artworkinventaris — Ronde 3, punt 19 |
| `docs/v3/ARTWORK_BRIEF.md` | md | 2026-11-14 | scripts/qa-v3-stijlbeeld.py | actueel | Actief V3-document: V3 — Artworkbrief: renderniveau |
| `docs/v3/ASSETDIEET.md` | md | 2026-11-14 | scripts/build-v3-preview.mjs, scripts/v3-assets-export.py, scripts/v3-assets-inventaris.py | actueel | Actief V3-document: Assetdieet: de V3-uitvoer kleiner en lichter (opdracht, 12-11) |
| `docs/v3/AUDIT.md` | md | 2026-11-14 | — | actueel | Actief V3-document: V3-basisaudit, 9 november 2026 |
| `docs/v3/DESIGN_AUDIT_V3_0.md` | md | 2026-11-14 | scripts/qa-v3-glas.py, scripts/v3/glas.css | actueel | Actief V3-document: Ontwerpaudit V3.0 tegen de conceptrenders |
| `docs/v3/DESIGN_FEEDBACK.md` | md | 2026-11-14 | — | actueel | Actief V3-document: V3 — ontwerpfeedback van de eigenaar |
| `docs/v3/GE01.md` | md | 2026-11-14 | scripts/qa-v3-les.py, scripts/v3/les.css, scripts/v3/les.js | actueel | Actief V3-document: Golden Experience 01 — beat 3–7 (spec, 9 november 2026) |
| `docs/v3/LANDMARKS-ONTBREKEND.md` | md | 2026-11-14 | — | actueel | Actief V3-document: Ontbrekende landmarks per hoofdstuk (ronde 5 punt 2) |
| `docs/v3/OVERDRACHT.md` | md | 2026-11-14 | AGENTS.md, scripts/qa-v3-ronde5.py, scripts/v3-assets-inventaris.py, scripts/v3/ronde4.css, scripts/v3/ronde5.css | actueel | Actief V3-document: Overdracht V3.0 — bouw naar Codex (10-11) |
| `docs/v3/RELIEF_RENDER.md` | md | 2026-11-14 | — | actueel | Actief V3-document: Pakket reliëf-render (opdracht, 13-11) |
| `docs/v3/SPEC.md` | md | 2026-11-14 | AGENTS.md | actueel | Actief V3-document: V3 — huidige waarheid (één pagina) |
| `docs/v3/STAP0_BRON.md` | md | 2026-11-14 | AGENTS.md | actueel | Actief V3-document: Stap 0: `index.html` opsplitsen in bronbestanden (geen gedragswijziging) |
| `docs/v3/V3_0_REST.md` | md | 2026-11-14 | scripts/qa-v3-kennismaking.py, scripts/qa-v3-schoolblad.py, scripts/qa-v3-shell.py, scripts/qa-v3-toets.py, scripts/qa-v3-voortgang.py, scripts/v3/kennismaking.js, scripts/v3/reis.js, scripts/v3/schoolblad.js, scripts/v3/shell.css, scripts/v3/shell.js, scripts/v3/toets.js, scripts/v3/voortgang.js | actueel | Actief V3-document: V3.0 — resterende schermen |
| `docs/v3/assets-inventaris.json` | json | 2026-11-14 | scripts/qa-v3-stijlbeeld.py, scripts/v3-assets-export.py, scripts/v3-assets-inventaris.py | actueel | V3-inventarisatiedata; docs/v3/ blijft staan (contract) |
| `docs/v3/ideeen/README.md` | md | 2026-11-14 | — | actueel | Actief V3-document: Ideeën V3.1 |
| `docs/v3/ideeen/UIT-torino-concept.webp` | webp | 2026-11-14 | — | actueel | Doelrender V3.0 (ontwerpreferentie voor de bouw); docs/v3/ blijft staan (contract) |
| `docs/v3/renders/B-voortgang-benchmark.webp` | webp | 2026-11-14 | — | actueel | Doelrender V3.0 (ontwerpreferentie voor de bouw); docs/v3/ blijft staan (contract) |
| `docs/v3/renders/R-beloningen.webp` | webp | 2026-11-14 | scripts/qa-v3-faseb-beloningen.py | actueel | Doelrender V3.0 (ontwerpreferentie voor de bouw); docs/v3/ blijft staan (contract) |
| `docs/v3/renders/R-les.webp` | webp | 2026-11-14 | scripts/qa-v3-faseb-les.py | actueel | Doelrender V3.0 (ontwerpreferentie voor de bouw); docs/v3/ blijft staan (contract) |
| `docs/v3/renders/R-oefenen-ijk-rust.webp` | webp | 2026-11-14 | — | actueel | Doelrender V3.0 (ontwerpreferentie voor de bouw); docs/v3/ blijft staan (contract) |
| `docs/v3/renders/R-oefenen-ijk.webp` | webp | 2026-11-14 | scripts/qa-v3-faseb-oefenen.py | actueel | Doelrender V3.0 (ontwerpreferentie voor de bouw); docs/v3/ blijft staan (contract) |
| `docs/v3/renders/R-oefenen.webp` | webp | 2026-11-14 | — | actueel | Doelrender V3.0 (ontwerpreferentie voor de bouw); docs/v3/ blijft staan (contract) |
| `docs/v3/renders/R-reis-ijk.webp` | webp | 2026-11-14 | scripts/qa-v3-faseb.py, scripts/qa-v3-ronde5.py | actueel | Doelrender V3.0 (ontwerpreferentie voor de bouw); docs/v3/ blijft staan (contract) |
| `docs/v3/renders/R-toets-instellen.webp` | webp | 2026-11-14 | scripts/qa-v3-faseb-toets.py | actueel | Doelrender V3.0 (ontwerpreferentie voor de bouw); docs/v3/ blijft staan (contract) |
| `docs/v3/renders/R-toets-resultaat.webp` | webp | 2026-11-14 | scripts/qa-v3-faseb-toets.py | actueel | Doelrender V3.0 (ontwerpreferentie voor de bouw); docs/v3/ blijft staan (contract) |
| `docs/v3/renders/R-voortgang-doel.webp` | webp | 2026-11-14 | — | actueel | Doelrender V3.0 (ontwerpreferentie voor de bouw); docs/v3/ blijft staan (contract) |
| `docs/v3/renders/R-voortgang-ijk.webp` | webp | 2026-11-14 | — | actueel | Doelrender V3.0 (ontwerpreferentie voor de bouw); docs/v3/ blijft staan (contract) |
| `docs/v3/renders/R-voortgang.webp` | webp | 2026-11-14 | scripts/qa-v3-faseb-voortgang.py | actueel | Doelrender V3.0 (ontwerpreferentie voor de bouw); docs/v3/ blijft staan (contract) |
| `docs/v3/renders/README.md` | md | 2026-11-14 | scripts/qa-v3-afwerking.py, scripts/qa-v3-faseb-beloningen.py, scripts/qa-v3-faseb-les.py, scripts/qa-v3-faseb-oefenen.py, scripts/qa-v3-faseb-toets.py, scripts/qa-v3-faseb-voortgang.py, scripts/qa-v3-faseb.py, scripts/qa-v3-glas.py, scripts/v3/afwerking.css, scripts/v3/beloningen-ijk.css, scripts/v3/glas.css, scripts/v3/iconen.js, scripts/v3/les-ijk.css, scripts/v3/oefenen-ijk.css, scripts/v3/reis-ijk.css, scripts/v3/stijl.css, scripts/v3/toets-ijk.css, scripts/v3/voortgang-ijk.css | actueel | Actief V3-document: V3.0 doelrenders |
| `docs/v4/FRANKRIJK_HANDOFF.md` | md | 2026-11-14 | — | archief-later | HANDOFF in naam, maar actief document van het parallelle Frankrijk-spoor (land/fr-geo en land/fr-inhoud bouwen erop; verwijst zelf naar docs/v4/fr-*.md). Voorwaarde: pas verplaatsen na afronding Frankrijk-spoor (M1+) |
| `docs/visual/discovery-map/` | map (98 bestanden) | 2026-11-14 | scripts/qa-discovery-map.mjs, scripts/qa-nino-compare.mjs, scripts/render-discovery-comparison.py | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/visual/focus-mode/` | map (48 bestanden) | 2026-11-14 | scripts/qa-focus-mode.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/visual/ipad-update-47/` | map (62 bestanden) | 2026-11-14 | scripts/audit-release-1-2.mjs, scripts/geography/qa-apennines.py, scripts/qa-ipad-update.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/visual/lakes/` | map (24 bestanden) | 2026-11-14 | scripts/geography/qa-lakes.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/visual/map-hit-hotfix/` | map (33 bestanden) | 2026-11-14 | scripts/qa-map-hit.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/visual/map-picker-58-revision/` | map (156 bestanden) | 2026-11-14 | scripts/audit-map-picker-revision.mjs, scripts/qa-map-picker-revision-extra.mjs, scripts/qa-map-picker-revision-taps.mjs, scripts/qa-map-picker-revision.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/visual/map-picker-58/` | map (166 bestanden) | 2026-11-14 | scripts/audit-map-picker-revision.mjs, scripts/map-hit.test.mjs, scripts/qa-map-picker-occluded.mjs, scripts/qa-map-picker-revision-extra.mjs, scripts/qa-map-picker-revision-taps.mjs, scripts/qa-map-picker-revision.mjs, scripts/qa-map-picker-same-tap.mjs, scripts/qa-map-picker-sessions.mjs, scripts/qa-map-picker.mjs, scripts/qa-picker-before.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/visual/offline-computer/` | map (59 bestanden) | 2026-11-14 | scripts/qa-offline-computer.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/visual/release-1-1/` | map (19 bestanden) | 2026-11-14 | scripts/qa-polish.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/visual/release-1-2-integration/` | map (93 bestanden) | 2026-11-14 | scripts/qa-release-1-2-integration.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/visual/release-1-2/` | map (40 bestanden) | 2026-11-14 | scripts/qa-nino-art.mjs, scripts/qa-release-1-2-integration.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/visual/release-1-qa-fixes/` | map (4 bestanden) | 2026-11-14 | scripts/qa-findings-browser.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/visual/release-1/` | map (12 bestanden) | 2026-11-14 | scripts/qa-findings-browser.mjs, scripts/qa-nino-art.mjs, scripts/qa-polish.mjs, scripts/qa-release-1-2-integration.mjs, scripts/qa-release-1.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |
| `docs/visual/schoolblad/` | map (30 bestanden) | 2026-11-14 | scripts/qa-schoolblad.mjs | bewijs | QA-/visueel bewijs bij een release of fase; blijft in docs/qa en docs/visual (buiten verplaatsscope, md-bestanden hierin niet bewerkbaar) |

## Gebroken verwijzingen
Meting: `node scripts/check-doc-links.mjs --rev <commit>`. Totaal op BASE (`c083832`): **73**; totaal op HEAD na C2 en C3: **97**. Alle 73 op BASE zijn klasse B (backtick-paden); klasse A (markdown-links) heeft op BASE 0 gebroken links, ook in `docs/v3/`. Daarom is er geen enkele platte-tekstvervanging volgens beslissing 4 nodig en is er in `docs/v3/` alleen een padaanpassing gedaan (`AUDIT.md`: link naar `../archive/V2_AFSLUITING.md`).

**Cijfers na C2 (vergelijkingssleutel `cut -f1,3,5`, met de rename-lijst toegepast op de bronkolom van BASE):** de 24 extra regels op HEAD zijn: (1) 19 inventarisrijen in dit rapport met het BASE-pad van een verplaatst bestand (criterium 3 eist dat BASE-pad in backticks, criterium 9 telt het als gebroken; dit contractconflict is niet op te lossen zonder de checkerdefinitie te wijzigen, zie het verslag van de bouwer) en (2) 5 voorbeeldpaden in `ops/contracts/BL-002.md` (docs/X.md, docs/a/b.md, docs/archive/X.md, docs/archive/a/b.md, ops/contracts/doel; niet-bewerkbaar, het contract bestond niet op BASE). Alle andere verwijzingen in dit rapport die geen BASE-pad van een verplaatst bestand zijn, staan als platte tekst (zonder backticks) zodat het rapport zelf niets nieuws breekt. De regels van `docs/DECISIONS.md` met een oud pad vallen onder de contractuitzondering (0 aanwezig: de toegevoegde regel noemt geen oud pad). In de bronkolom van BASE zijn geen bestanden verplaatst die gebroken verwijzingen bevatten, behalve docs/V2_AFSLUITING.md (rij `docs`→docs/nino, nu bron `docs/archive/V2_AFSLUITING.md`): dezelfde sleutel, geen nieuw gebroken. Gemeten tegen de directe voorganger van C2 (`c627d4d`) zijn er 0 nieuwe sleutels behalve de 19 inventarisrijen.

**Verschil met de ±240 uit eval-BL-005:** dat getal kwam uit een andere meting op een andere boom. Eval-BL-005 telde relatieve links in de proefintegratie `DRY` (waar `docs/qa/` op 128 bestanden na en `docs/visual/` op 1 na waren uitgesloten). BASE bevat na de BL-005-merge (#97) `docs/qa/` (1463) en `docs/visual/` (844) volledig, dus die ±240 links zijn hier niet gebroken. De checker meet bovendien alleen markdown-links en backtick-paden die met `docs|ops|scripts|src|assets|output|work-sync` beginnen, niet kale bestandsnamen.

**Besluit `docs/qa/v3-reis/` (beslissing 3):** blijft staan als `bewijs`; 33 bestanden op BASE (gemeten), `docs/v3/` verwijst ernaar. Open vraag uit BL-005b hiermee beantwoord. Niets hersteld of toegevoegd.

| Bronmap | Doelmap | Klasse | Aantal BASE | Aantal HEAD | Besluit |
|---|---|---|---|---|---|
| .claude/commands | ops/contracts | B | 1 | 1 | laten: historisch |
| assets/nino | assets/nino | B | 2 | 2 | laten: historisch |
| assets/v3 | assets/art | B | 1 | 1 | vervolgtaak BL-005b |
| docs | assets/art | B | 1 | 1 | vervolgtaak BL-005b |
| docs | docs | B | 0 | 2 | laten: historisch (inventarisrij met BASE-pad) |
| docs | docs | B | 1 | 1 | vervolgtaak BL-005b |
| docs | docs/nino | B | 1 | 0 | laten: historisch |
| docs | docs/v3 | B | 2 | 2 | laten: historisch |
| docs | docs/v3 | B | 1 | 1 | vervolgtaak BL-005b |
| docs/archive | docs/nino | B | 0 | 1 | laten: historisch |
| docs/qa | docs/qa | B | 1 | 1 | via tag archive/v3-qa |
| docs/qa | output/html | B | 3 | 3 | via tag archive/v3-output-html |
| docs/qa | scripts/discovery-map.js | B | 1 | 1 | laten: historisch |
| docs/v3 | assets/nino | B | 2 | 2 | laten: historisch |
| docs/v3 | assets/v3 | B | 1 | 1 | laten: historisch |
| docs/v3 | scripts | B | 1 | 1 | laten: historisch |
| docs/v4 | assets/art | B | 1 | 1 | vervolgtaak BL-005b |
| docs/v4 | docs/v3 | B | 1 | 1 | vervolgtaak BL-005b |
| docs/v4 | docs/v4 | B | 2 | 2 | vervolgtaak BL-005b |
| docs/v4 | src/lands | B | 1 | 1 | laten: historisch |
| ops | docs | B | 3 | 1 | laten: historisch |
| ops | ops | B | 2 | 2 | laten: historisch |
| ops | ops/briefs | B | 1 | 1 | laten: historisch |
| ops | src/lands | B | 3 | 3 | laten: historisch |
| ops/contracts | docs | B | 0 | 1 | laten: historisch |
| ops/contracts | docs/a | B | 0 | 1 | laten: historisch |
| ops/contracts | docs/archive | B | 0 | 2 | laten: historisch |
| ops/contracts | ops/contracts | A | 0 | 2 | laten: historisch |
| ops/playbooks | scripts/land | B | 3 | 3 | laten: historisch |
| ops/reports | assets | B | 5 | 5 | vervolgtaak BL-005b |
| ops/reports | docs | B | 6 | 5 | laten: historisch |
| ops/reports | docs | B | 0 | 18 | laten: historisch (inventarisrij met BASE-pad) |
| ops/reports | docs | B | 1 | 1 | vervolgtaak BL-005b |
| ops/reports | docs/superpowers | B | 0 | 1 | laten: historisch (inventarisrij met BASE-pad) |
| ops/reports | ops | B | 24 | 24 | laten: historisch |
| ops/templates | docs/v3 | B | 1 | 1 | laten: historisch |
| **Totaal** | | | **73** | **97** | |

Bronmap en doelmap zijn de map van het bronbestand en van het opgeloste doel, afgekapt op twee niveaus. Toelichting op de besluiten: *laten: historisch* = verslag, branchnaam of sjabloon dat geen echt pad bedoelt (`ops/reports/branches.md` noemt branchnamen als ops/setup); *vervolgtaak BL-005b* = het doel bestaat op een keep-branch (`art/master`, `arch/v3-runtime`, `land/fr-*`) en lost op zodra die landt; *via tag archive/…* = uitgesloten bewijs, de tag maakt BL-005c. Zes doelen in actieve documenten bestaan op geen enkele keep-branch (assets/nino/…, scripts/render-relief-v3.py, assets/v3/landmarks/italia-landmarks-atlas.png, docs/v3/DESIGN_RULES.md, docs/nino/APP_ICON_SPEC.md, src/lands/…): het contract staat geen herstel van binaire bestanden toe en klasse B valt buiten beslissing 4; ze blijven staan en horen als `idee` bij de hoofdsessie. De regel docs/DECISIONS.md:202,226 in `integratie.md` is een regelreeks die de checker (alleen `:N` en `:N-M`) niet strippen kan.

## Verplaatsplan
**Uitgevoerd in C2 (19 bestanden, `git mv`, subpad behouden):**

| Oud pad | Nieuw pad |
|---|---|
| docs/AFTERNOON_IPAD_BETA_2026-10-26.md | `docs/archive/AFTERNOON_IPAD_BETA_2026-10-26.md` |
| docs/APPROVED_ARTWORK_COMPUTER_RELEASE.md | `docs/archive/APPROVED_ARTWORK_COMPUTER_RELEASE.md` |
| docs/CODEX_INTEGRATION_QA_HANDOFF.md | `docs/archive/CODEX_INTEGRATION_QA_HANDOFF.md` |
| docs/COMPUTER_RELEASE_2026-10-30.md | `docs/archive/COMPUTER_RELEASE_2026-10-30.md` |
| docs/DISCOVERY_MAP.md | `docs/archive/DISCOVERY_MAP.md` |
| docs/FOCUS_MODE.md | `docs/archive/FOCUS_MODE.md` |
| docs/HERMES_QA_RELEASE_1.md | `docs/archive/HERMES_QA_RELEASE_1.md` |
| docs/INTEGRATED_RELEASE_CANDIDATE.md | `docs/archive/INTEGRATED_RELEASE_CANDIDATE.md` |
| docs/MAP_PICKER_58.md | `docs/archive/MAP_PICKER_58.md` |
| docs/MAP_SELECTION_HOTFIX.md | `docs/archive/MAP_SELECTION_HOTFIX.md` |
| docs/OFFLINE_COMPUTER_50.md | `docs/archive/OFFLINE_COMPUTER_50.md` |
| docs/RELEASE_1_1.md | `docs/archive/RELEASE_1_1.md` |
| docs/RELEASE_1_2.md | `docs/archive/RELEASE_1_2.md` |
| docs/RELEASE_1_2_INTEGRATION.md | `docs/archive/RELEASE_1_2_INTEGRATION.md` |
| docs/RELEASE_1_INTEGRATION.md | `docs/archive/RELEASE_1_INTEGRATION.md` |
| docs/SCHOOLBLAD_OVERLAY.md | `docs/archive/SCHOOLBLAD_OVERLAY.md` |
| docs/V2_AFSLUITING.md | `docs/archive/V2_AFSLUITING.md` |
| docs/WORK_HANDOFF_2026-10-23.md | `docs/archive/WORK_HANDOFF_2026-10-23.md` |
| docs/superpowers/plans/2026-11-04-nino-playable.md | `docs/archive/superpowers/plans/2026-11-04-nino-playable.md` |

Veiligheid (criterium 5): per bestand geen treffer van de bestandsnaam in `AGENTS.md`, `CLAUDE.md`, `scripts/`, `src/`, `package.json`, `vercel.json`, `index.html` (`git grep -l -F` op BASE); geen keep-branch wijzigt het bestand na BASE (`git log --oneline BASE..<ref> -- <pad>` leeg voor alle 10 keep-branches); geen pad onder `docs/qa|visual|geography|v3/` en geen van de bestanden uit beslissing 5. Padaanpassingen in C2: links en docs/…-paden in bewerkbare md-bestanden (`README.md`, `work-sync/`, `docs/`, `ops/*.md`); `docs/DECISIONS.md` krijgt één regel met de verwijzing hiernaar. JSON-bewijs (`docs/visual/release-1-2-integration/changed-files.json`, `docs/qa/nino-v2-closure-67/SHA256SUMS.txt`) noemt oude paden als tekst en blijft ongewijzigd.

**Blijft staan, `archief-later` (7):**

| Pad | Blokkade en voorwaarde |
|---|---|
| `docs/CONTENT_MODEL.md` | inhoudelijk oordeel: V1-beschrijving (index.html als bron, 45 items); geen verwijzers, dus geen technische blokkade. Voorwaarde: Dennis of vervolgtaak (`idee`, nieuw BL-ID via hoofdsessie) beoordeelt tegen `docs/v3/SPEC.md`; bij "verouderd" verplaatsen met dezelfde `git mv`-methode. |
| `docs/LEARNING_MODEL.md` | PRODUCT_SPEC en LEERROUTE_DESIGN verwijzen ernaar. Voorwaarde: samen met `docs/PRODUCT_SPEC.md` en `docs/LEERROUTE_DESIGN.md` beoordelen; verplaats de drie in één commit. |
| `docs/LEERROUTE_DESIGN.md` | geen verwijzers, maar geen RELEASE/HANDOFF-signaal; twijfel is archief-later. Voorwaarde: beslissing Dennis of de leerroute in V3 nog leidend is (idee-taak). |
| `docs/PRODUCT_SPEC.md` | `ops/MEMORY.md` verwijst ernaar. Voorwaarde: `ops/MEMORY.md`-verwijzing aanpassen én beoordelen tegen `docs/v3/SPEC.md` (idee-taak). |
| `docs/PROJECT_STATE.md` | `AGENTS.md` r.9 en r.15 verwijzen ernaar (plus `README.md`, `docs/v3/OVERDRACHT.md`). Voorwaarde: Dennis keurt het AGENTS.md-voorstel hieronder goed (idee-taak "AGENTS.md naar ops/STATE.md"); daarna `git mv` en padaanpassingen in README/OVERDRACHT. |
| `docs/ROADMAP.md` | `AGENTS.md` r.18 verwijst ernaar (CLAUDE.md noemt alleen `ops/ROADMAP.md`). Voorwaarde: zelfde AGENTS.md-goedkeuring als PROJECT_STATE; daarna `git mv`. |
| `docs/v4/FRANKRIJK_HANDOFF.md` | HANDOFF in de naam, maar het is het actieve overdrachtsdocument van het Frankrijk-spoor (`land/fr-geo`, `land/fr-inhoud`). Voorwaarde: Frankrijk-spoor afgerond (na M1) of Dennis beslist eerder; dan `git mv` naar docs/archive/v4/. |

**Tekstvoorstel `AGENTS.md` (niet toegepast; `AGENTS.md` valt buiten deze nachtrun):**
```
r.9:  1. Read `ops/STATE.md` first; read `docs/MAP_SYSTEM.md` before map or geography changes and `docs/DECISIONS.md` before product decisions.
r.15: 7. Update `ops/STATE.md` after meaningful implementation work. Append decisions to `docs/DECISIONS.md`; mark superseded decisions explicitly without erasing history. Intended behavior belongs in the other docs, not in undocumented agent memory.
r.18: Priority: geographic correctness → educational effectiveness → clarity → usability → consistency → engagement. See `ops/ROADMAP.md` for the single recommended next package.
```
Vervolgtaak (idee voor de backlog, door de hoofdsessie): "AGENTS.md verwijst naar ops/STATE.md en ops/ROADMAP.md, daarna `docs/PROJECT_STATE.md` en `docs/ROADMAP.md` naar `docs/archive/`". Beslissing van Dennis nodig (wijziging van projectregels).

**Voorstel `branches.md` voor `t/BL-002-docs-inventaris` (actie na PASS van deze taak, niet uitgevoerd):** rij `t/BL-002-docs-inventaris` van `keep` naar `archive` (tag via BL-005c, daarna `delete`), reden: voorwerk is vervangen door `night/2026-11-15` (zie `## Voorwerk`: 0 overgenomen, 2 vervangen, 5 vervallen). Pas verwijderen na akkoord van Dennis.

## Rollback
- Verplaatsing en padaanpassingen terugdraaien: `git revert <C2>`. C2 bevat alleen renames en `M` op `*.md`, en latere commits raken `docs/archive/` en de oude paden niet; het revert gaat dus zonder conflict.
- Checker, rapport en boekhouding: `git revert <C3> <C1>` (documenten en één los script).
- Geen refs aangeraakt, geen merge, geen push, niets naar `main`.

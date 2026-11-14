# Evaluatie BL-003: `ops/STATE.md` herleidbaar, gecorrigeerd en aangevuld met V3.0

## Eindverdict: PASS met voorbehoud (run 3, `f1da4bf`)

Getoetst tegen de **aangepaste basis `c052f24`** (de stand vlak vóór BL-003 na de rebase op `origin/main` @ `95d161a`), niet tegen `44a4ce0` uit het contract. Voor criterium 9 is de maatstaf de STATE van `main` @ `95d161a` plus de BL-002-toevoeging in `c052f24`.

| Run | Commit | Verdict | Kern |
|---|---|---|---|
| 1 | `e717dd9` | FAIL (9/10) | 5 (inhoud): r. 60, r. 57 en r. 46 werden niet gedragen door hun verwijzing |
| 2 | `f533170` | FAIL (9/10) | Alles uit run 1 hersteld, 5b 8/8. 5a: `MIST b9e4a38` in r. 27 (ontstaan door mijn eigen advies) |
| 3 | `f1da4bf` | PASS met voorbehoud (10/10) | Alleen r. 27 gewijzigd, zonder sha. 5a geeft 0 `MIST` |

**Run 3, zelf gemeten.** `git diff f533170 f1da4bf` raakt alleen `ops/STATE.md` r. 27. De nieuwe tekst is letterlijk de formulering die ik in run 2 voorstelde. `git diff e717dd9..f1da4bf --stat` geeft STATE 7+/7− en RUNLOG 1+/1−; dat zijn run 2 en run 3 samen. In r. 27 staat `7714e22` · 2026-11-13, gelijk aan `git rev-parse --short=7 origin/art/master` en `%cs`.

## Eindstand per criterium (`f1da4bf`)

| # | Verdict | Gemeten |
|---|---|---|
| 1 | PASS | `c052f24` is voorouder; gewijzigd zijn alleen STATE, BACKLOG, RUNLOG en `contracts/BL-003.md`; 0 bestanden buiten `ops/` tegen `origin/main`; tags-hash `90e8b859…` ongewijzigd |
| 2 | PASS | `ls-tree`: 2 paden. Blobs `ec52ec72…`/`a7112403…` gelijk in V en DRY, geen drift (run 1, de bron is niet veranderd) |
| 3 | PASS | 60 regels; r. 1–3 gelijk; r. 4 `2026-11-15 … BL-003` |
| 4 | PASS | 36 beweringsregels, 0 zonder verwijzing; `(Dennis, 14-11)` 2×, op r. 52 en 53 |
| 5 | PASS | (a) script A: 0 `MIST`. (b) run 2: 8/8 (seed 20261115). De drie regels uit run 1 dragen nu hun bewering |
| 6 | PASS | `95d161a` als stand van main en als laatste commit buiten `ops/`; 8/8 branchrijen gelijk aan de lokale ref; `7e38160` weg |
| 7 | PASS | 0 statusafwijkingen tegen BACKLOG; `evaluator op BL-002` 0×, `eval-BL-002.md` 1× |
| 8 | PASS | V3.0: 6 regels, alle 6 gesteund door SPEC/OVERDRACHT @ `55b4d86`; Mijlpaal 3/3 |
| 9 | PASS | script B: 0 `WEG`; 5 open beslissingen, 3 besluiten; aanbevelingszin 1×; beschermde tekst alleen aangevuld met verwijzingen achteraan (r. 46) |
| 10 | PASS | BACKLOG 2 rij-regels (BL-003 `review` + contract); RUNLOG +1 tegen `c052f24`, BL-003 1× |

## Resterende voorbehouden
1. **`ops/STATE.md` r. 46:** "DNS bij Namecheap" heeft in geen enkel bestand een bron en botst met r. 50 (beslissing 1: "bij welke registrar"). Het is beschermde tekst, overgenomen van `main`, dus de hoofdsessie beslist.
2. **Basis:** getoetst tegen `c052f24` in plaats van `44a4ce0`. Bij de squash-merge van #93 moet de integrator `rebase --onto origin/main c052f24` gebruiken.
3. **`ops/STATE.md` r. 20:** door het inkorten is de nuance kleiner. "Ontbrekende" valt weg, "kleurnotitie" wordt "kleur" en "achterhaald door punt 10" verdwijnt. De bron (OVERDRACHT r. 296–297, 317) blijft vindbaar.
4. **`ops/STATE.md` r. 27:** de tabel noemt bewust de lokale ref. Waar de remote werkelijk staat, is niet gemeten.
5. **Buiten scope (hoofdsessie):** `origin/t/BL-005-integratie` @ `e09d33e` is een echte merge van V3 in main. Dat botst met beslissing 3(a) en met BACKLOG. BL-013 is gemerged via #96, maar staat nog op `review`. Favicon R3/BL-012 ontbreekt in STATE.

## Niet getoetst
- De echte remote-tip van `art/master` (geen fetch, geen ls-remote).
- Vercel/productie-URL en CI. Wel zelf gemeten in run 1, op een export van de code (gelijk aan `95d161a`): lint, 7/7 tests, build en `build:site` allemaal exit 0.
- Of de contracttekst gelijk is aan de versie van de planner (wel gelijk aan `fd6bad8`).
- Geen UI, dus geen screenshot.

## Les
Een evaluator-advies is ook een wijziging. Toets je voorgestelde formulering zelf tegen de contractscripts voordat je hem meegeeft. Mijn advies in run 1 (sha `b9e4a38` noemen) kostte een extra run op 5a.

---


## Run 2 (`f533170`): FAIL, één open punt: criterium 5a, `MIST b9e4a38`

| Run | Commit | Verdict | Kern |
|---|---|---|---|
| 1 | `e717dd9` | FAIL (9/10) | Criterium 5 (inhoud): r. 60 ("12 GB") had geen bron, r. 57 verwees naar de verkeerde regels, r. 46 (G1/G4) werd maar deels gesteund. |
| 2 | `f533170` | FAIL (9/10) | Alle punten uit run 1 zijn hersteld en 5b is 8/8. Criterium 5a geeft nu letterlijk 1 `MIST`: `` `b9e4a38` `` in r. 27 bestaat lokaal niet. Die vermelding kwam er op mijn eigen aanwijzing uit run 1; mijn advies was verkeerd. |

## Run 2: hertoets (zelf gemeten, basis `c052f24`, zoals in run 1)

| Punt | Gemeten | Geclaimd | Oordeel |
|---|---|---|---|
| Bestanden `e717dd9..f533170` | `ops/STATE.md`, `ops/RUNLOG.md` | idem | klopt |
| Criterium 1 (controle) | voorouder `c052f24` ok; 4 toegestane bestanden; tags-hash `90e8b859…`; 0 bestanden buiten `ops/` tegen main | — | PASS |
| Criterium 3 | 60 regels; r. 1–3 gelijk; r. 4 `2026-11-15 … BL-003` | 60 | PASS |
| Criterium 4 | 36 beweringsregels, 0 zonder verwijzing; `(Dennis, 14-11)` 2× (r. 52, 53) | 0 / 2 | PASS |
| Criterium 5a | script A: **1× `MIST b9e4a38`**, de rest OK | bekend | **FAIL** (letterlijk: verwacht 0) |
| Criterium 5b | nieuwe steekproef `srand(20261115)` uit 38 gewijzigde regels: STATE r. 18, 30, 32, 37, 47, 52, 59, 60. 8/8 gesteund. R. 52: 2184 bestanden / 856 MB / 129 / 41 445 845 B staan in `integratie.md` r. 32, 104, 113. R. 60: `b835a59:ops/STATE.md` r. 41 bevat de melding letterlijk. | — | PASS |
| Criterium 7 | r. 36: BL-001/002/003/013 `review`, BL-005 `klaar`, gelijk aan BACKLOG kolom 6; 0 afwijkingen. `evaluator op BL-002` 0×, `eval-BL-002.md` 1× | niet gedraaid | PASS |
| Criterium 9 | script B tegen `c052f24` en tegen `e717dd9`: 0 `WEG`; 5 open beslissingen, 3 besluiten; aanbevelingszin 1× | 0 / 5 / 3 / 1 | PASS |
| Criterium 10 | BACKLOG 2 rij-regels; BL-003 `review` + contract; RUNLOG +1 tegen `c052f24`, `\| BL-003 \|` 1× | 1 | PASS |
| Beschermde tekst | diff `e717dd9..f533170` raakt alleen r. 46 (Portal) in de beschermde secties: alleen verwijzingen achteraan. Besloten en open beslissingen zijn ongewijzigd. | alleen achteraan | klopt |

Herstelpunten uit run 1:
- **R. 60:** hersteld. "melding vastgelegd in `b835a59`" klopt (pin bestaat, de zin staat daar in STATE r. 41) en is eerlijk over de herkomst.
- **R. 57:** hersteld. `NIEUW_LAND.md` r. 31, 37, 40 is juist. Mijn voorstel "39–40" had een kop meegenomen; de keuze van de bouwer is beter.
- **R. 46:** hersteld binnen het contract. `BL-013.md` r. 9 draagt G4, r. 25 draagt G1 en G4, en `RUNLOG.md` r. 24 draagt G1. "Namecheap" heeft nog steeds geen bron (beschermde tekst; zie Open).
- **R. 27:** inhoudelijk eerlijk, maar dit veroorzaakt de 5a-FAIL (zie hieronder).
- **R. 20:** hersteld. Alle regelnummers staan nu achter `OVERDRACHT.md@55b4d86` en gaan tot maximaal 317. Ingekort tot onder 350 tekens; r. 36 ook. Kleine nuance-verliezen: "ontbrekende landmarks" is "landmarks" geworden, "TOPO_12-kleurnotitie" is "TOPO_12-kleur" geworden, en "achterhaald door punt 10" is weg. De bron (r. 296–297, 317) blijft vindbaar, dus dat is geen FAIL.
- **RUNLOG r. 19:** hersteld ("gerebaset op main 95d161a, bevat de BL-002-commits van #93"). Nog steeds precies één regel voor BL-003.

**Oordeel `MIST b9e4a38`.** Dit schendt criterium 5a letterlijk. Het contract vraagt 0 `MIST`, en het doel van 5a is precies dat elke sha in STATE lokaal te controleren is. `b9e4a38` is dat niet, want het object bestaat niet zonder fetch, en fetch is verboden. De uitzonderingslijst van het script (verwijzingen die al in `B` stonden) dekt dit niet. Juiste formulering: laat de sha weg en verwijs alleen naar de bron, bijvoorbeeld `| `art/master` | Artwork Italië (lokale ref; remote staat verder volgens `ops/RUNLOG.md` r. 21, niet gefetcht) | `7714e22` · 2026-11-13 |`. De sha zonder backticks laten staan haalt het script wel, maar omzeilt alleen de regex en doet niets aan het doel; dat raad ik af. De fout komt uit mijn advies in run 1.

**Wat nog hersteld moet worden:** alleen `ops/STATE.md` r. 27, zoals hierboven. Daarna criteria 3, 4, 5a en 9 opnieuw draaien. Er komt geen RUNLOG-regel bij.

**Open (niet blokkerend, voor de hoofdsessie):**
- `ops/STATE.md` r. 46: "DNS bij Namecheap" heeft geen bron en botst met beslissing 1 (r. 50, "bij welke registrar"). De tekst is beschermd, dus dit is aan de hoofdsessie.
- De punten "Buiten scope" uit run 1 gelden nog: `e09d33e` tegenover beslissing 3(a), en BL-013 gemerged maar nog `review`.
- Leesbaarheid: de langste regels (r. 52: 1399, r. 51: 461, r. 54: 370 tekens) zijn beschermd.

---

# Run 1 (`e717dd9`), ter historie

Contract: `ops/contracts/BL-003.md` · Product: `ops/STATE.md` · Branch `t/BL-003-state-herleidbaar` @ `e717dd9` · Datum: 2026-11-14
Evaluator: subagent `evaluator` (alleen lezen, nieuwe context). Ik heb alleen dit bestand geschreven en niets gecommit. Alle getallen hieronder heb ik zelf gemeten. Hulpbestanden staan in de scratchpad (`eval-BL-003b/`).

**Aangepaste basis.** Het contract noemt `B` = `44a4ce0`. Na de rebase op `origin/main` @ `95d161a` (#92, #94, #95, #96) heb ik getoetst tegen **`B` = `c052f24`**, de stand vlak vóór BL-003 in de nieuwe stapel. Voor criterium 9 is de maatstaf de STATE van `origin/main` @ `95d161a` plus wat BL-002 in `c052f24` toevoegde. Waar `44a4ce0` zelf nodig was (byte-gelijkheid van de BL-002-bestanden), heb ik die gebruikt.

VERDICT: FAIL (run 1, één punt: criterium 5, inhoud van de verwijzing). De andere negen criteria zijn PASS. Het herstel is klein: drie regels in STATE en één regel in RUNLOG.

Sha's: `main` 95d161a · `V` 55b4d86 · `DRY` df72c39 (bestaat nog) · `B` c052f24 · pre-rebase `fd6bad8` (`bak/BL-003-pre-rebase`).

## Per criterium (stand `e717dd9`, alles zelf gemeten)

| # | Verdict | Gemeten (tegenover geclaimd) |
|---|---|---|
| 1 | PASS | `merge-base --is-ancestor c052f24 HEAD` = 0 (ook `origin/main`). `diff --name-only c052f24..HEAD` = STATE, BACKLOG, RUNLOG, `contracts/BL-003.md`. Branch klopt. Tags-hash `90e8b859…` = body (6 tags). Contract byte-gelijk aan `fd6bad8`. Buiten `ops/` geen verschil met `main`. |
| 2 | PASS | `ls-tree`: precies `docs/v3/OVERDRACHT.md` en `docs/v3/SPEC.md`. Blobs `ec52ec72…` / `a7112403…`, gelijk in `V` en `DRY`. Drift leeg; `origin/codex/topo-v3` = `55b4d86`. Alles gelijk aan de body van `9e0928e`. |
| 3 | PASS | 60 regels (claim 60). R. 1–3 gelijk aan `c052f24` en `44a4ce0`. R. 4 bevat `2026-11-14` en `BL-003`. |
| 4 | PASS | 36 beweringsregels, 0 zonder verwijzing (claim 0). `(Dennis, 14-11)` 2× op r. 52 en 53, beide onder open beslissingen (claim klopt). |
| 5 | **FAIL** | (a) script A met `B` = `c052f24`: 30 nieuwe verwijzingen, 0 `MIST` (claim 0). Tegen `origin/main` alleen `docs/v4/FRANKRIJK_HANDOFF.md` (BL-002-tekst, het onderwerp van beslissing 5 en geen verwijzing). (b) steekproef van 8 uit 38 gewijzigde regels (awk `srand(20261114)`): diff-regels 3, 4, 5, 6, 8, 18, 27, 29 = STATE r. 8, 9, 10, 13, 16, 29, 42, 46. 7/8 volledig gesteund. **R. 46** wordt maar deels gesteund: `BL-013.md` r. 3–4 en `BACKLOG.md` r. 32 dragen "review, `/`, `/italie/`, optie A". G1 en G4 staan niet in r. 3–4 (G4 staat in r. 9, G1 in `RUNLOG.md` r. 24), en voor "DNS bij Namecheap" bestaat in geen enkel bestand een bron. Buiten de steekproef, op verzoek getoetst: **r. 60** "Dennis heeft 14-11 ruimte gemaakt (ongeveer 12 GB vrij)" heeft geen bron, terwijl de verwijzingen in die regel de rest dragen. **R. 57** "bottleneck": r. 31/37 dragen het alleen half. Zie FAIL-redenen. |
| 6 | PASS | `## Productie` bevat `95d161a` (= `origin/main`) en `95d161a` als laatste commit buiten `ops/`, `.claude/` en `CLAUDE.md` (14-11), plus BL-006. Alle 8 rijen: sha en `%cs` gelijk aan de lokale remote-trackingref. `7e38160` staat er niet meer in. |
| 7 | PASS | BL-001, -001b, -002, -003, -004, -005, -005b, -005c, -006, -013: 0 afwijkingen van kolom 6. `evaluator op BL-002` 0×, `eval-BL-002.md` 1×. |
| 8 | PASS* | 6 beweringsregels (claim 6, contract 3–10). Bevat `55b4d86`, `SPEC.md@55b4d86` en `OVERDRACHT.md@55b4d86`. Max r. 47 ≤ 47 (SPEC) en 317 ≤ 317 (OVERDRACHT). Alle 6 regels gelezen tegen `git show 55b4d86:<pad> \| sed -n 'N,Mp'`: alle 6 gesteund. Geen open punt staat als af gepresenteerd: punt 8 staat in r. 18 onder "ronde 5 punt 1–9 af" (letterlijk OVERDRACHT r. 252 "Klaar: punt 1–9"), maar r. 20 meldt het als open. Mijlpaal: 3/3 exitcriteria met stand en bron. *Zie voorbehoud 2. |
| 9 | PASS | Script B tegen `c052f24`: 0 `WEG`. Tegen `origin/main`: 1 `WEG` (beslissing 3, de BL-002-tekst, identiek in `c052f24`). Tegen `44a4ce0`: 1 `WEG` (beslissing 1, door #92 op `main` gewijzigd). Tellingen 5 en 3, gelijk aan `c052f24`. De zin "Aanbeveling van de hoofdsessie (geen besluit van Dennis)" staat er 1×. Claims kloppen. |
| 10 | PASS | Tegen `c052f24`: BACKLOG 2 rij-regels (alleen BL-003), BL-003 `review` met `ops/contracts/BL-003.md`, RUNLOG +1. Tegen `main`: RUNLOG +2, LEARNINGS +1, BACKLOG alleen de rijen BL-002/003 (claim klopt). |

## Oordeel over de acht punten

1. **Main naast HEAD.** Niets uit `main` is verdwenen. Besloten (3), Portal (2) en open beslissingen 1, 2 en 4 staan er letterlijk, met alleen een verwijzing achteraan. Beslissing 3 is de BL-002-tekst plus `(Dennis, 14-11)`. Wat #92–#96 aan STATE toevoegden (domein gekocht, Portal optie A) staat er volledig. Favicon R3 en BL-012 stonden nooit in de STATE van `main` en ontbreken nu ook. De lege regel tussen beslissing 2 en 3 is weg; dat is opmaak. Herschreven buiten de beschermde secties, met bron: (a) "Volgende taak": "shelltoegang nodig" en "BL-002 neemt ±240 links en `v3-reis` mee" zijn weg. Dat is achterhaald door BL-002 `review` (eval r. 6). "BL-005b wacht op … en BL-006" leeft nu alleen nog via "beslissing 3a". (b) Risico M0: de groottes (M/S) zijn weg. (c) Risico iPad: "geheugen" is "3 GB RAM" geworden. Geen van deze punten verandert de betekenis.
2. **Beslissing 3.** Dit is een feitelijke actualisering uit BL-002, geen wijziging van de beslisvraag. Opties (a/b/c), aanbeveling (a) en "Stand 14-11" zijn gelijk; alleen de verwijzing naar waar de links worden opgelost is anders. Wel staat BL-002b nog niet in de backlog (STATE r. 37 zegt dat eerlijk), en BACKLOG r. 19 koppelt de links nog aan BL-005b "met BL-002". Buiten BL-003 (de tekst is gelijk aan `c052f24`).
3. **De twee teruggezette regels.** Criterium 4 haalt de regex. Criterium 5 en het doel ("elke bewering verwijst naar een pin of bestand") worden niet volledig gehaald.
   - R. 57: `NIEUW_LAND.md` r. 31 (artwork-goedkeuring als G1-moment) en r. 37 (contactmoment) laten zien dat er per land een poort is. "Bottleneck" wordt gedragen door r. 39–40 ("Kritieke pad … **Artwork** is het langste traject"). De verwijzing is eerlijk bedoeld, maar wijst naar de verkeerde regels.
   - R. 60: voor "Dennis heeft 14-11 ruimte gemaakt (ongeveer 12 GB vrij)" bestaat geen bestand. De zin komt in STATE uit `b835a59` (`git log -S'12 GB'`). De verwijzingen in de regel (`integratie.md` r. 160, `LEARNINGS.md` r. 26) dragen alleen de rest, maar wekken de indruk dat ze de hele regel dragen. `(Dennis, …)` is in de risicosectie niet toegestaan.
   - Oplossing binnen het contract: het risico zelf heeft een bron en blijft staan. Laat de bronloze bijzin weg (herformuleren met bron mag). Of maak de herkomst expliciet als pin, bijvoorbeeld "melding Dennis 14-11, vastgelegd in `b835a59`". Ter informatie: ik mat nu 11 GiB vrij op `/`.
4. **Branchtabel.** Alle 8 sha's en datums zijn gelijk aan de lokale refs. `art/master` = `7714e22`, terwijl `BACKLOG.md` r. 31, `RUNLOG.md` r. 21 en `eval-BL-013.md` r. 17 `b9e4a38` noemen (via ls-remote; het object staat niet lokaal). De kop "(tip `origin/…`, lokale ref)" is formeel eerlijk, maar de rij zegt niet dat de remote verder staat. Dat is een bekend en verouderd feit dat ongemerkt blijft staan (voorbehoud 1). `t/BL-005-integratie` @ `e09d33e` (2026-11-14) staat er als feit, zonder oordeel. Klopt: parents `95d161a` + `55b4d86`, 227 commits vóór `main`.
5. **Productie.** `95d161a` en de laatste commit buiten `ops/` (`95d161a`, 14-11) kloppen. "Productie-URL niet geverifieerd" is eerlijk; #96 wijzigde wel `vercel.json`. "`main` groen: niet gemeten op `95d161a`" is eerlijk. Ik heb het zelf gemeten op een export van HEAD (code buiten `ops/` is identiek aan `95d161a`): lint 0, alle 7 testscripts 0 (jsdom in de scratch geïnstalleerd), build 0, `build:site` 0 ("Site-check: OK"). CI is niet gemeten.
6. **PR #93.** `gh pr view 93`: OPEN, head `t/BL-002-docs-inventaris`, base `main`. STATE noemt #93 niet. RUNLOG r. 19 noemt het wel (zie voorbehoud 3).
7. **Leesbaarheid.** Als snel overzicht is STATE nog bruikbaar: koppen en volgorde zijn logisch, en Volgende taak en Productie lees je in één oogopslag. De slechtste regels zijn r. 52 (1399 tekens, beslissing 3, beschermd), r. 51 (461, beschermd), r. 20 (424: zes open punten en drie verwijzingen in één regel, waarbij "(r. 289–291, 304)" direct achter `RELIEF_RENDER.md@55b4d86` staat, een bestand van 23 regels), r. 36 (394) en r. 54 (370). Alleen r. 20 en r. 36 vallen binnen de ruimte van de bouwer.
8. **Rebase-integriteit.** In RUNLOG, LEARNINGS en BACKLOG is geen regel van `main` verdwenen. Er zijn 0 dubbele regels; de BL-002/003-regels staan in tijdsvolgorde tussen 17:00 en 17:40. `docs-inventaris.md`, `eval-BL-002.md` en `contracts/BL-002.md` zijn blob-gelijk aan `44a4ce0`.

## FAIL-redenen (concreet, reproduceerbaar)
1. **`ops/STATE.md` r. 60**: de bewering "Dennis heeft 14-11 ruimte gemaakt (ongeveer 12 GB vrij)" heeft geen bron. Herstel: laat de bijzin weg, of verwijs expliciet naar de herkomst (`b835a59`, "melding Dennis"). De rest van de regel blijft staan.
2. **`ops/STATE.md` r. 57**: zet de verwijzing op `ops/playbooks/NIEUW_LAND.md` r. 31, 39–40 (r. 40 draagt "bottleneck").
3. **`ops/STATE.md` r. 46** (steekproef): voeg achteraan `ops/contracts/BL-013.md` r. 9 (G4) en `ops/RUNLOG.md` r. 24 (G1) toe. Namecheap heeft nergens een bron en botst met beslissing 1 ("bij welke registrar"). De tekst is beschermd, dus dit meldt de bouwer aan de hoofdsessie. Niet zelf wijzigen.
Na herstel: opnieuw criteria 3, 4, 5 en 9 draaien (60 regels, 0 zonder verwijzing, 0 `WEG`).

## Voorbehoud (niet blokkerend, wel meenemen in run 2)
1. **R. 27, `art/master`**: voeg toe "remote volgens ls-remote `b9e4a38` (`ops/RUNLOG.md` r. 21)". Dan zegt de tabel niet stilzwijgend iets wat verouderd is.
2. **R. 20**: zet de OVERDRACHT-regelnummers direct achter `docs/v3/OVERDRACHT.md@55b4d86`, niet achter `RELIEF_RENDER.md` (dat bestand heeft 23 regels). Overweeg r. 18 "alleen schermgerichte QA, geen volledige suite" expliciet aan 5B te koppelen. Ronde 3 en 5 hadden wel de volledige suite (OVERDRACHT r. 138, 280–286).
3. **`ops/RUNLOG.md` r. 19** zegt "op 44a4ce0, gestapeld op #93". Na de rebase klopt dat niet meer: de stapel staat op `95d161a` met gerebasete BL-002-commits, niet op de tip van #93. Na een squash van #93 moet de integrator `rebase --onto origin/main c052f24` doen, niet `44a4ce0`.
4. **Commitbody `9e0928e`**: "(stdin-hash van lege uitvoer)" klopt niet. Er zijn 6 tags; de hash zelf is juist.
5. Mijlpaal r. 9 kan worden "groen gemeten op een export van `95d161a`-code (lint, test, build)". Dat staat alleen in dit rapport, niet in een bestand op de branch, dus pas na overname door de hoofdsessie.

## Buiten scope opgemerkt (→ backlog-idee / hoofdsessie)
- `origin/t/BL-005-integratie` @ `e09d33e` is een echte merge van `codex/topo-v3` in `main` (226 commits). De commitboodschap zegt "BL-009/013 klaar, BL-005 in review". Dat botst met beslissing 3 (a) (BL-005b pas na G3 en BL-006) en met BACKLOG (BL-005 `klaar`, BL-013 `review`, BL-009 `idee`). Er is een besluit van de hoofdsessie nodig over wie deze branch beheert.
- BL-013 is via #96 al op `main` gemerged, maar staat in BACKLOG en STATE nog als `review`, wachtend op G1.
- Favicon R3 en BL-012 staan niet in STATE.
- Kandidaat-controlescript (niet in de repo gezet): "elke verwijzing draagt de bewering" is niet te automatiseren. Een `git log -S`-check op nieuwe zinnen zonder bestandsbron zou de r. 60-gevallen wel vinden.

## Niet getoetst
- Of de contracttekst gelijk is aan wat de planner schreef. Hij is wel gelijk aan `fd6bad8`.
- Vercel en de productie-URL. CI op `main`.
- Of `b9e4a38` de echte remote-tip van `art/master` is (geen fetch of ls-remote gedaan).
- Geen UI, dus geen screenshot.

## Les
Een verwijzing achter een samengestelde regel bewijst alleen dat er een bron is, niet dat elk deel van de regel een bron heeft. Bij een teruggezette of overgenomen bewering zonder bestand: zoek eerst met `git log -S` waar ze vandaan komt. Is dat alleen STATE zelf, laat de bijzin dan weg of noem de herkomst-pin expliciet, en hang er geen verwijzing aan die de rest van de regel draagt.

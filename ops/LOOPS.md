# Loops

| Loop | Frequentie | Trigger | Output | Dennis |
|---|---|---|---|---|
| **Taak** | per taak | backlog `ready` | PR plus evaluatie | — |
| **Nacht** | dagelijks 01:00, maximaal 10 min | `ops/scripts/nightly.sh` | lokale alleen-lezen controle | — |
| **Brief** | bestaande ochtendbrief | bestaande planning | één brief; geen extra verzending vanuit nachtrun | lezen en besluiten |
| **Dag** | overdag, op aanvraag | Dennis of Claude chat | design-iteraties (G1), beslissingen | optioneel |
| **Week** | vrijdag 16:00 | `/weekreview` | targets, demo, voorstel voor volgende week, RUNLOG opgerold | 15 min |
| **Maand (retro)** | eerste vrijdag | `/retro` | LEARNINGS gepromoveerd en gesnoeid, harness lichter | 15 min |
| **Onderhoud** | wekelijks en maandelijks | `MAINTENANCE.md` | patches, opruimen | — |
| **Release** | per mijlpaal | G3 | Hermes-hertest, G4-vraag | 1 akkoord |

## Nachtloop — beperkte controle (besluit Dennis 25 november)
1. Lees via `gh api` uitsluitend GET: main, branches, open PR's en issues.
2. Vergelijk met de laatste geslaagde meting. Geen veranderingen: kort melden en stoppen.
3. Bij nieuwe main: lees bestaande GitHub-checks. Geen lokale tests, installaties of builds; geen volledige QA.
4. Schrijf alleen `~/.topo-night/monitor/latest.md` en bij succes `snapshot.json`.
5. Geen agent, failover, branches, commits, pushes, merges, deploys of Telegram. Maximaal 600 seconden; elke externe aanroep maximaal 45 seconden.
6. Netwerk-/auth-fout: expliciet onvolledig, exit 1, vorige meting behouden.

Installatie vanuit de werkmap: `bash ops/scripts/install-nightly.sh`.
De installer kopieert deze gecontroleerde versie en start launchd dagelijks om 01:00 lokale Mac-tijd.
Geen automatische download of uitvoering van scripts vanaf main. Na wijzigingen opnieuw installeren.
De oude agentopdracht `.claude/commands/nachtrun.md` wordt niet gebruikt en mag niet als alternatief worden gestart.

De lokale uitvoer is beschikbaar voor de bestaande ochtendbrief op deze Mac. De ChatGPT-ochtendbrief kan dit lokale bestand niet automatisch lezen; die blijft GitHub zelf raadplegen. Er is geen nieuwe berichtendienst geactiveerd.
Activatie: actief sinds 26 november 01:00 (eerste meting in `~/.topo-night/monitor/latest.md`).

## Wekelijkse review (besluit Dennis 26-11, BL-043)
Doel: de stam gezond houden voor alle landen, zonder dat Dennis erom hoeft te vragen. Eén run per week (zondagnacht), niet elke nacht.
1. Op `main`: `npm test`, de volledige QA-matrix voor elk live land, `build:site`.
2. Live-check: portal en elk land op www.ninotopo.nl (desktop + iPad-formaat, één screenshot per land).
3. Updates: dependencies en beveiliging; budgetten uit `QUALITY.md` (grootte, laadtijd) meten tegen de vorige week.
4. Uitkomst: `ops/reports/weekly-<datum>.md` + hooguit 3 kleine fix-PR's, elk met contract en evaluator-PASS. **Nooit automatisch mergen.**
5. Maandag: één brief aan Dennis, maximaal 3 beslissingen.
Activatie: na M1 (vóór M1 is er maar één land; tot dan draait alleen de dagelijkse monitor).

## Ochtendbrief (format: `templates/BRIEF.md`)
- ✅ Klaar (met preview-links) · ❌ Gefaald (met reden) · ⛔ Geblokkeerd
- 📈 Stand van de mijlpaal: X/Y taken, deadline, op schema ja/nee
- ❓ Maximaal 3 beslissingen als meerkeuze met aanbeveling
- 💳 Credits: nachtgebruik laag/mid/hoog, limiet geraakt ja/nee

## Zelfverbetering (de echte loop)
```
run → evaluatie → FAIL/correctie → LEARNINGS → (2×) regel of test → volgende run vermijdt het
                                                       ↑
                                       maandretro snoeit wat niet meer nodig is
```
Je feedback in de brief of de weekreview gaat via dezelfde weg erin: correctie → LEARNINGS → direct een regel.

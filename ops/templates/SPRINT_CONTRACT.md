# Sprintcontract — BL-___ <titel>

**Doel (1 zin):**
**Waarom nu (target/mijlpaal):**
**Bouwer:** Claude Code (Sonnet) / Codex · **Evaluator:** evaluator-subagent · **Max runs:** 1/3

## Scope
- Wel:
- Niet:
- Bestanden die gewijzigd mogen worden:
- Bestanden die gelezen moeten worden (en verder niets):
- Commits: de builder commit alleen de paden hierboven (`git add <pad>`, nooit `-a` of zonder pad). Contract en BACKLOG commit de hoofdsessie zelf vóór het delegeren.

## Acceptatiecriteria (elk toetsbaar, met methode)
| # | Criterium | Hoe getoetst | Verwacht |
|---|---|---|---|
| 1 | | `npm test -- <...>` | groen |
| 2 | | screenshot desktop van <scherm> naast `docs/v3/renders/R-..` | geen afwijking op frame, type, kleur |
| 3 | | meting | ≤ … |
| UI | Geen afgesneden of overlappende tekst (verplicht bij elke UI-taak) | browser, per formaat incl. 1080×810 en 810×1080: elk tekstelement `scrollWidth ≤ clientWidth`, geen overlap tussen tekst en knoppen | 0 gevallen |
| UI | Contrast en lettergrootte van álle tekst, ook labels en pills | meting in de browser | ≥ 4,5:1, niets onder 13 px |

## Verificatie
- Exacte commando's: `npm run build && SITE_ITALIE=v3 npm run build:site` (V3-site; zonder variabele = V2-rollback), `npm test` (één jsdom-bestand tegelijk), Playwright via `require('playwright')`, WebKit via `scripts/qa-webkit.mjs`.
- Elke nieuwe check, test of beveiliging moet aantoonbaar **falen op de basis-commit** (nulmeting) of met een mutatie die het bewaakte pad raakt; het mutatiedoel is op elke getoetste maat zichtbaar. Een check die nooit rood was, bewijst niets.
- Gate op de exitcode van het commando zelf, nooit via `grep` op de uitvoer.

## Stopcriterium
Klaar wanneer 1–n PASS zijn. Niet doorgaan met "verbeteringen" buiten de scope. Die gaan als `idee` naar de backlog.

## Risico en rollback
- Schijf: benodigde vrije ruimte noemen; `df` vóór de start; eigen worktrees/checkouts (ook van QA- en evaluator-agents) na afloop verwijderen.

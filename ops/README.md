# TOPO Operating System

Het besturingssysteem van het project: wie beslist wat, hoe werk stroomt, hoe het systeem leert en hoe we groeien naar "over 2 weken volgt Japan".

## Start hier
1. Lees `STATE.md` voor de actuele stand en eerstvolgende actie.
2. Lees `ROADMAP.md` en `BACKLOG.md` voor richting en taakvolgorde.
3. Werk volgens `OPERATING_MODEL.md`; uitvoering en bewijs staan in `contracts/` en `reports/`.
4. De opruiming van 25 november staat in `reports/cleanup-2026-11-25.md`.

De oude bouw-nachtrun is uitgezet. Dennis heeft op 25 november de beperkte alleen-lezen ronde goedgekeurd; zie `LOOPS.md`. Het nieuwe script is getest, installatie staat nog open.
De repository is `ColdDesertAI/topo`. De installatiehistorie staat in Git.

## Kaart
| Bestand | Wat | Wie schrijft |
|---|---|---|
| `OPERATING_MODEL.md` | Rollen, beslisrechten, gates, ritme | Dennis keurt goed |
| `NORTH_STAR.md` | Missie, doelgroep, doelen en targets | Dennis beslist, Claude stelt voor |
| `ROADMAP.md` | Mijlpalen met deadlines | Claude, Dennis keurt goed |
| `BACKLOG.md` | Geprioriteerde taken | Claude |
| `STATE.md` | Huidige stand (≤ 60 regels) | Claude, na elke taak |
| `RUNLOG.md` | Eén regel per run, append-only | Agents |
| `LEARNINGS.md` | Lessen, en welke tot regel zijn gepromoveerd | Agents en evaluator |
| `HARNESS.md` | Graph, rollen, modellen, credits | Claude |
| `LOOPS.md` | Nacht, dag, week, maand | Claude |
| `MEMORY.md` | Geheugenlagen en wat waar hoort | Claude |
| `GIT_RELEASE.md` | Branches, PR, Vercel, release, rollback | Claude |
| `QUALITY.md` | Definition of Done, gates, budgetten | Claude, Dennis keurt goed |
| `MAINTENANCE.md` | Onderhoud, updates, opruimen | Claude |
| `playbooks/` | Herhaalbare procedures (nieuw land, feature) | Claude |
| `templates/` | Sprintcontract, brief, weekreview, overdracht | — |

## Waarom dit nodig is (diagnose, 13 nov 2026)
- `main` staat stil sinds **28 september**. Er zijn **71** remote branches, en minstens 6 werkstromen lopen tegelijk (v3, art, land/fr, portal, website, runtime). Niets komt samen, dus er is nooit "een versie die af is".
- `docs/` bevat tientallen release-, handoff- en QA-bestanden. Agents lezen die steeds opnieuw, en dat kost credits zonder dat er iets landt.
- Codex en Claude Code bouwen parallel aan hetzelfde product, met overdrachten via chats.
- Wat er wél goed staat: harde geografieregels, een karakteriseringstest, Hermes als onafhankelijke QA, en het **landpakket-contract** (`arch/v3-runtime`). Dat contract is precies de basis voor "nieuw land in 2 weken".

Dit systeem voegt geen vierde harness toe. Het **vervangt** de losse handoffs door één stroom: backlog → contract → bouw → evaluator → `main`.

# Weekreview — week 48 (21–27 nov 2026)

> Eerste weekreview. Geteld uit `git log origin/main`, `ops/RUNLOG.md`, `ops/reports/eval-*.md` en PR's (scout, Haiku). Geen builds of tests gedraaid (QA-matrix per week = BL-043, na M1).

## Resultaat
- **Naar `main`: 8 taken** — BL-042, BL-041a, BL-030, BL-024a, BL-024b, BL-024c, BL-001b (branch-opruiming), BL-008 (speeltestpakket, PR #110). Plus docs/ops: Hermes-rapport BL-004 (#122), werkstructuur (#117), contract BL-046 (#123), Vercel slaat docs-builds over (#125). BL-031a gemerged én teruggedraaid (telt niet).
- **PASS-rate 1e evaluatie: 4/7 = 57%** (PASS: BL-041a, BL-030, BL-024b, BL-024c · FAIL: BL-042 Esc-regressie, BL-024a ops-bestanden in bouwcommit, BL-031a geen fps-winst). **FAIL→fix-rondes: 2** (BL-042, BL-024a, elk 1 ronde → PASS); BL-031a gestopt en gerevert.
- **Live:** ja. `main` = `a14ac18` (27-11). Tag `v3.0.0` → `718658f` (G4 19-11). App-inhoud laatst gewijzigd 22-11 (`2cadd3a`, revert BL-031a, met BL-041a/BL-030 uit de nachtrun); daarna alleen QA-scripts, build-checks en `vercel.json`.
- **BL-046 (#118):** gebouwd, evaluator PASS 27-11 (45/45 tikbaar, 0% land bedekt, desktop 0% verschil). [PR #124](https://github.com/ColdDesertAI/topo/pull/124) open, **niet gemerged — wacht op G4 Dennis**.
- Demo: https://www.ninotopo.nl/italie/

## Targets (uit NORTH_STAR, Q4 2026)
| Target | Doel | Stand | Trend |
|---|---|---|---|
| Live landen | 1 | 1 (Italië V3) | ✅ |
| iPad 9: alle schermen passen, geen crash | 100% | QA-matrix incl. portret groen; Hermes FAIL op #118 → fix in PR #124; echte iPad 9 nog niet getest | ↗ wacht op G4 + BL-010 |
| PASS-rate 1e evaluatie | ≥ 60% | 57% (4/7) | ✗ net onder; 2 van 3 FAILs waren procesfouten (commit-scope, Esc zonder laagcheck) |
| Taken naar `main` per week | ≥ 5 | 8 | ✅ |
| Kind haalt de toets na de route | — (Q1: ≥ 80%) | niet gemeten (speeltest BL-010 niet gepland) | — |
| Doorlooptijd nieuw land | n.v.t. | n.v.t. | — |
| Tijd Dennis per week | ≤ 1 uur | onbekend; deze week waarschijnlijk meer (tag, opruiming, nachtrun, Hermes) | schatting Dennis nodig |

### M0-deadline (vr 20-11) is verstreken
Exit wacht nog op: **BL-046** (G4), **Hermes-hertest crit. 3** (iPad, na BL-046) en **speeltest BL-010** (2 kinderen, nog niet gepland). Niets verschoven — voorstel en keuze: beslissing 1 hieronder.

## Wat ging goed / wat niet
- Goed: 8 taken op `main`; nachtrun leverde 3× PASS; branches van 102 naar 4 + archieftags; rollback-pad (`SITE_ITALIE=v2`) weer heel; meettest-eerst-werkwijze (BL-046) bewijst zichzelf op de oude code.
- Niet: PASS-rate net onder doel; BL-031a gebouwd op een vermoeden zonder profiel; schijf Mac mini liep weer vol (nachtrun stopte 23-11 op 694 MB); dingen liepen door elkaar (Dennis 22-11) → nu één stap tegelijk.

## Lessen → regels
- Nieuw deze week: **9** lessen in `LEARNINGS.md` (21–23 nov) + 1 op de BL-046-branch.
- **Gepromoveerd nu** (≥ 2×, docs/regel):
  1. *Nieuwe check moet eerst falen* (15-11, 22-11 BL-030, 23-11 BL-024b, 23-11 BL-024c; 4×) → `ops/templates/SPRINT_CONTRACT.md` (§Verificatie).
  2. *Exact buildcommando + Playwright in het contract* (20-11, 22-11; 2×) → `SPRINT_CONTRACT.md` (§Verificatie).
  3. *Builder commit alleen contractpaden; hoofdsessie commit contract/BACKLOG zelf* (15-11, 22-11; 2×) → `SPRINT_CONTRACT.md` (§Scope).
  4. *Schijf vol / achtergebleven checkouts* (14-11 ENOSPC, 23-11 nachtrun 694 MB, 26-11 opruiming) → `SPRINT_CONTRACT.md` (§Risico) + test als **BL-051**.
- *WebKit/Playwright-installatie* (19-11, 22-11) → valt onder **BL-049** (playwright in devDependencies, WebKit op macOS); niet apart.

## Gezondheid van het zelflerende systeem
| Onderdeel | Stand |
|---|---|
| LEARNINGS | 9 nieuw; 4 herhaalde lessen gepromoveerd (zie boven); open lessen: 11 |
| Alleen-lezen monitor (01:00) | **onbekend** — `~/.topo-night/monitor/latest.md` staat op de Mac mini; deze cloudsessie kan er niet bij |
| Weekreview | deze (eerste) |
| Retro | gepland do 4-12 |
| Achtergebleven checkouts | cloudsessie: 4 oude agent-checkouts in de scratchpad, ±11 GB (`nt` 5,7 GB, `eval42` 2,7 GB, `base` 1,4 GB, `wt` 1,3 GB); verdwijnen met de container. Mac mini: **onbekend** (26-11 opgeruimd, 34 GB). Niets verwijderd. |

## Hygiëne
- Open branches: `art/master` (telt niet), `land/fr-geo`, `land/fr-inhoud`, `t/BL-046-ipad-paneel`, `docs/weekreview-48` → **4 / 5** ✅.
- Nieuwe statusdocs in `docs/`: geen `*_RELEASE_*`/`*_HANDOFF_*`. Wel `docs/qa/hermes-g3-v3/` (21 bestanden, Hermes-hertest #122): een QA-map per test. Laten staan (PR's en issues linken ernaar); afspraak voor Hermes: volgende hertest in dezelfde map.
- STATE: 31 regels (≤ 60). Hersteld: "laatste site-wijziging" (`58d981d` raakte de site niet → 22-11 `2cadd3a`), datum en volgende taken.
- RUNLOG: week 46 (13–15 nov, 33 regels) opgerold tot één regel.

## Voorstel volgende week (week 49; Dennis: akkoord of wijzigen)
1. **BL-046 live** — G4 Dennis op PR #124 (ontwerpvraag: puntenmeter verborgen in Aanwijzen op iPad), merge, live-check, daarna Hermes-hertest crit. 3.
2. **BL-007** — karakterisering terug op `main` (M1 stap 1, contract klaar).
3. **BL-010 speeltest plannen** — datum + 2 kinderen (groep 7); protocol staat (BL-008, PR #110). Echte iPad 9 meenemen.

Je verwachting klopt; ik zou alleen BL-051 (opruim-check) als klein klusje voor Codex meenemen als er ruimte is.

**Roadmapvoorstel (akkoord nodig):** de bouwende nachtrun pas weer aan na M1, onder drie voorwaarden: (1) precies één `ready`-taak met contract, (2) worktree/checkout na afloop opruimen + `df`-check vooraf (BL-051), (3) stoppen bij de credit- of tijdslimiet. Tot dan alleen de alleen-lezen monitor.

## Risico's en beslissingen
**1. M0 afsluiten**
- (a) **M0 sluiten zodra BL-046 live is en Hermes crit. 3 PASS geeft; speeltest BL-010 naar M1 met een vaste datum** — aanbevolen: de techniek is klaar, de speeltest hangt aan agenda's van kinderen, niet aan bouwwerk.
- (b) Nieuwe M0-datum vr 4-12, inclusief speeltest.
- (c) M0 nu sluiten; BL-046, Hermes en BL-010 allemaal naar M1.

**2. BL-046 (PR #124) — G4**
- (a) **Mergen zoals het is** (puntenmeter en *Kaart vrijmaken* verborgen in Aanwijzen op iPad; punten op het resultaatscherm) — aanbevolen: alle 45 plekken tikbaar, niets verraden.
- (b) Mergen, maar eerst de puntenmeter compact terug in de balk (kleine extra bouwronde + hertoets).
- (c) Eerst zelf op de iPad proberen, dan kiezen.

**3. Bouwende nachtrun**
- (a) **Pas na M1, onder de drie voorwaarden hierboven** — aanbevolen.
- (b) Nu weer aan voor kleine `ready`-taken.
- (c) Uit laten; alleen overdag bouwen.

Risico's: schijf Mac mini (BL-051) · M1-deadline 11-12 komt dichterbij terwijl M0 nog open is · tijd van Dennis niet gemeten.

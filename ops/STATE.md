# STATE — huidige stand

Bijgewerkt: 26 november 2026, Claude (regie). Historie: `RUNLOG.md`. Max. 60 regels, overschrijven.

## Nu
M0 afronden (Hermes + speeltest) en M1 starten met BL-007. Koers en besluiten: `ops/ROADMAP.md` §Koers, `docs/DECISIONS.md` 26-11.

## Product
- Productie = `main` (Vercel deployt elke merge). Site gelijk aan V3 Italië van 19-11; laatste site-wijziging `58d981d`.
- Release v3.0.0 (tag → `718658f`), gepubliceerd 25-11.
- Hermes-hertest BL-004 (26-11, PR #122): **FAIL op één punt** — geen P0; kernroute, offline, opslag, a11y, portal PASS; 5 oude P0's opgelost en gesloten. Blokkade: #118 antwoordpaneel bedekt het zuiden op iPad → BL-046 (ready). Echte iPad 9 nog niet getest → bij de speeltest BL-010.

## Repo en werkwijze
- `main` beschermd (ruleset "Protect main"): alleen via PR, 0 approvals, geen force-push. Branches na merge automatisch weg.
- Branches: `main`, `art/master`, `land/fr-geo`, `land/fr-inhoud` (FR-data bij M1 overzetten, daarna archieftag).
- Opruiming klaar: 98 + 2 archieftags; op de Mac mini alleen `~/Code/topo/topo`. Uniek werk veiliggesteld in `~/Archief/topo-2026-11-26/`.
- Geen bouwende nachtrun. Alleen-lezen monitor dagelijks 01:00 (`~/.topo-night/monitor/latest.md`). Hermes-cron en Codex-automations leeg.
- Regie (claude.ai-project) heeft schrijfrecht; bouwen blijft bij Claude Code (Sonnet) per contract.

## Volgende taken
1. BL-046 fix #118 (iPad, Aanwijzen) — Claude Code; daarna G4 Dennis en Hermes-hertest crit. 3.
2. BL-007 karakterisering terug op main — Claude Code, contract klaar.
3. BL-010 speeltest — Dennis plant (2 kinderen).
4. Daarna M1 stap 2: catalogus en learning/rewards extraheren (`docs/v3/ARCHITECTUUR.md` §2). Contract volgt na BL-007 PASS.
5. Parallel (Codex): FR-01/FR-02 als data naar `src/lands/fr/` (status draft).

## Afspraken
- Docs-only PR's mag de regie zelf mergen; site-wijzigingen via evaluator-PASS en G4.
- Max. 5 taakbranches; `art/master` mag langlopend blijven.
- Geen verwijdering van uniek werk zonder gecontroleerde archiefkopie.
- `ops/ROADMAP.md` is de roadmap; deadlines niet stilzwijgend verschuiven (M1: 11-12).

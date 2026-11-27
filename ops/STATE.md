# STATE — huidige stand

Bijgewerkt: 27 november 2026, Claude Code (weekreview 48). Historie: `RUNLOG.md`. Max. 60 regels, overschrijven.

## Nu
M0 sluit zodra Hermes crit. 3 PASS geeft (besluit 27-11, 1a); BL-046 is live (PR #124, `c41f241`). Speeltest BL-010 → M1, datum vóór 11-12 (Dennis). Daarna M1 met BL-007. Bouwende nachtrun pas na M1 (3a). Koers en besluiten: `ops/ROADMAP.md` §Koers, `docs/DECISIONS.md` 26-11 en 27-11.

## Product
- Productie = `main` (Vercel deployt elke merge). V3 Italië; `main` `a14ac18` (27-11). App laatst gewijzigd 22-11 (`2cadd3a`, nachtwerk + revert BL-031a). Docs/ops-commits bouwen niet meer (#125).
- Release v3.0.0 (tag → `718658f`), gepubliceerd 25-11.
- Hermes-hertest BL-004 (26-11, PR #122): **FAIL op één punt** — geen P0; kernroute, offline, opslag, a11y, portal PASS; 5 oude P0's opgelost en gesloten. Blokkade: #118 antwoordpaneel bedekt het zuiden op iPad → BL-046 live 27-11 (PR #124, `c41f241`). Echte iPad 9 nog niet getest → bij de speeltest BL-010.

## Repo en werkwijze
- `main` beschermd (ruleset "Protect main"): alleen via PR, 0 approvals, geen force-push. Branches na merge automatisch weg.
- Branches: `main`, `art/master`, `land/fr-geo`, `land/fr-inhoud` (FR-data bij M1 overzetten, daarna archieftag). `t/BL-046-ipad-paneel` gemerged 27-11.
- Opruiming klaar: 98 + 2 archieftags; op de Mac mini alleen `~/Code/topo/topo`. Uniek werk veiliggesteld in `~/Archief/topo-2026-11-26/`.
- Geen bouwende nachtrun. Alleen-lezen monitor dagelijks 01:00 (`~/.topo-night/monitor/latest.md`). Hermes-cron en Codex-automations leeg.
- Regie (claude.ai-project) heeft schrijfrecht; bouwen blijft bij Claude Code (Sonnet) per contract.

## Volgende taken
1. Hermes-hertest crit. 3 (BL-004) op de live BL-046-fix → bij PASS M0 dicht.
2. BL-007 karakterisering terug op main — Claude Code, contract klaar.
3. BL-010 speeltest — Dennis plant datum + 2 kinderen (echte iPad 9 mee).
4. Daarna M1 stap 2: catalogus en learning/rewards extraheren (`docs/v3/ARCHITECTUUR.md` §2). Contract volgt na BL-007 PASS.
5. Parallel (Codex): FR-01/FR-02 als data naar `src/lands/fr/` (status draft).

## Afspraken
- Docs-only PR's mag de regie zelf mergen; site-wijzigingen via evaluator-PASS en G4.
- Max. 5 taakbranches; `art/master` mag langlopend blijven.
- Geen verwijdering van uniek werk zonder gecontroleerde archiefkopie.
- Weekreview vrijdag (`ops/reviews/`), retro do 4-12. Bouwende nachtrun pas na M1 (voorstel, beslissing 3).
- `ops/ROADMAP.md` is de roadmap; deadlines niet stilzwijgend verschuiven (M1: 11-12).

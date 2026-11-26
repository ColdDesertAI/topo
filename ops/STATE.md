# STATE — huidige stand

Bijgewerkt: 26 november 2026, Claude (overname van Codex). Historie: `RUNLOG.md`. Max. 60 regels, overschrijven.

## Nu
M0-consolidatie afronden → BL-004 Hermes-hertest + speeltest (≥ 2 kinderen, liefst iPad) → M1 gedeelde runtime (Italië als landpakket). Frankrijk-code wacht op M1.

## Product (productie = main)
- Italië V3 live via `SITE_ITALIE=v3` sinds 19-11. Laatste productie-deploy: `77dda75d` (22-11, READY). Sindsdien geen deploys.
- BL-035–039, BL-042 en nachtwerk 22-11 (BL-041a, BL-030, BL-024a) afgerond; BL-031a teruggedraaid.
- Productie op 25/26-11 niet opnieuw functioneel getest (alleen deploystatus).

## Release
- GitHub Release **v3.0.0** gepubliceerd 25-11, Latest. Tag `v3.0.0` → `718658f` (G4 19-11, PR #101), niet verplaatst.
- Screenshots (live site 25-11) staan in de release notes, niet in README. main is verder dan de tag.

## Opruiming — gecontroleerd 26-11
- **Remote: KLAAR.** 98 `archive/*`-tags op GitHub (= goedgekeurde lijst 22-11). Over: `main`, `art/master`, `night/2026-11-23` (PR #116), `docs/BL-008-child-usability-v3` (PR #110), `land/fr-geo`, `land/fr-inhoud`, `claude/nightly-pr99-kaart-feestje-fvpl06` (stond niet op de lijst; besluit nodig).
- **Lokaal: KLAAR (26-11, Claude).** 43 TOPO-kopieën verwijderd (`~/projects/topo-*` incl. 2e clone `topo-repository`, `topo-bl005`, `topo-nino-71`, `Topo-iPad-Test`). Over: `~/Code/topo/topo` (op `main`) + worktree `~/Code/topo/wt-night-2026-11-23` (verhuisd 26-11 van `~/topo-claude` / `~/topo-night`; Codex-config bijgewerkt). Lokale branches: `main`, `night/2026-11-23`. Uniek werk vooraf veiliggesteld in `~/Archief/topo-2026-11-26/` (bundle `bak/BL-003-pre-rebase` + `night/2026-11-14`; patches/untracked van discovery-map-v2, v3-runtime, QA-bewijs pisa/95d5199). Rest: `git worktree prune` voor `/private/tmp/bl035-eval` (Terminal).
- Netwerk: shell-git bereikt github.com (lezen). Pushen vanuit de sessie: niet getest (geen credentials in de sessie-VM).

## Open beslissingen / acties
1. **Branchbescherming main: ACTIEF** (26-11, ruleset "Protect main", id 28149042; API: `main` protected). Regels: deletion, non_fast_forward, pull_request (0 approvals, merge/squash/rebase). Geen bypass, geen statuschecks.
2. Let op na bescherming: directe pushes naar main (afspraak 19-11) kunnen niet meer; alle werk via korte taakbranch + PR (zelf mergen mag, 0 approvals).
3. PR #116 `night/2026-11-23` (BL-024b/c, evaluator PASS): integreren of sluiten.
4. PR #110 BL-008 kindtest-pakket: input voor BL-004 speeltest.
5. Uncommitted ops-wijzigingen van Codex in `topo-night` (monitor, cleanup-script, LOOPS, STATE): nog niet gecommit; via taakbranch + PR.
6. Nachtrun: alleen-lezen monitor klaar; activatie `bash ops/scripts/install-nightly.sh` in lokale Terminal (Dennis).

## Afspraken
- main is productie; previews alleen op verzoek van Dennis.
- Max. vijf korte taakbranches; art/master mag langlopend blijven.
- Geen verwijdering van uniek werk zonder gecontroleerde archiefkopie.
- ops/ROADMAP.md blijft de roadmap; deadlines niet stilzwijgend verschuiven.

# Branch-inventaris (BL-001, afgerond met BL-001b)

- Datum: 2026-11-15 · referentie `origin/main` = `52427b5` (lokale `main` = `52427b5`) · totaal branches (ontdubbeld, `origin/x` + `x` = één rij): **120**
- Vóór de run: 134 refs (`git for-each-ref refs/heads refs/remotes`, incl. `origin/HEAD`), 6 tags. Niets verwijderd, getagd, gepusht of gefetcht. Op basis van lokale refs, laatste fetch onbekend.
- Commando's per rij (ref `r` = `origin/<b>` als die bestaat, anders `<b>`):
  - `git rev-list --left-right --count origin/main..."$r"` geeft Achter en Voor
  - `git cherry origin/main "$r" | grep -c '^+'` geeft Cherry-uniek (patch-equivalent commits in `origin/main` tellen niet mee; squash-merges worden hiermee niet gezien)
  - `mb=$(git merge-base origin/main "$r")`, `comm -12 <(git diff --name-only "$mb" "$r" | sort) <(git diff --name-only origin/main "$r" | sort) | wc -l` geeft Tree-uniek (bestanden die de branch wijzigde en die in `origin/main` nog anders zijn; 0 = alle inhoud staat al in `origin/main`)
  - Waar `Waar = beide` en lokaal/remote verschillen: cijfers van de remote-ref, lokaal in de Reden.
- Actieregels: beschermd (`main`, `art/master`, `night/2026-11-15`, `arch/v3-runtime`, `feat/nino-topo-portal-r2`, `art/nino-topo-website-v1`, `land/fr-geo`, `land/fr-inhoud`) is `keep`; niet beschermd met Cherry 0 of Tree 0 is `delete` (alleen voorstel); twijfel is `archive`. Open taakbranches `t/BL-*` met werk dat nog niet gemerged is, staan op `keep` tot hun merge.
- Rijen die sinds BL-001 bijkwamen: `bak/BL-003-pre-rebase`, `night/2026-11-15`, `ops/bl012`, `ops/domein-gekocht`, `ops/favicon-r3`, `ops/model-routing`, `ops/night1`, `ops/nightly-fix`, `t/BL-002-docs-inventaris`, `t/BL-003-state-herleidbaar`, `t/BL-005-integratie`, `t/BL-013-portal-r3`, `t/BL-015-v3-release`. Verdwenen refs: geen.

## Beperkingen
1. Remote-tracking refs zijn zo oud als de laatste fetch (onbekend). Vóór de opruiming fetchen en de commando's herdraaien (script: lus over `git for-each-ref`).
2. Tree-uniek telt verschillen met de huidige `origin/main`: een bestand dat daarna in `main` verder is aangepast, telt als uniek (voorzichtige kant). Een `delete` op Tree 0 is dus betrouwbaar; een hoge Tree-waarde bewijst niet dat het werk ontbreekt (zie `codex/topo-v3`).
3. De reden van `archive`-rijen komt uit BL-001; BL-001b heeft de inhoud niet inhoudelijk beoordeeld. Auteur van de laatste commit is weggelaten.
4. Dit zijn voorstellen: niets is verwijderd of getagd. Tags (BL-005c) volgen na akkoord op beslissing 2.

| Branch | Waar | Laatste commit | Achter | Voor | Cherry-uniek | Tree-uniek | Actie | Reden |
|---|---|---|---|---|---|---|---|---|
| `agent/topo-harness-v1` | remote | 2026-11-06 a869752 | 12 | 73 | 71 | 196 | archive | oude harness-iteratie; v2 is opvolger. Tag `archive/agent/topo-harness-v1`, dan verwijderen |
| `agent/topo-harness-v2` | beide | 2026-11-06 beeaef4 | 12 | 82 | 80 | 279 | archive | harness is nu in `ops/` opgenomen; tag `archive/agent/topo-harness-v2` |
| `agent/topo-harness-v2-codex-reviewed` | remote | 2026-11-06 c2e52e6 | 12 | 78 | 76 | 310 | archive | reviewvariant van harness v2; tag en verwijderen |
| `agent/topo-harness-v2-improvement-fresh-package` | beide | 2026-11-06 94d1390 | 12 | 77 | 75 | 243 | archive | variant van harness v2; tag en verwijderen |
| `arch/stap0-bron` | beide | 2026-11-12 416088e | 12 | 191 | 185 | 43 | archive | bronpakket voor runtime-migratie; opvolger is `arch/v3-runtime`. Tag bewaart het |
| `arch/v3-runtime` | remote | 2026-11-10 75263a7 | 12 | 124 | 118 | 270 | keep | actieve werkstroom (STATE): migratievoorstel en landpakket |
| `art/master` | remote | 2026-11-14 b9e4a38 | 12 | 20 | 20 | 88 | keep | beschermd: langlopende artwork-branch |
| `art/nino-chapters-20261024` | remote | 2026-10-24 8af78ac | 12 | 17 | 17 | 44 | archive | gedateerde art-branch; inhoud hoort via `art/master`. Tag en verwijderen |
| `art/nino-complete-20261024` | remote | 2026-10-24 047f743 | 12 | 10 | 10 | 20 | archive | gedateerde art-branch; tag en verwijderen |
| `art/nino-final-closeout-20261107` | remote | 2026-11-07 5976b83 | 12 | 51 | 49 | 92 | archive | gelijk aan lokale `pr75`; closeout V2, tag en verwijderen |
| `art/nino-micro-icons-v2-20261030` | remote | 2026-10-30 5cfcbc3 | 12 | 35 | 35 | 174 | archive | gelijk aan lokale `pr65`; tag en verwijderen |
| `art/nino-pisa-hinge-qa-20261030` | remote | 2026-10-30 92893ae | 12 | 25 | 25 | 63 | archive | gelijk aan lokale `pr63`; tag en verwijderen |
| `art/nino-pizza-rewards-20261024` | remote | 2026-10-25 bf91fb3 | 12 | 23 | 23 | 61 | archive | gedateerde art-branch; tag en verwijderen |
| `art/nino-topo-r3-refinements` | remote | 2026-11-14 ce68ce0 | 12 | 134 | 128 | 222 | merge | 128 commits nog niet in `art/master` en 222 bestanden verschillen met `origin/main`: mergen naar `origin/art/master` (zie herbeoordeling) |
| `art/nino-topo-website-v1` | remote | 2026-11-13 b05a9d5 | 12 | 119 | 113 | 214 | keep | actieve werkstroom (STATE): website |
| `art/nino-travel-stamps-v2-20261026` | remote | 2026-10-27 8a704cb | 12 | 34 | 34 | 173 | archive | gedateerde art-branch; tag en verwijderen |
| `art/nino-venezia-scalloped-20261031` | remote | 2026-10-31 cec9fd2 | 12 | 37 | 37 | 174 | archive | gelijk aan lokale `pr66`; tag en verwijderen |
| `art/pisa-hinge-source-preserving-final-20261103` | remote | 2026-11-03 8414319 | 12 | 30 | 30 | 63 | archive | gelijk aan lokale `pr72`; tag en verwijderen |
| `art/v3-render-assets` | remote | 2026-11-10 b70e1ac | 12 | 105 | 99 | 125 | merge | 99 commits niet in `art/master`, 15 niet in `codex/topo-v3`, 125 bestanden verschillen met `origin/main`: mergen naar `origin/art/master`, 15 resterende commits beoordelen (zie herbeoordeling) |
| `bak/BL-003-pre-rebase` | lokaal | 2026-11-14 fd6bad8 | 5 | 4 | 4 | 8 | archive | lokale backup van BL-003 voor de rebase; 4 unieke commits, alleen lokaal, eerst taggen |
| `codex/issue-50-offline-computer` | remote | 2026-10-27 bd1e57b | 12 | 31 | 30 | 27 | archive | gelijk aan lokale `pr51`; oud issue-werk, tag en verwijderen |
| `codex/issue-52-calm-desktop-learning` | remote | 2026-10-31 940a6a5 | 12 | 60 | 58 | 33 | archive | gelijk aan lokale `pr64`; tag en verwijderen |
| `codex/issue-58-legible-map-picker` | remote | 2026-10-30 46d58ec | 12 | 34 | 33 | 97 | archive | gelijk aan lokale `pr59`; tag en verwijderen |
| `codex/issue-58-rome-vatican-enclave-ui` | remote | 2026-10-29 d7a9921 | 12 | 43 | 42 | 29 | archive | gelijk aan lokale `pr60`; tag en verwijderen |
| `codex/nino-2.0.2` | beide | 2026-11-08 83ec1ce | 12 | 74 | 72 | 5 | archive | V2-release afgerond; tag en verwijderen |
| `codex/nino-settings-exam` | remote | 2026-11-08 36afafa | 12 | 73 | 71 | 17 | archive | V2-werk; tag en verwijderen |
| `codex/nino-v2-artwork-closure-67` | remote | 2026-11-08 f53dc0b | 12 | 80 | 74 | 5 | archive | V2-afsluiting artwork; tag en verwijderen |
| `codex/nino-v2-integration-20261103` | beide | 2026-11-07 bb27e61 | 12 | 71 | 69 | 19 | archive | V2-integratie, achterhaald door V3; tag en verwijderen |
| `codex/passport-scoperte-preparation-20261026` | remote | 2026-10-26 a77d1cf | 12 | 31 | 30 | 33 | archive | gelijk aan lokale `pr49`; tag en verwijderen |
| `codex/topo-lakes-map-layer` | remote | 2026-10-24 35ff21b | 12 | 6 | 6 | 23 | archive | gelijk aan lokale `pr15`; tag en verwijderen |
| `codex/topo-nino-computer-release-20261030` | remote | 2026-10-30 1bf86b3 | 12 | 47 | 45 | 25 | archive | gelijk aan lokale `pr61`; tag en verwijderen |
| `codex/topo-pizza-reward-v2` | remote | 2026-10-25 dcc474e | 12 | 9 | 8 | 69 | archive | gelijk aan lokale `pr29`; tag en verwijderen |
| `codex/topo-release-1-1-polish` | remote | 2026-10-23 a481317 | 12 | 5 | 5 | 23 | archive | gelijk aan lokale `pr9`; tag en verwijderen |
| `codex/topo-release-1-integration` | remote | 2026-10-23 9df4989 | 12 | 4 | 4 | 22 | archive | gelijk aan lokale `pr3`; tag en verwijderen |
| `codex/topo-schoolblad-overlay` | remote | 2026-10-24 1c4d00f | 12 | 9 | 8 | 25 | archive | gelijk aan lokale `pr27`; tag en verwijderen |
| `codex/topo-semantic-map-hotfix` | remote | 2026-10-25 fc8f5be | 12 | 11 | 10 | 29 | archive | gelijk aan lokale `pr39`; tag en verwijderen |
| `codex/topo-v3` | beide | 2026-11-13 55b4d86 | 12 | 226 | 219 | 3 | keep | squash-gemerged via #97, maar Tree-uniek buiten de uitgesloten paden is 3 (> 0): zie herbeoordeling; lokaal: cherry 212, tree 14 |
| `design/approved-map-choice-preview-20261030` | remote | 2026-10-30 b7ee902 | 12 | 47 | 45 | 39 | archive | gelijk aan lokale `pr62`; tag en verwijderen |
| `design/nino-character-content-pack-20261023` | remote | 2026-10-24 2922be8 | 12 | 9 | 9 | 6 | archive | gelijk aan lokale `pr6`; tag en verwijderen |
| `design/nino-cplus-20261102` | remote | 2026-11-02 127d2e0 | 12 | 33 | 32 | 27 | archive | gelijk aan lokale `pr69`; tag en verwijderen |
| `docs/nino-gold-journey-roadmap-20261026` | remote | 2026-10-27 8e0300c | 12 | 19 | 18 | 39 | archive | gelijk aan lokale `pr42`; roadmap is vervangen door `ops/ROADMAP.md` |
| `docs/ontwikkeling` | remote | 2026-11-10 1983bdd | 12 | 1 | 1 | 19 | archive | 1 commit; inhoud beoordelen bij BL-002 (docs-inventaris), tag en verwijderen |
| `docs/v2-afsluiting` | beide | 2026-11-08 5652cf6 | 12 | 77 | 73 | 17 | archive | V2-afsluiting; remote is 1 commit verder (77); tag de remote-sha; lokaal: cherry 72, tree 18 |
| `feat/nino-topo-portal-r2` | remote | 2026-11-14 19a47ba | 12 | 154 | 148 | 222 | keep | actieve werkstroom (STATE): portal |
| `fix/afternoon-ipad-blockers-20261026` | remote | 2026-10-26 b111ed2 | 12 | 30 | 29 | 25 | archive | gelijk aan lokale `pr47`; tag en verwijderen |
| `hermes/nino-art-intake-45` | remote | 2026-10-26 4eb9a5a | 12 | 28 | 28 | 131 | archive | gelijk aan lokale `pr48`; tag en verwijderen |
| `hermes/passport-final-art-qa-8a704cb` | remote | 2026-10-29 9e58e75 | 12 | 35 | 35 | 205 | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `hermes/pr51-offline-computer-qa-bd1e57b` | remote | 2026-10-27 bef79da | 12 | 32 | 31 | 46 | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `hermes/pr59-qa-evidence-d55e9de` | remote | 2026-10-27 7568ffa | 12 | 33 | 32 | 49 | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `hermes/qa-pr39-fc8f5be` | remote | 2026-10-25 40674eb | 12 | 12 | 11 | 64 | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `hermes/topo-discovery-map-production` | remote | 2026-10-25 f67027d | 12 | 10 | 9 | 29 | archive | gelijk aan lokale `pr30`; tag en verwijderen |
| `hermes/topo-exploration-map-design-proof` | remote | 2026-10-24 a5c740c | 12 | 9 | 8 | 69 | archive | gelijk aan lokale `pr26`; tag en verwijderen |
| `hermes/topo-ipad-focus-mode` | remote | 2026-10-26 71b33fd | 12 | 12 | 11 | 36 | archive | gelijk aan lokale `pr40`; tag en verwijderen |
| `hermes/topo-nino-visual-integration` | remote | 2026-10-24 4f15b61 | 12 | 6 | 6 | 22 | archive | gelijk aan lokale `pr14`; tag en verwijderen |
| `integration/topo-release-1-2-nino-lakes` | remote | 2026-10-24 c68ace4 | 12 | 8 | 7 | 23 | archive | gelijk aan lokale `pr17`; tag en verwijderen |
| `land/fr-geo` | remote | 2026-11-13 dc9d094 | 12 | 212 | 205 | 89 | keep | actieve werkstroom (STATE): Frankrijk geometrie |
| `land/fr-inhoud` | remote | 2026-11-12 dc46b20 | 12 | 205 | 198 | 57 | keep | actieve werkstroom (STATE): Frankrijk inhoud |
| `main` | beide | 2026-11-14 52427b5 | 0 | 0 | 0 | 0 | keep | beschermd; lokale `main` en `origin/main` zijn gelijk (`52427b5`) |
| `night/2026-11-13` | lokaal | 2026-11-13 84f238b | 9 | 0 | 0 | 0 | delete | Cherry-uniek = 0 en Tree-uniek = 0: geen eigen commits en geen eigen inhoud, `84f238b` zit in `origin/main` |
| `night/2026-11-14` | beide | 2026-11-14 1f69dbe | 9 | 2 | 2 | 4 | archive | niet meer beschermd (vervangen door `night/2026-11-15`); 2 unieke commits en 4 unieke bestanden, eerst taggen; lokaal: cherry 1, tree 1 |
| `night/2026-11-15` | lokaal | 2026-11-14 52427b5 | 0 | 0 | 0 | 0 | keep | beschermd: huidige nachtbranch (zelfde sha als `origin/main`) |
| `ops/bl012` | remote | 2026-11-14 e1a526d | 3 | 1 | 0 | 2 | delete | Cherry-uniek = 0: de commit is patch-equivalent in `origin/main` (squash-PR) |
| `ops/domein` | remote | 2026-11-13 1639a5a | 11 | 1 | 0 | 3 | delete | Cherry-uniek = 0: de commit is patch-equivalent in `origin/main` (squash-PR) |
| `ops/domein-gekocht` | remote | 2026-11-14 4edd622 | 5 | 1 | 0 | 3 | delete | Cherry-uniek = 0: de commit is patch-equivalent in `origin/main` (squash-PR) |
| `ops/favicon-r3` | remote | 2026-11-14 997b543 | 4 | 1 | 0 | 3 | delete | Cherry-uniek = 0: de commit is patch-equivalent in `origin/main` (squash-PR) |
| `ops/model-routing` | remote | 2026-11-14 9d33ef4 | 7 | 1 | 0 | 1 | delete | Cherry-uniek = 0: de commit is patch-equivalent in `origin/main` (squash-PR) |
| `ops/night1` | remote | 2026-11-14 9717000 | 8 | 3 | 2 | 4 | archive | 2 unieke commits en 4 unieke bestanden; eerst beoordelen of ze nodig zijn, tag voor verwijderen |
| `ops/nightly-fix` | remote | 2026-11-14 ac34164 | 9 | 1 | 0 | 3 | delete | Cherry-uniek = 0: de commit is patch-equivalent in `origin/main` (squash-PR) |
| `ops/nightly-install` | remote | 2026-11-13 0298f15 | 10 | 1 | 0 | 2 | delete | Cherry-uniek = 0: de commit is patch-equivalent in `origin/main` (squash-PR) |
| `ops/setup` | remote | 2026-11-13 2f3e706 | 12 | 1 | 0 | 13 | delete | Cherry-uniek = 0: de commit is patch-equivalent in `origin/main` (squash-PR) |
| `pr14` | lokaal | 2026-10-24 4f15b61 | 12 | 6 | 6 | 22 | archive | lokale kopie van `hermes/topo-nino-visual-integration` (zelfde sha) |
| `pr15` | lokaal | 2026-10-24 35ff21b | 12 | 6 | 6 | 23 | archive | lokale kopie van `codex/topo-lakes-map-layer` (zelfde sha) |
| `pr17` | lokaal | 2026-10-24 c68ace4 | 12 | 8 | 7 | 23 | archive | lokale kopie van `integration/topo-release-1-2-nino-lakes` (zelfde sha) |
| `pr2` | lokaal | 2026-10-23 141a0f9 | 12 | 1 | 1 | 3 | archive | lokale kopie van `work/topo-sync-2026-10-23` (zelfde sha) |
| `pr26` | lokaal | 2026-10-24 a5c740c | 12 | 9 | 8 | 69 | archive | lokale kopie van `hermes/topo-exploration-map-design-proof` (zelfde sha) |
| `pr27` | lokaal | 2026-10-24 1c4d00f | 12 | 9 | 8 | 25 | archive | lokale kopie van `codex/topo-schoolblad-overlay` (zelfde sha) |
| `pr29` | lokaal | 2026-10-25 dcc474e | 12 | 9 | 8 | 69 | archive | lokale kopie van `codex/topo-pizza-reward-v2` (zelfde sha) |
| `pr3` | lokaal | 2026-10-23 9df4989 | 12 | 4 | 4 | 22 | archive | lokale kopie van `codex/topo-release-1-integration` (zelfde sha) |
| `pr30` | lokaal | 2026-10-25 f67027d | 12 | 10 | 9 | 29 | archive | lokale kopie van `hermes/topo-discovery-map-production` (zelfde sha) |
| `pr39` | lokaal | 2026-10-25 fc8f5be | 12 | 11 | 10 | 29 | archive | lokale kopie van `codex/topo-semantic-map-hotfix` (zelfde sha) |
| `pr40` | lokaal | 2026-10-26 71b33fd | 12 | 12 | 11 | 36 | archive | lokale kopie van `hermes/topo-ipad-focus-mode` (zelfde sha) |
| `pr42` | lokaal | 2026-10-27 8e0300c | 12 | 19 | 18 | 39 | archive | lokale kopie van `docs/nino-gold-journey-roadmap-20261026` (zelfde sha) |
| `pr47` | lokaal | 2026-10-26 b111ed2 | 12 | 30 | 29 | 25 | archive | lokale kopie van `fix/afternoon-ipad-blockers-20261026` (zelfde sha) |
| `pr48` | lokaal | 2026-10-26 4eb9a5a | 12 | 28 | 28 | 131 | archive | lokale kopie van `hermes/nino-art-intake-45` (zelfde sha) |
| `pr49` | lokaal | 2026-10-26 a77d1cf | 12 | 31 | 30 | 33 | archive | lokale kopie van `codex/passport-scoperte-preparation-20261026` (zelfde sha) |
| `pr51` | lokaal | 2026-10-27 bd1e57b | 12 | 31 | 30 | 27 | archive | lokale kopie van `codex/issue-50-offline-computer` (zelfde sha) |
| `pr59` | lokaal | 2026-10-30 46d58ec | 12 | 34 | 33 | 97 | archive | lokale kopie van `codex/issue-58-legible-map-picker` (zelfde sha) |
| `pr6` | lokaal | 2026-10-24 2922be8 | 12 | 9 | 9 | 6 | archive | lokale kopie van `design/nino-character-content-pack-20261023` (zelfde sha) |
| `pr60` | lokaal | 2026-10-29 d7a9921 | 12 | 43 | 42 | 29 | archive | lokale kopie van `codex/issue-58-rome-vatican-enclave-ui` (zelfde sha) |
| `pr61` | lokaal | 2026-10-30 1bf86b3 | 12 | 47 | 45 | 25 | archive | lokale kopie van `codex/topo-nino-computer-release-20261030` (zelfde sha) |
| `pr62` | lokaal | 2026-10-30 b7ee902 | 12 | 47 | 45 | 39 | archive | lokale kopie van `design/approved-map-choice-preview-20261030` (zelfde sha) |
| `pr63` | lokaal | 2026-10-30 92893ae | 12 | 25 | 25 | 63 | archive | lokale kopie van `art/nino-pisa-hinge-qa-20261030` (zelfde sha) |
| `pr64` | lokaal | 2026-10-31 940a6a5 | 12 | 60 | 58 | 33 | archive | lokale kopie van `codex/issue-52-calm-desktop-learning` (zelfde sha) |
| `pr65` | lokaal | 2026-10-30 5cfcbc3 | 12 | 35 | 35 | 174 | archive | lokale kopie van `art/nino-micro-icons-v2-20261030` (zelfde sha) |
| `pr66` | lokaal | 2026-10-31 cec9fd2 | 12 | 37 | 37 | 174 | archive | lokale kopie van `art/nino-venezia-scalloped-20261031` (zelfde sha) |
| `pr69` | lokaal | 2026-11-02 127d2e0 | 12 | 33 | 32 | 27 | archive | lokale kopie van `design/nino-cplus-20261102` (zelfde sha) |
| `pr7` | lokaal | 2026-10-24 ba573df | 12 | 5 | 5 | 22 | archive | **alleen lokaal, geen remote-tegenhanger**: uniek, dus eerst taggen (`archive/pr7`) |
| `pr70` | lokaal | 2026-11-08 25ad874 | 12 | 75 | 71 | 17 | archive | **alleen lokaal, geen remote-tegenhanger**: uniek, dus eerst taggen (`archive/pr70`) |
| `pr72` | lokaal | 2026-11-03 8414319 | 12 | 30 | 30 | 63 | archive | lokale kopie van `art/pisa-hinge-source-preserving-final-20261103` (zelfde sha) |
| `pr75` | lokaal | 2026-11-07 5976b83 | 12 | 51 | 49 | 92 | archive | lokale kopie van `art/nino-final-closeout-20261107` (zelfde sha) |
| `pr9` | lokaal | 2026-10-23 a481317 | 12 | 5 | 5 | 23 | archive | lokale kopie van `codex/topo-release-1-1-polish` (zelfde sha) |
| `qa/hermes-harness-v2-beeaef4` | remote | 2026-11-06 f8d7e2e | 12 | 83 | 81 | 311 | archive | QA-verdict; tag `archive/qa/hermes-harness-v2-beeaef4` en verwijderen |
| `qa/hermes-nino-v2-closure-67` | remote | 2026-11-03 827ebaf | 12 | 50 | 48 | 112 | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `qa/hermes-nino2-final-71` | remote | 2026-11-03 64216f6 | 12 | 59 | 57 | 136 | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `qa/hermes-pisa-final-72` | remote | 2026-11-03 a4248da | 12 | 31 | 31 | 162 | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `qa/hermes-playable-b06b130` | remote | 2026-11-06 f9b79d8 | 12 | 64 | 62 | 74 | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `qa/hermes-r2-final-bb27e61` | remote | 2026-11-07 9fff2e9 | 12 | 72 | 70 | 40 | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `qa/v3-app-1a42590` | remote | 2026-11-09 f4aa376 | 12 | 100 | 94 | 514 | archive | V3-QA-verdict; tag `archive/qa/...` en verwijderen (eventueel eerst als bijlage bij BL-004) |
| `qa/v3-art-05ab1d0` | remote | 2026-11-09 6fb8831 | 12 | 103 | 97 | 136 | archive | V3-QA-verdict; tag `archive/qa/...` en verwijderen |
| `qa/v3-art-908b4a4` | remote | 2026-11-09 a4af571 | 12 | 100 | 94 | 186 | archive | V3-QA-verdict; tag `archive/qa/...` en verwijderen |
| `qa/v3-ge01-6934799` | remote | 2026-11-09 ae87421 | 12 | 102 | 96 | 245 | archive | V3-QA-verdict; tag `archive/qa/...` en verwijderen |
| `qa/v3-reis-afb32d1` | remote | 2026-11-09 697e815 | 12 | 84 | 78 | 282 | archive | V3-QA-verdict; tag `archive/qa/...` en verwijderen |
| `release/topo-nino-computer-v1-20261030` | remote | 2026-10-30 1bf86b3 | 12 | 47 | 45 | 25 | archive | zelfde sha als `codex/topo-nino-computer-release-20261030`; tag en verwijderen |
| `t/BL-002-docs-inventaris` | beide | 2026-11-14 44a4ce0 | 5 | 3 | 3 | 7 | keep | open taakbranch BL-002 (review), nog niet gemerged; blijft tot de merge |
| `t/BL-003-state-herleidbaar` | beide | 2026-11-15 85274c7 | 1 | 8 | 8 | 9 | keep | open taakbranch BL-003 (review), nog niet gemerged; blijft tot de merge |
| `t/BL-005-integratie` | beide | 2026-11-14 e09d33e | 1 | 227 | 219 | 0 | delete | Tree-uniek = 0 (Cherry-uniek 219, vangt de squash): alle inhoud staat via #91/#97 al in `origin/main` |
| `t/BL-013-portal-r3` | remote | 2026-11-14 c738fd8 | 2 | 6 | 5 | 7 | keep | open taakbranch BL-013 (review), 5 commits nog niet in `origin/main`; blijft tot de merge |
| `t/BL-015-v3-release` | beide | 2026-11-15 05ca133 | 0 | 1 | 1 | 8 | keep | open taakbranch BL-015, nog niet gemerged; blijft tot de merge |
| `v3/relief-z8` | remote | 2026-11-09 2a7b0cf | 12 | 85 | 79 | 58 | merge | 2 commits niet in `codex/topo-v3`, 58 bestanden verschillen met `origin/main`: mergen naar `codex/topo-v3` (zie herbeoordeling) |
| `work/topo-sync-2026-10-23` | remote | 2026-10-23 141a0f9 | 12 | 1 | 1 | 3 | archive | gelijk aan lokale `pr2`; tag en verwijderen |

## Herbeoordeling merge-rijen en codex/topo-v3
Ref = `origin/<branch>`, merge-base met `origin/main` = `7e38160` voor alle vier. Top-mappen = `comm -12 ... | cut -d/ -f1-2 | sort | uniq -c | sort -rn | head`.

| Branch | Cherry vs `origin/main` | Tree-uniek | Extra getal | Top-mappen tree-uniek | Uitkomst |
|---|---|---|---|---|---|
| `art/nino-topo-r3-refinements` | 128 | 222 | `git cherry origin/art/master` = 128; (vs `origin/codex/topo-v3` = 44) | `assets/nino-topo` 97, `docs/qa` 76, `assets/v3` 30, `scripts/v3` 5, `docs/v3` 3 | merge naar `origin/art/master`: nog uniek en niet vervangen |
| `art/v3-render-assets` | 99 | 125 | `git cherry origin/art/master` = 99; (vs `origin/codex/topo-v3` = 15) | `docs/qa` 76, `assets/v3` 30, `scripts/v3` 5, `docs/v3` 3, `scripts/qa-v3-stijlbeeld.py` 1 | merge naar `origin/art/master`; `docs/qa` valt onder de uitsluitingen, dus eerst de 15 resterende commits beoordelen |
| `v3/relief-z8` | 79 | 58 | `git cherry origin/codex/topo-v3` = 2 | `docs/qa` 40, `scripts/geography` 4, `scripts/v3` 3, `assets/discovery` 2, `scripts/qa-v3-reis.py` 1 | merge naar `codex/topo-v3`: 2 commits nog uniek (rest is erin opgenomen); `docs/qa`-bestanden vallen onder de uitsluitingen |
| `codex/topo-v3` | 219 | 3 | Tree-uniek buiten `docs/qa`, `docs/visual`, `output/installers`, `output/html` = 3 | `package.json` 1, `docs/DECISIONS.md` 1, `AGENTS.md` 1 | `keep` (3 > 0): inhoud via #97 in `main`; de 3 bestanden zijn mogelijk later in `main` verder aangepast en moeten handmatig vergeleken worden (`git diff origin/main origin/codex/topo-v3 -- package.json AGENTS.md docs/DECISIONS.md`) |

Opmerking `codex/topo-v3`: lokaal cherry 212, tree 14 (lokale ref loopt achter op de remote). Alle 3 tree-unieke bestanden liggen buiten de uitgesloten paden; de uitgesloten paden zelf (`docs/qa`, `docs/visual`, `output/*`) gaan via BL-005c-tags.

## Samenvatting
- keep: 13 (`main`, `night/2026-11-15`, `art/master`, `arch/v3-runtime`, `feat/nino-topo-portal-r2`, `art/nino-topo-website-v1`, `land/fr-geo`, `land/fr-inhoud`, `codex/topo-v3`, `t/BL-002-docs-inventaris`, `t/BL-003-state-herleidbaar`, `t/BL-013-portal-r3`, `t/BL-015-v3-release`)
- merge: 3 (`art/nino-topo-r3-refinements`, `art/v3-render-assets` naar `origin/art/master`; `v3/relief-z8` naar `codex/topo-v3`)
- archive: 94
- delete: 10 (`night/2026-11-13`, `t/BL-005-integratie` [Tree 0], en 8 `ops/*`-branches [Cherry 0]: `ops/bl012`, `ops/domein`, `ops/domein-gekocht`, `ops/favicon-r3`, `ops/model-routing`, `ops/nightly-fix`, `ops/nightly-install`, `ops/setup`)
- Totaal: 13 + 3 + 94 + 10 = 120
- Na opruiming: 13 branches (alle `keep`; `merge`-rijen verdwijnen na het mergen, `archive` en `delete` na taggen/akkoord). De 4 `t/BL-*`-branches verdwijnen zodra hun taak gemerged is, dan blijven er 9. Taakbranches (zonder `main`, `art/master`, nachtbranch): nu 10, na de merges 6 (norm ≤ 5): `codex/topo-v3` (V3.0, M0), `feat/nino-topo-portal-r2` (portal, M0), `art/nino-topo-website-v1` (website, M0), `land/fr-geo` en `land/fr-inhoud` (FR-data parallel op Codex, code gepauzeerd tot M1), `arch/v3-runtime` (runtime-migratie M1). Voorstel: `land/fr-geo` en `land/fr-inhoud` samenvoegen (GIT_RELEASE §1).
- Dubbel werk: de lokale `pr*`-branches die dezelfde sha hebben als een remote-branch zijn dubbelen; `pr7` en `pr70` zijn alleen lokaal en uniek (eerst taggen).

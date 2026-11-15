# Evaluatie BL-001b — branch-inventaris afronden

VERDICT: PASS met voorbehoud (poging 3, HEAD 0148ccf, origin/main 52427b5, evaluator Opus, nieuwe context)

## Verloop
- Poging 1 (60a90a2): FAIL op crit. 10. `art/v3-render-assets` stond op `merge`, maar zit volledig in `art/nino-topo-r3-refinements` (`merge-base --is-ancestor` slaagt, cherry 0) en hoort dus op `archive`.
- Poging 2 (4538110): FAIL op crit. 14. STATE optie (a) en RUNLOG noemden nog de oude tellingen (94 archive / 3 merge).
- Poging 3 (0148ccf): 14/14 PASS. Elk criterium is herberekend met read-only git over alle 120 rijen.

## Uitkomst
keep 13 · merge 2 · archive 95 · delete 10, samen 120. Refs en tags zijn ongewijzigd (134 / 6). Er is niet gefetcht.

## Voorbehoud
1. De rij `night/2026-11-15` is een momentopname op 52427b5 (de branch draagt de rapportcommits zelf). Dat staat zo gemarkeerd in de tabel, en de actie `keep` verandert niet.
2. In BACKLOG zijn bij BL-001b ook de kolommen Bouwer en Contract aangepast, niet alleen de status. Dat is een kleine scope-overschrijding.

## Buiten scope (idee)
- `codex/topo-v3` staat op `keep` door 3 tree-unieke bestanden (`AGENTS.md`, `docs/DECISIONS.md`, `package.json`). Dat zijn alleen verwijderingen ten opzichte van main. Na een handmatige check kan de branch naar `archive`.
- `ops/setup` heeft Cherry 0 maar Tree 13. Bekijk de branch handmatig voordat hij verwijderd wordt.
- Fetch en draai de lus opnieuw vóór de echte opruiming.

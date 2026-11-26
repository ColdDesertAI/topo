# Git, Vercel en release

## 1. Branchmodel (trunk-based)
- **`main` = de waarheid en productie.** Altijd groen, altijd deploybaar.
- Taakbranches: `t/BL-123-korte-naam`, leven ≤ 3 dagen, één taak per branch.
- Geen bouwende nachtrun (sinds 25-11). Automatisch werk loopt via de wekelijkse review (`LOOPS.md`): rapport + kleine fix-PR's, nooit automatisch mergen.
- Langlopende branches alleen voor assets: `art/master`. Code gaat altijd via taakbranches.
- **Maximaal 5 open taakbranches.** Zijn het er meer, dan gaat de nachtrun eerst integreren voordat er iets nieuws gebouwd wordt.
- Een land in ontwikkeling krijgt geen eigen langlopende branch. Het landpakket gaat in kleine PR's naar `main` achter een flag (`lands.<id>.status = "draft"`) en is pas zichtbaar na G4.

## 2. Commits en PR's
- Conventional commits: `feat:` `fix:` `art:` `docs:` `test:` `chore:` `refactor:`, eventueel met scope (`feat(fr): …`).
- Een PR bevat altijd:
  - een link naar de taak (BL-ID) en het contract;
  - de evaluatie (PASS met bewijs);
  - de preview-URL;
  - screenshots alleen bij een UI-wijziging;
  - een risico- en rollbackregel.
- Squash-merge naar `main` (merge-commit alleen voor `art/master`). De branch wordt automatisch verwijderd (repo-instelling aan sinds 26-11).

## 3. Vercel
| Omgeving | Bron | Wie |
|---|---|---|
| Preview | alleen op verzoek van Dennis (handmatig) | regie |
| Productie | elke merge op `main` | via PR; G4 door Dennis voor alles wat de site zichtbaar verandert |
- **Besluit 26-11 (2a):** elke merge op `main` gaat direct live. Tags (`v3.0.0`, `fr-1.0.0`) markeren een versie, ze sturen de deploy niet.
- **`main` is beschermd** (ruleset "Protect main", 26-11): alleen via een PR (0 approvals), geen force-push, niet verwijderbaar. Directe pushes naar `main` kunnen niet meer; de afspraak van 19-11 ("fixes direct op main") vervalt.
- Docs-only PR's (ops, contracten, rapporten, STATE) mag de regie zelf mergen. Alles wat de site verandert: PASS van de evaluator, daarna G4 of een fix binnen een goedgekeurd BL-item.
- Website/portal en app in dezelfde repo, op aparte paden. Gebruik één Vercel-project tenzij het niet anders kan.

## 4. Versies en release
- SemVer per product: app `vX.Y.Z`, per land `<id>-X.Y.Z`.
- Releasechecklist = gate G3 in `QUALITY.md`, en daarna G4.
- `CHANGELOG.md` wordt bij elke release uit de PR-titels gegenereerd. Er komen geen losse release-docs meer.

## 5. Rollback
- Vercel: "Promote" van de vorige productiedeploy. Doel: binnen 2 minuten terug.
- Data: opslagmigraties zijn altijd idempotent en lezen de oude vorm (zie `ARCHITECTUUR.md` §3).

## 6. Branch-opruiming (eenmalig, BL-001)
- Branch volledig in `main` → verwijderen.
- `qa/*`-branches met verdicts → verdict als bijlage bij de bijbehorende PR, tag `archive/qa/<naam>`, branch verwijderen.
- Uniek werk dat niet in de roadmap past → tag `archive/<naam>`, branch verwijderen.
- **Verwijderen pas na akkoord van Dennis op de inventaris.** Tags maken mag zonder akkoord.

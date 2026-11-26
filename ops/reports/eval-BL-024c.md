# Evaluatie BL-024c — Glascheck: mutatiedoel op elke maat, bewaking kleurformaat

VERDICT: PASS

Evaluator: evaluator-subagent (Opus), 23-11-2026 02:30–03:02. Bouwcommit b3861c8d, baseline cdc009b5, branch night/2026-11-23.
Preview: bestaande output/html/TOPO-V3-Reis-Preview.html (01:36), niet herbouwd. Geen full build. 5 smokes na elkaar, allemaal met QA_AA_LOG=1.
Baseline-scripts als kopie buiten de repo (/tmp/eval024c/scripts/, met qa-v3-icons-lib.mjs van cdc009b5 en QA_HTML op dezelfde file-URL).
(Rapport opgeslagen door de hoofdsessie: de evaluator mocht niet schrijven.)

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | Alleen QA-script, één commit | git log cdc009b5..HEAD, git show --stat, git status | PASS | 9ecac2c1 (alleen ops/BACKLOG.md, ops/contracts/BL-024c.md) en b3861c8d (alleen scripts/qa-v3-menu1.mjs, +15/−5). Werkboom schoon, geen scripts/.qa-base.tmp.mjs. |
| 2 | Lint en tests groen | npm run lint; NODE_OPTIONS=--max-old-space-size=8192 npm test | PASS | lint exit 0; test exit 0 (laatste suite 7/6 pass/0 fail/1 skipped; die skip stond al in de uitvoer van eval BL-024b). |
| 3 | Geen regressie zonder mutatie | --smoke + QA_AA_LOG=1, baseline-kopie tegen HEAD, diff | PASS | diff leeg: byte-identiek (207 regels, ook alle AA-LOG-getallen). Exit 0/0. |
| 4 | Opacity-mutatie op elke maat | QA_MUTATE_OPACITY=1 QA_AA_LOG=1 --smoke op HEAD | PASS | Vooraf zichtbaar: .v3Panel .v3CardTitle op overzicht p5 9.49 / 9.51 / 10.63 (1 element per maat). Met mutatie: p5 1.94 / 1.94 / 1.98, alpha=0.35 op 1440×900, 1080×810 en 810×1080; meldingen "AA .v3Panel .v3CardTitle 1.94 < 3 (dekking 0.35)" en "… 1.98 < 3 (dekking 0.35)" op 810×1080. Exit 1, 10 fouten. |
| 5 | Mutatie opgeruimd na overzicht | Dezelfde run | PASS | 0 AA-LOG-regels buiten overzicht met alpha≠1. Alle 10 "(dekking"-regels op overzicht. diff tegen HEAD raakt alleen de overzicht-regels, de samenvatting (1.17→0.38, alleen overzicht) en de foutlijst. hoofdstuk CardTitle blijft 9.5 / 9.51 / 10.64, alpha=1. |
| 6 | Kleurformaat-mutatie HEAD en baseline | QA_MUTATE_COLOR=1 op HEAD; baseline-kopie met dezelfde inline kleur plus opruimen | PASS | HEAD: precies 3 meldingen (één per maat) "AA kleurformaat onbekend: .v3Panel .v3CardTitle oklch(0.45 0.05 290)", geen AA-LOG voor die box op overzicht. Exit 1. Baseline: 0 kleurformaat-meldingen. De computed kleur is ook daar oklch(0.45 0.05 290) (zelf uitgelezen), maar wordt stil gemeten als p5 4.6 / 4.61 / 5.16 met "OK: geen fouten", exit 0. |
| 7 | Geen app-bestand geraakt | git diff cdc009b5..HEAD --name-only | PASS | Alleen ops/BACKLOG.md, ops/contracts/BL-024c.md en scripts/qa-v3-menu1.mjs. |
| 8 | Bewaking op beide leesplekken | Codecontrole contrast() r.114–141 | PASS | r.119: de alfa-match staat achter /^rgba?\(/.test(...). r.122–124: info wordt gefilterd met fail() per afgewezen box vóór de screenshot en de pixelstap (r.134, RGB-match). Geen andere kleur-matches gevonden (grep). |
| 9 | Looptijd | Wandklok van de smokes van crit. 3 | PASS | baseline 300 s, HEAD 299 s (1,00×; grens 1,2×). |

Geen UI-criteria: er is geen app-bestand geraakt (crit. 7), dus ook geen screenshot of Golden Screen-vergelijking.

FAIL-redenen: geen.

Buiten scope opgemerkt (→ backlog-idee):
- Het opruimen wist onvoorwaardelijk inline opacity én color op #v3ListTitle en het eerste .v3Panel .v3CardTitle, ook als maar één mutatie aanstond. Nu onschadelijk, want de app zet daar geen inline stijl. Zet de app daar ooit wel zelf inline stijl, dan wist een mutatierun die stil. Beter: de oude waarden bewaren en terugzetten.
- Het opruimen en de AA-foutlus staan op één lange regel (r.242): slecht leesbaar, wel correct.
- De formaatbewaking weigert alleen. oklch()/color() omrekenen naar sRGB staat expliciet buiten de scope.

Les: een mutatietoets op een kopie van de baseline moet de mutatie én de opruiming nabootsen en de computed waarde teruglezen. Alleen zo weet je dat de oude code dezelfde invoer kreeg. Hier mat de oude code oklch(0.45 0.05 290) stil als p5≈4,6 en gaf ze "OK".

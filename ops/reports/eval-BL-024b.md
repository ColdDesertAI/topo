# Evaluatie BL-024b — Glascheck: tekst-opacity en kleuralfa in de contrastmeting

Evaluator (Opus), 2026-11-23. Branch `night/2026-11-23`, bouwcommit `fb28dfbd`, basis `77dda75d`.
Preview opnieuw gebouwd met `node scripts/build-v3-preview.mjs` (sha256 `c01f9ea1…d696`). Alle smokes draaiden op die ene preview, met `QA_OUT` en de baseline buiten de repo in `/tmp/bl024b-eval/`. Schijf: 1,7 GB vrij, dus geen full build.

VERDICT: PASS

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | Alleen het QA-script, één commit | `git log --oneline 77dda75d..HEAD`, `git show --stat HEAD`, `git status --porcelain` | PASS | 1 commit (`fb28dfbd`) met de juiste boodschap, alleen `scripts/qa-v3-menu1.mjs` (+19/−9). Geen `scripts/.qa-base.tmp.mjs`. Porcelain toont alleen `M ops/BACKLOG.md` en `?? ops/contracts/BL-024b.md`. Die komen van de hoofdsessie (ops/*), niet van de bouwer. |
| 2 | Lint en tests groen | `npm run lint`; `NODE_OPTIONS=--max-old-space-size=8192 npm test` | PASS | lint exit 0; test exit 0 (7 tests: 6 pass, 0 fail, 1 skipped) |
| 3 | Smoke zonder crash | `node scripts/qa-v3-menu1.mjs --smoke` op HEAD | PASS | exit 0, `OK: geen fouten` |
| 4 | Geen regressie bij volle dekking | baseline-script (`git show 77dda75d:…` naar /tmp) en HEAD, allebei `--smoke`, `diff` van de volledige uitvoer | PASS | `diff base.txt head.txt` is leeg: de uitvoer is byte-identiek (39 regels), er zijn geen nieuwe meldingen. De `alpha===1`-tak gebruikt dezelfde `fg` als voorheen, dus de uitkomst is exact gelijk. |
| 5 | Dekking wordt gemeten | `QA_AA_LOG=1 … --smoke`, AA-LOG-regels geteld | PASS | 168 AA-LOG-regels. Elk scherm in de hoofdmatrix (overzicht, hoofdstuk, oefenen, toets, toetsresultaat, rewards, voortgang) heeft per maat (1440×900, 1080×810, 810×1080) ≥ 1 regel; daarnaast les-resultaat op 6 maten. Alle 168 regels hebben `alpha=1`, dus binnen (0,1]. Zonder `QA_AA_LOG`: 0 AA-LOG-regels. De uitvoer zonder AA-LOG-regels is gelijk aan die van de gewone run. |
| 6 | Mutatie: half-doorzichtige tekst valt op | `QA_MUTATE_OPACITY=1 QA_AA_LOG=1 … --smoke` op HEAD; baseline in /tmp met dezelfde inline `opacity:.35` op `#v3ListTitle` | PASS (met toelichting over 810×1080) | HEAD: 1440×900 en 1080×810 geven `#v3ListTitle p5=1.7 ink=1.71 alpha=0.35` (zonder mutatie p5=6.48), met de meldingen `AA #v3ListTitle 1.7 < 4.5 (dekking 0.35)` en `AA getekend … (dekking 0.35)`. Exit 1 met precies die 4 fouten. Baseline met mutatie: `p5=6.48` op beide maten, gelijk aan zonder mutatie, dus de oude p5 zag het niet. 810×1080: zie de toelichting hieronder. |
| 7 | Geen app-bestand geraakt | `git diff 77dda75d..HEAD --name-only` | PASS | alleen `scripts/qa-v3-menu1.mjs` |
| 8 | Formule klopt | eigen herberekening in Node (eigen lin/L/menging) op de verborgen screenshot van 1440×900 met de mutatie; codecontrole | PASS | Kleur `rgb(93, 88, 115)`, opacity-keten `0.35·1·1·…` geeft alpha 0.35. Pixel bg (252,250,246) gemengd tot (196.4, 193.3, 200.2) geeft ratio 1.700 (ongemengd 6.480). Eigen p5 over 714 monsters: **1.700**, script 1.7, verschil 0.000 (≤ 0,05). In de code gebeurt de menging per kanaal vóór `L()`, en `alpha` = kleuralfa (index 3, standaard 1) × het product van `opacity` over `e` en alle `parentElement` tot en met `<html>`. |
| 9 | Looptijd ≤ 1,2× de baseline | wandkloktijd van de smoke, achter elkaar gedraaid | PASS | baseline 301 s, HEAD 299 s (0,99×) |

## Toelichting criterium 6 en 810×1080 (claim van de bouwer)
De bouwer zegt dat er op 810×1080 geen `#v3ListTitle`-meting is. **Dat klopt, en het ligt niet aan deze wijziging.** Mijn eigen probe op de preview toont dat `#v3ListTitle` op 810×1080 visueel verborgen is (sr-only): box 1×1 px en `clip: rect(0px, 0px, 0px, 0px)`. Het bestaande filter in `contrast()`, dat niet gewijzigd is, slaat zulke tekst bewust over. Ook het baseline-script heeft op 810×1080 geen `#v3ListTitle`-regel, met of zonder mutatie. Op die maat is er geen zichtbare tekst die de mutatie kan dimmen. "Per maat" geldt daarom voor de maten waarop het element getekend wordt, en daar wordt het criterium gehaald.

Ik wilde niet aannemen dat de meting op iPad-portret werkt, dus heb ik een extra controle gedaan. In een kopie in /tmp heb ik de mutatie op een element gezet dat op 810×1080 wel zichtbaar is (`.v3Panel .v3CardTitle`, `QA_SIZES=810x1080`). Uitkomst: `p5=1.98 ink=2.02 alpha=0.35` (zonder mutatie p5=10.63), met de melding `AA .v3Panel .v3CardTitle 1.98 < 3 (dekking 0.35)`. Dit is geen contractcriterium, maar het neemt de twijfel weg.

## Overige waarnemingen (geen FAIL)
- De baseline met mutatie had al wél een `AA getekend #v3ListTitle 1.71 < 4.5`-melding: de ink-maat zag de dimming. Het contract zegt dit ook ("ink ziet een deel daarvan"). De winst van BL-024b zit in p5, en die is aangetoond.
- De mutatie blijft na overzicht op de pagina staan, omdat `goto` met alleen een andere hash geen herlaad doet. Dat heeft geen effect: `#v3ListTitle` staat alleen in `FREE.overzicht`, en de AA-minima van de andere schermen zijn gelijk aan die van de gewone run.
- DoD: de geografie en de karakterisering zijn niet geraakt (alleen een QA-script, criterium 7). STATE, RUNLOG en de PR zijn werk voor de hoofdsessie.

FAIL-redenen (concreet, reproduceerbaar): geen.

Buiten scope opgemerkt (→ backlog-idee):
- Het mutatiedoel `#v3ListTitle` is op 810×1080 sr-only, dus de beveiligingstoets bewijst niets op iPad-portret. Idee: laat `QA_MUTATE_OPACITY` ook een element dimmen dat op elke maat zichtbaar is (bijv. `.v3Panel .v3CardTitle`), zodat de toets op iPad-portret ook bewijs geeft.
- De kleuralfa wordt gelezen met `match(/[\d.]+/g)[3]`. Dat werkt voor `rgb()`/`rgba()`, maar niet als Chromium ooit `color(srgb …)`/`oklch(…)` als computed color teruggeeft (dan worden de getallen verkeerd gelezen). Idee: een guard met een melding bij een onbekend kleurformaat.
- Het opruimen van `/tmp/bl024b-eval/` (baseline-kopieën, logs) werd door de permissies geweigerd (`rm -rf` denied). Het staat buiten de repo en is onschadelijk, maar moet nog handmatig opgeruimd worden.

Les: noem in het contract voor een mutatietoets "per maat" alleen maten waarop het doelelement zichtbaar is, of kies een doel dat op elke maat getekend wordt. Controleer de zichtbaarheid van het doel vóór je het criterium schrijft.

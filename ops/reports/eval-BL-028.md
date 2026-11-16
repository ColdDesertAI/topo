# Evaluatie BL-028: een toets geeft geen pizzapunten

Branch `claude/nightly-pr99-kaart-feestje-fvpl06`, commit `181c7c2`. Tijdens de toets kwam er `454c203` bij (alleen `ops/scripts/nightly.sh`), dus de broncode en de tests zijn gelijk aan `181c7c2`. Alles hieronder heb ik zelf gedraaid. Tijdelijke scripts staan in de scratchpad, niet in de repo. De werkboom is schoon; de preview-build staat in `.gitignore`.

VERDICT: PASS

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | Goed toetsantwoord: `slices`, `pizzas`, `trips` en `good` blijven gelijk; dagdoel telt mee | `node scripts/exam-flow.test.mjs` plus een mutatietoets | PASS | Groen: "Finite geography test, point/write grading, scoring, skips and restart: OK". Nieuwe asserts: `daily===1` (teller op `recordDailyCorrect`) en `[good,slices,pizzas,trips]` = `[0,0,0,0]`. Mutatietoets: dezelfde test op `index.html` met de oude regel `const reward=TopoLearning.award(state);` faalt met `AssertionError: a test answer gives no pizza points, pizzas or trips`. De test vangt de bug dus echt. |
| 2 | Oefenen geeft nog steeds een punt per goed antwoord | `nino-art.test.mjs` test 6 (vrij oefenen: slices 7 → pizza 1, plus een rit bij de drempel, identiek aan de baseline) en een browsercheck | PASS | Testsuite groen. In de V3-preview (`#nieuw`) via Oefenen → "Namen schrijven" → Start, met de echte UI (`#answer` zichtbaar, fill + Enter): 3 goede antwoorden geven good/slices 0→1→2→3 en dagdoel 0→1→2→3. |
| 3 | `index.html` = bron (pin bijgewerkt) | `npm run lint` | PASS | exit 0: "index.html equals assembled src/v2 + assets/v2: OK" en de andere vijf checks OK. Pin `512a4351…` = base-hash in de preview-build. |
| 4 | Alle tests | `NODE_OPTIONS=--max-old-space-size=6144 npm test` | PASS | exit 0. Alle node-scripts OK; `node --test`-blokken: 6+4+4+10+9+33 pass, 0 fail. |
| 5 | V3: een Toets van 10 vragen geeft 0 pizzapunten; het dagdoel stijgt | `node scripts/build-v3-preview.mjs` → Playwright Chromium, 1366×1024, `#nieuw`, `[data-nav=toets]` → `.v3Start` (standaard: Beide, 10 vragen). Vragen beantwoord met `check()` (write, `#answer` gevuld) of `grade(true,state.current)` (point), steeds `#next` | PASS | Vóór: good/slices/pizzas/trips 0/0/0/0, dagdoel 0, teller "0 van 24 pizzapunten". Na 10/10 goed (`examEnded:true`): 0/0/0/0, teller nog steeds "0 van 24", 0 keer `#pizzaCelebration` zichtbaar, dagdoel 0→10 ("Acht goede antwoorden binnen."). Geen page errors. Screenshot van het resultaatscherm (10 / 10): `scratchpad/toets-result.png`. |

Begrenzing van de uitzondering in de bevriezingstests (expliciet gevraagd):
- `restoreExamReward` in `scripts/map-hit-source.mjs` is één `String.replace` van precies de nieuwe deelstring naar de oude. Er zit geen regex, `replaceAll` of andere normalisatie in. De diff van `map-hit-source.mjs` bevat verder alleen de aanroep in `restoreLegacyMapHit`. In `focus-mode.test.mjs` verandert alleen de import en `restoreExamReward(html)` vóór de bestaande normalisatie.
- Bewijs: `restoreExamReward(index.html @ HEAD) === index.html @ 181c7c2~1`, byte voor byte (true, lengteverschil 45). De adapter maakt dus exact deze ene wijziging ongedaan en verbergt niets anders.
- De `index.html`-diff en de diffs van de zes `output/html/*`-builds bevatten elk alleen deze ene wijziging (word-diff).
- In `nino-art.test.mjs` haalt `strip` alleen `good/slices/pizzas/trips` weg uit `progressSnapshot()`. Dat zijn velden op het hoogste niveau. `mistakes`, `route` en `daily` worden nog wel met de baseline vergeleken. Daarna worden good/slices gelijkgezet, zodat de rest van de test op gelijke stand verder vergelijkt.

FAIL-redenen: geen.

Buiten scope opgemerkt (→ backlog-idee):
- `scripts/v3/toets.js` regel 101–103 verpakt `TopoLearning.award` al (in de examenmodus "geen beloning"). In de V3-build zijn er nu twee beveiligingen. Criterium 5 kan zo niet aantonen dat de V2-fix in de V3-build het werk doet; criterium 1 (en de mutatietoets) doet dat wel. Idee: de wrapper laten staan als defense-in-depth of opruimen, en dat vastleggen.
- `restoreExamReward` doet stilletjes niets als de string ontbreekt. De vergelijkingen erna zouden dan falen, dus er verdwijnt niets, maar een `assert` op precies één treffer geeft een duidelijkere fout.
- `exam-flow.test.mjs` controleert de beloning alleen bij een write-antwoord via `check()`. Een point-antwoord (`grade(true,…)`) krijgt geen reward-assert in die test. In de browser heb ik het wel gezien (point en write: 0).

Les: geen nieuwe.

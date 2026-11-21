# Evaluatie BL-031: Schermwissel sneller (kaartkopie één keer bouwen)

Commit 241a5a1f op `night/2026-11-21`. Baseline (vóór) = dezelfde preview-build met `scripts/v3/shell.js` en `voortgang.js` van HEAD~1 erin teruggezet (de build zet de JS letterlijk in de HTML, 1 vindplaats per bestand; zie /tmp/ev031/mkbase.mjs). Een tweede worktree kon niet: de schijf zit vol (226 MB vrij).

VERDICT: FAIL

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | ≥ 50 fps bij alle wissels | fps()-meting uit qa-v3-menu1.mjs letterlijk overgenomen (/tmp/ev031/fps.mjs), 1080×810, CPU 4×, 1 run (steekproef) | FAIL | ná: hoofdstuk 17,5 · oefenen 13,3 · toets 10,4 · rewards 16,4 · voortgang 11,9 · scroll 17,7 fps. vóór: 16,6 · 11,1 · 9,2 · 14,8 · 13,7 · 16,1. Zonder actie (idle) haalt de app 13,9–16,3 fps, en een **lege pagina** in dezelfde headless Chromium 15,5 fps (CPU 4×) en 15,9 fps (zonder vertraging). Op deze machine ligt het plafond van de meter rond 16 fps. |
| 2 | longestMs ≤ 200 ms (oefenen, voortgang) | zelfde run + Long Animation Frames (/tmp/ev031/loaf.mjs) | FAIL | rAF ná: oefenen 450, voortgang 500 ms (vóór: 467 en 417). LoAF vóór/ná: oefenen 582/515 tegen 559/530, voortgang 525/517 tegen 509/496 ms. Geen meetbare winst. |
| 3 | Kaart niet opnieuw gekloond | Voortgang→Reis ×2→Voortgang, telling + `===` | PASS | aantal `.v3VgMap` [1,1,1,1,1], eerste en derde keer zelfde element: true |
| 4 | Statuskleuren kloppen na verandering | `state.route.items[id].skills` op streak 5 gezet (water-A), Reis→Voortgang. Ook omgekeerd: city-1 teruggezet | PASS | beheerst 6→7 (legenda 7/6/32). Per status het aantal verschillende data-id's = legenda (= passport()). Elementen met 2 `v3St-*`: 0. Na terugzetten: beheerst 5, city-1 heeft alleen `v3St-nog` (geen oude klasse blijft hangen) |
| 5 | Beeld ongewijzigd | pngjs-pixelvergelijking vóór/ná, Voortgang + Oefenen-Ontdekken, 1440×900 / 1080×810 / 810×1080, BG-03, #bezig | PASS | 0 px verschil in alle 6. Extra: tweede bezoek aan Voortgang (verplaatste svg) op 1080×810 ook 0 px |
| 6 | Eerste scherm niet trager | goto tot eerste `.v3Rows .v3Row` + langste rAF in 3 s, CPU 4×, mediaan van 5 | PASS | zichtbaar: vóór 2321, ná 2305 ms. Langste frame: vóór 283, ná 267 ms. Kanttekening: de frames zijn gekwantiseerd door hetzelfde plafond van ~16 fps |
| 7 | Geen regressie | `npm run lint`, `npm test` (8 GB), `qa-v3-menu1.mjs` | PASS | lint exit 0. test exit 0, 0 fail (1 skipped). qa-v3-menu1: exit 0, "OK: geen fouten", 0 page errors |
| 8 | Scope gehouden | `git show --stat 241a5a1f` | PASS (met opmerking) | code: alleen `scripts/v3/shell.js` (+5/−1) en `voortgang.js` (+14/−4), `reis.js` 0 regels. Ook in dezelfde commit: `ops/contracts/BL-031.md`, `ops/BACKLOG.md`, `ops/STATE.md` (administratie, geen bron) |
| UI | Tekst/contrast | volgt uit 5 en 7 | PASS | 0 px verschil, AA-check in qa-v3-menu1 groen |

## FAIL-redenen (concreet, reproduceerbaar)
1. Criteria 1 en 2 zijn niet gehaald: `node /tmp/ev031/fps.mjs after` geeft 10–18 fps en een langste frame van 450–500 ms bij naar oefenen en naar voortgang.
2. **De meter is op deze machine niet bruikbaar voor de eis van 50 fps.** `node /tmp/ev031/blank.mjs` geeft 15,9 fps op een lege `data:`-pagina zonder CPU-vertraging. Met `--disable-gpu-vsync --disable-frame-rate-limit` wordt het 8,6 fps. Geen enkele codewijziging kan criterium 1 hier laten slagen. De baseline in het contract (1100–1800 ms) kwam ook niet terug: vóór meet nu 417–467 ms.
3. De wijziging levert geen meetbare winst op. LoAF vóór en ná liggen binnen ruis van elkaar (±5%). Dat past bij wat de bouwer meldt: cloneMap is niet de bottleneck.

## Diagnose
- Een lang frame bij een wissel (~500 ms bij CPU 4×) bestaat volgens LoAF bijna helemaal uit tijd **vóór renderStart**, zonder toegeschreven scripts (`scripts: []`). Style+layout is 3–46 ms, render ~40 ms. De bewering van de bouwer dat de bottleneck in style/layout/paint zit, klopt daarmee **niet** helemaal: style/layout is klein, het grootste deel is niet toegeschreven werk vóór het frame. Mogelijk zijn dat input/hit-testing op de grote SVG-DOM, beelddecode, of het CDP-klikpad van Playwright. Zonder trace valt dat niet vast te stellen.
- Reis-wissel: 641–654 ms, met hetzelfde patroon.

## Advies
- **Niet herstellen binnen dit contract.** De oorzaak ligt buiten de scope (geen kloon) en het meetinstrument geeft hier een plafond van 16 fps. Opnieuw afbakenen in twee stappen:
  1. Meetinstrument valideren: een lege referentiepagina in `--fps` opnemen (meting ongeldig als die < 55 fps haalt), meten met het scherm wakker en headed, of de eis uitdrukken in LoAF-duur/INP in plaats van rAF-fps.
  2. Diagnosetaak met een Chrome-performancetrace (`Tracing.start`, categorieën devtools.timeline + blink + cc) van naar voortgang en naar oefenen. Daarna pas een bouwcontract op de echte oorzaak.
- **Code: terugdraaien wordt aangeraden, of op zijn minst de idle-prebuild in shell.js.** Het risico is laag: pixel-identiek, statussen kloppen, geen regressie. Maar er is geen aantoonbare winst. De prebuild maakt bij elke start twee extra volledige kaartkopieën (Oefenen + Voortgang), ook als de gebruiker die schermen nooit opent. Dat kost geheugen en DOM-grootte op de ondergrens (iPad 9), en dat is niet gemeten. De Voortgang-cache (bewaarde svg + klassen bijwerken) is neutraal en goed getest. Die alleen houden is verdedigbaar, maar dat voegt toestand toe (vgPainted, ResizeObserver) zonder baat. Houd hem alleen als de trace laat zien dat de kloon ertoe doet.

## Buiten scope opgemerkt (→ backlog-idee)
- `qa-v3-menu1.mjs --fps` heeft geen geldigheidscontrole voor de omgeving (referentie met lege pagina). Zonder die controle geeft hij 's nachts altijd FAIL fps.
- De schijf van de machine zit vol (226 MB vrij). `git worktree add` faalde. Nachtruns met builds van 30 MB en screenshots lopen hier vast.
- Toets-wissel: langste frame 817–833 ms, de traagste van allemaal (buiten scope, al genoemd in het contract).

## Les
Valideer een prestatiecriterium eerst tegen een lege referentiepagina in dezelfde omgeving, voordat je het als acceptatie-eis gebruikt. Headless Chromium op deze Mac haalt ~16 fps op een lege pagina, dus "≥ 50 fps" was hier vanaf het begin onhaalbaar.

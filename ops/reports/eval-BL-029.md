# Evaluatie BL-029: V3-compositie "Menu 1"

Evaluator · 2026-11-16 · commit `7ce0c31` (branch `claude/nightly-pr99-kaart-feestje-fvpl06`) · contract `ops/contracts/BL-029.md`
Build: `node scripts/build-v3-preview.mjs` → `output/html/TOPO-V3-Reis-Preview.html` (sha256 `fa8121f8…`). G1 valt buiten dit oordeel.
Alle metingen zijn eigen scripts (Playwright/Chromium headless), niet afgeleid van `qa-v3-menu1.mjs`. Scripts en screenshots staan buiten de repo, in de scratchpad `ev29/`.

VERDICT: **FAIL**

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | Tussenscreenshot overzicht | (regie-chat) | n.v.t., niet getoetst | STATE meldt "r2 akkoord" |
| 2 | Overzicht en hoofdstuk op 1440/2560/1080 × BG-01/02/03 naast Menu 1 | 18 eigen screenshots, plus 1280 en 1920 | **PASS** (het bewijs bestaat; het visuele oordeel hoort bij G1) | Opmerkingen voor G1: op 2560 staat alles op 1440-maat linksboven en staan de tellers midden boven in plaats van rechtsboven (BL-032). Op 1280×800 ligt de knop "Aanwijzen" over marker 3 (zie 5) |
| 3 | Lesresultaat op 1440 en 2560 zonder overlap; Nino in één maat; Kennis-paspoort ingeklapt | DOM-meting, screenshots, gerenderd contrast | **FAIL** | Zie FAIL-reden 1 en 2. Nino: 184×200 op alle desktopschermen, in de les en op het resultaat, en 60×64 op de iPad-rail (OK). Paspoort: `details.mastery.open=false` op 5 maten × 3 BG (OK) |
| 4 | FPS op 1080×810 met CPU 4× ≥ 50; blur ≤ 3 per scherm, vastgelegd in STATE | rAF-meting en telling | **FAIL** | Schermwissels 25–46 fps (zie FAIL-reden 3). Blur: 2 op de 6 hoofdschermen (OK), maar **6** tijdens een lesvraag en 3 op het resultaat. STATE meldt voor de les "2", en dat klopt niet |
| 5 | AA voor alle tekst, ook het vrije blok, tegen de echte achtergrond; niets onder 13 px; knoppen ≥ 44 px | eigen AA-meting van **alle** tekst (niet alleen de vrije lijst), op 5 maten × 3 BG × 6 schermen en het lesresultaat | **FAIL** | Lesresultaat 1,25 en 1,52 (reden 1). Marker "3" heeft 2,68 waar de knop eroverheen ligt op 1280 (reden 4). Zijbalk "Voortgang" haalt p5 4,47 < 4,5 op 1280×800 BG-03 (grensgeval). Tekst ≥ 13 px en knoppen ≥ 44 px kloppen op de 6 schermen (uitzonderingen staan onder Buiten scope) |
| 6 | Lint en test | `npm run lint`; `NODE_OPTIONS=--max-old-space-size=6144 npm test` | **PASS** | Lint exit 0. Test exit 0: 6 suites (6+4+4+10+9+33 tests), 0 fail |
| G | Grenzen | als boven | **FAIL** | Overlap op 1280 (marker × knop) en lesbalk × resultaatkaart. Meer dan 3 backdrop-filters in de les. AA. De rest (geen tekst < 13 px in de UI, knoppen ≥ 44 px, geen horizontale scroll) is OK |

## FAIL-redenen (concreet, reproduceerbaar)

1. **Het lesresultaat wordt door de werkruimte bedekt.** Dit is een regressie door BL-029.
   - `menu1.css` r. 244 zet `body.v3Les[data-v3-menu="1"]::before` neer met `position:fixed; z-index:0`, wit .72, blur 24 en een mask. De `#finishScreen`-keten is `position:static`/`z-index:auto`, dus de laag schildert **óver** de resultaatkaart heen.
   - Repro: `#bezig/bg03` → primaire knop → `grade(true);next()` tot `#finishScreen` → de pizza-modal sluiten met "Verder" → 2,5 s wachten. Screenshot `ev29/les-res-1440-bg03.png`.
   - Wat je ziet: "Alles goed in dit rondje!" is links weggewassen. "6 goed in deze ronde" en "0 oefenmomenten" zijn bijna onzichtbaar, en "Volgende les" is vaag.
   - Gerenderd contrast (de schermafbeelding met tekst vergeleken met die zonder tekst):

     | Tekst | Menu 1 | Menu 2 (zelfde flow) |
     |---|---|---|
     | "6" | **1,25** | 13,5 |
     | "0" | **2,13** | 13,5 |
     | "Volgende les →" | **1,52** | 5,86 |

   - Zelfde beeld op 2560×1440 en op BG-01.
   - Het QA-script ziet dit niet. Het meet op het lesresultaat geen AA, en zijn AA-methode maakt de tekst transparant, waardoor een laag die bóven de tekst ligt per definitie buiten beeld blijft.
2. **Overlap op het lesresultaat.** De lesbalk `.v3LesBar` (837,112–1380,248) overlapt de resultaatkaart (554,136–1114,690) over 277×112 px op 1440, en 448×112 px op 2560. Hij dekt ook de bovenhoek van de springende Nino af.
   - Dit bestond al in Menu 2, maar criterium 3 vraagt "0 overlap" op de nieuwe opbouw.
   - Het script meet alleen tekst tegen tekst, dus het mist dit.
3. **FPS haalt ≥ 50 niet.** Eigen meting, zonder andere belasting:

   | Wissel | Menu 1 | Menu 2 |
   |---|---|---|
   | naar hoofdstuk | 38,8 | 42,6 |
   | naar oefenen | 30,8 | 26,6 |
   | naar toets | 45,7 | 50,4 |
   | naar rewards | 40,9 | 41,5 |
   | naar voortgang | 25,2 | 33,1 |
   | naar reis | 27,4 | 17,3 |

   - Voortgang scrollen haalt 59 (OK).
   - De hoofdsessie meldt dit eerlijk als niet gehaald, maar twee uitspraken kloppen niet:
     - **"Lijst scrollen 60" is geen meting.** `.v3Rows` (en de hele pagina) scrollt op 1080×810 niet: geen enkel scrollbaar element, en scrollTop blijft gelijk. Er is dus een stilstaande pagina gemeten.
     - **"Oorzaak één lange frame" is maar half waar.** Zonder de langste frame zakt Menu 1 nog steeds naar 43–53 fps. Er zijn 5–10 frames van meer dan 33 ms per wissel, en p95 is ≈ 50 ms. Menu 2 heeft meestal 2 zulke frames, met p95 17–33 ms. De wissels in Menu 1 zijn dus ook buiten de kaartkopie zwaarder.
   - Doorschuiven naar BL-031 maakt het criterium niet PASS.
4. **Overlap en contrast op 1280×800 (en 1366×768).** Op het overzicht ligt de primaire knop "Aanwijzen" over hoofdstukmarker 3 (10×21 px). Op 1280×720 ligt de StageBar erover.
   - De marker is daardoor half verborgen, slecht klikbaar en heeft contrast 2,68.
   - Sweep 1280–2560: alleen 1280×720, 1280×800 en 1366×768 falen. Screenshot `ev29/s-overzicht-1280-bg01.png`.
   - Het script mist dit omdat `inMap()` alles in `svg`/`.v3MapStage` uitsluit van de overlapcheck.
5. **Meer dan 3 backdrop-filters in de les.**
   - Tijdens een lesvraag (Menu 1): `v3Shell::before`, `.v3LesBar`, `.atlasZoom`, `.panel`, `.ninoMeter` en `v3Side::after` = **6**. Menu 2 had er 5, dus BL-029 voegt er één toe.
   - Op het resultaat: 3.
   - STATE (§Volgende taak) meldt "2 (zijbalk + werkruimte) op … en de les". Dat is onjuist; het script telt de blur in een les nooit.
6. **Kleiner, maar het telt:**
   - De scope "Wel" eist dat `scripts/qa-v3-glas2.mjs` naar het nieuwe model gaat. Dat bestand is ongewijzigd en faalt nu met exit 1 (114 alpha-, 48 side- en 24 reduced-fouten).
   - DoD (QUALITY §G2) vraagt dat de taakspecifieke `qa-v3-*`-scripts groen zijn.
   - Pas het script aan of trek het formeel in (met een notitie in het contract).

## Toetsing van `scripts/qa-v3-menu1.mjs` zelf

Eigen run met `--fps`: exit 1 (alleen de 5 fps-fouten), verder "0 fouten". Het script meet minder dan zijn kop belooft:

- **Kaart uitgesloten.** `inMap` sluit `svg, .v3MapStage, .v3OefStage, .ninoArtSlot` uit van overlap, tekstmaat, knoppen en AA. Daardoor mist het de marker-knop-overlap op 1280 en het markercontrast.
- **AA alleen op een handvol "vrije" selectors.**
  - Niet gemeten: de zijbalklabels op mat glas, de tellers, de kaarttekst, de lessenkaart en het lesresultaat.
  - De methode (tekst transparant maken) kan geen laag zien die óver de tekst ligt.
- **Overlap alleen tekst×tekst en knop×knop, binnen `.v3Reis`.** Panelen tegen elkaar (lesbalk × resultaatkaart) en modals vallen erbuiten.
- **Nino op het lesresultaat is kapot.** `querySelector('.v3Reis .v3Side .v3Portrait, body.v3Les .v3ShellNav .v3Portrait')` vindt eerst het verborgen `.v3Reis`-portret, dus het resultaat is `nino:null`. Die waarde gaat niet naar de `nino`-set, dus faalt hij nooit. (Gemeten is hij wel 184×200.)
- **Blur nooit gemeten** tijdens een lesvraag of met een open modal.
- **`lijstScroll` meet een lijst die niet scrollt.**
- **Wat wel deugt:**
  - sr-only (clip + breedte ≤ 1) wordt goed uitgesloten.
  - De tekstmaat en de knoppen op de 6 hoofdschermen kloppen met mijn meting.
  - Paspoort en Nino op de hoofdschermen kloppen.
  - Kleinigheid: in de overlapconditie staat dode code (`&&false`).

## Wat wél klopt (eigen meting)

- **Blur:** precies 2 (`.v3Reis::before`, `.v3Side::after`) op overzicht, hoofdstuk, Oefenen, Toets, Beloningen en Voortgang, op 1280/1440/1920/2560/1080 × BG-01/02/03.
- **Nino:** 184×200 op desktop en 60×64 op iPad, overal gelijk.
- **Kennis-paspoort:** standaard dicht.
- **Vrije teksten** op de 6 schermen halen AA. Laagste waarden:
  - Toets-titel 4,97 op BG-03 1440;
  - kicker 4,77 op BG-02 2560;
  - hoofdstukkicker op BG-03 5,23 (met gloed).
- **Geen horizontale scroll** en geen page errors.
- **Menu 2-terugval** (`addInitScript TOPO_V3_MENU='2'`) werkt: `data-menu=2`, de oude panelen, hoofdstukpagina en les, het lesresultaat is scherp, en er zijn geen errors (`ev29/home-1440-bg03-m2.png`, `les-res-1440-bg03-m2.png`).

## Buiten scope opgemerkt (→ backlog-idee)

- **Kaart-glyph "▲"** (vulkaan/berg) is 8–10 px en heeft contrast 1,1–2,6. De landnamen in de lesatlas (TSJECHIË e.a.) halen 2,2–3,7. Dit bestond al, maar botst met de regel "geen tekst < 13 px / AA" zodra kaarttekst als tekst telt.
- **Hoofdstukmarkers zijn 36×36** (zo staat het in het contract) en dus kleiner dan de grens van 44 px voor knoppen. Ze zijn `<g>` zonder role of tabindex. Het contract spreekt zichzelf hier tegen: kies een grotere hitzone of leg een uitzondering vast.
- **Disabled chip "Mijn fouten"** heeft 2,68. Als disabled valt hij onder de WCAG-uitzondering.
- **Op 1280×720** loopt de hoofdstukkenkaart tot y=746 en is ze niet scrollbaar, dus afgesneden. Dat valt buiten de testmaten.
- **Afwijking van het contract:** werkruimte .72 en mask 24/48/72 in plaats van .92 en 38/58/82 (r2, volgens STATE akkoord van Dennis). Het contract is niet bijgewerkt.
- **Release-build:** `build-v3-preview.mjs` laadt `menu1.css` ook in de release, en Menu 1 is de standaard.

## Les

Een AA-meting die tekst transparant maakt, ziet geen lagen die bóven de tekst liggen. Meet het gerenderde contrast (de screenshot met tekst tegen die zonder) op elk scherm waar een nieuwe vaste of `z-index`-laag bij komt. Meet ook de les en het resultaat, niet alleen de hoofdschermen.

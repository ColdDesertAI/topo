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

---

# Ronde 2 (commit `b570854`, 19-11)

Herbouwd (sha256 `9fd743cf…`). Alles hieronder is eigen meting, plus een controlerun van de QA-scripts.
- Gemeten: 6 maten (1280×800, 1366×768, 1440, 1920, 2560, 1080) × 3 BG × 6 schermen. Daarnaast het lesresultaat op 1280, 1366, 1440, 2560 en 1080.
- Ook: een marker/kaart-sweep over 11 maten en fps (2 runs per menu).

VERDICT: **FAIL** (resten: fps, plus de lesbalk-overlap en AA op 1280/1366 bij een lage schermhoogte)

| # | Criterium | Resultaat | Bewijs |
|---|---|---|---|
| 2 | Screenshots × 3 BG | **PASS** (bewijs; oordeel G1) | Kaart ≈ 31% op 1440 (568×697), 30–33% op 1280–1680, 25,7% op 1920, 14,5% op 2560 (BL-033). Markers: 0 overlap met het vrije blok, de tellers of de kaartknoppen, en geen marker op een marker, op alle 11 maten × BG-01/03, overzicht en hoofdstuk (ook 1280×720, 1280×800 en 1366×768) |
| 3 | Lesresultaat 1440/2560, Nino, paspoort | **PASS** | De werkruimte ligt niet meer over de kaart: gerenderd contrast "6" 13,5 en "Volgende les" 5,86 (gelijk aan Menu 2). De lesbalk ligt boven de kaart (−14 px op 1440 en −24 px op 2560, dus geen overlap). Nino is 184×200 in les en resultaat (iPad 60×64). Paspoort dicht op 108/108 metingen |
| 4 | FPS ≥ 50 en blur ≤ 3 | **FAIL** | Blur: 2 op alle schermen, 2 in de les (1 op iPad); OK. FPS bij een schermwissel, 1080×810 CPU 4×: hoofdstuk 47–49, Oefenen 34–36, Toets 51–52, Beloningen 48–50, Voortgang 35–38, Reis 32–33. Zonder de langste frame 54–58. Voortgang scrollen 59–60. Menu 2 haalt dezelfde orde. Eerlijk gerapporteerd, maar ≥ 50 is niet gehaald (BL-031 is een besluit voor Dennis, geen PASS) |
| 5 | AA, ≥ 13 px, knoppen ≥ 44 | **FAIL** (klein) | Op 1440/1920/2560/1080 en 1280×800: 0 fouten op de 6 schermen en het resultaat. Restfouten op 1366×768: (a) in de les heeft het zijbalklabel "Voortgang" p5 3,37, omdat het in de vervaging onderaan valt (het mask begint 190 px boven de onderrand); (b) op BG-02 Voortgang heeft de titel "Voortgang" p5 2,34 (grote tekst, eis 3) en "plekken" 3,7 |
| 6 | Lint en test | **PASS** | Lint 0. `npm test` exit 0 (66/66) |
| G | Grenzen | **FAIL** | De lesbalk overlapt de resultaatkaart nog op 1280×800 (285×86 px) en 1366×768 (351×118 px). De `margin-top`-fix werkt alleen bij een schermhoogte ≥ ~900. Blur, tekstmaat, knoppen en breedte zijn OK |

**QA-scripts:**
- `qa-v3-menu1.mjs` geeft exit 0 (zonder `--fps`). `qa-v3-glas2.mjs` (Menu 2) geeft exit 0.
- De uitsluiting van sr-only tekst (geclipt, of ≤ 2 px) is niet te ruim: ik vond geen zichtbare tekst die erdoor wegvalt.
- Restgaten in het script:
  - Het lesresultaat wordt alleen op 1440 en 2560 gemeten, dus het mist de overlap op 1280/1366.
  - De overlapcheck kijkt niet naar kaart tegen kaart (lesbalk × resultaat).
  - 1366×768 zit niet in de set.
  - Het telt 1 blur in de les, waar ik er 2 tel (`v3Shell::before` + `v3Side::after`). Beide liggen ≤ 3, dus dat telt niet mee voor het oordeel.

**Menu 2-terugval:** werkt (overzicht, hoofdstuk, les en resultaat, zonder errors).

**Om op PASS te komen:**
1. Laat de lesbalk de resultaatkaart ook op 1280×800 en 1366×768 vrijlaten.
2. Zorg dat de zijbalknavigatie in de les bij een schermhoogte ≤ 768 op dicht glas blijft.
3. Los de Voortgang-titel op BG-02 1366 op (gloed of positie).
4. Voor criterium 4: halen, of Dennis besluit het criterium te wijzigen of te splitsen (BL-031).

**Buiten scope (één regel):** het vergrendelde lesstap-label "Namen schrijven" (opacity .6, 4,0 op 1080) en de kaart-glyph "▲" bestonden al en staan ook zo in Menu 2.

---

# Ronde 3 (commit `d94cd7c`, 19-11, gericht)

Getoetst: criteria 3, 5 en Grenzen op 1280×800 en 1366×768 (BG-01/02/03, 6 schermen, plus lesvraag en lesresultaat), met een steekproef op 1440×900 BG-02.
- De preview is niet opnieuw gebouwd. Wel gecontroleerd dat hij bij de commit hoort: `menu1.css`, `reis.js`, `voortgang.js` en `shell.js` zitten er letterlijk in.
- `npm test` heb ik niet zelf gedraaid (de hoofdsessie meldt de uitkomst). In ronde 2 was hij 66/66 groen; criterium 6 hangt af van die melding.

VERDICT: **FAIL**, alleen nog op criterium 4 (fps). Alle andere getoetste punten zijn PASS.

| # | Criterium | Resultaat | Bewijs |
|---|---|---|---|
| 2 | Screenshots | **PASS** (oordeel G1) | Ongewijzigd t.o.v. ronde 2 |
| 3 | Lesresultaat, Nino, paspoort | **PASS** | De lesbalk ligt boven de resultaatkaart, 24 px vrij op 1280×800, 1366×768 en 1440×900 (alle BG). Nino is 184×200 in les en resultaat. Paspoort dicht (39/39) |
| 4 | FPS ≥ 50 en blur ≤ 3 | **FAIL** | Niet opnieuw gemeten (niet gewijzigd). Ronde 2: wissels 32–52 fps, besluit bij Dennis (BL-031). Blur is 2 in alle 39 metingen en in de les |
| 5 | AA, ≥ 13 px, knoppen ≥ 44 | **PASS** | 0 fouten op 1280×800 en 1366×768 × 3 BG × 6 schermen, en in lesvraag en lesresultaat (`Voortgang` in de les-zijbalk en de Voortgang-titel op BG-02 halen nu AA). Steekproef 1440 BG-02 (overzicht, hoofdstuk, Voortgang, les): 0 fouten |
| 6 | Lint en test | **PASS** onder voorbehoud | Lint 0 in ronde 2; `npm test` volgt via de hoofdsessie |
| G | Grenzen | **PASS** | Geen overlap, geen horizontale scroll, geen page errors |

**Buiten scope (één regel):** in de les zijn de staplabels op 1280×800 afgekapt ("Ontdekk…", "Aanwijz…"), en op 1366×768 staat de lesbalk na het scrollen naar het resultaat half boven de rand. Geen overlap, maar wel een punt voor de iPad/G3-check (screenshots `lesres-1280-bg01.png` en `lesres-1366-bg02.png` in de scratchpad).

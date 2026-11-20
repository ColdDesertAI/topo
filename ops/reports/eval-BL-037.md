# Evaluatie BL-037 — laatste feedback Italië (main 953d8fc, live www.ninotopo.nl)

VERDICT: FAIL

Evaluator (Opus), 20-11. Al door de hoofdsessie gedraaid en niet opnieuw gedraaid: qa-v3-menu1 (8 maten, bg01–bg04), qa-v3-fade (Chromium en WebKit), npm test, --smoke, qa-v3-icons, qa-v3-nino-reis, build:site. Hieronder staan alleen eigen, gerichte metingen (Playwright Chromium, live met het profiel uit seed.json, de preview #alles/bg01 en de offline-release `output/html/TOPO-V3-Italie.html`, opnieuw gebouwd op 953d8fc). Scripts en screenshots: `/tmp/claude-0/-home-user-topo/0568f8e3-09c7-59a3-9424-2da44b974a18/scratchpad/eval37/`.

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | Portalknoppen | live, computed styles (p1.mjs, p1b.mjs) | PASS | Start leren: rust rgb(123,102,183), hover rgb(106,83,159) + translateY(-1px) + schaduw 0 4 12 rgba(106,83,159,.28), ingedrukt rgb(84,64,127) + translate 0, transitie 150 ms, focus 2 px #5b45e0 met offset 2, hoogte 44. "Binnenkort" (3x) en "Leeromgeving volgt": #EEEEF1/#60606A, cursor default; hover verandert niets (bg, transform en schaduw blijven gelijk). |
| 2 | Laadscherm | live, Fast 4G (9 Mbit, 165 ms) en 3 Mbit, rAF-log, getAnimations, screenshots (p2.mjs, p2s.mjs, p2d.mjs) | **FAIL** | Logica is goed: `--p` loopt monotoon op met de echte bytes (49 tussenwaarden) tot 1,0000. Het laadscherm staat ≥ 1,2 s (weg na 2,3–2,6 s). Vespa 84×56, rijdt rechts uit (translateX tot 100vw). Reduced motion: img display:none, alleen balk en fade. Geblokkeerde assets: weg na ≈ 1,8 s. Haperende assets: weg na 6 s (max). Offline-bestand: geen `#v3Loader`, werkt met context offline:true (0 netwerkverzoeken, 0 paginafouten, v3Ready). **Maar wat je ziet volgt de voortgang niet** (zie FAIL-reden 1). |
| 3 | Ouderlink weg | live HTML + DOM | PASS | Geen "ouders en leraren" in het live portal. De links zijn alleen skip, brand en Start leren. (verify-site is door de hoofdsessie gedraaid.) |
| 4 | Nino → Reis, Ga verder | live 1440/1080/810 (p4.mjs, p4c.mjs) | PASS | `<button aria-label="Naar mijn reis">`, 140×152 (desktop) of 60×64 (rail), :focus-visible 3 px ring. Met Enter in een lopende Aanwijzen-les naar view=reis, les=false. "Ga verder · Aanwijzen" hervat dezelfde vraag (city-7/city-9/city-11 = gelijk), 0 paginafouten. |
| 5 | Alle landen | live, 11 maten 2560×1440 t/m 768×1024 (p5.mjs, p5b.mjs) | PASS | Op elke maat zichtbaar, binnen `.v3Side`, elementFromPoint raakt de knop. 48×48 (44×44 bij 1280–1366). Rust en hover zijn identiek aan de ?-knop, focus 2 px #5b45e0. Een klik gaat naar https://www.ninotopo.nl/. aria-label en title "Alle landen". Afwezig in het offline-bestand (file://) en in de preview. |
| 6 | Pizza-iconen + legenda | live Voortgang/Kennis-paspoort 1440 en 810 (p6.mjs) | PASS | 22×22 `<img role=img>`, de tekst staat in aria-label, title én alt ("Goed onthouden", enz.). Cel zonder zichtbare tekst. Pizzapunt bij Nog oefenen/Herhalen, hele pizza anders. Legenda in `<caption>` boven de tabel, één regel (33 px). Opmerking: de legendatekst zegt "oefenen" i.p.v. "nog oefenen", en de toegankelijke naam van de tabel wordt "oefenen · op weg of klaar" (de icoontjes in de caption zijn aria-hidden). |
| 7 | Zijaanzicht-Vespa | live: 11 actieve hoofdstukken × 4 maten (p7.mjs), pixeltest (p7c.mjs), preview #rit (p7r.mjs) | PASS | Vespa 60×40 (zijaanzicht, vespa-rijdend-v3) naast de actieve pin, altijd in beeld. Bbox-overlap met een andere pin in 4 gevallen: 1080×810 en 810×1080, Vulkanen (pin 3, 30×1–2 px) en Landen (pin 4, 23–25×5–6 px). De pixeltest (Nino-masker × pin-masker, DPR 2) geeft in alle vier 0 overlappende pixels. Rit: 66×44, zelfde artwork. Krap: bij Vulkanen op de iPad raakt de pinpunt van 3 de helm bijna (bob 2,5 px). |
| 8 | Zeeën/Landen ≥ 55% | preview #alles: oppervlak van de inhoudsbox (Italië + doelen) / .v3MapStage (p8.mjs), plus de vorige build c9db14d^ ter vergelijking (p8old.mjs) | **FAIL** | De meting van de bouwer is eerlijk; ik kom zelfs iets lager uit. Na de wijziging: 1440 zeeën 0,33, landen 0,26; 1080 zeeën 0,31, landen 0,25; 810 portret 0,88/0,79; 2560 0,52/0,54. Vóór de wijziging: 1440 0,10/0,19; 1080 0,10/0,18; 810 0,36/0,68. Verbetering bevestigd (zeeën ≈ 3×, landen ≈ 1,4×). Geen doel buiten de stage, 0 titelblok-overlap. **Liggend haalt het de contractnorm van 55% niet** (zie FAIL-reden 2). |
| 9 | Iconregels | chapter-icons.json tegen ITEMS; preview: hoofdstukpagina's ×3 maten, eigen afstandsmeting (p9.mjs, p9b.mjs); live: Reis, Aanwijzen-les, Toets, Oefenen-vormen (p9h.mjs) | PASS (met kanttekening) | Koppelingen kloppen: Trulli–Bari, Dom–Florence/Milaan, Vesuvius–Napels/Vesuvius, Scheve toren–Pisa/Toscane, Colosseum–Rome, Gondel–Venetië, Etna–Catania/Etna/Sicilië, Bergen–Trente/Dolomieten/Apennijnen, Nuraghe–Sardinië. Losse iconen staan op echte, logische coördinaten (Turijn, Alberobello, Etna, Bologna, Palermo, Barumini, Rome, Pisa, Venetië) en nooit op een plek die in dat hoofdstuk een doel is. Labels van losse iconen zijn alleen de naam; Landen/Zeeën hebben 0 iconen. Kleinste afstand middelpunt–doel bij 1080: Fiat 500 (Steden 13–18) 42,0 px tot Varese, Scheve toren (Steden 19–23) 42,5 px tot Modena, Colosseum (Streken) 41,0 px tot Toscane. Verborgen: Aanwijzen-les 0, Toets 0, Oefenen point/write/smart 0; Ontdekken 5, Reis 0. Ferrari, Stadion en Strand nergens: aanvaardbaar, het contract eist niet dat elk icoon gebruikt wordt. Zie kanttekening 3. |
| 10 | Sicilië (bg04) | live 1440/1080/810/2560, netwerklog + kiezer + screenshots (p10.mjs) | PASS | Kiezer heeft 4 opties (Toscane, Meer, Zee, Sicilië), knoppen 104×81 met miniaturen 192×108. Bij de start wordt alleen bg03 (527 kB) geladen. Na het kiezen van Sicilië wordt pas `b434687016656421.webp` (475 kB) opgehaald. Etna rechtsonder, titel en knop tegen lucht/zee, ook bij 810 portret en 2560. AA: qa-v3-menu1 met bg04 groen (hoofdsessie); visueel geen twijfel. |
| UI | Afgesneden/overlap, AA, 44 px | --smoke en matrix (hoofdsessie) en eigen maten bij 4/5 | PASS | Alle gemeten doelen ≥ 44 px. |

## FAIL-redenen (concreet, reproduceerbaar)

1. **Punt 2: wat je ziet van de balk en de Vespa volgt de echte voortgang niet (Chromium).** De `--p` wordt bij elk stream-chunk opnieuw gezet. Daardoor start de CSS-transitie (`width .25s` / `left .25s`) steeds opnieuw en blijft ze hangen in `pending` met currentTime 0. Pas als `--p` stilstaat (bij 1,0) beweegt de balk.
   - **Bewijs (p2d.mjs, Fast 4G):** van t=1,30 s tot t=1,92 s loopt p van 0,57 naar 0,99, maar de breedte van `::after` blijft **0 px**. `document.getAnimations()` geeft steeds `width:running(pending):0, left:running(pending):0`. Bij p=1 vult de balk zich in ≈ 0,25 s.
   - Bij 3 Mbit (p2s.mjs): p=0,58→0,79 over 1,2 s terwijl de vulling 77 px = 30% blijft. Screenshot `load-sheet.png`: bij p=0,71 toont de balk ≈ 30%.
   - Ook de Vespa staat stil (left 609 px tijdens p 0,44→0,99, p2.mjs).
   - WebKit loopt achter maar bevriest niet (p=0,95 en vulling 55%).
   - Reproduceren: open https://www.ninotopo.nl/italie/ in Chromium met throttling en lees elke 120 ms `getComputedStyle(document.querySelector('#v3Loader i'),'::after').width` en `document.getAnimations()`.
   - Richting voor de bouwer: `--p` hooguit één keer per frame zetten (rAF) of zonder CSS-transitie interpoleren.
   - Het contract eist "de balk volgt de echte laadvoortgang"; voor de gebruiker is dat nu een lege of stilstaande balk die aan het eind in één klap volloopt.
2. **Punt 8: de contractnorm "kaart ≥ 55% van het inhoudsvlak" wordt liggend niet gehaald.** Gemeten: 1440×900 zeeën 0,33 en landen 0,26; 1080×810 (iPad liggend, de hoofdmaat) 0,31 en 0,25. De verbetering is echt (zeeën 0,10→0,33, landen 0,19→0,26) en goed onderbouwd: het titelblok mag niet over de kaart, en ook city1 haalt bij 1080 maar 0,32. Toch is de afwijking van de expliciete norm een beslissing voor Dennis (norm bijstellen naar "zo groot als het titelblok toelaat", of het titelblok verplaatsen). Zonder dat akkoord: FAIL. Visueel bij 1440/1080 blijft er boven en onder de kaart veel lege ruimte in de stage (`ch-1080.png`).

## Kanttekeningen (geen FAIL op zich)
3. Punt 9, 40-px-regel. De bouwer meet vanaf het **middelpunt** van het icoon. Het badge heeft een straal van 20–22 px, dus de zichtbare rand van het icoon staat maar 18–25 px van het doel (bijv. Colosseum in Streken 21 px van de rand van Toscane bij 1080, Fiat 500 18 px van de stip van Varese). Als Dennis "40 px van elk doel" als zichtbare tussenruimte bedoelt, voldoet dit niet. De interpretatie moet expliciet worden vastgelegd. Ook in Streken: de **Dom (Florence)** staat als "gekoppeld aan Toscane" rechts van de Povlakte, dichter bij de Povlakte dan bij Toscane (`ic-regions-1080.png`). Dat kan als koppeling met de Povlakte gelezen worden. De Scheve toren staat aan de oostkant van Toscane, terwijl Pisa aan de westkust ligt.
4. Punt 2, laadtijd: warm ≈ 1,5 s tegen BL-035.9 "warm < 1 s". Dit conflict ligt al bij Dennis.
5. Punt 5: de exitknop toont zich ook als het offline-bestand via http geserveerd wordt (de test is op het protocol). Dat is aanvaardbaar.

## Buiten scope opgemerkt (→ backlog-idee)
- Hoofdstukpagina's Bergen en Rivieren bij 1080×810: het titelblok ligt over de omtrek van Italië (5 gesamplede punten op de vorm). Dit zat er al vóór BL-037 (c9db14d^ geeft hetzelfde).
- Portal: de kaarten van "Binnenkort" hebben nog een kaart-hover (afbeelding wisselt, schaduw), alleen de knop zelf is statisch.

## Les
- Een voortgangsbalk testen op `--p` (de data) is niet genoeg. Meet de **gerenderde** breedte (`::after`-width of screenshot) onder throttling: CSS-transities die elk frame (of vaker) opnieuw starten, bevriezen in Chromium.

---

## Hertoets punt 2 (laadscherm), fix 6dacf9b, live

VERDICT punt 2: **FAIL** (beter dan eerst; één resterend probleem). Het totaal blijft **FAIL**: punt 2, en punt 8 wacht op het besluit van Dennis over de 55%-norm.

Methode: live https://www.ninotopo.nl/italie/ (de live HTML bevat de rAF-code). Elke frame meet ik de **gerenderde** breedte van `#v3Loader i::after` / track, plus de Vespa-positie, de klasse `go` en de opacity. Cache staat uit en het netwerk is ge-throttled (r2.mjs, r3.mjs). WebKitGTK via WebDriver (wk2.mjs, wk3.mjs).

| Scenario | Zichtbare balk (elke 250 ms) | Rit-uit start bij | Weg na | Oordeel |
|---|---|---|---|---|
| Chromium 9 Mbit | 0 → 13 → 56 → 69 → 84 → 96 → 100% | fill 100% (1,85 s) | 2,72 s | goed |
| Chromium 3 Mbit | 0 → 6 → 14 → 24 → … → 89 → 96 → 99 → 100%; Vespa 0 → 192 px | fill 100% (6,45 s) | 7,28 s | goed |
| Chromium 50 Mbit (warm-achtig) | 0 → 81 → 99 → 100% | fill 92,9% | 1,70 s (≥ 1,2 s) | aanvaardbaar, balk 100% vóór de fade |
| Reduced motion | 0 → 40 → 53 → 72 → 81 → 92 → 97 → 100%, Vespa display:none, geen `go` | n.v.t. | 2,54 s | goed |
| Geblokkeerde webp/woff2 | 0 → 60 → 77 → 98 → 100% | fill 97% | 1,79 s | goed |
| Hangende webp/woff2 | blijft op 15,8% staan, na 6 s naar 100% | fill 86% (6,26 s) | 7,10 s | goed (fallback) |
| **Chromium CPU 4× (iPad-9-achtig), 9 Mbit** | 0% tot 2,45 s (geen frames: app-boot), dan 66 → 98 → 100% | **fill 38–50%** | 3,5 s | **fout** |
| Chromium CPU 6×, 9 Mbit | 0% tot ≈ 3,2 s, dan 8 → 54 → 98 → 100% | **fill 32–44%** | 4,3 s | **fout** |
| Chromium CPU 4×, 50 Mbit | 0% tot 2,5 s, dan 86 → 100% | **fill 52–61%** | 3,6 s | **fout** |
| **WebKitGTK (Xvfb)** | 17,1% staat stil, dan 32 → 44% | **fill 17%** | weg bij **44% vol** | **fout** |

Wat de fix oplost: de bevriezing door de herstartende CSS-overgang is weg. Bij een normale CPU volgt de getekende balk de echte voortgang vloeiend en monotoon, bereikt 100% en daarna rijdt Nino uit. De minimale zichtduur van 1,2 s blijft staan (snelste geval 1,62 s van eerste frame tot weg). Reduced motion en de fallbacks voor geblokkeerde/hangende assets werken.

**FAIL-reden (reproduceerbaar):**
- `leave()` start de rit-uit op een timer (`wait = max(150, MIN − RIDE − verstreken)`) zonder te wachten tot de **getekende** waarde 1 is. De getekende waarde loopt alleen in `requestAnimationFrame`.
- Als frames schaars zijn, rijdt de Vespa al weg terwijl de balk halfvol is. Dat gebeurt als de hoofdthread bezet is met het booten van de app: Chromium met CPU-throttling 4× (onze ondergrens is de iPad 9) of WebKit.
- In WebKit verdwijnt het laadscherm zelfs bij **44%**: `finish()` wacht ook niet op `drawn ≥ 1`. Dat schendt "loopt altijd tot 100% vol" en "bij 100% rijdt hij rechts het beeld uit".
- Reproduceren: `Emulation.setCPUThrottlingRate {rate:4}` en Fast 4G op /italie/. Log per frame de breedte van `::after` en de klasse `go`. Op het moment dat `go` verschijnt is de balk 38–61% vol.
- Richting voor de bouwer: de rit-uit pas starten als `drawn` 1 bereikt (in de rAF-lus), of bij `leave()` direct `drawn = 1` zetten, of de balk met een CSS-animatie op de compositor laten lopen.

**Kanttekening (geen fix in de loader mogelijk):** met CPU 4× tekent Chromium 2,4 s lang geen enkel frame, omdat de hoofdthread druk is met de app-boot. In die tijd staat de balk op 0%. Een balk die op de hoofdthread getekend wordt kan dat niet verhelpen. Alleen een CSS-/compositor-animatie of minder boot-werk vóór de eerste frames helpt. Dat is een backlog-idee, geen eis uit het contract.

Les: test een laadbalk ook met CPU-throttling (iPad-9-ondergrens) en in WebKit. Een op rAF gebaseerde balk loopt alleen als er frames zijn; een einde dat met een timer wordt ingezet moet op de getekende waarde wachten.

---

## Hertoets 2 punt 2 (laadscherm), fix 2 fcc7bba, live

VERDICT punt 2: **PASS**. Het totaal van BL-037 blijft **FAIL** zolang punt 8 (55%-norm) bij Dennis ligt; alle andere punten zijn PASS.

Gedraaid op live https://www.ninotopo.nl/italie/ met r2.mjs (netwerk), r3.mjs (netwerk + CPU-throttling) en wk2.mjs (WebKitGTK). Cache staat uit en ik meet per frame de gerenderde breedte van `::after`.

| Scenario | Bij 'go' | Weg na (zichtbaar) | Fill monotoon |
|---|---|---|---|
| Chromium 9 Mbit (0→7→49→62→78→88→96→100%) | fill 100%, p 1 | 2,96 s (2,86 s) | ja |
| Chromium 3 Mbit | fill 100%, p 1 | 7,27 s | ja |
| Chromium 50 Mbit | fill 100%, p 1 | 1,74 s (1,69 s ≥ 1,2 s) | ja |
| Chromium CPU 4×, 9 Mbit | fill 100%, p 1 | 3,27 s | ja |
| Chromium CPU 6×, 9 Mbit | fill 100%, p 1 | 4,52 s | ja |
| Chromium CPU 4×, 3 Mbit | fill 100%, p 1 | 7,32 s | ja |
| Chromium CPU 4× / 6×, 50 Mbit | fill 100%, p 1 | 3,61 s / 4,57 s | ja |
| Reduced motion (ook met CPU 4×) | geen 'go', Vespa display:none, fill 100% vóór de fade | 2,56 s / 2,81 s | ja |
| Geblokkeerde webp/woff2 | fill 100%, p 1 | 1,77 s | ja |
| Hangende webp/woff2 | fill 100% (fallback na 6 s) | 7,09 s | ja |
| WebKitGTK | 100% (Vespa op 176 px = einde balk) vóór 'go', daarna rijdt hij uit tot 1256 px | 2,46 s | ja |

Het laatste frame vóór 'go' heeft altijd fill 100% en de Vespa aan het eind van de balk (176 px). Het minimum van 1,2 s blijft staan.

Kanttekening (backlog, geen contracteis): met CPU 4× tekent Chromium tot ≈ 2,1 s geen frame omdat de app opstart. De balk springt dan van 0% naar 100%. Een loader op de hoofdthread kan dat niet verhelpen; alleen een compositor-animatie of minder boot-werk helpt.

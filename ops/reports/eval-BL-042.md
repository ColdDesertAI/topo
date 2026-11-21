# Evaluatie BL-042: vragen Dennis 21-11 (vier fixes)

Getoetst: main dd1ab1a (ac9e9bb, 2619c0d, bb0c020, dd1ab1a), lokaal (preview en offline-release opnieuw gebouwd) en live (www.ninotopo.nl, /italie/). Evaluator: Opus, 21-11-2026.
Niet opnieuw gedraaid (door de opdrachtgever al groen gemeld): qa-v3-menu1 (volledige matrix), qa-v3-fade (Chromium + WebKit), npm test, --smoke, qa-v3-paspoort, qa-v3-zoom, build:site.

VERDICT: FAIL

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | Nieuwe namen overal, niets afgesneden | Chromium, preview: kiezer, Instellingen en demo-balk bij 1440/1280/1080/810/768 | PASS | Kiezer: "Toscane / Gardameer / Middellandse Zee / Sicilië", 13 px. "Middellandse Zee" staat op twee regels, er is niets afgesneden (scrollWidth ≤ clientWidth) en de popover blijft in beeld. De aria-labels zijn "Achtergrond …" en standaard staat bg03 op pressed. In Instellingen staan "Middellandse Zee, Toscane, Gardameer, Sicilië, Wisselen" (17 px, knoppen 44 px hoog, niet afgesneden). De demo-balk toont "BG-02 Gardameer" en "BG-03 Middellandse Zee". |
| 2a | Lijst niet breder dan vóór BL-039.8, kaart niet bedekt | De preview van 2cdedd9^ (git archive) naast die van main gebouwd. Bij de staat #alles zijn alle 11 rijen om de beurt geopend. | PASS | Oud en nieuw zijn identiek: 1440 → 300 px, 1080 → 274, 1180 → 274, 810p → 702, 768p → 660. De kaart wordt nergens bedekt (overlap false, kaart 100% in beeld). Er steekt geen element buiten de lijst. |
| 2b | Eén hoofdstuk open | Klikken en het toetsenbord (Enter/Spatie) | PASS | Er is steeds precies één rij met aria-expanded=true. |
| 2c | Esc en × sluiten, focus terug | Toetsenbord: Tab naar ×, Enter, Esc | PASS op zichzelf | × (44×44, aria-label "Sluiten") sluit en zet de focus terug op de rij. Esc doet hetzelfde. Esc zonder open hoofdstuk doet niets. |
| 2d | Esc breekt geen andere lagen | Chromium, preview en live: hoofdstuk open, dan Instellingen of de achtergrondkiezer open, dan Esc | **FAIL** | Zie FAIL-reden 1. |
| 2e | Legenda compact, aria | DOM | PASS | role=group met aria-label "Niveaus: Nog oefenen, Herhalen, Opfrissen, Op weg, Goed onthouden". Vijf pizza's van 20 px met role=img, aria-label en title. "0 → 100%" in 13 px. Past binnen de lijst. |
| 3 | Portal: inactieve foto hovert, knop zonder hover, cursor default, reduced motion | Chromium, live, 1440 en 810, met en zonder reduce | PASS | Frankrijk: alt 0→1, base 1→0, scale 1.03, overgang 0,4/0,6 s. Spanje/Duitsland/Nederland: alt 0→0,73, base 0,69→0, scale 1.03. De hover-webp's laden. De knop blijft rgb(238,238,241)/rgb(96,96,106), ook bij hover. De cursor is default en er is geen a[href]. De rand verandert niet. Met reduce: transform none en overgang 0 s, dus een directe wissel zonder zoom. Italië is ongewijzigd. |
| 4a | Zoom laadt het origineel pas bij klik (web) | Chromium, live met profiel: netwerkverzoeken tellen | PASS | TOPO_V3_FULL heeft 11 items. Bij het laden van de pagina gaat 0 keer een verzoek naar die bestanden, na een klik precies 1. naturalWidth is 1672 (city1 Firenze, city2 Roma-export). |
| 4b | Maat ≤ 70vw, ≤ 80vh·ratio, ≤ bronbreedte | Live: 1440/1080/1180/2560 | PASS | 1008/756/826 px (= 70vw). Bij 2560 is het 1672 px (begrensd door de bronbreedte, 70vw = 1792). |
| 4c | Offline klein, bestand niet groter, zoom werkt offline | TOPO_V3_RELEASE=1 gebouwd op bb0c020 en op dd1ab1a, file:// | PASS | Het offline-bestand is 30.555.302 → 30.555.839 B (+537 B). Er staat geen TOPO_V3_FULL-toewijzing in. De zoom toont het ingebedde beeld: naturalWidth 740, getoond 740 px (niet opgeschaald), ook bij 2560. Dennis beslist of 740 px offline genoeg is. |
| 4d | Focus en Esc bij de zoom | Live en offline | PASS | De focus gaat naar het kruisje van de zoom en na Esc terug naar de afbeeldingsknop. Herhaald 8 keer bij 2560 en bij 1440 met Esc na 50 ms: steeds dicht binnen 600 ms. Eén keer, bij de eerste koude run op 2560, stond de overlay er na 600 ms nog. Daarna was dat niet meer te reproduceren; ik beschouw het als traag headless renderen. |
| 4e | Robuustheid van de split-site-patch | Codereview en dist-uitvoer | PASS | Het build faalt hard als er geen 11 beelden zijn of als `<head><meta charset="utf-8">` ontbreekt. De bestanden hebben een hash als naam (immutable cache). De `w` uit het manifest klopt met de werkelijke bronbreedte (alle 1672×941 gemeten). Als het laden mislukt, blijft het kleine beeld staan. Een late onload na het sluiten wordt genegeerd (`ov.isConnected`). |
| UI | Niets afgesneden of overlappend, AA, knoppen ≥ 44 px | Screenshots in eval42/, plus de groene runs van de opdrachtgever | PASS, op 2d na | De sluitknop is 44 px. De legenda is 13 px. |

## FAIL-redenen (concreet, reproduceerbaar)

1. **Esc in het Kennispaspoort kaapt Esc van lagen erboven (regressie).** In `scripts/v3/voortgang.js` hangt `onEsc` aan `document` en luistert die alleen naar `aria-expanded==='true'`. Er wordt niet gekeken naar `e.defaultPrevented` of naar een open dialoog of popover. Daarnaast roept de handler `e.preventDefault()` aan.
   - **Instellingen:** open Voortgang, open hoofdstuk 1, open Instellingen (tandwiel) en druk op Esc. De **Instellingen-dialoog blijft open**, want preventDefault onderdrukt de cancel van `<dialog>`. Het hoofdstuk achter de modal klapt dicht. Pas bij een tweede Esc sluit de dialoog.
     - Vóór 2cdedd9 sloot de eerste Esc de dialoog wel.
     - Live gereproduceerd op www.ninotopo.nl/italie/: `{"open":1,"dlg":true} -> Esc -> {"open":0,"dlg":true}`.
     - Scripts: /tmp/claude-0/-home-user-topo/0568f8e3-09c7-59a3-9424-2da44b974a18/scratchpad/eval42/liveesc.mjs en /tmp/claude-0/-home-user-topo/0568f8e3-09c7-59a3-9424-2da44b974a18/scratchpad/eval42/set2.mjs (nieuw tegenover oud).
   - **Achtergrondkiezer:** zelfde opzet, maar met de popover open. Eén Esc sluit de popover (de focus gaat terug naar de knop, dat is goed) en klapt tegelijk het hoofdstuk dicht. Script: /tmp/claude-0/-home-user-topo/0568f8e3-09c7-59a3-9424-2da44b974a18/scratchpad/eval42/kbd.mjs.
   - Dit gaat in tegen de eigen conventie in `reis.js:606`: "Escape closes … only when nothing is open above it".
   - Fixrichting:
     - Doe in `onEsc` niets bij `e.defaultPrevented`, bij een open `dialog[open]`, bij `.v3BgPop:not([hidden])` of bij `.v3ZoomOverlay`.
     - Voeg dit geval toe aan `qa-v3-paspoort.mjs`.

## Buiten scope opgemerkt (→ backlog-idee)
- Bij 1080 (lijst 274 px) breken plaatsnamen in de paspoorttabel af onder het vinkje ("✓ / Catanzaro", "✓ La / Spezia"). Rijtitels als "Steden 13–18" staan op 1440 en 1080 op twee regels. Dit was al zo vóór 2cdedd9 (zie de screenshot cmp1080.png). Het is geen afsnijding, maar het oogt rommelig.
- Portal: de hover op inactieve kaarten staat niet achter `@media (hover:hover)`. Op de iPad kan een tik een "plakkende" hover geven: de foto wisselt en zoomt, terwijl er niets gebeurt. Bij Italië werkt het al zo.
- Portal, reduced motion: de foto wisselt direct zonder fade. Dat valt binnen "crossfade of niets", maar een korte opacity-overgang zonder zoom zou zachter zijn.
- Elke render van Voortgang hangt een nieuwe `keydown`-listener aan `document`. Een oude listener ruimt zichzelf pas op bij de volgende toetsaanslag. Dat lekt niet echt, maar het is wel slordig.

## Les
Een globale Esc-handler voor een inline-onderdeel moet altijd kijken naar `e.defaultPrevented` en naar open lagen (dialoog, popover, overlay). Test Esc daarom niet alleen los, maar ook met een laag erboven. Neem dat op in de qa-scripts van elk onderdeel dat Esc afhandelt.

Bewijsmap: /tmp/claude-0/-home-user-topo/0568f8e3-09c7-59a3-9424-2da44b974a18/scratchpad/eval42/
- Screenshots: new-pas-*.png, old-pas-*.png, cmp1080.png, pick-*.png, settings-*.png, portal-hover-spanje.png
- Scripts: w.mjs, kbd.mjs, set.mjs, set2.mjs, liveesc.mjs, zoom.mjs, z2.mjs, pick.mjs, portal.mjs

---

# Hertoets punt 2 (Esc-regressie): main 76350a5, 21-11-2026

HERTOETS-VERDICT: PASS (BL-042 als geheel daarmee PASS; punt 1, 3 en 4 waren al PASS)

| # | Controle | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| H1 | Esc met Instellingen open | set2.mjs (preview, opnieuw gebouwd) en liveesc.mjs (live /italie/) | PASS | Preview: `{"open":1,"dlg":true}`, eerste Esc → `{"open":1,"dlg":false}` met focus op het tandwiel. Een tweede Esc sluit daarna het hoofdstuk, met de focus op de rij. Live geeft hetzelfde: `{open:1,dlg:true}`, Esc → `{open:1,dlg:false}`. |
| H2 | Esc met achtergrondkiezer open | kbd.mjs | PASS | Esc sluit alleen de popover; het hoofdstuk blijft open (`open:["city1"]`) en de focus staat op de achtergrondknop. |
| H3 | Esc in de zoom op Reis | leak.mjs (hoofdstuk city1) | PASS | De eerste Esc sluit alleen de zoom; de hoofdstukpagina blijft staan en de focus staat op de afbeeldingsknop. Pas een tweede Esc sluit de hoofdstukpagina (bestaand gedrag, reis.js:606). |
| H4 | Gewoon Esc, × en één open (geen regressie) | kbd.mjs en qa-v3-paspoort.mjs (zelf gedraaid) | PASS | Esc en × sluiten en zetten de focus terug op de rij. Esc zonder open hoofdstuk doet niets. qa-v3-paspoort: 0 fouten, inclusief de nieuwe gevallen. |
| H5 | Listener-ophoping | leak.mjs: keydown-listeners op `document` geteld na 11× wisselen tussen Reis en Voortgang | PASS (met opmerking) | Er is één listener per lijst. Ongebruikte listeners van weggehaalde lijsten blijven staan tot de volgende toetsaanslag. Na 11× wisselen zijn het er 13, na één toets weer 3 (de begintoestand plus de huidige lijst). De ophoping is dus tijdelijk en doet niets, want verlopen listeners stoppen direct. |
| H6 | Selector `.v3Rit` blokkeert Esc niet ten onrechte | Code (rit.js:93) en H4 | PASS | `.v3Rit` wordt alleen als dialoog aangemaakt zolang er een rit loopt. In de normale toestand werkt Esc (H4). |

Opmerking (geen FAIL): als nette afronding kan de listener ook bij het weghalen van de lijst verdwijnen in plaats van bij de eerste toets daarna. Dat is cosmetisch.
Hertoets-scripts staan in /tmp/claude-0/-home-user-topo/0568f8e3-09c7-59a3-9424-2da44b974a18/scratchpad/eval42/: set2.mjs, kbd.mjs, liveesc.mjs en leak.mjs.

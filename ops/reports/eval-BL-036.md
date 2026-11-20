# Evaluatie BL-036 — testfeedback Dennis 20-11 (11 punten)

Evaluator (Opus), 20-11. Getoetst tegen `ops/contracts/BL-036.md`, live (https://www.ninotopo.nl/ en /italie/, Chromium via Playwright, profiel uit seed.json) en in de code (`git diff aee4401..HEAD`). Niet opnieuw gedraaid (hoofdsessie, OPERATING_MODEL §3b): volledige qa-v3-menu1-matrix, qa-v3-fade, npm test. Wel zelf gedraaid: `npm run lint` (groen), gerichte browserproeven per punt, een eigen laadtijdmeting, offline-test via file://. Scripts en screenshots: `/tmp/claude-0/-home-user-topo/0568f8e3-09c7-59a3-9424-2da44b974a18/scratchpad/eval36/`.

VERDICT: PASS (na hertoets op 4deb5ab; eerste ronde: FAIL, zie hieronder)

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | Klaar-vinkjes violet, wit vinkje; groen alleen bij "goed" | computed styles live: Reis, hoofdstukpagina, lesbalk, Voortgang + scan op groene tinten (hue 85–175) | PASS (met opmerking) | `.v3OkDot`, `.v3StepDot` (li.on), `.v3LesMark[data-state=done]`, Voortgang-rij: alle `rgb(91,69,224)`; paspoort-✓ `rgb(72,52,196)`; groenscan op 4 schermen: 0 treffers. Opmerking: antwoordfeedback "goed" is in V3 al lavendel/violet (`ronde3.css:57`, `#eee8ff`/`#4d32a5`), niet groen. Bestond al voor BL-036; het contract ging uit van groen. Zie "Buiten scope". |
| 2 | Popup violet; ×/Esc/buiten annuleren zonder beoordeling; elk geval getest; inventaris volledig | inventaris gelezen + test gelezen + live V3-proef in Aanwijzen | PASS | Inventaris dekt 7 gevallen (keuzevenster: Ontdekken, Aanwijzen, Oefenen, Toets, Rome-stip; Rome-lens: Ontdekken, ontdekstap) en de uitsluitingen. Live (Aanwijzen "Waar ligt Pisa?"): ×, Esc en tik buiten sluiten, en state blijft gelijk (`cur city-8, answered false, good 14, mistakes 0`). Kiezen wordt normaal beoordeeld (`answered true, mistakes 1`). Rome-lens: rand `#5b45e0`, achtergrond `#fbfaff`, × 44×44, geen dennengroen. Lens sluit bij het keuzevenster (test `popup-annuleren.test.mjs`). Kanttekening: het × van het keuzevenster rendert in V3 als witte pil van 80×44 (generieke knopstijl), functioneel ≥ 44 px. |
| 3 | Elk item `related`; label altijd bij `false`, niet over andere iconen | JSON-telling, build-check in de code, live per hoofdstuk (alles ontgrendeld) op 5 maten | PASS | 39/39 koppelingen hebben een boolean (28 true, 11 false), gelijk aan het rapport. `build-v3-preview.mjs:108` gooit een fout zonder `related`. Live: vaste labels precies bij de 11 false-koppelingen, opacity 1, 13 px. Overlap label↔ander icoon ≤ 0,8 px (IJsje-pil raakt de Colosseum-cirkel bij Rivieren op 1440/1366 net wel; visueel aanliggend, niet erover). De oordelen in `BL-036-iconen.md` vind ik redelijk en voorzichtig. |
| 4 | Focusring violet 2+2, app en portal | Tab-sweep live: Reis, les, Oefenen, Toets, Beloningen, Voortgang, Reisboekje, Schoolblad, BG-keuze, Instellingen, profiel, portal | PASS (met opmerkingen) | Overal `solid 2px rgb(91,69,224) offset 2px`, nergens blauw. Afwijkingen, allemaal violet/lavendel: Schoolblad-viewport offset −4 px (ring naar binnen), profielnaam-input lavendel box-shadow in plaats van outline, Instellingen-dialoog zelf `auto 1px` violet. Portal: skip, logo, "Start leren", ouderlink allemaal 2+2 violet. |
| 5 | Nino-Vespa alleen bij actieve pin, geen overlap, stil bij reduced motion | live 1440×900, 1080×810, 810×1080; reducedMotion | PASS (met opmerking) | Eén `.v3MarkerNino`, 32×32, bij pin 2 (actief), animatie `v3NinoBob`; bij reduced motion `animation: none`. Geen overlap met andere pins: het kader raakt alleen het kader van de eigen actieve pin. Opmerking: de plek valt terug op links/rechtsboven als rechtsonder botst (zo bedoeld in de code). In iPad-portret (810×1080) heeft het Reis-overzicht geen genummerde pins en geen Nino. |
| 6 | Link niet terracotta; dialoog duidelijk; Annuleren focus; wisknop AA | live Instellingen en bevestiging | PASS | Link `rgb(42,36,64)` + waarschuwingsicoon 16 px, geen terracotta. De dialoog "Alles wissen?" zegt wat er gewist wordt. De focus staat op "Annuleren" (`:focus-visible`, 2 px violet). "Ja, alles wissen" is wit op `#9b233d` (≈ 7,9:1). Kleinste tekst 16 px. Esc sluit zonder te wissen (localStorage intact). |
| 7 | ?-knop + `#uitleg`; 6 secties; feiten; ≥ 13 px; × en Esc; portal-link | live + code | **FAIL** | De pagina zelf klopt: 6 secties, kleinste tekst 16 px, × 44×44, Esc/×/buiten sluiten, de focus gaat terug naar de ?-knop, `/italie/#uitleg` opent direct (ook op een nieuw apparaat) en de hash verdwijnt bij sluiten. Portal-link "Voor ouders en leraren" → `./italie/#uitleg`, 14 px. Feiten nagelopen: 8 punten = 1 pizza en 3 pizza's = 1 rit (`learning-engine.js:6-7`), toets geen beloning maar wel dagdoel (`05-app-kern.js:112`), Schoolblad uit bij toets (`v3/schoolblad.js:13`), dagdoel 8, kleuren paspoort. **Regressie:** door de derde knop in de zijbalkvoet staat het tandwiel (Instellingen) in iPad-portret buiten beeld. Zie FAIL-reden 1. |
| 8 | Rit precies één keer bij de 3e pizza; overslaanbaar; reduced motion zonder rit; geen dubbele V2-rit; Reisboekje-knop | live end-to-end: 3e pizza via `grade(true,…)` in Aanwijzen, terug naar Reis, herladen; rit nr. 3 met ansichtkaart; reduced motion | **FAIL** | Werkt: de rit verschijnt één keer (fase ride → arrived na ±2,5 s, lijn van pin 2 naar pin 3), niet opnieuw na wisselen van scherm of na herladen. Esc/tik slaat over. Geen V2-toast of V2-ritdialoog. Rit 3 toont de ansichtkaart Venetië en "Bekijk in Reisboekje" opent het boek op "Venetië, je derde Vespa-rit". Bij reduced motion meteen het eindbeeld met fade. De focus staat op "Verder". **Defect:** de V2-pizzaviering in de les toont nog "Drie pizza's! Nino start de Vespa." met de knop "Start de Vespa-rit". Die knop doet nu niets, want `celebrateTrip` is een no-op. Zie FAIL-reden 2. Ook ontbreekt de terugvaloptie "anders naar de bestemming van de ansichtkaart": zonder volgend hoofdstuk toont de code alleen de kaart. |
| 9 | Zelfde favicon-set, manifest, theme-color | curl live van portal en /italie/; HTTP-status van de iconen | PASS | Beide heads: theme-color `#FAFAF9`, favicon.ico/32/16/48, apple-touch-180, manifest (192/512). /italie/ gebruikt absolute paden naar dezelfde bestanden, alle 7 iconen 200. Er staan geen ingebedde favicon-links meer in de webkopie. Het offline-bestand `output/html/TOPO-V3-Italie.html` houdt zijn ingebedde data:-favicon. |
| 10 | Portalknopstaten | live computed bij hover/active/focus, normaal + reduced motion | PASS | In rust `#7b66b7`. Hover `#6a539f`, translateY(−1px), schaduw. Actief `#54407f`, translateY(0), kleine schaduw. Focus 2 px violet + 2 px. Transitie 0,15 s. Reduced motion: alleen `background-color`, geen transform of schaduw. Er zijn geen andere echte portalknoppen (Frankrijk e.v. zijn geen links). |
| 11 | Laadtijd: split, offline ongewijzigd en werkend, immutable, laadstaat, prefetch; < 3 s koud, < 1 s warm | eigen meting Fast 4G (60 ms, ≈ 8 Mbit/s), curl-headers, offline file:// met netwerk uit | PASS | Koud tot `v3Shown`: 2,45 s desktop / 1,97 s iPad-landschap (`v3Ready` 1,0 / 0,75 s), 1,83 MB. Warm: 0,69 / 0,72 s. `/italie/assets/*`: `public, max-age=31536000, immutable`. HTML 1,05 MB. Laadstaat `#v3Loader` aanwezig. Portal: prefetch-script met /italie/ + 5 eerste-schermbestanden. Offline-bestand: geen `assets/<hash>`-verwijzingen, 0 netwerkverzoeken, `v3Ready`, 7/7 beelden geladen, 0 fouten. |
| UI | Geen afgesneden/overlappende tekst; AA | matrix door hoofdsessie; eigen screenshots | **FAIL** | Zie FAIL-reden 1: een bedieningselement half buiten het scherm op de iPad-9-ondergrens (portret). |
| DoD | lint/test | `npm run lint` zelf gedraaid | lint groen | npm test volgens de hoofdsessie groen (niet herhaald). |

## FAIL-redenen (concreet, reproduceerbaar)

1. **Tandwiel (Instellingen) buiten beeld in iPad-portret (810×1080 en 768×1024), regressie van BL-036.7.**
   De zijbalkvoet (`.v3SideFoot`, `menu1.css:477`) is onder 1024 px een rij. Met de nieuwe `.v3HelpBtn` zijn dat 3×48 px + 2×8 px = 160 px, gecentreerd in een rail van 76 px breed.
   Meting op /italie/ bij 810×1080:
   - `v3Settings` op x −24..28, het middelpunt is niet klikbaar (`elementFromPoint` raakt de knop niet);
   - `v3HelpBtn` op 92..140, steekt buiten de rail (rechterrand 96) en over de kaartkaart.

   Zonder de ?-knop (gesimuleerd door die te verwijderen) staat het tandwiel op 4..56 en is het wel klikbaar. Screenshots: `eval36/foot-810x1080.png` en `eval36/port-chromium.png`: het tandwiel is onzichtbaar.
   Reproduceren: open https://www.ninotopo.nl/italie/ met een profiel op 810×1080 en kijk linksonder. De qa-matrix vond dit niet, omdat die alleen tekst/overlap toetst en geen bedieningselementen buiten de viewport.
2. **Dode knop "Start de Vespa-rit" in de les (BL-036.8).**
   `rit.js` maakt van `celebrateTrip` een no-op. De V2-pizzaviering (`pizza-reward.js:44/46` → `nino-art-ui.js:17` onTrip → `celebrateTrip`) toont bij de 3e pizza nog wel "Drie pizza's! Nino start de Vespa." met een terracotta knop "Start de Vespa-rit". Na de klik gebeurt er niets: de viering sluit en er komt geen rit en geen melding. De rit verschijnt pas als het kind (soms veel later) terugkeert naar het Reis-overzicht. Voor BL-036 startte deze knop direct het V2-ritmoment.
   Reproduceren: profiel met `pizzas:2, slices:7, trips:0` → Aanwijzen → goed antwoord (`eval36/b8.mjs`, screenshots `cel.png`/`cel2.png`).
   Daarnaast wijkt de code af van het contract: de terugvaloptie "anders naar de bestemming van de ansichtkaart" ontbreekt; zonder volgend hoofdstuk verschijnt alleen de kaart.

## Buiten scope opgemerkt (→ backlog-idee)
- Antwoordfeedback "goed" is in V3 lavendel/violet (`ronde3.css:57`), al sinds ronde 3. Het contract zegt "groen alleen nog voor goed". Dennis moet kiezen: groen terug voor "goed", of de contractregel aanpassen.
- Het keuzevenster "Welke plek bedoel je?" is in V3 doorschijnend zonder blur (`menu1.css:353` zet `backdrop-filter:none`). De lesinhoud ("Steden 7–…") schemert door achter de titel en het ×. Bestond al eerder.
- × van het keuzevenster: witte pil van 80×44 in plaats van een rond × van 44 px (de generieke V3-knopstijl wint).
- Lesfeedback "Andiamo! Nino rijdt naar Florence/Venetië" (V2-tekst) past niet bij de V3-rit, die naar de pin van het volgende hoofdstuk rijdt.
- Lesscherm in iPad-portret: de lesbalk ligt over de zijbalkvoet (BG- en ?-knop niet klikbaar). Lijkt al eerder zo, nu met één knop meer.
- Bij direct openen van `/italie/#uitleg` staat er een focusring om de titel "Hoe werkt TOPO?" (programmatische focus telt als focus-visible). Cosmetisch.
- Een rit die in een les wordt verdiend en waarna het kind herlaadt voordat het Reis ziet, wordt nooit getoond (de "getoond"-stand staat alleen in het geheugen). Dat volgt uit "geen nieuwe opslag", maar is het bewust afwegen waard.
- Toetsgat: qa-v3-menu1 controleert niet of bedieningselementen binnen de viewport vallen en klikbaar zijn. Voeg een check toe met `elementFromPoint` op het middelpunt van elke knop.

## Les
Een extra knop in een gedeelde voet- of werkbalk moet op de smalste ondergrens (iPad-portret 810 px) gemeten worden op "binnen de viewport en klikbaar", niet alleen op tekstoverlap. Een V2-functie stilzetten (`celebrateTrip=()=>{}`) vraagt om een zoektocht naar elke UI-tekst die die functie belooft ("Start de Vespa-rit").

## Hertoets (20-11, fix-commit 4deb5ab, live)

Ik heb alleen de twee FAIL-punten en het UI-criterium dat daarvan afhing opnieuw getoetst. Eerst heb ik gecontroleerd dat de fix live staat: de live /italie/-HTML bevat de nieuwe media query `(min-width:700px) and (max-width:1279px)` voor `.v3SideFoot` en de terugvaloptie `city-11/city-6` in rit.js.

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 7 | Tandwiel, BG-knop en ? binnen de rail en klikbaar | live, `elementFromPoint` op het middelpunt van elke knop; botsing tussen zijbalkknoppen; buiten-viewport-check | PASS | 810×1080: Settings 32..84, BG 34..82, ? 34..82 (rail 20..96), alle drie klikbaar. 768×1024 idem. Ook in de les in portret klikbaar. 1024×768, 1080×810, 1180×820, 1366×1024: ongewijzigd en klikbaar. 8 zijbalkknoppen per maat, 0 botsingen, 0 buiten de viewport. Screenshot `eval36/re-port-810.png`. |
| 8 | "Start de Vespa-rit" in de les doet iets; rit precies één keer | live: 3e pizza in Aanwijzen → knop → Esc → terug naar Reis; normaal en reduced motion | PASS (met opmerking) | Na de knop staat direct de ritkaart "Vespa-rit nr. 3!" met de ansichtkaart Venetië in beeld (`eval36/re-les-card.png`). Esc sluit de kaart. Terug op Reis komt na 4 s geen tweede rit (`rit:0`), en er verschijnt geen V2-toast. Reduced motion: hetzelfde. Opmerking: in de les blijft de focus op "Volgende" staan en gaat niet naar "Verder" op de kaart. Esc werkt wel en de kaart is niet-modaal; dit is a11y-polish, geen blokkade. |
| 8b | Zonder volgend hoofdstuk naar de stad van de ansichtkaart | live: hoofdstuk 1–10 klaar, Rivieren actief, trips 2 → 3 | PASS | Er verschijnt een rit met een lijn van pin 11 naar `[data-id=city-11]` (Venetië); `.v3RitLine` is aanwezig (`eval36/re-fallback.png`). |
| UI | Geen bedieningselement onbereikbaar | zie 7 | PASS | De regressie is weg. |

De hertoets heeft de eerste meting niet meer nodig: rit.test 14/14 en de nieuwe qa-check "knop niet bereikbaar" zijn door de hoofdsessie gemeld en niet door mij herhaald.

### Overige portretfouten (810×1080): raken ze BL-036?
Nee. `git diff aee4401..HEAD -- scripts/v3/` raakt de portretlayout van het Reis-overzicht niet: geen regels voor `.v3Rows`/`.v3Row`, de kaartgrootte, de secundaire knop "Ontdekken" of portret-media-queries. Alleen focusringen en de zijbalkvoet zijn gewijzigd. Die fouten bestonden dus al. Portret zat nooit in de matrix.

Wel zijn ze ernstig genoeg voor een **eigen backlog-item met hoge prioriteit**, want iPad 9 is de ondergrens en portret valt daaronder. Zelf gezien op 810×1080:
- de hoofdstuklijst rechts is afgesneden ("Stede 1–6", "Eilan…");
- de kaart beslaat ±18% van het scherm, terwijl het anti-patroon in QUALITY.md < 45% is;
- de knop "Ontdekken" is 34 px hoog, minder dan de touch-ondergrens van 44;
- het Reis-overzicht in portret heeft geen genummerde pins en geen Nino op de Vespa;
- de lesbalk ligt in de les over de zijbalk (al genoemd onder Buiten scope).

## Eindoordeel
**PASS** voor BL-036, op voorwaarde dat de portretfouten hierboven als apart item in de backlog komen. Ze blokkeren de release-gate G3 (iPad 9, alle schermen passen), niet deze taak.

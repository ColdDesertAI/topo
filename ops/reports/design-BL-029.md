# Design-review BL-029 (Menu 1), 16-11

**Oordeel: NO-GO voor G1, met een korte reparatieronde.** Het Reis-overzicht is G1-klaar. Twee schermen breken nog een harde ontwerpregel: de hoofdstukpagina (kaart) en Voortgang (één kaart).
Getoetst op de werkboom van `claude/nightly-pr99-kaart-feestje-fvpl06` (HEAD `7ce0c31`, preview opnieuw gebouwd).
Gebruikt: `node scripts/qa-v3-menu1.mjs` (0 fouten, blur ≤ 2, Nino 184×200 / 60×64) en eigen screenshots op 1440×900 en 1080×810 (BG-01/BG-03) van alle schermen plus een les. Daarnaast de twee vergelijkingsbladen en DOM-metingen.

## Per scherm

### Reis-overzicht: werkt, dicht bij Menu 1
- **Werkt:**
  - De opbouw is één-op-één Menu 1: vaste zijbalk, verloop, één lijstkaart, kaart in de verloopzone, vrij titelblok en losse tellerpillen.
  - De kaart beslaat 31% van het schermoppervlak (Menu 1 ~36%).
  - De titel staat op 52/800 en is leesbaar op alle drie de BG's. De lokale gloed valt niet op als vlek.
  - Op 1080 werkt de iconenrail rustig.
- **Afwijkingen van Menu 1:**
  - **Schoolblad · Schoolkaart/Reliëf onderaan in het midden.** Die staan niet in Menu 1 en zijn ruis op het overzicht. Ze zijn niet terecht, zie nice-to-have 2.
  - **Losse vormen in de zee.** Het Meer van Genève hangt als los blauw krulletje linksboven de Alpen, Corsica is een spookcontour en bij Napels staat een donker driehoekje. Menu 1 toont Corsica als land. Zie nice-to-have 1.
  - **Marker 2 (actief, violet) staat op Palermo**, ver van het titelblok. Een kind leest "hoofdstuk 2 = Sicilië". Komt door de plaatsing "zo ver mogelijk van de vorige". Zie nice-to-have 3.
  - **Op BG-03 schemert de roze bloem door de zijbalk achter de navigatie.** Menu 1 is daar schoon wit. Zie nice-to-have 4.
- **Keuze "knop rechts start de echte stap, rij/marker opent de hoofdstukpagina":** goed. Er is één duidelijke actie en de chevron op de actieve rij belooft "meer".

### Hoofdstukpagina: niet klaar
- **Werkt:**
  - De lessenlijst als de ene kaart is de juiste vertaling.
  - De pins blijven echte plekken.
  - De artwork is mooi en de titel en knop staan vrij.
- **Afwijkingen:**
  - **De kaart is ingestort.** Italië beslaat hier 11% van het scherm (24% van de breedte), tegenover 31% op het overzicht. Op 1080 is Italië ~280×300 px. Juist op de pagina waar de echte plekken staan, wordt de kaart het kleinste element en domineert de artwork. Dat breekt "kaart eerst / ≥ 45%".
  - Onder de 3-rijen-kaart staat links een leeg wit vlak van ~480 px hoog.
  - De schakelaars staan hier linksboven, op het overzicht onderaan in het midden. Dezelfde bediening staat zo op twee plekken.
  - De lege voortgangssegmenten zijn op BG-01 nagenoeg onzichtbaar (lichte gloed, ~1,2:1).
- **Keuze "artwork 16:9 rechts, kaart in het midden":** niet terecht in deze verhouding. Zie must-fix 1.

### Oefenen: werkt
- **Werkt:**
  - Eén kaart met de keuze en één violette Start.
  - De kaart is groot en vrij. Dit is het rustigste scherm.
- **Afwijkingen:**
  - "Extra steden 13–18" en "19–23" vullen de chip tot de rand, zonder binnenmarge.
  - In de Reis-lijst heten dezelfde hoofdstukken "Steden 13–18". Twee namen voor één ding. Zie must-fix 5.
  - Dezelfde losse vormen in de zee als op het overzicht.

### Toets: werkt
- **Werkt:**
  - Eén kaart. Nino met notitieboekje staat vrij rechts: speels en precies wat de regel vraagt.
  - Violet alleen voor selectie en Start.
- **Afwijking:** dezelfde chip-rand bij "Extra steden …" (must-fix 5).

### Beloningen: bijna
- **Werkt:**
  - De tellers zijn de kaart.
  - De rit (pizza's, Vespa) staat vrij in het dichte deel.
  - Het Reisboekje is groot en vrij: een sterk beeld.
- **Afwijkingen:**
  - **De hoofdactie is onzichtbaar.** Het boek is een knop met alleen `aria-label="Open het Reisboekje"`, zonder zichtbare tekst of affordance. DESIGN_SYSTEM noemt "Open Reisboekje" de enige hoofdactie.
  - In de tellerrijen (72 px) staan label en getal bovenaan, met ~30 px lucht eronder. De rijen ogen scheef.
  - Het derde Vespa-segment loopt op 1440 de fade in.
- **Keuze:** verder terecht.

### Voortgang: niet klaar
- **Werkt:**
  - De hoofdstukkenkaart staat links, de kaart vrij in het midden en de titel met "6 / 45 plekken" groot rechts.
  - Het paspoort is standaard dicht.
  - Violet betekent "beheerst".
- **Afwijkingen:**
  - **Er staan drie kaarten op het scherm:** de hoofdstukkenlijst, het kaartje "Italië · 45 plekken" en de legenda-kaart. Het contract staat er één toe.
  - "45 plekken" staat er dubbel ("6 / 45 plekken" rechts).
  - De rijen hier hebben thumbnails en "1."-nummering; op Reis zijn het nummervierkantjes zonder thumbnail. Dat is een kleine inconsistentie.
- **Keuze "drie witte pillen rechts":** goed, consistent met de tellers.

### Les
- **Desktop:**
  - De nieuwe zijbalk en het verloop werken.
  - De lespanelen zijn nog het oude zwevende glas: een tweede visuele taal. Dat is binnen de scope verdedigbaar, maar het moet een backlogitem worden.
  - De zijbalk springt bij het binnengaan: het portret schuift 155→168 px en de navigatie 395→425 px.
- **iPad (1080):**
  - Focus Mode blijft eigenaar met de oude zwevende zijbalk-frame. Bij de overgang Reis→Les wisselt dus het hele frame.
  - De stapnaam wordt afgesneden: `v3LesStepName "Namen schrijven" 106/128 ellipsis`. Dat breekt de iPad-regel "geen afgesneden tekst". Het **bestaat al zonder de MENU-vlag** en komt dus niet door BL-029, maar het hoort wel op de backlog.

### 2560
- Alles staat op 1440-maat in de linkerbovenhoek. De kaart is ~20% breed en de compositie is daar niet Menu 1.
- Dat is bekend (BL-032) en voor G1 acceptabel, mits Dennis het bewust accepteert. Vóór release moet het opgelost zijn.

## Must-fix vóór G1 (op impact)
1. **Hoofdstukpagina: kaart terug op overzichtsmaat.**
   - Gebruik hetzelfde kaartvlak als op het overzicht (1440: ~568×700 px, 31% van het oppervlak) met de hoofdstukframing.
   - Verklein de artwork tot ~320×180 en zet hem boven de titel. Het titelblok komt op dezelfde hoogte als op het overzicht (kicker ~y 283), zodat de pagina's niet verspringen.
   - Of zet de artwork onder de lessenkaart in de linkerkolom; dat vult meteen het lege vlak.
   - Zet de schakelaars op beide pagina's op dezelfde plek.
2. **Voortgang: één kaart.**
   - Schrap het kaartje "Italië · 45 plekken"; de informatie staat al in "6 / 45 plekken".
   - Zet de legenda vrij als één regel met drie kleurstippen onder de kaart, zonder kaartvlak (of als witte pillen, zoals de tellers).
3. **Beloningen: hoofdactie zichtbaar en rijen recht.**
   - Zet een zichtbare primaire pill "Open Reisboekje" onder het boek (de enige violette knop op het scherm).
   - Geef `.v3Tile` en de pizza-rij `align-items:center`.
   - Houd de Vespa-segmenten binnen het dichte deel (≤ 24% van de werkruimte).
4. **Lege voortgangssegmenten zichtbaar.**
   - Overzicht, hoofdstukpagina en Vespa: leeg segment op `rgba(42,36,64,.16–.20)` in plaats van het huidige lichtgrijs, zodat "1 van 3" ook op BG-01 met gloed telbaar is.
   - Meet de segmenten als niet-tekst (≥ 3:1 is de WCAG-eis; minimaal duidelijk zichtbaar).
5. **Eén naam per hoofdstuk en chips met marge.**
   - Gebruik in de chips van Oefenen en Toets dezelfde korte naam als in Reis ("Steden 13–18"); de volledige titel blijft in `aria-label`.
   - Geef de chips minimaal 12 px horizontale binnenmarge.

## Nice-to-have
1. **Overzichtskaart opschonen.** Haal de meren buiten Italië (Genève) uit de overzichtskloon, toon Corsica als vol land zoals in Menu 1 (of laat het weg) en verwijder het losse driehoekje bij Napels.
2. **Schoolblad · Schoolkaart/Reliëf van het overzicht af.** Ze horen alleen op de hoofdstukpagina, waar de kaart bestudeerd wordt.
3. **Hoofdstukmarkers plaatsen.** Kies per stedenhoofdstuk de plek die het dichtst bij het zwaartepunt ligt, met verschuiving alleen bij botsing. Dan staat de actieve marker niet in een uithoek (Palermo).
4. **Zijbalkfade later laten beginnen,** bijvoorbeeld `#000 0 74%, transparent 96%`, zodat de navigatie op BG-03 op schoon wit staat zoals in Menu 1.
5. **Eén pizzanotatie.** De pizza heet nu 14/24 (teller), 6/8 (Beloningen en les) en 1/3 (Voortgang). Voor een kind van 9–12 zijn dat drie verschillende dingen. Kies één vorm per begrip en label hem gelijk.
6. **Zijbalk in de les op dezelfde positie als in Reis** (portret en navigatie zelfde top).
7. **Backlog:**
   - de afgesneden stapnaam in de iPad-les (bestaand);
   - de lespanelen naar het Menu 1-model;
   - het Focus-frame op iPad gelijktrekken met de vlakke zijbalk;
   - BL-032 (2560) en BL-031 (fps).

## Geheel
- Het overzicht voelt speels, rustig en duidelijk, en komt verrassend dicht bij Menu 1.
- Wat een topdesigner als eerste zou veranderen: de kaart op de hoofdstukpagina. Dat is nu de enige plek waar het principe "kaart eerst" zichtbaar verliest van decoratie.
- De vijf must-fixes zijn klein (CSS en layout, geen logica).

**NO-GO.** Na must-fix 1–5 en een nieuwe screenshotronde verwacht ik een GO-voorstel.

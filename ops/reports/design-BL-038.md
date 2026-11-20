# Design-review BL-038: iPad-portret op Menu 1-niveau

**Pin:** main `09b6851` · **Bekeken:** preview (opnieuw gebouwd) op 810×1080 (BG-01, BG-03) en 768×1024 (BG-03), plus `#afgerond`, `#alles` en BG-02 op 810×1080, en live `ninotopo.nl/italie/` op 810×1080 (komt overeen met de preview). Referentie: `docs/v3/renders/Menu 1.png`, liggend 1080×810.
**Oordeel: GO met kanttekeningen.** Er is geen P0. Portret is nu echt een Menu 1-scherm: de kaart is de held (kaartvlak 0,51 op 810 en 0,49 op 768), alle 11 rijen zijn zichtbaar en 44 px hoog, er is niets afgesneden, nergens tekst onder 13 px (het enige 11 px-element is `#focusLessonStatus`, een sr-only-element) en de rail werkt. Los vóór G3 de vier P1-punten op. Drie daarvan zijn klein CSS-werk.

## Bewuste keuzes van de bouwer
| Keuze | Oordeel |
|---|---|
| Lijst overlapt de kaartrij 84 px | **Akkoord.** Alleen zee eronder, geen pin bedekt (de pinvermijding werkt), het kaartvlak blijft ≥ 45%. |
| Hoofdstuk-artwork verborgen in portret | **Akkoord.** De kaart met landmark-iconen draagt de identiteit van het hoofdstuk, en een extra beeld zou de kaart verkleinen. |
| Decoratieve Nino op Beloningen verborgen | **Niet akkoord.** Onder de inhoud staat ±360 px (een derde van het scherm) leeg. Hier hoort Nino juist (zie Beloningen P1). |
| Schoolblad als icoon in de les | **Akkoord.** Het is een secundaire actie. Houd `aria-label`/`title` "Schoolblad bekijken" aan. |

Afwijkingen van het contract die niet als keuze gemeld zijn:
- de tellers staan linksboven in plaats van rechtsboven;
- Schoolblad/Schoolkaart–Reliëf staat op de kaart in plaats van in de rechterkolom;
- Beloningen heeft twee kolommen in plaats van één.

Zie de punten hieronder.

## Per scherm (P0 blokkerend · P1 vóór G3 · P2 later)

### Reis-overzicht
1. **P1. Harde rechthoek achter de tellers.** `.v3Counts` (92,68 → 327,116) houdt in portret de glasblur uit `afwerking.css:34` (`--glas-blur`, brightness 1,06) met radius 0. Je ziet dus een lichter, hoekig blok achter de twee pillen. De oorzaak: de reset `backdrop-filter:none!important` (`menu1.css:63`) staat alleen in `@media (min-width:1024px)`. *Fix:* voeg in het portretblok (`menu1.css:660`) `-webkit-backdrop-filter:none!important;backdrop-filter:none!important` toe. Dat haalt ook één blur van het budget af.
2. **P1. De bovenrand is druk en wijkt af van Menu 1.** Linksboven staan twee rijen bediening (tellers en Schoolblad/Schoolkaart–Reliëf), tegen het noordwesten van Italië aan (pin 8 en pin 6 zitten er op 768 vlak naast). Rechtsboven is leeg (x 600–794), en rechtsonder onder de knop staat ±220 px leeg. *Fix:* zet de tellers rechtsboven (top 16, right 20), zoals in het contract, liggend en Menu 1, en `--v3-fit-left` terug op 0. Zet de schakelaar Schoolblad/Schoolkaart–Reliëf in het vrije blok, 24 px onder de primaire knop.
3. **P1. De onderste marge is 12 px.** De lijst eindigt op 1068/1080 (768: 1012/1024), terwijl het iPad-frame 20 px vraagt. *Fix:* geef de inhoudskolom `padding-bottom:20px`. Dat kan, omdat er nog 8 px lucht zit tussen de kaart (0,51) en de ondergrens 0,45.

### Hoofdstukpagina
1. **P1. Het vrije blok is naar de onderrand geduwd.** Op het overzicht staat de knop 23 px onder de voortgangsbalk, hier 66 px. De knop eindigt op 1068 (12 px marge), en "← Hoofdstukken" eindigt op een andere hoogte (1052) dan "Aanwijzen" (1068). Daarboven staat een lege band van ±90 px tussen Sicilië en het lessenblok. *Fix:* lijn het vrije blok uit op de bovenkant van de lessenkaart (`align-self:start`), gebruik 24 px tussen de balk en de knop zoals op het overzicht, en zet de onderranden van beide knoppen gelijk op H − 20.
2. **P2. Een hoofdstuk heeft nog geen "gezicht".** Dat het artwork verborgen is, is goed. Op het overzicht zou wel één regel uitleg onder de titel helpen ("6 steden in het noorden", 16/500, `--m1-ink2`), zodat het vrije blok niet alleen uit een label en een titel bestaat.

### Oefenen
1. **P2. De paneelmarges zijn 16 px rechts en 14 px onder, het frame vraagt 20.** *Fix:* gebruik `right:20px; bottom:20px` voor `.v3OefPanel` in portret. Dat geldt ook voor Toets.
2. **P2. De kaart staat links-boven in zijn vlak.** Rechts van de hak blijft ±150 px leeg. *Fix:* centreer Italië horizontaal in het kaartvlak (zelfde `fit`-berekening, `resL = resR`).

### Toets (instellen)
1. **P2.** Goed: chips in vijf kolommen, startknop in beeld, kaart 46% van de hoogte. Alleen de marges (16/14 → 20) zoals bij Oefenen.

### Toets (resultaat)
1. **P2. De compositie zakt in.** De scorekaart is klein, linksboven. Italië beslaat maar ±40% van de hoogte en de onderste ±240 px (840–1080) zijn leeg. De knoppenrij Kopieer/E-mail/Print (tot x 592) is smaller dan "Nieuwe toets" (tot 753). *Fix:* laat het kaartvlak doorlopen tot ±62% van de hoogte en zet de acties onderaan (bottom 20). Laat de drie secundaire knoppen dezelfde breedte vullen als de primaire knop (`grid-template-columns:repeat(3,1fr)`).

### Beloningen
1. **P1. Een derde van het scherm is leeg en Nino ontbreekt.** Er staan twee kolommen (geen kolom zoals in het contract), de inhoud eindigt op y ≈ 712 en de rest is achtergrond. Voor een kind is dit hét feestscherm. *Fix:* zet de juichende Nino (hetzelfde master-asset als liggend, ±260 px hoog) linksonder onder "Open Reisboekje", of kies voor de contractvorm in één kolom: boek + knop, dan de tellerkaart, dan pizza/Vespa, met Nino naast het boek. Blijven het twee kolommen, centreer de inhoud dan verticaal.
2. **P2.** Het label "BELONINGEN" staat linksboven los van de kolommen. Lijn het uit op de linkerkolom (x 92 → de linkerrand van het boek) of laat het vallen, want de rail toont het al.

### Voortgang (paspoort open)
1. **P2. Achter de kaart staat een harde rechthoek.** De buurlanden-laag is afgesneden op 237–650 × 148–645 en de rand is zichtbaar, ook liggend. Dat botst met "variant Eiland, zwevend". *Fix:* geef de buurlanden-laag een `mask-image` (radiale fade, 85% → 0) of knip hem af op de kaartkaart.
2. **P2. De tegels Dagdoel/Pizza's/Vespa-ritten** zijn 110 px hoog, met het icoon links bovenaan en de waarde onderaan. Rechts blijft veel leeg, en liggend zijn het compacte pillen. *Fix:* zet icoon en waarde op één regel (hoogte 64, icoon 40, waarde 20/600), zoals de tellerpillen.
3. Paspoort openklappen, de lijst over de volle breedte en scrollen van de pagina (niet van de lijst) werken goed.

### Les en lesresultaat
1. **P1. Het antwoordblad hangt buiten de kaart.** `#focusAnswerSheet` loopt van 193 tot 713 en eindigt op y 1068. De kaart loopt van 132 tot 754 en eindigt op 1036. Het blad steekt dus 32 px onder de kaart uit, raakt de framerand en staat 10 px uit het midden. *Fix:* in portret `left/right` gelijk aan de kaart plus 16 en `bottom` = kaartonderkant − 16, zodat het blad binnen de kaartkaart zweeft. Op 768 geldt hetzelfde (eindigt op 1012 bij een kaart tot 980).
2. **P2. Het lesresultaat staat bovenin en de onderste 40% is leeg.** Het statlabel "oefenmomenten in deze ronde" breekt over twee regels. *Fix:* centreer de kaart verticaal in het inhoudsvlak en kort het label in tot "oefenmomenten".
3. **P2. In de lesbalk staan nu twee kale iconen naast elkaar** (potlood = Namen schrijven, document = Schoolblad). Geef het lesicoon dat nog niet actief is een tooltip, en geef Schoolblad op ≥ 800 px breedte het label terug als dat past (er is ±60 px ruimte tussen het potlood en de teller).

### Instellingen
1. **P2 (bestaat al, ook liggend).** Hoekige knoppen (Zee/Toscane/Meer/Wisselen en "Naam en favoriete pizza", radius 0) naast pillen in de rest van de app, en een standaard browser-▶ bij "Alleen een onderdeel wissen". *Fix:* geef ze radius 14 (zoals de chips) en een eigen chevron (`summary::marker{content:none}`). Dit is geen portretprobleem.

### Uitleg (?)
1. **P2.** Het modaal scrolt intern, maar de volgende kaart wordt hard afgesneden. *Fix:* een fade van 24 px onderaan het scrollvlak, zodat zichtbaar is dat er meer komt.

## Gevonden buiten de portretscope (wel melden vóór G3)
- **P1. Pin 2 is onzichtbaar in `#afgerond` en `#alles`, portret én liggend.** `city2` en `countries` krijgen dezelfde plek (810: 527,333 tegen 526,332; 1080: 668,416 tegen 666,415). Pin 9 ligt dus precies op pin 2. In `#afgerond` raken ook de koppen van 11 en 9 elkaar. Als oorzaak vermoed ik dat de `clear()`-vermijding in `drawMarkers` (`reis.js:254`) terugvalt op `best` zonder geldige kandidaat en dezelfde kandidaatplek kiest. *Fix:* sluit een plek uit die al gekozen is (tipafstand < 34·k) vóór de fallback, en voeg een QA-check toe: geen twee pinkoppen < 30 px uit elkaar, in alle staten.
- P2: pin 3 springt bij het draaien van de iPad van Sardinië (liggend) naar de Adriatische kust (portret). Dat is functioneel juist (beide plekken horen bij het hoofdstuk), maar voor het kind is het onrustig. Geef dezelfde voorkeursplek als die in beide oriëntaties vrij is.

## Wat een topdesigner als eerste zou veranderen
De onderste helft van elk portretscherm "afmaken". Overzicht, hoofdstuk, toetsresultaat, Beloningen en lesresultaat hebben allemaal een lege of slordige onderrand (12 px marge, of 240–360 px niets). Eén regel voor portret (inhoud eindigt op H − 20, het vrije blok hangt aan de bovenkant van zijn buur, lege ruimte gaat naar de kaart of naar Nino) maakt het geheel rustiger. Daarna komen de tellers rechtsboven, zodat de bovenrand weer leest als Menu 1.

# BL-039.5 Losse iconen: rand-rand-regel (Dennis 20-11)

Vervangt de 40-px-regel uit `BL-037-iconen.md`. Regel: een los icoon (`related:false`) ligt met de rand van zijn cirkel (icoon + 6 px) minimaal **12 px** van de rand van elk doel van het hoofdstuk: de zichtbare speld van een stad (stip/pin), de omtrek van een gebied of de rand van een rivierlijn. Nooit op een doelvorm of -lijn. Hetzelfde losse icoon mag in meerdere hoofdstukken terugkomen. Gekoppelde iconen (`related:true`) staan bij hun eigen doel (bij een gebied er direct naast, nooit erop).

Gemeten met `node scripts/qa-v3-icons.mjs` op 1440×900, 1080×810 en 810×1080 (kleinste waarde over de drie maten, hoofdstukpagina). Runtime (`scripts/v3/landmarks.js`, drempel 12,3 px), buildcontrole (`scripts/build-v3-preview.mjs`, 38 kaarteenheden tot een stad) en QA-meting (drempel 11,5 px voor afronding) gebruiken dezelfde maat. Gekoppelde iconen: afstand n.v.t. (staan bij het doel).

| Hoofdstuk | Icoon | Gekoppeld/los | Plek | Waarom | Kleinste rand-rand |
|---|---|---|---|---|---|
| Steden 1–6 | Trulli | gekoppeld | Bari | Trulli staan in Puglia | n.v.t. |
| | Dom (Florence) | gekoppeld | Florence | Dom staat er | n.v.t. |
| | Dom (Milaan) | gekoppeld | Milaan | Dom staat er | n.v.t. |
| | Vesuvius | gekoppeld | Napels | Ligt bij Napels | n.v.t. |
| | Fiat 500 | los | Turijn | Fiat komt uit Turijn; geen doel hier | 27,6 px |
| Steden 7–12 | Scheve toren | gekoppeld | Pisa | Staat in Pisa | n.v.t. |
| | Colosseum | gekoppeld | Rome | Staat in Rome | n.v.t. |
| | Gondel | gekoppeld | Venetië | Gondels in Venetië | n.v.t. |
| | Trulli | los | Alberobello | Landmark; Bari is geen doel | 159,2 px |
| | **Strand** | los | Pescara (Adriatische kust) | Kust ver van alle doelen | 33,5 px |
| Steden 13–18 | Etna | gekoppeld | Catania | Voet van de Etna | n.v.t. |
| | **Stadion** | los | Stadio Olimpico, Rome | Rome is hier geen doel | 59,4 px |
| | **Strand** | los | Gallipoli (Salento) | Kust ver van alle doelen | 30,6 px |
| | Fiat 500 | los | Turijn | Turijn is geen doel | 12,5 px |
| | Pasta | los | Bologna | Bologna is geen doel | 17,9 px |
| Steden 19–23 | Bergen | gekoppeld | Trente | Alpen/Dolomieten | n.v.t. |
| | Fiat 500 | los | Turijn | idem | 93,2 px |
| | Scheve toren | los | Pisa | Pisa is geen doel | 17,5 px |
| | **Strand** | los | Gallipoli | Kust ver van alle doelen | 90,4 px |
| | **Stadion** | los | Stadio Olimpico, Rome | Rome is geen doel | 37,3 px |
| Eilanden | Etna | gekoppeld | Sicilië (naast de vorm) | Etna ligt op Sicilië | n.v.t. |
| | Nuraghe | gekoppeld | Sardinië (naast de vorm) | Typisch Sardijns | n.v.t. |
| | Colosseum | los | Rome | Op het vasteland | 105,9 px |
| | **Ferrari** | los | Maranello | Op het vasteland, ver van beide eilanden | 177,3 px |
| | **Strand** | los | Rimini | Kust van het vasteland | 209,3 px |
| Bergen | Bergen | gekoppeld | Dolomieten, Apennijnen (naast de vorm) | Het zijn bergen | n.v.t. |
| | Fiat 500 | los | Turijn | Turijn is geen doel | 26,7 px |
| | IJsje | los | Palermo | Siciliaans ijs | 73,2 px |
| | **Strand** | los | Rimini | Kust | 12,9 px |
| Vulkanen | Vesuvius, Etna | gekoppeld | naast de vorm | De vulkanen zelf | n.v.t. |
| | Colosseum | los | Rome | Ver van beide vulkanen | 76,9 px |
| | Gondel | los | Venetië | idem | 250,1 px |
| | **Ferrari** | los | Maranello | idem | 227,4 px |
| Streken | Scheve toren | gekoppeld | Toscane, westkant (kant van Pisa) | Staat in Pisa | n.v.t. |
| | Dom (Florence) | gekoppeld | Toscane, zuidkant | Dichter bij Toscane (23–29 px) dan bij de Povlakte (87–107 px) | n.v.t. |
| | **Stadion** | los | Stadio Olimpico, Rome | Rome ligt buiten beide streken | 13,9 px |
| | Trulli | los | Alberobello | idem | 192,7 px |
| | Vesuvius | los | Napels | idem | 107 px |
| Rivieren | **Ferrari** | los | Maranello | Ten zuiden van de Po | 12,6 px |
| | **Strand** | los | Gallipoli | Kust ver van Po en Tiber | 211 px |
| | Trulli | los | Alberobello | idem | 162,4 px |
| | Nuraghe | los | Barumini, Sardinië | idem | 140,2 px |
| | IJsje | los | Palermo | idem | 168,5 px |
| Landen, Zeeën | geen | | | | |

Vet: nieuw ten opzichte van BL-037. Pasta bij Bologna alleen waar Bologna geen doel is; Ferrari ook niet in Steden 1–6/19–23 en Streken (Bologna, Modena of de Povlakte zijn daar doel). Strand/Rimini viel in Steden 13–18 en Rivieren (liggend/portret) weg door de botsingszoektocht; daar staat Strand bij Gallipoli of Pescara.

## Streken (restpunt)
Scheve toren staat aan de westkant van Toscane (Pisa), Dom van Florence aan de zuidkant. Meting (rand tot vorm): Dom 29/23/26 px tot Toscane en 107/87/102 px tot de Povlakte (1440/1080/810). Daarvoor kent de config nu `near:[lon,lat]` (zo dicht mogelijk bij dat punt) en `avoid:[gebied]` (dichter bij het eigen gebied dan bij het vermeden gebied); de runtime-zoektocht dwingt dat af.

## Punt 6: Zeeën en Landen
Niets gebouwd. De 55%-norm voor deze twee hoofdstukken vervalt (besluit Dennis 20-11); regel = zo groot mogelijk zonder overlap met titelblok, tellers en kaartknoppen (zo gebouwd in BL-037.8). Contract BL-037 punt 8 = PASS bij besluit.

## Meting
`node scripts/qa-v3-icons.mjs`, drie maten: 0 fouten, 45 iconen op de 9 hoofdstukpagina's (5 per hoofdstuk), geen icoon weggelaten, niet op een doelvorm of -lijn, labels van losse iconen alleen de naam, 0 iconen tijdens Aanwijzen/Namen/Slim rondje/Toets. Kleinste rand-rand-afstand los icoon-doel: 12,5 px (Fiat 500, Steden 13–18, 1080×810).

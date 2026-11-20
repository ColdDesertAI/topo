# BL-037.9 Iconregels (Dennis 20-11): per hoofdstuk

Regels: (a) bij een doel alleen als het er echt bij hoort (`related:true`, paar staat in `fits`); label bij hover/focus "Colosseum, Rome". (b) Niet-passend of zonder doel in dit hoofdstuk = LOS: echte lon/lat, nooit aan een doel gekoppeld, label = alleen de iconnaam, ≥ 40 px van elk doel. (c) Nooit op of over een doelvorm of -lijn (cirkel om het icoon wordt gemeten tegen de echte vorm). (d) Verborgen tijdens Aanwijzen, Namen schrijven, Slim rondje en Toets; zichtbaar op de hoofdstukpagina, in Oefenen/Ontdekken en op Reis.

"Gekoppeld" = aan een doel; bij gebied/rivier staat het icoon naast de vorm (zo dichtbij als kan), nooit erop. Landen en Zeeën: geen iconen (geen icoon past bij een land of zee zonder de vorm te raken of het antwoord te verraden).

| Hoofdstuk | Icoon | Gekoppeld of los | Plek | Waarom |
|---|---|---|---|---|
| Steden 1–6 | Trulli | gekoppeld | Bari | Trulli staan in Puglia (Alberobello), bij Bari |
| | Dom (Florence) | gekoppeld | Florence | De Dom staat in Florence |
| | Dom (Milaan) | gekoppeld | Milaan | De Dom staat in Milaan |
| | Vesuvius | gekoppeld | Napels | Vesuvius ligt bij Napels |
| | Fiat 500 | los | Turijn (Lingotto) | Fiat komt uit Turijn; Turijn is hier geen doel |
| Steden 7–12 | Scheve toren | gekoppeld | Pisa | Staat in Pisa |
| | Colosseum | gekoppeld | Rome | Staat in Rome |
| | Gondel | gekoppeld | Venetië | Gondels varen in Venetië |
| | Etna | los | Etna, Sicilië | Landmark; Catania is hier geen doel |
| | Trulli | los | Alberobello | Landmark; Bari is hier geen doel |
| Steden 13–18 | Etna | gekoppeld | Catania | Catania ligt aan de voet van de Etna |
| | Colosseum | los | Rome | Rome is hier geen doel |
| | Pasta | los | Bologna | Bologna staat bekend om pasta; geen doel hier |
| | Trulli | los | Alberobello | Bari is hier geen doel |
| | Fiat 500 | los | Turijn | Turijn is hier geen doel |
| Steden 19–23 | Bergen | gekoppeld | Trente | Trente ligt in de Alpen/Dolomieten |
| | Colosseum | los | Rome | Rome is hier geen doel |
| | Fiat 500 | los | Turijn | idem |
| | Scheve toren | los | Pisa | Pisa is hier geen doel |
| | Vesuvius | los | Vesuvius, Napels | Napels is hier geen doel |
| Eilanden | Etna | gekoppeld | Sicilië (naast de vorm) | Etna ligt op Sicilië |
| | Nuraghe | gekoppeld | Sardinië (naast de vorm) | Nuraghen zijn typisch Sardijns |
| | Colosseum | los | Rome | op het vasteland, ver van beide eilanden |
| | Pasta | los | Bologna | idem |
| | Gondel | los | Venetië | idem |
| Bergen | Bergen | gekoppeld | Dolomieten (naast de vorm) | Dolomieten zijn bergen |
| | Bergen | gekoppeld | Apennijnen (naast de vorm) | Apennijnen zijn bergen |
| | Fiat 500 | los | Turijn | ≥ 40 px van beide gebergten |
| | IJsje | los | Palermo | Siciliaans ijs; Sicilië is hier geen doel |
| | Nuraghe | los | Barumini, Sardinië | Landmark, ver van beide gebergten |
| Vulkanen | Vesuvius | gekoppeld | Vesuvius (naast de vorm) | Dit is de vulkaan zelf |
| | Etna | gekoppeld | Etna (naast de vorm) | Dit is de vulkaan zelf |
| | Colosseum | los | Rome | ≥ 40 px van beide vulkanen |
| | Pasta | los | Bologna | idem |
| | Gondel | los | Venetië | idem |
| Streken | Scheve toren | gekoppeld | Toscane (naast de vorm) | Staat in Pisa, in Toscane |
| | Dom (Florence) | gekoppeld | Toscane (naast de vorm) | Staat in Florence, in Toscane |
| | Colosseum | los | Rome | ≥ 40 px van de Povlakte en Toscane |
| | Trulli | los | Alberobello | idem |
| | Vesuvius | los | Vesuvius, Napels | idem |
| Rivieren | Etna | los | Etna, Sicilië | geen icoon hoort bij Tiber of Po; alle los, ≥ 40 px van beide lijnen |
| | Vesuvius | los | Vesuvius, Napels | idem |
| | Trulli | los | Alberobello | idem |
| | Nuraghe | los | Barumini, Sardinië | idem |
| | IJsje | los | Palermo | idem |
| Landen | geen | | | |
| Zeeën | geen | | | |

Bewust niet gebruikt: Ferrari (Maranello ligt te dicht bij Modena/Bologna/Verona/Pisa om overal 40 px vrij te blijven, en in Streken ligt het in de Povlakte; niet getest in elk hoofdstuk, wel kandidaat voor later), Stadion (geen logische eigen plek), Strand bij Rimini (viel in Steden 13–18 weg door de botsingszoektocht). Pasta bij Bologna staat alleen in hoofdstukken waar Bologna geen doel is (Steden 13–18, Eilanden, Vulkanen).

## Meting (scripts/qa-v3-icons.mjs, echte vormen, schermpixels)
`node scripts/qa-v3-icons.mjs` (en als onderdeel van `qa-v3-menu1.mjs`), 1440×900 / 1080×810 / 810×1080: 45 iconen op de 9 hoofdstukpagina's, 0 fouten. Kleinste afstand los icoon–doel 43,4 / 40,2 / 40,5 px (≥ 40). Geen icoon op een doelvorm of -lijn, geen weggelaten icoon, labels van losse iconen = alleen de naam, 0 iconen tijdens Aanwijzen, Namen schrijven, Slim rondje en Toets (opzet, vraag, resultaat); Ontdekken toont ze.

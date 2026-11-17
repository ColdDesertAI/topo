# BL-008 — TOPO V3 speeltest (groep 7)

**Doel:** zien of 2–3 kinderen van 10–11 jaar TOPO zelfstandig begrijpen, gebruiken en ermee leren. **Eén kind per sessie; 20 minuten per kind.** Dit is voorbereiding, **niet** de uitgevoerde speeltest (BL-010); los van BL-029.

## Vooraf (moderator, buiten de 20 minuten)

- Gebruik uitsluitend de **goedgekeurde V3-releasekandidaat na BL-029/G1**, niet automatisch de versie op `main` of de publieke site. Leg **URL/bestand, branch + SHA, datum, apparaat, browser en offline/online** vast op het observatieblad. `docs/v3/SPEC.md` en `docs/v3/OVERDRACHT.md` beschrijven de V3-kandidaat; integratie naar `main` kan achterlopen.
- Controleer op deze exacte build vóór deelname: kennismaking/Reis, 11 hoofdstukken, 45 leerplekken, Les **Ontdekken → Aanwijzen → Namen schrijven**, foutfeedback en verdergaan, Voortgang, Beloningen/Reisboekje (pizza, Vespa, stempels), Gouden proef/Gold, Schoolkaart en Schoolblad. **Gold is een extra check, geen verplicht 20-minutendoel.** Noteer **aanwezig / niet aanwezig / niet geverifieerd**. Laat een ontbrekende functie niet aan het kind testen; rapporteer als coverage-gap.
- Test met een **apart leeg testprofiel**, geen echte naam (gebruik bijvoorbeeld “Speler A”), zonder bestaande voortgang. Prepareer eventueel een **afzonderlijk, gedocumenteerd testprofiel met verdiende beloning** voor taak 7: noteer hoe de staat is gemaakt; geen onzichtbare ingrepen tijdens een kindtaak. Controleer dat de les en het beloningsprofiel bereikbaar zijn. Laat een kind nooit alle 45 plekken afwerken om een beloning te bereiken.
- Zet meldingen uit; gebruik schermopname **alleen met afzonderlijke expliciete toestemming**. Geen account of persoonsgegevens nodig. Test één keer desktop (muis/toetsenbord) en waar mogelijk iPad 9/Safari (touch, liggend); verdeel apparaten over kinderen. Op iPad: let op bedekte bediening, zoom en het toetsenbord.
- Offline: open een vooraf opgeslagen self-contained HTML **zonder netwerk** en bevestig vóór de sessie dat navigeren/antwoorden werkt. Als alleen een gehoste V3 beschikbaar is: **offline niet geverifieerd** noteren en apart laten testen, niet suggereren dat een website offline werkt.

## Moderatorscript: letterlijk en neutraal

**0:00–1:00 — welkom**  
“Dank je dat je TOPO probeert. We testen het programma, niet jou. Je mag alles proberen en hardop zeggen wat je denkt. Ik zal meestal niet helpen. Als je iets niet weet, is dat prima. Wil je stoppen, dan kan dat meteen. Klaar?”

**1:00–3:00 — starten en kiezen**  
“Open TOPO. Kijk wat je zelf zou doen.” Na ±30 seconden: “Kies een hoofdstuk waarmee je wilt beginnen.” **Observeer** kennismaking, route, vergrendelingen en eigen keuze; geef geen uitleg.

**3:00–6:00 — ontdekken**  
“Zoek uit waar de volgende plek ligt.” Vraag pas ná de poging: “Wat laat dit scherm jou zien?” **Observeer** Schoolkaart/Schoolblad, lezen, kaartoriëntatie en zelf volgende stap vinden.

**6:00–10:00 — aanwijzen**  
“Probeer de plek op de kaart aan te wijzen.” Bij een onjuist antwoord: “Wat zou je nu doen?” Laat herstel en doorgaan zien. **Geen hint over het juiste geografische antwoord.**

**10:00–13:00 — naam schrijven**  
“Ga verder en probeer de naam in te vullen.” Zo nodig: “Wat verwacht je dat er gebeurt als je dit invult?” **Observeer** toetsenbord, feedback, schrijfwijze, opnieuw proberen. Niet voorzeggen.

**13:00–16:00 — voortgang en beloning**  
“Kun je vinden hoe ver je bent?” Daarna: “Kun je zien wat je hebt verdiend?” Als nog niets verdiend is: “Waar zou je zoeken naar beloningen?” Gebruik het vooraf voorbereide beloningsprofiel **alleen indien nodig**, met expliciete overgang: “Dit is een voorbeeldspeler die al iets verdiend heeft; kun je het vinden?” **Observeer** begrip van hoofdstukvoortgang, Pizza/Vespa/Reisboekje; houd echt/verondersteld verdiend gescheiden.

**16:00–18:00 — volgende stap**  
“Wat zou je nu als volgende doen?” Daarna: “Wat denk je dat de gouden proef betekent?” Alleen als Gold zichtbaar is; anders **niet geverifieerd** noteren.

**18:00–20:00 — afsluiten**  
“Wat vond je gemakkelijk? Waar moest je zoeken of twijfelde je? Als je één ding mocht veranderen, wat zou dat zijn?” Bedank het kind. Geen cijfers geven, geen aanwijzingen achteraf als 'goed antwoord' interpreteren.

**Moderatieregel:** wacht waar mogelijk 10 seconden bij twijfel; herhaal alleen de neutrale opdracht. Als het kind vastloopt: vraag “Wat zou je proberen?”; daarna maximaal één algemene hulp (“Je mag kijken waar je verder kunt”). Noteer **H1**. Is aanwijzen van een knop noodzakelijk, noteer **H2**. Leg vast of het kind daarna zelfstandig herstelt. **Niet stiekem coachen.** Als kennis ontbreekt: zeg “Je mag gokken of overslaan”; classificeer later, niet ter plekke.

## Rotatie extra geografische checks (alleen wanneer passend)

De basisroute blijft voor ieder kind gelijk. Voeg maximaal **één** gerichte check per kind in plaats van een andere aanwijsvraag toe; **geen geforceerde dekking in 20 minuten**.

| Kind | Optionele focus | Observeer zonder de oplossing te geven |
| --- | --- | --- |
| A | Rome / Vaticaanstad; overlappende stippen | Kan het kind de bedoelde plek onderscheiden? Begrijpt het een keuze zoals “Stip 1/2”? |
| B | Toscane / stad; Povlakte / rivier de Po | Snapt het kind het soort object en de kaartvorm, of is het antwoord een kennisvraag? |
| C | Apennijnen / geografische positie; andere dichtbije markers | Is het gebergte te vinden zonder misleidende vorm of raakvlak? |

Als een focusitem niet in een bereikbare fase zit: overslaan en **niet getest** noteren. Niet de voortgang of volgorde van de app forceren.

## Observatie en interpretatie

- Per taak: **Z** zelfstandig, **H1** algemene hulp, **H2** knop/route aangewezen, **N** niet voltooid, **NT** niet getest; leg aarzeling, fouten en **herstel** apart vast. Een fout antwoord is niet vanzelf een UX-fout.
- Classificeer: **UX** (interface/route onduidelijk), **KENNIS** (inhoud nog niet geleerd), **GEO/BEOORDELING** (verkeerde vorm, hit target of onjuiste goed/fout-feedback), **TECH** (crash, niet reagerende bediening, opslaan/laden); gebruik **ONBEKEND** tot reproduceerbaar. Noteer verwacht versus werkelijk, exacte item/hoofdstuk/fase, input, device en build.
- Privacy: vooraf ouder/verzorger én kind informeren en toestemming vragen conform lokale schoolafspraken; deelname vrijwillig, zonder consequenties. Gebruik participantcodes A/B/C, geen namen of andere identificerende gegevens. Zonder toestemming **geen audio/video/foto**. Bewaar alleen minimale notities in afgeschermde projectomgeving, spreek vooraf een korte bewaartermijn en verwijderdatum af; geen publicatie van kindgegevens of opnames in GitHub/PR. Stop bij ongemak.

**Output:** één ingevuld `OBSERVATION_SHEET.md` per kind (buiten Git met kindgegevens), samenvatting van reproduceerbare findings en aanbeveling conform `RELEASE_ACCEPTANCE.md`. Onafhankelijke reviewer beoordeelt waar mogelijk UX, leren en engineering; markeer review anders open.

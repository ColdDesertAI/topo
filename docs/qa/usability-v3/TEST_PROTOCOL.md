# BL-008 — speeltest TOPO V3 (groep 7)

**Doel:** begrijpen kinderen van 10–11 jaar zelfstandig wat ze kunnen doen, hoe ze verdergaan en wat ze leren? Test 2–3 kinderen **afzonderlijk, circa 20 minuten per kind**. Geen cijfer voor het kind. Dit is testvoorbereiding; er zijn nog geen kinderen getest.

Voer de kinderronde pas uit na **BL-029 G1**, zoals afgesproken in de opdracht. Controleer daarnaast de actuele releasevoorwaarden met de eigenaar; [BL-010 in de backlog](../../../ops/BACKLOG.md) noemt BL-004. Dit pakket geeft geen releaseakkoord en wijzigt die taken niet.

## Voorbereiden (volwassene, buiten de 20 minuten)

- Print één [observatieblad](OBSERVATION_SHEET.md) per kind. Gebruik codes K1–K3. Eén moderator; eventueel één stille observator. Kinderen kijken niet bij elkaar mee.
- Noteer kandidaat-commit, exacte URL/bestandsnaam, buildtype, apparaat, OS/browser, invoer en online/offline. Controleer dat je **V3** opent: de bron-`index.html` is V2. Bouw lokaal zo nodig met `npm run build:v3`; resultaat `output/html/TOPO-V3-Italie.html`. Geen deploy nodig.
- Gebruik alleen wegwerp-testprofielen/browseropslag. Bewaar of reset nooit de voortgang van een echt kind. Open een frisse profielcontext **A** voor de eerste kennismaking. Geen uitleg vooraf over knoppen, kaart, cijfers of beloningen.
- Bereid context **B** op dezelfde kandidaat voor met een volwassen testprofiel: speel via de gewone interface tot **Eilanden ontgrendeld maar nog niet gestart** is. Dit hoofdstuk heeft twee objecten en past als korte complete route. Bewaar via de bestaande reservekopiefunctie en herstel vóór elk kind; oefen dat vooraf. Ook nodig: een afgerond hoofdstuk zonder goud, bestaande pizza/Vespa-rit en een stempel in het Reisboekje. Gebruik zo nodig aparte volwassen reservekopieën; noteer welke. Bewerk geen opslag of app-code.
- Controleer in B vooraf Ontdekken → Aanwijzen → Namen schrijven, foutfeedback/herhaling, afronding/stempel, Verdien goud, Voortgang en Beloningen. Noteer een beloning vlak vóór een echte volgende beloning als die vanzelf binnen de taken kan vallen. **Geen beloning of fout uitlokken om de klok te halen.** B toont bestaande verdiensten van een testprofiel, geen prestaties van het kind.
- Bereid voor de extra checks een testprofiel met de benodigde hoofdstukken open. Bij ontbreken van een bruikbare reservekopie kan de bestaande **demo-preview** (`node scripts/build-v3-preview.mjs`, `#afgerond` of `#alles`) alleen dienen voor herkenning van bestaande schermen. De demo bewaart niets; gebruik hem nooit als bewijs van verdienen, opslag of offline herstart. Markeer ontbrekende echte flow als **niet getest**.
- Offline: download de volledige zelfstandige V3-release-HTML en controleer vooraf op het doelapparaat openen zonder netwerk, een antwoord geven, herladen en voortgang terugvinden. Een eerder geopende website bewijst geen koude offline start. Is de bestandsroute op iPad niet bruikbaar, noteer dat als beperking; beloof geen PWA/cachewerking.

### Apparaat en toegankelijkheid

Gebruik bij twee kinderen één desktop met muis/toetsenbord en één **fysieke iPad 9/Safari**, bij drie het derde kind op het apparaat met de grootste onzekerheid. Leg de werkelijke versie vast; [SPEC](../../v3/SPEC.md) noemt 1080×810 pt als iPad-ondergrens. Emulatie is geen fysieke iPad-test.

Laat kinderen hun gewone bril, zoom of andere hulp gebruiken; noteer dit zonder diagnose. Observeer op iPad kaart/sheet, bereikbaarheid van de plek, toetsenbord over invoer/feedback en gewone vingertikken. Op desktop: focus, Enter en eventueel Tab bij een kind dat dat zelf gebruikt. Vraag geen kunstmatige toetsenbordtest. Onderbreek alleen bij blokkade; verklaar een klein, afgesneden of onbereikbaar doel niet aan het kind. Een formaatwissel is een extra check, geen verplichting voor ieder kind.

### Toestemming en privacy

Regel vooraf toestemming van ouder/verzorger volgens de schoolafspraken en vraag ook het kind of het wil meedoen. Deel doel, duur, vrijwilligheid en gebruik van de aantekeningen. Zeg dat stoppen altijd mag. Gebruik een verzonnen naam in TOPO. Geen echte naam, school, geboortedatum of contactgegevens op het blad of in Git/PR/issues. Maak standaard alleen korte anonieme notities; geen camera, audio of schermopname. Alleen apart afgesproken opnames met expliciete toestemming van ouder én kind. Bewaar toestemming apart van observaties, beperkt toegankelijk. Spreek vóór de ronde een verwijderdatum en verantwoordelijke af; deel alleen geanonimiseerde bevindingen. Stop direct bij ongemak of intrekken van toestemming.

## Moderator: letterlijk zeggen en vervolgens observeren

**Opening:** “We proberen TOPO uit, niet jou. Je hoeft de antwoorden nog niet te weten. Gebruik het zoals jij wilt. Vertel af en toe wat je denkt. Je mag altijd pauzeren of stoppen.”

Lees alleen de taak uit de tabel. Geen demonstratie, wijzen, knopnaam of compliment dat een keuze bevestigt. Vraag na een handeling hoogstens: **“Wat verwachtte je?”**, **“Wat gebeurde er?”**, **“Wat zou je nu doen?”** Stel vragen niet midden in het nadenken. Bij “Is dit goed?”: **“Wat denk jij?”** Bij een onbekende naam: **“Wat zou je doen als je het nog niet weet?”**

Noteer aarzeling vanaf circa 10 seconden zonder doelgerichte actie, herhaald proberen, verkeerd begrip en herstel. Wacht bij vastlopen maximaal circa 30 seconden; langer alleen als het kind zichtbaar vooruitkomt en wil doorgaan. Dit zijn observatiemomenten, geen prestatienormen.

**Hulp vastleggen:** H0 = geen hulp; H1 = taak één keer neutraal herhalen; H2 = richting/bediening uitleggen; H3 = voordoen/overnemen. Vraag na 30 seconden: “Wil je nog proberen, of zal ik helpen?” Geef na H1 zo nodig de kleinste H2, noteer exact wat je zei/deed. H2/H3 betekent niet zelfstandig voltooid. Een feitelijk antwoord geven is **K-hulp**, apart van interfacehulp; beoordeel daarna alleen de bediening als geholpen. Bij frustratie stoppen of overslaan, geen herhaalde faalpogingen.

## De 20 minuten (vaste eindtijden)

| Tijd | Taak — letterlijk voorlezen | Observeren / korte neutrale vraag achteraf |
| --- | --- | --- |
| 0–2 | Opening. **T1:** “Open TOPO. Kijk wat je ermee kunt doen en begin.” | Begrijpt kennismaking, overslaan en eerste actie? De release kan na overslaan nog eenmaal kennismaking aanbieden. Laat het kind kiezen. “Wat denk je dat je hier gaat doen?” |
| 2–4 | **T2:** “Kies een hoofdstuk waarmee je wilt beginnen.” | Beschikbare keuze, slot en starten. Frisse Reis heeft alleen Steden 1–6 open; een slot proberen is geen fout antwoord. “Wat verwacht je bij dit hoofdstuk?” |
| 4–6 | **T3:** “Ontdek een plek. Vertel wat je over die plek ziet en ga verder als je klaar bent.” | Naam bij kaartplek, ontdekken versus vragen beantwoorden. Laat eerst de echte eerste ervaring in A zien. |
| 6–11 | Schakel aangekondigd naar B: “Dit is een oefenprofiel waarop al eerder is gespeeld.” **T3 vervolg:** “Kies Eilanden en ontdek de plekken.” **T4:** “Ga verder met leren en wijs de gevraagde plek aan.” **T5:** “Ga verder en schrijf de naam van de aangegeven plek.” | Volledige korte route met twee objecten: ontdekken, juiste plek selecteren, zelf typen/indienen, feedback, stapovergang en afronding. De opgegeven hoofdstukkeuze in B telt niet als onafhankelijke T2. Geen aanwijzingen over stapknoppen. “Wat vraagt TOPO nu van je?” |
| 11–13 | **T6:** Bij een natuurlijke fout: “Ga verder zoals je dat zelf zou doen.” | Begrijpt goed/fout, juiste antwoord, verdergaan en later terugkerende fout? Laat herstel gebeuren. Zonder natuurlijke fout: zeg “We proberen nu expres een ander antwoord om te zien wat TOPO doet. Ga daarna verder.” Markeer **uitgelokte fout**; dit is alleen herstelbewijs, geen spontane fout of kennismaat. Kijk of het kind een eerder gemiste naam later weet. |
| 13–15 | **T7:** “Zoek uit hoe ver je bent met dit hoofdstuk. Wat kun je al, en wat kun je nog doen?” | Kan voortgang/stempel en volgende stap uitleggen? Onderscheid lesteller met herhalingen, hoofdstuk af en beheersing van 45 plekken. Geen eis dat één les de 45-teller verhoogt. Laat in B ook een afgerond hoofdstuk zien: “Wat zou je doen als je dit nog een keer moeilijker wilt proberen?” Observeer **Verdien goud/Gouden proef**, probeer één vraag en keer terug; volledige gouden proef hoeft niet. Geef pas na de observatie toegangshulp als nodig. |
| 15–18 | **T8:** “Zoek wat op dit oefenprofiel is verdiend. Wat betekent het en waar vind je het terug?” | Pizza/stukjes, Vespa-ritten, stempel/goud en Reisboekje vinden, openen, bladeren en sluiten. “Wat zou er gebeuren als je verder leert?” Bestaande beloningen herkennen ≠ zelf verdienen. Daarna maximaal één toegewezen extra check hieronder (circa één minuut). |
| 18–20 | **T9:** “Wat zou je de volgende keer gaan doen? Laat zien waar je begint.” Daarna: “Wat was lastig? Wat heb je over een plek geleerd?” | Concrete vervolgactie, terugvinden van een stap/hoofdstuk; één eigen uitleg over een eerder ontdekte plek. Geen leertoets of bewijs van langdurig onthouden. Bedank, sluit af op minuut 20. |

**Tijdbewaking:** stop elk blok bij de eindtijd. Bij uitloop sla eerst de extra check over. Blijft een fase onbereikbaar, schakel buiten de beoordeling naar een vooraf gecontroleerde reservekopie op die fase en noteer de overgang. Niet uitgevoerde taken en niet waargenomen herstel blijven **NT**, nooit geslaagd. Een volwassen profielwissel is setup; door de moderator uitgevoerde navigatie binnen een taak is H3. Geen kind hoeft 45 objecten of 11 hoofdstukken af te maken.

## Extra checks verdelen (niet allemaal per kind)

Deze checks volgen pas na de basisroute, op het voorbereide profiel. Gebruik de bestaande hoofdstukherhaling of Oefenen; noteer modus en feitelijk verschenen vraag. Door de geschudde volgorde: niet blijven zoeken als de minuut voorbij is. Niet verschenen = NT, later gericht testen.

| Kind | Extra opdracht (alleen als bereikbaar) | Waarop letten, zonder het antwoord vooraf te vertellen |
| --- | --- | --- |
| K1, desktop | “Zoek Rome en daarna Vaticaanstad op de kaart.” | Steden 7–12 / Landen of Oefenen. Begrijpt het kind bij overlap “Welke plek bedoel je?” en de koppeling van nummer naar plek? Vindt het terugweg? Nummers zijn selectiehulpen, geen te leren schoolcodes. |
| K2, iPad | “Zoek Toscane en daarna de Povlakte.” Vraag na selectie: “Wat voor plek is dit?” | Streken: Toscane is een regio, geen stad; Povlakte is een gebied, niet rivier de Po. Vergelijk zo nodig Po in Rivieren, zonder te suggereren dat de keuze fout was. Observeer vlakselectie/kiezer; kennisonzekerheid apart noteren. |
| K3, bij drie kinderen | “Zoek de Apennijnen op de kaart.” Daarna: “Probeer hier verder te leren zonder internet.” | Bergen: ligging langs het schiereiland, geen stadspunt. Moderator schakelt netwerk uit op de vooraf gecontroleerde bestandsroute; kind doet één antwoord/volgende actie. Noteer daadwerkelijk offline en terugkeer. Dit bewijst geen offline herstart. |

Bij twee kinderen: combineer Apennijnen met de volwassen voorbereiding; laat offline bij K2 de extra geografiecheck vervangen als dat het grootste risico is. Alle overige niet uitgevoerde kindchecks blijven expliciet NT. Offline koude start/herladen blijft altijd een volwassen controle buiten de sessie. Bied daarna geen tweede apparaat aan hetzelfde kind aan als onafhankelijke eerste ervaring.

## Basis en beperkingen van dit pakket

Gecontroleerd tegen `origin/main` **3c852fffcadcc41e8b9d8cead0d85f9689271ea3** (17 november 2026), niet tegen Claude's lopende werk. Bronnen: [SPEC](../../v3/SPEC.md), [overdracht](../../v3/OVERDRACHT.md), [lesbewijs](../v3-les/README.md), [voortgang](../v3-voortgang/README.md), [toets](../v3-toets/README.md), [route-engine en tests](../../../scripts/route-engine.test.mjs), [V3 Reis](../../../scripts/v3/reis.js) en [canonieke items](../../../src/v2/data/items.js).

De 45 objecten zijn verdeeld over 11 hoofdstukken: vier stedengroepen (6/6/6/5), Eilanden 2, Bergen 2, Vulkanen 2, Streken 2, Landen 7, Zeeën 5, Rivieren 2. De route is Ontdekken → Aanwijzen → Namen schrijven; daarna kan goud. De gewone tab **Toets** is een andere flow en geeft geen pizza's; geen volledige toets in deze sessie. Vooraf controleren op de uiteindelijke kandidaat: profielvoorraad, exacte labels, gouden proef, beloningsmomenten en offline bestandsroute. Beschikbaarheid in bron/tests is geen kindobservatie. Fysieke iPad, langdurig leereffect en de nog niet geleverde BL-029-versie zijn hiermee niet bewezen.

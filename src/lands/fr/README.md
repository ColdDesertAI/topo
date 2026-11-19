# FR-01 — Frankrijk, concept voor groep 7

**Status: draft.** 40 items, 11 concepthoofdstukken. Alleen inhoudelijke data: geen geometrie, kaartcoördinaten, app-code, beoordelaar of runtime-integratie. `items.draft.json` bevat id, type, Nederlandse/Franse naam, expliciete aliassen en per item een bron-URL met vindplaats. `route.draft.json` bevat alleen de geordende hoofdstukken en verwijzingen naar die IDs.

Basis: `ColdDesertAI/topo` main `8ad5002`. Gelezen: AGENTS.md en ARCHITECTUUR §3 op `arch/v3-runtime` commit `75263a72a4c629f6a6f4c82258ef0186716e081d` (dat document ontbreekt nog op main). Het landpakket bevat namen/items/hoofdstukken; de kern blijft verantwoordelijk voor gedrag en opslag. Er is nog geen runtime-manifest toegevoegd omdat dit uitsluitend conceptinhoud is.

## Hergebruik en verschillen

Vergelijking met `land/fr-inhoud` **`dc46b20bd77a63ab07abe864ec530ee0be7fbab7`**, `data/fr/items.draft.json` (44 items):

- **35 items overgenomen**, met dezelfde ids en dezelfde Nederlandse en Franse namen. Alle 35 Nederlandse namen en categorieën zijn opnieuw tegen het bestaande schoolblad gecontroleerd; de bronfoto heeft de SHA256 die in het bestaande concept vermeld stond. De Franse vertalingen zijn uit de branche overgenomen en als zodanig benoemd.
- **9 landen niet opgenomen**, omdat de opdracht alleen `stad/rivier/gebergte/water/regio/eiland` toestaat: Andorra, België, Duitsland, Groot-Brittannië, Italië, Luxemburg, Monaco, Spanje en Zwitserland. Ze zijn niet fout en niet omgedoopt tot regio's; ze blijven ongewijzigd in de bronbranch en kunnen na een expliciete type-uitbreiding weer worden opgenomen. De opdrachtgever is om de gewenste keuze gevraagd; dit concept volgt voorlopig de zes opgegeven types.
- **5 conceptsteden toegevoegd:** Amiens, Dijon, Grenoble, Orléans en Reims, ieder met bronverwijzing naar de Frankrijk-toetslijst van TopoSite voor groep 7. Dit zijn geen aanvullingen op een reeds goedgekeurde schooltoets: het originele vak Extra steden is leeg. De nieuwe taak vraagt een concept van 40–60 items; de toevoegingen zijn daarom expliciet gemarkeerd voor inhoudelijke review.
- **6× `zee` → `water`**, uitsluitend om het type uit de opdracht te volgen. Rivieren blijven `rivier`; Golf van Biskaje, Nauw van Calais en Het Kanaal zijn dus geen rivieren.
- **Aliassen:** `LeHavre` en `Kanaal` behouden. `Rijsel` toegevoegd bij Lille; de schoolatlas-opdrachtenlijst van Cielen noemt letterlijk Lille (Rijsel). Franse vertalingen zoals Paris, Strasbourg en Meuse worden niet stilzwijgend als antwoordvariant toegevoegd.
- De oudere tekst bepaalt een eigen strikt accentbeleid met een categorie ‘bijna’. Dat is **niet overgenomen als landlogica**: FR-01 levert correcte namen en expliciete naamvarianten. Normalisatie en beoordeling horen volgens ARCHITECTUUR in de gedeelde kern; deze data wijzigt de huidige app niet.
- **Route:** de eerste drie stedenblokken en de blokken Eiland/gebergten, Zeeën en Rivieren blijven qua inhoud gelijk. De twee landenhoofdstukken vervallen. Er komt één hoofdstuk met vijf conceptsteden; de vijf bestaande streken worden verdeeld in west (3) en oost/zuid (2). Zo blijven het 11 hoofdstukken met 2–5 items. Dit is een nieuw concept, geen vervanging van het eerder goedgekeurde schoolblad.
- Dordogne blijft **streek**, niet rivier. Elzas, Provence, Bretagne en Normandië zijn hier school-/landstreken; ze worden niet voorgesteld als de huidige administratieve indeling van Frankrijk.

## Bronnen en grenzen

1. [Oorspronkelijk schoolblad op vaste commit](https://github.com/ColdDesertAI/topo/blob/dc46b20bd77a63ab07abe864ec530ee0be7fbab7/docs/v4/bron/IMG_0802.HEIC). Elke overgenomen entry noemt de exacte kolom/het kopje/de code. School en methode zijn niet op het blad vermeld. De foto is niet opnieuw gebundeld.
2. [TopoSite: Topografie Groep 7 — Frankrijk](https://www.brujon.net/topo/eu-frankrijk.htm). De vijf nieuwe steden staan in de opgesomde toetsinhoud. Het is een zelfstandige educatieve oefenlijst, geen bindende landelijke SLO-lijst.
3. [Cielen: Aardrijkskunde Europa, vijfde klas, p.22](https://www.cielen.eu/aardrijkskunde-5e-klas-werkboek-voor-kinderen.pdf#page=22), schoolatlas-opdrachtenlijst voor de aanvullende naamvariant Rijsel. Deze oude bron wordt alleen voor de plaatsnaam gebruikt, niet voor huidige grenzen of politieke informatie.

Controle op 15 november 2026. De bronverwijzingen en hashes staan ook in het JSON. Er zijn geen kaarten, afbeeldingen, werkbladen of teksten uit de bronnen gekopieerd: uitsluitend plaatsnamen, classificatie en verwijzingen. De gebruiker kiest uiteindelijk welke lijst de eigen school moet volgen; de twee nieuwe streekblokken, vijf aanvullingen en de uitsluiting van landen blijven expliciet **concept**.

## Controle

JSON parseert; 40 unieke ids; alle zes types vertegenwoordigd (19 steden, 6 rivieren, 3 gebergten, 6 wateren, 5 regio's en 1 eiland); 11 hoofdstukken; ieder item precies eenmaal opgenomen; alle itemverwijzingen bestaan; ieder item heeft een bron-URL en vindplaats; geen geometrie of code. Namen/ids/typen/aliassen zijn ook vergeleken met de vastgepinde bronbranch. Er is geen app-build of app-test nodig voor deze niet-geïntegreerde gegevens.

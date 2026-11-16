# Playbook: iPad-test V3.0 (Dennis)

## Doel
Test de V3.0 release-build op de iPad 9 in één sessie. Vink per rij OK of NOK af. De uitslag is, naast de Hermes-hertest (BL-004), de voorwaarde voor G3 (`docs/v3/SPEC.md` r.44, `docs/v3/OVERDRACHT.md` r.309).

## Vooraf
- **Apparaat (ondergrens):** iPad 9e generatie, 3 GB RAM, 1080×810 pt, iPadOS 26.7.2, Safari (`docs/v3/SPEC.md` r.39).
- **Tijd:** reken op ± 45–60 minuten. Is de tijd op, sla dan over in deze volgorde: C22, C18, C16, C2, C13, C15. Houd altijd C1, C3–C12, C14, C17 en C19–C21.
- **Build:** `npm run build:v3` (`package.json` r.22). Dat schrijft `output/html/TOPO-V3-Italie.html`, zonder demo-states en met echte browseropslag (`scripts/build-v3-preview.mjs` r.4–5 en r.139). Het bestand staat in `.gitignore` (r.5): het komt dus niet mee met een checkout en moet eerst gebouwd worden. Gebruik de demo-preview niet.
- **Pin:** noteer `git rev-parse --short HEAD` van de te testen build: `________`. Neem geen pin aan uit een oud verslag.
- **Route naar de iPad (op de Mac):**
  1. Haal de pin binnen en zet je eigen checkout erop: `git status --short` (stop als die niet schoon is), `git fetch`, `git switch --detach <pin>` (`docs/AFTERNOON_IPAD_BETA_2026-10-26.md` r.51–53). Na de test terug naar je vorige branch: `git switch -`.
  2. Bouw: `npm run build:v3`.
  3. Controleer eerst `lsof -i :8033`. Draait daar al iets, gebruik dan 8034 hieronder en in de URL. Serveer: `python3 -m http.server 8033 --directory output/html`. Laat dit draaien. Vraagt macOS of python3 inkomende verbindingen mag accepteren, kies Sta toe. Het commando lijkt op het script `dev` (`package.json` r.7), dat de repo-root op poort 8000 serveert, en op `docs/AFTERNOON_IPAD_BETA_2026-10-26.md` r.45.
  4. Zoek het IP van de Mac: `ipconfig getifaddr en1` (op een Mac mini is wifi meestal `en1` en de kabel `en0`; geeft dat niets, probeer `en0`).
  5. Open op de iPad in Safari: `http://<IP>:<poort>/TOPO-V3-Italie.html?v=<pin>` (poort 8033, of 8034). iPad en Mac zitten op hetzelfde wifi.
- **Alternatief (te controleren, stand 26-10):** toen draaide op de Mac mini een server op poort 8033 vanuit `~/Topo-iPad-Test`, IP 192.168.86.156 (`docs/AFTERNOON_IPAD_BETA_2026-10-26.md` r.45). Controleer of dat nog zo is met `ipconfig getifaddr en1` (wifi; de kabel is meestal `en0`). Bouw dan in `~/Topo-iPad-Test` (stap 1 en 2) en laat het draaiende proces staan: het serveert de nieuwe bestanden bij het volgende verzoek. Start geen tweede server op die poort (r.59).
- **Privévenster:** open de pagina in een privévenster (of met een testprofiel). Zo blijven er geen leerlinggegevens achter (r.59). Wis geen opslag van het toestel.
- **Beweging verminderen:** staat het aan (Instellingen > Toegankelijkheid > Beweging > Verminder beweging), tik het uit tot C22. Onthoud de beginstand. In C22 zet je het aan en daarna terug naar de beginstand.
- **Ritten:** een rit vraagt 24 goede antwoorden (3 pizza’s van 8 stukken, `scripts/learning-engine.js` r.6–7 en r.87–89) en speelt niet opnieuw (`scripts/nino-moments.js` r.1). Oefenen telt mee (`05-app-kern.js` r.112). Toets telt in deze build niet mee: `scripts/v3/toets.js` r.102–103 geeft er geen beloning voor, al telt V2 het wel (`05-app-kern.js` r.112). Herhaalde goede antwoorden in een Les tellen niet (`scripts/route-engine.js` r.191–196); een nieuwe vraag in een Les telt één keer. De eerste rit valt bij C14: de teller loopt vanaf een vers profiel op, dus een goed antwoord uit C9 telt mee en de rest haal je in Oefenen. De tweede rit (C22) vraagt 24 nieuwe goede antwoorden in Oefenen ná C14. Is er geen tweede rit gehaald, schrijf n.v.t. Is een rit al eerder gestart (bestaand profiel), noteer bij welke rij.
- **Nieuw profiel:** een vers profiel heeft alleen het eerste hoofdstuk open. Een hoofdstuk opent pas als het vorige af is (`scripts/route-engine.js` r.25–29). Rijen die dat nodig hebben, zijn voorwaardelijk: is iets op slot, schrijf n.v.t.

## Checklist
Begin liggend (1080×810). Rij C3 en C4 wisselen de oriëntatie. Staat de schermvergrendeling aan, tik hem uit om te draaien.

| ID | Scherm | Stap | Verwacht | OK/NOK | Bron |
|---|---|---|---|---|---|
| C1 | Laden | Open de pagina in een privévenster | Geen flits van V2; de app komt rustig in beeld | | OVERDRACHT r.90 |
| C2 | Kennismaking | Doorloop de kennismaking | Eén Nino, kleine tekstballon, glaskaart over het artwork | | OVERDRACHT r.95–98 |
| C3 | Reis | Houd de iPad staand (portret) en open Reis | Kaart en hoofdstukkaart passen, niets valt buiten het scherm | | SPEC r.39; AFTERNOON r.61 |
| C4 | Reis | Draai de iPad liggend (landschap) en open Reis | Kaart ≥ 45% van het vlak, titel hoofdstukkaart max. 2 regels | | OVERDRACHT r.241–242 |
| C5 | Reis | Tik de kaartschakelaar Schoolkaart/Reliëf. Staat de schakelaar er niet, schrijf NOK en noteer wat je ziet | De kaart wisselt direct van weergave | | OVERDRACHT r.86 en r.140 |
| C6 | Reis | Tik Schoolblad en daarna "Terug naar mijn kaart". Staat een knop er niet, schrijf NOK en noteer wat je ziet | Label "Schoolblad" zichtbaar; opent en sluit; knop niet V2-groen | | OVERDRACHT r.87 en r.203 |
| C7 | Reis | Bekijk de landmarks bij Reliëf; wissel naar de schoolkaart | Landmarks alleen op Reis en toetsresultaat; niet over pin of foutlabel | | OVERDRACHT r.140 en r.154 |
| C8 | Oefenen | Open Oefenen liggend | Rechterpaneel past zonder scroll | | OVERDRACHT r.91 |
| C9 | Les | Geef een goed antwoord op een vraag (is de eerste stap een uitleg zonder vraag, ga door tot de eerste vraag; is er geen vraag, n.v.t.) | Markering en uitleg in violet, geen terracotta | | OVERDRACHT r.99 |
| C10 | Toets | Tik in verschillende vragen elk soort knop één keer (aanraakvlakken) | Elke tik reageert in één keer; tekst past in de knop | | OVERDRACHT r.88 |
| C11 | Toets | Tik Willekeurig (toetst alleen open hoofdstukken, bij een vers profiel dus alleen het eerste; staat de knop er niet, schrijf NOK en noteer wat je ziet) en maak de toets af | Resultaat verschijnt; landmarks staan alleen op het resultaat | | toets.js r.59 en OVERDRACHT r.140 |
| C12 | Alle schermen | Ga vanuit elk scherm terug (terugknop) | Je komt op het vorige scherm, nergens vast | | OVERDRACHT r.140 |
| C13 | Reisboek | Veeg door het boek | Pagina 1 en 2 zonder witte tekstvakken; vegen werkt soepel | | OVERDRACHT r.199 |
| C14 | Vespa-rit | Beantwoord in Oefenen goede vragen tot de eerste Vespa-rit start (24 goede in totaal, zie Ritten), met Beweging verminderen uit. Tik Overslaan. Staat de knop er niet, schrijf NOK en noteer wat je ziet | Nino rijdt op de Vespa; Overslaan brengt je bij aankomst | | learning-engine.js r.6–7 en r.79–88; OVERDRACHT r.204 en r.315 |
| C15 | Achtergrond | Wissel tussen schermen met een andere achtergrond | Achtergrond wisselt zonder flits of hapering | | OVERDRACHT r.140 |
| C16 | Instellingen | Open Instellingen en tik Sluiten. Staat de knop er niet, schrijf NOK en noteer wat je ziet | Violet glas, iOS-lijst, geen terracotta of groen | | OVERDRACHT r.94 en r.203 |
| C17 | Landen | Open Reis, hoofdstuk Landen. Staat er een slot ("Opent na Streken"), schrijf n.v.t. | Tint over de kaart, reliëf en grenzen blijven zichtbaar | | reis.js r.293; route-engine.js r.29; 05-app-kern.js r.151; OVERDRACHT r.243 |
| C18 | Tellers | Bekijk de tellers (pizza, Vespa) | Geïllustreerde iconen, geen lijniconen | | OVERDRACHT r.100 |
| C19 | Opslag | Doe een les, herlaad het tabblad in hetzelfde privétabblad | Profiel en voortgang blijven staan | | BL-015 |
| C20 | Stabiliteit | Wissel 10 minuten vaak van scherm | Geen herladen tabblad, geen hapering | | ASSETDIEET r.44 |
| C21 | Alle schermen | Kijk in beide oriëntaties op elk scherm | Nergens afgesneden tekst | | SPEC r.39 |
| C22 | Vespa-rit | Verdien ná C14 nog eens 24 goede antwoorden in Oefenen. Zet Beweging verminderen aan (zie Vooraf) vóór de 24e, start de rit en zet het daarna terug zoals het stond. Geen tweede rit gehaald: n.v.t. | Rit zonder animatie | | OVERDRACHT r.140 en r.204 |

## Vastleggen
- Eén resultaatbestand: `ops/reports/ipad-test.md`. Overschrijf het bij elke test. Maak geen nieuwe map.
- Noteer bovenaan: pin (`git rev-parse --short HEAD`): `________`, iPadOS-versie: `________`, Safari-versie: `________`, datum.
- Neem de checklist over met OK of NOK per C-ID.
- Maak per NOK een screenshot en noem het C-ID in de bestandsnaam of de zin erbij.
- Bundel de bevindingen met die van de Hermes-hertest. Geen aparte ronde (`docs/v3/OVERDRACHT.md` r.150).

## Na de test
- Opruimen: `git switch -` (terug naar je vorige branch), stop de server met Ctrl+C in het terminalvenster waar hij draait, en zet Verminder beweging terug naar de beginstand.
- Meld de uitslag in de chat: aantal OK, aantal NOK, en de C-ID's van de NOK-rijen.
- Alles OK: de eindtest van Hermes en het akkoord van de eigenaar volgen (`docs/v3/OVERDRACHT.md` r.309–310).
- NOK-rijen worden bevindingen voor de volgende ronde. Los ze niet op tijdens de test.
- Deze test beslist niet over een release. Dat doet Dennis na de gates.

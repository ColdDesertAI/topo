# BL-004: Hermes-hertest V3 Italië (release-gate G3)

## Uitslag: **FAIL** (G3 nog niet gehaald)

- **Geen P0 gevonden.** De kernroute is speelbaar op desktop en in iPad-formaat, offline werkt, opslag en migratie werken, en 5 van de 7 oude P0's zijn opgelost.
- **Waarom FAIL:**
  1. **#118 (P1, nieuw):** op iPad-formaat ligt het antwoordpaneel in *Aanwijzen* over het zuiden van Italië. Etna is bij 1080×810 en 810×1080 op geen enkel punt aan te tikken. Herstel kan alleen via *Kaart vrijmaken*. Criterium 3 ("niets afgesneden") wordt daardoor niet gehaald.
  2. **Geen echte iPad 9 getest.** RELEASE_ACCEPTANCE eist een echte iPad 9 met Safari vóór G3 (touch én schermtoetsenbord).
- **Hertest nodig op:** #118 (na de fix), plus criterium 3 op een echte iPad 9.

| | |
|---|---|
| **Pin** | `main @ c228f54` (site = `58d981d`). Lokale build: `TOPO-V3-Italie.html` sha256 `24117eee…c2887`, 30,6 MB |
| **Live** | https://www.ninotopo.nl/ en https://www.ninotopo.nl/italie/ (getest 26-11-2026) |
| **Browsers** | Chromium 159 (Playwright 1.65.1); **WebKit 27.2** (Playwright, de Safari-engine op macOS), met touch voor de iPad-formaten |
| **Formaten** | 1440×900 (desktop); iPad 9-formaat 1080×810 (liggend) en 810×1080 (staand). Menu1 draaide op alle 8 maten |
| **Machine** | Mac mini M4, macOS 26.2 |

**Niet getest:**
- Echte iPad 9 / iPadOS 26.7.2 / Safari: geen toestel beschikbaar.
- Het iPad-schermtoetsenbord, dus "bediening niet onder het toetsenbord": dat kan WebKit niet nabootsen.
- Echte Mac-Safari met de muis (zie F-05).
- Kinderen (dat is BL-010).
- Een volledige audit van *Namen schrijven* per item (aanwijzen is wel per hoofdstuk getoetst).

---

## Per criterium

| # | Criterium | Uitkomst | Bewijs |
|---|---|---|---|
| 1 | Testset | **PASS, met kanttekening** | `npm ci` exit 0 · `npm test` exit 0 · `qa-v3-menu1.mjs` (8 maten × BG-01..04 plus toestandsmatrix) **"OK: geen fouten", exit 0** · `qa-v3-fade.mjs` **exit 0** (50 metingen in Chromium en 50 in WebKit: sprong ≤ 0,028, scène 0,67–0,83, zijbalk 1,02–1,10). **Kanttekening:** letterlijk gedraaid gaf fade *exit 1*. Oorzaak gereproduceerd: op deze Mac staat *Verminder transparantie* aan, en headless Chromium neemt dat over, waardoor menu1.css §11 de werkruimte ondoorzichtig maakt. Menu1 en fade draaiden daarom met de media-features neutraal (`no-preference`). WebKit draaide via een Playwright-adapter, omdat `qa-webkit.mjs` alleen op Linux werkt. Het is geen productfout: #121. Ook `playwright` ontbreekt in `package.json` en moest los geïnstalleerd worden (`--no-save`). |
| 2 | Kernroute, leeg profiel | **PASS** (desktop en beide iPad-formaten) | Leeg profiel → naam en pizza → Reis → H1 → Ontdekken (6) → Aanwijzen met **fout** ("Dat was Palermo. Gezocht: Genua.") en herstel → Namen schrijven met **fout** ("De juiste naam is Bari.") en herstel → pizzafeest → "Deze halte is afgerond!" (stage 3) → Voortgang (6 bezig) → Beloningen (1/11 stempels) → Reisboekje open. Geen JS-fouten en nergens vastgelopen, in Chromium 1440×900 en in WebKit (touch) op 1080×810 en 810×1080. Screenshots 01–10. |
| 3 | iPad 9 / Safari | **FAIL** | Geen echt toestel; vervangend getest in WebKit 1080×810 en 810×1080 met touch. **10,1 min per formaat**, 63 rondes = **630 schermwissels** (Reis, Oefenen, Toets, Beloningen, Reisboekje, Voortgang, Instellingen, hoofdstuk, les, schoolblad): **geen crash, 0 JS-fouten**, de app werkte aan het eind nog. Niets horizontaal buiten beeld (de korte zijbalklabels zijn een bewuste icoonbalk, screenshot 19). **Maar:** in *Aanwijzen* ligt het antwoordpaneel over 18,8% (liggend) en 12,2% (staand) van Italië. Etna (0 van 124 punten vrij), Sicilië, Palermo, Catania en Messina zijn daardoor niet aan te tikken: **F-01 / #118**. Het schermtoetsenbord is niet getest. |
| 4 | Offline | **PASS** | Gebouwd met `npm run build && SITE_ITALIE=v3 npm run build:site` (exit 0, "Site-check: OK"). `TOPO-V3-Italie.html` geopend via `file://` met de browser **offline en alle http(s) geblokkeerd**: **0 netwerkpogingen, 0 kapotte beelden, 0 JS-fouten**. Profiel, Ontdekken (6) en Aanwijzen (goed gerekend) werken, de 5 tabbladen navigeren en de voortgang wordt opgeslagen. Zo getest in Chromium 1440×900 en WebKit 1080×810. Screenshot 14. |
| 5 | Toegankelijkheid | **PASS, met P2** | **Toetsenbord:** de hele route (Ontdekken → Aanwijzen → Namen schrijven → halte af) is met alleen het toetsenbord te doen. **Geen focusval**, de focusring is overal zichtbaar en de keuzelijst is met Tab/Enter te bedienen. Wel onhandig: een schrijfvraag zet de focus niet in het veld (±70 Tabs), en aanwijzen kost ±45–50 Tabs: **F-02 / #119 (P2)**. **Reduced motion:** bij `prefers-reduced-motion: reduce` liepen er 0 animaties tijdens de schermwissels. **Tekst ≥ 13 px:** 0 overtredingen (5 schermen × 3 formaten). **Contrast:** menu1 meet AA op vrije tekst tegen de echte achtergrond (OK). Mijn eigen meting van tekst op dichte vlakken (8 schermen) gaf **0 keer onder 4,5:1**. |
| 6 | Opslag | **PASS** | **Herladen:** 12 punten, 1 pizza en H1 stage 3 blijven staan, het profiel wordt niet opnieuw gevraagd. **Oude V2-save** (`topo-italie-v2` = 23 goed, 4 pizza's, pizzaSteps 3): na het laden 23 goed, 4 pizza's, 4/8 punten (3 × 8/5), 1 rit. Dat blijft zo na herladen en wordt bewaard als `topo-italie-v3`. De V2-sleutel blijft staan, zoals in de karakterisering. **Reservekopie:** bewaren (7,8 kB) en terugzetten in een lege browser gaf dezelfde stand, ook na herladen. Geen dataverlies. |
| 7 | Oude P0-issues | **5 opgelost · 2 deels** | Zie de tabel hieronder. |
| 8 | Portal | **PASS** | www.ninotopo.nl: "Start leren →" leidt naar `/italie/`. Frankrijk ("Leeromgeving volgt") en Spanje, Duitsland en Nederland ("Binnenkort") zijn niet klikbaar, maar ook niet stuk. Geen horizontale overflow en geen 4xx/5xx. Vanuit de app brengt **"Alle landen"** je terug naar de portal, en de browser-terugknop werkt. Zo getest in Chromium 1440×900 en WebKit 1080×810 en 810×1080 (touch). Screenshots 15–16. |

### Criterium 7: oude P0-issues tegen de live V3

| Issue | Status | Bewijs | Voorstel |
|---|---|---|---|
| #33 iPad: kaart te klein, antwoordveld/toetsenbord | **Bestaat nog deels** | De kaart beslaat nu 65% van het scherm op iPad (eerder was hij te klein), maar het antwoordpaneel bedekt 12–19% van Italië, met daaronder Etna en Sicilië (#118). Het schermtoetsenbord is niet getest. | Open laten, of sluiten ten gunste van #118 plus een echte iPad-test. |
| #34 "altijd stip 1" | **Opgelost** | Over alle runs was het juiste antwoord **15× Stip 1 en 14× Stip 2**. De volgorde wisselt per keer (Bologna stond 1× als Stip 1 en 2× als Stip 2). | Sluiten. |
| #36 Toscane/Povlakte als gebied | **Opgelost** | Een tik midden in Toscane gaf **geen stippenkeuze** en werd goed gerekend. Een tik op een punt dat **op de Po-lijn én in de Povlakte** ligt, opende geen keuzelijst en werd **goed gerekend als Povlakte** (desktop en WebKit 1080×810). Screenshot 18. | Sluiten. |
| #37 Apennijnen in zee | **Opgelost** (binnen de kaart) | 235 van de 235 meetpunten in de Apennijnen-zone liggen binnen de Italië-vorm van de app: **0% in zee**. Kanttekening: dat is gemeten tegen de getekende omtrek, niet tegen een onafhankelijke bron. | Sluiten. |
| #38 Learning Integrity Audit (45 objecten) | **Grotendeels opgelost** | Per hoofdstuk (alle 11) is in een echt gestarte Aanwijzen-les getikt. Op desktop zijn alle doelplekken bereikbaar en worden ze goed gerekend (met keuzelijst waar nodig). Op iPad niet: #118. *Namen schrijven* is niet per item geaudit. | Open laten tot #118 klaar is. |
| #44 (P1) Kaartstijl, zoomknoppen, menu | **Opgelost** | Live: "Kaartstijl", "Heel Italië", "Zoom op hoofdstuk", de hint "Kies één hoofdstuk om in te zoomen" en "Kaart vrijmaken". Het ☰-menu is vervangen door de V3-zijbalk met Reis, Oefenen, Toets, Beloningen, Voortgang en Instellingen. | Sluiten. |
| #58 Rome/Vaticaanstad niet te onderscheiden | **Opgelost** | De keuzelijst toont Rome als cirkel en Vaticaanstad als vijfhoekje erbinnen. De twee lijntjes eindigen op duidelijk verschillende punten. Screenshot 17. | Sluiten. |

---

## Bevindingen

| F | Ernst | Scherm/item | Verwacht → werkelijk | Stappen | Issue |
|---|---|---|---|---|---|
| F-01 | **P1** | Les *Aanwijzen*, iPad-formaat | Elke doelplek is aan te tikken → het antwoordpaneel bedekt Etna (0/124 punten vrij bij 1080×810 én 810×1080), Sicilië, Palermo, Catania en Messina (liggend) en Catania (staand). Herstel kan alleen via *Kaart vrijmaken*; *Zoom op hoofdstuk*, `−` en slepen helpen niet. Desktop: geen probleem. | WebKit 1080×810 → H7 Vulkanen → Aanwijzen → "Waar ligt Etna?" | **#118** |
| F-02 | P2 | Toetsenbord, *Namen schrijven* / *Aanwijzen* | De focus staat in het antwoordveld → de focus staat op BODY of op "Ik weet het nog niet", met ±70 Tabs tot het veld. Aanwijzen kost ±45–50 Tabs per vraag. Geen focusval. | Alleen toetsenbord: H1 → Namen schrijven | **#119** |
| F-03 | P2 | Reisboekje, 1440×900 | Het boek blijft vrij van de zijbalk → "Mijn reisboekje" staat over het TOPO-logo en "Vorige" over de zijbalkiconen. Op iPad staand is het in orde. | Beloningen → omslag | **#120** |
| F-04 | P2 (tooling) | `qa-v3-fade` / `menu1` | Groen op elke machine → rood op een Mac met *Verminder transparantie*. WebKit werkt alleen op Linux, en `playwright` staat niet in `package.json`. | `node scripts/qa-v3-fade.mjs` op deze Mac | **#121** |
| F-05 | **ONBEKEND** | Dialogen (profiel "Start meteen", keuzelijst) in WebKit met de **muis** | De klik werkt → Playwright-WebKit meldt `<html> intercepts pointer events` en de dialoog blijft open. Met **touch** werkt het wel (dus geen effect op de iPad). Mogelijk een eigenaardigheid van de testrobot. | WebKit, zonder touch, 1080×810 → "Start meteen" | geen (eerst reproduceren op een echte Mac met Safari) |

## Ideeën (buiten de criteria, geen fix)

- **idee:** het antwoordpaneel op iPad laten inklappen of verschuiven als de gevraagde plek eronder ligt, of de kaartuitsnede automatisch boven het paneel houden (zie #118).
- **idee:** `TopoLearning.migrate` haalt bij een V2-save ongeldige ids zoals `"bogus"` niet uit `mistakes`. Dat is onschuldig, maar opschonen tegen `ITEMS` is netter.
- **idee:** de stempelmelding ("Nieuw stempel…") bleef in één testrun zichtbaar onder de geopende keuzelijst. Dat kwam alleen voor met een kunstmatig opgezette voortgang; nagaan bij de echte speeltest.

## Werkwijze

- Een aparte worktree `wt-hermes-bl004` op `c228f54` voor de build en de QA-scripts. De hoofdmap bleef schoon en de worktree is na afloop verwijderd.
- De browserscripts staan niet in de repo (scratch): kernroute, tik-bereik per hoofdstuk, offline, opslag, toetsenbord, contrast, 10-minutentest en portal. Er is **niets** gewijzigd aan code, er is niets gemerged of gedeployed, en er zijn geen issues gesloten.
- Issues aangemaakt: #118, #119, #120, #121.

## Screenshots

01 leeg profiel · 02 aanwijzen · 03 aanwijzen-fout · 04 namen-fout · 05 halte afgerond · 06 voortgang · 07 beloningen · 08 reisboekje desktop (F-03) · 09 iPad liggend namen-fout · 10 iPad staand reisboekje · 11 Etna bedekt 1080×810 (F-01) · 12 Etna na *Kaart vrijmaken* · 13 Etna bedekt 810×1080 · 14 offline WebKit · 15 portal desktop · 16 portal iPad staand · 17 Rome/Vaticaanstad-keuze (#58) · 18 Povlakte op Po-lijn (#36) · 19 iPad liggend Reis (na 10 min) · 20 iPad staand Voortgang (na 10 min)

# Playbook — Speeltest met kinderen (groep 7)

Herbruikbaar protocol (BL-008). Gebruik het bij elke mijlpaal met een nieuwe gebruikersflow (QA-gate in `ops/QUALITY.md`) en voor het target "kind haalt de toets na de route, ≥ 80%" in `ops/NORTH_STAR.md`. Eerste gebruik: BL-010.

## Doel
- Meten of kinderen **leren** (halen ze de toets na de route?) en of het **leuk** is (willen ze vanzelf terugkomen?). Nooit het ene zonder het andere beoordelen.
- Doelgroep: kinderen uit groep 7 (10–11 jaar). Omvang: 2–3 kinderen, elk apart, één voor één.
- Tijd: ≤ 30 min per kind, inclusief welkom en afsluiting. Dennis is de enige begeleider en observeert.
- Dit is geen gebruikersonderzoek met conclusies uit één kind. Het zoekt patronen en grote struikelblokken.

## Voorbereiding
- **Apparaat:** iPad 9 (de ondergrens, iPadOS/Safari). Geen desktop als vervanging, tenzij de iPad ontbreekt (noteer dat dan).
- **Versie:** noteer vooraf de geteste pin (commit) of preview-URL in het scoreformulier. Zonder versie telt de test niet.
- **Schoon begin:** wis de opslag vóór elk kind, zodat de kennismaking opnieuw doorlopen wordt, en ook na het laatste kind. Vaste methode: Safari > Instellingen > Geavanceerd > Websitegegevens > de site verwijderen (of Instellingen > Safari > Wis geschiedenis en websitegegevens). Tijdens een kind blijft de opslag staan (nodig voor T5).
- **Scherm en geluid:** helderheid hoog, niet-storen aan, geluid aan. Geen andere apps open.
- **Materiaal:** dit protocol, het scoreformulier (op papier of lokaal bestand), een klok. Geen scherm- of camera-opname.
- **Plek:** rustig, kind zit zelf aan de iPad, Dennis ernaast en iets achter het kind.
- **Instructie aan het kind (vast):** "Dit is een spel over Italië. Wij testen het spel, niet jou. Je kunt niets fout doen. Zeg gerust hardop wat je denkt. Ik help alleen als je echt vastzit."

## Toestemming en privacy
- Toestemming van een ouder of verzorger vooraf, mondeling of schriftelijk, over wat er gebeurt en dat meedoen vrijwillig is. Het kind mag altijd stoppen.
- Geen namen: kinderen krijgen codes K1, K2 en K3. Bij de kennismaking vult het kind als naam zijn code of een verzonnen naam in, nooit de echte naam. De koppeling tussen naam en code wordt nergens vastgelegd.
- E-mail en Print op het resultaatscherm worden niet gebruikt.
- Geen video of foto's van het kind, geen geluidsopnamen. Alleen handgeschreven of getypte notities.
- Notities blijven lokaal en gaan niet in git. Alleen het geanonimiseerde rapport (zie Verwerking) komt in de repo, zonder leeftijd per kind, school of datum met tijd.
- Grenzen volgen `ops/NORTH_STAR.md` §Grenzen: geen tracking, geen accounts, data blijft lokaal.

## Taken
Lees de taak voor in eigen woorden, zonder de knoppen te benoemen. Help pas na de maximale tijd, en noteer de hulp. Eén punt per taak: gehaald of niet gehaald binnen de tijd.

| # | Taak (zeg tegen het kind) | Succes | Max. tijd |
|---|---|---|---|
| T1 | Open het spel en maak kennis met Nino. Stel jezelf in. | Kind komt zelfstandig door kennismaking en profiel en staat op het startscherm (Reis). | 3 min |
| T2 | Kies een hoofdstuk en begin met oefenen (de route). | Kind start zelfstandig een hoofdstuk en beantwoordt de eerste opdracht op de kaart. | 3 min |
| T3 | Speel de route uit. | Kind rondt de route af zonder hulp bij de bediening (hulp bij de inhoud telt niet als bediening). | 10 min |
| T4 | Doe nu de toets over wat je geleerd hebt. | Dennis zet de toets in vlak voor hij de iPad geeft: het hoofdstuk dat het kind in T2 koos, lengte Alle, vorm both (standaard). Kind voltooit de toets en ziet het resultaat. Dennis noteert goed/totaal en de instelling. Rondt het kind T3 niet af, dan doet het T4 toch met dat hoofdstuk (noteer dit). | 6 min |
| T5 | Sluit het spel, laad de pagina opnieuw (herladen) en kijk of je verder kunt. | Na herladen staat het profiel en de voortgang er nog, zonder nieuwe kennismaking. | 2 min |
| T6 | Zoek waar je kunt zien hoe ver je bent. | Kind opent zelfstandig Voortgang of Beloningen en benoemt wat het ziet. | 2 min |

Totaal taken: 26 min maximaal. Houd de vragen na afloop kort (zie hieronder) om binnen 30 min per kind te blijven. Loopt een kind uit, sla T6 over en noteer dat.

## Observatie
Turf tijdens het spelen (turf per taak, achter het kind). Noteer alleen wat je ziet of hoort, geen interpretatie.

| # | Signaal | Turf |
|---|---|---|
| O1 | Vraagt hulp of kijkt hulpzoekend naar Dennis | |
| O2 | Wil iets opnieuw doen zonder dat het moet | |
| O3 | Lacht, roept iets of praat tegen Nino | |
| O4 | Zucht, kreunt of zegt "saai" of "moeilijk" | |
| O5 | Zoekt rondjes op de kaart voor het antwoord | |
| O6 | Tikt mis (verkeerde plek of knop, tik zonder effect) | |
| O7 | Haakt af (legt de iPad neer, kijkt weg, vraagt wanneer het klaar is) | |
| O8 | Vertelt uit zichzelf een weetje of gebeurtenis uit het spel | |

Noteer daarnaast woordelijk de opvallendste kinderuitspraken (maximaal 5) en bij welk scherm ze vielen.

## Vragen na afloop
Stel in deze volgorde, praat in kindtaal, laat stiltes toe, vraag door met "hoe bedoel je dat?". Geen sturende vragen.

| # | Vraag |
|---|---|
| V1 | Wat vertel je thuis over dit spel? |
| V2 | Wat was het leukste moment? Wat deed je toen? |
| V3 | Was er iets lastig of saai? |
| V4 | Wat zou je nog een keer willen doen? |
| V5 | Wat was er lastig om te vinden of te snappen? |
| V6 | Wie is Nino voor jou? Wat doet hij? |
| V7 | Wat zou je veranderen als jij het spel mocht maken? |

## Scoreformulier
Per kind één formulier (code K1, K2 of K3). Bovenaan: pin of preview-URL, apparaat, datum, begeleider. Geen naam.

### Leren
- Per taak T1–T6: gehaald (J) of niet (N) binnen de maximale tijd, plus aantal hulpmomenten.
- **Toetsscore (T4)** als goed/totaal (de app toont alleen dat), en of de toets is afgerond.
- **Slaagnorm (vast):** geslaagd is ≥ 80% van het totaal goed, naar boven afgerond. Een hoofdstuk heeft 2 tot 7 items, dus het aantal vragen verschilt; noteer het. Dennis noteert de score, het protocol bepaalt of het kind geslaagd is, niet de app.

| Totaal | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|
| Minimaal goed | 2 | 3 | 4 | 4 | 5 | 6 |

- Uitkomst: aandeel geslaagde kinderen. Target uit NORTH_STAR: ≥ 80% van de testkinderen. Bij 2 of 3 kinderen betekent dat: allemaal slagen, want 1 van 2 of 2 van 3 blijft onder de drempel.
- Noteer ook welke plaatsen of regio's de meeste fouten kregen (geen interpretatie).

### Leuk
- Turftotalen O1–O8 per kind, en per taak waar de meeste O4, O6 en O7 vielen.
- Kinderen die uit zichzelf iets opnieuw wilden (O2) of iets vertelden (O8, V1): tel per kind ja of nee.
- Antwoord op V4 en V1 beoordeel je als: wil terugkomen (ja), twijfel, nee. Letterlijk citeren, niet samenvatten.
- Uitkomst per kind: wil terugkomen ja of nee. Vermeld nooit het leukoordeel van Dennis zelf.
- Leren en leuk worden apart gerapporteerd. Een hoge toetsscore bij een kind dat wil stoppen is een bevinding, geen succes.

## Verwerking
Binnen een dag na de laatste test, zolang het vers is:
1. Schrijf één rapport: `ops/reports/speeltest-<datum>.md` (geanonimiseerd, alleen codes K1–K3). Inhoud: pin/URL, apparaat, aantal kinderen, uitkomst Leren (met het 80%-target), uitkomst Leuk, top 3 bevindingen, woordelijke citaten zonder namen.
2. Vat de ruwe notities niet samen in een tweede document en bewaar ze niet in de repo. Vernietig of houd ze lokaal, niet in git.
3. Zet de top 3 bevindingen als `idee` in `ops/BACKLOG.md`, elk met het NORTH_STAR-target dat het dient (zie `ops/playbooks/FEATURE.md`).
4. Voeg één regel toe aan `ops/RUNLOG.md` met datum, pin en de twee uitkomsten.
5. Toets de kill-criteria in `ops/NORTH_STAR.md`: willen kinderen na 1 sessie niet terug (V1, V4, O2, O8), dan is dat een signaal om te heroverwegen. Meld dat direct aan Dennis als opdrachtgever, niet pas in de volgende ronde.
6. Een bevinding die geografische juistheid raakt, gaat vóór alle andere (prioriteit uit `AGENTS.md`).

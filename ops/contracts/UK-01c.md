# Sprintcontract — UK-01c VK en Ierland in de vorm van de Frankrijk-oefenkaart

**Doel (1 zin):** `/vk-ierland/` krijgt dezelfde opzet en vormgeving als Dennis' Frankrijk-oefenkaart (Leren, Aanwijzen, Namen schrijven, Toets, Schoolblad, bakkerijdoos + Vespa-rit, keuzevenster bij plekken dicht bij elkaar), met de 44 items en de kaartfixes van UK-01/UK-01b.
**Waarom nu:** besluit Dennis 27-11: de vorige UI kan verwarrend werken; de Frankrijk-vorm is herkenbaar voor de leerling. Overhoring di 1-12.
**Bouwer:** hoofdsessie (spoed) · **Evaluator:** `evaluator` (Opus) · **Max runs:** 1/3

## Ontwerpgrens
- Sjabloon `src/lands/uk-ie/app/oefenkaart.html` = het Frankrijk-bestand met de data eruit (MAP, LES, SHEETS, twee afbeeldingen). CSS en JS blijven gelijk, behalve generieke uitbreidingen: type `meer` (lijn, zoals rivier), thuislanden die zelf doel zijn (`home`), `excl` (Skye ≠ Hebriden), labelverschuivingen en rit-steden uit de data.
- Spelling volgt Frankrijk: hoofdletters vrij; zonder accent is "bijna foutloos" bij oefenen, maar fout in de toets.
- Italië, `index.html`, het portal en het Frankrijk-bestand blijven onaangeroerd.

## Scope
- Mag: `src/lands/uk-ie/**`, `scripts/land/uk-ie-*.mjs`, `scripts/verify-site.mjs` (alleen de UK-regel), `ops/*` (UK-regels).
- Niet: Italië, `index.html`, `portal/`, `vercel.json`, `src/lands/fr/**`.

## Acceptatiecriteria
| # | Criterium | Hoe getoetst | Verwacht |
|---|---|---|---|
| 1 | Data volgens blad, hoofdstukken in bladvolgorde | `node scripts/land/uk-ie-check.mjs` | exit 0 |
| 2 | Zelfde opzet als Frankrijk | diff sjabloon vs. Frankrijk-bestand: alleen titel/teksten en de genoemde generieke uitbreidingen | geen andere UI-wijziging |
| 3 | Elk item aanwijsbaar, ook via keuzevenster | `uk-ie-e2e.mjs`: logica 44/44 + echte touch 44/44 op 1080×810, 810×1080, 1440×900 | 44/44 |
| 4 | Fouten worden fout gerekend | e2e: Engeland≠Wales, NI≠Ierland, Skye≠Hebriden, Ierse Zee≠Noordzee, Keltische Zee≠Kanaal, België≠Frankrijk, Norwich≠Londen, Loch Ness≠Theems; diep in een buurland telt | allemaal goed |
| 5 | Spelling | e2e: Londen/londen goed, London fout, Belgie bijna, Kanaal goed, Orkneyeilanden goed, Edinburg fout | zoals verwacht |
| 6 | Toets en voortgang | e2e: toets 44/44 → cijfer 10,0; voortgang blijft na herladen | ok |
| 7 | Offline, geen fouten, iPad-maten | e2e: geen netwerk, geen console-errors, knoppen ≥ 44 px, geen horizontale scroll | ok |
| 8 | Site-build | `npm run build && npm run build:site`: `/vk-ierland/` is de nieuwe module, `/italie/` ongewijzigd t.o.v. main, portal linkt niet | ok |

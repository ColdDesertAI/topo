# BL-007 — gedrag vóór de runtime-migratie

Referentie: `ColdDesertAI/topo` **main `8ad5002d525636423828374c7535ed69bcbd00f4`**. V2.0.2 `index.html` SHA256 **`3aced3c31259011b0af2947c78f71965cb4beb2e88c69d1663e61792b0304f5a`**. Dit pakket verandert geen app-code, afhankelijkheden, opslag of fixtures buiten deze testmap; alleen `test:characterization` is aan package.json toegevoegd.

```sh
npm ci
npm run test:characterization
```

Bestaande dependency: jsdom 30.1.1; geverifieerd met Node 25.8.2. Geen netwerk tijdens de tests. De 30 tests draaien in afzonderlijke testbestanden, achtereenvolgens om geheugen te begrenzen. Iedere boot heeft eigen lokale opslag en wordt gesloten. Reken op circa 20 seconden op deze machine.

## Harnas en referentie

`docs/v3/ARCHITECTUUR.md` ontbreekt op deze main. De gevraagde §2 stap 1 is gelezen op `arch/v3-runtime` **`75263a72a4c629f6a6f4c82258ef0186716e081d`**; de eerdere karakterisering uit diezelfde branch vormt het vertrekpunt. De verwachtingen zijn gecontroleerd op de huidige main, niet op de oude V3-pin. Geen runtime-migratie of architectuurbesluit in deze levering.

`support.mjs` voert de echte inline V2-code uit. Voor toetsen, hun geschiedenis en V3-import/resetkoppelingen laadt hij ook alle dertien bestaande V3-scripts in de volgorde van de releasebouwer. Dat is nodig omdat `topo-v3-toetsen-v1` niet in de bevroren V2-HTML zit. De metadata-voorbereiding van de echte releasebouwer wordt in geheugen uitgevoerd, zonder een preview te bouwen of bestanden te schrijven. Grading, route, beloningen en opslaghandlers worden niet vervangen of nagebouwd.

Alleen beeldpayloads, scroll, modal-, download-, clipboard- en browser-timingprimitieven hebben testadapters. Tijdzone **UTC**, klok **2026-11-10T12:00:00.000Z**, LCG-seed **0x70f0** voor Math.random en crypto.getRandomValues. Date, performance, timeouts, intervals en rAF zijn gecontroleerd; positieve timers lopen alleen als de test de klok vooruitzet. Geen echte wachttijden of browseropslag. Ook het harnas zelf heeft een timer-/seedtest; twee echte toetsen op afzonderlijke boots moeten exact dezelfde volgorde, antwoorden, uitslag en opslag geven.

## Gedragsorakels

| Bestand | Dekking |
| --- | --- |
| `data-grading.test.mjs` | Alle 45 juiste namen en gekozen IDs, verkeerde IDs, alle gedeclareerde aliassen, hoofdletters/diakritische tekens/interpunctie, geen fuzzy spelling/codes/lege inzending; echte 22 CSS-px-resolver, Rome versus Vaticaan; onveranderde canonieke kaartdata en 11 hoofdstukken. |
| `route-rewards.test.mjs` | Sloten, drie stages voor alle 11 hoofdstukken, vertraagd herstel, stage-replay, goud/wrong/retry/replay, schema-1-migratie, skillplanning; 8 punten/pizza, 3 pizza's/rit. Volledige route plus goud levert precies **180 unieke tokens, 180 punten, 22 pizza's, 4 stukjes en 7 ritten**; herladen na ieder antwoord en alle replays maken geen extra tokens. |
| `continuity-mastery.test.mjs` | Vraag/concept/selectie bij navigatie, replay-dagdoel zonder extra beloning, 12 goudvragen over de zesvragenpauze met answered reload, profiel/legacy-migratie en eenmalig introaanbod; mastery en boek/werkblad houden voortgang intact. |
| `exam-storage.test.mjs` | Werkelijke toets met fouten/overslaan, geen pizzabeloning, dagdoel; laatste 10 uitslagen nieuwste eerst; Blob-export en import V3↔V2, annuleren, quota/rollback, gedeeltelijke/corrupte data en resetbeleid. |
| `storage-contract.test.mjs` | Exacte sleutels en velden, schema's, herladen, reset van alleen pizza versus voortgang versus alles, annuleren zonder writes, validatie vóór bevestiging, behoud van andere applicatiesleutels en vaste tijd/randomness. |

## Opslagcontract en bestaande uitzonderingen

- `topo-italie-v3`: **schema 3**, velden `daily, good, mistakes, pizzas, route, schema, slices, trips`; route **schema 2** (legacy route 1 leesbaar), profiel **schema 1** onder `topo-nino-profile-v1`, introstatus onder `topo-nino-intro-v1`.
- `topo-v3-toetsen-v1`: **schema 1**, maximaal 10 resultaten, nieuwste eerst. Resultaatvelden: `at, chapters, correct, form, items, length, total`; gedeelde reservekopie-envelope blijft `app: topo-italie, version: 1`, met optionele `v3Toetsen`. Oude kopieën zonder die uitbreiding behouden lokale uitslagen.
- `topoV3PostSeen`: onversioneerde lijst met gelezen postkaart-IDs, aanwezig in de huidige release-laag. De tests kopiëren geen werkelijke gebruikersopslag.
- Reset pizza wist pizza's/stukjes/ritten, behoudt lifetime punten, route/tokens, fouten, profiel en toetsuitslagen. **Wis voortgang** wist ook toetsuitslagen, maar behoudt profiel en introstatus. **Begin helemaal opnieuw** wist bovendien profiel en intro, schrijft nulvoortgang en vraagt herladen.
- De oude geannuleerde-importafwijking uit ARCHITECTUUR is op deze main al hersteld: annuleren moet voortgang, profiel én uitslagen intact laten, ook na een eerdere geslaagde import. De oude verwachting die uitslagenverlies vastlegde is dus niet overgenomen.
- **Geobserveerde resetbeperking:** de legacy sleutel `topo-italie-v2` wordt door een volledige reset niet verwijderd. De nulsave onder schema 3 heeft bij herladen voorrang. Dit is zichtbaar vastgelegd, geen goedkeuring of stilzwijgende bugfix; een bewuste latere verandering vereist een expliciete gewijzigde verwachting.

`baseline.json` bevat alleen vaste hashes/hoofdstukmetadata. Niet automatisch opnieuw genereren om falende tests te verbergen. Bij M1 verandert de runtime-/DOM-adapter; gedragsverwachtingen, economische uitkomsten, schema's en opgeslagen referentie blijven de vergelijkingsbasis. De index-hash betreft de bevroren referentie, niet de bronbytes van een toekomstige kandidaat.

## Grenzen

Deze tests bewijzen gedrag in jsdom, geen echte browserpixels, native SVG-fill/stroke, IME, fysiek iPad/Safari, geheugen of printeruitvoer. Voor punt-afstand levert het harnas alleen CTM/DOMPoint aan de echte resolver; grens-/rivierhit-testing blijft browser-QA. Beeldbytes zijn vervangen, niet inhoudelijk beoordeeld. Multi-tabconflicten, echte OS-quota en alle mogelijke corrupte importcombinaties zijn niet uitputtend getest. De bestaande regressies en Hermes-/device-QA blijven naast deze suite nodig.

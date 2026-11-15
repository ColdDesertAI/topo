# FR-02 — herkomst en geografisch contract

**Status: draft, alleen geodata en bouw-/testgereedschap.** Basis: `main` `7e7b0ad5f9899921112588abfd7ecf278b7b85bf`, na de drie opgedragen squash-merges (#102 BL-019, #103 BL-007, #104 FR-01). Na iedere merge waren `npm run lint && npm test` exit 0; karakterisering op de BL-007-mergepin bovendien 30/30 groen. Geen wijziging aan de Italië-baan (`scripts/v3/`, `src/v2/`, `index.html`), geen app-integratie en geen merge van FR-02.

## Bron, versie en licentie

**Natural Earth 10m**, repositoryversie **5.2.0-pre**, vaste commit **`ca96624a56bd078437bca8184e78163e5039ad19`**, dezelfde bronpin als `land/fr-geo`. Het upstream `VERSION`-bestand is opnieuw gecontroleerd. Alle gebruikte gegevens vallen in het **publiek domein**, inclusief commercieel gebruik en aanpassingen: [officiële gebruiksvoorwaarden](https://www.naturalearthdata.com/about/terms-of-use/). Vrijwillige credit: **Made with Natural Earth**.

De volledige bronbestanden zijn opnieuw gedownload en hun SHA256 én alle 145 geselecteerde oorspronkelijke features zijn gecontroleerd. Het gebundelde bronarchief bevat ongewijzigde GeoJSON-features (geometrie én properties), niet overgetekende vormen. Alleen de uitvoer wordt geprojecteerd, afgesneden en vereenvoudigd. `sources.json` bevat immutable bron-URLs, hashes en aantallen.

| Laag | Volledig upstream-bestand | SHA256 | Geselecteerd |
|---|---|---|---|
| countries | [`ne_10m_admin_0_countries.geojson`](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_10m_admin_0_countries.geojson) | `239eec57ac17f100a11e2536cffc56752c318b50ae765b0918ff7aab4ce8f255` | 17 |
| departments | [`ne_10m_admin_1_states_provinces.geojson`](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_10m_admin_1_states_provinces.geojson) | `22d0e3ad85eb3e27f17cabf8ba2d50e554fbc27a87796ff891d958185da62fb5` | 96 |
| places | [`ne_10m_populated_places.geojson`](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_10m_populated_places.geojson) | `9b8e3de09048ef00dfc70357dbb9fa324493f214b5e0ae4daf1aa79a8d10116b` | 19 |
| rivers | [`ne_10m_rivers_lake_centerlines.geojson`](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_10m_rivers_lake_centerlines.geojson) | `bb854a900ecbd3b408df46d5e16e3e0f974ba55993f9d8b5c26e855273c0905a` | 10 |
| mountains | [`ne_10m_geography_regions_polys.geojson`](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_10m_geography_regions_polys.geojson) | `b7b26e50ea917d3696aec87f932def2bf5f890f5770e441d59c162c6f4c92a77` | 3 |

Het bronarchief is alleen voor herbouw en audit; een toekomstige runtime gebruikt de uitvoerbestanden, niet het bronarchief. Ophalen/gecontroleerd: 15 november 2026.

## Projectie en uitvoer

`projection.json` is de enige bron voor de projectieparameters:

```text
x = 60 × longitude + 390
y = 4576 − 88 × latitude
viewBox = 0 0 1000 1000
```

WGS84-kader: west −6,5°, oost 10,1666666667°, zuid 40,6363636364°, noord 52°. Frankrijk en Corsica vullen ongeveer 88% van de breedte en 86% van de hoogte. Het is een onderwijsprojectie van hetzelfde affiene type als Italië, geen metrische of conforme kaart. Corsica wordt niet verplaatst naar een inset. Stadspunten blijven exact op de bronvelden LONGITUDE/LATITUDE, zoals in de bestaande Frankrijk-branch; alleen SVG-uitvoer wordt op 0,01 eenheid gekwantiseerd.

- `map.json`: nationale omtrek, 15 contextlanden/-gebieden en **alle 40 FR-01-items**, elk met een werkelijk punt of pad. De 19 steden behouden de originele Natural Earth-punten en hebben een gecontroleerde regiocode. Namen/aliassen blijven in `../items.draft.json`; de kaart verwijst via dezelfde IDs.
- `regions.json`: **13 metropolitane regio's**, inclusief Corsica. Overzeese regio's vallen buiten dit kader. De 96 metropolitane departementen zijn op de upstream `region_cod` samengevoegd. De trailing tab in `FR-IDF\t` wordt alleen in de sleutel getrimd; geen brongeometrie is aangepast.
- De nationale omtrek en context komen uit `admin_0_countries`. Werkelijke zichtbare context omvat ook Nederland, Oostenrijk, Liechtenstein, Portugal en de Kanaaleilanden. Zo worden die gebieden geen fictieve zee. Land aan de kadergrens is een uitsnede, geen nieuwe kustlijn.
- Zes rivieren: Garonne, Loire, Maas/Meuse, Rhône, Rijn en Seine; oorspronkelijke middenlijnen, binnen het kader afgesneden, zonder kunstmatige verbindingen tussen losse componenten.
- Alpen, Pyreneeën en Vogezen komen uit de Natural Earth-zonepolygonen `ALPS`, `PYRENEES`, `Vosges`. Het zijn **gegeneraliseerde fysieke zones**, geen nauwkeurig ingemeten berggrenzen. Zichtbare zones zijn met de bronlandmaskers afgesneden.
- Historische lesstreken: Bretagne en Normandië volgen hun bronregio; Elzas = departementen 67+68; Dordogne = departement 24, **geen rivier**. Provence blijft de bestaande educatieve benadering met departementen 04, 13, 83 en 84, niet de volledige moderne regio Provence-Alpes-Côte d’Azur. Corsica gebruikt dezelfde vorm als regio FR-COR.

## Aansluitende regio's

Mapshaper 0.7.101 verwerkt alle regiogrenzen in één topologisch netwerk. Gedeelde bogen worden éénmaal met Douglas–Peucker vereenvoudigd (0,35 SVG-eenheid); land/context 0,2, rivieren 0,2 en overige vormen 0,25. De waarden staan in `projection.json`. Daarna volgt een overlay met de canonieke nationale omtrek; echte gaten/enclaves uit dat landmasker blijven behouden.

327 kleine kust-/grensslivers zijn aan de regio met de langste gedeelde rand toegevoegd. Eén geïsoleerd driehoekje aan de oostkust van Corsica had na vereenvoudiging geen gedeelde rand; een afzonderlijke overlay met de **onvereenvoudigde** departementen wees eenduidig Haute-Corse/FR-COR aan. De bouw vereist daar positieve bronoverlap met precies één regio en stopt bij ontbrekende of ambigue dekking. Er wordt geen dichtstbijzijnde regio gegokt en geen stad naar binnen geschoven.

Gebruik `fill-rule="evenodd"` voor de SVG-paden. De 13 regio's delen exact dezelfde randvertices; de onafhankelijke scanline-controle vindt geen overlap of zichtbare interne gaten en maximaal **0,00315 px** verschil met het nationale landmasker door uitvoerkwantisering. Een controlebeeld met drie tinten en alle steden/rivieren is visueel geïnspecteerd; dit is geen app-scherm of artwork.

## Hergebruik van land/fr-geo en verschillen

Gecontroleerde bronbranch: **`dc9d094dd9aeff635021ae897d25337f64a76982`**. Het bestaande `data/fr/map.json`, `scripts/fr/build-map.py`, bronregister en `docs/v4/fr-geo.md` zijn gelezen.

1. Behouden: dezelfde Natural Earth-pin en lagen, de oorspronkelijke plaatsen van de 14 bestaande steden, de zes rivierselecties, drie gebergtezones en de streekdefinities. De oude steden stonden afgerond in het kaartbestand; nu worden de volledige oorspronkelijke LONGITUDE/LATITUDE-waarden rechtstreeks bewaard. Bij Parijs wijkt het afzonderlijke GeoJSON-geometry-punt circa 1,59 SVG-px af van die velden; de nieuwe bouw blijft bij de bestaande metadata-keuze en verplaatst Parijs niet stilzwijgend. Beide varianten horen bij dezelfde bronfeature; er is geen variant gekozen om een containmenttest te forceren.
2. Nieuw: de vijf FR-01-steden Amiens, Dijon, Grenoble, Orléans en Reims, ieder uit dezelfde `populated_places`-bron. Alle 19 steden liggen strikt binnen Frankrijk en precies de verwachte regio; `city-regions.json` is de afzonderlijke verwachte koppeltabel.
3. Nieuw: de dertien moderne metropolitane regio's met gezamenlijke topologie en eigen tests.
4. Nieuwe compacte projectie zoals hierboven. De oude kaart had x-schaal `1000/21.2`, y-schaal `1000/21.2/cos(46.6°)` en viewBox 1000×796,4. De exacte oude y-schaal is **68,65182466426964**, niet de afgeronde 68,655 uit de oude toelichting.
5. Zes wateren krijgen het bestaande bronafgeleide **representatieve labelanker**, via de exacte inverse oude projectie omgezet naar WGS84 en vervolgens naar de nieuwe projectie. Het bronarchief bewaart de originele labelcoördinaten, projectie en hash van het oude kaartbestand. Deze ankers zijn **geen maritieme grenzen of beoordelings-/hitgebieden**. FR-02 levert hier een coördinaat, zoals de opdracht toestaat; een toekomstige kern mag hieruit geen exact puntantwoord voor een hele zee afleiden.
6. Buiten het doel: de negen oude land-items zijn nu context, overeenkomstig FR-01; alleen de 40 huidige item-IDs zijn leermateriaal. De extra achtergrondmeren en niet-geleerde contextrivieren uit de losse oefenkaart zijn niet overgenomen. De oude losse app, interactieregels, opslag en beloningslogica zijn niet gekopieerd.

Het oude kaartbestand heeft SHA256 **`9331755e8532f7c465feb73013f663150d85badd8626cdacf1e1b556ad14b860`**. De zes waterankers zijn opnieuw tegen dat bestand gecontroleerd. Het kaartbestand en de oorspronkelijke bronregisters blijven via de vaste commit terugvindbaar; er is geen tweede tijdelijke Franse app toegevoegd.

## Reproductie en tests

```sh
node scripts/geography/build-france.mjs
node scripts/geography/france.test.mjs --rebuild
```

Node 25.8.2; Mapshaper **0.7.101**, uitsluitend bouwgereedschap via `npx --yes mapshaper@0.7.101`. Geen runtime-dependency en geen wijziging aan package.json. Bij de eerste gereedschapdownload is netwerk nodig; met een gecachte tool en het gebundelde bronarchief zijn de gegevens offline herbouwbaar. Het script schrijft alleen `map.json` en `regions.json` en verwijdert alleen zijn eigen OS-tempmap.

Voor onafhankelijke verificatie: download de vijf volledige bestanden onder hun oorspronkelijke bestandsnamen in een map, en haal het oude kaartbestand op de genoemde commit op:

```sh
node scripts/geography/build-france.mjs --verify-upstream /pad/naar/ne --verify-legacy /pad/naar/map-van-dc9d094.json
```

Alle vijf volledige hashes en 145 bronfeatures plus de zes oude waterankers zijn op deze manier gecontroleerd. **9/9 gerichte tests groen**, inclusief bytegelijke herbouw, 40/40 geometrieverwijzingen, projectie/kader, 19/19 steden binnen land én juiste regio, dertien onafhankelijke departement-binnenpunten, aansluitende regio's, zes echte rivierlopen en expliciet gemarkeerde gebergte-/waterzones. De nieuwe gegevens zijn niet door de app ingeladen. Er is geen app-build gedraaid omdat die de uitgesloten Italië-bestanden herschrijft.

## SHA256 van de levering

| Bestand | Bytes | SHA256 |
|---|---:|---|
| `projection.json` | 638 | `314b64d6195f05910e8b196ae183ebe878783bfbe71ac6b8599e9dfa0d6bf334` |
| `source.json.gz` | 475766 | `94ccfecf81c64016a4706b0ffbfab762e8e0d204820f3bb79a3ba0c0c61862f9` |
| `map.json` | 137186 | `76cd7b755bcaf1e2caf485b8a810f4bbdcb88b2c7da4383e67187c451692ed72` |
| `regions.json` | 67114 | `7edf99abc64294688ac55ded5934c509a88758e8725a674e4974fa942ebeceb7` |
| `city-regions.json` | 433 | `7d21baae5b9a11a74137107ec469d8bce23a09b00b4a3375f1401014bd302628` |

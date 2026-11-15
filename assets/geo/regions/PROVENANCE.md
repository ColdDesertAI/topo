# Italiaanse regio’s — BL-019

## Bron en rechten
- **Natural Earth**, `ne_10m_admin_1_states_provinces.geojson`, release **5.1.2** (admin-1 dataset component 5.1.1), Git-tag `v5.1.2`, revisie **`f1890d9f152c896d250a77557a5751a93d494776`**.
- Immutable URL: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/f1890d9f152c896d250a77557a5751a93d494776/geojson/ne_10m_admin_1_states_provinces.geojson
- Volledig upstream bestand SHA256: **`22d0e3ad85eb3e27f17cabf8ba2d50e554fbc27a87796ff891d958185da62fb5`**.
- Licentie: **public domain**; expliciet toegestaan voor persoonlijk, educatief én commercieel gebruik, inclusief aanpassingen en verspreiding. Geen verplichte naamsvermelding. Voorwaarden gecontroleerd 15 november 2026: https://www.naturalearthdata.com/about/terms-of-use/ . Vrijwillige credit: **Made with Natural Earth**.
- Gecomprimeerd, offline bronextract `source.geojson.gz`: de 110 features met `adm0_a3 === 'ITA'`, volledige oorspronkelijke geometrie, uitsluitend properties `adm1_code`, `region_cod`, `region`. SHA256 gzip: **`c0b1384f5a3b4c418ccfd5ef1df65f3ae383f97daffd7b3599aa94b0ed924c02`**. Geen coördinaten geschaald, gesimplificeerd of verzonnen in dit extract. Ontbrekende actuele provinciewijzigingen beïnvloeden de twintig regiogroepen niet.

## Projectie en verwerking
`x = 55 * longitude - 225.5; y = 3830.75 - 77 * latitude`, via dezelfde `project` als `scripts/geography/lakes.mjs`; viewBox **0 0 890 1235**. Geen affine extra verschuiving, gespiegeld land of rek.

1. Provincies samenvoegen op de upstream `region_cod` (20 ISO 3166-2-regiocodes); Italiaanse en Nederlandse regionamen expliciet normaliseren in het bouwscript.
2. Alle regio's in één topologisch netwerk vereenvoudigen met Douglas–Peucker, maximaal **0,35 app-px**, `planar keep-shapes`. Gedeelde bogen worden eenmaal vereenvoudigd.
3. Overlay met de bestaande `const italy` uit `index.html`, zonder dat bestand te wijzigen. Canonieke pad-SHA256: **`d0ae7bbf931af162143fb2b90d39c64aed1d3e01dd9bf627740659534070db31`**. Dit is de bestaande Natural Earth 50m onderwijsomtrek, niet een nieuwe nauwkeurigheidsclaim voor kadastrale grenzen.
4. Alleen vlakken binnen die canonieke landmasker-overlay behouden. Slivers tussen 10m-bron en 50m-appkust toekennen aan de regio met de langste gedeelde grens. Het script meldt de aantallen; losstaande vlakken zonder buurgrens stoppen de bouw in plaats van een eigenaar te raden. Er worden geen punten verplaatst. Het canonieke San Marino-gat blijft een gat; Vaticaanstad is in deze grove landmaskerbron niet uitgespaard.
5. Opnieuw op regiocode samenvoegen; afronden op 0,01 px; `regions.json` sorteert op id. Gebruik het SVG-pad met **`fill-rule="evenodd"`**, zonder wit randstroke. Eventuele anti-alias-haarlijntjes op een renderer zijn geen geometrische gaten; de gemeenschappelijke grenzen zijn byte-identiek en tegengesteld gericht.

`regions.json` is het enige runtime-data-artifact; het gzip-bronextract en deze documenten zijn bouw/herkomstbestanden, geen UI-imports. De 60.000-byte-limiet geldt voor het volledige runtime-JSON, inclusief ids en beide namen.

## Reproductie en gereedschap

```sh
node scripts/geography/build-regions.mjs
node --test scripts/geography/regions.test.mjs
node scripts/geography/regions.test.mjs --rebuild
```

Node 25.8.2, npm en **Mapshaper 0.7.101** (uitsluitend bouwgereedschap; MPL-2.0) via `npx --yes mapshaper@0.7.101`. De eerste gereedschapdownload heeft netwerk nodig; geen wijziging aan package.json, package-lock.json of app-runtime. Een volgende run gebruikt dezelfde vastgepinde tool uit de npm-cache. Het bronextract is gebundeld, zodat datasetbeschikbaarheid geen bouwvoorwaarde is. npm package-integriteit: `sha512-h3uNgkr9Zu5fGBSn7+14kY8KhZjh387zoXLLoX1N74vow6v/l/zFwFEzdt/xNeHp4rlIhvSgcKEN12u/ORro5Q==`. Mapshaper documentatie: https://mapshaper.org/docs/reference.html .

De bouw gebruikt tijdelijke bestanden onder de OS-tempmap en verwijdert uitsluitend zijn eigen tempmap. Alleen `regions.json` wordt als uitvoer geschreven. De test met `--rebuild` vergelijkt een herbouw byte voor byte.

Download ter onafhankelijke broncontrole de immutable upstream URL en voer `node scripts/geography/build-regions.mjs --verify-upstream /pad/naar/ne_10m_admin_1_states_provinces.geojson` uit. Dit verifieert het volledige upstream-bestand én vergelijkt alle 110 ongewijzigde geometrieën/bronproperties met het gebundelde extract.

Uitvoer: **44.267 bytes**, SHA256 **`040964fee12f19f729ce1269767bd64e488d7cb484c36479ba6c46c69cfaabd2`**; 303 kust-/maskerslivers via gedeelde grenzen aangesloten.

## ITEMS: acceptatiebeperking, geen vervalste 45/45

De koppeltabel `item-regions.json` classificeert alle 45 bestaande IDs zonder de ankers te kopiëren of aan te passen:
- **32** ankers liggen strikt binnen de verwachte regio. Bij rivieren en schematische gebieden gaat dit over het bestaande anker, niet de volledige feature; de Po en Apennijnen beslaan meerdere regio's.
- **Venetië** hoort bij Veneto, maar het echte bestaande anker ligt circa **2,54 px buiten** de grove app-landmaskerbron (lagune). De test benoemt dit als `coastal-source-exception`, controleert Veneto en afstand ≤3 px, en telt dit niet als strikte insluiting.
- **12 niet-toepasselijke items:** vijf zeeën, vijf buurlanden, San Marino en Vaticaanstad krijgen `regionId: null` en een reden. Microstaten zijn onafhankelijke staten, geen Italiaanse regio's; een grof landmasker maakt ze niet Italiaans.

Daarom is de letterlijk gevraagde **45/45 geografische insluiting onmogelijk** zonder onjuiste grenzen/koppelingen. Deze semantiek is expliciet ter bevestiging voorgelegd aan de opdrachtgever. De branch levert de geometrie en controleerbare uitzonderingen; de strikte 45/45-acceptatie wordt niet als behaald gerapporteerd.

## Vastgelegde verificatie (15-11-2026)
- Gerichte regiocontroles met `--rebuild`: **7/7 PASS**; alle 20 regio's ook met onafhankelijke binnenpunten uit de originele provincies getoetst.
- Overlay/landmasker: maximale gemeten scanline-afwijking **0,00334 px**; gedeelde grenzen vallen exact samen, geen gevonden zelfkruisingen, regionale overlap of zichtbare gaten.
- Symmetrische afstand van de gehele buitenrand én het canonieke San Marino-gat: gemeten **0,00669 px**; conservatieve bovengrens **0,25669 px** (bemonstering ≤0,5 px en 1-Lipschitz-afstandsfunctie). Ruim onder 3 px.
- Upstream SHA256 en alle 110 brongeometrieën afzonderlijk vergeleken: **PASS**. Herbouw-SHA256 bytegelijk aan hierboven.
- Losse render in drie tinten visueel geïnspecteerd; geen UI-integratie of app-screenshots toegevoegd.
- `npm run build` bewust **niet uitgevoerd**: de bestaande opdracht herschrijft `index.html`, wat de harde taakgrens zou schenden. De gerichte databouw is wel uitgevoerd. `scripts/v3/`, `index.html` en `src/v2/` blijven bytegelijk aan de branchbasis.
- Bevestiging van de item-uitzonderingssemantiek en de letterlijke 45/45-acceptatie blijven **OPEN**; groene technische tests betekenen geen 45/45-insluitingsclaim of releaseakkoord.
- `npm run lint`: **PASS**; bestaande volledige `npm test`-set: **PASS (exit 0)**. De nieuwe regiocontroles zijn bovendien aan `npm test` toegevoegd en afzonderlijk inclusief herbouw gedraaid. Bestaande lokaal geïnstalleerde jsdom-dependencies zijn tijdelijk hergebruikt, zonder dependencywijziging in deze branch.

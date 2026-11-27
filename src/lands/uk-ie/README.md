# UK-01 — Verenigd Koninkrijk en Ierland (spoedmodule)

**Status: draft.** Oefenmodule voor de overhoring van di 1 december 2026 (besluit Dennis 27-11). Contract: `ops/contracts/UK-01.md`.
Live-pad na G4: `/vk-ierland/` (niet gelinkt vanuit het portal). Raakt Italië, `index.html` en het portal niet.

## Inhoud
- `items.draft.json`: exact de 44 items van het schoolblad (18 steden, 5 eilanden, 1 gebergte, 1 streek, 11 landen, 6 zeeën, 1 rivier, 1 meer), met de code van het blad (1–18, a–r, A–H), Engelse naam als displaydata en reviewpunten.
- `route.draft.json`: 12 hoofdstukken van 3–5 items. Steden zijn op ligging gegroepeerd, niet in bladvolgorde.
- `geo.json`: geprojecteerde kaart en doelvormen, gegenereerd door `scripts/land/uk-ie-geo.py` uit Natural Earth 10m (public domain, SHA256 in het bestand). Zeezones en de Schotse Hooglanden zijn met de hand begrensd en daarna met land afgesneden (`handmade`).
- `app/`: de module (HTML, CSS, JS). `scripts/land/uk-ie-build.mjs` maakt er één offline bestand van; `build-site.mjs` zet dat op `dist/vk-ierland/`.
- `bron/`: verkleinde kopie van het blad (lijst en leerkaart). Alle 7 originele foto's staan met SHA256 in `items.draft.json`.

## Keuzes en open punten (voor Dennis)
1. **Glasgow heeft op de leerkaart geen stip** (17 stippen, 18 steden). In de module staat Glasgow op de echte plek.
2. **Skye** staat op het blad onder *Streken*, maar is een eiland. Type volgt het blad.
3. **Orkney/Shetland eilanden**: het blad schrijft los; `Orkneyeilanden` en `Shetlandeilanden` worden ook goed gerekend.
4. **Spelling**: hoofdletters vrij, accenten verplicht (`Belgie` is fout, met hint). Engelse namen (`London`) tellen niet.
5. **Hebriden** = Buiten- en Binnen-Hebriden zonder Skye; een tik op Skye telt dus niet als Hebriden.
6. Kaartkleuren volgen het blad; de proefoverhoring gebruikt een grijze kaart, zoals bij de overhoring.

## Controle
`npm run test:uk-ie` (data, geometrie, spelling, en een browserronde met touch op 1080×810, 810×1080 en 1440×900).

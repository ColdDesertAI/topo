# BL-046 nulmeting (vóór de fix)

Meting: `node scripts/qa-v3-aanwijzen-bereik.mjs` op `a444800` (V3-preview-build, demo-staat `#alles`, route-les *Aanwijzen* van alle 11 hoofdstukken, 45 vragen). Reikbaar = de tap-resolver (`mapTapCandidates`, de hit-zone) geeft de plek én `elementFromPoint` is de kaart, niet het paneel. WebKit = WebKitGTK via WebDriver, zonder touch-emulatie (de Focus-layout hangt aan breedte, niet aan pointer).

| Formaat | Browser | Bereikbaar | Unieke paneelposities | Italië onder paneel (max) | Niet bereikbaar | Uitslag |
|---|---|---|---|---|---|---|
| 1080×810 | Chromium (touch) | 42/45 | 1 | 9,2% | Catania, Sicilië, Etna | FAIL |
| 1080×810 | WebKit | 42/45 | 1 | 9,2% | Catania, Sicilië, Etna | FAIL |
| 810×1080 | Chromium (touch) | 44/45 | 1 | 7,3% | Catania | FAIL |
| 810×1080 | WebKit | 44/45 | 1 | 7,3% | Catania | FAIL |

Lezing: het paneel staat al op één vaste plek (criterium 2 is nu al gehaald), maar het ligt over het zuiden (criteria 1 en 3 falen). Het gemeten percentage (vulling van de Italië-vorm onder het paneel, 70×70 raster) is lager dan Hermes' 18,8%/12,2%, omdat dat een andere maat was; de doelplekken zijn dezelfde.

Desktop-referentie (criterium 5): 1440×900, 3 lessen × 2 vragen, vaste seed, in de scratchpad (`bl046-before/`).

## Na de fix (commit "BL-046: ...")
Alle vier PASS: 45/45 bereikbaar, 1 paneelpositie, 0,0% Italië onder het paneel (Chromium en WebKit, 1080×810 en 810×1080). Dezelfde run controleert ook dat het paneel niets afkapt (onbeantwoord en na een fout antwoord met de langste plaatsnaam). Desktop 1440×900: 0,000% pixelverschil (6 screenshots). Namen schrijven: paneelrect en Volgende identiek vóór/na op 1080×810, 810×1080, 1180×820, 768×1024.

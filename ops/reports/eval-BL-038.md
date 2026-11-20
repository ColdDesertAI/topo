# Evaluator BL-038: iPad-portret op Menu 1-niveau

**Pin:** main `abb6a93` (live) · werkboom op `ab74d11` + niet-gecommitte BL-037.5-wijzigingen (alleen exit-knop, niet actief in de preview via file://; CSS breidt alleen selectors uit). Preview opnieuw gebouwd (`node scripts/build-v3-preview.mjs`). Live gecontroleerd op https://www.ninotopo.nl/italie/ met het seed-profiel (810×1080 en 768×1024).
**Niet opnieuw gedraaid (al groen volgens opdracht):** volledige `qa-v3-menu1.mjs` (incl. 810×1080, 768×1024, BG-01/02/03), `qa-v3-fade.mjs` Chromium + WebKit, `npm test`, smoke, build:site.
**Eigen metingen:** Playwright-scripts en screenshots in `/tmp/claude-0/-home-user-topo/0568f8e3-09c7-59a3-9424-2da44b974a18/scratchpad/eval38/` (`a.mjs`–`g.mjs`, `s/*.png`).

VERDICT: PASS

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | mapShare ≥ 25%, kaartvlak ≥ 45% (Reis, hoofdstuk) | qa-v3-menu1 (aangeleverd) + eigen meting | PASS | live mapShare 0,331/0,307; Italië-box 810: 446×548 = 0,28 van 810×1080; QA-check kaartvlak ≥ ,45 zit in de groene matrix |
| 2 | Genummerde hoofdstukpins + Nino-Vespa in portret | browser | PASS | 11 `.v3Marker` (1–11), actieve pin 49 px vs 30 px, `.v3MarkerNino` naast de actieve pin; screenshots `ov-810.png`, `live-ov-768.png` |
| 3 | Niets afgesneden, niet breder dan het scherm, geen overlap | qa portret + eigen meting | PASS | scrollWidth = breedte op alle portretschermen, incl. les, lesresultaat, #rit en na draaien; 0 elementen buiten beeld |
| 4 | Knoppen ≥ 44 px, zijbalk bereikbaar | qa portret | PASS | rijen 11×44 px, geen interne scroll (scrollHeight−clientHeight = 0); schakelaar/terug 44 px; primaire knop 52 px |
| 5 | AA ≥ 4,5:1 vrije tekst | qa portret BG-01/02/03 (aangeleverd) | PASS | matrix 0 fouten (niet opnieuw gedraaid) |
| 6 | Toets-start, chips, Oefenen-start binnen beeld | browser | PASS | 810: start 980–1032, chips tot 964/972 (< 1080); 768: start 924–976, chips tot 908/916 (< 1024) |
| 7 | Lesbalk niet over de zijbalk | browser + overlap | PASS | rail 20–96, lesbalk 120–766 (810) / 120–724 (768): 0 px overlap; resultaatkaart 116–648 onder de balk (44–104) |
| 8 | Liggend en desktop ongewijzigd | volledige matrix (aangeleverd) + eigen pixelvergelijking | PASS | build `de45777` (vóór BL-038) tegen huidige build: 1080×810, 1024×768, 1440×900, 1366×768 × {overzicht, hoofdstuk, oefenen, toets, beloningen, voortgang, les} = 28/28 screenshots **pixel-identiek** (#bezig). Enige bedoelde wijziging liggend: pinplaatsing in #afgerond/#alles (P1 pin 2) |
| 9 | Blur ≤ 3 per scherm | qa portret + eigen telling | PASS | portret op alle schermen 1 blur (`v3Side::after`); `.v3Counts` backdrop-filter `none` |

**Design-P1's (design-BL-038.md)**
| P1 | Resultaat | Bewijs |
|---|---|---|
| Tellers zonder rechthoek | PASS | `.v3Counts`: backdrop-filter none, achtergrond transparant; alleen de twee witte pillen zichtbaar |
| Tellers rechtsboven | PASS | live 810: 555,16 → 790,64 (top 16, rechts 20); 768: 513,16 → 748,64 |
| Onderlijn H−20 (overzicht) | PASS | lijst eindigt op 1060 (810) / 1004 (768); schakelaar Schoolblad/Schoolkaart–Reliëf in het vrije blok, 24 px onder de knop (822 → 846) |
| Hoofdstukpagina: vrij blok boven, onderranden gelijk | PASS | kicker-top 816 = lessenkaart-top 816; primaire knop eindigt 987 bij lessenkaart 992; "← Hoofdstukken" en schakelaar beide 1060 = H−20 (768: 1004) |
| Nino op Beloningen | PASS | `.v3RewardsNino` 173×260 (juichende pose, zelfde asset als lesresultaat), onder "Open Reisboekje"; live ook aanwezig |
| Antwoordblad binnen de kaart | PASS | 810: blad 148–738 × …–1020 binnen kaart 120–766 × …–1036 (28 px links/rechts, 16 px onder); 768: 148–696/964 binnen 120–724/980. Vóór BL-038: 193–713/1068 (eronder uit) |
| Pin 2 zichtbaar in #afgerond/#alles, ook liggend | PASS | min. pinkopafstand 41–53 px in alle staten op 810×1080, 768×1024, 1080×810, 1024×768, 1440×900; pin 2 zichtbaar op screenshots `pins-afgerond-810.png`, `pins-alles-1080.png` |

**Extra controles**
- Les in portret (kaart, lesbalk, lesresultaat): in orde, geen fouten (`les-810.png`, `lesres-768.png`).
- Vespa-rit #rit in portret: kaart met lijn en Nino op de Vespa, kaart `v3RitCard` binnen beeld (810: 145–665 × 843–1015), geen paginafouten.
- Draaien portret → liggend → portret (overzicht, hoofdstuk, les, oefenen, toets, beloningen, voortgang): geometrie na terugdraaien gelijk aan vers laden; oefenen/toets/beloningen/voortgang pixel-identiek na terugdraaien; les liggend na draaien = vers liggend geladen (ook in de oude build).
- Live (abb6a93) = preview voor alle gemeten waarden (tellers, lijst, knop, schakelaar, Nino, antwoordblad).

FAIL-redenen: geen.

Buiten scope opgemerkt (→ backlog-idee):
- P2: hoofdstukpagina: 28 px tussen voortgangsbalk en knop, overzicht 20 px (design vroeg 24 op beide). Gelijktrekken.
- P2: Beloningen is twee kolommen (contract zei één kolom); design-critic liet dat toe mits Nino terugkwam. Nino eindigt op H−40, niet H−20.
- P2: pin 9 (Landen) springt bij draaien van Kroatië (portret) naar Frankrijk/Zwitserland (liggend), naast het al gemelde pin 3-gedrag.
- Bestaand, liggend (ongewijzigd door BL-038): in de les op 1080×810 hangt het antwoordblad 24 px onder de kaartkaart (blad tot 798, kaart tot 774) en bedekt het Zuid-Italië. Hetzelfde patroon dat in portret nu is opgelost.
- Alleen de preview: in het lesresultaat op 768×1024 staat de demobalk onderaan over de ?-knop van de rail.
- BL-037.5 (in de werkboom, nog niet gecommit) voegt een vierde voetknop toe aan de rail; in portret (rail tot H−20) opnieuw meten zodra die landt.

Les: vergelijk "liggend ongewijzigd" met een build van de commit vóór de taak (git worktree + pixel-diff) in plaats van alleen de QA-matrix: dat is goedkoop en geeft hard bewijs.

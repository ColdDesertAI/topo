# Evaluatie BL-031a — Voortgang-kaart één keer bouwen en hergebruiken

Evaluator (Opus), 22-11-2026 02:32–03:05, branch `night/2026-11-22`, bouwcommit `9525f900`, basis `7f151c64`.
Alles zelf gedraaid. 'Voor' = preview van de huidige build met alleen `scripts/v3/voortgang.js` vervangen door de versie uit `7f151c64` (`$TMPDIR/evbl031a/old.html`). Dat is gelijkwaardig aan een build op de basis, want tussen de twee commits verschilt in de buildbronnen alleen `voortgang.js`. Geen worktree, geen broncode gewijzigd, `git status` schoon na alle builds.

VERDICT: FAIL

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | Zelfde node na wissels | `qa-v3-vgmap.mjs` (#alles/bg03, #afgerond/bg01, 1080×810, 5× Reis→Voortgang) + eigen script met teller op `V.cloneMap` | PASS | `zelfde node, 1 svg.v3VgMap` in beide staten. Eigen teller: `cloneMap(...,'v3VgMap')` over 6 bezoeken: oud 6×, nieuw 1×. Kaart wordt niet al bij het opstarten gebouwd (0 `svg.v3VgMap` vóór het eerste bezoek). |
| 2 | Geen achtergebleven statusklassen | Planten `v3St-beheerst v3Hit` op `water-A` (#afgerond, status nog), wissel | PASS | `geplante klasse weg op water-A; aantallen = legenda`. Eigen script: per `data-id` de set `v3Hit/v3StLine/v3St-*` is na 5 wissels (nieuw) gelijk aan die na het eerste bezoek (oud), voor #afgerond, #alles en #bezig (45 ids). |
| 3 | Statussen na 1× en 5× | `qa-v3-vgmap.mjs` + eigen mapping-vergelijking | PASS | #alles `{beheerst:45,bezig:0,nog:0}`, #afgerond `{23,0,22}`, 1× = 5× = legenda. Mapping per id oud = nieuw (zie crit. 2). |
| 4 | Geen beeldverandering | `--phase=voor` op oude build, daarna vergelijking op nieuwe build, 3 maten × 2 staten, eerste render en na 3 wissels | PASS | 12/12 paren 0,000 % afwijkend; de PNG's na 3 wissels zijn zelfs byte-identiek aan 'voor'. Controle dat de detector echte verschillen ziet: de screenshots van afgerond en alles verschillen. Screenshot 1440×900 #afgerond na 3 wissels bekeken: kaart, legenda (23 / 0 / 22) en paspoort zijn gelijk aan vóór. |
| 5 | Fit na formaatwissel | 1080×810 → Reis → 810×1080 → Voortgang vs een verse lading op 810×1080 | PASS | rect max 0,0 px, viewBox `107 173.4 716.3 864.4` op beide |
| 6 | Wissel naar Voortgang sneller | `qa-v3-menu1.mjs --fps` 3× oud en 3× nieuw, afwisselend (`QA_SIZES=1080x810 QA_BGS=bg03`; de fps-functie zelf is gelijk aan die in het contract) | **FAIL** | 'naar voortgang', mediaan oud → nieuw: fps **13,3 → 11,9**, longestMs **417 → 500** (eis ≤ 50 % = ≤ 208 en fps hoger). Afzonderlijke runs: oud 12,0/14,4/13,3 fps, 367/417/467 ms; nieuw 11,9/11,7/14,2 fps, 500/483/500 ms. Overige wissels (mediaan oud → nieuw): hoofdstuk 15,1 → 14,9 · oefenen 11,1 → 12,0 · toets 8,3 → 9,2 · rewards 13,1 → 13,4 · scroll 14,5 → 14,9: geen daling > 3 fps. ≥ 50 fps: nee, nergens (alle wissels 8–17 fps bij CPU 4×). |
| 7 | Geen groeiende listeners | CDP `DOMDebugger.getEventListeners`, 1× vs na 5× wisselen | PASS | gelijk: `document.keydown 3, document.resize 0, window.keydown 2, window.resize 6` |
| 8 | Regressie Voortgang/paspoort | `qa-v3-paspoort.mjs` en `qa-v3-menu1.mjs --smoke` | PASS | paspoort: `0 fouten`, exit 0; smoke: `OK: geen fouten`, exit 0; 0 pageerrors (beide scripts tellen pageerrors als fout) |
| 9 | Build en tests | lint · `npm test` (8 GB) · `build-v3-preview` · `npm run build && SITE_ITALIE=v3 npm run build:site` | PASS | alle exit 0; `Site-check: OK`; geen tracked diff daarna |
| UI | Geen afgesneden/overlappende tekst | paspoort-QA + smoke (overlap) + eigen `scrollWidth`-meting legenda/kaarttitel, 3 maten × 2 staten | PASS | 0 overflow, 0 overlap; beeld identiek aan vóór (crit. 4) |
| UI | Contrast en lettergrootte | eigen meting legenda (`.v3VgLegend li span`) en kaarttitel | PASS | kleinste letter 13 px (1080×810, 810×1080), 14 px op 1440×900; laagste contrast 5,32:1 (810×1080, legenda op `#e9e4da`), elders 6,64:1, titel 11,6–14,5:1 |

## FAIL-redenen (concreet, reproduceerbaar)
1. **Crit. 6 haalt de eis niet, en kan die met deze meetmethode ook niet halen.** `qa-v3-menu1.mjs` `fps()` (r. 156–157) bezoekt Voortgang precies één keer per pagina, na hoofdstuk → oefenen → toets → rewards. Dat is altijd het eerste bezoek, dus de kaart wordt dan ook in de nieuwe code gebouwd. De cache kan dit getal niet verbeteren. De lichte verslechtering (417 → 500 ms) ligt binnen de spreiding tussen runs (367–500 ms), en de eerste render is functioneel gelijk. Ik zie dit dus als ruis, niet als regressie. Reproduceer: alternerend `QA_HTML=file://$TMPDIR/evbl031a/old.html` resp. de standaardpreview met `QA_SIZES=1080x810 QA_BGS=bg03 node scripts/qa-v3-menu1.mjs --fps`.
2. **De aanname in het contract klopt niet: het kopiëren van de kaart is niet de lange frame.** Gemeten bij CPU 4×:
   - `V.cloneMap('v3v-',…)` + `addIsland` kost **1–9 ms** (236 elementen).
   - Een trace van het bezoek aan Voortgang (alles/bg03) laat zien dat de tijd vooral in **PrePaint ≈ 370–400 ms** gaat, met daarnaast FunctionCall 114–178 ms en UpdateLayoutTree 51–70 ms. PrePaint geldt voor oud én nieuw, bij het eerste en bij een herhaalbezoek.
   - Bij een herhaalbezoek scheelt de cache ongeveer 10–15 ms JS (FunctionCall 129 → 114). De langste frame bij een herhaalbezoek (mediaan van 3) ging van 483 → 417 ms bij het tweede bezoek en van 433 → 417 ms bij het derde. Dat is 4–14 %, niet de ~30 % die de bouwer meldt, en ver van ≤ 50 %.
   - De bewering van de bouwer ("rest zit in stijl/layout/paint") klopt in grote lijnen. Preciezer: het meeste zit in **PrePaint** (opbouw van de paint-property-trees en invalidatie), niet in Layout of Paint zelf.

## Hersteladvies
- **Een herstel binnen de toegestane bestanden (`voortgang.js` r. 58–65 en het QA-script) is niet realistisch.** Wat daar te winnen viel (de kloon, ~1–10 ms plus wat JS) is gewonnen. De langste frame van ~400–500 ms ontstaat in PrePaint en komt van CSS/opbouw van het hele Voortgang-scherm (relief-kaart, filters/masks/backdrop-filter, de paspoortlijst). Dat valt buiten de scope (CSS, `reis.js` en de backdrop-filters zijn uitgesloten).
- **Advies:** de code van BL-031a kan blijven staan. Alles behalve crit. 6 is PASS: geen regressie, geen beeldverandering, geen lek. Het is een kleine, veilige verbetering voor herhaalbezoeken. Het contract moet bijgesteld worden in plaats van dat er doorgebouwd wordt:
  (a) laat crit. 6 vallen of herformuleer het als 'herhaalbezoek niet trager, cloneMap 1× per sessie' (aangetoond), en markeer BL-031a als klaar met de opmerking dat de prestatiedoelstelling niet gehaald is; of
  (b) laat het als FAIL staan en neem het doel mee in BL-031, met een nieuwe aanname: **PrePaint van het Voortgang-scherm**. Daarbij een meetmethode die eerste én herhaalbezoek meet, en een trace per categorie (PrePaint/UpdateLayoutTree/FunctionCall) als nulmeting.
  De keuze ligt bij de hoofdsessie/Dennis. Een merge hoort niet bij deze nachtrun.

## Buiten scope opgemerkt (→ backlog-idee)
- Alle schermwissels draaien op deze machine bij CPU 4× op 8–17 fps, ook met de oude code. De nulmeting in het contract (BL-029: 25–38 fps) is hier niet reproduceerbaar, dus er is een nieuwe nulmeting op vaste hardware nodig. 'naar toets' heeft de langste frame van allemaal (≈ 770–820 ms).
- `qa-v3-menu1.mjs --fps` meet alleen het eerste bezoek per scherm. Voeg een herhaalbezoek toe (BL-031).
- `vgMap` blijft de hele sessie staan. Als de bronkaart in een sessie verandert (ander land, andere kaartdata zonder herladen), toont Voortgang een verouderde kopie. Nu niet aan de orde (één land), wel noteren voor `NIEUW_LAND`.
- Proces: de bouwcommit bevat code, QA-script, `ops/BACKLOG.md` en het contract samen. Het contract vroeg om één commit voor de code en één voor het QA-script. In BACKLOG staat BL-031a nog op 'bezig'.

## Les
Controleer bij een prestatiecontract eerst met één goedkope meting (de functie timen en één trace per categorie) of de veronderstelde kostenpost de lange frame ook echt is, en of de voorgeschreven meetmethode de verbetering kan zien (eerste bezoek vs herhaalbezoek). Hier waren beide aannames onjuist: de kloon kost < 10 ms, de frame zit in PrePaint, en `--fps` meet alleen het eerste bezoek.

Meetbestanden (tijdelijk): `$TMPDIR/evbl031a/` (fps-{old,new}-{1,2,3}.json, repeat.log, screenshots vg-*.png, logs).

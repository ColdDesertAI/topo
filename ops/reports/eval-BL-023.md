# Evaluatie BL-023: CSS opruimen zonder beeldverandering (glas2 + kaart + reis2 → ui.css)

Branch `claude/nightly-pr99-kaart-feestje-fvpl06`. BL-023-commits: `eba123b`, `e1073d5`, `e1c06bb`, `8c44f11`. Daarop volgt `76cbad9` (functioneel, BL-016d/e). Ik heb vier builds gemaakt, elk in een eigen worktree (`git worktree add --detach`, `node scripts/build-v3-preview.mjs`):
- `d6c414c`: contract-HEAD, de baseline uit de opdracht;
- `785b450`: de directe ouder van `eba123b`. Dit is de zuivere baseline, want tussen `d6c414c` en `eba123b` zit `785b450`, een functionele JS-wijziging die de stappenlijst onder 1024 px weghaalt;
- `8c44f11`: na BL-023;
- `ab3b3ed`: HEAD.

Screenshots in Chromium headless (Playwright). Pixelvergelijking via canvas: een pixel telt als afwijkend als één kanaal verschilt. 26 toestanden × 4 formaten = 104 paren per vergelijking. De toestanden:
- Reis-overzicht: `#bezig`, `#alles` en `#nieuw`, op BG-03 en BG-01;
- hoofdstukpagina: via `.v3BarGo` op BG-03 en BG-01, Eilanden (`#alles`, rij 5) en vergrendeld (`#bezig`, rij 5) op BG-03 en BG-01;
- Oefenen, Toets, Beloningen en Voortgang, plus Voortgang gescrold (700 px), Oefenen/Beloningen/Voortgang in `#bezig`;
- de les (de eerste primaire knop) en het Instellingen-sheet;
- reduced transparency (CDP `prefers-reduced-transparency: reduce`) op Reis, het hoofdstuk, Voortgang en Beloningen;
- `prefers-contrast: more` op Reis en Voortgang.

Ruisbasis: dezelfde build (`8c44f11`) heb ik twee keer gefotografeerd.

VERDICT: FAIL

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | Pixel-identiek (anti-aliasing ≤ 0,05%, per geval verklaard) | 104 paren `785b450` ↔ `8c44f11`, plus 104 paren `d6c414c` ↔ `8c44f11`, plus de ruisbasis `8c44f11` ↔ `8c44f11` | **FAIL** | `785b450` ↔ `8c44f11`: 98/104 identiek. **`les-1440`: 4,94% van de pixels anders (64 036 px, max Δ 213, bbox 276,99–1359,374).** Bij één run (ruisbasis) verschilt alleen de vraagtekst (de vraag is willekeurig, 2 320 px). Het verschil is echt. In de les vanaf een breedte tussen 1180 en 1279 px (getoetst: 1024/1180 gelijk, 1279/1280/1440 anders) krijgt `.focusCameraTools` ("Heel Italië / Zoom op hoofdstuk") een wit blurvlak (`rgba(255,255,255,.74)`, `blur(20px) saturate(1.6) brightness(1.06)`, ring). `.v3LesSteps` (Ontdekken/Aanwijzen/Namen schrijven) krijgt een grijze track (`rgba(42,36,64,.05)`). Vóór BL-023 waren beide transparant. De rest is ruis: `les-390/810` (willekeurige vraag, zelfde bbox als de ruisbasis), `nieuw-bg03-1080` (5 px, Δ 1), `rt-rewards-1440` (53 px, Δ 5, ook in de ruisbasis), `ct-voortgang-810` (173 px = 0,02%, Δ 4, actief navigatie-icoon, computed styles identiek, tussen runs niet stabiel). `d6c414c` ↔ `8c44f11`: 62/104 identiek. De extra verschillen op 810 en 390 (Reis, hoofdstuk, nieuw, Instellingen, rt/ct-Reis, 21–38%) komen van `785b450` (de lijst lekt niet meer). `785b450` ↔ `8c44f11` is daar identiek. |
| 2 | Glascheck groen | `node scripts/qa-v3-glas2.mjs` op de `8c44f11`-build (en op HEAD) | PASS | Beide: `surfacesChecked 207, alphaFails 0, sideFails 0, contrastFails 0, reducedFails 0`, exit 0. Let op: glas2 telt de les niet op de blur en zag de extra blur op `.focusCameraTools` dus niet. |
| 3 | Minder `!important`, met een getal | `grep -o '!important'` | PASS | `d6c414c`: glas2 36 + kaart 10 + reis2 327 = **373**. `8c44f11`: ui.css **41** treffers, waarvan 1 in een commentaar (regel 5), dus **40** declaraties. HEAD (`76cbad9`): 44 declaraties (+4 Voortgang-regel). |
| 4 | Drie bestanden worden één | `ls scripts/v3`, de build | PASS | Op `8c44f11` zijn `glas2.css`, `kaart.css` en `reis2.css` weg en is er alleen `ui.css` (369 regels). `build-v3-preview.mjs` laadt `ui.css` na `ronde5b.css`, op de oude plek. Er zijn geen andere verwijzingen naar de oude bestanden in scripts/tests. Twaalf blokken met koppen in de volgorde van het contract, met de besluiten erbij (BL-016/016b/016d/016e, BL-014). |
| 5 | Lint en test | `npm run lint`; `NODE_OPTIONS=--max-old-space-size=6144 npm test`, in de `8c44f11`-worktree (en op HEAD) | PASS | lint exit 0. test exit 0, alle suites `# fail 0`. Op HEAD hetzelfde. |

FAIL-redenen (concreet, reproduceerbaar):
1. **Beeldverandering in de les vanaf ±1200 px breed** (1279, 1280 en 1440 anders; 1024 en 1180 gelijk), ingevoerd in `e1073d5`. Daar ging `!important` weg uit
   `body.v3Les .focusCameraTools{background:transparent;-webkit-backdrop-filter:none;backdrop-filter:none;box-shadow:none}` en
   `body.v3Les .v3LesSteps{background:transparent}` (`ui.css:313–314`).
   Die regels verliezen nu van een oudere laag, en de hoofdsessie heeft dat gemist.
   Reproduceren: build `785b450` en `8c44f11`, 1440×900, `#bezig/bg03`, klik `.v3BarGo` en daarna de eerste zichtbare `.v3Btn.primary`. Vergelijk de knoppengroep linksboven op de kaart en de stappenbalk onder de titel.
   Gevolg: één extra blurvlak in de les, glas op glas (een blurvlak op de kaart), en een track die er eerder niet was.
   Nodig: zet `!important` op die twee regels terug, of geef ze een specificiteit die wint. Herhaal daarna de pixelvergelijking met de les erin op 1440 en 1280. Volgens het stopcriterium van het contract gaat dit terug naar de laatste identieke stap voor deze regels.
   HEAD (`ab3b3ed`) heeft dezelfde fout. Gemeten: `.focusCameraTools` heeft op HEAD nog `backdrop-filter: blur(20px)…`.

Buiten scope opgemerkt (→ backlog-idee):
- De baseline in de opdracht (`d6c414c`) is geen zuivere voor/na. Tussen `d6c414c` en `eba123b` zit `785b450` (een JS-wijziging), en die verandert Reis op 810 en 390 met 21–38%. De bewering "48 paren pixel-identiek tussen `d6c414c` en `8c44f11`" klopt dus alleen als de geteste toestanden op 810/390 de hoofdstukkaart niet tonen. Neem bij een vervolg (ronde 2 van BL-023 of de opruiming van de oudere lagen) als baseline altijd de directe ouder van de eerste refactorcommit, en neem de les op 1440 op in de vaste set.
- `76cbad9` voegt de Voortgang-regel toe als los blok ná "12. Minder transparantie", met 4 nieuwe `!important`. Verplaats die naar blok 8 (Voortgang) en blok 12, anders verwatert de ordening die BL-023 net aanbracht.
- glas2 meet de les niet op het aantal blurvlakken en ook niet op glas op glas. Een telling van de blur per scherm, inclusief de les, had deze regressie gevangen.

Les: "`!important` weg waar geen oudere laag meer wint" moet je per regel met beeld toetsen, op elk breakpoint van die oudere lagen. Een oudere laag met een media query (hier in de les, ergens tussen 1180 en 1279 px) wint pas boven die breedte. Toetsen op 1080 en 810 bewijst dus niets voor 1440.

## Ronde 2

HEAD `25b3e4a` (herstel `1ec91ff`, `7568d47`, `25b3e4a`). Ik heb drie builds gemaakt, elk in een eigen worktree (`git worktree add --detach`, `node scripts/build-v3-preview.mjs`, alle drie exit 0):
- `785b450`: de zuivere baseline, de directe ouder van de eerste refactorcommit;
- `25b3e4a`: HEAD;
- **referentie**: `785b450` plus de functionele wijziging uit `76cbad9`, alleen in mijn scratch-worktree toegevoegd aan `reis2.css`. Concreet: de regel `.v3PanelLocked .v3StepList{opacity:.55}` is vervangen door de twee `.v3StepRow`/`.v3StepDot`-regels, en de twee Voortgang-mediablokken staan aan het eind. Zo is BL-023 los te toetsen van de bedoelde beeldwijziging in BL-016d/e.

Screenshots in Chromium headless. `Math.random` staat vast via een init-script (mulberry32, seed 42), zodat de lesvraag in elke run gelijk is. Formaten: 1440×900, **1280×800, 1279×800, 1180×820, 1024×768**, 1080×810, 810×1080 en 390×844. Er zijn 30 toestanden: de 25 uit ronde 1 plus `les-alles`, `les-bg01`, `rt-les` (de les in reduced transparency) en `hfst-eilanden-bg01`. Dat geeft 240 paren. Een pixel telt als afwijkend als één kanaal verschilt.

VERDICT: PASS

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | Pixel-identiek (anti-aliasing ≤ 0,05%, per geval verklaard) | 240 paren `785b450` ↔ HEAD. Daarnaast 80 paren referentie ↔ HEAD voor elke toestand die verschilde, plus een ruisbasis HEAD ↔ HEAD (twee runs) | PASS | **De les is overal identiek**: 32/32 paren (`les`, `les-alles`, `les-bg01`, `rt-les` × 8 formaten), ook op 1279, 1280 en 1440. De FAIL uit ronde 1 is opgelost. Het overzicht en de hoofdstukpagina op 1024/1180/1279/1280 zijn identiek, en Eilanden ook. `785b450` ↔ HEAD: 214/240 identiek. De 26 verschillen: (a) `hfst-locked` bg01/bg03 op 1024–1440 (0,35–0,51%, bbox = de stappenlijst) en (b) `voortgang-scroll` op ≥ 1024 (55–61%: de kaarten onder het overzicht zijn wit en zonder blur). Beide komen uit `76cbad9`, de bedoelde wijziging van BL-016d/e. **Referentie ↔ HEAD: alle `hfst-locked`- en `voortgang-scroll`-paren zijn identiek (0 px).** Dan blijft er 0–173 px over (≤ 0,02%, max Δ 5) op `rt-rewards`, `rt/ct-voortgang-810` (actief navigatie-icoon), `nieuw-bg03` en `reis-alles-bg01` (5–15 px, Δ 1). Dezelfde paren verschillen ook tussen twee runs van dezelfde HEAD-build, met dezelfde bbox en aantallen. Het is dus ruis, zoals in ronde 1. |
| 2 | Glascheck groen | `node scripts/qa-v3-glas2.mjs` op de HEAD-build | PASS | `surfacesChecked 207, alphaFails 0, sideFails 0, contrastFails 0, reducedFails 0, emptyViews 0`, exit 0. |
| 3 | Minder `!important`, met een getal | `grep -o '!important'`, met en zonder commentaar | PASS | Vóór (`785b450`): glas2 36 + kaart 10 + reis2 327 = **373**. HEAD `ui.css`: 71 treffers, waarvan 3 in commentaar, dus **68** declaraties. Het verloop: 40 (`8c44f11`), 44 (`76cbad9`, +4 Voortgang), 49 (`1ec91ff`), 56 (`7568d47`), 68 (`25b3e4a`). Dat is een daling van 82% ten opzichte van vóór. |
| 4 | Drie bestanden worden één | `ls scripts/v3`, de build, `grep` | PASS | Alleen `ui.css` (376 regels). `glas2/kaart/reis2.css` bestaan niet meer, en scripts/tests verwijzen er niet meer naar. De build laadt `ui.css` na `ronde5b.css`. Twaalf blokken in de volgorde van het contract, met besluitkoppen. De losse Voortgang-regel van `76cbad9` staat nu in blok 8 (en de reduced-variant in blok 12). Er staat niets meer na blok 12. |
| 5 | Lint en test | `npm run lint`; `NODE_OPTIONS=--max-old-space-size=6144 npm test`, in de HEAD-worktree | PASS | lint exit 0. test exit 0, 6 suites, alle `# fail 0` (62 tests). |

FAIL-redenen: geen.

Buiten scope opgemerkt (→ backlog-idee):
- De 77 paren van de hoofdsessie bevatten geen Voortgang gescrold. Die toestand verschilt met `785b450` (de bedoelde wijziging uit `76cbad9`) en hoort in de vaste set. Neem voor een vervolgstap een referentiebuild (baseline plus de bedoelde functionele wijzigingen) als vergelijkingsbasis. Dan moet het resultaat 0 px zijn, en hoeft niemand een verschil weg te verklaren.
- `7568d47` laat zien dat de JS-meting van de kaartreserve (een meetkopie van de hoofdstukbalk) afhangt van welke CSS-laag wint. Die koppeling is fragiel. Bij de opruiming van de oudere lagen (ronde2–5b, `*-ijk.css`) zitten de resterende 68 `!important` vooral in het Reis-overzicht en de hoofdstukpagina (blok 3/4). Die verdwijnen pas als de oudere regels voor `.v3Panel`/`.v3Actions` weg zijn.
- De glascheck telt nog steeds geen blurvlakken per scherm en ziet glas op glas in de les niet (zie ronde 1).

Les: vergelijk een refactor met een referentiebuild die de tussentijdse functionele commits al bevat. Dan is "identiek" letterlijk 0 px, en kan geen echte regressie zich verstoppen achter een "bedoeld verschil".

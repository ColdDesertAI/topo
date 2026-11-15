# Evaluatie BL-016e: Reis-regels naar Oefenen, Toets, Beloningen en Voortgang

Branch `claude/nightly-pr99-kaart-feestje-fvpl06`. Beoordeelde code `589abbf` (HEAD `536293e`, daarna alleen docs/.gitignore). Commits BL-016e: `2c52f7a`, `5dc831a`, `b386feb`, `589abbf`. Preview zelf gebouwd. Metingen in Chromium headless (Playwright): 1440×900 en 1080×810, BG-01/02/03, `#alles` en `#bezig`. Regressie op 810×1080 en 390×844 vergeleken met `c76f6f9`.

VERDICT: FAIL

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | De zijbalk is op alle 5 schermen identiek aan die van Reis (positie, maat, stijl) | DOM-meting van `.v3Reis>.v3Side`: rect, achtergrond, blur, radius, padding, woordmerk, portret, navigatie-items, tandwiel. Op 5 schermen × 2 formaten × 3 achtergronden | PASS | 1440: `[28,80,240,792]`, glas .60, blur-token, r 24, padding `24px 16px 16px`, TOPO 30/800, portret 208×188 (23,7% van de hoogte, radius 0, geen achtergrond), navigatie 16/600 en het actieve item 16/700 op `#ebe7fd`, tandwiel onder een lijn van 1 px. 1080: rail `[20,72,72,718]` (72 px), portret 48×48. Na weglating van `aria-current` geeft dat **één unieke set per formaat**. |
| 2 | Blur op ≤ 4 panelen per scherm | DOM-telling van alle elementen met `backdrop-filter`. Voor Voortgang ook tijdens het scrollen van `.v3View-voortgang` (stap 50 px), per stand de zichtbare panelen | **FAIL** (Voortgang) | Oefenen 2, Toets 2, Beloningen 4. **Voortgang heeft 6 panelen met blur** (zijbalk, titelbalk, kaart "Hoofdstukken", tegelstrook en twee secties onder de vouw: Toetsen en de lange sectie van 1963 px). In ruststand vallen er 4 in beeld. Na het scrollen zijn er **5 tegelijk zichtbaar**: 1440 bij `scrollTop` 50 (zijbalk, titelbalk 29 px, Hoofdstukken, strook, Toetsen) en 1080 bij `scrollTop` 300. Screenshot (niet in de repo): `/tmp/claude-0/-home-user-topo/0568f8e3-09c7-59a3-9424-2da44b974a18/scratchpad/shots/vg-scroll-1080.png`. De bewering "precies 4" van de hoofdsessie klopt alleen bij scrollTop 0. Het contract zegt "per scherm", en bij elke lezing komt de telling boven 4 uit. Ter info: scrollen in Voortgang met CPU 4× geeft **43,6 fps** (1440) en 52,0 fps (1080). |
| 3 | Geen frame of mist (`.v3Reis`-achtergrond en -schaduw, `body::before`) | computed style | PASS | Op alle schermen: `.v3Reis` achtergrond transparant, `box-shadow none`, `backdrop-filter none`, rand 0. `body::before` transparant, zonder filter. |
| 4 | Kaarten zonder paneel of kader eronder (Oefenen, Voortgang) | Elke voorouder van de kaart-svg tot `.v3Reis`, getoetst op achtergrond, schaduw, rand, outline en blur | PASS | Oefenen (`svg.v3OefMap`) en Voortgang (`svg.v3VgMap`): 0 voorouders met een vlak, op 1440 en 1080. Het goudkader is weg (`.v3VgKaart.v3VgAllDone` zonder outline of schaduw). |
| 5 | Glascheck: gelijk glas (.60), AA, minder transparantie | `node scripts/qa-v3-glas2.mjs` zelf gedraaid. Daarnaast een kopie op `#bezig` en `#nieuw` die de opacity meerekent, en een eigen reduced/contrast-scan | PASS | glas2: 207 vlakken, 0 fouten, exit 0. Dat reproduceert de hoofdsessie. `#bezig` en `#nieuw` op de vier schermen: enige contrastmelding is "Mijn fouten" (2,6 : 1), maar dat is een `disabled`-knop (WCAG-uitzondering). De uitzonderingen in de check zijn verantwoord: `.v3VgLegend` en `.v3VgKaartTitle` zijn chips van 0,85 zonder blur, zoals het contract voorschrijft. Bij minder transparantie en bij meer contrast worden ze dicht (eigen scan: 0 vlakken < 0,95 en 0 blur op Oefenen, Toets, Beloningen en Voortgang). `.v3Portrait` heeft geen achtergrond. `#message` hoort alleen bij de les. |
| 6 | Geen tekst onder 13 px, geen afgesneden tekst | TreeWalker over alle zichtbare tekst. Overflow-clipping per element (`scrollWidth/Height` > `client`, met overflow hidden/clip) | PASS | Kleinste tekst: Oefenen 16/15, Toets 16/15, Beloningen 16/15, Voortgang 13 ("plekken", "45 / 45 beheerst"). Geen geknipte tekst op deze schermen. Op iPad liggend staat de tegelstrook van Voortgang onder de vouw (`y` 806 bij een viewport van 810). Die is te scrollen en niet geknipt. Bekend punt. |
| 7 | Lint en test | `npm run lint`; `NODE_OPTIONS=--max-old-space-size=6144 npm test` | PASS | lint exit 0. test exit 0, alle suites `fail 0`. |
| G1 | Screenshots, GO-voorstel design-critic, GO Dennis | `ops/RUNLOG.md` | PASS | RUNLOG 2026-11-15 19:10: `dennis \| G1 \| BL-016e \| GO` ("geen fan"; boek → BL-022). |
| — | Scope: telefoon en iPad staand ongemoeid | Pixeldiff van screenshots tegen `c76f6f9` | PASS | 390×844: Oefenen, Toets, Beloningen en Voortgang 0,00% verschil. 810×1080: 0,9–1,4%. Dat zit alleen in het glas onderaan de panelen, want de token ging van een verloop 66→44 naar vlak 60. Bedoeld, conform BL-016d §1. (Het lek van de stappenlijst op Reis onder 1024 px hoort bij BL-016d, zie `eval-BL-016d.md`.) |

FAIL-redenen (concreet, reproduceerbaar):
1. **Voortgang: 6 panelen met blur op het scherm, en 5 tegelijk in beeld na scrollen** (`#alles/bg03`, Voortgang, 1440×900, scroll `.v3View-voortgang` 50 px. Of 1080×810, 300 px). Nodig: de secties onder het overzicht (Toetsen en de lange sectie, `.v3View-voortgang .v3Field.v3Card` buiten `.v3VgOverview`) krijgen geen blur. Bijvoorbeeld een wit vlak van 0,85 zonder `backdrop-filter`, zoals de chips. Daarna toont een telling over de hele scrollhoogte nooit meer dan 4. Neem die scrollende telling op in `qa-v3-glas2.mjs` of in een eigen check. De telling van de hoofdsessie meet alleen de beginstand.

Buiten scope opgemerkt (→ backlog-idee):
- Contractregel "boven- en onderranden lopen gelijk met de zijbalk": op 1440 eindigt het Oefenen-paneel op y 768 en Toets op 761, tegen 872 voor de zijbalk (104 en 111 px korter). Beloningen en Voortgang sluiten wel aan. Dat staat niet in de criteriatabel en Dennis keurde het beeld goed. Leg wel vast dat panelen die zo hoog zijn als hun inhoud mogen afwijken, anders spreekt het contract de bouw tegen.
- Framerate bij het scrollen van Voortgang (43,6 fps headless op 1440 met CPU 4×) neemt de iPad-test van Dennis mee. Met de fix hierboven zou die moeten stijgen.
- BL-022 (boek iPad), BL-021 (zeeën Voortgang) en de tegelstrook onder de vouw op iPad zijn bekend en staan al op de backlog.

Les: "≤ N per scherm" moet je over de hele scrollhoogte tellen, niet alleen in de beginstand. Een scherm dat scrolt heeft geen vaste "eerste blik".

## Ronde 2

Beoordeeld: HEAD `ab3b3ed` (fix `76cbad9`), gebouwd in een eigen worktree. Chromium headless (Playwright).

VERDICT: PASS

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | Zijbalk identiek op 5 schermen | ongewijzigd sinds ronde 1. De pixelvergelijking 8c44f11 → HEAD laat de zijbalk ongemoeid | PASS | Zie ronde 1. |
| 2 | Blur op ≤ 4 panelen per scherm | (a) Telling van alle elementen met `backdrop-filter` in de DOM, per scherm. (b) Voortgang: telling van de **zichtbare** blurvlakken bij elke `scrollTop` van 0 tot het einde (`scrollHeight` 2932/2950), in stappen van 25 px. Op 1440×900, 1080×810, 1280×720 en 1024×768, `#alles` en `#bezig` | PASS | (a) Oefenen 2, Toets 2, Beloningen 4, **Voortgang 4** (was 6): zijbalk, titelbalk, kaart "Hoofdstukken", tegelstrook. (b) Maximum **4** op elke scrollpositie, op alle 4 formaten en in beide toestanden. Toetsen en Kennis-paspoort: `rgba(255,255,255,.85)`, `backdrop-filter: none`, radius 24. |
| 3 | Geen frame of mist | glas2 (`sideFails 0`, `behind none`) | PASS | Ongewijzigd. |
| 4 | Kaarten zonder paneel eronder | ongewijzigd sinds ronde 1 | PASS | Zie ronde 1. |
| 5 | Glascheck | `node scripts/qa-v3-glas2.mjs` op de HEAD-build. Daarnaast een eigen contrastmeting in de nieuwe witte secties (tekst transparant, gemiddelde pixel erachter) bij `scrollTop` 500/900/1500/2200, BG-01/02/03, 1440 en 1080. Daarnaast reduced/contrast op de secties | PASS | glas2: 207 / 0 / 0 / 0 / 0, exit 0. Secties: laagste ratio **5,79 : 1** ("Naam", 13 px, `rgb(94,88,114)`). Bij minder transparantie en bij meer contrast worden de secties dicht (`rgb(255,253,249)`) en is er op het scherm 0 blur. |
| 6 | Niets onder 13 px | TreeWalker in de secties | PASS | Kleinste tekst 13 px. |
| 7 | Lint en test | in de HEAD-worktree | PASS | lint exit 0. test exit 0, alle suites `# fail 0`. |
| G1 | GO Dennis | RUNLOG | PASS | Ongewijzigd (19:10). Let op: de lagere secties van Voortgang zien er na `76cbad9` anders uit (wit 85% in plaats van glas met blur), en dat beeld heeft Dennis niet gezien. Screenshot: `/tmp/claude-0/-home-user-topo/0568f8e3-09c7-59a3-9424-2da44b974a18/scratchpad/r2/shots/vg700-1440.png`. |

**FAIL-punt uit ronde 1: opgelost.** Op geen enkele scrollpositie staan nog meer dan 4 blurvlakken in beeld, en ook in de DOM zijn er maar 4.

FAIL-redenen: geen.

Buiten scope opgemerkt (→ backlog-idee):
- glas2 ziet de nieuwe witte secties niet, want het script slaat vlakken onder de vouw over (`r.top >= innerHeight`). Het groene resultaat zegt daarom niets over deze vlakken. Ze zijn hierboven apart gemeten. Laat glas2 ook bij een of meer scrollposities meten, en neem in de check de klasse "wit .85 zonder blur" voor grote vlakken op, of verbied die bewust.
- Contractregel "één glas (wit 60%)" tegenover twee grote vlakken van wit 85%: dit volgt mijn advies uit ronde 1. Leg het als uitzondering vast in het contract of in `DESIGN_SYSTEM.md`, zodat de regel en de bouw niet uiteenlopen. Laat Dennis de gescrolde Voortgang zien in de volgende brief.
- Bij `76cbad9` staat de Voortgang-regel als los blok ná "12. minder transparantie" in `ui.css`, met 4 nieuwe `!important`. Dat doorbreekt de volgorde van BL-023 (zie `eval-BL-023.md`).
- De branch-HEAD bevat de les-regressie uit BL-023 (`e1073d5`). Zie `eval-BL-023.md`.

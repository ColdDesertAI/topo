# TOPO V3 Italië — designaudit, fase 1

**Geaudite snapshot: `5060ac771ded70c6af35aead83cc1346630703df`** · bron `origin/claude/nightly-pr99-kaart-feestje-fvpl06` · auditbranch `t/AUDIT-v3` · 16 november 2026.

Dit is een bevroren audit; nieuwe commits van Claude Code vallen erbuiten. Alleen audittools, tests en rapportbestanden toegevoegd. Geen app-code, CSS, opslag, routes, geografische vormen of goedgekeurde assets veranderd. Geen merge/deploy. Claude Code implementeert pas na Dennis’ G1; productie/main blijft achter G4.

## Besluit voor Dennis

De huidige app heeft een herkenbare kaartwereld, één verzadigde hoofdknop op de meeste schermen en een bruikbare aparte hoofdstukpagina. De winst zit in minder herhaling, één vaste actieplek en gedeelde primitieve componenten. De achtergrond en kunst vragen soms meer aandacht dan de leertaak. De grootste structurele kosten zijn de gelaagde CSS-cascade en V3-presentatie die V2-DOM/control-state gebruikt. Dat laatste is een migratiegrens: niet verwijderen tijdens een cosmetische opruiming.

Geen leerlingonderzoek uitgevoerd: 3-secondenoordelen en UX/DX/AX-scores zijn deskundige hypotheses. Voorgestelde woordaantallen en scorewinst zijn doelen, geen gemeten na-situatie. Annotaties tonen het huidige scherm met het voorgestelde ingreepgebied; er is geen fictieve ‘na’-UI.

## Bewijs, bereik en reproduceerbaarheid

- 153 geslaagde captures; 0 capturefouten. 17 benoemde toestanden; Chromium 1440×900, 1080×810, 810×1080, 390×844, normaal én reduced-motion/reduced-transparency. WebKit: {"name":"webkit","version":"26.0"}.
- [Volledige matrix](audit/5060ac771ded70c6af35aead83cc1346630703df/summary.md), [runmetadata](audit/5060ac771ded70c6af35aead83cc1346630703df/run.json), [alle tekst/stijl/axe/focusmetingen per capture](audit/5060ac771ded70c6af35aead83cc1346630703df/cases/), [annotaties](audit/5060ac771ded70c6af35aead83cc1346630703df/annotations/), [renders naast screenshot](audit/5060ac771ded70c6af35aead83cc1346630703df/comparisons/), [meetbeperkingen](../../scripts/audit/README.md).
- Commando binnen de toegestane mappen: `npm --prefix scripts/audit run audit:v3`; vanuit scripts/audit: `npm run audit:v3`. Gemeten looptijd **689.2 s**. Root package.json blijft ongewijzigd: de mappenregel staat die wijziging niet toe; aparte uitzondering is nog niet gegeven.
- `npm --prefix scripts/audit run test:audit`: huidige hard-rule-tests mogen rood zijn; exit 1. Meettooltests controleren WCAG-referenties, currentColor-behoud, SVG-fill, onzekere opacity en verborgen/afgeknipte modal- en navigatietekst.
- Preview via bestaande `node scripts/build-v3-preview.mjs`, toolbar verborgen als ontwikkelbediening. Demo-state leeft alleen in nieuwe browsercontexten. Geen echte saves of persoonsgegevens gebruikt. Beschermde bronbestanden ongewijzigd: **true**.
- Finiete dekking: niet iedere hoofdstuk-, beloningsanimatie-, importfout- en offlinecombinatie doorlopen. Woorden zijn zichtbare DOM-tekstnodes; invoerwaarden/placeholders/pseudo-tekst ontbreken. CSS ‘dood’ betekent alleen niet gematcht in deze steekproef. Onzekere contrastmetingen zijn nooit geslaagd verklaard.

## Top 10 — aflopend geschatte impact ÷ inspanning

Impact 1–10 (leerduidelijkheid, harde bevindingen en hergebruik samen); inspanning S=1/M=2/L=3. Bij gelijke ratio gaat leerwerk vóór systeemopruiming. IDs blijven gekoppeld aan screenshots en meetdoelen. Alle implementatie: **Claude Code**.

|Rang / ID|Verandering|Impact ÷ effort|UX / DX / AX verwachte winst|Machinecheck na uitvoering|
|---|---|---|---|---|
|1 / 01|Leerzone: antwoord voorop; tekst leesbaar, één controleactie|10/2 = 5.00 · M|+2 / 1 / 1|goal-01 in goal-checks.json; hard-rule subset `AUDIT_SCREEN=ontdekken,aanwijzen,schrijven npm --prefix scripts/audit run test:audit`|
|2 / 02|Toets kiezen als één compacte configuratie|5/1 = 5.00 · S|+2 / 1 / 1|goal-02 in goal-checks.json; hard-rule subset `AUDIT_SCREEN=toets npm --prefix scripts/audit run test:audit`|
|3 / 09|Selecteren/tikken: één 44px-patroon voor Oefenen|9/2 = 4.50 · M|+2 / 2 / 1|goal-09 in goal-checks.json; hard-rule subset `AUDIT_SCREEN=oefenen npm --prefix scripts/audit run test:audit`|
|4 / 03|Reis: één selectie, één volgende stap|8/2 = 4.00 · M|+2 / 1 / 2|goal-03 in goal-checks.json; hard-rule subset `AUDIT_SCREEN=reis,reis-nieuw,reis-hoofdstuk npm --prefix scripts/audit run test:audit`|
|5 / 04|Kennismaking: één Nederlandse startactie|4/1 = 4.00 · S|+2 / 1 / 1|goal-04 in goal-checks.json; hard-rule subset `AUDIT_SCREEN=kennismaking npm --prefix scripts/audit run test:audit`|
|6 / 07|Beloningen: verdiend en eerstvolgend in één ritme|4/1 = 4.00 · S|+1 / 1 / 1|goal-07 in goal-checks.json; hard-rule subset `AUDIT_SCREEN=beloningen npm --prefix scripts/audit run test:audit`|
|7 / 08|Feedback en resultaat: correctie vóór versiering|8/2 = 4.00 · M|+2 / 1 / 1|goal-08 in goal-checks.json; hard-rule subset `AUDIT_SCREEN=feedback,feedback-fout,toets-resultaat npm --prefix scripts/audit run test:audit`|
|8 / 06|Voortgang: kaart → eerstvolgende leeractie|7/2 = 3.50 · M|+2 / 1 / 1|goal-06 in goal-checks.json; hard-rule subset `AUDIT_SCREEN=voortgang npm --prefix scripts/audit run test:audit`|
|9 / 10|Gedeelde lagen + beheer: stop de overrideketen|10/3 = 3.33 · L|+1 / 3 / 3|goal-10 in goal-checks.json; hard-rule subset `AUDIT_SCREEN=instellingen npm --prefix scripts/audit run test:audit`|
|10 / 05|Reisboekje: één spread, één bladerpatroon|5/2 = 2.50 · M|+1 / 1 / 2|goal-05 in goal-checks.json; hard-rule subset `AUDIT_SCREEN=reisboekje npm --prefix scripts/audit run test:audit`|

### 01 — Leerzone: antwoord voorop; tekst leesbaar, één controleactie

Verwijder dubbele modus/contextregels; bind vraag, kaartmarkering en invoer in één vaste zone. Maak betekenisvolle kleine tekst ≥13px en contrast AA. Behoud alle bestaande grading. Eigenaar: Claude Code; M. [Huidig beeld met annotatie](audit/5060ac771ded70c6af35aead83cc1346630703df/annotations/01-schrijven.png). De annotatie is de vereiste vóór/ingreepweergave, geen geïmplementeerd na-beeld. Scope en grenswaarden: [goal-01](audit/5060ac771ded70c6af35aead83cc1346630703df/goal-checks.json). Hard-rule-tests bewijzen alleen de harde meetregels; één hoofdactie, begrijpelijkheid, behoud van gedrag en minder CSS vereisen review.

### 02 — Toets kiezen als één compacte configuratie

Drie keuzegroepen in vaste volgorde, slechts Start toets volledig verzadigd; hergebruik hetzelfde selectiecomponent als Oefenen. Eigenaar: Claude Code; S. [Huidig beeld met annotatie](audit/5060ac771ded70c6af35aead83cc1346630703df/annotations/02-toets.png). De annotatie is de vereiste vóór/ingreepweergave, geen geïmplementeerd na-beeld. Scope en grenswaarden: [goal-02](audit/5060ac771ded70c6af35aead83cc1346630703df/goal-checks.json). Hard-rule-tests bewijzen alleen de harde meetregels; één hoofdactie, begrijpelijkheid, behoud van gedrag en minder CSS vereisen review.

### 09 — Selecteren/tikken: één 44px-patroon voor Oefenen

Deel vormtegels/hoofdstukselecties met Toets; uniforme hitboxes ≥44px en 8px tussen doelen. Kaartcoördinaten blijven exact; effectieve map-hitlogica apart behouden. Eigenaar: Claude Code; M. [Huidig beeld met annotatie](audit/5060ac771ded70c6af35aead83cc1346630703df/annotations/09-oefenen.png). De annotatie is de vereiste vóór/ingreepweergave, geen geïmplementeerd na-beeld. Scope en grenswaarden: [goal-09](audit/5060ac771ded70c6af35aead83cc1346630703df/goal-checks.json). Hard-rule-tests bewijzen alleen de harde meetregels; één hoofdactie, begrijpelijkheid, behoud van gedrag en minder CSS vereisen review.

### 03 — Reis: één selectie, één volgende stap

Laat geselecteerd hoofdstuk en Verder ruimtelijk bij elkaar horen; verwijder dubbel hoofdstuknummer/status. Behoud de afgescheiden hoofdstukpagina bij brede vensters. Eigenaar: Claude Code; M. [Huidig beeld met annotatie](audit/5060ac771ded70c6af35aead83cc1346630703df/annotations/03-reis.png). De annotatie is de vereiste vóór/ingreepweergave, geen geïmplementeerd na-beeld. Scope en grenswaarden: [goal-03](audit/5060ac771ded70c6af35aead83cc1346630703df/goal-checks.json). Hard-rule-tests bewijzen alleen de harde meetregels; één hoofdactie, begrijpelijkheid, behoud van gedrag en minder CSS vereisen review.

### 04 — Kennismaking: één Nederlandse startactie

Vervang Andiamo! door Beginnen; naam en pizza blijven optioneel. Maak Start meteen een rustige overslaan-link met 44px tapruimte. Geen extra uitleg. Eigenaar: Claude Code; S. [Huidig beeld met annotatie](audit/5060ac771ded70c6af35aead83cc1346630703df/annotations/04-kennismaking.png). De annotatie is de vereiste vóór/ingreepweergave, geen geïmplementeerd na-beeld. Scope en grenswaarden: [goal-04](audit/5060ac771ded70c6af35aead83cc1346630703df/goal-checks.json). Hard-rule-tests bewijzen alleen de harde meetregels; één hoofdactie, begrijpelijkheid, behoud van gedrag en minder CSS vereisen review.

### 07 — Beloningen: verdiend en eerstvolgend in één ritme

Eén meterpatroon voor pizza/rit, één boekactie. Laat aantallen niet tweemaal naast dezelfde kunst zien. Verander geen beloningstoken of timingcontract. Eigenaar: Claude Code; S. [Huidig beeld met annotatie](audit/5060ac771ded70c6af35aead83cc1346630703df/annotations/07-beloningen.png). De annotatie is de vereiste vóór/ingreepweergave, geen geïmplementeerd na-beeld. Scope en grenswaarden: [goal-07](audit/5060ac771ded70c6af35aead83cc1346630703df/goal-checks.json). Hard-rule-tests bewijzen alleen de harde meetregels; één hoofdactie, begrijpelijkheid, behoud van gedrag en minder CSS vereisen review.

### 08 — Feedback en resultaat: correctie vóór versiering

Zet juiste antwoord en Volgende op vaste plekken; alleen relevante fouten onder score. Geen generieke compliment-/uitleglaag. Hergebruik één feedbackpatroon. Eigenaar: Claude Code; M. [Huidig beeld met annotatie](audit/5060ac771ded70c6af35aead83cc1346630703df/annotations/08-feedback-fout.png). De annotatie is de vereiste vóór/ingreepweergave, geen geïmplementeerd na-beeld. Scope en grenswaarden: [goal-08](audit/5060ac771ded70c6af35aead83cc1346630703df/goal-checks.json). Hard-rule-tests bewijzen alleen de harde meetregels; één hoofdactie, begrijpelijkheid, behoud van gedrag en minder CSS vereisen review.

### 06 — Voortgang: kaart → eerstvolgende leeractie

Eén legenda met drie stagebetekenissen; schrap herhaalde totalen. Eén hervat-actie verwijst naar bestaande route-state. Eigenaar: Claude Code; M. [Huidig beeld met annotatie](audit/5060ac771ded70c6af35aead83cc1346630703df/annotations/06-voortgang.png). De annotatie is de vereiste vóór/ingreepweergave, geen geïmplementeerd na-beeld. Scope en grenswaarden: [goal-06](audit/5060ac771ded70c6af35aead83cc1346630703df/goal-checks.json). Hard-rule-tests bewijzen alleen de harde meetregels; één hoofdactie, begrijpelijkheid, behoud van gedrag en minder CSS vereisen review.

### 10 — Gedeelde lagen + beheer: stop de overrideketen

Groepeer profiel/reservekopie/wissen, deel primitieve controls. Consolideer cascade per laag; vervang historische overrides door de bedoelde regel op één plek. Zet het schermcontract als compacte matrix in SPEC. Eigenaar: Claude Code; L. [Huidig beeld met annotatie](audit/5060ac771ded70c6af35aead83cc1346630703df/annotations/10-instellingen.png). De annotatie is de vereiste vóór/ingreepweergave, geen geïmplementeerd na-beeld. Scope en grenswaarden: [goal-10](audit/5060ac771ded70c6af35aead83cc1346630703df/goal-checks.json). Hard-rule-tests bewijzen alleen de harde meetregels; één hoofdactie, begrijpelijkheid, behoud van gedrag en minder CSS vereisen review.

### 05 — Reisboekje: één spread, één bladerpatroon

Behoud papier en goedgekeurde kunst. Eén footer voor Vorige/Volgende/sluiten; verwijder dubbele koppen en vergroot kleine bediening. Eigenaar: Claude Code; M. [Huidig beeld met annotatie](audit/5060ac771ded70c6af35aead83cc1346630703df/annotations/05-reisboekje.png). De annotatie is de vereiste vóór/ingreepweergave, geen geïmplementeerd na-beeld. Scope en grenswaarden: [goal-05](audit/5060ac771ded70c6af35aead83cc1346630703df/goal-checks.json). Hard-rule-tests bewijzen alleen de harde meetregels; één hoofdactie, begrijpelijkheid, behoud van gedrag en minder CSS vereisen review.

## Hard-rule failures

**5972 meetbevindingen over alle engines/formaat/voorkeur-combinaties, niet 5972 unieke productbugs.** Herhaalde selectors en browservarianten zijn afzonderlijke meetregels. Contrastkandidaten en DOM-hitboxes vragen de hieronder beschreven validatie; geen automatische vrijstelling. [Volledige elementtabel](audit/5060ac771ded70c6af35aead83cc1346630703df/hard-rule-failures.md) · [JSON](audit/5060ac771ded70c6af35aead83cc1346630703df/hard-rule-failures.json).

|Regel|Aantal|
|---|---:|
|backdrop-filter|31|
|text-size|740|
|contrast|487|
|tap-target|1971|
|overflow|302|
|axe|2441|

|Scherm|Viewport / engine|Element|Regel|Waarde|
|---|---|---|---|---|
|kennismaking|1440x900 chromium|nav.v3Side, nav.v3Side::after, section.v3List, div.v3Counts, div.v3Panel, dialog.ninoProfile.ninoFir|backdrop-filter|7|
|kennismaking|1080x810 chromium|nav.v3Side, nav.v3Side::after, section.v3List, div.v3Counts, div.v3Panel, dialog.ninoProfile.ninoFir|backdrop-filter|7|
|kennismaking|810x1080 chromium|nav.v3Side::after, #v3Rows, div.v3Counts, div.v3Panel, dialog.ninoProfile.ninoFirstRun.v3, dialog.ni|backdrop-filter|6|
|reis-nieuw|1440x900 chromium|text.|text-size|11.799794679764261|
|reis-nieuw|1440x900 chromium|text.|text-size|11.799794679764261|
|reis-nieuw|1440x900 chromium|text.|contrast|2.91 < 4.5|
|reis-nieuw|1440x900 chromium|text.|contrast|1.07 < 4.5|
|reis-nieuw|1440x900 chromium|button.v3Btn|tap-target|105.0×36.0|
|reis-nieuw|1440x900 chromium|button.v3Btn|tap-target|63.5×36.0|
|reis-nieuw|1440x900 chromium|nav.v3Side, nav.v3Side::after, section.v3List, div.v3Counts, div.v3Panel|backdrop-filter|5|
|reis-nieuw|1440x900 chromium|text.|text-size|11.799794679764261|
|reis-nieuw|1440x900 chromium|text.|text-size|11.799794679764261|
|reis-nieuw|1440x900 chromium|text.|contrast|2.92 < 4.5|
|reis-nieuw|1440x900 chromium|text.|contrast|1.07 < 4.5|
|reis-nieuw|1440x900 chromium|button.v3Btn|tap-target|105.0×36.0|
|reis-nieuw|1440x900 chromium|button.v3Btn|tap-target|63.5×36.0|
|reis-nieuw|1080x810 chromium|text.|text-size|10.654379923439997|
|reis-nieuw|1080x810 chromium|text.|text-size|10.654379923439997|
|reis-nieuw|1080x810 chromium|text.|contrast|1.84 < 4.5|
|reis-nieuw|1080x810 chromium|text.|contrast|1.05 < 4.5|
|reis-nieuw|1080x810 chromium|button.v3Btn.v3School.v3SchoolBtn|tap-target|40.0×44.0|
|reis-nieuw|1080x810 chromium|button.v3Btn|tap-target|105.0×36.0|
|reis-nieuw|1080x810 chromium|button.v3Btn|tap-target|63.5×36.0|
|reis-nieuw|1080x810 chromium|span.v3End|overflow|22>20|
|reis-nieuw|1080x810 chromium|span.v3End|overflow|22>20|
|reis-nieuw|1080x810 chromium|span.v3End|overflow|22>20|
|reis-nieuw|1080x810 chromium|span.v3End|overflow|22>20|
|reis-nieuw|1080x810 chromium|span.v3End|overflow|22>20|
|reis-nieuw|1080x810 chromium|span.v3End|overflow|22>20|
|reis-nieuw|1080x810 chromium|span.v3End|overflow|22>20|
|reis-nieuw|1080x810 chromium|span.v3End|overflow|22>20|
|reis-nieuw|1080x810 chromium|span.v3End|overflow|22>20|
|reis-nieuw|1080x810 chromium|span.v3End|overflow|22>20|
|reis-nieuw|1080x810 chromium|text.|text-size|10.654379923439997|
|reis-nieuw|1080x810 chromium|text.|text-size|10.654379923439997|

De tabel hierboven toont de eerste 35 regels; de volledige tabel staat in het JSON-artefact. 0 geschilderde tekstmetingen blijven **onbekend**. Daarnaast zijn 330 DOM-kandidaten apart bewaard in unpaintedOrUnknownText wegens ontbrekende betrouwbare glyph-paintsamples; die tellen niet mee als zichtbaar of AA-pass. Mogelijke oorzaken zijn onder andere occlusie/clipping/antialias en ancestor-/fill-opacity. AA is niet aangetoond voor die nodes. Inactieve controls en de onderlaag achter een modal zijn WCAG-uitzonderingen. Opzettelijk visueel verborgen screenreader-labels zijn geen visuele overflowfout en blijven semantisch behouden. Doelgrootte gebruikt strikte DOM-bounds: de map-engine kan grotere effectieve hits hebben; controleer die apart zonder coördinaten te verplaatsen.

## Woorden per scherm

Actieve woorden: modalondergrond niet meegeteld. Doel na cuts is een redactionele schatting, nog niet gemeten en geen eis om leerinhoud/waarschuwingen te schrappen. >40 is advies, geen harde test.

|Scherm|Desktop nu|iPad nu|Voorgesteld na cuts|
|---|---:|---:|---:|
|Kennismaking|21|21|≈18|
|Reis — nieuw|38|32|≈30|
|Reis — overzicht / voltooid|36|30|≈30|
|Reis › Hoofdstuk|23|17|≈18|
|Oefenen — kiezen|38|33|≈30|
|Oefenen — Ontdekken|71|28|≈25|
|Oefenen — Aanwijzen|49|40|≈22|
|Oefenen — Namen schrijven|54|45|≈25|
|Lesfeedback — goed|50|46|≈22|
|Lesfeedback — fout|53|49|≈24|
|Toets — instellen|42|37|≈30|
|Toets — vraag|35|30|≈25|
|Toets — resultaat|21|16|≈18|
|Beloningen|21|16|≈22|
|Reisboekje|51|51|≈30|
|Voortgang|62|49|≈28|
|Instellingen|63|59|≈40|

## Tokenreductie

De volledige waarde- en bronlijst staat in [tokens.md](audit/5060ac771ded70c6af35aead83cc1346630703df/tokens.md); [static.json](audit/5060ac771ded70c6af35aead83cc1346630703df/static.json) bevat inline-JS-vondsten, alle dubbele selectors en onbemeten selectors. Dit zijn **declaratiewaarden**, inclusief overschreven regels, variabelen en shorthands; computed gebruik staat per capture. Niet voorstellen dat elke variabele/expressie een extra kleur is.

|Categorie|Huidige distinct declaraties|Voorgestelde schaal|
|---|---:|---|
|colour|151|ink, muted, paper, glass, border; violet voor selectie/actie; success/error/warning; geografische kleuren blijven aparte semantische set|
|fontSize|24|13 / 16 / 20 / 28 / 40px; kaartlabels effectief ≥13px waar leesbaar nodig|
|spacing|182|4 / 8 / 12 / 16 / 24 / 32 / 48px|
|radius|34|8 / 16 / 24 / 999px; bijzondere goedgekeurde illustratievormen apart|
|blur|29|0 / 16px; reduced-transparency: opaque, geen extra blur|
|shadow|46|none / elevation-1 / elevation-2; focus als outline|

Geen globale wit/violet-replace: papier, AA-feedback, disabled, geselecteerd, focus en echte geografie behouden hun betekenis. Verminder varianten via tokens en verwijder oude regels, voeg geen ronde6.css toe.

## Componentreductie en variant count

Computed signatures omvatten background, backdrop-filter, border, radius, shadow, padding en font-size/weight. Browser, breakpoint en actieve/disabled state kunnen legitiem verschillende signatures geven; dit is geen telling van evenveel ontworpen componenten. [Alle signatures met voorbeeldselectors](audit/5060ac771ded70c6af35aead83cc1346630703df/component-style-inventory.json).

|Type|Huidige signatures|Doel basispatronen|Voorgestelde component|
|---|---:|---:|---|
|button|94|1–2|Action (primary/quiet), icon-only als maatvariant|
|row|19|1–2|ListRow met inhoud + status + optionele actie|
|panel|21|1–2|Surface (glass/paper), geen panel-in-panel voor hetzelfde doel|
|card|22|1–2|Surface (glass/paper), geen panel-in-panel voor hetzelfde doel|
|pill|13|1–2|Selection met selected/disabled state|
Minimale set: Surface(glass/paper), Action(primary/quiet), Selection, ListRow, Field, Feedback; kaart/projectie en goedgekeurde artwork blijven eigen domein. Tellers zijn data in een bestaand patroon, geen aparte Card-implementatie per scherm. Nino: één contextrol per toestand (welkom, concrete hulp, beloningsmoment); anders alleen het kleine herkenningsportret.

## Code en documentarchitectuur

- 526 `!important`-declaraties; 263 selectors komen meermaals voor; 21 lexicale inline-style-vondsten in V3-JS. 258/1532 selectors matchten niet tijdens de gemeten statussen. Dit bewijst geen dode code. [Exacte bestanden/regels](audit/5060ac771ded70c6af35aead83cc1346630703df/static.json).
- Bestandsgrootte: index.html 39.5 MiB; gegenereerde preview 28.8 MiB; V3 CSS 200.5 KiB; V3 JS 118.3 KiB. Per-bestand bytes staan in static.json; niet verwarren met runtime-heap.
- Builder voegt stijl.css/tokens, scherm-/ijklagen, ronde2/3/4/5, ronde5b, glas2, kaart, reis2 achter elkaar samen. Voorbeeld: ronde5b.css:6 forceert panelpadding met !important; ronde5b.css:17 forceert geselecteerde landtint; glas2/reis2 komen daarna. Eén wijziging vraagt cascadehistorie. Oude selector niet verwijderen op basis van afwezigheid in één screenshot.
- Doel: tokens → primitives → shell → één stylesheet per scherm/domein → toegankelijkheid/media. Geometrie en artworkconfig apart. Consolideer vanaf laatst bedoelde computed waarde; verwijder de overschreven regel op de bronplek. Geen nieuwe overridefile.
- V3-shell roept V2-controls en state aan: shell.js legacyTab/toHome en les/toets adapters. Die koppeling is nu bewust functioneel. Verwijderen pas in een afzonderlijke runtime-migratie met karakterisering; niet als stil onderdeel van design-G1.
- Vandaag nodig: AGENTS.md, ops/STATE.md, SPEC.md, relevante OVERDRACHT-sectie, V3_0_REST/ijk/glas-afspraken, schermrenderer en bijbehorend QA-script. SPEC verwijst nog naar de stand 11-11/pin d2383f2, terwijl de audit 5060ac7 met BL-016d/e vastlegt. Dat is een AX-gat.
- Voorstel: één compacte SPEC-matrix als enige waarheid met per scherm doel, primaire actie, state-id, bronbestand, QA-commando, fixture en renderlink. Ops/STATE alleen status/headpin; RUNLOG alleen geschiedenis. Geen tweede concurrerende schermhandleiding. De per-schermbron/QA hieronder is een vindhulp, geen nieuwe app-contractbron.

## iPad 9-proxyperformance

Chromium headless, CPU 4x, viewport 1080×810 DPR2; operational readiness includes fixture navigation, fonts and 500ms settle, NOT Lighthouse TTI. Heap GC after warm-up; ten switches plus ten full five-tab cycles. Image estimates include visible CSS/SVG raster references, exclude vector/GPU/internal cache overhead; measured after readiness snapshot. FPS samples ten full tab cycles, excluding forced-GC checkpoints. Not physical iPad proof.

|Scherm|Operational ready ms|Long tasks >50ms|DOM|Raster MB unique / instances|Zichtbare blur-elementen|
|---|---:|---:|---:|---:|---:|
|kennismaking|8395|12|1497|60.9 / 60.9|7|
|reis-nieuw|8498|9|1465|60.1 / 60.1|5|
|reis|8619|9|1498|59.9 / 60.2|5|
|reis-hoofdstuk|8883|10|1499|55.6 / 55.6|4|
|oefenen|8831|10|1799|54.3 / 54.3|3|
|ontdekken|11424|15|1833|1.0 / 1.0|3|
|aanwijzen|11183|14|1821|3.9 / 3.9|4|
|schrijven|11273|14|1821|3.9 / 3.9|4|
|feedback|11491|15|1821|3.9 / 3.9|4|
|feedback-fout|11581|15|1822|3.9 / 3.9|4|
|toets|8338|10|1577|24.4 / 24.4|3|
|toets-actief|10888|14|1591|1.0 / 1.0|3|
|toets-resultaat|23155|46|1923|59.0 / 59.0|4|
|beloningen|8244|9|1498|32.8 / 40.8|5|
|reisboekje|8521|11|1529|45.5 / 53.5|5|
|voortgang|9658|11|2114|61.4 / 61.7|5|
|instellingen|9242|10|1498|59.9 / 60.2|7|

Zwaarste rastertoestand: **voortgang**, circa 61.4 MiB aan unieke zichtbare rasterreferenties. Beelden/achtergrond/kaartillustraties domineren deze schatting; dit is geen echte iPad-RAM-meting. Vergelijk ook DOM en long tasks: één ‘zwaarste’ hangt af van de maat. Tabwisselen: 5.5 rAF-FPS; hoofdstukscroll: niet beschikbaar — No scrollable chapter list at this viewport/state. GC-heap na 10 wissels: 1.3%; na 10 volledige vijf-tabcycli: 2.3%. Geen bewezen lek zonder herhaalde meting; geen 60fps-belofte voor fysiek iPad 9. De lage tabwissel-FPS vraagt een trace vóór een specifieke oorzaak wordt aangewezen: dit bewijst niet dat blur of CSS-opruiming alleen het probleem oplost. [Ruwe data](audit/5060ac771ded70c6af35aead83cc1346630703df/performance.json).

## Schermbeoordelingen — één compacte pagina per toestand

Gemeenschappelijke volledige inventarissen: [alle unieke tekstnodes en cutvoorstellen](audit/5060ac771ded70c6af35aead83cc1346630703df/cut-inventory.md), [alle iconen/kunst/dividers en beslissingen](audit/5060ac771ded70c6af35aead83cc1346630703df/visual-cut-inventory.md), [alle computed componentvarianten](audit/5060ac771ded70c6af35aead83cc1346630703df/component-style-inventory.json). Voor iconen geldt: KEEP geografische geometrie, bediening met eigen toegankelijk naam en kleuronafhankelijke status; CUT puur herhaalde decoratie; REPLACE-BY-LAYOUT dividers die alleen al gegroepeerde inhoud scheiden. Geen kaartvorm is decoratie. De onderstaande schermcutlijst specificeert de uitzonderingen.

### Kennismaking

**Doel:** Ik kies hoe Nino mij noemt en begin mijn reis. **Eén primaire actie:** Beginnen.

**Concurrerende acties:** Start meteen: KEEP als rustige overslaan-link; pizzakeuze: KEEP optioneel; naaminvoer: KEEP optioneel; Andiamo!: REPLACE door dezelfde Nederlandse startterm.

**Cutlijst:** CUT Ciao! Ik ben Nino. en de dubbele startbelofte. KEEP naamvraag, pizzavraag en pizzanamen als veldlabels. REPLACE-BY-LAYOUT losse hulpregels door twee gegroepeerde velden. KEEP één begroetende Nino; CUT de tweede zichtbare Nino op de achtergrond tijdens het venster.

**Hiërarchie (squint):** Nu: Nino/pizza → naaminvoer → Andiamo. Doel: korte vraag → één startknop → optionele personalisatie.

**Consistentie:** De dialoog heeft andere veld- en pizzakaartafronding dan de selectieknoppen. Volledig geïllustreerde Nino én shellportret tegelijk. Italiaans CTA-werkwoord naast Nederlandse UI. Gemeten iPad-signatures: radius 999px; tekst 17px. Glass/shadow/padding per element: raw capture, niet afgeleid uit een render.

**UX 3/5:** Warm welkom, maar twee startacties en een leeg naamveld zonder zichtbaar nabij label. **DX 2/5:** Bestaand V2-profiel wordt achteraf aangekleed; geen zelfstandig V3-formulierpatroon. **AX 2/5:** Stabiele name=name en data-profile-cancel, maar SPEC alleen verklaart deze adapter niet.

**Kindheuristiek:** 3 s: gedeeltelijk; de twee startkeuzen vragen interpretatie. Eén stap: de grote knop wint, maar de tekst is Italiaans. Progressie: niet nodig vóór de eerste les. Kaart: geen actieve taak; achtergrond mag rustiger. Nino: begroet, maar wijst niet naar de invoer. Beloning: pizzakeuze motiveert; geen animatieblok nodig.

**Vindbaar/controleerbaar:** scripts/v3/kennismaking.js; scripts/qa-v3-kennismaking.py; audit-state `kennismaking`. [iPad](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-kennismaking-1080x810-normal.png) · [desktop](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-kennismaking-1440x900-normal.png).

### Reis — nieuw

**Doel:** Ik begin met het eerste hoofdstuk. **Eén primaire actie:** Verder naar het eerste hoofdstuk.

**Concurrerende acties:** Hoofdstukken: KEEP als context, vergrendeld herkenbaar; kaartwissel: DEMOTE; printknop: MOVE naar contextmenu; beloningsteller: DEMOTE; tabs: KEEP secundair.

**Cutlijst:** CUT HOOFDSTUK + volgnummer boven een reeds benoemd hoofdstuk. KEEP hoofdstuknamen, slot/statusvormen en geselecteerde rij. REPLACE-BY-LAYOUT Hoofdstukken-kop door een duidelijke lijstgroep wanneer dit zonder tekst werkt. CUT dubbele scheidingslijnen en dubbele statuslabels; KEEP kaartcontouren en geografische namen.

**Hiërarchie (squint):** Nu: landschap/kaart → hoofdstuklijst → onderste Verder. Doel: eerste hoofdstuk → Verder → kaart/context.

**Consistentie:** Onderste actiekaart en linker lijst gebruiken verschillende kaartvormen; landscape toont een aparte hoofdstukpagina, smalle stand combineert selectie en inhoud. Gemeten iPad-signatures: radius 12px · 0px · 16px · 2px · 999px · 24px; tekst 16px · 17px · 15px · 13px · 24px. Glass/shadow/padding per element: raw capture, niet afgeleid uit een render.

**UX 3/5:** Eerste stap bestaat, maar de afstand tussen selectie en knop vraagt zoeken. **DX 2/5:** Reis-renderer plus vele latere CSS-lagen bepalen dezelfde indeling. **AX 2/5:** Selectie is data-chapter; breakpoint verandert het pad naar dezelfde taak.

**Kindheuristiek:** 3 s: waarschijnlijk op desktop; staand moet de actie in beeld blijven. Eén stap: Verder is primair, meerdere kaarttools zijn concurrenten. Progressie: de rijbalk is zinvol zonder lezen. Kaart: echt en groot; decoratieve punten mogen geen valse tapbelofte geven. Nino: portret is identiteit, geen hulp bij de volgende stap. Beloning: teller is context, geen primaire opdracht.

**Vindbaar/controleerbaar:** scripts/v3/reis.js; scripts/qa-v3-reis.py; audit-state `reis-nieuw`. [iPad](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-reis-nieuw-1080x810-normal.png) · [desktop](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-reis-nieuw-1440x900-normal.png).

### Reis — overzicht / voltooid

**Doel:** Ik kies welk hoofdstuk ik nu leer. **Eén primaire actie:** Open het geselecteerde hoofdstuk.

**Concurrerende acties:** Elf hoofdstukken: KEEP als één selectiepatroon; Verder: KEEP; Schoolkaart/Reliëf: DEMOTE; schoolblad: MOVE; topmeters: DEMOTE; navigatie: KEEP.

**Cutlijst:** CUT HOOFDSTUK 11 naast Rivieren. KEEP hoofdstuktitels, behaalde goudiconen en één geselecteerde toestand. REPLACE-BY-LAYOUT losse nummers door vaste volgorde. CUT statusherhaling in lijst én onderste balk waar dezelfde informatie dubbel staat. KEEP contouren, rivierlijnen en echte projectie.

**Hiërarchie (squint):** Nu: reliëf/landschap → lijst → Verder. Doel: gekozen rij → Verder → kaartvoorproef.

**Consistentie:** Hoofdstukkenlijst combineert mini-scènes, lijniconen en gouden illustraties; geselecteerde rij is lichtviolet, primaire actie volviolet. De twee statusweergaven hebben andere vormen. Gemeten iPad-signatures: radius 12px · 0px · 16px · 999px · 24px; tekst 16px · 17px · 15px · 13px · 24px. Glass/shadow/padding per element: raw capture, niet afgeleid uit een render.

**UX 3/5:** Rustiger dan eerdere kaarten, maar de primaire actie staat ver van de lijst. **DX 2/5:** Hetzelfde hoofdstukmodel wordt meerdere keren gepresenteerd. **AX 2/5:** Renderer, breakpointregels en rondes zijn over meerdere bestanden verspreid.

**Kindheuristiek:** 3 s: een hoofdstuk kiezen is duidelijker dan direct leren starten. Eén stap: Verder is de enige CTA, naast sterk opvallende kaartkunst. Progressie: vinkvormen en goud zijn bruikbaar; kleur alleen is onvoldoende. Kaart: groot; decoratieve ankers mogen niet op vraagtargets lijken. Nino: klein portret kan blijven als herkenningspunt. Beloning: niet laten concurreren met het leerdoel.

**Vindbaar/controleerbaar:** scripts/v3/reis.js / reis2.css / kaart.css; scripts/qa-v3-reis.py; audit-state `reis`. [iPad](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-reis-1080x810-normal.png) · [desktop](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-reis-1440x900-normal.png) · [naast ontwerp-render](audit/5060ac771ded70c6af35aead83cc1346630703df/comparisons/reis.png).

### Reis › Hoofdstuk

**Doel:** Ik start de volgende les van dit hoofdstuk. **Eén primaire actie:** Start de volgende les / Goud nog eens als alles klaar is.

**Concurrerende acties:** Ontdekken/Aanwijzen/Schrijven opnieuw: DEMOTE in één Herhalen-groep; Hoofdstukken-terug: KEEP; kaartwissel: DEMOTE; print: MOVE.

**Cutlijst:** CUT HOOFDSTUK + nummer. KEEP titel, drie betekenisvolle stage-statussen en primaire starttekst. REPLACE-BY-LAYOUT drie herhaaliconen door één rustige herhaalzone. CUT lijnen tussen elke stage wanneer afstand voldoende groepeert. KEEP bestaande hoofdstukscène, maar alleen als context en niet groter dan het leerdoel.

**Hiërarchie (squint):** Nu: enorme kaart → scène → titel/start. Doel: hoofdstuktitel → volgende les → kaart en eerdere stappen.

**Consistentie:** Stage-lijstrijen, hoofdknop en terugknop gebruiken drie verschillende actiepatronen. Op <1024px bestaat geen afzonderlijke hoofdstukpagina: dezelfde taak verschijnt in het overzicht. Gemeten iPad-signatures: radius 12px · 0px · 999px · 24px · 16px; tekst 16px · 17px · 15px · 13px · 28px. Glass/shadow/padding per element: raw capture, niet afgeleid uit een render.

**UX 4/5:** Eén duidelijke hoofdknop; drie herhaalacties vragen onderscheid. **DX 2/5:** Overzicht en hoofdstuk delen renderPanel met meerdere conditionele presentaties. **AX 2/5:** data-reis-page is bruikbaar, maar responsive pad verschilt en vraagt adapterkennis.

**Kindheuristiek:** 3 s: ja bij een nog niet voltooide stage; goud vraagt extra uitleg via vorm. Eén stap: de onderste verzadigde knop is duidelijk. Progressie: drie vinkcirkels dragen betekenis zonder tekst. Kaart: prominent; camera mag kadreren maar geometrie nooit wijzigen. Nino: in scène, geen actieve aanwijzer. Beloning: goud herhalen blijft een lesactie, geen modalblokkade.

**Vindbaar/controleerbaar:** scripts/v3/reis.js; scripts/qa-v3-glas2.mjs; audit-state `reis-hoofdstuk`. [iPad](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-reis-hoofdstuk-1080x810-normal.png) · [desktop](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-reis-hoofdstuk-1440x900-normal.png).

### Oefenen — kiezen

**Doel:** Ik kies wat en hoe ik oefen. **Eén primaire actie:** Start.

**Concurrerende acties:** Vier vormen en hoofdstukken: KEEP als invoer, geen concurrerende CTA’s; Slim rondje: DEMOTE als aanbevolen optie alleen bij beschikbare inhoud; tabs: KEEP secundair.

**Cutlijst:** KEEP Ontdekken, Aanwijzen en Namen schrijven als noodzakelijke keuzelabels. CUT herhaalde Start-iconografie wanneer het werkwoord al duidelijk is. REPLACE-BY-LAYOUT kopjes en verdelers door twee herkenbare keuzegroepen. KEEP geselecteerde vorm én geselecteerd hoofdstuk. CUT decoratieve kaartpunten die niet gekozen kunnen worden.

**Hiërarchie (squint):** Nu: kaart → keuzeplaat → Start. Doel: geselecteerde oefenvorm → Start → hoofdstukcontext.

**Consistentie:** Vormtegels, hoofdstukchips en startpill tonen elk eigen radius/padding. Meer geselecteerde violette oppervlakken tegelijk dan op Reis. Gemeten iPad-signatures: radius 12px · 0px · 24px · 20px · 999px; tekst 16px · 17px. Glass/shadow/padding per element: raw capture, niet afgeleid uit een render.

**UX 3/5:** Twee invoergroepen zijn logisch, maar veel gelijkwaardige visuele keuzes. **DX 2/5:** De chips en velden bestaan als lokale helpers; andere schermen hebben varianten. **AX 2/5:** data-form en data-group helpen; modes learn/point/write verschillen van UI-termen.

**Kindheuristiek:** 3 s: starten is vindbaar, configuratie kost langer. Eén stap: Start wint alleen als selecties niet even verzadigd zijn. Progressie: selectie zichtbaar, historisch leren hoeft hier niet herhaald. Kaart: voorproef moet duidelijk niet de invoer zijn. Nino: identiteit kan klein blijven, geen extra speech bubble. Beloning: niet nodig vóór een vrije oefening.

**Vindbaar/controleerbaar:** scripts/v3/shell.js; scripts/qa-v3-shell.py; audit-state `oefenen`. [iPad](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-oefenen-1080x810-normal.png) · [desktop](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-oefenen-1440x900-normal.png) · [naast ontwerp-render](audit/5060ac771ded70c6af35aead83cc1346630703df/comparisons/oefenen.png).

### Oefenen — Ontdekken

**Doel:** Ik ontdek waar deze plek ligt. **Eén primaire actie:** Volgende plek.

**Concurrerende acties:** Kaarttargets: KEEP als leerinhoud; geluid/kaartweergave: DEMOTE; tabs en vertrek: DEMOTE; antwoord tonen: KEEP alleen wanneer nodig voor ontdekken.

**Cutlijst:** KEEP huidige plaatsnaam en één stapnummer. CUT dubbele oefenvorm-/hoofdstuklabels als de kop die al toont. REPLACE-BY-LAYOUT instructiezin door kaart plus doelnaam naast de volgende actie. KEEP kaartlabels die kennis overdragen; CUT decoratieve omlijsting rond de leerzone.

**Hiërarchie (squint):** Nu: kaart → tekst/knoppen → context. Doel: doelnaam → volgende stap → omliggende kaart.

**Consistentie:** V2-leercontrols worden in een V3-shell gezet; andere knopafmetingen dan de keuzepagina. Nino/art en navigatie blijven aanwezig terwijl de taak klein is. Gemeten iPad-signatures: radius 999px · 0px · 12px · 50%; tekst 17px · 16px · 15px · 14px. Glass/shadow/padding per element: raw capture, niet afgeleid uit een render.

**UX 3/5:** Kaart ondersteunt ontdekken; tekst en meerdere controles verdelen aandacht. **DX 1/5:** Verborgen V2-DOM en echte V2-controls blijven de V3-leerweergave sturen. **AX 2/5:** Mode-adapter en V2-ids nodig naast SPEC; eigen schermcontract ontbreekt.

**Kindheuristiek:** 3 s: doelnaam helpt; de volgende actie moet steeds op dezelfde plek blijven. Eén stap: ontdekken heeft een rustige Volgende nodig. Progressie: één visuele reeks voldoet. Kaart: aanraken moet een zichtbaar en voorspelbaar gevolg hebben. Nino: alleen houden als hij iets aanwijst. Beloning: klein en niet blokkerend.

**Vindbaar/controleerbaar:** scripts/v3/les.js / shell.js; scripts/qa-v3-les.py; audit-state `ontdekken`. [iPad](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-ontdekken-1080x810-normal.png) · [desktop](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-ontdekken-1440x900-normal.png) · [naast ontwerp-render](audit/5060ac771ded70c6af35aead83cc1346630703df/comparisons/ontdekken.png).

### Oefenen — Aanwijzen

**Doel:** Ik tik de gevraagde plek op de kaart aan. **Eén primaire actie:** Tik de gevraagde plek.

**Concurrerende acties:** Overslaan: DEMOTE; uitzoom/kaartmodus: DEMOTE; navigatie: DEMOTE; eventuele keuze bij overlappende plekken: KEEP als noodzakelijke precisiehulp.

**Cutlijst:** KEEP gevraagde naam en correctiefocus. CUT dubbele modusnaam en begeleidende zinnen die dezelfde opdracht herhalen. KEEP geografische labels waar ze geen antwoord weggeven. REPLACE-BY-LAYOUT hulpzin door vraag boven de kaart. KEEP toegankelijke namen bij iconen, ook wanneer zichtbare labels verdwijnen.

**Hiërarchie (squint):** Nu: kaart/omgeving → vraag → secundaire controls. Doel: gevraagde naam → kaarttarget → feedbackcontext.

**Consistentie:** SVG-targetvorm en effectieve hit-test verschillen van HTML-knoppen; toets en vrije oefening moeten dezelfde feedback- en focuspositie houden. Gemeten iPad-signatures: radius 999px · 0px · 12px · 50%; tekst 17px · 16px · 15px · 14px. Glass/shadow/padding per element: raw capture, niet afgeleid uit een render.

**UX 3/5:** Directe handeling, maar kleine visuele targets vragen extra tapruimte zonder verplaatste coördinaten. **DX 1/5:** V2-hit testing is waardevol en mag niet door nieuwe UI-hitboxes worden gekopieerd. **AX 2/5:** data-id is stabiel; broncontract en geometriecheck zijn noodzakelijk voor wijzigingen.

**Kindheuristiek:** 3 s: ja als de naam boven de kaart staat. Eén stap: de kaart zelf is de primaire actie. Progressie: één reeks, geen dubbele teller. Kaart: hitzones meten; steden nooit uit elkaar schuiven. Nino: weg uit het targetgebied. Beloning: feedback mag de volgende tik niet blokkeren.

**Vindbaar/controleerbaar:** scripts/v3/les.js / shell.js; scripts/qa-v3-les.py; audit-state `aanwijzen`. [iPad](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-aanwijzen-1080x810-normal.png) · [desktop](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-aanwijzen-1440x900-normal.png) · [naast ontwerp-render](audit/5060ac771ded70c6af35aead83cc1346630703df/comparisons/aanwijzen.png).

### Oefenen — Namen schrijven

**Doel:** Ik schrijf de naam van de aangewezen plek. **Eén primaire actie:** Controleer mijn antwoord.

**Concurrerende acties:** Overslaan: DEMOTE; kaartmodus: DEMOTE; tabnavigatie: DEMOTE; toetsenbord-Enter: KEEP identiek aan controleren.

**Cutlijst:** KEEP invoerlabel/toegankelijke naam, aangewezen plek en antwoordcontrole. CUT dubbele taaklabels en herhaalde toetsenbordhulp. REPLACE-BY-LAYOUT naamveld direct onder de kaartvraag. KEEP één telling; CUT punten voor Margherita en Nog drie pizza’s tot je Vespa-rit waar pizza-vulling en drie cirkels dit al tonen. Vergroot de echte kaart binnen dezelfde projectie in plaats van leeg decor te behouden.

**Hiërarchie (squint):** Nu: kaart → controls/tekst → invoer. Doel: aangewezen plek → invullen/controle → voortgang.

**Consistentie:** Controleer is roestbruin terwijl Volgende violet is; antwoordveld/controls komen uit V2, glasshell en typografie uit V3. Fontminima verschillen tussen kaartlabels en HTML-tekst. Gemeten iPad-signatures: radius 999px · 0px · 12px · 50%; tekst 17px · 16px · 15px · 14px. Glass/shadow/padding per element: raw capture, niet afgeleid uit een render.

**UX 3/5:** Schrijven is herkenbaar, maar de hoogste leeslast in de leertaak vraagt reductie. **DX 1/5:** De bridge is een migratiegrens, geen uitnodiging voor een tweede beoordelingsengine. **AX 2/5:** answer en next zijn stabiel; de bedoelde modi en QA-opstart vragen meerdere bronnen.

**Kindheuristiek:** 3 s: ja zodra de cursor en doelmarkering samen zichtbaar zijn. Eén stap: controle moet visueel winnen; Overslaan blijft rustig. Progressie: één visueel ritme, tekstteller alleen ondersteunend. Kaart: doelmarkering blijft echt geprojecteerd. Nino: geen decoratie naast het antwoordveld. Beloning: pas na beoordeling, niet tijdens typen.

**Vindbaar/controleerbaar:** scripts/v3/les.js / shell.js; scripts/qa-v3-les.py; audit-state `schrijven`. [iPad](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-schrijven-1080x810-normal.png) · [desktop](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-schrijven-1440x900-normal.png) · [naast ontwerp-render](audit/5060ac771ded70c6af35aead83cc1346630703df/comparisons/schrijven.png).

### Lesfeedback — goed

**Doel:** Ik zie dat mijn antwoord goed is en ga verder. **Eén primaire actie:** Volgende.

**Concurrerende acties:** Kaart en vertrek: DEMOTE; beloningsanimatie: KEEP kort en onderbreekbaar; herhaling van juiste naam: KEEP alleen als leerbevestiging.

**Cutlijst:** KEEP goed/vink plus correcte plaatsnaam wanneer die anders ontbreekt. CUT complimentzin zonder informatie en dubbele beloningstekst. REPLACE-BY-LAYOUT uitslag direct bij de vraag, Volgende op de vaste actieplek. KEEP vorm/tekst naast groen voor kleuronafhankelijk begrip.

**Hiërarchie (squint):** Nu: gekleurde feedback → kaart → Volgende. Doel: uitslag → Volgende → kaartcontext.

**Consistentie:** Goed geschreven! is nu violet (rgb 77,50,165), terwijl foutfeedback rood is. Positieve feedback deelt dus kleurbetekenis met selectie/CTA; houd vorm en focusplek gelijk en kies één expliciet semantisch contract. Gemeten iPad-signatures: radius 999px · 0px · 12px · 50%; tekst 17px · 16px · 15px · 14px · 18px. Glass/shadow/padding per element: raw capture, niet afgeleid uit een render.

**UX 4/5:** Snelle bevestiging is goed; extra successchrijftaal is overbodig. **DX 1/5:** Dezelfde V2-beoordeling blijft de betrouwbare bron. **AX 2/5:** message/next stabiel, maar vrije les/toets/route zijn verschillende fixtures.

**Kindheuristiek:** 3 s: ja bij korte positieve bevestiging. Eén stap: Volgende is de enige vervolgactie. Progressie: stap gaat zichtbaar vooruit. Kaart: antwoordfocus behouden tijdens bevestiging. Nino: alleen een betekenisvolle korte reactie. Beloning: reduced-motion en geen gedwongen wachttijd.

**Vindbaar/controleerbaar:** scripts/v3/les.js; scripts/qa-v3-les.py; audit-state `feedback`. [iPad](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-feedback-1080x810-normal.png) · [desktop](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-feedback-1440x900-normal.png) · [naast ontwerp-render](audit/5060ac771ded70c6af35aead83cc1346630703df/comparisons/feedback.png).

### Lesfeedback — fout

**Doel:** Ik leer de juiste naam en probeer de volgende plek. **Eén primaire actie:** Volgende.

**Concurrerende acties:** Hersteltypen: KEEP indien huidige engine dat ondersteunt; kaarttools/tabwissel: DEMOTE; Overslaan na beoordeling: CUT indien dubbel met Volgende.

**Cutlijst:** KEEP juiste naam, mijn relevante fout en kleuronafhankelijke foutmarkering. CUT oordelende zinnen en dubbele labels zoals Jij schreef wanneer uitlijning het verschil toont. REPLACE-BY-LAYOUT fout en correct antwoord onder elkaar bij hetzelfde vraaganker.

**Hiërarchie (squint):** Nu: feedbackkleur → kaart → antwoorddetails. Doel: juiste naam → Volgende → mijn eerdere antwoord.

**Consistentie:** Foutfeedback is rood; positieve feedback is violet. Leg semantische feedback vast zonder dit met de selectiekleur te verwarren. Naam, corrigeerregel en volgende actie moeten bij elke leervorm hetzelfde patroon volgen. Gemeten iPad-signatures: radius 999px · 0px · 12px · 50%; tekst 17px · 16px · 15px · 14px · 18px. Glass/shadow/padding per element: raw capture, niet afgeleid uit een render.

**UX 3/5:** Correctie moet sterker zijn dan de foutmarkering. **DX 1/5:** Hergebruik grade/answer state; geen extra status in nieuwe opslag. **AX 2/5:** QA moet fout én correct inspecteren, niet alleen een reveal-state.

**Kindheuristiek:** 3 s: juist antwoord moet zonder zoeken leesbaar zijn. Eén stap: Volgende, geen tweede verzadigde knop. Progressie: fout is een leerstap, geen verloren route. Kaart: correcte locatie duidelijk, geografisch onveranderd. Nino: behulpzaam, nooit bestraffend. Beloning: geen blokkerende teleurstellingsanimatie.

**Vindbaar/controleerbaar:** scripts/v3/les.js; scripts/qa-v3-les.py; audit-state `feedback-fout`. [iPad](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-feedback-fout-1080x810-normal.png) · [desktop](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-feedback-fout-1440x900-normal.png).

### Toets — instellen

**Doel:** Ik kies mijn toets en begin. **Eén primaire actie:** Start toets.

**Concurrerende acties:** Hoofdstukken, vorm en lengte: KEEP invoer; willekeurig: DEMOTE als alternatief binnen dezelfde groep; tabs: KEEP secundair; geschiedenis/resultaten: MOVE naar resultaat/voortgang.

**Cutlijst:** KEEP keuzelabels die onderscheid dragen: vorm, lengte, hoofdstukken. CUT dubbele Start-iconen en beschrijvingen van dezelfde keuzen. REPLACE-BY-LAYOUT één configuratieplaat met drie korte groepen en Start onderaan. KEEP geselecteerde toestand in vorm én tekst/icoon.

**Hiërarchie (squint):** Nu: kaart → configuratiekeuzen → Start. Doel: gekozen toets → Start toets → overige opties.

**Consistentie:** Dezelfde hoofdstukchips als Oefenen, maar extra keuzevarianten voor vorm en lengte; een gedeeld field/selection contract kan dit vereenvoudigen. Gemeten iPad-signatures: radius 12px · 0px · 999px · 20px; tekst 16px · 17px. Glass/shadow/padding per element: raw capture, niet afgeleid uit een render.

**UX 3/5:** Keuzen zijn logisch, maar gelijkwaardige chips maken de start minder rustig. **DX 2/5:** Configuratie boven de bestaande exam-engine voorkomt tweede toetslogica. **AX 2/5:** data-group/data-value zijn bruikbaar; setup/result/live hebben apart QA-pad nodig.

**Kindheuristiek:** 3 s: beginactie zichtbaar; alle configuratie lezen duurt langer. Eén stap: Start toets moet als enige volledig verzadigd zijn. Progressie: niet nodig voor de eerste toetsvraag. Kaart: voorproef geeft context, geen verborgen invoer. Nino: geen extra uitlegtekst nodig. Beloning: toets geeft geen pizza; dat contract blijft onaangeraakt.

**Vindbaar/controleerbaar:** scripts/v3/toets.js; scripts/qa-v3-toets.py; audit-state `toets`. [iPad](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-toets-1080x810-normal.png) · [desktop](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-toets-1440x900-normal.png) · [naast ontwerp-render](audit/5060ac771ded70c6af35aead83cc1346630703df/comparisons/toets.png).

### Toets — vraag

**Doel:** Ik laat zien welke plekken ik ken. **Eén primaire actie:** Beantwoord de huidige vraag.

**Concurrerende acties:** Overslaan: DEMOTE; vrije navigatie: DEMOTE, hervatten behouden; kaartweergave: DEMOTE; typen versus aanwijzen: KEEP enginekeuze.

**Cutlijst:** KEEP naamvraag, antwoordactie en één vraagnummer. CUT herhaalde toetsmoduslabels. REPLACE-BY-LAYOUT identieke antwoordzone als oefenen; geen extra toetsbanner. KEEP kleuronafhankelijke correctie en focus.

**Hiërarchie (squint):** Nu: kaart → vraag → antwoordbediening. Doel: vraag → antwoord → voortgang.

**Consistentie:** V2-toets loopt in dezelfde lesson shell; stijl kan gedeeld worden, beloningsregels moeten gescheiden blijven. Gemeten iPad-signatures: radius 999px · 0px · 12px · 50%; tekst 17px · 16px · 15px · 14px. Glass/shadow/padding per element: raw capture, niet afgeleid uit een render.

**UX 4/5:** Bekende oefenbediening helpt; navigeren mag antwoorden niet verliezen. **DX 1/5:** V2-exam blijft bron; alleen presentatie delen. **AX 2/5:** Live-vraag moet naast setup en resultaat apart vastgelegd worden.

**Kindheuristiek:** 3 s: ja door hetzelfde patroon als oefenen. Eén stap: actuele antwoordactie. Progressie: één teller met visuele voortgang. Kaart: echte targets en overlapkeuze blijven werken. Nino: geen afleidende beloningsactie. Beloning: nooit pizza toekennen voor toetsantwoorden.

**Vindbaar/controleerbaar:** scripts/v3/toets.js / les.js; scripts/qa-v3-toets.py; audit-state `toets-actief`. [iPad](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-toets-actief-1080x810-normal.png) · [desktop](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-toets-actief-1440x900-normal.png).

### Toets — resultaat

**Doel:** Ik zie wat ik al ken en wat ik nog oefen. **Eén primaire actie:** Oefen deze fouten wanneer er fouten zijn.

**Concurrerende acties:** Nieuwe toets: DEMOTE; Kopieer/E-mail/Print: MOVE naar één Deel-resultaatmenu; terug naar Reis: KEEP secundair; foutenlijst: KEEP leerinhoud; kaarttools: DEMOTE.

**Cutlijst:** KEEP score en juiste namen bij fouten. CUT dubbele Resultaat/Toetsresultaat-koppen en complimenttekst zonder informatie. REPLACE-BY-LAYOUT score boven één foutenlijst en één herstelactie. KEEP geografische foutlocaties; CUT decoratieve badges rond dezelfde score.

**Hiërarchie (squint):** Nu: score/Nino → kaart → fouten. Doel: leeruitkomst → Oefen deze fouten → kaart/details.

**Consistentie:** Resultaatkaart gebruikt eigen displaytypografie; hergebruik feedbackkleuren en foutenlijstpatroon, niet de successcreen als extra componentfamilie. Gemeten iPad-signatures: radius 12px · 0px · 28px · 999px · 18px; tekst 16px · 17px. Glass/shadow/padding per element: raw capture, niet afgeleid uit een render.

**UX 4/5:** Heldere afronding; de leeractie moet sterker zijn dan een volgende toets. **DX 2/5:** Resultaat leest dezelfde engine en eigen bestaande toetsopslag; schema niet wijzigen. **AX 2/5:** toetsResult view is expliciet; resultaatfixture moet echt antwoorden doorlopen.

**Kindheuristiek:** 3 s: score direct zichtbaar; vervolgactie afhankelijk van fouten. Eén stap: fouten oefenen; bij foutloos terug naar Reis. Progressie: score zichtbaar, niet alleen complimenttekst. Kaart: fouten op echte locaties, geen les-landmarks toevoegen. Nino: vieren of aanmoedigen, niet beide tegelijk. Beloning: korte erkenning, geen onterechte pizza.

**Vindbaar/controleerbaar:** scripts/v3/toets.js; scripts/qa-v3-toets.py; audit-state `toets-resultaat`. [iPad](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-toets-resultaat-1080x810-normal.png) · [desktop](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-toets-resultaat-1440x900-normal.png) · [naast ontwerp-render](audit/5060ac771ded70c6af35aead83cc1346630703df/comparisons/toets-resultaat.png).

### Beloningen

**Doel:** Ik zie wat ik heb verdiend en wat de volgende beloning is. **Eén primaire actie:** Open mijn Reisboekje.

**Concurrerende acties:** Stempels/postkaarten bekijken: DEMOTE als boekinhoud; Vespa-rit: KEEP alleen wanneer beschikbaar; tellers: KEEP context, geen losse CTA’s; navigatie: KEEP.

**Cutlijst:** KEEP verdiende pizza’s, ritstatus en boekomslag. CUT dubbele label/tellercombinaties voor dezelfde hoeveelheid. REPLACE-BY-LAYOUT verdiend → eerstvolgende beloning in één rij. KEEP 8 punten per pizza/3 pizza’s per rit als bestaande logica; toon dit via vulling in plaats van extra uitleg.

**Hiërarchie (squint):** Nu: illustraties/boek/Vespa → aantallen → acties. Doel: volgende beloning → boekactie → verzameling.

**Consistentie:** Illustratieve tegels, sprites, meters en cover zijn meerdere beloningspatronen; maak de container gelijk, behoud goedgekeurde kunst en bestaande beloningsstaat. Gemeten iPad-signatures: radius 12px · 0px · 20px; tekst 16px · 17px. Glass/shadow/padding per element: raw capture, niet afgeleid uit een render.

**UX 3/5:** Aantrekkelijk, maar meerdere verzamelingen concurreren. **DX 2/5:** Geen nieuwe tellers of cache toevoegen; render bestaande waarden. **AX 2/5:** Tiles zijn deels buttons, deels groups; één expliciet actiecontract ontbreekt.

**Kindheuristiek:** 3 s: wat verdiend is herkenbaar, volgende stap minder vanzelfsprekend. Eén stap: boek openen; beschikbare rit mag tijdelijk hoofdactie zijn. Progressie: pizza-vulling draagt betekenis zonder lezen. Kaart: niet de hoofdtaak hier. Nino: rit of boek, geen tweede decoratieve pose. Beloning: toets reduced-motion en overslaan; nooit gedwongen wachten.

**Vindbaar/controleerbaar:** scripts/v3/reis.js / boek.js; scripts/qa-v3-shell.py; audit-state `beloningen`. [iPad](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-beloningen-1080x810-normal.png) · [desktop](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-beloningen-1440x900-normal.png) · [naast ontwerp-render](audit/5060ac771ded70c6af35aead83cc1346630703df/comparisons/beloningen.png).

### Reisboekje

**Doel:** Ik blader door mijn verzamelde herinneringen. **Eén primaire actie:** Volgende bladzijde.

**Concurrerende acties:** Vorige: KEEP secundair; sluiten: KEEP altijd bereikbaar; losse tabs/verzamelingen: DEMOTE; kaart-/toetsnavigatie: MOVE buiten het boek.

**Cutlijst:** KEEP paginatitel, verzamelde stempels en echte bijschriften met kenniswaarde. CUT de dubbele koppen Mijn reisboekje / Il mio viaggio in Italia en Ciao, Demo! naast Demo’s reisboekje; behoud één Nederlandse titel en één paginateller. REPLACE-BY-LAYOUT vaste linker/rechter bladerplekken in plaats van instructietekst. KEEP papier als tweede materiaalwereld, geen extra glas-in-papier.

**Hiërarchie (squint):** Nu: open spread/kunst → details → bladercontrols. Doel: huidige pagina → volgende pagina → verzamelcontext.

**Consistentie:** Papier wijkt terecht af van glasshell; knoppen, focusring en 44px-doelen moeten wel dezelfde taal gebruiken. Swipe is aanvulling, geen vervanger van keyboard/knoppen. Gemeten iPad-signatures: radius 13px · 0px; tekst 16px · 14.6595px. Glass/shadow/padding per element: raw capture, niet afgeleid uit een render.

**UX 4/5:** Herkenbaar boek, afhankelijk van goed bereikbare footer en sluitactie op iPad. **DX 2/5:** V2-boek wordt aangekleed; bladerlogica blijft één bron. **AX 2/5:** bookSpread en footer bestaan; SPEC beschrijft geen compact toetsbaar boekcontract.

**Kindheuristiek:** 3 s: bladeren is herkenbaar. Eén stap: volgende pagina, vorige en sluiten secundair. Progressie: gevulde/lege verzamelplekken leesbaar zonder telling. Kaart: inhoud, geen interactieve landkaart verplicht. Nino: alleen op de bestaande postkaart/scène. Beloning: openen moet snel zijn; grote spreads vragen geheugenmeting.

**Vindbaar/controleerbaar:** scripts/v3/boek.js; scripts/qa-v3-ronde5.py; audit-state `reisboekje`. [iPad](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-reisboekje-1080x810-normal.png) · [desktop](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-reisboekje-1440x900-normal.png).

### Voortgang

**Doel:** Ik zie welke plekken ik al ken. **Eén primaire actie:** Ga verder met wat nog niet klaar is.

**Concurrerende acties:** Hoofdstuk-/kaartselectie: KEEP invoer; lijstversie: DEMOTE als alternatief; scorelabels: KEEP context; navigatie: KEEP; legenda: KEEP alleen voor niet-vanzelfsprekende kleuren.

**Cutlijst:** KEEP drie betekenisvolle voortgangstinten plus tekstueel alternatief. CUT dubbele totalen, slogan en herhaalde kopjes boven dezelfde kaart. REPLACE-BY-LAYOUT kaart boven één eerstvolgende leeractie. KEEP geografische contouren en namen; geen decoratieve kleur over de geografische betekenis leggen.

**Hiërarchie (squint):** Nu: kaart/kleuren → statistiek → vervolg. Doel: wat ik ken → verder leren → detailcontext.

**Consistentie:** Kaarttitel/legendachips zijn extra oppervlakken; houd ze onderdeel van dezelfde kaartcomponent. De tinten moeten dezelfde stages betekenen als Reis. Gemeten iPad-signatures: radius 12px · 0px · 24px; tekst 16px. Glass/shadow/padding per element: raw capture, niet afgeleid uit een render.

**UX 3/5:** Ruimtelijke voortgang helpt; veel statistiek maakt de vervolgstap minder sterk. **DX 2/5:** Voortgang moet uit bestaande state afgeleid blijven, geen tweede statusmodel. **AX 2/5:** Legenda, geo-items en route koppelen vraagt nu meerdere bronnen.

**Kindheuristiek:** 3 s: wat klaar is ja, waar verder nog niet vanzelfsprekend. Eén stap: één terugkeer naar de volgende les. Progressie: vorm/vulling plus toegankelijk alternatief. Kaart: kleurinformatie mag de echte vormen niet veranderen. Nino: alleen hulp bij een ontbrekende vervolgstap. Beloning: geen aparte viering nodig op een overzicht.

**Vindbaar/controleerbaar:** scripts/v3/voortgang.js; scripts/qa-v3-voortgang.py; audit-state `voortgang`. [iPad](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-voortgang-1080x810-normal.png) · [desktop](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-voortgang-1440x900-normal.png) · [naast ontwerp-render](audit/5060ac771ded70c6af35aead83cc1346630703df/comparisons/voortgang.png).

### Instellingen

**Doel:** Ik pas mijn profiel aan of bewaar mijn voortgang. **Eén primaire actie:** Bewaar mijn voortgang — profiel is secundair; splits beheer en profiel als één doel niet lukt.

**Concurrerende acties:** Profiel: MOVE eigen groep; export: KEEP primaire veilige beheeractie; import: KEEP secundair; reset/wissen: DEMOTE in afgescheiden Gegevens wissen-zone; sluiten: KEEP.

**Cutlijst:** KEEP veldlabels, reservekopie-acties, waarschuwing bij wissen en concrete foutmeldingen. CUT versienummers/technische labels uit de primaire zone. REPLACE-BY-LAYOUT profiel, reservekopie en gevaarlijke acties in afzonderlijke groepen; geen helpertekst nodig voor herkenbare bediening.

**Hiërarchie (squint):** Nu: lange dialoog/verschillende beheeracties → formulieren → footer. Doel: reservekopie → veilige actie → profiel en destructief beheer apart.

**Consistentie:** V2-dialoog heeft eigen veld-, knop- en typevarianten; deel primitieve controls met kennismaking zonder de risicowaarschuwingen te schrappen. Gemeten iPad-signatures: radius 12px · 0px; tekst 16px · 17px. Glass/shadow/padding per element: raw capture, niet afgeleid uit een render.

**UX 2/5:** Meerdere doelen in één dialoog; wissen heeft andere ernst dan naam aanpassen. **DX 1/5:** Bestaande import/export/reset-scopes zijn kwetsbaar; presentatie mag die niet dupliceren. **AX 2/5:** settings-ids stabiel maar schema-/resetkennis staat buiten SPEC.

**Kindheuristiek:** 3 s: nee, dit scherm doet meerdere beheerklussen. Eén stap: nog geen; groeperen of splitsen vereist G1. Progressie: reservekopie mag nooit op voortgangswissen lijken. Kaart: niet nodig in de actieve beheerzone. Nino: decoratie kan weg, profielbeeld alleen bij profiel. Beloning: niet van toepassing; geen viering bij beheer.

**Vindbaar/controleerbaar:** scripts/v3/shell.js; scripts/qa-v3-shell.py; audit-state `instellingen`. [iPad](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-instellingen-1080x810-normal.png) · [desktop](audit/5060ac771ded70c6af35aead83cc1346630703df/screenshots/chromium-instellingen-1440x900-normal.png).

## Risico’s, gates en verificatie voor Claude Code

|Risico|Wat kan breken|Bewijs vóór/na|
|---|---|---|
|Opslag/progressie|sleutels, schema’s, routefase, dubbeltokens|Karakterisering inclusief reload/import/export/reset; keys/schema ongewijzigd; geen tweede afgeleide opslag|
|Routing/hervatten|tab tijdens les, terug/Verder, responsieve hoofdstukpagina|Capture-fixtures plus echte heen/terug/keyboard- en hervattingsflow per getroffen scherm|
|Geometrie|projectie, kust, point-hit, SVG-stroke, zoom|Bestaande 46/46-geo/hit-tests; bron/pad/point-hashes; geen visueel uit elkaar schuiven|
|A11y|contrast op ander deel van foto, focus, naam, screenreader, motion|AA-glyphmeting + axe + Tab + reduce-matrix; fysiek Safari/VoiceOver; labels semantisch houden na cuts|
|iPad geheugen/FPS|extra blur-lagen, grote spreads, duplicaatraster, DOM-retentie|CPU4×-proxy herhalen, dezelfde raster/heapbasis; echte iPad9 Safari offline testen, peak-memory en scroll|
|Offline single file|font/axe/netwerkdependency lekt naar app, assets verdwijnen|Previewtool-deps alleen onder scripts/audit; app build offline openen zonder netwerk; geen preview commit|
|Cascade-opruiming|latent hover/focus/disabled/breakpoint verdwijnt|Computed-style-signatures en alle states vergelijken; unmatched selector nooit alleen op audit verwijderen|

Open verificatievoorwaarde: op deze design-snapshot ontbreken tests/characterization en een root-script test:characterization. De gevraagde fase-2-karakterisering moet vóór implementatie beschikbaar en groen worden gemaakt via de door Dennis/Claude gekozen integratie. In deze audit is niets daarvan gemerged of toegevoegd aan de app. Het exacte bestaande 46/46-commando moet daarbij in de SPEC-matrix worden vastgelegd; deze audit heeft de app-geometrietests niet uitgevoerd.

Voor elk goedgekeurd punt: één kleine commit door Claude Code; lint, tests, characterization, 46/46 geometrie, contrast en getroffen screenshot volgens Dennis’ opdracht. Geen automatische designfix op basis van kandidaten alleen. Na top10 één nieuwe volledige matrix met dezelfde fixtures/snapshotmethodiek en een fysieke iPad9-check.

**Stop / G1:** Dennis keurt de gerangschikte top10 en de expliciete voorgestelde bezuinigingen goed of wijzigt de scope. Deze auditbranch bevat geen implementatie. G1 is geen G4: geen merge naar main of productie.

Referenties: [WCAG 2.2 contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), [Playwright media emulation](https://playwright.dev/docs/api/class-page#page-emulate-media).

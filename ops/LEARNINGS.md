# LEARNINGS — het zelflerende deel

Dit is waar het systeem slimmer wordt. Elke FAIL, elke correctie van Dennis en elke onnodig dure run levert één regel op.

## Regels
1. **Vastleggen:** na elke run met FAIL, correctie of verspilling volgt één les in het formaat hieronder. Geen les betekent niets toevoegen.
2. **Promoveren:** komt dezelfde les **2×** voor, dan wordt hij een regel op de plek waar hij effect heeft:
   - gedrag van agents → `CLAUDE.md` / `AGENTS.md`
   - kwaliteitseis → `ops/QUALITY.md` of een test
   - procedure → het betreffende playbook
   - toetsbare eis → **bij voorkeur een test of lint-check**. Een test vergeet niets, een tekstregel wel.
   Markeer de les dan als `→ gepromoveerd naar <bestand/test>`.
3. **Snoeien:** de maandelijkse retro verwijdert regels uit `CLAUDE.md` die niets meer doen (het model maakt die fout niet meer, of de test vangt het al). Elke regel in `CLAUDE.md` kost credits in elke sessie.
4. **Correcties van Dennis** wegen zwaarder: die worden direct gepromoveerd, niet pas na de tweede keer.

## Formaat
`YYYY-MM-DD | bron (FAIL/correctie/verspilling) | wat ging mis | waarom | les | status`

---
2026-11-13 | analyse | Een week werk zonder versie die af is | 6 parallelle werkstromen, main staat sinds 28-09 stil, overdrachten via chats | Eén actieve mijlpaal, max. 5 open branches, integreren naar main is onderdeel van "klaar" | → gepromoveerd naar `GIT_RELEASE.md` §1
2026-11-13 | analyse | Credits snel op | Parallelle Opus-agents plus Codex op dezelfde scope, lange docs elke sessie herlezen | Modelrouting en één bouwer per scope, CLAUDE.md kort | → gepromoveerd naar `HARNESS.md` §4
2026-11-14 | FAIL | Evaluator-criterium vereiste shell/git cherry, maar de nachtrun-sandbox weigerde scripts en losse git-aanroepen | contract ging uit van shelltoegang die niet gecontroleerd was | Check bij contract schrijven dat bouwer en evaluator de benodigde read-only git-commando's mogen draaien; gebruik %(ahead-behind:) in for-each-ref als enkelvoudig commando; vergelijk tegen origin/main, niet lokale main | open
2026-11-14 | FAIL (nacht 1) | Nachtrun stopte na 1 taak, cherry-check onmogelijk | allowlist per Bash-commando te smal (pipes/samengestelde git geweigerd) en lokale main verouderd | Worktree met bypassPermissions + harde deny-lijst; lokale main fetchen; vergelijken met origin/main | → gepromoveerd naar `ops/scripts/nightly.sh`
2026-11-14 | FAIL (BL-005 run 1) | Plan schreef `merge -X theirs` voor om een langlopende branch na een squash te synchroniseren; dat overschrijft stil nieuwer werk | na een squash schuift de merge-base niet op, en de regel was alleen getoetst op de huidige tip | Langlopende branch (`art/master`) komt als merge-commit op `main`; toets elke sync-regel met het scenario "nieuwere commit op de bronbranch" | open, vastleggen in `GIT_RELEASE.md` via BL-005d
2026-11-14 | correctie (BL-005 run 2) | Rapport claimde "alle verwijzingen beoordeeld" na een grep op het absolute pad; ±240 relatieve links gemist | grep op `docs/qa` vindt `../qa/` niet | Toets een uitsluiting op gebroken links in de hele boom, inclusief relatieve links | open
2026-11-14 | verspilling (BL-005) | Build op de volle boom liep vast op ENOSPC, bouwer moest uitwijken naar sparse-checkout en plumbing | schijf van de Mac mini had 4 GB vrij bij een boom van 1,3 GB per checkout | Contract noemt de benodigde vrije schijfruimte; check `df` vóór de start van een taak met extra worktrees | open
2026-11-14 | FAIL (BL-013, evaluator) | Landnamen afgesneden op iPad, labels onder 13 px en onder AA-contrast | contract toetste alleen scrollbreedte en knopcontrast; mijn eigen browsercheck keek niet naar afgekapte tekst | UI-contracten eisen meetbaar: geen afgesneden/overlappende tekst per formaat, contrast en lettergrootte van alle tekst | → gepromoveerd naar `ops/templates/SPRINT_CONTRACT.md`
2026-11-14 | evaluator (BL-013, ronde 2) | Na herstel bleef één tekst onder AA (4,49:1) in een kleur die niemand had genoemd | contrast werd getoetst op een lijst bekende kleuren | Contrastcheck over álle zichtbare tekst, met de achtergrond uit de pagina berekend | open (2e keer contrast: bij de volgende UI-taak als test in `verify-site` of een browsercheck opnemen)
2026-11-14 | FAIL (BL-005 integratie) | build-site herkende de V2.0.2-app niet (titel anders dan in september) | controle op een letterlijke titel | Controleer op een stabiel kenmerk (<title> bevat 'Italië' en het is niet het portal) | → gepromoveerd naar `scripts/build-site.mjs` en `verify-site.mjs`
2026-11-15 | FAIL (BL-001b, evaluator 1) | Branch op `merge` gezet terwijl hij volledig in een andere merge-kandidaat zat | alleen Cherry/Tree tegen main en doelbranch gemeten, niet de kandidaten onderling | Bij merge-kandidaten ook `merge-base --is-ancestor` tussen de kandidaten draaien | open
2026-11-15 | FAIL (BL-001b, evaluator 2) | Fix paste een telling op één plek aan, de oude waarde bleef in STATE optie (a) en RUNLOG staan | geen grep op het oude getal na de fix | Na elke gewijzigde telling `grep -rn '<oud getal>'` over STATE, RUNLOG en het rapport; een inventaris die zijn eigen branch meet, markeert die rij als momentopname | open
- 2026-11-15 · Na een squash-merge naar `main` hebben langlopende branches nog een oude merge-base: verplaatsen of verwijderen in `main` wordt bij een latere merge stil teruggedraaid. Toets opruimtaken met `git merge-tree` tegen elke keep-branch, niet alleen met `git log`.
- 2026-11-15 · Het nachtscript mag nooit `git commit` zonder pad doen: gestaged werk van een afgebroken agent glipt dan mee.
- 2026-11-15 · Een check die alleen `body *` scant mist `body::before`/`html`, en precies daar zitten app-brede mistlagen. Scan pseudo-elementen en meet ook een toestand ná een interactie; laat een nieuwe check eerst falen op de oude build.
- 2026-11-15 · Een geschaald "ongebruikt" asset in het dieet is een geheugenafspraak: wie het in gebruik neemt, past het dieet aan (niet stil een placeholder laten staan).
- 2026-11-15 · Per blok sturen op losse metingen (kaart-%, scène-%, rijen) leverde een build zonder samenhang op. Bij een visuele richting eerst één compositie laten goedkeuren (statisch, met de renders ernaast) en pas daarna meten en bouwen; designverkenning hoort in de Claude-app, niet in een build-loop.
- 2026-11-16 · "Pixel-identiek" bij een refactor: vergelijk tegen een referentiebuild = basis + de tussentijdse functionele commits, en neem breakpoint-grenzen (1024/1279/1280), de les en gescrolde toestanden op. Een set zonder die toestanden miste drie regressies van weggehaalde `!important`.
- 2026-11-19 (BL-029): een QA die tekst verbergt en de achtergrond meet, ziet geen laag ÓVER de tekst; meet ook de getekende pixels (zichtbaar vs verborgen). En test korte schermen (1366×768, 1280×800): daar scrollde de pagina en schoof een vaste balk over het lesresultaat. Een fix die één fout oplost (marker onder knop) mag de kern (kaart eerst) niet halveren: meet het kaartaandeel mee.

## 2026-11-19 · BL-035 livefixes
- Een klacht "werkt niet live" eerst meten in beide engines (computed style, live URL) voordat je herbouwt: hier pasten de maskers overal toe; het beeld van Dennis past bij de toegankelijkheidsterugval (`prefers-reduced-transparency`/`prefers-contrast`). Vraag naar OS-instellingen.
- Doorzichtige tikvlakken (V2 `microHit`) liggen boven decoratielagen: `:hover` komt daar nooit aan. Hover dan uit de positie van de aanwijzer halen; de lagen niet omdraaien (tikken moet bij de plek blijven).
- WebKit in de cloud: Playwright-WebKit downloaden wordt geblokkeerd; `apt install webkit2gtk-driver xvfb` + WebDriver (`scripts/qa-webkit.mjs`) werkt.

## 2026-11-20 · BL-036 / laadtijd
- `build:site` had `;` na de V3-release-build: faalde die build (bv. "Release build contains demo code"), dan ging de site door met het oude `output/html/TOPO-V3-Italie.html` en meldde "Site-check: OK". Nu bouwt `build-site.mjs` de release zelf en faalt hard. Een stap die een artefact maakt, moet de keten stoppen.
- Een gate-commando dat `grep` op testuitvoer doet, stopt niet op een rode test (de pijp slaagt). Altijd de exitcode van de test zelf gebruiken vóór commit/push (gebeurd: 1 test rood gepusht, alleen testcode, direct hersteld).
- Lazy images helpen niet voor V2-markup die tijdens het parsen even zichtbaar is: verberg tijdens het opstarten precies wat V3 daarna toch verbergt (`html.v3Boot …{display:none}`).
- Jsdom-testbestanden parallel draaien slaat het geheugen dicht; één bestand tegelijk (`--test-concurrency=1`).

## 2026-11-20 · BL-039
- Vercel `git.deploymentEnabled` gebruikt minimatch: `"*"` matcht geen `/`, dus `claude/…` deployde gewoon. Gebruik `"*/**": false` naast `"*": false`. En controleer een "geen deployment" pas na minuten én via de GitHub-commitstatus, niet direct in de Vercel-lijst (te vroeg gekeken = vals PASS).
- "Warm" bepalen via een tijdslimiet faalt op trage CPU's; vraag de HTTP-cache direct (`fetch(u,{cache:'only-if-cached',mode:'same-origin'})`).

## 2026-11-21 · BL-031 (nacht)
- Valideer eerst de meter, dan de hypothese: headless Chromium haalt hier ook op een lege pagina maar ~16 fps, dus een eis "≥ 50 fps" is onhaalbaar en zegt niets. Laat een fps-meting altijd een lege referentiepagina meten, of eis lange-frameduur/INP.
- Een contract op een vermoedelijke oorzaak (kaartkopie) zonder profiel kostte een hele bouwronde (70 min). Bij performance: eerst een trace/diagnosetaak, dan pas een bouwcontract.
- Check `df` aan het begin van elke nachtrun; onder ~2 GB geen builds/screenshots starten.

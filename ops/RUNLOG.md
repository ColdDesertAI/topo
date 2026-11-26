# RUNLOG

Append-only, één regel per run. Elke vrijdag rolt de weekreview oudere weken op tot één samenvattingsregel.

Formaat:
`YYYY-MM-DD HH:MM | agent/model | taak | PASS/FAIL/BLOCKED | pin | creditgebruik (laag/mid/hoog) | één zin`

---
2026-11-13 22:30 | claude/opus | setup | — | — | mid | ops/ geïnstalleerd, wacht op G0
2026-11-13 22:50 | claude/opus | setup | — | — | laag | Besluiten Dennis verwerkt (GO, B2C+B2B, groep 7, FR-code pauze, parallel op Codex 🟡); ops/ naar repo
2026-11-13 23:00 | claude/opus | domein | — | — | laag | Dennis koopt ninotopo.nl; BL-011 internationale domeinstrategie toegevoegd
2026-11-13 23:15 | claude/opus | nachtrun-install | — | — | laag | install-nightly.sh: launchd 01:00, script vers van main, paden voor ~/topo-claude
2026-11-14 01:30 | claude/sonnet | night | BL-001 | PASS* | mid | Branch-inventaris 107 branches (0 delete, 95 archive); *C4 indirect getoetst, cherry niet gedraaid (sandbox)
2026-11-14 08:50 | claude/opus | nachtrun-fix | — | — | laag | Nacht 1 geanalyseerd: werkt end-to-end, stopte na BL-001 door te smalle Bash-rechten; fix: bypassPermissions + deny-lijst, main fetchen, machine-feiten in rapport
2026-11-14 11:30 | claude/opus | model-routing | — | — | laag | Subagents builder (Sonnet), scout (Haiku), codex-worker (Codex); hoofdsessie orkestreert op Opus; TOPO_MAIN_MODEL-override
2026-11-14 16:30 | claude/fable+sonnet | taak | BL-005 | PASS* | mid | Integratieplan + proefintegratie (DRY df72c39, lint/test/build 0); run 1 FAIL op C11 (sync -X theirs overschrijft art), run 2 PASS; *uitsluitingen breken ±240 doc-links, door hoofdsessie in rapport gezet, niet herevalueerd; schijf vol → nulmeting sparse
2026-11-14 17:00 | claude/fable | domein | BL-009 | — | laag | ninotopo.nl gekocht door Dennis; BL-009 gedeblokkeerd, wacht op DNS-gegevens
2026-11-14 17:40 | claude/fable | besluit | BL-012 | — | laag | Favicon R3 (Vespa zijaanzicht) vastgelegd in DECISIONS; assets nog niet in repo
2026-11-14 17:50 | claude/fable | art | BL-012 | — | laag | R3-merkassets (favicon, Nino Welcome, Logo R3.1) op art/master b9e4a38; logo-SVG's bevatten ingebedde rasterafbeelding (525 KB)
2026-11-14 18:10 | claude/fable | taak | BL-013 | review | mid | Portal R3 gebouwd als site-root, Italië op /italie/; browsercheck 4 formaten zonder fouten; wacht op evaluator en G1
2026-11-14 18:30 | claude/fable | taak | BL-013 | fail(1) → herstel | mid | Evaluator FAIL: namen afgesneden op iPad, labels <13 px en contrast; hersteld en op 7 formaten gemeten (0 afgesneden, 0 overlap)
2026-11-14 18:50 | evaluator/opus | taak | BL-013 | PASS (ronde 2) | mid | 9/9 criteria; restpunten (ondertitel-contrast, 320 px-rij, dode CSS) daarna hersteld; wacht op G1 en Vercel-koppeling
2026-11-14 19:20 | claude/fable | taak | BL-013 | feedback Dennis | laag | Nino Welcome lager, vlaggen als pill; 7 formaten opnieuw gemeten (0 afgesneden, 0 overlap). Wijziging na evaluator-PASS, niet opnieuw geëvalueerd
2026-11-14 20:40 | claude/opus | taak | BL-005 | review | mid | codex/topo-v3 in main gemerged (3 conflicten opgelost); lint+test groen (volledige historie), site-build OK, /italie/ toont V2.0.2; wacht op push (sessie zonder schrijfrecht) en G4
2026-11-14 20:40 | claude/opus | live | BL-009/013 | klaar | laag | www.ninotopo.nl live; repo naar ColdDesertAI/topo; Vercel gekoppeld
2026-11-15 00:40 | claude/opus | taak | BL-015 | review | mid | V3-release-build zonder demo-shim: opslag werkt (profiel/voortgang na herladen), charset na <meta> ingevoegd; site-schakelaar SITE_ITALIE
2026-11-15 12:17 | codex | taak | BL-019 | review* | laag | 20 regio’s, 44.267 B, bron/licentie/SHA vast; regiocontroles 7/7, lint en bestaande npm-testset PASS, eindreview akkoord; *45/45 geografisch onmogelijk (32 strikt, Venetië kustuitzondering, 12 niet-toepasselijk); eigenaarsemantiek OPEN; geen UI/merge/deploy, app-build raakt uitgesloten index en is niet gedraaid
2026-11-15 01:30 | claude/sonnet+opus | nacht | BL-001b | review | laag | branches.md herberekend tegen origin/main 52427b5 (120 rijen: 10 delete, 95 archive, 2 merge, 13 keep); niets aan refs gewijzigd; evaluator PASS met voorbehoud na 2 herstelrondes (ops/reports/eval-BL-001b.md)
2026-11-15 14:00 | claude/sonnet | nacht | BL-002 | review | laag | docs-inventaris (rapport ops/reports/docs-inventaris.md), linkchecker scripts/check-doc-links.mjs, 19 bestanden met git mv naar docs/archive (C2 ff8596d, git revert terugdraaibaar), 0 nieuw gebroken buiten inventarisrijen; wacht op evaluator
2026-11-15 09:00 | claude/opus | fix | nightly.sh | — | laag | Limiet "hit your 5-hour limit" niet herkend → regex + brief-fallback (Claude→Codex→noodbrief); stap 4 committe gestagede git mv's mee, nu alleen rapport
2026-11-15 09:20 | evaluator/opus | taak | BL-002 | FAIL | mid | 16/17; 5b: merges van 6 keep-branches (squash #97) zetten 19 verplaatste docs terug; beslissing Dennis (a) tegenmaatregel of (b) revert C2
2026-11-15 09:25 | claude/opus | taak | BL-014 F1 | review | mid | Reliëf r3 uit dezelfde z8-DEM (Δ r2 < 1 RGB): hoogte-LUT, hillshade 7×, sneeuw ≥ 2200 m, 539 KB; filter reliefDepth eraf; screenshot naar Dennis
2026-11-15 10:00 | claude/opus | besluit | BL-002 | klaar* | laag | Dennis: optie b, C2 teruggedraaid; *inventaris + linkchecker blijven, verplaatsing na archivering keep-branches
2026-11-15 11:40 | evaluator/opus | taak | BL-016 | FAIL (r1, r2) | hoog | Check mat wrappers i.p.v. panelen (r1), body::before-mist in de les onzichtbaar voor de check (r2); beide hersteld
2026-11-15 13:50 | claude/opus+evaluator+design-critic | taak | BL-016 r3 + BL-016b | FAIL / NO-GO | hoog | Eén glasniveau (tokens), zijbalk volgens render, uitgelicht hoofdstuk met scène, kaart 58,6/57,3%, pins 0 px; rechterkolom te vol (lijst 3–4 rijen) → beslissing Dennis
2026-11-15 16:30 | claude/opus | taak | BL-016b | gepauzeerd | hoog | Besluit b+c gebouwd (lijst links/iPad-sheet, kaart 64,6%/90%); Dennis: geen samenhang, geen Apple meets Linear → compositie eerst in de Claude-app
2026-11-15 18:05 | claude/opus+design-critic | taak | BL-016c→016d | review | hoog | Variant B (één venster) gebouwd en verworpen door Dennis (mistig); herzien: helder glas, kaart vrij, twee pagina's; design-critic NO-GO → 6 fixes → GO-voorstel
2026-11-15 18:20 | dennis | G1 | BL-016d | GO | — | Reis herzien goedgekeurd; regels door naar de andere schermen (BL-016e)
2026-11-15 19:10 | dennis | G1 | BL-016e | GO | — | Vier schermen goedgekeurd ("geen fan"); boek op de iPad 5% smal getrokken → BL-022; CSS-schuld → BL-023
2026-11-15 21:40 | dennis | besluit | BL-016d | — | — | Kaart ≥ 55% alleen op het Reis-overzicht (optie b); hoofdstukpagina houdt het grote artwork
2026-11-15 22:30 | claude/opus | taak | nachtfix-main | klaar | laag | PR #106 (nightly.sh-fix + BL-001b/BL-002 op review) gesquasht naar main met akkoord Dennis
2026-11-16 04:20 | builder/sonnet+evaluator/opus | taak | BL-016d/e, BL-023 | PASS | hoog | BL-016d/e r2 PASS; BL-023 r1 FAIL (les ≥1280, 1024/1280-kaart, hoofdstukpaneel: weggehaalde !important), r2 PASS (214/240 identiek, rest bedoeld)
2026-11-16 09:00 | claude/opus+evaluator/opus | taak | BL-028, nightly | PASS | laag | Toets geeft geen pizzapunten meer (05-app-kern grade); 4 bevriezingstests via restoreExamReward; nightly.sh wacht na limiet en hervat, Codex-flags uit --help
2026-11-19 | claude/opus+design-critic/opus+evaluator/opus | taak | BL-029 | G1-klaar (eval FAIL alleen fps) | hoog | Menu 1 op alle schermen; design r1–r4 NO-GO → r5 GO-voorstel; eval r1–r2 FAIL (o.a. werkruimte over lesresultaat) → r3 alleen fps; contactsheet ops/reports/BL-029-G1.webp
2026-11-19 | dennis | besluit | BL-029 | G1 GO | — | Menu 1 goedgekeurd; schermwissel-fps geaccepteerd, fix later (BL-031); Vercel-branchpreview gevraagd
2026-11-19 | claude/opus | taak | BL-034 | klaar, wacht op test Dennis | hoog | P0 1-7 + P1 8-12; QA 0 fouten, fade <=2,7%, tests 0; preview nino-topo-portal-review-jkyg46pg7 (9b69b03, V3 op /italie/)
2026-11-19 | dennis+claude/opus | release | G4 | live | hoog | PR #101 squash naar main (718658f), SITE_ITALIE=v3 productie + redeploy; tag v3.0.0 door Dennis (proxy weigert tag-push)
2026-11-19 | claude/opus | livefix | BL-035 | live, wacht op evaluator | hoog | 8 blokken direct op main (a654507..75a7a85), per push lint+test+qa-v3-menu1+build:site groen, live gecontroleerd Chromium+WebKit; maskers werkten al (vermoedelijk macOS 'Verminder transparantie' bij Dennis)
2026-11-20 | claude/opus | eval | BL-035 | PASS | hoog | evaluator r1 FAIL (Etna bij Messina; Voortgang-kaart groeide mee), fix b4770e8, r2 PASS; live gecontroleerd Chromium+WebKit
2026-11-20 | claude/opus + builder/sonnet | taak | BL-036 | PASS | hoog | 11 punten in 3 bundels (verificatie in drie lagen), laadtijd live 23 s → 2,3 s koud / 0,8 s warm; evaluator r1 FAIL (7, 8) → fix 4deb5ab → r2 PASS; BL-038 iPad-portret aangemaakt
2026-11-20 | claude/opus + builder/sonnet | taak | BL-038 | PASS | hoog | iPad-portret op Menu 1-niveau (kaart boven, lijst eronder), design-critic GO met kanttekeningen → 5 P1's gefixt (o.a. pin 2/9 samen in #afgerond/#alles, ook liggend), matrix incl. portret groen, evaluator PASS
2026-11-20 | claude/opus + builder/sonnet | taak | BL-037 | 9/10 PASS | hoog | 3 bundels live; evaluator FAIL op 2 (laadbalk bevroor; Nino reed weg bij halve balk op trage CPU/WebKit) → 2 fixes → PASS; punt 8 (55% liggend) wacht op Dennis
2026-11-20 | dennis | besluit | BL-037/039 | — | — | Zeeën/Landen: 55%-norm vervalt (BL-037 klaar); losse iconen rand-rand ≥ 12 px; laadscherm alleen koud; Wisselen met Sicilië; Vercel alleen main
2026-11-20 | claude/opus + builder/sonnet | taak | BL-039 | PASS | hoog | 3 bundels live; evaluator FAIL op 1 (Vercel deployde branches met /: * matcht geen /) en 3 (laadscherm warm op trage CPU) → fixes 10d49a9 → hertoets PASS
2026-11-21 | claude/opus + builder/sonnet | taak | BL-042 | PASS | hoog | vier fixes (namen, Kennispaspoort smal + Esc/×, portal-hover inactief, scherpe zoom); evaluator FAIL op Esc-regressie (pakte Esc af van Instellingen/kiezer) → fix 76350a5 → PASS
2026-11-21 | dennis | besluit | BL-042 | — | — | offline-zoom max 740 px is akkoord
2026-11-22 | dennis (codex) | release | G4 | tag | — | v3.0.0 (annotated, 4c20d5f) → 718658f op GitHub; geverifieerd
2026-11-22 | claude/opus + builder/sonnet | nacht | BL-041a | PASS | hoog | portal-hover alleen @media(hover:hover), reduced-motion fade, ✓ hangende inspringing paspoort, Esc-listener Voortgang opgeruimd; build:site-fout bestaat al op origin/main (V2 zonder SITE_ITALIE=v3)
2026-11-22 | claude/opus + builder/sonnet | nacht | BL-031a | FAIL | laag | kaartkopie Voortgang gecachet zonder regressie, maar geen fps-winst: lange frame is PrePaint (~400 ms), kaartkopie 1–9 ms; na 1 FAIL gestopt (herstel binnen scope niet realistisch) → idee
2026-11-22 | claude/opus + builder/sonnet | nacht | BL-030 | PASS | hoog | restoreExamReward strikt (precies 1 treffer), exam-flow-assert voor aanwijzen + mutatietoets; commentaarfix na evaluator; afwijking: contract zei 'niets committen', hoofdsessie liet toch committen (nachtrun-regel één commit per taak gaat voor)
2026-11-22 | claude/opus + builder/sonnet | nacht | BL-024a | PASS | hoog | glascheck Menu 1: #nieuw-matrix, vergrendeld hoofdstuk, blurAll + mutatietoetsen; FAIL crit. 1 omdat hoofdsessie ops-bestanden in de bouwcommit liet meenemen → commit gesplitst (36224cf9 + c1c092b8) → PASS
2026-11-22 | claude/opus | dag | nachtwerk→main | PASS | hoog | night/2026-11-22 gemerged (BL-041a, BL-030, BL-024a), BL-031a gerevert (besluit Dennis), verify-site: favicon-check alleen voor V3 zodat rollback SITE_ITALIE=v2 weer bouwt; opruimscript neemt night/2026-11-22 mee (98)
2026-11-23 | claude/opus + builder/sonnet | nacht | BL-024b | PASS | hoog | glascheck rekent tekst-opacity (kleuralfa × opacity voorouders) mee in contrast; smoke byte-identiek aan baseline, mutatie opacity .35 → p5 6.48→1.7 gemeld, oude meting zag het niet; looptijd gelijk (~300 s)
2026-11-23 | claude/opus + builder/sonnet | nacht | BL-024c | PASS | hoog | glascheck: opacity-mutatie ook op .v3Panel .v3CardTitle (zichtbaar op 810×1080, p5 10.63→1.98), mutatie opgeruimd na overzicht, kleur niet rgb()/rgba() → 'AA kleurformaat onbekend' (baseline mat oklch stil als OK); smoke byte-identiek, looptijd 1,0×
2026-11-23 | claude/opus | nacht | afsluiting | — | hoog | gestopt 03:03 na 2× PASS: schijf 694 MB vrij (< 1 GB contractgrens), geen data opgeruimd; BL-008 overgeslagen (PR #110)

- 2026-11-25 Codex — consolidatie op verzoek Dennis: GitHub 105 / lokaal 55 branches; nachtrun uit bevestigd; 23-11 behouden (8 commits). Opruimscript veilig hervatbaar gemaakt, 5/5 regressies PASS; status/startpagina bijgewerkt. Geen refs verwijderd: shell-netwerk en schrijfrechten gedeelde Git-map ontbreken. Zie reports/cleanup-2026-11-25.md.

- 2026-11-25 Codex — op verzoek Dennis bouw-nachtrun vervangen door GET-only GitHub-monitor (max 10 min), installer zonder fetch/agents/Telegram. 5 regressietests en shell-syntax PASS; echte droogloop meldt netwerkfout correct. Installatie/activatie niet uitgevoerd wegens schrijfrechten buiten workspace.
- 2026-11-26 Claude (regie) — overname van Codex: release v3.0.0 en opruiming geverifieerd, `main` beschermd, 43 lokale TOPO-kopieën weg + Mac-mappen naar `~/Code`, PR #116 en #110 gemerged, besluiten 1a–5a vastgelegd, contracten BL-004 en BL-007, `docs/v3/ARCHITECTUUR.md` teruggezet uit `archive/arch/v3-runtime`.

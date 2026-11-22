# STATE — huidige stand

> Max. 60 regels. Overschrijven, niet aanvullen. Historie staat in `RUNLOG.md`.
> Bijgewerkt: 2026-11-22 · door: Claude (nachtrun: BL-041a review PASS, BL-031a FAIL → idee, BL-030 review PASS; M0-deadline verstreken, zie risico's)

## Mijlpaal
M0 Consolidatie, deadline vr 20 nov · **GO 13-11**

## Productie
- `main` (19-11): V3 Menu 1 live op /italie/ via `SITE_ITALIE=v3` (G4 `718658f`) + BL-035 livefixes.

## Actieve werkstromen (moeten samenkomen)
| Branch | Wat | Laatst |
|---|---|---|
| `codex/topo-v3` | V3.0 app plus landmarks | 13-11 |
| `art/master` | Artwork Italië | 13-11 |
| `feat/nino-topo-portal-r2` / `art/nino-topo-website-v1` | Portal en website | 13-11 |
| `land/fr-geo` / `land/fr-inhoud` | Frankrijk | 12/13-11 |
| `arch/v3-runtime` | Migratievoorstel en landpakket | 10-11 |

## Volgende taak
**BL-030: REVIEW** (nachtrun 22-11, `5013e6ca`+`92b61780`, evaluator PASS `ops/reports/eval-BL-030.md`): `restoreExamReward` eist precies één treffer, exam-flow toetst ook aanwijzen (mutatietoets vangt lek), dubbele toets-beveiliging blijft (besluit nachtrun, omkeerbaar — Dennis mag anders kiezen). Bekend: `audit-release-1-2.mjs` faalt al op dist-pariteit (dist = V3).
**BL-031a: FAIL → idee** (nachtrun 22-11, `9525f900`, `ops/reports/eval-BL-031a.md`): Voortgang-kaart één keer bouwen werkt zonder regressie, maar wint geen fps. De tijd zit in PrePaint van het Voortgang-scherm (≈ 400 ms bij CPU 4×), niet in de kaartkopie (1–9 ms). BL-031 moet vanuit PrePaint opnieuw beginnen en eerste én herhaalbezoek meten. Dennis: code houden (veilig, iets sneller bij herhaalbezoek) of reverten.
**BL-041a: REVIEW** (nachtrun 22-11, `night/2026-11-22` `f4089fb6`, evaluator PASS `ops/reports/eval-BL-041a.md`): portal-hover alleen met muis (iPad-tik blijft niet hangen), reduced motion zachte fade, ✓ in Kennispaspoort breekt niet los van de naam, Esc-listener Voortgang direct opgeruimd. Let op: `npm run build:site` faalt al op origin/main zonder `SITE_ITALIE=v3` (favicon-check vs V2); met `SITE_ITALIE=v3` exit 0. **Schijf Mac mini 22-11 01:50: 556 MB vrij** — builds/worktrees falen; ruimte maken = Dennis.
**BL-042: KLAAR** (vragen Dennis 21-11, evaluator PASS na hertoets, `ops/reports/eval-BL-042.md`): achtergronden Toscane · Gardameer · Middellandse Zee · Sicilië (start Middellandse Zee) · Kennispaspoort weer smal (300 px), één open, Esc/× (Esc alleen als er geen laag boven open is) · portal: foto-hover terug bij niet-actieve landen · zoom laadt scherp origineel (web), offline max 740 px (akkoord Dennis 21-11).
**BL-039: KLAAR** (evaluator PASS na hertoets 20-11, `ops/reports/eval-BL-039.md`): Vercel deployt alleen `main` (`*/**` voor branches met /; getest), portal-hover + hele kaart klikbaar, laadscherm alleen bij koude cache (only-if-cached; warm 0 ms loader, ook CPU 4×), Wisselen: Eilanden = Sicilië, losse iconen rand-rand ≥ 12 px, hoofdstukafbeelding zoomt, Kennispaspoort vullende pizza. **Besluit 20-11 (QA-norm):** een weggelaten los icoon in Oefenen (kleine kaart) is info; op de hoofdstukpagina blijft het een fout. BL-037 en BL-038 klaar. Restpunten → BL-041.
**BL-036 testfeedback 20-11: KLAAR, alles live** (bundels A–C + fix `4deb5ab`). Evaluator: FAIL op 7 (tandwiel onbereikbaar in iPad-portret) en 8 (lesknop 'Start de Vespa-rit' deed niets) → gefixt → hertoets PASS (`ops/reports/eval-BL-036.md`). Laag 3: volledige matrix Chromium OK, fade Chromium + WebKit OK. Nieuw: **BL-038 iPad-portret** (P0, blokkeert G3). Open voor Dennis: Vespa-icoon is een vierkante app-badge; oordelen related in `ops/reports/BL-036-iconen.md`; antwoordfeedback 'goed' is in V3 al violet (niet groen) — zo laten?
**Laadtijd (punt 11) live sinds bundel A.** Live gemeten (Fast 4G 9 Mbit/s, 165 ms RTT, Playwright Chromium): vóór 21,9 MB, eerste scherm ≈ 23 s koud én warm. Na: index.html 1,03 MB + 133 immutable assets; eerste scherm 1,6 MB, **koud 2,3 s desktop / 1,9 s iPad, warm 0,77 / 0,82 s** (0 MB), via portal-prefetch 1,5 s; TTFB 0,1–0,3 s. Doel (< 3 s koud, < 1 s warm) gehaald.
**BL-035 livefixes 19-11: alle 8 blokken live op main** (volgorde 1→7→6→8→2→4→5→3, kleine commits `a654507`…, per push lint+test+`qa-v3-menu1`+`build:site` groen, daarna live gecontroleerd op www.ninotopo.nl/italie/ in Chromium én WebKit). **Evaluator: PASS** na hertoets (`ops/reports/eval-BL-035.md`; eerste ronde FAIL op Etna bij Messina en meegroeiende kaart op Voortgang, beide gefixt in `b4770e8`). Volgende: check Dennis op zijn iMac (Safari + Chrome). Open, buiten scope: mask-composite op 3 kaartranden (`menu1.css`, `ui.css`), paspoorttabel loopt over 2 regels, `npm test` heeft `--max-old-space-size=8192` nodig (nino-art).
- **G4 (19-11):** main `718658f`, `SITE_ITALIE=v3` in productie. Rollback: `SITE_ITALIE=v2` + redeploy, of Promote `dpl_oaw4…` (64fc294). Tag `v3.0.0`: zet Dennis (`git tag -a v3.0.0 718658f && git push origin v3.0.0`).
- **Open uit G3:** Hermes-hertest, speeltest ≥ 2 kinderen, fps schermwissel (BL-031). C = BL-014 F5–F8 en D = BL-018-rest na G4.
- **Omgeving:** cloud-omgeving `topo` (persoonlijk) laat www.ninotopo.nl toe voor de livecheck.

3-11
- Roadmap M0–M3: GO
- B2C én B2B · hoofddoel: leren op een leuke manier · testkinderen groep 7 (10–11)
- FR-code gepauzeerd tot M1. FR-data, research en art mogen parallel op Codex (OPERATING_MODEL §5, 🟡)

## V3 naar live (pad, 15-11)
1. BL-015 V3-release met echte opslag ✅ (in review) — live zetten = Vercel-variabele `SITE_ITALIE=v3`
2. BL-014/016 kaart en glas: compositie eerst (Claude-app), dan bouw en G1
3. iPad-test Dennis (15-11) + Hermes-hertest → G4 → `SITE_ITALIE=v3`

## Live (14-11)
- **www.ninotopo.nl** = portal; `/italie/` = Italië-app. Repo verhuisd naar **ColdDesertAI/topo**; Vercel-project `nino-topo-portal-review` bouwt vanaf `main`.

## Portal (besluit 14-11: optie A)
- BL-013 in review: portal op `/`, Italië op `/italie/`. Daarna G1 (visuele GO op de preview) en G4 (live + DNS bij Namecheap, BL-009).
- ROADMAP M0 zei "portal naar één preview-URL"; dat wordt nu: portal live met de huidige Italië-versie, V3 volgt via BL-005.

## Open beslissingen voor Dennis
1. Domein `ninotopo.nl` is gekocht (14-11). Nodig van Dennis: bij welke registrar, zodat BL-009 (koppelen aan Vercel) kan
2. Branch-opruiming (BL-001b klaar voor toetsing, `ops/reports/branches.md`, tegen `origin/main` `52427b5`): 120 branches, 10 `delete` (8 `ops/*` met Cherry 0, `night/2026-11-13`, `t/BL-005-integratie` met Tree 0), 95 `archive`, 2 `merge`, 13 `keep`. Kies: (a) de 10 `delete` verwijderen en de 95 `archive` eerst taggen (BL-005c), daarna verwijderen · (b) alleen de 10 `delete` nu, `archive` later · (c) per rij doorlopen met Claude. Eerst `git fetch` (refs kunnen oud zijn). **Aanbeveling: (a)**: tags zijn omkeerbaar; `pr7`/`pr70` zijn alleen lokaal en moeten eerst getagd

3. Integratie V3.0 + art naar `main` (BL-005; plan en proefintegratie in `ops/reports/integratie.md`, evaluator: PASS met voorbehoud, `ops/reports/eval-BL-005.md`; let op: de ±240 gebroken doc-links uit de proefintegratie bestaan op `main` niet, want `docs/qa/` en `docs/visual/` staan er volledig; BL-002 mat 73 gebroken backtick-paden en liet er geen nieuwe bijkomen, besluit per groep in `ops/reports/docs-inventaris.md`). Gekozen volgorde: eerst `art/master` als merge-commit (bewuste uitzondering op squash: art blijft langlopend en synct dan zonder `-X`), dan `codex/topo-v3` als squash. Uitgesloten uit `main`: het grootste deel van `docs/qa/` en `docs/visual/` (op 129 bestanden na, o.a. `docs/qa/v3-stijlbeeld/final/`), `output/installers/` en drie oude `output/html/`-proefversies (samen 2184 bestanden, 856 MB; tags `archive/v3-*` voorgesteld). Proefintegratie `DRY` `df72c39`: lint, test en build alle drie exit 0, `dist/index.html` 41 445 845 B (gelijk aan V). De uitvoering (BL-005b) raakt G3/G4 zolang `main` productie is. Kies: (a) BL-005b pas na G3 (BL-004 PASS) én BL-006 (productie alleen vanaf tag); dan blijft er één G4-akkoord over, op tag `v3.0.0` · (b) als (a), en Dennis keurt daarnaast `ops/reports/integratie.md` vooraf goed · (c) direct na het plan naar `main`, met de merge als G4. **Aanbeveling: (a)**: één contactmoment, en de merge is omkeerbaar zonder productie te raken. **Stand 14-11: Dennis heeft niet anders gekozen, we werken volgens (a)**
4. M0-scope: **besloten 14-11 door Dennis: de portal schuift niet naar M1, die "kan al eerder klaar zijn"**. Gelezen als optie (c), niets schuiven; deadline M0 blijft vr 20 nov. Controleer bij de volgende planning of de portal-preview daarmee binnen M0 past

## Bekende risico's
- Artwork-goedkeuring is de bottleneck voor elk land
- **M0-deadline (vr 20 nov) is verstreken (planner 22-11).** Exit feitelijk gehaald (productie-URL werkt, `main` groen, nachtruns gelogd); open zijn nog branches ≤ 10 (besluit 2), BL-005b/c/d/e en de docs-verplaatsing. Voorstel: (a) M0 afsluiten op de exit, de open M0-taken naar M1 (deadline M1 blijft 11 dec) · (b) M0 een week verlengen tot vr 27 nov. **Aanbeveling: (a).** Nog niets verschoven; nachtrun 22-11 werkt aan BL-041a (M1, P2)
- `index.html` van 41 MB en een preview van 50 MB: geheugen op iPad 9
- Schijf Mac mini: Dennis heeft 14-11 ruimte gemaakt (ongeveer 12 GB vrij). BL-005b/e hebben ≥ 3 GB nodig; check `df` vóór de start, de schijf liep tijdens BL-005 vol

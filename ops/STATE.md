# STATE — huidige stand

> Max. 60 regels. Overschrijven, niet aanvullen. Historie staat in `RUNLOG.md`.
> Bijgewerkt: 2026-11-15 · door: Claude (BL-016/016b)

## Mijlpaal
M0 Consolidatie, deadline vr 20 nov · **GO 13-11**

## Productie
- `main` @ `7e38160` (28-09), oude stand. Wat er op Vercel staat moet nog geverifieerd worden (BL-006).

## Actieve werkstromen (moeten samenkomen)
| Branch | Wat | Laatst |
|---|---|---|
| `codex/topo-v3` | V3.0 app plus landmarks | 13-11 |
| `art/master` | Artwork Italië | 13-11 |
| `feat/nino-topo-portal-r2` / `art/nino-topo-website-v1` | Portal en website | 13-11 |
| `land/fr-geo` / `land/fr-inhoud` | Frankrijk | 12/13-11 |
| `arch/v3-runtime` | Migratievoorstel en landpakket | 10-11 |

## Volgende taak
BL-016 (glas): ronde 3 lost de r2-punten op; laatste regressie (TOPO buiten de smalle zijbalk) hersteld in `e1571d6`, nog te hertoetsen. BL-016b (glas, zijbalk, uitgelicht hoofdstuk, kaart): evaluator FAIL op C1/B1/lijst/schakelaar, design-critic NO-GO; C1, schakelaar en hard faults hersteld. **Wacht op Dennis**: rechterkolom (a) zo laten · (b) lijst links van de kaart zoals render Ontdekken (aanbevolen) · (c) iPad-lijst als sheet; titel "Reis" weg ja/nee; BG-01-uitsnede met rustige zone links; transparant vs. gelijk beeld (ΔE 8,7). Daarna BL-014 F2 (laagland, water, buurlanden), F4 (Voortgang drie tinten, genummerde punten), BL-017, BL-018.

## Besloten 13-11
- Roadmap M0–M3: GO
- B2C én B2B · hoofddoel: leren op een leuke manier · testkinderen groep 7 (10–11)
- FR-code gepauzeerd tot M1. FR-data, research en art mogen parallel op Codex (OPERATING_MODEL §5, 🟡)

## V3 naar live (pad, 15-11)
1. BL-015 V3-release met echte opslag ✅ (in review) — live zetten = Vercel-variabele `SITE_ITALIE=v3`
2. BL-014 kaart als feestje (overdag, G1 Dennis)
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
- M0-deadline dreigt te schuiven: na BL-005 volgen nog BL-004 (M), BL-005b (M, na G3), BL-006 (S) en de iPad-test van Dennis, in 6 dagen tot vr 20 nov. Niets geschoven (beslissing 4)
- `index.html` van 41 MB en een preview van 50 MB: geheugen op iPad 9
- Schijf Mac mini: Dennis heeft 14-11 ruimte gemaakt (ongeveer 12 GB vrij). BL-005b/e hebben ≥ 3 GB nodig; check `df` vóór de start, de schijf liep tijdens BL-005 vol

# STATE — huidige stand

> Max. 60 regels. Overschrijven, niet aanvullen. Historie staat in `RUNLOG.md`.
> Bijgewerkt: 2026-11-14 · door: Claude (afsluiting BL-003, builder)

## Mijlpaal
M0 Consolidatie, deadline vr 20 nov · **GO 13-11** (`ops/ROADMAP.md` r. 3, 6). Exitcriteria (`ops/ROADMAP.md` r. 12):
- Productie-URL werkt: niet geverifieerd, Vercel-inrichting is BL-006 `idee` (`ops/BACKLOG.md` r. 22)
- `main` groen: niet gemeten op `b835a59` (wijzigde alleen `ops/`); proefintegratie `df72c39` (V3.0 + art): lint, test, build exit 0 (`ops/reports/integratie.md` r. 121–123)
- Eerste nachtrun gelogd: ja, nacht 1 (BL-001), `ops/RUNLOG.md` r. 13 en `ops/reports/night-2026-11-14.md`; fix na stop op rechten: r. 14

## Productie
- `main` = `b835a59` (14-11, #91, alleen `ops/`); laatste commit buiten `ops/`, `.claude/` en `CLAUDE.md`: `59915e3` (13-11, #83). Wat er op Vercel staat is niet geverifieerd: BL-006 (`ops/BACKLOG.md` r. 22)

## V3.0 (product)
- Pin `55b4d86` = `codex/topo-v3` (13-11). SPEC is de waarheid en wint bij conflict: `docs/v3/SPEC.md@55b4d86` r. 1–3
- Wat het is: presentatielaag in `scripts/v3/`, alleen in de preview geïnjecteerd; wijzig `src/v2/`, nooit `index.html`: `docs/v3/SPEC.md@55b4d86` r. 6–8
- Ondergrens iPad 9 (3 GB RAM, Safari); preview 50 MB niet committen: `docs/v3/SPEC.md@55b4d86` r. 35, 38–39
- Af volgens de overdracht: ronde 3 punt 1–20 (`70cdb34`), ronde 5 punt 1–9 (`6809458`), ronde 5B punt 10–12 (`fec8891`, `e856080`, `f55f247`), alleen schermgerichte QA, geen volledige suite: `docs/v3/OVERDRACHT.md@55b4d86` r. 136, 250–252, 313–317
- Open: fysieke iPad/Safari-test door de eigenaar en Hermes-hertest, volgorde reliëf-render, release-build, hertest, akkoord eigenaar: `docs/v3/OVERDRACHT.md@55b4d86` r. 305–310, 317
- Open: reliëf (punt 8) alleen voorlopig akkoord, eigen pakket `docs/v3/RELIEF_RENDER.md@55b4d86`: `docs/v3/OVERDRACHT.md@55b4d86` r. 289–291, 304
- Open: ontbrekende landmarks (eigenaar), TOPO_12-kleurnotitie, coördinaten Rimini en Sorrento niet geverifieerd, assetdieet stap 4–7 geparkeerd: `docs/v3/OVERDRACHT.md@55b4d86` r. 296–300
- Bekend gebrek: `qa-v3-faseb.py` veronderstelt de oude kaartuitlijning, assertions achterhaald door punt 10: `docs/v3/OVERDRACHT.md@55b4d86` r. 317
- Na V3.0: runtime-migratie (`arch/v3-runtime`, met landpakket Frankrijk) en uitstapjes (V3.1): `docs/v3/SPEC.md@55b4d86` r. 45–47

## Actieve werkstromen (moeten samenkomen)
| Branch (tip `origin/…`, lokale ref) | Wat | Sha · datum |
|---|---|---|
| `codex/topo-v3` | V3.0 app plus landmarks | `55b4d86` · 2026-11-13 |
| `art/master` | Artwork Italië | `7714e22` · 2026-11-13 |
| `feat/nino-topo-portal-r2` | Portal | `f0b7e66` · 2026-11-13 |
| `art/nino-topo-website-v1` | Website | `b05a9d5` · 2026-11-13 |
| `land/fr-geo` | Frankrijk, geografie | `dc9d094` · 2026-11-13 |
| `land/fr-inhoud` | Frankrijk, inhoud | `dc46b20` · 2026-11-12 |
| `arch/v3-runtime` | Migratievoorstel en landpakket | `75263a7` · 2026-11-10 |

## Volgende taak
- Taken in `review`: BL-001 `review` (PASS met voorbehoud C4, cherry niet gedraaid: `ops/RUNLOG.md` r. 13), BL-002 `review` (PASS met voorbehoud, run 2: `ops/reports/eval-BL-002.md` r. 6; voorbehoud = beslissing 5), BL-003 `review` (`ops/contracts/BL-003.md`, gestapeld op #93, r. 16–17)
- Afgerond: BL-005 `klaar` (PASS met voorbehoud, #91 `b835a59`; plan `ops/reports/integratie.md`, evaluatie `ops/reports/eval-BL-005.md` r. 6)
- Volgende: BL-001b `ready` (`git cherry` tegen `origin/main`, `ops/BACKLOG.md` r. 13), daarna BL-005c `idee` (archieftags, r. 18). BL-002b (uitvoeren op `main`) is nog geen item in `ops/BACKLOG.md`
- Wacht (`ops/BACKLOG.md`): BL-005b `geblokkeerd: G3 (BL-004)` (r. 19, beslissing 3a), BL-004 `idee` (r. 16), BL-006 `idee` (r. 22)

## Besloten 13-11
- Roadmap M0–M3: GO · `ops/ROADMAP.md` r. 3
- B2C én B2B · hoofddoel: leren op een leuke manier · testkinderen groep 7 (10–11) · `ops/NORTH_STAR.md` r. 10, 14, 33
- FR-code gepauzeerd tot M1. FR-data, research en art mogen parallel op Codex (OPERATING_MODEL §5, 🟡) · `ops/RUNLOG.md` r. 10, `ops/OPERATING_MODEL.md` r. 48

## Portal (besluit 14-11: optie A)
- BL-013 in review: portal op `/`, Italië op `/italie/`. Daarna G1 (visuele GO op de preview) en G4 (live + DNS bij Namecheap, BL-009) · `ops/contracts/BL-013.md` r. 3–4, `ops/BACKLOG.md` r. 32
- ROADMAP M0 zei "portal naar één preview-URL"; dat wordt nu: portal live met de huidige Italië-versie, V3 volgt via BL-005 · `ops/ROADMAP.md` r. 10, `ops/contracts/BL-013.md` r. 4

## Open beslissingen voor Dennis
1. Domein `ninotopo.nl` is gekocht (14-11). Nodig van Dennis: bij welke registrar, zodat BL-009 (koppelen aan Vercel) kan · `ops/RUNLOG.md` r. 17, `ops/BACKLOG.md` r. 25
2. Branch-opruiming na BL-001 (`ops/reports/branches.md`), kies: (a) alle 95 `archive`-rijen taggen en daarna verwijderen · (b) eerst lokale `main` bijwerken en `git cherry` draaien (vervolgtaak), dan pas verwijderen · (c) per rij doorlopen met Claude. Rapport: 107 branches, 0 `delete`, 95 `archive`, 3 `merge`, 9 `keep`. **Aanbeveling: (b)**: tags maken mag al zonder akkoord, en 29 lokale `pr*` zijn dubbelen van remote-branches (alleen `pr7`/`pr70` uniek)

3. Integratie V3.0 + art naar `main` (BL-005; plan en proefintegratie in `ops/reports/integratie.md`, evaluator: PASS met voorbehoud, `ops/reports/eval-BL-005.md`; let op: de uitsluitingen breken ±240 doc-links, o.a. in `docs/PROJECT_STATE.md`, nu uitgewerkt in `ops/reports/docs-inventaris.md`, uit te voeren als BL-002b). Gekozen volgorde: eerst `art/master` als merge-commit (bewuste uitzondering op squash: art blijft langlopend en synct dan zonder `-X`), dan `codex/topo-v3` als squash. Uitgesloten uit `main`: het grootste deel van `docs/qa/` en `docs/visual/` (op 129 bestanden na, o.a. `docs/qa/v3-stijlbeeld/final/`), `output/installers/` en drie oude `output/html/`-proefversies (samen 2184 bestanden, 856 MB; tags `archive/v3-*` voorgesteld). Proefintegratie `DRY` `df72c39`: lint, test en build alle drie exit 0, `dist/index.html` 41 445 845 B (gelijk aan V). De uitvoering (BL-005b) raakt G3/G4 zolang `main` productie is. Kies: (a) BL-005b pas na G3 (BL-004 PASS) én BL-006 (productie alleen vanaf tag); dan blijft er één G4-akkoord over, op tag `v3.0.0` · (b) als (a), en Dennis keurt daarnaast `ops/reports/integratie.md` vooraf goed · (c) direct na het plan naar `main`, met de merge als G4. **Aanbeveling: (a)**: één contactmoment, en de merge is omkeerbaar zonder productie te raken. **Stand 14-11: Dennis heeft niet anders gekozen, we werken volgens (a)** (Dennis, 14-11)
4. M0-scope: **besloten 14-11 door Dennis: de portal schuift niet naar M1, die "kan al eerder klaar zijn"**. Gelezen als optie (c), niets schuiven; deadline M0 blijft vr 20 nov. Controleer bij de volgende planning of de portal-preview daarmee binnen M0 past (Dennis, 14-11)
5. `docs/v4/FRANKRIJK_HANDOFF.md` staat in het verplaatsplan van BL-002 op `archief` (contractregel: HANDOFF in de naam, geen lezer), maar is de opdracht voor de actieve branches `land/fr-geo` / `land/fr-inhoud`. Kies archiveren of actueel houden. Aanbeveling van de hoofdsessie (geen besluit van Dennis): actueel houden tot M2 · `ops/reports/docs-inventaris.md` r. 110

## Bekende risico's
- Artwork-goedkeuring is de bottleneck voor elk land (`ops/playbooks/NIEUW_LAND.md` r. 31, 37); voor Italië hangt artwork aan akkoord en aanlevering van de eigenaar (master-assets, ontbrekende landmarks): `docs/v3/OVERDRACHT.md@55b4d86` r. 37, 296
- M0-deadline dreigt te schuiven: BL-004, BL-005b, BL-006 staan niet op `ready`/`klaar` (`ops/BACKLOG.md` r. 16, 19, 22) plus de iPad-test van Dennis (`docs/v3/OVERDRACHT.md@55b4d86` r. 317), in 6 dagen tot vr 20 nov (`ops/ROADMAP.md` r. 6). Niets geschoven (beslissing 4)
- `index.html` van 41 MB en een preview van 50 MB op een iPad 9 met 3 GB RAM: `docs/v3/SPEC.md@55b4d86` r. 6, 35, 39
- Schijf Mac mini: Dennis heeft 14-11 ruimte gemaakt (ongeveer 12 GB vrij). BL-005b/e hebben ≥ 3 GB nodig (`ops/reports/integratie.md` r. 160); check `df` vóór de start, de schijf liep tijdens BL-005 vol (`ops/LEARNINGS.md` r. 26)

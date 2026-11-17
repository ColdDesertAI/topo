# TOPO Next — Markt- en haalbaarheidstoets (desk research 2026-11-15)

**Status:** researched, **NOT VALIDATED** with users or paying customers. **Decision:** conditional GO for lean discovery/pilots *after* Italy V3 and France V4 G3/G4 and explicit owner G0; NO-GO for a major Suite build before proof.

## Market evidence
- CBS: 1,357,010 pupils regular primary education 2025/26: https://www.cbs.nl/nl-nl/cijfers/detail/71478ned .
- OCW/DUO: 5,986 regular primary schools in 2025 (distinct from other types): https://www.ocwincijfers.nl/sectoren/primair-onderwijs/instellingen/aantal-scholen-in-het-primair-onderwijs .
- SLO Kerndoel 50: map/atlas skills, NL/Europe/world topography and mental maps; curricular transition ongoing: https://www.slo.nl/thema/meer/tule/orientatie-jezelf-wereld/kerndoel-50/ .
- Competitors: TopoMania **free** with maps/groups https://www.topomania.net/ ; Seterra >300 quizzes, offline mobile https://apps.apple.com/us/app/seterra-geography-full/id1093460065 ; Topografie in de Klas teacher assignments/reports https://topografieindeklas.nl/ ; Meestertools QR/teacher cards https://meestertools.nl/ ; adaptive Topotour https://www.zwijsen.nl/wereldorientatie/topografie-leren-hoe-pak-je-dat-aan/ ; oefen.app multi-year topo lines https://oefenen.app/vak/topo . Therefore premium UI, growth across ages, adaptive testing or teacher dashboards are not unique by themselves.
- Education research: 2026 school classroom meta-analysis 53 studies / 7,303 participants reported average retrieval, spacing and interleaving benefits, with caveats. No TOPO-specific measured gain: https://link.springer.com/article/10.1007/s10648-026-10225-5 .
- Privacy: child data and school services require separate legal/privacy analysis https://autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/grondslag-toestemming ; https://www.privacyconvenant.nl/downloads/ .

## Strategy
**Primary wedge:** parents/pupils in upper primary (B2C), with limited teacher class-sharing pilots (B2B). Secondary school and adults are expansion hypotheses, **not** first-cycle financial TAM. Do not rely on 'adult lifelong learning' for initial income. Opportunity hypothesis: Discover → Understand → Remember, accurate Living Atlas, no-account local-first learning and strong retrieval practice. Prove it against free alternatives.

## Test plan, conditional on activation
- Observe 20–30 children, interview 10–15 parents and 6–10 teachers outside founder network, with suitable consent.
- Side-by-side real tasks against at least TopoMania / Seterra; measure time to first task, completion, errors, map usability, post-7-day recall and unprompted repeat use.
- Test genuine household purchase intent for €29/€39/€59 **hypothetical** annual prices, and 3–5 school pilots at hypothetical €99/€199/€399 annual prices. No claim these prices are validated.
- Suggested GO thresholds: >=20 genuine household paid-pilot commitments and >=2 institutionally authorised school pilot commitments plus independently measured usability / retention no worse than baselines. Revisit thresholds pre-registration before tests; failure = pivot or stay focused on Italy/France.
- Do not start backend/auth, new domains, graph DB or marketing spend without separate business case/ADR/owner approval.
- Measure true CAC, retention, conversion, support cost, content QA, local data migration and iPad performance; scenarios are gross revenue, not profit.

## Financial scenarios (illustrative, NOT forecasts)
- 200 families × €39 + 10 schools × €199 = €9,790 gross/yr
- 1,000 families × €39 + 50 schools × €199 = €48,950 gross/yr
- 3,000 families × €39 + 150 schools × €199 = €146,850 gross/yr
Before VAT/tax, acquisition, support, payment fees, development and operating costs. No market share, CAC or renewal estimates verified.

## Governance
This adds a research-based decision input to [STUDY_BACKLOG.md](STUDY_BACKLOG.md). Do not alter `ops/ROADMAP.md`, M0–M3 capacity, Italy/France code or release permissions. Review in existing morning brief. Full user-facing feasibility memo exists as a separate downloadable artifact in the originating conversation; link above sources if transferring externally.

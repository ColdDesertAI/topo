# TOPO Next — Research, design and technology work packages

These are **prepared contracts**, not immediately assigned jobs. Lead turns each into one bounded task only after N1 G0. Every result requires a source pointer, recorded date, confidence, comparison, tests when applicable, and a decision or next test.

## RESEARCH
- R01 Current product characterization: complete Italy V3/France V4 flows, baseline speed/memory/interaction, local saves, offline behavior, deployment topology; compare after both releases.
- R02 Competition: TopoMania, Seterra/GeoGuessr-style geography practice, schools' worksheet substitutes and curriculum tools. Validate availability, age fit, pricing, business model, offline support and privacy from dated primary sources. Do not assume current facts from images.
- R03 Product excellence: Linear and Apple Notes as UX/DX principles, NOT visual copying; inspect component consistency, navigation, empty states, legibility and progressive disclosure.
- R04 Learning science: retrieval practice, spacing, formative feedback, geographic misconceptions, age-appropriate readability; source evidence and testable hypotheses.
- R05 Children/parents/teachers: consented, privacy-minimal sessions with the existing product, task observations and interviews, no personal data in Git.
- R06 Accessibility, offline-first, map provenance/licenses, teacher/child privacy and EU school-market constraints.

## DESIGN
- D01 Portal: public entry, country cards, account-free resume, user navigation and school entry. Compare information density; ensure no duplicate nav or marketing interruptions.
- D02 Learning First: 7 specified end-to-end screens; quiet, direct, legible; real state flows.
- D03 Living Atlas: 7 equivalent screens; map as canvas; validated geography and touch targets.
- D04 Nino Journey: 7 equivalent screens; meaningful rewards and character moments, no visual noise.
- D05 Components/tokens: one language for portal, lesson, Book and later classroom, responsive tablet/desktop/phone, accessibility and reduced motion.
- D06 Golden tasks: enter country <10 seconds (hypothesis); identify Po/Apennines; distinguish Rome/Vatican; mistake feedback; resume without losing work; book progress. Thresholds require baseline/testing before acceptance.
- D07 Teacher preview: teacher shares chapter without requiring student accounts; research-only until value is proven.

## ARCHITECTURE / GRAPH / LOOP
- A01 Inventory existing packages and duplicate content; compare modular local-first deployment with existing generated single-file offline build.
- A02 Define minimal contracts: `CountryPack`, `GeoFeature`, `LearningItem`, `Attempt`, `Progress`, `RewardEvent`, `ContentSource` and schema version. Explicit stable IDs and country namespace.
- A03 Verify map source ownership, projection, topology/hit tolerance, pinned provenance, geographic regression suite.
- A04 Storage migrations: local-first, schema versions, export/import, offline integrity. Accounts/cloud sync only via new ADR after user proof.
- A05 Vercel/domain audit: preserve `ninotopo.nl` and current preview/production separation; future routing and international brand/domains only after business case.
- A06 Agent dependency graph from issue links, code imports, land manifests, tests and decision records. **No manual graph database**.
- A07 Harness improvements: short live STATE, run contracts, evaluator evidence, capped retries, prompt updates as reviewable diffs; reuse ops governance.
- A08 Performance: capture page weight, network requests, cold-load timings, iPad memory, cache/offline behavior; define quality budgets based on measurements.

## PRODUCT / BUSINESS
- P01 B2C: child journey, household value, country discovery, repeat usage, free experience and price hypotheses; no checkout build.
- P02 B2B: teacher interview workflow, lesson sharing, procurement and safeguarding requirements, institutional buyer validation; no dashboard build until evidence.
- P03 Portal brand and positioning: current Nino TOPO versus future TOPO Suite; avoid automatic rebrand or new domains.
- P04 Telemetry: privacy-friendly aggregate or opt-in approach, storage limitations, data retention and consent before implementation.
- P05 Expansion: evaluate country authoring throughput, QA workload and real school curricula before 'land factory' scaling.

## Proof pack / selection rubric
For each design direction: same 7 screens and identical exercise scenario; paired desktop/tablet/mobile renders; interactive transitions; failure paths; contrast/focus; map truth tests; rough implementation diff; independent evaluator verdict. Rank weighted by learning effectiveness, task completion, geographic truth, clarity, accessibility, DX, AX and risk, with weights declared before user testing.

## Deferred until product proof
Billing, full accounts, cloud databases, AI tutor, teacher analytics dashboards, app-store wrapper, automatic geography generation, interactive agent observatory, graph DB, fresh domains, global rollout.

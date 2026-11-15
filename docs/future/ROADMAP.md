# TOPO Next — Roadmap and launch gates

**Status:** future plan; NOT ACTIVE. Sequence is conditional, not calendar-committed. Product prioritization: geography correctness > learning effectiveness > clarity > usability > consistency > engagement.

## Preconditions / START LINE (all mandatory)
- [ ] Italy V3 released with G3/Hermes and G4 owner acceptance; production URL, source tag/SHA, regression and physical iPad evidence recorded.
- [ ] France V4 released, curriculum/geography verified, G3/G4 evidence recorded; production URL, source tag/SHA and learner acceptance recorded.
- [ ] Shared learning engine / land packages characterized; known tests, save schema, offline assets, deployment and rollback documented, whether M1/M2 as expected or changed by later decisions.
- [ ] Check M3 status and reprioritization with current ops/ROADMAP; no automatic displacement of the approved land-factory milestone.
- [ ] Preserve a reproducible baseline, known limitations, and source/license registry; no direct editing of generated index.html.
- [ ] Owner grants a one-page **G0 Next GO** including mission, scope, budget, timebox and explicit kill criteria.
- [ ] Confirm a single active programme/lead and independent evaluator; close/archive the temporary preparation branch under GIT_RELEASE discipline.

## Stage N0 — Readiness (now, zero new product code)
Outputs: vision/constitution, decision boundaries, research questions, design comparison rubric, technology hypotheses, phase contracts and initial evidence requirements. Reuse established harness and morning briefs. **Exit:** a reviewer can start N1 without asking what to research or breaking Italy/France capacity. No renders are accepted as geographic evidence.

## Stage N1 — Discover
Work: evaluate current production flows and competitor products; interview/observe children aged about 10–11, parents and teachers with appropriate consent; review curriculum, accessibility, geography licensing, offline use, privacy, teacher workflows, B2C/B2B distribution. Compare existing TOPO with baseline alternatives using same tasks.
Minimum evidence: dated competitor matrix with sources, task observation notes without personal identifiers, baseline task-success/friction, reliable source list and a prioritized opportunity map.
Exit: one falsifiable core learning problem and three measurable outcome hypotheses. Kill/pivot if research fails to support value over existing Italy/France.

## Stage N2 — Design
Produce three meaningfully distinct but equally complete concepts: Learning First, Living Atlas, Nino Journey. Each must show (1) Portal landing/select/resume, (2) student home, (3) atlas geography, (4) discover chapter, (5) point + write exercise, (6) feedback/error/retry, (7) Book/progress and small-screen states. Include keyboard/focus/reduced-motion cases and truthful empty/error states.
Use the same actual, validated land geography and learning scenarios; illustration-only mockups are allowed for mood, never proof of coordinates.
Exit: comparison on child task success, perceived clarity, map legibility, accessibility, DX/AX complexity and implementation risk; owner G1 approval of chosen direction.

## Stage N3 — Prove
Create isolated non-production prototype preserving real learning behavior and offline/local-first assumptions; test key scenarios (San Marino/Vatican, Po, Apennines, school map, 45 objects, chapter/quiz progression, saves, resets, mobile/iPad). Evaluate architecture options against current runtime, not theoretical fashion. Document tradeoffs via ADRs.
Exit: evaluator PASS against defined acceptance scenarios, representative device performance, save compatibility design, explicit go/no-go. No account/backend added by default.

## Stage N4 — Build
Vertical slices: Portal-to-Learn flow; shared shell and map; learning practice & error feedback; Book & rewards; France package compatibility; optional teacher/share experiment only on evidence.
Every slice includes specification, tests, preview, rollback and independent review; production remains unchanged until G3/G4.
Exit: complete regression parity or approved deliberate change, learning measurements, accessibility and offline tests.

## Stage N5 — Validate and release
Pilot study, cross-device testing including physically accessible iPad 9, independent Hermes evaluation, privacy/security, licensing, accessibility, performance, account-free path, Vercel deployment controls, recovery rollback, teacher workflow pilot if within scope.
Owner G4 explicitly approves production. Measure task success and learning retention; track outcomes and halt/revert for regressions.

## Optional N6 — Scale (not presumed)
Add more countries, teacher features, family sync, commerce and TOPO Studio only if measured needs justify them. New accounts/database and domain purchases require separate ADR, privacy/security review, cost model and owner approval.

## Decision checkpoints
- G0: move from readiness to discovery.
- G1: choose direction after side-by-side interactive design study.
- G2: per-task evaluator PASS (existing gate).
- G3: independent release candidate QA.
- G4: owner release approval.
Default: reversible low-risk decisions are made by lead, logged with reasons and evidence; no owner interrupt unless required.

## Risks and mitigations
- Existing HTML/preview size and low-memory iPad: measure baseline performance, prioritize efficient land assets.
- Geometry drift: pin map provenance and hashes; never treat generated art as map geometry.
- Data loss: idempotent local-save migrations, backup/export, old-schema reader and rollback tests.
- Scope growth: fixed experience-first MVP, explicit out-of-scope ledger, timeboxed research.
- Duplicate agents/credits: one owner per task, hard budget limits and bounded loops.
- Child privacy and school compliance: privacy-by-design, minimal data; legal review before accounts/classroom.
- Overcomplicated portal: account-free land selection and resume, no interruptions to a lesson.

# France First — School Continuity Contract
**Decision:** owner approved France as first TOPO Next Personal Edition (2026-11-17). **Non-negotiable:** child must be able to practise every assigned school topography set digitally, including while Next is under construction. **Status:** approved product direction, documentation only; not implementation/release approval.

## Experience: one product, two clear routes
- **Voor school / Volgende overhoring:** primary action when a current assignment exists; only school-assigned content and matching question types; accurate names, geography, scope and teacher-given conventions; practise then rehearse exam, save mistakes and resume.
- **Ontdekken / Atlas:** free map exploration, expanded geographical context, historical rewards and Nino; never silently adds extra content to a school-assignment test.
- Navigation and visual design stay unified. School prep is NOT a separate app, second engine, teacher dashboard, subscription feature or new account. The school-set can be an ordinary local data record referencing canonical item IDs.

## School-source truth, not generic geography
1. Parent supplies or selects the school learning material/worksheet and intended chapter(s). Keep source, date and version where licensed for personal use; **not** identifying school/pupil data or copyrighted source uploads in a public repo.
2. Convert to a *reviewable candidate school set*, preserving the exact required object list, original order/grouping when relevant, Dutch names, location type, permitted aliases, question form (point/write and any teacher-specific formats) and optional test date.
3. Show a compact **'Dit moet ik kennen'** review before activating. Any image/text extraction is only a suggestion: no automatic claim of complete OCR or curriculum correctness. Manual selection/editing must work.
4. Resolve each item to verified canonical geographic IDs and locations. Unknown/ambiguous items are visible pending review; do not quietly omit, substitute or add.
5. Stable per-assignment ID, version, source reference, selected item IDs, expected answer aliases, test types and optional date. School items and general Atlas items share one map dataset, not duplicate coordinate sources.
6. A later teacher worksheet produces a *new assignment version*; existing practice history is preserved. No surprise changes to an active test.

## Important France data discrepancy to reconcile
Current `src/lands/fr/README.md` says the 40-item draft excludes **nine neighbor countries** that appeared in the earlier 44-item source branch because supported types were restricted to six; it also adds **five concept cities** from an external exercise list, not explicitly from the original worksheet. Before calling a school set complete, compare against actual school source, preserve applicable neighbor countries by extending item **data types** where justified, and exclude unrelated extra cities from school mode. Do not change the school set to satisfy a target item count. Verify all selected cities/regions/waterways/neighbor countries geographically. This is a product correctness risk, not merely a future enhancement.

## Study and learning workflow
- One-click continue on the Portal; pre-exam session: learn → pinpoint → write → mixed practice test → mistakes/repeat.
- Show 'Nog oefenen' vs 'Gaat goed' with honest evidence, no fake prediction of a grade.
- A zero-extra-friction default practice session, with optional 5–10 minute practice blocks or full practice overhoring. Do not force timers/streaks.
- Match *school's actual* assessment formats; don't reintroduce worksheet letter/number memorisation unless explicitly assigned by teacher and user authorises it (existing owner preference is pointing and name writing, not schoolcode recall).
- Allow an assignment to be practised fully offline, save locally, retain independent mastery by item and assignment, and export/backup progress.
- Age-adaptive presentation later; do not infer mastery from age.

## School-first fallback / bridging release
1. Finish Italy V3 safely; protect existing runtime and progress.
2. If new France assignments arrive before the Next design/build is verified, prioritise a **minimal school-compatible France exercise** using the existing tested engine and verified France data, rather than blocking the learner on Next art or Portal work. This is a proposed conditional work item, not permission to deploy.
3. This bridge should be small, reversible, off production until QA, and forward-compatible with Next canonical item IDs, saved attempts and school-set format.
4. The existing `ops/ROADMAP.md` remains the execution source of truth until the lead proposes a scoped replan following the approved France-first strategy and owner reviews the schedule/gates.

## Acceptance checks
- [ ] Exact worksheet-to-assignment coverage, including relevant neighboring countries and exceptions, with no silent extras/omissions.
- [ ] Distinguish 100% of required names/aliases with source-aligned spellings and checkable geography.
- [ ] All assigned items can be selected and answered on school map in expected question forms; easy taps and overlap handled.
- [ ] Full offline practice and lossless save/resume on supported iPad and computer.
- [ ] Mistake review and deterministic test-mode scores scoped to assignment; no misleading readiness or grade guarantees.
- [ ] New worksheet updates don't erase/retroactively change previous assignments.
- [ ] Independent evaluator evidence, child usability check, correct map/source license; owner G1/G4 gates as existing rules require.

## Ownership / default
Lead owns roadmap and prioritization, reviewer checks exact source, builder implements one contract, evaluator and Hermes verify. Owner is not an administrator: only genuinely ambiguous worksheet content or consequential G0/G1/G4 decisions are escalated. User testing with peers remains voluntary and privacy-preserving. No monetization requirement.

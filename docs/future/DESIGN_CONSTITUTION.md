# TOPO Next Personal Edition — Design Constitution 1.0

**Decision date:** 2026-11-15 · **Owner direction:** APPROVED as future design north star · **Implementation:** PARKED until Italy V3 + France V4 release acceptance, existing roadmap alignment, and explicit G0 start decision.

## North star
> **Effortless to use. Beautiful to explore. Effective to learn.**

- Apple Notes: immediately understandable and low-friction, not a visual template.
- Linear: craft, consistency, fast and precise interaction, not a visual template.
- World-class atlas: beautiful **and geographically true** cartography, not AI-generated geographic guesses.
- Excellent learning design: retrieval, spacing, actionable feedback, comprehensible challenge and meaningful delight. No guilt, streak pressure or reward inflation.
- **TOPO must feel like a beautifully crafted interactive atlas that makes learning effortless.** Build an independent visual identity rather than copying products.

## Mission and success
**Personal-use first.** Initial user: founder's child in Dutch primary school, group 7 progressing to group 8. Success is enjoyable, effective, independent learning and a professional product-development experience for its owner. **Commercial market validation is optional**, not a prerequisite or KPI for building Personal Edition. Any later interest from classmates, teachers, families or schools should be voluntary, evidence-led and privacy-safe. Do not presume classroom or payments scope.

## Principles (in priority order)
1. **Learning first:** every view helps discover, understand, retrieve or remember geography.
2. **Radical simplicity:** remove taglines, helper text, redundant labels, competing calls to action and unnecessary navigation. If text is needed to make the view intelligible, test a better layout first. Retain essential instructions, accessible names, warnings and error explanations.
3. **Cartographic excellence:** map is first-class, based on verified geometry with pinned sources, stable reference positions and suitable hit tolerances distinct from visual shapes.
4. **Meaningful delight:** Nino and travel-book rewards at meaningful moments, not persistent distraction; playfulness stays in the experience, not the navigation.
5. **Invisible engineering:** responsive, fast, offline/local-first by default, accessible, save-safe, testable; each change should improve UX, DX and AX without regression.
6. **Grow with the learner:** distinguish knowledge mastery, learning goal and presentation preference. Never equate age with ability or force a childish UI on a beginner adult. Start with primary-school scope; adaptability beyond this is a later research hypothesis, not immediate feature scope.

## Experience architecture: minimum coherent surfaces
- **Portal:** enter, choose a country, resume with one clear action; no account requirement, no marketing gate. The portal and app share a design language. No future URL or domain migrations authorized.
- **Learn:** chapter discovery, map-first lesson, pointing, name-writing, formative feedback and selective review. Quiz and gold modes stay reachable without clutter.
- **Atlas:** freely explore real map layers/labels; geographic relationships are understandable.
- **My Book:** show earned progress, mistakes to revisit, meaningful Nino moments and durable rewards.
- **Classroom:** research-only candidate for later; no teacher dashboard now.
- **Studio:** internal content tooling only if evidenced; avoid premature CMS.

Navigation is deliberately sparse, but no specific tab count is locked before testing actual tasks. During an exercise, hide irrelevant navigation and preserve safe exit/resume.

## Design study contract for N2
Compare three **different product philosophies**, not colorways:
1. **Learning First** — the learning task dominates; map and controls only when required.
2. **Living Atlas** — exploration and geographical mental models lead.
3. **Nino Journey** — a restrained emotional discovery narrative, with rewards only for mastery/milestones.

Each must show **the same realistic scenario** on desktop, iPad and phone:
- Portal landing / country selection / resume
- Learner start / chapter selection
- Atlas explore / map layers
- Discover lesson
- Point task + write task
- Correct, incorrect, retry and constructive feedback
- My Book / mastery / earned reward
- Essential empty, offline, error, keyboard/focus and reduced-motion states

**Design outputs:** (1) one annotated user journey, (2) screens with the same real validated geography, (3) functional clickable prototype, (4) minimal component/token sheet, (5) comparative UX + DX + AX assessment, (6) one independent evaluator verdict, and (7) owner G1 choice. Generated visual concept renders are inspiration only; they are not map-correctness or usability evidence.

## Evaluation rubric (pre-register before testing)
Hard blockers: wrong geography, inaccessible core interactions, broken offline learning or saved-progress loss.
Then compare: measured learner task success and recall, time-to-start, wrong-answer recovery, cognitive load and clarity, map legibility, independence, delight without distraction, responsive performance, implementation diff/complexity, maintainability and agent reproducibility. Measure on the existing V3/V4 baseline and users; do not fabricate metrics or invent absolute pass thresholds.
A beautiful render does not pass without a usable end-to-end flow.

## Architecture guardrails
- Build on characterized shared learning engine and validated country packages.
- Local-first, export and migration safety. No forced registration or cloud database.
- Separate mastery and learning-goal rules from presentation/age preference.
- Avoid duplicate coordinate sources, manual graph databases, microservices and CMS unless strong evidence requires them.
- Keep the existing V3/V4 source-of-truth, M0–M3 and G0–G4 harness until formally changed; do not modify currently shipping UI or production Vercel in this design study.

## Scope boundaries
**Now:** this document and related preparation in draft PR only. No new agents, scheduled automation, live changes or implementation.
**Later after explicit G0:** research, full design study and verified prototype.
**Only after G3/G4:** public releases.
**Never presume:** monetization, class accounts, AI tutors or international market expansion. Personal success is sufficient.

## Decision discipline
If two designs are equally effective, choose the simpler. If a new component requires helper copy to make sense, reconsider interaction. If UX gain introduces large DX/AX complexity, seek a simpler solution. If geography or learner safety is compromised, reject regardless of visual appeal.

The owner acts as commissioner, consultant and optional design sparring partner. The existing lead owns end-to-end delivery and presents excellent, evidence-backed work through the existing morning briefing. Batch decisions; keep owner hands-off except existing design G1 and release G4 gates.

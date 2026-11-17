# TOPO Next — Future Design Study 1.0

**Status:** FRANCE-FIRST DIRECTION APPROVED / DESIGN & CODE NOT STARTED · **Product:** TOPO Next Personal Edition · **Repository:** ColdDesertAI/topo · **Strategy updated:** 2026-11-17

## Purpose
Design the simplest, most effective and delightful way for a child to learn geography. TOPO Next is a product excellence programme. **France is its first intended country**, while Italy V3 remains the stable reference. This approves product direction, **not** the implementation, merging or shipping.

> Simple purpose. Simple architecture. Simple design. Simple implementation. Cut taglines, helper text and secondary labels. If a screen needs them to make sense, fix the layout. Every decision should elevate UX, DX and AX together without breaking anything.
>
> Playfulness belongs in the learning experience, not in interface complexity. Complexity must be justified; simplicity is the default.

**Main surfaces:** Portal (enter/select/resume), Learn (discover/practise/test), My Book (progress/discoveries/rewards). Classroom is a research track, not initial scope. Studio is internal tooling only if content operations demand it.

**Owner model:** Dennis = commissioning client, strategic sparring partner, optional design consultant. Existing lead owns execution and reporting, maker does one bounded task, read-only evaluator judges evidence, Hermes supplies independent QA and operations. No duplicated autonomous team.

## Relationship to existing production roadmap
Existing authority: [ops/ROADMAP.md](../../ops/ROADMAP.md), [ops/OPERATING_MODEL.md](../../ops/OPERATING_MODEL.md), [ops/STATE.md](../../ops/STATE.md), [ops/GIT_RELEASE.md](../../ops/GIT_RELEASE.md), [AGENTS.md](../../AGENTS.md).
- Italy V3 release and its G3/G4 gates remain the immediate priority. **Owner approved France-first Next after Italy V3**; the existing M1/M2/M3 execution schedule must be deliberately reconciled by the lead rather than silently superseded. No code or production changes from this study.
- Readiness preparation is documents, source analysis and reusable research briefs only. Do not start a second parallel implementation stream. Do not compete with the already permitted France data/art stream.
- Do not deploy, buy domains, add database/auth, migrate saved data, change URLs or production settings.
- START is conditional on verified Italy V3 release/acceptance, a stable learning-engine baseline, reconciled M1–M3 schedule and explicit G0 Next owner GO. **France V4 is now the proposed first Next implementation, not a prerequisite.** School overhoringen must remain digitally practicable throughout (see school contract).

## Entry points
1. [ROADMAP.md](ROADMAP.md) — phase contracts, requirements and exit criteria.
2. [STUDY_BACKLOG.md](STUDY_BACKLOG.md) — research, competitor, designs, architecture, business and trials.
3. [OPERATING_CONTRACT.md](OPERATING_CONTRACT.md) — agents, loop, evidence, graph, decision rights and morning brief.
4. [FRANCE_FIRST_SCHOOL_CONTRACT.md](FRANCE_FIRST_SCHOOL_CONTRACT.md) — approved France-first strategy, worksheet parity, near-term school-use fallback.

## Source of truth
Everything here is **a proposal in a draft branch**, not an approved replacement for ops/ROADMAP.md. Current state must always be rechecked at kickoff. This study may be merged as documentation only following the existing process. If it conflicts with approved ops rules, approved ops rules win.

## First deliverables after activation
Research dossier with dated sources and licensing; three comparable end-to-end design concepts (Portal, Learn, Atlas, exercise, feedback, Book); usability observations; architecture decision record; offline and save-migration characterization; selected prototype with independent evidence. No production migration before G3/G4.

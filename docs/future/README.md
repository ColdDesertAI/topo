# TOPO Next — Future Design Study 1.0

**Status:** PARKED / PREPARED · **Product name:** future TOPO Suite · **Repository:** ColdDesertAI/topo · **Date:** 2026-11-15

## Purpose
Design the simplest, most effective and delightful way for a child to learn geography. TOPO Next is a product excellence programme, **not** Italy V3 or France V4, and **not** permission to rebuild or ship the existing app.

> Simple purpose. Simple architecture. Simple design. Simple implementation. Cut taglines, helper text and secondary labels. If a screen needs them to make sense, fix the layout. Every decision should elevate UX, DX and AX together without breaking anything.
>
> Playfulness belongs in the learning experience, not in interface complexity. Complexity must be justified; simplicity is the default.

**Main surfaces:** Portal (enter/select/resume), Learn (discover/practise/test), My Book (progress/discoveries/rewards). Classroom is a research track, not initial scope. Studio is internal tooling only if content operations demand it.

**Owner model:** Dennis = commissioning client, strategic sparring partner, optional design consultant. Existing lead owns execution and reporting, maker does one bounded task, read-only evaluator judges evidence, Hermes supplies independent QA and operations. No duplicated autonomous team.

## Relationship to existing production roadmap
Existing authority: [ops/ROADMAP.md](../../ops/ROADMAP.md), [ops/OPERATING_MODEL.md](../../ops/OPERATING_MODEL.md), [ops/STATE.md](../../ops/STATE.md), [ops/GIT_RELEASE.md](../../ops/GIT_RELEASE.md), [AGENTS.md](../../AGENTS.md).
- Existing M0–M3 and the Italy V3 / France V4 release gates **take precedence**. No edits to those files or code from this study.
- Readiness preparation is documents, source analysis and reusable research briefs only. Do not start a second parallel implementation stream. Do not compete with the already permitted France data/art stream.
- Do not deploy, buy domains, add database/auth, migrate saved data, change URLs or production settings.
- START is conditional on verified Italy V3 and France V4 release/acceptance, a stable baseline and explicit G0 owner GO. M3 dependencies must be evaluated against the existing roadmap; do not silently supersede M3.

## Entry points
1. [ROADMAP.md](ROADMAP.md) — phase contracts, requirements and exit criteria.
2. [STUDY_BACKLOG.md](STUDY_BACKLOG.md) — research, competitor, designs, architecture, business and trials.
3. [OPERATING_CONTRACT.md](OPERATING_CONTRACT.md) — agents, loop, evidence, graph, decision rights and morning brief.

## Source of truth
Everything here is **a proposal in a draft branch**, not an approved replacement for ops/ROADMAP.md. Current state must always be rechecked at kickoff. This study may be merged as documentation only following the existing process. If it conflicts with approved ops rules, approved ops rules win.

## First deliverables after activation
Research dossier with dated sources and licensing; three comparable end-to-end design concepts (Portal, Learn, Atlas, exercise, feedback, Book); usability observations; architecture decision record; offline and save-migration characterization; selected prototype with independent evidence. No production migration before G3/G4.

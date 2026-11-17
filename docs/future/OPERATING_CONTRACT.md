# TOPO Next — Operating contract (prepared, not active)

## Authority and non-overlap
Approved [ops/OPERATING_MODEL.md](../../ops/OPERATING_MODEL.md) and [ops/GIT_RELEASE.md](../../ops/GIT_RELEASE.md) prevail. **Do not create a second agent organization, recurring morning brief or background task.** The existing 08:00 briefing must report verified GitHub progress and separate planned work from completed work. TOPO Next remains PARKED until Italy V3 and France V4 are released and owner G0 is recorded.

## Roles
Owner = commissioning client, strategic advisor and optional visual consultant; not backlog manager. Existing Claude lead is accountable for priority, design and architecture; builder chosen by bounded scope/credit budget (Claude Code or Codex, never overlapping); evaluator is read-only and checks contract; Hermes performs independent QA/operations. ChatGPT supports product research/review; source decisions are stored in Git, never only chat.

## Execution loop
1. UNDERSTAND: read `ops/STATE.md`, approved rules, task contract and only relevant files.
2. RESEARCH: pin primary sources, dates, confidence, provenance, children/privacy/education constraints.
3. PROPOSE: state goal, reversible scope, alternatives, success/failure criteria, dependencies and budget.
4. MAKE: one task/branch/owner; minimal diff; no unrelated refactor.
5. VERIFY: deterministic checks and relevant browser/device evidence; independent evaluator; failures block completion.
6. LEARN: compare expected versus observed; suggest harness improvement with evidence, never self-modify silently.
7. UPDATE: log SHA, output, screenshots/previews, PASS/FAIL, decision, next safe step and rollback; update existing ops state only when approved scope is active.

After 2 failed attempts on one contract: lead must split/reframe, not loop indefinitely. No production publish, destructive changes, spending, new domain, auth/backend without designated approval. Do not report 'working overnight' absent a connected operator and logged results.

## Dependency graph (derive, don't duplicate)
Nodes = outcomes, tasks, land content packages, decisions, code modules, tests, designs, evidence. Edges = depends-on, implements, verified-by, supersedes, blocked-by. Use issue references and code/test manifests; a small generated view only if helpful. Don't maintain a second source of truth or add graph DB.

## Reviews, updates and owner attention
Morning brief: since last report *verified* changes (links/SHA), planned next, relevant render/demo, risks, at most 3 required owner decisions, recommendation. If none, say 'Geen actie nodig'. Weekly: one demo and trend in learning, usability and defect/QA metrics. The lead batches owner questions; optional design preference is welcomed, not mandatory except existing G1/G4 rules. Avoid duplicate ChatGPT and Mac mini reports; choose canonical `ops/briefs/` artifact.

## Readiness stop rule
Until explicit Next G0, permissible work on this track is the small document/research preparation contained in this draft package. Existing M0–M3, V3 release and V4 France remain undisturbed. New source code, production routes, Vercel config, DNS, data migration and marketing releases are out of scope.

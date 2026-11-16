# TOPO snapshot audit tools

These tools only measure a generated preview; they never edit app sources. Fixtures use disposable browser contexts and the existing in-memory preview demo (`#welkom`, `#nieuw`, `#alles`). They do not read a real user's saves. Source pin: `config.mjs`.

```sh
npm ci --prefix scripts/audit
npm --prefix scripts/audit run audit:v3
npm --prefix scripts/audit run test:audit
```

Equivalently, inside `scripts/audit`, use `npm run audit:v3` / `npm run test:audit`. Root package.json is intentionally untouched pending permission to exceed the directory-only lane. Browser launch defaults to installed Google Chrome; WebKit is attempted only if already installed. No browser download, network fonts or remote axe dependency is needed at run time. First dependency install needs npm access. Set `AUDIT_CHROME` for another Chromium executable.

`index.mjs` builds via the existing builder, captures, measures performance serially (no competing capture browser), derives tables/comparisons and runs hard-rule tests. Expected current design failures are saved, not repaired. Results are in `ops/reports/audit/<source SHA>/`; latest.json points tests there. Tests returning nonzero means the design has hard-rule findings, not that the measurement command crashed. Capture errors and unknown contrast coverage are separate report limitations and must not be called passing.

Coverage: 17 named states × four viewports × normal/reduced preferences in Chromium, plus those states on iPad WebKit if available. This is a finite state sample, not proof of every chapter, celebration, backup error or interaction combination. New countries need only a state adapter/config and reference-render mapping; probes and gates stay shared.

Measurement caveats:
- Text candidates use DOM Range boxes; zero painted-glyph sample candidates stay separately classified, and only painted nodes contribute to word counts. Fixed descendants can escape ancestor overflow clipping. `activeWords` excludes the inert page behind a modal. Native input values/placeholders and CSS generated text are not included in word counts. Clipped nodes are retained with a flag. SVG font size uses the projection transform. Occlusion/antialias can make contrast unknown; never count unknown as passing.
- Contrast uses a second screenshot with glyph paint made transparent, preserving layout and glass; sampled at changed glyph pixels, with the fifth-percentile ratio against computed foreground/SVG fill. HTML glyph hiding uses webkit-text-fill-color, retaining currentColor backgrounds; ancestor/fill opacity is unknown. Ancestor opacity and overlapping text can confound it. Candidate fails need human review. Inactive/modal-underlay text is exempt. AA uses 4.5:1, or 3:1 at ≥24px / ≥18.667px bold.
- DOM target bounds are strict 44px gates. Real map hit testing may have a larger effective radius; explain that separately rather than moving geographic coordinates. Eight-pixel gaps and overlaps are advisory.
- Static CSS tokens preserve declarations/expressions, including values overridden later. Unmatched selectors mean “not matched in this captured sample”, never proven dead. Pseudo-selectors and media conditions need review. JS inline-style scanning is lexical, not complete semantic analysis.
- CPU4× headless at DPR2 is a proxy, not physical iPad memory or Safari frame-rate certification. Readiness includes state navigation plus fonts and settling; it is not formal Lighthouse TTI. HTML image bytes are a lower bound, not GPU/physical memory. Heap is GC-retained JS, not proof of a leak.

No root lint/test/build or app QA is altered. All current hard-rule failures remain for Claude Code after G1; audit code/report only, no merge.

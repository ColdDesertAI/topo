# Independent static tool review

A fresh reviewer inspected measurement code and report claims without editing files or running competing browsers. Three important findings were corrected:

1. Glyph hiding changed currentColor paint; HTML now hides only webkit text fill. SVG uses computed fill; ambiguous ancestor/fill opacity remains unknown.
2. Class-based focus identity truncated repeated controls; a WeakMap now identifies actual DOM nodes and traversal records cycle/truncation/invisible/ring candidates.
3. Missing captures could produce an apparently green hard-rule suite; a separate completeness validator now requires the expected matrix, dimensions, reduced media preferences, zero capture errors, all performance rows and heap evidence.

Follow-up static review found no additional important blocker. Contrast sampling and focus-name/ring detection remain explicitly described heuristics. Unit fixtures cover WCAG extremes, SVG fill, currentColor preservation, opacity uncertainty, hidden modal markup and fixed descendants escaping clipped ancestors.

This is review of the tools, not an accessibility certification or a physical iPad test.

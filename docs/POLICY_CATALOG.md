# A11yPulse Policy Catalogue

A11yPulse combines an axe-core browser scan with small, transparent browser-quality checks. The catalogue is intentionally narrow: each finding is evidence for review and links to a remediation direction rather than claiming full conformance.

| Check family | Examples | Severity guidance | Reference |
|---|---|---|---|
| Text alternatives | Missing image alternative text; non-text controls without names | Critical or serious | WCAG 1.1.1, 4.1.2 [1] [3] |
| Semantic names and roles | Unnamed buttons, links, or input controls; invalid ARIA values | Serious | WCAG 4.1.2 [3] |
| Structure and navigation | Missing document title, language declaration, skip mechanism, or semantic heading order | Serious or moderate | WCAG 2.4.2, 3.1.1, 2.4.1 [1] [3] |
| Color and visual scaling | Insufficient text contrast or a viewport that prevents scaling | Serious or moderate | WCAG 1.4.3, 1.4.4 [3] |
| Basic web quality | Failed initial document response, missing title, missing language, or focus visibility signal | Moderate | A11yPulse implementation rule |

WCAG 2.2 organizes testable success criteria beneath the principles **perceivable, operable, understandable, and robust** and defines A, AA, and AAA conformance levels. [1] A WCAG 2.2 conformance claim requires more than automated checks; A11yPulse therefore labels its output as an audit report rather than a conformance result.

## Scoring

The demo score starts at 100 and applies deterministic deductions based on the highest-impact evidence and aggregate count. Critical issues carry the largest deduction, then serious, moderate, and minor findings. The score is designed for triage and trend comparison within the same platform configuration; it is not a measure of legal or universal accessibility.

## References

[1]: https://www.w3.org/TR/WCAG22/ "W3C: Web Content Accessibility Guidelines (WCAG) 2.2"
[2]: https://playwright.dev/docs/accessibility-testing "Playwright: Accessibility testing"
[3]: https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md "axe-core: Rule descriptions"

# Research Notes

The implementation follows three important reference boundaries.

| Source | Applied design decision |
|---|---|
| W3C WCAG 2.2 | Use WCAG-oriented tags and remediation language without representing an automated scan as a complete conformance decision. WCAG success criteria are testable statements, but its guidance anticipates a combination of automated testing and human evaluation. [1] |
| Playwright accessibility guidance | Use Playwright with the axe engine for automatically detectable browser issues and communicate the need for manual accessibility assessment. [2] |
| axe-core rule catalogue | Preserve the rule ID, impact, tags, and targets returned by the scanner so engineers can trace each finding to a specific remediation discussion. [3] |

## References

[1]: https://www.w3.org/TR/WCAG22/ "W3C: Web Content Accessibility Guidelines (WCAG) 2.2"
[2]: https://playwright.dev/docs/accessibility-testing "Playwright: Accessibility testing"
[3]: https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md "axe-core: Rule descriptions"

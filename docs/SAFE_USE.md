# Safe Use and Target Authorization

## What A11yPulse Does

A11yPulse opens an approved page in a local Chromium session and performs bounded, read-only browser checks. It identifies **automatically detectable** accessibility and basic web-quality issues, then returns actionable evidence to an analyst.

## What A11yPulse Does Not Do

The application does not accept arbitrary public URLs in the first release. It does not crawl, enumerate pages, bypass access controls, attempt authentication, store cookies or credentials, submit forms, alter a target, download user data, conduct security tests, or contact third-party services. It does not make accessibility conformance, legal, or certification decisions.

## Authorized Target Contract

The local demonstration exposes exactly two approved targets: `demo-needs-work` and `demo-reviewed-baseline`. The API accepts one of those target IDs only. An optional future deployment may add team-controlled preview hosts through environment-defined allowlists; any such target must be owned by the organization or explicitly authorized in writing.

> Automated findings are a triage signal. They must be combined with manual keyboard, screen-reader, visual, and inclusive user testing before making a conformance or release decision. [1]

## Operator Checklist

| Before an audit | Required action |
|---|---|
| Target ownership | Confirm that the page is a bundled fixture or a team-owned, explicitly authorized preview target. |
| Sensitive data | Use sanitized content only; do not place customer records, secrets, or tokens in a target page. |
| Result interpretation | Treat findings as evidence for engineering review, not a compliance certificate. |
| Escalation | Route unresolved accessibility questions to qualified accessibility reviewers and people with relevant lived experience. |

## Reference

[1]: https://playwright.dev/docs/accessibility-testing "Playwright: Accessibility testing"

# A11yPulse Demo Verification

## Visual verification

The React quality dashboard was opened against the local FastAPI audit service through the temporary preview. The initial approved `demo-needs-work` target completed successfully and displayed the full evidence-backed report.

## Verified results

| Check | Observed result |
|---|---|
| Audit scope | The interface labels the product as **Local-only audit mode** and restricts scope to bundled approved targets. |
| Needs-attention report | The dashboard rendered an overall release-readiness score of **36/100**, with **15** actionable findings. |
| Accessibility evidence | The report rendered **3 critical**, **9 serious**, and **3 moderate** findings from browser evidence, including accessible names, alternative text, labels, language, contrast, target size, and title checks. |
| Quality signals | The signal ledger correctly showed a missing title and language, zero primary headings, no main landmark, and five focusable elements for the deliberately flawed local target. |
| Remediation workflow | Each finding showed an evidence target, a recommended next step, compact standards tags, and an external rule-reference control when provided by the audit engine. |

## Reviewed-baseline verification

The dashboard was switched to the approved `reviewed-baseline` target and its browser audit completed successfully. The report rendered **100/100** release readiness, accessibility score, and quality score, with **0** findings. It also correctly surfaced the expected snapshot facts: the `Northstar Commerce — Account overview` title, `en` language, one primary heading, a main landmark, and six focusable elements.

## Scope reminder

The dashboard is a deterministic testing aid. It does not claim conformance, certification, or legal compliance. Manual keyboard, screen-reader, visual, and inclusive-user testing remain required.

## Final release presentation check

On 2026-08-19, the exposed local dashboard completed a fresh approved needs-attention audit and rendered the live report without an error state. The console showed **36/100** release readiness, **0/100** accessibility score, **71/100** quality score, HTTP 200 browser capture, and **15** evidence-backed review items. The remediation queue kept the deliberately flawed synthetic target separate from the platform’s own accessible dashboard.

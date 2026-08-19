from __future__ import annotations

from qualitygate.engine import run_audit


def _runner(_: str) -> dict[str, object]:
    return {
        "response_status": 200,
        "axe_violations": [
            {
                "id": "image-alt",
                "impact": "critical",
                "description": "Images must have text alternatives.",
                "help": "Images must have alternative text",
                "help_url": "https://dequeuniversity.com/rules/axe/image-alt",
                "tags": ["wcag2a", "wcag111"],
                "nodes": [{"target": "img", "html": "<img>", "failure_summary": "Fix alt text."}],
            }
        ],
        "browser_signals": {
            "title": "",
            "language": "",
            "headingLevels": [3],
            "h1Count": 0,
            "hasMainLandmark": False,
            "focusableCount": 3,
        },
    }


def test_engine_returns_evidence_rich_report() -> None:
    report = run_audit("demo-needs-work", runner=_runner)

    assert report.summary.total_findings == 5
    assert report.summary.critical == 1
    assert report.summary.overall_score < 100
    assert report.findings[0].finding_id == "axe-image-alt"
    assert report.findings[0].reference_url is not None


def test_engine_preserves_safe_target_label() -> None:
    report = run_audit("demo-reviewed-baseline", runner=_runner)

    assert report.target == "demo-reviewed-baseline"
    assert report.target_label == "Reviewed local baseline"

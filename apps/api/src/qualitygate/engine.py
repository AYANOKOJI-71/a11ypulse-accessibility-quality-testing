from __future__ import annotations

import json
import os
import subprocess
import uuid
from collections import Counter
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from qualitygate.contracts import AuditFinding, AuditReport, AuditSummary, TargetKey

PROJECT_ROOT = Path(__file__).resolve().parents[4]
AUDITOR_DIR = PROJECT_ROOT / "apps" / "auditor"
TARGET_DETAILS: dict[TargetKey, tuple[str, str]] = {
    "demo-needs-work": (
        "Demo page needing attention",
        "A deliberately flawed local product page that demonstrates actionable accessibility and quality evidence.",
    ),
    "demo-reviewed-baseline": (
        "Reviewed local baseline",
        "A local reference page designed to demonstrate a clean automatically detectable scan.",
    ),
}
SEVERITY_WEIGHTS = {"critical": 18, "serious": 11, "moderate": 6, "minor": 2}


def _score(findings: list[AuditFinding], family: str | None = None) -> int:
    selected = [finding for finding in findings if family is None or finding.family == family]
    deduction = sum(SEVERITY_WEIGHTS[finding.severity] for finding in selected)
    return max(0, 100 - deduction)


def _quality_findings(signals: dict[str, Any], response_status: int) -> list[AuditFinding]:
    findings: list[AuditFinding] = []
    if response_status < 200 or response_status >= 400:
        findings.append(
            AuditFinding(
                finding_id="quality-response-status",
                family="quality",
                severity="critical",
                title="Initial document response was unsuccessful",
                detail=f"The approved local target returned HTTP {response_status}.",
                target="document",
                remediation="Restore a successful initial document response before relying on audit results.",
            )
        )
    if not signals.get("title"):
        findings.append(
            AuditFinding(
                finding_id="quality-document-title",
                family="quality",
                severity="serious",
                title="Document title is missing",
                detail="The browser snapshot did not expose a non-empty document title.",
                target="head > title",
                remediation=(
                    "Provide a concise, page-specific <title> that helps people orient in browser tabs "
                    "and assistive technology."
                ),
                tags=["wcag2a", "wcag242"],
                reference_url="https://www.w3.org/TR/WCAG22/#page-titled",
            )
        )
    if not signals.get("language"):
        findings.append(
            AuditFinding(
                finding_id="quality-document-language",
                family="quality",
                severity="moderate",
                title="Document language is not declared",
                detail="The HTML element does not expose a language value to the browser snapshot.",
                target="html",
                remediation=(
                    "Declare the primary page language with a valid lang attribute, such as <html lang=\"en\">."
                ),
                tags=["wcag2a", "wcag311"],
                reference_url="https://www.w3.org/TR/WCAG22/#language-of-page",
            )
        )
    if signals.get("h1Count") != 1:
        findings.append(
            AuditFinding(
                finding_id="quality-primary-heading",
                family="quality",
                severity="moderate",
                title="Page does not expose exactly one primary heading",
                detail=f"The browser snapshot found {signals.get('h1Count', 0)} h1 elements.",
                target="h1",
                remediation="Use one clear primary heading that describes the main purpose of the page.",
            )
        )
    if not signals.get("hasMainLandmark"):
        findings.append(
            AuditFinding(
                finding_id="quality-main-landmark",
                family="quality",
                severity="moderate",
                title="Main content landmark is missing",
                detail="The browser snapshot could not find a main element or main landmark.",
                target="body",
                remediation="Wrap the primary page content in a <main> element or provide role=\"main\".",
            )
        )
    return findings


def _axe_findings(raw: dict[str, Any]) -> list[AuditFinding]:
    findings: list[AuditFinding] = []
    for violation in raw.get("axe_violations", []):
        severity = violation.get("impact") if violation.get("impact") in SEVERITY_WEIGHTS else "moderate"
        for node in violation.get("nodes", []):
            findings.append(
                AuditFinding(
                    finding_id=f"axe-{violation['id']}",
                    family="accessibility",
                    severity=severity,
                    title=violation["help"],
                    detail=node.get("failure_summary") or violation["description"],
                    target=node.get("target") or "document",
                    tags=violation.get("tags", []),
                    remediation=(
                        f"Review the affected markup and resolve the {violation['id']} rule "
                        "before the next release review."
                    ),
                    reference_url=violation.get("help_url"),
                )
            )
    return findings


def _run_browser_audit(target: TargetKey) -> dict[str, Any]:
    environment = os.environ.copy()
    environment.setdefault("AUDIT_TARGET_BASE_URL", "http://127.0.0.1:5300")
    executable_path = environment.get("PLAYWRIGHT_EXECUTABLE_PATH")
    if not executable_path and Path("/usr/bin/chromium").exists():
        environment["PLAYWRIGHT_EXECUTABLE_PATH"] = "/usr/bin/chromium"
    completed = subprocess.run(
        ["node", "audit.mjs", target],
        cwd=AUDITOR_DIR,
        env=environment,
        check=True,
        capture_output=True,
        text=True,
        timeout=25,
    )
    return json.loads(completed.stdout)


def run_audit(target: TargetKey, runner: Any = _run_browser_audit) -> AuditReport:
    raw = runner(target)
    findings = _axe_findings(raw)
    findings.extend(_quality_findings(raw["browser_signals"], raw["response_status"]))
    counts = Counter(finding.severity for finding in findings)
    accessibility_score = _score(findings, "accessibility")
    quality_score = _score(findings, "quality")
    return AuditReport(
        audit_id=f"audit-{uuid.uuid4().hex[:10]}",
        target=target,
        target_label=TARGET_DETAILS[target][0],
        executed_at=datetime.now(UTC),
        response_status=raw["response_status"],
        summary=AuditSummary(
            total_findings=len(findings),
            critical=counts["critical"],
            serious=counts["serious"],
            moderate=counts["moderate"],
            minor=counts["minor"],
            accessibility_score=accessibility_score,
            quality_score=quality_score,
            overall_score=round((accessibility_score + quality_score) / 2),
        ),
        findings=findings,
        browser_signals=raw["browser_signals"],
        limitations=[
            "This report covers automatically detectable issues on one approved local page state.",
            "Manual keyboard, screen-reader, visual, and inclusive user testing remain required.",
            "The report is not an accessibility conformance, legal, or certification decision.",
        ],
    )

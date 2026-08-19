from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

TargetKey = Literal["demo-needs-work", "demo-reviewed-baseline"]
Severity = Literal["critical", "serious", "moderate", "minor"]


class AuditRequest(BaseModel):
    target: TargetKey


class AuditFinding(BaseModel):
    finding_id: str
    family: Literal["accessibility", "quality"]
    severity: Severity
    title: str
    detail: str
    target: str
    tags: list[str] = Field(default_factory=list)
    remediation: str
    reference_url: str | None = None


class AuditSummary(BaseModel):
    total_findings: int
    critical: int
    serious: int
    moderate: int
    minor: int
    accessibility_score: int
    quality_score: int
    overall_score: int


class AuditReport(BaseModel):
    audit_id: str
    target: TargetKey
    target_label: str
    executed_at: datetime
    response_status: int
    summary: AuditSummary
    findings: list[AuditFinding]
    browser_signals: dict[str, object]
    limitations: list[str]


class TargetOption(BaseModel):
    key: TargetKey
    label: str
    description: str

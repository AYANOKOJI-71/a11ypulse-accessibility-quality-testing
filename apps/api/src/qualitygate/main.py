from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from qualitygate.contracts import AuditReport, AuditRequest, TargetOption
from qualitygate.engine import TARGET_DETAILS, run_audit

app = FastAPI(title="A11yPulse API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5202", "http://localhost:5202"],
    allow_methods=["GET", "POST"],
    allow_headers=["content-type"],
)


@app.get("/health")
def health() -> dict[str, object]:
    return {"status": "ok", "mode": "local-approved-targets-only"}


@app.get("/api/targets", response_model=list[TargetOption])
def targets() -> list[TargetOption]:
    return [
        TargetOption(key=key, label=label, description=description)
        for key, (label, description) in TARGET_DETAILS.items()
    ]


@app.post("/api/audits", response_model=AuditReport)
def audit(request: AuditRequest) -> AuditReport:
    try:
        return run_audit(request.target)
    except Exception as error:  # pragma: no cover - exercised at system boundary
        raise HTTPException(status_code=503, detail="The local browser audit could not complete.") from error

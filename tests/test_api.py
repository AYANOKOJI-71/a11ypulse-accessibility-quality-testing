from __future__ import annotations

from fastapi.testclient import TestClient
from qualitygate.main import app

client = TestClient(app)


def test_health_describes_safe_mode() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["mode"] == "local-approved-targets-only"


def test_targets_expose_only_bundled_local_options() -> None:
    response = client.get("/api/targets")

    assert response.status_code == 200
    assert [entry["key"] for entry in response.json()] == ["demo-needs-work", "demo-reviewed-baseline"]


def test_invalid_target_is_rejected_by_contract() -> None:
    response = client.post("/api/audits", json={"target": "https://example.com"})

    assert response.status_code == 422

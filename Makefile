PYTHON ?= python3
PNPM = npx --yes pnpm@10.6.3

.PHONY: bootstrap check api target web audit compose-up compose-down

bootstrap:
	$(PYTHON) -m venv .venv
	. .venv/bin/activate && pip install -e .[dev]
	cd apps/auditor && $(PNPM) install --frozen-lockfile
	cd apps/web && $(PNPM) install --frozen-lockfile

check:
	. .venv/bin/activate && ruff check . && pytest -q
	cd apps/web && $(PNPM) test && $(PNPM) run build

target:
	PORT=5300 node apps/target/server.mjs

api:
	. .venv/bin/activate && PYTHONPATH=apps/api/src $(PYTHON) -m uvicorn qualitygate.main:app --host 0.0.0.0 --port 4920

web:
	cd apps/web && $(PNPM) run dev

audit:
	AUDIT_TARGET_BASE_URL=http://127.0.0.1:5300 node apps/auditor/audit.mjs demo-needs-work

compose-up:
	docker compose up --build

compose-down:
	docker compose down

FROM node:22-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY pyproject.toml ./
COPY apps/api ./apps/api
COPY apps/auditor/package.json apps/auditor/pnpm-lock.yaml ./apps/auditor/

RUN python3 -m pip install --break-system-packages -e . \
    && npm install -g corepack@latest \
    && corepack enable \
    && corepack pnpm --dir apps/auditor install --frozen-lockfile

COPY . .

ENV PYTHONPATH=/app/apps/api/src \
    AUDIT_TARGET_BASE_URL=http://target:5300 \
    PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 4920
HEALTHCHECK --interval=20s --timeout=5s --start-period=10s --retries=3 CMD node -e "fetch('http://127.0.0.1:4920/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["sh", "-c", "python3 -m uvicorn qualitygate.main:app --host 0.0.0.0 --port ${PORT:-4920}"]

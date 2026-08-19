FROM node:22-bookworm-slim

WORKDIR /app
COPY apps/web/package.json apps/web/pnpm-lock.yaml ./

RUN npm install -g corepack@latest \
    && corepack enable \
    && corepack pnpm install --frozen-lockfile

COPY apps/web ./

EXPOSE 5202
CMD ["sh", "-c", "corepack pnpm run dev -- --host 0.0.0.0"]

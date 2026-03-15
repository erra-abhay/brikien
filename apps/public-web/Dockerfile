FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/validators/package.json ./packages/validators/
COPY apps/public-web/package.json ./apps/public-web/

RUN pnpm install --frozen-lockfile

COPY packages ./packages
COPY apps/public-web ./apps/public-web

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN pnpm --filter public-web build

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/apps/public-web/.next/standalone ./
COPY --from=builder /app/apps/public-web/.next/static ./apps/public-web/.next/static
COPY --from=builder /app/apps/public-web/public ./apps/public-web/public

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/public-web/server.js"]

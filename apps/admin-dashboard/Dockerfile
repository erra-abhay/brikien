FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/validators/package.json ./packages/validators/
COPY apps/admin-dashboard/package.json ./apps/admin-dashboard/

RUN pnpm install --frozen-lockfile

COPY packages ./packages
COPY apps/admin-dashboard ./apps/admin-dashboard

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN pnpm --filter admin-dashboard build

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/apps/admin-dashboard/.next/standalone ./
COPY --from=builder /app/apps/admin-dashboard/.next/static ./apps/admin-dashboard/.next/static
COPY --from=builder /app/apps/admin-dashboard/public ./apps/admin-dashboard/public

EXPOSE 4000
ENV PORT=4000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/admin-dashboard/server.js"]

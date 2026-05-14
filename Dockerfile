# Stage 1: Build Next.js
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat ca-certificates curl build-base python3
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9.4.0 --activate && pnpm --version && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Stage 2: Run the app
FROM node:22-alpine
RUN apk add --no-cache libc6-compat ca-certificates curl
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
RUN corepack enable && corepack prepare pnpm@9.4.0 --activate && pnpm --version && pnpm install --frozen-lockfile --prod
EXPOSE 8080
CMD ["pnpm", "start"]

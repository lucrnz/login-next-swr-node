# Use a smaller base image
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN yarn global add pnpm && pnpm install --frozen-lockfile --production

# Copy the source code and build
FROM base AS builder
WORKDIR /app

COPY . .

RUN pnpm run build

# Create a lightweight production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nodejs

COPY --from=builder /app/dist ./dist

USER nodejs

EXPOSE 3002

CMD ["node", "dist/index.js"]

FROM node:18-alpine
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nodejs && \
  chown -R nodejs:nodejs .

USER nodejs

EXPOSE 3002

CMD ["node", "dist/index.js"]

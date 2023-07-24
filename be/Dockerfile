FROM node:18-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nodejs && \
  chown -R nodejs:nodejs .

USER nodejs

EXPOSE 3002

CMD ["node", "dist/server.js"]

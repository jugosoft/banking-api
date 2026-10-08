FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
# Ставим ТОЛЬКО prod-зависимости (никаких тайпскриптов и линтеров, чтобы образ весил < 200MB)
RUN npm ci --only=production

# Забираем собранный код из этапа builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "node ./node_modules/typeorm/cli.js migration:run -d dist/ormconfig.js && node dist/main.js"]
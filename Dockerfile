# ---- Build stage: install production deps only ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ---- Runtime stage: slim final image ----
FROM node:20-alpine
WORKDIR /app

# Run as non-root for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY package.json server.js ./

USER appuser
EXPOSE 8080
ENV PORT=8080

CMD ["node", "server.js"]

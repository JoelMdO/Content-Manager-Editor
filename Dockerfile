# Stage 1: Build Next.js
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run the app
FROM node:22-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# RUN npm install --production
RUN npm ci --only=production
EXPOSE 8080
CMD ["npm", "start"]

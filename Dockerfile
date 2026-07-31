# ── Stage 1: Build ──────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build --configuration=production

# ── Stage 2: Nginx ──────────────────────────────────
FROM nginx:alpine AS runtime

# Static files
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Config con proxy reverso
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

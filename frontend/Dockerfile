FROM node:alpine as builder
RUN apk add --no-cache python3 build-base
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn set version 3.4.1
RUN yarn install --frozen-lockfile

ARG VITE_SUPABASE_URL="https://api.dokedu.local"
ARG VITE_SUPABASE_ANON="jwt"
ARG VITE_FRONTEND_URL="https://app.dokedu.local"

COPY . .
RUN yarn build

FROM caddy as prod
WORKDIR /app
COPY --from=builder /app/dist /app/
COPY Caddyfile /app/
CMD ["caddy", "run"]
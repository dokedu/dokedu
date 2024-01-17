FROM node:20-alpine as builder
RUN apk add --no-cache python3 build-base
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install -g npm@9.7.1
RUN npm install

ARG VITE_API_URL="https://api.dokedu.org/query"
ARG PH_PROJECT_API_KEY="phc_vuJEeI0467xNeCUJ3Kp514ASOEpWIOAoEsovCukHIg"
ARG PH_INSTANCE_ADDRESS="https://phog.dokedu.org"

COPY . .
RUN npm run build

FROM caddy as prod
WORKDIR /app
COPY --from=builder /app/dist /app/
COPY Caddyfile /app/
CMD ["caddy", "run"]
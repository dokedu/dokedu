# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ARG VITE_API_URL="https://api.dokedu.org/query"

ENV NODE_ENV=production
RUN bun run build


FROM caddy as release
WORKDIR /app
COPY --from=prerelease /usr/src/app/dist /app/
EXPOSE 80/tcp
COPY Caddyfile /app/
CMD ["caddy", "run"]
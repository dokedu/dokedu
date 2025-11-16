# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Create a separate stage for system dependencies
FROM base AS system-deps
RUN apt-get update && apt-get install -y wget unzip curl xz-utils fontconfig && \
    # Install Node.js
    curl -fsSL https://deb.nodesource.com/setup_23.x | bash - && \
    apt-get install -y nodejs && \
    # Install Typst
    curl -LO https://github.com/typst/typst/releases/latest/download/typst-x86_64-unknown-linux-musl.tar.xz && \
    tar -xf typst-x86_64-unknown-linux-musl.tar.xz && \
    mv typst-x86_64-unknown-linux-musl/typst /usr/local/bin/ && \
    rm -rf typst-x86_64-unknown-linux-musl* && \
    # Cleanup
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a separate stage for font installation
FROM system-deps AS fonts

# Install custom fonts
RUN wget "https://github.com/rsms/inter/releases/download/v4.1/Inter-4.1.zip" -O inter.zip
RUN unzip -d inter/ inter.zip
RUN mv inter/Inter.ttc /usr/share/fonts

# RUN wget 'https://storage.dokedu.org/public/klsunEvScZuDDQRWjPmNfN78XylqXiKE.ttf'
# RUN mv klsunEvScZuDDQRWjPmNfN78XylqXiKE.ttf /usr/share/fonts

# refresh the font cache
RUN fc-cache -fv

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM fonts AS install
RUN mkdir -p /temp/app
COPY package.json bun.lock /temp/app/
RUN cd /temp/app && bun install

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM fonts AS prerelease
COPY --from=install /temp/app/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
# Copy Typst from system-deps stage
COPY --from=system-deps /usr/local/bin/typst /usr/local/bin/typst
# Copy fonts from fonts stage
COPY --from=fonts /usr/share/fonts /usr/share/fonts
COPY --from=install /temp/app/node_modules node_modules
COPY --from=prerelease /usr/src/app/.output .output
COPY --from=prerelease /usr/src/app/package.json .

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "--bun", ".output/server/index.mjs" ] 

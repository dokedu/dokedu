# syntax = docker/dockerfile:1.2

FROM alpine as base
RUN apk add --no-cache chromium
RUN apk add --no-cache ca-certificates postgresql-client curl tini bash gnupg

#RUN wget 'https://fonts.google.com/download?family=Inter|Mali' -O googlefonts.zip
#RUN unzip googlefonts.zip -d /usr/share/fonts/googlefonts/
#RUN rm -f googlefonts.zip

#RUN wget 'https://storage.dokedu.org/public/klsunEvScZuDDQRWjPmNfN78XylqXiKE.ttf' -O mgdr.tff
#RUN mv mgdr.tff /usr/share/fonts/googlefonts/

# refresh the font cache
RUN fc-cache -fv

FROM golang:alpine as builder
ENV GO111MODULE=on

RUN mkdir -p /app/
WORKDIR /app
ADD go.mod .
ADD go.sum .
RUN go mod download

ADD . .
RUN --mount=type=cache,target=/root/.cache/go-build \
    go build -o app internal/cmd/main.go

FROM base as prod
ENTRYPOINT ["/sbin/tini", "--"]
ENV GO_ENV=production
EXPOSE 1323

WORKDIR /app
COPY --from=builder /app/app ./

CMD /app/app migrate:up && exec /app/app app:start
FROM golang:alpine as builder
ENV GO111MODULE=on

RUN mkdir -p /api/
WORKDIR /api
ADD go.mod .
ADD go.sum .
RUN go mod download
ADD internal/cache internal/cache
RUN go build internal/cache/cache.go

ADD . .
RUN go build -o api
RUN go build -o bun cmd/bun/main.go

FROM node:alpine as nodeBuilder

WORKDIR /api
ADD docxExport/package.json docxExport/yarn.lock ./
RUN yarn install --frozen-lockfile
ADD docxExport/* ./
RUN npx tsc

FROM alpine as prod
RUN apk add --no-cache ca-certificates postgresql-client curl tini bash gnupg nodejs yarn
ENTRYPOINT ["/sbin/tini", "--"]

ENV GO_ENV=production
EXPOSE 1323

WORKDIR /api
COPY --from=builder /api/api /api/bun ./
RUN touch .env

CMD /api/bun db init && /api/bun db migrate && exec /api/api

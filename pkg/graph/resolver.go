package graph

//go:generate go run github.com/99designs/gqlgen generate

import (
	"github.com/minio/minio-go/v7"
	"github.com/uptrace/bun"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	DB          *bun.DB
	MinioClient *minio.Client
}

package config

import (
	"github.com/minio/minio-go/v7"
	"github.com/uptrace/bun"
)

type ReportGenerationConfig struct {
	DB    *bun.DB
	MinIO *minio.Client
}

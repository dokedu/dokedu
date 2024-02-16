package config

import (
	"github.com/dokedu/dokedu/backend/internal/database"
	"github.com/minio/minio-go/v7"
)

type ReportGenerationConfig struct {
	DB    *database.DB
	MinIO *minio.Client
}

package config

import (
	"github.com/minio/minio-go/v7"

	"github.com/dokedu/dokedu/backend/internal/database"
)

type ReportGenerationConfig struct {
	DB    *database.DB
	MinIO *minio.Client
}

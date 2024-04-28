package services

import (
	"github.com/dokedu/dokedu/backend/pkg/services/database"
	"github.com/dokedu/dokedu/backend/pkg/services/mail"
	"github.com/dokedu/dokedu/backend/pkg/services/minio"

	minioMinio "github.com/minio/minio-go/v7"
)

type Config struct {
	Database database.Config
	Minio    minio.Config
	Mail     mail.Config
}

type Services struct {
	DB    *database.DB
	Minio *minioMinio.Client
	Mail  mail.Mailer
}

func New(cfg Config) (*Services, error) {
	return &Services{
		DB:    database.New(cfg.Database),
		Minio: minio.New(cfg.Minio),
		Mail:  mail.New(cfg.Mail),
	}, nil
}

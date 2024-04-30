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
	var err error
	svc := &Services{
		DB:   database.New(cfg.Database),
		Mail: mail.New(cfg.Mail),
	}
	svc.Minio, err = minio.New(cfg.Minio)
	if err != nil {
		return nil, err
	}

	return svc, nil
}

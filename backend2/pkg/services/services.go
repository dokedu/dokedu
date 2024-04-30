package services

import (
	"github.com/dokedu/dokedu/backend/pkg/services/database"
	"github.com/dokedu/dokedu/backend/pkg/services/mail"
	"github.com/dokedu/dokedu/backend/pkg/services/meili"
	"github.com/dokedu/dokedu/backend/pkg/services/minio"

	minioMinio "github.com/minio/minio-go/v7"
)

type Config struct {
	Database database.Config
	Minio    minio.Config
	Meili    meili.Config
	Mail     mail.Config
}

type Services struct {
	DB    *database.DB
	Minio *minioMinio.Client
	Meili *meili.Client
	Mail  mail.Mailer
}

func New(cfg Config) (*Services, error) {
	var err error
	db := database.New(cfg.Database)
	svc := &Services{
		DB:    db,
		Meili: meili.New(cfg.Meili, db),
		Mail:  mail.New(cfg.Mail),
	}
	svc.Minio, err = minio.New(cfg.Minio)
	if err != nil {
		return nil, err
	}

	return svc, nil
}

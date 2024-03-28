package services

import (
	"github.com/dokedu/dokedu/backend/pkg/services/database"
	"github.com/dokedu/dokedu/backend/pkg/services/mail"
)

type Config struct {
	Database database.Config
	Mail     mail.Config
}

type Services struct {
	DB   *database.DB
	Mail mail.Mailer
}

func New(cfg Config) (*Services, error) {
	return &Services{
		DB:   database.New(cfg.Database),
		Mail: mail.New(cfg.Mail),
	}, nil
}

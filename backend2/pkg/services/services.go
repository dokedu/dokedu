package services

import "github.com/dokedu/dokedu/backend/pkg/services/database"

type Config struct {
	Database database.Config
}

type Services struct {
	DB *database.DB
}

func New(cfg Config) (*Services, error) {
	db := database.New(cfg.Database)

	return &Services{
		DB: db,
	}, nil
}

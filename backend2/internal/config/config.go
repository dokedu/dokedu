package config

import (
	"github.com/caarlos0/env/v10"

	"github.com/dokedu/dokedu/backend/pkg/services"
)

type Config struct {
	Services services.Config
}

func Load() (Config, error) {
	cfg := Config{}
	err := env.Parse(&cfg)
	return cfg, err
}

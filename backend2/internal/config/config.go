package config

import (
	"github.com/caarlos0/env/v10"

	"github.com/dokedu/dokedu/backend/pkg/services"
	"github.com/dokedu/dokedu/backend/pkg/tracing"
)

type Config struct {
	Services services.Config
	Tracing  tracing.Config
}

func Load() (Config, error) {
	cfg := Config{}
	err := env.Parse(&cfg)
	return cfg, err
}

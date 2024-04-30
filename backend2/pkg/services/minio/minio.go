package minio

import (
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type Config struct {
	Host      string `env:"MINIO_HOST"`
	Port      string `env:"MINIO_PORT"`
	AccessKey string `env:"MINIO_ACCESS_KEY_ID"`
	SecretKey string `env:"MINIO_SECRET_ACCESS_KEY"`
	SSL       bool   `env:"MINIO_SSL"`
}

func New(cfg Config) (*minio.Client, error) {
	endpoint := cfg.Host + ":" + cfg.Port

	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.AccessKey, cfg.SecretKey, ""),
		Secure: cfg.SSL,
	})
	if err != nil {
		return nil, err
	}

	return minioClient, nil
}

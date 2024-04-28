package minio

import (
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type Config struct {
	Host      string
	Port      string
	AccessKey string
	SecretKey string
	SSL       bool
}

func New(cfg Config) *minio.Client {
	endpoint := cfg.Host + ":" + cfg.Port

	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.AccessKey, cfg.SecretKey, ""),
		Secure: cfg.SSL,
	})

	if err != nil {
		panic(err)
	}

	return minioClient
}

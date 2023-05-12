package config

import "example/pkg/db"

const DatabaseConnection = "user=postgres password=postgres dbname=postgres sslmode=disable"

type Config struct {
	DbConfig db.Config
}

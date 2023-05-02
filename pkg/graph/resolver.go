package graph

//go:generate go run github.com/99designs/gqlgen generate

import (
	"example/pkg/db"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	DB *db.Queries
}

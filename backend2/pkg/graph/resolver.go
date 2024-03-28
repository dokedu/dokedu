package graph

import (
	"github.com/dokedu/dokedu/backend/pkg/services"
	"github.com/dokedu/dokedu/backend/pkg/services/database"
)

//go:generate go run github.com/99designs/gqlgen

type Resolver struct {
	DB       *database.DB
	Services *services.Services
}

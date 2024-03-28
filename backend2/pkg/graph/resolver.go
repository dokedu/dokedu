package graph

import (
	"errors"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/dokedu/dokedu/backend/pkg/msg"
	"github.com/dokedu/dokedu/backend/pkg/services"
	"github.com/dokedu/dokedu/backend/pkg/services/database"
)

//go:generate go run github.com/99designs/gqlgen

type Resolver struct {
	DB       *database.DB
	Services *services.Services
}

func OptionalTimestamp(t *time.Time) pgtype.Timestamptz {
	if t == nil {
		return pgtype.Timestamptz{Valid: false}
	}
	return pgtype.Timestamptz{Time: *t, Valid: true}
}

func OptionalDate(t *time.Time) pgtype.Date {
	if t == nil {
		return pgtype.Date{Valid: false}
	}
	return pgtype.Date{Time: *t, Valid: true}
}

func OptionalString(s *string) pgtype.Text {
	if s == nil {
		return pgtype.Text{Valid: false}
	}
	return pgtype.Text{String: *s, Valid: true}
}

var Validator = validator.New(validator.WithRequiredStructEnabled())

func (r *Resolver) Validate(input interface{}) error {
	err := Validator.Struct(input)
	if err != nil {
		return errors.Join(msg.ErrInvalidInput, err)
	}

	return nil
}

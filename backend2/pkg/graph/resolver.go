package graph

import (
	"errors"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/dokedu/dokedu/backend/pkg/msg"
	"github.com/dokedu/dokedu/backend/pkg/reportGeneration"
	"github.com/dokedu/dokedu/backend/pkg/services"
	"github.com/dokedu/dokedu/backend/pkg/services/database"
)

//go:generate go run github.com/99designs/gqlgen

type Resolver struct {
	DB               *database.DB
	Services         *services.Services
	ReportGeneration *reportGeneration.Service
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

func OptionalTimeFromString(t *string) time.Time {
	if t == nil {
		return time.Time{}
	}

	parsedTime, err := time.Parse("2006-01-02 15:04:05", *t)
	if err != nil {
		return time.Time{}
	}

	return parsedTime
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

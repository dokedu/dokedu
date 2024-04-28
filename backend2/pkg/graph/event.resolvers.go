package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.45

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/dokedu/dokedu/backend/pkg/helper"
	"github.com/dokedu/dokedu/backend/pkg/services/database"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/samber/lo"
	"time"

	"github.com/dokedu/dokedu/backend/pkg/graph/generated"
	"github.com/dokedu/dokedu/backend/pkg/graph/model"
	"github.com/dokedu/dokedu/backend/pkg/middleware"
	"github.com/dokedu/dokedu/backend/pkg/msg"
	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
	"github.com/jackc/pgx/v5"
)

// Image is the resolver for the image field.
func (r *eventResolver) Image(ctx context.Context, obj *db.Event) (*db.File, error) {
	user, ok := middleware.GetUser(ctx)
	if !ok {
		return nil, msg.ErrUnauthorized
	}

	if !obj.ImageFileID.Valid {
		return nil, nil
	}

	file, err := r.DB.FileByID(ctx, db.FileByIDParams{
		ID:             obj.ImageFileID.String,
		OrganisationID: user.OrganisationID,
	})
	if errors.Is(err, sql.ErrNoRows) {
		return nil, msg.ErrNotFound
	}
	return &file, err
}

// DeletedAt is the resolver for the deletedAt field.
func (r *eventResolver) DeletedAt(ctx context.Context, obj *db.Event) (*time.Time, error) {
	if !obj.DeletedAt.Time.IsZero() {
		return &obj.DeletedAt.Time, nil
	}

	return nil, nil
}

// Competences is the resolver for the competences field.
func (r *eventResolver) Competences(ctx context.Context, obj *db.Event) ([]db.Competence, error) {
	user, ok := middleware.GetUser(ctx)
	if !ok {
		return nil, msg.ErrUnauthorized
	}

	competences, err := r.DB.CompetencesFindByEventID(ctx, db.CompetencesFindByEventIDParams{
		EventID:        obj.ID,
		OrganisationID: user.OrganisationID,
	})
	return competences, err
}

// CreateEvent is the resolver for the createEvent field.
func (r *mutationResolver) CreateEvent(ctx context.Context, input model.CreateEventInput) (*db.Event, error) {
	user, ok := middleware.GetUser(ctx)
	if !ok {
		return nil, msg.ErrUnauthorized
	}

	eventParams := db.EventCreateParams{
		Title:          input.Title,
		OrganisationID: user.OrganisationID,
	}

	if input.Body != nil {
		eventParams.Body = *input.Body
	}

	if input.StartsAt != nil {
		startsAt, err := time.Parse(time.RFC1123, *input.StartsAt)
		if err != nil {
			return nil, err
		}
		eventParams.StartsAt = startsAt
	}

	if input.EndsAt != nil {
		endsAt, err := time.Parse(time.RFC1123, *input.EndsAt)
		if err != nil {
			return nil, err
		}
		eventParams.EndsAt = endsAt
	}

	event, err := r.DB.EventCreate(ctx, eventParams)
	if err != nil {
		return nil, err
	}

	return &event, nil
}

// UpdateEvent is the resolver for the updateEvent field.
func (r *mutationResolver) UpdateEvent(ctx context.Context, input model.UpdateEventInput) (*db.Event, error) {
	user, ok := middleware.GetUser(ctx)
	if !ok {
		return nil, msg.ErrUnauthorized
	}

	if !user.HasPermissionTeacher() {
		return nil, msg.ErrUnauthorized
	}

	updateParams := db.EventUpdateParams{
		ID:             input.ID,
		OrganisationID: user.OrganisationID,
	}

	if input.Title != nil {
		updateParams.Title = OptionalString(input.Title)
	}

	if input.Image != nil {
		// TODO: upload image
	}

	if input.Body != nil {
		updateParams.Body = OptionalString(input.Body)
	}

	if input.StartsAt != nil {
		startsAt, err := time.Parse(time.RFC1123, *input.StartsAt)
		if err != nil {
			return nil, err
		}
		updateParams.StartsAt = OptionalTimestamp(lo.ToPtr(startsAt))
	}

	if input.EndsAt != nil {
		endsAt, err := time.Parse(time.RFC1123, *input.EndsAt)
		if err != nil {
			return nil, err
		}
		updateParams.EndsAt = OptionalTimestamp(lo.ToPtr(endsAt))
	}

	event, err := r.DB.EventUpdate(ctx, updateParams)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, msg.ErrNotFound
	}
	return &event, err
}

// ToggleEventCompetence is the resolver for the toggleEventCompetence field.
func (r *mutationResolver) ToggleEventCompetence(ctx context.Context, input model.AddEventCompetenceInput) (*db.Event, error) {
	user, ok := middleware.GetUser(ctx)
	if !ok {
		return nil, msg.ErrUnauthorized
	}

	toggleEventCompetenceParams := db.EventCompetenceToggleParams{
		EventID:        input.EventID,
		CompetenceID:   input.CompetenceID,
		OrganisationID: user.OrganisationID,
	}

	_, err := r.DB.EventCompetenceToggle(ctx, toggleEventCompetenceParams)
	if err != nil {
		return nil, err
	}

	event, err := r.DB.EventFindById(ctx, db.EventFindByIdParams{
		ID:             input.EventID,
		OrganisationID: user.OrganisationID,
	})
	if err != nil {
		return nil, err
	}

	return &event, nil
}

// ArchiveEvent is the resolver for the archiveEvent field.
func (r *mutationResolver) ArchiveEvent(ctx context.Context, id string) (*db.Event, error) {
	user, ok := middleware.GetUser(ctx)
	if !ok {
		return nil, msg.ErrUnauthorized
	}

	if !user.HasPermissionTeacher() {
		return nil, msg.ErrUnauthorized
	}

	event, err := r.DB.EventSoftDelete(ctx, db.EventSoftDeleteParams{
		ID:             id,
		OrganisationID: user.OrganisationID,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, msg.ErrNotFound
	}
	return &event, err
}

// Event is the resolver for the event field.
func (r *queryResolver) Event(ctx context.Context, id string) (*db.Event, error) {
	user, ok := middleware.GetUser(ctx)
	if !ok {
		return nil, msg.ErrUnauthorized
	}

	event, err := r.DB.EventFindById(ctx, db.EventFindByIdParams{
		ID:             id,
		OrganisationID: user.OrganisationID,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, msg.ErrNotFound
	}
	return &event, err
}

// Events is the resolver for the events field.
func (r *queryResolver) Events(ctx context.Context, limit *int, offset *int, filter *model.EventFilterInput, order *model.EventOrderBy, search *string) (*model.EventConnection, error) {
	user, ok := middleware.GetUser(ctx)
	if !ok {
		return nil, msg.ErrUnauthorized
	}

	l, o := helper.PaginationInput(limit, offset)

	query := r.DB.NewQueryBuilder().Select("*").From("events").Where("organisation_id = ?", user.OrganisationID)
	query = query.Limit(l + 1).Offset(o)

	if filter != nil {
		if filter.From != nil {
			query = query.Where("starts_at >= ?", filter.From)
		}
		if filter.To != nil {
			query = query.Where("ends_at <= ?", filter.To)
		}
		if filter.Deleted != nil {
			query = query.Where("deleted_at IS NULL")
		}
	}

	if search != nil && len(*search) > 0 {
		query = query.Where("title ILIKE ?", fmt.Sprintf("%%%s%%", *search))
	}

	if order != nil {
		switch *order {
		case model.EventOrderByEndsAtAsc:
			query = query.OrderBy("ends_at")
		case model.EventOrderByEndsAtDesc:
			query = query.OrderBy("ends_at DESC")
		case model.EventOrderByStartsAtAsc:
			query = query.OrderBy("starts_at")
		case model.EventOrderByStartsAtDesc:
			query = query.OrderBy("starts_at DESC")
		}
	} else {
		query = query.OrderBy("created_at DESC")
	}

	events, err := database.ScanSelectMany[db.Event](r.DB, ctx, query)
	if err != nil {
		return nil, err
	}

	edges, pageInfo := helper.PaginationOutput(l, o, events)
	return &model.EventConnection{
		Edges:    lo.ToSlicePtr(edges),
		PageInfo: pageInfo,
	}, nil
}

// ExportEvents is the resolver for the exportEvents field.
func (r *queryResolver) ExportEvents(ctx context.Context, input model.ExportEventsInput) ([]*model.ExportEventsPayload, error) {
	user, ok := middleware.GetUser(ctx)
	if !ok {
		return nil, msg.ErrUnauthorized
	}

	fromDate, err := time.Parse(time.RFC1123, input.From)
	if err != nil {
		return nil, err
	}
	toDate, err := time.Parse(time.RFC1123, input.To)
	if err != nil {
		return nil, err
	}

	params := db.EventExportParams{
		OrganisationID: user.OrganisationID,
		From:           pgtype.Date{Time: fromDate, Valid: true},
		To:             pgtype.Date{Time: toDate, Valid: true},
		Deleted:        input.Deleted,
	}

	eventExport, err := r.DB.EventExport(ctx, params)
	if err != nil {
		return nil, err
	}

	exportEventsPayload := make([]*model.ExportEventsPayload, len(eventExport))
	for _, event := range eventExport {
		eventCasted, ok := event.(model.ExportEventsPayload)
		if !ok {
			return nil, errors.New("failed to cast event to ExportEventsPayload")
		}
		exportEventsPayload = append(exportEventsPayload, &eventCasted)
	}

	return exportEventsPayload, nil
}

// Event returns generated.EventResolver implementation.
func (r *Resolver) Event() generated.EventResolver { return &eventResolver{r} }

type eventResolver struct{ *Resolver }

package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.40

import (
	"context"
	"time"

	"github.com/dokedu/dokedu/backend/internal/database/db"
	"github.com/dokedu/dokedu/backend/internal/graph/model"
	"github.com/dokedu/dokedu/backend/internal/helper"
	"github.com/dokedu/dokedu/backend/internal/middleware"
)

// Image is the resolver for the image field.
func (r *eventResolver) Image(ctx context.Context, obj *db.Event) (*db.File, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var file db.File
	err = r.DB.NewSelect().Model(&file).Where("id = ?", obj.ImageFileID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &file, nil
}

// DeletedAt is the resolver for the deletedAt field.
func (r *eventResolver) DeletedAt(ctx context.Context, obj *db.Event) (*time.Time, error) {
	if obj.DeletedAt.IsZero() {
		return nil, nil
	}

	return &obj.DeletedAt.Time, nil
}

// Competences is the resolver for the competences field.
func (r *eventResolver) Competences(ctx context.Context, obj *db.Event) ([]*db.Competence, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var competences []*db.Competence
	err = r.DB.NewSelect().
		Model(&competences).
		Join("JOIN event_competences ON event_competences.competence_id = competence.id and event_competences.deleted_at is null").
		Where("event_competences.event_id = ?", obj.ID).
		Where("competence.organisation_id = ?", currentUser.OrganisationID).
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	return competences, nil
}

// CreateEvent is the resolver for the createEvent field.
func (r *mutationResolver) CreateEvent(ctx context.Context, input model.CreateEventInput) (*db.Event, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var event db.Event
	event.Title = input.Title

	if input.Body != nil && len(*input.Body) > 0 {
		event.Body = *input.Body
	}

	startsAt, err := time.Parse(time.RFC1123, *input.StartsAt)
	if err != nil {
		return nil, err
	}
	event.StartsAt = startsAt

	endsAt, err := time.Parse(time.RFC1123, *input.EndsAt)
	if err != nil {
		return nil, err
	}
	event.EndsAt = endsAt

	event.OrganisationID = currentUser.OrganisationID

	if event.Recurrence == nil {
		event.Recurrence = []string{}
	}

	err = r.DB.NewInsert().Model(&event).Returning("*").Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &event, nil
}

// UpdateEvent is the resolver for the updateEvent field.
func (r *mutationResolver) UpdateEvent(ctx context.Context, input model.UpdateEventInput) (*db.Event, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var event db.Event

	query := r.DB.NewUpdate().
		Model(&event).
		Where("organisation_id = ?", currentUser.OrganisationID).
		Returning("*").
		Where("id = ?", input.ID)

	if input.Title != nil && len(*input.Title) > 0 {
		event.Title = *input.Title
		query.Set("title = ?", event.Title)
	}

	if input.Body != nil && len(*input.Body) > 0 {
		event.Body = *input.Body
		query.Set("body = ?", event.Body)
	}

	if input.StartsAt != nil {
		startsAt, err := time.Parse(time.RFC1123, *input.StartsAt)
		if err != nil {
			return nil, err
		}
		event.StartsAt = startsAt
		query.Set("starts_at = ?", event.StartsAt)
	}

	if input.EndsAt != nil {
		endsAt, err := time.Parse(time.RFC1123, *input.EndsAt)
		if err != nil {
			return nil, err
		}
		event.EndsAt = endsAt
		query.Set("ends_at = ?", event.EndsAt)
	}

	if event.Recurrence == nil {
		event.Recurrence = []string{}
		//query.Set("recurrence = ?", event.Recurrence)
	}

	err = query.Scan(ctx)

	if err != nil {
		return nil, err
	}

	return &event, nil
}

// ToggleEventCompetence is the resolver for the toggleEventCompetence field.
func (r *mutationResolver) ToggleEventCompetence(ctx context.Context, input model.AddEventCompetenceInput) (*db.Event, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var eventCompetence db.EventCompetence
	eventCompetence.EventID = input.EventID
	eventCompetence.CompetenceID = input.CompetenceID
	eventCompetence.OrganisationID = currentUser.OrganisationID

	err = r.DB.NewInsert().
		Model(&eventCompetence).
		Where("\"event_competence\".organisation_id = ?", currentUser.OrganisationID).
		On("CONFLICT (event_id, competence_id) DO UPDATE").
		Set("deleted_at = (SELECT CASE WHEN event_competence.deleted_at IS NULL THEN NOW() ELSE NULL END)").
		Returning("*").
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	var event db.Event
	err = r.DB.NewSelect().
		Model(&event).
		Where("id = ?", input.EventID).
		Where("organisation_id = ?", currentUser.OrganisationID).
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &event, nil
}

// ArchiveEvent is the resolver for the archiveEvent field.
func (r *mutationResolver) ArchiveEvent(ctx context.Context, id string) (*db.Event, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var event db.Event
	// mark event.deleted_at as now
	err = r.DB.NewUpdate().
		Model(&event).
		Set("deleted_at = ?", time.Now()).
		Where("id = ?", id).
		Where("organisation_id = ?", currentUser.OrganisationID).
		Returning("*").
		WhereAllWithDeleted().
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &event, nil
}

// Event is the resolver for the event field.
func (r *queryResolver) Event(ctx context.Context, id string) (*db.Event, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var event db.Event
	err = r.DB.NewSelect().Model(&event).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &event, nil
}

// Events is the resolver for the events field.
func (r *queryResolver) Events(ctx context.Context, limit *int, offset *int, filter *model.EventFilterInput, order *model.EventOrderBy, search *string) (*model.EventConnection, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	pageLimit, pageOffset := helper.SetPageLimits(limit, offset)

	var events []*db.Event

	query := r.DB.NewSelect().Model(&events).Where("organisation_id = ?", currentUser.OrganisationID).Limit(pageLimit).Offset(pageOffset)

	if search != nil && len(*search) > 0 {
		// TODO: improve search perhaps using meilisearch
		query.Where("title ILIKE ?", "%"+*search+"%")
	} else {
		if order == nil {
			query.Order("created_at")
		}
	}

	// Filters
	if filter != nil {
		if filter.From != nil {
			query.Where("starts_at >= ?", filter.From)
		}
		if filter.To != nil {
			query.Where("ends_at <= ?", filter.To)
		}
	}

	// Order
	if order != nil {
		if *order == model.EventOrderByEndsAtAsc {
			query.Order("ends_at")
		}
		if *order == model.EventOrderByEndsAtDesc {
			query.Order("ends_at DESC")
		}
		if *order == model.EventOrderByStartsAtAsc {
			query.Order("starts_at")
		}
		if *order == model.EventOrderByStartsAtDesc {
			query.Order("starts_at DESC")
		}
	}

	count, err := query.ScanAndCount(ctx)
	if err != nil {
		return nil, err
	}

	// Page info
	page, err := helper.CreatePageInfo(pageLimit, pageOffset, count)
	if err != nil {
		return nil, err
	}

	return &model.EventConnection{
		Edges:      events,
		PageInfo:   page,
		TotalCount: count,
	}, nil
}

// ExportEvents is the resolver for the exportEvents field.
func (r *queryResolver) ExportEvents(ctx context.Context, input model.ExportEventsInput) ([]*model.ExportEventsPayload, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	orgId := currentUser.OrganisationID

	from := input.From
	to := input.To
	deleted := input.Deleted

	var events []*model.ExportEventsPayload
	err = r.DB.NewRaw("SELECT * FROM export_events(?, ?, ?, ?)", orgId, from, to, deleted).Scan(ctx, &events)
	if err != nil {
		return nil, err
	}

	return events, nil
}

// Event returns EventResolver implementation.
func (r *Resolver) Event() EventResolver { return &eventResolver{r} }

type eventResolver struct{ *Resolver }

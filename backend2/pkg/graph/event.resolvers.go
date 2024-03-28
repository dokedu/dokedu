package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.45

import (
	"context"
	"fmt"
	"time"

	"github.com/dokedu/dokedu/backend/pkg/graph/generated"
	"github.com/dokedu/dokedu/backend/pkg/graph/model"
	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

// Image is the resolver for the image field.
func (r *eventResolver) Image(ctx context.Context, obj *db.Event) (*db.File, error) {
	panic(fmt.Errorf("not implemented: Image - image"))
}

// DeletedAt is the resolver for the deletedAt field.
func (r *eventResolver) DeletedAt(ctx context.Context, obj *db.Event) (*time.Time, error) {
	panic(fmt.Errorf("not implemented: DeletedAt - deletedAt"))
}

// Competences is the resolver for the competences field.
func (r *eventResolver) Competences(ctx context.Context, obj *db.Event) ([]db.Competence, error) {
	panic(fmt.Errorf("not implemented: Competences - competences"))
}

// CreateEvent is the resolver for the createEvent field.
func (r *mutationResolver) CreateEvent(ctx context.Context, input model.CreateEventInput) (*db.Event, error) {
	panic(fmt.Errorf("not implemented: CreateEvent - createEvent"))
}

// UpdateEvent is the resolver for the updateEvent field.
func (r *mutationResolver) UpdateEvent(ctx context.Context, input model.UpdateEventInput) (*db.Event, error) {
	panic(fmt.Errorf("not implemented: UpdateEvent - updateEvent"))
}

// ToggleEventCompetence is the resolver for the toggleEventCompetence field.
func (r *mutationResolver) ToggleEventCompetence(ctx context.Context, input model.AddEventCompetenceInput) (*db.Event, error) {
	panic(fmt.Errorf("not implemented: ToggleEventCompetence - toggleEventCompetence"))
}

// ArchiveEvent is the resolver for the archiveEvent field.
func (r *mutationResolver) ArchiveEvent(ctx context.Context, id string) (*db.Event, error) {
	panic(fmt.Errorf("not implemented: ArchiveEvent - archiveEvent"))
}

// Event is the resolver for the event field.
func (r *queryResolver) Event(ctx context.Context, id string) (*db.Event, error) {
	panic(fmt.Errorf("not implemented: Event - event"))
}

// Events is the resolver for the events field.
func (r *queryResolver) Events(ctx context.Context, limit *int, offset *int, filter *model.EventFilterInput, order *model.EventOrderBy, search *string) (*model.EventConnection, error) {
	panic(fmt.Errorf("not implemented: Events - events"))
}

// ExportEvents is the resolver for the exportEvents field.
func (r *queryResolver) ExportEvents(ctx context.Context, input model.ExportEventsInput) ([]*model.ExportEventsPayload, error) {
	panic(fmt.Errorf("not implemented: ExportEvents - exportEvents"))
}

// Event returns generated.EventResolver implementation.
func (r *Resolver) Event() generated.EventResolver { return &eventResolver{r} }

type eventResolver struct{ *Resolver }

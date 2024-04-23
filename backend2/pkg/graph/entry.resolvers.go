package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.45

import (
	"context"
	"fmt"
	"time"

	"github.com/99designs/gqlgen/graphql"

	"github.com/dokedu/dokedu/backend/pkg/graph/generated"
	"github.com/dokedu/dokedu/backend/pkg/graph/model"
	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

// Date is the resolver for the date field.
func (r *entryResolver) Date(ctx context.Context, obj *db.Entry) (string, error) {
	if obj.Date.Valid {
		return obj.Date.Time.Format("02.01.2006"), nil
	}
	return "", nil
}

// DeletedAt is the resolver for the deletedAt field.
func (r *entryResolver) DeletedAt(ctx context.Context, obj *db.Entry) (*time.Time, error) {
	if obj.DeletedAt.Valid {
		return &obj.DeletedAt.Time, nil
	}
	return nil, nil
}

// User is the resolver for the user field.
func (r *entryResolver) User(ctx context.Context, obj *db.Entry) (*db.User, error) {
	user, err := r.DB.Loader(ctx).Users().Load(ctx, obj.UserID)()
	return &user, err
}

// Users is the resolver for the users field.
func (r *entryResolver) Users(ctx context.Context, obj *db.Entry) ([]db.User, error) {
	return r.DB.UsersFindByEntryUserEntryID(ctx, db.UsersFindByEntryUserEntryIDParams{
		EntryID:        obj.ID,
		OrganisationID: obj.OrganisationID,
	})
}

// Events is the resolver for the events field.
func (r *entryResolver) Events(ctx context.Context, obj *db.Entry) ([]db.Event, error) {
	return r.DB.EventsFindByEntryEventEntryID(ctx, db.EventsFindByEntryEventEntryIDParams{
		EntryID:        obj.ID,
		OrganisationID: obj.OrganisationID,
	})
}

// Files is the resolver for the files field.
func (r *entryResolver) Files(ctx context.Context, obj *db.Entry) ([]db.File, error) {
	return r.DB.FilesFindByEntryFileEntryID(ctx, db.FilesFindByEntryFileEntryIDParams{
		EntryID:        obj.ID,
		OrganisationID: obj.OrganisationID,
	})
}

// Tags is the resolver for the tags field.
func (r *entryResolver) Tags(ctx context.Context, obj *db.Entry) ([]db.Tag, error) {
	return r.DB.TagsFindByEntryTagEntryID(ctx, db.TagsFindByEntryTagEntryIDParams{
		EntryID:        obj.ID,
		OrganisationID: obj.OrganisationID,
	})
}

// UserCompetences is the resolver for the userCompetences field.
func (r *entryResolver) UserCompetences(ctx context.Context, obj *db.Entry) ([]db.UserCompetence, error) {
	panic(fmt.Errorf("not implemented: UserCompetences - userCompetences"))
}

// Subjects is the resolver for the subjects field.
func (r *entryResolver) Subjects(ctx context.Context, obj *db.Entry) ([]db.Competence, error) {
	panic(fmt.Errorf("not implemented: Subjects - subjects"))
}

// CreateEntry is the resolver for the createEntry field.
func (r *mutationResolver) CreateEntry(ctx context.Context) (*db.Entry, error) {
	panic(fmt.Errorf("not implemented: CreateEntry - createEntry"))
}

// UpdateEntry is the resolver for the updateEntry field.
func (r *mutationResolver) UpdateEntry(ctx context.Context, input model.UpdateEntryInput) (*db.Entry, error) {
	panic(fmt.Errorf("not implemented: UpdateEntry - updateEntry"))
}

// ArchiveEntry is the resolver for the archiveEntry field.
func (r *mutationResolver) ArchiveEntry(ctx context.Context, id string) (*db.Entry, error) {
	panic(fmt.Errorf("not implemented: ArchiveEntry - archiveEntry"))
}

// CreateEntryTag is the resolver for the createEntryTag field.
func (r *mutationResolver) CreateEntryTag(ctx context.Context, input model.CreateEntryTagInput) (*db.Entry, error) {
	panic(fmt.Errorf("not implemented: CreateEntryTag - createEntryTag"))
}

// CreateEntryFile is the resolver for the createEntryFile field.
func (r *mutationResolver) CreateEntryFile(ctx context.Context, input model.CreateEntryFileInput) (*db.Entry, error) {
	panic(fmt.Errorf("not implemented: CreateEntryFile - createEntryFile"))
}

// CreateEntryUser is the resolver for the createEntryUser field.
func (r *mutationResolver) CreateEntryUser(ctx context.Context, input model.CreateEntryUserInput) (*db.Entry, error) {
	panic(fmt.Errorf("not implemented: CreateEntryUser - createEntryUser"))
}

// CreateEntryEvent is the resolver for the createEntryEvent field.
func (r *mutationResolver) CreateEntryEvent(ctx context.Context, input model.CreateEntryEventInput) (*db.Entry, error) {
	panic(fmt.Errorf("not implemented: CreateEntryEvent - createEntryEvent"))
}

// CreateEntryCompetence is the resolver for the createEntryCompetence field.
func (r *mutationResolver) CreateEntryCompetence(ctx context.Context, input model.CreateEntryCompetenceInput) (*db.Entry, error) {
	panic(fmt.Errorf("not implemented: CreateEntryCompetence - createEntryCompetence"))
}

// DeleteEntryTag is the resolver for the deleteEntryTag field.
func (r *mutationResolver) DeleteEntryTag(ctx context.Context, input model.DeleteEntryTagInput) (*db.Entry, error) {
	panic(fmt.Errorf("not implemented: DeleteEntryTag - deleteEntryTag"))
}

// DeleteEntryFile is the resolver for the deleteEntryFile field.
func (r *mutationResolver) DeleteEntryFile(ctx context.Context, input model.DeleteEntryFileInput) (*db.Entry, error) {
	panic(fmt.Errorf("not implemented: DeleteEntryFile - deleteEntryFile"))
}

// DeleteEntryUser is the resolver for the deleteEntryUser field.
func (r *mutationResolver) DeleteEntryUser(ctx context.Context, input model.DeleteEntryUserInput) (*db.Entry, error) {
	panic(fmt.Errorf("not implemented: DeleteEntryUser - deleteEntryUser"))
}

// DeleteEntryEvent is the resolver for the deleteEntryEvent field.
func (r *mutationResolver) DeleteEntryEvent(ctx context.Context, input model.DeleteEntryEventInput) (*db.Entry, error) {
	panic(fmt.Errorf("not implemented: DeleteEntryEvent - deleteEntryEvent"))
}

// DeleteEntryCompetence is the resolver for the deleteEntryCompetence field.
func (r *mutationResolver) DeleteEntryCompetence(ctx context.Context, input model.DeleteEntryCompetenceInput) (*db.Entry, error) {
	panic(fmt.Errorf("not implemented: DeleteEntryCompetence - deleteEntryCompetence"))
}

// UpdateEntryUserCompetenceLevel is the resolver for the updateEntryUserCompetenceLevel field.
func (r *mutationResolver) UpdateEntryUserCompetenceLevel(ctx context.Context, input model.UpdateEntryUserCompetenceLevel) (*db.Entry, error) {
	panic(fmt.Errorf("not implemented: UpdateEntryUserCompetenceLevel - updateEntryUserCompetenceLevel"))
}

// UploadFileToEntry is the resolver for the uploadFileToEntry field.
func (r *mutationResolver) UploadFileToEntry(ctx context.Context, entryID string, file graphql.Upload) (*db.Entry, error) {
	panic(fmt.Errorf("not implemented: UploadFileToEntry - uploadFileToEntry"))
}

// RemoveFileFromEntry is the resolver for the removeFileFromEntry field.
func (r *mutationResolver) RemoveFileFromEntry(ctx context.Context, entryID string, fileID string) (*db.File, error) {
	panic(fmt.Errorf("not implemented: RemoveFileFromEntry - removeFileFromEntry"))
}

// Entry is the resolver for the entry field.
func (r *queryResolver) Entry(ctx context.Context, id string) (*db.Entry, error) {
	panic(fmt.Errorf("not implemented: Entry - entry"))
}

// Entries is the resolver for the entries field.
func (r *queryResolver) Entries(ctx context.Context, limit *int, offset *int, filter *model.EntryFilterInput, sortBy *model.EntrySortBy, search *string) (*model.EntryConnection, error) {
	panic(fmt.Errorf("not implemented: Entries - entries"))
}

// Entry returns generated.EntryResolver implementation.
func (r *Resolver) Entry() generated.EntryResolver { return &entryResolver{r} }

type entryResolver struct{ *Resolver }

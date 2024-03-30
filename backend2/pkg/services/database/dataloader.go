package database

import (
	"context"
	"errors"
	"sync"

	"github.com/graph-gophers/dataloader/v7"
	"github.com/jackc/pgx/v5"

	"github.com/dokedu/dokedu/backend/pkg/middleware"
	"github.com/dokedu/dokedu/backend/pkg/msg"
	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

type ContextKey string

const DataloaderKey ContextKey = "dataloader"

type Dataloader struct {
	db *DB
	mu sync.Mutex

	competences       *dataloader.Loader[string, db.Competence]
	competenceParents *dataloader.Loader[string, []db.Competence]
}

func ContextWithLoader(ctx context.Context, db *DB) context.Context {
	return context.WithValue(ctx, DataloaderKey, &Dataloader{
		db: db,
	})
}

func LoaderFromContext(ctx context.Context) *Dataloader {
	d, ok := ctx.Value(DataloaderKey).(*Dataloader)
	if !ok {
		panic("no dataloader.Dataloader found in context. Did the middleware run?")
	}

	return d
}

func ErrorResult[V any](keys []string, err error) []*dataloader.Result[V] {
	results := make([]*dataloader.Result[V], len(keys))
	for i := range results {
		results[i] = &dataloader.Result[V]{Error: err}
	}
	return results
}

func (d *Dataloader) Competences() *dataloader.Loader[string, db.Competence] {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.competences == nil {
		d.competences = dataloader.NewBatchedLoader[string, db.Competence](func(ctx context.Context, keys []string) []*dataloader.Result[db.Competence] {
			user, ok := middleware.GetUser(ctx)
			if !ok {
				return ErrorResult[db.Competence](keys, msg.ErrUnauthorized)
			}

			competences, err := d.db.CompetencesFindByID(ctx, db.CompetencesFindByIDParams{
				OrganisationID: user.OrganisationID,
				Ids:            keys,
			})
			if err != nil {
				return ErrorResult[db.Competence](keys, err)
			}

			competenceByID := make(map[string]db.Competence, len(competences))
			for _, competence := range competences {
				competenceByID[competence.ID] = competence
			}

			results := make([]*dataloader.Result[db.Competence], len(keys))
			for i, key := range keys {
				competence, ok := competenceByID[key]
				if !ok {
					results[i] = &dataloader.Result[db.Competence]{Error: pgx.ErrNoRows}
					continue
				}

				results[i] = &dataloader.Result[db.Competence]{Data: competence}
			}

			return results
		})
	}
	return d.competences
}

func (d *Dataloader) CompetenceParents() *dataloader.Loader[string, []db.Competence] {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.competenceParents == nil {
		d.competenceParents = dataloader.NewBatchedLoader[string, []db.Competence](func(ctx context.Context, keys []string) []*dataloader.Result[[]db.Competence] {
			user, ok := middleware.GetUser(ctx)
			if !ok {
				return ErrorResult[[]db.Competence](keys, msg.ErrUnauthorized)
			}

			// fetch the parentInfo (id, parentIds) for each competence
			parentInfos, err := d.db.CompetencesFindParents(ctx, db.CompetencesFindParentsParams{
				OrganisationID: user.OrganisationID,
				Ids:            keys,
			})
			if err != nil {
				return ErrorResult[[]db.Competence](keys, err)
			}

			// use the competence loader to fetch the parent competences
			parentsByChildID := make(map[string]dataloader.ThunkMany[db.Competence], len(parentInfos))
			for _, parentInfo := range parentInfos {
				parentsByChildID[parentInfo.OrigID] = d.Competences().LoadMany(ctx, parentInfo.Parents)
			}

			results := make([]*dataloader.Result[[]db.Competence], len(keys))
			for i, key := range keys {
				parentsThunk, ok := parentsByChildID[key]
				if !ok {
					results[i] = &dataloader.Result[[]db.Competence]{Error: pgx.ErrNoRows}
					continue
				}

				parents, errs := parentsThunk()
				if err := errors.Join(errs...); err != nil {
					results[i] = &dataloader.Result[[]db.Competence]{Error: err}
					continue
				}

				results[i] = &dataloader.Result[[]db.Competence]{Data: parents}
			}

			return results
		})
	}

	return d.competenceParents
}

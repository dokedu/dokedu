package dataloaders

import (
	"context"
	"errors"
	"github.com/dokedu/dokedu/backend/pkg/services/database"
	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
	"sync"

	"github.com/graph-gophers/dataloader/v7"
	"github.com/jackc/pgx/v5"

	"github.com/dokedu/dokedu/backend/pkg/middleware"
	"github.com/dokedu/dokedu/backend/pkg/msg"
)

type ContextKey string

const DataloaderKey ContextKey = "dataloader"

type Dataloader struct {
	db *database.DB
	mu sync.Mutex

	competences       *dataloader.Loader[string, db.Competence]
	competenceParents *dataloader.Loader[string, []db.Competence]
	users             *dataloader.Loader[string, db.User]
	userStudents      *dataloader.Loader[string, db.UserStudent]
	subjects          *dataloader.Loader[string, db.Subject]
	schoolYears       *dataloader.Loader[string, db.SchoolYear]
}

func ContextWithLoader(ctx context.Context, db *database.DB) context.Context {
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

func (d *Dataloader) Users() *dataloader.Loader[string, db.User] {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.users == nil {
		d.users = dataloader.NewBatchedLoader[string, db.User](func(ctx context.Context, keys []string) []*dataloader.Result[db.User] {
			user, ok := middleware.GetUser(ctx)
			if !ok {
				return ErrorResult[db.User](keys, msg.ErrUnauthorized)
			}

			users, err := d.db.UsersFindByID(ctx, db.UsersFindByIDParams{
				OrganisationID: user.OrganisationID,
				Ids:            keys,
			})

			if err != nil {
				return ErrorResult[db.User](keys, err)
			}

			userByID := make(map[string]db.User, len(users))
			for _, user := range users {
				userByID[user.ID] = user
			}

			results := make([]*dataloader.Result[db.User], len(keys))
			for i, key := range keys {
				user, ok := userByID[key]
				if !ok {
					results[i] = &dataloader.Result[db.User]{Error: pgx.ErrNoRows}
					continue
				}

				results[i] = &dataloader.Result[db.User]{Data: user}
			}

			return results
		})
	}
	return d.users
}

func (d *Dataloader) UserStudents() *dataloader.Loader[string, db.UserStudent] {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.userStudents == nil {
		d.userStudents = dataloader.NewBatchedLoader[string, db.UserStudent](func(ctx context.Context, keys []string) []*dataloader.Result[db.UserStudent] {
			user, ok := middleware.GetUser(ctx)
			if !ok {
				return ErrorResult[db.UserStudent](keys, msg.ErrUnauthorized)
			}

			userStudents, err := d.db.UserStudentsFindByID(ctx, db.UserStudentsFindByIDParams{
				OrganisationID: user.OrganisationID,
				Ids:            keys,
			})
			if err != nil {
				return ErrorResult[db.UserStudent](keys, err)
			}

			userStudentByID := make(map[string]db.UserStudent, len(userStudents))
			for _, userStudent := range userStudents {
				userStudentByID[userStudent.ID] = userStudent
			}

			results := make([]*dataloader.Result[db.UserStudent], len(keys))
			for i, key := range keys {
				userStudent, ok := userStudentByID[key]
				if !ok {
					results[i] = &dataloader.Result[db.UserStudent]{Error: pgx.ErrNoRows}
					continue
				}

				results[i] = &dataloader.Result[db.UserStudent]{Data: userStudent}
			}

			return results
		})
	}
	return d.userStudents
}

func (d *Dataloader) Subjects() *dataloader.Loader[string, db.Subject] {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.subjects == nil {
		d.subjects = dataloader.NewBatchedLoader[string, db.Subject](func(ctx context.Context, keys []string) []*dataloader.Result[db.Subject] {
			user, ok := middleware.GetUser(ctx)
			if !ok {
				return ErrorResult[db.Subject](keys, msg.ErrUnauthorized)
			}

			subjects, err := d.db.SubjectsFindByID(ctx, db.SubjectsFindByIDParams{
				OrganisationID: user.OrganisationID,
				Ids:            keys,
			})
			if err != nil {
				return ErrorResult[db.Subject](keys, err)
			}

			subjectByID := make(map[string]db.Subject, len(subjects))
			for _, subject := range subjects {
				subjectByID[subject.ID] = subject
			}

			results := make([]*dataloader.Result[db.Subject], len(keys))
			for i, key := range keys {
				subject, ok := subjectByID[key]
				if !ok {
					results[i] = &dataloader.Result[db.Subject]{Error: pgx.ErrNoRows}
					continue
				}

				results[i] = &dataloader.Result[db.Subject]{Data: subject}
			}

			return results
		})
	}
	return d.subjects
}

func (d *Dataloader) SchoolYears() *dataloader.Loader[string, db.SchoolYear] {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.schoolYears == nil {
		d.schoolYears = dataloader.NewBatchedLoader[string, db.SchoolYear](func(ctx context.Context, keys []string) []*dataloader.Result[db.SchoolYear] {
			user, ok := middleware.GetUser(ctx)
			if !ok {
				return ErrorResult[db.SchoolYear](keys, msg.ErrUnauthorized)
			}

			schoolYears, err := d.db.SchoolYearsFindByID(ctx, db.SchoolYearsFindByIDParams{
				OrganisationID: user.OrganisationID,
				Ids:            keys,
			})
			if err != nil {
				return ErrorResult[db.SchoolYear](keys, err)
			}

			schoolYearByID := make(map[string]db.SchoolYear, len(schoolYears))
			for _, schoolYear := range schoolYears {
				schoolYearByID[schoolYear.ID] = schoolYear
			}

			results := make([]*dataloader.Result[db.SchoolYear], len(keys))
			for i, key := range keys {
				schoolYear, ok := schoolYearByID[key]
				if !ok {
					results[i] = &dataloader.Result[db.SchoolYear]{Error: pgx.ErrNoRows}
					continue
				}

				results[i] = &dataloader.Result[db.SchoolYear]{Data: schoolYear}
			}

			return results
		})
	}

	return d.schoolYears
}

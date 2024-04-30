package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.45

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/samber/lo"

	"github.com/dokedu/dokedu/backend/pkg/graph/generated"
	"github.com/dokedu/dokedu/backend/pkg/graph/model"
	"github.com/dokedu/dokedu/backend/pkg/helper"
	"github.com/dokedu/dokedu/backend/pkg/middleware"
	"github.com/dokedu/dokedu/backend/pkg/msg"
	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

// CreateReport is the resolver for the createReport field.
func (r *mutationResolver) CreateReport(ctx context.Context, input model.CreateReportInput) ([]*db.Report, error) {
	user, ok := middleware.GetUser(ctx)
	if !ok || !user.HasPermissionTeacher() {
		return nil, msg.ErrUnauthorized
	}

	fromStartTime := input.From.AddDate(0, 0, 1).Truncate(24 * time.Hour)
	toEndTime := input.To.AddDate(0, 0, 2).Truncate(24 * time.Hour).Add(-time.Nanosecond)

	var reports []db.Report
	err := r.DB.InTx(ctx, func(ctx context.Context, q *db.Queries) error {
		if input.AllUsers != nil && *input.AllUsers {
			students, err := r.Services.DB.UserStudentsAllWithDeleted(ctx, user.OrganisationID)
			if err != nil {
				return fmt.Errorf("failed to get students: %w", err)
			}

			for _, student := range students {
				report, err := q.ReportCreate(ctx, db.ReportCreateParams{
					Format:         "",
					Kind:           "",
					From:           fromStartTime,
					To:             toEndTime,
					FilterTags:     input.FilterTags,
					UserID:         user.ID,
					StudentUserID:  student.UserID,
					OrganisationID: user.OrganisationID,
				})
				if err != nil {
					return err
				}

				reports = append(reports, report)
			}
		} else {
			if input.StudentUser == nil {
				return errors.New("studentUser is required")
			}
			report, err := q.ReportCreate(ctx, db.ReportCreateParams{
				OrganisationID: user.OrganisationID,
				UserID:         user.ID,
				StudentUserID:  *input.StudentUser,
				From:           fromStartTime,
				To:             toEndTime,
				Format:         input.Format,
				FilterTags:     input.FilterTags,
				Kind:           input.Kind,
			})
			if err != nil {
				return err
			}

			reports = append(reports, report)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}

	for _, report := range reports {
		// Add the report to the queue for processing
		err = r.ReportGeneration.AddToQueue(report.ID)
		if err != nil {
			return nil, err
		}
	}

	return lo.ToSlicePtr(reports), nil
}

// Report is the resolver for the report field.
func (r *queryResolver) Report(ctx context.Context, id string) (*db.Report, error) {
	user, ok := middleware.GetUser(ctx)
	if !ok || !user.HasPermissionTeacher() {
		return nil, msg.ErrUnauthorized
	}

	report, err := r.DB.ReportFindByID(ctx, db.ReportFindByIDParams{
		ID:             id,
		OrganisationID: user.OrganisationID,
	})
	if err != nil {
		return nil, err
	}

	return &report, nil
}

// Reports is the resolver for the reports field.
func (r *queryResolver) Reports(ctx context.Context, limit *int, offset *int) (*model.ReportConnection, error) {
	user, ok := middleware.GetUser(ctx)
	if !ok || !user.HasPermissionTeacher() {
		return nil, msg.ErrUnauthorized
	}

	l, o := helper.PaginationInput(limit, offset)
	reports, err := r.DB.ReportsAllPaginated(ctx, db.ReportsAllPaginatedParams{
		OrganisationID: user.OrganisationID,
		Offset:         int32(o),
		Limit:          int32(l),
	})
	if err != nil {
		return nil, err
	}

	edges, pageInfo := helper.PaginationOutput(l, o, reports)
	return &model.ReportConnection{
		Edges:    lo.ToSlicePtr(edges),
		PageInfo: pageInfo,
	}, nil
}

// Meta is the resolver for the meta field.
func (r *reportResolver) Meta(ctx context.Context, obj *db.Report) (string, error) {
	// meta is a jsonb field, so we need to unmarshal it
	var meta map[string]interface{}
	err := json.Unmarshal(obj.Meta, &meta)
	if err != nil {
		return "", err
	}

	// return meta as a string
	return fmt.Sprintf("%v", meta), nil
}

// User is the resolver for the user field.
func (r *reportResolver) User(ctx context.Context, obj *db.Report) (*db.User, error) {
	user, ok := middleware.GetUser(ctx)
	if !ok {
		return nil, msg.ErrUnauthorized
	}

	loadedUser, err := r.DB.Loader(ctx).Users(user.User).Load(ctx, obj.UserID)()
	return &loadedUser, err
}

// StudentUser is the resolver for the studentUser field.
func (r *reportResolver) StudentUser(ctx context.Context, obj *db.Report) (*db.User, error) {
	user, ok := middleware.GetUser(ctx)
	if !ok {
		return nil, msg.ErrUnauthorized
	}

	loadedUser, err := r.DB.Loader(ctx).Users(user.User).Load(ctx, obj.StudentUserID)()
	return &loadedUser, err
}

// File is the resolver for the file field.
func (r *reportResolver) File(ctx context.Context, obj *db.Report) (*db.File, error) {
	if !obj.FileID.Valid {
		return nil, nil
	}

	user, ok := middleware.GetUser(ctx)
	if !ok {
		return nil, msg.ErrUnauthorized
	}

	file, err := r.DB.FileByID(ctx, db.FileByIDParams{
		ID:             obj.FileID.String,
		OrganisationID: user.OrganisationID,
	})
	return &file, err
}

// DeletedAt is the resolver for the deletedAt field.
func (r *reportResolver) DeletedAt(ctx context.Context, obj *db.Report) (*time.Time, error) {
	if obj.DeletedAt.Valid {
		return &obj.DeletedAt.Time, nil
	}
	return nil, nil
}

// ReportCreatedOrUpdated is the resolver for the reportCreatedOrUpdated field.
func (r *subscriptionResolver) ReportCreatedOrUpdated(ctx context.Context) (<-chan *db.Report, error) {
	panic(fmt.Errorf("not implemented: ReportCreatedOrUpdated - reportCreatedOrUpdated"))
}

// Report returns generated.ReportResolver implementation.
func (r *Resolver) Report() generated.ReportResolver { return &reportResolver{r} }

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

type reportResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }

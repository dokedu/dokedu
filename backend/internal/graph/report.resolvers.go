package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.40

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/dokedu/dokedu/backend/internal/database/db"
	"github.com/dokedu/dokedu/backend/internal/dataloaders"
	"github.com/dokedu/dokedu/backend/internal/graph/model"
	"github.com/dokedu/dokedu/backend/internal/helper"
	"github.com/dokedu/dokedu/backend/internal/middleware"
)

// CreateReport is the resolver for the createReport field.
func (r *mutationResolver) CreateReport(ctx context.Context, input model.CreateReportInput) ([]*db.Report, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	fromStartTime := input.From.AddDate(0, 0, 1).Truncate(24 * time.Hour)
	toEndTime := input.To.AddDate(0, 0, 2).Truncate(24 * time.Hour).Add(-time.Nanosecond)

	var reports []*db.Report

	if input.AllUsers != nil && *input.AllUsers {
		students, err := r.DB.UserListByRole(ctx, db.UserListByRoleParams{
			Role:           db.UserRoleStudent,
			OrganisationID: currentUser.OrganisationID,
		})
		if err != nil {
			return nil, errors.New("failed to get students")
		}

		for _, student := range students {
			reports = append(reports, &db.Report{
				OrganisationID: currentUser.OrganisationID,
				UserID:         currentUser.ID,
				StudentUserID:  student.ID,
				From:           fromStartTime,
				To:             toEndTime,
				Format:         input.Format,
				FilterTags:     input.FilterTags,
				Kind:           input.Kind,
				Status:         "pending",
			})
		}

	} else {
		if input.StudentUser == nil {
			return nil, errors.New("studentUser is required")
		}
		reports = append(reports, &db.Report{
			OrganisationID: currentUser.OrganisationID,
			UserID:         currentUser.ID,
			StudentUserID:  *input.StudentUser,
			From:           fromStartTime,
			To:             toEndTime,
			Format:         input.Format,
			FilterTags:     input.FilterTags,
			Kind:           input.Kind,
			Status:         "pending",
		})
	}

	err = r.DB.NewInsert().Model(&reports).Returning("*").Scan(ctx)
	if err != nil {
		return nil, err
	}

	for _, report := range reports {
		// Add the report to the queue for processing
		err = r.ReportService.AddToQueue(report.ID)
		if err != nil {
			return nil, err
		}
	}

	return reports, nil
}

// Report is the resolver for the report field.
func (r *queryResolver) Report(ctx context.Context, id string) (*db.Report, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	// query the report
	var report db.Report
	err = r.DB.NewSelect().Model(&report).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &report, nil
}

// Reports is the resolver for the reports field.
func (r *queryResolver) Reports(ctx context.Context, limit *int, offset *int) (*model.ReportConnection, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	pageLimit, pageOffset := helper.SetPageLimits(limit, offset)

	var reports []*db.Report
	count, err := r.DB.NewSelect().
		Model(&reports).
		Where("organisation_id = ?", currentUser.OrganisationID).
		Order("created_at DESC").
		Limit(pageLimit).
		Offset(pageOffset).
		ScanAndCount(ctx)
	if err != nil {
		return nil, err
	}

	// Get the pageInfo
	page, err := helper.CreatePageInfo(pageOffset, pageLimit, count)
	if err != nil {
		return nil, err
	}

	page.CurrentPage = pageOffset / pageLimit
	return &model.ReportConnection{
		Edges:      reports,
		PageInfo:   page,
		TotalCount: count,
	}, nil
}

// Meta is the resolver for the meta field.
func (r *reportResolver) Meta(ctx context.Context, obj *db.Report) (string, error) {
	/// meta is a jsonb field, so we need to unmarshal it
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
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	user, err := dataloaders.GetUser(ctx, obj.UserID, currentUser)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// StudentUser is the resolver for the studentUser field.
func (r *reportResolver) StudentUser(ctx context.Context, obj *db.Report) (*db.User, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	var user db.User
	err = r.DB.NewSelect().
		Model(&user).
		Where("id = ?", obj.StudentUserID).
		Where("organisation_id = ?", currentUser.OrganisationID).
		WhereAllWithDeleted().
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// File is the resolver for the file field.
func (r *reportResolver) File(ctx context.Context, obj *db.Report) (*db.File, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	var file db.File
	err = r.DB.NewSelect().Model(&file).Where("id = ?", obj.FileID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &file, nil
}

// DeletedAt is the resolver for the deletedAt field.
func (r *reportResolver) DeletedAt(ctx context.Context, obj *db.Report) (*time.Time, error) {
	panic(fmt.Errorf("not implemented: DeletedAt - deletedAt"))
}

// ReportCreatedOrUpdated is the resolver for the reportCreatedOrUpdated field.
func (r *subscriptionResolver) ReportCreatedOrUpdated(ctx context.Context) (<-chan *db.Report, error) {
	panic(fmt.Errorf("not implemented: ReportCreatedOrUpdated - reportCreatedOrUpdated"))
}

// Report returns ReportResolver implementation.
func (r *Resolver) Report() ReportResolver { return &reportResolver{r} }

type reportResolver struct{ *Resolver }

package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.45

import (
	"context"
	"github.com/dokedu/dokedu/backend/pkg/middleware"
	"github.com/dokedu/dokedu/backend/pkg/msg"

	"github.com/dokedu/dokedu/backend/pkg/graph/generated"
	"github.com/dokedu/dokedu/backend/pkg/graph/model"
	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

// UpdateOrganisation is the resolver for the updateOrganisation field.
func (r *mutationResolver) UpdateOrganisation(ctx context.Context, input model.UpdateOrganisationInput) (*db.Organisation, error) {
	user, ok := middleware.GetUser(ctx)
	if !ok {
		return nil, msg.ErrUnauthorized
	}

	// Admin can update organisations
	if !user.HasPermissionAdmin() {
		return nil, msg.ErrUnauthorized
	}

	// User can only update their own organisation
	if user.OrganisationID != input.ID {
		return nil, msg.ErrUnauthorized
	}

	updateParams := db.OrganisationUpdateParams{
		OrganisationID: user.OrganisationID,
	}

	if input.Name != nil {
		updateParams.Name = *input.Name
	}

	if input.LegalName != nil {
		updateParams.LegalName = *input.LegalName
	}

	if input.Website != nil {
		updateParams.Website = *input.Website
	}

	if input.Phone != nil {
		updateParams.Phone = *input.Phone
	}

	org, err := r.DB.OrganisationUpdate(ctx, updateParams)
	if err != nil {
		return nil, err
	}

	return &org, nil
}

// Owner is the resolver for the owner field.
func (r *organisationResolver) Owner(ctx context.Context, obj *db.Organisation) (*db.User, error) {
	user, ok := middleware.GetUser(ctx)
	if !ok {
		return nil, msg.ErrUnauthorized
	}

	owner, err := r.DB.UserFindByID(ctx, db.UserFindByIDParams{
		ID:             obj.OwnerID,
		OrganisationID: user.OrganisationID,
	})

	if err != nil {
		return nil, err
	}

	return &owner, nil
}

// Organisation is the resolver for the organisation field.
func (r *queryResolver) Organisation(ctx context.Context) (*db.Organisation, error) {
	user, ok := middleware.GetUser(ctx)
	if !ok {
		return nil, msg.ErrUnauthorized
	}

	org, err := r.DB.GLOBAL_OrganisationFindByID(ctx, user.OrganisationID)
	if err != nil {
		return nil, err
	}

	return &org, nil
}

// Organisation returns generated.OrganisationResolver implementation.
func (r *Resolver) Organisation() generated.OrganisationResolver { return &organisationResolver{r} }

type organisationResolver struct{ *Resolver }

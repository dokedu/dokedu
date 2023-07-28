package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.29

import (
	"context"
	"database/sql"
	"errors"
	"example/pkg/db"
	"example/pkg/graph/model"
	"example/pkg/middleware"
	"fmt"
	"strings"
	"time"
)

// CreatedAt is the resolver for the createdAt field.
func (r *domainResolver) CreatedAt(ctx context.Context, obj *db.Domain) (string, error) {
	if obj.CreatedAt.IsZero() {
		return "", nil
	}

	return obj.CreatedAt.Format(time.RFC1123Z), nil
}

// CreatedAt is the resolver for the createdAt field.
func (r *emailResolver) CreatedAt(ctx context.Context, obj *db.Email) (string, error) {
	if obj.CreatedAt.IsZero() {
		return "", nil
	}

	return obj.CreatedAt.Format(time.RFC1123Z), nil
}

// User is the resolver for the user field.
func (r *emailAccountResolver) User(ctx context.Context, obj *db.EmailAccount) (*db.User, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var user db.User
	err := r.DB.NewSelect().Model(&user).Where("id = ?", obj.UserID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// CreatedAt is the resolver for the createdAt field.
func (r *emailAccountResolver) CreatedAt(ctx context.Context, obj *db.EmailAccount) (string, error) {
	if obj.CreatedAt.IsZero() {
		return "", nil
	}

	return obj.CreatedAt.Format(time.RFC1123Z), nil
}

// CreatedAt is the resolver for the createdAt field.
func (r *emailForwardingResolver) CreatedAt(ctx context.Context, obj *db.EmailForwarding) (string, error) {
	if obj.CreatedAt.IsZero() {
		return "", nil
	}

	return obj.CreatedAt.Format(time.RFC1123Z), nil
}

// CreatedAt is the resolver for the createdAt field.
func (r *emailGroupMemberResolver) CreatedAt(ctx context.Context, obj *db.EmailGroupMember) (string, error) {
	if obj.CreatedAt.IsZero() {
		return "", nil
	}

	return obj.CreatedAt.Format(time.RFC1123Z), nil
}

// CreateEmailAccount is the resolver for the createEmailAccount field.
func (r *mutationResolver) CreateEmailAccount(ctx context.Context, input model.CreateEmailAccountInput) (*db.EmailAccount, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	emailAccount := db.EmailAccount{
		Name:           input.Name,
		Secret:         "TODO",
		Type:           input.Type,
		Quota:          0,
		Active:         true,
		UserID:         sql.NullString{String: currentUser.ID, Valid: true},
		OrganisationID: currentUser.OrganisationID,
	}

	if input.Description != nil {
		emailAccount.Description = *input.Description
	}

	err := r.DB.NewInsert().Model(&emailAccount).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &emailAccount, nil
}

// UpdateEmailAccount is the resolver for the updateEmailAccount field.
func (r *mutationResolver) UpdateEmailAccount(ctx context.Context, input model.UpdateEmailAccountInput) (*db.EmailAccount, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var emailAccount db.EmailAccount
	err := r.DB.NewSelect().Model(&emailAccount).Where("name = ?", input.Name).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	if input.Name != nil {
		emailAccount.Name = *input.Name
	}
	if input.Description != nil {
		emailAccount.Description = *input.Description
	}
	if input.Type != nil {
		emailAccount.Type = *input.Type
	}
	if input.Quota != nil {
		emailAccount.Quota = *input.Quota
	}
	if input.Active != nil {
		emailAccount.Active = *input.Active
	}
	err = r.DB.NewUpdate().Model(&emailAccount).Returning("*").Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &emailAccount, nil
}

// DeleteEmailAccount is the resolver for the deleteEmailAccount field.
func (r *mutationResolver) DeleteEmailAccount(ctx context.Context, input model.DeleteEmailAccountInput) (*db.EmailAccount, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var emailAccount db.EmailAccount
	err := r.DB.NewSelect().Model(&emailAccount).Where("id = ?", input.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	// TODO: Check if email account is in use
	emailAccount.Active = false

	err = r.DB.NewUpdate().Model(&emailAccount).Returning("*").Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &emailAccount, nil
}

// CreateEmailGroupMember is the resolver for the createEmailGroupMember field.
func (r *mutationResolver) CreateEmailGroupMember(ctx context.Context, input model.CreateEmailGroupMemberInput) (*db.EmailGroupMember, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	emailGroupMember := db.EmailGroupMember{
		Name:           input.Name,
		MemberOf:       input.MemberOf,
		OrganisationID: currentUser.OrganisationID,
	}

	err := r.DB.NewInsert().Model(&emailGroupMember).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &emailGroupMember, nil
}

// DeleteEmailGroupMember is the resolver for the deleteEmailGroupMember field.
func (r *mutationResolver) DeleteEmailGroupMember(ctx context.Context, input model.DeleteEmailGroupMemberInput) (*db.EmailGroupMember, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var emailGroupMember db.EmailGroupMember
	err := r.DB.NewSelect().Model(&emailGroupMember).Where("id = ?", input.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	// TODO instead of hard delete use soft delete
	err = r.DB.NewDelete().Model(&emailGroupMember).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &emailGroupMember, nil
}

// CreateEmail is the resolver for the createEmail field.
func (r *mutationResolver) CreateEmail(ctx context.Context, input model.CreateEmailInput) (*db.Email, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	email := db.Email{
		Name:           input.Name,
		Address:        input.Address,
		Type:           input.Type,
		OrganisationID: currentUser.OrganisationID,
	}
	err := r.DB.NewInsert().Model(&email).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &email, nil
}

// DeleteEmail is the resolver for the deleteEmail field.
func (r *mutationResolver) DeleteEmail(ctx context.Context, input model.DeleteEmailInput) (*db.Email, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var email db.Email
	err := r.DB.NewSelect().Model(&email).Where("id = ?", input.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	// TODO instead of hard delete use soft delete
	err = r.DB.NewDelete().Model(&email).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &email, nil
}

// CreateEmailForwarding is the resolver for the createEmailForwarding field.
func (r *mutationResolver) CreateEmailForwarding(ctx context.Context, input model.CreateEmailForwardingInput) (*db.EmailForwarding, error) {
	panic(fmt.Errorf("not implemented: CreateEmailForwarding - createEmailForwarding"))
}

// DeleteEmailForwarding is the resolver for the deleteEmailForwarding field.
func (r *mutationResolver) DeleteEmailForwarding(ctx context.Context, input model.DeleteEmailForwardingInput) (*db.EmailForwarding, error) {
	panic(fmt.Errorf("not implemented: DeleteEmailForwarding - deleteEmailForwarding"))
}

// CreateDomain is the resolver for the createDomain field.
func (r *mutationResolver) CreateDomain(ctx context.Context, input model.CreateDomainInput) (*db.Domain, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	domain := db.Domain{
		Name:           input.Name,
		OrganisationID: currentUser.OrganisationID,
	}
	err := r.DB.NewInsert().Model(&domain).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &domain, nil
}

// DeleteDomain is the resolver for the deleteDomain field.
func (r *mutationResolver) DeleteDomain(ctx context.Context, input model.DeleteDomainInput) (*db.Domain, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var domain db.Domain
	err := r.DB.NewSelect().Model(&domain).Where("id = ?", input.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	// TODO instead of hard delete use soft delete
	err = r.DB.NewDelete().Model(&domain).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &domain, nil
}

// CreateGroup is the resolver for the createGroup field.
func (r *mutationResolver) CreateGroup(ctx context.Context, input model.CreateGroupInput) (*model.Group, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	group := model.Group{
		Name:        input.Name,
		Description: input.Description,
		Domain:      input.Domain,
		Users:       input.Users,
	}

	generatedName := input.Name + "@" + input.Domain
	// Insert new email account of type group
	account := db.EmailAccount{
		Name:           generatedName,
		Type:           "GROUP",
		Description:    *input.Description,
		OrganisationID: currentUser.OrganisationID,
	}
	err = r.DB.NewInsert().Model(&account).Scan(ctx)

	group.ID = account.ID

	// For each user in the group, create a new email group member
	for _, user := range input.Users {
		groupMember := db.EmailGroupMember{
			Name:           *user,
			OrganisationID: currentUser.OrganisationID,
			MemberOf:       generatedName,
		}
		err = r.DB.NewInsert().Model(&groupMember).Scan(ctx)
	}

	return &group, nil
}

// UpdateGroup is the resolver for the updateGroup field.
func (r *mutationResolver) UpdateGroup(ctx context.Context, input model.UpdateGroupInput) (*model.Group, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}
	// Fetch the current group
	var group db.EmailAccount
	err = r.DB.NewSelect().Model(&group).Where("id = ?", input.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)

	// Update email account of type group
	account := db.EmailAccount{
		ID:             input.ID,
		Name:           *input.Name + "@" + *input.Domain,
		Type:           "GROUP",
		Description:    *input.Description,
		OrganisationID: currentUser.OrganisationID,
		CreatedAt:      group.CreatedAt,
	}

	// Check if the group name has changed
	if account.Name != group.Name {
		// Update group members with new group name
		var groupMembers []db.EmailGroupMember
		err = r.DB.NewSelect().Model(&groupMembers).Where("member_of = ?", group.Name).Scan(ctx)

		// Update each entry
		for _, member := range groupMembers {
			member.MemberOf = account.Name
			err = r.DB.NewUpdate().Model(&member).Scan(ctx)
		}
	}

	// Update the group
	_, err = r.DB.NewUpdate().Model(&account).Where("id = ?", input.ID).Returning("*").Exec(ctx)

	// Get the current group members
	var groupMembers []db.EmailGroupMember
	err = r.DB.NewSelect().Model(&groupMembers).Where("member_of = ?", account.Name).Scan(ctx)

	// Remove the ones not in input.Users
	for _, member := range groupMembers {
		found := false
		for _, user := range input.Users {
			if *user == member.Name {
				found = true
			}
		}

		if !found {
			// Delete the group member
			_, err = r.DB.NewDelete().Model(&member).Where("id = ?", member.ID).Exec(ctx)
			if err != nil {
				return nil, err
			}
		}
	}

	// Add all users that are currently not in group
	for _, user := range input.Users {
		found := false
		for _, member := range groupMembers {
			if *user == member.Name {
				found = true
			}
		}

		if !found {
			// Create the group member
			groupMember := db.EmailGroupMember{
				Name:           *user,
				OrganisationID: currentUser.OrganisationID,
				MemberOf:       account.Name,
			}
			err = r.DB.NewInsert().Model(&groupMember).Scan(ctx)
			if err != nil {
				return nil, err
			}
		}
	}

	return &model.Group{
		ID:          input.ID,
		Name:        *input.Name,
		Description: input.Description,
		Domain:      *input.Domain,
		Users:       input.Users}, nil
}

// DeleteGroup is the resolver for the deleteGroup field.
func (r *mutationResolver) DeleteGroup(ctx context.Context, id string) (*model.Group, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	// Fetch the current group
	var group db.EmailAccount
	err = r.DB.NewSelect().Model(&group).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	// Delete the group
	_, err = r.DB.NewDelete().Model(&group).Where("id = ?", id).Exec(ctx)
	if err != nil {
		return nil, err
	}

	// Delete the group members
	var groupMembers []db.EmailGroupMember
	err = r.DB.NewSelect().Model(&groupMembers).Where("member_of = ?", group.Name).Scan(ctx)
	if err != nil {
		return nil, err
	}

	memberNames := make([]*string, len(groupMembers))
	if len(groupMembers) != 0 {
		for i, member := range groupMembers {
			memberNames[i] = &member.Name
			_, err = r.DB.NewDelete().Model(&member).Where("id = ?", member.ID).Exec(ctx)
			if err != nil {
				return nil, err
			}
		}
	}

	address := strings.Split(group.Name, "@")
	return &model.Group{
		ID:          group.ID,
		Name:        address[0],
		Description: &group.Description,
		Domain:      address[1],
		Users:       memberNames,
	}, nil
}

// EmailAccounts is the resolver for the emailAccounts field.
func (r *queryResolver) EmailAccounts(ctx context.Context, filter *model.EmailAccountFilter) (*model.EmailAccountConnection, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var emailAccounts []*db.EmailAccount
	query := r.DB.NewSelect().Model(&emailAccounts).Where("organisation_id = ?", currentUser.OrganisationID)

	if filter != nil {
		if filter.Type != nil {
			query.Where("type = ?", *filter.Type)
		}
	}

	err := query.Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &model.EmailAccountConnection{
		Edges: emailAccounts,
		PageInfo: &model.PageInfo{
			HasNextPage:     false,
			HasPreviousPage: false,
		},
	}, nil
}

// EmailAccount is the resolver for the emailAccount field.
func (r *queryResolver) EmailAccount(ctx context.Context, id string) (*db.EmailAccount, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var emailAccount db.EmailAccount
	err := r.DB.NewSelect().Model(&emailAccount).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &emailAccount, nil
}

// EmailGroupMembers is the resolver for the EmailGroupMembers field.
func (r *queryResolver) EmailGroupMembers(ctx context.Context) (*model.EmailGroupMemberConnection, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var emailGroupMembers []*db.EmailGroupMember
	err := r.DB.NewSelect().Model(&emailGroupMembers).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &model.EmailGroupMemberConnection{
		Edges: emailGroupMembers,
		PageInfo: &model.PageInfo{
			HasNextPage:     false,
			HasPreviousPage: false,
		},
	}, nil
}

// EmailGroupMember is the resolver for the EmailGroupMember field.
func (r *queryResolver) EmailGroupMember(ctx context.Context, id string) (*db.EmailGroupMember, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var emailGroups *db.EmailGroupMember
	err := r.DB.NewSelect().Model(&emailGroups).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return emailGroups, nil
}

// Emails is the resolver for the emails field.
func (r *queryResolver) Emails(ctx context.Context) (*model.EmailConnection, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var emails []*db.Email
	err := r.DB.NewSelect().Model(&emails).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &model.EmailConnection{
		Edges: emails,
		PageInfo: &model.PageInfo{
			HasNextPage:     false,
			HasPreviousPage: false,
		},
	}, nil
}

// Email is the resolver for the email field.
func (r *queryResolver) Email(ctx context.Context, id string) (*db.Email, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var email db.Email
	err := r.DB.NewSelect().Model(&email).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &email, nil
}

// EmailForwardings is the resolver for the emailForwardings field.
func (r *queryResolver) EmailForwardings(ctx context.Context) (*model.EmailForwardingConnection, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var emailForwardings []*db.EmailForwarding
	err := r.DB.NewSelect().Model(&emailForwardings).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &model.EmailForwardingConnection{
		Edges: emailForwardings,
		PageInfo: &model.PageInfo{
			HasNextPage:     false,
			HasPreviousPage: false,
		},
	}, nil
}

// EmailForwarding is the resolver for the emailForwarding field.
func (r *queryResolver) EmailForwarding(ctx context.Context, id string) (*db.EmailForwarding, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var emailForwarding db.EmailForwarding
	err := r.DB.NewSelect().Model(&emailForwarding).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &emailForwarding, nil
}

// Domains is the resolver for the domains field.
func (r *queryResolver) Domains(ctx context.Context) (*model.DomainConnection, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var domains []*db.Domain
	err := r.DB.NewSelect().Model(&domains).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &model.DomainConnection{
		Edges: domains,
		PageInfo: &model.PageInfo{
			HasNextPage:     false,
			HasPreviousPage: false,
		},
	}, nil
}

// Domain is the resolver for the domain field.
func (r *queryResolver) Domain(ctx context.Context, id string) (*db.Domain, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var domain db.Domain
	err := r.DB.NewSelect().Model(&domain).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &domain, nil
}

// Group is the resolver for the group field.
func (r *queryResolver) Group(ctx context.Context, id string) (*model.Group, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var group db.EmailAccount
	err = r.DB.NewSelect().Model(&group).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	// Get the group member names
	var groupMembers []*db.EmailGroupMember
	err = r.DB.NewSelect().Model(&groupMembers).Where("member_of = ?", group.Name).Scan(ctx)
	if err != nil {
		return nil, err
	}

	memberNames := make([]*string, len(groupMembers))
	if len(groupMembers) != 0 {
		for i, groupMember := range groupMembers {
			memberNames[i] = &groupMember.Name
		}
	}

	address := strings.Split(group.Name, "@")
	return &model.Group{
		ID:          group.ID,
		Name:        address[0],
		Domain:      address[1],
		Description: &group.Description,
		Users:       memberNames,
	}, nil
}

// Groups is the resolver for the groups field.
func (r *queryResolver) Groups(ctx context.Context) (*model.GroupConnection, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var groups []*db.EmailAccount
	err = r.DB.NewSelect().Model(&groups).Where("organisation_id = ?", currentUser.OrganisationID).Where("type = ?", "GROUP").Scan(ctx)
	if err != nil {
		return nil, err
	}

	var groupEdges []*model.Group
	for _, group := range groups {
		// Get the group member names
		var groupMembers []db.EmailGroupMember
		err = r.DB.NewSelect().Model(&groupMembers).Where("member_of = ?", group.Name).Scan(ctx)
		if err != nil {
			return nil, err
		}

		memberNames := make([]*string, len(groupMembers))
		if len(groupMembers) != 0 {
			for i, groupMember := range groupMembers {
				memberNames[i] = &groupMember.Name
			}
		}

		address := strings.Split(group.Name, "@")
		groupEdges = append(groupEdges, &model.Group{
			ID:          group.ID,
			Name:        address[0],
			Domain:      address[1],
			Description: &group.Description,
			Users:       memberNames,
		})
	}

	return &model.GroupConnection{
		Edges: groupEdges,
		PageInfo: &model.PageInfo{
			HasNextPage:     false,
			HasPreviousPage: false,
		},
	}, nil
}

// EmailAccounts is the resolver for the emailAccounts field.
func (r *userResolver) EmailAccounts(ctx context.Context, obj *db.User) ([]*db.EmailAccount, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}
	if !currentUser.HasPermissionAdmin() {
		return nil, errors.New("no permission")
	}

	var emailAccounts []*db.EmailAccount
	err := r.DB.NewSelect().Model(&emailAccounts).Where("user_id = ?", obj.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return emailAccounts, nil
}

// Domain returns DomainResolver implementation.
func (r *Resolver) Domain() DomainResolver { return &domainResolver{r} }

// Email returns EmailResolver implementation.
func (r *Resolver) Email() EmailResolver { return &emailResolver{r} }

// EmailAccount returns EmailAccountResolver implementation.
func (r *Resolver) EmailAccount() EmailAccountResolver { return &emailAccountResolver{r} }

// EmailForwarding returns EmailForwardingResolver implementation.
func (r *Resolver) EmailForwarding() EmailForwardingResolver { return &emailForwardingResolver{r} }

// EmailGroupMember returns EmailGroupMemberResolver implementation.
func (r *Resolver) EmailGroupMember() EmailGroupMemberResolver { return &emailGroupMemberResolver{r} }

type domainResolver struct{ *Resolver }
type emailResolver struct{ *Resolver }
type emailAccountResolver struct{ *Resolver }
type emailForwardingResolver struct{ *Resolver }
type emailGroupMemberResolver struct{ *Resolver }
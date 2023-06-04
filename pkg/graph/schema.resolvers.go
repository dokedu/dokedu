package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.29

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"example/pkg/db"
	"example/pkg/graph/model"
	"example/pkg/jwt"
	"example/pkg/middleware"
	"fmt"
	"strings"
	"time"

	jwt2 "github.com/golang-jwt/jwt"
	"github.com/uptrace/bun"
	"golang.org/x/crypto/bcrypt"
)

// Type is the resolver for the type field.
func (r *competenceResolver) Type(ctx context.Context, obj *db.Competence) (db.CompetenceType, error) {
	return obj.CompetenceType, nil
}

// Color is the resolver for the color field.
func (r *competenceResolver) Color(ctx context.Context, obj *db.Competence) (string, error) {
	if obj.Color.Valid {
		return obj.Color.String, nil
	}

	return "", nil
}

// Parents is the resolver for the parents field.
func (r *competenceResolver) Parents(ctx context.Context, obj *db.Competence) ([]*db.Competence, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var parents []*db.Competence
	err := r.DB.NewSelect().Model(&parents).Where("id = ?", obj.CompetenceID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return parents, nil
}

// DeletedAt is the resolver for the deletedAt field.
func (r *entryResolver) DeletedAt(ctx context.Context, obj *db.Entry) (*time.Time, error) {
	if obj.DeletedAt.IsZero() {
		return &obj.DeletedAt.Time, nil
	}

	return nil, nil
}

// User is the resolver for the user field.
func (r *entryResolver) User(ctx context.Context, obj *db.Entry) (*db.User, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var user db.User
	err := r.DB.NewSelect().Model(&user).Where("id = ?", obj.UserID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// Users is the resolver for the users field.
func (r *entryResolver) Users(ctx context.Context, obj *db.Entry) ([]*db.User, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var users []*db.User

	err := r.DB.NewSelect().
		Model(&users).
		Join("JOIN entry_users eu on \"user\".id = eu.user_id").
		Join("JOIN entries e on eu.entry_id = e.id").
		Where("eu.deleted_at is NULL").
		Where("e.id = ?", obj.ID).
		Where("\"user\".organisation_id = ?", currentUser.OrganisationID).
		Scan(ctx)

	if err != nil {
		return nil, err
	}

	return users, nil
}

// Events is the resolver for the events field.
func (r *entryResolver) Events(ctx context.Context, obj *db.Entry) ([]*db.Event, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var events []*db.Event
	err := r.DB.NewSelect().
		Model(&events).
		ColumnExpr("event.*").
		Join("JOIN entry_events ee on event.id = ee.event_id").
		Join("JOIN entries e on ee.entry_id = e.id").
		Where("ee.deleted_at is NULL").
		Where("e.id = ?", obj.ID).
		Where("event.organisation_id = ?", currentUser.OrganisationID).
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	return events, nil
}

// Files is the resolver for the files field.
func (r *entryResolver) Files(ctx context.Context, obj *db.Entry) ([]*db.File, error) {
	panic(fmt.Errorf("not implemented: Files - files"))
}

// Tags is the resolver for the tags field.
func (r *entryResolver) Tags(ctx context.Context, obj *db.Entry) ([]*db.Tag, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var tags []*db.Tag
	err := r.DB.NewSelect().
		Model(&tags).
		ColumnExpr("tag.*").
		Join("JOIN entry_tags et on tag.id = et.tag_id").
		Join("JOIN entries e on et.entry_id = e.id").
		Where("et.deleted_at is NULL").
		Where("e.id = ?", obj.ID).
		Where("tag.organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return tags, nil
}

// UserCompetences is the resolver for the userCompetences field.
func (r *entryResolver) UserCompetences(ctx context.Context, obj *db.Entry) ([]*db.UserCompetence, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var userCompetences []*db.UserCompetence
	err := r.DB.NewSelect().
		Model(&userCompetences).
		Where("entry_id = ?", obj.ID).
		Where("organisation_id = ?", currentUser.OrganisationID).
		Scan(ctx)

	if err != nil {
		return nil, err
	}

	return userCompetences, nil
}

// Image is the resolver for the image field.
func (r *eventResolver) Image(ctx context.Context, obj *db.Event) (*db.File, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var file db.File
	err := r.DB.NewSelect().Model(&file).Where("id = ?", obj.ImageFileID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &file, nil
}

// DeletedAt is the resolver for the deletedAt field.
func (r *eventResolver) DeletedAt(ctx context.Context, obj *db.Event) (*time.Time, error) {
	panic(fmt.Errorf("not implemented: DeletedAt - deletedAt"))
}

// Competences is the resolver for the competences field.
func (r *eventResolver) Competences(ctx context.Context, obj *db.Event) ([]*db.Competence, error) {
	panic(fmt.Errorf("not implemented: Competences - competences"))
}

// Parent is the resolver for the parent field.
func (r *fileResolver) Parent(ctx context.Context, obj *db.File) (*db.File, error) {
	panic(fmt.Errorf("not implemented: Parent - parent"))
}

// URL is the resolver for the url field.
func (r *fileResolver) URL(ctx context.Context, obj *db.File) (string, error) {
	// TODO: implement this
	return fmt.Sprintf("https://api.dokedu.org/files/%s", obj.ID), nil
}

// DeletedAt is the resolver for the deletedAt field.
func (r *fileResolver) DeletedAt(ctx context.Context, obj *db.File) (*time.Time, error) {
	panic(fmt.Errorf("not implemented: DeletedAt - deletedAt"))
}

// SignIn is the resolver for the signIn field.
func (r *mutationResolver) SignIn(ctx context.Context, input model.SignInInput) (*model.SignInPayload, error) {
	var user db.User
	err := r.DB.NewSelect().Model(&user).Where("email = ?", strings.ToLower(input.Email)).Scan(ctx)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	// user.Password is a sql.NullString, so we need to check if it is valid
	if !user.Password.Valid {
		return nil, errors.New("invalid email or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password.String), []byte(input.Password)); err != nil {
		return nil, errors.New("invalid email or password")
	}

	// custom field to remove the password from the user
	jwtUser := jwt.User{
		ID:             user.ID,
		Role:           user.Role,
		OrganisationID: user.OrganisationID,
		FirstName:      user.FirstName,
		LastName:       user.LastName,
		Email:          user.Email,
	}

	// TODO: add the secret to the environment variables
	signer := jwt.NewSigner("12345678")

	// generate a new JWT token
	token, err := signer.Sign(jwt.Claims{
		User: jwtUser,
		StandardClaims: jwt2.StandardClaims{
			IssuedAt: time.Now().Unix(),
			// expires in 24 hours
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
		},
	})

	if err != nil {
		return nil, errors.New("unable to sign the token")
	}

	return &model.SignInPayload{
		Token: token,
	}, nil
}

// AcceptInvite is the resolver for the acceptInvite field.
func (r *mutationResolver) AcceptInvite(ctx context.Context, token string, input model.SignUpInput) (*model.SignInPayload, error) {
	panic(fmt.Errorf("not implemented: AcceptInvite - acceptInvite"))
}

// CreateUser is the resolver for the createUser field.
func (r *mutationResolver) CreateUser(ctx context.Context, input model.CreateUserInput) (*db.User, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var organisation db.Organisation
	err := r.DB.NewSelect().Model(&organisation).Where("id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	// check if the email is in the allowed domains
	if isStringInArray(input.Email, organisation.AllowedDomains) {
		return nil, errors.New("email is not in the allowed domains (allowed domains: " + strings.Join(organisation.AllowedDomains, ", ") + ")")
	}

	// check if the email is already in the database
	//count, err := r.DB.GetUserByEmail(ctx, db.GetUserByEmailParams{
	//	OrganisationID: currentUser.OrganisationID,
	//	Email:          input.Email,
	//})
	var count int
	count, err = r.DB.NewSelect().Model(&db.User{}).Where("organisation_id = ?", currentUser.OrganisationID).Where("email = ?", input.Email).Count(ctx)
	if err != nil {
		return nil, err
	}
	if count > 0 {
		return nil, errors.New("email is already in the database")
	}

	// create a new user
	user := db.User{
		OrganisationID: currentUser.OrganisationID,
		Role:           input.Role,
		Email:          input.Email,
		FirstName:      input.FirstName,
		LastName:       input.LastName,
	}

	// insert the user into the database
	err = r.DB.NewInsert().Model(&user).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// UpdateUser is the resolver for the updateUser field.
func (r *mutationResolver) UpdateUser(ctx context.Context, input model.UpdateUserInput) (*db.User, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	// update the user
	user := db.User{
		ID:             input.ID,
		OrganisationID: currentUser.OrganisationID,
		FirstName:      input.FirstName,
		LastName:       input.LastName,
	}

	err := r.DB.NewUpdate().Model(&user).Where("id = ?", input.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// InviteUser is the resolver for the inviteUser field.
func (r *mutationResolver) InviteUser(ctx context.Context, input model.CreateUserInput) (*db.User, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var organisation db.Organisation
	err := r.DB.NewSelect().Model(&organisation).Where("id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}
	if input.Email == "" {
		return nil, errors.New("email is required")
	}

	// check if the email is in the allowed domains
	if isStringInArray(input.Email, organisation.AllowedDomains) {
		return nil, errors.New("email is not in the allowed domains (allowed domains: " + strings.Join(organisation.AllowedDomains, ", ") + ")")
	}

	// check if the email is already in the database
	//count, err := r.DB.GetUserByEmail(ctx, db.GetUserByEmailParams{
	//	OrganisationID: currentUser.OrganisationID,
	//	Email:          input.Email,
	//})
	count, err := r.DB.NewSelect().Model(&db.User{}).Where("organisation_id = ?", currentUser.OrganisationID).Where("email = ?", input.Email).Count(ctx)
	if err != nil {
		return nil, err
	}
	if count > 0 {
		return nil, errors.New("email is already in the database")
	}

	// create a new user
	user := db.User{
		OrganisationID: currentUser.OrganisationID,
		Email:          input.Email,
		Role:           input.Role,
		FirstName:      input.FirstName,
		LastName:       input.LastName,
	}

	// insert the user into the database
	err = r.DB.NewInsert().Model(&user).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// ArchiveUser is the resolver for the archiveUser field.
func (r *mutationResolver) ArchiveUser(ctx context.Context, id string) (*db.User, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	// check whether the user is already archived
	count, err := r.DB.NewSelect().Model(&db.User{}).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Where("deleted_at IS NOT NULL").Count(ctx)
	if err != nil {
		return nil, err
	}
	if count > 0 {
		return nil, errors.New("user is already archived")
	}

	user := &db.User{
		ID:             id,
		OrganisationID: currentUser.OrganisationID,
		DeletedAt: bun.NullTime{
			Time: time.Now(),
		},
	}

	// archive the user by setting the deleted_at field to the current time
	res, err := r.DB.NewUpdate().Model(user).Column("deleted_at").Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Returning("*").Exec(ctx)
	if err != nil {
		return nil, err
	}
	affected, err := res.RowsAffected()
	if err != nil {
		return nil, err
	}
	if affected == 0 {
		return nil, errors.New("user not found")
	}

	return user, nil
}

// CreateEntry is the resolver for the createEntry field.
func (r *mutationResolver) CreateEntry(ctx context.Context, input model.CreateEntryInput) (*db.Entry, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	// parse input.Date to 2006-01-02 format
	date, err := time.Parse("2006-01-02", input.Date)

	if err != nil {
		return nil, err
	}

	entry := db.Entry{
		OrganisationID: currentUser.OrganisationID,
		Date:           date,
		Body:           input.Body,
		UserID:         currentUser.ID,
	}
	err = r.DB.NewInsert().Model(&entry).Returning("*").Scan(ctx)
	if err != nil {
		return nil, err
	}

	if len(input.Users) > 0 {
		var entryUsers []*db.EntryUser

		for _, userId := range input.Users {
			entryUsers = append(entryUsers, &db.EntryUser{
				EntryID:        entry.ID,
				UserID:         *userId,
				OrganisationID: currentUser.OrganisationID,
			})
		}

		err = r.DB.NewInsert().Model(&entryUsers).Returning("*").Scan(ctx)
		if err != nil {
			return nil, err
		}

		// user competences
		if len(input.UserCompetences) > 0 {
			var userCompetences []*db.UserCompetence
			for _, userId := range input.Users {
				for _, userCompetence := range input.UserCompetences {
					userCompetences = append(userCompetences, &db.UserCompetence{
						UserID:         *userId,
						CompetenceID:   userCompetence.CompetenceID,
						EntryID:        sql.NullString{String: entry.ID, Valid: true},
						OrganisationID: currentUser.OrganisationID,
					})
				}
			}

			err = r.DB.NewInsert().Model(&userCompetences).On("CONFLICT (user_id, competence_id, entry_id) DO UPDATE SET deleted_at = null").Returning("*").Scan(ctx)
			if err != nil {
				return nil, err
			}
		}

	}

	if len(input.Tags) > 0 {
		var entryTags []*db.EntryTag

		if input.Tags != nil {
			for _, tagId := range input.Tags {
				entryTags = append(entryTags, &db.EntryTag{
					EntryID:        entry.ID,
					TagID:          *tagId,
					OrganisationID: currentUser.OrganisationID,
				})
			}
		}

		err = r.DB.NewInsert().Model(&entryTags).Returning("*").Scan(ctx)
		if err != nil {
			return nil, err
		}
	}

	if len(input.Files) > 0 {
		var entryFiles []*db.EntryFile

		if input.Files != nil {
			for _, fileId := range input.Files {
				entryFiles = append(entryFiles, &db.EntryFile{
					EntryID:        entry.ID,
					FileID:         *fileId,
					OrganisationID: currentUser.OrganisationID,
				})
			}
		}

		err = r.DB.NewInsert().Model(&entryFiles).Returning("*").Scan(ctx)
		if err != nil {
			return nil, err
		}
	}

	return &entry, nil
}

// UpdateEntry is the resolver for the updateEntry field.
func (r *mutationResolver) UpdateEntry(ctx context.Context, input model.UpdateEntryInput) (*db.Entry, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var entry db.Entry
	err := r.DB.NewSelect().Model(&entry).Where("id = ?", input.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	// save input.Date to database
	if input.Date != nil {
		err = r.DB.NewUpdate().Model(&entry).Set("date = ?", input.Date).Where("id = ?", input.ID).Where("organisation_id = ?", currentUser.OrganisationID).Returning("*").Scan(ctx)
		if err != nil {
			return nil, err
		}
	}

	// save input.Body to database
	if input.Body != nil {
		err = r.DB.NewUpdate().Model(&entry).Set("body = ?", input.Body).Where("id = ?", input.ID).Where("organisation_id = ?", currentUser.OrganisationID).Returning("*").Scan(ctx)
		if err != nil {
			return nil, err
		}
	}

	if len(input.Tags) > 0 {
		var entryTags []*db.EntryTag

		if input.Tags != nil {
			for _, tagId := range input.Tags {
				entryTags = append(entryTags, &db.EntryTag{
					EntryID:        entry.ID,
					TagID:          *tagId,
					OrganisationID: currentUser.OrganisationID,
				})
			}
		}

		err = r.DB.NewInsert().Model(&entryTags).On("CONFLICT (entry_id, tag_id) DO NOTHING").Returning("*").Scan(ctx)
		if err != nil {
			return nil, err
		}
	}

	if len(input.Events) > 0 {
		var existing []*db.EntryEvent
		err = r.DB.NewSelect().Model(&existing).Where("entry_id = ?", entry.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)

		var entryEvents []*db.EntryEvent

		if input.Events != nil {
			for _, eventId := range input.Events {
				entryEvents = append(entryEvents, &db.EntryEvent{
					EntryID:        entry.ID,
					EventID:        *eventId,
					OrganisationID: currentUser.OrganisationID,
				})
			}
		}

		var toDelete []*db.EntryEvent
		for _, existingEvent := range existing {
			found := false
			for _, newEvent := range entryEvents {
				if existingEvent.EventID == newEvent.EventID {
					found = true
				}
			}
			if !found {
				toDelete = append(toDelete, existingEvent)
			}
		}

		err = r.DB.NewInsert().Model(&entryEvents).On("CONFLICT (entry_id, event_id) DO NOTHING").Returning("*").Scan(ctx)
		if err != nil {
			return nil, err
		}

		err = r.DB.NewDelete().Model(&toDelete).Where("entry_id = ?", entry.ID).Where("organisation_id = ?", currentUser.OrganisationID).WherePK().Scan(ctx)
		if err != nil {
			return nil, err
		}
	}

	if len(input.Users) > 0 {
		var entryUsers []*db.EntryUser

		if input.Users != nil {
			for _, userId := range input.Users {
				entryUsers = append(entryUsers, &db.EntryUser{
					EntryID:        entry.ID,
					UserID:         *userId,
					OrganisationID: currentUser.OrganisationID,
				})
			}
		}

		err = r.DB.NewInsert().Model(&entryUsers).On("CONFLICT (entry_id, user_id) DO UPDATE SET deleted_at = null").Returning("*").Scan(ctx)
		if err != nil {
			return nil, err
		}

		// user competences
		if len(input.UserCompetences) > 0 {
			var existing []*db.UserCompetence
			err = r.DB.NewSelect().Model(&existing).Where("entry_id = ?", input.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
			if err != nil {
				return nil, err
			}

			var insert []*db.UserCompetence

			for _, userId := range input.Users {
				for _, userCompetence := range input.UserCompetences {

					insert = append(insert, &db.UserCompetence{
						EntryID:        sql.NullString{String: input.ID, Valid: true},
						UserID:         *userId,
						CompetenceID:   userCompetence.CompetenceID,
						OrganisationID: currentUser.OrganisationID,
						Level:          userCompetence.Level,
						DeletedAt:      bun.NullTime{},
					})
				}
			}

			var deleted []*db.UserCompetence
			for _, existingCompetence := range existing {
				var found bool
				for _, insertCompetence := range insert {
					if existingCompetence.UserID == insertCompetence.UserID && existingCompetence.CompetenceID == insertCompetence.CompetenceID {
						found = true
						break
					}
				}
				if !found {
					deleted = append(deleted, existingCompetence)
				}
			}

			err = r.DB.NewInsert().Model(&insert).On("CONFLICT (entry_id, user_id, competence_id) DO UPDATE SET deleted_at = null").Returning("*").Scan(ctx)
			if err != nil {
				return nil, err
			}

			_, err = r.DB.NewDelete().Model(&deleted).Where("entry_id = ?", input.ID).Where("organisation_id = ?", currentUser.OrganisationID).WherePK().Exec(ctx)
			if err != nil {
				return nil, err
			}

		}
	}

	if len(input.Users) == 0 {
		// delete all entryFiles
		_, err = r.DB.NewDelete().Model(&db.EntryUser{}).Where("entry_id = ?", entry.ID).Where("organisation_id = ?", currentUser.OrganisationID).Exec(ctx)
		if err != nil {
			return nil, err
		}
	}

	return &entry, nil
}

// ArchiveEntry is the resolver for the archiveEntry field.
func (r *mutationResolver) ArchiveEntry(ctx context.Context, id string) (*db.Entry, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	// set deleted_at field to the current time
	entry := db.Entry{
		ID:             id,
		OrganisationID: currentUser.OrganisationID,
		DeletedAt: bun.NullTime{
			Time: time.Now(),
		},
	}
	_, err := r.DB.NewUpdate().Model(&entry).Column("deleted_at").Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Exec(ctx)

	if err != nil {
		return nil, err
	}

	return &entry, nil
}

// CreateUserCompetence is the resolver for the createUserCompetence field.
func (r *mutationResolver) CreateUserCompetence(ctx context.Context, input model.CreateUserCompetenceInput) (*db.UserCompetence, error) {
	panic(fmt.Errorf("not implemented: CreateUserCompetence - createUserCompetence"))
}

// ArchiveUserCompetence is the resolver for the archiveUserCompetence field.
func (r *mutationResolver) ArchiveUserCompetence(ctx context.Context, id string) (*db.UserCompetence, error) {
	panic(fmt.Errorf("not implemented: ArchiveUserCompetence - archiveUserCompetence"))
}

// CreateTag is the resolver for the createTag field.
func (r *mutationResolver) CreateTag(ctx context.Context, input model.CreateTagInput) (*db.Tag, error) {
	panic(fmt.Errorf("not implemented: CreateTag - createTag"))
}

// ArchiveTag is the resolver for the archiveTag field.
func (r *mutationResolver) ArchiveTag(ctx context.Context, id string) (*db.Tag, error) {
	panic(fmt.Errorf("not implemented: ArchiveTag - archiveTag"))
}

// CreateReport is the resolver for the createReport field.
func (r *mutationResolver) CreateReport(ctx context.Context, input model.CreateReportInput) (*db.Report, error) {
	panic(fmt.Errorf("not implemented: CreateReport - createReport"))
}

// UpdatePassword is the resolver for the updatePassword field.
func (r *mutationResolver) UpdatePassword(ctx context.Context, oldPassword string, newPassword string) (bool, error) {
	panic(fmt.Errorf("not implemented: UpdatePassword - updatePassword"))
}

// Owner is the resolver for the owner field.
func (r *organisationResolver) Owner(ctx context.Context, obj *db.Organisation) (*db.User, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var user db.User
	err := r.DB.NewSelect().Model(&user).Where("id = ?", obj.OwnerID).Where("organisation_id = ?", obj.ID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// Organisation is the resolver for the organisation field.
func (r *queryResolver) Organisation(ctx context.Context) (*db.Organisation, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var organisation db.Organisation
	err := r.DB.NewSelect().Model(&organisation).Where("id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &organisation, nil
}

// Users is the resolver for the users field.
func (r *queryResolver) Users(ctx context.Context, limit *int, offset *int, filter *model.UserFilterInput, search *string) (*model.UserConnection, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	// query the users
	var users []*db.User
	query := r.DB.NewSelect().Model(&users).Where("organisation_id = ?", currentUser.OrganisationID)

	if filter.Role != nil {
		query.Where("role IN (?)", bun.In(filter.Role))
	}

	count, err := query.ScanAndCount(ctx)
	if err != nil {
		return nil, err
	}

	return &model.UserConnection{
		Edges:      users,
		PageInfo:   nil,
		TotalCount: count,
	}, nil
}

// User is the resolver for the user field.
func (r *queryResolver) User(ctx context.Context, id string) (*db.User, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var user db.User
	err := r.DB.NewSelect().Model(&user).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// Competence is the resolver for the competence field.
func (r *queryResolver) Competence(ctx context.Context, id string) (*db.Competence, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var competence db.Competence
	err := r.DB.NewSelect().Model(&competence).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &competence, nil
}

// Competences is the resolver for the competences field.
func (r *queryResolver) Competences(ctx context.Context, limit *int, offset *int, filter *model.CompetenceFilterInput, search *string) (*model.CompetenceConnection, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var pageLimit = 10
	if limit != nil {
		pageLimit = *limit
	}

	var pageOffset = 0
	if offset != nil {
		pageOffset = *offset
	}

	var competences []*db.Competence
	query := r.DB.NewSelect().
		Model(&competences).
		Where("organisation_id = ?", currentUser.OrganisationID).
		Limit(pageLimit).
		Offset(pageOffset)

	if search != nil {
		query.Where("name ILIKE ?", fmt.Sprintf("%%%s%%", *search))
	}

	if filter != nil {
		if filter.Type != nil {
			if len(filter.Type) == 1 {
				query.Where("competence_type = ?", filter.Type[0])
			} else {
				query.Where("competence_type IN (?)", bun.In(filter.Type))
			}
		}

		if filter.Parents != nil {
			if len(filter.Parents) == 1 {
				query.Where("competence_id = ?", filter.Parents[0])
			} else {
				query.Where("competence_id IN (?)", bun.In(filter.Parents))
			}
		}
	}

	count, err := query.ScanAndCount(ctx)

	if err != nil {
		return nil, err
	}

	return &model.CompetenceConnection{
		Edges:      competences,
		PageInfo:   nil,
		TotalCount: count,
	}, nil
}

// Entry is the resolver for the entry field.
func (r *queryResolver) Entry(ctx context.Context, id string) (*db.Entry, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var entry db.Entry
	err := r.DB.NewSelect().Model(&entry).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &entry, nil
}

// Entries is the resolver for the entries field.
func (r *queryResolver) Entries(ctx context.Context, limit *int, offset *int, filter *model.EntryFilterInput, search *string) (*model.EntryConnection, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	pageLimit := 10
	if limit != nil {
		pageLimit = *limit
	}

	pageOffset := 0
	if offset != nil {
		pageOffset = *offset
	}

	var entries []*db.Entry
	count, err := r.DB.NewSelect().Model(&entries).Where("organisation_id = ?", currentUser.OrganisationID).Limit(pageLimit).Offset(pageOffset).Order("created_at DESC").ScanAndCount(ctx)
	if err != nil {
		return nil, err
	}

	return &model.EntryConnection{
		Edges:      entries,
		PageInfo:   nil,
		TotalCount: count,
	}, nil
}

// Event is the resolver for the event field.
func (r *queryResolver) Event(ctx context.Context, id string) (*db.Event, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var event db.Event
	err := r.DB.NewSelect().Model(&event).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &event, nil
}

// Events is the resolver for the events field.
func (r *queryResolver) Events(ctx context.Context, limit *int, offset *int, filter *model.EventFilterInput, search *string) (*model.EventConnection, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	pageLimit := 10
	if limit != nil {
		pageLimit = *limit
	}

	pageOffset := 0
	if offset != nil {
		pageOffset = *offset
	}

	var events []*db.Event
	count, err := r.DB.NewSelect().Model(&events).Where("organisation_id = ?", currentUser.OrganisationID).Limit(pageLimit).Offset(pageOffset).ScanAndCount(ctx)
	if err != nil {
		return nil, err
	}

	return &model.EventConnection{
		Edges:      events,
		PageInfo:   nil,
		TotalCount: count,
	}, nil
}

// Report is the resolver for the report field.
func (r *queryResolver) Report(ctx context.Context, id string) (*db.Report, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	// query the report
	var report db.Report
	err := r.DB.NewSelect().Model(&report).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &report, nil
}

// Reports is the resolver for the reports field.
func (r *queryResolver) Reports(ctx context.Context, limit *int, offset *int) (*model.ReportConnection, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	pageLimit := 10
	if limit != nil {
		pageLimit = *limit
	}

	pageOffset := 0
	if offset != nil {
		pageOffset = *offset
	}

	var reports []*db.Report
	count, err := r.DB.NewSelect().Model(&reports).Where("organisation_id = ?", currentUser.OrganisationID).Limit(pageLimit).Offset(pageOffset).ScanAndCount(ctx)
	if err != nil {
		return nil, err
	}

	return &model.ReportConnection{
		Edges:      reports,
		PageInfo:   nil,
		TotalCount: count,
	}, nil
}

// Tag is the resolver for the tag field.
func (r *queryResolver) Tag(ctx context.Context, id string) (*db.Tag, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var tag db.Tag
	err := r.DB.NewSelect().Model(&tag).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &tag, nil
}

// Tags is the resolver for the tags field.
func (r *queryResolver) Tags(ctx context.Context, limit *int, offset *int) ([]*db.Tag, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	pageLimit := 10
	if limit != nil {
		pageLimit = *limit
	}

	pageOffset := 0
	if offset != nil {
		pageOffset = *offset
	}

	var tags []*db.Tag
	err := r.DB.NewSelect().Model(&tags).Where("organisation_id = ?", currentUser.OrganisationID).Limit(pageLimit).Offset(pageOffset).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return tags, nil
}

// File is the resolver for the file field.
func (r *queryResolver) File(ctx context.Context, id string) (*db.File, error) {
	panic(fmt.Errorf("not implemented: File - file"))
}

// Files is the resolver for the files field.
func (r *queryResolver) Files(ctx context.Context, limit *int, offset *int) ([]*db.File, error) {
	panic(fmt.Errorf("not implemented: Files - files"))
}

// Meta is the resolver for the meta field.
func (r *reportResolver) Meta(ctx context.Context, obj *db.Report) (string, error) {
	/// meta is a jsonb field, so we need to unmarshal it
	var meta map[string]interface{}
	err := json.Unmarshal(obj.Meta.RawMessage, &meta)
	if err != nil {
		return "", err
	}

	// return meta as a string
	return fmt.Sprintf("%v", meta), nil
}

// User is the resolver for the user field.
func (r *reportResolver) User(ctx context.Context, obj *db.Report) (*db.User, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var user db.User
	err := r.DB.NewSelect().Model(&user).Where("id = ?", obj.UserID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// StudentUser is the resolver for the studentUser field.
func (r *reportResolver) StudentUser(ctx context.Context, obj *db.Report) (*db.User, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var user db.User
	err := r.DB.NewSelect().Model(&user).Where("id = ?", obj.StudentUserID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// File is the resolver for the file field.
func (r *reportResolver) File(ctx context.Context, obj *db.Report) (*db.File, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var file db.File
	err := r.DB.NewSelect().Model(&file).Where("id = ?", obj.FileID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &file, nil
}

// DeletedAt is the resolver for the deletedAt field.
func (r *reportResolver) DeletedAt(ctx context.Context, obj *db.Report) (*time.Time, error) {
	panic(fmt.Errorf("not implemented: DeletedAt - deletedAt"))
}

// Color is the resolver for the color field.
func (r *tagResolver) Color(ctx context.Context, obj *db.Tag) (string, error) {
	if obj.Color.Valid {
		return obj.Color.String, nil
	}

	return "", nil
}

// DeletedAt is the resolver for the deletedAt field.
func (r *tagResolver) DeletedAt(ctx context.Context, obj *db.Tag) (*time.Time, error) {
	panic(fmt.Errorf("not implemented: DeletedAt - deletedAt"))
}

// DeletedAt is the resolver for the deletedAt field.
func (r *userResolver) DeletedAt(ctx context.Context, obj *db.User) (*time.Time, error) {
	if obj.DeletedAt.IsZero() {
		return &obj.DeletedAt.Time, nil
	}

	return nil, nil
}

// Competence is the resolver for the competence field.
func (r *userCompetenceResolver) Competence(ctx context.Context, obj *db.UserCompetence) (*db.Competence, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var competence db.Competence
	err := r.DB.NewSelect().Model(&competence).Where("id = ?", obj.CompetenceID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &competence, nil
}

// Entry is the resolver for the entry field.
func (r *userCompetenceResolver) Entry(ctx context.Context, obj *db.UserCompetence) (*db.Entry, error) {
	panic(fmt.Errorf("not implemented: Entry - entry"))
}

// User is the resolver for the user field.
func (r *userCompetenceResolver) User(ctx context.Context, obj *db.UserCompetence) (*db.User, error) {
	panic(fmt.Errorf("not implemented: User - user"))
}

// Competence returns CompetenceResolver implementation.
func (r *Resolver) Competence() CompetenceResolver { return &competenceResolver{r} }

// Entry returns EntryResolver implementation.
func (r *Resolver) Entry() EntryResolver { return &entryResolver{r} }

// Event returns EventResolver implementation.
func (r *Resolver) Event() EventResolver { return &eventResolver{r} }

// File returns FileResolver implementation.
func (r *Resolver) File() FileResolver { return &fileResolver{r} }

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Organisation returns OrganisationResolver implementation.
func (r *Resolver) Organisation() OrganisationResolver { return &organisationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

// Report returns ReportResolver implementation.
func (r *Resolver) Report() ReportResolver { return &reportResolver{r} }

// Tag returns TagResolver implementation.
func (r *Resolver) Tag() TagResolver { return &tagResolver{r} }

// User returns UserResolver implementation.
func (r *Resolver) User() UserResolver { return &userResolver{r} }

// UserCompetence returns UserCompetenceResolver implementation.
func (r *Resolver) UserCompetence() UserCompetenceResolver { return &userCompetenceResolver{r} }

type competenceResolver struct{ *Resolver }
type entryResolver struct{ *Resolver }
type eventResolver struct{ *Resolver }
type fileResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type organisationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type reportResolver struct{ *Resolver }
type tagResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
type userCompetenceResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//   - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//     it when you're done.
//   - You have helper methods in this file. Move them out to keep these resolver files clean.
func isStringInArray(s string, a []string) bool {
	for _, v := range a {
		if v == s {
			return true
		}
	}

	return false
}

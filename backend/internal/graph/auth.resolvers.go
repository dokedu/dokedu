package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.40

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/dokedu/dokedu/backend/internal/database/db"
	"github.com/dokedu/dokedu/backend/internal/graph/model"
	"github.com/dokedu/dokedu/backend/internal/middleware"
	"github.com/dokedu/dokedu/backend/internal/msg"
	"github.com/jackc/pgx/v5/pgtype"
	gonanoid "github.com/matoous/go-nanoid/v2"
	"golang.org/x/crypto/bcrypt"
)

// SendUserInvite is the resolver for the sendUserInvite field.
func (r *mutationResolver) SendUserInvite(ctx context.Context, id string) (bool, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return false, nil
	}

	// Get the user
	user, err := r.DB.UserById(ctx, db.UserByIdParams{
		ID:             id,
		OrganisationID: currentUser.OrganisationID,
	})
	if err != nil {
		return false, err
	}

	// Get the organisation
	organisation, err := r.DB.GLOBAL_OrganisationById(ctx, currentUser.OrganisationID)
	if err != nil {
		return false, err
	}

	// Email the user
	token := gonanoid.Must(32)
	user, err = r.DB.UpdateUserRecoveryToken(ctx, db.UpdateUserRecoveryTokenParams{
		RecoveryToken:  pgtype.Text{String: token, Valid: true},
		ID:             user.ID,
		OrganisationID: currentUser.OrganisationID,
	})
	if err != nil {
		return false, err
	}

	err = r.Mailer.SendInvite(user.Email.String, user.FirstName, organisation.Name, currentUser.Language.UserLang, token)
	if err != nil {
		return false, err
	}

	return true, nil
}

// AcceptInvite is the resolver for the acceptInvite field.
func (r *mutationResolver) AcceptInvite(ctx context.Context, token string, input model.SignUpInput) (*model.SignInPayload, error) {
	panic(fmt.Errorf("not implemented: AcceptInvite - acceptInvite"))
}

// SignIn is the resolver for the signIn field.
func (r *mutationResolver) SignIn(ctx context.Context, input model.SignInInput) (*model.SignInPayload, error) {
	//err := r.DB.NewSelect().Model(&user).Where("email = ?", strings.ToLower(input.Email)).Scan(ctx)
	user, err := r.DB.GLOBAL_UserByEmail(ctx, pgtype.Text{String: strings.ToLower(input.Email), Valid: true})
	if err != nil {
		return nil, msg.ErrInvalidEmailOrPassword
	}

	organisation, err := r.DB.GLOBAL_OrganisationById(ctx, user.OrganisationID)
	if err != nil {
		return nil, msg.ErrInvalidEmailOrPassword
	}

	// user.Password is a sql.NullString, so we need to check if it is valid
	if !user.Password.Valid {
		return nil, msg.ErrInvalidEmailOrPassword
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password.String), []byte(input.Password)); err != nil {
		return nil, msg.ErrInvalidEmailOrPassword
	}

	// Generate a new token
	token, err := gonanoid.New(32)
	if err != nil {
		return nil, errors.New("unable to generate a token")
	}

	_, err = r.DB.GLOBAL_CreateSession(ctx, db.GLOBAL_CreateSessionParams{
		UserID: user.ID,
		Token:  token,
	})
	if err != nil {
		return nil, errors.New("unable to generate a token")
	}

	return &model.SignInPayload{
		Token:        token,
		User:         &user,
		Organisation: &organisation,
	}, nil
}

// ResetPassword is the resolver for the resetPassword field.
func (r *mutationResolver) ResetPassword(ctx context.Context, input model.ResetPasswordInput) (*model.ResetPasswordPayload, error) {
	currentUser, err := middleware.GetUser(ctx)
	if currentUser != nil {
		return nil, errors.New("you are already signed in")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("unable to hash the password")
	}

	user, err := r.DB.UpdateUserPassword(ctx, db.UpdateUserPasswordParams{
		Password:       pgtype.Text{String: string(hashedPassword), Valid: true},
		ID:             currentUser.ID,
		OrganisationID: currentUser.OrganisationID,
	})
	if err != nil {
		return nil, errors.New("unable to update the password")
	}

	_, err = r.DB.UpdateEmailAccountPassword(ctx, db.UpdateEmailAccountPasswordParams{
		Password:       pgtype.Text{String: string(hashedPassword), Valid: true},
		ID:             user.ID,
		OrganisationID: user.OrganisationID,
	})
	if !errors.Is(err, sql.ErrNoRows) {
		return nil, errors.New("unable to update the email account password")
	}

	return &model.ResetPasswordPayload{
		User:  &user,
		Token: "",
	}, nil
}

// ForgotPassword is the resolver for the forgotPassword field.
func (r *mutationResolver) ForgotPassword(ctx context.Context, input model.ForgotPasswordInput) (bool, error) {
	user, err := r.DB.GLOBAL_UserByEmail(ctx, pgtype.Text{String: strings.ToLower(input.Email), Valid: true})
	if err != nil {
		return false, nil
	}

	// Generate a new token
	token := gonanoid.Must(32)

	// Update the user with the new token
	_, err = r.DB.UpdateUserRecoveryToken(ctx, db.UpdateUserRecoveryTokenParams{
		RecoveryToken:  pgtype.Text{String: token, Valid: true},
		ID:             user.ID,
		OrganisationID: user.OrganisationID,
	})
	if err != nil {
		return false, nil
	}

	// Send the email to the user
	err = r.Mailer.SendPasswordReset(input.Email, user.FirstName, user.Language.UserLang, token)
	if err != nil {
		return false, nil
	}

	return true, nil
}

// SignOut is the resolver for the signOut field.
func (r *mutationResolver) SignOut(ctx context.Context) (bool, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return false, msg.ErrUnauthenticated
	}

	// TODO: migrate session tracking to a separate table and hard delete the sessions
	err := r.DB.GLOBAL_DeleteSessionsByUserID(ctx, currentUser.ID)
	if err != nil {
		return false, errors.New("unable to sign out")
	}

	return true, nil
}

// UpdatePassword is the resolver for the updatePassword field.
func (r *mutationResolver) UpdatePassword(ctx context.Context, oldPassword string, newPassword string) (bool, error) {
	panic(fmt.Errorf("not implemented: UpdatePassword - updatePassword"))
}

// InviteDetails is the resolver for the inviteDetails field.
func (r *queryResolver) InviteDetails(ctx context.Context, token string) (*model.InviteDetailsPayload, error) {
	user, err := r.DB.GLOBAL_UserByRecoveryToken(ctx, pgtype.Text{String: token, Valid: true})
	if err != nil {
		return nil, errors.New("invalid token")
	}

	if user.RecoverySentAt.Time.Before(time.Now().Add(-time.Hour * 24)) {
		return nil, errors.New("token expired")
	}

	return &model.InviteDetailsPayload{
		Email:     user.Email.String,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}, nil
}

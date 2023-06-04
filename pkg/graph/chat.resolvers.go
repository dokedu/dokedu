package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.29

import (
	"context"
	"errors"
	"example/pkg/db"
	"example/pkg/graph/model"
	"example/pkg/middleware"
	"fmt"
)

// Name is the resolver for the name field.
func (r *chatResolver) Name(ctx context.Context, obj *db.Chat) (*string, error) {
	if obj.Name.Valid {
		return &obj.Name.String, nil
	}

	return nil, nil
}

// ChatUsers is the resolver for the chatUsers field.
func (r *chatResolver) ChatUsers(ctx context.Context, obj *db.Chat) ([]*db.ChatUser, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var chatUser []*db.ChatUser
	err := r.DB.NewSelect().Model(&chatUser).Where("chat_id = ?", obj.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return chatUser, nil
}

// ChatMessages is the resolver for the chatMessages field.
func (r *chatResolver) ChatMessages(ctx context.Context, obj *db.Chat) ([]*db.ChatMessage, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var chatMessage []*db.ChatMessage
	err := r.DB.NewSelect().Model(&chatMessage).Where("chat_id = ?", obj.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return chatMessage, nil
}

// Chat is the resolver for the chat field.
func (r *chatMessageResolver) Chat(ctx context.Context, obj *db.ChatMessage) (*db.Chat, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var chat db.Chat
	err := r.DB.NewSelect().Model(&chat).Where("id = ?", obj.ChatID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &chat, nil
}

// User is the resolver for the user field.
func (r *chatMessageResolver) User(ctx context.Context, obj *db.ChatMessage) (*db.User, error) {
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

// Chat is the resolver for the chat field.
func (r *chatUserResolver) Chat(ctx context.Context, obj *db.ChatUser) (*db.Chat, error) {
	currentUser := middleware.ForContext(ctx)
	if currentUser == nil {
		return nil, errors.New("no user found in the context")
	}

	var chat db.Chat
	err := r.DB.NewSelect().Model(&chat).Where("id = ?", obj.ChatID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &chat, nil
}

// User is the resolver for the user field.
func (r *chatUserResolver) User(ctx context.Context, obj *db.ChatUser) (*db.User, error) {
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

// Chat is the resolver for the chat field.
func (r *queryResolver) Chat(ctx context.Context, id string) (*db.Chat, error) {
	panic(fmt.Errorf("not implemented: Chat - chat"))
}

// Chats is the resolver for the chats field.
func (r *queryResolver) Chats(ctx context.Context, limit *int, offset *int) (*model.ChatConnection, error) {
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

	var chats []*db.Chat
	count, err := r.DB.NewSelect().Model(&chats).Where("organisation_id = ?", currentUser.OrganisationID).Limit(pageLimit).Offset(pageOffset).ScanAndCount(ctx)
	if err != nil {
		return nil, err
	}

	return &model.ChatConnection{
		Edges:      chats,
		PageInfo:   nil,
		TotalCount: count,
	}, nil
}

// Chat returns ChatResolver implementation.
func (r *Resolver) Chat() ChatResolver { return &chatResolver{r} }

// ChatMessage returns ChatMessageResolver implementation.
func (r *Resolver) ChatMessage() ChatMessageResolver { return &chatMessageResolver{r} }

// ChatUser returns ChatUserResolver implementation.
func (r *Resolver) ChatUser() ChatUserResolver { return &chatUserResolver{r} }

type chatResolver struct{ *Resolver }
type chatMessageResolver struct{ *Resolver }
type chatUserResolver struct{ *Resolver }

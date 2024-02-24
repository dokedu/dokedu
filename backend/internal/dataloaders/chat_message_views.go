package dataloaders

import (
	"context"

	"github.com/dokedu/dokedu/backend/internal/database/db"

	"github.com/dokedu/dokedu/backend/internal/middleware"

	"github.com/graph-gophers/dataloader"
	"github.com/labstack/gommon/log"
)

func (u *Reader) getChatMessageView(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil
	}

	IDs := make([]string, len(keys))
	for ix, key := range keys {
		IDs[ix] = key.String()
	}

	chatMessageViews, err := u.conn.ChatMessageViewsByChatMessageAndUser(ctx, db.ChatMessageViewsByChatMessageAndUserParams{
		ChatMessageIds: IDs,
		UserID:         currentUser.ID,
		OrganisationID: currentUser.OrganisationID,
	})
	if err != nil {
		return nil
	}

	// return users in the same order requested
	output := make([]*dataloader.Result, len(keys))
	for ix := range keys {
		output[ix] = &dataloader.Result{Data: nil}
	}

	if err != nil {
		log.Error(err)
		return output
	}

	for ix, key := range keys {
		for _, chatMessageView := range chatMessageViews {
			if chatMessageView.ChatMessageID == key.String() {
				output[ix] = &dataloader.Result{Data: &chatMessageView}
				break
			}
		}
	}

	return output
}

func GetChatMessageView(ctx context.Context, chatMessageID string) (*db.ChatMessageView, error) {
	loaders := For(ctx)
	thunk := loaders.ChatMessageLoader.Load(ctx, dataloader.StringKey(chatMessageID))
	result, err := thunk()
	if err != nil {
		return nil, err
	}
	if result == nil {
		return nil, nil
	}
	return result.(*db.ChatMessageView), nil
}

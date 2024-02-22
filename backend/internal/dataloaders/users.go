package dataloaders

import (
	"context"
	"log"

	"github.com/dokedu/dokedu/backend/internal/database/db"
	"github.com/dokedu/dokedu/backend/internal/middleware"

	"github.com/graph-gophers/dataloader"
)

func (u *Reader) GetUser(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	ids := make([]string, len(keys))
	for ix, key := range keys {
		ids[ix] = key.String()
	}

	users, err := u.conn.GLOBAL_UsersByIds(ctx, ids)
	if err != nil {
		log.Fatal(err)
	}

	// return users in the same order requested
	output := make([]*dataloader.Result, len(keys))

	for ix, key := range keys {
		for _, user := range users {
			if user.ID == key.String() {
				output[ix] = &dataloader.Result{Data: &user}
				break
			}
		}
	}

	return output
}

func GetUser(ctx context.Context, id string, currentUser *middleware.UserContext) (*db.User, error) {
	loaders := For(ctx)
	thunk := loaders.UserLoader.Load(ctx, dataloader.StringKey(id))
	result, err := thunk()
	if err != nil {
		return nil, err
	}
	return result.(*db.User), nil
}

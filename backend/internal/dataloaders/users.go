package dataloaders

import (
	"context"
	"log"

	"example/internal/db"
	"example/internal/middleware"

	"github.com/graph-gophers/dataloader"
	"github.com/uptrace/bun"
)

func (u *Reader) GetUser(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	iDs := make([]string, len(keys))
	for ix, key := range keys {
		iDs[ix] = key.String()
	}

	var users []db.User
	err := u.conn.NewSelect().
		Model(&users).
		Where("id IN (?)", bun.In(iDs)).
		Scan(ctx)

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

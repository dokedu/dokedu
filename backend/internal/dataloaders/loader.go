package dataloaders

import (
	"context"
	"github.com/graph-gophers/dataloader"
	"github.com/labstack/echo/v4"
	"github.com/uptrace/bun"
)

type ctxKey string

const (
	loadersKey = ctxKey("dataloaders")
)

type Reader struct {
	conn *bun.DB
}

// Loaders wrap your data loaders to inject via middleware
type Loaders struct {
	CompetenceLoader  *dataloader.Loader
	UserLoader        *dataloader.Loader
	ChatMessageLoader *dataloader.Loader
}

// NewLoaders instantiates data loaders for the middleware
func NewLoaders(conn *bun.DB) *Loaders {
	// define the data loader
	reader := &Reader{conn: conn}
	loaders := &Loaders{
		CompetenceLoader:  dataloader.NewBatchedLoader(reader.GetCompetenceParents),
		UserLoader:        dataloader.NewBatchedLoader(reader.GetUser),
		ChatMessageLoader: dataloader.NewBatchedLoader(reader.getChatMessageView),
	}
	return loaders
}

func Middleware(loaders *Loaders) func(echo.HandlerFunc) echo.HandlerFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {

			ctx := context.WithValue(c.Request().Context(), loadersKey, loaders)
			c.SetRequest(c.Request().WithContext(ctx))

			return next(c)
		}
	}
}

// For returns the dataloader for a given context
func For(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey).(*Loaders)
}

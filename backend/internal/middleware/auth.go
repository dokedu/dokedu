package middleware

import (
	"context"
	"database/sql"
	"errors"
	"log/slog"
	"time"

	"github.com/dokedu/dokedu/backend/internal/database"
	"github.com/dokedu/dokedu/backend/internal/database/db"

	"github.com/dokedu/dokedu/backend/internal/msg"

	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/labstack/echo/v4"
)

type contextKey string

var UserCtxKey = contextKey("user")

func Auth(conn *database.DB) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			token := c.Request().Header.Get("Authorization")
			reqContext := c.Request().Context()

			userContext := AuthMiddlewareFunction(reqContext, conn, token)
			if userContext == nil {
				return next(c)
			}

			ctx := context.WithValue(c.Request().Context(), UserCtxKey, &userContext)
			c.SetRequest(c.Request().WithContext(ctx))

			return next(c)
		}
	}
}

func WebsocketInitFunc(conn *database.DB) transport.WebsocketInitFunc {
	return func(ctx context.Context, initPayload transport.InitPayload) (context.Context, *transport.InitPayload, error) {
		// read the authorization header from the init payload
		token := initPayload.Authorization()

		userContext := AuthMiddlewareFunction(ctx, conn, token)
		if userContext == nil {
			return ctx, nil, nil
		}

		ctx = context.WithValue(ctx, UserCtxKey, &userContext)

		return ctx, &initPayload, nil
	}
}

func AuthMiddlewareFunction(ctx context.Context, conn *database.DB, token string) *UserContext {
	// Allow unauthenticated users in
	if token == "" {
		return nil
	}

	session, err := conn.GLOBAL_SessionByToken(ctx, token)
	if err != nil {
		return nil
	}

	// Check if created at is no longer than 12 hours ago
	if session.CreatedAt.Add(12 * time.Hour).Before(time.Now()) {
		err := conn.GLOBAL_DeleteExpiredSession(ctx)
		if err != nil {
			slog.Error("unable to delete session for the database", "err", err)
		}

		return nil
	}

	user, err := conn.GLOBAL_UserById(ctx, session.UserID)
	if errors.Is(err, sql.ErrNoRows) {
		// Remove all sessions for this user if the user is deleted
		err := conn.GLOBAL_DeleteSessionsByUserID(ctx, session.UserID)
		if err != nil {
			slog.Error("unable to update sessions for deleted user", "err", err, "user_id", session.UserID)
		}

		return nil
	}

	return &UserContext{
		user,
		session.Token,
	}
}

// ForContext finds the user from the context. REQUIRES Middleware to have run.
func ForContext(ctx context.Context) *UserContext {
	raw, _ := ctx.Value(UserCtxKey).(*UserContext)
	return raw
}

type UserContext struct {
	db.User
	Token string
}

func (c UserContext) HasPermissionAdmin() bool {
	return c.Role == "admin" || c.Role == "owner"
}

// GetUser Helper function to get the current user from the context.
func GetUser(ctx context.Context) (*UserContext, error) {
	currentUser := ForContext(ctx)
	if currentUser == nil {
		return nil, msg.ErrUnauthorized
	}
	return currentUser, nil
}

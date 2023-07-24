package middleware

import (
	"context"
	"database/sql"
	"errors"
	"example/pkg/db"
	jwt "example/pkg/jwt"
	"github.com/99designs/gqlgen/graphql"
	"github.com/labstack/echo/v4"
	"github.com/uptrace/bun"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"net/http"
	"time"
)

var userCtxKey = "user"

func Auth(bun *bun.DB) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			header := c.Request().Header.Get("Authorization")

			// Allow unauthenticated users in
			if header == "" {
				return next(c)
			}

			// Check if session token is valid
			var session db.Session
			err := bun.NewSelect().Model(&session).Where("token = ?", header).Scan(c.Request().Context())
			if err == sql.ErrNoRows {
				//return c.JSON(http.StatusUnauthorized, "{'error': 'Unauthorized'}")
				return next(c)
			}
			if err != nil {
				return next(c)
				//return c.JSON(http.StatusUnauthorized, err)
			}

			// Check if created at is no longer than 12 hours ago
			if session.CreatedAt.Add(12 * time.Hour).Before(time.Now()) {
				// Delete the session
				_, err = bun.NewUpdate().Model(&session).Set("deleted_at = ?", time.Now()).Where("id = ?", session.ID).Exec(c.Request().Context())

				return next(c)
				//return c.JSON(http.StatusUnauthorized, "Session expired")
			}

			// Get the user
			var user db.User
			err = bun.NewSelect().Model(&user).Where("id = ?", session.UserID).Scan(c.Request().Context())

			userContext := UserContext{
				user,
				session.Token,
			}

			ctx := context.WithValue(c.Request().Context(), userCtxKey, &userContext)
			c.SetRequest(c.Request().WithContext(ctx))

			return next(c)
		}
	}
}

func TestAuth(signer jwt.Signer) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := r.Header.Get("Authorization")

			// Allow unauthenticated users in
			if header == "" {
				next.ServeHTTP(w, r)
				return
			}

			// Check if the header is valid
			claims, err := signer.ParseAndValidate(header)
			if err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}

			user := claims.User
			ctx := context.WithValue(r.Context(), userCtxKey, &user)
			r = r.WithContext(ctx)

			next.ServeHTTP(w, r)
		})
	}
}

// ForContext finds the user from the context. REQUIRES Middleware to have run.
func ForContext(ctx context.Context) *UserContext {
	raw, _ := ctx.Value(userCtxKey).(*UserContext)
	return raw
}

type UserContext struct {
	db.User
	Token string
}

func (c UserContext) HasPermissionAdmin() bool {
	return c.Role == "admin" || c.Role == "owner"
}

// Helper function to get the current user from the context.
func GetUser(ctx context.Context) (*UserContext, error) {
	currentUser := ForContext(ctx)
	if currentUser == nil {
		graphql.AddError(ctx, &gqlerror.Error{
			Message: "no user found in the context",
			Extensions: map[string]interface{}{
				"code": "UNAUTHENTICATED",
			},
		})
		return nil, errors.New("no user found in the context")
	}
	return currentUser, nil
}

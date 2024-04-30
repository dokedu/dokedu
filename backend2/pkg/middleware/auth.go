package middleware

import (
	"context"
	"net/http"

	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/trace"

	"github.com/dokedu/dokedu/backend/pkg/services/database"
	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

type contextKey string

var UserCtxKey = contextKey("user")

func Auth(conn *database.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			token := r.Header.Get("Authorization")

			// Allow unauthenticated users in
			if token == "" {
				next.ServeHTTP(w, r)
				return
			}

			// Find user by token
			user, err := conn.UserFindByValidSessionToken(ctx, token)
			if err != nil {
				next.ServeHTTP(w, r)
				return
			}

			userContext := &UserContext{
				user,
				token,
			}

			span := trace.SpanFromContext(ctx)
			span.AddEvent("AuthMiddleware", trace.WithAttributes(attribute.String("user_id", user.ID)))

			ctx = context.WithValue(ctx, UserCtxKey, userContext)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

type UserContext struct {
	db.User
	Token string
}

func (c UserContext) HasPermissionAdmin() bool {
	return c.Role == "admin" || c.Role == "owner"
}
func (c UserContext) HasPermissionTeacher() bool {
	return c.Role == "teacher" || c.HasPermissionAdmin()
}

// GetUser Helper function to get the current user from the context.
func GetUser(ctx context.Context) (*UserContext, bool) {
	raw, ok := ctx.Value(UserCtxKey).(*UserContext)
	return raw, ok && raw != nil
}

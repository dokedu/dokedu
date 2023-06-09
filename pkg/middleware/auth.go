package middleware

import (
	"context"
	jwt "example/pkg/jwt"
	"github.com/labstack/echo/v4"
	"net/http"
)

var userCtxKey = "user"

func Auth(signer jwt.Signer) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			header := c.Request().Header.Get("Authorization")

			// Allow unauthenticated users in
			if header == "" {
				return next(c)
			}

			// Check if the header is valid
			claims, err := signer.ParseAndValidate(header)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"message": err.Error(),
				})
			}

			user := claims.User
			ctx := context.WithValue(c.Request().Context(), userCtxKey, &user)
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
func ForContext(ctx context.Context) *jwt.User {
	raw, _ := ctx.Value(userCtxKey).(*jwt.User)
	return raw
}

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

// ForContext finds the user from the context. REQUIRES Middleware to have run.
func ForContext(ctx context.Context) *jwt.User {
	raw, _ := ctx.Value(userCtxKey).(*jwt.User)
	return raw
}

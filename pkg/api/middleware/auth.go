package middleware

import (
	"example/pkg/helper"
	jwt "example/pkg/jwt"
	"github.com/labstack/echo/v4"
	"net/http"
	"strings"
)

func Auth(signer jwt.Signer) func(echo.HandlerFunc) echo.HandlerFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			ctx := c.(helper.APIContext)

			authHeader := c.Request().Header.Get("Authorization")
			authHeader = strings.TrimPrefix(authHeader, "Bearer ")

			if authHeader != "" {
				claims, err := signer.ParseAndValidate(authHeader)
				if err != nil {
					// TODO: return echo.NewHTTPError(http.StatusUnauthorized, status.ErrUnauthorized)
					return echo.NewHTTPError(http.StatusUnauthorized, "Unauthorized")
				}

				ctx.Claims = claims
			}

			return next(ctx)
		}
	}
}

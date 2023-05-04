package middleware

import (
	jwt "example/pkg/jwt"
	"github.com/labstack/echo/v4"
)

func Auth(signer jwt.Signer) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			return next(c)
		}
	}
}

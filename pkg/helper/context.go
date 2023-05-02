package helper

import (
	"context"
	"example/pkg/db"
	"example/pkg/jwt"
	"github.com/labstack/echo/v4"
)

type APIContext struct {
	echo.Context
	Tx     *db.DBTX
	Claims jwt.Claims
}

type HTTPContext struct {
	context.Context

	Tx     *db.DBTX
	Claims jwt.Claims
}

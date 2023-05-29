package main

import (
	"database/sql"
	"example/pkg/graph"
	"example/pkg/jwt"
	"example/pkg/middleware"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/labstack/echo/v4"
	"log"
	"net/http"
	"os"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"

	_ "github.com/lib/pq"
)

const defaultPort = "8080"
const jwtSecret = "12345678"

func main() {
	signer := jwt.NewSigner(jwtSecret)

	dsn := "postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable"
	// dsn := "unix://user:pass@dbname/var/run/postgresql/.s.PGSQL.5432"
	dbConn := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))

	db := bun.NewDB(dbConn, pgdialect.New())

	e := echo.New()
	e.Use(middleware.Auth(signer))

	// add options handler
	e.OPTIONS("/*", func(c echo.Context) error {
		return c.String(http.StatusOK, "")
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	e.Use(middleware.CORS())

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{
		DB: db,
	}}))

	srv.AddTransport(&transport.Websocket{})

	playgroundHandler := playground.Handler("GraphQL playground", "/query")

	e.GET("/playground", func(c echo.Context) error {
		playgroundHandler.ServeHTTP(c.Response(), c.Request())
		return nil
	})

	e.POST("/query", func(c echo.Context) error {
		srv.ServeHTTP(c.Response(), c.Request())
		return nil
	})

	// Add a health check endpoint
	e.Any("/up", func(e echo.Context) error {
		err := e.String(http.StatusOK, "up")
		if err != nil {
			log.Fatal(err)
		}
		return nil
	})

	// Start server
	e.Logger.Fatal(e.Start("0.0.0.0:" + port))
}

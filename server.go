package main

import (
	"database/sql"
	"example/pkg/api/middleware"
	"example/pkg/db"
	"example/pkg/graph"
	"example/pkg/jwt"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/labstack/echo/v4"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"

	_ "github.com/lib/pq"
)

const defaultPort = "8080"

func main() {
	// TODO: move jwt secret to env
	signer := jwt.NewSigner("12345678")

	dbConn, err := sql.Open("postgres", "user=postgres password=postgres dbname=postgres sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}

	// close db connection
	defer func(dbConn *sql.DB) {
		err := dbConn.Close()
		if err != nil {
			log.Fatal(err)
		}
	}(dbConn)

	e := echo.New()

	queries := db.New(dbConn)

	e.Use(middleware.Auth(signer))

	// add options handler
	e.OPTIONS("/*", func(c echo.Context) error {
		return c.String(http.StatusOK, "")
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	// add cors
	e.Use(middleware.CORS())

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{
		DB: queries,
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
	e.Logger.Fatal(e.Start("localhost:" + port))
}

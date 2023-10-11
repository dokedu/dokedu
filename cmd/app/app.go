package main

import (
	"context"
	"database/sql"
	"example/internal/dataloaders"
	"example/internal/graph"
	"example/internal/mail"
	"example/internal/middleware"
	"example/internal/modules/meilisearch"
	"example/internal/modules/minio"
	"example/internal/services/report_generation"
	"example/internal/services/report_generation/config"
	"fmt"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/labstack/echo/v4"
	mware "github.com/labstack/echo/v4/middleware"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"
)

const defaultPort = "1323"

func main() {
	// Allows us to cancel the context when we want to stop the server
	// And hence gracefully stop the server
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	var mailPort int
	mailPort, err = strconv.Atoi(os.Getenv("SMTP_PORT"))

	mailer, err := mail.New(mail.Config{
		Host:     os.Getenv("SMTP_HOST"),
		Port:     mailPort,
		Username: os.Getenv("SMTP_USERNAME"),
		Password: os.Getenv("SMTP_PASSWORD"),
	})
	if err != nil {
		log.Fatal(err, "Error loading .env file")
	}

	//dsn := "postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable"
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", os.Getenv("DB_USER"),
		os.Getenv("DB_PASS"), os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_NAME"))
	// dsn := "unix://user:pass@dbname/var/run/postgresql/.s.PGSQL.5432"
	dbConn := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))

	dbClient := bun.NewDB(dbConn, pgdialect.New())

	// Print all queries to stdout.
	dbClient.AddQueryHook(bundebug.NewQueryHook(bundebug.WithVerbose(true)))

	minioClient := minio.NewClient()
	repGen := report_generation.
		NewReportGenerationService(config.ReportGenerationConfig{
			DB:    dbClient,
			MinIO: minioClient,
		}, ctx, 3)

	meili, err := meilisearch.NewMeiliClient()
	if err != nil {
		log.Fatal(err)
	}

	go func() {
		bgCtx := context.Background()
		err := meili.GenerateCompetenceIndex(bgCtx, dbClient)
		if err != nil {
			log.Fatal(err)
		}
	}()

	e := echo.New()

	// Add dataloader middleware
	loader := dataloaders.NewLoaders(dbClient)
	e.Use(dataloaders.Middleware(loader))

	e.Use(mware.CORS())
	e.Use(mware.BodyLimit("5G"))
	e.Use(mware.RateLimiter(mware.NewRateLimiterMemoryStore(60)))

	// Auth
	e.Use(middleware.Auth(dbClient))

	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{
		DB:            dbClient,
		MinioClient:   minioClient,
		Mailer:        mailer,
		ReportService: repGen,
		Meili:         meili,
	}}))

	var gb int64 = 1 << 30

	srv.AddTransport(transport.Websocket{
		KeepAlivePingInterval: 10 * time.Second,
	})
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})
	srv.AddTransport(transport.MultipartForm{
		// 5 GB
		MaxMemory:     5 * gb,
		MaxUploadSize: 5 * gb,
	})

	srv.SetQueryCache(lru.New(1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New(100),
	})

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
	e.GET("/up", func(e echo.Context) error {
		return e.String(http.StatusOK, "up")
	})

	// Start server
	e.Logger.Fatal(e.Start(":" + defaultPort))
}

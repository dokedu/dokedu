package main

import (
	"context"
	"database/sql"
	"example/pkg/graph"
	"example/pkg/mail"
	"example/pkg/middleware"
	"example/pkg/modules"
	"example/pkg/services/report_generation"
	"example/pkg/services/report_generation/config"
	"fmt"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/labstack/echo/v4"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"log"
	"net/http"
	"os"
	"strconv"

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

	minioClient := minioClient()
	repGen := report_generation.
		NewReportGenerationService(config.ReportGenerationConfig{
			DB:    dbClient,
			MinIO: minioClient,
		}, ctx, 3)

	meili, err := modules.NewMeiliClient()
	if err != nil {
		log.Fatal(err)
	}

	// Generate the competence index in the background
	go func() {
		err := meili.GenerateCompetenceIndex(ctx, dbClient)
		if err != nil {
			log.Fatal(err)
		}
	}()

	e := echo.New()

	e.Use(middleware.CORS())

	// Auth
	e.Use(middleware.Auth(dbClient))

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{
		DB:            dbClient,
		MinioClient:   minioClient,
		Mailer:        mailer,
		ReportService: repGen,
		Meili:         meili,
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
	e.Logger.Fatal(e.Start("0.0.0.0:" + defaultPort))
}

func minioClient() *minio.Client {
	host := os.Getenv("MINIO_HOST")
	port := os.Getenv("MINIO_PORT")
	sslVal := os.Getenv("MINIO_SSL")
	ssl := true

	if sslVal == "false" {
		ssl = false
	}

	//endpoint := "localhost:9000"
	endpoint := host + ":" + port
	accessKeyID := os.Getenv("MINIO_ACCESS_KEY_ID")
	secretAccessKey := os.Getenv("MINIO_SECRET_ACCESS_KEY")

	// Initialize minio client object.
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: ssl,
	})
	if err != nil {
		log.Fatalln(err)
	}

	return minioClient
}

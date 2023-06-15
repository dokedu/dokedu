package main

import (
	"database/sql"
	"example/pkg/graph"
	"example/pkg/jwt"
	"example/pkg/mail"
	"example/pkg/middleware"
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
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"

	_ "github.com/lib/pq"
)

const defaultPort = "8080"
const jwtSecret = "12345678"

func main() {
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

	signer := jwt.NewSigner(jwtSecret)

	dsn := "postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable"
	// dsn := "unix://user:pass@dbname/var/run/postgresql/.s.PGSQL.5432"
	dbConn := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))

	db := bun.NewDB(dbConn, pgdialect.New())

	// Print all queries to stdout.
	db.AddQueryHook(bundebug.NewQueryHook(bundebug.WithVerbose(true)))

	minioClient := minioClient()

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
		DB:          db,
		MinioClient: minioClient,
		Mailer:      mailer,
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

func minioClient() *minio.Client {
	endpoint := "localhost:9000"
	accessKeyID := os.Getenv("MINIO_ACCESS_KEY_ID")
	secretAccessKey := os.Getenv("MINIO_SECRET_ACCESS_KEY")
	useSSL := false

	// Initialize minio client object.
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Fatalln(err)
	}

	return minioClient
}

package main

import (
	"context"
	"github.com/dokedu/dokedu/backend/internal/database"
	"github.com/dokedu/dokedu/backend/internal/database/db"
	"log"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/dokedu/dokedu/backend/internal/dataloaders"
	"github.com/dokedu/dokedu/backend/internal/graph"
	"github.com/dokedu/dokedu/backend/internal/mail"
	"github.com/dokedu/dokedu/backend/internal/middleware"
	"github.com/dokedu/dokedu/backend/internal/modules/meilisearch"
	"github.com/dokedu/dokedu/backend/internal/modules/minio"
	"github.com/dokedu/dokedu/backend/internal/msg"
	"github.com/dokedu/dokedu/backend/internal/services/chat_message_processor"
	"github.com/dokedu/dokedu/backend/internal/services/report_generation"
	"github.com/dokedu/dokedu/backend/internal/services/report_generation/config"
	"github.com/dokedu/dokedu/backend/internal/subscription"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	mware "github.com/labstack/echo/v4/middleware"

	_ "github.com/lib/pq"
)

const defaultPort = "1323"

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	// Allows us to cancel the context when we want to stop the server
	// And hence gracefully stop the server
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	dbClient := database.NewClient()
	defer dbClient.DB.Close()

	mailer := mail.NewClient()
	minioClient := minio.NewClient()
	meili := meilisearch.NewMeiliClient()

	// TODO: refactor this into a service
	chatMessageChan := make(chan *db.Chat)
	subscriptionHandler := subscription.NewHandler(dbClient)

	chatMessageProcessor := chat_message_processor.NewChatMessageProcessor(dbClient, subscriptionHandler, chatMessageChan)

	repGen := report_generation.NewReportGenerationService(config.ReportGenerationConfig{
		DB:    dbClient,
		MinIO: minioClient,
	}, ctx, 3)

	// TODO: Extract this
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
		DB:                   dbClient,
		MinioClient:          minioClient,
		Mailer:               mailer,
		ReportService:        repGen,
		Meili:                meili,
		ChatMessageChan:      chatMessageChan,
		SubscriptionHandler:  subscriptionHandler,
		ChatMessageProcessor: chatMessageProcessor,
	}}))

	var gb int64 = 1 << 30

	srv.SetErrorPresenter(msg.ErrPresenter)
	srv.AddTransport(transport.Websocket{
		KeepAlivePingInterval: 10 * time.Second,
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
		InitFunc: middleware.WebsocketInitFunc(dbClient),
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

	e.GET("/query", func(c echo.Context) error {
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

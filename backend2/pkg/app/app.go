package app

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/dokedu/dokedu/backend/pkg/graph"
	"github.com/dokedu/dokedu/backend/pkg/graph/generated"
	"github.com/dokedu/dokedu/backend/pkg/middleware"
	"github.com/dokedu/dokedu/backend/pkg/msg"
	"github.com/dokedu/dokedu/backend/pkg/services"
	"github.com/dokedu/dokedu/backend/pkg/services/database"
	"github.com/dokedu/dokedu/backend/pkg/services/mail"
	"github.com/dokedu/dokedu/backend/pkg/services/minio"
	"log/slog"
	"net/http"
	"os"
)

func HttpStuff() {
	dbCfg := database.Config{
		Database: os.Getenv("DB_NAME"),
		Username: os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PASS"),
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
	}

	client := database.New(dbCfg)

	s, err := services.New(services.Config{
		Database: dbCfg,
		Minio: minio.Config{
			Host:      os.Getenv("MINIO_HOST"),
			Port:      os.Getenv("MINIO_PORT"),
			AccessKey: os.Getenv("MINIO_ACCESS_KEY_ID"),
			SecretKey: os.Getenv("MINIO_SECRET_ACCESS_KEY"),
			SSL:       false,
		},
		Mail: mail.Config{},
	})
	if err != nil {
		panic(err)
	}

	srv := handler.New(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{
		DB:       client,
		Services: s,
	}}))

	srv.SetErrorPresenter(msg.ErrPresenter)
	srv.AddTransport(transport.POST{})
	srv.Use(extension.Introspection{})

	// TODO: srv.Transport bois (see old backend)
	// but we won't need websockets anymore (for now)

	// middleware for cors
	router := http.NewServeMux()

	stack := middleware.CreateStack(
		middleware.CORS,
		middleware.Auth(client),
	)

	router.HandleFunc("POST /graph", srv.ServeHTTP)

	router.HandleFunc("GET /playground", playground.Handler("GraphQL playground", "/graph"))

	router.HandleFunc("GET /up", handleUpRequest)

	server := http.Server{
		Addr:    ":8080",
		Handler: stack(router),
	}

	slog.Info("Starting server on port 8080")
	server.ListenAndServe()
}

func handleUpRequest(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte("OK"))
}

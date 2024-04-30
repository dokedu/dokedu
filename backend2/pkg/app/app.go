package app

import (
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"

	"github.com/dokedu/dokedu/backend/pkg/graph"
	"github.com/dokedu/dokedu/backend/pkg/graph/generated"
	"github.com/dokedu/dokedu/backend/pkg/middleware"
	"github.com/dokedu/dokedu/backend/pkg/msg"
	"github.com/dokedu/dokedu/backend/pkg/reportGeneration"
	"github.com/dokedu/dokedu/backend/pkg/services"
)

const gb = 1 << 30

type App struct {
	Server   *http.Server
	Resolver *graph.Resolver
}

func New(svc *services.Services, reportService *reportGeneration.Service) App {
	resolver := &graph.Resolver{DB: svc.DB, Services: svc, ReportGeneration: reportService}
	srv := handler.New(generated.NewExecutableSchema(generated.Config{Resolvers: resolver}))

	srv.SetErrorPresenter(msg.ErrPresenter)
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})
	srv.AddTransport(transport.MultipartForm{
		MaxMemory:     5 * gb,
		MaxUploadSize: 5 * gb,
	})
	srv.Use(extension.Introspection{})
	srv.SetQueryCache(lru.New(1000))

	// middleware for cors
	router := http.NewServeMux()

	stack := middleware.CreateStack(
		middleware.CORS,
		middleware.Auth(svc.DB),
	)

	router.HandleFunc("POST /graph", srv.ServeHTTP)
	router.HandleFunc("GET /playground", playground.Handler("GraphQL playground", "/graph"))
	router.HandleFunc("GET /healthz", healthHandler)

	server := &http.Server{
		Addr:    ":8080",
		Handler: stack(router),
	}

	return App{
		Server:   server,
		Resolver: resolver,
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte("OK"))
}

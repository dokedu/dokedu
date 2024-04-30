package app

import (
	"context"
	"net/http"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/otel/trace"

	"github.com/dokedu/dokedu/backend/pkg/graph"
	"github.com/dokedu/dokedu/backend/pkg/graph/generated"
	"github.com/dokedu/dokedu/backend/pkg/middleware"
	"github.com/dokedu/dokedu/backend/pkg/msg"
	"github.com/dokedu/dokedu/backend/pkg/reportGeneration"
	"github.com/dokedu/dokedu/backend/pkg/services"
	"github.com/dokedu/dokedu/backend/pkg/tracing"
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
	srv.AroundOperations(func(ctx context.Context, next graphql.OperationHandler) graphql.ResponseHandler {
		operationName := graphql.GetOperationContext(ctx).OperationName
		span := trace.SpanFromContext(ctx)
		span.SetName("/graphql " + operationName)
		span.AddEvent("GraphqlOperation started")

		return next(ctx)
	})
	srv.AroundRootFields(func(ctx context.Context, next graphql.RootResolver) graphql.Marshaler {
		name := graphql.GetRootFieldContext(ctx).Field.Name

		ctx, span := tracing.Tracer.Start(ctx, name)
		defer span.End()

		span.End()

		return next(ctx)
	})
	srv.AroundFields(func(ctx context.Context, next graphql.Resolver) (res interface{}, err error) {
		if !graphql.GetFieldContext(ctx).IsResolver {
			return next(ctx)
		}

		name := graphql.GetFieldContext(ctx).Field.Name
		ctx, span := tracing.Tracer.Start(ctx, name)
		defer span.End()

		return next(ctx)
	})

	// middleware for cors
	router := http.NewServeMux()

	stack := middleware.CreateStack(
		middleware.CORS,
		middleware.Auth(svc.DB),
		middleware.Dataloader(svc),
	)

	router.HandleFunc("POST /graph", srv.ServeHTTP)
	router.HandleFunc("GET /playground", playground.Handler("GraphQL playground", "/graph"))
	router.HandleFunc("GET /healthz", healthHandler)

	server := &http.Server{
		Addr: ":8080",
		Handler: otelhttp.NewHandler(stack(router), "", otelhttp.WithFilter(func(r *http.Request) bool {
			switch {
			case r.URL.Path == "/healthz",
				r.URL.Path == "/playground",
				r.Method == http.MethodOptions:
				return false
			default:
				return true
			}
		})),
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

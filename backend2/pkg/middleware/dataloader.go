package middleware

import (
	"net/http"

	"github.com/dokedu/dokedu/backend/pkg/services"
	"github.com/dokedu/dokedu/backend/pkg/services/database"
)

func Dataloader(svc *services.Services) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			request := r.WithContext(database.ContextWithLoader(r.Context(), svc.DB))
			next.ServeHTTP(w, request)
		})
	}
}

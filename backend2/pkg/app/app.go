package app

import (
	"log/slog"
	"net/http"
)

func HttpStuff() {
	http.HandleFunc("POST /graph", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(200)
		w.Write([]byte("Hello, World!"))
	})

	slog.Info("Listening on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}

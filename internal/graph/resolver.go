package graph

//go:generate go run github.com/99designs/gqlgen generate

import (
	"example/internal/db"
	"example/internal/mail"
	meili "example/internal/modules/meilisearch"
	"example/internal/services/chat_message_processor"
	"example/internal/services/report_generation"
	"example/internal/subscription"
	"github.com/minio/minio-go/v7"
	"github.com/uptrace/bun"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	DB                   *bun.DB
	MinioClient          *minio.Client
	Mailer               mail.Mailer
	ReportService        *report_generation.ReportGenerationService
	Meili                *meili.MeiliClient
	ChatMessageChan      chan *db.Chat
	SubscriptionHandler  *subscription.Handler
	ChatMessageProcessor *chat_message_processor.ChatMessageProcessor
}

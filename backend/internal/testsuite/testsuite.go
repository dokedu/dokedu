package testsuite

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"github.com/uptrace/bun"

	"github.com/dokedu/dokedu/backend/internal/database"
	"github.com/dokedu/dokedu/backend/internal/db"
	"github.com/dokedu/dokedu/backend/internal/graph"
	"github.com/dokedu/dokedu/backend/internal/mail"
	"github.com/dokedu/dokedu/backend/internal/middleware"
	"github.com/dokedu/dokedu/backend/internal/modules/meilisearch"
	"github.com/dokedu/dokedu/backend/internal/modules/minio"
)

type TestSuite struct {
	*suite.Suite
	Resolver *graph.Resolver
	DB       *bun.DB
}

func New() (*TestSuite, error) {
	mailer := mail.NewClient()
	dbClient := database.NewClient()
	minioClient := minio.NewClient()
	meili := meilisearch.NewMeiliClient()

	// TODO: We need to refactor this into a service anyway, so there is no need to make the tests compatible with this at the moment.
	//chatMessageChan := make(chan *db.Chat)
	//subscriptionHandler := subscription.NewHandler(dbClient)
	//chatMessageProcessor := chat_message_processor.NewChatMessageProcessor(dbClient, subscriptionHandler, chatMessageChan)
	//
	//repGen := report_generation.NewReportGenerationService(config.ReportGenerationConfig{
	//	DB:    dbClient,
	//	MinIO: minioClient,
	//}, context.Background(), 3)

	resolver := &graph.Resolver{
		DB:          dbClient,
		MinioClient: minioClient,
		Mailer:      mailer,
		Meili:       meili,
		//ReportService:        repGen,
		//ChatMessageChan:      chatMessageChan,
		//SubscriptionHandler:  subscriptionHandler,
		//ChatMessageProcessor: chatMessageProcessor,
	}

	s := new(suite.Suite)
	ts := &TestSuite{
		Suite:    s,
		Resolver: resolver,
		DB:       dbClient,
	}

	return ts, nil
}

func NewFromT(t *testing.T) *TestSuite {
	ts, err := New()
	assert.NoError(t, err)
	return ts
}

func (ts *TestSuite) Ctx() context.Context {
	return context.Background()
}

func (ts *TestSuite) CtxWithToken(token string) context.Context {
	// find session
	var session db.Session
	err := ts.DB.NewSelect().Model(&session).Where("token = ?", token).Scan(context.Background())
	ts.NoError(err)

	var user db.User
	err = ts.DB.NewSelect().Model(&user).Where("id = ?", session.UserID).Scan(context.Background())
	ts.NoError(err)

	userContext := middleware.UserContext{
		User:  user,
		Token: session.Token,
	}

	return context.WithValue(ts.Ctx(), middleware.UserCtxKey, &userContext)
}

func (ts *TestSuite) CtxWithEmail(email string) context.Context {
	var user db.User
	err := ts.DB.NewSelect().Model(&user).Where("email = ?", email).Scan(context.Background())
	ts.NoError(err)

	userContext := middleware.UserContext{
		User:  user,
		Token: "",
	}

	return context.WithValue(ts.Ctx(), middleware.UserCtxKey, &userContext)
}

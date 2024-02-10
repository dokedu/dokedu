package testsuite

import (
	"context"
	"database/sql"
	"testing"

	"github.com/joho/godotenv"

	gonanoid "github.com/matoous/go-nanoid/v2"
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

	// todo: currently, the testsuite does not support testing the reportService or the chatMessage service
	// both are pending a refactor, and will be added to the testsuite once they are refactored
	// potentially they are even moved to their own services, where they can be tested in isolation

	resolver := &graph.Resolver{
		DB:          dbClient,
		MinioClient: minioClient,
		Mailer:      mailer,
		Meili:       meili,
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
	err := godotenv.Load("../../.env")
	if err != nil {
		panic("Error loading .env file")
	}
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

func (ts *TestSuite) UserByEmail(email string) *db.User {
	var user db.User
	err := ts.DB.NewSelect().Model(&user).Where("email = ?", email).Scan(context.Background())
	ts.NoError(err)
	return &user
}

func (ts *TestSuite) MockAdminForOrganisation(organisationID string) *db.User {
	user := &db.User{
		Role:           "admin",
		Email:          sql.NullString{Valid: true, String: gonanoid.Must(32) + "@dokedu.org"},
		FirstName:      gonanoid.Must(32),
		LastName:       "tester",
		OrganisationID: organisationID,
	}

	_, err := ts.DB.NewInsert().Model(user).Exec(context.Background())
	ts.NoError(err)

	return user
}

// MockOrganisationWithOwner creates a new organisation + owner user
func (ts *TestSuite) MockOrganisationWithOwner() (org *db.Organisation, user *db.User) {
	name := gonanoid.Must(12)
	err := ts.DB.RunInTx(ts.Ctx(), nil, func(ctx context.Context, tx bun.Tx) error {
		ownerID := gonanoid.Must(32)
		org = &db.Organisation{
			Name:           name,
			LegalName:      name,
			Website:        name,
			Phone:          name,
			OwnerID:        ownerID,
			AllowedDomains: []string{},
			EnabledApps:    []string{"drive", "admin", "record", "school", "chat"},
		}
		_, err := tx.NewInsert().Model(org).Exec(ctx)
		if err != nil {
			return err
		}

		user = &db.User{
			ID:             ownerID,
			Role:           "owner",
			Email:          sql.NullString{Valid: true, String: ownerID + "@dokedu.org"},
			FirstName:      gonanoid.Must(32),
			LastName:       "tester",
			OrganisationID: org.ID,
		}
		_, err = tx.NewInsert().Model(user).Exec(ctx)
		if err != nil {
			return err
		}

		return nil
	})
	ts.NoError(err)

	return org, user
}

func (ts *TestSuite) DeleteUserByEmail(email string) {
	_, err := ts.DB.NewDelete().Model(&db.User{}).Where("email = ?", email).Exec(context.Background())
	ts.NoError(err)
}

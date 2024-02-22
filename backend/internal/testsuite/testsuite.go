package testsuite

import (
	"context"
	"github.com/dokedu/dokedu/backend/internal/database/db"
	"github.com/jackc/pgx/v5/pgtype"
	"testing"

	"github.com/dokedu/dokedu/backend/internal/database"
	"github.com/dokedu/dokedu/backend/internal/graph"
	"github.com/dokedu/dokedu/backend/internal/mail"
	"github.com/dokedu/dokedu/backend/internal/middleware"
	"github.com/dokedu/dokedu/backend/internal/modules/meilisearch"
	"github.com/dokedu/dokedu/backend/internal/modules/minio"
	gonanoid "github.com/matoous/go-nanoid/v2"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type TestSuite struct {
	*suite.Suite
	Resolver *graph.Resolver
	DB       *database.DB
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
	ts, err := New()
	assert.NoError(t, err)
	return ts
}

func (ts *TestSuite) Query1(q string, args ...interface{}) interface{} {
	res, err := ts.DB.DB.Query(ts.Ctx(), q, args...)
	ts.NoError(err)
	defer res.Close()

	var result interface{}
	res.Next()
	err = res.Scan(&result)
	ts.NoError(err)
	return result
}

func (ts *TestSuite) Ctx() context.Context {
	return context.Background()
}

func (ts *TestSuite) CtxWithToken(token string) context.Context {
	user, err := ts.DB.GLOBAL_UserFindBySession(ts.Ctx(), token)
	ts.NoError(err)

	userContext := middleware.UserContext{
		User:  user,
		Token: token,
	}

	return context.WithValue(ts.Ctx(), middleware.UserCtxKey, &userContext)
}

func (ts *TestSuite) CtxWithEmail(email string) context.Context {
	user, err := ts.DB.GLOBAL_UserByEmail(ts.Ctx(), pgtype.Text{String: email, Valid: true})
	ts.NoError(err)

	userContext := middleware.UserContext{
		User:  user,
		Token: "",
	}

	return context.WithValue(ts.Ctx(), middleware.UserCtxKey, &userContext)
}

func (ts *TestSuite) UserByEmail(email string) *db.User {
	user, err := ts.DB.GLOBAL_UserByEmail(ts.Ctx(), pgtype.Text{String: email, Valid: true})
	ts.NoError(err)
	return &user
}

func (ts *TestSuite) MockAdminForOrganisation(organisationID string) *db.User {
	userParams := db.CreateUserParams{
		Role:           "admin",
		Email:          pgtype.Text{Valid: true, String: gonanoid.Must(32) + "@dokedu.org"},
		FirstName:      gonanoid.Must(32),
		LastName:       "tester",
		OrganisationID: organisationID,
	}

	user, err := ts.DB.CreateUser(context.Background(), userParams)
	ts.NoError(err)

	return &user
}

// MockOrganisationWithOwner creates a new organisation + owner user
func (ts *TestSuite) MockOrganisationWithOwner() (org *db.Organisation, user *db.User) {
	name := gonanoid.Must(12)

	tx, err := ts.DB.DB.Begin(ts.Ctx())
	if err != nil {
		return nil, nil
	}
	defer tx.Rollback(ts.Ctx())

	qtx := ts.DB.WithTx(tx)

	ownerID := gonanoid.Must(32)
	orgParams := db.GLOBAL_CreateOrganisationParams{
		Name:           name,
		LegalName:      name,
		Website:        name,
		Phone:          name,
		OwnerID:        ownerID,
		AllowedDomains: []string{},
		EnabledApps:    []string{"drive", "admin", "record", "school", "chat"},
	}
	createdOrg, err := qtx.GLOBAL_CreateOrganisation(ts.Ctx(), orgParams)
	if err != nil {
		return nil, nil
	}

	userParams := db.CreateUserWithIdParams{
		ID:             ownerID,
		Role:           "owner",
		Email:          pgtype.Text{Valid: true, String: ownerID + "@dokedu.org"},
		FirstName:      gonanoid.Must(32),
		LastName:       "tester",
		OrganisationID: createdOrg.ID,
	}
	_, err = qtx.CreateUserWithId(ts.Ctx(), userParams)
	if err != nil {
		return nil, nil
	}
	ts.NoError(err)

	return &createdOrg, user
}

func (ts *TestSuite) DeleteUserByEmail(email string) {
	_, err := ts.DB.GLOBAL_DeleteUserByEmail(ts.Ctx(), email)
	ts.NoError(err)
}

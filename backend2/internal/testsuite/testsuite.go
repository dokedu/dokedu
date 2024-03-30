package testsuite

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"testing"

	"github.com/caarlos0/env/v10"
	"github.com/jackc/pgx/v5/pgtype"
	gonanoid "github.com/matoous/go-nanoid/v2"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"github.com/dokedu/dokedu/backend/pkg/graph"
	"github.com/dokedu/dokedu/backend/pkg/middleware"
	"github.com/dokedu/dokedu/backend/pkg/services"
	"github.com/dokedu/dokedu/backend/pkg/services/database"
	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

type TestSuite struct {
	*suite.Suite
	Resolver *graph.Resolver
	DB       *database.DB
}
type Config struct {
	Services services.Config
}

func New() (*TestSuite, error) {
	var cfg Config
	err := env.Parse(&cfg)
	if err != nil {
		return nil, err
	}

	svc, err := services.New(cfg.Services)
	if err != nil {
		panic(err)
	}

	resolver := graph.Resolver{DB: svc.DB, Services: svc}
	ts := &TestSuite{
		Suite:    new(suite.Suite),
		Resolver: &resolver,
		DB:       svc.DB,
	}
	return ts, nil
}

func NewFromT(t *testing.T) *TestSuite {
	ts, err := New()
	assert.NoError(t, err)
	return ts
}

func (ts *TestSuite) Ctx() context.Context {
	ctx := context.Background()
	ctx = database.ContextWithLoader(ctx, ts.DB)
	return ctx
}

func (ts *TestSuite) CtxWithUser(id string) context.Context {
	ctx := ts.Ctx()
	user, err := ts.DB.GLOBAL_UserFindByID(ctx, id)
	ts.NoError(err)

	ctx = context.WithValue(ctx, middleware.UserCtxKey, &middleware.UserContext{User: user})
	return ctx
}

func (ts *TestSuite) CtxWithUserEmail(email string) context.Context {
	ctx := ts.Ctx()
	user, err := ts.DB.GLOBAL_UserFindByEmail(ctx, email)
	ts.NoError(err)

	ctx = context.WithValue(ctx, middleware.UserCtxKey, &middleware.UserContext{User: user})
	return ctx
}

func (ts *TestSuite) Exec(q string, args ...interface{}) {
	_, err := ts.DB.DB.Exec(ts.Ctx(), q, args...)
	ts.NoError(err)
}
func (ts *TestSuite) Query1(q string, args ...interface{}) interface{} {
	row := ts.DB.DB.QueryRow(ts.Ctx(), q, args...)

	var out1 interface{}
	err := row.Scan(&out1)
	ts.NoError(err)

	return out1
}

func (ts *TestSuite) FirstOrganisationID() string {
	return ts.Query1("SELECT id FROM organisations LIMIT 1").(string)
}
func (ts *TestSuite) FirstUserForOrganisation(organisationID, role string) db.User {
	id := ts.Query1("SELECT id FROM users WHERE organisation_id = $1 AND role = $2 AND deleted_at IS NULL LIMIT 1", organisationID, role).(string)
	user, err := ts.DB.GLOBAL_UserFindByID(ts.Ctx(), id)
	ts.NoError(err)
	return user
}
func (ts *TestSuite) FirstCompetenceForOrganisation(organisationID string) db.Competence {
	id := ts.Query1("SELECT id FROM competences WHERE organisation_id = $1 AND deleted_at IS NULL LIMIT 1", organisationID).(string)
	comp, err := ts.DB.CompetenceFindById(ts.Ctx(), db.CompetenceFindByIdParams{
		ID:             id,
		OrganisationID: organisationID,
	})
	ts.NoError(err)
	return comp
}
func (ts *TestSuite) FirstSubjectForOrganisation(organisationID string) db.Competence {
	id := ts.Query1("SELECT id FROM competences WHERE organisation_id = $1 AND competence_id IS NULL AND deleted_at IS NULL LIMIT 1", organisationID).(string)
	comp, err := ts.DB.CompetenceFindById(ts.Ctx(), db.CompetenceFindByIdParams{
		ID:             id,
		OrganisationID: organisationID,
	})
	ts.NoError(err)
	return comp
}

func (ts *TestSuite) MockAdminForOrganisation(organisationID string) db.User {
	return ts.MockUserForOrganisation(organisationID, "admin")
}
func (ts *TestSuite) MockTeacherForOrganisation(organisationID string) db.User {
	return ts.MockUserForOrganisation(organisationID, "teacher")
}
func (ts *TestSuite) MockUserForOrganisation(organisationID string, role string) db.User {
	user, err := ts.DB.UserCreate(ts.Ctx(), db.UserCreateParams{
		Role:           db.UserRole(role),
		OrganisationID: organisationID,
		FirstName:      gonanoid.Must(32),
		LastName:       "tester",
		Email:          pgtype.Text{Valid: true, String: gonanoid.Must(32) + "@dokedu.org"},
	})
	ts.NoError(err)

	if role == "student" {
		_, err = ts.DB.UserStudentCreate(ts.Ctx(), db.UserStudentCreateParams{
			UserID:         user.ID,
			OrganisationID: user.OrganisationID,
			Grade:          1,
		})
		ts.NoError(err)
	}

	return user
}

func (ts *TestSuite) AssertMailReceived(email string, contains ...string) {
	res, err := http.Get("http://localhost:8025/api/v2/search?kind=to&query=" + email)
	defer func() { _ = res.Body.Close() }()
	ts.NoError(err)
	ts.Equal(200, res.StatusCode)

	str, err := io.ReadAll(res.Body)
	ts.NoError(err)

	for _, c := range contains {
		ts.Contains(string(str), c, fmt.Sprintf("email to %s should contain %s", email, c))
	}
}

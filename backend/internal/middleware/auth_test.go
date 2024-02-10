package middleware_test

import (
	"errors"
	"fmt"
	"io"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/labstack/echo/v4"
	gonanoid "github.com/matoous/go-nanoid/v2"
	"github.com/stretchr/testify/suite"

	"github.com/dokedu/dokedu/backend/internal/db"
	"github.com/dokedu/dokedu/backend/internal/middleware"
	"github.com/dokedu/dokedu/backend/internal/testsuite"
)

type TestSuite struct {
	*testsuite.TestSuite
}

func TestTestSuite(t *testing.T) {
	ts := testsuite.NewFromT(t)
	tts := &TestSuite{TestSuite: ts}
	suite.Run(t, tts)
}

func (ts *TestSuite) Test_AuthMiddleware() {
	user := ts.UserByEmail("max@dokedu.org")

	var nextCalled bool
	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		nextCalled = true
		u, _ := middleware.GetUser(c.Request().Context())
		return c.JSON(200, u != nil)
	}, middleware.Auth(ts.DB))

	callMiddleware := func(token string) (bool, error) {
		nextCalled = false

		res := httptest.NewRecorder()
		req := httptest.NewRequest("GET", "/", nil)
		req.Header.Set("Authorization", token)
		e.ServeHTTP(res, req)

		body, _ := io.ReadAll(res.Body)
		bodyS := strings.Trim(string(body), "\n ")
		if res.Code != 200 {
			return bodyS == "true", fmt.Errorf("expected status code 200, got %d, %w", res.Code, errors.New(string(body)))
		}

		return bodyS == "true", nil
	}

	// no token: no error, next called, no user
	hasUser, err := callMiddleware("")
	ts.NoError(err)
	ts.True(nextCalled)
	ts.False(hasUser)

	// invalid token: no error, next called, no user
	hasUser, err = callMiddleware("invalid")
	ts.NoError(err)
	ts.True(nextCalled)
	ts.False(hasUser)

	// expired token: no error, next called, no user, session deleted from db
	session := gonanoid.Must(32)
	_, err = ts.DB.NewInsert().Model(&db.Session{
		UserID:    user.ID,
		Token:     session,
		CreatedAt: time.Now().Add(-13 * time.Hour),
	}).Exec(ts.Ctx())
	ts.NoError(err)

	hasUser, err = callMiddleware(session)
	ts.NoError(err)
	ts.True(nextCalled)
	ts.False(hasUser)

	count, err := ts.DB.NewSelect().Model(&db.Session{}).Where("token = ?", session).Count(ts.Ctx())
	ts.NoError(err)
	ts.Equal(0, count)

	// token for deleted user: no error, next called, no user, sessions deleted from db
	deletedUser := ts.MockAdminForOrganisation(user.OrganisationID)
	session = gonanoid.Must(32)
	_, err = ts.DB.NewInsert().Model(&db.Session{
		UserID:    deletedUser.ID,
		Token:     session,
		CreatedAt: time.Now(),
	}).Exec(ts.Ctx())
	ts.NoError(err)
	ts.DeleteUserByEmail(deletedUser.Email.String)

	hasUser, err = callMiddleware(session)
	ts.NoError(err)
	ts.True(nextCalled)
	ts.False(hasUser)

	count, err = ts.DB.NewSelect().Model(&db.Session{}).Where("user_id = ?", deletedUser.ID).Count(ts.Ctx())
	ts.NoError(err)
	ts.Equal(0, count)

	// valid token: no error, next called, user
	session = gonanoid.Must(32)
	_, err = ts.DB.NewInsert().Model(&db.Session{
		UserID: user.ID,
		Token:  session,
	}).Exec(ts.Ctx())
	ts.NoError(err)

	hasUser, err = callMiddleware(session)
	ts.NoError(err)
	ts.True(nextCalled)
	ts.True(hasUser)
}

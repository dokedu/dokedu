package graph_test

import (
	"database/sql"

	"github.com/dokedu/dokedu/backend/internal/graph/model"
	"github.com/dokedu/dokedu/backend/internal/msg"
)

func (ts *TestSuite) Test_SignIn() {
	login := func(email, password string) (*model.SignInPayload, error) {
		return ts.Resolver.Mutation().SignIn(ts.Ctx(), model.SignInInput{
			Email:    email,
			Password: password,
		})
	}

	// trying to login with invalid credentials should return an error
	_, err := login("invalid", "invalid")
	ts.ErrorIs(err, msg.ErrInvalidEmailOrPassword)

	_, err = login("max@dokedu.org", "invalid")
	ts.ErrorIs(err, msg.ErrInvalidEmailOrPassword)

	// trying to login with valid credentials should return a token
	res, err := login("max@dokedu.org", "password")
	ts.NoError(err)
	ts.NotEmpty(res.Token)
	ts.Equal("max@dokedu.org", res.User.Email.String)

	// the token should now be in the db
	cnt, err := ts.DB.NewSelect().Table("sessions").Where("token = ?", res.Token).Count(ts.Ctx())
	ts.NoError(err)
	ts.Equal(1, cnt)

	// the token can be used to get information about `me`
	me, err := ts.Resolver.Query().Me(ts.CtxWithToken(res.Token))
	ts.NoError(err)
	ts.Equal("max@dokedu.org", me.Email.String)
}

func (ts *TestSuite) Test_Me() {
	// nil when no token is provided
	me, err := ts.Resolver.Query().Me(ts.Ctx())
	ts.NoError(err)
	ts.Nil(me)

	// info when user is logged in
	me, err = ts.Resolver.Query().Me(ts.CtxWithEmail("max@dokedu.org"))
	ts.NoError(err)
	ts.Equal("max@dokedu.org", me.Email.String)
}

func (ts *TestSuite) Test_User() {
	user1 := ts.UserByEmail("max@dokedu.org")
	user3 := ts.MockAdminForOrganisation(user1.OrganisationID)
	_, user2 := ts.MockOrganisationWithOwner()

	// nil when not logged in
	user, err := ts.Resolver.Query().User(ts.Ctx(), user1.ID)
	ts.NoError(err)
	ts.Nil(user)

	// err noRows when user does not exist
	user, err = ts.Resolver.Query().User(ts.CtxWithEmail(user1.Email.String), "1234")
	ts.ErrorIs(err, sql.ErrNoRows)
	ts.Nil(user)

	// err noRows when user is not part of the same organisation
	user, err = ts.Resolver.Query().User(ts.CtxWithEmail(user1.Email.String), user2.ID)
	ts.ErrorIs(err, sql.ErrNoRows)
	ts.Nil(user)

	// info when user is part of the same organisation
	user, err = ts.Resolver.Query().User(ts.CtxWithEmail(user1.Email.String), user3.ID)
	ts.NoError(err)
	ts.Equal(user3.ID, user.ID)
}

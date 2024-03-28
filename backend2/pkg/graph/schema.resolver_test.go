package graph_test

import (
	"context"
	"math/rand"
	"testing"
	"time"

	"github.com/jackc/pgx/v5"
	gonanoid "github.com/matoous/go-nanoid/v2"
	"github.com/samber/lo"
	"github.com/stretchr/testify/suite"

	"github.com/dokedu/dokedu/backend/internal/testsuite"
	"github.com/dokedu/dokedu/backend/pkg/graph/model"
	"github.com/dokedu/dokedu/backend/pkg/msg"
	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

type TestSuite struct {
	*testsuite.TestSuite
}

func TestTestSuite(t *testing.T) {
	ts := testsuite.NewFromT(t)
	tts := &TestSuite{TestSuite: ts}

	suite.Run(t, tts)
}

func (ts *TestSuite) Test_SignIn() {
	// doesn't work if the user doesn't exist
	_, err := ts.Resolver.Mutation().SignIn(ts.Ctx(), model.SignInInput{
		Email:    "",
		Password: "password",
	})
	ts.ErrorIs(err, msg.ErrInvalidEmailOrPassword)

	// doesn't work if the password is wrong
	_, err = ts.Resolver.Mutation().SignIn(ts.Ctx(), model.SignInInput{
		Email:    "john@dokedu.org",
		Password: "wrong",
	})
	ts.ErrorIs(err, msg.ErrInvalidEmailOrPassword)

	// works with the correct password (email is case-insensitive)
	res, err := ts.Resolver.Mutation().SignIn(ts.Ctx(), model.SignInInput{
		Email:    "john@doKEDu.oRG",
		Password: "password",
	})
	ts.NoError(err)
	ts.NotEmpty(res.Token)
}

func (ts *TestSuite) Test_ResetPassword() {
	user := ts.MockAdminForOrganisation(ts.FirstOrganisationID())

	loginWorks := func(password string) bool {
		_, err := ts.Resolver.Mutation().SignIn(ts.Ctx(), model.SignInInput{
			Email:    user.Email.String,
			Password: password,
		})

		return err == nil
	}

	// if the user is not logged in, a token must be supplied
	_, err := ts.Resolver.Mutation().ResetPassword(ts.Ctx(), model.ResetPasswordInput{
		Password: "newpassword2",
	})
	ts.ErrorIs(err, msg.ErrInvalidInput)

	// error on invalid token
	_, err = ts.Resolver.Mutation().ResetPassword(ts.Ctx(), model.ResetPasswordInput{
		Token:    lo.ToPtr("invalid"),
		Password: "newpassword2",
	})
	ts.ErrorIs(err, msg.ErrInvalidRecoveryToken)

	// works with a valid token
	ts.Exec("UPDATE users SET recovery_token = 'aaaaa', recovery_sent_at = now() WHERE id = $1;", user.ID)
	_, err = ts.Resolver.Mutation().ResetPassword(ts.Ctx(), model.ResetPasswordInput{
		Token:    lo.ToPtr("aaaaa"),
		Password: "newpassword2",
	})
	ts.NoError(err)
	ts.False(loginWorks("newpassword"))
	ts.True(loginWorks("newpassword2"))

	// token is invalidated after use
	_, err = ts.Resolver.Mutation().ResetPassword(ts.Ctx(), model.ResetPasswordInput{
		Token:    lo.ToPtr("aaaaa"),
		Password: "newpassword3",
	})
	ts.ErrorIs(err, msg.ErrInvalidRecoveryToken)
}

func (ts *TestSuite) Test_ForgotPassword() {
	// error on invalid email
	_, err := ts.Resolver.Mutation().ForgotPassword(ts.Ctx(), model.ForgotPasswordInput{
		Email: "",
	})
	ts.ErrorIs(err, msg.ErrInvalidInput)

	// error on non-existing email
	_, err = ts.Resolver.Mutation().ForgotPassword(ts.Ctx(), model.ForgotPasswordInput{
		Email: "test@example.org",
	})
	ts.ErrorIs(err, msg.ErrInvalidInput)

	// works with existing email
	user := ts.MockAdminForOrganisation(ts.FirstOrganisationID())
	_, err = ts.Resolver.Mutation().ForgotPassword(ts.Ctx(), model.ForgotPasswordInput{
		Email: user.Email.String,
	})
	ts.NoError(err)

	// recovery token is set
	token := ts.Query1("SELECT recovery_token FROM users WHERE id = $1", user.ID).(string)
	ts.NotEmpty(token)

	// recovery token cannot be used after 1 day
	ts.Exec("UPDATE users SET recovery_sent_at = now() - interval '2 days' WHERE id = $1", user.ID)
	_, err = ts.Resolver.Mutation().ResetPassword(ts.Ctx(), model.ResetPasswordInput{
		Token:    lo.ToPtr(token),
		Password: "newpassword",
	})
	ts.ErrorIs(err, msg.ErrInvalidRecoveryToken)

	// recovery token can be used within 1 day
	ts.Exec("UPDATE users SET recovery_sent_at = now() WHERE id = $1", user.ID)
	_, err = ts.Resolver.Mutation().ResetPassword(ts.Ctx(), model.ResetPasswordInput{
		Token:    lo.ToPtr(token),
		Password: "newpassword",
	})
	ts.NoError(err)

	// password works
	_, err = ts.Resolver.Mutation().SignIn(ts.Ctx(), model.SignInInput{
		Email:    user.Email.String,
		Password: "newpassword",
	})
	ts.NoError(err)
}

func (ts *TestSuite) Test_SignOut() {
	// doesn't work if the user is not logged in
	_, err := ts.Resolver.Mutation().SignOut(ts.Ctx())
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works if the user is logged in
	user := ts.MockAdminForOrganisation(ts.FirstOrganisationID())
	session, err := ts.DB.GLOBAL_SessionCreate(ts.Ctx(), db.GLOBAL_SessionCreateParams{
		UserID: user.ID,
		Token:  "a",
	})
	ts.NoError(err)
	_, err = ts.DB.GLOBAL_SessionFindByToken(ts.Ctx(), session.Token)
	ts.NoError(err)

	_, err = ts.Resolver.Mutation().SignOut(ts.CtxWithUser(user.Email.String))
	ts.NoError(err)

	// now the session is deleted
	_, err = ts.DB.GLOBAL_SessionFindByToken(ts.Ctx(), session.Token)
	ts.ErrorIs(err, pgx.ErrNoRows)
}

func (ts *TestSuite) Test_CreateUser() {
	createUser := func(ctx context.Context) (*db.User, error) {
		return ts.Resolver.Mutation().CreateUser(ctx, model.CreateUserInput{
			FirstName: gonanoid.Must(32),
			LastName:  "tester",
			Email:     gonanoid.Must(32) + "@dokedu.org",
			Role:      "teacher",
		})
	}

	// doesn't work if the user is not logged in
	_, err := createUser(ts.Ctx())
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// doesn't work if the user is not an admin
	teacher := ts.MockTeacherForOrganisation(ts.FirstOrganisationID())
	_, err = createUser(ts.CtxWithUser(teacher.Email.String))
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works if the user is an admin
	admin := ts.MockAdminForOrganisation(ts.FirstOrganisationID())
	user, err := createUser(ts.CtxWithUser(admin.Email.String))
	ts.NoError(err)

	// todo: check email

	ts.Equal(db.UserRoleTeacher, user.Role)

	// a password reset token was generated
	token := ts.Query1("SELECT recovery_token FROM users WHERE id = $1", user.ID).(string)
	ts.NotEmpty(token)
}

func (ts *TestSuite) Test_UpdateUser() {
	admin := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "admin")
	teacher := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "teacher")
	student := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "student")

	updateUser := func(ctx context.Context, id string, grade int) (*db.User, string, error) {
		newFirstName := gonanoid.Must(32)

		input := model.UpdateUserInput{
			ID:        id,
			FirstName: newFirstName,
			LastName:  gonanoid.Must(32),
		}

		if grade != 0 {
			input.Grade = lo.ToPtr(grade)
			input.Birthday = lo.ToPtr(time.Now())
			input.LeftAt = lo.ToPtr(time.Now())
			input.JoinedAt = lo.ToPtr(time.Now())
			input.Emoji = lo.ToPtr("👨‍🎓")
			input.MissedHours = lo.ToPtr(3)
			input.MissedHoursExcused = lo.ToPtr(1)
		}

		user, err := ts.Resolver.Mutation().UpdateUser(ctx, input)
		return user, newFirstName, err
	}

	// doesn't work if the user is not logged in
	_, _, err := updateUser(ts.Ctx(), teacher.ID, 0)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// doesn't work if the user is not an admin
	_, _, err = updateUser(ts.CtxWithUser(teacher.Email.String), teacher.ID, 0)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works if the user is an admin
	user, newFirstName, err := updateUser(ts.CtxWithUser(admin.Email.String), teacher.ID, 0)
	ts.NoError(err)
	ts.Equal(newFirstName, user.FirstName)

	// works for students
	user, newFirstName, err = updateUser(ts.CtxWithUser(admin.Email.String), student.ID, 0)
	ts.NoError(err)
	ts.Equal(newFirstName, user.FirstName)

	gradeShould := rand.Intn(12) + 1
	user, newFirstName, err = updateUser(ts.CtxWithUser(admin.Email.String), student.ID, gradeShould)
	ts.NoError(err)
	ts.Equal(newFirstName, user.FirstName)

	grade := ts.Query1("SELECT grade FROM user_students WHERE user_id = $1", student.ID).(int32)
	ts.Equal(gradeShould, int(grade))
}

func (ts *TestSuite) Test_ArchiveUser() {
	admin := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "admin")
	teacher := ts.MockTeacherForOrganisation(ts.FirstOrganisationID())
	student := ts.MockUserForOrganisation(ts.FirstOrganisationID(), "student")

	deleteUser := func(ctx context.Context, id string) error {
		_, err := ts.Resolver.Mutation().ArchiveUser(ctx, id)
		return err
	}

	// doesn't work if the user is not logged in
	err := deleteUser(ts.Ctx(), teacher.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// doesn't work if the user is not an admin
	err = deleteUser(ts.CtxWithUser(teacher.Email.String), teacher.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works if the user is an admin
	err = deleteUser(ts.CtxWithUser(admin.Email.String), teacher.ID)
	ts.NoError(err)

	// works for students
	err = deleteUser(ts.CtxWithUser(admin.Email.String), student.ID)
	ts.NoError(err)

	// user is deleted
	_, err = ts.DB.GLOBAL_UserFindByID(ts.Ctx(), student.ID)
	ts.ErrorIs(err, pgx.ErrNoRows)
	_, err = ts.DB.UserStudentFindByUserID(ts.Ctx(), db.UserStudentFindByUserIDParams{
		ID:             student.ID,
		OrganisationID: student.OrganisationID,
	})
	ts.ErrorIs(err, pgx.ErrNoRows)
}

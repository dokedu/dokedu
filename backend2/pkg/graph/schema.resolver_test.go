package graph_test

import (
	"context"
	"fmt"
	"github.com/dokedu/dokedu/backend/pkg/graph"
	"math/rand"
	"testing"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
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
	ts.Exec("UPDATE users SET recovery_token = 'aaaaa', recovery_sent_at = NOW() WHERE id = $1;", user.ID)
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

	ts.AssertMailReceived(user.Email.String, token, "Change my password")

	// recovery token cannot be used after 1 day
	ts.Exec("UPDATE users SET recovery_sent_at = NOW() - INTERVAL '2 days' WHERE id = $1", user.ID)
	_, err = ts.Resolver.Mutation().ResetPassword(ts.Ctx(), model.ResetPasswordInput{
		Token:    lo.ToPtr(token),
		Password: "newpassword",
	})
	ts.ErrorIs(err, msg.ErrInvalidRecoveryToken)

	// recovery token can be used within 1 day
	ts.Exec("UPDATE users SET recovery_sent_at = NOW() WHERE id = $1", user.ID)
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

	_, err = ts.Resolver.Mutation().SignOut(ts.CtxWithUser(user.ID))
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
	_, err = createUser(ts.CtxWithUser(teacher.ID))
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works if the user is an admin
	admin := ts.MockAdminForOrganisation(ts.FirstOrganisationID())
	user, err := createUser(ts.CtxWithUser(admin.ID))
	ts.NoError(err)

	ts.AssertMailReceived(user.Email.String, user.RecoveryToken.String, "Create your account")

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
	_, _, err = updateUser(ts.CtxWithUser(teacher.ID), teacher.ID, 0)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works if the user is an admin
	user, newFirstName, err := updateUser(ts.CtxWithUser(admin.ID), teacher.ID, 0)
	ts.NoError(err)
	ts.Equal(newFirstName, user.FirstName)

	// works for students
	user, newFirstName, err = updateUser(ts.CtxWithUser(admin.ID), student.ID, 0)
	ts.NoError(err)
	ts.Equal(newFirstName, user.FirstName)

	gradeShould := rand.Intn(12) + 1
	user, newFirstName, err = updateUser(ts.CtxWithUser(admin.ID), student.ID, gradeShould)
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
	err = deleteUser(ts.CtxWithUser(teacher.ID), teacher.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works if the user is an admin
	err = deleteUser(ts.CtxWithUser(admin.ID), teacher.ID)
	ts.NoError(err)

	// works for students
	err = deleteUser(ts.CtxWithUser(admin.ID), student.ID)
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

func (ts *TestSuite) Test_UpdateUserLanguage() {
	admin := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "admin")
	teacher := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "teacher")

	// doesn't work if the user is not logged in
	_, err := ts.Resolver.Mutation().UpdateUserLanguage(ts.Ctx(), db.UserLangEn)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works for admin and teacher
	_, err = ts.Resolver.Mutation().UpdateUserLanguage(ts.CtxWithUser(admin.ID), db.UserLangEn)
	ts.NoError(err)
	lang := ts.Query1("SELECT language FROM users WHERE id = $1", admin.ID).(string)
	ts.Equal("en", lang)

	_, err = ts.Resolver.Mutation().UpdateUserLanguage(ts.CtxWithUser(admin.ID), db.UserLangDe)
	ts.NoError(err)
	lang = ts.Query1("SELECT language FROM users WHERE id = $1", admin.ID).(string)
	ts.Equal("de", lang)

	_, err = ts.Resolver.Mutation().UpdateUserLanguage(ts.CtxWithUser(teacher.ID), db.UserLangEn)
	ts.NoError(err)
	lang = ts.Query1("SELECT language FROM users WHERE id = $1", teacher.ID).(string)
	ts.Equal("en", lang)

	_, err = ts.Resolver.Mutation().UpdateUserLanguage(ts.CtxWithUser(teacher.ID), db.UserLangDe)
	ts.NoError(err)
	lang = ts.Query1("SELECT language FROM users WHERE id = $1", teacher.ID).(string)
	ts.Equal("de", lang)
}

func (ts *TestSuite) Test_SendUserInvite() {
	admin := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "admin")
	teacher := ts.MockTeacherForOrganisation(ts.FirstOrganisationID())

	// doesn't work if the user is not logged in
	_, err := ts.Resolver.Mutation().SendUserInvite(ts.Ctx(), teacher.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// doesn't work if the user is not an admin
	_, err = ts.Resolver.Mutation().SendUserInvite(ts.CtxWithUser(teacher.ID), teacher.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works if the user is an admin
	_, err = ts.Resolver.Mutation().SendUserInvite(ts.CtxWithUser(admin.ID), teacher.ID)
	ts.NoError(err)

	// invite is sent
	resetToken := ts.Query1("SELECT recovery_token FROM users WHERE id = $1", teacher.ID).(string)
	ts.NotEmpty(resetToken)
	ts.AssertMailReceived(teacher.Email.String, resetToken, "Create your account")
}

func (ts *TestSuite) Test_CreateStudent() {
	admin := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "admin")
	teacher := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "teacher")

	createStudent := func(ctx context.Context, grade int) (*db.User, error) {
		return ts.Resolver.Mutation().CreateStudent(ctx, model.CreateStudentInput{
			FirstName: gonanoid.Must(32),
			LastName:  "tester",
			Grade:     grade,
		})
	}

	// doesn't work if the user is not logged in
	_, err := createStudent(ts.Ctx(), 1)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// doesn't work if the user is not an admin
	_, err = createStudent(ts.CtxWithUser(teacher.ID), 1)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// error on invalid grade, does not create a dangling user
	cnt := ts.Query1("SELECT COUNT(*) FROM users").(int64)
	_, err = createStudent(ts.CtxWithUser(admin.ID), 0)
	ts.Error(err)
	cnt2 := ts.Query1("SELECT COUNT(*) FROM users").(int64)
	ts.Equal(cnt, cnt2)

	// works if the user is an admin
	user, err := createStudent(ts.CtxWithUser(admin.ID), 1)
	ts.NoError(err)
	ts.Equal(db.UserRoleStudent, user.Role)
}

func (ts *TestSuite) Test_CreateUserCompetence() {
	teacher := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "teacher")
	student := ts.MockUserForOrganisation(ts.FirstOrganisationID(), "student")
	student2 := ts.MockUserForOrganisation(ts.FirstOrganisationID(), "student")
	competence := ts.FirstCompetenceForOrganisation(ts.FirstOrganisationID())

	createUserCompetence := func(ctx context.Context, userID string, competenceID string) (*db.UserCompetence, error) {
		return ts.Resolver.Mutation().CreateUserCompetence(ctx, model.CreateUserCompetenceInput{
			Level:        1,
			UserID:       userID,
			CompetenceID: competenceID,
		})
	}

	// doesn't work if the user is not logged in
	_, err := createUserCompetence(ts.Ctx(), teacher.ID, competence.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works if the user is a teacher
	_, err = createUserCompetence(ts.CtxWithUser(teacher.ID), student.ID, competence.ID)
	ts.NoError(err)

	// students cannot create competences for others, only themselves
	_, err = createUserCompetence(ts.CtxWithUser(student.ID), student2.ID, competence.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	_, err = createUserCompetence(ts.CtxWithUser(student2.ID), student2.ID, competence.ID)
	ts.NoError(err)
}

func (ts *TestSuite) Test_CreateTag() {
	teacher := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "teacher")
	student := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "student")

	// error on unauthorized
	_, err := ts.Resolver.Mutation().CreateTag(ts.Ctx(), model.CreateTagInput{Name: gonanoid.Must(8), Color: "blue"})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students are not allowed to create tags
	_, err = ts.Resolver.Mutation().CreateTag(ts.CtxWithUser(student.ID), model.CreateTagInput{Name: gonanoid.Must(8), Color: "blue"})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works for teachers
	_, err = ts.Resolver.Mutation().CreateTag(ts.CtxWithUser(teacher.ID), model.CreateTagInput{
		Name:  gonanoid.Must(8),
		Color: "blue",
	})
	ts.NoError(err)
}

func (ts *TestSuite) Test_ArchiveTag() {
	teacher := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "teacher")
	student := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "student")

	tag, err := ts.Resolver.Mutation().CreateTag(ts.CtxWithUser(teacher.ID), model.CreateTagInput{Name: gonanoid.Must(8), Color: "blue"})
	ts.NoError(err)

	// error on unauthorized
	_, err = ts.Resolver.Mutation().ArchiveTag(ts.Ctx(), tag.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students are not allowed to archive tags
	_, err = ts.Resolver.Mutation().ArchiveTag(ts.CtxWithUser(student.ID), tag.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works for teachers
	_, err = ts.Resolver.Mutation().ArchiveTag(ts.CtxWithUser(teacher.ID), tag.ID)
	ts.NoError(err)
}

func (ts *TestSuite) Test_UpdateTag() {
	teacher := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "teacher")
	student := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "student")

	tag, err := ts.Resolver.Mutation().CreateTag(ts.CtxWithUser(teacher.ID), model.CreateTagInput{Name: gonanoid.Must(8), Color: "blue"})
	ts.NoError(err)

	updateTag := func(ctx context.Context, id string, name string, color string) (*db.Tag, error) {
		return ts.Resolver.Mutation().UpdateTag(ctx, id, model.CreateTagInput{
			Name:  name,
			Color: color,
		})
	}

	// error on unauthorized
	_, err = updateTag(ts.Ctx(), tag.ID, gonanoid.Must(8), "red")
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students are not allowed to update tags
	_, err = updateTag(ts.CtxWithUser(student.ID), tag.ID, gonanoid.Must(8), "red")
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works for teachers
	newName := gonanoid.Must(8)
	updatedTag, err := updateTag(ts.CtxWithUser(teacher.ID), tag.ID, newName, "red")
	ts.NoError(err)
	ts.Equal(newName, updatedTag.Name)
}

func (ts *TestSuite) Test_CreateCompetence() {
	teacher := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "teacher")
	student := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "student")
	parent := ts.FirstSubjectForOrganisation(ts.FirstOrganisationID())

	createCompetence := func(ctx context.Context, name string, parentID string) (*db.Competence, error) {
		return ts.Resolver.Mutation().CreateCompetence(ctx, model.CreateCompetenceInput{
			Name:     name,
			ParentID: parentID,
		})
	}

	// error on unauthorized
	_, err := createCompetence(ts.Ctx(), gonanoid.Must(8), parent.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students are not allowed to create competences
	_, err = createCompetence(ts.CtxWithUser(student.ID), gonanoid.Must(8), parent.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// error on invalid parent
	_, err = createCompetence(ts.CtxWithUser(teacher.ID), gonanoid.Must(8), "invalid")
	ts.Error(err)

	// works for teachers
	_, err = createCompetence(ts.CtxWithUser(teacher.ID), gonanoid.Must(8), parent.ID)
	ts.NoError(err)
}

func (ts *TestSuite) Test_UpdateCompetence() {
	teacher := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "teacher")
	student := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "student")
	comp := ts.FirstCompetenceForOrganisation(ts.FirstOrganisationID())

	updateCompetence := func(ctx context.Context, id string, color string) (*db.Competence, error) {
		return ts.Resolver.Mutation().UpdateCompetence(ctx, model.UpdateCompetenceInput{
			ID:    id,
			Color: &color,
		})
	}

	// error on unauthorized
	_, err := updateCompetence(ts.Ctx(), comp.ID, gonanoid.Must(8))
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students are not allowed to update competences
	_, err = updateCompetence(ts.CtxWithUser(student.ID), comp.ID, gonanoid.Must(8))
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works for teachers
	updatedComp, err := updateCompetence(ts.CtxWithUser(teacher.ID), comp.ID, "gray")
	ts.NoError(err)
	ts.Equal("gray", updatedComp.Color.String)

	updatedComp, err = updateCompetence(ts.CtxWithUser(teacher.ID), comp.ID, "blue")
	ts.NoError(err)
	ts.Equal("blue", updatedComp.Color.String)
}

func (ts *TestSuite) Test_UpdateCompetenceSorting() {
	teacher := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "teacher")
	student := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "student")

	// error on unauthorized
	_, err := ts.Resolver.Mutation().UpdateCompetenceSorting(ts.Ctx(), model.UpdateCompetenceSortingInput{})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students are not allowed to update competences
	_, err = ts.Resolver.Mutation().UpdateCompetenceSorting(ts.CtxWithUser(student.ID), model.UpdateCompetenceSortingInput{})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works for teachers
	competences, err := ts.DB.CompetencesFindOrderedBySortOrderAndName(ts.Ctx(), teacher.OrganisationID)
	ts.NoError(err)

	// shuffle the competences
	newCompetenceOrder := make(map[string]int)
	for _, comp := range competences {
		newCompetenceOrder[comp.ID] = rand.Intn(10000)
	}

	// build update map
	update := model.UpdateCompetenceSortingInput{Competences: make([]model.SortCompetenceInput, 0, len(competences))}
	for _, comp := range competences {
		if len(comp.ID) < 3 {
			continue
		}
		update.Competences = append(update.Competences, model.SortCompetenceInput{ID: comp.ID, SortOrder: newCompetenceOrder[comp.ID]})
	}

	_, err = ts.Resolver.Mutation().UpdateCompetenceSorting(ts.CtxWithUser(teacher.ID), update)
	ts.NoError(err)

	// check if the competences are sorted correctly
	competences, err = ts.DB.CompetencesFindOrderedBySortOrderAndName(ts.Ctx(), teacher.OrganisationID)
	ts.NoError(err)

	for i, comp := range competences {
		if len(comp.ID) < 3 {
			continue
		}

		ts.Equal(int32(newCompetenceOrder[comp.ID]), comp.SortOrder.Int32)
		if i > 0 {
			ts.GreaterOrEqual(comp.SortOrder.Int32, competences[i-1].SortOrder.Int32)
		}
	}
}

func (ts *TestSuite) Test_CompetenceParents() {
	teacher := ts.FirstUserForOrganisation("u2wHWUbnWUaUUjBeNvQ4u", "teacher")

	competenceA, err := ts.DB.CompetenceFindById(ts.Ctx(), db.CompetenceFindByIdParams{
		ID:             "nm5pYXzpYe_rJjHpjnCdH",
		OrganisationID: "u2wHWUbnWUaUUjBeNvQ4u",
	})
	ts.NoError(err)

	competenceB, err := ts.DB.CompetenceFindById(ts.Ctx(), db.CompetenceFindByIdParams{
		ID:             "C3",
		OrganisationID: "u2wHWUbnWUaUUjBeNvQ4u",
	})
	ts.NoError(err)

	// error on unauthorized
	_, err = ts.Resolver.Competence().Parents(ts.Ctx(), &competenceA)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works for teachers
	ctx := ts.CtxWithUser(teacher.ID)
	sema := make(chan int, 1)

	go func() {
		parents, err := ts.Resolver.Competence().Parents(ctx, &competenceA)
		ts.NoError(err)
		ts.Len(parents, 2)
		ts.Equal("Numbers", parents[0].Name)
		ts.Equal("Math", parents[1].Name)
		sema <- 1
	}()
	go func() {
		parents, err := ts.Resolver.Competence().Parents(ctx, &competenceB)
		ts.NoError(err)
		ts.Len(parents, 2)
		ts.Equal("Group", parents[0].Name)
		ts.Equal("Subject", parents[1].Name)
		sema <- 1
	}()

	<-sema
	<-sema
}

func (ts *TestSuite) Test_Competence_Children() {
	teacher := ts.FirstUserForOrganisation("u2wHWUbnWUaUUjBeNvQ4u", "teacher")

	competence, err := ts.DB.CompetenceFindById(ts.Ctx(), db.CompetenceFindByIdParams{
		ID:             "G1",
		OrganisationID: "u2wHWUbnWUaUUjBeNvQ4u",
	})
	ts.NoError(err)

	// error on unauthorized
	_, err = ts.Resolver.Competence().Competences(ts.Ctx(), &competence, nil, nil)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works for teachers. No search / sort returns all children
	ctx := ts.CtxWithUser(teacher.ID)
	children, err := ts.Resolver.Competence().Competences(ctx, &competence, nil, nil)
	ts.NoError(err)
	ts.Len(children, 5)

	// we can search for name
	children, err = ts.Resolver.Competence().Competences(ctx, &competence, lo.ToPtr("Competence"), nil)
	ts.NoError(err)
	ts.Len(children, 2)

	// we can sort by different fields
	children, err = ts.Resolver.Competence().Competences(ctx, &competence, nil, lo.ToPtr(model.CompetenceSort{Field: model.CompetenceSortFieldCreatedAt}))
	ts.NoError(err)

	children, err = ts.Resolver.Competence().Competences(ctx, &competence, nil, lo.ToPtr(model.CompetenceSort{Field: model.CompetenceSortFieldName}))
	ts.NoError(err)
	ts.Equal("Competence 1", children[0].Name)
	ts.Equal("Competence 2", children[1].Name)

	children, err = ts.Resolver.Competence().Competences(ctx, &competence, nil, lo.ToPtr(model.CompetenceSort{Field: model.CompetenceSortFieldSortOrder}))
	ts.NoError(err)
	ts.Equal("Stuff 1", children[0].Name)
	ts.Equal("Stuff 2", children[1].Name)

	// both together
	children, err = ts.Resolver.Competence().Competences(ctx, &competence, lo.ToPtr("Competence"), lo.ToPtr(model.CompetenceSort{Field: model.CompetenceSortFieldSortOrder}))
	ts.NoError(err)
	ts.Len(children, 2)
	ts.Equal("Competence 2", children[0].Name)
}

func (ts *TestSuite) Test_Competence_Resolvers() {
	competence := db.Competence{}

	// no color returns "blue"
	color, err := ts.Resolver.Competence().Color(ts.Ctx(), &competence)
	ts.NoError(err)
	ts.Equal("blue", color)

	// color is returned
	competence.Color = pgtype.Text{Valid: true, String: "red"}
	color, err = ts.Resolver.Competence().Color(ts.Ctx(), &competence)
	ts.NoError(err)
	ts.Equal("red", color)

	// sortOrder is default 0
	sortOrder, err := ts.Resolver.Competence().SortOrder(ts.Ctx(), &competence)
	ts.NoError(err)
	ts.Equal(0, sortOrder)

	// sortOrder is returned
	competence.SortOrder = pgtype.Int4{Valid: true, Int32: 42}
	sortOrder, err = ts.Resolver.Competence().SortOrder(ts.Ctx(), &competence)
	ts.NoError(err)
	ts.Equal(42, sortOrder)

}

func (ts *TestSuite) Test_Competence_UserCompetences_Tendency() {
	teacher := ts.FirstUserForOrganisation("u2wHWUbnWUaUUjBeNvQ4u", "teacher")
	student1 := ts.MockUserForOrganisation("u2wHWUbnWUaUUjBeNvQ4u", "student")
	student2 := ts.MockUserForOrganisation("u2wHWUbnWUaUUjBeNvQ4u", "student")

	group, err := ts.Resolver.Mutation().CreateCompetence(ts.CtxWithUser(teacher.ID), model.CreateCompetenceInput{
		Name:     "Group",
		ParentID: "S1",
	})
	ts.NoError(err)
	ts.Exec("UPDATE competences SET competence_type = 'group' WHERE id = $1", group.ID)
	group.CompetenceType = "group"

	competence, err := ts.Resolver.Mutation().CreateCompetence(ts.CtxWithUser(teacher.ID), model.CreateCompetenceInput{
		Name:     "Competence " + gonanoid.Must(8),
		ParentID: group.ID,
	})
	ts.NoError(err)

	// error on unauthorized
	_, err = ts.Resolver.Competence().UserCompetences(ts.Ctx(), competence, &student1.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works for teachers
	userCompetences, err := ts.Resolver.Competence().UserCompetences(ts.CtxWithUser(teacher.ID), competence, &student1.ID)
	ts.NoError(err)
	ts.Len(userCompetences, 0)

	// insert a user competence
	_, err = ts.Resolver.Mutation().CreateUserCompetence(ts.CtxWithUser(teacher.ID), model.CreateUserCompetenceInput{
		Level:        1,
		UserID:       student1.ID,
		CompetenceID: competence.ID,
	})
	ts.NoError(err)
	_, err = ts.Resolver.Mutation().CreateUserCompetence(ts.CtxWithUser(teacher.ID), model.CreateUserCompetenceInput{
		Level:        2,
		UserID:       student1.ID,
		CompetenceID: competence.ID,
	})
	ts.NoError(err)

	// works for teachers
	userCompetences, err = ts.Resolver.Competence().UserCompetences(ts.CtxWithUser(teacher.ID), competence, &student1.ID)
	ts.NoError(err)
	ts.Len(userCompetences, 2)
	userCompetences, err = ts.Resolver.Competence().UserCompetences(ts.CtxWithUser(teacher.ID), competence, &student2.ID)
	ts.NoError(err)
	ts.Len(userCompetences, 0)

	// tendency for student 1 should be 1
	tendency, err := ts.Resolver.Competence().Tendency(ts.CtxWithUser(teacher.ID), group, student1.ID)
	ts.NoError(err)
	ts.Equal(1.0, tendency.Tendency)

	// tendency for student 2 should be 0
	tendency, err = ts.Resolver.Competence().Tendency(ts.CtxWithUser(teacher.ID), group, student2.ID)
	ts.NoError(err)
	ts.Equal(0., tendency.Tendency)

}

func (ts *TestSuite) Test_Users() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	// error on unauthorized
	_, err := ts.Resolver.Query().Users(ts.Ctx(), nil, nil, nil, nil)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// works to retrieve all users from an organisation
	users, err := ts.Resolver.Query().Users(ts.CtxWithUser(owner.ID), nil, nil, nil, nil)
	ts.NoError(err)

	ts.Len(users.Edges, 3)
	ts.Equal(owner.ID, users.Edges[0].ID)
	ts.Equal(teacher.ID, users.Edges[1].ID)
	ts.Equal(student.ID, users.Edges[2].ID)

	// can use pagination to only get the second user
	users, err = ts.Resolver.Query().Users(ts.CtxWithUser(owner.ID), lo.ToPtr(1), lo.ToPtr(1), nil, nil)
	ts.NoError(err)
	ts.Len(users.Edges, 1)
	ts.Equal(teacher.ID, users.Edges[0].ID)
}

func (ts *TestSuite) Test_Competence() {
	_, owner2 := ts.MockOrganisationWithOwner()

	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	// Create a valid competence
	validCompetence, err := ts.DB.CompetenceCreate(context.Background(), db.CompetenceCreateParams{
		Name:           "Invalid Competence",
		CompetenceID:   pgtype.Text{},
		CompetenceType: db.CompetenceTypeCompetence,
		OrganisationID: org.ID,
		Grades:         []int32{1, 2, 3, 4},
		Color:          pgtype.Text{},
		CreatedBy:      pgtype.Text{},
	})
	ts.NoError(err)

	// Unauthorized access by non-user
	_, err = ts.Resolver.Query().Competence(ts.Ctx(), validCompetence.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// Unauthorized access by a user without permission
	_, err = ts.Resolver.Query().Competence(ts.Ctx(), "invalid")
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// Unauthorized access by a user with permission
	_, err = ts.Resolver.Query().Competence(ts.CtxWithUser(owner2.ID), validCompetence.ID)
	ts.ErrorIs(err, msg.ErrNotFound)

	// Not found errors for invalid competence ID
	_, err = ts.Resolver.Query().Competence(ts.CtxWithUser(owner.ID), "invalid")
	ts.ErrorIs(err, msg.ErrNotFound)

	_, err = ts.Resolver.Query().Competence(ts.CtxWithUser(teacher.ID), "invalid")
	ts.ErrorIs(err, msg.ErrNotFound)

	_, err = ts.Resolver.Query().Competence(ts.CtxWithUser(student.ID), "invalid")
	ts.ErrorIs(err, msg.ErrNotFound)

	// Access valid competence with different roles
	// Owner access
	competence, err := ts.Resolver.Query().Competence(ts.CtxWithUser(owner.ID), validCompetence.ID)
	ts.NoError(err)
	ts.NotNil(competence)

	// Teacher access
	competence, err = ts.Resolver.Query().Competence(ts.CtxWithUser(teacher.ID), validCompetence.ID)
	ts.NoError(err)
	ts.NotNil(competence)

	// Student access
	competence, err = ts.Resolver.Query().Competence(ts.CtxWithUser(student.ID), validCompetence.ID)
	ts.NoError(err)
	ts.NotNil(competence)
}

func (ts *TestSuite) Test_Competences() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	createCompetence := func(ctx context.Context, name string, parentID *string, competenceType db.CompetenceType) (db.Competence, error) {
		return ts.DB.CompetenceCreate(context.Background(), db.CompetenceCreateParams{
			Name:           name,
			CompetenceID:   graph.OptionalString(parentID),
			CompetenceType: competenceType,
			OrganisationID: org.ID,
			Grades:         []int32{1, 2, 3, 4},
			Color:          pgtype.Text{},
		})
	}

	// Unauthorized access by non-user
	_, err := ts.Resolver.Query().Competences(ts.Ctx(), nil, nil, nil, nil, nil)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// create 10 competences
	for i := 1; i <= 10; i++ {
		var competenceType db.CompetenceType
		if i%2 == 0 {
			competenceType = db.CompetenceTypeSubject
		} else {
			competenceType = db.CompetenceTypeGroup
		}
		_, err = createCompetence(ts.CtxWithUser(owner.ID), fmt.Sprintf("Competence %d", i), nil, competenceType)
		ts.NoError(err)
	}

	// All users can read and see all competences of the organisation
	competences, err := ts.Resolver.Query().Competences(ts.CtxWithUser(owner.ID), nil, nil, nil, nil, nil)
	ts.NoError(err)
	ts.Len(competences.Edges, 10)

	// Has no next page
	ts.False(competences.PageInfo.HasNextPage)

	// Teacher can read and see all competences of the organisation
	competences, err = ts.Resolver.Query().Competences(ts.CtxWithUser(teacher.ID), nil, nil, nil, nil, nil)
	ts.NoError(err)
	ts.Len(competences.Edges, 10)

	// Student can read and see all competences of the organisation
	competences, err = ts.Resolver.Query().Competences(ts.CtxWithUser(student.ID), nil, nil, nil, nil, nil)
	ts.NoError(err)
	ts.Len(competences.Edges, 10)

	// Test limit for owner
	competences, err = ts.Resolver.Query().Competences(ts.CtxWithUser(owner.ID), lo.ToPtr(5), nil, nil, nil, nil)
	ts.NoError(err)
	ts.Len(competences.Edges, 5)

	// Has next page
	ts.True(competences.PageInfo.HasNextPage)

	// Test offset for owner
	competences, err = ts.Resolver.Query().Competences(ts.CtxWithUser(owner.ID), nil, lo.ToPtr(5), nil, nil, nil)
	ts.NoError(err)
	ts.Len(competences.Edges, 5)

	// Has no next page
	ts.False(competences.PageInfo.HasNextPage)

	// Test search
	competences, err = ts.Resolver.Query().Competences(ts.CtxWithUser(owner.ID), nil, nil, nil, lo.ToPtr("Competence 7"), nil)
	ts.NoError(err)
	ts.Len(competences.Edges, 1)

	// Test sorting by created at asc
	competences, err = ts.Resolver.Query().Competences(ts.CtxWithUser(owner.ID), nil, nil, nil, nil, lo.ToPtr(model.CompetenceSort{Field: model.CompetenceSortFieldCreatedAt, Order: model.SortDirectionAsc}))
	ts.NoError(err)
	ts.Len(competences.Edges, 10)
	ts.Equal("Competence 1", competences.Edges[0].Name)

	// Test sorting by created at desc
	competences, err = ts.Resolver.Query().Competences(ts.CtxWithUser(owner.ID), nil, nil, nil, nil, lo.ToPtr(model.CompetenceSort{Field: model.CompetenceSortFieldCreatedAt, Order: model.SortDirectionDesc}))
	ts.NoError(err)
	ts.Len(competences.Edges, 10)
	ts.Equal("Competence 10", competences.Edges[0].Name)

	// Filter by competence type
	competences, err = ts.Resolver.Query().Competences(ts.CtxWithUser(owner.ID), nil, nil, &model.CompetenceFilterInput{
		Type: []*db.CompetenceType{lo.ToPtr(db.CompetenceTypeGroup)},
	}, nil, nil)
	ts.NoError(err)
	ts.Len(competences.Edges, 5)

	// Combine filter and sorting and limit
	competences, err = ts.Resolver.Query().Competences(ts.CtxWithUser(owner.ID), lo.ToPtr(5), nil, &model.CompetenceFilterInput{
		Type: []*db.CompetenceType{lo.ToPtr(db.CompetenceTypeGroup)},
	}, nil, lo.ToPtr(model.CompetenceSort{Field: model.CompetenceSortFieldCreatedAt, Order: model.SortDirectionDesc}))
	ts.NoError(err)
	ts.Len(competences.Edges, 5)
	ts.Equal("Competence 9", competences.Edges[0].Name)

	// test filtering of competence_id
	// 1. create a new competence subject
	// 2. create a new competence group with the subject as parent
	org2, owner2 := ts.MockOrganisationWithOwner()

	createCompetenceFunc := func(ctx context.Context, name string, parentID *string, competenceType db.CompetenceType) (db.Competence, error) {
		return ts.DB.CompetenceCreate(context.Background(), db.CompetenceCreateParams{
			Name:           name,
			CompetenceID:   graph.OptionalString(parentID),
			CompetenceType: competenceType,
			OrganisationID: org2.ID,
			Grades:         []int32{1, 2, 3, 4},
			Color:          pgtype.Text{},
			CreatedBy:      graph.OptionalString(lo.ToPtr(owner2.ID)),
		})
	}

	subject, err := createCompetenceFunc(ts.CtxWithUser(owner2.ID), "Subject", nil, db.CompetenceTypeSubject)
	ts.NoError(err)
	_, err = createCompetenceFunc(ts.CtxWithUser(owner2.ID), "Group", &subject.ID, db.CompetenceTypeGroup)
	ts.NoError(err)

	// test filtering of
	competences, err = ts.Resolver.Query().Competences(ts.CtxWithUser(owner2.ID), nil, nil, &model.CompetenceFilterInput{
		Parents: []*string{lo.ToPtr(subject.ID)},
	}, nil, nil)
	ts.NoError(err)
	ts.Len(competences.Edges, 1)
	ts.Equal("Group", competences.Edges[0].Name)
}

func (ts *TestSuite) Test_Tag() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	createTag := func(ctx context.Context, name string) (db.Tag, error) {
		return ts.DB.TagCreate(context.Background(), db.TagCreateParams{
			Name:           name,
			OrganisationID: org.ID,
			Color:          "blue",
		})
	}

	// Unauthorized access by non-user
	tag, err := ts.Resolver.Query().Tag(ts.Ctx(), "test")
	ts.ErrorIs(err, msg.ErrUnauthorized)
	ts.Nil(tag)

	// create a tag
	tagItem, err := createTag(ts.CtxWithUser(owner.ID), "test")
	ts.NoError(err)

	// Teacher can read and see the tag
	tag, err = ts.Resolver.Query().Tag(ts.CtxWithUser(teacher.ID), tagItem.ID)
	ts.NoError(err)
	ts.Equal("test", tag.Name)

	// Student can read and see the tag
	tag, err = ts.Resolver.Query().Tag(ts.CtxWithUser(student.ID), tagItem.ID)
	ts.NoError(err)
	ts.Equal("test", tag.Name)

	// Not found by user from different organisation
	_, owner2 := ts.MockOrganisationWithOwner()
	tag, err = ts.Resolver.Query().Tag(ts.CtxWithUser(owner2.ID), tagItem.ID)
	ts.ErrorIs(err, msg.ErrNotFound)
	ts.Nil(tag)
}

func (ts *TestSuite) Test_Tags() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	createTag := func(ctx context.Context, name string) (db.Tag, error) {
		return ts.DB.TagCreate(context.Background(), db.TagCreateParams{
			Name:           name,
			OrganisationID: org.ID,
			Color:          "blue",
		})
	}

	// Unauthorized access by non-user
	tags, err := ts.Resolver.Query().Tags(ts.Ctx(), nil, nil, nil)
	ts.ErrorIs(err, msg.ErrUnauthorized)
	ts.Nil(tags)

	// create a tag
	tagItem, err := createTag(ts.CtxWithUser(owner.ID), "test")
	ts.NoError(err)

	// Owner can read and see the tag
	tags, err = ts.Resolver.Query().Tags(ts.CtxWithUser(owner.ID), nil, nil, nil)
	ts.NoError(err)
	ts.Len(tags.Edges, 1)
	ts.Equal(tagItem.Name, tags.Edges[0].Name)

	// Teacher can read and see the tag
	tags, err = ts.Resolver.Query().Tags(ts.CtxWithUser(teacher.ID), nil, nil, nil)
	ts.NoError(err)
	ts.Len(tags.Edges, 1)
	ts.Equal("test", tags.Edges[0].Name)

	// Student can read and see the tag
	tags, err = ts.Resolver.Query().Tags(ts.CtxWithUser(student.ID), nil, nil, nil)
	ts.NoError(err)
	ts.Len(tags.Edges, 1)
	ts.Equal("test", tags.Edges[0].Name)

	// Test search for tag
	// create a tag with a different name
	_, err = createTag(ts.CtxWithUser(owner.ID), "test2")
	ts.NoError(err)

	tags, err = ts.Resolver.Query().Tags(ts.CtxWithUser(owner.ID), nil, nil, lo.ToPtr("test2"))
	ts.NoError(err)
	ts.Len(tags.Edges, 1)
	ts.Equal("test2", tags.Edges[0].Name)
}

// Test_UserStudents tests the user students resolver
// Owner can read and see all user students.
// Teacher can read and see all user students.
// Students can read and see their own user students but not other students.
func (ts *TestSuite) Test_UserStudents() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	// Unauthorized access by non-user
	userStudents, err := ts.Resolver.Query().UserStudents(ts.Ctx(), nil, nil)
	ts.ErrorIs(err, msg.ErrUnauthorized)
	ts.Nil(userStudents)

	// Owner can read and see all user students
	userStudents, err = ts.Resolver.Query().UserStudents(ts.CtxWithUser(owner.ID), nil, nil)
	ts.NoError(err)
	ts.Len(userStudents.Edges, 1)
	ts.Equal(student.ID, userStudents.Edges[0].UserID)

	// Teacher can read and see all user students
	userStudents, err = ts.Resolver.Query().UserStudents(ts.CtxWithUser(teacher.ID), nil, nil)
	ts.NoError(err)
	ts.Len(userStudents.Edges, 1)
	ts.Equal(student.ID, userStudents.Edges[0].UserID)

	// Student can read and see their own user students but not other students
	userStudents, err = ts.Resolver.Query().UserStudents(ts.CtxWithUser(student.ID), nil, nil)
	ts.NoError(err)
	ts.Len(userStudents.Edges, 1)
	ts.Equal(student.ID, userStudents.Edges[0].UserID)

	// Create another student and see if student can see it
	student2 := ts.MockUserForOrganisation(org.ID, "student")

	userStudents, err = ts.Resolver.Query().UserStudents(ts.CtxWithUser(student.ID), nil, nil)
	ts.NoError(err)
	ts.Len(userStudents.Edges, 1)
	ts.Equal(student.ID, userStudents.Edges[0].UserID)

	// Teacher should see all students
	userStudents, err = ts.Resolver.Query().UserStudents(ts.CtxWithUser(teacher.ID), nil, nil)
	ts.NoError(err)
	ts.Len(userStudents.Edges, 2)
	ts.Equal(student.ID, userStudents.Edges[0].UserID)
	ts.Equal(student2.ID, userStudents.Edges[1].UserID)
}

func (ts *TestSuite) Test_UserStudent() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	// Unauthorized access by non-user
	userStudent, err := ts.Resolver.Query().UserStudent(ts.Ctx(), student.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)
	ts.Nil(userStudent)

	// Owner can read and see the user student
	userStudent, err = ts.Resolver.Query().UserStudent(ts.CtxWithUser(owner.ID), student.ID)
	ts.NoError(err)
	ts.Equal(student.ID, userStudent.UserID)

	// Teacher can read and see the user student
	userStudent, err = ts.Resolver.Query().UserStudent(ts.CtxWithUser(teacher.ID), student.ID)
	ts.NoError(err)
	ts.Equal(student.ID, userStudent.UserID)

	// Student can read and see their own user student
	userStudent, err = ts.Resolver.Query().UserStudent(ts.CtxWithUser(student.ID), student.ID)
	ts.NoError(err)
	ts.Equal(student.ID, userStudent.UserID)

	// Create another student and see if student can see it
	student2 := ts.MockUserForOrganisation(org.ID, "student")

	// Student cannot read student2
	userStudent, err = ts.Resolver.Query().UserStudent(ts.CtxWithUser(student.ID), student2.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)
	ts.Nil(userStudent)

	// Teacher should see all students
	userStudent, err = ts.Resolver.Query().UserStudent(ts.CtxWithUser(teacher.ID), student2.ID)
	ts.NoError(err)
	ts.Equal(student2.ID, userStudent.UserID)
}

func (ts *TestSuite) Test_InviteDetails() {
	org, owner := ts.MockOrganisationWithOwner()

	// Update recovery token
	user, err := ts.DB.UserUpdateRecoveryToken(ts.CtxWithUser(owner.ID), db.UserUpdateRecoveryTokenParams{
		RecoveryToken:  gonanoid.Must(32),
		ID:             owner.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)
	ts.NotEmpty(user.RecoveryToken)

	details, err := ts.Resolver.Query().InviteDetails(ts.CtxWithUser(owner.ID), user.RecoveryToken.String)
	ts.NoError(err)
	ts.NotEmpty(details.Email)
	ts.NotEmpty(details.FirstName)
	ts.NotEmpty(details.LastName)

	// Invalid token for authorized user should return an error
	details, err = ts.Resolver.Query().InviteDetails(ts.Ctx(), "invalid")
	ts.ErrorIs(err, msg.ErrNotFound)
	ts.Nil(details)

	// Invalid token should return an error
	details, err = ts.Resolver.Query().InviteDetails(ts.CtxWithUser(owner.ID), "invalid")
	ts.ErrorIs(err, msg.ErrNotFound)
	ts.Nil(details)

	// Invalid token for unauthorized user should return an error
	details, err = ts.Resolver.Query().InviteDetails(ts.Ctx(), "invalid")
	ts.ErrorIs(err, msg.ErrNotFound)
	ts.Nil(details)
}

func (ts *TestSuite) Test_Tag_Resolvers() {
	org, owner := ts.MockOrganisationWithOwner()

	tag, err := ts.DB.TagCreate(ts.CtxWithUser(owner.ID), db.TagCreateParams{
		Name:           gonanoid.Must(8),
		OrganisationID: org.ID,
		Color:          "red",
	})
	ts.NoError(err)

	// Color resolver
	color, err := ts.Resolver.Tag().Color(ts.CtxWithUser(owner.ID), &tag)
	ts.NoError(err)
	ts.NotEmpty(color)
	ts.Equal("red", color)

	// DeletedAt resolver
	createdAt, err := ts.Resolver.Tag().DeletedAt(ts.CtxWithUser(owner.ID), &tag)
	ts.NoError(err)
	ts.Nil(createdAt)

	// DeletedAt resolver for deleted tag
	tag.DeletedAt = graph.OptionalTimestamp(lo.ToPtr(time.Now()))
	createdAt, err = ts.Resolver.Tag().DeletedAt(ts.CtxWithUser(owner.ID), &tag)
	ts.NoError(err)
	ts.NotEmpty(createdAt)
}

func (ts *TestSuite) Test_User_Resolvers() {
	org, owner := ts.MockOrganisationWithOwner()
	user := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	// Email resolver
	email, err := ts.Resolver.User().Email(ts.CtxWithUser(owner.ID), &user)
	ts.NoError(err)
	ts.NotEmpty(email)

	// Student resolver
	studentStudent, err := ts.Resolver.User().Student(ts.CtxWithUser(owner.ID), &student)
	ts.NoError(err)
	ts.NotNil(studentStudent)
	ts.Equal(student.ID, studentStudent.UserID)

	// Language resolver (with default fallback)
	language, err := ts.Resolver.User().Language(ts.CtxWithUser(owner.ID), &user)
	ts.NoError(err)
	ts.Equal(lo.ToPtr(db.UserLangEn), language)

	// DeletedAt resolver
	createdAt, err := ts.Resolver.User().DeletedAt(ts.CtxWithUser(owner.ID), &user)
	ts.NoError(err)
	ts.Nil(createdAt)

	// DeletedAt resolver for deleted user
	user.DeletedAt = graph.OptionalTimestamp(lo.ToPtr(time.Now()))
	createdAt, err = ts.Resolver.User().DeletedAt(ts.CtxWithUser(owner.ID), &user)
	ts.NoError(err)
	ts.NotEmpty(createdAt)
	user.DeletedAt = graph.OptionalTimestamp(nil)

	// InviteAccepted resolver
	accepted, err := ts.Resolver.User().InviteAccepted(ts.CtxWithUser(owner.ID), &user)
	ts.NoError(err)
	ts.False(accepted)
}

func (ts *TestSuite) Test_UserCompetence_Resolvers() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	// UserCompetence resolver
	competence, err := ts.DB.CompetenceCreate(ts.CtxWithUser(owner.ID), db.CompetenceCreateParams{
		Name:           "Competence 1",
		OrganisationID: org.ID,
		CompetenceType: db.CompetenceTypeCompetence,
		Grades:         []int32{1, 2, 3, 4},
	})
	ts.NoError(err)

	userCompetence, err := ts.DB.UserCompetenceCreateWithoutEntry(ts.CtxWithUser(owner.ID), db.UserCompetenceCreateWithoutEntryParams{
		Level:          1,
		UserID:         student.ID,
		CompetenceID:   competence.ID,
		OrganisationID: org.ID,
		CreatedBy:      pgtype.Text{String: teacher.ID, Valid: true},
	})
	ts.NoError(err)

	competenceFromUserCompetence, err := ts.Resolver.UserCompetence().Competence(ts.CtxWithUser(owner.ID), &userCompetence)
	ts.NoError(err)
	ts.NotNil(competenceFromUserCompetence)

	// Entry resolver
	entry, err := ts.DB.EntryCreate(ts.CtxWithUser(teacher.ID), db.EntryCreateParams{
		Date:           pgtype.Date{Time: time.Now(), Valid: true},
		Body:           "test",
		UserID:         teacher.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	userCompetence.EntryID = pgtype.Text{String: entry.ID, Valid: true}

	entryFromUserCompetence, err := ts.Resolver.UserCompetence().Entry(ts.CtxWithUser(owner.ID), &userCompetence)
	ts.NoError(err)
	ts.NotNil(entryFromUserCompetence)
	ts.Equal(entry.ID, entryFromUserCompetence.ID)

	// User resolver
	userCompetenceUser, err := ts.Resolver.UserCompetence().User(ts.CtxWithUser(owner.ID), &userCompetence)
	ts.NoError(err)
	ts.NotNil(userCompetenceUser)
	ts.Equal(student.ID, userCompetenceUser.ID)

	// CreatedBy resolver
	createdBy, err := ts.Resolver.UserCompetence().CreatedBy(ts.CtxWithUser(owner.ID), &userCompetence)
	ts.NoError(err)
	ts.NotNil(createdBy)
	ts.Equal(teacher.ID, createdBy.ID)
}

func (ts *TestSuite) Test_UserStudent_Resolvers() {
	org, owner := ts.MockOrganisationWithOwner()
	//teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	// LeftAt resolver
	leftAt, err := ts.Resolver.UserStudent().LeftAt(ts.CtxWithUser(owner.ID), &db.UserStudent{
		UserID:         student.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)
	ts.Nil(leftAt)

	// Birthday resolver
	birthday, err := ts.Resolver.UserStudent().Birthday(ts.CtxWithUser(owner.ID), &db.UserStudent{
		UserID:         student.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)
	ts.Nil(birthday)

	// Nationality resolver
	nationality, err := ts.Resolver.UserStudent().Nationality(ts.CtxWithUser(owner.ID), &db.UserStudent{
		UserID:         student.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)
	ts.Nil(nationality)

	// Comments resolver
	comments, err := ts.Resolver.UserStudent().Comments(ts.CtxWithUser(owner.ID), &db.UserStudent{
		UserID:         student.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)
	ts.Nil(comments)

	// JoinedAt resolver
	joinedAt, err := ts.Resolver.UserStudent().JoinedAt(ts.CtxWithUser(owner.ID), &db.UserStudent{
		UserID:         student.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)
	ts.Nil(joinedAt)

	// DeletedAt resolver
	deletedAt, err := ts.Resolver.UserStudent().DeletedAt(ts.CtxWithUser(owner.ID), &db.UserStudent{
		UserID:         student.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)
	ts.Nil(deletedAt)

	// EntriesCount resolver
	entriesCount, err := ts.Resolver.UserStudent().EntriesCount(ts.CtxWithUser(owner.ID), &db.UserStudent{
		UserID:         student.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)
	ts.Equal(0, entriesCount)

	// CompetencesCount resolver
	competencesCount, err := ts.Resolver.UserStudent().CompetencesCount(ts.CtxWithUser(owner.ID), &db.UserStudent{
		UserID:         student.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)
	ts.Equal(0, competencesCount)

	// EventsCount resolver
	eventsCount, err := ts.Resolver.UserStudent().EventsCount(ts.CtxWithUser(owner.ID), &db.UserStudent{
		UserID:         student.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)
	ts.Equal(0, eventsCount)

	// Emoji resolver
	emoji, err := ts.Resolver.UserStudent().Emoji(ts.CtxWithUser(owner.ID), &db.UserStudent{
		UserID:         student.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)
	ts.Nil(emoji)

	// User resolver
	user, err := ts.Resolver.UserStudent().User(ts.CtxWithUser(owner.ID), &db.UserStudent{
		UserID:         student.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)
	ts.NotNil(user)

	// MissedHours resolver
	missedHours, err := ts.Resolver.UserStudent().MissedHours(ts.CtxWithUser(owner.ID), &db.UserStudent{
		UserID:         student.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)
	ts.Equal(0, missedHours)

	// MissedHoursExcused resolver
	missedHoursExcused, err := ts.Resolver.UserStudent().MissedHoursExcused(ts.CtxWithUser(owner.ID), &db.UserStudent{
		UserID:         student.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)
	ts.Equal(0, missedHoursExcused)
}

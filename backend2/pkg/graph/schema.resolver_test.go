package graph_test

import (
	"context"
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

	ts.AssertMailReceived(user.Email.String, token, "Change my password")

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
	ts.Exec("update competences set competence_type = 'group' where id = $1", group.ID)
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

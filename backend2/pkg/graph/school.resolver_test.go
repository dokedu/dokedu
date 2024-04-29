package graph_test

import (
	"bytes"
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/jackc/pgx/v5"
	gonanoid "github.com/matoous/go-nanoid/v2"
	"github.com/samber/lo"

	"github.com/dokedu/dokedu/backend/internal/testdata"
	"github.com/dokedu/dokedu/backend/pkg/graph/model"
	"github.com/dokedu/dokedu/backend/pkg/msg"
	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

func (ts *TestSuite) Test_CreateSubject() {
	teacher := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "teacher")
	student := ts.MockUserForOrganisation(ts.FirstOrganisationID(), "student")

	// error on unauthorized
	_, err := ts.Resolver.Mutation().CreateSubject(ts.Ctx(), model.CreateSubjectInput{
		Name: "Subject",
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students cannot create subjects
	_, err = ts.Resolver.Mutation().CreateSubject(ts.CtxWithUser(student.ID), model.CreateSubjectInput{
		Name: "Subject",
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// Teacher can create a subject
	subject, err := ts.Resolver.Mutation().CreateSubject(ts.CtxWithUser(teacher.ID), model.CreateSubjectInput{
		Name: "Subject",
	})
	ts.NoError(err)
	ts.Equal("Subject", subject.Name)
}

func (ts *TestSuite) Test_UpdateSubject() {
	teacher := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "teacher")
	student := ts.MockUserForOrganisation(ts.FirstOrganisationID(), "student")
	subject := ts.FirstSubjectForOrganisation(ts.FirstOrganisationID())

	name := gonanoid.Must(8)

	// error on unauthorized
	_, err := ts.Resolver.Mutation().UpdateSubject(ts.Ctx(), model.UpdateSubjectInput{
		ID:   subject.ID,
		Name: name,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students cannot update subjects
	_, err = ts.Resolver.Mutation().UpdateSubject(ts.CtxWithUser(student.ID), model.UpdateSubjectInput{
		ID:   subject.ID,
		Name: name,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// teacher can update a subject
	updatedSubject, err := ts.Resolver.Mutation().UpdateSubject(ts.CtxWithUser(teacher.ID), model.UpdateSubjectInput{
		ID:   subject.ID,
		Name: name,
	})
	ts.NoError(err)
	ts.Equal(name, updatedSubject.Name)
}

func (ts *TestSuite) Test_DeleteSubject() {
	teacher := ts.FirstUserForOrganisation(ts.FirstOrganisationID(), "teacher")
	student := ts.MockUserForOrganisation(ts.FirstOrganisationID(), "student")

	subject, err := ts.Resolver.Mutation().CreateSubject(ts.CtxWithUser(teacher.ID), model.CreateSubjectInput{
		Name: "Subject",
	})
	ts.NoError(err)

	// error on unauthorized
	_, err = ts.Resolver.Mutation().DeleteSubject(ts.Ctx(), subject.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students cannot delete subjects
	_, err = ts.Resolver.Mutation().DeleteSubject(ts.CtxWithUser(student.ID), subject.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// teacher can delete a subject
	_, err = ts.Resolver.Mutation().DeleteSubject(ts.CtxWithUser(teacher.ID), subject.ID)
	ts.NoError(err)

	// subject should be deleted
	_, err = ts.DB.SubjectFindByID(ts.CtxWithUser(teacher.ID), db.SubjectFindByIDParams{
		ID:             subject.ID,
		OrganisationID: ts.FirstOrganisationID(),
	})
	ts.ErrorIs(err, pgx.ErrNoRows)
}

func (ts *TestSuite) Test_CreateSchoolYear() {
	org, _ := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	// error on unauthorized
	_, err := ts.Resolver.Mutation().CreateSchoolYear(ts.Ctx(), model.CreateSchoolYearInput{
		Year: 2005,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students cannot create school years
	_, err = ts.Resolver.Mutation().CreateSchoolYear(ts.CtxWithUser(student.ID), model.CreateSchoolYearInput{
		Year: 2005,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// teacher can create a school year
	schoolYear, err := ts.Resolver.Mutation().CreateSchoolYear(ts.CtxWithUser(teacher.ID), model.CreateSchoolYearInput{
		Year: 2005,
	})
	ts.NoError(err)
	ts.Equal(int32(2005), schoolYear.Year)
}

func (ts *TestSuite) Test_UpdateSchoolYear() {
	org, _ := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	schoolYear, err := ts.Resolver.Mutation().CreateSchoolYear(ts.CtxWithUser(teacher.ID), model.CreateSchoolYearInput{
		Year: 2004,
	})
	ts.NoError(err)

	// error on unauthorized
	_, err = ts.Resolver.Mutation().UpdateSchoolYear(ts.Ctx(), model.UpdateSchoolYearInput{
		ID:   schoolYear.ID,
		Year: 2005,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students cannot update school years
	_, err = ts.Resolver.Mutation().UpdateSchoolYear(ts.CtxWithUser(student.ID), model.UpdateSchoolYearInput{
		ID:   schoolYear.ID,
		Year: 2005,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// teacher can update a school year
	updatedSchoolYear, err := ts.Resolver.Mutation().UpdateSchoolYear(ts.CtxWithUser(teacher.ID), model.UpdateSchoolYearInput{
		ID:   schoolYear.ID,
		Year: 2005,
	})
	ts.NoError(err)
	ts.Equal(int32(2005), updatedSchoolYear.Year)
}

func (ts *TestSuite) Test_DeleteSchoolYear() {
	org, _ := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	schoolYear, err := ts.Resolver.Mutation().CreateSchoolYear(ts.CtxWithUser(teacher.ID), model.CreateSchoolYearInput{
		Year: 2005,
	})
	ts.NoError(err)

	// error on unauthorized
	_, err = ts.Resolver.Mutation().DeleteSchoolYear(ts.Ctx(), schoolYear.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students cannot delete school years
	_, err = ts.Resolver.Mutation().DeleteSchoolYear(ts.CtxWithUser(student.ID), schoolYear.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// teacher can delete a school year
	_, err = ts.Resolver.Mutation().DeleteSchoolYear(ts.CtxWithUser(teacher.ID), schoolYear.ID)
	ts.NoError(err)

	// school year should be deleted
	_, err = ts.DB.SchoolYearFindByID(ts.CtxWithUser(teacher.ID), db.SchoolYearFindByIDParams{
		ID:             schoolYear.ID,
		OrganisationID: org.ID,
	})
	ts.ErrorIs(err, pgx.ErrNoRows)
}

func (ts *TestSuite) Test_ImportStudents() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)

	importStudents := func(ctx context.Context, file []byte, fileType string) (*model.ImportStudentsPayload, error) {
		return ts.Resolver.Mutation().ImportStudents(ctx, model.ImportStudentsInput{
			File: graphql.Upload{
				File:        bytes.NewReader(file),
				Filename:    "students.ods",
				Size:        int64(len(file)),
				ContentType: fileType,
			},
		})
	}

	// error on unauthorized
	_, err := importStudents(ts.Ctx(), []byte{}, "application/vnd.oasis.opendocument.spreadsheet")
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// error on teacher
	_, err = importStudents(ts.CtxWithUser(teacher.ID), []byte{}, "application/vnd.oasis.opendocument.spreadsheet")
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// error on invalid file type
	_, err = importStudents(ts.CtxWithUser(owner.ID), []byte{}, "application/pdf")
	ts.ErrorIs(err, msg.ErrStudentsImportWrongFormat)

	// error on unparsable file
	_, err = importStudents(ts.CtxWithUser(owner.ID), testdata.Testfile, "application/vnd.ms-excel")
	ts.Error(err)

	// error on invalid header
	_, err = importStudents(ts.CtxWithUser(owner.ID), testdata.StudentImportWrongHeader, "application/vnd.ms-excel")
	ts.Error(err)

	// error on invalid birthdate
	_, err = importStudents(ts.CtxWithUser(owner.ID), testdata.StudentImportWrongBirthdate, "application/vnd.ms-excel")
	ts.Error(err)

	// works
	payload, err := importStudents(ts.CtxWithUser(owner.ID), testdata.StudentImportData1, "application/vnd.ms-excel")
	ts.NoError(err)
	ts.Equal(3, payload.UsersCreated)
	ts.Equal(0, payload.UsersExisted)

	// works and deduplicates
	payload, err = importStudents(ts.CtxWithUser(owner.ID), testdata.StudentImportData2, "application/vnd.ms-excel")
	ts.NoError(err)
	ts.Equal(1, payload.UsersCreated)
	ts.Equal(3, payload.UsersExisted)
}

func (ts *TestSuite) Test_Subjects() {
	student := ts.MockUserForOrganisation(ts.FirstOrganisationID(), "student")
	allSubjectCount := ts.Query1("SELECT COUNT(*) FROM subjects WHERE organisation_id = $1 AND deleted_at IS  NULL", ts.FirstOrganisationID()).(int64)

	// error on unauthorized
	_, err := ts.Resolver.Query().Subjects(ts.Ctx(), nil, nil)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students can list subjects
	res, err := ts.Resolver.Query().Subjects(ts.CtxWithUser(student.ID), nil, nil)
	ts.NoError(err)
	ts.GreaterOrEqual(len(res.Edges), 1)

	// pagination works
	var graphSubjectCount int64
	var nextPage int
	for {
		res, err := ts.Resolver.Query().Subjects(ts.CtxWithUser(student.ID), lo.ToPtr(2), lo.ToPtr(nextPage*2))
		ts.NoError(err)
		graphSubjectCount += int64(len(res.Edges))

		if !res.PageInfo.HasNextPage {
			break
		}
		nextPage = res.PageInfo.CurrentPage
	}
	ts.Equal(allSubjectCount, graphSubjectCount)
}

func (ts *TestSuite) Test_Subject() {
	_, owner := ts.MockOrganisationWithOwner()
	student := ts.MockUserForOrganisation(ts.FirstOrganisationID(), "student")
	subject := ts.FirstSubjectForOrganisation(ts.FirstOrganisationID())

	// error on unauthorized
	_, err := ts.Resolver.Query().Subject(ts.Ctx(), subject.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students can view subjects
	res, err := ts.Resolver.Query().Subject(ts.CtxWithUser(student.ID), subject.ID)
	ts.NoError(err)
	ts.Equal(subject.ID, res.ID)

	// error on non-existing subject
	_, err = ts.Resolver.Query().Subject(ts.CtxWithUser(student.ID), "non-existing")
	ts.ErrorIs(err, pgx.ErrNoRows)

	// error on user from different organisation
	_, err = ts.Resolver.Query().Subject(ts.CtxWithUser(owner.ID), subject.ID)
	ts.ErrorIs(err, pgx.ErrNoRows)
}

func (ts *TestSuite) Test_SchoolYears() {
	student := ts.MockUserForOrganisation(ts.FirstOrganisationID(), "student")
	allSchoolYearCount := ts.Query1("SELECT COUNT(*) FROM school_years WHERE organisation_id = $1", ts.FirstOrganisationID()).(int64)

	// error on unauthorized
	_, err := ts.Resolver.Query().SchoolYears(ts.Ctx(), nil, nil)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students can list school years
	res, err := ts.Resolver.Query().SchoolYears(ts.CtxWithUser(student.ID), nil, nil)
	ts.NoError(err)
	ts.GreaterOrEqual(len(res.Edges), 1)

	// pagination works
	var graphSchoolYearCount int64
	var nextPage int
	for {
		res, err := ts.Resolver.Query().SchoolYears(ts.CtxWithUser(student.ID), lo.ToPtr(2), lo.ToPtr(nextPage*2))
		ts.NoError(err)
		graphSchoolYearCount += int64(len(res.Edges))

		if !res.PageInfo.HasNextPage {
			break
		}
		nextPage = res.PageInfo.CurrentPage
	}
	ts.Equal(allSchoolYearCount, graphSchoolYearCount)
}

func (ts *TestSuite) Test_SchoolYear() {
	_, owner := ts.MockOrganisationWithOwner()
	student := ts.MockUserForOrganisation(ts.FirstOrganisationID(), "student")
	schoolYear := ts.FirstSchoolYearForOrganisation(ts.FirstOrganisationID())

	// error on unauthorized
	_, err := ts.Resolver.Query().SchoolYear(ts.Ctx(), schoolYear.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students can view school years
	res, err := ts.Resolver.Query().SchoolYear(ts.CtxWithUser(student.ID), schoolYear.ID)
	ts.NoError(err)
	ts.Equal(schoolYear.ID, res.ID)

	// error on non-existing school year
	_, err = ts.Resolver.Query().SchoolYear(ts.CtxWithUser(student.ID), "non-existing")
	ts.ErrorIs(err, pgx.ErrNoRows)

	// error on user from different organisation
	_, err = ts.Resolver.Query().SchoolYear(ts.CtxWithUser(owner.ID), schoolYear.ID)
	ts.ErrorIs(err, pgx.ErrNoRows)

	// can use .description
	description, err := ts.Resolver.SchoolYear().Description(ts.Ctx(), &schoolYear)
	ts.NoError(err)
	ts.Equal(schoolYear.Description.String, description)
}

func (ts *TestSuite) Test_UserStudentGrades() {
	teacher := ts.MockTeacherForOrganisation(ts.FirstOrganisationID())
	student := ts.MockUserForOrganisation(ts.FirstOrganisationID(), "student")
	gradeCount := ts.Query1("SELECT COUNT(*) FROM user_student_grades WHERE organisation_id = $1 AND deleted_at IS NULL", ts.FirstOrganisationID()).(int64)

	// error on unauthorized
	_, err := ts.Resolver.Query().UserStudentGrades(ts.Ctx(), nil, nil)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students cannot view grades
	_, err = ts.Resolver.Query().UserStudentGrades(ts.CtxWithUser(student.ID), nil, nil)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// teacher can view grades
	_, err = ts.Resolver.Query().UserStudentGrades(ts.CtxWithUser(teacher.ID), nil, nil)
	ts.NoError(err)

	// pagination works
	var graphGradeCount int64
	var nextPage int
	for {
		res, err := ts.Resolver.Query().UserStudentGrades(ts.CtxWithUser(teacher.ID), lo.ToPtr(2), lo.ToPtr(nextPage*2))
		ts.NoError(err)
		graphGradeCount += int64(len(res.Edges))

		if !res.PageInfo.HasNextPage {
			break
		}
		nextPage = res.PageInfo.CurrentPage
	}
	ts.Equal(gradeCount, graphGradeCount)
}

func (ts *TestSuite) Test_UserStudentGrade() {
	_, owner := ts.MockOrganisationWithOwner()
	student := ts.MockUserForOrganisation(ts.FirstOrganisationID(), "student")
	teacher := ts.MockTeacherForOrganisation(ts.FirstOrganisationID())
	grade := ts.FirstUserStudentGradeForOrganisation(ts.FirstOrganisationID())

	// error on unauthorized
	_, err := ts.Resolver.Query().UserStudentGrade(ts.Ctx(), grade.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// students cannot view grades
	_, err = ts.Resolver.Query().UserStudentGrade(ts.CtxWithUser(student.ID), grade.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// teacher can view grades
	_, err = ts.Resolver.Query().UserStudentGrade(ts.CtxWithUser(teacher.ID), grade.ID)
	ts.NoError(err)

	// user from different organisation cannot view grades
	_, err = ts.Resolver.Query().UserStudentGrade(ts.CtxWithUser(owner.ID), grade.ID)
	ts.ErrorIs(err, pgx.ErrNoRows)

	// can use .subject
	subject, err := ts.Resolver.UserStudentGrades().Subject(ts.CtxWithUser(teacher.ID), &grade)
	ts.NoError(err)
	ts.Equal(grade.SubjectID, subject.ID)
	ts.NotEmpty(subject.Name)

	// can use .schoolYear
	schoolYear, err := ts.Resolver.UserStudentGrades().SchoolYear(ts.CtxWithUser(teacher.ID), &grade)
	ts.NoError(err)
	ts.Equal(grade.SchoolYearID, schoolYear.ID)
	ts.NotEmpty(schoolYear.Year)

	// can use .student
	graphStudent, err := ts.Resolver.UserStudentGrades().Student(ts.CtxWithUser(teacher.ID), &grade)
	ts.NoError(err)
	ts.Equal(grade.UserStudentID, graphStudent.ID)
	ts.NotEmpty(graphStudent.UserID)
}

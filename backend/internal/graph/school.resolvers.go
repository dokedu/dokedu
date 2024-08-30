package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.40

import (
	"context"
	"fmt"
	"slices"
	"time"

	"github.com/uptrace/bun"
	excelize "github.com/xuri/excelize/v2"

	"github.com/dokedu/dokedu/backend/internal/db"
	"github.com/dokedu/dokedu/backend/internal/graph/model"
	"github.com/dokedu/dokedu/backend/internal/helper"
	"github.com/dokedu/dokedu/backend/internal/middleware"
)

// CreateSubject is the resolver for the createSubject field.
func (r *mutationResolver) CreateSubject(ctx context.Context, input model.CreateSubjectInput) (*db.Subject, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var subject db.Subject
	subject.Name = input.Name
	subject.OrganisationID = currentUser.OrganisationID

	err = r.DB.NewInsert().Model(&subject).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &subject, nil
}

// UpdateSubject is the resolver for the updateSubject field.
func (r *mutationResolver) UpdateSubject(ctx context.Context, input model.UpdateSubjectInput) (*db.Subject, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var subject db.Subject
	subject.Name = input.Name
	err = r.DB.NewUpdate().Model(&subject).Where("organisation_id = ?", currentUser.OrganisationID).Column("name").Where("id = ?", input.ID).Returning("*").Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &subject, nil
}

// DeleteSubject is the resolver for the deleteSubject field.
func (r *mutationResolver) DeleteSubject(ctx context.Context, id string) (*db.Subject, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var subject db.Subject
	err = r.DB.NewDelete().Model(&subject).Where("organisation_id = ?", currentUser.OrganisationID).Where("id = ?", id).Returning("*").Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &subject, nil
}

// CreateSchoolYear is the resolver for the createSchoolYear field.
func (r *mutationResolver) CreateSchoolYear(ctx context.Context, input model.CreateSchoolYearInput) (*db.SchoolYear, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var schoolYear db.SchoolYear
	schoolYear.Year = input.Year
	schoolYear.OrganisationID = currentUser.OrganisationID

	err = r.DB.NewInsert().Model(&schoolYear).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &schoolYear, nil
}

// UpdateSchoolYear is the resolver for the updateSchoolYear field.
func (r *mutationResolver) UpdateSchoolYear(ctx context.Context, input model.UpdateSchoolYearInput) (*db.SchoolYear, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var schoolYear db.SchoolYear
	schoolYear.Year = input.Year
	err = r.DB.NewUpdate().Model(&schoolYear).Where("organisation_id = ?", currentUser.OrganisationID).Column("year").Where("id = ?", input.ID).Returning("*").Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &schoolYear, nil
}

// DeleteSchoolYear is the resolver for the deleteSchoolYear field.
func (r *mutationResolver) DeleteSchoolYear(ctx context.Context, id string) (*db.SchoolYear, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var schoolYear db.SchoolYear
	err = r.DB.NewDelete().Model(&schoolYear).Where("organisation_id = ?", currentUser.OrganisationID).Where("id = ?", id).Returning("*").Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &schoolYear, nil
}

// UpdateUserStudentGrade is the resolver for the updateUserStudentGrade field.
func (r *mutationResolver) UpdateUserStudentGrade(ctx context.Context, input model.UpdateUserStudentGradesInput) (*db.UserStudentGrades, error) {
	panic(fmt.Errorf("not implemented: UpdateUserStudentGrade - updateUserStudentGrade"))
}

// ImportStudents imports students from an Excel file.
func (r *mutationResolver) ImportStudents(ctx context.Context, input model.ImportStudentsInput) (*model.ImportStudentsPayload, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	if !currentUser.HasPermissionAdmin() {
		return &model.ImportStudentsPayload{
			Errors: []model.ImportStudentsError{
				model.ImportStudentsErrorPermissionDenied,
			},
		}, nil
	}

	// Validate file content type
	allowedContentTypes := []string{"application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
	if !slices.Contains(allowedContentTypes, input.File.ContentType) {
		return &model.ImportStudentsPayload{
			Errors: []model.ImportStudentsError{
				model.ImportStudentsErrorFormatWrong,
			},
		}, nil
	}

	// Open Excel file
	file := input.File.File
	f, err := excelize.OpenReader(file)
	if err != nil {
		return nil, err
	}

	// Get first sheet
	sheetMap := f.GetSheetMap()
	var firstSheet string
	for _, sheet := range sheetMap {
		firstSheet = sheet
		break
	}

	// Get rows from first sheet
	rows, err := f.GetRows(firstSheet)
	if err != nil {
		return nil, err
	}

	// Validate headers
	allowedHeaders := []string{"Vorname", "Nachname", "Geburtsdatum"}
	headers := rows[0]
	for _, header := range headers {
		if !slices.Contains(allowedHeaders, header) {
			return &model.ImportStudentsPayload{
				Errors: []model.ImportStudentsError{
					model.ImportStudentsErrorHeaderWrong,
				},
			}, nil
		}
	}

	// Get existing users and students
	var existingUsers []*db.User
	err = r.DB.NewSelect().Model(&existingUsers).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	var existingStudents []*db.UserStudent
	err = r.DB.NewSelect().Model(&existingStudents).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	// Create a map of existing students by user ID
	existingStudentsByUserMap := make(map[string]*db.UserStudent)
	for _, student := range existingStudents {
		existingStudentsByUserMap[student.UserID] = student
	}

	// Create new users and students
	var users []*db.User
	var students []*db.UserStudent

	tx, err := r.DB.BeginTx(ctx, nil)
	defer tx.Rollback()

	existingUserCount := 0

LoopRows:
	for _, row := range rows[1:] {
		if len(row) == 0 {
			continue
		}

		user := r.createUserFromRow(row, currentUser.OrganisationID)
		student, err := r.createStudentFromRow(user, row, currentUser.OrganisationID)
		if err != nil {
			return nil, err
		}

		// Check if user already exists
		for _, existingUser := range existingUsers {
			if existingUser.FirstName == user.FirstName && existingUser.LastName == user.LastName {
				existingUserCount++
				continue LoopRows
			}
		}

		// Also check if in the already added users and students there is a user with the same name or birthday
		for _, existingUser := range users {
			if existingUser.FirstName == user.FirstName && existingUser.LastName == user.LastName {
				existingUserCount++
				continue LoopRows
			}
		}

		err = tx.NewInsert().Model(user).Where("organisation_id = ?", currentUser.OrganisationID).Returning("*").Scan(ctx)
		if err != nil {
			return nil, err
		}

		student.UserID = user.ID

		err = tx.NewInsert().Model(student).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
		if err != nil {
			return nil, err
		}

		users = append(users, user)
		students = append(students, student)
	}

	if len(users) > 0 {
		err = tx.Commit()
		if err != nil {
			return nil, err
		}
	}

	return &model.ImportStudentsPayload{
		UsersCreated: len(users),
		UsersExisted: existingUserCount,
	}, nil
}

// Subjects is the resolver for the subjects field.
func (r *queryResolver) Subjects(ctx context.Context, limit *int, offset *int) (*model.SubjectConnection, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	pageLimit, pageOffset := helper.SetPageLimits(limit, offset)

	var subjects []*db.Subject
	count, err := r.DB.
		NewSelect().
		Model(&subjects).
		Where("organisation_id = ?", currentUser.OrganisationID).
		Order("name").
		Limit(pageLimit).
		Offset(pageOffset).
		ScanAndCount(ctx)
	if err != nil {
		return nil, err
	}

	pageInfo, err := helper.CreatePageInfo(pageLimit, pageOffset, count)
	if err != nil {
		return nil, err
	}

	return &model.SubjectConnection{
		Edges:      subjects,
		PageInfo:   pageInfo,
		TotalCount: count,
	}, nil
}

// Subject is the resolver for the subject field.
func (r *queryResolver) Subject(ctx context.Context, id string) (*db.Subject, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var subject db.Subject
	err = r.DB.NewSelect().Model(&subject).Where("organisation_id = ?", currentUser.OrganisationID).Where("id = ?", id).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &subject, nil
}

// SchoolYears is the resolver for the SchoolYears field.
func (r *queryResolver) SchoolYears(ctx context.Context, limit *int, offset *int) (*model.SchoolYearConnection, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	pageLimit, pageOffset := helper.SetPageLimits(limit, offset)

	if limit != nil {
		pageLimit = *limit
	}
	if offset != nil {
		pageOffset = *offset
	}

	var schoolYears []*db.SchoolYear
	count, err := r.DB.
		NewSelect().
		Model(&schoolYears).
		Where("organisation_id = ?", currentUser.OrganisationID).
		Order("year DESC").
		Limit(pageLimit).
		Offset(pageOffset).
		ScanAndCount(ctx)
	if err != nil {
		return nil, err
	}

	pageInfo, err := helper.CreatePageInfo(pageLimit, pageOffset, count)
	if err != nil {
		return nil, err
	}

	return &model.SchoolYearConnection{
		Edges:    schoolYears,
		PageInfo: pageInfo,
	}, nil
}

// SchoolYear is the resolver for the SchoolYear field.
func (r *queryResolver) SchoolYear(ctx context.Context, id string) (*db.SchoolYear, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var schoolYear db.SchoolYear
	err = r.DB.NewSelect().Model(&schoolYear).Where("organisation_id = ?", currentUser.OrganisationID).Where("id = ?", id).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &schoolYear, nil
}

// UserStudentGrades is the resolver for the userStudentGrades field.
func (r *queryResolver) UserStudentGrades(ctx context.Context, limit *int, offset *int) (*model.UserStudentGradesConnection, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	pageLimit, pageOffset := helper.SetPageLimits(limit, offset)

	var userStudentGrades []*db.UserStudentGrades
	count, err := r.DB.
		NewSelect().
		Model(&userStudentGrades).
		Where("organisation_id = ?", currentUser.OrganisationID).
		Limit(pageLimit).
		Offset(pageOffset).
		ScanAndCount(ctx)

	if err != nil {
		return nil, err
	}

	pageInfo, err := helper.CreatePageInfo(pageLimit, pageOffset, count)
	if err != nil {
		return nil, err
	}

	return &model.UserStudentGradesConnection{
		Edges:    userStudentGrades,
		PageInfo: pageInfo,
	}, nil
}

// UserStudentGrade is the resolver for the userStudentGrade field.
func (r *queryResolver) UserStudentGrade(ctx context.Context, id string) (*db.UserStudentGrades, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var userStudentGrade db.UserStudentGrades
	err = r.DB.NewSelect().Model(&userStudentGrade).Where("organisation_id = ?", currentUser.OrganisationID).Where("id = ?", id).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &userStudentGrade, nil
}

// Student is the resolver for the student field.
func (r *userStudentGradesResolver) Student(ctx context.Context, obj *db.UserStudentGrades) (*db.UserStudent, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var student db.UserStudent
	err = r.DB.NewSelect().Model(&student).Where("organisation_id = ?", currentUser.OrganisationID).Where("id = ?", obj.UserStudentID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &student, nil
}

// Subject is the resolver for the subject field.
func (r *userStudentGradesResolver) Subject(ctx context.Context, obj *db.UserStudentGrades) (*db.Subject, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var subject db.Subject
	err = r.DB.NewSelect().Model(&subject).Where("organisation_id = ?", currentUser.OrganisationID).Where("id = ?", obj.SubjectID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &subject, nil
}

// SchoolYear is the resolver for the schoolYear field.
func (r *userStudentGradesResolver) SchoolYear(ctx context.Context, obj *db.UserStudentGrades) (*db.SchoolYear, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var schoolYear db.SchoolYear
	err = r.DB.NewSelect().Model(&schoolYear).Where("organisation_id = ?", currentUser.OrganisationID).Where("id = ?", obj.SchoolYearID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &schoolYear, nil
}

// UserStudentGrades returns UserStudentGradesResolver implementation.
func (r *Resolver) UserStudentGrades() UserStudentGradesResolver {
	return &userStudentGradesResolver{r}
}

type userStudentGradesResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//   - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//     it when you're done.
//   - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *mutationResolver) createUserFromRow(row []string, organisationID string) *db.User {
	var user db.User
	user.FirstName = row[0]
	user.LastName = row[1]
	user.OrganisationID = organisationID
	user.Role = db.UserRoleStudent

	return &user
}
func (r *mutationResolver) createStudentFromRow(user *db.User, row []string, organisationID string) (*db.UserStudent, error) {
	var student db.UserStudent
	student.UserID = user.ID

	// Parse row[2] as date (currently in format dd.mm.yyyy)
	birthday, err := time.Parse("02.01.2006", row[2])
	if err != nil {
		return nil, err
	}

	student.Birthday = bun.NullTime{Time: birthday}
	student.Grade = 1
	student.OrganisationID = organisationID

	return &student, nil
}

package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.45

import (
	"context"
	"fmt"

	"github.com/dokedu/dokedu/backend/pkg/graph/model"
	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

// CreateSubject is the resolver for the createSubject field.
func (r *mutationResolver) CreateSubject(ctx context.Context, input model.CreateSubjectInput) (*db.Subject, error) {
	panic(fmt.Errorf("not implemented: CreateSubject - createSubject"))
}

// UpdateSubject is the resolver for the updateSubject field.
func (r *mutationResolver) UpdateSubject(ctx context.Context, input model.UpdateSubjectInput) (*db.Subject, error) {
	panic(fmt.Errorf("not implemented: UpdateSubject - updateSubject"))
}

// DeleteSubject is the resolver for the deleteSubject field.
func (r *mutationResolver) DeleteSubject(ctx context.Context, id string) (*db.Subject, error) {
	panic(fmt.Errorf("not implemented: DeleteSubject - deleteSubject"))
}

// CreateSchoolYear is the resolver for the createSchoolYear field.
func (r *mutationResolver) CreateSchoolYear(ctx context.Context, input model.CreateSchoolYearInput) (*db.SchoolYear, error) {
	panic(fmt.Errorf("not implemented: CreateSchoolYear - createSchoolYear"))
}

// UpdateSchoolYear is the resolver for the updateSchoolYear field.
func (r *mutationResolver) UpdateSchoolYear(ctx context.Context, input model.UpdateSchoolYearInput) (*db.SchoolYear, error) {
	panic(fmt.Errorf("not implemented: UpdateSchoolYear - updateSchoolYear"))
}

// DeleteSchoolYear is the resolver for the deleteSchoolYear field.
func (r *mutationResolver) DeleteSchoolYear(ctx context.Context, id string) (*db.SchoolYear, error) {
	panic(fmt.Errorf("not implemented: DeleteSchoolYear - deleteSchoolYear"))
}

// UpdateUserStudentGrade is the resolver for the updateUserStudentGrade field.
func (r *mutationResolver) UpdateUserStudentGrade(ctx context.Context, input model.UpdateUserStudentGradesInput) (*model.UserStudentGrades, error) {
	panic(fmt.Errorf("not implemented: UpdateUserStudentGrade - updateUserStudentGrade"))
}

// ImportStudents is the resolver for the importStudents field.
func (r *mutationResolver) ImportStudents(ctx context.Context, input model.ImportStudentsInput) (*model.ImportStudentsPayload, error) {
	panic(fmt.Errorf("not implemented: ImportStudents - importStudents"))
}

// Subjects is the resolver for the subjects field.
func (r *queryResolver) Subjects(ctx context.Context, limit *int, offset *int) (*model.SubjectConnection, error) {
	panic(fmt.Errorf("not implemented: Subjects - subjects"))
}

// Subject is the resolver for the subject field.
func (r *queryResolver) Subject(ctx context.Context, id string) (*db.Subject, error) {
	panic(fmt.Errorf("not implemented: Subject - subject"))
}

// SchoolYears is the resolver for the schoolYears field.
func (r *queryResolver) SchoolYears(ctx context.Context, limit *int, offset *int) (*model.SchoolYearConnection, error) {
	panic(fmt.Errorf("not implemented: SchoolYears - schoolYears"))
}

// SchoolYear is the resolver for the schoolYear field.
func (r *queryResolver) SchoolYear(ctx context.Context, id string) (*db.SchoolYear, error) {
	panic(fmt.Errorf("not implemented: SchoolYear - schoolYear"))
}

// UserStudentGrades is the resolver for the userStudentGrades field.
func (r *queryResolver) UserStudentGrades(ctx context.Context, limit *int, offset *int) (*model.UserStudentGradesConnection, error) {
	panic(fmt.Errorf("not implemented: UserStudentGrades - userStudentGrades"))
}

// UserStudentGrade is the resolver for the userStudentGrade field.
func (r *queryResolver) UserStudentGrade(ctx context.Context, id string) (*model.UserStudentGrades, error) {
	panic(fmt.Errorf("not implemented: UserStudentGrade - userStudentGrade"))
}

// Description is the resolver for the description field.
func (r *schoolYearResolver) Description(ctx context.Context, obj *db.SchoolYear) (string, error) {
	panic(fmt.Errorf("not implemented: Description - description"))
}

// SchoolYear returns SchoolYearResolver implementation.
func (r *Resolver) SchoolYear() SchoolYearResolver { return &schoolYearResolver{r} }

type schoolYearResolver struct{ *Resolver }

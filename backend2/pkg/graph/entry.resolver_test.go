package graph_test

import (
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/samber/lo"

	"github.com/dokedu/dokedu/backend/pkg/graph"
	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

func (ts *TestSuite) Test_Entry_Resolvers_Date() {
	org, owner := ts.MockOrganisationWithOwner()

	date := time.Now()

	entry, err := ts.DB.EntryCreate(ts.CtxWithUser(owner.ID), db.EntryCreateParams{
		Date:           graph.OptionalDate(lo.ToPtr(date)),
		Body:           "test",
		UserID:         owner.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	resDate, err := ts.Resolver.Entry().Date(ts.CtxWithUser(owner.ID), &entry)
	ts.NoError(err)

	ts.Equal(date.Format("02.01.2006"), resDate)
}

func (ts *TestSuite) Test_Entry_Resolvers_DeletedAt() {
	org, owner := ts.MockOrganisationWithOwner()

	entry, err := ts.DB.EntryCreate(ts.CtxWithUser(owner.ID), db.EntryCreateParams{
		Date:           graph.OptionalDate(lo.ToPtr(time.Now())),
		Body:           "test",
		UserID:         owner.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	deletedAt, err := ts.Resolver.Entry().DeletedAt(ts.CtxWithUser(owner.ID), &entry)
	ts.NoError(err)

	// entry should not be deleted
	ts.Nil(deletedAt)

	entry, err = ts.DB.EntrySoftDelete(ts.CtxWithUser(owner.ID), db.EntrySoftDeleteParams{
		ID:             entry.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	deletedAt, err = ts.Resolver.Entry().DeletedAt(ts.CtxWithUser(owner.ID), &entry)
	ts.NoError(err)

	// entry should be deleted
	ts.NotNil(deletedAt)
}

func (ts *TestSuite) Test_Entry_Resolvers_User() {
	org, owner := ts.MockOrganisationWithOwner()

	entry, err := ts.DB.EntryCreate(ts.CtxWithUser(owner.ID), db.EntryCreateParams{
		Date:           graph.OptionalDate(lo.ToPtr(time.Now())),
		Body:           "test",
		UserID:         owner.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	user, err := ts.Resolver.Entry().User(ts.CtxWithUser(owner.ID), &entry)
	ts.NoError(err)

	ts.Equal(owner.ID, user.ID)
}

func (ts *TestSuite) Test_Entry_Resolvers_Users() {
	org, owner := ts.MockOrganisationWithOwner()
	student := ts.MockUserForOrganisation(org.ID, "student")

	entry, err := ts.DB.EntryCreate(ts.CtxWithUser(owner.ID), db.EntryCreateParams{
		Date:           graph.OptionalDate(lo.ToPtr(time.Now())),
		Body:           "test",
		UserID:         owner.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	users, err := ts.Resolver.Entry().Users(ts.CtxWithUser(owner.ID), &entry)
	ts.NoError(err)
	ts.Len(users, 0)

	// create an entry_user
	_, err = ts.DB.EntryUserCreate(ts.CtxWithUser(owner.ID), db.EntryUserCreateParams{
		EntryID:        entry.ID,
		UserID:         student.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	users, err = ts.Resolver.Entry().Users(ts.CtxWithUser(owner.ID), &entry)
	ts.NoError(err)
	ts.Len(users, 1)
	ts.Equal(student.ID, users[0].ID)
}

func (ts *TestSuite) Test_Entry_Resolvers_Events() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)

	entry, err := ts.DB.EntryCreate(ts.CtxWithUser(owner.ID), db.EntryCreateParams{
		Date:           graph.OptionalDate(lo.ToPtr(time.Now())),
		Body:           "test",
		UserID:         owner.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	event, err := ts.DB.EventCreate(ts.CtxWithUser(teacher.ID), db.EventCreateParams{
		ImageFileID:    graph.OptionalString(nil),
		Title:          "Event",
		Body:           "Body",
		StartsAt:       time.Now(),
		EndsAt:         time.Now().Add(time.Hour),
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	// create an entry_event
	_, err = ts.DB.EntryEventCreate(ts.CtxWithUser(owner.ID), db.EntryEventCreateParams{
		EntryID:        entry.ID,
		EventID:        event.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	events, err := ts.Resolver.Entry().Events(ts.CtxWithUser(owner.ID), &entry)
	ts.NoError(err)
	ts.Len(events, 1)
	ts.Equal(events[0].ID, events[0].ID)
}

func (ts *TestSuite) Test_Entry_Resolvers_Files() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_Entry_Resolvers_Tags() {
	org, owner := ts.MockOrganisationWithOwner()
	student := ts.MockUserForOrganisation(org.ID, "student")

	entry, err := ts.DB.EntryCreate(ts.CtxWithUser(owner.ID), db.EntryCreateParams{
		Date:           graph.OptionalDate(lo.ToPtr(time.Now())),
		Body:           "test",
		UserID:         owner.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	tag, err := ts.DB.TagCreate(ts.CtxWithUser(student.ID), db.TagCreateParams{
		Name:           "Tag",
		OrganisationID: org.ID,
		Color:          "blue",
	})
	ts.NoError(err)

	// create an entry_tag
	_, err = ts.DB.EntryTagCreate(ts.CtxWithUser(owner.ID), db.EntryTagCreateParams{
		EntryID:        entry.ID,
		TagID:          tag.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	tags, err := ts.Resolver.Entry().Tags(ts.CtxWithUser(owner.ID), &entry)
	ts.NoError(err)
	ts.Len(tags, 1)
	ts.Equal(tags[0].ID, tags[0].ID)
}

func (ts *TestSuite) Test_Entry_Resolvers_UserCompetences() {
	org, owner := ts.MockOrganisationWithOwner()
	student := ts.MockUserForOrganisation(org.ID, "student")

	entry, err := ts.DB.EntryCreate(ts.CtxWithUser(owner.ID), db.EntryCreateParams{
		Date:           graph.OptionalDate(lo.ToPtr(time.Now())),
		Body:           "test",
		UserID:         owner.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	competence, err := ts.DB.CompetenceCreate(ts.CtxWithUser(student.ID), db.CompetenceCreateParams{
		Name:           "Competence",
		OrganisationID: org.ID,
		CompetenceType: db.CompetenceTypeCompetence,
		Grades:         []int32{1, 2, 3, 4},
		Color:          pgtype.Text{String: "blue", Valid: true},
	})
	ts.NoError(err)

	_, err = ts.DB.UserCompetenceCreate(ts.CtxWithUser(student.ID), db.UserCompetenceCreateParams{
		Level:          1,
		UserID:         student.ID,
		EntryID:        pgtype.Text{String: entry.ID, Valid: true},
		CompetenceID:   competence.ID,
		OrganisationID: org.ID,
		CreatedBy:      pgtype.Text{String: owner.ID, Valid: true},
	})
	ts.NoError(err)

	userCompetences, err := ts.Resolver.Entry().UserCompetences(ts.CtxWithUser(owner.ID), &entry)
	ts.NoError(err)
	ts.Len(userCompetences, 1)
	ts.Equal(userCompetences[0].ID, userCompetences[0].ID)
}

func (ts *TestSuite) Test_Entry_Resolvers_Subjects() {
	org, owner := ts.MockOrganisationWithOwner()
	student := ts.MockUserForOrganisation(org.ID, "student")

	entry, err := ts.DB.EntryCreate(ts.CtxWithUser(owner.ID), db.EntryCreateParams{
		Date:           graph.OptionalDate(lo.ToPtr(time.Now())),
		Body:           "test",
		UserID:         owner.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	subject, err := ts.DB.CompetenceCreate(ts.CtxWithUser(student.ID), db.CompetenceCreateParams{
		Name:           "Subject",
		Grades:         []int32{1, 2, 3, 4},
		CompetenceType: db.CompetenceTypeSubject,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	childCompetence, err := ts.DB.CompetenceCreate(ts.CtxWithUser(student.ID), db.CompetenceCreateParams{
		Name:           "Child Competence",
		OrganisationID: org.ID,
		CompetenceType: db.CompetenceTypeCompetence,
		Grades:         []int32{1, 2, 3, 4},
		Color:          pgtype.Text{String: "blue", Valid: true},
		CompetenceID:   pgtype.Text{String: subject.ID, Valid: true},
	})
	ts.NoError(err)

	_, err = ts.DB.UserCompetenceCreate(ts.CtxWithUser(student.ID), db.UserCompetenceCreateParams{
		Level:          1,
		UserID:         student.ID,
		EntryID:        pgtype.Text{String: entry.ID, Valid: true},
		CompetenceID:   childCompetence.ID,
		OrganisationID: org.ID,
		CreatedBy:      pgtype.Text{String: owner.ID, Valid: true},
	})
	ts.NoError(err)

	subjects, err := ts.Resolver.Entry().Subjects(ts.CtxWithUser(owner.ID), &entry)
	ts.NoError(err)
	ts.Len(subjects, 1)
	ts.Equal(subjects[0].ID, subject.ID)

	// TEST IF MULTIPLE COMPETENCES WITH THE SAME SUBJECT RESULTS IN ONLY ONE SUBJECT TO BE RETURNED (INSTEAD OF TWO)
	org, owner = ts.MockOrganisationWithOwner()
	student = ts.MockUserForOrganisation(org.ID, "student")

	entry, err = ts.DB.EntryCreate(ts.CtxWithUser(owner.ID), db.EntryCreateParams{
		Date:           graph.OptionalDate(lo.ToPtr(time.Now())),
		Body:           "test",
		UserID:         owner.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	subject, err = ts.DB.CompetenceCreate(ts.CtxWithUser(student.ID), db.CompetenceCreateParams{
		Name:           "Subject",
		Grades:         []int32{1, 2, 3, 4},
		CompetenceType: db.CompetenceTypeSubject,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	childCompetence, err = ts.DB.CompetenceCreate(ts.CtxWithUser(student.ID), db.CompetenceCreateParams{
		Name:           "Child Competence",
		OrganisationID: org.ID,
		CompetenceType: db.CompetenceTypeCompetence,
		Grades:         []int32{1, 2, 3, 4},
		Color:          pgtype.Text{String: "blue", Valid: true},
		CompetenceID:   pgtype.Text{String: subject.ID, Valid: true},
	})
	ts.NoError(err)

	childCompetence2, err := ts.DB.CompetenceCreate(ts.CtxWithUser(student.ID), db.CompetenceCreateParams{
		Name:           "Child Competence 2",
		OrganisationID: org.ID,
		CompetenceType: db.CompetenceTypeCompetence,
		Grades:         []int32{1, 2, 3, 4},
		Color:          pgtype.Text{String: "blue", Valid: true},
		CompetenceID:   pgtype.Text{String: subject.ID, Valid: true},
	})
	ts.NoError(err)

	_, err = ts.DB.UserCompetenceCreate(ts.CtxWithUser(student.ID), db.UserCompetenceCreateParams{
		Level:          1,
		UserID:         student.ID,
		EntryID:        pgtype.Text{String: entry.ID, Valid: true},
		CompetenceID:   childCompetence.ID,
		OrganisationID: org.ID,
		CreatedBy:      pgtype.Text{String: owner.ID, Valid: true},
	})
	ts.NoError(err)

	_, err = ts.DB.UserCompetenceCreate(ts.CtxWithUser(student.ID), db.UserCompetenceCreateParams{
		Level:          1,
		UserID:         student.ID,
		EntryID:        pgtype.Text{String: entry.ID, Valid: true},
		CompetenceID:   childCompetence2.ID,
		OrganisationID: org.ID,
		CreatedBy:      pgtype.Text{String: owner.ID, Valid: true},
	})
	ts.NoError(err)

	subjects, err = ts.Resolver.Entry().Subjects(ts.CtxWithUser(owner.ID), &entry)
	ts.NoError(err)
	ts.Len(subjects, 1)
	ts.Equal(subjects[0].ID, subject.ID)
}

func (ts *TestSuite) Test_Entry_CreateEntry() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_Entry_UpdateEntry() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_Entry_ArchiveEntry() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_CreateEntryTag() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_CreateEntryFile() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_CreateEntryUser() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_CreateEntryEvent() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_CreateEntryCompetence() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_DeleteEntryTag() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_DeleteEntryFile() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_DeleteEntryUser() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_DeleteEntryEvent() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_DeleteEntryCompetence() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_UpdateEntryUserCompetenceLevel() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_UploadFileToEntry() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_RemoveFileFromEntry() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_Entry() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_Entries() {
	ts.Fail("not implemented")
}

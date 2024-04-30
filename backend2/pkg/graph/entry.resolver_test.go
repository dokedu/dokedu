package graph_test

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/samber/lo"

	"github.com/dokedu/dokedu/backend/pkg/graph"
	"github.com/dokedu/dokedu/backend/pkg/graph/model"
	"github.com/dokedu/dokedu/backend/pkg/msg"
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

	// Expect the date to be formatted as "2006-01-02 00:00:00 +0000 UTC"
	ts.Equal(date.Format("2006-01-02 00:00:00 +0000 UTC"), resDate)
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
	org, owner := ts.MockOrganisationWithOwner()
	student := ts.MockUserForOrganisation(org.ID, "student")

	entry, err := ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(owner.ID))
	ts.NoError(err)
	ts.NotNil(entry)
	ts.Equal(entry.OrganisationID, org.ID)
	ts.Equal(entry.UserID, owner.ID)

	// Students can also create entries
	entry, err = ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(student.ID))
	ts.NoError(err)
	ts.NotNil(entry)
	ts.Equal(entry.OrganisationID, org.ID)
	ts.Equal(entry.UserID, student.ID)
}

func (ts *TestSuite) Test_Entry_UpdateEntry() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	entry, err := ts.DB.EntryCreate(ts.CtxWithUser(owner.ID), db.EntryCreateParams{
		Date:           graph.OptionalDate(lo.ToPtr(time.Now())),
		Body:           "test",
		UserID:         owner.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	updatedEntry, err := ts.Resolver.Mutation().UpdateEntry(ts.CtxWithUser(owner.ID), model.UpdateEntryInput{
		ID:   entry.ID,
		Body: lo.ToPtr("new body"),
	})
	ts.NoError(err)
	ts.Equal("new body", updatedEntry.Body)

	// Teacher can update the entry
	updatedEntry, err = ts.Resolver.Mutation().UpdateEntry(ts.CtxWithUser(teacher.ID), model.UpdateEntryInput{
		ID:   entry.ID,
		Body: lo.ToPtr("new body 2"),
	})
	ts.NoError(err)
	ts.Equal("new body 2", updatedEntry.Body)

	// Student cannot update the entry
	_, err = ts.Resolver.Mutation().UpdateEntry(ts.CtxWithUser(student.ID), model.UpdateEntryInput{
		ID:   entry.ID,
		Body: lo.ToPtr("new body 3"),
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// Student can update their own entry
	entry2, err := ts.DB.EntryCreate(ts.CtxWithUser(student.ID), db.EntryCreateParams{
		Date:           graph.OptionalDate(lo.ToPtr(time.Now())),
		Body:           "test",
		UserID:         student.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	updatedEntry, err = ts.Resolver.Mutation().UpdateEntry(ts.CtxWithUser(student.ID), model.UpdateEntryInput{
		ID:   entry2.ID,
		Body: lo.ToPtr("new body 5"),
	})
	ts.NoError(err)
	ts.Equal("new body 5", updatedEntry.Body)
}

func (ts *TestSuite) Test_Entry_ArchiveEntry() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	// Owner can archive the entry
	entry, err := ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(owner.ID))
	ts.NoError(err)

	archivedEntry, err := ts.Resolver.Mutation().ArchiveEntry(ts.CtxWithUser(owner.ID), entry.ID)
	ts.NoError(err)
	ts.NotNil(archivedEntry)
	ts.Equal(entry.ID, archivedEntry.ID)

	// Teacher can archive the entry
	entry, err = ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(owner.ID))
	ts.NoError(err)

	archivedEntry, err = ts.Resolver.Mutation().ArchiveEntry(ts.CtxWithUser(teacher.ID), entry.ID)
	ts.NoError(err)
	ts.NotNil(archivedEntry)
	ts.Equal(entry.ID, archivedEntry.ID)

	// Student cannot archive the entry
	entry, err = ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(owner.ID))
	ts.NoError(err)

	_, err = ts.Resolver.Mutation().ArchiveEntry(ts.CtxWithUser(student.ID), entry.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// If the entry is created by the student, they can archive it
	entry, err = ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(student.ID))
	ts.NoError(err)

	archivedEntry, err = ts.Resolver.Mutation().ArchiveEntry(ts.CtxWithUser(student.ID), entry.ID)
	ts.NoError(err)
	ts.NotNil(archivedEntry)
	ts.Equal(entry.ID, archivedEntry.ID)
}

func (ts *TestSuite) Test_CreateEntryTag() {
	org, owner := ts.MockOrganisationWithOwner()
	student := ts.MockUserForOrganisation(org.ID, "student")

	entry, err := ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(owner.ID))
	ts.NoError(err)

	tag, err := ts.DB.TagCreate(ts.CtxWithUser(owner.ID), db.TagCreateParams{
		Name:           "Tag",
		OrganisationID: org.ID,
		Color:          "blue",
	})
	ts.NoError(err)

	entry, err = ts.Resolver.Mutation().CreateEntryTag(ts.CtxWithUser(owner.ID), model.CreateEntryTagInput{
		EntryID: entry.ID,
		TagID:   tag.ID,
	})
	ts.NoError(err)
	ts.NotNil(entry)

	// Students cannot create entry tags for another user's entry
	_, err = ts.Resolver.Mutation().CreateEntryTag(ts.CtxWithUser(student.ID), model.CreateEntryTagInput{
		EntryID: entry.ID,
		TagID:   tag.ID,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// Students can create entry tags for their own entry
	entry, err = ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(student.ID))
	ts.NoError(err)

	entry, err = ts.Resolver.Mutation().CreateEntryTag(ts.CtxWithUser(student.ID), model.CreateEntryTagInput{
		EntryID: entry.ID,
		TagID:   tag.ID,
	})
	ts.NoError(err)
	ts.NotNil(entry)
}

func (ts *TestSuite) Test_CreateEntryFile() {
	org, owner := ts.MockOrganisationWithOwner()
	student := ts.MockUserForOrganisation(org.ID, "student")

	entry, err := ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(owner.ID))
	ts.NoError(err)

	bucket, err := ts.DB.BucketForEntryFiles(ts.CtxWithUser(owner.ID), org.ID)
	ts.NoError(err)
	ts.NotNil(bucket)

	file, err := ts.DB.FileCreate(ts.CtxWithUser(owner.ID), db.FileCreateParams{
		Name:           "File",
		FileType:       db.FileTypeBlob,
		MimeType:       pgtype.Text{Valid: true, String: "application/pdf"},
		Size:           100,
		BucketID:       bucket.ID,
		ParentID:       pgtype.Text{Valid: true, String: entry.ID},
		OrganisationID: org.ID,
	})
	ts.NoError(err)
	ts.NotNil(file)

	// Owner can create an entry file
	_, err = ts.Resolver.Mutation().CreateEntryFile(ts.CtxWithUser(owner.ID), model.CreateEntryFileInput{
		EntryID: entry.ID,
		FileID:  file.ID,
	})
	ts.NoError(err)

	// Students cannot create entry files for another user's entry
	_, err = ts.Resolver.Mutation().CreateEntryFile(ts.CtxWithUser(student.ID), model.CreateEntryFileInput{
		EntryID: entry.ID,
		FileID:  file.ID,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// Students can create entry files for their own entry
	entry, err = ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(student.ID))
	ts.NoError(err)

	entry, err = ts.Resolver.Mutation().CreateEntryFile(ts.CtxWithUser(student.ID), model.CreateEntryFileInput{
		EntryID: entry.ID,
		FileID:  file.ID,
	})
	ts.NoError(err)
	ts.NotNil(entry)
}

func (ts *TestSuite) Test_CreateEntryUser() {
	org, owner := ts.MockOrganisationWithOwner()
	student := ts.MockUserForOrganisation(org.ID, "student")

	entry, err := ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(owner.ID))
	ts.NoError(err)

	entryUser, err := ts.Resolver.Mutation().CreateEntryUser(ts.CtxWithUser(owner.ID), model.CreateEntryUserInput{
		EntryID: entry.ID,
		UserID:  student.ID,
	})
	ts.NoError(err)
	ts.NotNil(entryUser)

	// Students cannot create entry users
	_, err = ts.Resolver.Mutation().CreateEntryUser(ts.CtxWithUser(student.ID), model.CreateEntryUserInput{
		EntryID: entry.ID,
		UserID:  student.ID,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// Students cannot create entry users for their own entry
	entry, err = ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(student.ID))
	ts.NoError(err)

	entryUser, err = ts.Resolver.Mutation().CreateEntryUser(ts.CtxWithUser(student.ID), model.CreateEntryUserInput{
		EntryID: entry.ID,
		UserID:  student.ID,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)
}

func (ts *TestSuite) Test_CreateEntryEvent() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	entry, err := ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(owner.ID))
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

	// Owner can create an entry event
	entry, err = ts.Resolver.Mutation().CreateEntryEvent(ts.CtxWithUser(owner.ID), model.CreateEntryEventInput{
		EntryID: entry.ID,
		EventID: event.ID,
	})
	ts.NoError(err)
	ts.NotNil(entry)

	// Students cannot create entry events for another user's entry
	_, err = ts.Resolver.Mutation().CreateEntryEvent(ts.CtxWithUser(student.ID), model.CreateEntryEventInput{
		EntryID: entry.ID,
		EventID: event.ID,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// Students can create entry events for their own entry
	entry, err = ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(student.ID))
	ts.NoError(err)

	entry, err = ts.Resolver.Mutation().CreateEntryEvent(ts.CtxWithUser(student.ID), model.CreateEntryEventInput{
		EntryID: entry.ID,
		EventID: event.ID,
	})
	ts.NoError(err)
	ts.NotNil(entry)
}

func (ts *TestSuite) Test_CreateEntryCompetence() {
	org, owner := ts.MockOrganisationWithOwner()
	student := ts.MockUserForOrganisation(org.ID, "student")

	entry, err := ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(owner.ID))
	ts.NoError(err)

	competence, err := ts.DB.CompetenceCreate(ts.CtxWithUser(student.ID), db.CompetenceCreateParams{
		Name:           "Competence",
		OrganisationID: org.ID,
		Grades:         []int32{1, 2, 3, 4},
		CompetenceID:   graph.OptionalString(nil),
		CompetenceType: db.CompetenceTypeCompetence,
	})
	ts.NoError(err)

	// Owner can create an entry competence
	entry, err = ts.Resolver.Mutation().CreateEntryCompetence(ts.CtxWithUser(owner.ID), model.CreateEntryCompetenceInput{
		EntryID:      entry.ID,
		CompetenceID: competence.ID,
	})
	ts.NoError(err)
	ts.NotNil(entry)

	// Students cannot create entry competences for another user's entry
	_, err = ts.Resolver.Mutation().CreateEntryCompetence(ts.CtxWithUser(student.ID), model.CreateEntryCompetenceInput{
		EntryID:      entry.ID,
		CompetenceID: competence.ID,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// Students can create entry competences for their own entry
	entry, err = ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(student.ID))
	ts.NoError(err)

	entry, err = ts.Resolver.Mutation().CreateEntryCompetence(ts.CtxWithUser(student.ID), model.CreateEntryCompetenceInput{
		EntryID:      entry.ID,
		CompetenceID: competence.ID,
	})
	ts.NoError(err)
	ts.NotNil(entry)
}

func (ts *TestSuite) Test_DeleteEntryTag() {
	org, owner := ts.MockOrganisationWithOwner()
	student := ts.MockUserForOrganisation(org.ID, "student")

	entry, err := ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(owner.ID))
	ts.NoError(err)

	tag, err := ts.DB.TagCreate(ts.CtxWithUser(owner.ID), db.TagCreateParams{
		Name:           "Tag",
		OrganisationID: org.ID,
		Color:          "blue",
	})
	ts.NoError(err)

	createEntryTag := func(ctx context.Context, entryID string, tagID string) (*db.Entry, error) {
		return ts.Resolver.Mutation().CreateEntryTag(ctx, model.CreateEntryTagInput{
			EntryID: entryID,
			TagID:   tagID,
		})
	}

	_, err = createEntryTag(ts.CtxWithUser(owner.ID), entry.ID, tag.ID)
	ts.NoError(err)

	// Owner can delete an entry tag
	_, err = ts.Resolver.Mutation().DeleteEntryTag(ts.CtxWithUser(owner.ID), model.DeleteEntryTagInput{
		EntryID: entry.ID,
		TagID:   tag.ID,
	})
	ts.NoError(err)

	// Students cannot delete entry tags for another user's entry
	_, err = createEntryTag(ts.CtxWithUser(owner.ID), entry.ID, tag.ID)
	ts.NoError(err)

	_, err = ts.Resolver.Mutation().DeleteEntryTag(ts.CtxWithUser(student.ID), model.DeleteEntryTagInput{
		EntryID: entry.ID,
		TagID:   tag.ID,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// Students can delete entry tags for their own entry
	entry, err = ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(student.ID))
	ts.NoError(err)

	_, err = createEntryTag(ts.CtxWithUser(student.ID), entry.ID, tag.ID)
	ts.NoError(err)

	entry, err = ts.Resolver.Mutation().DeleteEntryTag(ts.CtxWithUser(student.ID), model.DeleteEntryTagInput{
		EntryID: entry.ID,
		TagID:   tag.ID,
	})
	ts.NoError(err)
	ts.NotNil(entry)
}

func (ts *TestSuite) Test_DeleteEntryFile() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_DeleteEntryUser() {
	org, owner := ts.MockOrganisationWithOwner()
	student := ts.MockUserForOrganisation(org.ID, "student")

	entry, err := ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(owner.ID))
	ts.NoError(err)

	_, err = ts.Resolver.Mutation().CreateEntryUser(ts.CtxWithUser(owner.ID), model.CreateEntryUserInput{
		EntryID: entry.ID,
		UserID:  student.ID,
	})
	ts.NoError(err)

	// Owner can delete an entry user
	_, err = ts.Resolver.Mutation().DeleteEntryUser(ts.CtxWithUser(owner.ID), model.DeleteEntryUserInput{
		EntryID: entry.ID,
		UserID:  student.ID,
	})
	ts.NoError(err)

	// Students cannot delete entry users for another user's entry
	_, err = ts.Resolver.Mutation().DeleteEntryUser(ts.CtxWithUser(student.ID), model.DeleteEntryUserInput{
		EntryID: entry.ID,
		UserID:  student.ID,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// Students cannot delete entry users for their own entry
	entry, err = ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(student.ID))
	ts.NoError(err)

	_, err = ts.Resolver.Mutation().DeleteEntryUser(ts.CtxWithUser(student.ID), model.DeleteEntryUserInput{
		EntryID: entry.ID,
		UserID:  student.ID,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)
}

func (ts *TestSuite) Test_DeleteEntryEvent() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	entry, err := ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(owner.ID))
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

	_, err = ts.Resolver.Mutation().CreateEntryEvent(ts.CtxWithUser(owner.ID), model.CreateEntryEventInput{
		EntryID: entry.ID,
		EventID: event.ID,
	})
	ts.NoError(err)

	// Owner can delete an entry event
	_, err = ts.Resolver.Mutation().DeleteEntryEvent(ts.CtxWithUser(owner.ID), model.DeleteEntryEventInput{
		EntryID: entry.ID,
		EventID: event.ID,
	})
	ts.NoError(err)

	// Students cannot delete entry events for another user's entry
	_, err = ts.Resolver.Mutation().DeleteEntryEvent(ts.CtxWithUser(student.ID), model.DeleteEntryEventInput{
		EntryID: entry.ID,
		EventID: event.ID,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// Students can delete entry events for their own entry
	entry, err = ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(student.ID))
	ts.NoError(err)

	_, err = ts.DB.EntryEventCreate(ts.CtxWithUser(teacher.ID), db.EntryEventCreateParams{
		EntryID:        entry.ID,
		EventID:        event.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	_, err = ts.Resolver.Mutation().DeleteEntryEvent(ts.CtxWithUser(student.ID), model.DeleteEntryEventInput{
		EntryID: entry.ID,
		EventID: event.ID,
	})
	ts.NoError(err)
}

func (ts *TestSuite) Test_DeleteEntryCompetence() {
	org, owner := ts.MockOrganisationWithOwner()
	student := ts.MockUserForOrganisation(org.ID, "student")

	entry, err := ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(owner.ID))
	ts.NoError(err)

	competence, err := ts.DB.CompetenceCreate(ts.CtxWithUser(student.ID), db.CompetenceCreateParams{
		Name:           "Competence",
		OrganisationID: org.ID,
		Grades:         []int32{1, 2, 3, 4},
		CompetenceID:   graph.OptionalString(nil),
		CompetenceType: db.CompetenceTypeCompetence,
	})
	ts.NoError(err)

	_, err = ts.DB.UserCompetenceCreate(ts.CtxWithUser(student.ID), db.UserCompetenceCreateParams{
		Level:          1,
		UserID:         student.ID,
		EntryID:        pgtype.Text{Valid: true, String: entry.ID},
		CompetenceID:   competence.ID,
		OrganisationID: org.ID,
		CreatedBy:      pgtype.Text{Valid: true, String: owner.ID},
	})
	ts.NoError(err)

	// Owner can delete an entry competence
	_, err = ts.Resolver.Mutation().DeleteEntryCompetence(ts.CtxWithUser(owner.ID), model.DeleteEntryCompetenceInput{
		EntryID:      entry.ID,
		CompetenceID: competence.ID,
	})
	ts.NoError(err)

	// Students cannot delete entry competences for another user's entry
	_, err = ts.Resolver.Mutation().DeleteEntryCompetence(ts.CtxWithUser(student.ID), model.DeleteEntryCompetenceInput{
		EntryID:      entry.ID,
		CompetenceID: competence.ID,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// Students can delete entry competences for their own entry
	entry, err = ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(student.ID))
	ts.NoError(err)

	_, err = ts.DB.UserCompetenceCreate(ts.CtxWithUser(student.ID), db.UserCompetenceCreateParams{
		Level:          1,
		UserID:         student.ID,
		EntryID:        pgtype.Text{Valid: true, String: entry.ID},
		CompetenceID:   competence.ID,
		OrganisationID: org.ID,
		CreatedBy:      pgtype.Text{Valid: true, String: owner.ID},
	})
	ts.NoError(err)
}

func (ts *TestSuite) Test_UpdateEntryUserCompetenceLevel() {
	org, owner := ts.MockOrganisationWithOwner()
	student := ts.MockUserForOrganisation(org.ID, "student")

	entry, err := ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(owner.ID))
	ts.NoError(err)

	competence, err := ts.DB.CompetenceCreate(ts.CtxWithUser(student.ID), db.CompetenceCreateParams{
		Name:           "Competence",
		OrganisationID: org.ID,
		Grades:         []int32{1, 2, 3, 4},
		CompetenceID:   graph.OptionalString(nil),
		CompetenceType: db.CompetenceTypeCompetence,
	})
	ts.NoError(err)

	_, err = ts.DB.UserCompetenceCreate(ts.CtxWithUser(owner.ID), db.UserCompetenceCreateParams{
		Level:          1,
		UserID:         student.ID,
		EntryID:        pgtype.Text{Valid: true, String: entry.ID},
		CompetenceID:   competence.ID,
		OrganisationID: org.ID,
		CreatedBy:      pgtype.Text{Valid: true, String: owner.ID},
	})
	ts.NoError(err)

	// Owner can update an entry user competence level
	_, err = ts.Resolver.Mutation().UpdateEntryUserCompetenceLevel(ts.CtxWithUser(owner.ID), model.UpdateEntryUserCompetenceLevel{
		EntryID:      entry.ID,
		CompetenceID: competence.ID,
		Level:        2,
	})
	ts.NoError(err)

	entryCompetences, err := ts.DB.UserCompetenceFindByUserIdAndCompetenceID(ts.CtxWithUser(owner.ID), db.UserCompetenceFindByUserIdAndCompetenceIDParams{
		UserID:         student.ID,
		CompetenceID:   competence.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)
	ts.Len(entryCompetences, 1)
	ts.Equal(int32(2), entryCompetences[0].Level)

	// Student cannot update the entry user competence level for another user's entry
	_, err = ts.Resolver.Mutation().UpdateEntryUserCompetenceLevel(ts.CtxWithUser(student.ID), model.UpdateEntryUserCompetenceLevel{
		EntryID:      entry.ID,
		CompetenceID: competence.ID,
		Level:        2,
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// Student can update the entry user competence level for their own entry
	entry, err = ts.Resolver.Mutation().CreateEntry(ts.CtxWithUser(student.ID))
	ts.NoError(err)

	_, err = ts.DB.UserCompetenceCreate(ts.CtxWithUser(student.ID), db.UserCompetenceCreateParams{
		Level:          1,
		UserID:         student.ID,
		EntryID:        pgtype.Text{Valid: true, String: entry.ID},
		CompetenceID:   competence.ID,
		OrganisationID: org.ID,
		CreatedBy:      pgtype.Text{Valid: true, String: owner.ID},
	})
	ts.NoError(err)

	_, err = ts.Resolver.Mutation().UpdateEntryUserCompetenceLevel(ts.CtxWithUser(student.ID), model.UpdateEntryUserCompetenceLevel{
		EntryID:      entry.ID,
		CompetenceID: competence.ID,
		Level:        2,
	})
	ts.NoError(err)
}

func (ts *TestSuite) Test_UploadFileToEntry() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_RemoveFileFromEntry() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_Entry() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	entry, err := ts.DB.EntryCreate(ts.CtxWithUser(owner.ID), db.EntryCreateParams{
		Date:           pgtype.Date{Valid: true, Time: time.Now()},
		Body:           "test",
		UserID:         owner.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	// Owner can see the entry
	queryEntry, err := ts.Resolver.Query().Entry(ts.CtxWithUser(owner.ID), entry.ID)
	ts.NoError(err)
	ts.Equal(queryEntry.ID, entry.ID)

	// Teacher can see the entry
	queryEntry, err = ts.Resolver.Query().Entry(ts.CtxWithUser(teacher.ID), entry.ID)
	ts.NoError(err)
	ts.Equal(queryEntry.ID, entry.ID)

	// Student cannot see the entry
	_, err = ts.Resolver.Query().Entry(ts.CtxWithUser(student.ID), entry.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// Student can see their own entries
	entry, err = ts.DB.EntryCreate(ts.CtxWithUser(student.ID), db.EntryCreateParams{
		Date:           pgtype.Date{Valid: true, Time: time.Now()},
		Body:           "test",
		UserID:         student.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	queryEntry, err = ts.Resolver.Query().Entry(ts.CtxWithUser(student.ID), entry.ID)
	ts.NoError(err)
	ts.Equal(queryEntry.ID, entry.ID)
}

func (ts *TestSuite) Test_Entries() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	createEntry := func(ctx context.Context, userID string, body string) (db.Entry, error) {
		return ts.DB.EntryCreate(ctx, db.EntryCreateParams{
			Date:           pgtype.Date{Valid: true, Time: time.Now()},
			Body:           body,
			UserID:         userID,
			OrganisationID: org.ID,
		})
	}

	// Owner can see all entries
	// create 10 entries
	for i := 1; i <= 10; i++ {
		entry, err := createEntry(ts.CtxWithUser(owner.ID), owner.ID, fmt.Sprintf("entry-%d", i))
		ts.NoError(err)
		ts.Equal(entry.ID, entry.ID)
	}

	entries, err := ts.Resolver.Query().Entries(ts.CtxWithUser(owner.ID), nil, nil, nil, nil, nil)
	ts.NoError(err)
	ts.Len(entries.Edges, 10)

	// Teacher can see all entries
	// create 10 entries
	for i := 1; i <= 10; i++ {
		entry, err := createEntry(ts.CtxWithUser(teacher.ID), teacher.ID, fmt.Sprintf("entry-%d", i))
		ts.NoError(err)
		ts.Equal(entry.ID, entry.ID)
	}

	entries, err = ts.Resolver.Query().Entries(ts.CtxWithUser(teacher.ID), nil, nil, nil, nil, nil)
	ts.NoError(err)
	ts.Len(entries.Edges, 20)

	// Student cannot see all entries
	entries, err = ts.Resolver.Query().Entries(ts.CtxWithUser(student.ID), nil, nil, nil, nil, nil)
	ts.NoError(err)
	ts.Len(entries.Edges, 0)

	// Student can see their own entries
	// create 10 entries
	for i := 1; i <= 10; i++ {
		entry, err := createEntry(ts.CtxWithUser(student.ID), student.ID, fmt.Sprintf("entry-%d", i))
		ts.NoError(err)
		ts.Equal(entry.ID, entry.ID)
	}
	entries, err = ts.Resolver.Query().Entries(ts.CtxWithUser(student.ID), nil, nil, nil, nil, nil)
	ts.NoError(err)
	ts.Len(entries.Edges, 10)
	// first entry should be entry-1
	ts.Equal(entries.Edges[0].Body, "entry-10")

	// sort direction
	sortDirection := model.EntrySortByCreatedAtDesc
	entries, err = ts.Resolver.Query().Entries(ts.CtxWithUser(student.ID), nil, nil, nil, &sortDirection, nil)
	ts.NoError(err)
	ts.Len(entries.Edges, 10)
	// first entry should be entry-10
	ts.Equal(entries.Edges[0].Body, "entry-10")

	// sort direction
	sortDirection = model.EntrySortByCreatedAtAsc
	entries, err = ts.Resolver.Query().Entries(ts.CtxWithUser(student.ID), nil, nil, nil, &sortDirection, nil)
	ts.NoError(err)
	ts.Len(entries.Edges, 10)
	// first entry should be entry-1
	ts.Equal(entries.Edges[0].Body, "entry-1")

	// Owner filter by user teacher should only return 10 entries
	filter := model.EntryFilterInput{Authors: lo.ToSlicePtr([]string{teacher.ID})}
	entries, err = ts.Resolver.Query().Entries(ts.CtxWithUser(owner.ID), lo.ToPtr(10), nil, &filter, nil, nil)
	ts.NoError(err)
	ts.Len(entries.Edges, 10)

	// Teacher create an entry and add the student as a entry_user to it and filter by the student should only return 1 entry
	entry, err := createEntry(ts.CtxWithUser(teacher.ID), student.ID, "entry-11")
	ts.NoError(err)

	_, err = ts.DB.EntryUserCreate(ts.CtxWithUser(teacher.ID), db.EntryUserCreateParams{
		EntryID:        entry.ID,
		UserID:         student.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	filter = model.EntryFilterInput{Users: lo.ToSlicePtr([]string{student.ID})}
	entries, err = ts.Resolver.Query().Entries(ts.CtxWithUser(teacher.ID), lo.ToPtr(10), nil, &filter, nil, nil)
	ts.NoError(err)
	ts.Len(entries.Edges, 1)
	ts.Equal(entries.Edges[0].Body, "entry-11")
}

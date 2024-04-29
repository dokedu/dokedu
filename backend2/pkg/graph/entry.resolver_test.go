package graph_test

import (
	"time"

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
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_Entry_Resolvers_Events() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_Entry_Resolvers_Files() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_Entry_Resolvers_Tags() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_Entry_Resolvers_UserCompetences() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_Entry_Resolvers_Subjects() {
	ts.Fail("not implemented")
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

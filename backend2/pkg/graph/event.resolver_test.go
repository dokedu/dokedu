package graph_test

import (
	"github.com/dokedu/dokedu/backend/pkg/graph"
	"github.com/dokedu/dokedu/backend/pkg/graph/model"
	"github.com/dokedu/dokedu/backend/pkg/msg"
	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
	"github.com/samber/lo"
	"time"
)

func (ts *TestSuite) Test_Event_Resolvers() {
	org, owner := ts.MockOrganisationWithOwner()

	// Event
	event, err := ts.DB.EventCreate(ts.CtxWithUser(owner.ID), db.EventCreateParams{
		ImageFileID:    graph.OptionalString(nil),
		Title:          "Event",
		Body:           "Body",
		StartsAt:       time.Now(),
		EndsAt:         time.Now().Add(time.Hour),
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	// Image
	file, err := ts.Resolver.Event().Image(ts.CtxWithUser(owner.ID), &event)
	ts.NoError(err)
	ts.Nil(file)

	// TODO: test with existing image file

	// DeletedAt
	deletedAt, err := ts.Resolver.Event().DeletedAt(ts.CtxWithUser(owner.ID), &event)
	ts.NoError(err)
	ts.Nil(deletedAt)
}

func (ts *TestSuite) Test_Event_Competences() {
	org, owner := ts.MockOrganisationWithOwner()

	// Event
	event, err := ts.DB.EventCreate(ts.CtxWithUser(owner.ID), db.EventCreateParams{
		ImageFileID:    graph.OptionalString(nil),
		Title:          "Event",
		Body:           "Body",
		StartsAt:       time.Now(),
		EndsAt:         time.Now().Add(time.Hour),
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	_, err = ts.Resolver.Event().Competences(ts.CtxWithUser(owner.ID), &event)
	ts.NoError(err)

	// Create a competence
	competence, err := ts.DB.CompetenceCreate(ts.CtxWithUser(owner.ID), db.CompetenceCreateParams{
		Name:           "Competence 1",
		OrganisationID: org.ID,
		CompetenceType: db.CompetenceTypeCompetence,
		Grades:         []int32{1, 2, 3, 4},
	})
	ts.NoError(err)

	// Add competence to event
	_, err = ts.DB.EventCompetenceCreate(ts.CtxWithUser(owner.ID), db.EventCompetenceCreateParams{
		EventID:        event.ID,
		CompetenceID:   competence.ID,
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	// Check if the competence is in the event
	competences, err := ts.Resolver.Event().Competences(ts.CtxWithUser(owner.ID), &event)
	ts.NoError(err)
	ts.Len(competences, 1)
	ts.Equal("Competence 1", competences[0].Name)

	// Event 2
	event2, err := ts.DB.EventCreate(ts.CtxWithUser(owner.ID), db.EventCreateParams{
		ImageFileID:    graph.OptionalString(nil),
		Title:          "Event 2",
		Body:           "Body",
		StartsAt:       time.Now(),
		EndsAt:         time.Now().Add(time.Hour),
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	// Ensure that the competence is not in the second event
	competences2, err := ts.Resolver.Event().Competences(ts.CtxWithUser(owner.ID), &event2)
	ts.NoError(err)
	ts.Len(competences2, 0)
}

func (ts *TestSuite) Test_CreateEvent() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_UpdateEvent() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")
	_, owner2 := ts.MockOrganisationWithOwner()

	// Create a valid event
	validEvent, err := ts.DB.EventCreate(ts.CtxWithUser(owner.ID), db.EventCreateParams{
		ImageFileID:    graph.OptionalString(nil),
		Title:          "Event",
		Body:           "Body",
		StartsAt:       time.Now(),
		EndsAt:         time.Now().Add(time.Hour),
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	// Unauthorized access by non-user
	updatedEvent, err := ts.Resolver.Mutation().UpdateEvent(ts.Ctx(), model.UpdateEventInput{
		ID:   validEvent.ID,
		Body: lo.ToPtr("New body"),
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)
	ts.Nil(updatedEvent)

	// Unauthorized access by a user without permission
	updatedEvent, err = ts.Resolver.Mutation().UpdateEvent(ts.CtxWithUser(owner2.ID), model.UpdateEventInput{
		ID:   validEvent.ID,
		Body: lo.ToPtr("New body"),
	})
	ts.ErrorIs(err, msg.ErrNotFound)
	ts.Nil(updatedEvent)

	// Owner can update the event
	updatedEvent, err = ts.Resolver.Mutation().UpdateEvent(ts.CtxWithUser(owner.ID), model.UpdateEventInput{
		ID:   validEvent.ID,
		Body: lo.ToPtr("New body 2"),
	})
	ts.NoError(err)
	ts.Equal("New body 2", updatedEvent.Body)

	// Teacher can update the event
	updatedEvent, err = ts.Resolver.Mutation().UpdateEvent(ts.CtxWithUser(teacher.ID), model.UpdateEventInput{
		ID:   validEvent.ID,
		Body: lo.ToPtr("New body 3"),
	})
	ts.NoError(err)
	ts.Equal("New body 3", updatedEvent.Body)

	// Student cannot update the event
	updatedEvent, err = ts.Resolver.Mutation().UpdateEvent(ts.CtxWithUser(student.ID), model.UpdateEventInput{
		ID:   validEvent.ID,
		Body: lo.ToPtr("New body 4"),
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)
	ts.Nil(updatedEvent)
}

func (ts *TestSuite) Test_ToggleEventCompetence() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_ArchiveEvent() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")
	_, owner2 := ts.MockOrganisationWithOwner()

	// Create a valid event
	validEvent, err := ts.DB.EventCreate(ts.CtxWithUser(owner.ID), db.EventCreateParams{
		ImageFileID:    graph.OptionalString(nil),
		Title:          "Event",
		Body:           "Body",
		StartsAt:       time.Now(),
		EndsAt:         time.Now().Add(time.Hour),
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	// Unauthorized access by non-user
	archivedEvent, err := ts.Resolver.Mutation().ArchiveEvent(ts.Ctx(), validEvent.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)
	ts.Nil(archivedEvent)

	// Unauthorized access by a user without permission
	archivedEvent, err = ts.Resolver.Mutation().ArchiveEvent(ts.CtxWithUser(owner2.ID), validEvent.ID)
	ts.ErrorIs(err, msg.ErrNotFound)
	ts.Nil(archivedEvent)

	// Owner can archive the event
	archivedEvent, err = ts.Resolver.Mutation().ArchiveEvent(ts.CtxWithUser(owner.ID), validEvent.ID)
	ts.NoError(err)
	ts.NotNil(archivedEvent)
	ts.Equal(validEvent.ID, archivedEvent.ID)

	// Teacher can archive the event
	archivedEvent, err = ts.Resolver.Mutation().ArchiveEvent(ts.CtxWithUser(teacher.ID), validEvent.ID)
	ts.NoError(err)
	ts.NotNil(archivedEvent)
	ts.Equal(validEvent.ID, archivedEvent.ID)

	// Student cannot archive the event
	archivedEvent, err = ts.Resolver.Mutation().ArchiveEvent(ts.CtxWithUser(student.ID), validEvent.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)
}

func (ts *TestSuite) Test_Event() {
	org, owner := ts.MockOrganisationWithOwner()
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")
	_, owner2 := ts.MockOrganisationWithOwner()

	// Create a valid event
	validEvent, err := ts.DB.EventCreate(ts.CtxWithUser(owner.ID), db.EventCreateParams{
		ImageFileID:    graph.OptionalString(nil),
		Title:          "Event",
		Body:           "Body",
		StartsAt:       time.Now(),
		EndsAt:         time.Now().Add(time.Hour),
		OrganisationID: org.ID,
	})
	ts.NoError(err)

	// Unauthorized access by non-user
	event, err := ts.Resolver.Query().Event(ts.Ctx(), validEvent.ID)
	ts.ErrorIs(err, msg.ErrUnauthorized)
	ts.Nil(event)

	// Unauthorized access by a user without permission
	event, err = ts.Resolver.Query().Event(ts.CtxWithUser(owner2.ID), validEvent.ID)
	ts.ErrorIs(err, msg.ErrNotFound)
	ts.Nil(event)

	// Owner can see the event
	event, err = ts.Resolver.Query().Event(ts.CtxWithUser(owner.ID), validEvent.ID)
	ts.NoError(err)
	ts.Equal(validEvent.ID, event.ID)

	// Teacher can see the event
	event, err = ts.Resolver.Query().Event(ts.CtxWithUser(teacher.ID), validEvent.ID)
	ts.NoError(err)
	ts.Equal(validEvent.ID, event.ID)

	// Student can see the event
	event, err = ts.Resolver.Query().Event(ts.CtxWithUser(student.ID), validEvent.ID)
	ts.NoError(err)
	ts.Equal(validEvent.ID, event.ID)
}

func (ts *TestSuite) Test_Events() {
	ts.Fail("not implemented")
}

func (ts *TestSuite) Test_ExportEvents() {
	ts.Fail("not implemented")
}

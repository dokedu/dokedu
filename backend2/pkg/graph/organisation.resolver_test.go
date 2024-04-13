package graph_test

import (
	"github.com/dokedu/dokedu/backend/pkg/graph/model"
	"github.com/dokedu/dokedu/backend/pkg/msg"
	"github.com/samber/lo"
)

func (ts *TestSuite) Test_UpdateOrganisation() {
	org, owner := ts.MockOrganisationWithOwner()
	admin := ts.MockUserForOrganisation(org.ID, "admin")
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	// doesn't work if the user is not logged in
	_, err := ts.Resolver.Mutation().UpdateOrganisation(ts.Ctx(), model.UpdateOrganisationInput{
		ID:        org.ID,
		Name:      lo.ToPtr("New name"),
		LegalName: lo.ToPtr("New legal name"),
		Website:   lo.ToPtr("New website"),
		Phone:     lo.ToPtr("New phone"),
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// update the organisation
	updatedOrg, err := ts.Resolver.Mutation().UpdateOrganisation(ts.CtxWithUser(owner.ID), model.UpdateOrganisationInput{
		ID:        org.ID,
		Name:      lo.ToPtr("New name"),
		LegalName: lo.ToPtr("New legal name"),
		Website:   lo.ToPtr("New website"),
		Phone:     lo.ToPtr("New phone"),
	})
	ts.NoError(err)
	ts.Equal("New name", updatedOrg.Name)
	ts.Equal("New legal name", updatedOrg.LegalName)
	ts.Equal("New website", updatedOrg.Website)
	ts.Equal("New phone", updatedOrg.Phone)

	// updating only the name should not change the other fields
	updatedOrg, err = ts.Resolver.Mutation().UpdateOrganisation(ts.CtxWithUser(owner.ID), model.UpdateOrganisationInput{
		ID:   org.ID,
		Name: lo.ToPtr("New name 2"),
	})
	ts.NoError(err)
	ts.Equal("New name 2", updatedOrg.Name)
	ts.Equal("New legal name", updatedOrg.LegalName)

	// Admin can update the organisation
	updatedOrg, err = ts.Resolver.Mutation().UpdateOrganisation(ts.CtxWithUser(admin.ID), model.UpdateOrganisationInput{
		ID:   org.ID,
		Name: lo.ToPtr("New name 3"),
	})
	ts.NoError(err)
	ts.Equal("New name 3", updatedOrg.Name)
	ts.Equal("New legal name", updatedOrg.LegalName)

	// Teacher cannot update the organisation
	_, err = ts.Resolver.Mutation().UpdateOrganisation(ts.CtxWithUser(teacher.ID), model.UpdateOrganisationInput{
		ID:   org.ID,
		Name: lo.ToPtr("New name 4"),
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// Student cannot update the organisation
	_, err = ts.Resolver.Mutation().UpdateOrganisation(ts.CtxWithUser(student.ID), model.UpdateOrganisationInput{
		ID:   org.ID,
		Name: lo.ToPtr("New name 5"),
	})
	ts.ErrorIs(err, msg.ErrUnauthorized)
}

func (ts *TestSuite) Test_Organisation_Owner() {
	org, owner := ts.MockOrganisationWithOwner()
	admin := ts.MockUserForOrganisation(org.ID, "admin")
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	// doesn't work if the user is not logged in
	_, err := ts.Resolver.Organisation().Owner(ts.Ctx(), &org)
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// owner can see the organisation owner
	orgOwner, err := ts.Resolver.Organisation().Owner(ts.CtxWithUser(owner.ID), &org)
	ts.NoError(err)
	ts.Equal(owner.ID, orgOwner.ID)

	// admin can see the organisation owner
	orgOwner, err = ts.Resolver.Organisation().Owner(ts.CtxWithUser(admin.ID), &org)
	ts.NoError(err)
	ts.Equal(owner.ID, orgOwner.ID)

	// teacher can see the organisation owner
	orgOwner, err = ts.Resolver.Organisation().Owner(ts.CtxWithUser(teacher.ID), &org)
	ts.NoError(err)
	ts.Equal(owner.ID, orgOwner.ID)

	// student can see the organisation owner
	orgOwner, err = ts.Resolver.Organisation().Owner(ts.CtxWithUser(student.ID), &org)
	ts.NoError(err)
	ts.Equal(owner.ID, orgOwner.ID)
}

func (ts *TestSuite) Test_Organisation() {
	org, owner := ts.MockOrganisationWithOwner()
	admin := ts.MockUserForOrganisation(org.ID, "admin")
	teacher := ts.MockTeacherForOrganisation(org.ID)
	student := ts.MockUserForOrganisation(org.ID, "student")

	// returns error if the user is not logged in
	_, err := ts.Resolver.Query().Organisation(ts.Ctx())
	ts.ErrorIs(err, msg.ErrUnauthorized)

	// owner can see the organisation
	org2, err := ts.Resolver.Query().Organisation(ts.CtxWithUser(owner.ID))
	ts.NoError(err)
	ts.Equal(org2.ID, owner.OrganisationID)

	// admin can see the organisation
	org2, err = ts.Resolver.Query().Organisation(ts.CtxWithUser(admin.ID))
	ts.NoError(err)
	ts.Equal(org2.ID, owner.OrganisationID)

	// teacher can see the organisation
	org2, err = ts.Resolver.Query().Organisation(ts.CtxWithUser(teacher.ID))
	ts.NoError(err)
	ts.Equal(org2.ID, owner.OrganisationID)

	// student can see the organisation
	org2, err = ts.Resolver.Query().Organisation(ts.CtxWithUser(student.ID))
	ts.NoError(err)
	ts.Equal(org2.ID, owner.OrganisationID)
}

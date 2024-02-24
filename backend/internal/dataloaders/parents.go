package dataloaders

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/samber/lo"

	"github.com/dokedu/dokedu/backend/internal/database/db"
	"github.com/dokedu/dokedu/backend/internal/helper"
	"github.com/dokedu/dokedu/backend/internal/middleware"

	"github.com/graph-gophers/dataloader"
	"github.com/uptrace/bun"
)

type CompetenceParents struct {
	bun.BaseModel

	CompetenceID string
	Parents      json.RawMessage `bun:",type:jsonb"`
}

func (u *Reader) GetCompetenceParents(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil
	}

	// read all requested competences in a single query
	competenceIDs := make([]string, len(keys))
	for ix, key := range keys {
		competenceIDs[ix] = key.String()
	}

	competences, err := u.conn.CompetenceList(ctx, currentUser.OrganisationID)
	if err != nil {
		return nil
	}

	competenceParentMap := make(map[string][]*db.Competence, len(competenceIDs))

	for _, competenceId := range competenceIDs {
		competenceParentMap[competenceId] = lo.ToSlicePtr(helper.FindRecursiveCompetenceParents(competences, competenceId))
	}

	// return competences in the same order requested
	output := make([]*dataloader.Result, len(keys))
	for index, competenceKey := range keys {
		competence, ok := competenceParentMap[competenceKey.String()]
		if ok {
			output[index] = &dataloader.Result{Data: competence, Error: nil}
		} else {
			err := fmt.Errorf("competence not found %s", competenceKey.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output
}

func GetCompetenceParents(ctx context.Context, competenceID string, currentUser *middleware.UserContext) ([]*db.Competence, error) {
	loaders := For(ctx)
	thunk := loaders.CompetenceLoader.Load(ctx, dataloader.StringKey(competenceID))
	result, err := thunk()
	if err != nil {
		return nil, err
	}
	return result.([]*db.Competence), nil
}

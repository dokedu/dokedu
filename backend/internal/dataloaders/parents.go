package dataloaders

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/dokedu/dokedu/backend/internal/db"
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
	// read all requested competences in a single query
	competenceIDs := make([]string, len(keys))
	for ix, key := range keys {
		competenceIDs[ix] = key.String()
	}

	parents, err := u.conn.CompetenceParentsList(ctx, competenceIDs)
	if err != nil {
		return nil
	}

	// return Competence records into a map by ID
	competenceById := map[string][]*db.Competence{}

	for _, parent := range parents {
		var parentItems []*db.CompetenceNoNullString
		if len(parent.Parents) == 0 {
			competenceById[parent.CompetenceID] = []*db.Competence{}
			continue
		}
		err := json.Unmarshal(parent.Parents, &parentItems)
		if err != nil {
			log.Fatal(err)
		}

		// reverse order of parentItems
		for i, j := 0, len(parentItems)-1; i < j; i, j = i+1, j-1 {
			parentItems[i], parentItems[j] = parentItems[j], parentItems[i]
		}

		var competences []*db.Competence
		for _, parentItem := range parentItems {
			competences = append(competences, &db.Competence{
				ID:             parentItem.ID,
				Name:           parentItem.Name,
				CompetenceID:   sql.NullString{String: parent.CompetenceID, Valid: len(parent.CompetenceID) > 0},
				CompetenceType: parentItem.CompetenceType,
				OrganisationID: parentItem.OrganisationID,
				Grades:         parentItem.Grades,
				Color:          sql.NullString{String: parentItem.Color, Valid: len(parentItem.Color) > 0},
				SortOrder:      parentItem.SortOrder,
				CurriculumID:   sql.NullString{String: parentItem.CurriculumID, Valid: len(parentItem.CurriculumID) > 0},
				CreatedAt:      parentItem.CreatedAt,
				DeletedAt:      bun.NullTime{Time: time.Time{}},
			})
		}
		competenceById[parent.CompetenceID] = competences
	}

	// return competences in the same order requested
	output := make([]*dataloader.Result, len(keys))
	for index, competenceKey := range keys {
		competence, ok := competenceById[competenceKey.String()]
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

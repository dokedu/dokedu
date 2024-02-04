package meilisearch

import (
	"context"
	"database/sql"
	"os"
	"slices"

	"github.com/dokedu/dokedu/backend/internal/db"

	"github.com/meilisearch/meilisearch-go"
	"github.com/uptrace/bun"
)

type MeiliCompetence struct {
	ID             string            `json:"id"`
	Name           string            `json:"name"`
	CompetenceID   sql.NullString    `json:"competence_id"`
	CompetenceType db.CompetenceType `json:"competence_type"`
	Grades         []int             `json:"grades"`
	Parents        []string          `json:"parents"`
	ParentNames    []string          `json:"parent_names"`
}

type SearchResponseCompetence struct {
	Hits []MeiliCompetence `json:"hits"`
}

type MeiliClient struct {
	Client *meilisearch.Client
}

func NewMeiliClient() *MeiliClient {
	host := os.Getenv("MEILI_HOST") + ":" + os.Getenv("MEILI_PORT")
	apiKey := os.Getenv("MEILI_API_KEY")

	client := meilisearch.NewClient(meilisearch.ClientConfig{
		Host:   host,
		APIKey: apiKey,
	})

	return &MeiliClient{Client: client}
}

func (m MeiliClient) GenerateCompetenceIndex(ctx context.Context, conn *bun.DB) error {
	var organisations []db.Organisation
	err := conn.NewSelect().Model(&organisations).Scan(ctx)
	if err != nil {
		return err
	}

	for _, organisation := range organisations {
		var meiliCompetences []MeiliCompetence

		var competences []db.Competence
		err := conn.NewSelect().Model(&competences).Where("organisation_id = ?", organisation.ID).Scan(ctx)
		if err != nil {
			return err
		}

		if len(competences) == 0 {
			continue
		}

		competenceMap := make(map[string]db.Competence)
		for _, c := range competences {
			competenceMap[c.ID] = c
		}

		for _, competence := range competences {
			parentIds, parentNames := getParentDetails(competence, competenceMap)

			meiliCompetences = append(meiliCompetences, MeiliCompetence{
				ID:             competence.ID,
				Name:           competence.Name,
				CompetenceID:   competence.CompetenceID,
				CompetenceType: competence.CompetenceType,
				Grades:         competence.Grades,
				Parents:        parentIds,
				ParentNames:    parentNames,
			})
		}

		indexName := m.GetCompetenceIndex(organisation.ID)
		index := m.Client.Index(indexName)

		_, err = index.AddDocuments(meiliCompetences, "id")
		if err != nil {
			return err
		}

		_, err = index.UpdateFilterableAttributes(&[]string{
			"competence_id",
			"competence_type",
			"grades",
			"parents",
			"parent_names",
		})
		if err != nil {
			return err
		}
	}

	return nil
}

func getParentDetails(competence db.Competence, competenceMap map[string]db.Competence) ([]string, []string) {
	var parentIds []string
	var parentNames []string

	for competence.CompetenceID.Valid {
		if parent, found := competenceMap[competence.CompetenceID.String]; found {
			parentIds = append(parentIds, parent.ID)
			parentNames = append(parentNames, parent.Name)
			competence = parent
		} else {
			break
		}
	}

	slices.Reverse(parentIds)
	slices.Reverse(parentNames)

	return parentIds, parentNames
}

func (m MeiliClient) GetCompetenceIndex(organisationId string) string {
	return organisationId + "-competences"
}

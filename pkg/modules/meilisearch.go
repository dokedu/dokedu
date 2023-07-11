package modules

import (
	"context"
	"database/sql"
	"example/pkg/db"
	"fmt"
	"github.com/meilisearch/meilisearch-go"
	"github.com/uptrace/bun"
	"os"
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

func NewMeiliClient() (*MeiliClient, error) {
	host := os.Getenv("MEILI_HOST") + ":" + os.Getenv("MEILI_PORT")
	apiKey := os.Getenv("MEILI_API_KEY")

	client := meilisearch.NewClient(meilisearch.ClientConfig{
		Host:   host,
		APIKey: apiKey,
	})

	return &MeiliClient{Client: client}, nil
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

		for _, competence := range competences {
			parentNames, err := getParentNames(conn, ctx, competence.ID)
			if err != nil {
				return err
			}
			parentIds, err := getParentIds(conn, ctx, competence.ID)
			if err != nil {
				return err
			}

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

		res, err := index.GetFilterableAttributes()
		fmt.Println(res)
	}

	return nil
}

func getParentIds(conn *bun.DB, ctx context.Context, competenceID string) ([]string, error) {
	var parents []db.Competence
	err := conn.NewRaw("SELECT * FROM get_competence_tree_reverse(?)", competenceID).Scan(ctx, &parents)
	if err != nil {
		return nil, err
	}

	ids := make([]string, len(parents))
	for i, parent := range parents {
		ids[i] = parent.ID
	}

	return ids, nil
}

func getParentNames(conn *bun.DB, ctx context.Context, competenceID string) ([]string, error) {
	var parents []db.Competence
	err := conn.NewRaw("SELECT * FROM get_competence_tree_reverse(?)", competenceID).Scan(ctx, &parents)
	if err != nil {
		return nil, err
	}

	ids := make([]string, len(parents))
	for i, parent := range parents {
		ids[i] = parent.Name
	}

	return ids, nil
}

func (m MeiliClient) GetCompetenceIndex(organisationId string) string {
	return organisationId + "-competences"
}

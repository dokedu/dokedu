package meili

import (
	"context"
	"log/slog"
	"slices"

	"github.com/meilisearch/meilisearch-go"
	"github.com/samber/lo"

	"github.com/dokedu/dokedu/backend/pkg/services/database"
	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

type Config struct {
	Host   string `env:"MEILI_HOST"`
	APIKey string `env:"MEILI_API_KEY"`
}

type Competence struct {
	ID             string            `json:"id"`
	Name           string            `json:"name"`
	CompetenceID   string            `json:"competence_id"`
	CompetenceType db.CompetenceType `json:"competence_type"`
	Grades         []int32           `json:"grades"`
	Parents        []string          `json:"parents"`
	ParentNames    []string          `json:"parent_names"`
}

type SearchResponseCompetence struct {
	Hits []Competence `json:"hits"`
}

type Client struct {
	*meilisearch.Client
	DB *database.DB
}

func New(cfg Config, db *database.DB) *Client {
	client := meilisearch.NewClient(meilisearch.ClientConfig{
		Host:   cfg.Host,
		APIKey: cfg.APIKey,
	})

	return &Client{Client: client, DB: db}
}

func (m Client) RefreshCompetenceIndexes(ctx context.Context) error {
	organisations, err := m.DB.GLOBAL_OrganisationFind(ctx)
	if err != nil {
		return err
	}

	for _, organisation := range organisations {
		var meiliCompetences []Competence

		competences, err := m.DB.CompetenceAll(ctx, organisation.ID)
		if err != nil {
			return err
		}

		if len(competences) == 0 {
			continue
		}

		slog.Info("indexing competences", "count", len(competences), "organisation", organisation.ID)

		competenceMap := lo.SliceToMap(competences, func(c db.Competence) (string, db.Competence) {
			return c.ID, c
		})

		for _, competence := range competences {
			parentIDs, parentNames := parentDetails(competence, competenceMap)

			meiliCompetences = append(meiliCompetences, Competence{
				ID:             competence.ID,
				Name:           competence.Name,
				CompetenceID:   competence.CompetenceID.String,
				CompetenceType: competence.CompetenceType,
				Grades:         competence.Grades,
				Parents:        parentIDs,
				ParentNames:    parentNames,
			})
		}

		indexName := m.FindCompetenceIndexByOrganisationID(organisation.ID)
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

		slog.Info("indexed competences", "count", len(meiliCompetences), "organisation", organisation.ID)
	}

	return nil
}

func parentDetails(competence db.Competence, competenceMap map[string]db.Competence) ([]string, []string) {
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

func (m Client) FindCompetenceIndexByOrganisationID(organisationId string) string {
	return organisationId + "-competences"
}

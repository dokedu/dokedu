package pdf

import (
	"context"
	"fmt"

	"example/internal/db"

	"github.com/uptrace/bun"
)

func (g *Generator) LearnedCompetencesReportData(report db.Report) (*CompetencesTemplateData, error) {
	ctx := context.Background()

	data, err := g.BaseCompetencesReportData(ctx, report)
	if err != nil {
		return nil, err
	}

	var userCompetences []db.UserCompetence
	err = g.cfg.DB.NewSelect().
		Model(&userCompetences).
		Where("user_id = ?", report.StudentUserID).
		Where("organisation_id = ?", report.OrganisationID).
		Where("created_at >= ?", report.From).
		Where("created_at <= (DATE ? + 1)", report.To).
		Order("created_at DESC").
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	// create a user competences ids list with the unique values of userCompetences.CompetenceID
	var userCompetenceIds []string
Outer:
	for _, uc := range userCompetences {
		// check if competence already exists
		for _, id := range userCompetenceIds {
			if id == uc.CompetenceID {
				continue Outer
			}
		}
		userCompetenceIds = append(userCompetenceIds, uc.CompetenceID)
	}

	var competences []db.Competence
	err = g.cfg.DB.NewSelect().
		Model(&competences).
		Where("organisation_id = ?", report.OrganisationID).
		Where("id IN (?)", bun.In(userCompetenceIds)).
		Order("sort_order").
		Order("name").
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	var allCompetences []db.Competence
	err = g.cfg.DB.NewSelect().
		Model(&allCompetences).
		Where("organisation_id = ?", report.OrganisationID).
		Order("sort_order").Scan(ctx)
	if err != nil {
		return nil, err
	}

	var allCompetencesMap = make(map[string][]db.Competence)
	for _, c := range allCompetences {
		allCompetencesMap[c.ID] = append(allCompetencesMap[c.ID], c)
	}

	// for each competence, get the parent competence
	// recursively get all parent competences until the parent competence is nil
	// append the parent competence to the competences slice if it doesn't exist yet
	for i := range competences {
		parents, err := g.getParentCompetences(competences[i], allCompetencesMap)
		if err != nil {
			return nil, err
		}

		for _, p := range parents {
			// check if parent already exists
			var exists bool
			for _, c := range competences {
				if c.ID == p.ID {
					exists = true
					break
				}
			}
			if !exists {
				competences = append(competences, p)
			}
		}
	}

	// create a map with key competence.ParentID and value []db.Competence
	var competencesMap = make(map[string][]db.Competence)
	for _, c := range competences {
		competencesMap[c.CompetenceID.String] = append(competencesMap[c.CompetenceID.String], c)
	}

	// create a map with key userCompetence.CompetenceID and value []db.UserCompetence
	var userCompetencesMap = make(map[string][]db.UserCompetence)
	for _, uc := range userCompetences {
		userCompetencesMap[uc.CompetenceID] = append(userCompetencesMap[uc.CompetenceID], uc)
	}

	subjects := Subjects(competences)

	for i := range subjects {
		subject := subjects[i]

		if data.Competences == nil {
			data.Competences = make([]Competence, len(subjects))
		}
		data.Competences[i].Name = subject.Name

		data.Competences[i].Color = subject.Color.String

		if !subject.Color.Valid {
			data.Competences[i].Color = "stone"
		}

		competences, err := g.populateCompetences(report, subject, competencesMap, userCompetencesMap, data.Competences[i].Color)
		if err != nil {
			return nil, err
		}

		if data.Competences[i].Competences == nil {
			data.Competences[i].Competences = make([]Competence, len(competences))
		}
		data.Competences[i].Competences = competences
	}

	return data, nil
}

func (g *Generator) getParentCompetences(competence db.Competence, competenceMap map[string][]db.Competence) ([]db.Competence, error) {
	var parents []db.Competence

	competenceID := competence.CompetenceID.String
	for competenceID != "" {
		competence, ok := competenceMap[competenceID]
		if !ok {
			return nil, fmt.Errorf("competence with id %s not found", competenceID)
		}
		parents = append(parents, competence[0])
		competenceID = competence[0].CompetenceID.String
	}

	return parents, nil
}

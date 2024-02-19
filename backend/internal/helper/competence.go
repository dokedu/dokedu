package helper

import "github.com/dokedu/dokedu/backend/internal/database/db"

func FindCompetenceParent(items []db.Competence, child db.Competence) (db.Competence, bool) {
	parentID := child.CompetenceID
	if !parentID.Valid {
		return child, true
	}

	for _, item := range items {
		if item.ID == child.CompetenceID.String {
			return FindCompetenceParent(items, item)
		}
	}

	return *new(db.Competence), false
}

func FindCompetenceById(items []db.Competence, id string) (db.Competence, bool) {
	for _, item := range items {
		if item.ID == id {
			return item, true
		}
	}
	return *new(db.Competence), false
}

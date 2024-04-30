package pdf

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgtype"

	"github.com/dokedu/dokedu/backend/pkg/services/database"
	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

type ReportData struct {
	Entries []struct {
		Entry           db.Entry
		Date            string
		CreatedAt       string
		User            db.User
		UserCompetences []struct {
			UserCompetence []db.UserCompetence
			Parents        []competenceTreeResult
			Competence     db.Competence
			Grades         string
			AtLeastOne     bool
			AtLeastTwo     bool
			AtLeastThree   bool
		}
	}
}

func (g *Generator) EntriesReportData(report db.Report) (*ReportData, error) {
	ctx := context.Background()

	var reportData ReportData

	entries, err := g.svc.DB.EntryUsersFindEntryByUserIDForReport(ctx, db.EntryUsersFindEntryByUserIDForReportParams{
		UserID: report.StudentUserID,
		From:   report.From,
		To:     report.To,
	})
	if err != nil {
		return nil, err
	}

	for _, entry := range entries {
		userCompetences, err := g.svc.DB.UserCompetenceFindByEntryAndUser(ctx, db.UserCompetenceFindByEntryAndUserParams{
			EntryID:        pgtype.Text{Valid: true, String: entry.ID},
			UserID:         report.StudentUserID,
			OrganisationID: report.OrganisationID,
		})
		if err != nil {
			return nil, err
		}

		var userCompetencesStruct []struct {
			UserCompetence []db.UserCompetence
			Parents        []competenceTreeResult
			Competence     db.Competence
			Grades         string
			AtLeastOne     bool
			AtLeastTwo     bool
			AtLeastThree   bool
		}

		for _, userCompetence := range userCompetences {
			parents, err := competenceParents(g.svc.DB, userCompetence.CompetenceID, userCompetence.OrganisationID)
			if err != nil {
				return nil, err
			}

			competence, err := g.svc.DB.CompetenceFindByIDWithDeleted(ctx, db.CompetenceFindByIDWithDeletedParams{
				ID:             userCompetence.CompetenceID,
				OrganisationID: report.OrganisationID,
			})
			if err != nil {
				return nil, err
			}

			atLeastOne := false
			atLeastTwo := false
			atLeastThree := false

			if userCompetence.Level >= 1 {
				atLeastOne = true
			}
			if userCompetence.Level >= 2 {
				atLeastTwo = true
			}
			if userCompetence.Level >= 3 {
				atLeastThree = true
			}

			grades := ""

			// if grades is empty, it will be displayed as "-"
			// if grades len(1) it will be displayed as "n"
			// if grades len >= 2 it will be displayed as "n - m"
			switch len(competence.Grades) {
			case 0:
				grades = "-"
			case 1:
				grades = fmt.Sprintf("%d", competence.Grades[0])
			default:
				grades = fmt.Sprintf("%d - %d", competence.Grades[0], competence.Grades[len(competence.Grades)-1])
			}

			userCompetencesStruct = append(userCompetencesStruct, struct {
				UserCompetence []db.UserCompetence
				Parents        []competenceTreeResult
				Competence     db.Competence
				Grades         string
				AtLeastOne     bool
				AtLeastTwo     bool
				AtLeastThree   bool
			}{
				UserCompetence: []db.UserCompetence{userCompetence},
				Parents:        parents,
				Grades:         grades,
				Competence:     competence,
				AtLeastOne:     atLeastOne,
				AtLeastTwo:     atLeastTwo,
				AtLeastThree:   atLeastThree,
			})
		}

		user, err := g.svc.DB.UserFindByIDWithDeleted(ctx, db.UserFindByIDWithDeletedParams{
			ID:             entry.UserID,
			OrganisationID: report.OrganisationID,
		})
		if err != nil {
			return nil, err
		}
		// format dd.mm.yyyy hh:mm
		createdAt := entry.CreatedAt.Format("02.01.2006 15:04")
		// format dd.mm.yyyy whereas date is right now yyyy-mm-dd and a string

		date := entry.Date.Time.Format("02.01.2006")
		reportData.Entries = append(reportData.Entries, struct {
			Entry           db.Entry
			Date            string
			CreatedAt       string
			User            db.User
			UserCompetences []struct {
				UserCompetence []db.UserCompetence
				Parents        []competenceTreeResult
				Competence     db.Competence
				Grades         string
				AtLeastOne     bool
				AtLeastTwo     bool
				AtLeastThree   bool
			}
		}{
			Entry:           entry,
			CreatedAt:       createdAt,
			Date:            date,
			User:            user,
			UserCompetences: userCompetencesStruct,
		})
	}

	return &reportData, nil
}

type competenceTreeResult struct {
	ID             string            `db:"id"`
	Name           string            `db:"name"`
	CompetenceType db.CompetenceType `db:"competence_type"`
	Color          pgtype.Text       `db:"color"`
	CompetenceID   pgtype.Text       `db:"competence_id"`
	CreatedAt      time.Time         `db:"created_at"`
	Grades         []string          `db:"grades"`
}

func competenceParents(dbCon *database.DB, competenceID string, organisationID string) ([]competenceTreeResult, error) {
	query := dbCon.NewQueryBuilder().Select("*").Suffix("FROM get_competence_tree_reverse($1)", competenceID)

	parents, err := database.ScanSelectMany[competenceTreeResult](dbCon, context.Background(), query)
	if err != nil {
		return nil, err
	}

	return parents, nil
}

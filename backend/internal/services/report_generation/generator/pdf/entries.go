package pdf

import (
	"context"
	"example/internal/db"
	"fmt"
	"github.com/uptrace/bun"
	"strings"
	"time"
)

type ReportData struct {
	Entries []struct {
		Entry           db.Entry
		Date            string
		CreatedAt       string
		User            db.User
		UserCompetences []struct {
			UserCompetence []db.UserCompetence
			Parents        []db.Competence
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

	var entries []db.Entry
	err := g.cfg.DB.
		NewSelect().
		Model(&entries).
		Join("JOIN entry_users eu ON eu.entry_id = entry.id").
		Where("eu.user_id = ?", report.StudentUserID).
		Where("date >= ?", report.From).
		Where("date <= ?", report.To).
		Order("date DESC").
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	for _, entry := range entries {
		var userCompetences []db.UserCompetence
		err = g.cfg.DB.NewSelect().Model(&userCompetences).Where("user_id = ?", report.StudentUserID).Where("entry_id = ?", entry.ID).Scan(ctx)
		if err != nil {
			return nil, err
		}

		var userCompetencesStruct []struct {
			UserCompetence []db.UserCompetence
			Parents        []db.Competence
			Competence     db.Competence
			Grades         string
			AtLeastOne     bool
			AtLeastTwo     bool
			AtLeastThree   bool
		}

		for _, userCompetence := range userCompetences {
			parents, err := competenceParents(g.cfg.DB, userCompetence.CompetenceID)
			if err != nil {
				return nil, err
			}

			var competence db.Competence
			err = g.cfg.DB.NewSelect().Model(&competence).Where("id = ?", userCompetence.CompetenceID).WhereAllWithDeleted().Scan(ctx)
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
				Parents        []db.Competence
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

		var user db.User
		err = g.cfg.DB.NewSelect().Model(&user).Where("id = ?", entry.UserID).WhereAllWithDeleted().Scan(ctx)
		if err != nil {
			return nil, err
		}
		// format dd.mm.yyyy hh:mm
		createdAt := entry.CreatedAt.Format("02.01.2006 15:04")
		// format dd.mm.yyyy whereas date is right now yyyy-mm-dd and a string
		var date time.Time
		date, err = time.Parse("2006-01-02", entry.Date)
		if err != nil {
			return nil, err
		}

		dateFormatted := date.Format("02.01.2006")

		reportData.Entries = append(reportData.Entries, struct {
			Entry           db.Entry
			Date            string
			CreatedAt       string
			User            db.User
			UserCompetences []struct {
				UserCompetence []db.UserCompetence
				Parents        []db.Competence
				Competence     db.Competence
				Grades         string
				AtLeastOne     bool
				AtLeastTwo     bool
				AtLeastThree   bool
			}
		}{
			Entry:           entry,
			CreatedAt:       createdAt,
			Date:            dateFormatted,
			User:            user,
			UserCompetences: userCompetencesStruct,
		})
	}

	return &reportData, nil
}

func competenceParents(bun *bun.DB, competenceID string) ([]db.Competence, error) {
	ctx := context.Background()
	query := `SELECT * FROM get_competence_tree_reverse(?)`

	// query without new lines
	q := strings.ReplaceAll(query, "\n", " ")

	var parents []db.Competence
	err := bun.NewRaw(q, competenceID).Scan(ctx, &parents)
	if err != nil {
		return nil, err
	}

	return parents, nil
}

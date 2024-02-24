package pdf

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgtype"

	"github.com/dokedu/dokedu/backend/internal/helper"

	"github.com/dokedu/dokedu/backend/internal/database/db"
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

	//var entries []db.Entry
	//err := g.cfg.DB.
	//	NewSelect().
	//	Model(&entries).
	//	Join("JOIN entry_users eu ON eu.entry_id = entry.id").
	//	Where("eu.user_id = ?", report.StudentUserID).
	//	Where("date >= ?", report.From).
	//	Where("date <= ?", report.To).
	//	Order("date DESC").
	//	Scan(ctx)
	entries, err := g.cfg.DB.REPORT_EntryList(ctx, db.REPORT_EntryListParams{
		UserID:         report.StudentUserID,
		StartDate:      pgtype.Date{Time: report.From, Valid: true},
		EndDate:        pgtype.Date{Time: report.To, Valid: true},
		OrganisationID: report.OrganisationID,
	})
	if err != nil {
		return nil, err
	}

	competences, err := g.cfg.DB.CompetenceList(ctx, report.OrganisationID)
	if err != nil {
		return nil, err
	}

	for _, entry := range entries {
		//var userCompetences []db.UserCompetence
		//err = g.cfg.DB.NewSelect().
		//	Model(&userCompetences).
		//	Where("user_id = ?", report.StudentUserID).
		//	Where("entry_id = ?", entry.ID).
		//	Scan(ctx)
		userCompetences, err := g.cfg.DB.UserCompetenceListByEntryAndUser(ctx, db.UserCompetenceListByEntryAndUserParams{
			EntryID:        pgtype.Text{String: entry.ID, Valid: true},
			UserID:         report.StudentUserID,
			OrganisationID: report.OrganisationID,
		})
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
			parents := helper.FindRecursiveCompetenceParents(competences, userCompetence.CompetenceID)

			var competence db.Competence
			//err = g.cfg.DB.NewSelect().Model(&competence).Where("id = ?", userCompetence.CompetenceID).WhereAllWithDeleted().Scan(ctx)
			competence, err := g.cfg.DB.GLOBAL_CompetenceByIdWithDeleted(ctx, userCompetence.CompetenceID)
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

		//var user db.User
		//err = g.cfg.DB.NewSelect().Model(&user).Where("id = ?", entry.UserID).WhereAllWithDeleted().Scan(ctx)
		user, err := g.cfg.DB.GLOBAL_UserByIdWithDeleted(ctx, entry.UserID)
		if err != nil {
			return nil, err
		}
		// format dd.mm.yyyy hh:mm
		createdAt := entry.CreatedAt.Format("02.01.2006 15:04")
		// format dd.mm.yyyy whereas date is right now yyyy-mm-dd and a string
		var date time.Time
		date, err = time.Parse("2006-01-02", entry.Date.Time.String())
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

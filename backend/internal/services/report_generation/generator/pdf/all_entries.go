package pdf

import (
	"context"
	"fmt"
	"time"

	"github.com/dokedu/dokedu/backend/internal/db"
)

type CompetenceStruct struct {
	Parents    []*db.Competence
	Competence *db.Competence
	Grades     string
}

type EntryReportData struct {
	Entry       db.Entry
	Date        string
	CreatedAt   string
	Competences []CompetenceStruct
}

type AllReportData struct {
	Entries []EntryReportData
}

type internData struct {
	Entries                       []db.Entry
	EntriesMap                    map[string]*db.Entry
	EntryEvents                   []db.EntryEvent
	Events                        []db.Event
	EventsMap                     map[string]*db.Event
	EventsMapByEntry              map[string]*db.Event
	EventCompetences              []db.EventCompetence
	EventCompetencesByEntry       map[string][]*db.EventCompetence
	UserCompetences               []db.UserCompetence
	Competences                   []db.Competence
	CompetencesMap                map[string]*db.Competence
	CompetencesMapByEntry         map[string][]*db.Competence
	CompetenceParents             map[string][]*db.Competence
	CompetenceParentsByEntry      map[string][]*db.Competence
	CompetenceParentsByCompetence map[string][]*db.Competence
}

func (g *Generator) preloadAllEntriesReportData(ctx context.Context, o db.Organisation) (*internData, error) {
	var data internData

	err := g.cfg.DB.
		NewSelect().
		Model(&data.Entries).
		Where("organisation_id = ?", o.ID).
		Order("date DESC").
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	data.EntriesMap = make(map[string]*db.Entry, len(data.Entries))

	// map
	for i := range data.Entries {
		data.EntriesMap[data.Entries[i].ID] = &data.Entries[i]
	}

	err = g.cfg.DB.NewSelect().Model(&data.EntryEvents).Where("organisation_id = ?", o.ID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	data.EventsMap = make(map[string]*db.Event, len(data.Entries))

	// map
	for i := range data.Events {
		data.EventsMap[data.Events[i].ID] = &data.Events[i]
	}

	data.EventsMapByEntry = make(map[string]*db.Event, len(data.Entries))

	// map
	for i := range data.EntryEvents {
		data.EventsMapByEntry[data.EntryEvents[i].EntryID] = data.EventsMap[data.EntryEvents[i].EventID]
	}

	err = g.cfg.DB.NewSelect().Model(&data.Events).Where("organisation_id = ?", o.ID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	err = g.cfg.DB.NewSelect().Model(&data.EventCompetences).Where("organisation_id = ?", o.ID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	err = g.cfg.DB.NewSelect().Model(&data.Competences).Where("organisation_id = ?", o.ID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	data.CompetencesMapByEntry = make(map[string][]*db.Competence, len(data.Entries))

	// map
	for i := range data.EntryEvents {
		for k := range data.EventCompetences {
			if data.EventCompetences[k].EventID == data.EntryEvents[i].EventID {
				for l := range data.Competences {
					if data.Competences[l].ID == data.EventCompetences[k].CompetenceID {
						data.CompetencesMapByEntry[data.EntryEvents[i].EntryID] = append(data.CompetencesMapByEntry[data.EntryEvents[i].EntryID], &data.Competences[l])
					}
				}
			}
		}
	}

	err = g.cfg.DB.NewSelect().Model(&data.UserCompetences).Where("organisation_id = ?", o.ID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	data.CompetencesMap = make(map[string]*db.Competence, len(data.Entries))

	// map
	for i := range data.Competences {
		data.CompetencesMap[data.Competences[i].ID] = &data.Competences[i]
	}

	data.CompetenceParentsByCompetence = make(map[string][]*db.Competence, len(data.Competences))

	// map
	for i := range data.UserCompetences {
		if data.UserCompetences[i].EntryID.Valid {
			data.CompetencesMapByEntry[data.UserCompetences[i].EntryID.String] = append(data.CompetencesMapByEntry[data.UserCompetences[i].EntryID.String], data.CompetencesMap[data.UserCompetences[i].CompetenceID])
		}
	}

	for i := range data.Competences {
		if _, ok := data.CompetencesMap[data.Competences[i].CompetenceID.String]; ok {
			data.CompetenceParentsByCompetence[data.Competences[i].ID] = competenceParentsWithData(data.Competences[i].CompetenceID.String, data.CompetencesMap)

			// reverse order of data.CompetenceParentsByCompetence[data.Competences[i].ID]
			data.CompetenceParentsByCompetence[data.Competences[i].ID] = reverseArray(data.CompetenceParentsByCompetence[data.Competences[i].ID])
		}
	}

	data.CompetenceParents = make(map[string][]*db.Competence)

	// generate parents map
	for i := range data.Competences {
		if data.Competences[i].CompetenceID.Valid {
			if _, ok := data.CompetenceParents[data.Competences[i].CompetenceID.String]; !ok {
				data.CompetenceParents[data.Competences[i].CompetenceID.String] = []*db.Competence{}
			} else {
				data.CompetenceParents[data.Competences[i].CompetenceID.String] = append(data.CompetenceParents[data.Competences[i].CompetenceID.String], &data.Competences[i])
			}
		}
	}

	// remove duplicates from data.CompetencesMapByEntry
	for i := range data.CompetencesMapByEntry {
		data.CompetencesMapByEntry[i] = removeDuplicates(data.CompetencesMapByEntry[i])
	}

	// sort data.Entries by created_at
	data.Entries = sortEntriesByCreatedAt(data.Entries)

	return &data, nil
}

// recursively get all parents of a competence with the parent_id CompetenceID
func competenceParentsWithData(id string, competencesMap map[string]*db.Competence) []*db.Competence {
	var parents []*db.Competence

	for competencesMap[id] != nil {
		parents = append(parents, competencesMap[id])
		id = competencesMap[id].CompetenceID.String
	}

	return parents
}

func reverseArray[T any](array []T) []T {
	for i := len(array)/2 - 1; i >= 0; i-- {
		opp := len(array) - 1 - i
		array[i], array[opp] = array[opp], array[i]
	}
	return array
}

func sortEntriesByCreatedAt(entries []db.Entry) []db.Entry {
	for i := range entries {
		for j := range entries {
			if entries[i].CreatedAt.After(entries[j].CreatedAt) {
				entries[i], entries[j] = entries[j], entries[i]
			}
		}
	}
	return entries
}

func removeDuplicates(competences []*db.Competence) []*db.Competence {
	keys := make(map[string]bool)
	var list []*db.Competence

	for _, entry := range competences {
		if _, value := keys[entry.ID]; !value {
			keys[entry.ID] = true
			list = append(list, entry)
		}
	}

	return list
}

func (g *Generator) AllEntriesReportData(report db.Report) (*AllReportData, error) {
	ctx := context.Background()

	var organisation db.Organisation
	err := g.cfg.DB.NewSelect().Model(&organisation).Where("id = ?", report.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	data, err := g.preloadAllEntriesReportData(ctx, organisation)
	if err != nil {
		return nil, err
	}

	var reportData AllReportData

	for i := range data.Entries {
		ucStructs := make([]CompetenceStruct, len(data.CompetencesMapByEntry[data.Entries[i].ID]))
		for i, item := range data.CompetencesMapByEntry[data.Entries[i].ID] {
			grades := formatGrades(item.Grades)
			parents := data.CompetenceParentsByCompetence[item.ID]

			ucStructs[i] = CompetenceStruct{
				Parents:    parents,
				Competence: item,
				Grades:     grades,
			}
		}

		createdAt := data.Entries[i].CreatedAt.Format("02.01.2006 15:04")
		date, err := time.Parse("2006-01-02", data.Entries[i].Date)
		if err != nil {
			return nil, err
		}
		dateFormatted := date.Format("02.01.2006")

		reportData.Entries = append(reportData.Entries, EntryReportData{
			Entry:       data.Entries[i],
			CreatedAt:   createdAt,
			Date:        dateFormatted,
			Competences: ucStructs,
		})
	}

	return &reportData, nil
}

func formatGrades(grades []int) string {
	switch len(grades) {
	case 0:
		return "-"
	case 1:
		return fmt.Sprintf("%d", grades[0])
	default:
		return fmt.Sprintf("%d - %d", grades[0], grades[len(grades)-1])
	}
}

// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: competence.sql

package db

import (
	"context"
)

const competenceList = `-- name: CompetenceList :many
SELECT id, name, competence_id, competence_type, organisation_id, grades, color, curriculum_id, created_at, deleted_at, sort_order, created_by FROM competences WHERE organisation_id = $1
`

func (q *Queries) CompetenceList(ctx context.Context, organisationID string) ([]Competence, error) {
	rows, err := q.db.Query(ctx, competenceList, organisationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Competence
	for rows.Next() {
		var i Competence
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.CompetenceID,
			&i.CompetenceType,
			&i.OrganisationID,
			&i.Grades,
			&i.Color,
			&i.CurriculumID,
			&i.CreatedAt,
			&i.DeletedAt,
			&i.SortOrder,
			&i.CreatedBy,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const competenceParentsList = `-- name: CompetenceParentsList :many
SELECT get_competence_parents FROM get_competence_parents($1::text[])
`

func (q *Queries) CompetenceParentsList(ctx context.Context, dollar_1 []string) ([]interface{}, error) {
	rows, err := q.db.Query(ctx, competenceParentsList, dollar_1)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []interface{}
	for rows.Next() {
		var get_competence_parents interface{}
		if err := rows.Scan(&get_competence_parents); err != nil {
			return nil, err
		}
		items = append(items, get_competence_parents)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

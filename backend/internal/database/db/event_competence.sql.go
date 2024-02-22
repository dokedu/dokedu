// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: event_competence.sql

package db

import (
	"context"
)

const createEventCompetence = `-- name: CreateEventCompetence :one
INSERT INTO event_competences (event_id, competence_id, organisation_id)
VALUES ($1, $2, $3)
ON CONFLICT (event_id, competence_id, organisation_id) DO UPDATE SET deleted_at = (SELECT CASE WHEN deleted_at IS NULL THEN NOW() END)
RETURNING id, event_id, competence_id, created_at, deleted_at, organisation_id
`

type CreateEventCompetenceParams struct {
	EventID        string `db:"event_id"`
	CompetenceID   string `db:"competence_id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) CreateEventCompetence(ctx context.Context, arg CreateEventCompetenceParams) (EventCompetence, error) {
	row := q.db.QueryRow(ctx, createEventCompetence, arg.EventID, arg.CompetenceID, arg.OrganisationID)
	var i EventCompetence
	err := row.Scan(
		&i.ID,
		&i.EventID,
		&i.CompetenceID,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.OrganisationID,
	)
	return i, err
}

const eventCompetenceListByEventId = `-- name: EventCompetenceListByEventId :many
SELECT competences.id, competences.name, competences.competence_id, competences.competence_type, competences.organisation_id, competences.grades, competences.color, competences.curriculum_id, competences.created_at, competences.deleted_at, competences.sort_order, competences.created_by
FROM competences
JOIN event_competences ec ON competences.id = ec.competence_id AND ec.deleted_at IS NULL
WHERE ec.event_id = $1
AND competences.organisation_id = $2
AND competences.deleted_at IS NULL
`

type EventCompetenceListByEventIdParams struct {
	EventID        string `db:"event_id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) EventCompetenceListByEventId(ctx context.Context, arg EventCompetenceListByEventIdParams) ([]Competence, error) {
	rows, err := q.db.Query(ctx, eventCompetenceListByEventId, arg.EventID, arg.OrganisationID)
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

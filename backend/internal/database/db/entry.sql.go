// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: entry.sql

package db

import (
	"context"
)

const createEntry = `-- name: CreateEntry :one
INSERT INTO entries (date, body, user_id, organisation_id)
VALUES (now(), $1, $2, $3)
RETURNING id, date, body, user_id, created_at, deleted_at, organisation_id
`

type CreateEntryParams struct {
	Body           string `db:"body"`
	UserID         string `db:"user_id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) CreateEntry(ctx context.Context, arg CreateEntryParams) (Entry, error) {
	row := q.db.QueryRow(ctx, createEntry, arg.Body, arg.UserID, arg.OrganisationID)
	var i Entry
	err := row.Scan(
		&i.ID,
		&i.Date,
		&i.Body,
		&i.UserID,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.OrganisationID,
	)
	return i, err
}

const deleteEntry = `-- name: DeleteEntry :one
UPDATE entries
SET deleted_at = now()
WHERE id = $1 AND organisation_id = $2
RETURNING id, date, body, user_id, created_at, deleted_at, organisation_id
`

type DeleteEntryParams struct {
	ID             string `db:"id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) DeleteEntry(ctx context.Context, arg DeleteEntryParams) (Entry, error) {
	row := q.db.QueryRow(ctx, deleteEntry, arg.ID, arg.OrganisationID)
	var i Entry
	err := row.Scan(
		&i.ID,
		&i.Date,
		&i.Body,
		&i.UserID,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.OrganisationID,
	)
	return i, err
}

const entryById = `-- name: EntryById :one
SELECT id, date, body, user_id, created_at, deleted_at, organisation_id FROM entries
WHERE id = $1 AND organisation_id = $2 AND deleted_at IS NULL
`

type EntryByIdParams struct {
	ID             string `db:"id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) EntryById(ctx context.Context, arg EntryByIdParams) (Entry, error) {
	row := q.db.QueryRow(ctx, entryById, arg.ID, arg.OrganisationID)
	var i Entry
	err := row.Scan(
		&i.ID,
		&i.Date,
		&i.Body,
		&i.UserID,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.OrganisationID,
	)
	return i, err
}

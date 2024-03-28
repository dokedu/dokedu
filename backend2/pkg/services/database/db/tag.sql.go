// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: tag.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const tagCreate = `-- name: TagCreate :one
INSERT INTO tags (name, color, organisation_id)
VALUES ($1, $2::text, $3)
RETURNING id, name, color, organisation_id, created_at, deleted_at
`

type TagCreateParams struct {
	Name           string `db:"name"`
	Color          string `db:"color"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) TagCreate(ctx context.Context, arg TagCreateParams) (Tag, error) {
	row := q.db.QueryRow(ctx, tagCreate, arg.Name, arg.Color, arg.OrganisationID)
	var i Tag
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Color,
		&i.OrganisationID,
		&i.CreatedAt,
		&i.DeletedAt,
	)
	return i, err
}

const tagFindById = `-- name: TagFindById :one
SELECT id, name, color, organisation_id, created_at, deleted_at
FROM tags
WHERE id = $1
  AND organisation_id = $2
  AND deleted_at IS NULL
LIMIT 1
`

type TagFindByIdParams struct {
	ID             string `db:"id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) TagFindById(ctx context.Context, arg TagFindByIdParams) (Tag, error) {
	row := q.db.QueryRow(ctx, tagFindById, arg.ID, arg.OrganisationID)
	var i Tag
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Color,
		&i.OrganisationID,
		&i.CreatedAt,
		&i.DeletedAt,
	)
	return i, err
}

const tagSoftDelete = `-- name: TagSoftDelete :one
UPDATE tags
SET deleted_at = now()
WHERE id = $1
  AND organisation_id = $2
RETURNING id, name, color, organisation_id, created_at, deleted_at
`

type TagSoftDeleteParams struct {
	ID             string `db:"id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) TagSoftDelete(ctx context.Context, arg TagSoftDeleteParams) (Tag, error) {
	row := q.db.QueryRow(ctx, tagSoftDelete, arg.ID, arg.OrganisationID)
	var i Tag
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Color,
		&i.OrganisationID,
		&i.CreatedAt,
		&i.DeletedAt,
	)
	return i, err
}

const tagUpsert = `-- name: TagUpsert :one
INSERT INTO tags (name, color, organisation_id)
VALUES ($1, $2, $3)
ON CONFLICT (name, organisation_id) DO UPDATE
    SET color = $2
RETURNING id, name, color, organisation_id, created_at, deleted_at
`

type TagUpsertParams struct {
	Name           string      `db:"name"`
	Color          pgtype.Text `db:"color"`
	OrganisationID string      `db:"organisation_id"`
}

func (q *Queries) TagUpsert(ctx context.Context, arg TagUpsertParams) (Tag, error) {
	row := q.db.QueryRow(ctx, tagUpsert, arg.Name, arg.Color, arg.OrganisationID)
	var i Tag
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Color,
		&i.OrganisationID,
		&i.CreatedAt,
		&i.DeletedAt,
	)
	return i, err
}

const tagsFind = `-- name: TagsFind :many
SELECT id, name, color, organisation_id, created_at, deleted_at
FROM tags
WHERE organisation_id = $1
  AND deleted_at IS NULL
  AND name ILIKE $2
ORDER BY name
LIMIT $4 OFFSET $3
`

type TagsFindParams struct {
	OrganisationID string `db:"organisation_id"`
	Search         string `db:"_search"`
	Offset         int32  `db:"_offset"`
	Limit          int32  `db:"_limit"`
}

func (q *Queries) TagsFind(ctx context.Context, arg TagsFindParams) ([]Tag, error) {
	rows, err := q.db.Query(ctx, tagsFind,
		arg.OrganisationID,
		arg.Search,
		arg.Offset,
		arg.Limit,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Tag
	for rows.Next() {
		var i Tag
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Color,
			&i.OrganisationID,
			&i.CreatedAt,
			&i.DeletedAt,
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
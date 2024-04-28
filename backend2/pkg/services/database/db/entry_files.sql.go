// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: entry_files.sql

package db

import (
	"context"
)

const entryFileCreate = `-- name: EntryFileCreate :one
INSERT INTO entry_files (entry_id, file_id, organisation_id)
VALUES ($1, $2, $3)
ON CONFLICT (entry_id, file_id, organisation_id) DO UPDATE SET deleted_at = NULL
RETURNING id, entry_id, file_id, created_at, deleted_at, organisation_id
`

type EntryFileCreateParams struct {
	EntryID        string `db:"entry_id"`
	FileID         string `db:"file_id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) EntryFileCreate(ctx context.Context, arg EntryFileCreateParams) (EntryFile, error) {
	row := q.db.QueryRow(ctx, entryFileCreate, arg.EntryID, arg.FileID, arg.OrganisationID)
	var i EntryFile
	err := row.Scan(
		&i.ID,
		&i.EntryID,
		&i.FileID,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.OrganisationID,
	)
	return i, err
}

const entryFileSoftDelete = `-- name: EntryFileSoftDelete :one
UPDATE entry_files
SET deleted_at = NOW()
WHERE entry_id = $1
  AND file_id = $2
  AND organisation_id = $3
RETURNING id, entry_id, file_id, created_at, deleted_at, organisation_id
`

type EntryFileSoftDeleteParams struct {
	EntryID        string `db:"entry_id"`
	FileID         string `db:"file_id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) EntryFileSoftDelete(ctx context.Context, arg EntryFileSoftDeleteParams) (EntryFile, error) {
	row := q.db.QueryRow(ctx, entryFileSoftDelete, arg.EntryID, arg.FileID, arg.OrganisationID)
	var i EntryFile
	err := row.Scan(
		&i.ID,
		&i.EntryID,
		&i.FileID,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.OrganisationID,
	)
	return i, err
}

const filesFindByEntryFileEntryID = `-- name: FilesFindByEntryFileEntryID :many
SELECT files.id, files.name, files.file_type, files.mime_type, files.size, files.bucket_id, files.parent_id, files.organisation_id, files.created_at, files.deleted_at
FROM files
         JOIN public.entry_files eu ON files.id = eu.file_id
         JOIN public.entries e ON eu.entry_id = e.id AND e.id = $1
WHERE files.organisation_id = $2
  AND eu.deleted_at IS NULL
  AND e.deleted_at IS NULL
  AND files.deleted_at IS NULL
`

type FilesFindByEntryFileEntryIDParams struct {
	EntryID        string `db:"entry_id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) FilesFindByEntryFileEntryID(ctx context.Context, arg FilesFindByEntryFileEntryIDParams) ([]File, error) {
	rows, err := q.db.Query(ctx, filesFindByEntryFileEntryID, arg.EntryID, arg.OrganisationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []File
	for rows.Next() {
		var i File
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.FileType,
			&i.MimeType,
			&i.Size,
			&i.BucketID,
			&i.ParentID,
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

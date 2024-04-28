// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: file.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const bucketByID = `-- name: BucketByID :one
SELECT id, name, shared, organisation_id, created_at, deleted_at, user_id
FROM buckets
WHERE id = $1
AND organisation_id = $2
`

type BucketByIDParams struct {
	ID             string `db:"id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) BucketByID(ctx context.Context, arg BucketByIDParams) (Bucket, error) {
	row := q.db.QueryRow(ctx, bucketByID, arg.ID, arg.OrganisationID)
	var i Bucket
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Shared,
		&i.OrganisationID,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.UserID,
	)
	return i, err
}

const fileByID = `-- name: FileByID :one
SELECT id, name, file_type, mime_type, size, bucket_id, parent_id, organisation_id, created_at, deleted_at
FROM files
WHERE id = $1
AND organisation_id = $2
`

type FileByIDParams struct {
	ID             string `db:"id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) FileByID(ctx context.Context, arg FileByIDParams) (File, error) {
	row := q.db.QueryRow(ctx, fileByID, arg.ID, arg.OrganisationID)
	var i File
	err := row.Scan(
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
	)
	return i, err
}

const fileCreate = `-- name: FileCreate :one
INSERT INTO files (name, file_type, mime_type, size, bucket_id, parent_id, organisation_id)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING id, name, file_type, mime_type, size, bucket_id, parent_id, organisation_id, created_at, deleted_at
`

type FileCreateParams struct {
	Name           string      `db:"name"`
	FileType       FileType    `db:"file_type"`
	MimeType       pgtype.Text `db:"mime_type"`
	Size           int64       `db:"size"`
	BucketID       string      `db:"bucket_id"`
	ParentID       pgtype.Text `db:"parent_id"`
	OrganisationID string      `db:"organisation_id"`
}

func (q *Queries) FileCreate(ctx context.Context, arg FileCreateParams) (File, error) {
	row := q.db.QueryRow(ctx, fileCreate,
		arg.Name,
		arg.FileType,
		arg.MimeType,
		arg.Size,
		arg.BucketID,
		arg.ParentID,
		arg.OrganisationID,
	)
	var i File
	err := row.Scan(
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
	)
	return i, err
}

const fileFindByParentID = `-- name: FileFindByParentID :many
SELECT id, name, file_type, mime_type, size, bucket_id, parent_id, organisation_id, created_at, deleted_at
FROM files
WHERE id = $1
AND organisation_id = $2
AND parent_id = $3
AND deleted_at IS NULL
`

type FileFindByParentIDParams struct {
	ID             string      `db:"id"`
	OrganisationID string      `db:"organisation_id"`
	ParentID       pgtype.Text `db:"parent_id"`
}

func (q *Queries) FileFindByParentID(ctx context.Context, arg FileFindByParentIDParams) ([]File, error) {
	rows, err := q.db.Query(ctx, fileFindByParentID, arg.ID, arg.OrganisationID, arg.ParentID)
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

const fileListByBucketID = `-- name: FileListByBucketID :many
SELECT id, name, file_type, mime_type, size, bucket_id, parent_id, organisation_id, created_at, deleted_at
FROM files
WHERE bucket_id = $1
AND organisation_id = $2
AND deleted_at IS NULL
`

type FileListByBucketIDParams struct {
	BucketID       string `db:"bucket_id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) FileListByBucketID(ctx context.Context, arg FileListByBucketIDParams) ([]File, error) {
	rows, err := q.db.Query(ctx, fileListByBucketID, arg.BucketID, arg.OrganisationID)
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

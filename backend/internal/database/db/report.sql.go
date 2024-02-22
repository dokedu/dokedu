// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: report.sql

package db

import (
	"context"
	"time"
)

const createReport = `-- name: CreateReport :one
INSERT INTO reports (status, format, kind, "from", "to", meta, filter_tags, user_id, student_user_id, organisation_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING id, status, format, kind, "from", "to", meta, filter_tags, file_id, user_id, student_user_id, organisation_id, created_at, deleted_at
`

type CreateReportParams struct {
	Status         ReportStatus `db:"status"`
	Format         ReportFormat `db:"format"`
	Kind           ReportKind   `db:"kind"`
	From           time.Time    `db:"_from"`
	To             time.Time    `db:"_to"`
	Meta           []byte       `db:"meta"`
	FilterTags     []string     `db:"filter_tags"`
	UserID         string       `db:"user_id"`
	StudentUserID  string       `db:"student_user_id"`
	OrganisationID string       `db:"organisation_id"`
}

func (q *Queries) CreateReport(ctx context.Context, arg CreateReportParams) (Report, error) {
	row := q.db.QueryRow(ctx, createReport,
		arg.Status,
		arg.Format,
		arg.Kind,
		arg.From,
		arg.To,
		arg.Meta,
		arg.FilterTags,
		arg.UserID,
		arg.StudentUserID,
		arg.OrganisationID,
	)
	var i Report
	err := row.Scan(
		&i.ID,
		&i.Status,
		&i.Format,
		&i.Kind,
		&i.From,
		&i.To,
		&i.Meta,
		&i.FilterTags,
		&i.FileID,
		&i.UserID,
		&i.StudentUserID,
		&i.OrganisationID,
		&i.CreatedAt,
		&i.DeletedAt,
	)
	return i, err
}

const gLOBAL_ReportById = `-- name: GLOBAL_ReportById :one
SELECT id, status, format, kind, "from", "to", meta, filter_tags, file_id, user_id, student_user_id, organisation_id, created_at, deleted_at
FROM reports
WHERE id = $1 AND deleted_at IS NULL
LIMIT 1
`

func (q *Queries) GLOBAL_ReportById(ctx context.Context, id string) (Report, error) {
	row := q.db.QueryRow(ctx, gLOBAL_ReportById, id)
	var i Report
	err := row.Scan(
		&i.ID,
		&i.Status,
		&i.Format,
		&i.Kind,
		&i.From,
		&i.To,
		&i.Meta,
		&i.FilterTags,
		&i.FileID,
		&i.UserID,
		&i.StudentUserID,
		&i.OrganisationID,
		&i.CreatedAt,
		&i.DeletedAt,
	)
	return i, err
}

const gLOBAL_ReportsByStatus = `-- name: GLOBAL_ReportsByStatus :many
SELECT id, status, format, kind, "from", "to", meta, filter_tags, file_id, user_id, student_user_id, organisation_id, created_at, deleted_at
FROM reports
WHERE status = $1 AND deleted_at IS NULL
`

func (q *Queries) GLOBAL_ReportsByStatus(ctx context.Context, status ReportStatus) ([]Report, error) {
	rows, err := q.db.Query(ctx, gLOBAL_ReportsByStatus, status)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Report
	for rows.Next() {
		var i Report
		if err := rows.Scan(
			&i.ID,
			&i.Status,
			&i.Format,
			&i.Kind,
			&i.From,
			&i.To,
			&i.Meta,
			&i.FilterTags,
			&i.FileID,
			&i.UserID,
			&i.StudentUserID,
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

const gLOBAL_UpdateReportStatus = `-- name: GLOBAL_UpdateReportStatus :exec
UPDATE reports
SET status = $1
WHERE id = $2 AND deleted_at IS NULL
`

type GLOBAL_UpdateReportStatusParams struct {
	Status ReportStatus `db:"status"`
	ID     string       `db:"id"`
}

func (q *Queries) GLOBAL_UpdateReportStatus(ctx context.Context, arg GLOBAL_UpdateReportStatusParams) error {
	_, err := q.db.Exec(ctx, gLOBAL_UpdateReportStatus, arg.Status, arg.ID)
	return err
}

const reportById = `-- name: ReportById :one
SELECT id, status, format, kind, "from", "to", meta, filter_tags, file_id, user_id, student_user_id, organisation_id, created_at, deleted_at
FROM reports
WHERE id = $1 AND organisation_id = $2 AND deleted_at IS NULL
`

type ReportByIdParams struct {
	ID             string `db:"id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) ReportById(ctx context.Context, arg ReportByIdParams) (Report, error) {
	row := q.db.QueryRow(ctx, reportById, arg.ID, arg.OrganisationID)
	var i Report
	err := row.Scan(
		&i.ID,
		&i.Status,
		&i.Format,
		&i.Kind,
		&i.From,
		&i.To,
		&i.Meta,
		&i.FilterTags,
		&i.FileID,
		&i.UserID,
		&i.StudentUserID,
		&i.OrganisationID,
		&i.CreatedAt,
		&i.DeletedAt,
	)
	return i, err
}

const reportList = `-- name: ReportList :many
SELECT id, status, format, kind, "from", "to", meta, filter_tags, file_id, user_id, student_user_id, organisation_id, created_at, deleted_at
FROM reports
WHERE organisation_id = $1 AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT $3
OFFSET $2
`

type ReportListParams struct {
	OrganisationID string `db:"organisation_id"`
	Offset         int32  `db:"_offset"`
	Limit          int32  `db:"_limit"`
}

func (q *Queries) ReportList(ctx context.Context, arg ReportListParams) ([]Report, error) {
	rows, err := q.db.Query(ctx, reportList, arg.OrganisationID, arg.Offset, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Report
	for rows.Next() {
		var i Report
		if err := rows.Scan(
			&i.ID,
			&i.Status,
			&i.Format,
			&i.Kind,
			&i.From,
			&i.To,
			&i.Meta,
			&i.FilterTags,
			&i.FileID,
			&i.UserID,
			&i.StudentUserID,
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

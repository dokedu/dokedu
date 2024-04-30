// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: reports.sql

package db

import (
	"context"
)

const gLOBAL_ReportFindByID = `-- name: GLOBAL_ReportFindByID :one
SELECT id, status, format, kind, "from", "to", meta, filter_tags, file_id, user_id, student_user_id, organisation_id, created_at, deleted_at FROM reports WHERE id = $1
`

func (q *Queries) GLOBAL_ReportFindByID(ctx context.Context, id string) (Report, error) {
	row := q.db.QueryRow(ctx, gLOBAL_ReportFindByID, id)
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

const gLOBAL_ReportsFindUnprocessed = `-- name: GLOBAL_ReportsFindUnprocessed :many
SELECT id, status, format, kind, "from", "to", meta, filter_tags, file_id, user_id, student_user_id, organisation_id, created_at, deleted_at FROM reports WHERE status = 'pending' OR (status = 'processing' AND created_at <= now() - '5 minutes'::INTERVAL)
`

func (q *Queries) GLOBAL_ReportsFindUnprocessed(ctx context.Context) ([]Report, error) {
	rows, err := q.db.Query(ctx, gLOBAL_ReportsFindUnprocessed)
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

const gLOBAL_ReportsUpdateStatus = `-- name: GLOBAL_ReportsUpdateStatus :one
UPDATE reports SET status = $1 WHERE id = $2 RETURNING id, status, format, kind, "from", "to", meta, filter_tags, file_id, user_id, student_user_id, organisation_id, created_at, deleted_at
`

type GLOBAL_ReportsUpdateStatusParams struct {
	Status ReportStatus `db:"status"`
	ID     string       `db:"id"`
}

func (q *Queries) GLOBAL_ReportsUpdateStatus(ctx context.Context, arg GLOBAL_ReportsUpdateStatusParams) (Report, error) {
	row := q.db.QueryRow(ctx, gLOBAL_ReportsUpdateStatus, arg.Status, arg.ID)
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

const reportTemplateFindByName = `-- name: ReportTemplateFindByName :one
SELECT id, name, description, format, template, component, settings, organisation_id, created_at FROM report_templates WHERE organisation_id = $1 AND name = $2
`

type ReportTemplateFindByNameParams struct {
	OrganisationID string `db:"organisation_id"`
	Name           string `db:"name"`
}

func (q *Queries) ReportTemplateFindByName(ctx context.Context, arg ReportTemplateFindByNameParams) (ReportTemplate, error) {
	row := q.db.QueryRow(ctx, reportTemplateFindByName, arg.OrganisationID, arg.Name)
	var i ReportTemplate
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.Format,
		&i.Template,
		&i.Component,
		&i.Settings,
		&i.OrganisationID,
		&i.CreatedAt,
	)
	return i, err
}

const reportUpdateStatusDone = `-- name: ReportUpdateStatusDone :one
UPDATE reports SET status = 'done' AND file_id = $1::text WHERE id = $2 AND organisation_id = $3 RETURNING id, status, format, kind, "from", "to", meta, filter_tags, file_id, user_id, student_user_id, organisation_id, created_at, deleted_at
`

type ReportUpdateStatusDoneParams struct {
	FileID         string `db:"file_id"`
	ID             string `db:"id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) ReportUpdateStatusDone(ctx context.Context, arg ReportUpdateStatusDoneParams) (Report, error) {
	row := q.db.QueryRow(ctx, reportUpdateStatusDone, arg.FileID, arg.ID, arg.OrganisationID)
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

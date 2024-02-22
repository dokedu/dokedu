-- name: GLOBAL_ReportById :one
SELECT *
FROM reports
WHERE id = @id AND deleted_at IS NULL
LIMIT 1;

-- name: GLOBAL_ReportsByStatus :many
SELECT *
FROM reports
WHERE status = @status AND deleted_at IS NULL;

-- name: GLOBAL_UpdateReportStatus :exec
UPDATE reports
SET status = @status
WHERE id = @id AND deleted_at IS NULL;

-- name: CreateReport :one
INSERT INTO reports (status, format, kind, "from", "to", meta, filter_tags, user_id, student_user_id, organisation_id)
VALUES (@status, @format, @kind, @_from, @_to, @meta, @filter_tags, @user_id, @student_user_id, @organisation_id)
RETURNING *;

-- name: ReportById :one
SELECT *
FROM reports
WHERE id = @id AND organisation_id = @organisation_id AND deleted_at IS NULL;

-- name: ReportList :many
SELECT *
FROM reports
WHERE organisation_id = @organisation_id AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT @_limit
OFFSET @_offset;
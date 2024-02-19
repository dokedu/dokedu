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
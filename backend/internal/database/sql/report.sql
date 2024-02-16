-- name: ReportById :one
SELECT *
FROM reports
WHERE id = @id
LIMIT 1;

-- name: ReportsByStatus :many
SELECT *
FROM reports
WHERE status = @status;

-- name: UpdateReportStatus :exec
UPDATE reports
SET status = @status
WHERE id = @id;
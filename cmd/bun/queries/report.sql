-- name: GetReport :one
SELECT *
FROM reports
WHERE id = $1 AND organisation_id = $2;

-- name: ListReports :many
SELECT *
FROM reports
WHERE organisation_id = $1
LIMIT $2 OFFSET $3;
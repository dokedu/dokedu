-- name: GetEvent :one
SELECT *
FROM events
WHERE id = $1 AND organisation_id = $2;

-- name: ListEvents :many
SELECT *
FROM events
WHERE organisation_id = $1
LIMIT $2 OFFSET $3;
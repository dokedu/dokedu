-- name: GetEntry :one
SELECT *
FROM entries
WHERE id = $1 AND organisation_id = $2;

-- name: ListEntries :many
SELECT *
FROM entries
WHERE entries.organisation_id = $1
LIMIT $2 OFFSET $3;

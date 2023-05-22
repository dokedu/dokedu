-- name: GetTag :one
SELECT *
FROM tags
WHERE id = $1 AND organisation_id = $2;

-- name: ListTags :many
SELECT *
FROM tags
WHERE organisation_id = $1
LIMIT $2 OFFSET $3;
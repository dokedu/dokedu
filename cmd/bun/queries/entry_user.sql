-- name: GetEntryUsers :many
SELECT *
FROM entry_users
WHERE organisation_id = $1
  AND entry_id = $2;

-- name: CreateEntryUser :one
INSERT INTO entry_users (organisation_id, entry_id, user_id)
VALUES ($1, $2, $3)
RETURNING *;
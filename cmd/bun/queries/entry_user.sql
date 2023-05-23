-- name: GetEntryUsers :many
SELECT *
FROM entry_users
WHERE organisation_id = $1 AND entry_id = $2;
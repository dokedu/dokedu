-- name: GetEntryEvent :one
SELECT *
FROM entry_events
WHERE id = $1 AND organisation_id = $2;

-- name: GetEntryEvents :many
SELECT *
FROM entry_events
WHERE organisation_id = $1 AND entry_id = $2;
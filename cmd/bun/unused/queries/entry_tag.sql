-- name: GetEntryTags :many
SELECT *
FROM entry_tags
WHERE organisation_id = $1 AND entry_id = $2;

-- name: CreateEntryTag :one
INSERT INTO entry_tags (organisation_id, entry_id, tag_id)
VALUES ($1, $2, $3)
RETURNING *;
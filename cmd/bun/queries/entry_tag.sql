-- name: GetEntryTags :many
SELECT *
FROM entry_tags
WHERE organisation_id = $1 AND entry_id = $2;
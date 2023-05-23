-- name: GetEntryFiles :many
SELECT *
FROM entry_files
WHERE organisation_id = $1 AND entry_id = $2;
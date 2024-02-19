-- name: CreateEntryFile :one
INSERT INTO entry_files (entry_id, file_id, organisation_id)
VALUES (@entry_id, @file_id, @organisation_id)
ON CONFLICT (entry_id, file_id) DO UPDATE SET deleted_at = NULL
RETURNING *;

-- name: DeleteEntryFile :one
UPDATE entry_files
SET deleted_at = now()
WHERE entry_id = @entry_id AND file_id = @file_id AND organisation_id = @organisation_id
RETURNING *;
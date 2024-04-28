-- name: FilesFindByEntryFileEntryID :many
SELECT files.*
FROM files
         JOIN public.entry_files eu ON files.id = eu.file_id
         JOIN public.entries e ON eu.entry_id = e.id AND e.id = @entry_id
WHERE files.organisation_id = @organisation_id
  AND eu.deleted_at IS NULL
  AND e.deleted_at IS NULL
  AND files.deleted_at IS NULL;

-- name: EntryFileSoftDelete :one
UPDATE entry_files
SET deleted_at = NOW()
WHERE entry_id = @entry_id
  AND file_id = @file_id
  AND organisation_id = @organisation_id
RETURNING *;

-- name: EntryFileCreate :one
INSERT INTO entry_files (entry_id, file_id, organisation_id)
VALUES (@entry_id, @file_id, @organisation_id)
ON CONFLICT (entry_id, file_id, organisation_id) DO UPDATE SET deleted_at = NULL
RETURNING *;
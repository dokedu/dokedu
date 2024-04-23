-- name: FilesFindByEntryFileEntryID :many
SELECT files.*
FROM files
         JOIN public.entry_files eu ON files.id = eu.file_id
         JOIN public.entries e ON eu.entry_id = e.id AND e.id = @entry_id
WHERE files.organisation_id = @organisation_id
  AND eu.deleted_at IS NULL
  AND e.deleted_at IS NULL
  AND files.deleted_at IS NULL;
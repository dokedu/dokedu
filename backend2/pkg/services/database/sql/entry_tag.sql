-- name: TagsFindByEntryTagEntryID :many
SELECT tags.*
FROM tags
         JOIN public.entry_tags eu ON tags.id = eu.tag_id
         JOIN public.entries e ON eu.entry_id = e.id AND e.id = @entry_id
WHERE tags.organisation_id = @organisation_id
  AND eu.deleted_at IS NULL
  AND e.deleted_at IS NULL
  AND tags.deleted_at IS NULL;
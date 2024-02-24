-- name: TagListByEntryTagByEntryId :many
SELECT tags.*
FROM tags
JOIN public.entry_tags eu ON tags.id = eu.tag_id
JOIN public.entries e ON eu.entry_id = e.id
WHERE eu.deleted_at IS NULL AND e.id = @entry_id
AND tags.organisation_id = @organisation_id AND tags.deleted_at IS NULL
ORDER BY tags.name;

-- name: CreateEntryTag :one
INSERT INTO entry_tags (entry_id, tag_id, organisation_id)
VALUES (@entry_id, @tag_id, @organisation_id)
ON CONFLICT (entry_id, tag_id) DO UPDATE SET deleted_at = NULL
RETURNING *;

-- name: DeleteEntryTag :one
UPDATE entry_tags
SET deleted_at = now()
WHERE entry_id = @entry_id AND tag_id = @tag_id AND organisation_id = @organisation_id
RETURNING *;
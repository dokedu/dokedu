-- name: TagById :one
SELECT *
FROM tags
WHERE id = @id AND organisation_id = @organisation_id AND deleted_at IS NULL
LIMIT 1;

-- name: CreateTag :one
INSERT INTO tags (name, color, organisation_id)
VALUES (@name, @color, @organisation_id)
RETURNING *;

-- name: UpsertTag :one
INSERT INTO tags (name, color, organisation_id)
VALUES (@name, @color, @organisation_id)
ON CONFLICT (name, organisation_id) DO UPDATE
SET color = @color
RETURNING *;

-- name: DeleteTag :one
UPDATE tags
SET deleted_at = now()
WHERE id = @id AND organisation_id = @organisation_id
RETURNING *;


-- name: TagList :many
SELECT *
FROM tags
WHERE organisation_id = @organisation_id AND deleted_at IS NULL AND name ILIKE @_search
ORDER BY name
LIMIT @_limit
OFFSET @_offset;
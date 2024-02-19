-- name: TagById :one
SELECT *
FROM tags
WHERE id = @id AND organisation_id = @organisation_id AND deleted_at IS NULL
LIMIT 1;
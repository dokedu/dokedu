-- name: CreateEntry :one
INSERT INTO entries (date, body, user_id, organisation_id)
VALUES (now(), @body, @user_id, @organisation_id)
RETURNING *;

-- name: DeleteEntry :one
UPDATE entries
SET deleted_at = now()
WHERE id = @id AND organisation_id = @organisation_id
RETURNING *;

-- name: EntryById :one
SELECT * FROM entries
WHERE id = @id AND organisation_id = @organisation_id AND deleted_at IS NULL;

-- name: EntryCountByUserId :one
SELECT COUNT(*) FROM entries
WHERE user_id = @user_id AND organisation_id = @organisation_id AND deleted_at IS NULL;
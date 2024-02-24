-- name: UserListByEntryUserByEntryId :many
SELECT users.*
FROM users
JOIN public.entry_users eu ON users.id = eu.user_id
JOIN public.entries e ON eu.entry_id = e.id
WHERE eu.deleted_at IS NULL AND e.id = @entry_id
AND users.organisation_id = @organisation_id AND users.deleted_at IS NULL
ORDER BY users.first_name, users.last_name;

-- name: CreateEntryUser :one
INSERT INTO entry_users (entry_id, user_id, organisation_id)
VALUES (@entry_id, @user_id, @organisation_id)
ON CONFLICT (entry_id, user_id) DO UPDATE SET deleted_at = NULL
RETURNING *;

-- name: DeleteEntryUser :one
UPDATE entry_users
SET deleted_at = now()
WHERE entry_id = @entry_id AND user_id = @user_id AND organisation_id = @organisation_id
RETURNING *;
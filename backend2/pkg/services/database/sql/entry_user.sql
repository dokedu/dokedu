-- name: EntryUserCountByUserID :one
SELECT COUNT(*)
FROM entry_users
WHERE user_id = @user_id
  AND organisation_id = @organisation_id
  AND deleted_at IS NULL;

-- name: UsersFindByEntryUserEntryID :many
SELECT users.*
FROM users
         JOIN public.entry_users eu ON users.id = eu.user_id
         JOIN public.entries e ON eu.entry_id = e.id AND e.id = @entry_id
WHERE users.organisation_id = @organisation_id
  AND eu.deleted_at IS NULL
  AND e.deleted_at IS NULL
  AND users.deleted_at IS NULL;

-- name: EntryUserCreate :one
INSERT INTO entry_users (entry_id, user_id, organisation_id)
VALUES (@entry_id, @user_id, @organisation_id)
ON CONFLICT (entry_id, user_id, organisation_id) DO UPDATE SET deleted_at = NULL
RETURNING *;

-- name: EntryUserSoftDelete :one
UPDATE entry_users
SET deleted_at = NOW()
WHERE entry_id = @entry_id
  AND user_id = @user_id
  AND organisation_id = @organisation_id
RETURNING *;
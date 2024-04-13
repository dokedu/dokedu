-- name: EntryUserCountByUserID :one
SELECT COUNT(*)
FROM entry_users
WHERE user_id = @user_id
  AND organisation_id = @organisation_id
  AND deleted_at IS NULL;
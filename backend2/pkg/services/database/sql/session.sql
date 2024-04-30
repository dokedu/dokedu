-- name: GLOBAL_SessionFindByToken :one
SELECT *
FROM sessions
WHERE token = $1
  AND deleted_at IS NULL
LIMIT 1;

-- name: GLOBAL_SessionsDeleteByUserID :exec
UPDATE sessions
SET deleted_at = NOW()
WHERE user_id = $1;

-- name: GLOBAL_SessionDeleteExpired :exec
UPDATE sessions
SET deleted_at = NOW()
WHERE created_at < NOW() - INTERVAL '12 hours';

-- name: GLOBAL_SessionsFindByUserID :exec
UPDATE sessions
SET deleted_at = NOW()
WHERE user_id = $1;

-- name: GLOBAL_SessionCreate :one
INSERT INTO sessions (user_id, token)
VALUES ($1, $2)
RETURNING *;

-- name: GLOBAL_SessionCountByToken :one
SELECT COUNT(*)
FROM sessions
WHERE token = $1
  AND deleted_at IS NULL;

-- name: GLOBAL_SessionCountByUserId :one
SELECT COUNT(*)
FROM sessions
WHERE user_id = @user_id
  AND deleted_at IS NULL;
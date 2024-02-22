-- name: GLOBAL_SessionByToken :one
SELECT *
FROM sessions
WHERE token = $1 AND deleted_at IS NULL
LIMIT 1;

-- name: GLOBAL_DeleteExpiredSession :exec
UPDATE sessions
SET deleted_at = NOW()
WHERE created_at < NOW() - INTERVAL '12 hours';

-- name: GLOBAL_DeleteSessionsByUserID :exec
UPDATE sessions
SET deleted_at = NOW()
WHERE user_id = $1;

-- name: GLOBAL_CreateSession :one
INSERT INTO sessions (user_id, token)
VALUES ($1, $2)
RETURNING *;

-- name: GLOBAL_SessionCountByToken :one
SELECT COUNT(*)
FROM sessions
WHERE token = $1 AND deleted_at IS NULL;
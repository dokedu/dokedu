-- name: SessionByToken :one
SELECT *
FROM sessions
WHERE token = $1
LIMIT 1;

-- name: DeleteExpiredSession :exec
UPDATE sessions
SET deleted_at = NOW()
WHERE created_at < NOW() - INTERVAL '12 hours';

-- name: DeleteSessionsByUserID :exec
UPDATE sessions
SET deleted_at = NOW()
WHERE user_id = $1;
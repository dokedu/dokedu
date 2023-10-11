-- name: GetFile :one
SELECT *
FROM files
WHERE id = $1 AND organisation_id = $2;
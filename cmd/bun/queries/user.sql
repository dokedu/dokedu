-- name: ListUsers :many
SELECT *
FROM users
WHERE organisation_id = $1;

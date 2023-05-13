-- name: GetOrganisation :one
SELECT *
FROM organisations
WHERE id = $1;
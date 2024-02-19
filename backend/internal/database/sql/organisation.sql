-- name: GLOBAL_OrganisationList :many
SELECT * FROM organisations WHERE  deleted_at IS NULL;

-- name: GLOBAL_OrganisationById :one
SELECT * FROM organisations WHERE id = @id LIMIT 1 AND deleted_at IS NULL;
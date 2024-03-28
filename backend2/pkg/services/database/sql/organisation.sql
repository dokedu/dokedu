-- name: GLOBAL_OrganisationFindByID :one
SELECT * FROM organisations WHERE id = $1;
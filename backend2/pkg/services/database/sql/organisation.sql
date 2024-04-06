-- name: GLOBAL_OrganisationFindByID :one
SELECT * FROM organisations WHERE id = $1;

-- name: GLOBAL_OrganisationCreate :one
INSERT INTO organisations (name, legal_name, website, phone, owner_id, allowed_domains, enabled_apps)
VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;

-- name: GLOBAL_OrganisationUpdateOwnerID :one
UPDATE organisations SET owner_id = $2 WHERE id = $1 RETURNING *;
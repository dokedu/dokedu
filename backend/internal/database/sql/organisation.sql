-- name: GLOBAL_OrganisationList :many
SELECT * FROM organisations WHERE  deleted_at IS NULL;

-- name: GLOBAL_OrganisationById :one
SELECT * FROM organisations WHERE id = @id LIMIT 1 AND deleted_at IS NULL;

-- name: GLOBAL_CreateOrganisation :one
INSERT INTO organisations (name, legal_name, website, phone, owner_id, allowed_domains, enabled_apps)
VALUES (@name, @legal_name, @website, @phone, @owner_id, @allowed_domains, @enabled_apps)
RETURNING *;
-- name: GLOBAL_OrganisationFindByID :one
SELECT * FROM organisations WHERE id = $1;

-- name: GLOBAL_OrganisationCreate :one
INSERT INTO organisations (name, legal_name, website, phone, owner_id, allowed_domains, enabled_apps)
VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;

-- name: GLOBAL_OrganisationUpdateOwnerID :one
UPDATE organisations SET owner_id = $2 WHERE id = $1 RETURNING *;

-- name: OrganisationUpdate :one
UPDATE organisations
SET name = CASE WHEN @name::text <> '' THEN @name::text ELSE name END,
    legal_name = CASE WHEN @legal_name::text <> ''THEN @legal_name::text ELSE legal_name END,
    website = CASE WHEN @website::text <> '' THEN @website::text ELSE website END,
    phone = CASE WHEN @phone::text <> '' THEN @phone::text ELSE phone END
WHERE id = @organisation_id
RETURNING *;
-- name: ListUsers :many
SELECT *
FROM users
WHERE organisation_id = $1;

-- name: GetOrganisation :one
SELECT *
FROM organisations
WHERE id = $1;

-- name: GetUserByEmail :one
SELECT count(*)
FROM users
WHERE email = @email::text
  AND organisation_id = $1;

-- name: GetAuthUserByEmail :one
SELECT *
FROM users
WHERE email = $1
LIMIT 1;

-- name: InviteUserByEmail :one
INSERT INTO users (organisation_id, role, email)
VALUES ($1, $2, @email::text)
RETURNING *;

-- name: GetUser :one
SELECT *
FROM users
WHERE id = $1
  AND organisation_id = $2;

-- name: ArchiveUser :one
UPDATE users
SET deleted_at = now()
WHERE id = $1
  AND organisation_id = $2
RETURNING *;

-- name: UpdateUser :one
UPDATE users
SET (name, surname, updated_at) = ($3, $4, now())
WHERE id = $1
  AND organisation_id = $2
RETURNING *;

-- name: CreateUser :one
INSERT INTO users (organisation_id, role, email, name, surname)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
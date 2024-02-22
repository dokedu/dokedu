-- name: GLOBAL_UserList :many
SELECT *
FROM users;

-- name: UserById :one
SELECT *
FROM users
WHERE id = $1
  AND organisation_id = $2;

-- name: GLOBAL_UserById :one
SELECT *
FROM users
WHERE id = $1 AND deleted_at IS NULL;

-- name: GLOBAL_UserByEmail :one
SELECT *
FROM users
WHERE email = $1 AND deleted_at IS NULL;

-- name: GLOBAL_UserFindBySession :one
SELECT *
FROM users
WHERE id = (SELECT user_id FROM sessions WHERE token = $1 LIMIT 1) AND deleted_at IS NULL
LIMIT 1;

-- name: GLOBAL_UsersByIds :many
SELECT *
FROM users
WHERE id = ANY (@ids::text[]) AND deleted_at IS NULL;

-- name: UserListByRole :many
SELECT *
FROM users
WHERE role = $1
  AND organisation_id = $2 AND deleted_at IS NULL;

-- name: UserList :many
SELECT *
FROM users
WHERE organisation_id = $1 AND deleted_at IS NULL;

-- name: UserListCount :many
SELECT COUNT(*)
FROM users
WHERE organisation_id = $1 AND deleted_at IS NULL;

-- name: UpdateUserRecoveryToken :one
UPDATE users
SET recovery_token = $1
WHERE id = $2
  AND organisation_id = $3
RETURNING *;

-- name: GLOBAL_UserByRecoveryToken :one
SELECT *
FROM users
WHERE recovery_token = $1 AND deleted_at IS NULL
LIMIT 1;

-- name: UpdateUserPassword :one
UPDATE users
SET password = $1
WHERE id = $2
  AND organisation_id = $3
RETURNING *;

-- name: UserByIdWithDeleted :one
SELECT *
FROM users
WHERE id = $1
  AND organisation_id = $2
LIMIT 1;

-- name: CreateUser :one
INSERT INTO users (role, organisation_id, first_name, last_name, email, password, language, sex)
VALUES (@role, @organisation_id, @first_name, @last_name, @email, @password, @language, @sex)
RETURNING *;
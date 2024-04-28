-- name: GLOBAL_UserFindByEmail :one
SELECT *
FROM users
WHERE LOWER(email) = LOWER(@email::text)
  AND deleted_at IS NULL;

-- name: GLOBAL_UserFindByID :one
SELECT *
FROM users
WHERE id = $1
  AND deleted_at IS NULL;

-- name: GLOBAL_UserFindByRecoveryToken :one
SELECT *
FROM users
WHERE recovery_token = @recovery_token::text
  AND recovery_sent_at > NOW() - INTERVAL '1 day'
  AND deleted_at IS NULL;

-- name: UserFindByID :one
SELECT *
FROM users
WHERE id = $1
  AND organisation_id = $2
  AND deleted_at IS NULL;

-- name: UsersAllWithDeleted :many
SELECT *
FROM users
WHERE organisation_id = @organisation_id;

-- name: UserUpdatePassword :one
UPDATE users
SET password         = @password::text,
    recovery_token   = NULL,
    recovery_sent_at = NULL
WHERE id = $1
  AND organisation_id = $2
RETURNING *;

-- name: UserUpdateRecoveryToken :one
UPDATE users
SET recovery_token   = @recovery_token::text,
    recovery_sent_at = NOW()
WHERE id = $1
  AND organisation_id = $2
RETURNING *;

-- name: UserUpdate :one
UPDATE users
SET first_name = @first_name,
    last_name  = @last_name
WHERE id = @id
  AND organisation_id = @organisation_id
RETURNING *;

-- name: UserUpdateLanguage :one
UPDATE users
SET language = @language::user_lang
WHERE id = @id
  AND organisation_id = @organisation_id
RETURNING *;

-- name: UserCreate :one
INSERT INTO users (role, organisation_id, first_name, last_name, email)
VALUES (@role, @organisation_id, @first_name, @last_name, @email)
RETURNING *;

-- name: UserSoftDelete :one
UPDATE users
SET deleted_at = NOW()
WHERE id = $1
  AND organisation_id = $2
RETURNING *;

-- name: UsersFindByID :many
SELECT *
FROM users
WHERE id = ANY (@ids::text[])
  AND organisation_id = @organisation_id
  AND deleted_at IS NULL;

-- name: UserInviteDetailsByRecoveryToken :one
SELECT id, email, first_name, last_name
FROM users
WHERE recovery_token = @recovery_token::text
  AND recovery_sent_at > NOW() - INTERVAL '1 day'
  AND deleted_at IS NULL
LIMIT 1;

-- name: UserFindBySessionToken :one
SELECT users.*
FROM users
         JOIN sessions s ON users.id = s.user_id
WHERE s.token = @token::text
  AND s.deleted_at IS NULL
LIMIT 1;

-- name: UserFindByValidSessionToken :one
SELECT users.*
FROM users
         JOIN sessions s ON users.id = s.user_id
WHERE s.token = @token::text
  AND s.deleted_at IS NULL
  AND s.created_at > NOW() - INTERVAL '7 days'
LIMIT 1;

-- name: UserFindByUserEntry :many
SELECT *
FROM users
         JOIN public.entry_users eu ON users.id = eu.user_id
WHERE eu.deleted_at IS NULL
  AND eu.entry_id = @entry_id
  AND users.organisation_id = @organisation_id
  AND users.deleted_at IS NULL;

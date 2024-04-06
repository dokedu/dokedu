-- name: GLOBAL_UserFindByEmail :one
SELECT * FROM users WHERE LOWER(email) = LOWER(@email::text) and deleted_at is null;

-- name: GLOBAL_UserFindByID :one
SELECT * FROM users WHERE id = $1 and deleted_at is null;

-- name: GLOBAL_UserFindByRecoveryToken :one
SELECT * FROM users WHERE recovery_token = @recovery_token::text AND recovery_sent_at > NOW() - INTERVAL '1 day' and deleted_at is null;

-- name: UserFindByID :one
SELECT * FROM users WHERE id = $1 and organisation_id = $2 and deleted_at is null;

-- name: UserUpdatePassword :one
UPDATE users
SET password = @password::text, recovery_token = NULL, recovery_sent_at = NULL
WHERE id = $1
  AND organisation_id = $2
RETURNING *;

-- name: UserUpdateRecoveryToken :one
UPDATE users
SET recovery_token = @recovery_token::text, recovery_sent_at = NOW()
WHERE id = $1
  AND organisation_id = $2
RETURNING *;

-- name: UserUpdate :one
UPDATE users
SET first_name = @first_name, last_name = @last_name
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
AND deleted_at is null;

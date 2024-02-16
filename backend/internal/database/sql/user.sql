-- name: UserList :many
SELECT *
FROM users;

-- name: UserById :one
SELECT *
FROM users
WHERE id = $1 AND organisation_id = $2;

-- name: UserById_NORG :one
SELECT *
FROM users
WHERE id = $1;

-- name: UserByEmail :one
SELECT *
FROM users
WHERE email = $1;

-- name: UserFindBySession :one
SELECT *
FROM users
WHERE id = (SELECT user_id FROM sessions WHERE token = $1 AND users.created_at > NOW() - INTERVAL '30 days');

-- name: UsersByIds :many
SELECT *
FROM users
WHERE id = ANY(@ids::text[]);
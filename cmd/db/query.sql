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

-- name: InviteUserByEmail :one
INSERT INTO users (organisation_id, role, email)
VALUES ($1, $2, @email::text)
RETURNING *;

-- name: ListEntries :many
SELECT *
FROM entries
WHERE organisation_id = $1;

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

-- name: ListTagsFromEntry :many
SELECT tags.*
FROM tags
         LEFT JOIN entry_tags et on tags.id = et.tag_id
WHERE et.entry_id = $1
  AND tags.organisation_id = $2;

-- name: ListFilesFromEntry :many
SELECT files.*
FROM files
         LEFT JOIN entry_files ef on files.id = ef.file_id
WHERE ef.entry_id = $1
  AND files.organisation_id = $2;

-- name: ListEventsFromEntry :many
SELECT events.*
FROM events
         LEFT JOIN entry_events ee on events.id = ee.event_id
WHERE ee.entry_id = $1
  AND events.organisation_id = $2;

-- name: ListUsersFromEntry :many
SELECT users.*
FROM users
         LEFT JOIN entry_users eu on users.id = eu.user_id
WHERE eu.entry_id = $1
  AND users.organisation_id = $2;
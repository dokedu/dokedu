-- name: GetEntry :one
SELECT *
FROM entries
WHERE id = $1
  AND organisation_id = $2;

-- name: ListEntries :many
SELECT *
FROM entries
WHERE entries.organisation_id = $1 AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- name: CreateEntry :one
INSERT INTO entries
(organisation_id,
 date,
 body,
 user_id)
VALUES ($1,
        @date,
        $2,
        $3)
RETURNING *;

-- name: ArchiveEntry :one
UPDATE entries SET deleted_at = now() WHERE id = $1 AND organisation_id = $2 RETURNING *;
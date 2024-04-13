-- name: EventCreate :one
INSERT INTO events (image_file_id, title, body, starts_at, ends_at, organisation_id)
VALUES (@image_file_id, @title::text, @body::text, @starts_at, @ends_at, @organisation_id)
RETURNING *;

-- name: EventFindById :one
SELECT *
FROM events
WHERE id = @id
  AND organisation_id = @organisation_id
  AND deleted_at IS NULL
LIMIT 1;

-- name: EventSoftDelete :one
UPDATE events
SET deleted_at = NOW()
WHERE id = @id
  AND organisation_id = @organisation_id
RETURNING *;

-- name: EventUpdate :one
UPDATE events
SET title         = COALESCE(sqlc.narg('title'), title),
    image_file_id = COALESCE(sqlc.narg('image_file_id'), image_file_id),
    body          = COALESCE(sqlc.narg('body'), body),
    starts_at     = COALESCE(sqlc.narg('starts_at'), starts_at),
    ends_at       = COALESCE(sqlc.narg('ends_at'), ends_at)
WHERE id = @id
  AND organisation_id = @organisation_id
  AND deleted_at IS NULL
RETURNING *;
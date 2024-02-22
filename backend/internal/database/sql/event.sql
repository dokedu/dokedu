-- name: EventById :one
SELECT *
FROM events
WHERE id = @id AND organisation_id = @organisation_id AND deleted_at IS NULL
LIMIT 1;

-- name: CreateEvent :one
INSERT INTO events (image_file_id, organisation_id, title, body, starts_at, ends_at, recurrence)
VALUES (@image_file_id, @organisation_id, @title, @body, @starts_at, @ends_at, @recurrence)
RETURNING *;

-- name: DeleteEvent :one
UPDATE events
SET deleted_at = now()
WHERE id = @id AND organisation_id = @organisation_id
RETURNING *;

-- name: EventList :many
SELECT *
FROM events
WHERE organisation_id = @organisation_id AND deleted_at IS NULL;

-- name: ExportEvents :many
SELECT *
FROM export_events($1, $2, $3, $4);


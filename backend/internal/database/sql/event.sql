-- name: EventById :one
SELECT *
FROM events
WHERE id = @id AND organisation_id = @organisation_id AND deleted_at IS NULL
LIMIT 1;

-- name: CreateEvent :one
INSERT INTO events (image_file_id, organisation_id, title, body, starts_at, ends_at, recurrence)
VALUES (@image_file_id, @organisation_id, @title, @body, @starts_at, @ends_at, @recurrence)
RETURNING *;
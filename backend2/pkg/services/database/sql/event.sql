-- name: EventCreate :one
INSERT INTO events (image_file_id, title, body, starts_at, ends_at, organisation_id)
VALUES (@image_file_id, @title::text, @body::text, @starts_at, @ends_at, @organisation_id)
RETURNING *;

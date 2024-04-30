-- name: BucketForEntryFiles :one
SELECT *
FROM buckets
WHERE name = 'entries'
  AND shared = FALSE
  AND user_id IS NULL
  AND organisation_id = @organisation_id
LIMIT 1;

-- name: BucketForEntryFilesCreate :one
INSERT INTO buckets (name, shared, organisation_id)
VALUES ('entries', FALSE, @organisation_id)
RETURNING *;
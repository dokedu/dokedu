-- name: FileListByBucketID :many
SELECT *
FROM files
WHERE bucket_id = @bucket_id
AND organisation_id = @organisation_id
AND deleted_at IS NULL;

-- name: BucketByID :one
SELECT *
FROM buckets
WHERE id = @id
AND organisation_id = @organisation_id;

-- name: BucketByName :one
SELECT *
FROM buckets
WHERE name = @name
AND organisation_id = @organisation_id;

-- name: BucketCreate :one
INSERT INTO buckets (name, organisation_id) VALUES (@name, @organisation_id) RETURNING *;

-- name: FileByID :one
SELECT *
FROM files
WHERE id = @id
AND organisation_id = @organisation_id;

-- name: FileCreate :one
INSERT INTO files (name, file_type, mime_type, size, bucket_id, parent_id, organisation_id)
VALUES (@name, @file_type, @mime_type, @size, @bucket_id, @parent_id, @organisation_id)
RETURNING *;

-- name: FileFindByParentID :many
SELECT *
FROM files
WHERE id = @id
AND organisation_id = @organisation_id
AND parent_id = @parent_id
AND deleted_at IS NULL;

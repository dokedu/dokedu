-- name: FileListByBucketId :many
SELECT *
FROM files
WHERE bucket_id = @bucket_id AND organisation_id = @organisation_id AND deleted_at IS NULL
ORDER BY name DESC;

-- name: FileById :one
SELECT *
FROM files
WHERE id = @id AND organisation_id = @organisation_id AND deleted_at IS NULL
LIMIT 1;

-- TODO: fix this query and make it work properly
-- name: FileParentList :many
WITH RECURSIVE file_parents AS (
    SELECT *, 1 AS level
    FROM files
    WHERE files.id = @id AND files.organisation_id = @organisation_id AND deleted_at IS NULL

    UNION ALL

    SELECT f.*, fp.level + 1
    FROM files f
             JOIN file_parents fp ON f.id = fp.parent_id
    WHERE f.organisation_id = @organisation_id AND deleted_at IS NULL
)
SELECT file_parents.*
FROM file_parents
ORDER BY level DESC;

-- name: FileListByParentId :many
SELECT *
FROM files
WHERE parent_id = @parent_id AND organisation_id = @organisation_id AND deleted_at IS NULL
ORDER BY name;

-- name: CreateFile :one
INSERT INTO files (name, mime_type, file_type, bucket_id, parent_id, organisation_id)
VALUES (@name, @mime_type, @file_type, @bucket_id, @parent_id, @organisation_id)
RETURNING *;

-- name: UpdateFileName :one
UPDATE files
SET name = @name
WHERE id = @id AND organisation_id = @organisation_id
RETURNING *;

-- name: UpdateFileParentId :one
UPDATE files
SET parent_id = @parent_id
WHERE id = @id AND organisation_id = @organisation_id
RETURNING *;

-- name: DeleteFile :one
UPDATE files
SET deleted_at = now()
WHERE id = @id AND organisation_id = @organisation_id
RETURNING *;

-- name: FileListByEntryFileByEntryId :many
SELECT files.*
FROM files
         JOIN public.entry_files eu ON files.id = eu.file_id
         JOIN public.entries e ON eu.entry_id = e.id
WHERE eu.deleted_at IS NULL AND e.id = @entry_id
  AND files.organisation_id = @organisation_id AND files.deleted_at IS NULL
ORDER BY files.name;
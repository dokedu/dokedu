-- name: BucketById :one
SELECT *
FROM buckets
WHERE id = @id AND organisation_id = @organisation_id AND deleted_at IS NULL
LIMIT 1;

-- name: BucketByUserID :one
SELECT *
FROM buckets
WHERE user_id = @user_id AND organisation_id = @organisation_id AND deleted_at IS NULL AND shared = false  AND deleted_at IS NULL
LIMIT 1;

-- name: CreateBucket :one
INSERT INTO buckets (name, shared, organisation_id, user_id)
VALUES (@name, @shared, @organisation_id, @user_id)
RETURNING *;

-- name: CreateBucketWithoutUser :one
INSERT INTO buckets (name, shared, organisation_id)
VALUES (@name, @shared, @organisation_id)
RETURNING *;

-- name: UpdateBucketName :one
UPDATE buckets
SET name = @name
WHERE id = @id AND organisation_id = @organisation_id
RETURNING *;

-- name: DeleteBucket :one
UPDATE buckets
SET deleted_at = now()
WHERE id = @id AND organisation_id = @organisation_id
RETURNING *;

-- name: InternalBucketByName :one
SELECT *
FROM buckets
WHERE name = @name AND organisation_id = @organisation_id AND user_id IS NULL AND deleted_at IS NULL
LIMIT 1;

-- name: CreateInternalBucket :one
INSERT INTO buckets (name, shared, organisation_id)
VALUES (@name, @shared, @organisation_id)
RETURNING *;

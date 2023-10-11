-- name: GetEntryFiles :many
SELECT *
FROM entry_files
WHERE organisation_id = $1
  AND entry_id = $2;

-- name: CreateEntryFile :one
INSERT INTO entry_files (organisation_id,
                         entry_id,
                         file_id,
                         created_at)
VALUES ($1,
        $2,
        $3,
        now()) RETURNING *;
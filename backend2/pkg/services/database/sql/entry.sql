-- name: EntryFindById :one
SELECT *
FROM entries
WHERE id = @id
  AND organisation_id = @organisation_id
  AND deleted_at IS NULL
LIMIT 1;

-- name: EntryCreate :one
INSERT INTO entries (date, body, user_id, organisation_id)
VALUES (@date, @body, @user_id, @organisation_id)
RETURNING *;
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

-- name: EntryEventCountByUserID :one
SELECT COUNT(*)
FROM entry_events ee
         JOIN public.entry_users eu ON ee.entry_id = eu.entry_id
WHERE eu.user_id = @user_id
  AND ee.organisation_id = @organisation_id
  AND ee.deleted_at IS NULL
  AND eu.deleted_at IS NULL;

-- name: EntrySoftDelete :one
UPDATE entries
SET deleted_at = now()
WHERE id = @id
  AND organisation_id = @organisation_id
RETURNING *;
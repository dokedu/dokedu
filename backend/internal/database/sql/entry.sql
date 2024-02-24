-- name: CreateEntry :one
INSERT INTO entries (date, body, user_id, organisation_id)
VALUES (now(), @body, @user_id, @organisation_id)
RETURNING *;

-- name: DeleteEntry :one
UPDATE entries
SET deleted_at = now()
WHERE id = @id AND organisation_id = @organisation_id
RETURNING *;

-- name: EntryById :one
SELECT * FROM entries
WHERE id = @id AND organisation_id = @organisation_id AND deleted_at IS NULL;

-- name: EntryCountByUserId :one
SELECT COUNT(*) FROM entries
WHERE user_id = @user_id AND organisation_id = @organisation_id AND deleted_at IS NULL;

-- name: EntryList :many
SELECT * FROM entries
WHERE organisation_id = @organisation_id AND deleted_at IS NULL
ORDER BY date DESC;

-- name: REPORT_EntryList :many
SELECT entries.*
FROM entries
JOIN public.entry_users eu ON entries.id = eu.entry_id AND eu.user_id = @user_id
WHERE date >= @start_date AND date <= @end_date AND entries.organisation_id = @organisation_id AND deleted_at IS NULL
ORDER BY date DESC;
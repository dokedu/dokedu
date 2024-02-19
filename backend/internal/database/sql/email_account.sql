-- name: UpdateEmailAccountPassword :one
UPDATE email_accounts
SET secret = @password
WHERE id = @id AND organisation_id = @organisation_id
RETURNING *;
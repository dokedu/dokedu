-- name: GLOBAL_ReportFindByID :one
SELECT * FROM reports WHERE id = @id;

-- name: GLOBAL_ReportsFindUnprocessed :many
SELECT * FROM reports WHERE status = 'pending' OR (status = 'processing' AND created_at <= now() - '5 minutes'::INTERVAL);

-- name: GLOBAL_ReportsUpdateStatus :one
UPDATE reports SET status = @status WHERE id = @id RETURNING *;

-- name: ReportTemplateFindByName :one
SELECT * FROM report_templates WHERE organisation_id = @organisation_id AND name = @name;

-- name: ReportUpdateStatusDone :one
UPDATE reports SET status = 'done', file_id = @file_id::text WHERE id = @id AND organisation_id = @organisation_id RETURNING *;

-- name: ReportCreate :one
INSERT INTO reports (status, format, kind, "from", "to", meta, filter_tags, file_id, user_id, student_user_id, organisation_id)
VALUES ('pending', @format, @kind, @_from, @_to, @meta, @filter_tags, @file_id, @user_id, @student_user_id, @organisation_id)
RETURNING *;

-- name: ReportFindByID :one
SELECT * FROM reports
WHERE id = @id AND organisation_id = @organisation_id AND deleted_at IS NOT NULL;

-- name: ReportsAllPaginated :many
SELECT * FROM reports
WHERE organisation_id = @organisation_id AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT @_limit OFFSET @_offset;

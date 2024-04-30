-- name: GLOBAL_ReportFindByID :one
SELECT * FROM reports WHERE id = @id;

-- name: GLOBAL_ReportsFindUnprocessed :many
SELECT * FROM reports WHERE status = 'pending' OR (status = 'processing' AND created_at <= now() - '5 minutes'::INTERVAL);

-- name: GLOBAL_ReportsUpdateStatus :one
UPDATE reports SET status = @status WHERE id = @id RETURNING *;

-- name: ReportTemplateFindByName :one
SELECT * FROM report_templates WHERE organisation_id = @organisation_id AND name = @name;

-- name: ReportUpdateStatusDone :one
UPDATE reports SET status = 'done' AND file_id = @file_id::text WHERE id = @id AND organisation_id = @organisation_id RETURNING *;
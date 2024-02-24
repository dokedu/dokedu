-- name: ReportTemplateByName :one
SELECT *
FROM report_templates
WHERE name = @name AND organisation_id = @organisation_id;
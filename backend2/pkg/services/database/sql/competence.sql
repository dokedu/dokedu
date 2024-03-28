-- name: CompetenceFindById :one
SELECT *
FROM competences
WHERE id = $1
  AND organisation_id = $2
  AND deleted_at IS NULL;
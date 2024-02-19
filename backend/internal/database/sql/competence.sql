-- name: CompetenceParentsList :many
SELECT *
FROM get_competence_parents($1::text[]);

-- name: CompetenceTree :one
SELECT *
FROM get_competence_tree($1::text[]);

-- name: CompetenceList :many
SELECT *
FROM competences
WHERE organisation_id = $1
  AND deleted_at IS NULL;

-- name: CompetenceById :one
SELECT *
FROM competences
WHERE id = $1
  AND organisation_id = $2
  AND deleted_at IS NULL;
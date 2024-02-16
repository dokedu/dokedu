-- name: CompetenceParentsList :many
SELECT * FROM get_competence_parents($1::text[]);

-- name: CompetenceList :many
SELECT * FROM competences WHERE organisation_id = $1;
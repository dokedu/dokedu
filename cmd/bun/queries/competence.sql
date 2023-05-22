-- name: CompetenceParents :many
WITH RECURSIVE parents AS (
    SELECT *
    FROM competences
    WHERE competences.id = $1 AND competences.organisation_id = $2

    UNION ALL

    SELECT c.*
    FROM competences c
             INNER JOIN parents p ON p.competence_id = c.id
)
SELECT * FROM parents WHERE competence_id IS NOT NULL;

-- name: GetCompetence :one
SELECT *
FROM competences
WHERE id = $1 AND organisation_id = $2;

-- name: ListCompetences :many
SELECT *
FROM competences
WHERE organisation_id = $1 AND competence_type = ANY(@competence_types::competence_type[]) and competence_id = ANY(@parent_ids::text[])
LIMIT $2 OFFSET $3;

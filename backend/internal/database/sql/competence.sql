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

-- name: CompetenceChildrenCount :one
WITH RECURSIVE child_competences AS
                   (SELECT id, competence_type
                    FROM competences
                    WHERE competences.competence_id = @_competence_id
                      AND competences.organisation_id = @organisation_id
                    UNION ALL
                    SELECT c.id, c.competence_type
                    FROM competences c
                             INNER JOIN child_competences cc ON c.competence_id = cc.id
                    WHERE organisation_id = @organisation_id)
SELECT COUNT(id)
FROM child_competences
WHERE competence_type = 'competence';

-- name: UserCompetenceCount :one
WITH RECURSIVE child_competences AS (SELECT id
                                     FROM competences
                                     WHERE competences.id = @_competence_id -- Assuming this is the correct column for the initial filter
                                     UNION ALL
                                     SELECT c.id
                                     FROM competences c
                                              INNER JOIN child_competences cc ON c.competence_id = cc.id
                                     WHERE c.competence_type = 'competence')
SELECT COUNT(DISTINCT uc.competence_id)
FROM user_competences uc
WHERE uc.organisation_id = @organisation_id
  AND uc.user_id = @user_id
  AND uc.competence_id IN (SELECT id FROM child_competences);

-- name: UpdateCompetenceColor :one
UPDATE competences
SET color = @color
WHERE id = @competence_id
  AND organisation_id = @organisation_id
  AND deleted_at IS NULL
RETURNING *;

-- name: CompetenceListByIds :many
SELECT *
FROM competences
WHERE id = ANY (@ids::text[])
  AND organisation_id = @organisation_id
  AND deleted_at IS NULL;

-- name: UpdateCompetenceSortOrder :one
UPDATE competences
SET sort_order = @sort_order
WHERE id = @competence_id
  AND organisation_id = @organisation_id
  AND deleted_at IS NULL
RETURNING *;

-- name: CreateCompetence :one
INSERT INTO competences (name, competence_id, competence_type, organisation_id, grades, color, created_by)
VALUES (@name, @competence_id, @competence_type, @organisation_id, @grades, @color, @created_by)
RETURNING *;

-- name: CompetenceByIdWithDeleted :one
SELECT *
FROM competences
WHERE id = $1
  AND organisation_id = $2
LIMIT 1;

-- name: GLOBAL_CompetenceByIdWithDeleted :one
SELECT *
FROM competences
WHERE id = $1
LIMIT 1;

-- name: CreateSubjectCompetence :one
INSERT INTO competences (name, competence_id, competence_type, organisation_id, grades, created_by)
VALUES (@name, @competence_id, @competence_type, @organisation_id, @grades, @created_by)
RETURNING *;

-- name: CompetenceListOrderedBySortOrderAndName :many
SELECT *
FROM competences
WHERE organisation_id = $1
  AND deleted_at IS NULL
ORDER BY sort_order, name;

-- name: CompetenceListOrderedBySortOrder :many
SELECT *
FROM competences
WHERE organisation_id = $1
  AND deleted_at IS NULL
ORDER BY sort_order;
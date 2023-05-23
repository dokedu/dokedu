-- name: GetEntryUserCompetences :many
SELECT *
FROM entry_user_competences
WHERE organisation_id = $1 AND entry_id = $2;

-- name: CreateEntryUserCompetence :one
INSERT INTO entry_user_competences (organisation_id, entry_id, user_id, competence_id, level, created_at)
VALUES ($1, $2, $3, $4, $5, now())
RETURNING *;
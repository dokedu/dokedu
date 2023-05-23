-- name: GetEntryUserCompetences :many
SELECT *
FROM entry_user_competences
WHERE organisation_id = $1 AND entry_id = $2;
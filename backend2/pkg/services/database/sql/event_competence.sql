-- name: EventCompetenceCreate :one
INSERT INTO event_competences (event_id, competence_id, organisation_id)
VALUES (@event_id, @competence_id, @organisation_id)
RETURNING *;
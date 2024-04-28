-- name: EventCompetenceCreate :one
INSERT INTO event_competences (event_id, competence_id, organisation_id)
VALUES (@event_id, @competence_id, @organisation_id)
RETURNING *;

-- name: EventCompetenceToggle :one
INSERT INTO event_competences (event_id, competence_id, organisation_id)
VALUES (@event_id, @competence_id, @organisation_id)
ON CONFLICT (event_id, competence_id, organisation_id) DO UPDATE SET deleted_at = NULL
RETURNING *;
-- name: EventCompetenceListByEventId :many
SELECT competences.*
FROM competences
JOIN event_competences ec ON competences.id = ec.competence_id AND ec.deleted_at IS NULL
WHERE ec.event_id = @event_id
AND competences.organisation_id = @organisation_id
AND competences.deleted_at IS NULL;

-- name: CreateEventCompetence :one
INSERT INTO event_competences (event_id, competence_id, organisation_id)
VALUES (@event_id, @competence_id, @organisation_id)
ON CONFLICT (event_id, competence_id, organisation_id) DO UPDATE SET deleted_at = (SELECT CASE WHEN deleted_at IS NULL THEN NOW() END)
RETURNING *;

-- name: EventCompetenceList :many
SELECT *
FROM event_competences
WHERE organisation_id = @organisation_id AND deleted_at IS NULL;
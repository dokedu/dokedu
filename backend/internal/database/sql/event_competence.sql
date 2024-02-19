-- name: EventCompetenceListByEventId :many
SELECT competences.*
FROM competences
JOIN event_competences ec ON competences.id = ec.competence_id AND ec.deleted_at IS NULL
WHERE ec.event_id = @event_id
AND competences.organisation_id = @organisation_id
AND competences.deleted_at IS NULL;

-- name: EventListByEntryEventByEntryId :many
SELECT events.*
FROM events
JOIN public.entry_events eu ON events.id = eu.event_id
JOIN public.entries e ON eu.entry_id = e.id
WHERE eu.deleted_at IS NULL AND e.id = @entry_id
AND events.organisation_id = @organisation_id AND events.deleted_at IS NULL
ORDER BY events.title;

-- name: CreateEntryEvent :one
INSERT INTO entry_events (entry_id, event_id, organisation_id)
VALUES (@entry_id, @event_id, @organisation_id)
ON CONFLICT (entry_id, event_id) DO UPDATE SET deleted_at = NULL
RETURNING *;

-- name: DeleteEntryEvent :one
UPDATE entry_events
SET deleted_at = now()
WHERE entry_id = @entry_id AND event_id = @event_id AND organisation_id = @organisation_id
RETURNING *;
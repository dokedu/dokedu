-- name: EventsFindByEntryEventEntryID :many
SELECT events.*
FROM events
         JOIN public.entry_events eu ON events.id = eu.event_id
         JOIN public.entries e ON eu.entry_id = e.id AND e.id = @entry_id
WHERE events.organisation_id = @organisation_id
  AND eu.deleted_at IS NULL
  AND e.deleted_at IS NULL
  AND events.deleted_at IS NULL;

-- name: EntryEventCreate :one
INSERT INTO entry_events (entry_id, event_id, organisation_id)
VALUES (@entry_id, @event_id, @organisation_id)
ON CONFLICT (entry_id, event_id) DO UPDATE SET deleted_at = NULL
RETURNING *;

-- name: EntryEventSoftDelete :one
UPDATE entry_events
SET deleted_at = NOW()
WHERE entry_id = @entry_id
  AND event_id = @event_id
  AND organisation_id = @organisation_id
RETURNING *;
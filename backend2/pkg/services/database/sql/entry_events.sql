-- name: EventsFindByEntryEventEntryID :many
SELECT events.*
FROM events
         JOIN public.entry_events eu ON events.id = eu.event_id
         JOIN public.entries e ON eu.entry_id = e.id AND e.id = @entry_id
WHERE events.organisation_id = @organisation_id
  AND eu.deleted_at IS NULL
  AND e.deleted_at IS NULL
  AND events.deleted_at IS NULL;
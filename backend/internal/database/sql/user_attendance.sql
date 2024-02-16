-- name: UpdateUserAttendanceForUser :one
INSERT INTO user_attendances (user_id, date, state, created_by, organisation_id)
VALUES (@user_id, @date, @state, @created_by, @organisation_id)
ON CONFLICT (user_id, date)
    DO UPDATE SET state = @state
RETURNING *;

-- name: UpdateUserAttendanceForDate :many
INSERT INTO user_attendances (user_id, date, state, created_by, organisation_id)
VALUES ((SELECT id FROM users WHERE users.organisation_id = @organisation_id), @date, @state, @created_by,
        @organisation_id)
ON CONFLICT (user_id, date)
    DO UPDATE SET state = EXCLUDED.state
RETURNING *;

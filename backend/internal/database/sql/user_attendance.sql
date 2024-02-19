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

-- name: UserAttendanceListByDate :many
SELECT user_attendances.*
FROM user_attendances
JOIN users u ON user_attendances.user_id = u.id
WHERE date = $1
  AND user_attendances.organisation_id = $2 AND deleted_at IS NULL
ORDER BY u.first_name ASC, u.last_name ASC;
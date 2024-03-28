-- name: UserStudentCreate :one
INSERT INTO user_students (user_id, organisation_id, left_at, grade, birthday, joined_at, emoji)
VALUES (@user_id, @organisation_id, @left_at, @grade, @birthday, @joined_at, @emoji)
RETURNING *;

-- name: UserStudentFindPaginated :many
SELECT *
FROM user_students
WHERE organisation_id = @organisation_id AND deleted_at is null
LIMIT @_limit OFFSET @_offset;

-- name: UserStudentFind :many
SELECT *
FROM user_students
WHERE organisation_id = @organisation_id AND deleted_at is null;

-- name: UserStudentCount :one
SELECT COUNT(*)
FROM user_students
WHERE organisation_id = @organisation_id AND deleted_at is null;

-- name: UserStudentFindByUserID :one
SELECT *
FROM user_students
WHERE id = @id
  AND organisation_id = @organisation_id
  AND deleted_at is null
LIMIT 1;

-- name: UserStudentUpdate :one
UPDATE user_students
SET grade = @grade, birthday = @birthday, left_at = @left_at, joined_at = @joined_at, emoji = @emoji, missed_hours = @missed_hours, missed_hours_excused = @missed_hours_excused
WHERE user_id = @user_id
  AND organisation_id = @organisation_id
RETURNING *;

-- name: UserStudentSoftDeleteByUserID :one
UPDATE user_students
SET deleted_at = now()
WHERE user_id = @user_id
  AND organisation_id = @organisation_id
RETURNING *;
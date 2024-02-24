-- name: CreateUserStudent :one
INSERT INTO user_students (user_id, organisation_id, left_at, grade, birthday, joined_at, emoji)
VALUES (@user_id, @organisation_id, @left_at, @grade, @birthday, @joined_at, @emoji)
RETURNING *;

-- name: UserStudentList :many
SELECT *
FROM user_students
WHERE organisation_id = @organisation_id
LIMIT @_limit OFFSET @_offset;

-- name: UserStudentListAll :many
SELECT *
FROM user_students
WHERE organisation_id = @organisation_id;

-- name: UserStudentCount :one
SELECT COUNT(*)
FROM user_students
WHERE organisation_id = @organisation_id;

-- name: UserStudentByUserId :one
SELECT *
FROM user_students
WHERE id = @id
  AND organisation_id = @organisation_id
LIMIT 1;

-- name: UpdateUserStudent :one
UPDATE user_students
SET grade = @grade, birthday = @birthday, left_at = @left_at, joined_at = @joined_at, emoji = @emoji, missed_hours = @missed_hours, missed_hours_excused = @missed_hours_excused
WHERE user_id = @user_id
  AND organisation_id = @organisation_id
RETURNING *;

-- name: DeleteUserStudent :one
UPDATE user_students
SET deleted_at = now()
WHERE user_id = @user_id
  AND organisation_id = @organisation_id
RETURNING *;
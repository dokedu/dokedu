-- name: UserStudentGradesAllPaginated :many
select * from user_student_grades
where organisation_id = @organisation_id::text and deleted_at is null
limit @_limit offset @_offset;

-- name: UserStudentGradeFindByID :one
select * from user_student_grades
where id = @id and organisation_id = @organisation_id::text and deleted_at is null;
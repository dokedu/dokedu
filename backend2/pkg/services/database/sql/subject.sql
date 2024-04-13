-- name: SubjectCreate :one
insert into subjects (name, organisation_id)
values (@name, @organisation_id::text)
returning *;

-- name: SubjectsFindByID :many
select *
from subjects
where id = any(@ids::text[])
  and organisation_id = @organisation_id::text
  and deleted_at is null;

-- name: SubjectUpdate :one
update subjects
set name = @name
where id = @id
  and organisation_id = @organisation_id::text
returning *;

-- name: SubjectSoftDelete :one
update subjects
set deleted_at = now()
where id = @id
  and organisation_id = @organisation_id::text
returning *;

-- name: SubjectsAllPaginated :many
select *
from subjects
where organisation_id = @organisation_id::text
  and deleted_at is null
order by name
limit @_limit offset @_offset;

-- name: SubjectFindByID :one
select *
from subjects
where id = @id
  and organisation_id = @organisation_id::text
  and deleted_at is null;


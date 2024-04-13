-- name: SchoolYearCreate :one
insert into school_years (year, organisation_id)
values (@year, @organisation_id::text)
returning *;

-- name: SchoolYearUpdate :one
update school_years
set year = @year
where id = @id and organisation_id = @organisation_id::text
returning *;

-- name: SchoolYearsFindByID :many
select *
from school_years
where id = any(@ids::text[]) and organisation_id = @organisation_id::text and deleted_at is null;

-- name: SchoolYearSoftDelete :one
update school_years
set deleted_at = now()
where id = @id and organisation_id = @organisation_id::text
returning *;

-- name: SchoolYearAllPaginated :many
select *
from school_years
where organisation_id = @organisation_id::text
and deleted_at is null
order by year desc
limit @_limit
offset @_offset;

-- name: SchoolYearFindByID :one
select *
from school_years
where id = @id and organisation_id = @organisation_id::text
and deleted_at is null;

SET statement_timeout = 0;

create or replace function get_competence_tree(_competence_id text) returns table(id text, name text, competence_type competence_type, grades int[], competence_id text, created_at timestamptz) language plpgsql set search_path = 'public' security definer as $$
declare
    _base_competence_org_id text;
begin
    return query with recursive tree(id, name, competence_type, grades, competence_id, created_at) as (
        select n.id, n.name, n.competence_type, n.grades, n.competence_id, n.created_at
        from competences n
        where n.id = _competence_id
        union all
        select n.id, n.name, n.competence_type, n.grades, n.competence_id, n.created_at
        from competences n
                 join tree t on (n.id = t.competence_id)
    )
                 select *
                 from tree;
end
$$;

-- create a sql query that fetches recursively all the competences that are parent of the given competence
create or replace function get_competence_parents(_competence_id text) returns table(id text, name text, competence_type competence_type, grades int[], competence_id text, created_at timestamptz) language plpgsql set search_path = 'public' security definer as $$
declare
    _base_competence_org_id text;
begin
    return query with recursive tree(id, name, competence_type, grades, competence_id, created_at) as (
        select n.id, n.name, n.competence_type, n.grades, n.competence_id, n.created_at
        from competences n
        where n.id = _competence_id
        union all
        select n.id, n.name, n.competence_type, n.grades, n.competence_id, n.created_at
        from competences n
                 join tree t on (n.competence_id = t.id)
    )
                 select *
                 from tree;
end
$$;
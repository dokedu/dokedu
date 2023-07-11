SET statement_timeout = 0;

CREATE OR REPLACE FUNCTION get_competences_parents(variadic _competence_ids text[])
    RETURNS TABLE
            (
                competence_id text,
                parents       jsonb
            )
    LANGUAGE plpgsql
AS
$$
DECLARE
    _competence_id text;
BEGIN
    FOREACH _competence_id IN ARRAY _competence_ids
        LOOP
            RETURN
                QUERY
                WITH
                    RECURSIVE tree(
                                   id, name, competence_id, competence_type, organisation_id, grades, color,
                                   curriculum_id, created_at, deleted_at, sort_order, depth)
                                  AS (
                        SELECT n.id,
                               n.name,
                               n.competence_id,
                               n.competence_type,
                               n.organisation_id,
                               n.grades,
                               n.color,
                               n.curriculum_id,
                               n.created_at,
                               n.deleted_at,
                               n.sort_order,
                               1
                        FROM competences n
                        WHERE n.id = _competence_id
                        UNION ALL
                        SELECT n.id,
                               n.name,
                               n.competence_id,
                               n.competence_type,
                               n.organisation_id,
                               n.grades,
                               n.color,
                               n.curriculum_id,
                               n.created_at,
                               n.deleted_at,
                               n.sort_order,
                               + 1
                        FROM competences n
                                 JOIN tree t ON n.id = t.competence_id)
                SELECT _competence_id,
                       jsonb_agg(
                               jsonb_build_object(
                                       'id', tree.id,
                                       'name', tree.name,
                                       'competence_id', COALESCE(tree.competence_id, ''),
                                       'competence_type', tree.competence_type,
                                       'organisation_id', tree.organisation_id,
                                       'grades', tree.grades,
                                       'color', COALESCE(tree.color, ''),
                                       'curriculum_id', COALESCE(tree.curriculum_id, ''),
                                       'created_at', tree.created_at,
                                       'deleted_at', tree.deleted_at,
                                       'sort_order', tree.sort_order
                                   ) ORDER BY tree.depth DESC)
                FROM tree
                WHERE tree.id != _competence_id;
        END LOOP;
END;
$$;
SET statement_timeout = 0;

DROP FUNCTION IF EXISTS get_competence_tree_reverse(text);

CREATE OR REPLACE FUNCTION get_competence_tree_reverse(_competence_id text)
    RETURNS TABLE(id text, name text, competence_type competence_type, color text, grades integer[], competence_id text, created_at timestamp with time zone)
    SECURITY DEFINER
    SET search_path = public
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        WITH RECURSIVE tree(id, name, competence_type, color, grades, competence_id, created_at, depth) AS (
            SELECT n.id, n.name, n.competence_type, n.color, n.grades, n.competence_id, n.created_at, 1
            FROM competences n
            WHERE n.id = _competence_id
            UNION ALL
            SELECT n.id, n.name, n.competence_type, n.color, n.grades, n.competence_id, n.created_at, t.depth + 1
            FROM competences n
                     JOIN tree t ON n.id = t.competence_id
        )
        SELECT tree.id, tree.name, tree.competence_type, tree.color, tree.grades, tree.competence_id, tree.created_at
        FROM tree
        WHERE tree.id != _competence_id
        ORDER BY tree.depth DESC; -- Reverse the order by using "DESC"
END
$$;
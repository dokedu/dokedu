SET statement_timeout = 0;

CREATE OR REPLACE FUNCTION export_events(_organisation_id text, _from date, _to date, _show_archived bool)
    RETURNS table
            (
                id        text,
                title     text,
                body      text,
                starts_at timestamptz,
                ends_at   timestamptz,
                subjects  jsonb
            )
    SECURITY DEFINER
    SET search_path = "public"
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        -- get all competences which are linked to events. this can happen from two ways.
        -- they are de-duplicated via distinct union & selection.
        WITH _competences AS (
            -- way 1: directly linked via event event_competences>competences
            SELECT DISTINCT ON (e.id, c.id) e.id AS event_id,
                                            c.id,
                                            c.name,
                                            c.competence_id,
                                            c.grades
            FROM events e
                     INNER JOIN event_competences ec ON e.id = ec.event_id
                     INNER JOIN competences c ON ec.competence_id = c.id
            WHERE e.organisation_id = _organisation_id
              AND e.starts_at >= _from
              AND e.ends_at <= _to
              AND (_show_archived OR e.deleted_at IS NULL)
              AND c.deleted_at IS NULL
              -- union both ways.
            UNION
            DISTINCT
            -- way 2: indirect via entry_events>events>eac>competences
            SELECT DISTINCT ON (e.id, c.id) e.id, c.id, c.name, c.competence_id, c.grades
            FROM events e
                     INNER JOIN entry_events ee ON e.id = ee.event_id
                     INNER JOIN entries en ON ee.entry_id = en.id
                     INNER JOIN user_competences eac ON en.id = eac.entry_id
                     INNER JOIN competences c ON eac.competence_id = c.id
            WHERE e.organisation_id = _organisation_id
              AND e.starts_at >= _from
              AND e.ends_at <= _to
              AND (_show_archived OR e.deleted_at IS NULL)
              AND en.deleted_at IS NULL
              AND eac.deleted_at IS NULL
              AND c.deleted_at IS NULL),

             -- next, for each found competence, fetch the whole competence tree
             _competence_trees AS (SELECT c.event_id,
                                          c.id,
                                          c.name,
                                          c.competence_id,
                                          c.grades,
                                          JSONB_AGG(b) AS competence_tree
                                   FROM _competences c,
                                        -- use lateral sub query (to get all rows from the function)
                                        LATERAL (SELECT * FROM get_competence_tree(c.id)) b
                                        -- since the lateral sub query produces multiple rows, we need to group by & use json aggregation
                                   GROUP BY c.event_id, c.id, c.name, c.competence_id, c.grades),

             -- for each found competence, fetch the subject (last entry in competence tree).
             -- we then group them by subject, and store the competences using the jsonb_agg
             _subjects AS (SELECT ct.event_id,
                                  jsonb_array_element(ct.competence_tree,
                                                      JSONB_ARRAY_LENGTH(ct.competence_tree) - 1) ->
                                  'id'          AS subject_id,
                                  jsonb_array_element(ct.competence_tree,
                                                      JSONB_ARRAY_LENGTH(ct.competence_tree) - 1) ->
                                  'name'        AS subject_name,
                                  JSONB_AGG(ct) AS competences
                           FROM _competence_trees ct
                           GROUP BY ct.event_id, subject_id, subject_name)
             -- finally, using all of this info, we can run the main query. select all events again, and group by event so
             -- all of their found subjects land in a final jsonb_agg.
        SELECT e.id,
               e.title,
               e.body,
               e.starts_at,
               e.ends_at,
               JSONB_AGG(s) FILTER ( WHERE s IS NOT NULL ) AS subjects
        FROM events e
                 LEFT JOIN _subjects s ON e.id = s.event_id
        WHERE e.organisation_id = _organisation_id
          AND e.starts_at >= _from
          AND e.ends_at <= _to
          AND (_show_archived OR e.deleted_at IS NULL)
        GROUP BY e.id, e.title
        ORDER BY e.ends_at;
END;
$$;

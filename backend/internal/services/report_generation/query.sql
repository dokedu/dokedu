SELECT entry.id                                         as "entry__id",
       entry.date                                       as "entry__date",
       entry.created_at                                 as "entry__created_at",
       entry.body                                       as "entry__body",
       "user".id                                        as "user__id",
       "user".first_name                                as "user__first_name",
       "user".last_name                                 as "user__last_name",
       "user".first_name || ' ' || "user".last_name     as "user__full_name",
       uc.id                                            as "user_competences__id",
       c.name                                           as "user_competence__name",
       uc.level                                         as "user_competence__level",
       CASE WHEN uc.level >= 1 THEN true ELSE false END as "user_competence__atleast_level_1",
       CASE WHEN uc.level >= 2 THEN true ELSE false END as "user_competence__atleast_level_2",
       CASE WHEN uc.level >= 3 THEN true ELSE false END as "user_competence__atleast_level_3",
       c.competence_type                                as "user_competence__competence_type",
       c.grades                                         as "user_competence__grades",
       (SELECT array_agg(name)
        FROM get_competence_tree_reverse(c.id))
                                                        as "user_competence.competence_tree"
FROM entries entry
         JOIN users "user" on "user".id = entry.user_id
         JOIN user_competences uc on entry.id = uc.entry_id
         JOIN competences c on uc.competence_id = c.id;





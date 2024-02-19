-- name: UserCompetenceListByEntryId :many
SELECT *
FROM user_competences
WHERE entry_id = @entry_id
  AND organisation_id = @organisation_id
  AND deleted_at IS NULL
ORDER BY competence_id DESC;

-- name: UpsertUserCompetence :one
INSERT INTO user_competences (entry_id, organisation_id, competence_id, level, user_id)
VALUES (@entry_id, @organisation_id, @competence_id, @level, @user_id)
ON CONFLICT (user_id, competence_id, entry_id) DO UPDATE SET deleted_at = NULL AND level = @level
RETURNING *;

-- name: CompetenceListByUserCompetenceByEntry :many
SELECT *
FROM competences
JOIN public.user_competences uc ON competences.id = uc.competence_id
JOIN public.entries e ON uc.entry_id = e.id
WHERE uc.user_id = @user_id
  AND uc.organisation_id = @organisation_id
  AND uc.entry_id = @entry_id
  AND uc.deleted_at IS NULL
  AND e.deleted_at IS NULL
  AND competences.deleted_at IS NULL;

-- name: DeleteUserCompetences :many
UPDATE user_competences
SET deleted_at = now()
WHERE user_id = @user_id
  AND entry_id = @entry_id
  AND organisation_id = @organisation_id
RETURNING *;

-- name: DeleteEntryCompetences :many
UPDATE user_competences
SET deleted_at = now()
WHERE entry_id = @entry_id
  AND organisation_id = @organisation_id
RETURNING *;

-- name: UpdateUserCompetenceLevels :many
UPDATE user_competences
SET level = @level
WHERE competence_id = @competence_id
  AND entry_id = @entry_id
  AND organisation_id = @organisation_id
  AND deleted_at IS NULL
RETURNING *;
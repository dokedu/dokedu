// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: user.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const gLOBAL_UserFindByEmail = `-- name: GLOBAL_UserFindByEmail :one
SELECT id, role, organisation_id, first_name, last_name, email, password, recovery_token, recovery_sent_at, avatar_file_id, created_at, deleted_at, language, sex FROM users WHERE LOWER(email) = LOWER($1::text) and deleted_at is null
`

func (q *Queries) GLOBAL_UserFindByEmail(ctx context.Context, email string) (User, error) {
	row := q.db.QueryRow(ctx, gLOBAL_UserFindByEmail, email)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Role,
		&i.OrganisationID,
		&i.FirstName,
		&i.LastName,
		&i.Email,
		&i.Password,
		&i.RecoveryToken,
		&i.RecoverySentAt,
		&i.AvatarFileID,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.Language,
		&i.Sex,
	)
	return i, err
}

const gLOBAL_UserFindByID = `-- name: GLOBAL_UserFindByID :one
SELECT id, role, organisation_id, first_name, last_name, email, password, recovery_token, recovery_sent_at, avatar_file_id, created_at, deleted_at, language, sex FROM users WHERE id = $1 and deleted_at is null
`

func (q *Queries) GLOBAL_UserFindByID(ctx context.Context, id string) (User, error) {
	row := q.db.QueryRow(ctx, gLOBAL_UserFindByID, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Role,
		&i.OrganisationID,
		&i.FirstName,
		&i.LastName,
		&i.Email,
		&i.Password,
		&i.RecoveryToken,
		&i.RecoverySentAt,
		&i.AvatarFileID,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.Language,
		&i.Sex,
	)
	return i, err
}

const gLOBAL_UserFindByRecoveryToken = `-- name: GLOBAL_UserFindByRecoveryToken :one
SELECT id, role, organisation_id, first_name, last_name, email, password, recovery_token, recovery_sent_at, avatar_file_id, created_at, deleted_at, language, sex FROM users WHERE recovery_token = $1::text AND recovery_sent_at > NOW() - INTERVAL '1 day' and deleted_at is null
`

func (q *Queries) GLOBAL_UserFindByRecoveryToken(ctx context.Context, recoveryToken string) (User, error) {
	row := q.db.QueryRow(ctx, gLOBAL_UserFindByRecoveryToken, recoveryToken)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Role,
		&i.OrganisationID,
		&i.FirstName,
		&i.LastName,
		&i.Email,
		&i.Password,
		&i.RecoveryToken,
		&i.RecoverySentAt,
		&i.AvatarFileID,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.Language,
		&i.Sex,
	)
	return i, err
}

const userCreate = `-- name: UserCreate :one
INSERT INTO users (role, organisation_id, first_name, last_name, email)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, role, organisation_id, first_name, last_name, email, password, recovery_token, recovery_sent_at, avatar_file_id, created_at, deleted_at, language, sex
`

type UserCreateParams struct {
	Role           UserRole    `db:"role"`
	OrganisationID string      `db:"organisation_id"`
	FirstName      string      `db:"first_name"`
	LastName       string      `db:"last_name"`
	Email          pgtype.Text `db:"email"`
}

func (q *Queries) UserCreate(ctx context.Context, arg UserCreateParams) (User, error) {
	row := q.db.QueryRow(ctx, userCreate,
		arg.Role,
		arg.OrganisationID,
		arg.FirstName,
		arg.LastName,
		arg.Email,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Role,
		&i.OrganisationID,
		&i.FirstName,
		&i.LastName,
		&i.Email,
		&i.Password,
		&i.RecoveryToken,
		&i.RecoverySentAt,
		&i.AvatarFileID,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.Language,
		&i.Sex,
	)
	return i, err
}

const userFindByID = `-- name: UserFindByID :one
SELECT id, role, organisation_id, first_name, last_name, email, password, recovery_token, recovery_sent_at, avatar_file_id, created_at, deleted_at, language, sex FROM users WHERE id = $1 and organisation_id = $2 and deleted_at is null
`

type UserFindByIDParams struct {
	ID             string `db:"id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) UserFindByID(ctx context.Context, arg UserFindByIDParams) (User, error) {
	row := q.db.QueryRow(ctx, userFindByID, arg.ID, arg.OrganisationID)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Role,
		&i.OrganisationID,
		&i.FirstName,
		&i.LastName,
		&i.Email,
		&i.Password,
		&i.RecoveryToken,
		&i.RecoverySentAt,
		&i.AvatarFileID,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.Language,
		&i.Sex,
	)
	return i, err
}

const userSoftDelete = `-- name: UserSoftDelete :one
UPDATE users
SET deleted_at = NOW()
WHERE id = $1
  AND organisation_id = $2
RETURNING id, role, organisation_id, first_name, last_name, email, password, recovery_token, recovery_sent_at, avatar_file_id, created_at, deleted_at, language, sex
`

type UserSoftDeleteParams struct {
	ID             string `db:"id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) UserSoftDelete(ctx context.Context, arg UserSoftDeleteParams) (User, error) {
	row := q.db.QueryRow(ctx, userSoftDelete, arg.ID, arg.OrganisationID)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Role,
		&i.OrganisationID,
		&i.FirstName,
		&i.LastName,
		&i.Email,
		&i.Password,
		&i.RecoveryToken,
		&i.RecoverySentAt,
		&i.AvatarFileID,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.Language,
		&i.Sex,
	)
	return i, err
}

const userUpdate = `-- name: UserUpdate :one
UPDATE users
SET first_name = $1, last_name = $2
WHERE id = $3
  AND organisation_id = $4
RETURNING id, role, organisation_id, first_name, last_name, email, password, recovery_token, recovery_sent_at, avatar_file_id, created_at, deleted_at, language, sex
`

type UserUpdateParams struct {
	FirstName      string `db:"first_name"`
	LastName       string `db:"last_name"`
	ID             string `db:"id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) UserUpdate(ctx context.Context, arg UserUpdateParams) (User, error) {
	row := q.db.QueryRow(ctx, userUpdate,
		arg.FirstName,
		arg.LastName,
		arg.ID,
		arg.OrganisationID,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Role,
		&i.OrganisationID,
		&i.FirstName,
		&i.LastName,
		&i.Email,
		&i.Password,
		&i.RecoveryToken,
		&i.RecoverySentAt,
		&i.AvatarFileID,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.Language,
		&i.Sex,
	)
	return i, err
}

const userUpdateLanguage = `-- name: UserUpdateLanguage :one
UPDATE users
SET language = $1::user_lang
WHERE id = $2
  AND organisation_id = $3
RETURNING id, role, organisation_id, first_name, last_name, email, password, recovery_token, recovery_sent_at, avatar_file_id, created_at, deleted_at, language, sex
`

type UserUpdateLanguageParams struct {
	Language       UserLang `db:"language"`
	ID             string   `db:"id"`
	OrganisationID string   `db:"organisation_id"`
}

func (q *Queries) UserUpdateLanguage(ctx context.Context, arg UserUpdateLanguageParams) (User, error) {
	row := q.db.QueryRow(ctx, userUpdateLanguage, arg.Language, arg.ID, arg.OrganisationID)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Role,
		&i.OrganisationID,
		&i.FirstName,
		&i.LastName,
		&i.Email,
		&i.Password,
		&i.RecoveryToken,
		&i.RecoverySentAt,
		&i.AvatarFileID,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.Language,
		&i.Sex,
	)
	return i, err
}

const userUpdatePassword = `-- name: UserUpdatePassword :one
UPDATE users
SET password = $3::text, recovery_token = NULL, recovery_sent_at = NULL
WHERE id = $1
  AND organisation_id = $2
RETURNING id, role, organisation_id, first_name, last_name, email, password, recovery_token, recovery_sent_at, avatar_file_id, created_at, deleted_at, language, sex
`

type UserUpdatePasswordParams struct {
	ID             string `db:"id"`
	OrganisationID string `db:"organisation_id"`
	Password       string `db:"password"`
}

func (q *Queries) UserUpdatePassword(ctx context.Context, arg UserUpdatePasswordParams) (User, error) {
	row := q.db.QueryRow(ctx, userUpdatePassword, arg.ID, arg.OrganisationID, arg.Password)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Role,
		&i.OrganisationID,
		&i.FirstName,
		&i.LastName,
		&i.Email,
		&i.Password,
		&i.RecoveryToken,
		&i.RecoverySentAt,
		&i.AvatarFileID,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.Language,
		&i.Sex,
	)
	return i, err
}

const userUpdateRecoveryToken = `-- name: UserUpdateRecoveryToken :one
UPDATE users
SET recovery_token = $3::text, recovery_sent_at = NOW()
WHERE id = $1
  AND organisation_id = $2
RETURNING id, role, organisation_id, first_name, last_name, email, password, recovery_token, recovery_sent_at, avatar_file_id, created_at, deleted_at, language, sex
`

type UserUpdateRecoveryTokenParams struct {
	ID             string `db:"id"`
	OrganisationID string `db:"organisation_id"`
	RecoveryToken  string `db:"recovery_token"`
}

func (q *Queries) UserUpdateRecoveryToken(ctx context.Context, arg UserUpdateRecoveryTokenParams) (User, error) {
	row := q.db.QueryRow(ctx, userUpdateRecoveryToken, arg.ID, arg.OrganisationID, arg.RecoveryToken)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Role,
		&i.OrganisationID,
		&i.FirstName,
		&i.LastName,
		&i.Email,
		&i.Password,
		&i.RecoveryToken,
		&i.RecoverySentAt,
		&i.AvatarFileID,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.Language,
		&i.Sex,
	)
	return i, err
}

const usersFindByID = `-- name: UsersFindByID :many
SELECT id, role, organisation_id, first_name, last_name, email, password, recovery_token, recovery_sent_at, avatar_file_id, created_at, deleted_at, language, sex
FROM users
WHERE id = ANY ($1::text[])
AND organisation_id = $2
AND deleted_at is null
`

type UsersFindByIDParams struct {
	Ids            []string `db:"ids"`
	OrganisationID string   `db:"organisation_id"`
}

func (q *Queries) UsersFindByID(ctx context.Context, arg UsersFindByIDParams) ([]User, error) {
	rows, err := q.db.Query(ctx, usersFindByID, arg.Ids, arg.OrganisationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []User
	for rows.Next() {
		var i User
		if err := rows.Scan(
			&i.ID,
			&i.Role,
			&i.OrganisationID,
			&i.FirstName,
			&i.LastName,
			&i.Email,
			&i.Password,
			&i.RecoveryToken,
			&i.RecoverySentAt,
			&i.AvatarFileID,
			&i.CreatedAt,
			&i.DeletedAt,
			&i.Language,
			&i.Sex,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

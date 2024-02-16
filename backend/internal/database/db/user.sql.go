// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: user.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const userByEmail = `-- name: UserByEmail :one
SELECT id, role, organisation_id, first_name, last_name, email, password, recovery_token, recovery_sent_at, avatar_file_id, created_at, deleted_at, language, sex
FROM users
WHERE email = $1
`

func (q *Queries) UserByEmail(ctx context.Context, email pgtype.Text) (User, error) {
	row := q.db.QueryRow(ctx, userByEmail, email)
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

const userById = `-- name: UserById :one
SELECT id, role, organisation_id, first_name, last_name, email, password, recovery_token, recovery_sent_at, avatar_file_id, created_at, deleted_at, language, sex
FROM users
WHERE id = $1 AND organisation_id = $2
`

type UserByIdParams struct {
	ID             string `db:"id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) UserById(ctx context.Context, arg UserByIdParams) (User, error) {
	row := q.db.QueryRow(ctx, userById, arg.ID, arg.OrganisationID)
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

const userById_NORG = `-- name: UserById_NORG :one
SELECT id, role, organisation_id, first_name, last_name, email, password, recovery_token, recovery_sent_at, avatar_file_id, created_at, deleted_at, language, sex
FROM users
WHERE id = $1
`

func (q *Queries) UserById_NORG(ctx context.Context, id string) (User, error) {
	row := q.db.QueryRow(ctx, userById_NORG, id)
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

const userFindBySession = `-- name: UserFindBySession :one
SELECT id, role, organisation_id, first_name, last_name, email, password, recovery_token, recovery_sent_at, avatar_file_id, created_at, deleted_at, language, sex
FROM users
WHERE id = (SELECT user_id FROM sessions WHERE token = $1 AND users.created_at > NOW() - INTERVAL '30 days')
`

func (q *Queries) UserFindBySession(ctx context.Context, token string) (User, error) {
	row := q.db.QueryRow(ctx, userFindBySession, token)
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

const userList = `-- name: UserList :many
SELECT id, role, organisation_id, first_name, last_name, email, password, recovery_token, recovery_sent_at, avatar_file_id, created_at, deleted_at, language, sex
FROM users
`

func (q *Queries) UserList(ctx context.Context) ([]User, error) {
	rows, err := q.db.Query(ctx, userList)
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

const usersByIds = `-- name: UsersByIds :many
SELECT id, role, organisation_id, first_name, last_name, email, password, recovery_token, recovery_sent_at, avatar_file_id, created_at, deleted_at, language, sex
FROM users
WHERE id = ANY($1::text[])
`

func (q *Queries) UsersByIds(ctx context.Context, ids []string) ([]User, error) {
	rows, err := q.db.Query(ctx, usersByIds, ids)
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

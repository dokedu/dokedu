// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: user_student.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const createUserStudent = `-- name: CreateUserStudent :one
INSERT INTO user_students (user_id, organisation_id, left_at, grade, birthday, joined_at, emoji)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING id, user_id, organisation_id, left_at, grade, birthday, nationality, comments, joined_at, created_at, deleted_at, birthplace, emoji, missed_hours, missed_hours_excused
`

type CreateUserStudentParams struct {
	UserID         string             `db:"user_id"`
	OrganisationID string             `db:"organisation_id"`
	LeftAt         pgtype.Timestamptz `db:"left_at"`
	Grade          int32              `db:"grade"`
	Birthday       pgtype.Date        `db:"birthday"`
	JoinedAt       pgtype.Timestamptz `db:"joined_at"`
	Emoji          pgtype.Text        `db:"emoji"`
}

func (q *Queries) CreateUserStudent(ctx context.Context, arg CreateUserStudentParams) (UserStudent, error) {
	row := q.db.QueryRow(ctx, createUserStudent,
		arg.UserID,
		arg.OrganisationID,
		arg.LeftAt,
		arg.Grade,
		arg.Birthday,
		arg.JoinedAt,
		arg.Emoji,
	)
	var i UserStudent
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.OrganisationID,
		&i.LeftAt,
		&i.Grade,
		&i.Birthday,
		&i.Nationality,
		&i.Comments,
		&i.JoinedAt,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.Birthplace,
		&i.Emoji,
		&i.MissedHours,
		&i.MissedHoursExcused,
	)
	return i, err
}

const userStudentByUserId = `-- name: UserStudentByUserId :one
SELECT id, user_id, organisation_id, left_at, grade, birthday, nationality, comments, joined_at, created_at, deleted_at, birthplace, emoji, missed_hours, missed_hours_excused
FROM user_students
WHERE id = $1
  AND organisation_id = $2
LIMIT 1
`

type UserStudentByUserIdParams struct {
	ID             string `db:"id"`
	OrganisationID string `db:"organisation_id"`
}

func (q *Queries) UserStudentByUserId(ctx context.Context, arg UserStudentByUserIdParams) (UserStudent, error) {
	row := q.db.QueryRow(ctx, userStudentByUserId, arg.ID, arg.OrganisationID)
	var i UserStudent
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.OrganisationID,
		&i.LeftAt,
		&i.Grade,
		&i.Birthday,
		&i.Nationality,
		&i.Comments,
		&i.JoinedAt,
		&i.CreatedAt,
		&i.DeletedAt,
		&i.Birthplace,
		&i.Emoji,
		&i.MissedHours,
		&i.MissedHoursExcused,
	)
	return i, err
}

const userStudentCount = `-- name: UserStudentCount :one
SELECT COUNT(*)
FROM user_students
WHERE organisation_id = $1
`

func (q *Queries) UserStudentCount(ctx context.Context, organisationID string) (int64, error) {
	row := q.db.QueryRow(ctx, userStudentCount, organisationID)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const userStudentList = `-- name: UserStudentList :many
SELECT id, user_id, organisation_id, left_at, grade, birthday, nationality, comments, joined_at, created_at, deleted_at, birthplace, emoji, missed_hours, missed_hours_excused
FROM user_students
WHERE organisation_id = $1
LIMIT $3 OFFSET $2
`

type UserStudentListParams struct {
	OrganisationID string `db:"organisation_id"`
	Offset         int32  `db:"_offset"`
	Limit          int32  `db:"_limit"`
}

func (q *Queries) UserStudentList(ctx context.Context, arg UserStudentListParams) ([]UserStudent, error) {
	rows, err := q.db.Query(ctx, userStudentList, arg.OrganisationID, arg.Offset, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []UserStudent
	for rows.Next() {
		var i UserStudent
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.OrganisationID,
			&i.LeftAt,
			&i.Grade,
			&i.Birthday,
			&i.Nationality,
			&i.Comments,
			&i.JoinedAt,
			&i.CreatedAt,
			&i.DeletedAt,
			&i.Birthplace,
			&i.Emoji,
			&i.MissedHours,
			&i.MissedHoursExcused,
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

const userStudentListAll = `-- name: UserStudentListAll :many
SELECT id, user_id, organisation_id, left_at, grade, birthday, nationality, comments, joined_at, created_at, deleted_at, birthplace, emoji, missed_hours, missed_hours_excused
FROM user_students
WHERE organisation_id = $1
`

func (q *Queries) UserStudentListAll(ctx context.Context, organisationID string) ([]UserStudent, error) {
	rows, err := q.db.Query(ctx, userStudentListAll, organisationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []UserStudent
	for rows.Next() {
		var i UserStudent
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.OrganisationID,
			&i.LeftAt,
			&i.Grade,
			&i.Birthday,
			&i.Nationality,
			&i.Comments,
			&i.JoinedAt,
			&i.CreatedAt,
			&i.DeletedAt,
			&i.Birthplace,
			&i.Emoji,
			&i.MissedHours,
			&i.MissedHoursExcused,
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

// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: chat_message_view.sql

package db

import (
	"context"
)

const chatMessageViewsByChatMessageAndUser = `-- name: ChatMessageViewsByChatMessageAndUser :many
SELECT id, user_id, chat_id, chat_message_id, organisation_id, created_at
FROM chat_message_views
WHERE chat_message_id = ANY($1::text[])
  AND user_id = $2
  AND organisation_id = $3
`

type ChatMessageViewsByChatMessageAndUserParams struct {
	ChatMessageIds []string `db:"chat_message_ids"`
	UserID         string   `db:"user_id"`
	OrganisationID string   `db:"organisation_id"`
}

func (q *Queries) ChatMessageViewsByChatMessageAndUser(ctx context.Context, arg ChatMessageViewsByChatMessageAndUserParams) ([]ChatMessageView, error) {
	rows, err := q.db.Query(ctx, chatMessageViewsByChatMessageAndUser, arg.ChatMessageIds, arg.UserID, arg.OrganisationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []ChatMessageView
	for rows.Next() {
		var i ChatMessageView
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.ChatID,
			&i.ChatMessageID,
			&i.OrganisationID,
			&i.CreatedAt,
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

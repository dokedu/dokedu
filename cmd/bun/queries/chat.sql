-- name: ListChats :many
SELECT *
FROM chats
WHERE organisation_id = $1;

-- name: GetChat :one
SELECT *
FROM chats
WHERE organisation_id = $1 AND id = $2;

-- name: TotalCountChats :one
SELECT count(*)
FROM chats
WHERE organisation_id = $1;


-- name: ListChatUsers :many
SELECT *
FROM chat_users
WHERE chat_id = $1 AND organisation_id = $2;

-- name: GetChatUser :one
SELECT *
FROM chat_users
WHERE chat_id = $1 AND organisation_id = $2 AND user_id = $3;

-- name: ListChatMessages :many
SELECT *
FROM chat_messages
WHERE chat_id = $1 AND organisation_id = $2;

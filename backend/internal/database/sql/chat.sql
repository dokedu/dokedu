-- name: ChatUserByChatId :many
SELECT *
FROM chat_users
WHERE chat_id = $1;

-- name: ChatById :one
SELECT *
FROM chats
WHERE id = $1
LIMIT 1;

-- name: BotUserByChatId :one
SELECT *
FROM users
         INNER JOIN public.chat_users cu ON users.id = cu.user_id
WHERE cu.id = $1
  AND users.role = 'bot'::user_role
  AND users.organisation_id = $2
LIMIT 1;

-- name: CreateChatMessage :one
INSERT INTO chat_messages (chat_id, user_id, message, organisation_id)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: ChatMessageById :one
SELECT *
FROM chat_messages
WHERE id = $1
LIMIT 1;

-- name: UpdateChatMessageMessageWithoutOrg :one
UPDATE chat_messages
SET message = $2
WHERE id = $1
RETURNING *;

-- name: ChatMessagesByChatIdWithoutOrg :many
SELECT *
FROM chat_messages
WHERE chat_id = $1
ORDER BY created_at DESC;

-- name: UsersInChat :many
SELECT users.*
FROM users
INNER JOIN public.chat_users cu ON users.id = cu.user_id
WHERE cu.chat_id = $1;

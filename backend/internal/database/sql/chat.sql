-- name: ChatUserByChatId :many
SELECT *
FROM chat_users
WHERE chat_id = $1;

-- name: ChatById :one
SELECT *
FROM chats
WHERE id = @id AND organisation_id = @organisation_id
LIMIT 1;

-- name: ChatByIdWithoutOrg :one
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

-- name: ChatNameWithAuthByChatId :one
SELECT users.id, users.first_name, users.last_name
FROM users
         LEFT JOIN chat_users cu ON users.id = cu.user_id AND cu.chat_id = @chat_id
WHERE users.id = @user_id
  AND users.organisation_id = @organisation_id
LIMIT 1;

-- name: UserListByChatId :many
SELECT users.*
FROM users
         INNER JOIN chat_users cu ON users.id = cu.user_id
WHERE cu.chat_id = @chat_id
  AND users.organisation_id = @organisation_id;

-- name: ChatMessageListByChatId :many
SELECT *
FROM chat_messages
WHERE chat_id = @chat_id
  AND organisation_id = @organisation_id;

-- name: LastChatMessage :one
SELECT *
FROM chat_messages
WHERE chat_id = @chat_id
  AND organisation_id = @organisation_id
ORDER BY created_at DESC
LIMIT 1;

-- name: UnreadMessageCount :one
SELECT COUNT(*)
FROM chat_messages
         LEFT JOIN chat_message_views cmv ON chat_messages.id = cmv.chat_message_id
WHERE chat_messages.chat_id = @chat_id
  AND chat_messages.organisation_id = @organisation_id
  AND cmv.user_id = @user_id;

-- name: UserCountByChatId :one
SELECT COUNT(*)
FROM chat_users
WHERE chat_id = @chat_id
  AND organisation_id = @organisation_id;

-- name: CreateChat :one
INSERT INTO chats (name, type, organisation_id)
VALUES ($1, $2, $3)
RETURNING *;

-- name: CreateChatUser :one
INSERT INTO chat_users (chat_id, user_id, organisation_id)
VALUES ($1, $2, $3)
RETURNING *;

-- name: DeleteChat :one
UPDATE chats
SET deleted_at = now()
WHERE chats.id = @id AND chats.organisation_id = @organisation_id AND chats.id IN (SELECT chat_id FROM chat_users WHERE chat_users.user_id = @user_id AND chat_users.organisation_id = @organisation_id)
RETURNING *;

-- name: ExistingChatBetweenTwoUsers :one
SELECT chat.*
FROM chats chat
INNER JOIN chat_users ON chat_users.chat_id = chat.id AND chat_users.user_id = @user_id
INNER JOIN chat_users AS chat_users2 ON chat_users2.chat_id = chat.id AND chat_users2.user_id = @other_user_id
WHERE chat.type = @chat_type AND chat.organisation_id = @organisation_id;
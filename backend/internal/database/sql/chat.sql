-- name: ChatUserByChatId :many
SELECT *
FROM chat_users
WHERE chat_id = $1;

-- name: ChatById :one
SELECT *
FROM chats
WHERE id = @id
  AND organisation_id = @organisation_id
LIMIT 1;

-- name: ChatByIdWithoutOrg :one
SELECT *
FROM chats
WHERE id = $1
LIMIT 1;

-- name: ChatByIdWithUser :one
SELECT chat.*
FROM chats chat
         INNER JOIN chat_users ON chat_users.chat_id = chat.id AND chat_users.user_id = @user_id
WHERE chat.id = @chat_id
  AND chat.organisation_id = @organisation_id
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
SET deleted_at = NOW()
WHERE chats.id = @id
  AND chats.organisation_id = @organisation_id
  AND chats.id IN (SELECT chat_id
                   FROM chat_users
                   WHERE chat_users.user_id = @user_id
                     AND chat_users.organisation_id = @organisation_id)
RETURNING *;

-- name: ExistingChatBetweenTwoUsers :one
SELECT chat.*
FROM chats chat
         INNER JOIN chat_users ON chat_users.chat_id = chat.id AND chat_users.user_id = @user_id
         INNER JOIN chat_users AS chat_users2 ON chat_users2.chat_id = chat.id AND chat_users2.user_id = @other_user_id
WHERE chat.type = @chat_type
  AND chat.organisation_id = @organisation_id;

-- name: DeleteChatUser :one
DELETE
FROM chat_users
WHERE chat_users.chat_id = @chat_id
  AND chat_users.user_id = @user_id
  AND chat_users.organisation_id = @organisation_id
  AND EXISTS (SELECT 1
              FROM chat_users AS cu
              WHERE cu.chat_id = @chat_id
                AND cu.user_id = @current_user_id
                AND cu.organisation_id = @organisation_id)
RETURNING *;

-- name: CreateChatMessageByUser :one
WITH valid_user AS (SELECT 1
                    FROM chat_users
                    WHERE chat_id = @chat_id
                      AND user_id = @user_id
                      AND organisation_id = @organisation_id
                    LIMIT 1)
INSERT
INTO chat_messages (chat_id, user_id, message, organisation_id)
SELECT @chat_id, @user_id, @message, @organisation_id
FROM valid_user
RETURNING *;

-- name: UpdateChatMessageByUser :one
UPDATE chat_messages
SET message = @message
FROM chat_users
WHERE chat_messages.id = @message_id
  AND chat_messages.user_id = @user_id
  AND chat_users.user_id = chat_messages.user_id
  AND chat_users.organisation_id = @organisation_id
  AND chat_users.chat_id = chat_messages.chat_id
RETURNING chat_messages.*;

-- name: UpdateChatName :one
UPDATE chats
SET name = @name
FROM chat_users
WHERE chats.id = @chat_id
  AND chat_users.user_id = @user_id
  AND chat_users.organisation_id = @organisation_id
  AND chat_users.chat_id = chats.id
RETURNING chats.*;

-- name: MarkChatMessageAsRead :one
WITH valid_user AS (SELECT chat_users.chat_id
                    FROM chat_users
                             JOIN chat_messages ON chat_messages.chat_id = chat_users.chat_id
                    WHERE chat_messages.id = @chat_message_id
                      AND chat_users.user_id = @user_id
                      AND chat_users.organisation_id = @organisation_id
                    LIMIT 1)
INSERT
INTO chat_message_views (chat_message_id, user_id, chat_id, organisation_id)
SELECT @chat_message_id, @user_id, valid_user.chat_id, @organisation_id
FROM valid_user
ON CONFLICT DO NOTHING
RETURNING *;

-- name: ChatListWithUser :many
SELECT chat.*,
       MAX(cm.created_at) AS last_message_at,
       COUNT(*) OVER ()   AS total_count
FROM chats AS chat
         LEFT JOIN chat_users ON chat_users.chat_id = chat.id
         LEFT JOIN chat_messages cm ON cm.chat_id = chat.id
WHERE chat_users.user_id = @user_id
  AND chat.organisation_id = @organisation_id
  AND chat.deleted_at IS NULL
GROUP BY chat.id
ORDER BY CASE WHEN MAX(cm.created_at) IS NULL THEN 1 ELSE 0 END,
         last_message_at DESC
LIMIT @page_limit
OFFSET @page_offset;

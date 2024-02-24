-- name: ChatMessageViewsByChatMessageAndUser :many
SELECT *
FROM chat_message_views
WHERE chat_message_id = ANY(@chat_message_ids::text[])
  AND user_id = @user_id
  AND organisation_id = @organisation_id;
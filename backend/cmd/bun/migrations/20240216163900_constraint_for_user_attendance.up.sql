-- add a unique index to user_attendances for (user_id, date)
ALTER TABLE user_attendances
ADD CONSTRAINT user_attendances_user_id_date_unique UNIQUE (user_id, date);

-- remove default
ALTER TABLE chats ALTER COLUMN type DROP DEFAULT;

ALTER TABLE chats ALTER COLUMN type TYPE chat_type USING type::chat_type;

ALTER TABLE chats ALTER COLUMN type SET DEFAULT 'private'::chat_type;


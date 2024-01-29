ALTER TABLE chats ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE chat_messages ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

ALTER TYPE user_role ADD VALUE 'bot';

CREATE TYPE chat_type AS enum ('private', 'group', 'channel');
ALTER TABLE chats ADD COLUMN type TEXT DEFAULT 'private';
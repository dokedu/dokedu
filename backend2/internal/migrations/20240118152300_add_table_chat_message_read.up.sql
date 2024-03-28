CREATE TABLE chat_message_views
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    user_id         text        NOT NULL REFERENCES users,
    chat_id         text        NOT NULL REFERENCES chats,
    chat_message_id text        NOT NULL REFERENCES chat_messages,
    organisation_id text        NOT NULL REFERENCES organisations,
    created_at      timestamptz NOT NULL             DEFAULT NOW(),
    UNIQUE (chat_id, user_id, chat_message_id)
);
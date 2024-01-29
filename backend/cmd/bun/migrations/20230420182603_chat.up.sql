SET statement_timeout = 0;

CREATE TABLE chats
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    name            text        NULL,
    organisation_id text        NOT NULL REFERENCES organisations,
    updated_at      timestamptz NULL,
    created_at      timestamptz NOT NULL             DEFAULT now()
);

CREATE TABLE chat_users
(
    id              text NOT NULL PRIMARY KEY DEFAULT nanoid(),
    chat_id         text NOT NULL REFERENCES chats,
    user_id         text NOT NULL REFERENCES users,
    organisation_id text NOT NULL REFERENCES organisations
);

CREATE TABLE chat_messages
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    chat_id         text        NOT NULL REFERENCES chats,
    user_id         text        NOT NULL REFERENCES users,
    message         text        NOT NULL,
    organisation_id text        NOT NULL REFERENCES organisations,
    updated_at      timestamptz NULL,
    created_at      timestamptz NOT NULL             DEFAULT now()
);

-- chat message files

CREATE TABLE chat_message_files
(
    id         text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    chat_id    text        NOT NULL REFERENCES chats,
    user_id    text        NOT NULL REFERENCES users,
    message_id text        NOT NULL REFERENCES chat_messages,
    file_id    text        NOT NULL REFERENCES files,
    updated_at timestamptz NULL,
    created_at timestamptz NOT NULL             DEFAULT now()
);

CREATE TABLE chat_message_reactions
(
    id         text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    chat_id    text        NOT NULL REFERENCES chats,
    user_id    text        NOT NULL REFERENCES users,
    message_id text        NOT NULL REFERENCES chat_messages,
    reaction   text        NOT NULL,
    created_at timestamptz NOT NULL             DEFAULT now()
);

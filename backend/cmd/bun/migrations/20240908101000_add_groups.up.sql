CREATE TABLE groups
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    name            text        NOT NULL,
    organisation_id text        NOT NULL REFERENCES organisations (id),
    created_at      timestamptz NOT NULL             DEFAULT NOW(),
    updated_at      timestamptz,
    deleted_at      timestamptz,
    UNIQUE (name, organisation_id)
);

CREATE TABLE group_users
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    group_id        text        NOT NULL REFERENCES groups (id),
    user_id         text        NOT NULL REFERENCES users (id),
    organisation_id text        NOT NULL REFERENCES organisations (id),
    created_at      timestamptz NOT NULL             DEFAULT NOW(),
    updated_at      timestamptz,
    deleted_at      timestamptz,
    UNIQUE (group_id, user_id, organisation_id)
);

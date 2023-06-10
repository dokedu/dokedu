SET statement_timeout = 0;

CREATE TABLE user_files
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    user_id         text        NOT NULL REFERENCES users,
    file_id         text        NOT NULL REFERENCES files,
    organisation_id text        NOT NULL REFERENCES organisations,
    created_at      timestamptz NOT NULL             DEFAULT now(),
    updated_at      timestamptz NULL
);

CREATE TABLE shared_drives
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    name            text        NOT NULL,
    bucket_id       text        NOT NULL             DEFAULT nanoid(21, '0123456789abcdefghijklmnopqrstuvwxyz'),
    organisation_id text        NOT NULL REFERENCES organisations,
    created_by      text        NOT NULL REFERENCES users,
    updated_at      timestamptz NULL,
    created_at      timestamptz NOT NULL             DEFAULT now()
);

CREATE TABLE shared_drive_files
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    shared_drive_id text        NOT NULL REFERENCES shared_drives,
    file_id         text        NOT NULL,
    updated_at      timestamptz NULL,
    created_at      timestamptz NOT NULL             DEFAULT now()
);

CREATE TYPE shared_drive_permission AS ENUM ('viewer', 'contributor', 'content_manager', 'manager');

CREATE TABLE shared_drive_users
(
    id              text                    NOT NULL PRIMARY KEY DEFAULT nanoid(),
    shared_drive_id text                    NOT NULL REFERENCES shared_drives,
    user_id         text                    NOT NULL REFERENCES users,
    permission      shared_drive_permission NOT NULL,
    updated_at      timestamptz             NULL,
    created_at      timestamptz             NOT NULL             DEFAULT now()
);

CREATE TYPE file_permission AS ENUM ('viewer', 'editor');

CREATE TABLE shared_files
(
    id         text            NOT NULL PRIMARY KEY DEFAULT nanoid(),
    file_id    text            NOT NULL,
    permission file_permission NOT NULL,
    updated_at timestamptz     NULL,
    created_at timestamptz     NOT NULL             DEFAULT now()
);

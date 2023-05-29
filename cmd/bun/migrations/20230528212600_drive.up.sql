SET statement_timeout = 0;

CREATE TABLE user_drive_files
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    organisation_id text        NOT NULL REFERENCES organisations,
    user_id         text        NOT NULL REFERENCES users,
    file_id         text        NOT NULL,
    updated_at      timestamptz NULL,
    created_at      timestamptz NOT NULL             DEFAULT now()
);

CREATE TABLE shared_drives
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    name            text        NOT NULL,
    organisation_id text        NOT NULL REFERENCES organisations,
    updated_at      timestamptz NULL,
    created_at      timestamptz NOT NULL             DEFAULT now()
);

CREATE TABLE shared_drive_users
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    shared_drive_id text        NOT NULL REFERENCES shared_drives,
    user_id         text        NOT NULL REFERENCES users,
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
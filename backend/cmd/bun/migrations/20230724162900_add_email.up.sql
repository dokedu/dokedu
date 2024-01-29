SET statement_timeout = 0;

CREATE TABLE email_accounts
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    name            TEXT UNIQUE NOT NULL,
    secret          TEXT,
    description     TEXT,
    type            TEXT        NOT NULL,
    quota           INTEGER                          DEFAULT 0,
    active          BOOLEAN                          DEFAULT true,
    user_id         text        NULL REFERENCES users,
    organisation_id text        NOT NULL REFERENCES organisations,
    created_at      timestamptz                      DEFAULT NOW() NOT NULL
);

CREATE TABLE email_group_members
(
    id              text NOT NULL PRIMARY KEY DEFAULT nanoid(),
    name            TEXT NOT NULL,
    member_of       TEXT NOT NULL,
    organisation_id text NOT NULL REFERENCES organisations,
    created_at      timestamptz               DEFAULT NOW() NOT NULL
);

CREATE TABLE emails
(
    id              text NOT NULL PRIMARY KEY DEFAULT nanoid(),
    name            TEXT NOT NULL,
    address         TEXT NOT NULL,
    type            TEXT,
    organisation_id text NOT NULL REFERENCES organisations,
    created_at      timestamptz               DEFAULT NOW() NOT NULL
);

CREATE TABLE email_forwarding
(
    id              text NOT NULL PRIMARY KEY DEFAULT nanoid(),
    origin          TEXT NOT NULL,
    target          TEXT NOT NULL,
    organisation_id text NOT NULL REFERENCES organisations,
    created_at      timestamptz               DEFAULT NOW() NOT NULL
);

CREATE TABLE domains
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    name            TEXT UNIQUE NOT NULL,
    organisation_id text        NOT NULL REFERENCES organisations,
    created_at      timestamptz                      DEFAULT NOW() NOT NULL
);

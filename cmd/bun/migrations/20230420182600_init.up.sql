SET statement_timeout = 0;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION nanoid(size int DEFAULT 21)
    RETURNS text AS
$$
DECLARE
    id          text     := '';
    i           int      := 0;
    urlalphabet char(64) := 'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW';
    bytes       bytea    := gen_random_bytes(size);
    byte        int;
    pos         int;
BEGIN
    WHILE i < size
        LOOP
            byte := GET_BYTE(bytes, i);
            pos := (byte & 63) + 1; -- + 1 because substr starts at 1 for some reason
            id := id || SUBSTR(urlalphabet, pos, 1);
            i = i + 1;
        END LOOP;
    RETURN id;
END
$$ LANGUAGE plpgsql STABLE;

CREATE TABLE organisations
(
    id         text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    name       text                         NOT NULL,
    legal_name text                         NOT NULL,
    website    text                         NOT NULL,
    phone      text                         NOT NULL,
    owner_id   text                         NOT NULL,
    created_at timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at timestamptz
);

CREATE INDEX organisations_deleted_at_idx
    ON organisations (deleted_at)
    WHERE (deleted_at IS NULL);



CREATE TABLE users
(
    id                    text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    role                  text                         NOT NULL CHECK (role = ANY
                                                                       (ARRAY ['owner', 'admin', 'teacher', 'educator', 'student', 'parent'])),
    organisation_id       text                         NOT NULL REFERENCES organisations,
    first_name            text                         NOT NULL,
    last_name             text                         NOT NULL,
    email                 text                         NOT NULL,
    password              text                         NOT NULL,
    avatar_file_bucket_id text,
    avatar_file_name      text,
    created_at            timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at            timestamptz,
    joined_at             timestamptz,
    left_at               timestamptz,
    birthday              date,
    grade                 integer
);

ALTER TABLE organisations
    ADD FOREIGN KEY (owner_id) REFERENCES users;

CREATE INDEX users_role_idx ON users (role);

CREATE INDEX users_deleted_at_idx ON users (deleted_at) WHERE (deleted_at IS NULL);

CREATE TABLE entries
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    date            date                         NOT NULL,
    body            jsonb                        NOT NULL,
    user_id         text                         NOT NULL REFERENCES users,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz,
    organisation_id text                         NOT NULL REFERENCES organisations
);

CREATE INDEX entries_deleted_at_idx
    ON entries (deleted_at)
    WHERE (deleted_at IS NULL);

CREATE INDEX entries_created_at_idx
    ON entries (created_at);

CREATE TABLE entry_users
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    entry_id        text                         NOT NULL REFERENCES entries,
    user_id         text                         NOT NULL REFERENCES users,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz,
    organisation_id text                         NOT NULL REFERENCES organisations
);

CREATE INDEX entry_users_entry_id_user_id_idx
    ON entry_users (entry_id, user_id);

CREATE INDEX entry_users_deleted_at_idx
    ON entry_users (deleted_at)
    WHERE (deleted_at IS NULL);

CREATE INDEX entry_users_user_id_idx
    ON entry_users (user_id);

CREATE TABLE competences
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    name            text                         NOT NULL,
    competence_id   text,
    competence_type text                         NOT NULL CHECK (competence_type = ANY (ARRAY ['subject', 'group', 'competence'])),
    organisation_id text                         NOT NULL,
    grades          integer[]                    NOT NULL,
    color           text,
    curriculum_id   text,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz
);

CREATE INDEX competences_type
    ON competences USING hash (competence_type);

CREATE INDEX competences_competence_id_competence_type_idx
    ON competences (competence_id, competence_type);

CREATE INDEX competences_deleted_at_idx
    ON competences (deleted_at)
    WHERE (deleted_at IS NULL);

CREATE TABLE entry_user_competences
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    level           integer                      NOT NULL CHECK ((level <= 3) AND (level >= 0)),
    user_id         text                         NOT NULL REFERENCES users,
    entry_id        text                         NOT NULL REFERENCES entries,
    competence_id   text                         NOT NULL REFERENCES competences,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz,
    organisation_id text                         NOT NULL REFERENCES organisations,
    UNIQUE (user_id, entry_id, competence_id)
);

CREATE INDEX entry_user_competences_deleted_at_idx
    ON entry_user_competences (deleted_at)
    WHERE (deleted_at IS NULL);

CREATE TABLE entry_files
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    entry_id        text                         NOT NULL REFERENCES entries,
    file_bucket_id  text                         NOT NULL,
    file_name       text                         NOT NULL,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz,
    organisation_id text                         NOT NULL REFERENCES organisations,
    UNIQUE (entry_id, file_bucket_id, file_name)
);

CREATE INDEX entry_files_deleted_at_idx
    ON entry_files (deleted_at)
    WHERE (deleted_at IS NULL);

CREATE TABLE events
(
    id                   text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    image_file_bucket_id text,
    image_file_name      text,
    organisation_id      text                         NOT NULL REFERENCES organisations,
    title                text                         NOT NULL,
    body                 text                         NOT NULL,
    starts_at            timestamptz                  NOT NULL,
    ends_at              timestamptz                  NOT NULL,
    recurrence           text[],
    created_at           timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at           timestamptz
);

CREATE INDEX events_deleted_at_idx ON events (deleted_at) WHERE (deleted_at IS NULL);

CREATE TABLE entry_events
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    entry_id        text                         NOT NULL REFERENCES entries,
    event_id        text                         NOT NULL REFERENCES events,
    organisation_id text                         NOT NULL REFERENCES organisations,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz
);

CREATE INDEX entry_events_deleted_at_idx ON entry_events (deleted_at) WHERE (deleted_at IS NULL);

CREATE TABLE reports
(
    id              text        DEFAULT nanoid()  NOT NULL,
    file_bucket_id  text,
    file_name       text,
    status          text        DEFAULT 'pending' NOT NULL CHECK (status = ANY (ARRAY ['pending', 'processing', 'done', 'error'])),
    type            text                          NOT NULL CHECK (type = ANY
                                                                  (ARRAY ['report', 'subjects', 'report_docx', 'subjects_docx'])),
    "from"          timestamptz                   NOT NULL,
    "to"            timestamptz                   NOT NULL,
    user_id         text                          NOT NULL REFERENCES users,
    student_user_id text                          NOT NULL REFERENCES users,
    meta            jsonb,
    created_at      timestamptz DEFAULT NOW()     NOT NULL,
    deleted_at      timestamptz,
    filter_tags     text[] CHECK ((filter_tags IS NULL) OR (ARRAY_LENGTH(filter_tags, 1) > 0)),
    organisation_id text                          NOT NULL REFERENCES organisations,
    CHECK (((status = ANY (ARRAY ['pending', 'error'])) AND (file_bucket_id IS NULL) AND (file_name IS NULL)) OR
           ((status = 'done') AND (file_bucket_id IS NOT NULL) AND (file_name IS NOT NULL)))
);

CREATE INDEX reports_deleted_at_idx
    ON reports (deleted_at)
    WHERE (deleted_at IS NULL);

CREATE TABLE event_competences
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    event_id        text                         NOT NULL REFERENCES events,
    competence_id   text                         NOT NULL REFERENCES competences,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz,
    organisation_id text                         NOT NULL REFERENCES organisations
);

CREATE INDEX event_competences_deleted_at_idx
    ON event_competences (deleted_at)
    WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX event_competences_unique_event_id_competence_id
    ON event_competences (event_id, competence_id);

CREATE TABLE tags
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    name            text                         NOT NULL,
    organisation_id text                         NOT NULL REFERENCES organisations,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz,
    UNIQUE (name, organisation_id)
);

CREATE TABLE entry_tags
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    entry_id        text                         NOT NULL REFERENCES entries,
    tag_id          text                         NOT NULL REFERENCES tags,
    organisation_id text                         NOT NULL REFERENCES organisations,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz,
    UNIQUE (id, entry_id, tag_id)
);


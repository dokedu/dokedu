SET statement_timeout = 0;

-- TODO: research proper way to do this
CREATE TABLE files
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    file_bucket_id  text                         NOT NULL,
    file_name       text                         NOT NULL,
    organisation_id text                         NOT NULL REFERENCES organisations,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz,
    UNIQUE (file_bucket_id, file_name)
);

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

CREATE TYPE competence_type AS ENUM ('subject', 'group', 'competence');

CREATE TABLE competences
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    name            text                         NOT NULL,
    competence_id   text,
    competence_type competence_type              NOT NULL,
    organisation_id text                         NOT NULL,
    grades          integer[]                    NOT NULL,
    color           text,
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

CREATE TYPE report_status AS ENUM ('pending', 'processing', 'done', 'error');

CREATE TYPE report_type AS ENUM ('report', 'subjects', 'report_docx', 'subjects_docx');

CREATE TABLE reports
(
    id              text          DEFAULT nanoid()  NOT NULL,
    file_bucket_id  text,
    file_name       text,
    status          report_status DEFAULT 'pending' NOT NULL,
    type            report_type                     NOT NULL,
    "from"          timestamptz                     NOT NULL,
    "to"            timestamptz                     NOT NULL,
    user_id         text                            NOT NULL REFERENCES users,
    student_user_id text                            NOT NULL REFERENCES users,
    meta            jsonb,
    created_at      timestamptz   DEFAULT NOW()     NOT NULL,
    deleted_at      timestamptz,
    filter_tags     text[] CHECK ((filter_tags IS NULL) OR (ARRAY_LENGTH(filter_tags, 1) > 0)),
    organisation_id text                            NOT NULL REFERENCES organisations,
    CHECK (((status = ANY (ARRAY ['pending'::report_status, 'error'::report_status])) AND (file_bucket_id IS NULL) AND
            (file_name IS NULL)) OR
           ((status = 'done'::report_status) AND (file_bucket_id IS NOT NULL) AND (file_name IS NOT NULL)))
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
    color           text                         NOT NULL,
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

SET statement_timeout = 0;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION nanoid(size int DEFAULT 21,
                                  alphabet text DEFAULT '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    RETURNS text
    LANGUAGE plpgsql
    volatile
AS
$$
DECLARE
    idBuilder     text := '';
    i             int  := 0;
    bytes         bytea;
    alphabetIndex int;
    mask          int;
    step          int;
BEGIN
    mask := (2 << cast(floor(log(length(alphabet) - 1) / log(2)) as int)) - 1;
    step := cast(ceil(1.6 * mask * size / length(alphabet)) AS int);

    while true
        loop
            bytes := gen_random_bytes(size);
            while i < size
                loop
                    alphabetIndex := (get_byte(bytes, i) & mask) + 1;
                    if alphabetIndex <= length(alphabet) then
                        idBuilder := idBuilder || substr(alphabet, alphabetIndex, 1);
                        if length(idBuilder) = size then
                            return idBuilder;
                        end if;
                    end if;
                    i = i + 1;
                end loop;

            i := 0;
        end loop;
END
$$;

CREATE TABLE organisations
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    name            text                         NOT NULL,
    legal_name      text                         NOT NULL,
    website         text                         NOT NULL,
    phone           text                         NOT NULL,
    owner_id        text                         NOT NULL,
    allowed_domains text[]                       NOT NULL,
    enabled_apps    text[]                       NULL,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz
);

CREATE TABLE buckets
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(21, '0123456789abcdefghijklmnopqrstuvwxyz'),
    name            text        NOT NULL,
    shared          boolean     NOT NULL             DEFAULT false,
    organisation_id text        NOT NULL REFERENCES organisations,
    created_at      timestamptz NOT NULL             DEFAULT now(),
    deleted_at      timestamptz NULL
);

CREATE TYPE file_type as ENUM ('blob', 'folder');

CREATE TABLE files
(
    id              text                 DEFAULT nanoid() NOT NULL PRIMARY KEY,
    name            text        NOT NULL,
    file_type       file_type   NOT NULL DEFAULT 'blob'::file_type,
    mime_type       text        NULL, -- application/vnd.dokedu-apps.folder
    size            bigint      NOT NULL default 0,
    bucket_id       text        NOT NULL REFERENCES buckets,
    parent_id       text        NULL REFERENCES files,
    organisation_id text        NOT NULL REFERENCES organisations,
    created_at      timestamptz NOT NULL DEFAULT now(),
    deleted_at      timestamptz NULL
);

CREATE TYPE user_role AS ENUM ('owner', 'admin', 'teacher', 'educator', 'student', 'parent');

CREATE TABLE users
(
    id               text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    role             user_role                    NOT NULL,
    organisation_id  text                         NOT NULL REFERENCES organisations,
    first_name       text                         NOT NULL,
    last_name        text                         NOT NULL,
    email            text                         NULL,
    password         text                         NULL,
    recovery_token   text                         NULL,
    recovery_sent_at timestamptz                  NULL,
    avatar_file_id   text                         NULL REFERENCES files,
    created_at       timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at       timestamptz,
    UNIQUE (email)
);

-- add "user_id         text        NULL REFERENCES users" to buckets
ALTER TABLE buckets
    ADD COLUMN user_id text NULL REFERENCES users;

CREATE TABLE sessions
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    user_id         text        NOT NULL REFERENCES users,
    token           text        NOT NULL,
    created_at      timestamptz NOT NULL DEFAULT now(),
    deleted_at      timestamptz NULL
);

CREATE TYPE file_permission AS ENUM ('viewer', 'manager');

CREATE TABLE shares
(
    id              text            NOT NULL PRIMARY KEY DEFAULT nanoid(),
    file_id         text            NULL references files,
    bucket_id       text            NULL references buckets,
    shared_with     text            NOT NULL references users,
    shared_by       text            NOT NULL references users,
    permission      file_permission NOT NULL,
    organisation_id text            NOT NULL REFERENCES organisations,
    created_at      timestamptz     NOT NULL             DEFAULT now(),
    deleted_at      timestamptz     NULL
);

-- TODO: this is a new table, so we need to properly migrate the data
CREATE TABLE user_students
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    user_id         text                         NOT NULL REFERENCES users,
    organisation_id text                         NOT NULL REFERENCES organisations,
    left_at         timestamptz,
    grade           integer                      NOT NULL CHECK ((grade <= 13) AND (grade >= 1)),
    birthday        date,
    nationality     text,
    comments        text,
    joined_at       timestamptz,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz,
    UNIQUE (user_id, organisation_id)
);

ALTER TABLE organisations
    ADD FOREIGN KEY (owner_id) REFERENCES users;

CREATE TABLE entries
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    date            date                         NOT NULL,
    body            text                         NOT NULL,
    user_id         text                         NOT NULL REFERENCES users,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz,
    organisation_id text                         NOT NULL REFERENCES organisations
);

CREATE TABLE entry_users
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    entry_id        text                         NOT NULL REFERENCES entries,
    user_id         text                         NOT NULL REFERENCES users,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz,
    organisation_id text                         NOT NULL REFERENCES organisations,
    UNIQUE (entry_id, user_id)
);

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
    curriculum_id   text,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz
);

CREATE TABLE user_competences
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    level           integer                      NOT NULL CHECK ((level <= 3) AND (level >= 0)),
    user_id         text                         NOT NULL REFERENCES users,
    entry_id        text                         NULL REFERENCES entries,
    competence_id   text                         NOT NULL REFERENCES competences,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    created_by      text                         NULL REFERENCES users,
    deleted_at      timestamptz,
    organisation_id text                         NOT NULL REFERENCES organisations,
    UNIQUE (user_id, competence_id, entry_id)
);

CREATE TABLE entry_files
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    entry_id        text                         NOT NULL REFERENCES entries,
    file_id         text                         NOT NULL REFERENCES files,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz,
    organisation_id text                         NOT NULL REFERENCES organisations,
    UNIQUE (entry_id, file_id)
);

CREATE TABLE events
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    image_file_id   text                         NULL REFERENCES files,
    organisation_id text                         NOT NULL REFERENCES organisations,
    title           text                         NOT NULL,
    body            text                         NOT NULL,
    starts_at       timestamptz                  NOT NULL,
    ends_at         timestamptz                  NOT NULL,
    recurrence      text[],
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz
);

CREATE TABLE entry_events
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    entry_id        text                         NOT NULL REFERENCES entries,
    event_id        text                         NOT NULL REFERENCES events,
    organisation_id text                         NOT NULL REFERENCES organisations,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz,
    UNIQUE (entry_id, event_id)
);

CREATE TYPE report_status AS ENUM ('pending', 'processing', 'done', 'error');
CREATE TYPE report_format AS ENUM ('docx', 'pdf', 'html', 'csv', 'xlsx');
CREATE TYPE report_kind AS ENUM ('report', 'subjects');

CREATE TABLE reports
(
    id              text          DEFAULT nanoid()                 NOT NULL,
    status          report_status DEFAULT 'pending'::report_status NOT NULL,
    format          report_format DEFAULT 'pdf'::report_format     NOT NULL,
    kind            report_kind   DEFAULT 'report'::report_kind    NOT NULL,
    "from"          timestamptz                                    NOT NULL,
    "to"            timestamptz                                    NOT NULL,
    meta            jsonb,
    filter_tags     text[],
    file_id         text                                           NULL REFERENCES files,
    user_id         text                                           NOT NULL REFERENCES users,
    student_user_id text                                           NOT NULL REFERENCES users,
    organisation_id text                                           NOT NULL REFERENCES organisations,
    created_at      timestamptz   DEFAULT NOW()                    NOT NULL,
    deleted_at      timestamptz
);

CREATE OR REPLACE FUNCTION reports_trigger_func() RETURNS TRIGGER AS
$$
BEGIN
    -- check that the file_id are set when status is done and not set when status is not done
    IF NEW.status = 'done' AND NEW.file_id IS NULL THEN
        RAISE EXCEPTION 'file_id must be set when status is done';
    END IF;
    IF NEW.status != 'done' AND NEW.file_id IS NOT NULL THEN
        RAISE EXCEPTION 'file_id must not be set when status is not done';
    END IF;
    -- ensure filter_tags if set is not empty
    IF NEW.filter_tags IS NOT NULL AND ARRAY_LENGTH(NEW.filter_tags, 1) = 0 THEN
        RAISE EXCEPTION 'filter_tags must not be empty';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reports_trigger
    BEFORE INSERT OR UPDATE
    ON reports
    FOR EACH ROW
EXECUTE PROCEDURE reports_trigger_func();

CREATE TABLE event_competences
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    event_id        text                         NOT NULL REFERENCES events,
    competence_id   text                         NOT NULL REFERENCES competences,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz,
    organisation_id text                         NOT NULL REFERENCES organisations,
    UNIQUE (event_id, competence_id)
);

CREATE TABLE tags
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    name            text                         NOT NULL,
    color           text,
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
    UNIQUE (entry_id, tag_id)
);


SET statement_timeout = 0;

-- drop schema public cascade
DROP SCHEMA IF EXISTS public CASCADE;

-- create schema public
CREATE SCHEMA public;


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
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    name            text                         NOT NULL,
    legal_name      text                         NOT NULL,
    website         text                         NOT NULL,
    phone           text                         NOT NULL,
    owner_id        text                         NOT NULL,
    allowed_domains text[]                       NOT NULL,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz
);

CREATE INDEX organisations_deleted_at_idx
    ON organisations (deleted_at)
    WHERE (deleted_at IS NULL);

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

CREATE TYPE user_role AS ENUM ('owner', 'admin', 'teacher', 'educator', 'student', 'parent');

CREATE TABLE users
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    "role"          user_role                    NOT NULL,
    organisation_id text                         NOT NULL REFERENCES organisations,
    first_name      text                         NOT NULL,
    last_name       text                         NOT NULL,
    email           text                         NULL,
    password        text                         NULL,
    avatar_file     text,
    birthday        date,
    grade           integer,
    left_at         timestamptz,
    joined_at       timestamptz,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz
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

-- ADDITIONAL TABLES

CREATE TYPE student_sex AS ENUM ('male', 'female', 'other');

CREATE TABLE school_years
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    name            text                         NOT NULL,
    organisation_id text                         NOT NULL REFERENCES organisations,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz,
    UNIQUE (name, organisation_id)
);

CREATE TABLE schools
(
    id              text DEFAULT nanoid() NOT NULL PRIMARY KEY,
    name            text                  NOT NULL,
    organisation_id text                  NULL REFERENCES organisations,
    address_id      text                  NULL REFERENCES addresses,
    UNIQUE (name, organisation_id)
);

CREATE TABLE health_insurances
(
    id              text DEFAULT nanoid() NOT NULL PRIMARY KEY,
    name            text                  NOT NULL,
    organisation_id text                  NULL REFERENCES organisations,
    UNIQUE (name, organisation_id)
);

CREATE TABLE students
(
    id                       text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    user_id                  text                         NOT NULL REFERENCES users,
    organisation_id          text                         NOT NULL REFERENCES organisations,
    sex                      student_sex,
    nationality              text,
    birthday                 date,
    age                      integer GENERATED ALWAYS AS (date_part('year', age(birthday))) STORED,
    birthplace               text,
    confession               text,
    school_year              text references school_years,
    comment                  text,
    --
    admission_date           date,
    previous_school          text REFERENCES schools,
    origin                   text,
    departure                date,
    next_school              text references schools,
    graduation               date,
    first_school_year        date,
    total_school_years       int,
    health_insurance         text references health_insurances,
    birth_country            text,
    year_of_arrival          int,
    --
    permission_to_photograph boolean     default false,
    created_at               timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at               timestamptz,
    PRIMARY KEY (user_id, organisation_id)
);

CREATE TABLE addresses
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    organisation_id text                         NOT NULL REFERENCES organisations,
    address1        text                         NOT NULL,
    address2        text                         NOT NULL,
    address3        text                         NOT NULL,
    city            text                         NOT NULL,
    state           text                         NOT NULL,
    country         text                         NOT NULL,
    postal_code     text                         NOT NULL,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz
);

CREATE TABLE student_school_careers
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    student_id      text                         NOT NULL REFERENCES students,
    organisation_id text                         NOT NULL REFERENCES organisations,
    school_id       text                         NOT NULL REFERENCES schools,
    school_year     text                         NOT NULL REFERENCES school_years,
    school_class    text                         NOT NULL,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz
);

CREATE TABLE subjects
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    name            text                         NOT NULL,
    organisation_id text                         NOT NULL REFERENCES organisations,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz,
    UNIQUE (name, organisation_id)
);

CREATE TABLE subject_courses
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    name            text                         NOT NULL,
    subject_id      text                         NOT NULL REFERENCES subjects,
    organisation_id text                         NOT NULL REFERENCES organisations,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz,
    UNIQUE (name, organisation_id)
);

CREATE TABLE student_school_subject_enrollments
(
    id                text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    student_id        text                         NOT NULL REFERENCES students,
    organisation_id   text                         NOT NULL REFERENCES organisations,
    school_id         text                         NOT NULL REFERENCES schools,
    school_year       text                         NOT NULL REFERENCES school_years,
    subject_course_id text                         NOT NULL REFERENCES subject_courses,
    start_date        date                         NOT NULL,
    end_date          date,
    created_at        timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at        timestamptz
);
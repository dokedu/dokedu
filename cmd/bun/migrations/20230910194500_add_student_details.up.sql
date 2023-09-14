SET statement_timeout = 0;

CREATE TABLE addresses
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    address_1       TEXT,
    address_2       TEXT,
    address_3       TEXT,
    postal_code     TEXT,
    city            TEXT,
    state           TEXT,
    country         TEXT,
    organisation_id text REFERENCES organisations (id),
    created_at      timestamptz NOT NULL             DEFAULT now(),
    deleted_at      timestamptz
);

CREATE TABLE user_address_histories
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    user_id         text        NOT NULL REFERENCES users (id),
    address_id      text        NOT NULL REFERENCES addresses (id),
    start_date      date        NOT NULL,
    end_date        date        NOT NULL,
    organisation_id text REFERENCES organisations (id),
    created_at      timestamptz NOT NULL             DEFAULT now(),
    deleted_at      timestamptz
);

CREATE TABLE user_relationships
(
    id                text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    user_id           text        NOT NULL REFERENCES users (id),
    student_id        text        NOT NULL REFERENCES users (id),
    relationship_type text        NOT NULL,
    organisation_id   text REFERENCES organisations (id),
    created_at        timestamptz NOT NULL             DEFAULT now(),
    deleted_at        timestamptz
);

CREATE TABLE schools
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    name            TEXT        NOT NULL,
    address_id      text REFERENCES addresses (id),
    phone           TEXT,
    email           TEXT,
    website         TEXT,
    description     TEXT,
    organisation_id text REFERENCES organisations (id),
    created_at      timestamptz NOT NULL             DEFAULT now(),
    deleted_at      timestamptz
);

CREATE TABLE subjects
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    name            TEXT        NOT NULL,
    organisation_id text REFERENCES organisations (id),
    created_at      timestamptz NOT NULL             DEFAULT now(),
    deleted_at      timestamptz
);

CREATE TABLE school_years
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    year            INTEGER     NOT NULL,
    description     TEXT GENERATED ALWAYS AS (year::text || '/' || (year + 1)::text) STORED,
    organisation_id text REFERENCES organisations (id),
    created_at      timestamptz NOT NULL             DEFAULT now(),
    deleted_at      timestamptz,
    UNIQUE (year, organisation_id)
);

CREATE TABLE user_student_grades
(
    id              text        NOT NULL PRIMARY KEY DEFAULT nanoid(),
    user_student_id text        NOT NULL REFERENCES user_students (id),
    subject_id      text        NOT NULL REFERENCES subjects (id),
    grade           INT         NOT NULL,
    school_year_id  text        NOT NULL REFERENCES school_years (id),
    organisation_id text REFERENCES organisations (id),
    created_at      timestamptz NOT NULL             DEFAULT now(),
    deleted_at      timestamptz
);

CREATE TYPE user_student_school_history_action AS ENUM ('enrolled', 'graduated', 'transferred', 'suspended', 'expelled', 'repeated', 'jumped');

CREATE TABLE user_student_school_histories
(
    id              text                               NOT NULL PRIMARY KEY DEFAULT nanoid(),
    user_student_id text                               NOT NULL REFERENCES user_students (id),
    school_id       text                               NOT NULL REFERENCES schools (id),
    action          user_student_school_history_action NOT NULL,
    school_year_id  text                               NOT NULL REFERENCES school_years (id),
    organisation_id text REFERENCES organisations (id),
    created_at      timestamptz                        NOT NULL             DEFAULT now(),
    deleted_at      timestamptz
);

ALTER TABLE user_students
    ADD COLUMN birthplace TEXT;

ALTER TABLE users
    ADD COLUMN sex TEXT;

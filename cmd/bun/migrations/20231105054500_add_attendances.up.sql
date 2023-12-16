SET statement_timeout = 0;

CREATE TYPE user_attendance_state AS ENUM ('UNKNOWN', 'PRESENT', 'ABSENT', 'LATE', 'SICK');

CREATE TABLE user_attendances
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    user_id         text                         NOT NULL REFERENCES users (id),
    date            date                         NOT NULL,
    state           user_attendance_state        NOT NULL,
    created_by      text                         NOT NULL REFERENCES users (id),
    organisation_id text                         NOT NULL REFERENCES organisations (id),
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz
);
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
    owner_id        text                         NULL,
    allowed_domains text[]                       NULL,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz
);

CREATE INDEX organisations_deleted_at_idx
    ON organisations (deleted_at)
    WHERE (deleted_at IS NULL);

CREATE TYPE user_role AS ENUM ('owner', 'admin', 'teacher', 'educator', 'student', 'parent');

CREATE TABLE users
(
    id              text        DEFAULT nanoid() NOT NULL PRIMARY KEY,
    "role"          user_role                    NOT NULL,
    organisation_id text                         NOT NULL REFERENCES organisations,
    name            text                         NOT NULL,
    surname         text                         NOT NULL,
    email           text                         NULL,
    password        text                         NULL,
    created_at      timestamptz DEFAULT NOW()    NOT NULL,
    deleted_at      timestamptz
);

ALTER TABLE organisations
    ADD FOREIGN KEY (owner_id) REFERENCES users;

CREATE INDEX users_role_idx ON users (role);

CREATE INDEX users_deleted_at_idx ON users (deleted_at) WHERE (deleted_at IS NULL);


SET statement_timeout = 0;

ALTER TABLE organisations ADD COLUMN address TEXT NOT NULL DEFAULT '';
ALTER TABLE organisations ADD COLUMN logo_url TEXT NOT NULL DEFAULT '';
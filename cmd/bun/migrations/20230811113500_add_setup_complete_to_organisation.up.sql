SET statement_timeout = 0;

ALTER TABLE organisations ADD COLUMN setup_complete boolean NOT NULL DEFAULT true;
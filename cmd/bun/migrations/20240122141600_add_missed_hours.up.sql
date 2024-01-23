SET statement_timeout = 0;

ALTER TABLE user_students
    ADD COLUMN missed_hours int DEFAULT 0;
ALTER TABLE user_students
    ADD COLUMN missed_hours_excused int DEFAULT 0;

CREATE TABLE report_templates
(
    id              text                     NOT NULL PRIMARY KEY DEFAULT nanoid(),
    name            text                     NOT NULL,
    description     text                     NOT NULL,
    format          text                     NOT NULL,
    template        text                     NOT NULL,
    component       bool                     NOT NULL             DEFAULT FALSE,
    settings        jsonb                    NOT NULL             DEFAULT '{}',
    organisation_id text                     NOT NULL REFERENCES organisations,
    created_at      timestamp WITH TIME ZONE NOT NULL             DEFAULT NOW()
);
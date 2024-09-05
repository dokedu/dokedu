ALTER TABLE user_attendances
    ADD COLUMN comment TEXT;
ALTER TABLE user_attendances
    ADD COLUMN minutes_delayed INT;

-- add unique index to user attendance (user_id, date, organisation_id)
ALTER TABLE user_attendances
    ADD CONSTRAINT user_attendances_unique UNIQUE (user_id, date, organisation_id);
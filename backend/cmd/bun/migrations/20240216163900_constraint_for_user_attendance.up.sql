-- add a unique index to user_attendances for (user_id, date)
ALTER TABLE user_attendances
ADD CONSTRAINT user_attendances_user_id_date_unique UNIQUE (user_id, date);

-- remove default
ALTER TABLE chats ALTER COLUMN type DROP DEFAULT;

ALTER TABLE chats ALTER COLUMN type TYPE chat_type USING type::chat_type;

ALTER TABLE chats ALTER COLUMN type SET DEFAULT 'private'::chat_type;

-- change on tables files the colum type from file_type to text
ALTER TABLE files ALTER COLUMN file_type TYPE text USING file_type::text;

-- drop type file_type
DROP TYPE file_type;

-- create file_type enum
CREATE TYPE file_type AS ENUM ('BLOB', 'FOLDER');

-- change on tables files the colum type from text to file_type (transform from lowercase to uppercase)
ALTER TABLE files ALTER COLUMN file_type TYPE file_type USING upper(file_type)::file_type;

-- rename type file_permission to file_permission_permission
ALTER TYPE file_permission RENAME TO file_permission_role;

-- rename table shares to file_permissions
ALTER TABLE shares RENAME TO file_permissions;

-- drop

ALTER TABLE file_permissions RENAME COLUMN permission TO role;
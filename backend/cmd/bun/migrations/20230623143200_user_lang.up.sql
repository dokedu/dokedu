CREATE TYPE user_lang AS ENUM ('en', 'de');

ALTER TABLE users ADD COLUMN language user_lang DEFAULT 'en'
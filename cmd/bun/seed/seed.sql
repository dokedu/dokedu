WITH new_id AS (
         SELECT 'u2wHWUbnWUaUUjBeNvQ4u' AS id),
     new_user AS (
         INSERT INTO users (id, role, first_name, last_name, organisation_id, password, email)
             VALUES ((SELECT id FROM new_id), 'owner', 'John', 'Doe', (SELECT id FROM new_id), crypt('password', gen_salt('bf')), 'john@dokedu.org')
             RETURNING id),
     new_org AS (
         INSERT INTO organisations (id, name, legal_name, website, phone, owner_id, allowed_domains, enabled_apps)
             VALUES ((SELECT id FROM new_id), 'Acme Corp', 'Acme Corporation', 'https://acme.dokedu.org', '555-1234',
                     (SELECT id FROM new_user), '{"dokedu.org"}', '{"drive","admin","record"}')
             RETURNING id)
UPDATE users
SET organisation_id = new_org.id
FROM new_org
WHERE users.id = (SELECT id FROM new_user);

-- English
INSERT INTO competences (id, name, organisation_id, competence_type, competence_id, grades) VALUES ('QjJvFJlceWxOzEcv3zPP5', 'English', 'u2wHWUbnWUaUUjBeNvQ4u', 'subject', NULL, '{1,2,3}');
INSERT INTO competences (id, name, organisation_id, competence_type, competence_id, grades) VALUES ('YSqI1zihrgtdFqWLI8Cv6', 'Reading', 'u2wHWUbnWUaUUjBeNvQ4u', 'group', 'QjJvFJlceWxOzEcv3zPP5', '{1,2,3}');
INSERT INTO competences (id, name, organisation_id, competence_type, competence_id, grades) VALUES ('OSENW3fO5fxs2IN8aTH9n', 'can read a simple sentence', 'u2wHWUbnWUaUUjBeNvQ4u', 'competence', 'YSqI1zihrgtdFqWLI8Cv6', '{1,2,3}');

-- Math
INSERT INTO competences (id, name, organisation_id, competence_type, competence_id, grades) VALUES ('LpqqwTvxCYzaSzjq5KfU2', 'Math', 'u2wHWUbnWUaUUjBeNvQ4u', 'subject', NULL, '{1,2,3}');
INSERT INTO competences (id, name, organisation_id, competence_type, competence_id, grades) VALUES ('GFCWc0Wv7lqCciCPI6ngg', 'Numbers', 'u2wHWUbnWUaUUjBeNvQ4u', 'group', 'LpqqwTvxCYzaSzjq5KfU2', '{1,2,3}');
INSERT INTO competences (id, name, organisation_id, competence_type, competence_id, grades) VALUES ('nm5pYXzpYe_rJjHpjnCdH', 'can count to 10', 'u2wHWUbnWUaUUjBeNvQ4u', 'competence', 'GFCWc0Wv7lqCciCPI6ngg', '{1,2,3}');

-- Students
INSERT INTO users (id, role, first_name, last_name, organisation_id) VALUES ('MI1cAxKeI_2dgSg2knkQE', 'student', 'Jane', 'Holz', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO users (id, role, first_name, last_name, organisation_id) VALUES ('VU51iPRp80DGgaZxBM3W2', 'student', 'Jack', 'Holz', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO users (id, role, first_name, last_name, organisation_id) VALUES ('K-CUgRwMANG6ObFPuY2mc', 'student', 'Jill', 'Holz', 'u2wHWUbnWUaUUjBeNvQ4u');

-- Student users
INSERT INTO user_students (id, user_id, organisation_id, left_at, grade, birthday, nationality, comments, joined_at) VALUES (DEFAULT, 'MI1cAxKeI_2dgSg2knkQE', 'u2wHWUbnWUaUUjBeNvQ4u', NULL, 1, '2015-01-01', 'German', 'Likes to play with dolls', '2020-01-01');
INSERT INTO user_students (id, user_id, organisation_id, left_at, grade, birthday, nationality, comments, joined_at) VALUES (DEFAULT, 'VU51iPRp80DGgaZxBM3W2', 'u2wHWUbnWUaUUjBeNvQ4u', NULL, 5, '2015-01-01', 'German', 'Likes to play with dolls', '2020-01-01');
INSERT INTO user_students (id, user_id, organisation_id, left_at, grade, birthday, nationality, comments, joined_at) VALUES (DEFAULT, 'K-CUgRwMANG6ObFPuY2mc', 'u2wHWUbnWUaUUjBeNvQ4u', NULL, 8, '2015-01-01', 'German', 'Likes to play with dolls', '2020-01-01');

-- Tags
INSERT INTO tags (id, name, organisation_id, color) VALUES ('gZOvnaaMmLjPzbWev4Y44', 'Free work', 'u2wHWUbnWUaUUjBeNvQ4u', 'blue');
INSERT INTO tags (id, name, organisation_id, color) VALUES ('CCdYedMfAss6aV6Vjfquy', 'Dispute', 'u2wHWUbnWUaUUjBeNvQ4u', 'red');
INSERT INTO tags (id, name, organisation_id, color) VALUES ('xEze3IohiLfAmi31L_rSD', 'Sport', 'u2wHWUbnWUaUUjBeNvQ4u', 'purple');
INSERT INTO tags (id, name, organisation_id, color) VALUES ('8AsGKYFo1Xdw3r60fPqx7', 'Parent interview', 'u2wHWUbnWUaUUjBeNvQ4u', 'orange');

-- Events
INSERT INTO events (id, title, body, starts_at, ends_at, organisation_id) VALUES ('0JuXpamtNw8v9t7NukNqw','Sailing', 'Sailing with the class', '2021-05-01 10:00:00', '2021-05-01 12:00:00', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO events (id, title, body, starts_at, ends_at, organisation_id) VALUES ('-E2x1-7uEBT7rUXPt86_H','Bathing', 'Bathing with the class', '2021-05-01 10:00:00', '2021-05-01 12:00:00', 'u2wHWUbnWUaUUjBeNvQ4u');
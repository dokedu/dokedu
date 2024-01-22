WITH new_id AS (SELECT 'u2wHWUbnWUaUUjBeNvQ4u' AS id),
     new_user AS (
         INSERT INTO users (id, role, first_name, last_name, organisation_id, password, email)
             VALUES ((SELECT id FROM new_id), 'owner', 'John', 'Doe', (SELECT id FROM new_id),
                     crypt('password', gen_salt('bf')), 'john@dokedu.org')
             RETURNING id),
     new_org AS (
         INSERT INTO organisations (id, name, legal_name, website, phone, owner_id, allowed_domains, enabled_apps, address, logo_url)
             VALUES ((SELECT id FROM new_id), 'Acme Corp', 'Acme Corporation', 'https://acme.dokedu.org', '555-1234',
                     (SELECT id FROM new_user), '{"dokedu.org"}', '{"drive","admin","record","school","chat"}', 'Hauptstraße 1, 12345 Berlin', 'https://dokedu.org/img/logo.svg')
             RETURNING id)
UPDATE users
SET organisation_id = new_org.id
FROM new_org
WHERE users.id = (SELECT id FROM new_user);

INSERT INTO users (role, first_name, last_name, organisation_id, password, email)
VALUES ('owner', 'Max', 'Never', 'u2wHWUbnWUaUUjBeNvQ4u', crypt('password', gen_salt('bf')), 'max@dokedu.org');

-- English
INSERT INTO competences (id, name, organisation_id, competence_type, competence_id, grades)
VALUES ('QjJvFJlceWxOzEcv3zPP5', 'English', 'u2wHWUbnWUaUUjBeNvQ4u', 'subject', NULL, '{1,2,3}');
INSERT INTO competences (id, name, organisation_id, competence_type, competence_id, grades)
VALUES ('YSqI1zihrgtdFqWLI8Cv6', 'Reading', 'u2wHWUbnWUaUUjBeNvQ4u', 'group', 'QjJvFJlceWxOzEcv3zPP5', '{1,2,3}');
INSERT INTO competences (id, name, organisation_id, competence_type, competence_id, grades)
VALUES ('OSENW3fO5fxs2IN8aTH9n', 'can read a simple sentence', 'u2wHWUbnWUaUUjBeNvQ4u', 'competence',
        'YSqI1zihrgtdFqWLI8Cv6', '{1,2,3}');

-- Math
INSERT INTO competences (id, name, organisation_id, competence_type, competence_id, grades)
VALUES ('LpqqwTvxCYzaSzjq5KfU2', 'Math', 'u2wHWUbnWUaUUjBeNvQ4u', 'subject', NULL, '{1,2,3}');
INSERT INTO competences (id, name, organisation_id, competence_type, competence_id, grades)
VALUES ('GFCWc0Wv7lqCciCPI6ngg', 'Numbers', 'u2wHWUbnWUaUUjBeNvQ4u', 'group', 'LpqqwTvxCYzaSzjq5KfU2', '{1,2,3}');
INSERT INTO competences (id, name, organisation_id, competence_type, competence_id, grades)
VALUES ('nm5pYXzpYe_rJjHpjnCdH', 'can count to 10', 'u2wHWUbnWUaUUjBeNvQ4u', 'competence', 'GFCWc0Wv7lqCciCPI6ngg',
        '{1,2,3}');

INSERT INTO competences (id, name, organisation_id, competence_type, competence_id, grades)
VALUES (nanoid(), 'can multiply by 2', 'u2wHWUbnWUaUUjBeNvQ4u', 'competence', 'GFCWc0Wv7lqCciCPI6ngg',
        '{1,2,3}');

-- Students
DO
$$
    DECLARE
        i           INT    := 1;
        first_names TEXT[] := ARRAY ['John', 'Emma', 'Michael', 'Olivia', 'William', 'Ava', 'James', 'Sophia', 'Benjamin', 'Isabella', 'Jacob', 'Mia', 'Ethan', 'Charlotte', 'Daniel', 'Amelia', 'Matthew', 'Harper', 'Henry', 'Evelyn'];
        last_names  TEXT[] := ARRAY ['Smith', 'Johnson', 'Brown', 'Taylor', 'Miller', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Clark', 'Lewis', 'Walker', 'Hall', 'Young', 'Allen', 'Wright', 'Scott', 'King'];
    BEGIN
        WHILE i <= 25
            LOOP
                INSERT INTO users (id, role, first_name, last_name, organisation_id)
                VALUES (nanoid(), 'student', first_names[1 + floor(random() * array_length(first_names, 1))],
                        last_names[1 + floor(random() * array_length(last_names, 1))], 'u2wHWUbnWUaUUjBeNvQ4u');
                i := i + 1;
            END LOOP;
    END
$$;

-- Dokedu AI

INSERT INTO users (id, role, first_name, last_name, organisation_id)
VALUES ('FryR3qHm3jZkfzfmwheis', 'bot', 'Dokedu AI', '', 'u2wHWUbnWUaUUjBeNvQ4u');

INSERT INTO chats (id, organisation_id)
VALUES ('kBcB3_bLMXIvmXC8xzqMo', 'u2wHWUbnWUaUUjBeNvQ4u');

INSERT INTO chat_users (chat_id, user_id, organisation_id)
VALUES ('kBcB3_bLMXIvmXC8xzqMo', 'FryR3qHm3jZkfzfmwheis', 'u2wHWUbnWUaUUjBeNvQ4u');

INSERT INTO chat_users (chat_id, user_id, organisation_id)
VALUES ('kBcB3_bLMXIvmXC8xzqMo', 'u2wHWUbnWUaUUjBeNvQ4u', 'u2wHWUbnWUaUUjBeNvQ4u');

-- Student users
DO
$$
    DECLARE
        student_row users%ROWTYPE;
        student_cursor CURSOR FOR SELECT *
                                  FROM users
                                  WHERE role = 'student';
    BEGIN
        OPEN student_cursor;
        LOOP
            FETCH student_cursor INTO student_row;
            EXIT WHEN NOT FOUND;
            -- Exit the loop when no more rows are available
            -- Your loop body code here
            INSERT INTO user_students (id, user_id, organisation_id, left_at, grade, birthday, nationality, comments,
                                       joined_at)
            VALUES (DEFAULT, student_row.id, student_row.organisation_id, NULL, 8, '2015-01-01', 'German',
                    'Likes to play with dolls', '2020-01-01');
            -- You can access the column values of the current row using 'student_row'
            RAISE NOTICE 'Current student: %', student_row.id;
        END LOOP;
        CLOSE student_cursor;
    END
$$;

-- Tags
INSERT INTO tags (id, name, organisation_id, color)
VALUES ('gZOvnaaMmLjPzbWev4Y44', 'Free work', 'u2wHWUbnWUaUUjBeNvQ4u', 'blue');
INSERT INTO tags (id, name, organisation_id, color)
VALUES ('CCdYedMfAss6aV6Vjfquy', 'Dispute', 'u2wHWUbnWUaUUjBeNvQ4u', 'red');
INSERT INTO tags (id, name, organisation_id, color)
VALUES ('xEze3IohiLfAmi31L_rSD', 'Sport', 'u2wHWUbnWUaUUjBeNvQ4u', 'purple');
INSERT INTO tags (id, name, organisation_id, color)
VALUES ('8AsGKYFo1Xdw3r60fPqx7', 'Parent interview', 'u2wHWUbnWUaUUjBeNvQ4u', 'orange');

-- Events
INSERT INTO events (id, title, body, starts_at, ends_at, organisation_id)
VALUES ('0JuXpamtNw8v9t7NukNqw', 'Sailing', 'Sailing with the class', '2021-05-01 10:00:00', '2021-05-01 12:00:00',
        'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO events (id, title, body, starts_at, ends_at, organisation_id)
VALUES ('-E2x1-7uEBT7rUXPt86_H', 'Bathing', 'Bathing with the class', '2021-05-01 10:00:00', '2021-05-01 12:00:00',
        'u2wHWUbnWUaUUjBeNvQ4u');


INSERT INTO school_years (year, organisation_id) (SELECT generate_series(2010, 2025), 'u2wHWUbnWUaUUjBeNvQ4u');

INSERT INTO subjects (name, organisation_id) VALUES ('Math', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO subjects (name, organisation_id) VALUES ('German', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO subjects (name, organisation_id) VALUES ('English', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO subjects (name, organisation_id) VALUES ('French', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO subjects (name, organisation_id) VALUES ('History', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO subjects (name, organisation_id) VALUES ('Geography', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO subjects (name, organisation_id) VALUES ('Biology', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO subjects (name, organisation_id) VALUES ('Chemistry', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO subjects (name, organisation_id) VALUES ('Physics', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO subjects (name, organisation_id) VALUES ('Music', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO subjects (name, organisation_id) VALUES ('Art', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO subjects (name, organisation_id) VALUES ('Sports', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO subjects (name, organisation_id) VALUES ('Religion', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO subjects (name, organisation_id) VALUES ('Ethics', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO subjects (name, organisation_id) VALUES ('Computer Science', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO subjects (name, organisation_id) VALUES ('Economics', 'u2wHWUbnWUaUUjBeNvQ4u');
INSERT INTO subjects (name, organisation_id) VALUES ('Politics', 'u2wHWUbnWUaUUjBeNvQ4u');

INSERT INTO user_student_grades (user_student_id, subject_id, grade, school_year_id, organisation_id) (SELECT user_students.id, subjects.id, floor(random() * 10 + 1)::int, school_years.id, 'u2wHWUbnWUaUUjBeNvQ4u' FROM user_students, subjects, school_years);
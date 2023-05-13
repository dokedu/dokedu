WITH new_id AS (
         SELECT nanoid() AS id),
     new_user AS (
         INSERT INTO users (role, first_name, last_name, organisation_id, password, email)
             VALUES ('owner', 'John', 'Doe', (SELECT id FROM new_id), crypt('password', gen_salt('bf')), 'john@dokedu.org')
             RETURNING id),
     new_org AS (
         INSERT INTO organisations (id, name, legal_name, website, phone, owner_id, allowed_domains)
             VALUES ((SELECT id FROM new_id), 'Acme Corp', 'Acme Corporation', 'https://acme.dokedu.org', '555-1234',
                     (SELECT id FROM new_user), '{"dokedu.org"}')
             RETURNING id)
UPDATE users
SET organisation_id = new_org.id
FROM new_org
WHERE users.id = (SELECT id FROM new_user);
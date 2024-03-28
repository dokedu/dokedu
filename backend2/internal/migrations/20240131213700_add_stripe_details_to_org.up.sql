SET statement_timeout = 0;

ALTER TABLE organisations ADD COLUMN stripe_customer_id TEXT NULL;
ALTER TABLE organisations ADD COLUMN stripe_subscription_id TEXT NULL;
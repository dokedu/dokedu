# Query Writing

## Naming

- Any query that does not scope by `organisation_id` must be prefixed with `GLOBAL_` to clearly indicate the security implications
- All queries should filter by default by `deleted_at IS NULL`. queries that do not must indicate so

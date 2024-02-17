// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: organisation.sql

package db

import (
	"context"
)

const gLOBAL_OrganisationList = `-- name: GLOBAL_OrganisationList :many
SELECT id, name, legal_name, website, phone, owner_id, allowed_domains, enabled_apps, created_at, deleted_at, setup_complete, address, logo_url, stripe_customer_id, stripe_subscription_id FROM organisations
`

func (q *Queries) GLOBAL_OrganisationList(ctx context.Context) ([]Organisation, error) {
	rows, err := q.db.Query(ctx, gLOBAL_OrganisationList)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Organisation
	for rows.Next() {
		var i Organisation
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.LegalName,
			&i.Website,
			&i.Phone,
			&i.OwnerID,
			&i.AllowedDomains,
			&i.EnabledApps,
			&i.CreatedAt,
			&i.DeletedAt,
			&i.SetupComplete,
			&i.Address,
			&i.LogoUrl,
			&i.StripeCustomerID,
			&i.StripeSubscriptionID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

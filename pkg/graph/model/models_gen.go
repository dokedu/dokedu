// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"example/pkg/db"
	"time"
)

type CreateUserInput struct {
	FirstName string      `json:"firstName"`
	LastName  string      `json:"lastName"`
	Email     string      `json:"email"`
	Role      db.UserRole `json:"role"`
	Birthday  *time.Time  `json:"birthday,omitempty"`
	LeftAt    *time.Time  `json:"leftAt,omitempty"`
	JoinedAt  *time.Time  `json:"joinedAt,omitempty"`
}

type InviteUserInput struct {
	Email string      `json:"email"`
	Role  db.UserRole `json:"role"`
}

type OrganisationConnection struct {
	Edges      []*db.Organisation `json:"edges,omitempty"`
	PageInfo   *PageInfo          `json:"pageInfo"`
	TotalCount int                `json:"totalCount"`
}

type PageInfo struct {
	HasNextPage     bool `json:"hasNextPage"`
	HasPreviousPage bool `json:"hasPreviousPage"`
	CurrentPage     int  `json:"currentPage"`
}

type SignInInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SignInPayload struct {
	Token string `json:"token"`
}

type SignUpInput struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UpdateUserInput struct {
	ID        string     `json:"id"`
	FirstName string     `json:"firstName"`
	LastName  string     `json:"lastName"`
	Email     *string    `json:"email,omitempty"`
	Birthday  *time.Time `json:"birthday,omitempty"`
	LeftAt    *time.Time `json:"leftAt,omitempty"`
	JoinedAt  *time.Time `json:"joinedAt,omitempty"`
}

type UserConnection struct {
	Edges      []*db.User `json:"edges,omitempty"`
	PageInfo   *PageInfo  `json:"pageInfo"`
	TotalCount int        `json:"totalCount"`
}

type UserFilterInput struct {
	Role []*db.UserRole `json:"role,omitempty"`
}

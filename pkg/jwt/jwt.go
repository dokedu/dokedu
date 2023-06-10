package jwt

import (
	"example/pkg/db"
	"github.com/golang-jwt/jwt"
)

type User struct {
	ID             string      `json:"id"`
	Role           db.UserRole `json:"role"`
	Email          string      `json:"email"`
	FirstName      string      `json:"first_name"`
	LastName       string      `json:"last_name"`
	OrganisationID string      `json:"organisation_id"`
}

type Claims struct {
	jwt.StandardClaims
	User        User     `json:"user"`
	EnabledApps []string `json:"enabled_apps"`
}

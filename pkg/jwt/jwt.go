package jwt

import (
	"example/pkg/db"
	"github.com/golang-jwt/jwt"
)

type Claims struct {
	jwt.StandardClaims
	User db.User `json:"user"`
}

func NewClaims(user db.User) Claims {
	return Claims{
		User: user,
	}
}

func (c Claims) Valid() error {
	// TODO: validate claims

	return nil
}

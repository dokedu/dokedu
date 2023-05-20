package jwt

import (
	"fmt"

	"github.com/golang-jwt/jwt"
)

type Signer struct {
	jwtSecret []byte
}

func NewSigner(secret string) Signer {
	return Signer{
		jwtSecret: []byte(secret),
	}
}

func (s Signer) Sign(claims Claims) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	sToken, err := token.SignedString(s.jwtSecret)
	if err != nil {
		return sToken, fmt.Errorf("failed to sign token: %w", err)
	}

	return sToken, nil
}

func (s Signer) ParseAndValidate(tokenString string) (Claims, error) {
	// TODO: add expiration check
	// TODO: add audience check
	// TODO: add issuer check
	// TODO: add created at check
	// TODO: add blacklisted token check

	claims := Claims{}
	token, err := jwt.ParseWithClaims(tokenString, &claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return claims, fmt.Errorf("%w: %v", ErrUnexpectedSigningMethod, token.Header["alg"])
		}

		return s.jwtSecret, nil
	})
	if err != nil {
		return claims, fmt.Errorf("failed to parse with claims: %w", err)
	}

	if !token.Valid {
		return claims, ErrInvalidToken
	}

	return claims, nil
}

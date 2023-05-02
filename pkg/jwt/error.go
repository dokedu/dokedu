package jwt

import "errors"

type JWTError error

var (
	ErrInvalidToken            JWTError = errors.New("invalid token")
	ErrInvalidClaims           JWTError = errors.New("invalid token claims")
	ErrUnexpectedSigningMethod JWTError = errors.New("unexpected signing method")
)
